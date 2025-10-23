import { useState, useEffect } from "react";

export default function FunFact() {
  const [fact, setFact] = useState("");
  const [loading, setLoading] = useState(true);
  const [fade, setFade] = useState(false);

  const fetchFact = async () => {
    setLoading(true);
    setFade(false);
    try {
      const res = await fetch("https://uselessfacts.jsph.pl/random.json?language=en");
      const data = await res.json();
      setFact(data.text);
      setFade(true);
    } catch (err) {
      setFact("Oops! Couldn't load a fun fact right now. Try again! 😅");
      setFade(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFact();
  }, []);

  return (
    <div style={{
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "2rem",
      borderRadius: "20px",
      textAlign: "center",
      margin: "2rem auto",
      maxWidth: "500px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
      color: "white",
      position: "relative",
      overflow: "hidden",
      animation: "bounceIn 0.6s ease-out"
    }}>
      <style>
        {`
          @keyframes bounceIn {
            0% { transform: scale(0.3); opacity: 0; }
            50% { transform: scale(1.05); }
            70% { transform: scale(0.9); }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .fact-text {
            animation: fadeIn 0.5s ease-in;
          }
          .loading-spinner {
            border: 4px solid rgba(255,255,255,0.3);
            border-top: 4px solid white;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 20px auto;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .fun-button {
            transition: all 0.3s ease;
            background: "linear-gradient(45deg, #ff6b6b, #feca57)";
          }
          .fun-button:hover {
            transform: scale(1.1);
            box-shadow: 0 4px 20px rgba(255,255,255,0.3);
          }
        `}
      </style>
      <div style={{
        position: "absolute",
        top: "-50px",
        left: "-50px",
        width: "100px",
        height: "100px",
        background: "rgba(255,255,255,0.1)",
        borderRadius: "50%",
        animation: "float 3s ease-in-out infinite"
      }}></div>
      <div style={{
        position: "absolute",
        bottom: "-30px",
        right: "-30px",
        width: "60px",
        height: "60px",
        background: "rgba(255,255,255,0.1)",
        borderRadius: "50%",
        animation: "float 4s ease-in-out infinite reverse"
      }}></div>
      <h3 style={{
        fontSize: "2rem",
        marginBottom: "1rem",
        textShadow: "2px 2px 4px rgba(0,0,0,0.3)"
      }}>
        🎉 Fun Fact of the Day! 🎉
      </h3>
      {loading ? (
        <div className="loading-spinner"></div>
      ) : (
        <p className="fact-text" style={{
          fontSize: "1.2rem",
          lineHeight: "1.6",
          margin: "1rem 0",
          opacity: fade ? 1 : 0,
          transition: "opacity 0.5s ease"
        }}>
          {fact}
        </p>
      )}
      <button
        onClick={fetchFact}
        disabled={loading}
        className="fun-button"
        style={{
          marginTop: "1rem",
          background: "linear-gradient(45deg, #ff6b6b, #feca57)",
          color: "white",
          border: "none",
          borderRadius: "25px",
          padding: "12px 24px",
          fontSize: "1rem",
          fontWeight: "bold",
          cursor: loading ? "not-allowed" : "pointer",
          boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
        }}
      >
        {loading ? "Loading..." : "Get Another Fun Fact! 🚀"}
      </button>
    </div>
  );
}

