import React, { useState } from 'react';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

interface QuizProps {
  questions: QuizQuestion[];
  onComplete?: (score: number, totalQuestions: number) => void;
}

const Quiz: React.FC<QuizProps> = ({ questions, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  
  const currentQuestion = questions[currentQuestionIndex];
  
  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion.id]: answer,
    });
  };
  
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
      
      if (onComplete) {
        const correctAnswers = questions.filter(
          q => selectedAnswers[q.id] === q.correctAnswer
        ).length;
        onComplete(correctAnswers, questions.length);
      }
    }
  };
  
  const calculateScore = () => {
    return questions.filter(q => selectedAnswers[q.id] === q.correctAnswer).length;
  };
  
  if (showResults) {
    const score = calculateScore();
    
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Quiz Results</h2>
        <p className="text-lg mb-2 text-gray-800">
          Your score: {score} out of {questions.length}
        </p>
        <p className="mb-4 text-gray-800">
          {score === questions.length 
            ? '🎉 Perfect! Great job!'
            : score >= questions.length / 2 
              ? '👍 Good work! Review the questions you missed to improve.'
              : '📚 Keep learning! Review the material and try again.'}
        </p>
        <button
          onClick={() => {
            setCurrentQuestionIndex(0);
            setSelectedAnswers({});
            setShowResults(false);
          }}
          className="btn-immutable-sm-gradient"
        >
          Retry Quiz
        </button>
      </div>
    );
  }
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Question {currentQuestionIndex + 1} of {questions.length}</h2>
      <p className="text-lg mb-4 text-gray-800 font-medium">{currentQuestion.question}</p>
      
      <div className="space-y-2 mb-6">
        {currentQuestion.options.map((option, index) => (
          <div 
            key={index}
            className={`p-3 border rounded cursor-pointer text-gray-800 ${
              selectedAnswers[currentQuestion.id] === option 
                ? 'border-blue-500 bg-blue-50 font-medium' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onClick={() => handleAnswerSelect(option)}
          >
            {option}
          </div>
        ))}
      </div>
      
      <button
        onClick={handleNext}
        disabled={!selectedAnswers[currentQuestion.id]}
        className={selectedAnswers[currentQuestion.id]
          ? 'btn-immutable-sm-gradient'
          : 'btn-immutable-sm-disabled'
        }
      >
        {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
      </button>
    </div>
  );
};

export default Quiz; 