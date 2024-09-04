import { Link } from '@/navigation';
import { Button } from '@mui/material';

export function CommonLinks() {
  return (
    <>
      <li>
        <Link href='/rest'>
          <Button variant='contained'>REST Client</Button>
        </Link>
      </li>
      <li>
        <Link href='/graphiql'>
          <Button variant='contained'>GraphiQL Client</Button>
        </Link>
      </li>
    </>
  );
}
