import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideIcon, X } from 'lucide-react';

interface ExpandableLensBoxProps {
  title: string;
  description: string;
  icon: LucideIcon;
  colorClass: string;
  previewContent: string;
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

export function ExpandableLensBox({ 
  title, 
  description, 
  icon: Icon, 
  colorClass,
  previewContent 
}: ExpandableLensBoxProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const contentRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  
  // Get Apple system colors
  const appleColor = getAppleSystemColor(colorClass);
  
  // Function to update preview position based on mouse position
  const updatePosition = (e: React.MouseEvent) => {
    // Get window dimensions
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    // Calculate position (keep preview within viewport)
    const x = Math.min(Math.max(e.clientX - 250, 20), windowWidth - 520);
    const y = Math.min(Math.max(e.clientY - 100, 20), windowHeight - 350);
    
    setPosition({ x, y });
  };
  
  // Close on escape key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isExpanded) {
        setIsExpanded(false);
      }
    };
    
    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [isExpanded]);
  
  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (overlayRef.current && 
          !overlayRef.current.contains(event.target as Node) && 
          isExpanded) {
        setIsExpanded(false);
      }
    };
    
    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);
  
  return (
    <>
      {/* Hidden for the new design approach */}
      <div className="hidden">
        <div 
          ref={boxRef}
          className="relative cursor-pointer"
          onMouseEnter={(e) => {
            if (!isExpanded) {
              setIsHovered(true);
              updatePosition(e);
            }
          }}
          onMouseMove={(e) => {
            if (isHovered && !isExpanded) {
              updatePosition(e);
            }
          }}
          onMouseLeave={() => !isExpanded && setIsHovered(false)}
          onClick={() => setIsExpanded(true)}
        >
          {/* Base lens box - hidden but kept for reference */}
          <div className="hidden"></div>
        </div>
      </div>
      
      {/* Hover preview with Apple-style background extension effect */}
      <AnimatePresence>
        {isHovered && !isExpanded && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="fixed z-50"
            style={{ 
              width: "520px",
              left: `${position.x}px`,
              top: `${position.y}px`,
              transform: "none",
              pointerEvents: "none",
              marginTop: "0"
            }}
          >
            <div className="relative overflow-hidden rounded-xl">
              <div 
                className="backdrop-blur-2xl p-5 rounded-xl overflow-hidden dark:bg-[rgba(28,28,30,0.85)] dark:border-[rgba(70,70,80,0.3)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.2),0_1px_3px_rgba(0,0,0,0.1)]"
                style={{
                  backgroundColor: 'rgba(250, 250, 252, 0.85)',
                  borderRadius: '12px',
                  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.3)'
                }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: appleColor.bg }}
                  >
                    <Icon className="h-4 w-4" style={{ color: appleColor.text }} />
                  </div>
                  <h4 
                    className="font-semibold dark:text-[rgba(255,255,255,0.9)]"
                    style={{ 
                      fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
                      fontSize: '15px',
                      letterSpacing: '-0.022em',
                      color: 'var(--apple-text-primary, rgba(0, 0, 0, 0.9))'
                    }}
                  >
                    {title} Lens
                  </h4>
                </div>
                <div 
                  className="whitespace-pre-line overflow-y-auto dark:text-[rgba(255,255,255,0.7)]"
                  style={{
                    maxHeight: "300px", 
                    padding: "0 4px",
                    fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif",
                    fontSize: '13px',
                    letterSpacing: '-0.01em',
                    lineHeight: '1.4',
                    color: 'rgba(0, 0, 0, 0.7)'
                  }}
                >
                  {previewContent.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-3">{paragraph}</p>
                  ))}
                </div>
              </div>
              
              {/* Apple-style background extension effect */}
              <div 
                className="absolute -z-10 inset-0 opacity-60"
                style={{
                  background: `radial-gradient(circle at center, ${appleColor.text}30 0%, transparent 70%)`,
                  transform: 'scale(1.2)',
                  filter: 'blur(20px)'
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Full-screen expanded overlay with Apple-style sheet */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
            onClick={() => setIsExpanded(false)}
          >
            <motion.div
              ref={overlayRef}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ 
                type: "spring", 
                stiffness: 400, 
                damping: 30 
              }}
              className="relative mx-4 rounded-xl overflow-hidden dark:bg-[rgba(28,28,30,0.95)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.1)]"
              style={{ 
                maxWidth: '650px',
                maxHeight: '80vh',
                backgroundColor: 'rgba(250, 250, 252, 0.95)',
                backdropFilter: 'blur(30px)',
                WebkitBackdropFilter: 'blur(30px)',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.05)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Apple-style background extension effect */}
              <div 
                className="absolute -z-10 inset-0 opacity-30"
                style={{
                  background: `radial-gradient(circle at top, ${appleColor.text}30 0%, transparent 70%)`,
                  transform: 'scale(1.5) translateY(-30%)',
                  filter: 'blur(30px)'
                }}
              />
              
              {/* Header - Apple-style */}
              <div 
                className="flex items-center justify-between p-4 border-b"
                style={{ borderColor: 'rgba(0, 0, 0, 0.05)' }}
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: appleColor.bg }}
                  >
                    <Icon className="h-5 w-5" style={{ color: appleColor.text }} />
                  </div>
                  <h3 
                    className="font-semibold"
                    style={{ 
                      fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
                      fontSize: '17px',
                      letterSpacing: '-0.022em',
                      color: 'rgba(0, 0, 0, 0.9)'
                    }}
                  >
                    {title} Lens
                  </h3>
                </div>
                <button 
                  onClick={() => setIsExpanded(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/5 active:bg-black/10 transition-colors"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" style={{ color: 'rgba(0, 0, 0, 0.7)' }} />
                </button>
              </div>
              
              {/* Content - Apple-style */}
              <div 
                ref={contentRef}
                className="p-6 overflow-y-auto"
                style={{ maxHeight: 'calc(80vh - 70px)' }}
              >
                {/* Focus area card */}
                <div 
                  className="mb-6 p-4 rounded-lg"
                  style={{ 
                    backgroundColor: appleColor.bg,
                    border: `1px solid ${appleColor.text}20`
                  }}
                >
                  <h4 
                    className="mb-2"
                    style={{ 
                      fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif",
                      fontSize: '15px',
                      fontWeight: 600,
                      letterSpacing: '-0.01em',
                      color: appleColor.text
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
                      color: 'rgba(0, 0, 0, 0.8)'
                    }}
                  >
                    {description}
                  </p>
                </div>
                
                {/* Lens details */}
                <h4 
                  className="mb-3"
                  style={{ 
                    fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
                    fontSize: '17px',
                    fontWeight: 600,
                    letterSpacing: '-0.022em',
                    color: 'rgba(0, 0, 0, 0.9)'
                  }}
                >
                  Lens Details
                </h4>
                <div 
                  className="whitespace-pre-line"
                  style={{ 
                    fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif",
                    fontSize: '14px',
                    letterSpacing: '-0.01em',
                    lineHeight: '1.5',
                    color: 'rgba(0, 0, 0, 0.8)'
                  }}
                >
                  {previewContent.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-4">{paragraph}</p>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}