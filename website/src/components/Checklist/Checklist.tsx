import React, { useState, useEffect } from 'react';

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  type?: 'checkbox' | 'input';
  inputValue?: string;
  placeholder?: string;
  validationPattern?: string;
}

export interface ChecklistProps {
  items: ChecklistItem[];
  onComplete: (allCompleted: boolean) => void;
  onItemToggle: (itemId: string, completed: boolean) => void;
  onInputChange?: (itemId: string, value: string) => void;
}

const Checklist: React.FC<ChecklistProps> = ({ items, onComplete, onItemToggle, onInputChange }) => {
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>(items);
  
  // Update items when props change
  useEffect(() => {
    setChecklistItems(items);
  }, [items]);
  
  const toggleItem = (id: string) => {
    const updatedItems = checklistItems.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setChecklistItems(updatedItems);
    
    // Find the toggled item and get its new state
    const toggledItem = updatedItems.find(item => item.id === id);
    if (toggledItem) {
      onItemToggle(id, toggledItem.completed);
    }
    
    // Check if all items are completed
    const allCompleted = updatedItems.every(item => item.completed);
    onComplete(allCompleted);
  };
  
  const handleInputChange = (id: string, value: string) => {
    // Update the item's input value
    const updatedItems = checklistItems.map(item => 
      item.id === id ? { ...item, inputValue: value } : item
    );
    setChecklistItems(updatedItems);
    
    // Call the parent's onInputChange handler
    if (onInputChange) {
      onInputChange(id, value);
    }
    
    // For input items, check if the input matches the validation pattern
    const item = updatedItems.find(item => item.id === id);
    if (item && item.type === 'input' && item.validationPattern) {
      const regex = new RegExp(item.validationPattern);
      const isValid = regex.test(value);
      
      // Only mark as complete if valid and not already marked
      if (isValid !== item.completed) {
        onItemToggle(id, isValid);
      }
    }
  };
  
  return (
    <ul className="space-y-3">
      {checklistItems.map(item => (
        <li key={item.id} className="flex items-start">
          {item.type === 'input' ? (
            <>
              <div className="w-full">
                <label htmlFor={item.id} className="text-gray-800 font-medium block mb-1">
                  {item.text}
                </label>
                <input
                  type="text"
                  id={item.id}
                  value={item.inputValue || ''}
                  onChange={(e) => handleInputChange(item.id, e.target.value)}
                  placeholder={item.placeholder || 'Enter value...'}
                  className={`w-full p-2 border rounded-md text-gray-800 placeholder-gray-500 ${
                    item.completed 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-300 focus:border-violet-500 focus:ring focus:ring-violet-200'
                  }`}
                />
              </div>
            </>
          ) : (
            <>
              <input
                type="checkbox"
                id={item.id}
                checked={item.completed}
                onChange={() => toggleItem(item.id)}
                className="mt-1 mr-3 h-5 w-5 accent-violet-600"
              />
              <label htmlFor={item.id} className="text-gray-800 font-medium cursor-pointer">
                {item.text}
              </label>
            </>
          )}
        </li>
      ))}
    </ul>
  );
};

export default Checklist; 