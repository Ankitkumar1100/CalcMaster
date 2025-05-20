import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Result } from '../ui/Result';
import { DollarSign, Calendar, Percent } from 'lucide-react';

interface LoanResults {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  profitLoss: number;
}

const LoanCalculator: React.FC = () => {
  const [principal, setPrincipal] = useState<string>('10000');
  const [interestRate, setInterestRate] = useState<string>('5');
  const [loanTerm, setLoanTerm] = useState<string>('36');
  const [results, setResults] = useState<LoanResults | null>(null);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateInputs = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!principal || isNaN(Number(principal)) || Number(principal) <= 0) {
      newErrors.principal = 'Please enter a valid loan amount';
    }
    
    if (!interestRate || isNaN(Number(interestRate)) || Number(interestRate) < 0) {
      newErrors.interestRate = 'Please enter a valid interest rate';
    }
    
    if (!loanTerm || isNaN(Number(loanTerm)) || Number(loanTerm) <= 0 || !Number.isInteger(Number(loanTerm))) {
      newErrors.loanTerm = 'Please enter a valid number of months';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateLoan = () => {
    if (!validateInputs()) return;
    
    const p = Number(principal);
    const r = Number(interestRate) / 100 / 12; // monthly interest rate
    const n = Number(loanTerm); // months
    
    if (r === 0) {
      // If interest rate is 0, simple division
      const monthlyPayment = p / n;
      setResults({
        monthlyPayment,
        totalPayment: monthlyPayment * n,
        totalInterest: 0,
        profitLoss: -0
      });
    } else {
      // Standard amortization formula
      const monthlyPayment = p * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const totalPayment = monthlyPayment * n;
      const totalInterest = totalPayment - p;
      
      setResults({
        monthlyPayment,
        totalPayment,
        totalInterest,
        profitLoss: -totalInterest // Negative because it's a loss from borrower perspective
      });
    }
  };

  useEffect(() => {
    // Calculate on initial render with default values
    calculateLoan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-6">Loan Calculator</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <Input
            id="principal"
            label="Loan Amount"
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            placeholder="10000"
            className="pl-10"
            error={errors.principal}
          />
          <DollarSign className="absolute left-3 top-8 h-5 w-5 text-gray-400" />
        </div>
        
        <div className="relative">
          <Input
            id="interestRate"
            label="Interest Rate (%)"
            type="number"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            placeholder="5"
            step="0.01"
            className="pl-10"
            error={errors.interestRate}
          />
          <Percent className="absolute left-3 top-8 h-5 w-5 text-gray-400" />
        </div>
        
        <div className="relative">
          <Input
            id="loanTerm"
            label="Loan Term (months)"
            type="number"
            value={loanTerm}
            onChange={(e) => setLoanTerm(e.target.value)}
            placeholder="36"
            className="pl-10"
            error={errors.loanTerm}
          />
          <Calendar className="absolute left-3 top-8 h-5 w-5 text-gray-400" />
        </div>
      </div>
      
      <Button onClick={calculateLoan} className="w-full md:w-auto mb-6">
        Calculate
      </Button>
      
      {results && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Result label="Monthly Payment" value={formatCurrency(results.monthlyPayment)} />
          <Result label="Total Payment" value={formatCurrency(results.totalPayment)} />
          <Result label="Total Interest" value={formatCurrency(results.totalInterest)} />
          <Result 
            label="Profit/Loss" 
            value={formatCurrency(Math.abs(results.profitLoss))} 
            negative={results.profitLoss < 0}
            positive={results.profitLoss > 0}
          />
        </div>
      )}
    </Card>
  );
};

export default LoanCalculator;