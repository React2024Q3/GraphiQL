import { Methods } from '@/types&interfaces/enums';
import { KeyValuePair, MethodType } from '@/types&interfaces/types';

export default function changeUrlClient(
  method: MethodType,
  url: string,
  body: string,
  keyValuePairsHeader: KeyValuePair[]
): string {
  const currentKeyValuesHeader = keyValuePairsHeader.filter((el) => !el.editable);

  const encodedUrl = encodeURIComponent(btoa(url));
  const encodedBody =
    body && method !== Methods.GET && method !== Methods.DELETE
      ? encodeURIComponent(btoa(body))
      : '';

  let apiUrl = `${method}/${encodedUrl}${encodedBody ? `/${encodedBody}` : ''}`;

  if (keyValuePairsHeader && currentKeyValuesHeader.length) {
    const stringHeader = currentKeyValuesHeader
      .map(({ key, value }) => key + '=' + value)
      .join('&');
    apiUrl += '?' + stringHeader.replaceAll('/', '%2F');
  }

  window.history.replaceState(null, '', `/${apiUrl}`);
  return apiUrl;
}
