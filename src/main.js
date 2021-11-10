/*
 * @file H5 bot app SDK
 * @author dengxuening<dengxuening@baidu.com>
 */

import {LowVersionErrorMsg, ServiceError} from './errors';
import {parseVersionNumber, compareShowVersion, sliceBase64Header, getQuery} from "./utils";
import Ad from './Ad';
import TrialGame from './TrialGame';

/**
 * @callback requestCallback 一种回调函数(随便定义的名字。。。)
 */

/**
 * 与Native的交互做了封装
 * @class
 */
class BotApp {

    /**
     * @constructor
     * @param {Object} config 必填，身份校验等相关信息
     * @param {string} config.random1 // 必填，随机字符串，长度不限，由开发者自己生成
     * @param {string} config.signature1 // 必填，将(random1 + appkey)的字符串拼接后做MD5运算得出
     * @param {string} config.random2 //  必填，随机字符串，长度不限，由开发者自己生成
     * @param {string} config.signature2 // 必填，将(random2 + appkey)的字符串拼接后做MD5运算得出
     * @param {string} config.skillID // 必填，技能ID
     * @param {string} config.orderZIndex // 选填，H5试玩游戏的订单浮层的zIndex
     * @param {Object} config._JsBridgeForUnitTest // 禁止使用，仅用于单元测试
     * @param {boolean} config.needInitJSBridge // 选填，默认为true, 当jsBridge init冲突时可使用本参数，可控制是否调用bridge.init
     */
    constructor (config = {}) {
        this._JsBridgeForUnitTest = config._JsBridgeForUnitTest;
        this.config = {
            adDisable: true,
            needInitJSBridge: true,
            ...config,
            orderZIndex: config.orderZIndex || 9999
        };

        this.ad = new Ad(this);
        this.trialGame = new TrialGame(this);

        // 有些游戏是http协议的，有些游戏是https协议的
        this._gameWrapperMsgTarget = 'http://xiaodu.baidu.com';
        this._gameWrapperHttpsMsgTarget = 'https://xiaodu.baidu.com';

        this._init();
    }

    _init() {
        const registerConfig = JSON.stringify({
            random1: this.config.random1,
            signature1: this.config.signature1,
            random2: this.config.random2,
            signature2: this.config.signature2
        });

        if (this.isInApp()) {
            this._initInXiaoduApp(registerConfig);
        } else {
            this._initInShow(registerConfig, this.config.needInitJSBridge);
        }
    }

