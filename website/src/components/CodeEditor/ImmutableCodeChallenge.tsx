import React, { useState } from 'react';
import CodeEditor from './CodeEditor';

interface ImmutableCodeChallengeProps {
  challenge: {
    title: string;
    description: string;
    defaultCode: string;
    expectedOutput?: string;
    solution: string;
    language?: string;
    hints?: string[];
  };
  onComplete?: () => void;
}

const ImmutableCodeChallenge: React.FC<ImmutableCodeChallengeProps> = ({
  challenge,
  onComplete,
}) => {
  const [isValid, setIsValid] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  
  const validateImmutableCode = (code: string): boolean => {
    // Simple validation - check if the code includes the solution string
    // In a real app, this would be more sophisticated, possibly executing the code
    // against test cases or checking for specific patterns
    return code.includes(challenge.solution.trim());
  };
  
  const handleCodeChange = (value: string | undefined) => {
    if (value) {
      const valid = validateImmutableCode(value);
      setIsValid(valid);
    }
  };
  
  const handleCompleteChallenge = () => {
    if (onComplete) {
      onComplete();
    }
  };
  
  const showNextHint = () => {
    if (challenge.hints && currentHintIndex < challenge.hints.length - 1) {
      setCurrentHintIndex(currentHintIndex + 1);
    }
    setShowHint(true);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-2">{challenge.title}</h2>
      <p className="mb-4 text-gray-700">{challenge.description}</p>
      
      <div className="mb-6">
        <CodeEditor
          defaultValue={challenge.defaultCode}
          language={challenge.language || 'typescript'}
          onChange={handleCodeChange}
          height="300px"
        />
      </div>
      
      {challenge.expectedOutput && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Expected Output:</h3>
          <div className="bg-gray-100 p-3 rounded font-mono text-sm">
            {challenge.expectedOutput}
          </div>
        </div>
      )}
      
      <div className="flex flex-wrap gap-4 mb-4">
        {challenge.hints && challenge.hints.length > 0 && (
          <button
            onClick={showNextHint}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            {showHint ? "Next Hint" : "Show Hint"}
          </button>
        )}
        
        <button
          onClick={handleCompleteChallenge}
          disabled={!isValid}
          className={`px-4 py-2 rounded ${
            isValid
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isValid ? "Complete Challenge" : "Validate Solution"}
        </button>
      </div>
      
      {showHint && challenge.hints && challenge.hints.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded mb-4">
          <h3 className="text-lg font-semibold text-blue-800 mb-1">Hint {currentHintIndex + 1}:</h3>
          <p className="text-blue-700">{challenge.hints[currentHintIndex]}</p>
        </div>
      )}
      
      {isValid && (
        <div className="bg-green-50 border border-green-200 p-4 rounded">
          <h3 className="text-lg font-semibold text-green-800 mb-1">Success!</h3>
          <p className="text-green-700">
            Your solution is correct. You can now proceed to the next challenge.
          </p>
        </div>
      )}
    </div>
  );
};

export default ImmutableCodeChallenge; 