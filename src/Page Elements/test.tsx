import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Box, Card, CardActionArea, Typography } from "@mui/material";

type Post = { id: string; title: string; image: string; excerpt?: string };

export default function PostCarousel({ posts }: { posts: Post[] }) {
  const autoplay = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      align: "center",
      skipSnaps: false,
      speed: 10,
    },
    [autoplay.current]
  );

  return (
    <Box sx={{ width: "100%", maxWidth: 960, mx: "auto", mt: 4 }}>
      <Box ref={emblaRef} sx={{ overflow: "hidden", cursor: "grab" }}>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            p: 1,
            "&:active": { cursor: "grabbing" },
          }}
        >
          {posts.map((p) => (
            <Box key={p.id} sx={{ flex: "0 0 100%" }}>
              <Card sx={{ borderRadius: 2, overflow: "hidden" }} elevation={3}>
                <CardActionArea>
                  <Box
                    sx={{
                      height: 260,
                      backgroundImage: `url(${p.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      position: "relative",
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        left: 16,
                        bottom: 16,
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 1.5,
                        bgcolor: "rgba(0,0,0,0.55)",
                      }}
                    >
                      <Typography variant="h6" color="#fff">
                        {p.title}
                      </Typography>
                    </Box>
                  </Box>

                  {p.excerpt && (
                    <Box sx={{ p: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        {p.excerpt}
                      </Typography>
                    </Box>
                  )}
                </CardActionArea>
              </Card>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
