import { _decorator, Component } from 'cc';
import { enemiesSnapshot } from './EnemyRegistry';
import { spawnEnemyBasic } from './enemyBasicFactory';
import type { BattleMain } from './BattleMain';
import { WaveSpawnScheduler } from './waveSpawnScheduler';
import * as GameConfig from './GameConfig';

const { ccclass } = _decorator;

@ccclass('EnemySpawner')
export class EnemySpawner extends Component {
  private readonly _sched = new WaveSpawnScheduler();
  private _battle: BattleMain | null = null;

  setBattleMain(b: BattleMain | null) {
    this._battle = b;
  }

  /** 对齐 enemy_spawner.gd start_wave */
  startWave(wave: number) {
    this._sched.startWave(wave);
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
    const span = GameConfig.DESIGN_W - 80;
    const x = (Math.random() - 0.5) * span;
    spawnEnemyBasic(
      this.node,
      this._sched.spawnWaveForEnemies,
      x,
      GameConfig.ENEMY_SPAWN_Y,
    );
  }
}
