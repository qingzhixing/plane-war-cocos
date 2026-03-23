import {
  EventKeyboard,
  EventMouse,
  EventTouch,
  Input,
  input,
} from 'cc';

/** 与 `PlayerController` 私有方法一一对应，便于 `input.off` 使用同一引用 */
export type PlayerInputHandlers = {
  onTouchStart: (e: EventTouch) => void;
  onTouchMove: (e: EventTouch) => void;
  onTouchEnd: (e: EventTouch) => void;
  onMouseDown: (e: EventMouse) => void;
  onMouseMove: (e: EventMouse) => void;
  onMouseUp: (e: EventMouse) => void;
  onKeyDown: (e: EventKeyboard) => void;
  onKeyUp: (e: EventKeyboard) => void;
};

export function bindPlayerInput(
  target: object,
  h: PlayerInputHandlers,
): void {
  input.on(Input.EventType.TOUCH_START, h.onTouchStart, target);
  input.on(Input.EventType.TOUCH_MOVE, h.onTouchMove, target);
  input.on(Input.EventType.TOUCH_END, h.onTouchEnd, target);
  input.on(Input.EventType.TOUCH_CANCEL, h.onTouchEnd, target);

  input.on(Input.EventType.MOUSE_DOWN, h.onMouseDown, target);
  input.on(Input.EventType.MOUSE_MOVE, h.onMouseMove, target);
  input.on(Input.EventType.MOUSE_UP, h.onMouseUp, target);

  input.on(Input.EventType.KEY_DOWN, h.onKeyDown, target);
  input.on(Input.EventType.KEY_UP, h.onKeyUp, target);
}

export function unbindPlayerInput(
  target: object,
  h: PlayerInputHandlers,
): void {
  input.off(Input.EventType.TOUCH_START, h.onTouchStart, target);
  input.off(Input.EventType.TOUCH_MOVE, h.onTouchMove, target);
  input.off(Input.EventType.TOUCH_END, h.onTouchEnd, target);
  input.off(Input.EventType.TOUCH_CANCEL, h.onTouchEnd, target);

  input.off(Input.EventType.MOUSE_DOWN, h.onMouseDown, target);
  input.off(Input.EventType.MOUSE_MOVE, h.onMouseMove, target);
  input.off(Input.EventType.MOUSE_UP, h.onMouseUp, target);

  input.off(Input.EventType.KEY_DOWN, h.onKeyDown, target);
  input.off(Input.EventType.KEY_UP, h.onKeyUp, target);
}
