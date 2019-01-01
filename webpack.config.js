var path = require("path")
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')

var pathToPhaser = path.join(__dirname, "/node_modules/phaser/");
var phaser = path.join(pathToPhaser, "dist/phaser.js");

module.exports = {
  entry: "./src/game.ts",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "bundle.js"
  },
  module: {
    rules: [
      { test: /\.ts$/, loader: "ts-loader", exclude: "/node_modules/" },
      { test: /phaser\.js$/, loader: "expose-loader?Phaser" }
    ]
  },
  devtool: "cheap-source-map",
  devServer: {
    contentBase: path.resolve(__dirname, "./"),
    publicPath: "/build/",
    host: "127.0.0.1",
    port: 8080,
    open: true
  },
  resolve: {
    extensions: [".ts", ".js"],
    alias: {
      phaser: phaser
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      GAME_DEBUG: true
    })
    /*,
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./index.html",
      chunks: [ "vendor", "app" ],
      chunksSortMode: "manual",
      minify: {
        removeAttributeQuotes: false,
        collapseWhitespace: false,
        html5: false,
        minifyCSS: false,
        minifyJS: false,
        minifyURLs: false,
        removeComments: false,
        removeEmptyAttributes: false
      },
      hash: false
    })*/
  ]
}

