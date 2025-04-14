import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

  const [modelChoice, setModelChoice] = useState<'ensemble' | 'svm'>('ensemble');
  const [prediction, setPrediction] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const parsedValue = parseFloat(value);
    setInputs((prev) => ({
      ...prev,
      [name]: isNaN(parsedValue) ? 0 : parsedValue,
    }));
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as 'ensemble' | 'svm';
    setModelChoice(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPrediction(null);

    const isAnyFieldEmpty = Object.values(inputs).some(
      (value) => value === null || value === undefined || value === 0
    );

    if (isAnyFieldEmpty) {
      setError('Please fill out all fields before submitting the form.');
      return;
    }

    //change was made here
    const API_BASE_URL = process.env.REACT_APP_API_URL;

    setLoading(true);
    try {
      const response = await axios.post('${API_BASE_URL}/estimate', {
        ...inputs,
        model_choice: modelChoice,
      });

      if (!response.data.estimated_effort) {
        throw new Error('Invalid API response format');
      }

      setPrediction(response.data.estimated_effort);
    } catch (err) {
      setError('Failed to get estimation. Please check inputs or try again.');
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

            {/* Model Selection Dropdown */}
            <div className="form-group">
              <label htmlFor="modelChoice">Select Model</label>
              <select
                id="modelChoice"
                name="modelChoice"
                value={modelChoice}
                onChange={handleModelChange}
                required
              >
                <option value="ensemble">Ensemble (Recommended)</option>
                <option value="svm">SVM</option>
              </select>
            </div>

            {Object.entries(inputs).map(([key, value]) => (
              <div key={key} className="form-group">
                <label htmlFor={key}>
                  {key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  name={key}
                  id={key}
                  value={value}
                  onChange={handleChange}
                  placeholder="Enter value"
                  required
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
                  Estimated Effort (Person-Hours):{' '}
                  <span className="prediction">{prediction.toFixed(2)}</span>
                </p>
              </div>
            )}
            {!prediction && !error && !loading && (
              <div className="placeholder">
                Your estimated effort will appear here after submission.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CostEstimationForm;
