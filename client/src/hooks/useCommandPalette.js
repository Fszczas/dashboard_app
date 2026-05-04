import { useState, useEffect, useCallback } from 'react';

export function useCommandPalette() {
  const [open, setOpen] = useState(false);

  const toggle = useCallback(() => setOpen((v) => !v), []);
  const close  = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        toggle();
      }
      if (e.key === 'Escape') close();
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [toggle, close]);

  return { open, toggle, close };
}
