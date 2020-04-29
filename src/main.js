/*
 * @file H5 bot app SDK
 * @author dengxuening<dengxuening@baidu.com>
 */

import {LowVersionErrorMsg, ServiceError} from './errors';
import {isSet, parseH5UrlOrigin} from "./utils";


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
     */
    constructor (config = {}) {
        this.config = {
            adDisable: true,
            ...config,
        };

        // session期间最多弹出广告2次
        this._commonAdShowTimes = 2;

        // 广告弹出后，每次切换间隔10s
        this._commonadSwitchInterval = 10000;

        // 广告关闭后，下次打开在60s后
        this._commonAdReopenTimeout = 60000;

        // 广告iframe baseUrl
        this._adIframe1BaseUrl = '';

        this._isAdInit = false;

        this._init();
    }

    _init() {
        const registerConfig = JSON.stringify({
            random1: this.config.random1,
            signature1: this.config.signature1,
            random2: this.config.random2,
            signature2: this.config.signature2
        });

        this._isCommonAdSwitchOff = false; // 是否手动关闭广告
        this._isCommonAdDisplaying = false; // 广告是否正在展示
        this._gameWrapperMsgTarget = 'http://xiaodu.baidu.com';

        if (this.isInApp()) {
            window.addEventListener('message', event => {
                let data = event.data;
                if (data.type === 'wrapper_location_protocal') {
                    // 如果检测到父页面是https协议的，则升级为https
                    if (data.data.indexOf('https') > -1) {
                        this._gameWrapperMsgTarget = 'https://xiaodu.baidu.com';
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
        } else {
            this._getJSBridge(bridge => {
                bridge.init(function(message, responseCallback) {
                    var data = {
                        'Javascript Responds': 'Ready!'
                    };
                    console.log('Receive bridge init message from native: ' + message);
                    responseCallback(data);
                });

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
                    if (payload.intent.name === 'RenderAdvertisement') {
                        // _isCommonAdClosed是个开关。因为广告物料的返回是异步的，且有时间间隔
                        // 如果刚好在网络请求期间用户点击了关闭，然后物料返回
                        // 了，这时就又会渲染广告，造成关不掉的现象
                        if (!this.config.adDisable && !this._isCommonAdSwitchOff) {
                            if (payload.customData) {
                                this._renderAd(JSON.parse(payload.customData).jsonData);
                            }
                        }
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
            this._showVersion = this._parseShowVersion();

            window.addEventListener('message', (event) => {
                if (event.origin === this._adMsgTarget) {
                    let data = event.data;
                    console.log('receive msg from iframe: ', data);
                    if (data.type === 'ad_load_material') {
                        if (!this._isCommonAdDisplaying) {
                            this.config.adDisplayCallback();
                        } else {
                            this.config.adSwitchCallback();
                        }
                        this._isCommonAdDisplaying = true;
                        this._execLinkClick(data.data.linkClickUrl.map(url => {
                            return {
                                url: url,
                                initiator: {
                                    type: 'AUTO_TRIGGER'
                                }
                            }
                        }));
                    } else if (data.type === 'ad_click') {
                        this.config.adClickCallback();
                        this._execLinkClick(data.data.linkClickUrl.map(url => {
                            return {
                                url
                            }
                        }));
                        window.addEventListener('touchstart', this.screenTouched, true);
                        this._pauseCommonAd();
                    } else if (data.type === 'ad_close') {
                        this.config.adCloseCallback();
                        this._execLinkClick(data.data.linkClickUrl.map(url => {
                            return {
                                url
                            }
                        }));
                        this._closeCommonAd();

                        // 如果开发者选择广告策略 2
                        // 则在某一时间之后再次打开
                        if (this.config.adDisplayStrategy === 'twice') {
                            // 如果广告打开次数还有剩余
                            if (this._commonAdShowTimes > 0) {
                                this._commonAdShowTimes--;

                                // 控制竖屏广告展示在屏幕左侧还是右侧
                                if (this._lastVerticalAdDisplayIsLeft) {
                                    this._lastVerticalAdDisplayIsLeft = false;
                                } else {
                                    this._lastVerticalAdDisplayIsLeft = true;
                                }
                                clearTimeout(this._commonadReshowTimeout);
                                this._commonadReshowTimeout = setTimeout(() => {
                                    this._startCommonAdSwitch(true);
                                }, this._commonAdReopenTimeout);
                            }
                        }
                    }
                }
            });
        }
    }

    _getJSBridge(cb) {
        if (window.WebViewJavascriptBridge) {
            cb(window.WebViewJavascriptBridge);
        } else {
            document.addEventListener('WebViewJavascriptBridgeReady', () => {
                cb(WebViewJavascriptBridge);
            }, false);
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
    _execLinkClick(linkClickData) {
        if (Array.isArray(linkClickData)) {
            linkClickData.forEach((data) => {
                this.uploadLinkClicked(data);
            });
        } else {
            this.uploadLinkClicked(linkClickData);
        }
    }

    /**
     * 初始化广告
     * @param {Object} config 广告配置
     * @param {number} config.adZIndex 选填，默认值：9999，广告等浮层的层级，
     * @param {boolean} config.adDisable 选填，默认值：false，是否禁用广告
     * @param {enum} config.screenOrientation 选填，默认值：portrait，枚举值，游戏的屏幕类型，portrait => 竖屏，landscape => 全屏
     * @param {enum} config.displayStrategy 选填，默认值：twice，广告展示策略，once => 用户关闭后不再填充广告， twice => 用户关闭后再填充一次
     * @param {number} config.firstDisplayTime 选填，单位秒，广告第一次展示在游戏打开后多久
     * @param {Object} config.bannerPosition 选填，调整banner广告在游戏页面中的位置。值为CSS中的left、top、right、bottom，例如：bannerPosition: {left: '20px', top: '20px'}
     * @param {string} config.placeId 必填，广告位ID。
     * @param {Function} config.clickCallback 选填，广告点击时的回调函数
     * @param {Function} config.closeCallback 选填，广告关闭时的回调函数
     * @param {Function} config.displayCallback 选填，广告展示时的回调函数
     * @param {Function} config.switchCallback 选填，广告切换时的回调函数
     * @param {string} config._duerosDebugadIframeUrl 选填，内部使用，设置广告iframe的URL地址
     */
    initAd(config = {}) {
        if (this._isAdInit) {
            throw new Error('`initAd` can only be called once ');
        }
        this.config = {
            ...this.config,
            adZIndex: config.zIndex || 9999,
            screenOrientation: config.screenOrientation || 'portrait',
            adDisplayStrategy: config.displayStrategy || 'twice',
            adClickCallback: config.clickCallback || function() {},
            adCloseCallback: config.closeCallback || function() {},
            adDisplayCallback: config.displayCallback || function() {},
            adSwitchCallback: config.switchCallback || function() {},
            adFirstDisplayTime: typeof config.firstDisplayTime === 'undefined' ? 10 : config.firstDisplayTime,
            adBannerPosition: config.bannerPosition || {
                right: '30px',
                bottom: '30px'
            },
            adPlaceId: config.placeId,
            _duerosDebugadIframeUrl: config._duerosDebugadIframeUrl,
            adDisable: false,
        };

        if (!this.config.adDisable) {
            // 校验是否是数字，随后在某一时间开始弹出广告
            if (/\d+/.test(this.config.adFirstDisplayTime)) {
                clearTimeout(this._adFirstShowTimer);
                this._adFirstShowTimer = setTimeout(() => {
                    this._startCommonAdSwitch(true);
                    this._commonAdShowTimes--;
                }, this.config.adFirstDisplayTime * 1000);
            } else {
                throw new Error('firstDisplayTime must be a number, please check configuration');
            }
        }
        this._isAdInit = true;
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
    _parseShowVersion() {
        if (this._showVersion) {
            return this._showVersion;
        }
        let ua = navigator.userAgent;
        let reg = /build\/([\d\.]+);/i;
        let result = reg.exec(ua);
        if (result) {
            this._showVersion = result[1];
            return result[1];
        } else {
            throw new Error('Device version number parsing failed: ' + ua);
        }
    }

    /**
     * SHOW端设备的版本号对比
     * @param {string} a 版本号
     * @param {string} b 版本号
     * @returns {number} 如果返回0，则表示版本号相同，如果返回1，a版本号大于b版本号，如果返回-1则a版本号小于b
     * @private
     */
    _compareShowVersion(a, b) {
        let [a1, a2, a3, a4] = String(a).split('.');
        let [b1, b2, b3, b4] = String(b).split('.');
        if (a1 > b1) {
            return 1;
        } else if (a1 < b1) {
            return -1;
        } else if (a2 > b2) {
            return 1;
        } else if (a2 < b2) {
            return -1;
        } else if (a3 > b3) {
            return 1;
        } else if (a3 < b3) {
            return -1;
        } else if (a4 > b4) {
            return 1;
        } else if (a4 < b4) {
            return -1;
        } else {
            return 0;
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
            if (this._compareShowVersion(this._parseShowVersion(), '1.35.0.0') >= 0) {
                if (this.config.skillID) {
                    this._getJSBridge(bridge => {
                        bridge.callHandler('requestUserAgeInfo', null, (payload) => {
                            payload = JSON.parse(payload);
                            if (payload.status === 0) {
                                cb && cb(null, payload.data);
                            } else {
                                cb && cb(new ServiceError(`logid: ${payload.logid}, ${payload.msg}`), payload.data);
                                console.error('requireUserAgeInfo has an error: ', payload.logid, payload.msg);
                            }

                            if (payload.status !== 0 || Number(payload.data.is_auth) === 0) {
                                let link = `dueros://${this.config.skillID}/certification?action=realName`;
                                this.uploadLinkClicked({
                                    url: link,
                                    initiator: {
                                        type: 'AUTO_TRIGGER'
                                    }
                                });
                            }
                        });
                    });
                } else {
                    throw new Error('Missing `skillID`, please configure `skillID` when initializes the `BotApp`');
                }
            } else {
                cb(new LowVersionErrorMsg(), null);
            }
        }
    }

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
        if (this._compareShowVersion(this._parseShowVersion(), '1.36.0.0') >= 0) {
            this._getJSBridge(bridge => {
                bridge.registerHandler('onDialogStateChanged',  function (state, callback) {
                    let payload = JSON.parse(state);
                    cb(null, payload.data);
                    callback(true); // 告知处理是否成功
                });
            });
        } else {
            cb(new LowVersionErrorMsg(), null);
        }
    }

    onHandleUnknowUtterance(cb) {
        this._validateCallback('onHandleUnknowUtterance', cb);
        if (this._compareShowVersion(this._parseShowVersion(), '1.36.0.0') >= 0) {
            this._handleUnknowUtteranceCb = cb;
        } else {
            cb(new LowVersionErrorMsg(), null);
        }
    }

    canGoBack(cb) {
        this._validateCallback('canGoBack', cb);
        if (this._compareShowVersion(this._parseShowVersion(), '1.36.0.0') >= 0) {
            this._getJSBridge(bridge => {
                bridge.callHandler('canGoBack', null, (payload) => {
                    payload = JSON.parse(payload);
                    cb(null, payload.data);
                });
            });
        } else {
            cb(new LowVersionErrorMsg(), null);
        }
    }

    /**
     * 从意图槽位中解析广告物料并渲染广告
     * @param {string} data
     * @private
     */
    _renderAd(data) {
        let _data = JSON.parse(data);
        let serverAdIframeAddr = decodeURIComponent(_data.props.htmlAddress);
        if (_data.status === 0) {
            if (!this._adIframe1) {
                this._adIframe1 = document.createElement('iframe');
                let adIframeQuery = encodeURIComponent(parseH5UrlOrigin(window.location.href));
                if (this.config._duerosDebugadIframeUrl) {
                    this._adIframe1BaseUrl = this.config._duerosDebugadIframeUrl;
                    this._adMsgTarget = parseH5UrlOrigin(this.config._duerosDebugadIframeUrl);
                } else {
                    this._adIframe1BaseUrl = serverAdIframeAddr;
                    this._adMsgTarget = parseH5UrlOrigin(serverAdIframeAddr);
                }

                let adIframeUrl = '';
                if (this._adIframe1BaseUrl.indexOf('?') > -1) {
                    adIframeUrl = `${this._adIframe1BaseUrl}&msgTarget=${adIframeQuery}`
                } else {
                    adIframeUrl = `${this._adIframe1BaseUrl}?msgTarget=${adIframeQuery}`
                }

                this._adIframe1.src = adIframeUrl;
                this._adIframe1.scrolling = 'no';
                this._adIframe1.frameBorder = 0;
                this._adIframe1.allowTransparency = 'true';
                document.body.appendChild(this._adIframe1);
                this._adIframe1.style.cssText += `display: block; z-index: ${this.config.adZIndex};position: fixed; background-color=transparent;`;
            } else if (!this.config._duerosDebugadIframeUrl && this._adIframe1BaseUrl !== serverAdIframeAddr) {
                document.body.removeChild(this._adIframe1);
                this._adIframe1Loaded = false;
                this._adIframe1 = null;
                this._renderAd(data);
                return;
            }
            this._adIframe1.style.display = 'block';
            this._setAdPosition();
            let postData = {
                type: 'ad_set_material',
                data: {
                    ..._data,
                    screenOrientation: this.config.screenOrientation,
                }
            };

            if (this._adIframe1Loaded) {
                this._adIframe1.contentWindow.postMessage(postData, this._adMsgTarget);
            } else {
                this._adIframe1.onload = () => {
                    this._adIframe1.contentWindow.postMessage(postData, this._adMsgTarget);
                    this._adIframe1Loaded = true;
                }
            }
        } else {
            console.error('Failed to get advertisement: ', _data);
        }
    }

    /**
     * 获取广告物料
     * @private
     */
    _requestCommonadMaterial() {
       let url = `dueros://f34646bc-37b4-a9db-361f-48fe7ca8831d/getAdResources?adPlaceId=${this.config.adPlaceId}&botId=${this.config.skillID}`
        this.uploadLinkClicked({
            url,
            initiator: {
                type: 'AUTO_TRIGGER'
            }
        });
    }

    _setAdPosition() {
        // 如果是竖屏游戏
        if (this.config.screenOrientation === 'portrait') {
            this._adIframe1.style.cssText += 'width: 242px; height: 214px;bottom: 30px;';
            if (this._lastVerticalAdDisplayIsLeft) {
                this._adIframe1.style.left = '';
                this._adIframe1.style.right = '23px';
            } else {
                this._adIframe1.style.left = '23px';
                this._adIframe1.style.right = '';
            }
        // 如果是全屏游戏
        } else if (this.config.screenOrientation === 'landscape') {
            this._adIframe1.style.cssText += 'width: 446px; height: 118px;';
            if (isSet(this.config.adBannerPosition.top)) {
                this._adIframe1.style.top = this.config.adBannerPosition.top;
            }
            if (isSet(this.config.adBannerPosition.right)) {
                this._adIframe1.style.right = this.config.adBannerPosition.right;
            }
            if (isSet(this.config.adBannerPosition.bottom)) {
                this._adIframe1.style.bottom = this.config.adBannerPosition.bottom;
            }
            if (isSet(this.config.adBannerPosition.left)) {
                this._adIframe1.style.left = this.config.adBannerPosition.left;
            }
        }
    }

    /**
     * 开始轮换广告
     * @param {boolean} fireImmediately 是否立即轮换一次广告
     * @private
     */
    _startCommonAdSwitch(fireImmediately) {
        this._isCommonAdSwitchOff = false;
        if (fireImmediately) {
            // 请求到素材后，会在onHandleIntent里处理
            this._requestCommonadMaterial();
        }
        clearInterval(this._commonAdSwitchTimer);
        this._commonAdSwitchTimer = setInterval(() => {
            // 请求到素材后，会在onHandleIntent里处理
            this._requestCommonadMaterial();
        }, this._commonadSwitchInterval);
    }


    _closeCommonAd() {
        clearInterval(this._commonAdSwitchTimer);
        this._isCommonAdSwitchOff = true;
        this._adIframe1.style.display = 'none';
        this._isCommonAdDisplaying = false;
    }

    /**
     * 暂停广告轮换
     * @private
     */
    _pauseCommonAd() {
        clearInterval(this._commonAdSwitchTimer);
        this._isCommonAdSwitchOff = true;
    }

    screenTouched = () => {
        window.removeEventListener('touchstart', this.screenTouched, true);
        this._startCommonAdSwitch(true);
    }
}

module.exports = BotApp;
