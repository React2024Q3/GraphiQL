import { FunctionComponent, PropsWithChildren } from 'react';

import dynamic from 'next/dynamic';

const ClientOnly: FunctionComponent<PropsWithChildren> = ({ children }) => children;

export default dynamic(() => Promise.resolve(ClientOnly), {
  ssr: false,
});
