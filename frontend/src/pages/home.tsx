import React from 'react';
import Navbar from '../components/Navbar';
import './HomePage.css';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    
    <div className="home-page">
      <Navbar />

      <main className="home-main fade-in">
        <h1 className="fade-in-down">Welcome to the Estimation Tool</h1>
        <p className="home-subtitle fade-in-up">
          Select a page to proceed. Get accurate cost predictions with our smart estimator.
        </p>

        <div className="home-buttons fade-in-up">
          <div className="home-card hover-scale">
            <h3>Cost Estimation</h3>
            <button onClick={() => navigate('/cost-estimation')}>
              Go to Cost Estimation
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
