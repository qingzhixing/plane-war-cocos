# 12 技术栈与项目结构（Cocos Creator 3.x 移植版）

## 技术栈

- 引擎版本：**Cocos Creator 3.8.x**（见仓库根目录 `package.json` → `creator.version`）
- **设计分辨率（竖屏）**：**720×1280**，与 Godot 版一致；在项目设置 **项目 → 项目设置 → 通用 → 设计分辨率** 中配置为 **适配宽度和高度**（与 Godot `viewport + keep` 的等比缩放目标一致）。
- 平台目标：Windows + Android（与 GDD 一致）
- 脚本语言：**TypeScript**（`assets/scripts/`）

## 与 Godot 版的对应关系（移植时查阅）

- 玩法与数值以 **`docs/gdd/`** 与 Godot 仓库 **`plane-war`** 源码为准；本仓库为 **Cocos 实现**，路径与 API 不同，但系统划分应对齐：
  - 主流程 / 波次 / 升级 / 结算：`plane-war/scripts/main.gd`
  - 玩家：`plane-war/scripts/player.gd`
  - 刷怪：`plane-war/scripts/enemy_spawner.gd`
  - 敌人与子弹基类：`plane-war/scripts/enemies/EnemyBase.gd`、`plane-war/scripts/bullets/BulletBase.gd`

## 本仓库目录约定（建议）

- 启动流程：**主菜单** `assets/scenes/MainMenu.scene` → **开始游戏** 进入 `assets/scenes/Game.scene`（后续在 `Game` 中挂载战斗与 HUD，与 Godot `Main.tscn` 对齐）。
- 脚本：`assets/scripts/`  
  - 主菜单：`MainMenu.ts`（`mainMenuChromeFactory.ts`：`createMainMenuRoot`、`createMainMenuHint`、`presentRecordsQueryOverlay`）  
  - 战斗场景根：`GameRoot.ts`（挂载 `PlayField`、`BattleMain`；提示条与返回按钮由 `gameChromeFactory.ts` 代码搭建；`PlayField` 由 `playFieldFactory.ts` 的 `createPlayField`：**玩家**含子节点 **`PlayerBody`**（机体图）与 **`HitJudge`**（判定点）；无敌闪烁只改 **`PlayerBody` 的 `UIOpacity`**）  
  - 玩家：`PlayerController.ts`（对齐 Godot `player.gd`：拖拽 / 键控移动、边界、自动射击）；**敌弹 / 敌机撞玩家**时调用 **`BattleMain.onPlayerHit()`**（返回是否**实际断连**；`combo_guard` 吸收则**不断连、不进入无敌**）；**无敌帧**内跳过 hazard 判定，**`UIOpacity` 闪烁**（`GameConfig.PLAYER_INVULN_SEC` / `PLAYER_INVULN_BLINK_HZ`）；敌机重叠检测见 `playerEnemyCollision.ts`，敌弹见 `EnemyBulletRegistry` + AABB；全局 `input` 注册与注销见 `playerInput.ts`；**位移与边界纯数学**见 `playerMotion.ts`（键控方向、拖拽限幅、可玩区域夹取、多发偏移）  
  - 玩家基础弹：`PlayerBullet.ts`（对齐 Godot `PlayerBullet.gd` / `BulletBase.gd`：向上运动、出屏销毁；命中敌人后销毁）；**节点与占位图**由 `playerBulletFactory.ts` 的 `spawnPlayerBullet`（`PlayerController` 调用）  
  - 敌人：`EnemyBasic.ts`（冲锋机）；`EnemySummoner.ts`（召唤机 Basic03，低频 **追踪弹**）；`EnemyTurret.ts`（炮台机 Basic02，锚定高度 + 前摇扇形弹）；`EnemyElite.ts`（Elite01，圆环敌弹）；`EnemyBoss.ts`（第 `BOSS_WAVE` 波占位 Boss，高 HP、慢速、发敌弹）；**敌弹**见 `EnemyBullet.ts`（可选 **`homing`**）、`enemyBulletFactory.ts`、`EnemyBulletRegistry.ts`；**玩家位置（追踪用）**见 `playerPositionAccess.ts`（`PlayerController` 注册）；**节点生成**见 `enemyBasicFactory.ts` / `enemySummonerFactory.ts` / `enemyTurretFactory.ts` / `enemyEliteFactory.ts` / `enemyBossFactory.ts`（`EnemySpawner`：**精英** → **炮台** → **召唤** → **冲锋**）  
  - 刷怪：`EnemySpawner.ts`（对齐 `enemy_spawner.gd`：实例化敌机、第 `BOSS_WAVE` 波仅刷 Boss、清场后通知 `BattleMain`）；**波次内定时与剩余配额**见 `waveSpawnScheduler.ts` 的 `WaveSpawnScheduler`（**`startBossWave`**、**续战小怪** `startContinuationMobWave`）；续战块参数见 `GameConfig`（`continuationBlockEnemyCount` 等）  
  - 战斗状态（MVP）：`BattleMain.ts`（对齐 `main.gd` 子集：编排 `EnemySpawner`、升级与 HUD）；**单场数值与流程门闩**见 `battleRunState.ts` 的 `BattleRunState`（经验/得分/波次/连击/升级中/评分乘区、**`threatTier`**、**`inContinuationBlock`**、**`comboGuardStacks`** 稳态护盾）；**连击得分区间系数**见 `comboScore.ts`（与 GDD `06` 表一致）；HUD 展示由 `BattleHud.ts`（**Boss 名称条与血条**、续战文案、护盾×N、**`flashComboBreak` 连击中断**、**`flashComboMilestone` 档位 Combo!**）；**连击档位判定**见 `comboMilestone.ts`；**Boss 击破二选一**见 `postBossChoiceFlow.ts`；清场后 **升级三选一**  
  - 升级三选一：**预制体 + 编辑器** — 预制体路径 `assets/prefabs/ui/UpgradePick.prefab`（根节点挂 `UpgradeUI.ts`）；**Game** 场景里 **Canvas → GameRoot** 的 **`upgradePickPrefab`** 拖入该预制体。详见同目录 `EDITOR_SETUP.md`。数据池：`UpgradePool.ts`；展示与兜底 UI：`UpgradePickFlow.ts`（`presentUpgradePick`、`presentUpgradePickSequence` 续关 3 连，与 `BattleMain` 解耦）。  
  - 全局引用：`battleAccess.ts`（`getBattleMain()`，供 `EnemyBasic` **`onEnemyKill`**、`PlayerController` **`onPlayerHit`**）  
  - 碰撞：`EnemyRegistry.ts` 登记敌机；`PlayerBullet` 取世界 **`Rect`** 后由 **`playerBulletHitscan.ts`** 的 `findFirstEnemyAabbHit` 做首次 AABB 命中；相交判定数值见 **`aabbMath.ts`** 的 `aabbOverlap`（与物理引擎解耦，便于与 Godot 判定口径对齐）。仓库根目录 **`npm test`**（Vitest）：`aabbOverlap`、`BattleRunState`、`WaveSpawnScheduler` 等无引擎依赖逻辑。  
  - 常量：`GameConfig.ts`（设计分辨率、射速/弹速、敌机速度与血量、`bossMaxHpForTier(tier)` 等）
