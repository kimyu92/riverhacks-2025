'use client';

import { useState } from 'react';
import Header from '@/components/Header';

export default function HeaderWrapper() {
  const [isOffline, setIsOffline] = useState(false);

  return (
    <Header
      isOffline={isOffline}
      setIsOffline={(value) => setIsOffline(value)}
    />
  );
}
