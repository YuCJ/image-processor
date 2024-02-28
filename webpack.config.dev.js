const baseConfig = require('./webpack.config.base');
const webpack = require('webpack');

module.exports = {
  ...baseConfig,
  output: {
    ...baseConfig.output,
    publicPath: '',
  },
  devServer: {
    hot: true,
    watchContentBase: false,
    host: '0.0.0.0',
    port: 8080,
    publicPath: '',
  },
  devtool: 'eval-source-map',
  plugins: [...baseConfig.plugins, new webpack.HotModuleReplacementPlugin()],
};
