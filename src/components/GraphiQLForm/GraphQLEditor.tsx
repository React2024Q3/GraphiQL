import { useEffect, useState } from 'react';

import CodeMirror from '@uiw/react-codemirror';
//import { graphql } from 'cm6-graphql';
import {
  graphql,
  GraphQLSchema,
  IntrospectionSchema,
  buildClientSchema,
  getIntrospectionQuery,
} from 'graphql';

async function fetchSchema(url: string) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: getIntrospectionQuery(),
    }),
  });

  const result = await response.json();
  return buildClientSchema(result.data);
}

export const GraphQLEditor = ({ url, initialQuery }: { url: string; initialQuery: string }) => {
  const [schema, setSchema] = useState<GraphQLSchema | undefined>(undefined);
  useEffect(() => {
    async function loadEditor() {
      setSchema(await fetchSchema(url));
    }

    loadEditor();
  }, [url]);
  return <CodeMirror value={initialQuery} height='200px' /*extensions={graphql(schema)}*/ />;
};

// const view = new EditorView({
//   doc: `mutation mutationName {
//     setString(value: "newString")
//   }`,
//   extensions: [basicSetup, graphql(myGraphQLSchema)],
//   parent: document.body,
// });
