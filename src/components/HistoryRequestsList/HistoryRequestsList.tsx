import { FC } from 'react';

import urlToRequestTransform from '@/utils/urlToRequestTransform';
import { Container, List, ListItem, ListItemText } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Link from 'next/link';

import { HistoryRequestsListProps } from './types';

export const HistoryRequestsList: FC<HistoryRequestsListProps> = ({ list }) => {
  return (
    <Container>
      <Grid container spacing={2} width='100%'>
        <Grid size={12} sx={{ padding: '1rem', width: '100%', backgroundColor: '#fff' }}>
          <List>
            {list.map((encodeUrl, index) => {
              const request = urlToRequestTransform(encodeUrl);
              if (!request) return null;
              const { url, method } = request;

              return (
                <ListItem key={index}>
                  <Link href={encodeUrl}>
                    <ListItemText primary={`${index + 1}. ${method} ${url}`} />
                  </Link>
                </ListItem>
              );
            })}
          </List>
        </Grid>
      </Grid>
    </Container>
  );
};
