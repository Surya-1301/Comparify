
import { SessionProvider } from 'next-auth/react';
import '../styles/globals.css';
import { LocationProvider } from '../context/LocationContext';

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <LocationProvider>
        <Component {...pageProps} />
      </LocationProvider>
    </SessionProvider>
  );
}
