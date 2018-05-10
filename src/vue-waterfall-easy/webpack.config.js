var path = require('path')
var webpack = require('webpack')
module.exports = {
  entry: path.resolve(__dirname, './vue-waterfall-easy.vue'),
  output: {
    path: path.resolve(__dirname, 'script'),
    filename: 'vueWaterfallEasy.js',
    libraryTarget:'umd',
    library: 'vueWaterfallEasy',
    libraryExport: "default", // 不设置此项目，那么只能test.default中访问
  },

  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
    ]
  },
  plugins:[
    new webpack.optimize.UglifyJsPlugin()
  ]
};
