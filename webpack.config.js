const path = require('path');

module.exports = {
  mode: 'development',
  entry: './playground/game.ts',
  output: {
    filename: 'scripts.js',
    path: path.join(__dirname, 'playground'),
  },
  devtool: false,
  devServer: {
    contentBase: path.join(__dirname, 'playground'),
    open: true,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|tsx|ts)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.tsx', '.ts'],
  },
  externals: {
    'pixi.js': 'PIXI',
  },
};
