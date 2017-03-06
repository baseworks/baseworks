const WebpackDevServer = require("webpack-dev-server");
const ResolveWebpackPlugin = require('./webpack-plugin');
const wepback = require('webpack');
const path = require('path');

const BUILD_DIR = path.resolve(__dirname, 'dist')
const APP_DIR = path.resolve(__dirname, 'src')

const config = {
  entry: APP_DIR + '/main.js',
  output: {
    path: BUILD_DIR,
    publicPath: '',
    filename: 'bundle.js'
  },
  resolve: {
    modules: [APP_DIR, 'node_modules']
  },
  module: {
    rules: [
        { test: /\.html$/, loader: 'html-loader'},
        { test: /\.css$/, loader: "style!css" },
    ]
  },
  devServer: {
    port: 9005,
    host: 'localhost',
    historyApiFallback: true,
  },
  plugins: [
    new ResolveWebpackPlugin()
  ]
}

module.exports = config;
