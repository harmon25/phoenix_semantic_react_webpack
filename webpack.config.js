'use strict';

var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin')

function join(dest) { return path.resolve(__dirname, dest); }

function web(dest) { return join('web/static/' + dest); }

var config = module.exports = {
  entry: {
       main_entry: web('js/main_entry.js'),
       vendor: ["react", "react-dom", "jquery", "./web/static/vendor/semantic/semantic"]
   }
  ,
  output: {
    path: join('priv/static'),
    filename: 'js/app.js'


  },
  resolve: {
    extesions: ['', '.js', '.css'],
    modulesDirectories: ['node_modules']
  },
  
  devtool: 'source-map'
  ,

  module: {
    noParse: /vendor\/phoenix/,
    loaders: [
      {
        test: /\.js$/,
        exclude: [/node_modules/, /web\/static\/vendor/],
        loader: 'babel',
        query: {
          cacheDirectory: true,
          plugins: ['transform-decorators-legacy'],
          presets: ['react', 'es2015']
        }
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader", {publicPath: "../"})
      },
      { test: /\.png/, loader: "url-loader?limit=10000&mimetype=image/png&name=css/[name].[ext]" },
      { test: /\.svg/, loader: "url-loader?limit=10000&mimetype=image/svg&name=css/[name].[ext]" },
      { test   : /\.woff|\.woff2|\.svg|.eot|\.ttf/, loader : 'url?prefix=font/&limit=10000&name=css/[name].[ext]'},
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader?name=css/[name].[ext]" }
    ]
  },

  plugins: [
    new ExtractTextPlugin('css/app.css'),
    new HtmlWebpackPlugin({
       title: 'Phoenix Semantic Webpack',
       filename: 'index.html',
       inject: 'body' // Inject all scripts into the body
    }),
    new webpack.optimize.CommonsChunkPlugin(/* chunkName= */"vendor", /* filename= */"js/vendor.bundle.js", Infinity),
    new webpack.ProvidePlugin({
      $: "jquery",
      'jQuery': 'jquery'
    })
  ]
};

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({ minimize: true })
  );
}
