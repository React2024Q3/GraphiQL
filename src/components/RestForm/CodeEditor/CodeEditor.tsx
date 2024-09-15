import { useState } from 'react';

import { useHandleError } from '@/shared/hooks/useHandleError';
import { json } from '@codemirror/lang-json';
import CodeMirror from '@uiw/react-codemirror';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  isJsonMode?: boolean;
}

const CodeEditor = ({ value, onChange, isJsonMode = true }: CodeEditorProps) => {
  const [error, setError] = useState<Error | null>(null);
  useHandleError(error);

  const handleBlur = () => {
    if (isJsonMode) {
      try {
        onChange(JSON.stringify(JSON.parse(value), null, 2));
      } catch (error) {
        setError(error as Error);
      }
    }
  };

  const handleChange = (newValue: string) => {
    onChange(newValue);
  };

  return (
    <>
      <CodeMirror
        value={value}
        minHeight='250px'
        height='auto'
        extensions={isJsonMode ? [json()] : []}
        onChange={handleChange}
        onBlur={handleBlur}
      />
    </>
  );
};

export default CodeEditor;
