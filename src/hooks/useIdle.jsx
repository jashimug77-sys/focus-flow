import { useState, useEffect } from 'react';

export function useIdle(timeout = 30000) {
  const [isIdle, setIsIdle] = useState(false);

  useEffect(() => {
    let timer;
    const handleActivity = () => {
      setIsIdle(false);
      clearTimeout(timer);
      timer = setTimeout(() => setIsIdle(true), timeout);
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    handleActivity(); // Initialize

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      clearTimeout(timer);
    };
  }, [timeout]);

  return isIdle;
}