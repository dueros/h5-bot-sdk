/**
 * @file 工具函数
 * @author dengxuening<dengxuening@baidu.com>
 */

export function getQuery(query) {
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

export function encodeQueryData(data) {
    if (data) {
        return Object.keys(data).map(k => {
            return `${k}=${encodeURIComponent(data[k])}`;
        }).join('&');
    } else {
        return '';
    }
}

export function isSet(k) {
    return typeof k !== 'undefined';
}

export function parseH5Url(url) {
    if (url) {
        const a = document.createElement('a');
        a.href = url;
        return a.origin;
    } else {
        return ''
    }
}
