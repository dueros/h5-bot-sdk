/**
 * @file  BotApp单测
 * @author dengxuening<dengxuening@baidu.com>
 */

import { LowVersionErrorMsg } from '../src/errors';
import { JSBridgeFactor, botAppRegisterInfo, botAppFactor } from './utils';

Object.defineProperty(navigator, 'userAgent', {
    writable: true,
    value: 'Mozilla/5.0 (Linux; Android  NV6001 Build/1.40.0.0; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/58.0.3029.125 Safari/537.36 DuerOS/Xiaodu;',
});

describe('测试SHOW端BotApp功能', () => {
    describe('初始化：new BotApp', () => {
        // TODO('测试初始化时会被调用的其它函数')
        test('BotApp初始化调用js-bridge', () => {
            const JSBridge = JSBridgeFactor();
            const botApp = botAppFactor(JSBridge);
            expect(JSBridge.init).toHaveBeenCalled();
            const { skillID, ...nativeRegisterInfo } =
                JSON.parse(botAppRegisterInfo);
            expect(JSBridge.callHandler).toHaveBeenCalledWith(
                'register',
                JSON.stringify(nativeRegisterInfo),
                expect.any(Function)
            );
        });
    });

    describe('普通API调用', () => {
        beforeEach(() => {
            Object.defineProperty(navigator, 'userAgent', {
                writable: true,
                value: 'Mozilla/5.0 (Linux; Android 8.1.0; NV6001 Build/O11019; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/58.0.3029.125 Mobile Safari/537.36 ContainerVersion/1.45.0.0 (Android) DuerOS/Xiaodu;',
            });
        });

        test('requireLinkAccount', () => {
            const JSBridge = JSBridgeFactor();
            const botApp = botAppFactor(JSBridge);
            botApp.requireLinkAccount();
            expect(JSBridge.callHandler).toHaveBeenCalledWith(
                'requireLinkAccount'
            );
        });

        test('onLinkAccountSuccess', (done) => {
            const transData = JSON.stringify({
                app: {
                    accessToken:
                        '21.15a2c2cd345816f2e51f9eae6e3d1f03.2592000.1566035530.2050908969-9943593',
                },
            });
            const callback = jest.fn();
            const JSBridge = JSBridgeFactor({
                registerHandler: jest.fn((name, cb) => {
                    name === 'onLinkAccountSuccess' &&
                        setTimeout(() => {
                            cb(transData, () => {});
                            expect(callback).toHaveBeenCalledWith(
                                JSON.parse(transData)
                            );
                            done();
                        }, 0);
                }),
            });
            const botApp = botAppFactor(JSBridge);
            botApp.onLinkAccountSuccess(callback);
            expect(JSBridge.registerHandler).toHaveBeenCalledWith(
                'onLinkAccountSuccess',
                expect.any(Function)
            );
        });

        test('getRegisterResult', (done) => {
            const transData = JSON.stringify({
                apiAccessToken: 'DuerOS',
            });
            const callback = jest.fn();
            const JSBridge = JSBridgeFactor({
                callHandler: jest.fn((name, data, cb) => {
                    name === 'register' &&
                        setTimeout(() => {
                            cb(transData, () => {});
                            expect(callback).toHaveBeenCalledWith(
                                JSON.parse(transData)
                            );
                            done();
                        }, 0);
                }),
            });
            const botApp = botAppFactor(JSBridge);
            botApp.getRegisterResult(callback);
            expect(JSBridge.callHandler).toHaveBeenCalledWith(
                'register',
                expect.any(String),
                expect.any(Function)
            );
        });

        test('requireUserAgeInfo: 已经实名认证', (done) => {
            const response = JSON.stringify({
                status: 0,
                msg: 'success',
                data: {
                    is_auth: '1',
                    age_group: '2',
                },
            });
            const callback = jest.fn();
            const JSBridge = JSBridgeFactor({
                callHandler: jest.fn((name, data, cb) => {
                    name === 'requestUserAgeInfo' &&
                        setTimeout(() => {
                            cb(response);
                            expect(callback).toHaveBeenCalledWith(
                                null,
                                JSON.parse(response).data
                            );
                            done();
                        }, 0);
                }),
            });
            const botApp = botAppFactor(JSBridge);
            botApp.requireUserAgeInfo(callback);
            expect(JSBridge.callHandler).toHaveBeenCalledWith(
                'requestUserAgeInfo',
                null,
                expect.any(Function)
            );
        });

        test('requireUserAgeInfo: 未进行实名认证', (done) => {
            const transData = JSON.stringify({
                status: 0,
                msg: 'success',
                data: {
                    is_auth: '0',
                    age_group: '2',
                },
            });
            const callback = jest.fn();
            const JSBridge = JSBridgeFactor({
                callHandler: jest.fn((name, data, cb) => {
                    name === 'requestUserAgeInfo' &&
                        setTimeout(() => {
                            cb(transData);
                            const link = `dueros://${botApp.config.skillID}/certification?action=realName`;
                            // 未实名认证的用户需要发送LinkClicked请求实名认证
                            expect(
                                botApp.uploadLinkClicked
                            ).toHaveBeenCalledWith({
                                url: link,
                                initiator: {
                                    type: 'AUTO_TRIGGER',
                                },
                            });
                            expect(callback).toHaveBeenCalledWith(
                                null,
                                JSON.parse(transData).data
                            );
                            done();
                        }, 0);
                }),
            });
            const botApp = botAppFactor(JSBridge);
            botApp.uploadLinkClicked = jest.fn();
            botApp.requireUserAgeInfo(callback);
            expect(JSBridge.callHandler).toHaveBeenCalledWith(
                'requestUserAgeInfo',
                null,
                expect.any(Function)
            );
        });

        test('requireCharge', () => {
            const JSBridge = JSBridgeFactor();
            const botApp = botAppFactor(JSBridge);
            const transData = JSON.stringify({
                chargeBaiduPay: {
                    authorizeAttributes: {
                        authorizationAmount: {
                            amount: '1.09',
                            currencyCode: 'CNY',
                        },
                        sellerAuthorizationNote: '双11大促',
                    },
                    sellerOrderAttributes: {
                        sellerOrderId: 'hfuawffu2jkjk12e23',
                        productName: 'Mac Book Pro 2019',
                        productId: 'fjaksdfkvjsznvj',
                        description: '笔记本电脑',
                        sellerNote: '大促销',
                    },
                },
            });
            botApp.requireCharge(JSON.parse(transData));
            expect(JSBridge.callHandler).toHaveBeenCalledWith(
                'requireCharge',
                transData
            );
        });

        test('onChargeStatusChange', (done) => {
            const transData = JSON.stringify({
                token: 'faskdfkasdfsnvcknawjkenfjkwa',
                authorizationDetails: {
                    authorizationAmount: {
                        amount: '1.99',
                        currencyCode: 'CNY',
                    },
                    capturedAmount: {
                        amount: '1.09',
                        currencyCode: 'CNY',
                    },
                    creationTimestamp: '1546272000000',
                },
                baiduOrderReferenceId: 'fjkasdfekfjsnvks',
                sellerOrderId: 'fskdfjmvckadfl',
                purchaseResult: 'SUCCESS',
                message: '支付成功',
            });
            const callback = jest.fn();
            const JSBridge = JSBridgeFactor({
                registerHandler: jest.fn((name, cb) => {
                    name === 'onChargeStatusChange' &&
                        setTimeout(() => {
                            cb(transData, () => {});
                            expect(callback).toHaveBeenCalledWith(
                                JSON.parse(transData)
                            );
                            done();
                        }, 0);
                }),
            });
            const botApp = botAppFactor(JSBridge);
            botApp.onChargeStatusChange(callback);
            expect(JSBridge.registerHandler).toHaveBeenCalledWith(
                'onChargeStatusChange',
                expect.any(Function)
            );
        });

        test('listen', () => {
            const JSBridge = JSBridgeFactor();
            const botApp = botAppFactor(JSBridge);
            botApp.listen();
            expect(JSBridge.callHandler).toHaveBeenCalledWith(
                'listen',
                expect.any(Function)
            );
        });

        test('speak', () => {
            const JSBridge = JSBridgeFactor();
            const botApp = botAppFactor(JSBridge);
            const data = '风清气正才能赢';
            botApp.speak(data);
            expect(JSBridge.callHandler).toHaveBeenCalledWith(
                'speak',
                data,
                expect.any(Function)
            );
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
                        params: {},
                    },
                ],
            });
            botApp.updateUiContext(JSON.parse(transData));
            expect(JSBridge.callHandler).toHaveBeenCalledWith(
                'updateUiContext',
                transData,
                expect.any(Function)
            );
        });

        test('uploadLinkClicked', () => {
            const transData = JSON.stringify({
                url: 'dueros://d7a12baa-47d5-437f-7af6-05bc9c4e5c28/?openbot=true&oss_channel=ls_m',
            });
            const JSBridge = JSBridgeFactor();
            const botApp = botAppFactor(JSBridge);
            botApp.uploadLinkClicked(JSON.parse(transData));
            expect(JSBridge.callHandler).toHaveBeenCalledWith(
                'uploadLinkClicked',
                transData
            );
        });

        test('onHandleScreenNavigatorEvent', (done) => {
            const transData = JSON.stringify({
                data: 1,
            });
            const callback = jest.fn();
            const JSBridge = JSBridgeFactor({
                registerHandler: jest.fn((name, cb) => {
                    name === 'onHandleScreenNavigatorEvent' &&
                        setTimeout(() => {
                            cb(transData, () => {});
                            expect(callback).toHaveBeenCalledWith(
                                JSON.parse(transData)
                            );
                            done();
                        }, 0);
                }),
            });
            const botApp = botAppFactor(JSBridge);
            botApp.onHandleScreenNavigatorEvent(callback);
            expect(JSBridge.registerHandler).toHaveBeenCalledWith(
                'onHandleScreenNavigatorEvent',
                expect.any(Function)
            );
        });

        test('requireShipping', () => {
            const JSBridge = JSBridgeFactor();
            const botApp = botAppFactor(JSBridge);
            botApp.uploadLinkClicked = jest.fn();
            botApp.requireShipping();
            expect(botApp.uploadLinkClicked).toHaveBeenCalledWith({
                url: `dueros://${botApp.config.skillID}/readyForShipping`,
                initiator: {
                    type: 'AUTO_TRIGGER',
                },
            });
        });

        test('onDialogStateChanged', (done) => {
            const callback = jest.fn();
            const JSBridge = JSBridgeFactor({
                registerHandler: jest.fn((name, cb) => {
                    name === 'onDialogStateChanged' &&
                        setTimeout(() => {
                            cb(
                                JSON.stringify({
                                    data: 'LISTENING',
                                }),
                                () => {}
                            );
                            expect(callback).toHaveBeenCalledWith(
                                null,
                                'LISTENING'
                            );
                            done();
                        }, 0);
                }),
            });
            const botApp = botAppFactor(JSBridge);
            botApp.onDialogStateChanged(callback);
            expect(JSBridge.registerHandler).toHaveBeenCalledWith(
                'onDialogStateChanged',
                expect.any(Function)
            );
        });

        test('canGoBack', (done) => {
            const JSBridge = JSBridgeFactor({
                callHandler: jest.fn((name, data, cb) => {
                    name === 'canGoBack' &&
                        setTimeout(() => {
                            cb(
                                JSON.stringify({
                                    data: true,
                                })
                            );
                            expect(callback).toHaveBeenCalledWith(null, true);
                            done();
                        }, 0);
                }),
            });
            const botApp = botAppFactor(JSBridge);
            const callback = jest.fn();
            botApp.canGoBack(callback);
            expect(JSBridge.callHandler).toHaveBeenCalledWith(
                'canGoBack',
                null,
                expect.any(Function)
            );
        });

        test('interruptTTS', () => {
            const JSBridge = JSBridgeFactor();
            const botApp = botAppFactor(JSBridge);
            botApp.interruptTTS();
            expect(JSBridge.callHandler).toHaveBeenCalledWith(
                'triggerDuerOSCapacity',
                JSON.stringify({
                    capacityName: 'AI_DUER_SHOW_INTERRPT_TTS',
                    params: null,
                }),
                expect.any(Function)
            );
        });

        test('sendEvent', () => {
            const JSBridge = JSBridgeFactor();
            const botApp = botAppFactor(JSBridge);
            const transData = JSON.stringify({
                namespace: 'ai.dueros.device_interface.bot_app_sdk',
                name: 'TouchedDown',
                needDialogRequestId: false,
                payload: {
                    position: {
                        left: '20px',
                        top: '40px',
                    },
                },
            });
            botApp.sendEvent(JSON.parse(transData));
            expect(JSBridge.callHandler).toHaveBeenCalledWith(
                'sendEvent',
                transData,
                expect.any(Function)
            );
        });

        test('onHandleIntent', (done) => {
            const transData = JSON.stringify({
                intent: {
                    name: 'test_intent',
                },
                customData: JSON.stringify({ data: Date.now() }),
            });
            const callback = jest.fn();
            const JSBridge = JSBridgeFactor({
                registerHandler: jest.fn((name, cb) => {
                    name === 'onHandleIntent' &&
                        setTimeout(() => {
                            cb(transData, () => {});
                            expect(callback).toHaveBeenCalledWith(
                                JSON.parse(transData)
                            );
                            done();
                        });
                }),
            });
            const botApp = botAppFactor(JSBridge);
            expect(JSBridge.registerHandler).toHaveBeenCalledWith(
                'onHandleIntent',
                expect.any(Function)
            );
            botApp.onHandleIntent(callback);
        });

        test('onClickLink', (done) => {
            const transData = JSON.stringify({
                url: '1',
                params: {
                    name: 'DuerOS',
                },
            });
            const callback = jest.fn();
            const JSBridge = JSBridgeFactor({
                registerHandler: jest.fn((name, cb) => {
                    name === 'onClickLink' &&
                        setTimeout(() => {
                            cb(transData, () => {});
                            expect(callback).toHaveBeenCalledWith(
                                JSON.parse(transData)
                            );
                            done();
                        });
                }),
            });
            const botApp = botAppFactor(JSBridge);
            expect(JSBridge.registerHandler).toHaveBeenCalledWith(
                'onClickLink',
                expect.any(Function)
            );
            botApp.onClickLink(callback);
        });
        //照着这个写
        test('onHandleUnknowUtterance', (done) => {
            const transParams = JSON.stringify({
                os: 'DuerOS',
            });
            const transData = JSON.stringify({
                url: 'http://sdk.bot.dueros.ai?action=unknown_utterance',
                params: transParams,
            });
            const JSBridge = JSBridgeFactor({
                registerHandler: jest.fn((name, cb) => {
                    name === 'onClickLink' &&
                        setTimeout(() => {
                            cb(transData, () => {});
                            expect(callback).toHaveBeenCalledWith(
                                null,
                                JSON.parse(transParams)
                            );
                            done();
                        });
                }),
            });
            const botApp = botAppFactor(JSBridge);
            const callback = jest.fn();
            botApp.onHandleUnknowUtterance(callback);
        });

        test('registerGesture: 注册成功', (done) => {
            const data = [
                'GESTURE_OK',
                'GESTURE_PALM',
                'GESTURE_LEFT',
                'GESTURE_RIGHT',
            ];
            const transData = JSON.stringify({
                capacityName: 'AI_DUER_SHOW_GESTURE_REGISTER',
                params: {
                    enabledGestures: data,
                },
            });
            const response = JSON.stringify({
                intent: {
                    name: 'AI_DUER_SHOW_GESTURE_RECOGNIZED',
                    slots: [
                        {
                            name: 'recognizedGestureName',
                            value: 'OK',
                        },
                    ],
                },
            });
            let counter = 0; // 因为要执行两个异步函数
            const JSBridge = JSBridgeFactor({
                callHandler: jest.fn((name, payload, cb) => {
                    name === 'triggerDuerOSCapacity' &&
                        setTimeout(() => {
                            cb(transData);
                            counter++;
                            if (counter === 2) {
                                done();
                            }
                        }, 0);
                }),
                registerHandler: jest.fn((name, cb) => {
                    name === 'onHandleIntent' &&
                        setTimeout(() => {
                            cb(response, () => {});
                            expect(callback).toHaveBeenCalledWith(null, 'OK');
                            counter++;
                            if (counter === 2) {
                                done();
                            }
                        });
                }),
            });
            const botApp = botAppFactor(JSBridge);
            const callback = jest.fn();
            botApp.registerGesture(data, callback);
            expect(JSBridge.callHandler).toHaveBeenCalledWith(
                'triggerDuerOSCapacity',
                JSON.stringify({
                    capacityName: 'AI_DUER_SHOW_GESTURE_REGISTER',
                    params: { enabledGestures: data },
                }),
                expect.any(Function)
            );
        });

        test('registerGesture: 注册失败', (done) => {
            const data = [
                'GESTURE_OK',
                'GESTURE_PALM',
                'GESTURE_LEFT',
                'GESTURE_RIGHT',
            ];
            const transData = JSON.stringify({
                capacityName: 'AI_DUER_SHOW_GESTURE_REGISTER',
                params: {
                    enabledGestures: data,
                },
            });
            const response = JSON.stringify({
                intent: {
                    name: 'AI_DUER_SHOW_GESTURE_RECOGNIZED',
                    slots: null,
                },
            });
            let counter = 0; // 因为要执行两个异步函数
            const JSBridge = JSBridgeFactor({
                callHandler: jest.fn((name, payload, cb) => {
                    name === 'triggerDuerOSCapacity' &&
                        setTimeout(() => {
                            cb(transData);
                            counter++;
                            if (counter === 2) {
                                done();
                            }
                        }, 0);
                }),
                registerHandler: jest.fn((name, cb) => {
                    name === 'onHandleIntent' &&
                        setTimeout(() => {
                            cb(response, () => {});
                            expect(callback).toHaveBeenCalledWith(
                                expect.any(String),
                                null
                            );
                            counter++;
                            if (counter === 2) {
                                done();
                            }
                        });
                }),
            });
            const botApp = botAppFactor(JSBridge);
            const callback = jest.fn();
            botApp.registerGesture(data, callback);
            expect(JSBridge.callHandler).toHaveBeenCalledWith(
                'triggerDuerOSCapacity',
                JSON.stringify({
                    capacityName: 'AI_DUER_SHOW_GESTURE_REGISTER',
                    params: { enabledGestures: data },
                }),
                expect.any(Function)
            );
        });

        test('getCameraState', (done) => {
            const transData = JSON.stringify({
                capacityName: 'AI_DUER_SHOW_GET_CAMERA_STATE',
                params: null,
            });
            const response = JSON.stringify({
                customData: 'ENABLED',
                intent: {
                    name: 'com.baidu.duer.cameraStateChanged',
                },
            });
            let counter = 0;
            const JSBridge = JSBridgeFactor({
                callHandler: jest.fn((name, payload, cb) => {
                    name === 'triggerDuerOSCapacity' &&
                        setTimeout(() => {
                            cb();
                            counter++;
                            if (counter === 2) {
                                done();
                            }
                        });
                }),
                registerHandler: jest.fn((name, cb) => {
                    name === 'onHandleIntent' &&
                        setTimeout(() => {
                            cb(response, () => {});
                            expect(callback).toHaveBeenCalledWith(
                                null,
                                JSON.parse(response).customData
                            );
                            counter++;
                            if (counter === 2) {
                                done();
                            }
                        });
                }),
            });
            const botApp = botAppFactor(JSBridge);
            const callback = jest.fn();
            botApp.getCameraState(callback);
            expect(JSBridge.callHandler).toHaveBeenCalledWith(
                'triggerDuerOSCapacity',
                transData,
                expect.any(Function)
            );
        });

        test('parseShowVersion', () => {
            const JSBridge = JSBridgeFactor();
            const botApp = botAppFactor(JSBridge);
            expect(
                botApp._parseShowVersion.call(
                    Object.create(null),
                    'Mozilla/5.0 (Linux; Android  NV6001 Build/1.40.0.0; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/58.0.3029.125 Safari/537.36 DuerOS/Xiaodu;'
                )
            ).toBe('1.40.0.0');
        });

        test('execLinkClick', () => {
            const JSBridge = JSBridgeFactor();
            const botApp = botAppFactor(JSBridge);
            botApp.uploadLinkClicked = jest.fn();
            botApp.execLinkClick(['url1', 'url2']);
            expect(botApp.uploadLinkClicked.mock.calls.length).toBe(2);
            expect(botApp.uploadLinkClicked).toHaveBeenCalledWith('url1');
            expect(botApp.uploadLinkClicked).toHaveBeenCalledWith('url2');

            botApp.uploadLinkClicked = jest.fn();
            botApp.execLinkClick('url3');
            expect(botApp.uploadLinkClicked.mock.calls.length).toBe(1);
            expect(botApp.uploadLinkClicked).toHaveBeenCalledWith('url3');
        });

        test("onHandleP1SpeechResult: 版本过低", () => {
            Object.defineProperty(navigator, "userAgent", {
                writable: true,
                value: "Mozilla/5.0 (Linux; Android  NV6001 Build/1.44.0.0; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/58.0.3029.125 Safari/537.36 DuerOS/Xiaodu;",
            });
            const JSBridge = JSBridgeFactor();
            const botApp = botAppFactor(JSBridge);
            botApp.onHandleP1SpeechResult(jest.fn());
            expect(JSBridge.callHandler).not.toHaveBeenCalledWith(
                "initSpeechTranscriber",
                JSON.stringify({ level: 1 })
            );
            expect(JSBridge.callHandler).not.toHaveBeenCalledWith(
                "startSpeechTranscriber",
                null,
                expect.any(Function)
            );
        });

        test('onHandleP1SpeechResult: 通过JSBridge调用', () => {
            Object.defineProperty(navigator, 'userAgent', {
                writable: true,
                value: 'Mozilla/5.0 (Linux; Android  NV6001 Build/1.45.0.0; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/58.0.3029.125 Safari/537.36 DuerOS/Xiaodu;',
            });
            const JSBridge = JSBridgeFactor();
            const botApp = botAppFactor(JSBridge);
            botApp.onHandleP1SpeechResult(jest.fn());
            expect(JSBridge.callHandler).toHaveBeenCalledWith(
                'initSpeechTranscriber',
                JSON.stringify({ level: 1 })
            );
            expect(JSBridge.callHandler).toHaveBeenCalledWith(
                'startSpeechTranscriber',
                null,
                expect.any(Function)
            );
            expect(JSBridge.registerHandler).toHaveBeenCalledWith(
                'onHandleP1SpeechResult',
                expect.any(Function)
            );
        });

        test('onHandleP1SpeechResult: 通过window对象直接调用', () => {
            Object.defineProperty(navigator, 'userAgent', {
                writable: true,
                value: 'Mozilla/5.0 (Linux; Android  NV6001 Build/1.45.0.1; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/58.0.3029.125 Safari/537.36 DuerOS/Xiaodu;',
            });
            const JSBridge = JSBridgeFactor();
            const botApp = botAppFactor(JSBridge);
            botApp.onHandleP1SpeechResult(jest.fn());
            expect(JSBridge.callHandler).toHaveBeenCalledWith(
                'initSpeechTranscriber',
                JSON.stringify({ level: 1 })
            );
            expect(JSBridge.callHandler).toHaveBeenCalledWith(
                'startSpeechTranscriber',
                null,
                expect.any(Function)
            );
            expect(typeof window.zw3me3p9zqby80uo_onHandleP1SpeechResult).toBe(
                'function'
            );
        });

        test('onBuyStatusChange: 正常运行', (done) => {
            Object.defineProperty(navigator, 'userAgent', {
                writable: true,
                value: 'Mozilla/5.0 (Linux; Android 8.1.0; NV6001 Build/O11019; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/58.0.3029.125 Mobile Safari/537.36 ContainerVersion/1.45.0.0 (Android) DuerOS/Xiaodu;',
            });
            const response = JSON.stringify({
                productId: '{{STRING}}',
                baiduOrderReferenceId: '{{STRING}}',
                sellerOrderId: '{{STRING}}',
                purchaseResult: '{{ENUM}}',
                message: 'SUCCESS', //  - SUCCESS 支付成功,- ERROR 支付发生错误
            });
            const JSBridge = JSBridgeFactor({
                registerHandler: jest.fn((name, cb) => {
                    name === 'onBuyStatusChange' &&
                        setTimeout(() => {
                            cb(response, () => {});
                            expect(callback).toHaveBeenCalledWith(
                                null,
                                JSON.parse(response)
                            );
                            done();
                        }, 0);
                }),
            });
            const botApp = botAppFactor(JSBridge);
            const callback = jest.fn();
            botApp.onBuyStatusChange(callback);
        });

        test('onBuyStatusChange: 设备版本过低', () => {
            Object.defineProperty(navigator, 'userAgent', {
                writable: true,
                value: 'Mozilla/5.0 (Linux; Android 8.1.0; NV6001 Build/O11019; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/58.0.3029.125 Mobile Safari/537.36 ContainerVersion/1.44.0.0 (Android) DuerOS/Xiaodu;',
            });
            const JSBridge = JSBridgeFactor();
            const botApp = botAppFactor(JSBridge);
            const callback = jest.fn();
            botApp.onBuyStatusChange(callback);
            expect(callback).toHaveBeenCalledWith(
                expect.any(LowVersionErrorMsg),
                null
            );
        });

        test('uploadBase64Image：正常运行', (done) => {
            Object.defineProperty(navigator, 'userAgent', {
                writable: true,
                value: 'Mozilla/5.0 (Linux; Android 8.1.0; NV6001 Build/O11019; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/58.0.3029.125 Mobile Safari/537.36 ContainerVersion/1.48.0.0 (Android) DuerOS/Xiaodu;',
            });
            const response = {
                status: '0',
            };
            const JSBridge = JSBridgeFactor({
                callHandler: jest.fn((name, data, cb) => {
                    name === 'uploadImage' &&
                        setTimeout(() => {
                            cb(null, response);
                            done();
                        });
                }),
            });
            const botApp = botAppFactor(JSBridge);
            const callback = jest.fn();
            botApp.uploadBase64Image(
                'data:image/png;base64,iVBORw0KGgoAAAANSUhE',
                callback
            );
            expect(JSBridge.callHandler).toHaveBeenCalledWith(
                'uploadImage',
                'iVBORw0KGgoAAAANSUhE',
                expect.any(Function)
            );
        });

        test('uploadBase64Image: 设备版本过低', () => {
            Object.defineProperty(navigator, 'userAgent', {
                writable: true,
                value: 'Mozilla/5.0 (Linux; Android 8.1.0; NV6001 Build/O11019; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/58.0.3029.125 Mobile Safari/537.36 ContainerVersion/1.47.0.0 (Android) DuerOS/Xiaodu;',
            });
            const JSBridge = JSBridgeFactor();
            const botApp = botAppFactor(JSBridge);
            const callback = jest.fn();
            botApp.uploadBase64Image(
                'data:image/png;base64,iVBORw0KGgoAAAANSUhE',
                callback
            );
            expect(callback).toHaveBeenCalledWith(
                expect.any(LowVersionErrorMsg),
                null
            );
        });

        test('exitRoom: 正常运行', () => {
            Object.defineProperty(navigator, 'userAgent', {
                writable: true,
                value: 'Mozilla/5.0 (Linux; Android 8.1.0; NV6001 Build/O11019; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/58.0.3029.125 Mobile Safari/537.36 ContainerVersion/1.56.0.0 (Android) DuerOS/Xiaodu;',
            });
            const JSBridge = JSBridgeFactor();
            const botApp = botAppFactor(JSBridge);
            botApp.exitRoom();
            expect(JSBridge.callHandler).toHaveBeenCalledWith(
                'exitRoom',
                null,
                expect.any(Function)
            );
        });
    });

    test('getUserInfo: 正常运行', (done) => {
        const response = JSON.stringify({
            intent: {
                name: 'dueros.avc.user_info',
                slots: [
                    {
                        name: 'userId',
                        value: '2506829803',
                    },
                    {
                        name: 'userName',
                        value: '186*****505',
                    },
                    {
                        name: 'avatar',
                        value: 'http://nemoapi.zaijia.com/profile/picture2?k=18946961-f237c568-5cf7-4d7b-995c-fc83b276ab21-1583379570809',
                    },
                ],

            },
            //  - SUCCESS 支付成功,- ERROR 支付发生错误
        });
        const userInfo={'userId': '2506829803', 
        'userName': '186*****505', 
        'avatar': 'http://nemoapi.zaijia.com/profile/picture2?k=18946961-f237c568-5cf7-4d7b-995c-fc83b276ab21-1583379570809'}
        const JSBridge = JSBridgeFactor({
            registerHandler: jest.fn((name, cb) => {
                name === 'onHandleIntent' &&
                    setTimeout(() => {
                        cb(response, () => {});
                        expect(callback).toHaveBeenCalledWith(
                            userInfo
                        );

                        done();
                    });
            }),
        });
        const botApp = botAppFactor(JSBridge);
        const callback = jest.fn();
        botApp.getUserInfo(callback);
    });

    test(' submitRankScore: 正常运行', (done) => {
        const response = JSON.stringify({
            intent: {
                name: 'H5GameRanking',
                slots: [
                    {
                        name: 'method',
                        value: 'submitScore',
                    },
                ],
            },
            customData:JSON.stringify({
                status: 0,
                msg: 'success',
                data: {
                    score: 20, // 提交之后当前用户分值
                    rank: 100, // 提交之后当前用户排名， -1为未进入排行榜（排行榜只统计前500名）
                },
            })
            //  - SUCCESS 支付成功,- ERROR 支付发生错误
        });
        const JSBridge = JSBridgeFactor({
            registerHandler: jest.fn((name, cb) => {
                name === 'onHandleIntent' &&
                    setTimeout(() => {
                        cb(response, () => {});
                        expect(callback).toHaveBeenCalledWith(
                            JSON.parse(JSON.parse(response).customData)
                        );
                        done();
                    });
            }),
        });
        const botApp = botAppFactor(JSBridge);
        const callback = jest.fn();
        botApp.submitRankScore('20', callback);
    });
    test(' getRankList: 正常运行', (done) => {
        const response = JSON.stringify({
            intent: {
                name: 'H5GameRanking',
                slots: [
                    {
                        name: 'method',
                        value: 'getRankList',
                    },
                ],
            },
            customData: JSON.stringify({
                status: 0,
                msg: 'success',
                data: {
                    currentPage: 0, // 当前页码，从0开始
                    totalPage: 50, // 总页数
                    hasNext: true, // 是否还有下一页
                    ranklist: [
                        {
                            userId: 1234567, // 用户id
                            userName: '昵称', // 用户昵称
                            userAvatar: '', // 用户头像
                            rank: 1, // 当前的排名 -1为未进入排行榜（排行榜只统计前500名）
                            score: 100, // 当前用户的分数
                        },
                    ],
                },
            })
            //  - SUCCESS 支付成功,- ERROR 支付发生错误
        });
        const list = {
            page: '0',
            pageSize: '20',
        };
        const JSBridge = JSBridgeFactor({
            registerHandler: jest.fn((name, cb) => {
                name === 'onHandleIntent' &&
                    setTimeout(() => {
                        cb(response, () => {});
                        const  testData = 
                        console.log(testData)
                        expect(callback).toHaveBeenCalledWith(
                            JSON.parse(JSON.parse(response).customData));
                        done();
                    });
            }),
        });
        const botApp = botAppFactor(JSBridge);
        const callback = jest.fn();
        botApp.getRanking(list, callback);
    });

    test(' getMyRanking: 正常运行', (done) => {
        const response = JSON.stringify({
            intent: {
                name: 'H5GameRanking',
                slots: [
                    {
                        name: 'method',
                        value: 'getMyRanking',
                    },
                ],
            },
            customData: JSON.stringify({
                status: 0,
                msg: 'success',
                data: {
                    userId: 1234567, // 用户编号
                    userName: '用户昵称', // 用户昵称
                    rank: 1, // 当前的排名 -1为未进入排行榜（排行榜只统计前500名）
                    score: 100, //当前用户分值
                },
            }),
            //  - SUCCESS 支付成功,- ERROR 支付发生错误
        });

        const JSBridge = JSBridgeFactor({
            registerHandler: jest.fn((name, cb) => {
                name === 'onHandleIntent' &&
                    setTimeout(() => {
                        cb(response, () => {});
                        expect(callback).toHaveBeenCalledWith(
                            JSON.parse(JSON.parse(response).customData)
                        );
                        done();
                    });
            }),
        });
        const botApp = botAppFactor(JSBridge);
        const callback = jest.fn();
        botApp.getMyRanking(callback);
    });

   
    test('getSetProgress: 正常运行', (done) => {
        const response = JSON.stringify({
            intent: {
                name: 'H5GameRanking',
                slots: [
                    {
                        name: 'method',
                        value: 'setProgress',
                    },
                ],
            },
            customData: JSON.stringify({
                status: 0,
                msg: 'success',
                data: {
                    levelPassed: [
                        //通过的关卡
                        '111',
                    ],
                },
            })
            //  - SUCCESS 支付成功,- ERROR 支付发生错误
        });

        const JSBridge = JSBridgeFactor({
            registerHandler: jest.fn((name, cb) => {
                name === 'onHandleIntent' &&
                    setTimeout(() => {
                        cb(response, () => {});
                        expect(callback).toHaveBeenCalledWith(
                            JSON.parse(JSON.parse(response).customData)
                        );
                        done();
                    });
            }),
        });
        const botApp = botAppFactor(JSBridge);
        const callback = jest.fn();
        botApp.getSetProgress('2',callback);
    });
});
