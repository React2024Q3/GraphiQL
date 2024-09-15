'use server';

import {
  IntrospectionQuery,
  buildClientSchema,
  getIntrospectionQuery,
  validateSchema,
} from 'graphql';

export const getSchema = async (url: string): Promise<JSON | null> => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: getIntrospectionQuery() }),
    });
    const { data } = await response.json();
    const schema = buildClientSchema(data as IntrospectionQuery);
    if (!validateSchema(schema)) {
      throw new Error('Invalid schema');
    }
    return data;
  } catch (e) {
    console.error('Error fetching GraphQL schema:', e);
    return null;
  }
};
