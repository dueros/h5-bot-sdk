/*
 * @file H5 bot app SDK
 * @author dengxuening<dengxuening@baidu.com>
 */

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
     * @param {Object} config 身份校验等相关信息
     * @param {string} config.random1 // 随机字符串，长度不限，由开发者自己生成
     * @param {string} config.signature1 // 将(random1 + appkey)的字符串拼接后做MD5运算得出
     * @param {string} config.random2 //  随机字符串，长度不限，由开发者自己生成
     * @param {string} config.signature2 // 将(random2 + appkey)的字符串拼接后做MD5运算得出
     */
    constructor (config = {}) {
        this.config = config;
        this.registerResult = null; // 缓存注册结果
        this.registerCallback = null; // 缓存注册结果获取的回调函数
        this._init(config);
    }

    _init(config) {
        const registerConfig = JSON.stringify({
            random1: this.config.random1,
            signature1: this.config.signature1,
            random2: this.config.random2,
            signature2: this.config.signature2
        });

        this._getJSBridge(bridge => {
            bridge.init(function(message, responseCallback) {
                var data = {
                    'Javascript Responds': 'Ready!'
                };
                console.log('Receive bridge init message from native: ' + message);
                responseCallback(data);
            });
        });

        this._getJSBridge(bridge => {
            // Native依赖这几个参数进行身份校验
            bridge.callHandler('register', registerConfig, payload => {
                payload = JSON.parse(payload);
                this.registerResult = payload;
                this.registerCallback && this.registerCallback(payload);
                this.registerCallback = null;
            });
        });
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

    _validateCallback(fnName, arg) {
        if (typeof arg !== 'function') {
            throw new TypeError(`[${fnName}]'s arguments[0] must be a function, but get a ${typeof arg}`);
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
     * 小度有屏音箱会展示一个授权页面
     */
    requireLinkAccount() {
        this._getJSBridge(bridge => {
            bridge.callHandler('requireLinkAccount');
        });
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
     */
    requireCharge(data) {
        data = JSON.stringify(data);
        this._getJSBridge(bridge => {
            bridge.callHandler('requireCharge', data);
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
        this._getJSBridge(bridge => {
            bridge.registerHandler('onHandleIntent',  function (payload, callback) {
                cb(JSON.parse(payload));
                callback('js 回调');
            });
        });
    }

    /**
     * 新增一个自定义交互元素描述。
     * @param {Object} data 需要上传的端状态数据
     * @param {requestCallback} [cb] 可选参数，发起上传操作后的回调
     */
    updateUiContext(data, cb) {
        if (cb) {
            this._validateCallback('updateUiContext', cb);
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
            this._validateCallback('speak', cb);
        }
        this._getJSBridge(bridge => {
            bridge.callHandler('speak', data, function () {
                // TTS 播报完毕后调用此函数
                cb && cb();
            });
        });
    }

    /**
     * 接收ClickLink。ClickLink是一种Directive，用户新增自定义交互之后，云端会解析用户定义的交互，
     * 下发对应的指令。例如APP通过updateUiContext(UiContextPayload)新增自定义交互之后DuerOS会通
     * 过此接口下发上面定义的url。
     * @param {requestCallback} cb
     */
    onClickLink(cb) {
        this._validateCallback('onClickLink', cb);
        this._getJSBridge(bridge => {
            bridge.registerHandler('onClickLink',  function (payload, callback) {
                cb(JSON.parse(payload));
                // 告知app是否处理成功
                callback(true);
            })
        });
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
}

module.exports = BotApp;
