import { useEffect, useRef, useState } from 'react';
import { useInView, motion } from 'framer-motion';

interface CountUpProps {
  value: string;
  duration?: number;
  className?: string;
}

export function CountUp({ value, duration = 1.6, className }: CountUpProps) {
  const match = value.match(/^([\d.,]+)(.*)$/);
  const raw = match ? match[1] : value;
  const suffix = match ? match[2] : '';
  const numeric = Number(raw.replace(/\./g, '').replace(',', '.'));
  const isNumber = !Number.isNaN(numeric);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView || !isNumber) return;
    const start = performance.now();
    let frame = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - p, 3);
      setN(numeric * eased);
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, numeric, duration, isNumber]);

  if (!isNumber) {
    return (
      <motion.span ref={ref} className={className} initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : { opacity: 0 }} transition={{ duration: 0.6 }}>
        {value}
      </motion.span>
    );
  }

  const formatted = Math.round(n).toLocaleString('de-DE');
  return (
    <span ref={ref} className={className}>
      {formatted}
      {suffix}
    </span>
  );
}
