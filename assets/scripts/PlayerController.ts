import {
  _decorator,
  Color,
  Component,
  EventKeyboard,
  EventMouse,
  EventTouch,
  Graphics,
  Input,
  KeyCode,
  Node,
  UITransform,
  Vec2,
  input,
} from 'cc';
import { PlayerBullet } from './PlayerBullet';
import * as GameConfig from './GameConfig';

const { ccclass } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {
  private _playField: Node | null = null;
  private _fireTimer = 0;
  private _hasPointer = false;
  private _lastUi = new Vec2();
  private _pressedKeys = new Set<number>();
  private _mouseHeld = false;

  start() {
    this._playField = this.node.parent;

    input.on(Input.EventType.TOUCH_START, this._onTouchStart, this);
    input.on(Input.EventType.TOUCH_MOVE, this._onTouchMove, this);
    input.on(Input.EventType.TOUCH_END, this._onTouchEnd, this);
    input.on(Input.EventType.TOUCH_CANCEL, this._onTouchEnd, this);

    input.on(Input.EventType.MOUSE_DOWN, this._onMouseDown, this);
    input.on(Input.EventType.MOUSE_MOVE, this._onMouseMove, this);
    input.on(Input.EventType.MOUSE_UP, this._onMouseUp, this);

    input.on(Input.EventType.KEY_DOWN, this._onKeyDown, this);
    input.on(Input.EventType.KEY_UP, this._onKeyUp, this);
  }

  onDestroy() {
    input.off(Input.EventType.TOUCH_START, this._onTouchStart, this);
    input.off(Input.EventType.TOUCH_MOVE, this._onTouchMove, this);
    input.off(Input.EventType.TOUCH_END, this._onTouchEnd, this);
    input.off(Input.EventType.TOUCH_CANCEL, this._onTouchEnd, this);

    input.off(Input.EventType.MOUSE_DOWN, this._onMouseDown, this);
    input.off(Input.EventType.MOUSE_MOVE, this._onMouseMove, this);
    input.off(Input.EventType.MOUSE_UP, this._onMouseUp, this);

    input.off(Input.EventType.KEY_DOWN, this._onKeyDown, this);
    input.off(Input.EventType.KEY_UP, this._onKeyUp, this);
  }

  update(dt: number) {
    this._applyKeyboardMove(dt);
    this._clampToBounds();

    this._fireTimer -= dt;
    if (this._fireTimer <= 0) {
      this._fireTimer = GameConfig.FIRE_INTERVAL;
      this._spawnBullet();
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

  private _spawnBullet() {
    if (!this._playField) {
      return;
    }
    const n = new Node('PlayerBullet');
    const ut = n.addComponent(UITransform);
    ut.setContentSize(8, 16);
    ut.setAnchorPoint(0.5, 0.5);
    const g = n.addComponent(Graphics);
    g.lineWidth = 0;
    g.fillColor = new Color(255, 255, 120, 255);
    g.rect(-4, -8, 8, 16);
    g.fill();
    n.addComponent(PlayerBullet);

    const p = this.node.position;
    n.setPosition(p.x, p.y + 28, 0);
    this._playField.addChild(n);
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

  private _onTouchStart(e: EventTouch) {
    this._beginPointer(e);
  }

  private _onTouchMove(e: EventTouch) {
    this._movePointer(e);
  }

  private _onTouchEnd(e: EventTouch) {
    this._endPointer();
  }

  private _onMouseDown(e: EventMouse) {
    if (e.getButton() !== EventMouse.BUTTON_LEFT) {
      return;
    }
    this._mouseHeld = true;
    this._beginPointer(e);
  }

  private _onMouseMove(e: EventMouse) {
    if (!this._mouseHeld) {
      return;
    }
    this._movePointer(e);
  }

  private _onMouseUp(e: EventMouse) {
    if (e.getButton() !== EventMouse.BUTTON_LEFT) {
      return;
    }
    this._mouseHeld = false;
    this._endPointer();
  }

  private _onKeyDown(e: EventKeyboard) {
    this._pressedKeys.add(e.keyCode);
  }

  private _onKeyUp(e: EventKeyboard) {
    this._pressedKeys.delete(e.keyCode);
  }
}
