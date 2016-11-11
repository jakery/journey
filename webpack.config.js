var webpack = require('webpack');

module.exports = {
  entry: './src/Scripts/App.js',
  output: {
    path: __dirname,
    filename: './src/bundle.js',
    sourceMapFilename: './src/bundle.js.map',
  },
  devtool: 'inline-source-map',
  loaders: [
    { test: /\.json$/, loader: 'json' },
  ],
};
