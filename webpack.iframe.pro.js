/**
 * @file webpack配置文件
 * @author dengxuening<dengxuening@baidu.com>
 */

const webpackMerge = require('webpack-merge');
const baseConfig = require('./webpack.iframe.base');

module.exports = webpackMerge(baseConfig, {
    mode: 'production',
    output: {
        filename: 'iframe/[name]_[chunkhash].js',
        // publicPath: 'https://duer.bdstatic.com/saiya/sdk',
        publicPath: 'http://cp01-dengxuening.epc.baidu.com:8080/static/sdk',
    }
});
