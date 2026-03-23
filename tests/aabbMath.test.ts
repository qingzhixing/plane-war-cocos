import { describe, expect, it } from 'vitest';
import { aabbOverlap } from '../assets/scripts/aabbMath';

describe('aabbOverlap', () => {
  it('重叠时返回 true', () => {
    expect(aabbOverlap(0, 0, 10, 10, 5, 5, 10, 10)).toBe(true);
  });

  it('分离时返回 false', () => {
    expect(aabbOverlap(0, 0, 10, 10, 20, 20, 5, 5)).toBe(false);
  });

  it('仅边贴边时不相交（与 `Rect.intersects` 常见实现一致）', () => {
    expect(aabbOverlap(0, 0, 10, 10, 10, 0, 5, 5)).toBe(false);
  });
});