    /**
     * 在SHOW设备中初始化相关
     * @private
     */
    _initInShow(registerConfig, needInitJSBridge = true) {
        this._getJSBridge(bridge => {
            if (needInitJSBridge) {
                bridge.init(function(message, responseCallback) {
                    var data = {
                        'Javascript Responds': 'Ready!'
                    };
                    console.log('Receive bridge init message from native: ' + message);
                    responseCallback(data);
                });
            }

            // Native依赖这几个参数进行身份校验
            bridge.callHandler('register', registerConfig, payload => {
                payload = JSON.parse(payload);
                this.registerResult = payload;
                this.registerCallback && this.registerCallback(payload);
                this.registerCallback = null;

                if (this.config.skillID) {
                    this.requireShipping();
                }
            });

            bridge.registerHandler('onHandleIntent',  (payload, callback) => {
                payload = JSON.parse(payload);
                const slots = payload.intent.slots;
                const intentName = payload.intent.name;
                if (intentName === 'RenderAdvertisement') {
                    if (payload.customData) {
                        this.ad.render(JSON.parse(payload.customData).jsonData);
                    }
                // 手势识别
                } else if (intentName === 'AI_DUER_SHOW_GESTURE_RECOGNIZED' && this._registerGestureCb) {
                    if (slots && slots[0]) {
                        this._registerGestureCb(null, slots[0].value);
                    } else {
                        this._registerGestureCb('Recognize gesture failed', null);
                    }
                } else if (intentName === 'com.baidu.duer.cameraStateChanged' && this._getCameraStateCb) {
                    this._getCameraStateCb(null, payload.customData);
                } else if (intentName === 'H5gameHeartBeatReport'
                    || intentName === 'H5gameTrialStatus'
                    || intentName === 'NotifyBuyStatus') {
                    this.trialGame.handleIntent(payload)
                } else {
                    this.onHandleIntentCb && this.onHandleIntentCb(payload);
                }
                callback('js 回调');
            });

            bridge.registerHandler('onClickLink', (payload, callback) => {
                payload = JSON.parse(payload);
                if (payload.url === 'http://sdk.bot.dueros.ai?action=unknown_utterance') {
                    this._handleUnknowUtteranceCb && this._handleUnknowUtteranceCb(null, JSON.parse(payload.params));
                } else {
                    this._onClickLinkCb && this._onClickLinkCb(payload);
                }
                // 告知app是否处理成功
                callback(true);
            });
        });
        this.uploadLinkClicked({
            url: `dueros://${this.config.skillID}/h5game/getneedheartbeatreport`,
            initiator: {
                type: 'AUTO_TRIGGER'
            }
        });
        this._showVersion = this._parseShowVersion();

        // 监听从广告iframe和游戏弹窗相关iframe的postMessage消息
        window.addEventListener('message', (event) => {
            // 处理广告消息
            this.ad.handlePostMessageEvent(event);
            // 处理游戏试玩相关消息
            this.trialGame.handleIframePostMessage(event)
        });

        // 绑定屏幕触摸打点事件
        this._logTouch();
    }

    /**
     * 在小度App中初始化
     * @private
     */
    _initInXiaoduApp(registerConfig) {
        window.addEventListener('message', event => {
            let data = event.data;
            if (data.type === 'wrapper_location_protocal') {
                // 如果检测到父页面是https协议的，则升级为https
                if (data.data.indexOf('https') > -1) {
                    this._gameWrapperMsgTarget = this._gameWrapperHttpsMsgTarget;
                }
                // 确认链接是否是https之后开始注册
                window.parent.postMessage({
                    type: 'register',
                    data: this.config
                }, this._gameWrapperMsgTarget);
            }

            if (event.origin === this._gameWrapperMsgTarget) {
                console.log('receive h5game-wrapper\'s message ', data);
                if (data.type === 'authorized_success' || data.type === 'authorized_fail') {
                    this._linkAccountResultCb(data);
                } else if (data.type === 'bot_info') {
                    this.registerResult = data.data;
                    this.registerCallback && this.registerCallback(this.registerResult);
                    this.registerCallback = null;
                } else if (data.type === 'ship') {
                    this._getShipPayResult && this._getShipPayResult(data.err, data.data);
                }
            }
        });
    }

    _getJSBridge(cb) {
        if (this._JsBridgeForUnitTest) {
            return cb(this._JsBridgeForUnitTest);
        } else {
            if (window.WebViewJavascriptBridge) {
                cb(window.WebViewJavascriptBridge);
            } else {
                document.addEventListener('WebViewJavascriptBridgeReady', () => {
                    cb(WebViewJavascriptBridge);
                }, false);
            }
        }
    }

    _validateCallback(fnName, arg, index = 0) {
        if (typeof arg !== 'function') {
            throw new TypeError(`[${fnName}]'s arguments[${index}] must be a function, but get a ${typeof arg}`);
        }
    }

    /**
     * 执行LinkClick
     * @param {Array|string} linkClickData 要执行的LinkClickUrl，可能为数组
     * @private
     */
    execLinkClick(linkClickData) {
        if (Array.isArray(linkClickData)) {
            linkClickData.forEach((data) => {
                this.uploadLinkClicked(data);
            });
        } else {
            this.uploadLinkClicked(linkClickData);
        }
    }

