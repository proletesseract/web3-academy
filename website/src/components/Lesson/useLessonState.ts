import { useState, useEffect } from 'react';
import { LessonStep } from './types';

interface UseLessonStateProps {
  lessonId: string;
  steps: LessonStep[];
}

export const useLessonState = ({ lessonId, steps }: UseLessonStateProps) => {
  const [isResetting, setIsResetting] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(() => {
    const storedIndex = localStorage.getItem(`lesson-${lessonId}-step-index`);
    return storedIndex ? parseInt(storedIndex, 10) : 0;
  });
  
  const [codeByStep, setCodeByStep] = useState<Record<string, string>>(() => {
    const storedCode = localStorage.getItem(`lesson-${lessonId}-code`);
    return storedCode ? JSON.parse(storedCode) : {};
  });
  
  const [stepCompleted, setStepCompleted] = useState<Record<string, boolean>>(() => {
    const storedCompleted = localStorage.getItem(`lesson-${lessonId}-completed`);
    return storedCompleted ? JSON.parse(storedCompleted) : {};
  });
  
  const [checklistsCompleted, setChecklistsCompleted] = useState<Record<string, boolean>>(() => {
    const storedChecklists = localStorage.getItem(`lesson-${lessonId}-checklists`);
    return storedChecklists ? JSON.parse(storedChecklists) : {};
  });
  
  const [checklistInputValues, setChecklistInputValues] = useState<Record<string, string>>(() => {
    const storedInputValues = localStorage.getItem(`lesson-${lessonId}-input-values`);
    return storedInputValues ? JSON.parse(storedInputValues) : {};
  });
  
  const [initialized, setInitialized] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem(`lesson-${lessonId}-step-index`, currentStepIndex.toString());
  }, [currentStepIndex, lessonId]);

  useEffect(() => {
    localStorage.setItem(`lesson-${lessonId}-code`, JSON.stringify(codeByStep));
  }, [codeByStep, lessonId]);

  useEffect(() => {
    localStorage.setItem(`lesson-${lessonId}-completed`, JSON.stringify(stepCompleted));
  }, [stepCompleted, lessonId]);

  useEffect(() => {
    localStorage.setItem(`lesson-${lessonId}-checklists`, JSON.stringify(checklistsCompleted));
  }, [checklistsCompleted, lessonId]);

  useEffect(() => {
    localStorage.setItem(`lesson-${lessonId}-input-values`, JSON.stringify(checklistInputValues));
  }, [checklistInputValues, lessonId]);

  // Initialize auto-completion for content-only steps
  useEffect(() => {
    if (!initialized) {
      const completedSteps = { ...stepCompleted };
      
      steps.forEach(step => {
        if (!step.codeChallenge && !step.quiz && !step.checklist) {
          completedSteps[step.id] = true;
        }
      });
      
      setStepCompleted(completedSteps);
      setInitialized(true);
    }
  }, [steps, initialized]);

  // Reset effect
  useEffect(() => {
    if (isResetting) {
      localStorage.removeItem(`lesson-${lessonId}-step-index`);
      localStorage.removeItem(`lesson-${lessonId}-code`);
      localStorage.removeItem(`lesson-${lessonId}-completed`);
      localStorage.removeItem(`lesson-${lessonId}-checklists`);
      localStorage.removeItem(`lesson-${lessonId}-input-values`);
      
      setCurrentStepIndex(0);
      setCodeByStep({});
      setStepCompleted({});
      setChecklistsCompleted({});
      setChecklistInputValues({});
      setResetKey(0);
      
      setIsResetting(false);
    }
  }, [isResetting, lessonId]);

  const resetLesson = () => {
    setIsResetting(true);
  };

  return {
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
  };
}; 