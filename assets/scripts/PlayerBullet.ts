import { _decorator, Component } from 'cc';
import * as GameConfig from './GameConfig';

const { ccclass } = _decorator;

@ccclass('PlayerBullet')
export class PlayerBullet extends Component {
  /** 像素/秒，沿 +Y（屏幕向上） */
  speed = GameConfig.BULLET_SPEED;

  update(dt: number) {
    const p = this.node.position;
    const ny = p.y + this.speed * dt;
    this.node.setPosition(p.x, ny, p.z);

    const limit = GameConfig.DESIGN_H * 0.5 + 100;
    if (ny > limit) {
      this.node.destroy();
    }
  }
}
