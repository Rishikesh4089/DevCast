
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BackgroundAnimation from './animations/background'
import './App.css'
import HomePage from './pages/home'
import CostEstimationForm from './pages/CostEstimationForm';
import EffortEstimationForm from './pages/EffortEstimationForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cost-estimation" element={<CostEstimationForm />} />
        <Route path="/effort-estimation" element={<EffortEstimationForm />} />
      </Routes>
    </Router>
  );
};


export default App
