import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import axios from 'axios';
import { Home, ArrowLeft } from 'lucide-react';
import './CostEstimationForm.css';

interface InputData {
  ['Size of organization']: number;
  ['Team size']: number;
  ['Daily working hours']: number;
  ['Object points']: number;
  ['# Multiple programing languages']: number;
  ['Programmers experience in programming language']: number;
  ['Project manager experience']: number;
  ['Requirment stability']: number;
}

const CostEstimationForm: React.FC = () => {
  const [inputs, setInputs] = useState<InputData>({
    ['Size of organization']: 0,
    ['Team size']: 0,
    ['Daily working hours']: 0,
    ['Object points']: 0,
    ['# Multiple programing languages']: 0,
    ['Programmers experience in programming language']: 0,
    ['Project manager experience']: 0,
    ['Requirment stability']: 0,
  });

  const [prediction, setPrediction] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate(); // React Router navigation

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPrediction(null);
  
    // Check if any input is left empty
    const isAnyFieldEmpty = Object.values(inputs).some(value => value === null || value === undefined || value === 0);
    if (isAnyFieldEmpty) {
      setError("Please fill out all fields before submitting the form.");
      return;
    }
  
    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:5001/estimate', inputs);
      if (!response.data.estimated_effort) {
        throw new Error("Invalid API response format");
      }
      setPrediction(response.data.estimated_effort);
    } catch (err) {
      setError("Failed to get estimation. Please check inputs or try again.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="cost-page">
      <nav className="cost-nav">
        <div className="cost-nav-left">
          <ArrowLeft className="nav-icon back-icon" onClick={() => navigate(-1)} />
        </div>
        <div className="cost-nav-brand" onClick={() => navigate('/')}>
          <Home className="home-icon" />
          <span>Effort Estimator</span>
        </div>
      </nav>

      <main className="cost-main">
        <div className="cost-container">
          <form onSubmit={handleSubmit} className="cost-form">
            <h1>Input Project Parameters</h1>
            {Object.keys(inputs).map((key) => (
              <div key={key} className="form-group">
                <label>{key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}</label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  name={key}
                  placeholder="Enter value"
                  value={inputs[key as keyof InputData] || ''}
                  onChange={handleChange}
                />
              </div>
            ))}
            <button type="submit" disabled={loading}>
              {loading ? 'Estimating...' : 'Estimate Effort'}
            </button>
          </form>

          <div className="cost-result">
            {error && <div className="error">{error}</div>}
            {prediction !== null && !error && (
              <div>
                <h2>Estimation Result</h2>
                <p>
                  Estimated Effort (Person-Hours): <span className="prediction">{prediction.toFixed(2)}</span>
                </p>
              </div>
            )}
            {!prediction && !error && !loading && (
              <div className="placeholder">Your estimated effort will appear here after submission.</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CostEstimationForm;
