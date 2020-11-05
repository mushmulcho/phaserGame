/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
var debug = process.env.NODE_ENV !== 'production';

module.exports = {
    entry: {
        app: './src/main.ts',
        vendors: ['phaser'],
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },

    devtool: 'inline-source-map',

    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
    },

    output: {
        filename: 'app.bundle.js',
        path: path.resolve(__dirname, (debug ?'dest' :'./build/')),
    },

    mode: debug ? "development" : "production",

    devServer: {
        contentBase: path.resolve(__dirname, 'dest'),
        writeToDisk: true,
        open: true,
    },

    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: 'index.html',
                },
                {
                    from: 'assets/**/*',
                },
            ],
        }),
        new webpack.DefinePlugin({
            'typeof CANVAS_RENDERER': JSON.stringify(true),
            'typeof WEBGL_RENDERER': JSON.stringify(true),
        }),
    ],

    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                },
            },
        },
    },
};