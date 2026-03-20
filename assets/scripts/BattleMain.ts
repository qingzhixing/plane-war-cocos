import {
  _decorator,
  Color,
  Component,
  instantiate,
  Label,
  Node,
  Prefab,
  UITransform,
} from 'cc';
import { PlayerController } from './PlayerController';
import { EnemySpawner } from './EnemySpawner';
import { setBattleMain } from './battleAccess';
import { pickRandomUpgrades } from './UpgradePool';
import { UpgradeUI } from './UpgradeUI';
import * as GameConfig from './GameConfig';

const { ccclass } = _decorator;

@ccclass('BattleMain')
export class BattleMain extends Component {
  private _playField: Node | null = null;
  private _spawner: EnemySpawner | null = null;
  private _hudLabel: Label | null = null;

  private _upgradePrefab: Prefab | null = null;
  private _upgradeNode: Node | null = null;
  private _fallbackUpgradeRoot: Node | null = null;

  private _exp = 0;
  private _score = 0;
  private _activeWave = 0;
  private _waitingContinue = false;

  /** 未接 BattleMain 乘区时，score_up 的占位累计 */
  private _scoreMultiplier = 1;

  init(playField: Node, upgradePickPrefab: Prefab | null) {
    this._playField = playField;
    this._upgradePrefab = upgradePickPrefab;
    this._spawner = playField.getComponent(EnemySpawner)!;
    this._spawner.setBattleMain(this);
    setBattleMain(this);

    this._buildHud();

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
    this._score += Math.round(n * this._scoreMultiplier);
    this._refreshHud();
  }

  onWaveCleared() {
    if (this._waitingContinue) {
      return;
    }
    this._waitingContinue = true;
    this._openUpgrade();
  }

  private _openUpgrade() {
    if (this._upgradePrefab) {
      const node = instantiate(this._upgradePrefab);
      this.node.addChild(node);
      node.setSiblingIndex(this.node.children.length - 1);
      const ui = node.getComponent(UpgradeUI);
      if (ui) {
        this._upgradeNode = node;
        ui.showPick((id: string) => {
          this._applyUpgrade(id);
          if (this._upgradeNode) {
            this._upgradeNode.destroy();
            this._upgradeNode = null;
          }
          this._finishAfterUpgrade();
        });
        return;
      }
      node.destroy();
    }
    this._openUpgradeFallback();
  }

  /** 未配置预制体时：简易三行文字 + 点击区域 */
  private _openUpgradeFallback() {
    const picks = pickRandomUpgrades(3);
    const root = new Node('UpgradeFallback');
    root.layer = this.node.layer;
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
      row.on(Node.EventType.TOUCH_END, () => this._pickFallback(u.id), this);
      root.addChild(row);
    }

    this.node.addChild(root);
    root.setSiblingIndex(this.node.children.length - 1);
    this._fallbackUpgradeRoot = root;
  }

  private _pickFallback(id: string) {
    if (!this._fallbackUpgradeRoot) {
      return;
    }
    this._applyUpgrade(id);
    this._fallbackUpgradeRoot.destroy();
    this._fallbackUpgradeRoot = null;
    this._finishAfterUpgrade();
  }

  private _applyUpgrade(id: string) {
    const p = this._playField?.getChildByName('Player');
    const pc = p?.getComponent(PlayerController);
    pc?.applyUpgrade(id);

    if (id === 'score_up') {
      this._scoreMultiplier += 0.15;
    }
  }

  private _finishAfterUpgrade() {
    this._waitingContinue = false;
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

  private _refreshHud() {
    if (!this._hudLabel) {
      return;
    }
    const sm = Math.round(this._scoreMultiplier * 100) / 100;
    this._hudLabel.string = `波次 ${this._activeWave}  得分 ${this._score}  经验 ${this._exp}  评分×${sm}`;
  }
}
