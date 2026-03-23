import { _decorator, Component, UITransform } from 'cc';
import * as GameConfig from './GameConfig';
import { enemiesSnapshot } from './EnemyRegistry';
import { findFirstEnemyAabbHit } from './playerBulletHitscan';

const { ccclass } = _decorator;

@ccclass('PlayerBullet')
export class PlayerBullet extends Component {
  /** 像素/秒，沿 +Y（屏幕向上） */
  speed = GameConfig.BULLET_SPEED;
  damage = GameConfig.BULLET_DAMAGE;

  update(dt: number) {
    const p = this.node.position;
    const ny = p.y + this.speed * dt;
    this.node.setPosition(p.x, ny, p.z);

    const limit = GameConfig.DESIGN_H * 0.5 + 100;
    if (ny > limit) {
      this.node.destroy();
      return;
    }
    if (this._checkHits()) {
      return;
    }
  }

  private _checkHits(): boolean {
    const selfUt = this.node.getComponent(UITransform);
    if (!selfUt) {
      return false;
    }
    const b = selfUt.getBoundingBoxToWorld();
    const hit = findFirstEnemyAabbHit(b, enemiesSnapshot());
    if (hit) {
      hit.applyDamage(this.damage);
      this.node.destroy();
      return true;
    }
    return false;
  }
}
