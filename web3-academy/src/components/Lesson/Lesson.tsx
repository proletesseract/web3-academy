import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import CodeEditor from '../CodeEditor/CodeEditor';
import Quiz, { QuizQuestion } from '../Quiz/Quiz';

export interface LessonStep {
  id: string;
  title: string;
  content: string;
  codeChallenge?: {
    defaultCode: string;
    language?: string;
    solution: string;
    validateFn?: string; // Function string to evaluate code
  };
  quiz?: QuizQuestion[];
}

interface LessonProps {
  lesson: {
    id: string;
    title: string;
    description: string;
    steps: LessonStep[];
  };
  onComplete?: () => void;
}

const Lesson: React.FC<LessonProps> = ({ lesson, onComplete }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [codeByStep, setCodeByStep] = useState<Record<string, string>>({});
  const [stepCompleted, setStepCompleted] = useState<Record<string, boolean>>({});
  
  const currentStep = lesson.steps[currentStepIndex];
  
  const handleCodeChange = (stepId: string, code: string | undefined) => {
    if (code) {
      setCodeByStep({
        ...codeByStep,
        [stepId]: code,
      });
    }
  };
  
  const validateCode = (code: string, solution: string): boolean => {
    // Basic validation - can be expanded with more sophisticated validation
    return code.includes(solution.trim());
  };
  
  const handleCodeValidation = (stepId: string, isValid: boolean) => {
    if (isValid) {
      setStepCompleted({
        ...stepCompleted,
        [stepId]: true,
      });
    }
  };
  
  const handleQuizComplete = (stepId: string, score: number, total: number) => {
    // Mark as completed if the score is at least 70%
    const passed = score / total >= 0.7;
    setStepCompleted({
      ...stepCompleted,
      [stepId]: passed,
    });
  };
  
  const handleNextStep = () => {
    if (currentStepIndex < lesson.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else if (onComplete) {
      onComplete();
    }
  };
  
  const isCurrentStepCompleted = stepCompleted[currentStep.id] || false;
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{lesson.title}</h1>
      <p className="text-gray-600 mb-6">{lesson.description}</p>
      
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="flex-1 h-2 bg-gray-200 rounded-full">
            <div 
              className="h-2 bg-blue-600 rounded-full" 
              style={{ width: `${((currentStepIndex + (isCurrentStepCompleted ? 1 : 0)) / lesson.steps.length) * 100}%` }}
            ></div>
          </div>
          <span className="ml-4 text-sm font-medium">
            Step {currentStepIndex + 1} of {lesson.steps.length}
          </span>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">{currentStep.title}</h2>
        
        <div className="prose max-w-none mb-6">
          <ReactMarkdown>{currentStep.content}</ReactMarkdown>
        </div>
        
        {currentStep.codeChallenge && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Code Challenge</h3>
            <CodeEditor 
              defaultValue={currentStep.codeChallenge.defaultCode}
              language={currentStep.codeChallenge.language}
              onChange={(code) => handleCodeChange(currentStep.id, code)}
              onValidate={(isValid) => handleCodeValidation(currentStep.id, isValid)}
              validateCode={(code) => validateCode(code, currentStep.codeChallenge?.solution || '')}
            />
          </div>
        )}
        
        {currentStep.quiz && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Quiz</h3>
            <Quiz 
              questions={currentStep.quiz} 
              onComplete={(score, total) => handleQuizComplete(currentStep.id, score, total)}
            />
          </div>
        )}
        
        <div className="flex justify-between mt-8">
          <button
            onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))}
            disabled={currentStepIndex === 0}
            className={`px-4 py-2 rounded ${
              currentStepIndex === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Previous
          </button>
          
          <button
            onClick={handleNextStep}
            disabled={!isCurrentStepCompleted}
            className={`px-4 py-2 rounded ${
              isCurrentStepCompleted
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {currentStepIndex < lesson.steps.length - 1 ? 'Next' : 'Complete Lesson'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Lesson; 