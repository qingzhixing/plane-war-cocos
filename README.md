# plane-war-cocos

从 Godot 工程 [**plane-war**](https://github.com/qingzhixing/plane-war) 移植的 **Cocos Creator 3.8.x** 竖屏弹幕射击项目。玩法与验收以 **`docs/gdd/`** 为准。

## 环境

- [Cocos Creator 3.8.8](https://www.cocos.com/creator-download)（与根目录 `package.json` 中 `creator.version` 对齐）
- **可选**：根目录执行 `npm install` 后运行 **`npm test`**，用 Vitest 跑 `tests/` 下与引擎无关的纯逻辑单测（`aabbMath`、`battleRunState`、`waveSpawnScheduler` 等）。
- **音频**：BGM、玩家 SFX、敌受伤/爆炸、**Boss 结算 `Lose`**（`SFX/game_state`）位于 **`assets/resources/audio/`**（自 `plane-war/assets/` 同步）；`Game` 场景由 **`gameAudio.ts`** 在运行时 `resources.load` 播放（见 GDD `09` / `12`）。
- **像素图**：机体 / 弹 / 敌 PNG 位于 **`assets/resources/sprites/`**（自 `plane-war/sprites/` 同步）；**`GameRoot`** 先 **`preloadBattleSpriteFrames`** 再 **`createPlayField`**，**`battleSprites.ts`** 为各工厂挂 **`Sprite`**（失败则 Graphics 兜底），见 GDD **`11`**。
- **UI 字体**：**`PixelOperator8.ttf` / `PixelOperator8-Bold.ttf`** 在 **`assets/resources/fonts/`**（自 `plane-war/font/` 同步）；**`MainMenu` / `GameRoot`** 调用 **`preloadUiFonts`**，**`uiFonts.applyUiFontsUnder`** 套到 **`Label`**（大字粗体规则见 GDD **`11`**）。

## 打开与运行

1. 用 Cocos Creator 打开本仓库根目录。
2. 首次打开若未识别启动场景：菜单 **项目 → 项目设置 → 通用**，将 **设计分辨率** 设为 **720 × 1280**，并勾选 **适配高度 / 适配宽度**（与 Godot 版一致）。
3. 在 **资源管理器** 中双击 **`assets/scenes/MainMenu.scene`**，或到 **项目设置** 里将 **启动场景** 设为 `MainMenu.scene`。
4. 点击编辑器 **预览** 运行：主菜单 **开始游戏** 进入 **Game**；战斗中 **拖拽 / WASD** 移动，**自动射击**；**清场**后出现 **三选一升级**（未配置预制体时用简易文字版），选完后进入下一波；点 **菜单** 返回主菜单。

**升级 UI 预制体（推荐）**：在编辑器中按 `assets/prefabs/ui/EDITOR_SETUP.md` 制作 `UpgradePick.prefab` 并挂到 **Game** 场景 **Canvas** 上 **GameRoot** 的 **Upgrade Pick Prefab** 槽位。

### 若提示「Script … is missing or invalid」

- 自定义组件在场景里的 `__type__` 必须是引擎编译后的 **类 ID**（与 `@ccclass` 名一致但不能只写字面量）。本仓库已按 Creator 3.8 序列化格式写好；若你本地升级引擎或大幅改脚本后仍报错：**打开对应场景并保存一次**（Ctrl+S），或 **项目 → 构建发布** 前先让脚本完成编译。

## 仓库结构（摘要）

| 路径 | 说明 |
|------|------|
| `docs/gdd/` | 游戏设计文档（与 Godot 版同步，技术栈说明见 `sections/12_technical_notes.md`；像素映射见 `sections/11_art_and_assets.md`） |
| `assets/resources/sprites/` | 战斗用像素 PNG（`player` / `bullets` / `enemies`），由 `battleSprites.ts` 预载 |
| `assets/resources/fonts/` | `PixelOperator8` 系列 TTF，由 `uiFonts.ts` 预载 |
| `assets/scenes/` | `MainMenu`（主菜单：开始游戏 / 成绩查询）、`Game`（战斗 MVP：波次、清场、三选一升级） |
| `assets/scripts/` | `MainMenu.ts`、`mainMenuChromeFactory.ts`（`createMainMenuRoot`、`presentRecordsQueryOverlay`）、`uiFonts.ts`（`preloadUiFonts`、`applyUiFontsUnder`）、`GameRoot.ts`、`battleSprites.ts`（`preloadBattleSpriteFrames`）、`playFieldFactory.ts`、`gameChromeFactory.ts`、`BattleMain.ts`、`battleRunState.ts`（`threatTier`、`inContinuationBlock`、`comboGuardStacks`）、`localRecords.ts` / `localRecordsCore.ts`（本地最高得分/连击）、`comboScore.ts`、`comboMilestone.ts`（连击档位跨越）、`BattleHud.ts`（Boss 血条、续战、护盾、连击中断/档位 Combo!/新纪录？/接近纪录）、`postBossChoiceFlow.ts`（Boss 击破二选一）、`battleAccess.ts`、`playerPositionAccess.ts`（追踪弹目标）、`UpgradePool.ts`、`UpgradeUI.ts`、`UpgradePickFlow.ts`（`presentUpgradePickSequence`）、`PlayerController.ts`、`playerInput.ts`、`playerMotion.ts`、`playerEnemyCollision.ts`、`enemyBulletPlayerCollision.ts`、`playerBulletFactory.ts`、`aabbMath.ts`、`playerBulletHitscan.ts`、`PlayerBullet.ts`、`EnemyBasic.ts`、`enemyBasicFactory.ts`、`EnemySummoner.ts`、`enemySummonerFactory.ts`、`EnemyTurret.ts`、`enemyTurretFactory.ts`、`EnemyElite.ts`、`enemyEliteFactory.ts`、`EnemyBoss.ts`、`enemyBossFactory.ts`、`EnemyBullet.ts`、`enemyBulletFactory.ts`、`EnemyBulletRegistry.ts`、`EnemySpawner.ts`（精英 → 炮台 → 召唤 → 冲锋）、`waveSpawnScheduler.ts`、`EnemyRegistry.ts`、`GameConfig.ts`（`bossMaxHpForSpawn`、`enemyBulletSpeedForTier`、`enemyMobilityTierMult`、`DPS_WINDOW_SEC`、`DPS_HUD_REFRESH_SEC`、`continuationBlockEnemyCount` 等） |
| `tests/` | Vitest 单测（`aabbMath`、`comboScore`、`comboMilestone`、`nearRecordThreshold`、`battleRunState`、`waveSpawnScheduler` 等） |
| `assets/prefabs/ui/` | `EDITOR_SETUP.md`（`UpgradePick.prefab` 制作说明，预制体需在编辑器中创建） |

## 下一步（移植里程碑）

- **美术**：Boss 独立立绘、全局 theme / JetBrainsMono、多敌变种贴图等，按 GDD `11_art_and_assets.md` 继续补全。
- **音频/玩法扩展**：符卡冷却随擦弹缩减（GDD）；擦弹 VFX 可再换粒子系统；主菜单与 BGM 持久化策略若需对齐 Godot 再迭代。
- **玩法与表现**：结算页高亮刷新纪录等 GDD 余项；可选 `npm test` 持续覆盖纯逻辑模块。

## 许可

与 Godot 参考仓库保持一致；若根目录未单独放置 `LICENSE`，以仓库内实际声明为准。
