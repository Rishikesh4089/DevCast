import React, { useState } from 'react';
import axios from 'axios';
import { Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './EffortEstimationForm.css'; // Custom CSS matching CostEstimationForm

interface InputData {
  size: number;
  complexity: number;
  team_experience: number;
  reliability: number;
  time: number;
  team_size: number;
  infrastructure_cost: number;
}

const EffortEstimationForm: React.FC = () => {
  const navigate = useNavigate();

  const [inputData, setInputData] = useState<InputData>({
    size: 0,
    complexity: 0,
    team_experience: 0,
    reliability: 0,
    time: 0,
    team_size: 0,
    infrastructure_cost: 0,
  });

  const [result, setResult] = useState<{ cocomo_estimate: number, refined_estimate: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputData((prev) => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post('http://127.0.0.1:5000/estimate', inputData);
      if (!response.data) throw new Error("Invalid response");
      setResult(response.data);
    } catch (err) {
      setError("Failed to estimate effort. Please check your inputs or try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="effort-page">
      <nav className="effort-nav">
        <div className="effort-nav-brand">
          <Home className="home-icon" onClick={() => navigate('/')} />
          <span>Effort Estimator</span>
        </div>
        <button className="back-button" onClick={() => navigate('/')}>← Back</button>
      </nav>

      <main className="effort-main">
        <div className="effort-container">
          <form onSubmit={handleSubmit} className="effort-form">
            <h1>Effort Estimation Inputs</h1>
            {Object.entries(inputData).map(([key, value]) => (
              <div key={key} className="form-group">
                <label>{key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}</label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  name={key}
                  placeholder="Enter value"
                  value={value || ''}
                  onChange={handleChange}
                />
              </div>
            ))}
            <button type="submit" disabled={loading}>
              {loading ? 'Estimating...' : 'Estimate Effort'}
            </button>
          </form>

          <div className="effort-result">
            {error && <div className="error">{error}</div>}
            {result && !error && (
              <div>
                <h2>Estimation Result</h2>
                <p>
                  COCOMO Estimate: <span className="prediction">{result.cocomo_estimate.toFixed(2)}</span>
                </p>
                <p>
                  Refined Estimate (ML Model): <span className="prediction">{result.refined_estimate.toFixed(2)}</span>
                </p>
              </div>
            )}
            {!result && !error && !loading && (
              <div className="placeholder">Estimation results will appear here after submission.</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default EffortEstimationForm;
