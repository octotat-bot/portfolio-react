import { useState, useEffect, useRef } from 'react';
import './GlowEffect.css';

const GlowEffect = ({ children, color = '#0cff77', intensity = 0.3, size = 150, className = '' }) => {
  const containerRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      setPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    };
    
    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseenter', () => setIsHovering(true));
      container.addEventListener('mouseleave', () => setIsHovering(false));
      
      return () => {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseenter', () => setIsHovering(true));
        container.removeEventListener('mouseleave', () => setIsHovering(false));
      };
    }
  }, []);
  
  return (
    <div 
      className={`glow-effect-container ${className}`} 
      ref={containerRef}
      style={{
        '--glow-color': color,
        '--glow-intensity': intensity,
        '--glow-size': `${size}px`
      }}
    >
      {isHovering && (
        <div 
          className="glow-effect"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`
          }}
        />
      )}
      {children}
    </div>
  );
};

export default GlowEffect; 