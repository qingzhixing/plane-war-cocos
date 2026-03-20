import { _decorator, Color, Component, Label, Node, UITransform } from 'cc';
import { EnemySpawner } from './EnemySpawner';
import { setBattleMain } from './battleAccess';
import * as GameConfig from './GameConfig';

const { ccclass } = _decorator;

@ccclass('BattleMain')
export class BattleMain extends Component {
  private _spawner: EnemySpawner | null = null;
  private _hudLabel: Label | null = null;
  private _overlayRoot: Node | null = null;

  private _exp = 0;
  private _score = 0;
  private _activeWave = 0;
  private _waitingContinue = false;

  init(playField: Node) {
    this._spawner = playField.getComponent(EnemySpawner)!;
    this._spawner.setBattleMain(this);
    setBattleMain(this);

    this._buildHud();
    this._buildOverlay();

    this._activeWave = 1;
    this._spawner.startWave(1);
    this._refreshHud();
  }

  onDestroy() {
    setBattleMain(null);
  }

  addExp(n: number) {
    this._exp += n;
    this._refreshHud();
  }

  addScore(n: number) {
    this._score += n;
    this._refreshHud();
  }

  onWaveCleared() {
    if (this._waitingContinue) {
      return;
    }
    this._waitingContinue = true;
    if (this._overlayRoot) {
      this._overlayRoot.active = true;
      const text = this._overlayRoot.getChildByName('Text');
      const lab = text?.getComponent(Label);
      if (lab) {
        lab.string = `第 ${this._activeWave} 波清场\n点击继续`;
      }
    }
  }

  private _onContinueOverlay() {
    if (!this._waitingContinue) {
      return;
    }
    this._waitingContinue = false;
    if (this._overlayRoot) {
      this._overlayRoot.active = false;
    }
    this._activeWave += 1;
    this._spawner?.startWave(this._activeWave);
    this._refreshHud();
  }

  private _buildHud() {
    const n = new Node('BattleHud');
    const ut = n.addComponent(UITransform);
    ut.setContentSize(680, 100);
    n.setPosition(0, 560, 0);
    const lab = n.addComponent(Label);
    lab.fontSize = 20;
    lab.color = Color.WHITE;
    this._hudLabel = lab;
    this.node.addChild(n);
  }

  private _buildOverlay() {
    const root = new Node('WaveOverlay');
    root.active = false;
    const ut = root.addComponent(UITransform);
    ut.setContentSize(GameConfig.DESIGN_W, GameConfig.DESIGN_H);
    ut.setAnchorPoint(0.5, 0.5);

    const text = new Node('Text');
    const tut = text.addComponent(UITransform);
    tut.setContentSize(600, 200);
    text.setPosition(0, 0, 0);
    const lab = text.addComponent(Label);
    lab.fontSize = 28;
    lab.color = Color.WHITE;
    lab.string = '点击继续';
    root.addChild(text);

    root.on(Node.EventType.TOUCH_END, this._onContinueOverlay, this);
    this.node.addChild(root);
    this._overlayRoot = root;
  }

  private _refreshHud() {
    if (!this._hudLabel) {
      return;
    }
    this._hudLabel.string = `波次 ${this._activeWave}  得分 ${this._score}  经验 ${this._exp}`;
  }
}
