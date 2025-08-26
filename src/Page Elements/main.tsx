import React, { useState } from "react";
import "./chat.css";

export default function Main() {
    const [answer, setAnswer] = useState("");
    const [resulthidden, setresulthidden] = useState(true);
    const [review, setReview] = useState("");
    const [loading, setLoading] = useState(false); // NEW

    const handleinput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setReview(e.target.value);
    };

    const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true); // NEW
        try {
            const res = await fetch("http://127.0.0.1:5000/predict", {
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
            setAnswer("Something went wrong. Please try again.");
            setresulthidden(false);
        } finally {
            setLoading(false); // NEW
        }
    };

    return (
        <main>
            {loading && <p className="loading">ChatGPT is typing...</p>}
            {!resulthidden && !loading && (
                <div className="chat-response">
                        {answer.relevant == 1? "Relevant" : "Irrelevant"}<br />
                        {answer.satisfied == 1? "Satisfied" : "Not Satisfied"}<br />
                        {answer.spam == 1? "Spam" : "Not Spam"}<br />
                </div>
                

                
            )}
            <form onSubmit={sendMessage}>
                <input
                    type="text"
                    placeholder="ASK chatgpt"
                    value={review}
                    onChange={handleinput}
                />
                <button type="submit" disabled={loading}>Submit</button>
            </form>
        </main>
    );
}