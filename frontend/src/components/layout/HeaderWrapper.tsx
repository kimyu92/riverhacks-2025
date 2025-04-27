import { useState } from 'react';
import Header from './Header';

export default function HeaderWrapper() {
  const [isOffline, setIsOffline] = useState(false);

  return (
    <Header
      isOffline={isOffline}
      setIsOffline={setIsOffline}
    />
  );
}
