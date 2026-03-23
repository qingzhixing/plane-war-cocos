import { describe, expect, it } from 'vitest';
import { distSq, inGrazeRing } from '../assets/scripts/grazeMath';

describe('grazeMath', () => {
  it('distSq', () => {
    expect(distSq(0, 0, 3, 4)).toBe(25);
  });

  it('inGrazeRing: 环上点算在内', () => {
    expect(inGrazeRing(0, 0, 100, 10, 110, 0)).toBe(true);
  });

  it('inGrazeRing: 环外为 false', () => {
    expect(inGrazeRing(0, 0, 100, 10, 200, 0)).toBe(false);
  });
});
