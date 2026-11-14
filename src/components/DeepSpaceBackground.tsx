import React, { useEffect, useRef } from 'react';

// Deep-space background canvas with genuine organic depth & celestial atmospheric glow
export const DeepSpaceBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      draw();
    };
    window.addEventListener('resize', handleResize);

    // Generate static, beautiful celestial star clusters
    const stars: { x: number; y: number; r: number; alpha: number; color: string }[] = [];
    const starCount = 180;

    for (let i = 0; i < starCount; i++) {
      const depth = Math.random();
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: depth > 0.92 ? 1.8 : depth > 0.65 ? 1.2 : 0.6,
        alpha: depth > 0.92 ? 0.8 : depth > 0.65 ? 0.45 : 0.2,
        color: depth > 0.85 ? '#bae6fd' : depth > 0.7 ? '#fef08a' : '#ffffff'
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Deep cosmic gradient void
      const bgGrad = ctx.createRadialGradient(width * 0.5, height * 0.4, 50, width * 0.5, height * 0.5, width * 0.8);
      bgGrad.addColorStop(0, '#060c1d');
      bgGrad.addColorStop(0.5, '#040816');
      bgGrad.addColorStop(1, '#020409');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Soft, organic distant nebular glow (Cyan & Indigo bioluminescence behind liquid glass)
      const cyanGlow = ctx.createRadialGradient(width * 0.15, height * 0.25, 20, width * 0.15, height * 0.25, width * 0.45);
      cyanGlow.addColorStop(0, 'rgba(56, 189, 248, 0.08)');
      cyanGlow.addColorStop(0.6, 'rgba(14, 116, 144, 0.03)');
      cyanGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = cyanGlow;
      ctx.fillRect(0, 0, width, height);

      const purpleGlow = ctx.createRadialGradient(width * 0.82, height * 0.15, 20, width * 0.82, height * 0.15, width * 0.5);
      purpleGlow.addColorStop(0, 'rgba(147, 51, 234, 0.06)');
      purpleGlow.addColorStop(0.6, 'rgba(79, 70, 229, 0.02)');
      purpleGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = purpleGlow;
      ctx.fillRect(0, 0, width, height);

      // 3. Subtle planetary limb arc in lower horizon
      const planetX = width * 0.88;
      const planetY = height * 1.05;
      const planetRadius = width * 0.3;

      const planetGrad = ctx.createRadialGradient(planetX, planetY, planetRadius * 0.1, planetX, planetY, planetRadius);
      planetGrad.addColorStop(0, 'rgba(15, 35, 75, 0.35)');
      planetGrad.addColorStop(0.7, 'rgba(30, 58, 138, 0.1)');
      planetGrad.addColorStop(0.95, 'rgba(56, 189, 248, 0.06)');
      planetGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = planetGrad;
      ctx.beginPath();
      ctx.arc(planetX, planetY, planetRadius, 0, Math.PI * 2);
      ctx.fill();

      // Atmospheric rim highlight
      ctx.save();
      ctx.beginPath();
      ctx.arc(planetX, planetY, planetRadius * 0.98, Math.PI * 0.8, Math.PI * 1.55);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.18)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // 4. Starlight points
      stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.alpha;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0
      }}
    />
  );
};
