const WebpackDevServer = require("webpack-dev-server");
const ResolveWebpackPlugin = require('./webpack-plugin');
const wepback = require('webpack');
const path = require('path');

const BUILD_DIR = path.resolve(__dirname, 'example/static');
const APP_DIR = path.resolve(__dirname, 'example/src');
const SRC_DIR = path.resolve(__dirname, 'src');
const CONTENT_DIR = path.resolve(__dirname, 'example');
const config = {
    entry: APP_DIR + '/main.js',
    output: {
        path: BUILD_DIR,
        filename: 'bundle.js'
    },
    mode: "development",
    resolve: {
        modules: [APP_DIR, SRC_DIR, 'node_modules']
    },
    module: {
        rules: [
            {test: /\.html$/, loader: 'html-loader'},
            {test: /\.css$/, loader: "style!css"},
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                options: {
                    presets: ['env', 'es2015', 'stage-2'],
                    plugins: ['transform-decorators-legacy']
                }
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
};

module.exports = config;
