import { useState, useEffect, useRef } from 'react';

export function useCountAnimation(target, duration = 350) {
  const [value, setValue] = useState(target);
  const prevRef = useRef(target);
  const rafRef  = useRef(null);

  useEffect(() => {
    if (target === prevRef.current) return;

    const start    = prevRef.current;
    const startTs  = performance.now();

    const animate = (now) => {
      const progress = Math.min((now - startTs) / duration, 1);
      const eased    = 1 - (1 - progress) ** 3;

      setValue(start + (target - start) * eased);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        prevRef.current = target;
        setValue(target);
      }
    };

    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return value;
}
