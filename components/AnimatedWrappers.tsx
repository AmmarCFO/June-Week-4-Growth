import React from 'react';
import { motion, Variants } from 'framer-motion';

// General purpose fade-in-from-bottom animation
export const FadeInUp: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </motion.div>
  );
};

// Staggered animation for grid containers
const gridVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

export const StaggeredGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-3 gap-8"
      variants={gridVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </motion.div>
  );
};

// Animation for items within a staggered grid
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut'
    }
  },
};

export const AnimatedItem: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <motion.div variants={itemVariants}>
      {children}
    </motion.div>
  );
};
