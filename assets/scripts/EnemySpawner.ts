import { _decorator, Component } from 'cc';
import { enemiesSnapshot } from './EnemyRegistry';
import { spawnEnemyBasic } from './enemyBasicFactory';
import { spawnEnemyBoss } from './enemyBossFactory';
import type { BattleMain } from './BattleMain';
import { WaveSpawnScheduler } from './waveSpawnScheduler';
import * as GameConfig from './GameConfig';

const { ccclass } = _decorator;

@ccclass('EnemySpawner')
export class EnemySpawner extends Component {
  private readonly _sched = new WaveSpawnScheduler();
  private _battle: BattleMain | null = null;
  private _bossWave = false;
  private _threatTier = 0;
  private _continuationBossSpawn = false;

  setBattleMain(b: BattleMain | null) {
    this._battle = b;
  }

  /** 对齐 enemy_spawner.gd start_wave */
  startWave(
    wave: number,
    threatTier = 0,
    continuationBossSpawn = false,
    inContinuationBlock = false,
  ) {
    this._threatTier = threatTier;
    this._continuationBossSpawn = continuationBossSpawn;
    this._bossWave = wave === GameConfig.BOSS_WAVE;
    if (this._bossWave) {
      this._sched.startBossWave(wave);
    } else if (
      inContinuationBlock &&
      wave >= 1 &&
      wave < GameConfig.BOSS_WAVE
    ) {
      this._sched.startContinuationMobWave(wave, threatTier);
    } else {
      this._sched.startWave(wave);
    }
  }

  update(dt: number) {
    this._sched.tick(dt, () => this._spawnOne());

    if (
      this._sched.remaining <= 0 &&
      !this._sched.clearReported &&
      this._battle
    ) {
      if (enemiesSnapshot().length === 0) {
        this._sched.markWaveClearNotified();
        this._battle.onWaveCleared();
      }
    }
  }

  private _spawnOne() {
    if (this._bossWave) {
      this._bossWave = false;
      spawnEnemyBoss(
        this.node,
        this._sched.spawnWaveForEnemies,
        this._threatTier,
        this._continuationBossSpawn,
      );
      return;
    }
    const span = GameConfig.DESIGN_W - 80;
    const x = (Math.random() - 0.5) * span;
    spawnEnemyBasic(
      this.node,
      this._sched.mobSpawnWaveForHp,
      x,
      GameConfig.ENEMY_SPAWN_Y,
    );
  }
}
