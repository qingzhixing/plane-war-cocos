import { describe, expect, it } from 'vitest';
import {
  NEAR_RECORD_SCORE_RATIO,
  nearRecordScoreThreshold,
} from '../assets/scripts/GameConfig';

describe('nearRecordScoreThreshold', () => {
  it('历史最高 <2 时无阈值', () => {
    expect(nearRecordScoreThreshold(0)).toBeNull();
    expect(nearRecordScoreThreshold(1)).toBeNull();
  });

  it('100 分档约为 90', () => {
    expect(nearRecordScoreThreshold(100)).toBe(90);
  });

  it('区间 [t, best) 非空', () => {
    const best = 50;
    const t = nearRecordScoreThreshold(best);
    expect(t).not.toBeNull();
    expect(t!).toBeGreaterThanOrEqual(1);
    expect(t!).toBeLessThan(best);
  });

  it('NEAR_RECORD_SCORE_RATIO 为预期小数', () => {
    expect(NEAR_RECORD_SCORE_RATIO).toBe(0.9);
  });
});
