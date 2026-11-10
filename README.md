# SoneM1yk 的博客

基于 [Shirone](https://github.com/LyraVoid/Shirone) 的 GitHub Pages 个人博客。

站点地址：https://sonem1yk.github.io/

## 本地开发

需要 Node.js 26.13.0+ 与 pnpm 12.18.0（版本已写入 `package.json`）。

```bash
pnpm install
pnpm dev
```

打开 http://localhost:4321 查看站点。

## 写文章

文章放在 `shirones/content/posts/`，支持 Markdown 与 MDX。新建一个文件：

```yaml
---
title: 第一篇文章
published: 2026-11-10
description: 文章摘要
tags: [随笔]
category: 生活
---

正文从这里开始。
```

## 修改站点

- 站点标题、网址、语言、横幅与配色：`shirones/config/siteConfig.ts`
- 头像、昵称、简介与社交链接：`shirones/config/profileConfig.ts`
- 关于页正文：`shirones/content/spec/about.md`
- 导航与侧栏：`shirones/config/navBarConfig.ts`、`shirones/config/sidebarConfig.ts`
- 文章列表分页与布局：`shirones/config/postListConfig.ts`
- 静态图片与头像：`public/`

## 部署到 GitHub Pages

工作流 `.github/workflows/deploy.yml` 会在每次推送到 `main` 时构建并发布
`dist/`。首次部署需要在 GitHub 仓库中设置：

1. 打开 `Settings > Pages`。
2. 在 `Build and deployment > Source` 选择 `GitHub Actions`。
3. 推送代码到 `main`，等待 Actions 完成。

站点使用用户主页仓库 `sonem1yk.github.io`，因此网址根目录为 `/`，
`shirones/config/siteConfig.ts` 中的 `base` 应保持 `"/"`。

## 更新主题

```bash
pnpm add shirones@latest
npx shirones init          # 查看配置漂移
npx shirones init --update # 补回缺失的模板文件
```

本仓库采用 npm 包模式，主题源码由 `shirones` 依赖提供；`src/components/`
与 `src/layouts/` 可用于覆盖单个组件。
