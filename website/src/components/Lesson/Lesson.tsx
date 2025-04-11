import React, { useState, useEffect } from 'react';
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

// Add custom styles for markdown content
const markdownStyles = {
  // Apply to all text elements in the markdown
   // do not add a gradient-text class to h1
  p: 'text-gray-800 text-base leading-relaxed mb-4',
  h1: 'text-2xl font-bold text-gray-900 mb-4 mt-6',
  h2: 'text-xl font-bold text-gray-900 mb-3 mt-5',
  h3: 'text-lg font-semibold text-gray-900 mb-3 mt-4',
  h4: 'text-base font-semibold text-gray-900 mb-2 mt-4',
  ul: 'list-disc pl-5 mb-4 text-gray-800',
  ol: 'list-decimal pl-5 mb-4 text-gray-800',
  li: 'mb-1 text-gray-800',
  a: 'text-blue-600 hover:underline',
  blockquote: 'border-l-4 border-gray-200 pl-4 italic my-4 text-gray-800',
  code: 'bg-gray-100 px-1 py-0.5 rounded text-gray-800 font-mono text-sm',
  pre: 'bg-gray-100 p-4 rounded-md overflow-auto my-4 text-gray-800',
  strong: 'font-semibold text-gray-900',
  em: 'italic text-gray-800',
};

