import { json } from '@codemirror/lang-json';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import CodeMirror from '@uiw/react-codemirror';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  isJsonMode?: boolean;
}

const CodeEditor = ({ value, onChange, isJsonMode = true }: CodeEditorProps) => {
  const handleBlur = () => {
    if (isJsonMode) {
      try {
        onChange(JSON.stringify(JSON.parse(value), null, 2));
      } catch (error) {
        console.warn('JSON formatting error: ', error);
      }
    }
  };

  const handleChange = (newValue: string) => {
    onChange(newValue);
  };

  return (
    <CodeMirror
      value={value}
      minHeight='250px'
      height='auto'
      theme={vscodeDark}
      extensions={isJsonMode ? [json()] : []}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );
};

export default CodeEditor;
