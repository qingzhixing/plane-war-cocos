import { Color, Graphics, Node, tween, UIOpacity, UITransform } from 'cc';
import * as GameConfig from './GameConfig';

/**
 * 在 PlayField 局部坐标系下于玩家附近生成短时星点（`GrazeSpark` MVP）。
 * 插入在玩家节点上一档 sibling，便于与弹幕叠层折中。
 */
export function spawnGrazeSpark(
  playField: Node,
  localX: number,
  localY: number,
  playerNode: Node,
): void {
  const n = new Node('GrazeSpark');
  n.layer = playerNode.layer;
  const jitter = 16;
  n.setPosition(
    localX + (Math.random() - 0.5) * jitter,
    localY + (Math.random() - 0.5) * jitter,
    0,
  );
  const ut = n.addComponent(UITransform);
  ut.setContentSize(64, 64);
  ut.setAnchorPoint(0.5, 0.5);

  const g = n.addComponent(Graphics);
  const dots = 6 + Math.floor(Math.random() * 4);
  for (let i = 0; i < dots; i++) {
    const ang = (i / dots) * Math.PI * 2 + Math.random() * 0.35;
    const rad = 4 + Math.random() * 16;
    const px = Math.cos(ang) * rad;
    const py = Math.sin(ang) * rad;
    const rr = 1.5 + Math.random() * 2.5;
    g.fillColor = new Color(
      255,
      235,
      150,
      190 + Math.floor(Math.random() * 65),
    );
    g.circle(px, py, rr);
    g.fill();
  }

  const pi = playField.children.indexOf(playerNode);
  playField.addChild(n);
  if (pi >= 0) {
    n.setSiblingIndex(Math.min(pi + 1, playField.children.length - 1));
  }

  const op = n.addComponent(UIOpacity);
  op.opacity = 255;
  tween(op)
    .to(GameConfig.GRAZE_SPARK_LIFE_SEC, { opacity: 0 })
    .call(() => {
      n.destroy();
    })
    .start();
}
