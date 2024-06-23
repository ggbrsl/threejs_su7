const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  chainWebpack: (config) => {
    config.module
      .rule("glsl")
      .test(/\.(glsl|vs|fs)$/)
      .use("raw-loader")
      .loader("raw-loader")
      .end()
      .use("glslify-loader")
      .loader("glslify-loader")
      .end();
  },
});
