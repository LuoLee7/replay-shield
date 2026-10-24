# 回放护盾验证记录

1.1.0 记录日期：2026-10-17；1.2.0 检查日期：2026-10-24。

1.1.0 根据实际使用反馈调整：移除队名隐藏和视频遮挡，保留周边剧透保护，增加事件标记与总局数线索保护。

核对的官方公开播放器资源：

- https://player.bilibili.com/player.html
- https://s1.hdslb.com/bfs/static/player/main/core.6dcbfdb4.js
- https://s1.hdslb.com/bfs/static/player/main/widgets/npd.165.cd9329c3.js
- https://s1.hdslb.com/bfs/static/player/main/widgets/npd.936.b4f963a9.js
- https://s1.hdslb.com/bfs/static/player/main/widgets/npd.997.f1bbcbba.js

其中 165 / 936 模块确认 progress-freezone、progress-point-wrap、progress-popup、PBP 和 viewpoint 相关结构；997 模块确认原生 ctrl-next / ctrl-prev 模板。图标不止存在于进度条本身，所以新增独立层的隐藏规则。

本地检查使用 Node.js / jsdom、虚构比赛卡片及官方播放器类名测试夹具，45 项功能检查通过。检查覆盖：队名和队标不命中隐藏规则；比分和胜负提示隐藏；无视频遮挡层或编辑开关；事件标记隐藏独立于周边隐藏；P3 还有下一局与 P3 没有下一局时护盾按钮状态相同；切局时只使用实际入口；缺少入口不生成越界地址；设置同步；旧版设置兼容；10 秒后恢复比分保护；播放器节点替换；全屏容器中的面板迁移；弹窗设置保存及本地资源完整性。

UP 主筛选检查（15 项）：面板默认填入官方 mid `50329118`；官方 UP 主启用整页护盾；其他 UP 主不启用且按钮变灰；把当前 UP 主 mid 加入名单后当前页即时启用并落盘；上传者容器缺失时回退到 JSON-LD author；SPA 切换视频并替换 UP 主后重新判定；`live.bilibili.com/6` 与 `/blanc/6` 赛事页、`/v/game/match`（含无尾斜杠）、`player.bilibili.com` 外部播放器、`blackboard` 活动页始终启用；直播页不启用（关闭筛选时也不启用）；关闭筛选后所有视频页都保护；名单留空时回退为全部视频页保护。检查仍在 jsdom 中进行，UP 主信息用页面结构夹具模拟，未覆盖真实 B 站首屏 DOM 到达时间与 SPA 切换时的短暂窗口。

这类检查不等于真实浏览器视觉检查。本轮未通过自动化安装或操作用户浏览器，也未确认真实 B 站回放、账号状态和播放器全屏效果。
