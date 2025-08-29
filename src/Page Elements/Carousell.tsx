import React, { useLayoutEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

type CardData = { id: number; title: string; url: string };

const cards: CardData[] = [
  { url: "/imgs/abstract/1.jpg", title: "Title 1", id: 1 },
  { url: "/imgs/abstract/2.jpg", title: "Title 2", id: 2 },
  { url: "/imgs/abstract/3.jpg", title: "Title 3", id: 3 },
  { url: "/imgs/abstract/4.jpg", title: "Title 4", id: 4 },
  { url: "/imgs/abstract/5.jpg", title: "Title 5", id: 5 },
  { url: "/imgs/abstract/6.jpg", title: "Title 6", id: 6 },
  { url: "/imgs/abstract/7.jpg", title: "Title 7", id: 7 },
];

const Example: React.FC = () => {
  return (
    <div className="bg-neutral-800">
      <div className="flex h-48 items-center justify-center">
        <span className="font-semibold uppercase text-neutral-400">Scroll down</span>
      </div>

      <HorizontalScrollCarousel cards={cards} />

      <div className="flex h-48 items-center justify-center">
        <span className="font-semibold uppercase text-neutral-400">Scroll up</span>
      </div>
    </div>
  );
};

const HorizontalScrollCarousel: React.FC<{ cards: CardData[] }> = ({ cards }) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  // Use the section as the scroll container to read vertical progress
  const { scrollYProgress } = useScroll({ target: sectionRef });

  // Measure how far we can translate the track (in px)
  const [maxX, setMaxX] = useState(0);
  useLayoutEffect(() => {
    const measure = () => {
      if (!trackRef.current) return;
      const track = trackRef.current;
      const viewport = window.innerWidth;
      const full = track.scrollWidth;
      const max = Math.max(0, full - viewport);
      setMaxX(-max); // negative because we move left
    };
    measure();
    // Recompute on resize (cards may be responsive)
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("resize", measure);
      ro.disconnect();
    };
  }, []);

  // Map vertical progress [0..1] → horizontal px [0..maxX]
  const x = useTransform(scrollYProgress, [0, 1], [0, maxX]);

  return (
    <section ref={sectionRef} className="relative h-[300vh] bg-neutral-900">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Edge gradients for depth */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-neutral-900/90 to-transparent z-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-neutral-900/90 to-transparent z-20" />

        <div className="flex h-full items-center">
          <motion.div
            ref={trackRef}
            style={{ x }}
            className="flex gap-6 px-8"
            aria-label="Horizontal image carousel scrolled by page scroll"
          >
            {cards.map((c) => (
              <Card key={c.id} card={c} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Card: React.FC<{ card: CardData }> = ({ card }) => {
  return (
    <article
      className="group relative w-[80vw] max-w-[520px] md:w-[460px] aspect-[1/1.05] overflow-hidden rounded-2xl bg-neutral-800 ring-1 ring-white/5 shadow-xl"
      tabIndex={0}
      aria-label={card.title}
    >
      {/* Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={card.url}
          alt={card.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 group-focus:scale-110"
        />
        Hello!
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
      </div>

      {/* Title */}
      <div className="absolute inset-0 z-10 grid place-content-end p-6">
        <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white drop-shadow">
          {card.title}
        </h3>
      </div>

      {/* Focus ring */}
      <span className="pointer-events-none absolute inset-0 rounded-2xl ring-0 ring-white/40 transition-all group-focus:ring-4" />
    </article>
  );
};

export default Example;
