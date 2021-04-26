import BotApp from "../src/main";

/**
 * @file 单测相关工具函数
 * @description
 * @author dengxuening<dengxuening@baidu.com>
 */

// 全局使用，botApp注册用的配置信息
export const botAppRegisterInfo = JSON.stringify({
    random1: '3691308f2a4c2f6983f2880d32e29c84',
    signature1: 'd85f5cfffe5450fe7855fec1fcfe0b16',
    random2: 'dc468c70fb574ebd07287b38d0d0676d',
    signature2: '61dc2b99967e0b326e82e80b05571d22',
    skillID: '699e74f5-b879-1926-1e11-51998f05ea68'
});

export function botAppFactor(JSBridge) {
    return new BotApp({
        ...JSON.parse(botAppRegisterInfo),
        _JsBridgeForUnitTest: JSBridge
    });
}

/**
 * 生成一个新的JSBridge对象
 * @returns {{registerHandler: jest.Mock, init: jest.Mock, callHandler: jest.Mock}}
 * @constructor
 */
export function JSBridgeFactor(handler) {
    return {
        init: jest.fn(),
        callHandler: handler && handler.callHandler || jest.fn(),
        registerHandler: handler && handler.registerHandler || jest.fn(),
        _name: 'Unit test JSBridge'
    }
}
