import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Tabs } from '../ui/Tabs';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Result } from '../ui/Result';

interface Course {
  name: string;
  credits: string;
  grade: string;
  gradePoint: number;
}

const GradeCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState('cgpa');
  const [courses, setCourses] = useState<Course[]>([
    { name: 'Course 1', credits: '3', grade: '', gradePoint: 0 },
    { name: 'Course 2', credits: '3', grade: '', gradePoint: 0 },
    { name: 'Course 3', credits: '3', grade: '', gradePoint: 0 },
  ]);
  const [result, setResult] = useState<number | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const gradePoints: { [key: string]: number } = {
    'A+': 4.0, 'A': 4.0,
    'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D+': 1.3, 'D': 1.0, 'D-': 0.7,
    'F': 0.0
  };

  const updateCourse = (index: number, field: keyof Course, value: string) => {
    const updated = [...courses];
    updated[index] = { ...updated[index], [field]: value };
    
    // Auto-update grade point if grade is changed
    if (field === 'grade') {
      updated[index].gradePoint = gradePoints[value] || 0;
    }
    
    setCourses(updated);
  };

  const addCourse = () => {
    setCourses([...courses, { name: `Course ${courses.length + 1}`, credits: '3', grade: '', gradePoint: 0 }]);
  };

  const validateInputs = () => {
    const newErrors: { [key: string]: string } = {};
    let valid = true;

    courses.forEach((course, index) => {
      if (!course.credits || isNaN(Number(course.credits)) || Number(course.credits) <= 0) {
        newErrors[`credits${index}`] = 'Invalid credits';
        valid = false;
      }

      if (activeTab === 'cgpa' || activeTab === 'sgpa') {
        if (!course.grade) {
          newErrors[`grade${index}`] = 'Select a grade';
          valid = false;
        }
      } else if (activeTab === 'custom') {
        if (isNaN(course.gradePoint) || course.gradePoint < 0 || course.gradePoint > 4) {
          newErrors[`gradePoint${index}`] = 'Invalid (0-4)';
          valid = false;
        }
      }
    });

    setErrors(newErrors);
    return valid;
  };

  const calculateGPA = () => {
    if (!validateInputs()) return;

    let totalCredits = 0;
    let totalGradePoints = 0;

    courses.forEach(course => {
      const credits = Number(course.credits);
      const gradePoint = activeTab === 'custom' ? Number(course.gradePoint) : gradePoints[course.grade] || 0;
      
      totalCredits += credits;
      totalGradePoints += credits * gradePoint;
    });

    if (totalCredits === 0) {
      setErrors({ general: 'Total credits cannot be zero' });
      return;
    }

    setResult(totalGradePoints / totalCredits);
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Grade Calculator</h2>
      
      <Tabs
        tabs={[
          { id: 'cgpa', label: 'CGPA Calculator' },
          { id: 'sgpa', label: 'SGPA Calculator' },
          { id: 'custom', label: 'Custom GPA' },
        ]}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      
      <div className="mt-6">
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
            {activeTab === 'cgpa' ? 'Cumulative GPA Calculator' : 
             activeTab === 'sgpa' ? 'Semester GPA Calculator' : 'Custom GPA Calculator'}
          </h3>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {activeTab === 'cgpa' ? 
              'Calculate your overall cumulative GPA across all completed terms' : 
             activeTab === 'sgpa' ? 
              'Calculate your GPA for a single semester or term' :
              'Calculate GPA with custom grade points'}
          </p>
          
          {errors.general && <p className="text-sm text-red-600 dark:text-red-400 mb-4">{errors.general}</p>}
        </div>
        
        <div className="mb-6">
          <div className="grid grid-cols-12 gap-4 mb-2">
            <div className="col-span-4 font-medium text-gray-700 dark:text-gray-300">Course</div>
            <div className="col-span-2 font-medium text-gray-700 dark:text-gray-300">Credits</div>
            <div className="col-span-6 font-medium text-gray-700 dark:text-gray-300">
              {activeTab === 'custom' ? 'Grade Point (0-4)' : 'Grade'}
            </div>
          </div>
          
          {courses.map((course, index) => (
            <div key={index} className="grid grid-cols-12 gap-4 mb-3">
              <div className="col-span-4">
                <Input
                  value={course.name}
                  onChange={(e) => updateCourse(index, 'name', e.target.value)}
                  placeholder={`Course ${index + 1}`}
                />
              </div>
              
              <div className="col-span-2">
                <Input
                  type="number"
                  value={course.credits}
                  onChange={(e) => updateCourse(index, 'credits', e.target.value)}
                  placeholder="3"
                  error={errors[`credits${index}`]}
                />
              </div>
              
              <div className="col-span-6">
                {activeTab === 'custom' ? (
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    max="4"
                    value={course.gradePoint.toString()}
                    onChange={(e) => updateCourse(index, 'gradePoint', e.target.value)}
                    placeholder="4.0"
                    error={errors[`gradePoint${index}`]}
                  />
                ) : (
                  <select
                    className="w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    value={course.grade}
                    onChange={(e) => updateCourse(index, 'grade', e.target.value)}
                  >
                    <option value="">Select Grade</option>
                    {Object.keys(gradePoints).map(grade => (
                      <option key={grade} value={grade}>
                        {grade} ({gradePoints[grade].toFixed(1)})
                      </option>
                    ))}
                  </select>
                )}
                {errors[`grade${index}`] && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors[`grade${index}`]}</p>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex space-x-4 mb-6">
          <Button variant="outline" onClick={addCourse}>
            Add Course
          </Button>
          <Button onClick={calculateGPA}>
            Calculate {activeTab.toUpperCase()}
          </Button>
        </div>
        
        {result !== null && (
          <div className="mt-4">
            <Result 
              label={activeTab.toUpperCase()} 
              value={result.toFixed(2)} 
              positive={result >= 3.0}
              negative={result < 2.0}
            />
          </div>
        )}
      </div>
    </Card>
  );
};

export default GradeCalculator;