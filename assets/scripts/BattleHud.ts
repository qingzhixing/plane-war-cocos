import {
  _decorator,
  Color,
  Component,
  Graphics,
  Label,
  Node,
  UITransform,
} from 'cc';
import * as GameConfig from './GameConfig';

const { ccclass } = _decorator;

/** 战斗顶栏：波次 / 得分 / 连击 / 经验 / 评分乘区；Boss 战时名称条与血条 */
@ccclass('BattleHud')
export class BattleHud extends Component {
  private _label: Label | null = null;
  private _bossStrip: Node | null = null;
  private _bossFill: Graphics | null = null;
  private readonly _bossBarW = 400;

  onLoad() {
    const ut = this.node.addComponent(UITransform);
    ut.setContentSize(700, 120);
    this.node.setPosition(0, 550, 0);
    const lab = this.node.addComponent(Label);
    lab.fontSize = 18;
    lab.color = Color.WHITE;
    this._label = lab;

    this._buildBossStrip();
  }

  private _buildBossStrip() {
    const strip = new Node('BossHudStrip');
    strip.active = false;
    this.node.addChild(strip);
    strip.setPosition(0, 42, 0);
    const sut = strip.addComponent(UITransform);
    sut.setContentSize(700, 40);

    const nameN = new Node('BossName');
    strip.addChild(nameN);
    nameN.setPosition(-260, 0, 0);
    const nl = nameN.addComponent(Label);
    nl.string = 'Boss01';
    nl.fontSize = 20;
    nl.color = Color.WHITE;

    const barBgN = new Node('BarBg');
    strip.addChild(barBgN);
    barBgN.setPosition(40, 0, 0);
    const bg = barBgN.addComponent(Graphics);
    bg.fillColor = new Color(40, 40, 40, 220);
    bg.rect(-this._bossBarW * 0.5, -8, this._bossBarW, 16);
    bg.fill();

    const barFillN = new Node('BarFill');
    strip.addChild(barFillN);
    barFillN.setPosition(40, 0, 0);
    this._bossFill = barFillN.addComponent(Graphics);
    this._bossStrip = strip;
  }

  private _drawBossFill(hp: number, maxHp: number) {
    const g = this._bossFill;
    if (!g) {
      return;
    }
    g.clear();
    const ratio = maxHp > 0 ? Math.max(0, Math.min(1, hp / maxHp)) : 0;
    const w = this._bossBarW * ratio;
    if (w <= 0) {
      return;
    }
    g.fillColor = new Color(220, 60, 70, 255);
    g.rect(-this._bossBarW * 0.5, -8, w, 16);
    g.fill();
  }

  refresh(
    wave: number,
    score: number,
    combo: number,
    exp: number,
    scoreMultiplier: number,
    inContinuationBlock: boolean,
    bossBar: { hp: number; maxHp: number } | null,
  ): void {
    if (!this._label) {
      return;
    }
    const sm = Math.round(scoreMultiplier * 100) / 100;
    let waveStr: string;
    if (inContinuationBlock) {
      waveStr =
        bossBar && wave === GameConfig.BOSS_WAVE
          ? `续战 ${wave}/8 - Boss`
          : `续战 ${wave}/8`;
    } else {
      waveStr =
        bossBar && wave === GameConfig.BOSS_WAVE
          ? `波次 ${wave} - Boss`
          : `波次 ${wave}`;
    }
    this._label.string = `${waveStr}  得分 ${score}  连击 ${combo}  经验 ${exp}  评分×${sm}`;

    if (this._bossStrip) {
      const show = bossBar !== null && bossBar.maxHp > 0;
      this._bossStrip.active = show;
      if (show && bossBar) {
        this._drawBossFill(bossBar.hp, bossBar.maxHp);
      }
    }
  }
}
