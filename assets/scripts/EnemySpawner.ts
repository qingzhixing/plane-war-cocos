import { _decorator, Component } from 'cc';
import { enemiesSnapshot } from './EnemyRegistry';
import { spawnEnemyBasic } from './enemyBasicFactory';
import type { BattleMain } from './BattleMain';
import * as GameConfig from './GameConfig';

const { ccclass } = _decorator;

@ccclass('EnemySpawner')
export class EnemySpawner extends Component {
  private _acc = 0;
  private _interval = GameConfig.ENEMY_SPAWN_INTERVAL;
  private _remaining = 0;
  private _spawnWaveForEnemies = 1;
  private _clearReported = false;
  private _battle: BattleMain | null = null;

  setBattleMain(b: BattleMain | null) {
    this._battle = b;
  }

  /** 对齐 enemy_spawner.gd start_wave */
  startWave(wave: number) {
    this._spawnWaveForEnemies = wave;
    this._remaining =
      GameConfig.ENEMIES_PER_WAVE_BASE +
      GameConfig.ENEMIES_PER_WAVE_INCREMENT * Math.max(0, wave - 1);
    this._acc = 0;
    this._clearReported = false;
  }

  update(dt: number) {
    if (this._remaining > 0) {
      this._acc += dt;
      while (this._acc >= this._interval && this._remaining > 0) {
        this._acc -= this._interval;
        this._spawnOne();
        this._remaining--;
      }
    }

    if (this._remaining <= 0 && !this._clearReported && this._battle) {
      if (enemiesSnapshot().length === 0) {
        this._clearReported = true;
        this._battle.onWaveCleared();
      }
    }
  }

  private _spawnOne() {
    const span = GameConfig.DESIGN_W - 80;
    const x = (Math.random() - 0.5) * span;
    spawnEnemyBasic(
      this.node,
      this._spawnWaveForEnemies,
      x,
      GameConfig.ENEMY_SPAWN_Y,
    );
  }
}
