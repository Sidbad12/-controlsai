// styles.ts
import { Variants } from 'framer-motion';

// ── Framer Motion Variants ───────────────────────────────────────────────────
export const msgVariants: Variants = {
  hidden : { opacity: 0, y: 20, scale: 0.98 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      type: "spring",
      stiffness: 400,
      damping: 30
    } 
  },
};