    // 判断APP的类型
    isInApp() {
        if (this._appType) {
            return this._appType;
        } else {
            const ua = window.navigator.userAgent.toLowerCase();
            let appType = '';
            if (ua.match(/xiaoduapp\/([\S]+)/)) {
                // 小度音箱APP
                appType = 'ls_m';
            } else if (ua.match('fromapp/xiaoduapp')) {
                // 小度APP
                appType = 'oneApp';
            }
            this._appType = appType === 'ls_m' || appType === 'oneApp';
            return this._appType;
        }
    }

    /**
     * 将SHOW端设备里的版本后解析出来
     * @returns {string}
     * @private
     */
    _parseShowVersion(userAgent) {
        if (this._showVersion) {
            return this._showVersion;
        }
        let ua = userAgent ? userAgent : navigator.userAgent;
        let version = parseVersionNumber(ua);
        if (version) {
            this._showVersion = version;
            return version;
        } else {
            throw new Error('Device version number parsing failed: ' + ua);
        }
    }

    /**
     * 获取用户实名认证的年龄段信息
     * SHOW 1.35.0.0及其以后的版本可用
     *
     * @param {requestCallback} cb
     */
    requireUserAgeInfo(cb) {
        if (this.isInApp()) {
            console.warn('requireUserAgeInfo: Your H5 app is not running on the App, and the callback function will not be called');
            return;
        } else {
            this._validateCallback('requireUserAgeInfo', cb);
            if (compareShowVersion(this._parseShowVersion(), '1.35.0.0') >= 0) {
                if (this.config.skillID) {
                    this._getJSBridge(bridge => {
                        bridge.callHandler('requestUserAgeInfo', null, (payload) => {
                            payload = JSON.parse(payload);
                            if (payload.status === 0) {
                                if (Number(payload.data.is_auth) === 0) {
                                    let link = `dueros://${this.config.skillID}/certification?action=realName`;
                                    this.uploadLinkClicked({
                                        url: link,
                                        initiator: {
                                            type: 'AUTO_TRIGGER'
                                        }
                                    });
                                }
                                cb && cb(null, payload.data);
                            } else {
                                cb && cb(new ServiceError(`logid: ${payload.logid}, ${payload.msg}`), payload.data);
                                console.error('requireUserAgeInfo has an error: ', payload.logid, payload.msg);
                            }
                        });
                    });
                } else {
                    throw new Error('Missing `skillID`, please configure `skillID` when initializes the `BotApp`');
                }
            } else {
                cb(new LowVersionErrorMsg('requireUserAgeInfo'), null);
            }
        }
    }

    /**
     * 请求发货信息。要调用本方法则必须在BotApp初始化时填写skillID，
     * 并同时使用onHandleIntent()来获取发货信息。
     * 本方法会在初始化阶段自动调用一次，开发者也可手动调用本方法。
     */
    requireShipping() {
        if (this.config.skillID) {
            let link = `dueros://${this.config.skillID}/readyForShipping`;
            this.uploadLinkClicked({
                url: link,
                initiator: {
                    type: 'AUTO_TRIGGER'
                }
            });
        } else {
            throw new Error('Missing `skillID`, please configure `skillID` when initializes the `BotApp`');
        }
    }

    getRegisterResult(cb) {
        if (this.registerResult) {
            cb(this.registerResult);
        } else {
            this.registerCallback = cb;
        }
    }

    /**
     * 发起账户oauth授权操作，调用此方法后
     * 小度有屏音箱会展示一个授权页面，App上会弹出授权浮层
     * 仅当运行环境是App时才会触发回调
     */
    requireLinkAccount(cb) {
        if (this.isInApp()) {
            this._validateCallback('requireLinkAccount', cb);
            this._linkAccountResultCb = cb;
            window.parent.postMessage({
                type: 'request_authorization'
            }, this._gameWrapperMsgTarget);
        } else {
            if (cb) {
                console.warn('requireLinkAccount: Your H5 app is not running on the App, and the callback function will not be called');
            }
            this._getJSBridge(bridge => {
                bridge.callHandler('requireLinkAccount');
            });
        }
    }

