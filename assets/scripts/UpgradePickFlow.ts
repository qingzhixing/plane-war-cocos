import { Color, instantiate, Label, Node, Prefab, UITransform } from 'cc';
import { pickRandomUpgrades } from './UpgradePool';
import { UpgradeUI } from './UpgradeUI';
import * as GameConfig from './GameConfig';

/**
 * 清场后三选一：优先实例化预制体上的 UpgradeUI；否则用简易文字 + 点击行。
 * `onPicked` 在 UI 销毁之后调用，仅负责业务（应用强化、开下一波等）。
 */
export function presentUpgradePick(
  parent: Node,
  prefab: Prefab | null,
  onPicked: (id: string) => void,
): void {
  if (prefab) {
    const node = instantiate(prefab);
    parent.addChild(node);
    node.setSiblingIndex(parent.children.length - 1);
    const ui = node.getComponent(UpgradeUI);
    if (ui) {
      ui.showPick((id: string) => {
        node.destroy();
        onPicked(id);
      });
      return;
    }
    node.destroy();
  }
  presentUpgradeFallback(parent, onPicked);
}

function presentUpgradeFallback(
  parent: Node,
  onPicked: (id: string) => void,
): void {
  const picks = pickRandomUpgrades(3);
  const root = new Node('UpgradeFallback');
  root.layer = parent.layer;
  const ut = root.addComponent(UITransform);
  ut.setContentSize(GameConfig.DESIGN_W, GameConfig.DESIGN_H);
  root.setPosition(0, 0, 0);

  const title = new Node('Title');
  title.layer = root.layer;
  const tt = title.addComponent(UITransform);
  tt.setContentSize(600, 60);
  title.setPosition(0, 420, 0);
  const tl = title.addComponent(Label);
  tl.string = '（未挂预制体）简易升级';
  tl.fontSize = 22;
  tl.color = Color.YELLOW;
  root.addChild(title);

  for (let i = 0; i < 3; i++) {
    const u = picks[i];
    if (!u) {
      break;
    }
    const row = new Node(`Opt${i}`);
    row.layer = root.layer;
    const rt = row.addComponent(UITransform);
    rt.setContentSize(620, 120);
    row.setPosition(0, 260 - i * 140, 0);
    const lab = row.addComponent(Label);
    lab.string = `${i + 1}. ${u.name}\n${u.desc}`;
    lab.fontSize = 20;
    lab.color = Color.WHITE;
    row.on(Node.EventType.TOUCH_END, () => {
      root.destroy();
      onPicked(u.id);
    });
    root.addChild(row);
  }

  parent.addChild(root);
  root.setSiblingIndex(parent.children.length - 1);
}
