import { useEffect, useRef } from 'react';

interface PrimalText3DProps {
  size?: 'large' | 'small';
  animate?: boolean;
}

const PrimalText3D = ({ size = 'large', animate = true }: PrimalText3DProps) => {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('PrimalText3D mounted, animate:', animate);
    
    if (!textRef.current || !animate) return;
    
    const element = textRef.current;
    let animationId: number;
    
    const animateText = () => {
      const time = Date.now() * 0.001;
      const rotationY = Math.sin(time * 0.5) * 25; // Increased rotation
      const translateY = Math.sin(time * 2) * 8; // Increased movement
      
      element.style.transform = `perspective(1000px) rotateY(${rotationY}deg) translateY(${translateY}px) translateZ(0)`;
      animationId = requestAnimationFrame(animateText);
    };
    
    animateText();
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [animate]);

  const fontSize = size === 'large' ? 'text-6xl md:text-8xl' : 'text-xl';
  const containerHeight = size === 'large' ? 'h-32 md:h-48' : 'h-12';

  return (
    <div className={`flex items-center justify-center ${containerHeight}`}>
      <div
        ref={textRef}
        className={`${fontSize} font-bold text-3d-effect ${animate ? '' : 'hover:text-3d-hover'} transition-transform duration-300`}
        style={{
          color: 'hsl(60 100% 70%)', // Brighter fallback color
          background: 'linear-gradient(180deg, hsl(60 100% 70%) 0%, hsl(120 60% 50%) 70%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textShadow: `
            1px 1px 0px hsl(120 60% 40%),
            2px 2px 0px hsl(120 60% 35%),
            3px 3px 0px hsl(120 60% 30%),
            4px 4px 0px hsl(120 60% 25%),
            5px 5px 15px hsl(0 0% 0% / 0.8),
            0 0 30px hsl(60 100% 70% / 0.8),
            0 0 50px hsl(60 100% 60% / 0.6)
          `,
          transform: 'perspective(1000px) rotateY(0deg)',
          filter: 'drop-shadow(0 0 20px hsl(60 100% 60% / 0.6)) brightness(1.2)',
        }}
      >
        PRIMAL
      </div>
    </div>
  );
};

export default PrimalText3D;