import React from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Same CSS for consistency
import "./LandingPage.css"; // New optional styles for animation etc.

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       navigate("/home");
  //     }
  //   });

  //   return () => unsubscribe();
  // }, [navigate]);

  return (
    <div className="landing-page landing-page">
      <div className="animated-bg" />
      <h1 className="landing-title">DevCast</h1>
      <div className="landing-container">
        <div className="landing-left">
          <img src="../../landing.png" alt="DevCast" className="floating-img" />
        </div>
        <div className="landing-right">
          <div className="landing-form fade-in-up">
            <h2 className="description-title">Welcome to DevCast</h2>
            <p className="description-text">
              Streamlined Collaboration for Developers. Share bugs, solve issues, and grow together.
            </p>
            <button className="btn" onClick={() => navigate("/login")}>
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
