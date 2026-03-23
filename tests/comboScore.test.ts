import { describe, expect, it } from 'vitest';
import { comboScoreCoefficient } from '../assets/scripts/comboScore';

describe('comboScoreCoefficient', () => {
  it('1–9 连为 1.0', () => {
    expect(comboScoreCoefficient(1)).toBe(1.0);
    expect(comboScoreCoefficient(9)).toBe(1.0);
  });

  it('10–24 连为 1.2', () => {
    expect(comboScoreCoefficient(10)).toBe(1.2);
    expect(comboScoreCoefficient(24)).toBe(1.2);
  });

  it('100+ 连为 3.0', () => {
    expect(comboScoreCoefficient(100)).toBe(3.0);
    expect(comboScoreCoefficient(200)).toBe(3.0);
  });
});
