import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface AppleBackgroundExtensionProps {
  color?: string;
  intensity?: number;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  mirrorBackground?: boolean;
}

export function AppleBackgroundExtension({
  color = 'rgba(0, 122, 255, 0.3)',
  intensity = 0.4,
  children,
  className = '',
  style = {},
  mirrorBackground = true
}: AppleBackgroundExtensionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mirrorRef = useRef<HTMLDivElement>(null);
  const [backgroundImage, setBackgroundImage] = useState<string>('none');
  
  // Capture the background for mirroring
  useEffect(() => {
    if (mirrorBackground && mirrorRef.current) {
      // Try to get a screenshot of the page background
      const body = document.body;
      const computedStyle = window.getComputedStyle(body);
      const bgColor = computedStyle.backgroundColor;
      const bgImage = computedStyle.backgroundImage;
      
      if (bgImage !== 'none') {
        setBackgroundImage(bgImage);
      } else {
        // If no background image, use the color
        setBackgroundImage(`linear-gradient(${bgColor}, ${bgColor})`);
      }
    }
  }, [mirrorBackground]);

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        ...style
      }}
    >
      {/* Background extension effect - color gradient */}
      <motion.div 
        className="absolute inset-0 -z-10"
        style={{
          background: `radial-gradient(circle at center, ${color} 0%, transparent 70%)`,
          transform: 'scale(1.5)',
          filter: 'blur(30px)',
          opacity: intensity
        }}
      />
      
      {/* Mirrored content background extension */}
      {mirrorBackground && (
        <div 
          className="absolute inset-0 -z-10 overflow-hidden"
        >
          <div
            ref={mirrorRef}
            className="absolute inset-0"
            style={{
              backgroundImage: backgroundImage,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(20px) saturate(180%)',
              transform: 'scale(1.2)',
              opacity: 0.2
            }}
          />
        </div>
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
