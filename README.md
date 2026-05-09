# AI 网球教练 (Tennis AI Coach)

微信小程序 MVP — AI 驱动的网球动作诊断工具。

## 项目结构

```
tennis-ai-coach/
├── apps/
│   ├── api/              # Fastify + TypeScript 后端
│   └── miniprogram/      # 微信小程序
├── packages/
│   └── shared/           # 共享类型定义 & mock 数据
├── docs/
│   ├── prd.md            # 产品需求文档
│   ├── api.md            # API 接口设计
│   └── ai-schema.md      # AI 分析数据结构
└── pnpm-workspace.yaml
```

## 技术栈

| 层 | 技术 |
|---|------|
| 前端 | 微信小程序 TypeScript |
| 后端 | Fastify + TypeScript |
| 共享类型 | TypeScript (packages/shared) |
| 数据库 | PostgreSQL + Prisma (预留) |
| 存储 | 腾讯云 COS (预留) |
| 视频处理 | FFmpeg (预留) |
| AI 分析 | 多模态模型 (Mock MVP) |
| 包管理 | pnpm workspace |

## 快速开始

```bash
pnpm install
pnpm dev:api        # 启动 API 开发服务器
```

## MVP 功能

1. 上传 5-30 秒网球视频
2. 识别动作类型：正手 / 反手 / 发球
3. AI 输出 3 个主要问题
4. 匹配训练建议模板
5. 生成可分享的诊断报告

## 开发阶段

当前处于 **MVP Phase 1** — 项目骨架搭建，mock 数据优先。
