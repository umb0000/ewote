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
    const visualOffsets: { x: number; y: number }[] = [];
    const timers: ReturnType<typeof setTimeout>[] = [];
    let frame = 0;
    let lastTime = performance.now();

    const buildWorld = () => {
      Matter.Composite.clear(engine.world, false);
      bodies.length = 0;
      sizes.length = 0;
      visualOffsets.length = 0;
      timers.splice(0).forEach(clearTimeout);

      const { width, height } = container.getBoundingClientRect();
      const pileWidth = width * physicsOptions.pileWidthRatio;
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
          pileWidth + wall / 2,
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
        const letter = letters[index];
        const rect = element.getBoundingClientRect();
        sizes[index] = { width: rect.width, height: rect.height };
        const bodyWidth = rect.width * 0.9;
        const bodyHeight = rect.height * 0.82;
        const x = width * letterMotion[index].spawnX;
        const y = -rect.height * (1.2 + index * 0.12);
        const material = {
          restitution: physicsOptions.restitution,
          friction: physicsOptions.friction,
          frictionStatic: physicsOptions.frictionStatic,
          frictionAir: physicsOptions.frictionAir,
          density: physicsOptions.density,
        };
        const bar = (px: number, py: number, w: number, h: number, angle = 0) =>
          Matter.Bodies.rectangle(px, py, w, h, { angle });
        let parts: Matter.Body[];
        if (letter === 'E') {
          parts = [
            bar(x - bodyWidth * 0.34, y, bodyWidth * 0.2, bodyHeight),
            bar(x, y - bodyHeight * 0.4, bodyWidth * 0.82, bodyHeight * 0.2),
            bar(x - bodyWidth * 0.04, y, bodyWidth * 0.66, bodyHeight * 0.18),
            bar(x, y + bodyHeight * 0.4, bodyWidth * 0.82, bodyHeight * 0.2),
          ];
        } else if (letter === 'W') {
          parts = [
            bar(
              x - bodyWidth * 0.29,
              y,
              bodyWidth * 0.18,
              bodyHeight * 0.94,
              -0.17,
            ),
            bar(
              x - bodyWidth * 0.1,
              y + bodyHeight * 0.1,
              bodyWidth * 0.17,
              bodyHeight * 0.78,
              0.2,
            ),
            bar(
              x + bodyWidth * 0.1,
              y + bodyHeight * 0.1,
              bodyWidth * 0.17,
              bodyHeight * 0.78,
              -0.2,
            ),
            bar(
              x + bodyWidth * 0.29,
              y,
              bodyWidth * 0.18,
              bodyHeight * 0.94,
              0.17,
            ),
          ];
        } else if (letter === 'T') {
          parts = [
            bar(x, y - bodyHeight * 0.4, bodyWidth, bodyHeight * 0.2),
            bar(x, y + bodyHeight * 0.08, bodyWidth * 0.2, bodyHeight * 0.82),
          ];
        } else {
          parts = [
            Matter.Bodies.circle(x, y, Math.min(bodyWidth, bodyHeight) * 0.48),
          ];
        }
        const body = Matter.Body.create({ parts, ...material });
        visualOffsets[index] = {
          x: x - body.position.x,
          y: y - body.position.y,
        };
        Matter.Body.setAngle(
          body,
          (letterMotion[index].startRotate * Math.PI) / 180,
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
        const offset = visualOffsets[index];
        if (!element || !size || !offset) return;
        const cos = Math.cos(body.angle);
        const sin = Math.sin(body.angle);
        const visualX = body.position.x + offset.x * cos - offset.y * sin;
        const visualY =
          body.position.y +
          offset.x * sin +
          offset.y * cos +
          size.height * physicsOptions.glyphBaselineTrim;
        element.style.transform = `translate3d(${visualX - size.width / 2}px, ${visualY - size.height / 2}px, 0) rotate(${body.angle}rad)`;
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
