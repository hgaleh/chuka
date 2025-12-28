const { resolve } = require('path');
const webpack = require('webpack');

module.exports = [
	createConfig(resolve(__dirname, './src/index.ts'), 'index.js', '@galeh/chuka')
];

function createConfig(entryFile, outputFile, libname) {
	return (env, argv) => {
		const isProduction = argv.mode === 'production';

		return ({
			mode: isProduction ? 'production' : 'development',
			entry: entryFile,
			devtool: isProduction ? false : 'source-map',
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
			plugins: [
				new webpack.DefinePlugin({
					'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development')
				})
			],
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
		})
	}
}