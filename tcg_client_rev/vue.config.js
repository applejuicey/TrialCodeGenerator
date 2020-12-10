module.exports = {
  publicPath: '/tcg/',
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title= 'Trial Code Generator'
        return args
      })
  },
  devServer: {
    port: 8080,
    host: "localhost",
    https: false,
    open: false,
    proxy: {
      "/api": {
        target: "http://10.10.8.21:26108/api",
        // target: "http://localhost:4359/api",
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          "^/api": ""
        },
      },
    },
  },
}