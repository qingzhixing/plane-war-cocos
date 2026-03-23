import { _decorator, Component } from 'cc';
import { getBattleMain } from './battleAccess';
import * as GameConfig from './GameConfig';
import { enemyRegister, enemyUnregister, type EnemyHitTarget } from './EnemyRegistry';

const { ccclass } = _decorator;

@ccclass('EnemyBasic')
export class EnemyBasic extends Component implements EnemyHitTarget {
  /** 与 enemy_basic 生成时的逻辑波次一致，用于 apply_wave_scaling */
  spawnWave = 1;
  /** 与 EnemyBase exp_value 默认一致 */
  expValue = 5;
  /** 与 EnemyBase score_value 默认一致 */
  scoreValue = 10;
  maxHp = GameConfig.ENEMY_MAX_HP;
  private _hp = 0;
  speed = GameConfig.ENEMY_SPEED;

  onLoad() {
    const f = GameConfig.waveHpFactor(this.spawnWave);
    const mh = Math.max(1, Math.round(GameConfig.ENEMY_MAX_HP * f));
    this.maxHp = mh;
    this._hp = mh;
    enemyRegister(this);
  }

  onDestroy() {
    enemyUnregister(this);
  }

  update(dt: number) {
    const p = this.node.position;
    const ny = p.y - this.speed * dt;
    this.node.setPosition(p.x, ny, p.z);
    const limit = GameConfig.DESIGN_H * 0.5 + 120;
    if (ny < -limit) {
      this.node.destroy();
    }
  }

  applyDamage(amount: number) {
    this._hp -= amount;
    if (this._hp <= 0) {
      getBattleMain()?.onEnemyKill(this.expValue, this.scoreValue);
      this.node.destroy();
    }
  }
}
