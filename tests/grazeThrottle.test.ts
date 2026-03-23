import { describe, expect, it } from 'vitest';
import {
  clearGrazeThrottle,
  tryGrazeNow,
} from '../assets/scripts/grazeThrottle';

describe('grazeThrottle', () => {
  it('同目标在节流窗口内只通过一次', () => {
    clearGrazeThrottle();
    expect(tryGrazeNow('a', 1.0, 0.05)).toBe(true);
    expect(tryGrazeNow('a', 1.02, 0.05)).toBe(false);
    expect(tryGrazeNow('a', 1.06, 0.05)).toBe(true);
  });

  it('不同目标互不影响', () => {
    clearGrazeThrottle();
    expect(tryGrazeNow('a', 0, 0.05)).toBe(true);
    expect(tryGrazeNow('b', 0, 0.05)).toBe(true);
  });
});
