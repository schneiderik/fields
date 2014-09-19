module.exports = function(config) {
  config.set({
    basePath: './',
    frameworks: ['jasmine', 'browserify'],
    files: [],
    browserify: {
      extensions: ['.js', '.json'],
      ignore: [],
      watch: true,
      debug: true,
      noParse: [],
      files: [
        "spec/unit/*Spec.js",
      ]
    },
    exclude: [
      '**/*.swp'
    ],
    plugins: [
      'karma-jasmine',
      'karma-browserifast',
      'karma-phantomjs-launcher'
    ],
    preprocessors: {
      "/**/*.browserify": "browserify"
    },
    reporters: ['dots'],
    port: 7357,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS'],
    singleRun: false
  });
};
