import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

const FeedbackSection = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [message, setMessage] = useState("");

  const loadFeedback = () => {
    axiosInstance.get("feedback/")
      .then(res => setFeedbacks(res.data))
      .catch(err => console.error("Error loading feedback:", err));
  };

  useEffect(() => {
    loadFeedback();
  }, []);

  const submitFeedback = () => {
    axiosInstance.post("feedback/", { message })
      .then(() => {
        setMessage("");
        loadFeedback(); // refresh feedback list
      })
      .catch(err => console.error("Error submitting feedback:", err));
  };

  return (
    <section id="feedback" className="feedback">

      <h2>Customer Feedback</h2>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write feedback..."
      />

      <button onClick={submitFeedback}>Submit</button>

      <div className="feedback-list">

        {feedbacks.map((fb) => (
          <p key={fb.id}>{fb.message}</p>
        ))}

      </div>

    </section>  
  );
};

export default FeedbackSection;