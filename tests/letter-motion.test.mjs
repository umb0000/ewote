import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { letterMotion, physicsOptions } from '../lib/letter-motion.mjs';

test('letters fall one at a time in reading order', () => {
  assert.equal(letterMotion.length, 5);
  for (let i = 1; i < letterMotion.length; i += 1) {
    assert.ok(letterMotion[i].delay > letterMotion[i - 1].delay);
  }
});

test('letters use restrained physical collision settings', () => {
  assert.ok(physicsOptions.restitution > 0);
  assert.ok(physicsOptions.restitution <= 0.12);
  assert.ok(physicsOptions.friction >= 0.5);
  assert.ok(physicsOptions.frictionAir >= 0.015);
  assert.ok(physicsOptions.pileWidthRatio <= 0.75);
  assert.ok(physicsOptions.glyphBaselineTrim > 0);
});

test('letters spawn together in the left half without per-glyph spacing hacks', () => {
  assert.ok(letterMotion.every((motion) => motion.spawnX <= 0.5));
  assert.ok(letterMotion.every((motion) => !('floorBleed' in motion)));
});

test('home hero fills the viewport on every screen size', () => {
  const css = readFileSync(
    new URL('../app/globals.css', import.meta.url),
    'utf8',
  );
  const heroRules = [...css.matchAll(/\.home-hero\s*\{([^}]+)\}/g)].map(
    (match) => match[1],
  );

  assert.ok(heroRules.length >= 1);
  assert.ok(heroRules.every((rule) => /height:\s*100svh/.test(rule)));
  assert.ok(heroRules.every((rule) => !/max-height:/.test(rule)));
});

test('the lowest letter sits directly on the viewport floor', () => {
  const css = readFileSync(
    new URL('../app/globals.css', import.meta.url),
    'utf8',
  );

  assert.match(css, /\.letter-pile\s*\{[^}]*bottom:\s*0;/s);
  assert.match(css, /\.letter-floor\s*\{[^}]*bottom:\s*0;/s);
});

test('hero letters are scaled to one and a half times their original size', () => {
  const css = readFileSync(
    new URL('../app/globals.css', import.meta.url),
    'utf8',
  );

  assert.match(css, /font-size:\s*clamp\(195px,\s*36vw,\s*585px\)/);
  assert.match(css, /font-size:\s*45vw/);
});

test('glyph collision boxes trim invisible font leading', () => {
  const source = readFileSync(
    new URL('../app/letter-pile.tsx', import.meta.url),
    'utf8',
  );

  assert.match(source, /bodyHeight\s*=\s*rect\.height\s*\*\s*0\.82/);
});

test('mobile viewport height changes do not rebuild the physics world', () => {
  const source = readFileSync(
    new URL('../app/letter-pile.tsx', import.meta.url),
    'utf8',
  );

  assert.match(source, /lastObservedWidth/);
  assert.match(source, /Math\.abs\(width\s*-\s*lastObservedWidth\)\s*<\s*2/);
});
