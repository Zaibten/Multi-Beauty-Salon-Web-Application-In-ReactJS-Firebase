import React, { useState, useEffect } from "react";
import aiData from "./ai.json"; // Import JSON file

const AIRecommendation = () => {
   useEffect(() => {
      const script = document.createElement("script");
      script.src = "//code.tidio.co/gcakni5fpv5txertwqchvwgabaw1yzi9.js";
      script.async = true;
      document.body.appendChild(script);
    }, []);
    
  const questions = aiData.questions;
  const recommendations = aiData.recommendations;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [loadingPercentage, setLoadingPercentage] = useState(0);
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [recommendationText, setRecommendationText] = useState("");


  useEffect(() => {
    if (showModal) {
      let percentage = 0;
      const interval = setInterval(() => {
        percentage += 5;
        setLoadingPercentage(percentage);
        if (percentage >= 100) {
          clearInterval(interval);
          setShowModal(false);
          setShowRecommendation(true);
          setRecommendationText(
            recommendations[answers[questions[0].question]] || recommendations.default
          );
        }
      }, 200);
    }
  }, [showModal]);

  const handleAnswer = (option) => {
    setAnswers({ ...answers, [questions[currentQuestion].question]: option });
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowModal(true);
    }
  };

  return (
<div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100vh", background: "#ffe6f2", fontFamily: "Poppins, sans-serif", transition: "all 0.3s ease" }}>
  {/* Heading */}
  <h1 style={{marginTop:-150, color: "#ff1493", fontSize: "28px", fontWeight: "bold", marginBottom: "20px", animation: "fadeIn 1s ease-in-out" }}>
    GLAM THE GIRL Recommendations
  </h1>

  {!showRecommendation && !showModal ? (
    <div style={{ background: "white", padding: "30px", borderRadius: "15px", boxShadow: "0 5px 20px rgba(255, 105, 180, 0.3)", textAlign: "center", maxWidth: "1500px", animation: "fadeIn 1s ease-in-out" }}>
      <h2>{questions[currentQuestion].question}</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        {questions[currentQuestion].options.map((option, index) => (
          <button
            key={index}
            style={{ background: "#ff69b4", color: "white", border: "none", padding: "12px", borderRadius: "8px", cursor: "pointer", fontSize: "16px", transition: "transform 0.2s, background 0.3s", animation: "pop 0.3s ease-in-out" }}
            onMouseEnter={(e) => (e.target.style.background = "#ff1493")}
            onMouseLeave={(e) => (e.target.style.background = "#ff69b4")}
            onClick={() => handleAnswer(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  ) : showModal ? (
    <div style={{ background: "white", padding: "30px", borderRadius: "15px", boxShadow: "0 5px 20px rgba(255, 105, 180, 0.3)", textAlign: "center", animation: "fadeIn 1s ease-in-out" }}>
      <h2>🤖 AI Processing...</h2>
      <p style={{ fontSize: "20px", fontWeight: "bold", color: "#ff1493" }}>Loading {loadingPercentage}%</p>
    </div>
  ) : (
    <div style={{ background: "white", padding: "30px", borderRadius: "15px", boxShadow: "0 5px 20px rgba(255, 105, 180, 0.3)", textAlign: "center", animation: "fadeIn 1s ease-in-out" }}>
      <h2>✨ AI Recommendation</h2>
      <p style={{ background: "#ffebf2", padding: "15px", borderRadius: "10px", fontSize: "18px", animation: "pop 0.3s ease-in-out" }}>{recommendationText}</p>
      <button style={{ background: "#ff1493", color: "white", border: "none", padding: "12px", borderRadius: "8px", fontSize: "16px", cursor: "pointer", animation: "pop 0.3s ease-in-out" }} onClick={() => window.location.reload()}>🔄 Restart</button>
    </div>
  )}

  <style>
    {`
      @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.9); }
        to { opacity: 1; transform: scale(1); }
      }

      @keyframes pop {
        0% { transform: scale(0.9); }
        100% { transform: scale(1); }
      }
    `}
  </style>
</div>

  );
};

export default AIRecommendation;