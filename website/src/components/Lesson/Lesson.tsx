import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import CodeEditor from '../CodeEditor/CodeEditor';
import Quiz, { QuizQuestion } from '../Quiz/Quiz';
import Checklist from '../Checklist';

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
  checklist?: {
    items: {
      id: string;
      text: string;
      type?: 'checkbox' | 'input';
      placeholder?: string;
      validationPattern?: string;
    }[];
  };
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
  // Add isResetting state
  const [isResetting, setIsResetting] = useState(false);
  
  // Get the stored step index from localStorage or default to 0
  const [currentStepIndex, setCurrentStepIndex] = useState(() => {
    const storedIndex = localStorage.getItem(`lesson-${lesson.id}-step-index`);
    return storedIndex ? parseInt(storedIndex, 10) : 0;
  });
  
  // Get stored code progress from localStorage or default to empty object
  const [codeByStep, setCodeByStep] = useState<Record<string, string>>(() => {
    const storedCode = localStorage.getItem(`lesson-${lesson.id}-code`);
    return storedCode ? JSON.parse(storedCode) : {};
  });
  
  // Get stored completion status from localStorage or default to empty object
  const [stepCompleted, setStepCompleted] = useState<Record<string, boolean>>(() => {
    const storedCompleted = localStorage.getItem(`lesson-${lesson.id}-completed`);
    return storedCompleted ? JSON.parse(storedCompleted) : {};
  });
  
  const [windowHeight, setWindowHeight] = useState(0);
  const [initialized, setInitialized] = useState(false);
  
  // Add a resetKey state to force CodeEditor to reload
  const [resetKey, setResetKey] = useState(0);
  
  // Get stored checklist completion status from localStorage or default to empty object
  const [checklistsCompleted, setChecklistsCompleted] = useState<Record<string, boolean>>(() => {
    const storedChecklists = localStorage.getItem(`lesson-${lesson.id}-checklists`);
    return storedChecklists ? JSON.parse(storedChecklists) : {};
  });
  
  // Get stored checklist input values from localStorage or default to empty object
  const [checklistInputValues, setChecklistInputValues] = useState<Record<string, string>>(() => {
    const storedInputValues = localStorage.getItem(`lesson-${lesson.id}-input-values`);
    return storedInputValues ? JSON.parse(storedInputValues) : {};
  });
  
  const currentStep = lesson.steps[currentStepIndex];
  
  // Check if content starts with a heading (# Title) to avoid duplicate titles
  const contentStartsWithHeading = currentStep?.content.trim().startsWith('# ');
  
  // Save the current step index to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(`lesson-${lesson.id}-step-index`, currentStepIndex.toString());
  }, [currentStepIndex, lesson.id]);
  
  // Save code progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(`lesson-${lesson.id}-code`, JSON.stringify(codeByStep));
  }, [codeByStep, lesson.id]);
  
  // Save completion status to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(`lesson-${lesson.id}-completed`, JSON.stringify(stepCompleted));
  }, [stepCompleted, lesson.id]);
  
  // Save checklist completion status to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(`lesson-${lesson.id}-checklists`, JSON.stringify(checklistsCompleted));
  }, [checklistsCompleted, lesson.id]);
  
  // Save checklist input values to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(`lesson-${lesson.id}-input-values`, JSON.stringify(checklistInputValues));
  }, [checklistInputValues, lesson.id]);
  
  // Initialize auto-completion for content-only steps
  useEffect(() => {
    // Pre-mark all content-only steps as completed on initial load
    if (!initialized) {
      const completedSteps = { ...stepCompleted };
      
      lesson.steps.forEach(step => {
        if (!step.codeChallenge && !step.quiz && !step.checklist) {
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
  
  // Add reset effect
  useEffect(() => {
    if (isResetting) {
      // Clear all localStorage items for this lesson
      localStorage.removeItem(`lesson-${lesson.id}-step-index`);
      localStorage.removeItem(`lesson-${lesson.id}-code`);
      localStorage.removeItem(`lesson-${lesson.id}-completed`);
      localStorage.removeItem(`lesson-${lesson.id}-checklists`);
      localStorage.removeItem(`lesson-${lesson.id}-input-values`);
      
      // Reset all state variables
      setCurrentStepIndex(0);
      setCodeByStep({});
      setStepCompleted({});
      setChecklistsCompleted({});
      setChecklistInputValues({});
      setResetKey(0);
      
      // Reset isResetting flag
      setIsResetting(false);
    }
  }, [isResetting, lesson.id]);
  
  const handleCodeChange = (stepId: string, code: string | undefined) => {
    if (code) {
      setCodeByStep({
        ...codeByStep,
        [stepId]: code,
      });
      
      // Validate code on each change
      const isValid = validateCode(code, currentStep.codeChallenge?.solution || '');
      handleCodeValidation(stepId, isValid);
    }
  };
  
  const validateCode = (code: string, solution: string): boolean => {
    if (!solution) return false;
    
    // Different validation strategies based on the step
    switch (currentStep.id) {
      case '02':
        // For step 2, check for required configuration properties
        const requiredProperties = [
          'environment',
          'clientId',
          'redirectUri',
          'audience',
          'scope'
        ];
        return requiredProperties.every(prop => code.includes(prop));
        
      case '03':
        // For step 3, check for Passport initialization
        return code.includes('passport.Passport') && code.includes('imtblConfig');
        
      case '04':
        // For step 4, check for NFT transfer functionality
        return code.includes('connectEvm') && 
               code.includes('BrowserProvider') && 
               code.includes('Contract') && 
               code.includes('safeTransferFrom');
        
      default:
        // Default validation - normalize whitespace and compare
        const normalizedCode = code.trim().replace(/\s+/g, ' ');
        const normalizedSolution = solution.trim().replace(/\s+/g, ' ');
        return normalizedCode === normalizedSolution;
    }
  };
  
  const handleCodeValidation = (stepId: string, isValid: boolean) => {
    if (isValid) {
      setStepCompleted({
        ...stepCompleted,
        [stepId]: true,
      });
    } else {
      // If code becomes invalid, remove the completion status
      const updatedStepCompleted = { ...stepCompleted };
      delete updatedStepCompleted[stepId];
      setStepCompleted(updatedStepCompleted);
    }
  };
  
  // Function to reset the code editor to its starting state
  const resetCodeEditor = () => {
    if (currentStep.codeChallenge) {
      // Remove the current step's code from the codeByStep state
      const updatedCodeByStep = { ...codeByStep };
      delete updatedCodeByStep[currentStep.id];
      setCodeByStep(updatedCodeByStep);
      
      // Remove the completion status for this step
      const updatedStepCompleted = { ...stepCompleted };
      delete updatedStepCompleted[currentStep.id];
      setStepCompleted(updatedStepCompleted);
      
      // Increment the resetKey to force the CodeEditor to reload
      setResetKey(prevKey => prevKey + 1);
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
  
  const handleChecklistComplete = (stepId: string, isCompleted: boolean) => {
    // Keep track of the overall completion status for the step
    setChecklistsCompleted(prev => ({
      ...prev,
      [stepId]: isCompleted
    }));
    
    // Update step completion status based on checklist status
    if (isCompleted) {
      setStepCompleted(prev => ({
        ...prev,
        [stepId]: true,
      }));
    } else {
      // If checklist is uncompleted, mark step as incomplete
      const updatedStepCompleted = { ...stepCompleted };
      delete updatedStepCompleted[stepId];
      setStepCompleted(updatedStepCompleted);
    }
  };
  
  // Add a function to handle individual checklist item toggling
  const handleChecklistItemToggle = (stepId: string, itemId: string, completed: boolean) => {
    // Update the specific item's completion status
    setChecklistsCompleted(prev => {
      const updated = { ...prev };
      if (completed) {
        updated[`${stepId}-${itemId}`] = true;
      } else {
        delete updated[`${stepId}-${itemId}`];
      }
      return updated;
    });
    
    // No need to check for all items completed here as that's done in the render function
  };
  
  const handleChecklistItemInputChange = (stepId: string, itemId: string, value: string) => {
    // Store the input value
    setChecklistInputValues(prev => ({
      ...prev,
      [`${stepId}-${itemId}-value`]: value
    }));
    
    // For client ID, consider it valid if it matches typical client ID format
    // This is just a simple validation - adjust as needed
    if (itemId === 'client-id') {
      const isValid = value.trim().length > 8; // Simple validation - at least 8 chars
      
      setChecklistsCompleted(prev => {
        const updated = { ...prev };
        if (isValid) {
          updated[`${stepId}-${itemId}`] = true;
        } else {
          delete updated[`${stepId}-${itemId}`];
        }
        return updated;
      });
    }
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
  
  // Update the logic for current step completion
  const isContentOnlyStep = !hasRealCodeChallenge(currentStep) && !currentStep.quiz && !currentStep.checklist;
  
  // Determine if all checklist items are completed
  let allChecklistItemsCompleted = true;
  
  if (currentStep.checklist) {
    console.log("Checking checklist completion for:", currentStep.checklist.items);
    console.log("Completed items:", checklistsCompleted);
    
    allChecklistItemsCompleted = currentStep.checklist.items.every(item => {
      const isCompleted = !!checklistsCompleted[`${currentStep.id}-${item.id}`];
      console.log(`Item ${item.id} completed:`, isCompleted);
      return isCompleted;
    });
    
    console.log("All items completed:", allChecklistItemsCompleted);
  }
  
  // A step is considered completed if it's marked as completed or is content-only
  // For steps with checklists, all items must be completed
  // For code challenges, the code must match the solution
  const isCurrentStepCompleted = 
    stepCompleted[currentStep.id] || 
    (isContentOnlyStep && !currentStep.checklist) || 
    (currentStep.checklist && allChecklistItemsCompleted);

  // Check if the current step has a code challenge that needs to be completed
  const hasUncompletedCodeChallenge = 
    hasRealCodeChallenge(currentStep) && 
    !stepCompleted[currentStep.id];
  
  // Calculate content height based on window height, minus headers and footers
  const contentHeight = windowHeight - 220; // 220px accounts for headers, footers, margins
  
  // Add a new function to reset the entire lesson
  const resetLesson = () => {
    setIsResetting(true);
  };
  
  return (
    <div className="w-full px-4 py-2">
      <h1 className="text-3xl font-bold mb-2 gradient-text">{lesson.title}</h1>
      <p className="text-gray-300 mb-6">{lesson.description}</p>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-4">
        {/* Only show step title if content doesn't start with a heading */}
        {!contentStartsWithHeading && (
          <h2 className="text-2xl font-bold mb-4 text-gray-900">{currentStep.title}</h2>
        )}
        
        {/* Reset buttons for code editor and lesson */}
        <div className="flex justify-end mb-2" style={{ position: 'absolute', right: '40px', marginTop: '-9px' }}>
          {hasRealCodeChallenge(currentStep) && (
            <button
              onClick={resetCodeEditor}
              className="btn-immutable-tiny-inverted mr-2"
            >
              Reset Code
            </button>
          )}
          <button
            onClick={resetLesson}
            className="btn-immutable-tiny-inverted"
             style={{ marginLeft: '10px'}}
          >
            Reset Lesson
          </button>
        </div>
        
        {/* don't change this height */}
        <div className="flex flex-col lg:flex-row gap-6" style={{ height: `calc(100vh - 445px)` }}>
          {/* Left side: Instructions/Content */}
          <div className={`${hasRealCodeChallenge(currentStep) || currentStep.checklist ? 'lg:w-1/2' : 'w-full'} h-full overflow-auto pr-3`}>
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
          </div>
          
          {/* Right side: Code Editor, Checklist, or Quiz */}
          {hasRealCodeChallenge(currentStep) && (
            <div className="lg:w-1/2 h-full flex flex-col">
              <h3 className="text-xl font-semibold mb-2">Code Challenge</h3>
              <div className="flex-grow" style={{ height: 'calc(100% - 32px)' }}>
                <CodeEditor 
                  key={`${currentStep.id}-${resetKey}`}
                  defaultValue={codeByStep[currentStep.id] || currentStep.codeChallenge!.defaultCode}
                  language={currentStep.codeChallenge!.language || 'typescript'}
                  onChange={(code) => handleCodeChange(currentStep.id, code)}
                  onValidate={(isValid) => handleCodeValidation(currentStep.id, isValid)}
                  validateCode={(code) => validateCode(code, currentStep.codeChallenge?.solution || '')}
                  height="100%"
                />
              </div>
            </div>
          )}
          
          {/* Checklist on right side when there's no code challenge */}
          {!hasRealCodeChallenge(currentStep) && currentStep.checklist && (
            <div className="lg:w-1/2 h-full flex flex-col">
              <div className="bg-violet-50 border-l-4 border-violet-500 p-5 rounded-md h-auto h-full">
                <h3 className="text-xl font-semibold mb-4 text-violet-900">Setup Checklist</h3>
                <p className="text-gray-700 mb-4">Complete these steps before moving to the next lesson:</p>
                <Checklist 
                  items={currentStep.checklist.items.map(item => ({
                    ...item,
                    type: item.type as ('checkbox' | 'input' | undefined),
                    completed: !!checklistsCompleted[`${currentStep.id}-${item.id}`],
                    inputValue: item.type === 'input' ? 
                      checklistInputValues[`${currentStep.id}-${item.id}-value`] || '' : undefined
                  }))}
                  onComplete={(isCompleted) => handleChecklistComplete(currentStep.id, isCompleted)}
                  onItemToggle={(itemId, completed) => handleChecklistItemToggle(currentStep.id, itemId, completed)}
                  onInputChange={(itemId, value) => handleChecklistItemInputChange(currentStep.id, itemId, value)}
                />
              </div>
            </div>
          )}
          
          {/* Quiz on right side when there's no code challenge or checklist */}
          {!hasRealCodeChallenge(currentStep) && !currentStep.checklist && currentStep.quiz && (
            <div className="lg:w-1/2 h-full flex flex-col">
              <div className="bg-white rounded-lg shadow-md h-full overflow-auto">
                <Quiz 
                  questions={currentStep.quiz} 
                  onComplete={(score, total) => handleQuizComplete(currentStep.id, score, total)}
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
                ? 'btn-immutable-sm-disabled'
                : 'btn-immutable-sm-inverted'
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
              <button
                onClick={handleNextStep}
                disabled={
                  (currentStep.checklist && !allChecklistItemsCompleted) ||
                  hasUncompletedCodeChallenge
                }
                className={
                  (currentStep.checklist && !allChecklistItemsCompleted) ||
                  hasUncompletedCodeChallenge
                    ? 'btn-immutable-sm-disabled'
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