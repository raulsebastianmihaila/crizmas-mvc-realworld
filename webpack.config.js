'use strict';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const DefinePlugin = webpack.DefinePlugin;
const mode = process.env.NODE_ENV;
const isProductionTest = false;
const isProduction = mode === 'production' && !isProductionTest;

module.exports = {
  mode,
  devtool: 'source-map',
  entry: './src/js/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: isProduction ? '/crizmas-mvc-realworld-site/' : '/',
    filename: '[name].bundle-[hash].js'
  },
  optimization: {
    splitChunks: {
      minSize: 5000
    }
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        include: /(crizmas-|smart-mix)/,
        sideEffects: false
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react']
          }
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      chunksSortMode: 'none',
      template: './src/index.html',
      favicon: './src/img/favicon.ico',
      assetsPrefix: isProduction ? '/crizmas-mvc-realworld-site' : ''
    }),
    new DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(mode),
        basePath: JSON.stringify(isProduction
          ? 'crizmas-mvc-realworld-site'
          : null)
      }
    }),
    new CleanWebpackPlugin(),
    ...isProduction || isProductionTest
      ? [
        new CopyWebpackPlugin({
          patterns: [
            {from: 'src/css', to: 'css'}
          ]
        })
      ]
      : []
  ],
  devServer: {
    contentBase: 'src',
    port: 5556,
    historyApiFallback: {
      index: '/'
    }
  }
};