- 美术与音频：由 `plane-war/assets/` 复制到本仓库 `assets/`（勿提交 Godot 的 `.import`），命名保持与 `docs/gdd/sections/11_art_and_assets.md` 一致。
- 本地成绩：与 Godot 的 `user://records.cfg` 类似，实现阶段使用 **本地存储**（如 `sys.localStorage` 或原生文件 API），键名与字段见 GDD 与 Godot `Main` 读写逻辑。
  - **Cocos（本仓库）**：`localRecords.ts` / `localRecordsCore.ts`；**`sys.localStorage`** 键 **`plane_war_cocos_records_v1`**，JSON 字段 **`bestScore`**、**`bestCombo`**、**`bestDps`**；**`bestDps`** 与本局 **`BattleRunState.maxDps`**（对敌有效伤害、**`DPS_WINDOW_SEC` 秒滑动窗口**）取大合并；**本局结算**与 **返回主菜单** 时写入；**主菜单**展示三项最佳（有则显示）。

## 视觉与 Shader 约定

- Godot 中敌人受击 Shader、护盾圈等，在 Cocos 中改用 **Material / Sprite / 粒子** 等等价实现；具体参数约定仍在 GDD「战斗规则」与 `plane-war` 脚本注释中维护，本节仅要求 **表现可读、逻辑一致**。

## 调试与发布

- 开发期可在战斗场景保留与 Godot 类似的 **调试入口**（跳 Boss、自选升级等），发布前在 GDD「发布」章节中声明是否关闭。
- 发布构建：使用 Cocos Creator **构建发布** 面板；CI 为可选项（见 `02_platform_and_ci.md`）。

## 第一阶段实现目标（本仓库）

- 主菜单与战斗场景可切换，设计分辨率 **720×1280**。
- **当前进度**：`Game` 场景中已实现 **波次刷怪与清场、清场后三选一升级再进入下一波、经验/得分与简易 HUD、预制体/代码兜底升级 UI**；脚本侧已模块化（工厂/状态/输入/命中等），仓库根目录 **`npm test`（Vitest）** 覆盖 **`aabbMath`、`BattleRunState`、`WaveSpawnScheduler`** 等无引擎逻辑。
- **下一里程碑**：美术资源按 `11_art_and_assets.md` 接入。（**档位 Combo! 字**、**判定点 / 连击中断**、**三种小怪原型**、**受击无敌帧**、**精英 / Boss / 护盾 / HUD** 等已实现；**连击 / 敌弹 / 撞机**：见既有模块。）

> 若实现与 Godot 版有路径或 API 差异，优先更新本节与 `README`，再改代码。
