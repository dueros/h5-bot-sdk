/**
 * @file  BotApp单测
 * @author dengxuening<dengxuening@baidu.com>
 */

import BotApp from '../src/main';

Object.defineProperty(navigator, 'userAgent', {
    writable: true,
    value: 'Mozilla/5.0 (Linux; Android  NV6001 Build/1.40.0.0; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/58.0.3029.125 Safari/537.36 DuerOS/Xiaodu;'
});

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
            /* eslint-disable no-new */
            new BotApp(data);
            /* eslint-enable no-new */
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
        let data, botApp;
        beforeAll(() => {
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
            botApp = new BotApp(data);
        });


        beforeEach(() => {
            window.WebViewJavascriptBridge = {
                init: () => {},
                callHandler: () => {},
                registerHandler: () => {},
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
            expect(botApp._parseShowVersion()).toBe('1.40.0.0');
        });

        test('_parseVersionNumber', () => {
            expect(botApp._parseVersionNumber('Mozilla/5.0 (Linux; Android 8.1.0; NV6001 Build/O11019; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/58.0.3029.125 Mobile Safari/537.36 ContainerVersion/1.40.0.0 (Android) DuerOS/Xiaodu;')).toBe('1.40.0.0');
            expect(botApp._parseVersionNumber('Mozilla/5.0 (Linux; Android  NV6001 Build/1.36.0.0; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/58.0.3029.125 Safari/537.36 DuerOS/Xiaodu;')).toBe('1.36.0.0');
        });

        test('_compareShowVersion', () => {
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
            window.WebViewJavascriptBridge.callHandler = jest.fn();
            botApp.interruptTTS();
            expect(window.WebViewJavascriptBridge.callHandler).toHaveBeenCalledWith('triggerDuerOSCapacity', JSON.stringify({
                capacityName: 'AI_DUER_SHOW_INTERRPT_TTS',
                params: null
            }), expect.any(Function));
        });

        test('getCameraState', (done) => {
            const callback = jest.fn();
            window.WebViewJavascriptBridge.callHandler = jest.fn((name, data, cb) => {
                setTimeout(() => {
                    cb('ENABLED');
                    expect(callback).toHaveBeenCalledWith(null, 'ENABLED');
                    done();
                });
            });
            botApp.getCameraState(callback);
            expect(window.WebViewJavascriptBridge.callHandler).toHaveBeenCalledWith('triggerDuerOSCapacity', JSON.stringify({
                capacityName: 'AI_DUER_SHOW_GET_CAMERA_STATE',
                params: null
            }), expect.any(Function));
        });
        test('sendEvent', () => {
            const data = {
                namespace: "ai.dueros.device_interface.bot_app_sdk",
                name: "TouchedDown",
                needDialogRequestId: false,
                payload: {
                    position : {
                        left: '20px',
                        top: '40px',
                    }
                }
            };
            window.WebViewJavascriptBridge.callHandler = jest.fn();
            botApp.sendEvent(data);
            expect(window.WebViewJavascriptBridge.callHandler).toHaveBeenCalledWith('sendEvent', JSON.stringify(data), expect.any(Function));
        });

    });

    describe('实例化阶段被调用的API', () => {
        let data, botApp;
        const mockRegisterOnHandleIntent = jest.fn();
        const mockRegisterOnClickLink = jest.fn();
        const mockCallUploadLinkClickedHandler = jest.fn();

        // 测试广告间隔
        const mockAdFirstShowInterval = jest.fn();

        const mockRegisterGestureHandler = jest.fn();

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
        beforeAll(() => {
            window.WebViewJavascriptBridge = {
                init: () => {},
                callHandler: (name, data, cb) => {
                    if (name === 'uploadLinkClicked') {
                        mockCallUploadLinkClickedHandler(name, data);
                        mockCallUploadLinkClickedHandler.__doneCb();

                        let parsedData = JSON.parse(data);
                        if (parsedData.url.indexOf('dueros://f34646bc-37b4-a9db-361f-48fe7ca8831d/getAdResources') === 0 && window.WebViewJavascriptBridge._onHandleIntent) {
                            setTimeout(() => {
                                mockAdFirstShowInterval();
                                mockAdFirstShowInterval.__doneCb();
                                window.WebViewJavascriptBridge._onHandleIntent(JSON.stringify({
                                    "intent": {
                                        "name": "RenderAdvertisement"
                                    },
                                    "customData": JSON.stringify({
                                        "jsonData": "{\"status\":0,\"materials\":[{\"type\":\"IMAGE_LEFT\",\"assets\":{\"image\":{\"url\":\"https:\\\/\\\/lupic.cdn.bcebos.com\\\/20191130\\\/8021544%2320.jpg\"},\"title\":\"别家宴会厅这么有档次，原来是用的全息投影\",\"content\":\"\"},\"monitors\":{\"exposure\":[\"dueros:\\\/\\\/f34646bc-37b4-a9db-361f-48fe7ca8831d\\\/eventHandle?token=eyJpZCI6IjFFdG5XYkhqSnN0T3EwaHNHODM4V2lNYmdpUFdYbThNOTFRbTdlYjNkeDgrcE84enlCaXdMSFdHOE9pNkZiU1NNMGdocmtoN0JTekh5MVJWYXE5QUpPRUxxd0NkNTc4RDlPZmsyR1R0emxPalV6dE1QSjZlalBiYlllQkdzcVdnVUdld3d6emFreTVGS1d3MzQ0dERHREhwSnBaQUc1Z1g0ZkpnK1wvUnFvVWZ1dlhkemlIMFhMWkJKNGR3QkN3WWx1UFlPZ3dxOFdIazNUa2hpXC9ZMGpoV3FlNWg4YnIyeDNidGhFbWkwb0Q5QTU0SjdPTVJDYVBxYmQxWks5VmdtZG5TdWxpYlhhZDFpS3pMUSs3aDJVZDZOWlpDQ3pNUER2ZUVJOXVUWTlZOFFseTJxZWRYNjh4TkVuN0NybHJNOWFpc3lYdXhVUmN3Ylp3ZisweFkzZjFHS09XOXhQcnVcL3Q2RERHb0dyRzVtTktVaGl4bnQzV3VGbkowTzlBV0YzVHJ6NVwvaWZzVUNKNWFPdlgwbVNaRlQ2eFdtcFp1bDZTSHZiV0FEMGloR1ZvPSIsImFkU2xvdCI6IjEyMDAwMCIsInRlbXBsYXRlSWQiOiJJTUFHRSIsImV2ZW50IjoiRVhQT1NVUkUiLCJhZF90ZW1wbGF0ZSI6IklNQUdFIiwiYWRfbWF0ZXJpYWxfaWQiOiJtc3NwLTI3MDQ4NTEyMzIifQ%3D%3D\"],\"click\":[\"dueros:\\\/\\\/f34646bc-37b4-a9db-361f-48fe7ca8831d\\\/eventHandle?token=eyJpZCI6IjFFdG5XYkhqSnN0T3EwaHNHODM4V2lNYmdpUFdYbThNOTFRbTdlYjNkeDgrcE84enlCaXdMSFdHOE9pNkZiU1NNMGdocmtoN0JTekh5MVJWYXE5QUpPRUxxd0NkNTc4RDlPZmsyR1R0emxPalV6dE1QSjZlalBiYlllQkdzcVdnVUdld3d6emFreTVGS1d3MzQ0dERHREhwSnBaQUc1Z1g0ZkpnK1wvUnFvVWZ1dlhkemlIMFhMWkJKNGR3QkN3WWx1UFlPZ3dxOFdIazNUa2hpXC9ZMGpoV3FlNWg4YnIyeDNidGhFbWkwb0Q5QTU0SjdPTVJDYVBxYmQxWks5VmdtZG5TdWxpYlhhZDFpS3pMUSs3aDJVZDZOWlpDQ3pNUER2ZUVJOXVUWTlZOFFseTJxZWRYNjh4TkVuN0NybHJNOWFpc3lYdXhVUmN3Ylp3ZisweFkzZjFHS09XOXhQcnVcL3Q2RERHb0dyRzVtTktVaGl4bnQzV3VGbkowTzlBV0YzVHJ6NVwvaWZzVUNKNWFPdlgwbVNaRlQ2eFdtcFp1bDZTSHZiV0FEMGloR1ZvPSIsImFkU2xvdCI6IjEyMDAwMCIsInRlbXBsYXRlSWQiOiJJTUFHRSIsImV2ZW50IjoiQ0xJQ0siLCJhZF90ZW1wbGF0ZSI6IklNQUdFIiwiYWRfbWF0ZXJpYWxfaWQiOiJtc3NwLTI3MDQ4NTEyMzIifQ%3D%3D&clickUrl=http%3A%2F%2Fcpro.baidu.com%2Fcpro%2Fui%2Fuijs.php%3Fen%3DmywWUA71T1Yknzu9TZKxpyfqn1T3P16vn101rau9TZKxTv-b5yRkm1m1nvu-FhPC5H0huAbqPHcYnW63Fh-VuybqrjmsP1R3njf1rHbzPWbYFh-Vuy-xmL0qnauGTdq9TZ0qniuJp1YYrHF-PWF9uhDkPjcsn17hFh_qFRnLFRFDFRPjFRRdFRFaFRDdFRcvFR7AFRPDFRcvFRf1FRcsFRnYFRnYFRFjFRfzFRFKFRn1FhkdpvbqniuVmLKV5HRzn10hULnqmy4bThqGuauk5yRkm1m1nvu-gvPsTBuzmWYkFMF15HDhTvwogLmqPau1uAVxIhNzTv-EUWYdQWm8nau1uyk_ugFxpyfqnBu1pyfqnymsn1fzmH79uWmznhRYriu1IA-b5HmsnjDhIjdYTAP_pyPouyf1gvdEm-q9TLKxnzuYUgnqnHR3n1f3nH6drauYIHYvrHnzPWDkFMRqpZwYTaR1fiRzwBRzwWwBuAcYmiRzwaRzwARkm1m1nvu-FHF7mvqVFMNGUy-b5HcYP1b1PW6vrjbhIWYzFhbqmyRdnhfLPjD%26adx%3D1%26besl%3D0%26br%3D0%26c%3Dnews%26cf%3D1%26cp%3Dfc_middle_page_app%26cvrq%3D371295%26ds%3Dfmp%26fr%3D1%26fv%3D0%26h%3D600%26haacp%3D107%26iif%3D1%26img_typ%3D22630%26itm%3D0%26lu_idc%3Dtc%26lukid%3D1%26lus%3D1f0342a1af622e49%26lust%3D5e620402%26mscf%3D0%26mtids%3D8021544%26n%3D10%26nttp%3D3%26oi%3D25%26p%3Dbaidu%26sce%3D5%26sh%3D600%26sr%3D0%26ssp2%3D0%26sw%3D1024%26swi%3D1%26tpl%3Dtemplate_inlay_all_mobile_lu_native_ad_app_feed_rect%26tsf%3Ddtp%3A2%26tt_sign%3D%25B1%25F0%25BC%25D2%25D1%25E7%25BB%25E1%25CC%25FC%25D5%25E2%25C3%25B4%25D3%25D0%25B5%25B5%25B4%25CE%25A3%25AC%25D4%25AD%25C0%25B4%25CA%25C7%25D3%25C3%25B5%25C4%25C8%25AB%25CF%25A2%25CD%25B6%25D3%25B0%26tt_src%3D16384%26u%3D%26uicf%3Dlurecv%26urlid%3D0%26w%3D1024%26wi%3D4%26eot%3D1\"],\"close\":[\"dueros:\\\/\\\/f34646bc-37b4-a9db-361f-48fe7ca8831d\\\/eventHandle?token=eyJpZCI6IjFFdG5XYkhqSnN0T3EwaHNHODM4V2lNYmdpUFdYbThNOTFRbTdlYjNkeDgrcE84enlCaXdMSFdHOE9pNkZiU1NNMGdocmtoN0JTekh5MVJWYXE5QUpPRUxxd0NkNTc4RDlPZmsyR1R0emxPalV6dE1QSjZlalBiYlllQkdzcVdnVUdld3d6emFreTVGS1d3MzQ0dERHREhwSnBaQUc1Z1g0ZkpnK1wvUnFvVWZ1dlhkemlIMFhMWkJKNGR3QkN3WWx1UFlPZ3dxOFdIazNUa2hpXC9ZMGpoV3FlNWg4YnIyeDNidGhFbWkwb0Q5QTU0SjdPTVJDYVBxYmQxWks5VmdtZG5TdWxpYlhhZDFpS3pMUSs3aDJVZDZOWlpDQ3pNUER2ZUVJOXVUWTlZOFFseTJxZWRYNjh4TkVuN0NybHJNOWFpc3lYdXhVUmN3Ylp3ZisweFkzZjFHS09XOXhQcnVcL3Q2RERHb0dyRzVtTktVaGl4bnQzV3VGbkowTzlBV0YzVHJ6NVwvaWZzVUNKNWFPdlgwbVNaRlQ2eFdtcFp1bDZTSHZiV0FEMGloR1ZvPSIsImFkU2xvdCI6IjEyMDAwMCIsInRlbXBsYXRlSWQiOiJJTUFHRSIsImV2ZW50IjoiQ0xPU0UiLCJhZF90ZW1wbGF0ZSI6IklNQUdFIiwiYWRfbWF0ZXJpYWxfaWQiOiJtc3NwLTI3MDQ4NTEyMzIifQ%3D%3D\"]},\"props\":{\"autoSwitch\":true,\"duration\":10000}}],\"props\":{\"autoSwitch\":true,\"duration\":10000,\"htmlAddress\":\"https%3A%2F%2Fxiaodu.baidu.com%2Fsaiya%2Fsdk%2Fiframe%2Fad-wrapper.html\"}}"
                                    })
                                }),  () => {});
                            }, 100);
                        }
                    }
                },
                registerHandler: (name, cb) => {
                    if (name === 'onHandleIntent') {
                        mockRegisterOnHandleIntent(name, cb);
                        setInterval(() => {
                            cb(JSON.stringify(intentData), () => {});
                        }, 100);
                        window.WebViewJavascriptBridge._onHandleIntent = cb;
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

            data = {
                ...appConfig,
                skillID: '699e74f5-b879-1926-1e11-51998f05ea68'
            };

            botApp = new BotApp(data);

            // 测试广告模块的功能
            botApp.initAd({
                placeId: '5bnTSA3%2Bk%2FlCppVdt9bzxe%2B7gnZMFYgnMQLXt3dB%2FWFKf4lyam1he4m8ubUrZ0dj2d5T49v1ld1b9JHT%2B6ZhWIp9T6niQuPFPWCZ%2BpOIZhg%3D',
                screenOrientation: 'portrait',
                zIndex: 9999,
                displayStrategy: 'twice',
                firstDisplayTime: 3,
                bannerPosition: {
                    right: '30px',
                    bottom: '30px'
                },
                clickCallback: function() {
                    console.log('用户点击了广告');
                },
                closeCallback: function() {
                    console.log('用户关闭了广告');
                },
                displayCallback: function() {
                    console.log('广告展示成功');
                },
                switchCallback: function() {
                    console.log('广告切换成功');
                }
            });
        })

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

        const startAd = Date.now();

        test('initAd', (done) => {

            // 这里先这么不合规的处理下
            mockCallUploadLinkClickedHandler.__doneCb = () => {
                expect(mockCallUploadLinkClickedHandler).toHaveBeenCalledWith('uploadLinkClicked', JSON.stringify({
                    url: `dueros://f34646bc-37b4-a9db-361f-48fe7ca8831d/getAdResources?adPlaceId=${botApp.config.adPlaceId}&botId=${botApp.config.skillID}`,
                    initiator: {
                        type: 'AUTO_TRIGGER'
                    }
                }));
                done();
            }
        });

        test('广告第一次打开间隔', (done) => {
            mockAdFirstShowInterval.__doneCb = () => {
                expect(mockAdFirstShowInterval).toHaveBeenCalled();
                let interval = Date.now() - startAd;
                // 0.5秒误差
                if (interval >= 2500 && interval <= 3500) {
                    done();
                } else {
                    done('时间1间隔错误: ' + interval);
                }
            }
        });

        test('registerGesture', (done) => {
            const callback = jest.fn((err, gesture) => {
                expect(callback).toHaveBeenCalledWith(null, 'OK');
                done();
            });
            window.WebViewJavascriptBridge.callHandler = jest.fn(() => {
                setTimeout(() => {
                    window.WebViewJavascriptBridge._onHandleIntent(JSON.stringify({
                        app: {
                            packageName: 'com.baidu.duer.test_botsdk'
                        },
                        intent: {
                            name: 'AI_DUER_SHOW_GESTURE_RECOGNIZED',
                            slots: [{
                                name: 'recognizedGestureName',
                                value: 'OK'
                            }]
                        }
                    }), () => {});
                }, 100);
            });
            const data = ['GESTURE_OK', 'GESTURE_PALM', 'GESTURE_LEFT', 'GESTURE_RIGHT'];

            botApp.registerGesture(data, callback);
            expect(window.WebViewJavascriptBridge.callHandler).toHaveBeenCalledWith('triggerDuerOSCapacity', JSON.stringify({"capacityName":"AI_DUER_SHOW_GESTURE_REGISTER","params":{"enabledGestures":["GESTURE_OK","GESTURE_PALM","GESTURE_LEFT","GESTURE_RIGHT"]}}), expect.any(Function));
        });

    });
});

