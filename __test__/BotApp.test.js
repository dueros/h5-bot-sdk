/**
 * @file  BotApp单测
 * @author dengxuening<dengxuening@baidu.com>
 */

import BotApp from '../src/main';

Object.defineProperty(navigator, 'userAgent', {
    writable: true,
    value: 'Mozilla/5.0 (Linux; Android  NV6001 Build/1.40.0.0; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/58.0.3029.125 Safari/537.36 DuerOS/Xiaodu;'
});

// 全局使用，botApp注册用的配置信息
const botAppRegisterInfo = JSON.stringify({
    random1: '3691308f2a4c2f6983f2880d32e29c84',
    signature1: 'd85f5cfffe5450fe7855fec1fcfe0b16',
    random2: 'dc468c70fb574ebd07287b38d0d0676d',
    signature2: '61dc2b99967e0b326e82e80b05571d22',
    skillID: '699e74f5-b879-1926-1e11-51998f05ea68'
});

function botAppFactor(JSBridge) {
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
function JSBridgeFactor(handler) {
    return {
        init: jest.fn(),
        callHandler: handler && handler.callHandler || jest.fn(),
        registerHandler: handler && handler.registerHandler || jest.fn(),
        _name: 'Unit test JSBridge'
    }
}

describe('测试SHOW端BotApp功能', () => {

    describe('初始化：new BotApp', () => {
        // TODO("测试初始化时会被调用的其它函数")
        test('BotApp初始化调用js-bridge', () => {
            const JSBridge = JSBridgeFactor();
            const botApp = botAppFactor(JSBridge);
            expect(JSBridge.init).toHaveBeenCalled();
            const {skillID, ...nativeRegisterInfo} = JSON.parse(botAppRegisterInfo);
            expect(JSBridge.callHandler)
                .toHaveBeenCalledWith('register', JSON.stringify(nativeRegisterInfo), expect.any(Function));
        });
    });

    describe('普通API调用', () => {
        test('requireLinkAccount', () => {
            const JSBridge = JSBridgeFactor();
            const botApp = botAppFactor(JSBridge)
            botApp.requireLinkAccount();
            expect(JSBridge.callHandler).toHaveBeenCalledWith('requireLinkAccount');
        });

        test('onLinkAccountSuccess', (done) => {
            const transData = JSON.stringify({
                app:{
                    accessToken: '21.15a2c2cd345816f2e51f9eae6e3d1f03.2592000.1566035530.2050908969-9943593'
                }
            });
            const callback = jest.fn();
            const JSBridge = JSBridgeFactor({
                registerHandler: jest.fn((name, cb) => {
                    name === 'onLinkAccountSuccess' && setTimeout(() => {
                        cb(transData, () => {});
                        expect(callback).toHaveBeenCalledWith(JSON.parse(transData));
                        done();
                    }, 0);
                })
            });
            const botApp = botAppFactor(JSBridge);
            botApp.onLinkAccountSuccess(callback);
            expect(JSBridge.registerHandler).toHaveBeenCalledWith('onLinkAccountSuccess', expect.any(Function))
        });

        test('getRegisterResult', (done) => {
            const transData = JSON.stringify({
                apiAccessToken: "DuerOS"
            });
            const callback = jest.fn();
            const JSBridge = JSBridgeFactor({
                callHandler: jest.fn((name, data, cb) => {
                    name === 'register' && setTimeout(() => {
                        cb(transData, () => {});
                        expect(callback).toHaveBeenCalledWith(JSON.parse(transData));
                        done();
                    }, 0);
                })
            });
            const botApp = botAppFactor(JSBridge);
            botApp.getRegisterResult(callback);
            expect(JSBridge.callHandler).toHaveBeenCalledWith('register', expect.any(String), expect.any(Function))
        });

        test('requireUserAgeInfo: 已经实名认证', (done) => {
            const response = JSON.stringify({
                "status": 0,
                "msg": "success",
                "data": {
                    "is_auth": "1",
                    "age_group": "2"
                }
            });
            const callback = jest.fn();
            const JSBridge = JSBridgeFactor({
                callHandler: jest.fn((name, data, cb) => {
                    name === 'requestUserAgeInfo' && setTimeout(() => {
                        cb(response);
                        expect(callback).toHaveBeenCalledWith(null, JSON.parse(response).data);
                        done();
                    }, 0);
                })
            });
            const botApp = botAppFactor(JSBridge)
            botApp.requireUserAgeInfo(callback);
            expect(JSBridge.callHandler).toHaveBeenCalledWith('requestUserAgeInfo', null, expect.any(Function));
        });

        test('requireUserAgeInfo: 未进行实名认证', (done) => {
            const transData = JSON.stringify({
                "status": 0,
                "msg": "success",
                "data": {
                    "is_auth": "0",
                    "age_group": "2"
                }
            });
            const callback = jest.fn();
            const JSBridge = JSBridgeFactor({
                callHandler: jest.fn((name, data, cb) => {
                    name === 'requestUserAgeInfo' && setTimeout(() => {
                        cb(transData);
                        const link = `dueros://${botApp.config.skillID}/certification?action=realName`;
                        // 未实名认证的用户需要发送LinkClicked请求实名认证
                        expect(botApp.uploadLinkClicked).toHaveBeenCalledWith({
                            url: link,
                            initiator: {
                                type: 'AUTO_TRIGGER'
                            }
                        });
                        expect(callback).toHaveBeenCalledWith(null, JSON.parse(transData).data);
                        done();
                    }, 0);
                })
            });
            const botApp = botAppFactor(JSBridge)
            botApp.uploadLinkClicked = jest.fn();
            botApp.requireUserAgeInfo(callback);
            expect(JSBridge.callHandler).toHaveBeenCalledWith('requestUserAgeInfo', null, expect.any(Function));
        });

        test('requireCharge', () => {
            const JSBridge = JSBridgeFactor();
            const botApp = botAppFactor(JSBridge)
            const transData = JSON.stringify({
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
            });
            botApp.requireCharge(JSON.parse(transData));
            expect(JSBridge.callHandler).toHaveBeenCalledWith('requireCharge', transData);
        });

        test('onChargeStatusChange', (done) => {
            const transData = JSON.stringify({
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
            });
            const callback = jest.fn();
            const JSBridge = JSBridgeFactor({
                registerHandler: jest.fn((name, cb) => {
                    name === 'onChargeStatusChange' && setTimeout(() => {
                        cb(transData, () => {});
                        expect(callback).toHaveBeenCalledWith(JSON.parse(transData));
                        done();
                    }, 0)
                })
            });
            const botApp = botAppFactor(JSBridge);
            botApp.onChargeStatusChange(callback);
            expect(JSBridge.registerHandler).toHaveBeenCalledWith('onChargeStatusChange', expect.any(Function));
        });

        test('listen', () => {
            const JSBridge = JSBridgeFactor();
            const botApp = botAppFactor(JSBridge);
            botApp.listen();
            expect(JSBridge.callHandler).toHaveBeenCalledWith('listen', expect.any(Function))
        });

        test('speak', () => {
            const JSBridge = JSBridgeFactor();
            const botApp = botAppFactor(JSBridge);
            const data = '风清气正才能赢';
            botApp.speak(data);
            expect(JSBridge.callHandler).toHaveBeenCalledWith('speak', data, expect.any(Function))
        });

        test('requestClose', () => {
            const JSBridge = JSBridgeFactor();
            const botApp = botAppFactor(JSBridge);
            botApp.requestClose();
            expect(JSBridge.callHandler).toHaveBeenCalledWith('requestClose');
        });

        test('updateUiContext', () => {
            const JSBridge = JSBridgeFactor();
            const botApp = botAppFactor(JSBridge);
            const transData = JSON.stringify({
                enableGeneralUtterances: true,
                hyperUtterances: [
                    {
                        url: 'https://www.apple.com',
                        utterances: ['苹果'],
                        type: 'link',
                        params: {}
                    }
                ]
            });
            botApp.updateUiContext(JSON.parse(transData));
            expect(JSBridge.callHandler).toHaveBeenCalledWith('updateUiContext', transData, expect.any(Function));
        });

        test('uploadLinkClicked', () => {
            const transData = JSON.stringify({
                url: 'dueros://d7a12baa-47d5-437f-7af6-05bc9c4e5c28/?openbot=true&oss_channel=ls_m'
            });
            const JSBridge = JSBridgeFactor();
            const botApp = botAppFactor(JSBridge);
            botApp.uploadLinkClicked(JSON.parse(transData));
            expect(JSBridge.callHandler).toHaveBeenCalledWith('uploadLinkClicked', transData);
        });

        test('onHandleScreenNavigatorEvent', (done) => {
            const transData = JSON.stringify({
                data: 1
            });
            const callback = jest.fn();
            const JSBridge = JSBridgeFactor({
                registerHandler: jest.fn((name, cb) => {
                    name === 'onHandleScreenNavigatorEvent' && setTimeout(() => {
                        cb(transData, () => {});
                        expect(callback).toHaveBeenCalledWith(JSON.parse(transData));
                        done();
                    }, 0)
                })
            });
            const botApp = botAppFactor(JSBridge);
            botApp.onHandleScreenNavigatorEvent(callback);
            expect(JSBridge.registerHandler).toHaveBeenCalledWith('onHandleScreenNavigatorEvent', expect.any(Function));
        });

        test('requireShipping', () => {
            const JSBridge = JSBridgeFactor();
            const botApp = botAppFactor(JSBridge);
            botApp.uploadLinkClicked = jest.fn();
            botApp.requireShipping();
            expect(botApp.uploadLinkClicked).toHaveBeenCalledWith({
                url: `dueros://${botApp.config.skillID}/readyForShipping`,
                initiator: {
                    type: 'AUTO_TRIGGER'
                }
            });
        });

        test('onDialogStateChanged', (done) => {
            const callback = jest.fn();
            const JSBridge = JSBridgeFactor({
                registerHandler: jest.fn((name, cb) => {
                    name === 'onDialogStateChanged' && setTimeout(() => {
                        cb(JSON.stringify({
                            data: 'LISTENING'
                        }), () => {});
                        expect(callback).toHaveBeenCalledWith(null, 'LISTENING');
                        done();
                    }, 0)
                })
            });
            const botApp = botAppFactor(JSBridge);
            botApp.onDialogStateChanged(callback);
            expect(JSBridge.registerHandler).toHaveBeenCalledWith('onDialogStateChanged', expect.any(Function));
        });

        test('canGoBack', (done) => {
            const JSBridge = JSBridgeFactor({
                callHandler: jest.fn((name, data, cb) => {
                    name === 'canGoBack' && setTimeout(() => {
                        cb(JSON.stringify({
                            data: true
                        }));
                        expect(callback).toHaveBeenCalledWith(null, true);
                        done();
                    }, 0)
                })
            });
            const botApp = botAppFactor(JSBridge);
            const callback = jest.fn();
            botApp.canGoBack(callback);
            expect(JSBridge.callHandler).toHaveBeenCalledWith('canGoBack', null, expect.any(Function));
        })

        test('_parseShowVersion', () => {
            const botApp = botAppFactor(JSBridgeFactor());
            expect(botApp._parseShowVersion('Mozilla/5.0 (Linux; Android  NV6001 Build/1.40.0.0; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/58.0.3029.125 Safari/537.36 DuerOS/Xiaodu;')).toBe('1.40.0.0');
        });

        test('_parseVersionNumber', () => {
            const botApp = botAppFactor(JSBridgeFactor());
            expect(botApp._parseVersionNumber('Mozilla/5.0 (Linux; Android 8.1.0; NV6001 Build/O11019; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/58.0.3029.125 Mobile Safari/537.36 ContainerVersion/1.40.0.0 (Android) DuerOS/Xiaodu;')).toBe('1.40.0.0');
            expect(botApp._parseVersionNumber('Mozilla/5.0 (Linux; Android  NV6001 Build/1.36.0.0; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/58.0.3029.125 Safari/537.36 DuerOS/Xiaodu;')).toBe('1.36.0.0');
        });

        test('_compareShowVersion', () => {
            const botApp = botAppFactor(JSBridgeFactor());
            expect(botApp._compareShowVersion('1.36.0.0', '1.36.0.1')).toBe(-1);
            expect(botApp._compareShowVersion('1.36.0.1', '1.36.0.0')).toBe(1);
            expect(botApp._compareShowVersion('1.36.0.0', '1.36.0.0')).toBe(0);
            expect(botApp._compareShowVersion('1.36.1.0', '1.36.0.0')).toBe(1);
            expect(botApp._compareShowVersion('1.36.0.1', '1.36.1.0')).toBe(-1);
            expect(botApp._compareShowVersion('1.37.0.0', '1.36.1.0')).toBe(1);
            expect(botApp._compareShowVersion('1.36.0.1', '1.37.1.0')).toBe(-1);
            expect(botApp._compareShowVersion('2.3.0.0', '1.90.0.0')).toBe(1);
            expect(botApp._compareShowVersion('1.3.0.0', '2.90.0.0')).toBe(-1);
        });

        test('interruptTTS', () => {
            const JSBridge = JSBridgeFactor();
            const botApp = botAppFactor(JSBridge);
            botApp.interruptTTS();
            expect(JSBridge.callHandler).toHaveBeenCalledWith('triggerDuerOSCapacity', JSON.stringify({
                capacityName: 'AI_DUER_SHOW_INTERRPT_TTS',
                params: null
            }), expect.any(Function));
        });

        test('sendEvent', () => {
            const JSBridge = JSBridgeFactor();
            const botApp = botAppFactor(JSBridge);
            const transData = JSON.stringify({
                namespace: "ai.dueros.device_interface.bot_app_sdk",
                name: "TouchedDown",
                needDialogRequestId: false,
                payload: {
                    position : {
                        left: '20px',
                        top: '40px',
                    }
                }
            });
            botApp.sendEvent(JSON.parse(transData));
            expect(JSBridge.callHandler).toHaveBeenCalledWith('sendEvent', transData, expect.any(Function));
        });

        test('onHandleIntent', (done) => {
            const transData = JSON.stringify({
                "intent": {
                    "name": "test_intent"
                },
                "customData": JSON.stringify({data: Date.now()})
            });
            const callback = jest.fn();
            const JSBridge = JSBridgeFactor({
                registerHandler: jest.fn((name, cb) => {
                    name === 'onHandleIntent' && setTimeout(() => {
                        cb(transData, () => {})
                        expect(callback).toHaveBeenCalledWith(JSON.parse(transData))
                        done();
                    })
                })
            });
            const botApp = botAppFactor(JSBridge);
            expect(JSBridge.registerHandler).toHaveBeenCalledWith('onHandleIntent', expect.any(Function));
            botApp.onHandleIntent(callback);
        });

        test('onClickLink', (done) => {
            const transData = JSON.stringify({
                "url": "1",
                "params":{
                    "name": "DuerOS"
                }
            });
            const callback = jest.fn();
            const JSBridge = JSBridgeFactor({
                registerHandler: jest.fn((name, cb) => {
                    name === 'onClickLink' && setTimeout(() => {
                        cb(transData, () => {})
                        expect(callback).toHaveBeenCalledWith(JSON.parse(transData))
                        done();
                    })
                })
            });
            const botApp = botAppFactor(JSBridge);
            expect(JSBridge.registerHandler).toHaveBeenCalledWith('onClickLink', expect.any(Function));
            botApp.onClickLink(callback);
        });

        test('onHandleUnknowUtterance', (done) => {
            const transParams = JSON.stringify({
                os: 'DuerOS'
            });
            const transData = JSON.stringify({
                url: 'http://sdk.bot.dueros.ai?action=unknown_utterance',
                params: transParams
            })
            const JSBridge = JSBridgeFactor({
                registerHandler: jest.fn((name, cb) => {
                    name === 'onClickLink' && setTimeout(() => {
                        cb(transData, () => {})
                        expect(callback).toHaveBeenCalledWith(null, JSON.parse(transParams))
                        done();
                    })
                })
            })
            const botApp = botAppFactor(JSBridge);
            const callback = jest.fn();
            botApp.onHandleUnknowUtterance(callback);
        });

        test('registerGesture', (done) => {
            const data = ['GESTURE_OK', 'GESTURE_PALM', 'GESTURE_LEFT', 'GESTURE_RIGHT'];
            const transData = JSON.stringify({
                capacityName: 'AI_DUER_SHOW_GESTURE_REGISTER',
                params: {
                    enabledGestures: data
                }
            });
            const response = JSON.stringify({
                intent: {
                    name: 'AI_DUER_SHOW_GESTURE_RECOGNIZED',
                    slots: [{
                        name: 'recognizedGestureName',
                        value: 'OK'
                    }]
                }
            });
            let counter = 0; // 因为要执行两个异步函数
            const JSBridge = JSBridgeFactor({
                callHandler: jest.fn((name, payload, cb) => {
                    name === 'triggerDuerOSCapacity' && setTimeout(() => {
                        cb(transData)
                        counter++;
                        if (counter === 2) {
                            done();
                        }
                    }, 0);
                }),
                registerHandler: jest.fn((name, cb) => {
                    name === 'onHandleIntent' && setTimeout(() => {
                        cb(response, () => {})
                        expect(callback).toHaveBeenCalledWith(null, 'OK');
                        counter++;
                        if (counter === 2) {
                            done();
                        }
                    })
                })
            });
            const botApp = botAppFactor(JSBridge);
            const callback = jest.fn();
            botApp.registerGesture(data, callback);
            expect(JSBridge.callHandler).toHaveBeenCalledWith('triggerDuerOSCapacity', JSON.stringify({
                "capacityName": "AI_DUER_SHOW_GESTURE_REGISTER",
                "params": {"enabledGestures": data}
            }), expect.any(Function));
        });

        test('getCameraState', (done) => {
            const transData = JSON.stringify({
                capacityName: 'AI_DUER_SHOW_GET_CAMERA_STATE',
                params: null
            })
            const response = JSON.stringify({
                customData: 'ENABLED',
                intent: {
                    name: 'com.baidu.duer.cameraStateChanged'
                }
            });
            let counter = 0;
            const JSBridge = JSBridgeFactor({
                callHandler: jest.fn((name, payload, cb) => {
                    name === 'triggerDuerOSCapacity' && setTimeout(() => {
                        cb();
                        counter++;
                        if (counter === 2) {
                            done();
                        }
                    });
                }),
                registerHandler: jest.fn((name, cb) => {
                    name === 'onHandleIntent' && setTimeout(() => {
                        cb(response, () => {});
                        expect(callback).toHaveBeenCalledWith(null, JSON.parse(response).customData)
                        counter++;
                        if (counter === 2) {
                            done();
                        }
                    })
                })
            });
            const botApp = botAppFactor(JSBridge);
            const callback = jest.fn();
            botApp.getCameraState(callback);
            expect(JSBridge.callHandler).toHaveBeenCalledWith('triggerDuerOSCapacity', transData, expect.any(Function));
        });
    });
});

