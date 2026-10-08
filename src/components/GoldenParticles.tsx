import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  targetOpacity: number;
  pulseSpeed: number;
  color: string;
}

interface GoldenParticlesProps {
  density?: number;
  className?: string;
}

export const GoldenParticles: React.FC<GoldenParticlesProps> = ({ density = 45, className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const colors = ['#F59E0B', '#FBBF24', '#FDE68A', '#FEF3C7', '#D97706'];

    const isMobile = window.innerWidth < 640;
    const effectiveDensity = Math.min(density, isMobile ? 25 : density);

    const particles: Particle[] = Array.from({ length: effectiveDensity }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.5 + 0.5,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: -Math.random() * 0.5 - 0.1,
      opacity: Math.random() * 0.6 + 0.2,
      targetOpacity: Math.random() * 0.8 + 0.2,
      pulseSpeed: Math.random() * 0.02 + 0.005,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.opacity < p.targetOpacity) {
          p.opacity += p.pulseSpeed;
        } else {
          p.opacity -= p.pulseSpeed;
          if (p.opacity <= 0.1) {
            p.targetOpacity = Math.random() * 0.8 + 0.2;
          }
        }

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;

        // Skip heavy shadowBlur filter on mobile for maximum smooth scrolling FPS
        if (!isMobile) {
          ctx.shadowBlur = p.size * 4;
          ctx.shadowColor = p.color;
        }

        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none fixed inset-0 z-10 w-full h-full ${className}`}
    />
  );
};