    /**
     * 接收账号oauth授权成功指令
     * @param {requestCallback} cb 授权成功后会调用此函数
     */
    onLinkAccountSuccess(cb) {
        this._validateCallback('onLinkAccountSuccess', cb);
        this._getJSBridge(bridge => {
            bridge.registerHandler('onLinkAccountSuccess',  function (payload, callback) {
                cb(JSON.parse(payload));
                callback(true);
            });
        })
    }


    /**
     * 发起收款操作，调用此函数小度有屏音箱
     * 会展示付款二维码
     * @param {Object} data 携带订单号，商品名称等参数
     * @param {Function} cb 购买结果回调，当在App中运行时本参数必填
     */
    requireCharge(data, cb) {
        if (this.isInApp()) {
            if (typeof cb !== 'function') {
                throw new Error('requireCharge: Your web runs in App and and you must pass a function'
                    + ' in the position of the second to handle the purchase result.');
            }
            this._getShipPayResult = cb;
            window.parent.postMessage({
                type: 'charge',
                data
            }, this._gameWrapperMsgTarget);
        } else {
            data = JSON.stringify(data);
            this._getJSBridge(bridge => {
                bridge.callHandler('requireCharge', data);
            });
        }
    }

    /**
     * 本方法不同于requireCharge，需要事先在度秘的商品库里注册productId。
     * callback函数会在返回游戏页面后调用，调用可能会有明显延迟。
     * 仅用于小度App内部的购买调用
     *
     * @param {Object} data
     * @param {Function} cb
     */
    requireBuy(data, cb) {
        if (this.isInApp()) {
            if (!data || !data.productId || !data.sellerOrderId) {
                let e = new Error();
                e.name = 'params error';
                e.message = 'requireBuy: arguments[0] must be an `Object` with `productId` and `sellerOrderId`';
                throw e;
            }
            this._validateCallback('requireBuy', cb, 1);
            this._getShipPayResult = cb;
            let postData = {
                ...data,
                product2: `${data.productId}|${data.sellerOrderId}|skillstoreapp`,
                source: 'skillstoreapp',
                from: 'skillstoreapp'
            };

            window.parent.postMessage({
                type: 'buy',
                data: postData
            }, this._gameWrapperMsgTarget);
        } else {
            console.error('Method `requireBuy` can only be called in App');
        }
    }

    /**
     * 上报屏幕上的链接点击事件
     * @param {Object} data 要上报的数据
     * @param {string} data.url 点击了的链接
     */
    uploadLinkClicked(data) {
        data = JSON.stringify(data);
        this._getJSBridge(bridge => {
            bridge.callHandler('uploadLinkClicked', data);
        });
    }

    /**
     * 接收DuerOS收款成功后的通知
     * @param {Function} cb 收款成功后会调用此函数
     */
    onChargeStatusChange(cb) {
        this._validateCallback('onChargeStatusChange', cb);
        this._getJSBridge(bridge => {
            bridge.registerHandler('onChargeStatusChange',  function (payload, callback) {
                cb(JSON.parse(payload));
                callback(true);
            });
        });
    }

    /**
     * 接收DuerOS下发的意图解析结果
     * @param {requestCallback} cb 收到意图解析结果后此回调函数会被触发
     */
    onHandleIntent(cb) {
        this._validateCallback('onHandleIntent', cb);
        this.onHandleIntentCb = cb;
    }

    /**
     * 新增一个自定义交互元素描述。
     * @param {Object} data 需要上传的端状态数据
     * @param {requestCallback} [cb] 可选参数，发起上传操作后的回调
     */
    updateUiContext(data, cb) {
        if (cb) {
            this._validateCallback('updateUiContext', cb, 1);
        }
        data = JSON.stringify(data);
        this._getJSBridge(bridge => {
            bridge.callHandler('updateUiContext', data, function (result) {
                cb && cb(result);
            });
        });
    }