const Lesson: React.FC<LessonProps> = ({ lesson, onComplete }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [codeByStep, setCodeByStep] = useState<Record<string, string>>({});
  const [stepCompleted, setStepCompleted] = useState<Record<string, boolean>>({});
  const [windowHeight, setWindowHeight] = useState(0);
  const [initialized, setInitialized] = useState(false);
  
  const currentStep = lesson.steps[currentStepIndex];
  
  // Check if content starts with a heading (# Title) to avoid duplicate titles
  const contentStartsWithHeading = currentStep?.content.trim().startsWith('# ');
  
  // Initialize auto-completion for content-only steps
  useEffect(() => {
    // Pre-mark all content-only steps as completed on initial load
    if (!initialized) {
      const completedSteps = { ...stepCompleted };
      
      lesson.steps.forEach(step => {
        if (!step.codeChallenge && !step.quiz) {
          completedSteps[step.id] = true;
        }
      });
      
      setStepCompleted(completedSteps);
      setInitialized(true);
    }
  // We only want to run this once on mount, so we don't include stepCompleted as a dependency
  }, [lesson.steps, initialized]);
  
  // Get window height on mount
  useEffect(() => {
    setWindowHeight(window.innerHeight);
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
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
  
  // Check if the code challenge is just a placeholder
  const hasRealCodeChallenge = (step: LessonStep): boolean => {
    if (!step.codeChallenge) return false;
    
    // Check if code is just a placeholder comment
    const code = step.codeChallenge.defaultCode || '';
    const isPlaceholder = 
      code.trim().startsWith('//') && 
      !code.includes('import') && 
      !code.includes('function') && 
      !code.includes('class') &&
      !code.includes('const') &&
      !code.includes('let') &&
      !code.includes('var');
      
    return !isPlaceholder;
  };
  
  // Update current step completed logic to include content-only steps
  const isContentOnlyStep = !hasRealCodeChallenge(currentStep) && !currentStep.quiz;
  
  const isCurrentStepCompleted = stepCompleted[currentStep.id] || isContentOnlyStep;
  
  // Calculate content height based on window height, minus headers and footers
  const contentHeight = windowHeight - 220; // 220px accounts for headers, footers, margins
  
  return (
    <div className="w-full px-4 py-2">
      <h1 className="text-3xl font-bold mb-2 gradient-text">{lesson.title}</h1>
      <p className="text-gray-300 mb-6">{lesson.description}</p>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-4">
        {/* Only show step title if content doesn't start with a heading */}
        {!contentStartsWithHeading && (
          <h2 className="text-2xl font-bold mb-4 text-gray-900">{currentStep.title}</h2>
        )}
        
        {/* don't change this height */}
        <div className="flex flex-col lg:flex-row gap-6" style={{ height: `calc(100vh - 438px)` }}>
          {/* Left side: Instructions/Content */}
          <div className={`${hasRealCodeChallenge(currentStep) ? 'lg:w-1/2' : 'w-full'} h-full overflow-auto pr-3`}>
            <div className="prose max-w-none mb-6 prose-headings:text-gray-900 prose-p:text-gray-800 prose-strong:text-gray-900 prose-li:text-gray-800">
              <ReactMarkdown
                components={{
                  p: ({node, ...props}) => <p className={markdownStyles.p} {...props} />,
                  h1: ({node, ...props}) => <h1 className={markdownStyles.h1} {...props} />,
                  h2: ({node, ...props}) => <h2 className={markdownStyles.h2} {...props} />,
                  h3: ({node, ...props}) => <h3 className={markdownStyles.h3} {...props} />,
                  h4: ({node, ...props}) => <h4 className={markdownStyles.h4} {...props} />,
                  ul: ({node, ...props}) => <ul className={markdownStyles.ul} {...props} />,
                  ol: ({node, ...props}) => <ol className={markdownStyles.ol} {...props} />,
                  li: ({node, ...props}) => <li className={markdownStyles.li} {...props} />,
                  a: ({node, ...props}) => <a className={markdownStyles.a} {...props} />,
                  blockquote: ({node, ...props}) => <blockquote className={markdownStyles.blockquote} {...props} />,
                  code: ({node, ...props}) => <code className={markdownStyles.code} {...props} />,
                  pre: ({node, ...props}) => <pre className={markdownStyles.pre} {...props} />,
                  strong: ({node, ...props}) => <strong className={markdownStyles.strong} {...props} />,
                  em: ({node, ...props}) => <em className={markdownStyles.em} {...props} />,
                }}
              >
                {currentStep.content}
              </ReactMarkdown>
            </div>
            
            {currentStep.quiz && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Quiz</h3>
                <Quiz 
                  questions={currentStep.quiz} 
                  onComplete={(score, total) => handleQuizComplete(currentStep.id, score, total)}
                />
              </div>
            )}
          </div>
          
          {/* Right side: Code Editor - only show if there's a real code challenge */}
          {hasRealCodeChallenge(currentStep) && (
            <div className="lg:w-1/2 h-full flex flex-col">
              <h3 className="text-xl font-semibold mb-2">Code Challenge</h3>
              <div className="flex-grow" style={{ height: 'calc(100% - 32px)' }}>
                <CodeEditor 
                  defaultValue={currentStep.codeChallenge!.defaultCode}
                  language={currentStep.codeChallenge!.language || 'typescript'}
                  onChange={(code) => handleCodeChange(currentStep.id, code)}
                  onValidate={(isValid) => handleCodeValidation(currentStep.id, isValid)}
                  validateCode={(code) => validateCode(code, currentStep.codeChallenge?.solution || '')}
                  height="100%"
                />
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200 sticky bottom-0 bg-white">
          {/* Navigation and progress bar section - restructured layout */}
          <div className="flex items-center justify-between gap-4">
            {/* Previous button */}
            <button
              onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))}
              disabled={currentStepIndex === 0}
              className={currentStepIndex === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed rounded-full px-4 py-2 flex-shrink-0'
                : 'btn-immutable-sm-inverted flex-shrink-0'
              }
            >
              Previous
            </button>
            
            {/* Progress bar in the middle */}
            <div className="flex-grow flex flex-col justify-center">
              {/* Do not change this inline styling */ }
              <div className="text-center mb-1" style={{ position: 'absolute', left: '50%', marginTop: '50px' }}>
                <span className="text-xs font-medium text-gray-500">
                  Step {currentStepIndex + 1} of {lesson.steps.length}
                </span>
              </div>
              <div className="relative w-full h-2 rounded-full overflow-hidden">
                {/* Full gradient background that's always visible underneath */}
                <div 
                  className="absolute top-0 left-0 w-full h-2 rounded-full"
                  style={{ 
                    background: 'linear-gradient(to right, var(--violet-immutable), var(--cyan-immutable))'
                  }}
                ></div>
                {/* Gray overlay that covers unfinished portion */}
                <div 
                  className="absolute top-0 right-0 h-2 bg-gray-200 rounded-r-full"
                  style={{ 
                    width: `${100 - ((currentStepIndex + (isCurrentStepCompleted ? 1 : 0)) / lesson.steps.length) * 100}%`
                  }}
                ></div>
              </div>
            </div>
            
            {/* Next/Complete buttons */}
            <div className="flex gap-2 flex-shrink-0">
              {!isCurrentStepCompleted && (
                <button
                  onClick={() => {
                    setStepCompleted(prev => ({
                      ...prev,
                      [currentStep.id]: true
                    }));
                  }}
                  className="btn-immutable-sm-inverted"
                >
                  Mark as Complete
                </button>
              )}
              
              <button
                onClick={handleNextStep}
                disabled={!isCurrentStepCompleted}
                className={!isCurrentStepCompleted
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed rounded-full px-4 py-2'
                  : 'btn-immutable-sm-gradient'
                }
              >
                {currentStepIndex < lesson.steps.length - 1 ? 'Next' : 'Complete Lesson'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lesson; 