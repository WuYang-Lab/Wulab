const { defineConfig } = require("@vue/cli-service");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = defineConfig({
  transpileDependencies: true,

  chainWebpack: (config) => {
    config.module.rule("md").test(/\.md$/).type("asset/source");

    // Software 文档页正文：以字符串形式内联（src/views/softdoc/content/*.tpl.html）
    config.module.rule("softdocTpl").test(/\.tpl\.html$/).type("asset/source");
    
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
    // 绑定 0.0.0.0：让同一局域网内的其他机器可以通过本机 IP 访问
    host: "0.0.0.0",
    port: 8081,
    // 允许任意 Host 头，避免用 IP / 主机名访问时被 dev-server 拦成 403 Invalid Host header
    allowedHosts: "all",
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});