    /**
     * 开启聆听。设备进入语音交互状态
     * @param {requestCallback} [cb] 可选参数，该函数会收到聆听是否发起成功的的数据
     */
    listen(cb) {
        if (cb) {
            this._validateCallback('listen', cb);
        }
        this._getJSBridge(bridge => {
            bridge.callHandler('listen',  function (result) {
                cb && cb(result);
            });
        });
    }

    /**
     * 播报TTS语音
     * @param {string} data 要播报的文字
     * @param {requestCallback} [cb] 可选参数，TTS播报完毕后会回调此函数
     */
    speak(data, cb) {
        if (cb) {
            this._validateCallback('speak', cb, 1);
        }
        this._getJSBridge(bridge => {
            bridge.callHandler('speak', data, function () {
                cb && cb();
            });
        });
    }

    /**
     * 请求关闭app
     */
    requestClose() {
        if (this.isInApp()) {
            window.parent.postMessage({
                type: 'closeWebView'
            }, this._gameWrapperMsgTarget);
        } else {
            this._getJSBridge(bridge => {
                bridge.callHandler('requestClose');
            });
        }
    }

    /**
     * 接收ClickLink。ClickLink是一种Directive，用户新增自定义交互之后，云端会解析用户定义的交互，
     * 下发对应的指令。例如APP通过updateUiContext(UiContextPayload)新增自定义交互之后DuerOS会通
     * 过此接口下发上面定义的url。
     * @param {requestCallback} cb
     */
    onClickLink(cb) {
        this._validateCallback('onClickLink', cb);
        this._onClickLinkCb = cb;
    }

    /**
     * 屏幕监听屏幕导航指令。
     * @param {requestCallback} cb 当用户发起语音请求，要求滚动屏幕时，本回调函数会被调用。
     */
    onHandleScreenNavigatorEvent(cb) {
        this._validateCallback('onHandleScreenNavigatorEvent', cb);
        this._getJSBridge(bridge => {
            bridge.registerHandler('onHandleScreenNavigatorEvent',  function (payload, callback) {
                // payload可能是一下几种值
                // NAV_SCROLL_LEFT = 1;
                // NAV_SCROLL_RIGHT = 2;
                // NAV_SCROLL_UP = 3;
                // NAV_SCROLL_DOWN = 4;
                // NAV_NEXT_PAGE = 5;
                // NAV_PREVIOUS_PAGE = 6;
                // NAV_GO_BACK = 7;
                // NAV_GO_HOMEPAGE = 8;
                cb(JSON.parse(payload));
                callback(true) // 告知处理是否成功
            });
        });
    }

    onDialogStateChanged(cb) {
        this._validateCallback('onDialogStateChanged', cb);
        if (compareShowVersion(this._parseShowVersion(), '1.36.0.0') >= 0) {
            this._getJSBridge(bridge => {
                bridge.registerHandler('onDialogStateChanged',  function (state, callback) {
                    let payload = JSON.parse(state);
                    cb(null, payload.data);
                    callback(true); // 告知处理是否成功
                });
            });
        } else {
            cb(new LowVersionErrorMsg('onDialogStateChanged'), null);
        }
    }

    onHandleUnknowUtterance(cb) {
        this._validateCallback('onHandleUnknowUtterance', cb);
        if (compareShowVersion(this._parseShowVersion(), '1.36.0.0') >= 0) {
            this._handleUnknowUtteranceCb = cb;
        } else {
            cb(new LowVersionErrorMsg('onHandleUnknowUtterance'), null);
        }
    }

    canGoBack(cb) {
        this._validateCallback('canGoBack', cb);
        if (compareShowVersion(this._parseShowVersion(), '1.36.0.0') >= 0) {
            this._getJSBridge(bridge => {
                bridge.callHandler('canGoBack', null, (payload) => {
                    payload = JSON.parse(payload);
                    cb(null, payload.data);
                });
            });
        } else {
            cb(new LowVersionErrorMsg('canGoBack'), null);
        }
    }

