'use client';

import { useState, useEffect, useRef } from 'react';

interface AnimatedCounterProps {
  value: string;
  duration?: number;
}

export default function AnimatedCounter({ value, duration = 2000 }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Parse the target value (e.g., "2.5K+" -> 2500)
  const parseValue = (val: string): number => {
    const cleaned = val.replace(/[^0-9.]/g, '');
    const num = parseFloat(cleaned);
    if (val.includes('K')) return num * 1000;
    if (val.includes('M')) return num * 1000000;
    return num;
  };

  // Format back to original style
  const formatValue = (num: number): string => {
    if (value.includes('K+')) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K+';
    if (value.includes('M+')) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M+';
    if (value.includes('+')) return Math.floor(num) + '+';
    return Math.floor(num).toString();
  };

  const targetValue = parseValue(value);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const increment = targetValue / (duration / 16);
          const timer = setInterval(() => {
            start += increment;
            if (start >= targetValue) {
              setCount(targetValue);
              clearInterval(timer);
            } else {
              setCount(start);
            }
          }, 16);
          return () => clearInterval(timer);
        }
      },
      { threshold: 0.5 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }
    return () => observer.disconnect();
  }, [targetValue, duration, hasAnimated]);

  return <span ref={countRef}>{hasAnimated ? formatValue(count) : '0'}</span>;
}
