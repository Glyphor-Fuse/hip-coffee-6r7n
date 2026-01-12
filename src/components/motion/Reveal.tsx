import React, { useRef } from 'react';
import { motion, useInView, useAnimation, Variant } from 'framer-motion';
import { useReducedMotion } from './useReducedMotion';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  width?: 'fit-content' | '100%';
  variant?: 'text' | 'image';
}

export const Reveal: React.FC<RevealProps> = ({ 
  children, 
  className = "", 
  delay = 0, 
  width = "fit-content",
  variant = 'text'
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const shouldReduceMotion = useReducedMotion();

  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 1,
        ease: [0.16, 1, 0.3, 1],
        delay: delay
      }
    }
  };

  const imageVariants = {
    hidden: { clipPath: 'inset(100% 0 0 0)' },
    visible: {
      clipPath: 'inset(0 0 0 0)',
      transition: {
        duration: 1.2,
        ease: [0.77, 0, 0.175, 1],
        delay: delay
      }
    }
  };

  const selectedVariant = variant === 'image' ? imageVariants : textVariants;

  return (
    <div ref={ref} style={{ width }} className={className}>
      <motion.div
        variants={selectedVariant}
        initial={shouldReduceMotion ? "visible" : "hidden"}
        animate={isInView ? "visible" : "hidden"}
      >
        {children}
      </motion.div>
    </div>
  );
};