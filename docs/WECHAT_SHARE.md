# 微信分享卡片配置

## 重要：链接卡片 vs 图片海报

微信内置浏览器的分享行为有明确区分：

| 分享方式 | 发送内容 | 能否点击跳转网页 |
|---------|---------|----------------|
| 右上角 ··· 分享给好友 | 链接卡片（标题+描述+缩略图） | 能 |
| 右上角 ··· 分享到朋友圈 | 链接卡片 | 能 |
| 保存海报图片后发朋友圈 | 纯图片 | **不能** |
| 保存海报图片后发微信群 | 纯图片 | **不能** |

**结论：分享海报图片无法实现点击跳转网页。** 如需引流到 TennisLV，应引导用户使用右上角分享链接卡片，海报作为辅助传播素材。

## 当前状态

OG（Open Graph）meta 标签已配置在 `apps/h5/index.html`，微信内置浏览器读取 `og:title`、`og:description`、`og:image`、`og:url` 生成分享卡片。

| 字段 | 值 |
|------|-----|
| og:title | TennisLV｜业余网球评级 |
| og:description | 测一测你的网球水平，看看你是 2.5、3.0 还是 3.5 |
| og:image | https://tennislv.app/share-cover.png (500×500) |
| og:url | https://tennislv.app |

当前无需 JS-SDK 即可正常显示分享卡片。如需**动态分享卡片**（展示个性化评级结果），需要接入微信 JS-SDK。

## 正式接入微信 JS-SDK 的步骤

### 1. 前置条件

- 拥有**已认证的微信公众号**（个人订阅号不支持 JS-SDK）
- 在公众号后台 → 公众号设置 → 功能设置 → 配置 **JS 接口安全域名**（即 tennislv.app）
- 将 `MP_verify_*.txt` 文件放入 `apps/h5/public/` 目录

### 2. 后端签名接口

微信 JS-SDK 要求后端生成签名。需要新增 API 端点：

```
GET /api/wechat/js-signature?url=<当前页面URL>
```

返回格式：

```json
{
  "appId": "wxXXXXXXXXXXXXXXXX",
  "timestamp": 1700000000,
  "nonceStr": "随机字符串",
  "signature": "生成的签名"
}
```

签名算法（服务端实现）：

1. 通过 `access_token` 获取 `jsapi_ticket`
2. 拼接字符串：`jsapi_ticket=<ticket>&noncestr=<nonce>&timestamp=<ts>&url=<url>`
3. SHA1 哈希得到签名

### 3. 前端启用分享

`apps/h5/index.html` 中已预留 JS-SDK 初始化代码（HTML 注释）。取消注释并确认：

- `appId` 从后端接口获取
- `jsApiList` 包含 `updateAppMessageShareData`（分享给好友）和 `updateTimelineShareData`（分享到朋友圈）
- 动态分享信息（个性化评级结果）在 `wx.ready` 回调中设置

### 4. 分享图片建议

- 尺寸：300×300 或 500×500 像素
- 格式：JPG 或 PNG（微信对 SVG 支持有限，建议用 PNG）
- 大小：< 300KB
- 路径：`apps/h5/public/share-cover.png`

### 5. 调试

- 微信内置浏览器打开 `https://tennislv.app`
- 使用微信开发者工具或 `vconsole` 查看 JS-SDK 错误
- 签名错误最常见的原因：URL 不一致（确保传给后端的是 `location.href.split('#')[0]`）

### 6. 参考文档

- [微信 JS-SDK 说明文档](https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html)
- [Open Graph 协议](https://ogp.me/)
