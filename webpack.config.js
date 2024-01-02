const { resolve } = require('path');

module.exports = [
  createConfig(resolve(__dirname, './src/index.ts'), resolve(__dirname, 'dist'), 'index.js', '@galeh/chuka'),
  createConfig(resolve(__dirname, './src/decorators/index.ts'), resolve(__dirname, 'dist/decorators'), 'index.js', '@galeh/chuka/decorators'),
  createConfig(resolve(__dirname, './src/middlewares/index.ts'), resolve(__dirname, 'dist/middlewares'), 'index.js', '@galeh/chuka/middlewares'),
  createConfig(resolve(__dirname, './src/validators/index.ts'), resolve(__dirname, 'dist/validators'), 'index.js', '@galeh/chuka/validators'),
];

function createConfig(entryFile, outputDir, outputFile, libname) {
  return {
    mode: 'production',
    entry: entryFile,
    target: 'node',
    output: {
      path: resolve(__dirname, outputDir),
      filename: outputFile,
      library: libname,
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