import { _decorator, Component } from 'cc';
import * as GameConfig from './GameConfig';
import { enemyRegister, enemyUnregister, type EnemyHitTarget } from './EnemyRegistry';

const { ccclass } = _decorator;

@ccclass('EnemyBasic')
export class EnemyBasic extends Component implements EnemyHitTarget {
  maxHp = GameConfig.ENEMY_MAX_HP;
  private _hp = 0;
  speed = GameConfig.ENEMY_SPEED;

  onLoad() {
    this._hp = this.maxHp;
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
      this.node.destroy();
    }
  }
}
