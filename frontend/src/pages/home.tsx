import React from 'react';
import './HomePage.css';

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <nav className="cost-nav">
        <div className="cost-nav-brand">
          <span>Estimation Tool</span>
        </div>
        <ul className="home-links">
          <li><a href="/cost-estimation">Cost</a></li>
          <li><a href="/effort-estimation">Effort</a></li>
        </ul>
      </nav>

      <main className="home-main fade-in">
        <h1 className="fade-in-down">Welcome to the Estimation Tool</h1>
        <p className="home-subtitle fade-in-up">
          Select a page to proceed. Get accurate cost and effort predictions with our smart estimators.
        </p>

        <div className="home-buttons fade-in-up">
          <div className="home-card hover-scale">
            <h3>Cost Estimation</h3>
            <button onClick={() => window.location.href = '/cost-estimation'}>
              Go to Cost Estimation
            </button>
          </div>

          <div className="home-card hover-scale">
            <h3>Effort Estimation</h3>
            <button onClick={() => window.location.href = '/effort-estimation'}>
              Go to Effort Estimation
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
