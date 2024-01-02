// webpack.config.js
const path = require('path');

module.exports = {
  // Entry point for the bundle
  mode: 'production',
  entry: './src/index.ts',
  target: 'node',
  // Output file path and name
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    library: '@galeh/galeh',
    libraryTarget: 'commonjs'
  },
  // Specify the module rules for loaders
  module: {
    rules: [
      // Use ts-loader to transpile TypeScript files
      {
        test: /\.ts$/, // Match all files with .ts extension
        use: 'ts-loader', // Use ts-loader
        exclude: /node_modules/ // Exclude node_modules folder
      }
    ]
  },
  // Specify the file extensions to resolve
  resolve: {
    extensions: ['.ts', '.js'] // Resolve .ts and .js files
  }
};