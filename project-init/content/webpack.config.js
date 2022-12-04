const path = require('path');
const WebpackBeforeBuildPlugin = require('before-build-webpack');

module.exports = {
  entry: '@/main.js',
  mode: 'production',
  devtool: 'source-map',
  resolve: {
    extensions: ['.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@generated': path.resolve(__dirname, '.generated'),
    },
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
    libraryTarget: 'commonjs2'
  },
  plugins: [
    new WebpackBeforeBuildPlugin((stats, callback) => {
      require('summit-worker-framework/build');
      callback();
    }),
  ]
}
