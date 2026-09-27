import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../app/globals.css', import.meta.url), 'utf8');

function rule(selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = css.match(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`, 's'));
  assert.ok(match, `${selector} rule should exist`);
  return match[1];
}

test('ABOUT and CONTACT large copy share the same typography', () => {
  const about = rule('.about > h2');
  const contact = rule('footer h2');
  for (const property of ['font-size', 'font-weight', 'line-height', 'letter-spacing']) {
    const value = ruleBody => ruleBody.match(new RegExp(`${property}:\\s*([^;]+);`))?.[1].trim();
    assert.equal(value(about), value(contact), `${property} should match`);
  }
});
test('ABOUT message uses the same small copy treatment as CONTACT', () => {
  const aboutMessage = rule('.about-message');
  const contactMessage = rule('.contact-placeholder');
  for (const property of ['color', 'font-size']) {
    const value = ruleBody => ruleBody.match(new RegExp(`${property}:\\s*([^;]+);`))?.[1].trim();
    assert.equal(value(aboutMessage), value(contactMessage), `${property} should match`);
  }
});