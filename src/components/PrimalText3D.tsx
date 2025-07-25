import { useEffect, useRef } from 'react';

interface PrimalText3DProps {
  size?: 'large' | 'small';
  animate?: boolean;
}

const PrimalText3D = ({ size = 'large', animate = true }: PrimalText3DProps) => {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!textRef.current || !animate) return;
    
    const element = textRef.current;
    let animationId: number;
    
    const animateText = () => {
      const time = Date.now() * 0.001;
      const rotationY = Math.sin(time * 0.5) * 15;
      const translateY = Math.sin(time * 2) * 5;
      
      element.style.transform = `perspective(1000px) rotateY(${rotationY}deg) translateY(${translateY}px)`;
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
          background: 'linear-gradient(180deg, hsl(60 100% 50%) 0%, hsl(120 40% 30%) 70%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textShadow: `
            2px 2px 0px hsl(120 40% 20%),
            4px 4px 0px hsl(120 40% 15%),
            6px 6px 0px hsl(120 40% 10%),
            8px 8px 0px hsl(120 40% 5%),
            10px 10px 20px hsl(0 0% 0% / 0.5)
          `,
          transform: 'perspective(1000px) rotateY(0deg)',
        }}
      >
        PRIMAL
      </div>
    </div>
  );
};

export default PrimalText3D;