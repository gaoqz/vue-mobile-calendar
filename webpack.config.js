var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require("extract-text-webpack-plugin")

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: 'index.js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
              scss: 'style-loader!css-loader!sass-loader',
              sass: 'style-loader!css-loader!sass-loader?indentedSyntax',
          }
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        loader: 'sass-loader'
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.common.js'
    }
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true
  },
  devtool: '#eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
  module.exports.entry = './src/index.js'

  module.exports.output = {
    path: path.resolve(__dirname, './dist'),
    filename:'index.js',
    library:'VueEventCalendar',
    libraryTarget: 'umd'
  }
  module.exports.devtool = '#source-map'
  module.exports.module.rules[0].options.loaders = {
    css: ExtractTextPlugin.extract({
      use: 'css-loader',
      fallback: 'vue-style-loader' // <- this is a dep of vue-loader, so no need to explicitly install if using npm3
    }),
    scss: ExtractTextPlugin.extract({
      use: 'css-loader!sass-loader',
      fallback: 'vue-style-loader'
    })
  }
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    new ExtractTextPlugin("style.css")
  ])
}