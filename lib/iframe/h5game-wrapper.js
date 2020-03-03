/* eslint-disable */'use strict';

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _H5gameWrapper = require('./pages/H5gameWrapper.vue');

var _H5gameWrapper2 = _interopRequireDefault(_H5gameWrapper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_vue2.default.prototype.axios = _axios2.default; /**
                                                  * @file 小度APP上游戏授权页面
                                                  * @author dengxuening<dengxuening@baidu.com>
                                                  */

_vue2.default.config.productionTip = false;

new _vue2.default({
  render: function render(h) {
    return h(_H5gameWrapper2.default);
  }
}).$mount('#app');