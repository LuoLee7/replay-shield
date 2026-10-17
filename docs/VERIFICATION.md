# v1.1.0 验证记录

日期：2026-10-17。

本版根据实际使用反馈调整：移除队名隐藏和视频遮挡，保留周边剧透保护，增加事件标记与总局数线索保护。

核对的官方公开播放器资源：

- https://player.bilibili.com/player.html
- https://s1.hdslb.com/bfs/static/player/main/core.6dcbfdb4.js
- https://s1.hdslb.com/bfs/static/player/main/widgets/npd.165.cd9329c3.js
- https://s1.hdslb.com/bfs/static/player/main/widgets/npd.936.b4f963a9.js
- https://s1.hdslb.com/bfs/static/player/main/widgets/npd.997.f1bbcbba.js

其中 165 / 936 模块确认 progress-freezone、progress-point-wrap、progress-popup、PBP 和 viewpoint 相关结构；997 模块确认原生 ctrl-next / ctrl-prev 模板。图标不止存在于进度条本身，所以新增独立层的隐藏规则。

本地检查使用 Node.js / jsdom、虚构比赛卡片及官方播放器类名测试夹具，30 项功能检查通过。检查覆盖：队名和队标不命中隐藏规则；比分和胜负提示隐藏；无视频遮挡层或编辑开关；事件标记隐藏独立于周边隐藏；P3 还有下一局与 P3 没有下一局时护盾按钮状态相同；切局时只使用实际入口；缺少入口不生成越界地址；设置同步；旧版设置兼容；10 秒后恢复比分保护；播放器节点替换；全屏容器中的面板迁移；弹窗设置保存及本地资源完整性。

这类检查不等于真实浏览器视觉检查。本轮未通过自动化安装或操作用户浏览器，也未确认真实 B 站回放、账号状态和播放器全屏效果。
