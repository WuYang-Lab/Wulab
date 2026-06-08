# Copilot Instructions for wulab

## 项目架构概览
- 本项目为基于 Vue 3 + Vue Router 的单页应用（SPA），入口为 `src/main.js`，主组件为 `src/App.vue`。
- 路由配置集中在 `src/router.js`，目前仅有首页（`/`）路由，指向 `src/views/HomePage.vue`。
- 主要页面结构由 `Header.vue`、`Body.vue`、`Member.vue` 组件组成，均位于 `src/components/`。
- 静态资源（图片等）存放于 `src/assets/`，公共 HTML 模板为 `public/index.html`。

## 关键开发流程
- **安装依赖**：`npm install`
- **本地开发**：`npm run serve`（支持热重载）
- **生产构建**：`npm run build`
- **代码检查**：`npm run lint`（使用 ESLint，规则见 `package.json` 的 `eslintConfig` 字段）

## 重要约定与模式
- 组件命名采用大驼峰（如 `Header.vue`），导入时使用相对路径。
- 路由页面统一放在 `src/views/`，通用组件放在 `src/components/`。
- 图片等静态资源统一放在 `src/assets/`，通过相对路径或 `@/assets/` 引用。
- 样式可直接写在组件内 `<style>` 标签，优先使用 scoped CSS。
- 路由导航使用 `<router-link>`，避免直接用 `<a>` 标签跳转。
- 响应式菜单、导航栏等交互逻辑建议用组件内 `data` 和 `methods` 管理。

## 依赖与集成
- 主要依赖：`vue`、`vue-router`、`element-plus`、`axios`。
- 构建工具链基于 `@vue/cli-service`，Babel 配置见 `babel.config.js`。
- JS 路径别名 `@` 指向 `src/`，配置见 `jsconfig.json`。

## 典型代码模式示例
- 组件注册与导入：
  ```js
  import Header from '../components/Header.vue'
  ```
- 路由配置：
  ```js
  import { createRouter, createWebHistory } from 'vue-router'
  const routes = [ { path: '/', component: HomePage } ]
  ```
- 响应式数据与方法：
  ```js
  data() { return { isMenuOpen: false } },
  methods: { toggleMenu() { this.isMenuOpen = !this.isMenuOpen } }
  ```

## 其他说明
- 详细配置可参考 [Vue CLI 官方文档](https://cli.vuejs.org/config/)。
- 如需扩展路由或组件，建议遵循现有目录结构和命名规范。

---
如有不明确或遗漏之处，请反馈以便补充完善。