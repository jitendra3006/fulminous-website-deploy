"use client";

import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  pulseSpeed: number;
}

interface GlowOrb {
  x: number;
  y: number;
  radius: number;
  color: string;
  vx: number;
  vy: number;
}

export function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let animId = 0;

    const particles: Particle[] = [];
    const particleCount = 32;

    const glowOrbs: GlowOrb[] = [];

    const initScene = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.parentElement?.clientHeight || window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);

      // Initialize Neural Particles
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * (height * 0.7),
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          radius: Math.random() * 2 + 1.2,
          alpha: Math.random() * 0.5 + 0.25,
          pulseSpeed: Math.random() * 0.02 + 0.01,
        });
      }

      // Initialize Ambient Glowing Light Blobs
      glowOrbs.length = 0;
      glowOrbs.push(
        {
          x: width * 0.25,
          y: height * 0.2,
          radius: Math.min(width, height) * 0.35,
          color: "rgba(37, 99, 235, 0.22)", // Royal Blue
          vx: 0.15,
          vy: 0.1,
        },
        {
          x: width * 0.75,
          y: height * 0.25,
          radius: Math.min(width, height) * 0.4,
          color: "rgba(124, 58, 237, 0.18)", // Electric Violet
          vx: -0.12,
          vy: 0.12,
        },
        {
          x: width * 0.5,
          y: height * 0.12,
          radius: Math.min(width, height) * 0.3,
          color: "rgba(14, 165, 233, 0.2)", // Cyan Glow
          vx: 0.08,
          vy: -0.08,
        }
      );
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Rich Layered Base Gradient
      const baseGrad = ctx.createLinearGradient(0, 0, 0, height);
      baseGrad.addColorStop(0, "#081a3e");
      baseGrad.addColorStop(0.16, "#0f367a");
      baseGrad.addColorStop(0.26, "#1d58be");
      baseGrad.addColorStop(0.36, "#5d99f0");
      baseGrad.addColorStop(0.48, "#aaccf7");
      baseGrad.addColorStop(0.6, "#e2effc");
      baseGrad.addColorStop(0.74, "#ffffff");
      baseGrad.addColorStop(1, "#ffffff");

      ctx.fillStyle = baseGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Render Drifting Ambient Glow Blobs
      glowOrbs.forEach((orb) => {
        orb.x += orb.vx;
        orb.y += orb.vy;

        if (orb.x < width * 0.1 || orb.x > width * 0.9) orb.vx *= -1;
        if (orb.y < height * 0.05 || orb.y > height * 0.45) orb.vy *= -1;

        const g = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
        g.addColorStop(0, orb.color);
        g.addColorStop(0.6, orb.color.replace(/[\d\.]+\)$/, "0.06)"));
        g.addColorStop(1, "transparent");

        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. Central Spotlight Aura behind Headline
      const rx = width * 0.5;
      const ry = height * 0.16;
      const radiusX = width * 0.65;
      const radiusY = height * 0.28;

      ctx.save();
      ctx.translate(rx, ry);
      ctx.scale(1, radiusY / radiusX);

      const radialGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, radiusX);
      radialGrad.addColorStop(0, "rgba(255, 255, 255, 0.22)");
      radialGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.06)");
      radialGrad.addColorStop(1, "rgba(255, 255, 255, 0)");

      ctx.fillStyle = radialGrad;
      ctx.beginPath();
      ctx.arc(0, 0, radiusX, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 4. Render Neural Constellation Nodes & Energy Links
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height * 0.7) p.vy *= -1;

        p.alpha += Math.sin(Date.now() * p.pulseSpeed) * 0.006;
        const currentAlpha = Math.max(0.18, Math.min(0.85, p.alpha));

        // Outer Glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 2.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha * 0.25})`;
        ctx.fill();

        // Core Node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha})`;
        ctx.fill();

        // Connect nearby nodes
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 160) {
            const lineAlpha = (1 - dist / 160) * 0.25;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${lineAlpha})`;
            ctx.lineWidth = 0.85;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    initScene();
    render();

    const handleResize = () => {
      initScene();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
        filter: "blur(3.5px)",
      }}
    />
  );
}
