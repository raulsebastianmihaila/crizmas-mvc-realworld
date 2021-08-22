'use strict';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
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
    filename: '[name].bundle-[contenthash].js',
    clean: true
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
        // normalization needed for windows
        include: path.normalize(`${__dirname}/src`),
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/react'],
            }
          }
        ]
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
    port: 5556,
    static: {
      directory: 'dist'
    },
    historyApiFallback: {
      index: '/'
    }
  }
};
