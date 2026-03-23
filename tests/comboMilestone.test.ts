import { describe, expect, it } from 'vitest';
import {
  COMBO_MILESTONE_TIERS,
  comboMilestoneBangCount,
  crossedComboMilestone,
} from '../assets/scripts/comboMilestone';

describe('crossedComboMilestone', () => {
  it('9→10 跨越 10', () => {
    expect(crossedComboMilestone(9, 10)).toBe(10);
  });

  it('同一次击杀只返回最高档 10→25', () => {
    expect(crossedComboMilestone(9, 25)).toBe(25);
  });

  it('已达高档后再击杀不重复触发', () => {
    expect(crossedComboMilestone(50, 51)).toBeNull();
  });

  it('99→100 跨越 100', () => {
    expect(crossedComboMilestone(99, 100)).toBe(100);
  });
});

describe('comboMilestoneBangCount', () => {
  it('与档位对应', () => {
    expect(comboMilestoneBangCount(10)).toBe(1);
    expect(comboMilestoneBangCount(25)).toBe(2);
    expect(comboMilestoneBangCount(50)).toBe(3);
    expect(comboMilestoneBangCount(100)).toBe(4);
  });
});

describe('COMBO_MILESTONE_TIERS', () => {
  it('降序', () => {
    expect([...COMBO_MILESTONE_TIERS]).toEqual([100, 50, 25, 10]);
  });
});
