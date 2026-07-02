import { motion } from 'framer-motion';

export default function FadeIn({ 
  children, 
  direction = 'up', // 'up', 'down', 'left', 'right', 'none'
  delay = 0, 
  duration = 0.6,
  className = "" 
}) {
  const directions = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { x: 40, y: 0 },
    right: { x: -40, y: 0 },
    none: { x: 0, y: 0 }
  };

  return (
    <motion.div
      className={className}
      initial={{ 
        opacity: 0, 
        ...directions[direction] 
      }}
      whileInView={{ 
        opacity: 1, 
        x: 0, 
        y: 0 
      }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: duration,
        delay: delay,
        ease: [0.25, 0.25, 0, 1] // Custom smooth easing
      }}
    >
      {children}
    </motion.div>
  );
}
