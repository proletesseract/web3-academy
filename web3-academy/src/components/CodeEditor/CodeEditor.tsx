import React from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  defaultValue: string;
  language?: string;
  height?: string;
  onChange?: (value: string | undefined) => void;
  onValidate?: (isValid: boolean) => void;
  validateCode?: (code: string) => boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  defaultValue,
  language = 'typescript',
  height = '400px',
  onChange,
  onValidate,
  validateCode,
}) => {
  const handleEditorChange = (value: string | undefined) => {
    if (onChange) {
      onChange(value);
    }
    
    if (validateCode && onValidate && value) {
      const isValid = validateCode(value);
      onValidate(isValid);
    }
  };

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden">
      <Editor
        height={height}
        defaultLanguage={language}
        defaultValue={defaultValue}
        onChange={handleEditorChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default CodeEditor; 