'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  onClick?: () => void;
  delay?: number;
  glowColor?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  hoverEffect = true,
  onClick,
  delay = 0,
  glowColor = ''
}) => {
  const baseClasses = 'glass-panel overflow-hidden rounded-[var(--radius-card)] p-6';
  const interactionClasses = onClick ? 'cursor-pointer select-none' : '';
  
  // Style properties if custom glow is active
  const customStyle: React.CSSProperties = glowColor 
    ? { 
        boxShadow: `0 10px 30px -10px ${glowColor}`,
        borderColor: `${glowColor}33`
      } 
    : {};

  if (!hoverEffect) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay }}
        onClick={onClick}
        className={`${baseClasses} ${interactionClasses} ${className}`}
        style={customStyle}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -4, 
        boxShadow: glowColor 
          ? `0 20px 40px -10px ${glowColor}`
          : '0 20px 35px -10px var(--card-shadow)',
        borderColor: glowColor ? `${glowColor}66` : 'rgba(var(--primary), 0.35)',
        transition: { duration: 0.2 }
      }}
      transition={{ duration: 0.4, delay }}
      onClick={onClick}
      className={`${baseClasses} ${interactionClasses} ${className}`}
      style={customStyle}
    >
      {children}
    </motion.div>
  );
};
