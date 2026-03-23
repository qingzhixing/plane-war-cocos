import { describe, expect, it } from 'vitest';
import { BattleRunState } from '../assets/scripts/battleRunState';

describe('BattleRunState', () => {
  it('tryEnterUpgradeFlow 首次为 true，重复为 false', () => {
    const r = new BattleRunState();
    expect(r.tryEnterUpgradeFlow()).toBe(true);
    expect(r.waitingForUpgrade).toBe(true);
    expect(r.tryEnterUpgradeFlow()).toBe(false);
  });

  it('addScoreFromKill 按 scoreMultiplier 累计', () => {
    const r = new BattleRunState();
    r.scoreMultiplier = 2;
    r.addScoreFromKill(10);
    expect(r.score).toBe(20);
  });

  it('finishUpgradeAdvanceWave 结束等待并递增波次', () => {
    const r = new BattleRunState();
    r.tryEnterUpgradeFlow();
    r.finishUpgradeAdvanceWave();
    expect(r.waitingForUpgrade).toBe(false);
    expect(r.activeWave).toBe(2);
  });

  it('applyScoreUpUpgrade 增加乘区', () => {
    const r = new BattleRunState();
    r.applyScoreUpUpgrade();
    expect(r.scoreMultiplier).toBeCloseTo(1.15);
  });
});
