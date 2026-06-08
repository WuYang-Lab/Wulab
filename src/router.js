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

import TutorialLayout from "./tutorials/TutorialLayout.vue";
import TutorialIndexView from "./tutorials/TutorialIndexView.vue";
import TutorialDetailView from "./tutorials/TutorialDetailView.vue";

const routes = [
  { path: "/", component: HomePage },
  { path: "/research", component: ResearchPage },
  { path: "/software", name:"Software", component: SoftwarePage },
  { path: "/software/gctb", name: "GCTBPortal", component: GctbRun },
  { path: '/publications', component: PublicationPage },
  { path: '/data', component: DataPage },
  { path: '/data/:id', component: DataDetail },
  { path: "/news", component: NewsPage },
  { path: "/contact", component:  JoinContactPage },
  { path: "/people", component:  PeoplePage },
  {
    path: "/tutorial",
    component: TutorialLayout,
    children: [
      { path: "", name: "TutorialIndex", component: TutorialIndexView },
      { path: ":slug", name: "TutorialDetail", component: TutorialDetailView, props: true },
    ],
  },
];

const router = createRouter({
  // 设置 base 为 /Wulab/，确保路由处理正确
  history: createWebHistory('/Wulab/'),
  routes,
});

export default router;
