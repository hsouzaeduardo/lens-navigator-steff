import React from 'react';
import { motion } from 'framer-motion';
import { CardContent } from '@/components/ui/card';

interface BackgroundExtensionCardProps {
  children: React.ReactNode;
  className?: string;
}

export function BackgroundExtensionCard({ children, className = '' }: BackgroundExtensionCardProps) {
  return (
    <motion.div 
      className={`relative rounded-xl overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      style={{ 
        backdropFilter: 'blur(var(--glass-blur))',
        background: 'var(--glass-bg)',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--glass-border)'
      }}
    >
      {/* Background extension effect - subtle gradient glow */}
      <div 
        className="absolute inset-0 opacity-50 z-0" 
        style={{
          background: 'radial-gradient(circle at 50% 0%, rgba(var(--primary), 0.15), transparent 70%)',
          filter: 'blur(20px)'
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        <CardContent className="p-6">
          {children}
        </CardContent>
      </div>
    </motion.div>
  );
}

