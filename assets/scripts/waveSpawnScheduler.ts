import * as GameConfig from './GameConfig';

/**
 * 单波「定时刷 N 架」的计时与剩余数量（不含节点、不含清场判定）。
 * 对齐 `enemy_spawner.gd` 的 `start_wave` 与间隔刷怪循环。
 */
export class WaveSpawnScheduler {
  private _acc = 0;
  private _remaining = 0;
  private readonly _interval = GameConfig.ENEMY_SPAWN_INTERVAL;

  /** 本波敌机用于 HP 缩放等的逻辑波次 */
  spawnWaveForEnemies = 1;
  private _clearReported = false;

  get remaining(): number {
    return this._remaining;
  }

  get clearReported(): boolean {
    return this._clearReported;
  }

  /** 对齐 enemy_spawner.gd start_wave */
  startWave(wave: number): void {
    this.spawnWaveForEnemies = wave;
    this._remaining =
      GameConfig.ENEMIES_PER_WAVE_BASE +
      GameConfig.ENEMIES_PER_WAVE_INCREMENT * Math.max(0, wave - 1);
    this._acc = 0;
    this._clearReported = false;
  }

  /** 仅刷一架 Boss（首帧 tick 即触发一次 spawn） */
  startBossWave(wave: number): void {
    this.spawnWaveForEnemies = wave;
    this._remaining = 1;
    this._acc = this._interval;
    this._clearReported = false;
  }

  /**
   * 推进本帧计时；在仍有剩余配额时按间隔调用 `spawnOne`。
   */
  tick(dt: number, spawnOne: () => void): void {
    if (this._remaining <= 0) {
      return;
    }
    this._acc += dt;
    while (this._acc >= this._interval && this._remaining > 0) {
      this._acc -= this._interval;
      spawnOne();
      this._remaining--;
    }
  }

  /** 在清场条件满足并已通知 `BattleMain` 后调用 */
  markWaveClearNotified(): void {
    this._clearReported = true;
  }
}
