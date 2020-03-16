/* eslint-disable */'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = require('../../utils');

var utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.default = {
    methods: {
        data: function data() {
            return {
                msgTarget: ''
            };
        },
        postMessage: function postMessage(data) {
            window.parent.postMessage(data, this.msgTarget);
        },
        mounted: function mounted() {
            this.msgTarget = utils.getQuery().msgTarget;
            this.postMessage({
                type: 'ad_load_material'
            });
        }
    }
}; /**
    * @file vue mixin
    * @author dengxuening<dengxuening@baidu.com>
    */