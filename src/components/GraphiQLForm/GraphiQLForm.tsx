'use client';

import { FormEvent, useState } from 'react';
import { useEffect, useRef } from 'react';

import {
  composeGraphQLPostRequestBody,
  parseRequestHeadersString,
} from '@/data/graphQL/graphQLHelper';
import type { GraphQLQueryType } from '@/data/graphQL/graphQLQueryType';
import queryRM from '@/data/graphQL/queryRM.json';
import queryTODO from '@/data/graphQL/queryTODO.json';
import { urlSchema } from '@/utils/validation/helpers';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Button
} from '@mui/material';
import { ValidationError } from 'yup';

import ResponseDisplay from '../ResponseDisplay';
//import { graphql } from 'cm6-graphql';
//import { EditorView, basicSetup } from 'codemirror';
import { GraphQLEditor } from './GraphQLEditor';

// GraphQL Editor won't render/work unless URL (and hence schema) is set
const defaultURL = 'https://rickandmortyapi.com/graphql';

export default function GraphiQLForm() {

  const [url, setUrl] = useState<string>(defaultURL);

  // const fetcher = useRef<Fetcher | null>(null);

  const [query, setQuery] = useState<string>('');
  const [queryVariables, setQueryVariables] = useState<string>('{}');

  const [requestHeaders, setRequestHeaders] = useState<Record<string, string>>({
    'Content-Type': 'application/json',
  });
  const [responseData, setResponseData] = useState<JSON>();

  const [responseHeaders, setResponseHeaders] = useState<string>('');

  const exampleQueries = ['None', 'Rick&Morty', 'TODO app'];

  const [urlTextFieldValue, setUrlTextFieldValue] = useState<string>('');
  const [urlTextFieldError, setUrlTextFieldError] = useState<string>('');

  const [selectedExampleQueryName, setSelectedExampleQueryName] = useState<string>('None');

  // const {
  //   control,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm<{
  //   defaultValues: {
  //     url: '',
  //   },
  //   resolver: yupResolver(urlSchema),
  // });

  const validateURLTextField = (text: string) => {
    try {
      urlSchema.validateSync(text);
      // clear error if valid
      setUrlTextFieldError('');
      return true;
    } catch (error) {
      console.log(`value: ${text} is not valie dut to ${error}`);
      if (error instanceof ValidationError) {
        setUrlTextFieldError(error.message); // Set error message if validation fails
      } else {
        setUrlTextFieldError('URL is not valid');
      }
      return false;
    }
  };

  const handleURLTextFieldBlur = () => {
    const inputIsValid = validateURLTextField(urlTextFieldValue);
    if (inputIsValid) {
      setUrl(urlTextFieldValue);
    }
  };

  const handleURLTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrlTextFieldValue(event.target.value);
    validateURLTextField(event.target.value);
  };

  // useEffect(() => {
  //   fetcher.current = createGraphiQLFetcher({
  //     url: url,
  //   });
  // }, [url]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const encodedUrl = encodeURIComponent(btoa(url));
    const encodedBody = encodeURIComponent(
      btoa(composeGraphQLPostRequestBody(query, queryVariables))
    );
    try {
      console.log('sending request to our api route');
      const response = await fetch(`api/GRAPHQL/${encodedUrl}/${encodedBody}`, { method: 'POST' });
      console.log(`responsik status: $responsik.status`);
      const data = await response.json();

      console.log(`client received data: ${data}`);

      setResponseData(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleExampleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedExampleQueryName(e.target.value);

    let selectedExampleQuery;
    switch (e.target.value) {
      case exampleQueries[0]: {
        selectedExampleQuery = null;
        break;
      }
      case exampleQueries[1]: {
        selectedExampleQuery = queryRM;
        break;
      }
      case exampleQueries[2]: {
        selectedExampleQuery = queryTODO;
        break;
      }
      default: {
        selectedExampleQuery = null;
      }
    }

    setUrlTextFieldValue(selectedExampleQuery? selectedExampleQuery.url : '');
    setUrl(selectedExampleQuery? selectedExampleQuery.url : defaultURL);

    setQuery(selectedExampleQuery? selectedExampleQuery.query: '');
    //console.log(JSON.stringify(selectedExampleQuery.queryVariables));
    setQueryVariables(selectedExampleQuery? JSON.stringify(selectedExampleQuery.queryVariables): '{}');
    //console.log(`queryVariables: ${queryVariables}`);
    if ((selectedExampleQuery) &&  ('headers' in selectedExampleQuery)) {
      setRequestHeaders(parseRequestHeadersString(selectedExampleQuery['headers'] as string));
    } else {
      setRequestHeaders({
        'Content-Type': 'application/json',
      })
    }

  };

  return (
    <div>
      {/* <FormControl>
        <InputLabel id='example-query-select-label'>Query example</InputLabel>
        <Select
          labelId='example-query-select-label'
          id='example-query-select'
          value={''}
          label='Query example'
          onChange={handleExampleQueryChange}
        >
          <MenuItem value={exampleQueries[0]}>{exampleQueries[0]}</MenuItem>
          <MenuItem value={exampleQueries[1]}>{exampleQueries[1]}</MenuItem>
        </Select>
      </FormControl> */}
      <Box sx={{ display: 'flex', flexDirection: 'row-reverse' }}>
        <TextField
          select
          size='medium'
          sx={{ width: 200 }}
          label='Query example'
          value={selectedExampleQueryName}
          onChange={handleExampleQueryChange}
        >
          <MenuItem value={exampleQueries[0]}>{exampleQueries[0]}</MenuItem>
          <MenuItem value={exampleQueries[1]}>{exampleQueries[1]}</MenuItem>
          <MenuItem value={exampleQueries[2]}>{exampleQueries[2]}</MenuItem>
        </TextField>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        <TextField
          id='standard-basic'
          sx = {{width: '75%'}}
          value={urlTextFieldValue}
          onChange={handleURLTextFieldChange}
          label='URL'
          error={!!urlTextFieldError}
          helperText={urlTextFieldError}
          onBlur={handleURLTextFieldBlur}
        />
        <Button variant="contained" sx = {{width: '200px'}} onClick={handleSubmit}>Run</Button>

      </Box>
      <form onSubmit={handleSubmit}>
        {/* <div>
          <label>
            URL:
            <input type='text' defaultValue={url} onBlur={handleURLTextFieldBlur} required />
          </label>
        </div> */}
        {/* {url ? ( */}
          <GraphQLEditor url={url} initialQuery={query} initialQueryVariables={queryVariables}></GraphQLEditor>
        {/* ) : (
          <div>
            <label>
              Query:
              <input
                type='text'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                required
              />
            </label>
          </div>
        )} */}
        {/* /<button type='submit'>Send request</button> */}
      </form>
      <ResponseDisplay headers={responseHeaders} response={JSON.stringify(responseData, null, 2)} />
    </div>
  );
}
