/* eslint-disable */'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

exports.getQuery = getQuery;
exports.encodeQueryData = encodeQueryData;
exports.isSet = isSet;
exports.parseH5Url = parseH5Url;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @file 工具函数
 * @author dengxuening<dengxuening@baidu.com>
 */

function getQuery(query) {
    query = query ? query : window.location.search;
    query = query.replace(/^\?+/, '').replace(/&amp;/, '');
    var querys = query.split('&');
    var len = querys.length;
    var params = {};
    while (len--) {
        var items = querys[len].split('=');
        if (items[0]) {
            var value = items[1] || '';
            try {
                value = decodeURIComponent(value);
            } catch (e) {
                value = unescape(value);
            }
            params[decodeURIComponent(items[0])] = value;
        }
    }
    return params;
}

function encodeQueryData(data) {
    if (data) {
        return (0, _keys2.default)(data).map(function (k) {
            return k + '=' + encodeURIComponent(data[k]);
        }).join('&');
    } else {
        return '';
    }
}

function isSet(k) {
    return typeof k === 'undefined';
}

function parseH5Url(url) {
    if (url) {
        var a = document.createElement('a');
        a.href = url;
        return a.origin;
    } else {
        return '';
    }
}