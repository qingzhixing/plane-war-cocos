import { describe, expect, it } from 'vitest';
import * as GameConfig from '../assets/scripts/GameConfig';
import { WaveSpawnScheduler } from '../assets/scripts/waveSpawnScheduler';

describe('WaveSpawnScheduler', () => {
  it('startWave(1) 剩余等于基础数量', () => {
    const s = new WaveSpawnScheduler();
    s.startWave(1);
    expect(s.spawnWaveForEnemies).toBe(1);
    expect(s.remaining).toBe(GameConfig.ENEMIES_PER_WAVE_BASE);
    expect(s.clearReported).toBe(false);
  });

  it('startWave(2) 含增量', () => {
    const s = new WaveSpawnScheduler();
    s.startWave(2);
    expect(s.remaining).toBe(
      GameConfig.ENEMIES_PER_WAVE_BASE +
        GameConfig.ENEMIES_PER_WAVE_INCREMENT * 1,
    );
  });

  it('tick 在足够大 dt 下刷完配额', () => {
    const s = new WaveSpawnScheduler();
    s.startWave(1);
    let spawns = 0;
    s.tick(999, () => {
      spawns++;
    });
    expect(spawns).toBe(GameConfig.ENEMIES_PER_WAVE_BASE);
    expect(s.remaining).toBe(0);
  });

  it('markWaveClearNotified 设置 clearReported', () => {
    const s = new WaveSpawnScheduler();
    s.startWave(1);
    expect(s.clearReported).toBe(false);
    s.markWaveClearNotified();
    expect(s.clearReported).toBe(true);
  });

  it('startBossWave 仅一架且首 tick 可刷', () => {
    const s = new WaveSpawnScheduler();
    s.startBossWave(GameConfig.BOSS_WAVE);
    expect(s.remaining).toBe(1);
    expect(s.spawnWaveForEnemies).toBe(GameConfig.BOSS_WAVE);
    let spawns = 0;
    s.tick(0.1, () => {
      spawns++;
    });
    expect(spawns).toBe(1);
    expect(s.remaining).toBe(0);
  });

  it('startContinuationMobWave tier0 波1 与 05b 表一致', () => {
    const s = new WaveSpawnScheduler();
    s.startContinuationMobWave(1, 0);
    expect(s.remaining).toBe(8);
    expect(s.mobSpawnWaveForHp).toBe(8);
    let spawns = 0;
    s.tick(999, () => {
      spawns++;
    });
    expect(spawns).toBe(8);
    expect(s.remaining).toBe(0);
  });
});
