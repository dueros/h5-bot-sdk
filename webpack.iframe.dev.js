/**
 * @file webpack配置文件
 * @author dengxuening<dengxuening@baidu.com>
 */

const webpackMerge = require('webpack-merge');
const baseConfig = require('./webpack.iframe.base');

module.exports = webpackMerge(baseConfig, {
    mode: 'development',
    output: {
        filename: 'iframe/[name]_[hash].js',
        publicPath: '/',
    },
    devServer: {
        disableHostCheck: true,
        contentBase: __dirname + '/dist/iframe/',
        stats: {
            colors: true
        },
        hot: true,
        host: '0.0.0.0',
        port: 8080,
        proxy: {
            '/saiya/v1/': {
                // target: 'http://bjyz-nuomiplus.epc.baidu.com:8080'
                target: 'http://xiaodu.baidu.com'
            },
            '/voiceapp': {
                // target: 'http://bjyz-nuomiplus.epc.baidu.com:8080'
                target: 'http://xiaodu.baidu.com'
            }
        }
    }
});
