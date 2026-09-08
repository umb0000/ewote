'use client';

import { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import { letterMotion, physicsOptions } from '../lib/letter-motion.mjs';

const letters = ['E', 'W', 'O', 'T', 'E'];

export function LetterPile() {
  const containerRef = useRef<HTMLHeadingElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || matchMedia('(prefers-reduced-motion: reduce)').matches)
      return;

    const engine = Matter.Engine.create({ gravity: { x: 0, y: 1.15 } });
    const bodies: Matter.Body[] = [];
    const sizes: { width: number; height: number }[] = [];
    const timers: ReturnType<typeof setTimeout>[] = [];
    let frame = 0;
    let lastTime = performance.now();

    const buildWorld = () => {
      Matter.Composite.clear(engine.world, false);
      bodies.length = 0;
      sizes.length = 0;
      timers.splice(0).forEach(clearTimeout);

      const { width, height } = container.getBoundingClientRect();
      const wall = 120;
      Matter.Composite.add(engine.world, [
        Matter.Bodies.rectangle(
          width / 2,
          height + wall / 2,
          width + wall * 2,
          wall,
          {
            isStatic: true,
          },
        ),
        Matter.Bodies.rectangle(-wall / 2, height / 2, wall, height * 2, {
          isStatic: true,
        }),
        Matter.Bodies.rectangle(
          width + wall / 2,
          height / 2,
          wall,
          height * 2,
          {
            isStatic: true,
          },
        ),
      ]);

      letterRefs.current.forEach((element, index) => {
        if (!element) return;
        const rect = element.getBoundingClientRect();
        sizes[index] = { width: rect.width, height: rect.height };
        const bodyWidth = rect.width * 0.82;
        const bodyHeight = rect.height * 0.76;
        const x = width * letterMotion[index].spawnX;
        const body = Matter.Bodies.rectangle(
          x,
          -rect.height * (1.2 + index * 0.12),
          bodyWidth,
          bodyHeight,
          {
            restitution: physicsOptions.restitution,
            friction: physicsOptions.friction,
            frictionStatic: physicsOptions.frictionStatic,
            frictionAir: physicsOptions.frictionAir,
            density: physicsOptions.density,
            angle: (letterMotion[index].startRotate * Math.PI) / 180,
            chamfer: { radius: Math.min(bodyWidth, bodyHeight) * 0.06 },
          },
        );
        bodies[index] = body;
        element.style.opacity = '0';
        timers.push(
          setTimeout(() => {
            element.style.opacity = '1';
            Matter.Composite.add(engine.world, body);
          }, letterMotion[index].delay * 1000),
        );
      });
    };

    const update = (time: number) => {
      Matter.Engine.update(engine, Math.min(time - lastTime, 32));
      lastTime = time;
      bodies.forEach((body, index) => {
        const element = letterRefs.current[index];
        const size = sizes[index];
        if (!element || !size) return;
        element.style.transform = `translate3d(${body.position.x - size.width / 2}px, ${body.position.y - size.height * 0.56}px, 0) rotate(${body.angle}rad)`;
      });
      frame = requestAnimationFrame(update);
    };

    buildWorld();
    frame = requestAnimationFrame(update);
    const observer = new ResizeObserver(buildWorld);
    observer.observe(container);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      timers.forEach(clearTimeout);
      Matter.Engine.clear(engine);
    };
  }, []);

  return (
    <h1 className="letter-pile" aria-label="EWOTE" ref={containerRef}>
      <span className="letter-floor" aria-hidden="true" />
      {letters.map((letter, index) => (
        <span
          aria-hidden="true"
          className="physics-letter"
          key={`${letter}-${index}`}
          ref={(element) => {
            letterRefs.current[index] = element;
          }}
        >
          {letter}
        </span>
      ))}
    </h1>
  );
}
