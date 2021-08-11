/**
 * @file 游戏试玩付费测试
 * @description
 * @author dengxuening<dengxuening@baidu.com>
 */
import {botAppFactor, JSBridgeFactor} from "./utils";

describe('游戏试玩付费相关逻辑', () => {

    beforeEach(() => {
        Object.defineProperty(navigator, 'userAgent', {
            writable: true,
            value: 'Mozilla/5.0 (Linux; Android 8.1.0; NV6001 Build/O11019; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/58.0.3029.125 Mobile Safari/537.36 ContainerVersion/1.45.0.0 (Android) DuerOS/Xiaodu;'
        });
    });

    test('游戏心跳上报: 开启上报，展示订阅banner', (done) => {
        const response = JSON.stringify({
            intent: {
                name: 'H5gameHeartBeatReport',
                slots: [
                    {name: 'needHeartbeatReport', value: '1'},
                    {name: 'timeInterval', value: 60000},
                    {name: 'displaySub', value: '1'}
                ]
            },
            customData: JSON.stringify({name: "DuerOS"})
        });
        const JSBridge = JSBridgeFactor({
            registerHandler: jest.fn((name, cb) => {
                name === 'onHandleIntent' && setTimeout(() => {
                    cb(response, () => {});
                    expect(botApp.trialGame._fireGameProcessBeatReport).toHaveBeenCalledWith(60000);
                    expect(botApp.trialGame._renderTrialGameSubscribeBanner).toHaveBeenCalledWith(expect.any(Object));
                    done();
                })
            })
        });
        const botApp = botAppFactor(JSBridge);
        botApp.trialGame._fireGameProcessBeatReport = jest.fn();
        botApp.trialGame._renderTrialGameSubscribeBanner = jest.fn();
        expect(JSBridge.registerHandler).toHaveBeenCalledWith('onHandleIntent', expect.any(Function));
    });

    test('游戏心跳上报: 关闭上报，不展示订阅banner', (done) => {
        const response = JSON.stringify({
            customData: JSON.stringify({name: 'DuerOS'}),
            intent: {
                name: 'H5gameHeartBeatReport',
                slots: [
                    {name: 'needHeartbeatReport', value: '0'},
                    {name: 'timeInterval', value: 60000},
                    {name: 'displaySub', value: '0'}
                ]
            }
        });
        const JSBridge = JSBridgeFactor({
            registerHandler: jest.fn((name, cb) => {
                name === 'onHandleIntent' && setTimeout(() => {
                    cb(response, () => {});
                    expect(botApp.trialGame._renderTrialGameSubscribeBanner).not.toBeCalled();
                    expect(botApp.trialGame._cancelGameProcessBeatReport).toBeCalled();
                    done();
                })
            })
        });
        const botApp = botAppFactor(JSBridge);
        botApp.trialGame._renderTrialGameSubscribeBanner = jest.fn();
        botApp.trialGame._cancelGameProcessBeatReport = jest.fn();
        expect(JSBridge.registerHandler).toHaveBeenCalledWith('onHandleIntent', expect.any(Function));
    });

    test('0元购游戏试玩付费，刷新banner', (done) => {
        const response = JSON.stringify({
            customData: JSON.stringify({
                "payPrice": "支付价格",
                "image": "展示图片",
                "video": "展示视频",
                "productId": "商品id",
                "sellerOrderId": "订单id",
                "buyUrl": "支付链接",
                "payType": "3",
                "desc": "还剩5分钟哦",
                relatedProduct: [
                    {buyUrl: "url"}
                ]
            }),
            intent: {
                name: 'H5gameTrialStatus',
                slots: [
                    {name: 'needPay', value: '1'}
                ]
            }
        });
        const JSBridge = JSBridgeFactor({
            registerHandler: jest.fn((name, cb) => {
                name === 'onHandleIntent' && setTimeout(() => {
                    cb(response, () => {});
                    expect(botApp.trialGame._firePayDialog).toBeCalled();
                    expect(botApp.trialGame._tryPostMessageToTrialGameSubscribeBanner).toHaveBeenCalledWith({
                        type: 'refresh_banner_text',
                        data: "还剩5分钟哦"
                    })
                    done();
                })
            })
        });
        const botApp = botAppFactor(JSBridge);
        botApp.trialGame._firePayDialog = jest.fn();
        botApp.trialGame._tryPostMessageToTrialGameSubscribeBanner = jest.fn();
        expect(JSBridge.registerHandler).toHaveBeenCalledWith('onHandleIntent', expect.any(Function));
    });

    test('游戏试玩付费，', (done) => {
        const response = JSON.stringify({
            customData: JSON.stringify({
                "payPrice": "支付价格",
                "image": "展示图片",
                "video": "展示视频",
                "productId": "商品id",
                "sellerOrderId": "订单id",
                "buyUrl": "支付链接",
                "payType": "2",
                relatedProduct: [
                    {buyUrl: "url"}
                ]
            }),
            intent: {
                name: 'H5gameTrialStatus',
                slots: [
                    {name: 'needPay', value: '1'}
                ]
            }
        });
        const JSBridge = JSBridgeFactor({
            registerHandler: jest.fn((name, cb) => {
                name === 'onHandleIntent' && setTimeout(() => {
                    cb(response, () => {});
                    expect(botApp.trialGame._renderTrialGameOrder).toBeCalled();
                    done();
                })
            })
        });
        const botApp = botAppFactor(JSBridge);
        botApp.trialGame._renderTrialGameOrder = jest.fn();
        expect(JSBridge.registerHandler).toHaveBeenCalledWith('onHandleIntent', expect.any(Function));
    });

    test('游戏试玩已经付费，', (done) => {
        const response = JSON.stringify({
            customData: JSON.stringify({
                "payPrice": "支付价格",
                "image": "展示图片",
                "video": "展示视频",
                "productId": "商品id",
                "sellerOrderId": "订单id",
                "buyUrl": "支付链接",
                "payType": "2",
                relatedProduct: [
                    {buyUrl: "url"}
                ]
            }),
            intent: {
                name: 'H5gameTrialStatus',
                slots: [
                    {name: 'needPay', value: '0'}
                ]
            }
        });
        const JSBridge = JSBridgeFactor({
            registerHandler: jest.fn((name, cb) => {
                name === 'onHandleIntent' && setTimeout(() => {
                    cb(response, () => {});
                    expect(botApp.trialGame._renderTrialGameOrder).not.toBeCalled();
                    expect(botApp.trialGame._firePayDialog).not.toBeCalled();
                    done();
                })
            })
        });
        const botApp = botAppFactor(JSBridge);
        botApp.trialGame._renderTrialGameOrder = jest.fn();
        botApp.trialGame._firePayDialog = jest.fn();
        expect(JSBridge.registerHandler).toHaveBeenCalledWith('onHandleIntent', expect.any(Function));
    });

    test('游戏购买成功', (done) => {
        const response = JSON.stringify({
            customData: null,
            intent: {
                name: 'NotifyBuyStatus',
                slots: [
                    {name: 'purchaseResult', value: 'SUCCESS'}
                ]
            }
        });
        const JSBridge = JSBridgeFactor({
            registerHandler: jest.fn((name, cb) => {
                name === 'onHandleIntent' && setTimeout(() => {
                    cb(response, () => {});
                    expect(botApp.trialGame._closeTrialGameOrder).toBeCalled();
                    expect(botApp.trialGame._closeTrialGameBanner).toBeCalled();
                    done();
                })
            })
        });
        const botApp = botAppFactor(JSBridge);
        botApp.trialGame._closeTrialGameOrder = jest.fn();
        botApp.trialGame._closeTrialGameBanner = jest.fn();
        expect(JSBridge.registerHandler).toHaveBeenCalledWith('onHandleIntent', expect.any(Function));
    });

});
