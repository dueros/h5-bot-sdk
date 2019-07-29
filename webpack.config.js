/**
 * @file webpack配置文件
 * @author dengxuening<dengxuening@baidu.com>
 */

const webpack =require('webpack');
const path = require('path');
const PACKAGE = require('./package');

module.exports = {
    // mode: 'development',
    mode: 'production',
    entry: './main.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'h5-bot-sdk.' + PACKAGE.version + '.js',
        library: 'BotApp', // 暴露到全局变量中的名字，具体配置参考：https://webpack.docschina.org/guides/author-libraries
        libraryTarget: 'var', // 模块暴露方式：全局变量
    },
    plugins: [
        // 是用于保持模块引用的 module id 不变
        new webpack.HashedModuleIdsPlugin(),

        // 减少闭包函数数量从而加快JS在浏览器的执行速度
        new webpack.optimize.ModuleConcatenationPlugin(),

        // 在产出的开头注入版本信息
        new webpack.BannerPlugin(PACKAGE.name + ' - ' + PACKAGE.version),
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            }
        ]
    }
}
