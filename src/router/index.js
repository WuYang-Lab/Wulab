// src/router/index.js
import Vue from "vue";
import Router from "vue-router";

import TutorialLayout from "@/views/tutorial/TutorialLayout.vue";
import TutorialIndexView from "@/views/tutorial/TutorialIndexView.vue";
import TutorialDetailView from "@/views/tutorial/TutorialDetailView.vue";


Vue.use(Router);

export default new Router({
  mode: "history", // 如果你是 hash 模式就改成 "hash"
  routes: [
    {
      path: "/tutorial",
      component: TutorialLayout,
      children: [
        { path: "", name: "TutorialIndex", component: TutorialIndexView },
        { path: ":slug", name: "TutorialDetail", component: TutorialDetailView, props: true },
      ],
    },

    // 你原来的其他路由...
    // { path: "/", component: Home },
  ],
});