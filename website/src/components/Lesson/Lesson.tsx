import React from 'react';
import ReactMarkdown from 'react-markdown';
import CodeEditor from '../CodeEditor/CodeEditor';
import Quiz from '../Quiz/Quiz';
import Checklist from '../Checklist';
import type { Lesson, LessonStep } from './types';
import { markdownStyles } from './markdownStyles';
import { useLessonState } from './useLessonState';
import { validateCode } from './codeValidation';

interface LessonProps {
  lesson: Lesson;
  onComplete?: () => void;
}

const Lesson: React.FC<LessonProps> = ({ lesson, onComplete }) => {
  const {
    currentStepIndex,
    setCurrentStepIndex,
    codeByStep,
    setCodeByStep,
    stepCompleted,
    setStepCompleted,
    checklistsCompleted,
    setChecklistsCompleted,
    checklistInputValues,
    setChecklistInputValues,
    resetKey,
    setResetKey,
    resetLesson,
  } = useLessonState({ lessonId: lesson.id, steps: lesson.steps });

  const currentStep = lesson.steps[currentStepIndex];
  const contentStartsWithHeading = currentStep?.content.trim().startsWith('# ');

  const handleCodeChange = (stepId: string, code: string | undefined) => {
    if (code) {
      setCodeByStep({
        ...codeByStep,
        [stepId]: code,
      });
      
      const isValid = validateCode(code, currentStep.codeChallenge?.solution || '', stepId);
      handleCodeValidation(stepId, isValid);
    }
  };

  const handleCodeValidation = (stepId: string, isValid: boolean) => {
    if (isValid) {
      setStepCompleted({
        ...stepCompleted,
        [stepId]: true,
      });
    } else {
      const updatedStepCompleted = { ...stepCompleted };
      delete updatedStepCompleted[stepId];
      setStepCompleted(updatedStepCompleted);
    }
  };

  const resetCodeEditor = () => {
    if (currentStep.codeChallenge) {
      const updatedCodeByStep = { ...codeByStep };
      delete updatedCodeByStep[currentStep.id];
      setCodeByStep(updatedCodeByStep);
      
      const updatedStepCompleted = { ...stepCompleted };
      delete updatedStepCompleted[currentStep.id];
      setStepCompleted(updatedStepCompleted);
      
      setResetKey(prevKey => prevKey + 1);
    }
  };

  const handleQuizComplete = (stepId: string, score: number, total: number) => {
    const passed = score / total >= 0.7;
    setStepCompleted({
      ...stepCompleted,
      [stepId]: passed,
    });
  };

  const handleChecklistComplete = (stepId: string, isCompleted: boolean) => {
    setChecklistsCompleted(prev => ({
      ...prev,
      [stepId]: isCompleted
    }));
    
    if (isCompleted) {
      setStepCompleted(prev => ({
        ...prev,
        [stepId]: true,
      }));
    } else {
      const updatedStepCompleted = { ...stepCompleted };
      delete updatedStepCompleted[stepId];
      setStepCompleted(updatedStepCompleted);
    }
  };

  const handleChecklistItemToggle = (stepId: string, itemId: string, completed: boolean) => {
    setChecklistsCompleted(prev => {
      const updated = { ...prev };
      if (completed) {
        updated[`${stepId}-${itemId}`] = true;
      } else {
        delete updated[`${stepId}-${itemId}`];
      }
      return updated;
    });
  };

  const handleChecklistItemInputChange = (stepId: string, itemId: string, value: string) => {
    setChecklistInputValues(prev => ({
      ...prev,
      [`${stepId}-${itemId}-value`]: value
    }));
    
    if (itemId === 'client-id') {
      const isValid = value.trim().length > 8;
      
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

  const hasRealCodeChallenge = (step: LessonStep): boolean => {
    if (!step.codeChallenge) return false;
    
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

  const isContentOnlyStep = !hasRealCodeChallenge(currentStep) && !currentStep.quiz && !currentStep.checklist;
  
  const allChecklistItemsCompleted = currentStep.checklist
    ? currentStep.checklist.items.every(item => 
        !!checklistsCompleted[`${currentStep.id}-${item.id}`]
      )
    : true;

  const isCurrentStepCompleted = 
    stepCompleted[currentStep.id] || 
    (isContentOnlyStep && !currentStep.checklist) || 
    (currentStep.checklist && allChecklistItemsCompleted);

  const hasUncompletedCodeChallenge = 
    hasRealCodeChallenge(currentStep) && 
    !stepCompleted[currentStep.id];

  return (
    <div className="w-full px-4 py-2">
      <h1 className="text-3xl font-bold mb-2 gradient-text">{lesson.title}</h1>
      <p className="text-gray-300 mb-6">{lesson.description}</p>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-4">
        {!contentStartsWithHeading && (
          <h2 className="text-2xl font-bold mb-4 text-gray-900">{currentStep.title}</h2>
        )}
        
        <div className="flex justify-end mb-2" style={{ position: 'absolute', right: '15px', marginTop: '-70px' }}>
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
        
        <div className="flex flex-col lg:flex-row gap-6" style={{ height: `calc(100vh - 445px)` }}>
          <div className={`${hasRealCodeChallenge(currentStep) || currentStep.checklist || currentStep.quiz ? 'lg:w-1/2' : 'w-full'} h-full overflow-auto pr-3`}>
            <div className="prose max-w-none mb-6 prose-headings:text-gray-900 prose-p:text-gray-800 prose-strong:text-gray-900 prose-li:text-gray-800">
              <ReactMarkdown
                components={{
                  p: ({...props}) => <p className={markdownStyles.p} {...props} />,
                  h1: ({...props}) => <h1 className={markdownStyles.h1} {...props} />,
                  h2: ({...props}) => <h2 className={markdownStyles.h2} {...props} />,
                  h3: ({...props}) => <h3 className={markdownStyles.h3} {...props} />,
                  h4: ({...props}) => <h4 className={markdownStyles.h4} {...props} />,
                  ul: ({...props}) => <ul className={markdownStyles.ul} {...props} />,
                  ol: ({...props}) => <ol className={markdownStyles.ol} {...props} />,
                  li: ({...props}) => <li className={markdownStyles.li} {...props} />,
                  a: ({...props}) => <a className={markdownStyles.a} {...props} />,
                  blockquote: ({...props}) => <blockquote className={markdownStyles.blockquote} {...props} />,
                  code: ({...props}) => <code className={markdownStyles.code} {...props} />,
                  pre: ({...props}) => <pre className={markdownStyles.pre} {...props} />,
                  strong: ({...props}) => <strong className={markdownStyles.strong} {...props} />,
                  em: ({...props}) => <em className={markdownStyles.em} {...props} />,
                }}
              >
                {currentStep.content}
              </ReactMarkdown>
            </div>
          </div>
          
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
                  validateCode={(code) => validateCode(code, currentStep.codeChallenge?.solution || '', currentStep.id)}
                  height="100%"
                />
              </div>
            </div>
          )}
          
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
          
          {!hasRealCodeChallenge(currentStep) && !currentStep.checklist && currentStep.quiz && (
            <div className="lg:w-1/2 h-full flex flex-col">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-md h-auto h-full">
                <h3 className="text-xl font-semibold mb-4 text-blue-900">Knowledge Check</h3>
                <p className="text-gray-700 mb-4">Test your understanding of the concepts covered in this lesson:</p>
                <Quiz 
                  questions={currentStep.quiz} 
                  onComplete={(score, total) => handleQuizComplete(currentStep.id, score, total)}
                />
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200 sticky bottom-0 bg-white">
          <div className="flex items-center justify-between gap-4">
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
            
            <div className="flex-grow flex flex-col justify-center">
              <div className="text-center mb-1" style={{ position: 'absolute', left: '50%', marginTop: '50px' }}>
                <span className="text-xs font-medium text-gray-500">
                  Step {currentStepIndex + 1} of {lesson.steps.length}
                </span>
              </div>
              <div className="relative w-full h-2 rounded-full overflow-hidden">
                <div 
                  className="absolute top-0 left-0 w-full h-2 rounded-full"
                  style={{ 
                    background: 'linear-gradient(to right, var(--violet-immutable), var(--cyan-immutable))'
                  }}
                ></div>
                <div 
                  className="absolute top-0 right-0 h-2 bg-gray-200 rounded-r-full"
                  style={{ 
                    width: `${100 - ((currentStepIndex + (isCurrentStepCompleted ? 1 : 0)) / lesson.steps.length) * 100}%`
                  }}
                ></div>
              </div>
            </div>
            
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