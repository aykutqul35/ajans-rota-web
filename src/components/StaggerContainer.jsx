import React from 'react';
import { motion } from 'framer-motion';

export default function StaggerContainer({ 
  children, 
  staggerDelay = 0.1, 
  className = "" 
}) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay
      }
    }
  };

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = "", ...props }) {
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.25, 0, 1]
      }
    }
  };

  return (
    <motion.div className={className} variants={itemVariants} {...props}>
      {children}
    </motion.div>
  );
}
