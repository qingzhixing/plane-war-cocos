# 升级三选一预制体（编辑器制作说明）

## 目标

在 **Cocos Creator 3.8.x** 中制作 `UpgradePick.prefab`，供 **Game** 场景里 `GameRoot` 组件引用，实现与 Godot 版 `upgrade_ui.gd` 一致的 **波次清场后三选一强化**。

## 步骤概要

1. 在 **资源管理器** 中于本目录右键 → **创建 → Prefab**，命名为 `UpgradePick`。
2. 双击打开预制体，根节点建议命名 **`UpgradePickRoot`**，添加组件 **`UITransform`**，尺寸与全屏遮罩需求一致（例如 **720×1280**，锚点居中）。
3. 根节点添加脚本 **`UpgradeUI`**（`assets/scripts/UpgradeUI.ts`）。
4. 在根节点下搭建 UI（可用 **Widget** 铺满屏）：
   - 半透明背景（如 **Sprite** / **Graphics** / **BlockInputEvents** 的纯色底）。
   - 标题 **Label**：「升级！选一个强化」。
   - 三个 **卡片**（可用 `Horizontal Layout` 或手动摆）：每张卡片包含：
     - **名称 Label**（大字）
     - **描述 Label**（小字、自动换行）
     - **Button**（整卡点击；或单独「选择」按钮）
5. 选中根节点，在 **属性检查器 → UpgradeUI** 中绑定：
   - **标题 Label**（可选）
   - **选项 0/1/2** 的 **名称 Label、描述 Label、按钮 Button**（与脚本中 `@property` 字段一一对应）。
6. 保存预制体。
7. 打开 **`assets/scenes/Game.scene`**，选中 **Canvas**，在 **GameRoot** 组件上将 **升级三选一预制体** 属性 **拖入** `UpgradePick.prefab`。
8. 运行预览：清场后应弹出三选一；点选后关闭并进入下一波。

## 节点命名建议（便于排查）

| 节点 | 用途 |
|------|------|
| `Mask` | 全屏遮罩 + 拦截点击 |
| `Title` | 标题 Label |
| `Cards/Card0` `Card1` `Card2` | 三个选项容器 |
| `Card0/Name` `Desc` `PickBtn` | 单卡子节点 |

若暂不绑定属性，也可在脚本里用 `find()` 按路径查找（不推荐长期使用）。

## 默认不挂预制体时

未在 **GameRoot** 上指定预制体时，`BattleMain` 会使用 **简易内置三选一**（仅保证可玩，样式弱于预制体）。
