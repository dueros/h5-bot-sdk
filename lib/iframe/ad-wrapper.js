/* eslint-disable */'use strict';

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _Ad = require('./pages/Ad.vue');

var _Ad2 = _interopRequireDefault(_Ad);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_vue2.default.prototype.axios = _axios2.default; /**
                                                  * @file 广告iframe
                                                  * @author dengxuening<dengxuening@baidu.com>
                                                  */

_vue2.default.config.productionTip = false;

new _vue2.default({
  render: function render(h) {
    return h(_Ad2.default);
  }
}).$mount('#app');