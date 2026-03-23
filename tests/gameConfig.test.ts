import { describe, expect, it } from 'vitest';
import {
  BOSS_BASE_HP,
  BOSS_CONTINUATION_MULT,
  BOSS_HP_TIER_MULT,
  bossMaxHpForSpawn,
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

describe('GameConfig bossMaxHpForSpawn', () => {
  it('非续战 Boss 同 bossMaxHpForTier', () => {
    expect(bossMaxHpForSpawn(1, false)).toBe(bossMaxHpForTier(1));
  });

  it('续战 Boss 再乘 (3.2 + tier)', () => {
    const tier = 1;
    const base = bossMaxHpForTier(tier);
    expect(bossMaxHpForSpawn(tier, true)).toBe(
      Math.round(base * (BOSS_CONTINUATION_MULT + tier)),
    );
  });

  it('续战 tier 0 仍乘 3.2', () => {
    expect(bossMaxHpForSpawn(0, true)).toBe(
      Math.round(BOSS_BASE_HP * BOSS_CONTINUATION_MULT),
    );
  });
});
