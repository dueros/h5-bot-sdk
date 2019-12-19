/*! @baidu/h5-bot-sdk - 1.4.9 */
var BotApp=function(e){var t={};function n(r){if(t[r])return t[r].exports;var i=t[r]={i:r,l:!1,exports:{}};return e[r].call(i.exports,i,i.exports,n),i.l=!0,i.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)n.d(r,i,function(t){return e[t]}.bind(null,i));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s="HVBj")}({"29s/":function(e,t,n){var r=n("WEpk"),i=n("5T2Y"),o=i["__core-js_shared__"]||(i["__core-js_shared__"]={});(e.exports=function(e,t){return o[e]||(o[e]=void 0!==t?t:{})})("versions",[]).push({version:r.version,mode:n("uOPS")?"pure":"global",copyright:"© 2019 Denis Pushkarev (zloirock.ru)"})},"2GTP":function(e,t,n){var r=n("eaoh");e.exports=function(e,t,n){if(r(e),void 0===t)return e;switch(n){case 1:return function(n){return e.call(t,n)};case 2:return function(n,r){return e.call(t,n,r)};case 3:return function(n,r,i){return e.call(t,n,r,i)}}return function(){return e.apply(t,arguments)}}},"2faE":function(e,t,n){var r=n("5K7Z"),i=n("eUtF"),o=n("G8Mo"),a=Object.defineProperty;t.f=n("jmDH")?Object.defineProperty:function(e,t,n){if(r(e),t=o(t,!0),r(n),i)try{return a(e,t,n)}catch(e){}if("get"in n||"set"in n)throw TypeError("Accessors not supported!");return"value"in n&&(e[t]=n.value),e}},"5K7Z":function(e,t,n){var r=n("93I4");e.exports=function(e){if(!r(e))throw TypeError(e+" is not an object!");return e}},"5T2Y":function(e,t){var n=e.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=n)},"5vMV":function(e,t,n){var r=n("B+OT"),i=n("NsO/"),o=n("W070")(!1),a=n("VVlx")("IE_PROTO");e.exports=function(e,t){var n,u=i(e),s=0,c=[];for(n in u)n!=a&&r(u,n)&&c.push(n);for(;t.length>s;)r(u,n=t[s++])&&(~o(c,n)||c.push(n));return c}},"93I4":function(e,t){e.exports=function(e){return"object"==typeof e?null!==e:"function"==typeof e}},"B+OT":function(e,t){var n={}.hasOwnProperty;e.exports=function(e,t){return n.call(e,t)}},D8kY:function(e,t,n){var r=n("Ojgd"),i=Math.max,o=Math.min;e.exports=function(e,t){return(e=r(e))<0?i(e+t,0):o(e,t)}},FpHa:function(e,t){e.exports="constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",")},G8Mo:function(e,t,n){var r=n("93I4");e.exports=function(e,t){if(!r(e))return e;var n,i;if(t&&"function"==typeof(n=e.toString)&&!r(i=n.call(e)))return i;if("function"==typeof(n=e.valueOf)&&!r(i=n.call(e)))return i;if(!t&&"function"==typeof(n=e.toString)&&!r(i=n.call(e)))return i;throw TypeError("Can't convert object to primitive value")}},HVBj:function(e,t,n){"use strict";var r=u(n("QbLZ")),i=u(n("gDS+")),o=u(n("iCc5")),a=u(n("V7oC"));function u(e){return e&&e.__esModule?e:{default:e}}var s=function(){function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};(0,o.default)(this,e),this.config=t,this._init()}return(0,a.default)(e,[{key:"_init",value:function(){var e=this,t=(0,i.default)({random1:this.config.random1,signature1:this.config.signature1,random2:this.config.random2,signature2:this.config.signature2});this._msgTarget="http://xiaodu.baidu.com",this.isInApp()?window.addEventListener("message",function(t){var n=t.data;"wrapper_location_protocal"===n.type&&(n.data.indexOf("https")>-1&&(e._msgTarget="https://xiaodu.baidu.com"),window.parent.postMessage({type:"register",data:e.config},e._msgTarget)),t.origin===e._msgTarget&&(console.log("receive h5game-wrapper's message ",n),"authorized_success"===n.type||"authorized_fail"===n.type?e._linkAccountResultCb(n):"bot_info"===n.type?(e.registerResult=n.data,e.registerCallback&&e.registerCallback(e.registerResult),e.registerCallback=null):"ship"===n.type&&e._getShipPayResult&&e._getShipPayResult(n.err,n.data))}):this._getJSBridge(function(n){n.init(function(e,t){console.log("Receive bridge init message from native: "+e),t({"Javascript Responds":"Ready!"})}),n.callHandler("register",t,function(t){t=JSON.parse(t),e.registerResult=t,e.registerCallback&&e.registerCallback(t),e.registerCallback=null,e.config.skillID&&e.requireShipping()})})}},{key:"_getJSBridge",value:function(e){window.WebViewJavascriptBridge?e(window.WebViewJavascriptBridge):document.addEventListener("WebViewJavascriptBridgeReady",function(){e(WebViewJavascriptBridge)},!1)}},{key:"_validateCallback",value:function(e,t){if("function"!=typeof t)throw new TypeError("["+e+"]'s arguments[0] must be a function, but get a "+typeof t)}},{key:"isInApp",value:function(){if(this._appType)return this._appType;var e=window.navigator.userAgent.toLowerCase(),t="";return e.match(/xiaoduapp\/([\S]+)/)?t="ls_m":e.match("fromapp/xiaoduapp")&&(t="oneApp"),this._appType="ls_m"===t||"oneApp"===t,this._appType}},{key:"requireShipping",value:function(){if(!this.config.skillID)throw new Error("Missing `skillID`, please configure `skillID` when initializes the `BotApp`");var e="http://"+this.config.skillID+'/path?openbot=true&request={"query":{"type":"TEXT","original":"ReadyForShipping","rewritten":"ReadyForShipping"},"dialogState":"COMPLETED","intents":[{"name":"ReadyForShipping","score":100,"confirmationStatus":"NONE","slots":[]}]}';this.uploadLinkClicked({url:e})}},{key:"getRegisterResult",value:function(e){this.registerResult?e(this.registerResult):this.registerCallback=e}},{key:"requireLinkAccount",value:function(e){this.isInApp()?(this._validateCallback("requireLinkAccount",e),this._linkAccountResultCb=e,window.parent.postMessage({type:"request_authorization"},this._msgTarget)):(e&&console.warn("requireLinkAccount: Your H5 app is not running on the App, and the callback function will not be called"),this._getJSBridge(function(e){e.callHandler("requireLinkAccount")}))}},{key:"onLinkAccountSuccess",value:function(e){this._validateCallback("onLinkAccountSuccess",e),this._getJSBridge(function(t){t.registerHandler("onLinkAccountSuccess",function(t,n){e(JSON.parse(t)),n(!0)})})}},{key:"requireCharge",value:function(e,t){if(this.isInApp()){if("function"!=typeof t)throw new Error("requireCharge: Your web runs in App and and you must pass a function in the position of the second to handle the purchase result.");this._getShipPayResult=t,window.parent.postMessage({type:"charge",data:e},this._msgTarget)}else e=(0,i.default)(e),this._getJSBridge(function(t){t.callHandler("requireCharge",e)})}},{key:"requireBuy",value:function(e,t){if(this.isInApp()){if(!e||!e.productId||!e.sellerOrderId){var n=new Error;throw n.name="params error",n.message="requireBuy: arguments[0] must be an `Object` with `productId` and `sellerOrderId`",n}if("function"!=typeof t)throw new Error("requireBuy: arguments[1] must be a function, but get a "+typeof t);this._getShipPayResult=t;var i=(0,r.default)({},e,{product2:e.productId+"|"+e.sellerOrderId+"|skillstoreapp",source:"skillstoreapp",from:"skillstoreapp"});window.parent.postMessage({type:"buy",data:i},this._msgTarget)}else console.error("Method `requireBuy` can only be called in App")}},{key:"uploadLinkClicked",value:function(e){e=(0,i.default)(e),this._getJSBridge(function(t){t.callHandler("uploadLinkClicked",e)})}},{key:"onChargeStatusChange",value:function(e){this._validateCallback("onChargeStatusChange",e),this._getJSBridge(function(t){t.registerHandler("onChargeStatusChange",function(t,n){e(JSON.parse(t)),n(!0)})})}},{key:"onHandleIntent",value:function(e){this._validateCallback("onHandleIntent",e),this._getJSBridge(function(t){t.registerHandler("onHandleIntent",function(t,n){e(JSON.parse(t)),n("js 回调")})})}},{key:"updateUiContext",value:function(e,t){t&&this._validateCallback("updateUiContext",t),e=(0,i.default)(e),this._getJSBridge(function(n){n.callHandler("updateUiContext",e,function(e){t&&t(e)})})}},{key:"listen",value:function(e){e&&this._validateCallback("listen",e),this._getJSBridge(function(t){t.callHandler("listen",function(t){e&&e(t)})})}},{key:"speak",value:function(e,t){t&&this._validateCallback("speak",t),this._getJSBridge(function(n){n.callHandler("speak",e,function(){t&&t()})})}},{key:"requestClose",value:function(){this.isInApp()?window.parent.postMessage({type:"closeWebView"},this._msgTarget):this._getJSBridge(function(e){e.callHandler("requestClose")})}},{key:"onClickLink",value:function(e){this._validateCallback("onClickLink",e),this._getJSBridge(function(t){t.registerHandler("onClickLink",function(t,n){e(JSON.parse(t)),n(!0)})})}},{key:"onHandleScreenNavigatorEvent",value:function(e){this._validateCallback("onHandleScreenNavigatorEvent",e),this._getJSBridge(function(t){t.registerHandler("onHandleScreenNavigatorEvent",function(t,n){e(JSON.parse(t)),n(!0)})})}}]),e}();e.exports=s},Hsns:function(e,t,n){var r=n("93I4"),i=n("5T2Y").document,o=r(i)&&r(i.createElement);e.exports=function(e){return o?i.createElement(e):{}}},JB68:function(e,t,n){var r=n("Jes0");e.exports=function(e){return Object(r(e))}},Jes0:function(e,t){e.exports=function(e){if(null==e)throw TypeError("Can't call method on  "+e);return e}},KUxP:function(e,t){e.exports=function(e){try{return!!e()}catch(e){return!0}}},M1xp:function(e,t,n){var r=n("a0xu");e.exports=Object("z").propertyIsEnumerable(0)?Object:function(e){return"String"==r(e)?e.split(""):Object(e)}},NV0k:function(e,t){t.f={}.propertyIsEnumerable},NegM:function(e,t,n){var r=n("2faE"),i=n("rr1i");e.exports=n("jmDH")?function(e,t,n){return r.f(e,t,i(1,n))}:function(e,t,n){return e[t]=n,e}},"NsO/":function(e,t,n){var r=n("M1xp"),i=n("Jes0");e.exports=function(e){return r(i(e))}},Ojgd:function(e,t){var n=Math.ceil,r=Math.floor;e.exports=function(e){return isNaN(e=+e)?0:(e>0?r:n)(e)}},P2sY:function(e,t,n){e.exports={default:n("UbbE"),__esModule:!0}},QbLZ:function(e,t,n){"use strict";t.__esModule=!0;var r,i=n("P2sY"),o=(r=i)&&r.__esModule?r:{default:r};t.default=o.default||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}},"RU/L":function(e,t,n){n("Rqdy");var r=n("WEpk").Object;e.exports=function(e,t,n){return r.defineProperty(e,t,n)}},Rqdy:function(e,t,n){var r=n("Y7ZC");r(r.S+r.F*!n("jmDH"),"Object",{defineProperty:n("2faE").f})},SEkw:function(e,t,n){e.exports={default:n("RU/L"),__esModule:!0}},UbbE:function(e,t,n){n("o8NH"),e.exports=n("WEpk").Object.assign},V7oC:function(e,t,n){"use strict";t.__esModule=!0;var r,i=n("SEkw"),o=(r=i)&&r.__esModule?r:{default:r};t.default=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),(0,o.default)(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}()},VVlx:function(e,t,n){var r=n("29s/")("keys"),i=n("YqAc");e.exports=function(e){return r[e]||(r[e]=i(e))}},W070:function(e,t,n){var r=n("NsO/"),i=n("tEej"),o=n("D8kY");e.exports=function(e){return function(t,n,a){var u,s=r(t),c=i(s.length),l=o(a,c);if(e&&n!=n){for(;c>l;)if((u=s[l++])!=u)return!0}else for(;c>l;l++)if((e||l in s)&&s[l]===n)return e||l||0;return!e&&-1}}},WEpk:function(e,t){var n=e.exports={version:"2.6.9"};"number"==typeof __e&&(__e=n)},Y7ZC:function(e,t,n){var r=n("5T2Y"),i=n("WEpk"),o=n("2GTP"),a=n("NegM"),u=n("B+OT"),s=function(e,t,n){var c,l,f,p=e&s.F,d=e&s.G,g=e&s.S,h=e&s.P,v=e&s.B,y=e&s.W,b=d?i:i[t]||(i[t]={}),_=b.prototype,k=d?r:g?r[t]:(r[t]||{}).prototype;for(c in d&&(n=t),n)(l=!p&&k&&void 0!==k[c])&&u(b,c)||(f=l?k[c]:n[c],b[c]=d&&"function"!=typeof k[c]?n[c]:v&&l?o(f,r):y&&k[c]==f?function(e){var t=function(t,n,r){if(this instanceof e){switch(arguments.length){case 0:return new e;case 1:return new e(t);case 2:return new e(t,n)}return new e(t,n,r)}return e.apply(this,arguments)};return t.prototype=e.prototype,t}(f):h&&"function"==typeof f?o(Function.call,f):f,h&&((b.virtual||(b.virtual={}))[c]=f,e&s.R&&_&&!_[c]&&a(_,c,f)))};s.F=1,s.G=2,s.S=4,s.P=8,s.B=16,s.W=32,s.U=64,s.R=128,e.exports=s},YqAc:function(e,t){var n=0,r=Math.random();e.exports=function(e){return"Symbol(".concat(void 0===e?"":e,")_",(++n+r).toString(36))}},a0xu:function(e,t){var n={}.toString;e.exports=function(e){return n.call(e).slice(8,-1)}},eUtF:function(e,t,n){e.exports=!n("jmDH")&&!n("KUxP")(function(){return 7!=Object.defineProperty(n("Hsns")("div"),"a",{get:function(){return 7}}).a})},eaoh:function(e,t){e.exports=function(e){if("function"!=typeof e)throw TypeError(e+" is not a function!");return e}},"gDS+":function(e,t,n){e.exports={default:n("oh+g"),__esModule:!0}},iCc5:function(e,t,n){"use strict";t.__esModule=!0,t.default=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}},jmDH:function(e,t,n){e.exports=!n("KUxP")(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})},kwZ1:function(e,t,n){"use strict";var r=n("jmDH"),i=n("w6GO"),o=n("mqlF"),a=n("NV0k"),u=n("JB68"),s=n("M1xp"),c=Object.assign;e.exports=!c||n("KUxP")(function(){var e={},t={},n=Symbol(),r="abcdefghijklmnopqrst";return e[n]=7,r.split("").forEach(function(e){t[e]=e}),7!=c({},e)[n]||Object.keys(c({},t)).join("")!=r})?function(e,t){for(var n=u(e),c=arguments.length,l=1,f=o.f,p=a.f;c>l;)for(var d,g=s(arguments[l++]),h=f?i(g).concat(f(g)):i(g),v=h.length,y=0;v>y;)d=h[y++],r&&!p.call(g,d)||(n[d]=g[d]);return n}:c},mqlF:function(e,t){t.f=Object.getOwnPropertySymbols},o8NH:function(e,t,n){var r=n("Y7ZC");r(r.S+r.F,"Object",{assign:n("kwZ1")})},"oh+g":function(e,t,n){var r=n("WEpk"),i=r.JSON||(r.JSON={stringify:JSON.stringify});e.exports=function(e){return i.stringify.apply(i,arguments)}},rr1i:function(e,t){e.exports=function(e,t){return{enumerable:!(1&e),configurable:!(2&e),writable:!(4&e),value:t}}},tEej:function(e,t,n){var r=n("Ojgd"),i=Math.min;e.exports=function(e){return e>0?i(r(e),9007199254740991):0}},uOPS:function(e,t){e.exports=!0},w6GO:function(e,t,n){var r=n("5vMV"),i=n("FpHa");e.exports=Object.keys||function(e){return r(e,i)}}});