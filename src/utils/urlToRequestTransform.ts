import { ARRAY_METHODS } from '@/shared/constants';
import { parseQueryUrlFromHistoryPath } from '../data/graphQL/graphQLHelper'

export default function urlToRequestTransform(encodedUrl: string) {
  if(encodedUrl.includes('graphiql')) {
    return {method: 'GraphQL', url: parseQueryUrlFromHistoryPath(encodedUrl.replace('graphiql/', ''))}
  }

  const method = ARRAY_METHODS.find((method) => encodedUrl.includes(`${method}/`));
  if (!method) return null;

  let path = encodedUrl.split('?')[0].split(`${method}/`)[1];
  if (!path) return null;
  path = path.split('/')[0];
  const url = atob(decodeURIComponent(path));

  return { method, url };
}
