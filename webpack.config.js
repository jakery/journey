var webpack = require('webpack');

module.exports = {
  entry: './src/Scripts/jakesChallenge.js',
  output: {
    path: __dirname,
    filename: './src/Scripts/bundle.js',
    sourceMapFilename: './src/Scripts/bundle.js.map',
  },
  devtool: 'inline-source-map',
};
