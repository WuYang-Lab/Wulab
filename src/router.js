import { createRouter, createWebHistory } from 'vue-router';

import HomePage from './views/HomePage.vue';
import SoftwarePage from './views/Software.vue';
import GctbRun from './views/GctbRun.vue';
import PublicationPage from './views/Publication.vue';
import DataPage from './Data/DataPage.vue';
import DataDetail from './Data/DataDetail.vue';
import NewsPage from './views/NewsPage.vue';

import JoinContactPage from './views/JoinPage.vue';
import ResearchPage from './views/ResearchPage.vue';
import PeoplePage from './views/PeoplePage.vue';

import { FEATURES } from './config/site';

/* Tutorial 板块由 src/config/site.js 的 FEATURES.tutorial 控制。
   关闭时：路由不注册（组件与 md 走异步 chunk，也不会被加载），
   访问 /tutorial 直接回首页；开启时恢复原样。 */
const tutorialRoutes = FEATURES.tutorial
  ? [
      {
        path: "/tutorial",
        component: () => import("./tutorials/TutorialLayout.vue"),
        children: [
          { path: "", name: "TutorialIndex", component: () => import("./tutorials/TutorialIndexView.vue") },
          { path: ":slug", name: "TutorialDetail", component: () => import("./tutorials/TutorialDetailView.vue"), props: true },
        ],
      },
    ]
  : [{ path: "/tutorial/:pathMatch(.*)*", redirect: "/" }];

const routes = [
  { path: "/", component: HomePage },
  { path: "/research", component: ResearchPage },
  { path: "/software", name:"Software", component: SoftwarePage },
  { path: "/software/gctb", name: "GCTBPortal", component: GctbRun },
  /* 软件文档页：GWFM / OPERA 共用一套 Vue 外壳（AppHeader + 二级导航 + 目录） */
  {
    path: "/software/:soft(GWFM|OPERA)",
    name: "SoftDoc",
    component: () => import("./views/softdoc/SoftDoc.vue"),
    props: true,
  },
  { path: '/publications', component: PublicationPage },
  { path: '/data', component: DataPage },
  { path: '/data/:id', component: DataDetail },
  { path: "/news", component: NewsPage },
  { path: "/contact", component:  JoinContactPage },
  { path: "/people", component:  PeoplePage },
  ...tutorialRoutes,
];

const router = createRouter({
  // 设置 base 为 /Wulab/，确保路由处理正确
  history: createWebHistory('/Wulab/'),
  routes,
});

export default router;
