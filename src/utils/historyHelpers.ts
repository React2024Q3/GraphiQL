import { RequestType } from '@/app/[locale]/history/types';

export const saveRequestToHistory = (request: RequestType) => {
  const history: RequestType[] = JSON.parse(localStorage.getItem('request_history') || '[]');
  history.push({ ...request, timestamp: Date.now() });
  localStorage.setItem('request_history', JSON.stringify(history));
};

export const getLinkFromRequest = (request: RequestType) => {
  const { method } = request;
  const route = method === 'GRAPHQL' ? 'graphiql' : 'rest';
  return `/${route}`;
};
