const path = require('path');

module.exports = {
  mode: 'development',
  entry: './playground/index.js',
  output: {
    filename: 'scripts.js',
  },
  devtool: false,
  devServer: {
    contentBase: path.join(__dirname, 'playground'),
    open: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  externals: {
    'pixi.js': 'PIXI',
  },
};
