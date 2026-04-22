import { useEffect, useRef } from 'react';

export default function StarfieldBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let stars = [];
    let comets = [];
    let lastCometTime = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createStars = () => {
      stars = [];
      const count = Math.floor((canvas.width * canvas.height) / 3500);
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.8 + 0.2,
          speedX: Math.random() * 0.25 + 0.08,
          speedY: Math.random() * 0.25 + 0.08,
          baseOpacity: Math.random() * 0.7 + 0.3,
          twinkleSpeed: Math.random() * 0.04 + 0.01,
          twinkleOffset: Math.random() * Math.PI * 2,
        });
      }
    };

    const spawnComet = () => {
      const startX = Math.random() * canvas.width * 0.5;
      const startY = Math.random() * canvas.height * 0.3;
      const angle = (Math.PI / 4) + (Math.random() - 0.5) * 0.4;
      comets.push({
        x: startX,
        y: startY,
        speed: Math.random() * 6 + 8,
        angle,
        length: Math.random() * 120 + 80,
        opacity: 1,
        size: Math.random() * 1.2 + 0.6,
        life: 0,
        maxLife: Math.random() * 60 + 80,
      });
    };

    const drawStars = (time) => {
      stars.forEach((star) => {
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset);
        const opacity = star.baseOpacity * (0.3 + 0.7 * ((twinkle + 1) / 2));

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220, 225, 255, ${opacity})`;
        ctx.fill();

        if (star.size > 1.1) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
          const glow = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 3);
          glow.addColorStop(0, `rgba(200, 210, 255, ${opacity * 0.25})`);
          glow.addColorStop(1, 'transparent');
          ctx.fillStyle = glow;
          ctx.fill();
        }

        star.x += star.speedX;
        star.y += star.speedY;
        if (star.x > canvas.width + 5) star.x = -5;
        if (star.y > canvas.height + 5) star.y = -5;
      });
    };

    const drawComets = () => {
      comets = comets.filter((c) => c.life < c.maxLife);
      comets.forEach((c) => {
        c.life++;
        const progress = c.life / c.maxLife;
        c.opacity = progress < 0.2 ? progress / 0.2 : progress > 0.7 ? (1 - progress) / 0.3 : 1;

        const dx = Math.cos(c.angle);
        const dy = Math.sin(c.angle);
        c.x += dx * c.speed;
        c.y += dy * c.speed;

        const tailX = c.x - dx * c.length;
        const tailY = c.y - dy * c.length;

        const grad = ctx.createLinearGradient(tailX, tailY, c.x, c.y);
        grad.addColorStop(0, `rgba(255, 255, 255, 0)`);
        grad.addColorStop(0.6, `rgba(200, 210, 255, ${c.opacity * 0.4})`);
        grad.addColorStop(1, `rgba(255, 255, 255, ${c.opacity * 0.95})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(c.x, c.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = c.size;
        ctx.lineCap = 'round';
        ctx.stroke();

        const headGlow = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.size * 4);
        headGlow.addColorStop(0, `rgba(255, 255, 255, ${c.opacity * 0.8})`);
        headGlow.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.size * 4, 0, Math.PI * 2);
        ctx.fillStyle = headGlow;
        ctx.fill();
      });
    };

    let time = 0;
    const animate = (timestamp) => {
      time += 16;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawStars(time);

      if (timestamp - lastCometTime > 8000) {
        spawnComet();
        if (Math.random() > 0.6) spawnComet();
        lastCometTime = timestamp;
      }
      drawComets();

      animationId = requestAnimationFrame(animate);
    };

    resize();
    createStars();
    animationId = requestAnimationFrame(animate);

    const handleResize = () => { resize(); createStars(); };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ zIndex: 0 }}
    />
  );
}