    /**
     * 注册手势识别
     * @param {Array} data 注册需要支持的手势识别，例如 ["GESTURE_OK", "GESTURE_PALM", "GESTURE_LEFT", "GESTURE_RIGHT"]，具体见文档：http://agroup.baidu.com/dueros-bot-platform/md/article/1943708
     * @param {requestCallback} cb 手势识别后的回调，例如 {"name": "recognizedGestureName", "value": "OK"}
     */
    registerGesture(data, cb) {
        this._validateCallback('registerGesture', cb, 1);
        if (!Array.isArray(data)) {
            throw new Error('data must be a `Array`');
        }
        if (compareShowVersion(this._parseShowVersion(), '1.36.0.0') >= 0) {
            this._getJSBridge(bridge => {
                const stringData = JSON.stringify({
                    capacityName: 'AI_DUER_SHOW_GESTURE_REGISTER',
                    params: {
                        enabledGestures: data
                    }
                });
                bridge.callHandler('triggerDuerOSCapacity', stringData, () => {});
                this._registerGestureCb = cb;
            });
        } else {
            cb(new LowVersionErrorMsg('registerGesture'), null);
        }
    }

    interruptTTS() {
        if (compareShowVersion(this._parseShowVersion(), '1.36.0.0') >= 0) {
            this._getJSBridge(bridge => {
                const stringData = JSON.stringify({
                    capacityName: 'AI_DUER_SHOW_INTERRPT_TTS',
                    params: null
                });
                bridge.callHandler('triggerDuerOSCapacity', stringData, () => {});
            });
        } else {
            console.error(new LowVersionErrorMsg('interruptTTS'));
        }
    }

    /**
     * 获取摄像头状态
     * @param {requestCallback} cb 回调传入的参数是一个枚举值，ENABLED、DISABLED
     */
    getCameraState(cb) {
        this._validateCallback('getCameraState', cb);
        if (compareShowVersion(this._parseShowVersion(), '1.39.0.0') >= 0) {
            this._getJSBridge(bridge => {
                const stringData = JSON.stringify({
                    capacityName: 'AI_DUER_SHOW_GET_CAMERA_STATE',
                    params: null
                });
                bridge.callHandler('triggerDuerOSCapacity', stringData, () => {});
                this._getCameraStateCb = cb;
            });
        } else {
            cb(new LowVersionErrorMsg('getCameraState'), null);
        }
    }

    /**
     * 上报DCS Event
     * @param data
     */
    sendEvent(data) {
        if (compareShowVersion(this._parseShowVersion(), '1.40.0.0') >= 0) {
            this._getJSBridge(bridge => {
                const stringData = JSON.stringify(data);
                bridge.callHandler('sendEvent', stringData, () => {});
            });
        } else {
            console.error(new LowVersionErrorMsg('sendEvent'));
        }
    }

    // initSpeechTranscriber(level) {
    //     this._getJSBridge(bridge => {
    //         bridge.callHandler('initSpeechTranscriber',  JSON.stringify({level}));
    //     });
    // }

    // startSpeechTranscriber() {
    //     this._getJSBridge(bridge => {
    //         bridge.callHandler('startSpeechTranscriber', null, function (result) {
    //             const data = JSON.parse(result).data;
    //             if (data.status !== 0) {
    //                 throw new Error('startSpeechTranscriber: Start speechTranscriber failed');
    //             }
    //         });
    //     });
    // }

    // stopSpeechTranscriber() {
    //     this._getJSBridge(bridge => {
    //         bridge.callHandler('stopSpeechTranscriber', null, function () {});
    //     });
    // }

