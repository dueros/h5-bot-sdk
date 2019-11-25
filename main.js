/*
 * @file H5 bot app SDK
 * @author dengxuening<dengxuening@baidu.com>
 */

import jsonp from 'jsonp';

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
        this.config = {
            zIndex: 100,
            ...config
        };
        this._init();
    }

    _init() {
        const registerConfig = JSON.stringify({
            random1: this.config.random1,
            signature1: this.config.signature1,
            random2: this.config.random2,
            signature2: this.config.signature2,
            botId: this.config.skillID
        });

        this._msgTarget = 'https://xiaodu.baidu.com';

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
            this._checkOrderInfo();
            this._requestRegister(registerConfig, (err, data) => {
                if (!err) {
                    this._getBotInfo();
                    window.addEventListener('message', event => {
                        if (event.origin === this._msgTarget) {
                            let data = event.data;
                            console.log('receive iframe\'s message', data);
                            if (data.type === 'allow_authorize') {
                                this._requireOAuth(msg => {
                                    this._linkAccountResultCb && this._linkAccountResultCb(msg);
                                    this._postMessage({
                                        type: 'authorized_finish'
                                    });
                                    this._hideOAuthIframe();
                                });
                            } else if (data.type === 'deny_authorize') {
                                this._linkAccountResultCb && this._linkAccountResultCb({
                                    type: 'authorized_fail',
                                    data: 'Not allow'
                                });
                                this._hideOAuthIframe();
                            }
                        }
                    });
                } else {
                    console.error(err);
                }
            });
        }
    }

    _postMessage(data) {
        if (this.oAuthIframeDOM && this.oAuthIframeDOM.contentWindow) {
            console.log('post message', data, this._msgTarget);
            this.oAuthIframeDOM.contentWindow.postMessage(data, this._msgTarget)
        } else {
            this.oAuthIframeDOM.addEventListener('load', () => {
                this.oAuthIframeDOM.contentWindow.postMessage(data, this._msgTarget)
            });
        }
    }



    // 运行在小度App里的H5调用本方法注册
    _requestRegister(config, cb) {
        cb(null);
        // this.axios.get('/voiceapp/botverification', {
        //     params: {
        //         botId: config.skillID,
        //         random1: config.random1,
        //         signature1: config.signature1,
        //         random2: config.random2,
        //         signature2: config.signature2
        //     }
        // }).then(({data}) => {
        //     if (data.status === 0) {
        //         cb(null, 'verifi success');
        //     } else {
        //         cb(data.msg);
        //     }
        // }).catch(e => {
        //     cb(e);
        // });
    }

    _jsonp({url, params, jsonpCallback, callback}) {
        let requestUrl = this._msgTarget + url + '?' + this._encodeQueryData(params);
        jsonp(requestUrl, {
            param: 'callback',
            name: jsonpCallback,
            prefix: 'dueros_'
        }, callback);
    }

    _getBotInfo() {
        this._jsonp({
            url: '/voiceapp/h5getbotinfo',
            params: {
                botId: this.config.skillID
            },
            jsonpcallback: 'botInfo',
            callback: (err, data) => {
                console.log('get bot info', data);
                let msg = {};
                if (err) {
                    this._postMessage({
                        type: 'bot_info',
                        data: null,
                        err: err
                    });
                    msg = {
                        accessToken: null
                    };
                } else {
                    if (data.status === 0) {
                        msg = {
                            accessToken: data.data.access_token || null
                        };
                        this._postMessage({
                            type: 'bot_info',
                            data: data.data,
                            err: null
                        });
                    } else {
                        this.errMsg = data.msg;
                        msg = {
                            accessToken: null
                        };
                        this._postMessage({
                            type: 'bot_info',
                            data: null,
                            err: data.msg
                        });
                    }
                }
                this.registerResult = msg;
                this.registerCallback && this.registerCallback(this.registerResult);
                this.registerCallback = null;
            }
        })
    }

    getCookie(name) {
        let search = name + '='; // 查询检索的值
        let returnvalue = ''; // 返回值
        if (document.cookie.length > 0) {
            let sd = document.cookie.indexOf(search);
            if (sd !== -1) {
                sd += search.length;
                let end = document.cookie.indexOf(';', sd);
                if (end === -1) {
                    end = document.cookie.length;
                }
                returnvalue = document.cookie.substring(sd, end);
            }
        }
        return returnvalue;
    }

    setCookie(cname, cvalue, exdays = 1) {
        let d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        let expires = 'expires=' + d.toGMTString();
        document.cookie = cname + '=' + cvalue + '; ' + expires;
    }

    // 将订单ID存入cookie，用于轮询订单完成情况
    _cacheBuyData(data) {
        this.setCookie('dueros_order', data.sellerOrderId, 365);
    }

    _checkOrderInfo() {
        clearInterval(this._itTimer);
        this._itTimer = setInterval(() => {
            let sellerOrderId = this.getCookie('dueros_order');
            if (sellerOrderId) {
                clearInterval(this._itTimer);
                this._retryTimes = 2;
                this._xiaoduAppShipping(sellerOrderId);
            }
        }, 2000);
    }

    _destroyCacheOrder() {
        this.setCookie('dueros_order', '', 0);
    }

    _xiaoduAppShipping(sellerOrderId) {
        this._jsonp({
            url: '/voiceapp/shippingorder',
            params: {
                botId: this.config.skillID,
                sellerOrderId,
                source: 'skillstoreapp' // 目前写死
            },
            jsonpCallback: 'ship',
            callback: (err, data) => {
                if (err) {
                    this._getShipPayResult && this._getShipPayResult(err, null);
                    this._destroyCacheOrder();
                } else {
                    let postData = {};
                    if (data.status === 0) {
                        let receiveData = data.data && data.data.length && data.data[0];
                        // 如果已经返回数据
                        if (receiveData) {
                            postData = {
                                authorizationDetails: {
                                    authorizationAmount: { //
                                        amount: receiveData.sellerAmount, // 扣款金额。比如：1.09，数字字符串。系统取小数点后两位，单位：元
                                        currencyCode: 'CNY' // 枚举类型。目前只能为CNY
                                    },
                                    capturedAmount: {
                                        amount: receiveData.payAmount, // 实际百度扣款金额。比如：1.09，数字字符串。系统取小数点后两位，单位：元
                                        currencyCode: 'CNY' // 枚举类型。目前只能为CNY
                                    },
                                    creationTimestamp: receiveData.createTime // 订单创建时间。时间戳，单位毫秒
                                },
                                baiduOrderReferenceId: receiveData.baiduOrderReferenceId, // 此次交易百度生成的订单ID
                                purchaseResult: 'SUCCESS', // 此次支付结果。 -枚举值，选值范围： - SUCCESS 支付成功 - ERROR 支付发生错误
                                message: '支付成功' // 支付状态对应的消息
                            };
                            this._getShipPayResult && this._getShipPayResult(null, postData);
                            this._destroyCacheOrder();
                            // 由于后端发货相关通知是异步的，所以这里
                        // 设定一个重试机制
                        } else {
                            if (this._retryTimes > 0) {
                                this._retryTimes = this._retryTimes - 1;
                                clearTimeout(this.timer);
                                this.timer = setTimeout(() => {
                                    this._xiaoduAppShipping(sellerOrderId);
                                }, 1000);
                            } else {
                                postData = {
                                    authorizationDetails: null,
                                    baiduOrderReferenceId: receiveData.baiduOrderReferenceId,
                                    purchaseResult: 'ERROR', // 此次支付结果。 -枚举值，选值范围： - SUCCESS 支付成功 - ERROR 支付发生错误
                                    message: '支付失败'
                                };
                                this._getShipPayResult && this._getShipPayResult(null, postData);
                                this._destroyCacheOrder();
                            }
                        }
                    } else {
                        this._getShipPayResult && this._getShipPayResult(data.msg, data.data);
                        this._destroyCacheOrder();
                    }
                }
            }
        });
    }

    _requireOAuth(cb) {
        this._jsonp({
            url: '/saiya/v1/h5authorize/appauth',
            params: {
                botId: this.config.skillID
            },
            jsonpCallback: 'appauth',
            callback: (err, data) => {
                let msg = null;
                if (err) {
                    msg = {
                        type: 'authorized_fail',
                        data:err
                    };
                } else {
                    if (data.status === 0) {
                        msg = {
                            type: 'authorized_success',
                            data: {
                                accessToken: data.data.access_token
                            }
                        };
                    } else {
                        msg = {
                            type: 'authorized_fail',
                            data: data.msg
                        };
                    }
                }
                cb(msg);
            }
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
            let iframe = this.oAuthIframeDOM = document.createElement('iframe');
            iframe.id = 'dueros_oauth_iframe';
            iframe.src = `https://xiaodu.baidu.com/saiya/sdk/iframe/oauth.html`;
            iframe.frameborder = 'no';
            iframe.scrolling = 'no';
            // iframe.allowtransparency='yes';
            let styleTxt = 'width: 100%;'
                + 'display: none;'
                + 'height: 100vh;'
                + 'position: fixed;'
                + 'left: 0;'
                + 'bottom: 0;'
                + 'z-index: ' + this.config.zIndex + ';'
                + 'border: none;'
                + 'margin: 0;'
                + 'padding: none;';
            iframe.style.cssText = styleTxt;
            document.body.appendChild(iframe);
        }
    }

    _showOAuthIframe() {
        this.oAuthIframeDOM.style.display = 'block';
    }

    _hideOAuthIframe() {
        this.oAuthIframeDOM.style.display = 'none';
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
                e.message = 'requireBuy: arguments[0] must be an `Object` with `productId` and `sellerOrderId`';
                throw e;
            }
            let postData = {
                ...data,
                product2: `${data.productId}|${data.sellerOrderId}|skillstoreapp`
            };
            let baseUrl = 'https://xiaodu.baidu.com/dbppay/skill-pay/product/buy?';
            let buyUrl = baseUrl += this._encodeQueryData(postData);
            this._cacheBuyData(data);
            this._checkOrderInfo();
            location.href = buyUrl;
        } else {
            console.error('Method `requireBuy` can only be called in App');
        }
    }

    onBuyStatusChange(cb) {
        if (this.isInApp()) {
            this._validateCallback('onBuyStatusChange', cb);
            this._getShipPayResult = cb;
        } else {
            console.error('Method `onBuyStatusChange` can only be called in App');
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
