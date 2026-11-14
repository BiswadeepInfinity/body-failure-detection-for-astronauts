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

    // Deep space stars (240 stars with 3 depth layers)
    const starCount = 240;
    const stars: { 
      x: number; 
      y: number; 
      radius: number; 
      baseAlpha: number; 
      alpha: number; 
      speed: number; 
      twinkleSpeed: number;
      twinklePhase: number;
      hue: number 
    }[] = [];

    for (let i = 0; i < starCount; i++) {
      const depth = Math.random();
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: depth > 0.9 ? 2.0 : depth > 0.6 ? 1.3 : 0.7,
        baseAlpha: depth > 0.9 ? 0.85 : depth > 0.6 ? 0.55 : 0.25,
        alpha: 0.5,
        speed: (depth * 0.06) + 0.015,
        twinkleSpeed: Math.random() * 0.02 + 0.008,
        twinklePhase: Math.random() * Math.PI * 2,
        hue: Math.random() > 0.75 ? 38 : Math.random() > 0.45 ? 205 : 265 // Amber gold, Cyan stellar, Violet nebula
      });
    }

    // Occasional gentle shooting star / cosmic ray
    let shootingStar: { x: number; y: number; length: number; speedX: number; speedY: number; opacity: number; active: boolean } | null = null;
    const spawnShootingStar = () => {
      if (Math.random() < 0.008 && (!shootingStar || !shootingStar.active)) {
        shootingStar = {
          x: Math.random() * width * 0.7,
          y: Math.random() * height * 0.35,
          length: Math.random() * 80 + 50,
          speedX: Math.random() * 4 + 4,
          speedY: Math.random() * 2 + 2,
          opacity: 0.75,
          active: true
        };
      }
    };

    let time = 0;

    const render = () => {
      time += 0.01;
      ctx.clearRect(0, 0, width, height);

      // 1. Distant Planet Glow — Earth limb from ISS orbital perspective
      //    Lower-right quadrant, large partial arc visible through window
      const planetX = width * 0.9;
      const planetY = height * 1.02;
      const planetRadius = width * 0.26;

      // Deep ocean body gradient
      const planetGrad = ctx.createRadialGradient(planetX, planetY, planetRadius * 0.1, planetX, planetY, planetRadius);
      planetGrad.addColorStop(0,   'rgba(10, 24, 56, 0.35)');
      planetGrad.addColorStop(0.55,'rgba(20, 50, 110, 0.18)');
      planetGrad.addColorStop(0.82,'rgba(56, 189, 248, 0.10)');
      planetGrad.addColorStop(0.95,'rgba(120, 210, 255, 0.06)');
      planetGrad.addColorStop(1,   'rgba(0, 0, 0, 0)');
      ctx.fillStyle = planetGrad;
      ctx.beginPath();
      ctx.arc(planetX, planetY, planetRadius, 0, Math.PI * 2);
      ctx.fill();

      // Atmospheric limb — thin bright rim of atmosphere
      ctx.save();
      ctx.beginPath();
      ctx.arc(planetX, planetY, planetRadius * 0.97, Math.PI * 0.78, Math.PI * 1.5);
      const limbGrad = ctx.createLinearGradient(planetX - planetRadius, planetY, planetX, planetY - planetRadius);
      limbGrad.addColorStop(0, 'rgba(56, 189, 248, 0.0)');
      limbGrad.addColorStop(0.4, 'rgba(100, 220, 255, 0.28)');
      limbGrad.addColorStop(0.75, 'rgba(56, 189, 248, 0.18)');
      limbGrad.addColorStop(1, 'rgba(56, 189, 248, 0.0)');
      ctx.strokeStyle = limbGrad;
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.restore();

      // Upper ISS viewport vignette — darker corners, instrument-panel feel
      const topVig = ctx.createLinearGradient(0, 0, 0, height * 0.18);
      topVig.addColorStop(0,   'rgba(2, 4, 9, 0.70)');
      topVig.addColorStop(1,   'rgba(0, 0, 0, 0)');
      ctx.fillStyle = topVig;
      ctx.fillRect(0, 0, width, height * 0.18);

      // 2. Rich Deep Space Nebular Clouds
      const gradCyan = ctx.createRadialGradient(width * 0.15, height * 0.2, 20, width * 0.15, height * 0.2, width * 0.5);
      gradCyan.addColorStop(0, 'rgba(56, 189, 248, 0.12)');
      gradCyan.addColorStop(0.5, 'rgba(14, 116, 144, 0.06)');
      gradCyan.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradCyan;
      ctx.fillRect(0, 0, width, height);

      const gradNebula = ctx.createRadialGradient(width * 0.75, height * 0.18, 40, width * 0.75, height * 0.18, width * 0.55);
      gradNebula.addColorStop(0, 'rgba(168, 85, 247, 0.11)');
      gradNebula.addColorStop(0.6, 'rgba(109, 40, 217, 0.05)');
      gradNebula.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradNebula;
      ctx.fillRect(0, 0, width, height);

      const gradAmberCore = ctx.createRadialGradient(width * 0.45, height * 0.45, 10, width * 0.45, height * 0.45, width * 0.4);
      gradAmberCore.addColorStop(0, 'rgba(245, 158, 11, 0.04)');
      gradAmberCore.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradAmberCore;
      ctx.fillRect(0, 0, width, height);

      // 3. Render Stars with gentle breathing/twinkle
      stars.forEach((star) => {
        const twinkle = Math.sin(time + star.twinklePhase) * 0.25;
        const currentAlpha = Math.max(0.1, Math.min(1.0, star.baseAlpha + twinkle));

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);

        if (star.hue === 38) {
          ctx.fillStyle = `rgba(253, 224, 71, ${currentAlpha})`; // Amber star
        } else if (star.hue === 205) {
          ctx.fillStyle = `rgba(186, 230, 253, ${currentAlpha})`; // Cyan starlight
        } else {
          ctx.fillStyle = `rgba(241, 245, 249, ${currentAlpha})`; // Pure cosmic white
        }
        ctx.fill();

        // Starlight cross flare on large bright stars
        if (star.radius >= 1.9) {
          ctx.strokeStyle = `rgba(186, 230, 253, ${currentAlpha * 0.4})`;
          ctx.lineWidth = 0.75;
          ctx.beginPath();
          ctx.moveTo(star.x - star.radius * 2.5, star.y);
          ctx.lineTo(star.x + star.radius * 2.5, star.y);
          ctx.moveTo(star.x, star.y - star.radius * 2.5);
          ctx.lineTo(star.x, star.y + star.radius * 2.5);
          ctx.stroke();
        }

        // Slow calm drift
        star.y -= star.speed;
        if (star.y < 0) {
          star.y = height;
          star.x = Math.random() * width;
        }
      });

      // 4. Subtle Cosmic Shooting Star
      spawnShootingStar();
      if (shootingStar && shootingStar.active) {
        ctx.beginPath();
        const tailX = shootingStar.x - shootingStar.speedX * 8;
        const tailY = shootingStar.y - shootingStar.speedY * 8;
        const shootGrad = ctx.createLinearGradient(tailX, tailY, shootingStar.x, shootingStar.y);
        shootGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
        shootGrad.addColorStop(1, `rgba(255, 255, 255, ${shootingStar.opacity})`);
        ctx.strokeStyle = shootGrad;
        ctx.lineWidth = 1.2;
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(shootingStar.x, shootingStar.y);
        ctx.stroke();

        shootingStar.x += shootingStar.speedX;
        shootingStar.y += shootingStar.speedY;
        shootingStar.opacity -= 0.015;

        if (shootingStar.opacity <= 0 || shootingStar.x > width || shootingStar.y > height) {
          shootingStar.active = false;
        }
      }

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