    _handleLocalSpeechResult(level, cb) {
        level = Number(level);

        this._getJSBridge(bridge => {
            bridge.callHandler('initSpeechTranscriber',  JSON.stringify({level}));
            bridge.callHandler('startSpeechTranscriber', null, function (result) {
                const data = JSON.parse(result).data;
                if (data.status !== 0) {
                    throw new Error('startSpeechTranscriber: Start speechTranscriber failed');
                }
            });
        });
        if (compareShowVersion(this._parseShowVersion(), '1.45.0.1') >= 0) {
            console.log('handleSpeechResult mode: webview call');
            if (level === 1) {
                // 由webview直接调用，不走jsBridge逻辑以提升执行效率
                window.zw3me3p9zqby80uo_onHandleP1SpeechResult = function (state) {
                    cb(null, state);
                };
            } else {
                window.zw3me3p9zqby80uo_onHandleP2SpeechResult = function (state) {
                    let content = state && state.trim() || ''; // 过滤空字符
                    content.length && cb(null, content);
                };
            }
        } else if (compareShowVersion(this._parseShowVersion(), '1.45.0.0') === 0) {
            console.log('handleSpeechResult mode: js-bridge call');
            if (level === 1) {
                this._getJSBridge(bridge => {
                    bridge.registerHandler('onHandleP1SpeechResult',  function (state) {
                        const result = JSON.parse(state);
                        cb(null, result);
                    });
                });
            } else {
                this._getJSBridge(bridge => {
                    bridge.registerHandler('onHandleP2SpeechResult',  function (state) {
                        let content = state && state.trim() || ''; // 过滤空字符
                        content.length && cb(null, content);
                    });
                });
            }
        }
    }

    onHandleP1SpeechResult(cb) {
        this._validateCallback('onHandleP1SpeechResult', cb);
        if (compareShowVersion(this._parseShowVersion(), '1.45.0.0') >= 0) {
            this._handleLocalSpeechResult(1, cb);
        } else {
            console.error(new LowVersionErrorMsg('onHandleP1SpeechResult'));
        }
    }

    // onHandleP2SpeechResult(cb) {
    //     this._validateCallback('onHandleP2SpeechResult', cb);
    //     // todo: 版本判断
    //     this._handleLocalSpeechResult(2, cb);
    // }

    /**
     * 上报DCS Event
     * @param {Function} cb
     */
    onBuyStatusChange(cb) {
        this._validateCallback('onBuyStatusChange', cb);
        if (compareShowVersion(this._parseShowVersion(), '1.45.0.0') >= 0) {
            this._getJSBridge(bridge => {
                bridge.registerHandler('onBuyStatusChange',  function (payload, callback) {
                    // payload数据示例
                    cb(null, JSON.parse(payload));
                    // 告知app是否处理成功
                    callback(true)
                })
            });
        } else {
            cb(new LowVersionErrorMsg('onBuyStatusChange'), null);
        }
    }

    _logTouch() {
        window.addEventListener('touchstart', (e) => {
            const touchEv = e.touches[0];
            this.sendEvent({
                namespace: 'ai.dueros.device_interface.bot_app_sdk',
                name: 'TouchedDown',
                needDialogRequestId: false,
                payload: {
                    position : {
                        left: parseInt(touchEv.pageX, 10),
                        top: parseInt(touchEv.pageY, 10),
                    },
                }
            });
        }, true);
    }

    /**
     * 上传base64编码过的图片
     * @param base64Image
     * @param cb
     */
    uploadBase64Image(base64Image, cb) {
        this._validateCallback('uploadImage', cb, 1);
        if (compareShowVersion(this._parseShowVersion(), '1.48.0.0') >= 0) {
            this._getJSBridge(bridge => {
                const substrBase64 = sliceBase64Header(base64Image);
                console.log('uploadImage', substrBase64);
                bridge.callHandler('uploadImage', substrBase64, (payload) => {
                    console.log('uploadImage resposne', payload);
                    cb(null, JSON.parse(payload));
                });
            });
        } else {
            cb(new LowVersionErrorMsg('uploadImage'), null);
        }
    }
}

module.exports = BotApp;

// 用于非侵入式h5游戏集成
// window.addEventListener('load', function () {
//     const params = getQuery();
//     const {random1, signature1, random2, signature2, skillID} = params;
//     window.botAppInstance = new BotApp({
//         random1,
//         signature1,
//         random2,
//         signature2,
//         skillID
//     });
// });
