import {
  _decorator,
  Color,
  Component,
  director,
  Graphics,
  Label,
  Node,
  UITransform,
} from 'cc';
import { BattleMain } from './BattleMain';
import { EnemySpawner } from './EnemySpawner';
import { PlayerController } from './PlayerController';
import * as GameConfig from './GameConfig';

const { ccclass } = _decorator;

@ccclass('GameRoot')
export class GameRoot extends Component {
  private _backBtn: Node | null = null;

  onLoad() {
    const playField = new Node('PlayField');
    const pfUt = playField.addComponent(UITransform);
    pfUt.setContentSize(GameConfig.DESIGN_W, GameConfig.DESIGN_H);
    pfUt.setAnchorPoint(0.5, 0.5);
    this.node.addChild(playField);

    const player = new Node('Player');
    const pUt = player.addComponent(UITransform);
    pUt.setContentSize(32, 48);
    pUt.setAnchorPoint(0.5, 0.5);
    player.setPosition(0, -400, 0);
    const pg = player.addComponent(Graphics);
    pg.lineWidth = 0;
    pg.fillColor = new Color(80, 200, 255, 255);
    pg.rect(-16, -24, 32, 48);
    pg.fill();
    player.addComponent(PlayerController);
    playField.addChild(player);
    playField.addComponent(EnemySpawner);

    const hint = new Node('Hint');
    const hut = hint.addComponent(UITransform);
    hut.setContentSize(620, 120);
    hint.setPosition(0, 420, 0);
    const hintLab = hint.addComponent(Label);
    hintLab.string = '拖拽 / WASD 移动 · 清场后点屏幕继续下一波';
    hintLab.fontSize = 22;
    hintLab.color = Color.WHITE;
    this.node.addChild(hint);

    const back = new Node('Back');
    const but = back.addComponent(UITransform);
    but.setContentSize(100, 48);
    back.setPosition(280, 560, 0);
    const backLab = back.addComponent(Label);
    backLab.string = '菜单';
    backLab.fontSize = 26;
    backLab.color = Color.WHITE;
    back.on(Node.EventType.TOUCH_END, this._back, this);
    this.node.addChild(back);
    this._backBtn = back;

    const battle = this.node.addComponent(BattleMain);
    battle.init(playField);
  }

  onDestroy() {
    this._backBtn?.off(Node.EventType.TOUCH_END, this._back, this);
  }

  private _back() {
    director.loadScene('MainMenu');
  }
}
