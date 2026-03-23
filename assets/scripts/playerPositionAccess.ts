import { isValid, type Node } from 'cc';

/** 供追踪敌弹读取玩家机位置（`PlayerController` 在 `start` / `onDestroy` 注册） */
let _player: Node | null = null;

export function setPlayerTargetNode(n: Node | null): void {
  _player = n;
}

export function getPlayerTargetPosition(): { x: number; y: number } | null {
  if (!_player || !isValid(_player)) {
    return null;
  }
  const p = _player.position;
  return { x: p.x, y: p.y };
}
