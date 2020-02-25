/* eslint-disable */'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ServiceError = exports.LowVersionErrorMsg = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @file 各种报错信息
 * @author dengxuening<dengxuening@baidu.com>
 */

/**
 * SHOW设备版本低时的错误
 */
var LowVersionErrorMsg = exports.LowVersionErrorMsg = function LowVersionErrorMsg() {
    (0, _classCallCheck3.default)(this, LowVersionErrorMsg);

    this.code = 1001;
    this.msg = 'Device version too low';
};

var ServiceError = exports.ServiceError = function ServiceError(msg) {
    (0, _classCallCheck3.default)(this, ServiceError);

    this.code = 1002;
    this.msg = 'Service error, ' + msg;
};