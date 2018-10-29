const path = require('path');

module.exports = {
  entry: './src/injectedFile.js',
  output: {
    path: path.resolve(__dirname, 'build/js'),
    filename: 'injected_file.js'
  }
};
