import React, { useState } from 'react';
import { Tabs } from './components/ui/Tabs';
import LoanCalculator from './components/calculators/LoanCalculator';
import PercentageCalculator from './components/calculators/PercentageCalculator';
import StatisticsCalculator from './components/calculators/StatisticsCalculator';
import GradeCalculator from './components/calculators/GradeCalculator';
import CoinToss from './components/tools/CoinToss';
import Header from './components/layout/Header';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  const [activeTab, setActiveTab] = useState('loan');

  const tabs = [
    { id: 'loan', label: 'Loan Calculator' },
    { id: 'percentage', label: 'Percentage Calculator' },
    { id: 'statistics', label: 'Statistics' },
    { id: 'grade', label: 'Grade Calculator' },
    { id: 'coin', label: 'Coin Toss' },
  ];

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
          
          <div className="mt-6">
            {activeTab === 'loan' && <LoanCalculator />}
            {activeTab === 'percentage' && <PercentageCalculator />}
            {activeTab === 'statistics' && <StatisticsCalculator />}
            {activeTab === 'grade' && <GradeCalculator />}
            {activeTab === 'coin' && <CoinToss />}
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;