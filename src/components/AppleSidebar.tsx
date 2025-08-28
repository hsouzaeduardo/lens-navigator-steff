import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideIcon, X } from 'lucide-react';

interface AppleSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  icon: LucideIcon;
  colorClass: string;
  content: string;
  position?: 'left' | 'right';
}

// Convert colorClass to Apple system color
const getAppleSystemColor = (colorClass: string): { bg: string, text: string } => {
  // Map Tailwind color classes to Apple system colors
  const colorMap: Record<string, { bg: string, text: string }> = {
    'bg-destructive/10': { 
      bg: 'rgba(255, 59, 48, 0.1)', 
      text: 'rgb(255, 59, 48)' 
    },
    'bg-warning/10': { 
      bg: 'rgba(255, 149, 0, 0.1)', 
      text: 'rgb(255, 149, 0)' 
    },
    'bg-success/10': { 
      bg: 'rgba(52, 199, 89, 0.1)', 
      text: 'rgb(52, 199, 89)' 
    },
    'bg-primary/10': { 
      bg: 'rgba(0, 122, 255, 0.1)', 
      text: 'rgb(0, 122, 255)' 
    }
  };
  
  return colorMap[colorClass] || { bg: 'rgba(0, 122, 255, 0.1)', text: 'rgb(0, 122, 255)' };
};

