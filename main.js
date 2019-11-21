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
     * @param {string} config.skillID // 可选字段
     */
    constructor (config = {}) {
        this.config = config;
        this._init();
    }

    _init() {
        const registerConfig = JSON.stringify({
            random1: this.config.random1,
            signature1: this.config.signature1,
            random2: this.config.random2,
            signature2: this.config.signature2,
        });

        this._postMessageTarget = 'https://www.xiaodu.baidu.com';


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
        });

        if (this.isInApp()) {
            this._createOAuthIframe();
            window.addEventListener('message', event => {
                if (event.origin === this._postMessageTarget) {
                    let data = event.data;
                    console.log('receive message from iframe', data);
                    if (data.type === 'authorized_success' || data.type === 'authorized_fail') {
                        this._linkAccountResultCb(data);
                        this._hideOAuthIframe();
                    } else if (data.type === 'bot_info') {
                        this.registerResult = data.data;
                        this.registerCallback && this.registerCallback(this.registerResult);
                        this.registerCallback = null;
                    } else if (data.type === 'ship') {
                        this._getShipPayResult && this._getShipPayResult(data.err, data.data);
                    }
                }
            });
            window.addEventListener('popstate', event => {
                if (!event.state) {
                    this._deleteOrderIframe();
                    this.oAuthIframeDOM.contentWindow.postMessage({
                        type: 'ship',
                        data: {
                            ...this._buyData
                        }
                    }, this._postMessageTarget);
                }
            })
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

    _validateCallback(fnName, arg) {
        if (typeof arg !== 'function') {
            throw new TypeError(`[${fnName}]'s arguments[0] must be a function, but get a ${typeof arg}`);
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

    _encodeQueryData(data) {
        if (data) {
            return Object.keys(data).map(k => {
                return `${k}=${encodeURIComponent(data[k])}`;
            }).join('&');
        } else {
            return '';
        }
    }

    _createOAuthIframe() {
        if (this.oAuthIframeDOM) {
            this.oAuthIframeDOM.style.display = 'block';
        } else {
            let iframeQuery = {
                botId: this.config.skillID,
                random1: this.config.random1,
                signature1: this.config.signature1,
                random2: this.config.random2,
                signature2: this.config.signature2
            };
            let iframe = this.oAuthIframeDOM = document.createElement('iframe');
            iframe.id = 'dueros_oauth_iframe';
            iframe.src = `https://xiaodu.baidu.com/saiya/sdk/iframe/oauth.html?${this._encodeQueryData(iframeQuery)}`;
            iframe.frameborder='no';
            iframe.scrolling='no';
            // iframe.allowtransparency='yes';
            let styleTxt = 'width: 100%;'
                + 'display: none;'
                + 'height: 100vh;'
                + 'position: fixed;'
                + 'left: 0;'
                + 'bottom: 0;'
                + 'z-index: 100;'
                + 'border: none;'
                + 'margin: 0;'
                + 'padding: none;';
            iframe.style.cssText = styleTxt;
            document.body.appendChild(iframe);
        }
    }

    _createOrderIframe(src) {
        if (this.orderIframeDOM) {
            this.orderIframeDOM.src = src;
            document.body.appendChild(this.orderIframeDOM);
        } else {
            let iframe = this.orderIframeDOM = document.createElement('iframe');
            iframe.id = 'dueros_order_iframe';
            iframe.src = src;
            iframe.frameborder='no';
            // iframe.scrolling='no';
            iframe.allowtransparency='yes';
            iframe.style.cssText = 'width: 100%;'
                + 'background-color: #fff;'
                + 'height: 100vh;'
                + 'position: fixed;'
                + 'left: 0;'
                + 'bottom: 0;'
                + 'z-index: 100;'
                + 'border: none;'
                + 'margin: 0;'
                + 'padding: none;';
            document.body.appendChild(iframe);
        }
    }

    _showOAuthIframe() {
        this.oAuthIframeDOM.style.display = 'block';
        this._deleteOrderIframe();
    }

    _routeOrderIframe() {
        let stateObj = {
            showOrder: true,
            _t: Date.now()
        };
        window.history.pushState(stateObj, '', 'dueros_order');
    }

    _hideOAuthIframe() {
        this.oAuthIframeDOM.style.display = 'none';
    }

    // 删除订单iframe，注意此时必须删除，
    // 因为iframe的浏览历史记录也会同步到浏览器里
    // 将导致iframe的显示、隐藏难以管理
    _deleteOrderIframe() {
        if (this.orderIframeDOM && document.getElementById('dueros_order_iframe')) {
            document.body.removeChild(this.orderIframeDOM);
        }
    }

    requireShipping() {
        if (this.config.skillID) {
            let link = `http://${this.config.skillID}/path?openbot=true&request={\"query\":{\"type\":\"TEXT\",\"original\":\"ReadyForShipping\",\"rewritten\":\"ReadyForShipping\"},\"dialogState\":\"COMPLETED\",\"intents\":[{\"name\":\"ReadyForShipping\",\"score\":100,\"confirmationStatus\":\"NONE\",\"slots\":[]}]}`;
            this.uploadLinkClicked({
                url: link
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
            this._showOAuthIframe();
            this._linkAccountResultCb = cb;
        } else {
            if (cb) {
                console.warn('requireLinkAccount: Your H5 app is running on the `SHOW` device, and the callback function will not be called');
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
     */
    requireCharge(data) {
        data = JSON.stringify(data);
        this._getJSBridge(bridge => {
            bridge.callHandler('requireCharge', data);
        });
    }

    requireBuy(data, cb) {
        if (this.isInApp()) {
            if (!data || !data.productId || !data.sellerOrderId) {
                let e = new Error();
                e.name = 'params error';
                e.message = 'requireBuy: arguments[0] must be an `Object` with `productId` and `sellerOrderId`'
                throw e;
            }

            this._getShipPayResult = cb;
            let postData = {
                ...data,
                product2: `${data.productId}|${data.sellerOrderId}|skillstoreapp`
            };
            let baseUrl = 'https://xiaodu.baidu.com/dbppay/skill-pay/product/buy?';
            let iframeUrl = baseUrl += this._encodeQueryData(postData);
            this._createOrderIframe(iframeUrl);
            this._routeOrderIframe();
            this._buyData = data;
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
     * 请求关闭app
     */
    requestClose() {
        this._getJSBridge(bridge => {
            bridge.callHandler('requestClose');
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
