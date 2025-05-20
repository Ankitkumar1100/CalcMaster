import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Result } from '../ui/Result';

interface StatisticsResults {
  mean: number;
  median: number;
  mode: string;
  range: number;
  standardDeviation: number;
  variance: number;
  sum: number;
  count: number;
}

const StatisticsCalculator: React.FC = () => {
  const [dataInput, setDataInput] = useState<string>('');
  const [results, setResults] = useState<StatisticsResults | null>(null);
  const [error, setError] = useState<string>('');

  const parseData = (input: string) => {
    // Split by commas, spaces, or new lines
    const values = input
      .split(/[,\s\n]+/)
      .map(val => val.trim())
      .filter(val => val !== '')
      .map(val => Number(val));
    
    if (values.some(val => isNaN(val))) {
      setError('Please enter valid numeric values separated by commas, spaces, or new lines');
      return null;
    }
    
    return values;
  };

  const calculateMean = (data: number[]) => {
    return data.reduce((sum, val) => sum + val, 0) / data.length;
  };

  const calculateMedian = (data: number[]) => {
    const sorted = [...data].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    
    if (sorted.length % 2 === 0) {
      return (sorted[middle - 1] + sorted[middle]) / 2;
    }
    
    return sorted[middle];
  };

  const calculateMode = (data: number[]) => {
    const frequency: { [key: number]: number } = {};
    data.forEach(val => {
      frequency[val] = (frequency[val] || 0) + 1;
    });
    
    let maxFreq = 0;
    let modes: number[] = [];
    
    Object.entries(frequency).forEach(([val, freq]) => {
      if (freq > maxFreq) {
        maxFreq = freq;
        modes = [Number(val)];
      } else if (freq === maxFreq) {
        modes.push(Number(val));
      }
    });
    
    if (modes.length === Object.keys(frequency).length) {
      return 'No mode';
    }
    
    return modes.join(', ');
  };

  const calculateRange = (data: number[]) => {
    return Math.max(...data) - Math.min(...data);
  };

  const calculateVariance = (data: number[], mean: number) => {
    return data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
  };

  const calculateStandardDeviation = (variance: number) => {
    return Math.sqrt(variance);
  };

  const calculateStatistics = () => {
    const data = parseData(dataInput);
    
    if (!data || data.length === 0) {
      setError('Please enter at least one valid number');
      return;
    }
    
    setError('');
    
    const mean = calculateMean(data);
    const variance = calculateVariance(data, mean);
    
    setResults({
      mean,
      median: calculateMedian(data),
      mode: calculateMode(data),
      range: calculateRange(data),
      variance,
      standardDeviation: calculateStandardDeviation(variance),
      sum: data.reduce((sum, val) => sum + val, 0),
      count: data.length
    });
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Statistics Calculator</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Enter data (separated by commas, spaces, or new lines)
        </label>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          rows={5}
          value={dataInput}
          onChange={(e) => setDataInput(e.target.value)}
          placeholder="Example: 5, 10, 15, 20, 25"
        />
        {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
      </div>
      
      <Button onClick={calculateStatistics} className="mb-6">
        Calculate Statistics
      </Button>
      
      {results && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Result label="Mean" value={results.mean.toFixed(2)} />
          <Result label="Median" value={results.median.toFixed(2)} />
          <Result label="Mode" value={results.mode} />
          <Result label="Range" value={results.range.toFixed(2)} />
          <Result label="Standard Deviation" value={results.standardDeviation.toFixed(2)} />
          <Result label="Variance" value={results.variance.toFixed(2)} />
          <Result label="Sum" value={results.sum.toFixed(2)} />
          <Result label="Count" value={results.count.toString()} />
        </div>
      )}
    </Card>
  );
};

export default StatisticsCalculator;