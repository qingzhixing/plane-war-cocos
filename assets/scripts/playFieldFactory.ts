import { Color, Graphics, Node, UITransform } from 'cc';
import { EnemySpawner } from './EnemySpawner';
import { PlayerController } from './PlayerController';
import * as GameConfig from './GameConfig';

/** 代码搭建 PlayField：尺寸、玩家占位图、EnemySpawner（与场景编辑器分工：此处为 MVP 占位） */
export function createPlayField(): Node {
  const playField = new Node('PlayField');
  const pfUt = playField.addComponent(UITransform);
  pfUt.setContentSize(GameConfig.DESIGN_W, GameConfig.DESIGN_H);
  pfUt.setAnchorPoint(0.5, 0.5);

  const player = new Node('Player');
  const pUt = player.addComponent(UITransform);
  pUt.setContentSize(32, 48);
  pUt.setAnchorPoint(0.5, 0.5);
  player.setPosition(0, -400, 0);

  const body = new Node('PlayerBody');
  const bUt = body.addComponent(UITransform);
  bUt.setContentSize(32, 48);
  bUt.setAnchorPoint(0.5, 0.5);
  const pg = body.addComponent(Graphics);
  pg.lineWidth = 0;
  pg.fillColor = new Color(80, 200, 255, 255);
  pg.rect(-16, -24, 32, 48);
  pg.fill();
  player.addChild(body);

  const hit = new Node('HitJudge');
  const hUt = hit.addComponent(UITransform);
  hUt.setContentSize(16, 16);
  hUt.setAnchorPoint(0.5, 0.5);
  const hg = hit.addComponent(Graphics);
  hg.fillColor = new Color(255, 60, 80, 255);
  hg.arc(0, 0, 3.2, 0, Math.PI * 2, false);
  hg.fill();
  hg.lineWidth = 2;
  hg.strokeColor = new Color(255, 255, 255, 255);
  hg.arc(0, 0, 6.5, 0, Math.PI * 2, false);
  hg.stroke();
  player.addChild(hit);

  player.addComponent(PlayerController);
  playField.addChild(player);
  playField.addComponent(EnemySpawner);

  return playField;
}
