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
        <h2 className="text-2xl font-bold mb-4">Quiz Results</h2>
        <p className="text-lg mb-2">
          Your score: {score} out of {questions.length}
        </p>
        <p className="mb-4">
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
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry Quiz
        </button>
      </div>
    );
  }
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Question {currentQuestionIndex + 1} of {questions.length}</h2>
      <p className="text-lg mb-4">{currentQuestion.question}</p>
      
      <div className="space-y-2 mb-6">
        {currentQuestion.options.map((option, index) => (
          <div 
            key={index}
            className={`p-3 border rounded cursor-pointer ${
              selectedAnswers[currentQuestion.id] === option 
                ? 'border-blue-500 bg-blue-50' 
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
        className={`px-4 py-2 rounded ${
          selectedAnswers[currentQuestion.id]
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
      </button>
    </div>
  );
};

export default Quiz; 