/**
 * @file  BotApp单测
 * @author dengxuening<dengxuening@baidu.com>
 */

import BotApp from '../src/main';

Object.defineProperty(navigator, 'userAgent', {
    writable: true,
    value: 'Mozilla/5.0 (Linux; Android  NV6001 Build/1.36.0.0; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/58.0.3029.125 Safari/537.36 DuerOS/Xiaodu;'
});

function mockWebViewJavascriptBridge() {
    const mockCallHandler = jest.fn();
    const mockRegisterHandler = jest.fn();
    window.WebViewJavascriptBridge = {
        init: () => {},
        callHandler: mockCallHandler,
        registerHandler: mockRegisterHandler
    };
    return {mockCallHandler, mockRegisterHandler};
}

describe('测试SHOW端BotApp功能', () => {

    describe('初始化：new BotApp', () => {
        test('BotApp初始化调用js-bridge', () => {
            const mockInitHandler = jest.fn();
            const mockCallHandler = jest.fn();
            window.WebViewJavascriptBridge = {
                init: mockInitHandler,
                callHandler: mockCallHandler,
                registerHandler: () => {}
            };
            const data = {
                random1: '3691308f2a4c2f6983f2880d32e29c84',
                signature1: 'd85f5cfffe5450fe7855fec1fcfe0b16',
                random2: 'dc468c70fb574ebd07287b38d0d0676d',
                signature2: '61dc2b99967e0b326e82e80b05571d22',
                skillID: '699e74f5-b879-1926-1e11-51998f05ea68'
            };
            new BotApp(data);
            expect(mockInitHandler).toHaveBeenCalled();
            expect(mockCallHandler).toHaveBeenCalledWith('register', JSON.stringify({
                    random1: '3691308f2a4c2f6983f2880d32e29c84',
                    signature1: 'd85f5cfffe5450fe7855fec1fcfe0b16',
                    random2: 'dc468c70fb574ebd07287b38d0d0676d',
                    signature2: '61dc2b99967e0b326e82e80b05571d22'}),
                expect.any(Function)
            );
        });
    });

    describe('普通API调用', () => {
        window.WebViewJavascriptBridge = {
            init: () => {},
            callHandler: (name, data, cb) => {
                if (name === 'register') {
                    setTimeout(() => {
                        cb(JSON.stringify({accessToken: '21.15a2c2cd345816f2e51f9eae6e3d1f03.2592000.1566035530.2050908969-9943593'}))
                    }, 0);
                }
            },
            registerHandler: () => {}
        };

        const data = {
            random1: '3691308f2a4c2f6983f2880d32e29c84',
            signature1: 'd85f5cfffe5450fe7855fec1fcfe0b16',
            random2: 'dc468c70fb574ebd07287b38d0d0676d',
            signature2: '61dc2b99967e0b326e82e80b05571d22',
            skillID: '699e74f5-b879-1926-1e11-51998f05ea68'
        };
        const botApp = new BotApp(data);

        beforeEach(() => {
            window.WebViewJavascriptBridge = {
                init: () => {},
                callHandler: () => {},
                registerHandler: () => {}
            };
        });

        test('requireLinkAccount', () => {
            window.WebViewJavascriptBridge.callHandler = jest.fn();
            botApp.requireLinkAccount();
            expect(window.WebViewJavascriptBridge.callHandler).toHaveBeenCalledWith('requireLinkAccount');
        });

        test('onLinkAccountSuccess', (done) => {
            const callback = jest.fn();
            window.WebViewJavascriptBridge.registerHandler = jest.fn((name, cb) => {
                setTimeout(() => {
                    cb(JSON.stringify({
                        app:{
                            accessToken: '21.15a2c2cd345816f2e51f9eae6e3d1f03.2592000.1566035530.2050908969-9943593'
                        }
                    }), () => {});
                    expect(callback).toHaveBeenCalledWith({
                        app:{
                            accessToken: '21.15a2c2cd345816f2e51f9eae6e3d1f03.2592000.1566035530.2050908969-9943593'
                        }
                    });
                    done();
                }, 0);
            });
            botApp.onLinkAccountSuccess(callback);
            expect(window.WebViewJavascriptBridge.registerHandler).toHaveBeenCalledWith('onLinkAccountSuccess', expect.any(Function))
        });

        test('getRegisterResult', (done) => {
            const callback = jest.fn(() => {
                expect(callback).toHaveBeenCalledWith({accessToken: '21.15a2c2cd345816f2e51f9eae6e3d1f03.2592000.1566035530.2050908969-9943593'});
                done();
            });
            botApp.getRegisterResult(callback);
        });

        test('requireUserAgeInfo', (done) => {
            const callback = jest.fn();
            window.WebViewJavascriptBridge.callHandler = jest.fn((name, data, cb) => {
                setTimeout(() => {
                    cb(JSON.stringify({
                        status: 0,
                        data: {
                            is_auth: '1',
                            age_group: '2'
                        }
                    }));
                    expect(callback).toHaveBeenCalledWith(null, {
                        is_auth: '1',
                        age_group: '2'
                    });
                    done();
                }, 0);
            });
            botApp.requireUserAgeInfo(callback);
            expect(window.WebViewJavascriptBridge.callHandler).toHaveBeenCalledWith('requestUserAgeInfo', null, expect.any(Function));
        });

        test('requireCharge', () => {
            const callback = jest.fn();
            window.WebViewJavascriptBridge.callHandler = jest.fn();
            const data = {
                chargeBaiduPay: {
                    authorizeAttributes: {
                        authorizationAmount: {
                            amount: '1.09',
                            currencyCode: 'CNY'
                        },
                        sellerAuthorizationNote: '双11大促'
                    },
                    sellerOrderAttributes: {
                        sellerOrderId: 'hfuawffu2jkjk12e23',
                        productName: 'Mac Book Pro 2019',
                        productId: 'fjaksdfkvjsznvj',
                        description: '笔记本电脑',
                        sellerNote: '大促销'
                    }
                }
            };
            botApp.requireCharge(data);
            expect(window.WebViewJavascriptBridge.callHandler).toHaveBeenCalledWith('requireCharge', JSON.stringify(data));
        });

        test('onChargeStatusChange', (done) => {
            const data = {
                token: 'faskdfkasdfsnvcknawjkenfjkwa',
                authorizationDetails: {
                    authorizationAmount: {
                        amount: "1.99",
                        currencyCode: 'CNY'
                    },
                    capturedAmount: {
                        amount: '1.09',
                        currencyCode: 'CNY'
                    },
                    creationTimestamp: '1546272000000'
                },
                baiduOrderReferenceId: 'fjkasdfekfjsnvks',
                sellerOrderId: 'fskdfjmvckadfl',
                purchaseResult: 'SUCCESS',
                message: '支付成功'
            };
            const callback = jest.fn();
            window.WebViewJavascriptBridge.registerHandler = jest.fn((name, cb) => {
                setTimeout(() => {
                    cb(JSON.stringify(data), () => {});
                    expect(callback).toHaveBeenCalledWith(data);
                    done();
                }, 0)
            });
            botApp.onChargeStatusChange(callback);
            expect(window.WebViewJavascriptBridge.registerHandler).toHaveBeenCalledWith('onChargeStatusChange', expect.any(Function));
        });

        test('listen', () => {
            const callback = jest.fn();
            window.WebViewJavascriptBridge.callHandler = jest.fn();
            botApp.listen();
            expect(window.WebViewJavascriptBridge.callHandler).toHaveBeenCalledWith('listen', expect.any(Function))
        });

        test('speak', () => {
            const data = '风清气正才能赢';
            const callback = jest.fn();
            window.WebViewJavascriptBridge.callHandler = jest.fn();
            botApp.speak(data);
            expect(window.WebViewJavascriptBridge.callHandler).toHaveBeenCalledWith('speak', data, expect.any(Function))
        });

        test('requestClose', () => {
            window.WebViewJavascriptBridge.callHandler = jest.fn();
            botApp.requestClose();
            expect(window.WebViewJavascriptBridge.callHandler).toHaveBeenCalledWith('requestClose');
        });

        test('updateUiContext', () => {
            const data = {
                enableGeneralUtterances: true, // 如果为false,当用户的表达与下方注册的常用表达都不匹配时设备不会有任何处理
                hyperUtterances: [
                    {
                        url: 'https://www.apple.com', // 当用户的语音对话内容与utterances匹配时，SDK会调用onClickLink中的回调函数，并将本URL当做参数。
                        utterances: ['苹果'],
                        type: 'link',
                        params: {}
                    },
                    {
                        url: 'https://www.banana.com',
                        utterances: ['香蕉'],
                        type: 'link',
                        params: {}
                    },
                    {
                        url: 'https://www.strawberry.com',
                        utterances: ['草莓'],
                        type: 'link',
                        params: {}
                    }
                ]
            };
            window.WebViewJavascriptBridge.callHandler = jest.fn();
            botApp.updateUiContext(data);
            expect(window.WebViewJavascriptBridge.callHandler).toHaveBeenCalledWith('updateUiContext', JSON.stringify(data), expect.any(Function));
        });

        test('uploadLinkClicked', () => {
            const data = {
                url: 'dueros://d7a12baa-47d5-437f-7af6-05bc9c4e5c28/?openbot=true&oss_channel=ls_m'
            };
            window.WebViewJavascriptBridge.callHandler = jest.fn();
            botApp.uploadLinkClicked(data);
            expect(window.WebViewJavascriptBridge.callHandler).toHaveBeenCalledWith('uploadLinkClicked', JSON.stringify(data));
        });

        test('onHandleScreenNavigatorEvent', (done) => {
            const data = {
                data: 1
            };
            const callback = jest.fn();
            window.WebViewJavascriptBridge.registerHandler = jest.fn((name, cb) => {
                setTimeout(() => {
                    cb(JSON.stringify(data), () => {});
                    expect(callback).toHaveBeenCalledWith(data);
                    done();
                }, 0)
            });
            botApp.onHandleScreenNavigatorEvent(callback);
            expect(window.WebViewJavascriptBridge.registerHandler).toHaveBeenCalledWith('onHandleScreenNavigatorEvent', expect.any(Function));
        });

        test('requireShipping', () => {
            window.WebViewJavascriptBridge.callHandler = jest.fn();
            botApp.requireShipping();
            expect(window.WebViewJavascriptBridge.callHandler).toHaveBeenCalledWith('uploadLinkClicked', JSON.stringify({
                url: `dueros://${botApp.config.skillID}/readyForShipping`,
                initiator: {
                    type: 'AUTO_TRIGGER'
                }
            }));
        });

        test('onDialogStateChanged', (done) => {
            const callback = jest.fn();
            window.WebViewJavascriptBridge.registerHandler = jest.fn((name, cb) => {
                setTimeout(() => {
                    cb(JSON.stringify({
                        data: 'LISTENING'
                    }), () => {});
                    expect(callback).toHaveBeenCalledWith(null, 'LISTENING');
                    done();
                }, 0)
            });
            botApp.onDialogStateChanged(callback);
            expect(window.WebViewJavascriptBridge.registerHandler).toHaveBeenCalledWith('onDialogStateChanged', expect.any(Function));
        });

        test('canGoBack', (done) => {
            const callback = jest.fn();
            window.WebViewJavascriptBridge.callHandler = jest.fn((name, data, cb) => {
                setTimeout(() => {
                    cb(JSON.stringify({
                        data: true
                    }));
                    expect(callback).toHaveBeenCalledWith(null, true);
                    done();
                }, 0)
            });
            botApp.canGoBack(callback);
            expect(window.WebViewJavascriptBridge.callHandler).toHaveBeenCalledWith('canGoBack', null, expect.any(Function));
        })

        test('_parseShowVersion', () => {
            expect(botApp._parseShowVersion()).toBe('1.36.0.0');
        });

        test('_compareShowVersion', () => {
            expect(botApp._compareShowVersion('1.36.0.0', '1.36.0.1')).toBe(-1);
            expect(botApp._compareShowVersion('1.36.0.1', '1.36.0.0')).toBe(1);
            expect(botApp._compareShowVersion('1.36.0.0', '1.36.0.0')).toBe(0);
            expect(botApp._compareShowVersion('1.36.1.0', '1.36.0.0')).toBe(1);
            expect(botApp._compareShowVersion('1.36.1.0', '1.37.0.0')).toBe(-1);
            expect(botApp._compareShowVersion('2.3.0.0', '1.90.0.0')).toBe(1);
        })
    });

    describe('实例化阶段被调用的API', () => {
        const mockRegisterOnHandleIntent = jest.fn();
        const mockRegisterOnClickLink = jest.fn();
        const appConfig = {
            random1: '3691308f2a4c2f6983f2880d32e29c84',
            signature1: 'd85f5cfffe5450fe7855fec1fcfe0b16',
            random2: 'dc468c70fb574ebd07287b38d0d0676d',
            signature2: '61dc2b99967e0b326e82e80b05571d22'
        };
        const intentData = {
            "app": {
                "packageName": "com.baidu.duershow.h5container"
            },
            "customData": "",
            "intent": {
                "name": "test_city",
                "slots": [{
                    "name": "sys.city",
                    "value": "{\"city\":\"南京\",\"origin\":\"南京\"}"
                }]
            }
        };
        window.WebViewJavascriptBridge = {
            init: () => {},
            callHandler: (name, data, cb) => {},
            registerHandler: (name, cb) => {
                if (name === 'onHandleIntent') {
                    mockRegisterOnHandleIntent(name, cb);
                    setInterval(() => {
                        cb(JSON.stringify(intentData), () => {});
                    }, 100);
                } else if (name === 'onClickLink') {
                    mockRegisterOnClickLink(name, cb);
                    // 测试onClickLink调用
                    setInterval(() => {
                        cb(JSON.stringify({
                            url: 'https://www.straberry.com',
                            params: {}
                        }), () => {});
                    }, 100);

                    // 测试onHandleUnknowUtterance调用
                    setInterval(() => {
                        cb(JSON.stringify({
                            url: 'http://sdk.bot.dueros.ai?action=unknown_utterance',
                            params: JSON.stringify({query: '哈密瓜'})
                        }), () => {});
                    }, 100);
                }
            }
        };

        const data = {
            ...appConfig,
            skillID: '699e74f5-b879-1926-1e11-51998f05ea68'
        };

        const botApp = new BotApp(data);

        test('onHandleIntent', (done) => {
            expect(mockRegisterOnHandleIntent).toHaveBeenCalledWith('onHandleIntent', expect.any(Function));
            const callback = jest.fn(() => {
                expect(callback).toHaveBeenCalledWith(intentData);
                done();
            });
            botApp.onHandleIntent(callback);
        });
        test('onClickLink', (done) => {
            expect(mockRegisterOnClickLink).toHaveBeenCalledWith('onClickLink', expect.any(Function));
            const callback = jest.fn(() => {
                done();
                expect(callback).toHaveBeenCalledWith({url: 'https://www.straberry.com', params: {}})
            });
            botApp.onClickLink(callback);
        });

        test('onHandleUnknowUtterance', (done) => {
            const callback = jest.fn(() => {
                expect(callback).toHaveBeenCalledWith(null, {query: '哈密瓜'});
                done();
            });
            botApp.onHandleUnknowUtterance(callback);
        });
    });

});
