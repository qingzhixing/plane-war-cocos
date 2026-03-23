import {
  _decorator,
  Component,
  EventKeyboard,
  EventMouse,
  EventTouch,
  isValid,
  Node,
  UIOpacity,
  UITransform,
  Vec2,
} from 'cc';
import { getBattleMain } from './battleAccess';
import { setPlayerTargetNode } from './playerPositionAccess';
import * as GameConfig from './GameConfig';
import { enemyBulletsSnapshot } from './EnemyBulletRegistry';
import { collectEnemyBulletsTouchingPlayer } from './enemyBulletPlayerCollision';
import { enemiesSnapshot } from './EnemyRegistry';
import { collectEnemiesTouchingPlayer } from './playerEnemyCollision';
import {
  bindPlayerInput,
  type PlayerInputHandlers,
  unbindPlayerInput,
} from './playerInput';
import {
  clampDeltaLength,
  clampToPlayableRect,
  keyboardDisplacement,
  keyboardMoveDirection,
  multiShotOffsets,
  playableHalfExtents,
} from './playerMotion';
import { spawnPlayerBullet } from './playerBulletFactory';

const { ccclass } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {
  private _playField: Node | null = null;
  private _fireTimer = 0;
  private _fireInterval = GameConfig.FIRE_INTERVAL;
  private _damageMult = 1;
  private _bulletCount = 1;
  private _bulletSpeedMult = 1;
  private _hasPointer = false;
  private _lastUi = new Vec2();
  private _pressedKeys = new Set<number>();
  private _mouseHeld = false;

  private _halfX = 0;
  private _halfY = 0;

  private _inputHandlers: PlayerInputHandlers | null = null;
  /** 实际受击后的无敌剩余时间（秒） */
  private _invulnRemain = 0;
  private _blinkPhase = 0;

  start() {
    this._playField = this.node.parent;

    const { halfX, halfY } = playableHalfExtents(
      GameConfig.DESIGN_W,
      GameConfig.DESIGN_H,
      GameConfig.MARGIN,
    );
    this._halfX = halfX;
    this._halfY = halfY;

    this._inputHandlers = {
      onTouchStart: this._onTouchStart,
      onTouchMove: this._onTouchMove,
      onTouchEnd: this._onTouchEnd,
      onMouseDown: this._onMouseDown,
      onMouseMove: this._onMouseMove,
      onMouseUp: this._onMouseUp,
      onKeyDown: this._onKeyDown,
      onKeyUp: this._onKeyUp,
    };
    bindPlayerInput(this, this._inputHandlers);
    setPlayerTargetNode(this.node);
  }

  onDestroy() {
    setPlayerTargetNode(null);
    if (this._inputHandlers) {
      unbindPlayerInput(this, this._inputHandlers);
      this._inputHandlers = null;
    }
  }

  update(dt: number) {
    this._tickInvuln(dt);
    this._applyKeyboardMove(dt);
    this._clampToBounds();
    this._resolvePlayerHazards();

    this._fireTimer -= dt;
    if (this._fireTimer <= 0) {
      this._fireTimer = this._fireInterval;
      this._spawnBullets();
    }
  }

  private _ensureUiOpacity(): UIOpacity {
    let op = this.node.getComponent(UIOpacity);
    if (!op) {
      op = this.node.addComponent(UIOpacity);
    }
    return op;
  }

  private _tickInvuln(dt: number) {
    if (this._invulnRemain <= 0) {
      return;
    }
    this._invulnRemain = Math.max(0, this._invulnRemain - dt);
    this._blinkPhase += dt;
    const op = this._ensureUiOpacity();
    if (this._invulnRemain <= 0) {
      op.opacity = 255;
      this._blinkPhase = 0;
      return;
    }
    const on =
      Math.floor(this._blinkPhase * 2 * GameConfig.PLAYER_INVULN_BLINK_HZ) %
        2 ===
      0;
    op.opacity = on ? 255 : 72;
  }

  /** 敌弹命中或撞机：销毁相关节点（不计击杀分）、每帧最多一次 onPlayerHit */
  private _resolvePlayerHazards() {
    if (this._invulnRemain > 0) {
      return;
    }
    const selfUt = this.node.getComponent(UITransform);
    if (!selfUt) {
      return;
    }
    const b = selfUt.getBoundingBoxToWorld();
    let hit = false;
    for (const eb of collectEnemyBulletsTouchingPlayer(
      b,
      enemyBulletsSnapshot(),
    )) {
      if (isValid(eb.node)) {
        eb.node.destroy();
        hit = true;
      }
    }
    for (const e of collectEnemiesTouchingPlayer(b, enemiesSnapshot())) {
      if (isValid(e.node)) {
        e.node.destroy();
        hit = true;
      }
    }
    if (hit) {
      const took = getBattleMain()?.onPlayerHit() ?? false;
      if (took) {
        this._invulnRemain = GameConfig.PLAYER_INVULN_SEC;
        this._blinkPhase = 0;
      }
    }
  }

  applyUpgrade(id: string) {
    switch (id) {
      case 'fire_rate':
        this._fireInterval *= 0.85;
        break;
      case 'damage_percent':
        this._damageMult *= 1.2;
        break;
      case 'multi_shot':
        this._bulletCount += 1;
        break;
      case 'bullet_speed':
        this._bulletSpeedMult *= 1.12;
        break;
      default:
        break;
    }
  }

  private _applyKeyboardMove(dt: number) {
    const dir = keyboardMoveDirection(this._pressedKeys);
    const d = keyboardDisplacement(
      dir,
      dt,
      GameConfig.MOVE_SPEED,
      GameConfig.KEYBOARD_SPEED_MULT,
    );
    if (d.dx === 0 && d.dy === 0) {
      return;
    }
    const p = this.node.position;
    this.node.setPosition(p.x + d.dx, p.y + d.dy, p.z);
  }

  private _clampToBounds() {
    const p = this.node.position;
    const r = clampToPlayableRect(p.x, p.y, this._halfX, this._halfY);
    if (r.moved) {
      this.node.setPosition(r.x, r.y, p.z);
    }
  }

  private _spawnBullets() {
    if (!this._playField) {
      return;
    }
    const spread = 20;
    for (const ox of multiShotOffsets(this._bulletCount, spread)) {
      this._spawnOneBullet(ox);
    }
  }

  private _spawnOneBullet(offsetX: number) {
    if (!this._playField) {
      return;
    }
    const p = this.node.position;
    const dmg = Math.max(1, Math.round(GameConfig.BULLET_DAMAGE * this._damageMult));
    const spd = GameConfig.BULLET_SPEED * this._bulletSpeedMult;
    spawnPlayerBullet(this._playField, p.x + offsetX, p.y + 28, dmg, spd);
  }

  private _beginPointer(e: EventTouch | EventMouse) {
    this._hasPointer = true;
    const loc = e.getUILocation();
    this._lastUi.set(loc.x, loc.y);
  }

  private _movePointer(e: EventTouch | EventMouse) {
    if (!this._hasPointer) {
      return;
    }
    const loc = e.getUILocation();
    let dx = loc.x - this._lastUi.x;
    let dy = loc.y - this._lastUi.y;
    const c = clampDeltaLength(dx, dy, GameConfig.MAX_DRAG_DELTA);
    dx = c.dx;
    dy = c.dy;
    this._lastUi.set(loc.x, loc.y);
    const p = this.node.position;
    this.node.setPosition(p.x + dx, p.y + dy, p.z);
  }

  private _endPointer() {
    this._hasPointer = false;
  }

  private _onTouchStart = (e: EventTouch) => {
    this._beginPointer(e);
  };

  private _onTouchMove = (e: EventTouch) => {
    this._movePointer(e);
  };

  private _onTouchEnd = (e: EventTouch) => {
    this._endPointer();
  };

  private _onMouseDown = (e: EventMouse) => {
    if (e.getButton() !== EventMouse.BUTTON_LEFT) {
      return;
    }
    this._mouseHeld = true;
    this._beginPointer(e);
  };

  private _onMouseMove = (e: EventMouse) => {
    if (!this._mouseHeld) {
      return;
    }
    this._movePointer(e);
  };

  private _onMouseUp = (e: EventMouse) => {
    if (e.getButton() !== EventMouse.BUTTON_LEFT) {
      return;
    }
    this._mouseHeld = false;
    this._endPointer();
  };

  private _onKeyDown = (e: EventKeyboard) => {
    this._pressedKeys.add(e.keyCode);
  };

  private _onKeyUp = (e: EventKeyboard) => {
    this._pressedKeys.delete(e.keyCode);
  };
}
