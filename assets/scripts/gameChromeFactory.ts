import { Color, Label, Node, UITransform } from 'cc';

/** 战斗场景 Canvas 上的非战斗 UI：操作提示、返回主菜单（MVP 代码搭建，后续可换预制体） */

export function createHintBanner(): Node {
  const hint = new Node('Hint');
  const hut = hint.addComponent(UITransform);
  hut.setContentSize(620, 120);
  hint.setPosition(0, 420, 0);
  const hintLab = hint.addComponent(Label);
  hintLab.string = '拖拽 / WASD 移动 · 清场后三选一升级，再进入下一波';
  hintLab.fontSize = 22;
  hintLab.color = Color.WHITE;
  return hint;
}

export function createBackButton(
  handler: () => void,
  target: object,
): Node {
  const back = new Node('Back');
  const but = back.addComponent(UITransform);
  but.setContentSize(100, 48);
  back.setPosition(280, 560, 0);
  const backLab = back.addComponent(Label);
  backLab.string = '菜单';
  backLab.fontSize = 26;
  backLab.color = Color.WHITE;
  back.on(Node.EventType.TOUCH_END, handler, target);
  return back;
}
