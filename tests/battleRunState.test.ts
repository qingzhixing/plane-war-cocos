import { describe, expect, it } from 'vitest';
import { DPS_WINDOW_SEC } from '../assets/scripts/GameConfig';
import { BattleRunState } from '../assets/scripts/battleRunState';

describe('BattleRunState', () => {
  it('tryEnterUpgradeFlow 首次为 true，重复为 false', () => {
    const r = new BattleRunState();
    expect(r.tryEnterUpgradeFlow()).toBe(true);
    expect(r.waitingForUpgrade).toBe(true);
    expect(r.tryEnterUpgradeFlow()).toBe(false);
  });

  it('onEnemyKill 累连击并按区间计分（无评分乘区）', () => {
    const r = new BattleRunState();
    for (let i = 0; i < 9; i++) {
      r.onEnemyKill(0, 10);
    }
    expect(r.combo).toBe(9);
    expect(r.score).toBe(90);
    r.onEnemyKill(0, 10);
    expect(r.combo).toBe(10);
    expect(r.score).toBe(102);
  });

  it('addScoreRaw 仍走评分乘区', () => {
    const r = new BattleRunState();
    r.scoreMultiplier = 2;
    r.addScoreRaw(10);
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

  it('applyComboBoostUpgrade 增加击杀连击增量', () => {
    const r = new BattleRunState();
    r.applyComboBoostUpgrade();
    r.onEnemyKill(0, 10);
    expect(r.combo).toBe(2);
  });

  it('resetCombo 清零', () => {
    const r = new BattleRunState();
    r.onEnemyKill(0, 10);
    r.resetCombo();
    expect(r.combo).toBe(0);
  });

  it('tryAbsorbHitWithComboGuard 有层时扣层且不断连', () => {
    const r = new BattleRunState();
    r.comboGuardStacks = 1;
    r.onEnemyKill(0, 10);
    expect(r.tryAbsorbHitWithComboGuard()).toBe(true);
    expect(r.comboGuardStacks).toBe(0);
    expect(r.combo).toBe(1);
  });

  it('tryAbsorbHitWithComboGuard 无层时返回 false', () => {
    const r = new BattleRunState();
    expect(r.tryAbsorbHitWithComboGuard()).toBe(false);
  });

  it('applyContinueChallenge 赠送护盾 +1', () => {
    const r = new BattleRunState();
    r.applyContinueChallenge();
    expect(r.comboGuardStacks).toBe(1);
  });

  it('DPS 滑动窗口：持续伤害提高 currentDps 与 maxDps', () => {
    const r = new BattleRunState();
    for (let i = 0; i < 5; i++) {
      r.recordPlayerDamageToEnemies(10, i * 0.1);
    }
    expect(r.currentDps).toBeCloseTo(50 / DPS_WINDOW_SEC);
    expect(r.maxDps).toBe(r.currentDps);
  });
});
