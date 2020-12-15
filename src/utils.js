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

/**
 * 将object转换为URL编码的字符串
 * @param data
 * @return {string}
 */
export function encodeObjectDataToUrlData(data) {
    if (data) {
        return Object.keys(data).map(k => {
            return `${k}=${encodeURIComponent(data[k])}`;
        }).join('&');
    } else {
        return '';
    }
}

/**
 * 判断某个值是否被设置
 * @param k
 * @return {boolean}
 */
export function isSet(k) {
    return typeof k !== 'undefined';
}

/**
 * 返回一个URL中的origin字段
 * @param url
 * @return {*}
 */
export function parseH5UrlOrigin(url) {
    if (url) {
        const a = document.createElement('a');
        a.href = url;
        return a.origin;
    } else {
        return ''
    }
}

/**
 * 创建Iframe
 * @param left css left
 * @param top css top
 * @param right css right
 * @param bottom css bottom
 * @param width 宽度
 * @param height 高度
 * @param background 背景
 * @param zIndex
 * @return {HTMLElement} iframe
 */
export function createIframe({left = 'auto', top = 'auto', right = 'auto',
                                 bottom = 'auto', width = '100%', height = '100%',
                                 background = 'rgba(0, 0, 0, 0)', zIndex= 9999,
                                 scrolling = 'no'
                             }) {
    const iframe = document.createElement('iframe');
    // iframe.src = `${iframeUrl}?${trialGameParam}`;
    iframe.allowTransparency = 'true';
    iframe.scrolling = scrolling;
    iframe.frameBorder = 0;
    iframe.style.cssText +=
        `width: ${width};
        height: ${height};
        display: block; 
        left: ${left};
        top: ${top};
        right: ${right};
        bottom: ${bottom};
        z-index: ${zIndex};
        background: ${background};
        position: fixed;`;
    return iframe;
}

/**
 * 提取版本号
 * @param str
 * @returns {string|null}
 * @private
 */
export function parseVersionNumber(str) {
    let reg = null;
    if (str.indexOf('ContainerVersion') > -1) {
        reg = /ContainerVersion\/([\d\.]+)/i;
    } else {
        reg = /build\/([\d\.]+);/i;
    }
    let result = reg.exec(str);
    if (result) {
        return result[1];
    } else {
        return null;
    }
}

/**
 * SHOW端设备的版本号对比
 * @param {string} a 版本号
 * @param {string} b 版本号
 * @returns {number} 如果返回0，则表示版本号相同，如果返回1，a版本号大于b版本号，如果返回-1则a版本号小于b
 * @private
 */
export function compareShowVersion(a, b) {
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
