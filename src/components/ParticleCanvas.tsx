import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
  active: boolean;
}

const PARTICLE_COUNT = 500;
const SPAWN_RATE = 3;
const BASE_SIZE = 1.5;
const SIZE_GROWTH = 0.03;
const DRIFT_SPEED_Y = 0.5;
const DRIFT_SWAY = 0.3;
const DECAY_RATE = 0.015;
const COLOR_R = 200;
const COLOR_G = 150;
const COLOR_B = 62;

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const activeCountRef = useRef(0);
  const rafRef = useRef<number>(0);
  const isVisibleRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;
    const maxParticles = isMobile ? 200 : PARTICLE_COUNT;
    const spawnRate = isMobile ? 1 : SPAWN_RATE;

    // Initialize particle pool
    const particles: Particle[] = [];
    for (let i = 0; i < maxParticles; i++) {
      particles.push({
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        size: 0,
        alpha: 0,
        life: 0,
        maxLife: 0,
        active: false,
      });
    }
    particlesRef.current = particles;

    function resize() {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio, 2);
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx!.scale(dpr, dpr);
    }

    resize();

    function spawnParticle(mx: number, my: number) {
      const count = activeCountRef.current;
      if (count >= maxParticles) return;

      const p = particles[count];
      p.x = mx + (Math.random() - 0.5) * 10;
      p.y = my + (Math.random() - 0.5) * 10;
      p.vx = (Math.random() - 0.5) * DRIFT_SWAY * 2;
      p.vy = Math.random() * DRIFT_SPEED_Y + 0.2;
      p.size = BASE_SIZE + Math.random();
      p.alpha = 0.6 + Math.random() * 0.4;
      p.life = 0;
      p.maxLife = 60 + Math.random() * 40;
      p.active = true;
      activeCountRef.current = count + 1;
    }

    function updateAndRender() {
      if (!ctx || !canvas) return;
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;

      const width = rect.width;
      const height = rect.height;

      ctx.clearRect(0, 0, width, height);

      if (!isVisibleRef.current) {
        rafRef.current = requestAnimationFrame(updateAndRender);
        return;
      }

      // Spawn particles at mouse position
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      if (mx >= 0 && my >= 0 && mx <= width && my <= height) {
        for (let i = 0; i < spawnRate; i++) {
          spawnParticle(mx, my);
        }
      }

      // Update and render particles
      let i = 0;
      while (i < activeCountRef.current) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx += (Math.random() - 0.5) * 0.1;
        p.size += SIZE_GROWTH;
        p.alpha -= DECAY_RATE;
        p.life++;

        if (p.alpha <= 0 || p.life >= p.maxLife) {
          // Swap with last active particle
          const lastIdx = activeCountRef.current - 1;
          if (i !== lastIdx) {
            const temp = particles[i];
            particles[i] = particles[lastIdx];
            particles[lastIdx] = temp;
          }
          particles[lastIdx].active = false;
          activeCountRef.current--;
        } else {
          // Render
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${COLOR_R}, ${COLOR_G}, ${COLOR_B}, ${p.alpha})`;
          ctx.shadowBlur = 8;
          ctx.shadowColor = `rgba(${COLOR_R}, ${COLOR_G}, ${COLOR_B}, ${p.alpha * 0.5})`;
          ctx.fill();
          ctx.shadowBlur = 0;
          i++;
        }
      }

      rafRef.current = requestAnimationFrame(updateAndRender);
    }

    rafRef.current = requestAnimationFrame(updateAndRender);

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    const parent = canvas.parentElement;
    if (parent) {
      parent.addEventListener('mousemove', handleMouseMove, { passive: true });
    }

    // Intersection observer for performance
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    if (parent) {
      observer.observe(parent);
    }

    const handleResize = () => {
      resize();
    };
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      if (parent) {
        parent.removeEventListener('mousemove', handleMouseMove);
        observer.unobserve(parent);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
