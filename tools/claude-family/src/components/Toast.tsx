import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  onDone: () => void;
}

export default function Toast({ message, onDone }: ToastProps) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setExiting(true), 1800);
    const remove = setTimeout(onDone, 2000);
    return () => {
      clearTimeout(timer);
      clearTimeout(remove);
    };
  }, [onDone]);

  return (
    <div className={`toast ${exiting ? 'exiting' : ''}`}>
      {message}
    </div>
  );
}
