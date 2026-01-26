# 快速开始 (Quick Start)

## 中文说明

### 前置条件
你必须先安装 CC Switch，因为这个 Raycast 扩展直接同步 CC Switch 的数据库。

### 使用步骤

1. **确保 CC Switch 已安装并运行过至少一次**
   - 下载: https://github.com/farion1231/cc-switch
   - 运行 CC Switch 创建数据库

2. **在 Raycast 中打开扩展**
   - 按 `⌘ + Space` 打开 Raycast
   - 输入 "Manage Profiles" 或 "Quick Switch Profile"

3. **你会立即看到所有 CC Switch 的 profiles**
   - 不需要导入
   - 不需要同步
   - 自动显示

4. **快速切换 profile**
   - 输入 "Quick Switch"
   - 选择一个 profile
   - 按回车完成切换

### 工作原理

```
CC Switch 桌面应用 → SQLite 数据库 ← Raycast 扩展
                   (~/.cc-switch/
                    cc-switch.db)
```

两个工具读写同一个数据库，所以：
- ✅ 在 CC Switch 创建的 profile 立即在 Raycast 可用
- ✅ 在 Raycast 切换的 profile 立即在 CC Switch 更新
- ✅ 完全同步，零延迟

### 常用场景

**场景1: 快速切换 API provider**
```
正在编码 → ⌘ Space → "Quick Switch" → 选择 profile → 回车
```

**场景2: 创建新 profile**
```
Raycast → "Manage Profiles" → "Create New Profile" → 填写表单
或
CC Switch → 创建新 profile → 刷新 Raycast 自动显示
```

**场景3: 编辑 profile**
```
Raycast → 选择 profile → ⌘ E → 编辑
或
CC Switch → 编辑 profile → Raycast 自动同步
```

### 为什么使用 Raycast 扩展？

虽然 CC Switch 提供完整的功能，但 Raycast 扩展提供：

1. **更快的访问** - 不需要切换到 CC Switch 窗口
2. **键盘驱动** - 完全不需要鼠标
3. **轻量级** - 不需要启动完整的桌面应用
4. **工作流整合** - 与其他 Raycast 命令无缝集成

### 两者搭配使用最佳！

- **CC Switch**: 详细配置、初始设置、高级功能
- **Raycast**: 快速切换、日常使用、键盘快捷键

---

## English

### Prerequisites
You must have CC Switch installed as this Raycast extension syncs directly with CC Switch's database.

### Steps

1. **Ensure CC Switch is installed and has been run at least once**
   - Download: https://github.com/farion1231/cc-switch
   - Run CC Switch to create the database

2. **Open the extension in Raycast**
   - Press `⌘ + Space` to open Raycast
   - Type "Manage Profiles" or "Quick Switch Profile"

3. **You'll immediately see all your CC Switch profiles**
   - No import needed
   - No sync required
   - Automatically displayed

4. **Quickly switch profiles**
   - Type "Quick Switch"
   - Select a profile
   - Press Enter to switch

### How It Works

```
CC Switch Desktop → SQLite Database ← Raycast Extension
                   (~/.cc-switch/
                    cc-switch.db)
```

Both tools read/write the same database, so:
- ✅ Profiles created in CC Switch are instantly available in Raycast
- ✅ Profiles switched in Raycast instantly update in CC Switch
- ✅ Perfectly synced, zero latency

### Common Workflows

**Workflow 1: Quick API Provider Switch**
```
Coding → ⌘ Space → "Quick Switch" → Select profile → Enter
```

**Workflow 2: Create New Profile**
```
Raycast → "Manage Profiles" → "Create New Profile" → Fill form
OR
CC Switch → Create new profile → Auto-appears in Raycast
```

**Workflow 3: Edit Profile**
```
Raycast → Select profile → ⌘ E → Edit
OR
CC Switch → Edit profile → Auto-syncs to Raycast
```

### Why Use the Raycast Extension?

While CC Switch provides full functionality, the Raycast extension offers:

1. **Faster Access** - No need to switch to CC Switch window
2. **Keyboard-Driven** - No mouse required
3. **Lightweight** - No need to launch full desktop app
4. **Workflow Integration** - Seamless with other Raycast commands

### Use Both Together for Best Results!

- **CC Switch**: Detailed config, initial setup, advanced features
- **Raycast**: Quick switching, daily use, keyboard shortcuts
