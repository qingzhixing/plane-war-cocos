import { describe, expect, it } from 'vitest';
import {
  BOSS_BASE_HP,
  BOSS_HP_TIER_MULT,
  bossMaxHpForTier,
} from '../assets/scripts/GameConfig';

describe('GameConfig bossMaxHpForTier', () => {
  it('tier 0 等于基数', () => {
    expect(bossMaxHpForTier(0)).toBe(BOSS_BASE_HP);
  });

  it('tier 1 为基数×威胁倍率（四舍五入）', () => {
    expect(bossMaxHpForTier(1)).toBe(
      Math.round(BOSS_BASE_HP * BOSS_HP_TIER_MULT),
    );
  });

  it('负 tier 视为 0', () => {
    expect(bossMaxHpForTier(-3)).toBe(BOSS_BASE_HP);
  });
});
