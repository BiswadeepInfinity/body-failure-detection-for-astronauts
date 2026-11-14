import React, { useEffect, useRef } from 'react';

export const DeepSpaceBackground: React.FC = () => {
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

    // Generate stars
    const starCount = 140;
    const stars: { x: number; y: number; radius: number; alpha: number; speed: number; hue: number }[] = [];
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.4,
        alpha: Math.random() * 0.7 + 0.2,
        speed: Math.random() * 0.05 + 0.02,
        hue: Math.random() > 0.8 ? 38 : Math.random() > 0.5 ? 200 : 260 // warm starlight, cyan, or gentle violet
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Deep space atmospheric nebular cloud gradients
      const grad1 = ctx.createRadialGradient(width * 0.2, height * 0.15, 10, width * 0.2, height * 0.15, width * 0.45);
      grad1.addColorStop(0, 'rgba(56, 189, 248, 0.09)');
      grad1.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      const grad2 = ctx.createRadialGradient(width * 0.85, height * 0.2, 20, width * 0.85, height * 0.2, width * 0.5);
      grad2.addColorStop(0, 'rgba(168, 85, 247, 0.08)');
      grad2.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      const grad3 = ctx.createRadialGradient(width * 0.5, height * 0.85, 30, width * 0.5, height * 0.85, width * 0.6);
      grad3.addColorStop(0, 'rgba(30, 58, 138, 0.14)');
      grad3.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad3;
      ctx.fillRect(0, 0, width, height);

      // Draw peaceful starlight
      stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        if (star.hue === 38) {
          ctx.fillStyle = `rgba(253, 224, 71, ${star.alpha})`; // warm starlight
        } else if (star.hue === 200) {
          ctx.fillStyle = `rgba(186, 230, 253, ${star.alpha})`; // cyan starlight
        } else {
          ctx.fillStyle = `rgba(233, 213, 255, ${star.alpha})`; // soft stellar white/violet
        }
        ctx.fill();

        // Slow calm drift
        star.y -= star.speed;
        if (star.y < 0) {
          star.y = height;
          star.x = Math.random() * width;
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0
      }}
    />
  );
};
