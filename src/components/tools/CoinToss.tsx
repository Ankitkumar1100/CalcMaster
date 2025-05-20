import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

const CoinToss: React.FC = () => {
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<'heads' | 'tails' | null>(null);
  const [flipCount, setFlipCount] = useState(0);
  const [stats, setStats] = useState({ heads: 0, tails: 0 });
  const coinRef = useRef<HTMLDivElement>(null);
  
  const flipCoin = () => {
    if (isFlipping) return;
    
    setIsFlipping(true);
    setResult(null);
    
    // Random result (heads or tails)
    const newResult: 'heads' | 'tails' = Math.random() < 0.5 ? 'heads' : 'tails';
    
    // Update flip count
    setFlipCount(prev => prev + 1);
    
    // Update stats based on result
    setStats(prev => ({
      ...prev,
      [newResult]: prev[newResult] + 1
    }));
    
    // After animation completes, show result
    setTimeout(() => {
      setResult(newResult);
      setIsFlipping(false);
    }, 1500);
  };
  
  const resetStats = () => {
    setStats({ heads: 0, tails: 0 });
    setFlipCount(0);
    setResult(null);
  };
  
  useEffect(() => {
    // Add flip animation class
    if (isFlipping && coinRef.current) {
      coinRef.current.classList.add('flipping');
    } else if (coinRef.current) {
      coinRef.current.classList.remove('flipping');
    }
  }, [isFlipping]);
  
  return (
    <Card className="max-w-md mx-auto text-center">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Coin Toss</h2>
      
      <div className="flex flex-col items-center mb-6">
        <div 
          ref={coinRef}
          className={`coin relative h-40 w-40 transition-transform duration-1000 ${isFlipping ? 'flipping' : ''}`}
          style={{ 
            perspective: '1000px',
            transformStyle: 'preserve-3d'
          }}
        >
          <div 
            className={`absolute inset-0 rounded-full bg-yellow-400 border-4 border-yellow-500 flex items-center justify-center text-2xl font-bold
              ${result === 'tails' ? 'rotate-y-180' : ''}`}
            style={{ 
              backfaceVisibility: 'hidden',
              transform: result === 'tails' ? 'rotateY(180deg)' : 'rotateY(0)'
            }}
          >
            H
          </div>
          <div 
            className={`absolute inset-0 rounded-full bg-yellow-400 border-4 border-yellow-500 flex items-center justify-center text-2xl font-bold
              ${result === 'heads' ? 'rotate-y-180' : ''}`}
            style={{ 
              backfaceVisibility: 'hidden',
              transform: result === 'heads' ? 'rotateY(180deg)' : 'rotateY(0)'
            }}
          >
            T
          </div>
        </div>
        
        {result && (
          <div className="mt-4 text-lg font-medium text-gray-800 dark:text-white animate-fade-in">
            Result: <span className="font-bold capitalize">{result}</span>
          </div>
        )}
      </div>
      
      <Button 
        onClick={flipCoin} 
        disabled={isFlipping}
        className="w-full mb-6"
        size="lg"
      >
        {isFlipping ? 'Flipping...' : 'Toss Coin'}
      </Button>
      
      {flipCount > 0 && (
        <div className="mt-4">
          <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">Statistics</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded">
              <div className="text-gray-500 dark:text-gray-400 text-xs">Tosses</div>
              <div className="font-bold text-lg">{flipCount}</div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded">
              <div className="text-gray-500 dark:text-gray-400 text-xs">Heads</div>
              <div className="font-bold text-lg">{stats.heads}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {flipCount > 0 ? `${((stats.heads / flipCount) * 100).toFixed(1)}%` : '0%'}
              </div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded">
              <div className="text-gray-500 dark:text-gray-400 text-xs">Tails</div>
              <div className="font-bold text-lg">{stats.tails}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {flipCount > 0 ? `${((stats.tails / flipCount) * 100).toFixed(1)}%` : '0%'}
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={resetStats} className="mt-4">
            Reset Statistics
          </Button>
        </div>
      )}
      
      <style jsx>{`
        @keyframes flip {
          0% { transform: rotateY(0); }
          100% { transform: rotateY(720deg); }
        }
        
        .flipping {
          animation: flip 1.5s ease-in-out;
        }
        
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
      `}</style>
    </Card>
  );
};

export default CoinToss;