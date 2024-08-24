'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/config';

export default function Home() {
  const [user] = useAuthState(auth);
  console.log('user', user);

  return (
    <main>
      <h2>RESTful</h2>
    </main>
  );
}
