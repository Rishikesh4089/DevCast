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
          Get accurate effort predictions with our smart estimator.
        </p>

        <div className="home-buttons fade-in-up">
          <div className="home-card hover-scale">
            <h3>Effort Estimation</h3>
            <button onClick={() => navigate('/cost-estimation')}>
              Go to Effort Estimation
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
