/* eslint-disable */
'use strict';

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _jsonp2 = require('jsonp');

var _jsonp3 = _interopRequireDefault(_jsonp2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @callback requestCallback 一种回调函数(随便定义的名字。。。)
 */

/**
 * 与Native的交互做了封装
 * @class
 */
var BotApp = function () {

    /**
     * @constructor
     * @param {Object} config 身份校验等相关信息
     * @param {string} config.random1 // 随机字符串，长度不限，由开发者自己生成
     * @param {string} config.signature1 // 将(random1 + appkey)的字符串拼接后做MD5运算得出
     * @param {string} config.random2 //  随机字符串，长度不限，由开发者自己生成
     * @param {string} config.signature2 // 将(random2 + appkey)的字符串拼接后做MD5运算得出
     * @param {string} config.skillID // 可选字段
     */
    function BotApp() {
        var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        (0, _classCallCheck3.default)(this, BotApp);

        this.config = (0, _extends3.default)({
            zIndex: 100
        }, config);
        this._init();
    }

    (0, _createClass3.default)(BotApp, [{
        key: '_init',
        value: function _init() {
            var _this = this;

            var registerConfig = (0, _stringify2.default)({
                random1: this.config.random1,
                signature1: this.config.signature1,
                random2: this.config.random2,
                signature2: this.config.signature2,
                botId: this.config.skillID
            });

            this._msgTarget = 'https://xiaodu.baidu.com';

            this._getJSBridge(function (bridge) {
                bridge.init(function (message, responseCallback) {
                    var data = {
                        'Javascript Responds': 'Ready!'
                    };
                    console.log('Receive bridge init message from native: ' + message);
                    responseCallback(data);
                });

                // Native依赖这几个参数进行身份校验
                bridge.callHandler('register', registerConfig, function (payload) {
                    payload = JSON.parse(payload);
                    _this.registerResult = payload;
                    _this.registerCallback && _this.registerCallback(payload);
                    _this.registerCallback = null;

                    if (_this.config.skillID) {
                        _this.requireShipping();
                    }
                });
            });

            if (this.isInApp()) {
                this._createOAuthIframe();
                this._checkOrderInfo();
                this._requestRegister(registerConfig, function (err, data) {
                    if (!err) {
                        _this._getBotInfo();
                        window.addEventListener('message', function (event) {
                            if (event.origin === _this._msgTarget) {
                                var _data = event.data;
                                console.log('receive iframe\'s message', _data);
                                if (_data.type === 'allow_authorize') {
                                    _this._requireOAuth(function (msg) {
                                        _this._linkAccountResultCb && _this._linkAccountResultCb(msg);
                                        _this._postMessage({
                                            type: 'authorized_finish'
                                        });
                                        _this._hideOAuthIframe();
                                    });
                                } else if (_data.type === 'deny_authorize') {
                                    _this._linkAccountResultCb && _this._linkAccountResultCb({
                                        type: 'authorized_fail',
                                        data: 'Not allow'
                                    });
                                    _this._hideOAuthIframe();
                                }
                            }
                        });
                    } else {
                        console.error(err);
                    }
                });
            }
        }
    }, {
        key: '_postMessage',
        value: function _postMessage(data) {
            var _this2 = this;

            if (this.oAuthIframeDOM && this.oAuthIframeDOM.contentWindow) {
                console.log('post message', data, this._msgTarget);
                this.oAuthIframeDOM.contentWindow.postMessage(data, this._msgTarget);
            } else {
                this.oAuthIframeDOM.addEventListener('load', function () {
                    _this2.oAuthIframeDOM.contentWindow.postMessage(data, _this2._msgTarget);
                });
            }
        }

        // 运行在小度App里的H5调用本方法注册

    }, {
        key: '_requestRegister',
        value: function _requestRegister(config, cb) {
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
    }, {
        key: '_jsonp',
        value: function _jsonp(_ref) {
            var url = _ref.url,
                params = _ref.params,
                jsonpCallback = _ref.jsonpCallback,
                callback = _ref.callback;

            var requestUrl = url + '?' + this._encodeQueryData(params);
            (0, _jsonp3.default)(requestUrl, {
                param: 'callback',
                name: jsonpCallback,
                prefix: 'dueros_'
            }, callback);
        }
    }, {
        key: '_getBotInfo',
        value: function _getBotInfo() {
            var _this3 = this;

            this._jsonp({
                url: '/voiceapp/h5getbotinfo',
                params: {
                    botId: this.config.skillID
                },
                jsonpcallback: 'botInfo',
                callback: function callback(err, data) {
                    console.log('get bot info', data);
                    var msg = {};
                    if (err) {
                        _this3._postMessage({
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
                            _this3._postMessage({
                                type: 'bot_info',
                                data: data.data,
                                err: null
                            });
                        } else {
                            _this3.errMsg = data.msg;
                            msg = {
                                accessToken: null
                            };
                            _this3._postMessage({
                                type: 'bot_info',
                                data: null,
                                err: data.msg
                            });
                        }
                    }
                    _this3.registerResult = msg;
                    _this3.registerCallback && _this3.registerCallback(_this3.registerResult);
                    _this3.registerCallback = null;
                }
            });
        }
    }, {
        key: 'getCookie',
        value: function getCookie(name) {
            var search = name + '='; // 查询检索的值
            var returnvalue = ''; // 返回值
            if (document.cookie.length > 0) {
                var sd = document.cookie.indexOf(search);
                if (sd !== -1) {
                    sd += search.length;
                    var end = document.cookie.indexOf(';', sd);
                    if (end === -1) {
                        end = document.cookie.length;
                    }
                    returnvalue = document.cookie.substring(sd, end);
                }
            }
            return returnvalue;
        }
    }, {
        key: 'setCookie',
        value: function setCookie(cname, cvalue) {
            var exdays = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

            var d = new Date();
            d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
            var expires = 'expires=' + d.toGMTString();
            document.cookie = cname + '=' + cvalue + '; ' + expires;
        }

        // 将订单ID存入cookie，用于轮询订单完成情况

    }, {
        key: '_cacheBuyData',
        value: function _cacheBuyData(data) {
            this.setCookie('dueros_order', data.sellerOrderId, 365);
        }
    }, {
        key: '_checkOrderInfo',
        value: function _checkOrderInfo() {
            var _this4 = this;

            clearInterval(this._itTimer);
            this._itTimer = setInterval(function () {
                log('check order');
                var sellerOrderId = _this4.getCookie('dueros_order');
                if (sellerOrderId) {
                    clearInterval(_this4._itTimer);
                    _this4._retryTimes = 2;
                    _this4._xiaoduAppShipping(sellerOrderId);
                }
            }, 2000);
        }
    }, {
        key: '_destroyCacheOrder',
        value: function _destroyCacheOrder() {
            this.setCookie('dueros_order', '', 0);
        }
    }, {
        key: '_xiaoduAppShipping',
        value: function _xiaoduAppShipping(sellerOrderId) {
            var _this5 = this;

            this._jsonp({
                url: '/voiceapp/shippingorder',
                params: {
                    botId: this.config.skillID,
                    sellerOrderId: sellerOrderId,
                    source: 'skillstoreapp' // 目前写死
                },
                jsonpCallback: 'ship',
                callback: function callback(err, data) {
                    if (err) {
                        _this5._getShipPayResult && _this5._getShipPayResult(err, null);
                        _this5._destroyCacheOrder();
                    } else {
                        var postData = {};
                        if (data.status === 0) {
                            var receiveData = data.data && data.data.length && data.data[0];
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
                                _this5._getShipPayResult && _this5._getShipPayResult(null, postData);
                                _this5._destroyCacheOrder();
                                // 由于后端发货相关通知是异步的，所以这里
                                // 设定一个重试机制
                            } else {
                                if (_this5._retryTimes > 0) {
                                    _this5._retryTimes = _this5._retryTimes - 1;
                                    clearTimeout(_this5.timer);
                                    _this5.timer = setTimeout(function () {
                                        _this5._xiaoduAppShipping(sellerOrderId);
                                    }, 1000);
                                } else {
                                    postData = {
                                        authorizationDetails: null,
                                        baiduOrderReferenceId: receiveData.baiduOrderReferenceId,
                                        purchaseResult: 'ERROR', // 此次支付结果。 -枚举值，选值范围： - SUCCESS 支付成功 - ERROR 支付发生错误
                                        message: '支付失败'
                                    };
                                    _this5._getShipPayResult && _this5._getShipPayResult(null, postData);
                                    _this5._destroyCacheOrder();
                                }
                            }
                        } else {
                            _this5._getShipPayResult && _this5._getShipPayResult(data.msg, data.data);
                            _this5._destroyCacheOrder();
                        }
                    }
                }
            });
        }
    }, {
        key: '_requireOAuth',
        value: function _requireOAuth(cb) {
            this._jsonp({
                url: '/saiya/v1/h5authorize/appauth',
                params: {
                    botId: this.config.skillID
                },
                jsonpCallback: 'appauth',
                callback: function callback(err, data) {
                    var msg = null;
                    if (err) {
                        msg = {
                            type: 'authorized_fail',
                            data: err
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
    }, {
        key: '_getJSBridge',
        value: function _getJSBridge(cb) {
            if (window.WebViewJavascriptBridge) {
                cb(window.WebViewJavascriptBridge);
            } else {
                document.addEventListener('WebViewJavascriptBridgeReady', function () {
                    cb(WebViewJavascriptBridge);
                }, false);
            }
        }
    }, {
        key: '_validateCallback',
        value: function _validateCallback(fnName, arg) {
            if (typeof arg !== 'function') {
                throw new TypeError('[' + fnName + ']\'s arguments[0] must be a function, but get a ' + typeof arg);
            }
        }

        // 判断APP的类型

    }, {
        key: 'isInApp',
        value: function isInApp() {
            if (this._appType) {
                return this._appType;
            } else {
                var ua = window.navigator.userAgent.toLowerCase();
                var appType = '';
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
    }, {
        key: '_encodeQueryData',
        value: function _encodeQueryData(data) {
            if (data) {
                return (0, _keys2.default)(data).map(function (k) {
                    return k + '=' + encodeURIComponent(data[k]);
                }).join('&');
            } else {
                return '';
            }
        }
    }, {
        key: '_createOAuthIframe',
        value: function _createOAuthIframe() {
            if (this.oAuthIframeDOM) {
                this.oAuthIframeDOM.style.display = 'block';
            } else {
                var iframe = this.oAuthIframeDOM = document.createElement('iframe');
                iframe.id = 'dueros_oauth_iframe';
                iframe.src = 'https://xiaodu.baidu.com/saiya/sdk/iframe/oauth.html';
                iframe.frameborder = 'no';
                iframe.scrolling = 'no';
                // iframe.allowtransparency='yes';
                var styleTxt = 'width: 100%;' + 'display: none;' + 'height: 100vh;' + 'position: fixed;' + 'left: 0;' + 'bottom: 0;' + 'z-index: ' + this.config.zIndex + ';' + 'border: none;' + 'margin: 0;' + 'padding: none;';
                iframe.style.cssText = styleTxt;
                document.body.appendChild(iframe);
            }
        }
    }, {
        key: '_showOAuthIframe',
        value: function _showOAuthIframe() {
            this.oAuthIframeDOM.style.display = 'block';
        }
    }, {
        key: '_hideOAuthIframe',
        value: function _hideOAuthIframe() {
            this.oAuthIframeDOM.style.display = 'none';
        }
    }, {
        key: 'requireShipping',
        value: function requireShipping() {
            if (this.config.skillID) {
                var link = 'http://' + this.config.skillID + '/path?openbot=true&request={"query":{"type":"TEXT","original":"ReadyForShipping","rewritten":"ReadyForShipping"},"dialogState":"COMPLETED","intents":[{"name":"ReadyForShipping","score":100,"confirmationStatus":"NONE","slots":[]}]}';
                this.uploadLinkClicked({
                    url: link
                });
            } else {
                throw new Error('Missing `skillID`, please configure `skillID` when initializes the `BotApp`');
            }
        }
    }, {
        key: 'getRegisterResult',
        value: function getRegisterResult(cb) {
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

    }, {
        key: 'requireLinkAccount',
        value: function requireLinkAccount(cb) {
            if (this.isInApp()) {
                this._validateCallback('requireLinkAccount', cb);
                this._showOAuthIframe();
                this._linkAccountResultCb = cb;
            } else {
                if (cb) {
                    console.warn('requireLinkAccount: Your H5 app is running on the `SHOW` device, and the callback function will not be called');
                }
                this._getJSBridge(function (bridge) {
                    bridge.callHandler('requireLinkAccount');
                });
            }
        }

        /**
         * 接收账号oauth授权成功指令
         * @param {requestCallback} cb 授权成功后会调用此函数
         */

    }, {
        key: 'onLinkAccountSuccess',
        value: function onLinkAccountSuccess(cb) {
            this._validateCallback('onLinkAccountSuccess', cb);
            this._getJSBridge(function (bridge) {
                bridge.registerHandler('onLinkAccountSuccess', function (payload, callback) {
                    cb(JSON.parse(payload));
                    callback(true);
                });
            });
        }

        /**
         * 发起收款操作，调用此函数小度有屏音箱
         * 会展示付款二维码
         * @param {Object} data 携带订单号，商品名称等参数
         */

    }, {
        key: 'requireCharge',
        value: function requireCharge(data) {
            data = (0, _stringify2.default)(data);
            this._getJSBridge(function (bridge) {
                bridge.callHandler('requireCharge', data);
            });
        }
    }, {
        key: 'requireBuy',
        value: function requireBuy(data, cb) {
            if (this.isInApp()) {
                if (!data || !data.productId || !data.sellerOrderId) {
                    var e = new Error();
                    e.name = 'params error';
                    e.message = 'requireBuy: arguments[0] must be an `Object` with `productId` and `sellerOrderId`';
                    throw e;
                }
                var postData = (0, _extends3.default)({}, data, {
                    product2: data.productId + '|' + data.sellerOrderId + '|skillstoreapp'
                });
                var baseUrl = 'https://xiaodu.baidu.com/dbppay/skill-pay/product/buy?';
                var buyUrl = baseUrl += this._encodeQueryData(postData);
                this._cacheBuyData(data);
                this._checkOrderInfo();
                location.href = buyUrl;
            } else {
                console.error('Method `requireBuy` can only be called in App');
            }
        }
    }, {
        key: 'onBuyStatusChange',
        value: function onBuyStatusChange(cb) {
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

    }, {
        key: 'uploadLinkClicked',
        value: function uploadLinkClicked(data) {
            data = (0, _stringify2.default)(data);
            this._getJSBridge(function (bridge) {
                bridge.callHandler('uploadLinkClicked', data);
            });
        }

        /**
         * 接收DuerOS收款成功后的通知
         * @param {Function} cb 收款成功后会调用此函数
         */

    }, {
        key: 'onChargeStatusChange',
        value: function onChargeStatusChange(cb) {
            this._validateCallback('onChargeStatusChange', cb);
            this._getJSBridge(function (bridge) {
                bridge.registerHandler('onChargeStatusChange', function (payload, callback) {
                    cb(JSON.parse(payload));
                    callback(true);
                });
            });
        }

        /**
         * 接收DuerOS下发的意图解析结果
         * @param {requestCallback} cb 收到意图解析结果后此回调函数会被触发
         */

    }, {
        key: 'onHandleIntent',
        value: function onHandleIntent(cb) {
            this._validateCallback('onHandleIntent', cb);
            this._getJSBridge(function (bridge) {
                bridge.registerHandler('onHandleIntent', function (payload, callback) {
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

    }, {
        key: 'updateUiContext',
        value: function updateUiContext(data, cb) {
            if (cb) {
                this._validateCallback('updateUiContext', cb);
            }
            data = (0, _stringify2.default)(data);
            this._getJSBridge(function (bridge) {
                bridge.callHandler('updateUiContext', data, function (result) {
                    cb && cb(result);
                });
            });
        }

        /**
         * 开启聆听。设备进入语音交互状态
         * @param {requestCallback} [cb] 可选参数，该函数会收到聆听是否发起成功的的数据
         */

    }, {
        key: 'listen',
        value: function listen(cb) {
            if (cb) {
                this._validateCallback('listen', cb);
            }
            this._getJSBridge(function (bridge) {
                bridge.callHandler('listen', function (result) {
                    cb && cb(result);
                });
            });
        }

        /**
         * 播报TTS语音
         * @param {string} data 要播报的文字
         * @param {requestCallback} [cb] 可选参数，TTS播报完毕后会回调此函数
         */

    }, {
        key: 'speak',
        value: function speak(data, cb) {
            if (cb) {
                this._validateCallback('speak', cb);
            }
            this._getJSBridge(function (bridge) {
                bridge.callHandler('speak', data, function () {
                    // TTS 播报完毕后调用此函数
                    cb && cb();
                });
            });
        }

        /**
         * 请求关闭app
         */

    }, {
        key: 'requestClose',
        value: function requestClose() {
            this._getJSBridge(function (bridge) {
                bridge.callHandler('requestClose');
            });
        }

        /**
         * 接收ClickLink。ClickLink是一种Directive，用户新增自定义交互之后，云端会解析用户定义的交互，
         * 下发对应的指令。例如APP通过updateUiContext(UiContextPayload)新增自定义交互之后DuerOS会通
         * 过此接口下发上面定义的url。
         * @param {requestCallback} cb
         */

    }, {
        key: 'onClickLink',
        value: function onClickLink(cb) {
            this._validateCallback('onClickLink', cb);
            this._getJSBridge(function (bridge) {
                bridge.registerHandler('onClickLink', function (payload, callback) {
                    cb(JSON.parse(payload));
                    // 告知app是否处理成功
                    callback(true);
                });
            });
        }

        /**
         * 屏幕监听屏幕导航指令。
         * @param {requestCallback} cb 当用户发起语音请求，要求滚动屏幕时，本回调函数会被调用。
         */

    }, {
        key: 'onHandleScreenNavigatorEvent',
        value: function onHandleScreenNavigatorEvent(cb) {
            this._validateCallback('onHandleScreenNavigatorEvent', cb);
            this._getJSBridge(function (bridge) {
                bridge.registerHandler('onHandleScreenNavigatorEvent', function (payload, callback) {
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
                    callback(true); // 告知处理是否成功
                });
            });
        }
    }]);
    return BotApp;
}(); /*
      * @file H5 bot app SDK
      * @author dengxuening<dengxuening@baidu.com>
      */

module.exports = BotApp;