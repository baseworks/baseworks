const WebpackDevServer = require("webpack-dev-server");
const ResolveWebpackPlugin = require('./webpack-plugin');
const wepback = require('webpack');
const path = require('path');

const BUILD_DIR = path.resolve(__dirname, 'example/static')
const APP_DIR = path.resolve(__dirname, 'example/src')
const SRC_DIR = path.resolve(__dirname, 'src')
const CONTENT_DIR = path.resolve(__dirname, 'exampe')
const config = {
  entry: APP_DIR + '/main.js',
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },
  resolve: {
    modules: [APP_DIR, SRC_DIR, 'node_modules']
  },
  module: {
    rules: [
        { test: /\.html$/, loader: 'html-loader'},
        { test: /\.css$/, loader: "style!css" },
    ],
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader?presets[]=env'
      }
    ]
  },
  devServer: {
    port: 9005,
    host: 'localhost',
    historyApiFallback: true,
    contentBase: CONTENT_DIR,
  },
  plugins: [
    new ResolveWebpackPlugin()
  ]
}

module.exports = config;
