const { defineConfig } = require("@vue/cli-service");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = defineConfig({
  transpileDependencies: true,

  chainWebpack: (config) => {
    config.module.rule("md").test(/\.md$/).type("asset/source");
    
    // 设置 HTML 页面标题
    config.plugin("html").tap((args) => {
      args[0].title = "Wu Lab"; // 这里设置页面标题为 "Wu Lab"
      return args;
    });

    // GitHub Pages 属于纯静态托管，刷新 /Wulab/xxx 路由时服务器找不到对应文件，
    // 会回退到 404.html。这里额外生成一份和 index.html 完全相同的 404.html，
    // 让应用照常加载，由 vue-router 根据 URL 渲染正确页面
    const htmlArgs = config.plugin("html").get("args")[0];
    config
      .plugin("html-404")
      .use(HtmlWebpackPlugin, [{ ...htmlArgs, filename: "404.html" }]);
  },

  publicPath: process.env.NODE_ENV === "production" ? "/Wulab/" : "/",

  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});
