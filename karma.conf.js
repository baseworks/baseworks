// Karma configuration
// Generated on Fri Mar 10 2017 09:56:55 GMT-0800 (Pacific Standard Time)
var webpackConfig = require('./webpack.config.js');
webpackConfig.entry = {};

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      './test/tests.webpack.js',
    ],

    preprocessors: {
      './test/tests.webpack.js': ['webpack', 'sourcemap']
    },

    reporters: ['progress'],

    webpack: {
      devtool: 'inline-source-map',
      module: {
        loaders: [
          {test: /\.js$/, loader: 'babel-loader'}
        ]
      }
    },
    webpackServer: {
      noInfo: true
    },
    port: 9876,

    colors: true,


    logLevel: config.LOG_INFO,

    autoWatch: true,

    browsers: ['Chrome'],

    singleRun: false,

    concurrency: Infinity
  })
}
