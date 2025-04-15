import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import Select from 'react-select';
import { InputData } from '../types/InputData';
import './EffortImpactAnalysisCard.css';

interface EffortImpactAnalysisCardProps {
  baseInputs: InputData;
  modelChoice: 'ensemble' | 'svm';
}

const parameterRanges: Record<string, number[]> = {
  'Size of organization': Array.from({ length: 10 }, (_, i) => 10 + i * 100),
  'Team size': Array.from({ length: 10 }, (_, i) => 1 + i * 5),
  'Daily working hours': Array.from({ length: 9 }, (_, i) => 4 + i),
  'Object points': Array.from({ length: 10 }, (_, i) => 50 + i * 100),
  '# Multiple programing languages': Array.from({ length: 10 }, (_, i) => 1 + i),
  'Programmers experience in programming language': Array.from({ length: 11 }, (_, i) => i),
  'Project manager experience': Array.from({ length: 11 }, (_, i) => i),
  'Requirment stability': Array.from({ length: 11 }, (_, i) => i),
};

const parameterOptions = Object.keys(parameterRanges).map(param => ({
  value: param,
  label: param,
}));

const EffortImpactAnalysisCard: React.FC<EffortImpactAnalysisCardProps> = ({
  baseInputs,
  modelChoice,
}) => {
  const [selectedParam, setSelectedParam] = useState(parameterOptions[0]);
  const [graphData, setGraphData] = useState<{ value: number; effort: number }[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchGraphData = async () => {
    if (!selectedParam) return;
    const param = selectedParam.value;
    const values = parameterRanges[param];
    const tempData: { value: number; effort: number }[] = [];

    setLoading(true);

    for (let val of values) {
      const inputCopy = { ...baseInputs, [param]: val };

      try {
        const res = await axios.post('http://127.0.0.1:5001/estimate', {
          ...inputCopy,
          model_choice: modelChoice,
        });

        if (res.data.estimated_effort) {
          tempData.push({ value: val, effort: res.data.estimated_effort });
        }
      } catch (err) {
        console.error(`Failed for ${param} = ${val}`);
      }
    }

    setGraphData(tempData);
    setLoading(false);
  };

  useEffect(() => {
    fetchGraphData();
  }, [selectedParam, modelChoice]);

  return (
    <div className="effort-analysis-card">
      <h2>📊 Effort Impact Analysis</h2>

      <div className="dropdowns">
        <div className="dropdown-wrapper">
          <label>Parameter:</label>
          <Select
            options={parameterOptions}
            value={selectedParam}
            onChange={(option) => option && setSelectedParam(option)}
            className="select"
          />
        </div>
      </div>

      {loading ? (
        <p>Loading graph...</p>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={graphData} margin={{ top: 10, right: 20, bottom: 40, left: 50 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="value"
              label={{ value: selectedParam.label, position: 'insideBottom', dy: 40, offset: -5 }}
            />
            <YAxis
              label={{
                value: 'Estimated Effort (Person-Hours)',
                angle: -90,
                position: 'insideLeft',
                dx: -50,
                offset: 20,
                dy: 130, // adjust as needed to push it down
              }}
            />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="effort" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default EffortImpactAnalysisCard;
