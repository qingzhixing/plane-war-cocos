import { _decorator, Color, Component, Graphics, Node, UITransform } from 'cc';
import { EnemyBasic } from './EnemyBasic';
import * as GameConfig from './GameConfig';

const { ccclass } = _decorator;

@ccclass('EnemySpawner')
export class EnemySpawner extends Component {
  private _acc = 0;
  private readonly _interval = GameConfig.ENEMY_SPAWN_INTERVAL;

  update(dt: number) {
    this._acc += dt;
    if (this._acc < this._interval) {
      return;
    }
    this._acc -= this._interval;
    this._spawnOne();
  }

  private _spawnOne() {
    const n = new Node('Enemy');
    const ut = n.addComponent(UITransform);
    ut.setContentSize(40, 40);
    ut.setAnchorPoint(0.5, 0.5);
    const g = n.addComponent(Graphics);
    g.lineWidth = 0;
    g.fillColor = new Color(255, 120, 80, 255);
    g.rect(-20, -20, 40, 40);
    g.fill();
    n.addComponent(EnemyBasic);
    const span = GameConfig.DESIGN_W - 80;
    const x = (Math.random() - 0.5) * span;
    n.setPosition(x, GameConfig.ENEMY_SPAWN_Y, 0);
    this.node.addChild(n);
  }
}
