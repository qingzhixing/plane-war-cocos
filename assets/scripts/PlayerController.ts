import {
  _decorator,
  Color,
  Component,
  EventKeyboard,
  EventMouse,
  EventTouch,
  Graphics,
  KeyCode,
  Node,
  UITransform,
  Vec2,
} from 'cc';
import * as GameConfig from './GameConfig';
import {
  bindPlayerInput,
  type PlayerInputHandlers,
  unbindPlayerInput,
} from './playerInput';
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

  private _inputHandlers: PlayerInputHandlers | null = null;

  start() {
    this._playField = this.node.parent;

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
  }

  onDestroy() {
    if (this._inputHandlers) {
      unbindPlayerInput(this, this._inputHandlers);
      this._inputHandlers = null;
    }
  }

  update(dt: number) {
    this._applyKeyboardMove(dt);
    this._clampToBounds();

    this._fireTimer -= dt;
    if (this._fireTimer <= 0) {
      this._fireTimer = this._fireInterval;
      this._spawnBullets();
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
    let dx = 0;
    let dy = 0;
    const k = this._pressedKeys;
    if (k.has(KeyCode.KEY_W) || k.has(KeyCode.ARROW_UP)) dy += 1;
    if (k.has(KeyCode.KEY_S) || k.has(KeyCode.ARROW_DOWN)) dy -= 1;
    if (k.has(KeyCode.KEY_A) || k.has(KeyCode.ARROW_LEFT)) dx -= 1;
    if (k.has(KeyCode.KEY_D) || k.has(KeyCode.ARROW_RIGHT)) dx += 1;
    if (dx === 0 && dy === 0) {
      return;
    }
    const len = Math.sqrt(dx * dx + dy * dy);
    const m =
      GameConfig.MOVE_SPEED * GameConfig.KEYBOARD_SPEED_MULT * dt * (1 / len);
    const p = this.node.position;
    this.node.setPosition(p.x + dx * m, p.y + dy * m, p.z);
  }

  private _clampToBounds() {
    const maxX = GameConfig.DESIGN_W * 0.5 - GameConfig.MARGIN;
    const maxY = GameConfig.DESIGN_H * 0.5 - GameConfig.MARGIN;
    const p = this.node.position;
    const x = Math.min(maxX, Math.max(-maxX, p.x));
    const y = Math.min(maxY, Math.max(-maxY, p.y));
    if (x !== p.x || y !== p.y) {
      this.node.setPosition(x, y, p.z);
    }
  }

  private _spawnBullets() {
    if (!this._playField) {
      return;
    }
    const count = Math.max(1, Math.floor(this._bulletCount));
    const spread = 20;
    for (let i = 0; i < count; i++) {
      const ox =
        count === 1 ? 0 : (i - (count - 1) * 0.5) * spread;
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
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len > GameConfig.MAX_DRAG_DELTA) {
      const s = GameConfig.MAX_DRAG_DELTA / len;
      dx *= s;
      dy *= s;
    }
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
