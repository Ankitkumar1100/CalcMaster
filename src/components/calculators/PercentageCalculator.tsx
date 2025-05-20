import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Result } from '../ui/Result';

const PercentageCalculator: React.FC = () => {
  const [examMode, setExamMode] = useState<'simple' | 'detailed'>('simple');
  const [obtainedMarks, setObtainedMarks] = useState<string>('');
  const [totalMarks, setTotalMarks] = useState<string>('');
  const [subjectMarks, setSubjectMarks] = useState<{ obtained: string; total: string }[]>([
    { obtained: '', total: '' },
    { obtained: '', total: '' },
    { obtained: '', total: '' },
  ]);
  const [percentage, setPercentage] = useState<number | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const addSubject = () => {
    setSubjectMarks([...subjectMarks, { obtained: '', total: '' }]);
  };

  const updateSubjectMark = (index: number, field: 'obtained' | 'total', value: string) => {
    const updated = [...subjectMarks];
    updated[index][field] = value;
    setSubjectMarks(updated);
  };

  const validateSimpleInputs = () => {
    const newErrors: { [key: string]: string } = {};

    if (!obtainedMarks || isNaN(Number(obtainedMarks)) || Number(obtainedMarks) < 0) {
      newErrors.obtainedMarks = 'Please enter valid obtained marks';
    }

    if (!totalMarks || isNaN(Number(totalMarks)) || Number(totalMarks) <= 0) {
      newErrors.totalMarks = 'Please enter valid total marks';
    }

    if (Number(obtainedMarks) > Number(totalMarks)) {
      newErrors.obtainedMarks = 'Obtained marks cannot exceed total marks';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateDetailedInputs = () => {
    const newErrors: { [key: string]: string } = {};
    let valid = true;

    subjectMarks.forEach((subject, index) => {
      if (!subject.obtained || isNaN(Number(subject.obtained)) || Number(subject.obtained) < 0) {
        newErrors[`subject${index}obtained`] = 'Invalid';
        valid = false;
      }

      if (!subject.total || isNaN(Number(subject.total)) || Number(subject.total) <= 0) {
        newErrors[`subject${index}total`] = 'Invalid';
        valid = false;
      }

      if (Number(subject.obtained) > Number(subject.total)) {
        newErrors[`subject${index}obtained`] = 'Cannot exceed total';
        valid = false;
      }
    });

    setErrors(newErrors);
    return valid;
  };

  const calculateSimplePercentage = () => {
    if (!validateSimpleInputs()) return;

    const obtained = Number(obtainedMarks);
    const total = Number(totalMarks);
    setPercentage((obtained / total) * 100);
  };

  const calculateDetailedPercentage = () => {
    if (!validateDetailedInputs()) return;

    let totalObtained = 0;
    let totalMaximum = 0;

    subjectMarks.forEach(subject => {
      totalObtained += Number(subject.obtained);
      totalMaximum += Number(subject.total);
    });

    setPercentage((totalObtained / totalMaximum) * 100);
  };

  const getGrade = (percent: number) => {
    if (percent >= 90) return 'A+';
    if (percent >= 80) return 'A';
    if (percent >= 70) return 'B';
    if (percent >= 60) return 'C';
    if (percent >= 50) return 'D';
    return 'F';
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Percentage Calculator</h2>

      <div className="mb-6">
        <div className="flex space-x-4 mb-4">
          <Button
            variant={examMode === 'simple' ? 'primary' : 'outline'}
            onClick={() => setExamMode('simple')}
          >
            Simple
          </Button>
          <Button
            variant={examMode === 'detailed' ? 'primary' : 'outline'}
            onClick={() => setExamMode('detailed')}
          >
            Multiple Subjects
          </Button>
        </div>

        {examMode === 'simple' ? (
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <Input
              label="Obtained Marks"
              type="number"
              value={obtainedMarks}
              onChange={(e) => setObtainedMarks(e.target.value)}
              error={errors.obtainedMarks}
            />
            <Input
              label="Total Marks"
              type="number"
              value={totalMarks}
              onChange={(e) => setTotalMarks(e.target.value)}
              error={errors.totalMarks}
            />
            <Button
              onClick={calculateSimplePercentage}
              className="md:col-span-2"
            >
              Calculate Percentage
            </Button>
          </div>
        ) : (
          <div className="mb-4">
            <div className="grid grid-cols-7 gap-4 mb-2">
              <div className="col-span-3 font-medium text-gray-700 dark:text-gray-300">Subject</div>
              <div className="col-span-2 font-medium text-gray-700 dark:text-gray-300">Obtained</div>
              <div className="col-span-2 font-medium text-gray-700 dark:text-gray-300">Total</div>
            </div>

            {subjectMarks.map((subject, index) => (
              <div key={index} className="grid grid-cols-7 gap-4 mb-2">
                <div className="col-span-3 flex items-center">
                  <span className="text-gray-600 dark:text-gray-400">Subject {index + 1}</span>
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    value={subject.obtained}
                    onChange={(e) => updateSubjectMark(index, 'obtained', e.target.value)}
                    error={errors[`subject${index}obtained`]}
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    value={subject.total}
                    onChange={(e) => updateSubjectMark(index, 'total', e.target.value)}
                    error={errors[`subject${index}total`]}
                  />
                </div>
              </div>
            ))}

            <div className="flex space-x-4 mt-4">
              <Button onClick={addSubject} variant="outline">
                Add Subject
              </Button>
              <Button onClick={calculateDetailedPercentage}>
                Calculate Percentage
              </Button>
            </div>
          </div>
        )}

        {percentage !== null && (
          <div className="mt-6 grid md:grid-cols-2 gap-4">
            <Result 
              label="Percentage" 
              value={`${percentage.toFixed(2)}%`} 
              positive={percentage >= 60}
              negative={percentage < 40}
            />
            <Result 
              label="Grade" 
              value={getGrade(percentage)}
              positive={percentage >= 60}
              negative={percentage < 40}
            />
          </div>
        )}
      </div>
    </Card>
  );
};

export default PercentageCalculator;