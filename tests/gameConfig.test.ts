import { describe, expect, it } from 'vitest';
import {
  BOSS_BASE_HP,
  BOSS_CONTINUATION_MULT,
  BOSS_HP_TIER_MULT,
  BOSS_WAVE,
  ENEMY_BULLET_SPEED,
  ENEMY_BULLET_SPEED_TIER_CAP,
  ENEMY_SPAWN_INTERVAL,
  MAIN_LINE_ELITE_CHANCE,
  bossMaxHpForSpawn,
  bossMaxHpForTier,
  continuationBlockEliteRate,
  continuationBlockEnemyCount,
  continuationBlockEquivalentHpWave,
  continuationBlockSpawnIntervalMult,
  enemyBulletSpeedForTier,
  enemyBulletSpeedMultiplier,
  enemyMobilityTierMult,
  ENEMY_MOBILITY_TIER_BASE,
  mainLineEliteChance,
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

describe('GameConfig 续战块刷怪（05b）', () => {
  it('continuationBlockEnemyCount 波1 tier0 为 8', () => {
    expect(continuationBlockEnemyCount(1, 0)).toBe(8);
  });

  it('continuationBlockEnemyCount 波1 tier1 为 8+2', () => {
    expect(continuationBlockEnemyCount(1, 1)).toBe(10);
  });

  it('continuationBlockEnemyCount 波7 tier1 为 22+3', () => {
    expect(continuationBlockEnemyCount(7, 1)).toBe(25);
  });

  it('continuationBlockEquivalentHpWave 1～7 为 8～14', () => {
    expect(continuationBlockEquivalentHpWave(1)).toBe(8);
    expect(continuationBlockEquivalentHpWave(7)).toBe(14);
  });

  it('continuationBlockSpawnIntervalMult 与表一致', () => {
    expect(continuationBlockSpawnIntervalMult(1)).toBeCloseTo(0.88);
    expect(
      continuationBlockSpawnIntervalMult(1) * ENEMY_SPAWN_INTERVAL,
    ).toBeCloseTo(0.88);
  });
});

describe('GameConfig enemyBulletSpeedForTier', () => {
  it('tier 0 倍率为 1', () => {
    expect(enemyBulletSpeedMultiplier(0)).toBe(1);
    expect(enemyBulletSpeedForTier(0)).toBe(ENEMY_BULLET_SPEED);
  });

  it('高 tier 不超过 1.35', () => {
    expect(enemyBulletSpeedMultiplier(99)).toBe(ENEMY_BULLET_SPEED_TIER_CAP);
  });
});

describe('GameConfig enemyMobilityTierMult', () => {
  it('tier 0 为 1', () => {
    expect(enemyMobilityTierMult(0)).toBe(1);
  });

  it('tier 1 为 1.12', () => {
    expect(enemyMobilityTierMult(1)).toBeCloseTo(ENEMY_MOBILITY_TIER_BASE);
  });
});

describe('GameConfig 精英率', () => {
  it('mainLineEliteChance 第 1～2 波为 0', () => {
    expect(mainLineEliteChance(1)).toBe(0);
    expect(mainLineEliteChance(2)).toBe(0);
  });

  it('mainLineEliteChance 第 3～7 波为 MAIN_LINE_ELITE_CHANCE', () => {
    expect(mainLineEliteChance(3)).toBe(MAIN_LINE_ELITE_CHANCE);
    expect(mainLineEliteChance(7)).toBe(MAIN_LINE_ELITE_CHANCE);
  });

  it('mainLineEliteChance Boss 波为 0', () => {
    expect(mainLineEliteChance(BOSS_WAVE)).toBe(0);
  });

  it('continuationBlockEliteRate 与 05b 表一致', () => {
    expect(continuationBlockEliteRate(1)).toBe(0.22);
    expect(continuationBlockEliteRate(4)).toBe(0.4);
    expect(continuationBlockEliteRate(7)).toBe(0.54);
  });
});
