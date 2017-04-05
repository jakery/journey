var webpack = require('webpack');

module.exports = {
  entry: './src/Scripts/App.js',
  output: {
    path: __dirname,
    filename: './src/journey.js',
    sourceMapFilename: './src/journey.js.map',
  },
  devtool: 'inline-source-map',
  loaders: [
    { test: /\.json$/, loader: 'json' },
    {
      test: /src[\\\/]Lib[\\\/]modernizr-custom\.3\.4\.0\.min\.js$/,
      loader: 'imports?this=>window!exports?window.Modernizr',
    },
  ],
};
