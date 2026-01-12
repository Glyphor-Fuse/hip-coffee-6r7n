import { useMediaQuery } from 'framer-motion';

export function useReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}