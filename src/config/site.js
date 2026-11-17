/* 站点功能开关
   想启用 / 隐藏某个模块，只改这里的布尔值即可，不用去动组件和路由代码。 */
export const FEATURES = {
  /* Tutorial 板块：内容还在整理，暂时隐藏。
     导航入口（桌面 + 小屏抽屉）与 /tutorial 路由会一起消失，
     直接访问 /tutorial 会被重定向回首页。
     以后要编辑/上线时，把 false 改成 true 就全部恢复了。 */
  tutorial: false,
};
