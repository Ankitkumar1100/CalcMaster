import React from 'react';

interface ResultProps {
  label: string;
  value: string | number;
  className?: string;
  positive?: boolean;
  negative?: boolean;
}

export const Result: React.FC<ResultProps> = ({ 
  label, 
  value, 
  className = '',
  positive = false,
  negative = false
}) => {
  let valueClassName = 'text-lg font-semibold dark:text-white';
  
  if (positive) {
    valueClassName = 'text-lg font-semibold text-green-600 dark:text-green-400';
  } else if (negative) {
    valueClassName = 'text-lg font-semibold text-red-600 dark:text-red-400';
  }
  
  return (
    <div className={`bg-gray-50 dark:bg-gray-700 p-4 rounded-md ${className}`}>
      <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
      <div className={valueClassName}>{value}</div>
    </div>
  );
};