import React, { useState } from "react";
import "../static/main.css";
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import PostCarousel from "./test.tsx";
import mainimage1 from '../static/c1.png';
import mainimage2 from '../static/c2.png';
import mainimage3 from '../static/c3.png';
const posts = [
  { id: "1", title: "Station by Kotuwa", image: mainimage1, excerpt: "" },
  { id: "2", title: "KFC", image: mainimage2, excerpt: "" },
  { id: "3", title: "Fine Food", image: mainimage3, excerpt: "" },

];

function EvaluatingPopup({ visible }: { visible: boolean }) {
  if (!visible) return null;

  return (
    <div className="loading">
        <div>
            <Box sx={{ display: 'flex' }}>
            <CircularProgress />
        </Box>
        </div>
        <div>
            <p>Evaluating....</p>
        </div>
    </div>
  );
}

function Mainleft() {
    return (
        <div className="main-left">
            <div className="text">
                <h2 className="text" style={{fontSize:"25px"}}>Welcome to ReviewSense</h2>
                <p className="main-left-text">
                    Ever wondered how genuine a Google review really is?
                </p>
                <p className="main-left-text">
                    Our system uses AI and Machine Learning Model to analyze customer reviews and determine:
                </p>

                <p className="main-left-text">How <strong>satisfied</strong> the reviewer is</p>
                <p className="main-left-text">Whether it's <strong>relevant</strong> as a review</p>
                <p className="main-left-text">Whether it might be <strong>spam</strong> or <strong>advertisement</strong></p>

                <PostCarousel posts = {posts}/>

                <p className="pulsetext">
                    Type or paste a review on the right and click <strong>Evaluate</strong> to begin.
                </p>

                <footer className="footnote">
                    This is a Project for TikTok TechJam 2025 Question 1:
                    Filtering the Noise: ML for Trustworthy Location Reviews
                 </footer>
            </div>
            
        </div>
    )
}


function Mainright() {
    type AnswerType = {
        satisfied: number;
        relevant: number;
        spam: number;
    } | null;

    const sampleanswer = {
        satisfied: 0.98,
        relevant: 0.98,
        spam: 0.01}
    const [answer, setAnswer] = useState<AnswerType>(sampleanswer);
    const [resulthidden, setresulthidden] = useState(true);
    const [review, setReview] = useState("");
    const [staticReview, SetStaticReview] = useState("I love the place!");
    const [loading, setLoading] = useState(false); // NEW
    

    const handleinput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setReview(e.target.value);
    };

    const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
        height: 26,
        width: 450,
        borderRadius: 15,
        [`&.${linearProgressClasses.colorPrimary}`]: {
            backgroundColor: theme.palette.grey[200],
            ...theme.applyStyles('dark', {
            backgroundColor: theme.palette.grey[800],
            }),
        },
        [`& .${linearProgressClasses.bar}`]: {
            borderRadius: 15,
            backgroundColor: '#1a90ff',
            ...theme.applyStyles('dark', {
            backgroundColor: '#308fe8',
            }),
        },
        }));

    const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true); // NEW
        try { //"https://google-review-filter-1.onrender.com/predict"
            const res = await fetch("https://google-review-filter-1.onrender.com/predict", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ review: review }),
            });

            const data = await res.json();
            console.log(data)
            setAnswer(data);
            setresulthidden(false);
        } catch (error) {
            setAnswer(null);
            setresulthidden(false);
        } finally {
            setLoading(false); // NEW
        }
    };
    
    interface CraftReviewProps {
        review: string;
    }
    const CraftReview = ({review} : CraftReviewProps) =>
        review.length > 100 ? review.slice(0, 100) + "..." : review;

    return (
        <div className="main-right">
            <EvaluatingPopup visible={loading} />
            <div className="bar-row" style={{paddingTop: "15px" , paddingBottom: "15px", marginBottom: "-10px",backgroundColor:"#9c8465e0" }}>
                <div>
                    <p className="your-review">{resulthidden? "Sample review:" : "Your review:"}</p>
                </div>
                <div>
                    <p className="review-content"><CraftReview review={staticReview} /> </p>
                </div>
            </div>
            <div className="evaluation">
                <div className="bar-row">
                    <div className="progress-bar-div">
                        <span className="label" style={{width:"150px"}}>Satisfied:</span>

                            <BorderLinearProgress
                                className="progress-bar"
                                variant="determinate"
                                value={answer ? answer.satisfied * 100 : 0} 
                            />

                        <span className="label" style={{width:"70px"}}>{answer ? Math.round(answer.satisfied * 100) + "%" : 0}</span>
                    </div>
                    <div>
                        <p>
                            {answer && answer.satisfied !== undefined
                                ? (answer.satisfied >= 0.5
                                    ? "The review is satisfied with the restaurant. 😋"
                                    : "The review is not satisfied with the food. ☹️")
                                : ""}
                        </p>
                    </div>
                </div>

                <div className="bar-row">
                    <div className="progress-bar-div">
                        <span className="label" style={{width:"150px"}}>Relevant:</span>

                        <BorderLinearProgress 
                        variant="determinate"
                        value={answer ? answer.relevant * 100 : 0}
                        />

                        <span className="label" style={{width:"70px"}}>{answer ? Math.round(answer.relevant * 100) + "%" : 0}</span>
                    </div>
                    <div>
                        <p>
                            {answer && answer.satisfied !== undefined
                                ? (answer.satisfied >= 0.5
                                    ? "The review is relevant. 👍"
                                    : "The review is not relevant! 👎")
                                : ""}
                        </p>
                    </div>
                </div>

                <div className="bar-row">
                    <div className="progress-bar-div">
                        <span className="label" style={{width:"150px"}}>Spam:</span>

                        <BorderLinearProgress 
                        variant="determinate"
                        value={answer ? answer.spam * 100 : 0}
                        />

                        <span className="label" style={{width:"70px"}}>{answer ? Math.round(answer.spam * 100) + "%" : 0}</span>
                    </div>
                    <div>
                        <p>
                            {answer && answer.spam !== undefined
                                ? (answer.spam >= 0.5
                                    ? "SPAM DETECTED!!!!!!!!!!!!! ☢️"
                                    : "Not spam. 😊")
                                : ""}
                        </p>
                    </div>
                </div>
            </div>
        
            <form onSubmit={sendMessage}>
                <input
                    type="text"
                    placeholder="Enter a review"
                    value={review}
                    onChange={handleinput}
                />
                <button type="submit" disabled={loading} onClick={() => SetStaticReview(review)}>Evaluate</button>
            </form>
        </div>
    );
}

function Welcome () {
    return (
        <>
            <main>
                <Mainleft />
                <Mainright />
            </main> 
        </>
        
        
    )
}
export default function Main() {
    return (
        <Welcome />
        
    )
}