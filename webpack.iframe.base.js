/**
 * @file webpack配置文件
 * @author dengxuening<dengxuening@baidu.com>
 */

const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const PACKAGE = require('./package');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

module.exports = {
    entry: {
        oauth: './iframe/mobile-oauth.js',
        'h5game-wrapper': './iframe/h5game-wrapper.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        // 是用于保持模块引用的 module id 不变
        new webpack.HashedModuleIdsPlugin(),

        // 减少闭包函数数量从而加快JS在浏览器的执行速度
        new webpack.optimize.ModuleConcatenationPlugin(),

        // 在产出的开头注入版本信息
        new webpack.BannerPlugin(PACKAGE.name + ' - ' + PACKAGE.version),

        new VueLoaderPlugin(),

        new HtmlWebpackPlugin({
            filename: path.join(__dirname, 'dist/iframe/oauth.html'),
            inject: 'body',
            chunks: ['oauth'],
            minify: false,
            template: './iframe/template.html'
        }),

        new HtmlWebpackPlugin({
            filename: path.join(__dirname, 'dist/iframe/h5game-wrapper.html'),
            inject: 'body',
            minify: false,
            chunks: ['h5game-wrapper'],
            template: './iframe/template.html'
        }),
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: [path.resolve(__dirname, 'dist/iframe'), path.resolve(__dirname, 'output')]
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            },
            {
                test: /\.vue$/,
                exclude: /node_modules/,
                use: 'vue-loader'
            },
            {
                test: /\.less$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    'less-loader'
                ]
            }
        ]
    }
};
