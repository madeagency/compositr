const path = require('path');

module.exports = {
  entry: path.join(__dirname, 'index.js'),
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel-loader'
    }]
  },
  output: {
    library: 'Compositr',
    filename: 'dist/compositr.js'
  }
}
