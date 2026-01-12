import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

interface SignatureInteractionProps {
  children: React.ReactNode;
  type: 'text-reveal' | 'clip-reveal' | 'parallax' | 'marquee' | 'sticky-progress';
  className?: string;
}

export const SignatureInteraction: React.FC<SignatureInteractionProps> = ({ children, type, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  
  // Parallax logic
  const y = useTransform(scrollY, [0, 1000], [0, 200]);
  const opacity = useTransform(scrollY, [0, 700], [1, 0]);

  if (type === 'parallax') {
    return (
      <motion.div ref={ref} style={{ y, opacity }} className={className}>
        {children}
      </motion.div>
    );
  }

  // Default fallback for other types if not specifically implemented with unique logic here,
  // though 'text-reveal' and 'clip-reveal' are handled by the Reveal component in this project structure.
  // We will return children wrapped in a div for safety.
  return <div className={className}>{children}</div>;
};