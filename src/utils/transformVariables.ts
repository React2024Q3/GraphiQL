import { KeyValuePair } from '@/types&interfaces/types';

export default function transformVariables(str: string, vars: KeyValuePair[]) {
  const result = vars.reduce((a, pair) => {
    if (pair.editable) return a;
    return a.replaceAll(`{{${pair.key}}}`, pair.value);
  }, str);

  return result;
}
