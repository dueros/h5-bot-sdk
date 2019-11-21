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
