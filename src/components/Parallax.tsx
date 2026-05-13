import { motion, useScroll, useTransform, type MotionStyle } from 'framer-motion';
import { useRef, type ReactNode, type ElementType } from 'react';

interface ParallaxProps {
  children: ReactNode;
  /** Travel range in percent of own height. Negative = moves up while scrolling. */
  offset?: number;
  className?: string;
  as?: ElementType;
  style?: MotionStyle;
}

/** Wrap an element to translate it on the Y axis as it moves through the viewport. */
export function Parallax({ children, offset = 20, className, as = 'div', style }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [`${offset}%`, `${-offset}%`]);
  const MotionTag = motion(as);
  return (
    <MotionTag ref={ref} style={{ ...style, y }} className={className}>
      {children}
    </MotionTag>
  );
}

/** Parallax image wrapper that keeps the image covering its container by over-scaling it. */
export function ParallaxImage({
  src,
  alt,
  className,
  imgClassName,
  offset = 15,
  width,
  height,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  offset?: number;
  width?: number;
  height?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [`-${offset}%`, `${offset}%`]);
  return (
    <div ref={ref} className={className} style={{ overflow: 'hidden' }}>
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        width={width}
        height={height}
        style={{ y, scale: 1 + offset / 50 }}
        className={imgClassName ?? 'w-full h-full object-cover'}
      />
    </div>
  );
}