export function AppleSidebar({ 
  isOpen, 
  onClose, 
  title, 
  description, 
  icon: Icon, 
  colorClass, 
  content,
  position = 'right'
}: AppleSidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const mirrorBgRef = useRef<HTMLDivElement>(null);
  const appleColor = getAppleSystemColor(colorClass);
  
  // Set up background mirroring effect
  useEffect(() => {
    if (isOpen && mirrorBgRef.current) {
      // Try to get a screenshot of the page background
      // For demo purposes, we'll use the background color/image of the body
      const body = document.body;
      const computedStyle = window.getComputedStyle(body);
      const bgColor = computedStyle.backgroundColor;
      const bgImage = computedStyle.backgroundImage;
      
      // Set the background properties on the mirror element
      if (mirrorBgRef.current) {
        if (bgImage !== 'none') {
          mirrorBgRef.current.style.setProperty('--background-image', bgImage);
        } else {
          // If no background image, use the color
          mirrorBgRef.current.style.setProperty('--background-image', `linear-gradient(${bgColor}, ${bgColor})`);
        }
      }
    }
  }, [isOpen]);
  
  // Close on escape key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [isOpen, onClose]);
  
  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && 
          !sidebarRef.current.contains(event.target as Node) && 
          isOpen) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end">
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Sidebar */}
          <motion.div
            ref={sidebarRef}
            initial={{ x: position === 'right' ? '100%' : '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: position === 'right' ? '100%' : '-100%' }}
            transition={{ 
              type: "spring", 
              damping: 30, 
              stiffness: 300 
            }}
            className="relative h-full w-full max-w-md flex flex-col overflow-hidden"
            style={{ 
              backgroundColor: document.documentElement.classList.contains('dark') ? 
                'rgba(28, 28, 30, 0.85)' : 'rgba(250, 250, 252, 0.85)',
              backdropFilter: 'blur(30px)',
              WebkitBackdropFilter: 'blur(30px)',
              boxShadow: position === 'right' 
                ? '-10px 0 40px rgba(0, 0, 0, 0.1)' 
                : '10px 0 40px rgba(0, 0, 0, 0.1)',
              color: document.documentElement.classList.contains('dark') ? 
                'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background extension effect - Apple style mirrored background */}
            <div 
              className="absolute inset-0 -z-10"
              style={{
                background: `radial-gradient(circle at ${position === 'right' ? 'left' : 'right'} top, ${appleColor.text}30 0%, transparent 70%)`,
                transform: 'scale(1.5)',
                filter: 'blur(30px)',
                opacity: document.documentElement.classList.contains('dark') ? 0.5 : 0.4
              }}
            />
            
            {/* Mirrored content background extension - Apple style */}
            <div 
              className="absolute inset-0 -z-10 overflow-hidden"
            >
              <div
                ref={mirrorBgRef}
                className="absolute inset-0"
                style={{
                  backgroundImage: 'var(--background-image, none)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: 'blur(20px) saturate(180%)',
                  transform: 'scale(1.2)',
                  opacity: document.documentElement.classList.contains('dark') ? 0.3 : 0.2
                }}
              />
            </div>
            
            {/* Header */}
            <div 
              className="flex items-center justify-between p-4 border-b"
              style={{
                borderColor: document.documentElement.classList.contains('dark') ? 
                  'rgba(70, 70, 80, 0.3)' : 'rgba(0, 0, 0, 0.06)'
              }}
            >
              <div className="flex items-center space-x-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ 
                    backgroundColor: document.documentElement.classList.contains('dark') ? 
                      `${appleColor.text}30` : appleColor.bg,
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                  }}
                >
                  <Icon 
                    className="h-5 w-5" 
                    style={{ 
                      color: document.documentElement.classList.contains('dark') ? 
                        'rgba(255, 255, 255, 0.9)' : appleColor.text 
                    }} 
                  />
                </div>
                <div>
                  <h3 
                    style={{ 
                      fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
                      fontSize: '17px',
                      fontWeight: 600,
                      letterSpacing: '-0.022em',
                      color: document.documentElement.classList.contains('dark') ? 
                        'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)',
                      margin: 0,
                      marginBottom: '2px'
                    }}
                  >
                    {title} Lens
                  </h3>
                  <p
                    style={{ 
                      fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif",
                      fontSize: '13px',
                      letterSpacing: '-0.01em',
                      color: document.documentElement.classList.contains('dark') ? 
                        'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.65)',
                      margin: 0
                    }}
                  >
                    {description}
                  </p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                style={{
                  backgroundColor: 'transparent',
                  ':hover': {
                    backgroundColor: document.documentElement.classList.contains('dark') ? 
                      'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
                  }
                }}
                aria-label="Close"
              >
                <X 
                  className="h-5 w-5" 
                  style={{ 
                    color: document.documentElement.classList.contains('dark') ? 
                      'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)' 
                  }} 
                />
              </button>
            </div>
            
            {/* Content */}
            <div 
              className="flex-1 overflow-y-auto p-6"
              style={{ 
                fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif",
                fontSize: '14px',
                letterSpacing: '-0.01em',
                lineHeight: '1.5',
              }}
            >
              {/* Focus area card - Apple style */}
              <div 
                className="mb-6 p-4 rounded-lg backdrop-blur-md"
                style={{ 
                  backgroundColor: document.documentElement.classList.contains('dark') ? 
                    `${appleColor.text}15` : appleColor.bg,
                  border: `1px solid ${appleColor.text}${document.documentElement.classList.contains('dark') ? '30' : '20'}`,
                }}
              >
                <h4 
                  style={{ 
                    fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif",
                    fontSize: '15px',
                    fontWeight: 600,
                    letterSpacing: '-0.01em',
                    color: document.documentElement.classList.contains('dark') ? 
                      'rgba(255, 255, 255, 0.9)' : appleColor.text,
                    marginBottom: '8px'
                  }}
                >
                  Focus Areas
                </h4>
                <p 
                  style={{ 
                    fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif",
                    fontSize: '14px',
                    letterSpacing: '-0.01em',
                    lineHeight: '1.4',
                    color: document.documentElement.classList.contains('dark') ? 
                      'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
                    margin: 0
                  }}
                >
                  {description}
                </p>
              </div>
              
              {/* Lens details */}
              <h4 
                style={{ 
                  fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
                  fontSize: '17px',
                  fontWeight: 600,
                  letterSpacing: '-0.022em',
                  color: document.documentElement.classList.contains('dark') ? 
                    'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)',
                  marginBottom: '12px'
                }}
              >
                Lens Details
              </h4>
              <div 
                style={{
                  whiteSpace: 'pre-line',
                  color: document.documentElement.classList.contains('dark') ? 
                    'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
                }}
              >
                {content.split('\n\n').map((paragraph, index) => (
                  <p 
                    key={index} 
                    style={{
                      marginBottom: '16px',
                      lineHeight: '1.5',
                      fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif",
                      fontSize: '14px',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
