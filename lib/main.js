/* eslint-disable */'use strict';

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _errors = require('./errors');

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

        this.config = config;
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
                signature2: this.config.signature2
            });

            this._msgTarget = 'http://xiaodu.baidu.com';

            if (this.isInApp()) {
                window.addEventListener('message', function (event) {
                    var data = event.data;
                    if (data.type === 'wrapper_location_protocal') {
                        // 如果检测到父页面是https协议的，则升级为https
                        if (data.data.indexOf('https') > -1) {
                            _this._msgTarget = 'https://xiaodu.baidu.com';
                        }
                        // 确认链接是否是https之后开始注册
                        window.parent.postMessage({
                            type: 'register',
                            data: _this.config
                        }, _this._msgTarget);
                    }

                    if (event.origin === _this._msgTarget) {
                        console.log('receive h5game-wrapper\'s message ', data);
                        if (data.type === 'authorized_success' || data.type === 'authorized_fail') {
                            _this._linkAccountResultCb(data);
                        } else if (data.type === 'bot_info') {
                            _this.registerResult = data.data;
                            _this.registerCallback && _this.registerCallback(_this.registerResult);
                            _this.registerCallback = null;
                        } else if (data.type === 'ship') {
                            _this._getShipPayResult && _this._getShipPayResult(data.err, data.data);
                        }
                    }
                });
            } else {
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
            }
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

        /**
         * 将SHOW端设备里的版本后解析出来
         * @returns {string}
         * @private
         */

    }, {
        key: '_parseShowVersion',
        value: function _parseShowVersion() {
            if (this._showVersion) {
                return this._showVersion;
            }
            var ua = navigator.userAgent;
            var reg = /build\/([\d\.]+);/i;
            var result = reg.exec(ua);
            if (result) {
                this._showVersion = result[1];
                return result[1];
            } else {
                throw new Error('Show version number parsing failed: ' + ua);
            }
        }

        /**
         * SHOW端设备的版本号对比
         * @param {string} a 版本号
         * @param {string} b 版本号
         * @returns {number} 如果返回0，则表示版本号相同，如果返回1，a版本号大于b版本号，如果返回-1则a版本号小于b
         * @private
         */

    }, {
        key: '_compareShowVersion',
        value: function _compareShowVersion(a, b) {
            var _String$split = String(a).split('.'),
                _String$split2 = (0, _slicedToArray3.default)(_String$split, 4),
                a1 = _String$split2[0],
                a2 = _String$split2[1],
                a3 = _String$split2[2],
                a4 = _String$split2[3];

            var _String$split3 = String(b).split('.'),
                _String$split4 = (0, _slicedToArray3.default)(_String$split3, 4),
                b1 = _String$split4[0],
                b2 = _String$split4[1],
                b3 = _String$split4[2],
                b4 = _String$split4[3];

            var aSize = Number(a1) * 1000 + Number(a2) * 100 + Number(a3) * 10 + Number(a4);
            var bSize = Number(b1) * 1000 + Number(b2) * 100 + Number(b3) * 10 + Number(b4);
            if (aSize === bSize) {
                return 0;
            } else if (aSize > bSize) {
                return 1;
            } else {
                return -1;
            }
        }

        // 获取用户实名认证的年龄段信息
        // SHOW 1.35.0.0及其以后的版本可用

    }, {
        key: 'requireUserAgeInfo',
        value: function requireUserAgeInfo(cb) {
            var _this2 = this;

            if (this.isInApp()) {
                console.warn('requireUserAgeInfo: Your H5 app is not running on the App, and the callback function will not be called');
                return;
            } else {
                this._validateCallback('requireUserAgeInfo', cb);
                if (this._compareShowVersion(this._parseShowVersion(), '1.35.0.0') >= 0) {
                    if (this.config.skillID) {
                        this._getJSBridge(function (bridge) {
                            bridge.callHandler('requestUserAgeInfo', null, function (payload) {
                                payload = JSON.parse(payload);
                                if (payload.status === 0) {
                                    cb && cb(null, payload.data);
                                } else {
                                    cb && cb(new _errors.ServiceError('logid: ' + payload.logid + ', ' + payload.msg), payload.data);
                                    console.error('requireUserAgeInfo has an error: ', payload.logid, payload.msg);
                                }

                                if (payload.status !== 0 || Number(payload.data.is_auth) === 0) {
                                    var link = 'dueros://' + _this2.config.skillID + '/certification?action=realName';
                                    _this2.uploadLinkClicked({
                                        url: link
                                    });
                                }
                            });
                        });
                    } else {
                        throw new Error('Missing `skillID`, please configure `skillID` when initializes the `BotApp`');
                    }
                } else {
                    cb(new _errors.LowVersionErrorMsg(), null);
                }
            }
        }
    }, {
        key: 'requireShipping',
        value: function requireShipping() {
            if (this.config.skillID) {
                var link = 'dueros://' + this.config.skillID + '/readyForShipping';
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
                this._linkAccountResultCb = cb;
                window.parent.postMessage({
                    type: 'request_authorization'
                }, this._msgTarget);
            } else {
                if (cb) {
                    console.warn('requireLinkAccount: Your H5 app is not running on the App, and the callback function will not be called');
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
         * @param {Function} cb 购买结果回调，当在App中运行时本参数必填
         */

    }, {
        key: 'requireCharge',
        value: function requireCharge(data, cb) {
            if (this.isInApp()) {
                if (typeof cb !== 'function') {
                    throw new Error('requireCharge: Your web runs in App and and you must pass a function' + ' in the position of the second to handle the purchase result.');
                }
                this._getShipPayResult = cb;
                window.parent.postMessage({
                    type: 'charge',
                    data: data
                }, this._msgTarget);
            } else {
                data = (0, _stringify2.default)(data);
                this._getJSBridge(function (bridge) {
                    bridge.callHandler('requireCharge', data);
                });
            }
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
                if (typeof cb !== 'function') {
                    throw new Error('requireBuy: arguments[1] must be a function, but get a ' + typeof cb);
                }
                this._getShipPayResult = cb;
                var postData = (0, _extends3.default)({}, data, {
                    product2: data.productId + '|' + data.sellerOrderId + '|skillstoreapp',
                    source: 'skillstoreapp',
                    from: 'skillstoreapp'
                });

                window.parent.postMessage({
                    type: 'buy',
                    data: postData
                }, this._msgTarget);
            } else {
                console.error('Method `requireBuy` can only be called in App');
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
            if (this.isInApp()) {
                window.parent.postMessage({
                    type: 'closeWebView'
                }, this._msgTarget);
            } else {
                this._getJSBridge(function (bridge) {
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

    }, {
        key: 'onClickLink',
        value: function onClickLink(cb) {
            var _this3 = this;

            this._validateCallback('onClickLink', cb);
            this._getJSBridge(function (bridge) {
                bridge.registerHandler('onClickLink', function (payload, callback) {
                    payload = JSON.parse(payload);
                    if (payload.url === 'http://sdk.bot.dueros.ai?action=unknown_utterance') {
                        _this3._handleUnknowUtteranceCb && _this3._handleUnknowUtteranceCb(null, JSON.parse(payload.params));
                    } else {
                        cb(payload);
                    }
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
    }, {
        key: 'onDialogStateChanged',
        value: function onDialogStateChanged(cb) {
            this._validateCallback('onDialogStateChanged', cb);
            if (this._compareShowVersion(this._parseShowVersion(), '1.36.0.0') >= 0) {
                this._getJSBridge(function (bridge) {
                    bridge.registerHandler('onDialogStateChanged', function (state, callback) {
                        cb(null, state);
                        callback(true); // 告知处理是否成功
                    });
                });
            } else {
                cb(new _errors.LowVersionErrorMsg(), null);
            }
        }
    }, {
        key: 'onHandleUnknowUtterance',
        value: function onHandleUnknowUtterance(cb) {
            this._validateCallback('onHandleUnknowUtterance', cb);
            if (this._compareShowVersion(this._parseShowVersion(), '1.36.0.0') >= 0) {
                this._handleUnknowUtteranceCb = cb;
            } else {
                cb(new _errors.LowVersionErrorMsg(), null);
            }
        }
    }, {
        key: 'canGoBack',
        value: function canGoBack(cb) {
            this._validateCallback('canGoBack', cb);
            if (this._compareShowVersion(this._parseShowVersion(), '1.36.0.0') >= 0) {
                this._getJSBridge(function (bridge) {
                    bridge.callHandler('canGoBack', null, function (payload) {
                        payload = JSON.parse(payload);
                        cb(null, payload.data);
                    });
                });
            } else {
                cb(new _errors.LowVersionErrorMsg(), null);
            }
        }
    }]);
    return BotApp;
}(); /*
      * @file H5 bot app SDK
      * @author dengxuening<dengxuening@baidu.com>
      */

module.exports = BotApp;