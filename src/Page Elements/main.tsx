import React, { useState } from "react";
import "../static/main.css";
import Paper from '@mui/material/Paper';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

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
                <h2 className="text-">Welcome to ReviewSense</h2>
                <p className="text-">
                    Ever wondered how genuine a Google review really is?
                </p>
                <p className="text">
                    Our system uses AI and Machine Learning Model to analyze customer reviews and determine:
                </p>

                <p>How <strong>satisfied</strong> the reviewer is</p>
                <p>Whether it's <strong>relevant</strong> as a review</p>
                <p>Whether it might be <strong>spam</strong> or <strong>advertisement</strong></p>

                <p className="mt-4 text-base">
                    Type or paste a review on the right and click <strong>Evaluate</strong> to begin.
                </p>
            </div>

            <div className="footnote">
                This is a Project for TikTok TechJam 2025 Question 1:
                Filtering the Noise: ML for Trustworthy Location Reviews
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
    const [answer, setAnswer] = useState<AnswerType>();
    const [resulthidden, setresulthidden] = useState(true);
    const [review, setReview] = useState("");
    const [loading, setLoading] = useState(false); // NEW
    

    const handleinput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setReview(e.target.value);
    };

    const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
        height: 20,
        width: 400,
        borderRadius: 10,
        [`&.${linearProgressClasses.colorPrimary}`]: {
            backgroundColor: theme.palette.grey[200],
            ...theme.applyStyles('dark', {
            backgroundColor: theme.palette.grey[800],
            }),
        },
        [`& .${linearProgressClasses.bar}`]: {
            borderRadius: 10,
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

    return (
        <div className="main-right">
            <EvaluatingPopup visible={loading} />
            
            <div className="evaluation">
                <div className="bar-row">
                    <div className="progress-bar-div">
                        <span className="label">Satisfied:</span>
                        <Box sx={{ width: '70%'}}>
                            <BorderLinearProgress
                                className="progress-bar"
                                variant="determinate"
                                value={answer ? answer.satisfied * 100 : 0} 
                            />
                        </Box>
                        <span className="label">{answer ? Math.round(answer.satisfied * 100) + "%" : 0}</span>
                    </div>
                </div>

                <div className="bar-row">
                    <div className="progress-bar-div">
                        <span className="label">Relevant:</span>
                        <Box sx={{ width: '70%'}}>
                            <BorderLinearProgress 
                            variant="determinate"
                            value={answer ? answer.relevant * 100 : 0}
                            />
                        </Box>
                        <span className="label">{answer ? Math.round(answer.relevant * 100) + "%" : 0}</span>
                    </div>
                </div>

                <div className="bar-row">
                    <div className="progress-bar-div">
                        <span className="label">Spam:</span>
                        <Box sx={{ width: '70%'}}>
                            <BorderLinearProgress 
                            variant="determinate"
                            value={answer ? answer.spam * 100 : 0}
                            />
                        </Box>
                        <span className="label">{answer ? Math.round(answer.spam * 100) + "%" : 0}</span>
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
                <button type="submit" disabled={loading}>Evaluate</button>
            </form>
        </div>
    );
}


export default function Main() {
    return (
        <main>
            <Mainleft />
            <Mainright />
        </main>
        
    )
}