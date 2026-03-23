import { _decorator, Component } from 'cc';
import { getBattleMain } from './battleAccess';
import { spawnEnemyBullet } from './enemyBulletFactory';
import * as GameConfig from './GameConfig';
import { enemyRegister, enemyUnregister, type EnemyHitTarget } from './EnemyRegistry';
import { playEnemyExplodeSfx, playEnemyHitSfx } from './gameAudio';

const { ccclass } = _decorator;

@ccclass('EnemyElite')
export class EnemyElite extends Component implements EnemyHitTarget {
  spawnWave = 1;
  expValue = GameConfig.ENEMY_ELITE_EXP_VALUE;
  scoreValue = GameConfig.ENEMY_ELITE_SCORE_VALUE;
  maxHp = GameConfig.ENEMY_ELITE_BASE_HP;
  private _hp = 0;
  speed = GameConfig.ENEMY_SPEED * GameConfig.ENEMY_ELITE_SPEED_MULT;
  private _fireAcc = 0;

  onLoad() {
    const f = GameConfig.waveHpFactor(this.spawnWave);
    const mh = Math.max(
      1,
      Math.round(GameConfig.ENEMY_ELITE_BASE_HP * f),
    );
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

    this._fireAcc += dt;
    while (this._fireAcc >= GameConfig.ENEMY_ELITE_FIRE_INTERVAL) {
      this._fireAcc -= GameConfig.ENEMY_ELITE_FIRE_INTERVAL;
      const pf = this.node.parent;
      if (pf) {
        const tier = getBattleMain()?.getThreatTier() ?? 0;
        const mag =
          GameConfig.enemyBulletSpeedForTier(tier) *
          GameConfig.ENEMY_ELITE_RING_BULLET_SPEED_MULT;
        const n = GameConfig.ENEMY_ELITE_RING_BULLETS;
        for (let i = 0; i < n; i++) {
          const theta = (2 * Math.PI * i) / n - Math.PI / 2;
          const vx = Math.cos(theta) * mag;
          const vy = Math.sin(theta) * mag;
          spawnEnemyBullet(pf, p.x, p.y - 28, { velX: vx, velY: vy });
        }
      }
    }

    const limit = GameConfig.DESIGN_H * 0.5 + 120;
    if (ny < -limit) {
      this.node.destroy();
    }
  }

  applyDamage(amount: number) {
    this._hp -= amount;
    if (this._hp <= 0) {
      playEnemyExplodeSfx();
      getBattleMain()?.onEnemyKill(this.expValue, this.scoreValue);
      this.node.destroy();
    } else {
      playEnemyHitSfx();
    }
  }
}
