import { KeyValuePair } from '@/types&interfaces/types';

const CONTENT_TYPE = 'content-type';
const JSON_TYPE = 'application/json';
const TEXT_TYPE = 'text/plain';

export default function switchTextJsonHeader(
  isJson: boolean,
  headers: KeyValuePair[]
): KeyValuePair[] {
  const emptyHeader = headers.filter(({ key }) => key !== CONTENT_TYPE);
  const type = isJson ? JSON_TYPE : TEXT_TYPE;
  const result: KeyValuePair[] = [
    { key: CONTENT_TYPE, value: type, editable: false },
    ...emptyHeader,
  ];
  return result;
}
