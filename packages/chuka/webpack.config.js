const { resolve } = require('path');

module.exports = [
  createConfig(resolve(__dirname, './src/index.ts'), 'index.js', '@galeh/chuka')
];

function createConfig(entryFile, outputFile, libname) {
  return {
    mode: 'development',
    entry: entryFile,
    target: 'node12',
    output: {
      path: resolve(__dirname, 'dist/chuka'),
      filename: outputFile,
      libraryTarget: 'commonjs'
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      extensions: ['.ts']
    },
    externals: {
      "express": "express",
      "express-ws": "express-ws",
      "inversify": "inversify",
      "reflect-metadata": "reflect-metadata",
      "tslib": "tslib",
      "@types/express": "@types/express",
      "@types/express-ws": "@types/express-ws",
      "@types/ws": "@types/ws"
    }
  }
}