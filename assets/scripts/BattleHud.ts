import {
  _decorator,
  Color,
  Component,
  Graphics,
  Label,
  Node,
  UITransform,
} from 'cc';
import { comboMilestoneBangCount } from './comboMilestone';
import * as GameConfig from './GameConfig';

const { ccclass } = _decorator;

/** 战斗顶栏：波次 / 得分 / 连击 / 经验 / 评分乘区；Boss 战时名称条与血条 */
@ccclass('BattleHud')
export class BattleHud extends Component {
  private _label: Label | null = null;
  private _bossStrip: Node | null = null;
  private _bossFill: Graphics | null = null;
  private readonly _bossBarW = 400;
  private _comboBreakNode: Node | null = null;
  private _comboBreakRemain = 0;
  private _comboMilestoneNode: Node | null = null;
  private _comboMilestoneRemain = 0;
  private _newRecordNode: Node | null = null;
  private _newRecordRemain = 0;
  private _nearRecordNode: Node | null = null;
  private _nearRecordRemain = 0;

  onLoad() {
    const ut = this.node.addComponent(UITransform);
    ut.setContentSize(700, 160);
    this.node.setPosition(0, 520, 0);
    const lab = this.node.addComponent(Label);
    lab.fontSize = 18;
    lab.color = Color.WHITE;
    this._label = lab;

    this._buildBossStrip();
    this._buildComboBreak();
    this._buildComboMilestone();
    this._buildNewRecordHint();
    this._buildNearRecordHint();
  }

  private _buildComboBreak() {
    const n = new Node('ComboBreak');
    n.setPosition(0, -120, 0);
    n.active = false;
    const lab = n.addComponent(Label);
    lab.string = '连击中断';
    lab.fontSize = 26;
    lab.color = new Color(255, 200, 130, 255);
    this.node.addChild(n);
    this._comboBreakNode = n;
  }

  private _buildComboMilestone() {
    const n = new Node('ComboMilestone');
    n.setPosition(0, -175, 0);
    n.active = false;
    const lab = n.addComponent(Label);
    lab.string = '10 Combo!';
    lab.fontSize = 24;
    lab.color = new Color(255, 240, 160, 255);
    this.node.addChild(n);
    this._comboMilestoneNode = n;
  }

  private _buildNewRecordHint() {
    const n = new Node('NewRecordHint');
    n.setPosition(300, -205, 0);
    n.active = false;
    const lab = n.addComponent(Label);
    lab.string = '新纪录？';
    lab.fontSize = 22;
    lab.color = new Color(255, 220, 100, 255);
    this.node.addChild(n);
    this._newRecordNode = n;
  }

  update(dt: number) {
    if (this._comboBreakRemain > 0) {
      this._comboBreakRemain -= dt;
      if (this._comboBreakRemain <= 0 && this._comboBreakNode) {
        this._comboBreakNode.active = false;
      }
    }
    if (this._comboMilestoneRemain > 0) {
      this._comboMilestoneRemain -= dt;
      if (this._comboMilestoneRemain <= 0 && this._comboMilestoneNode) {
        this._comboMilestoneNode.active = false;
      }
    }
    if (this._newRecordRemain > 0) {
      this._newRecordRemain -= dt;
      if (this._newRecordRemain <= 0 && this._newRecordNode) {
        this._newRecordNode.active = false;
      }
    }
    if (this._nearRecordRemain > 0) {
      this._nearRecordRemain -= dt;
      if (this._nearRecordRemain <= 0 && this._nearRecordNode) {
        this._nearRecordNode.active = false;
      }
    }
  }

  /** 实际断连时由 `BattleMain.onPlayerHit` 调用 */
  flashComboBreak() {
    this._comboBreakRemain = GameConfig.COMBO_BREAK_DISPLAY_SEC;
    if (this._comboBreakNode) {
      this._comboBreakNode.active = true;
    }
  }

  /** 本局得分首次超过开局时的历史最高分时由 `BattleMain` 调用 */
  flashNewRecordHint() {
    this._newRecordRemain = GameConfig.NEW_RECORD_HINT_SEC;
    if (this._newRecordNode) {
      this._newRecordNode.active = true;
    }
  }

  /** 接近开局时的历史最高但尚未超过时由 `BattleMain` 调用 */
  flashNearRecordHint() {
    this._nearRecordRemain = GameConfig.NEAR_RECORD_HINT_SEC;
    if (this._nearRecordNode) {
      this._nearRecordNode.active = true;
    }
  }

  /** 跨越连击档位时由 `BattleMain.onEnemyKill` 调用 */
  flashComboMilestone(m: number) {
    this._comboMilestoneRemain = GameConfig.COMBO_MILESTONE_DISPLAY_SEC;
    const lab = this._comboMilestoneNode?.getComponent(Label);
    if (lab) {
      const bangs = '!'.repeat(comboMilestoneBangCount(m));
      lab.string = `${m} Combo${bangs}`;
    }
    if (this._comboMilestoneNode) {
      this._comboMilestoneNode.active = true;
    }
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
    comboGuardStacks: number,
    currentDps: number,
    maxDps: number,
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
    const guardStr =
      comboGuardStacks > 0 ? `  护盾×${comboGuardStacks}` : '';
    const dpsLine = `DPS ${Math.round(currentDps)}  本局最高 ${Math.round(maxDps)}`;
    this._label.string = `${waveStr}  得分 ${score}  连击 ${combo}  经验 ${exp}  评分×${sm}${guardStr}\n${dpsLine}`;

    if (this._bossStrip) {
      const show = bossBar !== null && bossBar.maxHp > 0;
      this._bossStrip.active = show;
      if (show && bossBar) {
        this._drawBossFill(bossBar.hp, bossBar.maxHp);
      }
    }
  }
}
