/*! @baidu/h5-bot-sdk - 1.3.0 */
var BotApp=function(e){var t={};function n(r){if(t[r])return t[r].exports;var i=t[r]={i:r,l:!1,exports:{}};return e[r].call(i.exports,i,i.exports,n),i.l=!0,i.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)n.d(r,i,function(t){return e[t]}.bind(null,i));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s="HVBj")}({"2GTP":function(e,t,n){var r=n("eaoh");e.exports=function(e,t,n){if(r(e),void 0===t)return e;switch(n){case 1:return function(n){return e.call(t,n)};case 2:return function(n,r){return e.call(t,n,r)};case 3:return function(n,r,i){return e.call(t,n,r,i)}}return function(){return e.apply(t,arguments)}}},"2faE":function(e,t,n){var r=n("5K7Z"),i=n("eUtF"),o=n("G8Mo"),u=Object.defineProperty;t.f=n("jmDH")?Object.defineProperty:function(e,t,n){if(r(e),t=o(t,!0),r(n),i)try{return u(e,t,n)}catch(e){}if("get"in n||"set"in n)throw TypeError("Accessors not supported!");return"value"in n&&(e[t]=n.value),e}},"5K7Z":function(e,t,n){var r=n("93I4");e.exports=function(e){if(!r(e))throw TypeError(e+" is not an object!");return e}},"5T2Y":function(e,t){var n=e.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=n)},"93I4":function(e,t){e.exports=function(e){return"object"==typeof e?null!==e:"function"==typeof e}},"B+OT":function(e,t){var n={}.hasOwnProperty;e.exports=function(e,t){return n.call(e,t)}},G8Mo:function(e,t,n){var r=n("93I4");e.exports=function(e,t){if(!r(e))return e;var n,i;if(t&&"function"==typeof(n=e.toString)&&!r(i=n.call(e)))return i;if("function"==typeof(n=e.valueOf)&&!r(i=n.call(e)))return i;if(!t&&"function"==typeof(n=e.toString)&&!r(i=n.call(e)))return i;throw TypeError("Can't convert object to primitive value")}},HVBj:function(e,t,n){"use strict";var r=u(n("gDS+")),i=u(n("iCc5")),o=u(n("V7oC"));function u(e){return e&&e.__esModule?e:{default:e}}var a=function(){function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};(0,i.default)(this,e),this.config=t,this.registerResult=null,this.registerCallback=null,this._init(t)}return(0,o.default)(e,[{key:"_init",value:function(e){var t=this,n=(0,r.default)({random1:this.config.random1,signature1:this.config.signature1,random2:this.config.random2,signature2:this.config.signature2});this._getJSBridge(function(e){e.init(function(e,t){console.log("Receive bridge init message from native: "+e),t({"Javascript Responds":"Ready!"})}),e.callHandler("register",n,function(e){e=JSON.parse(e),t.registerResult=e,t.registerCallback&&t.registerCallback(e),t.registerCallback=null,t.config.skillID&&t.requireShipping()})})}},{key:"_getJSBridge",value:function(e){window.WebViewJavascriptBridge?e(window.WebViewJavascriptBridge):document.addEventListener("WebViewJavascriptBridgeReady",function(){e(WebViewJavascriptBridge)},!1)}},{key:"_validateCallback",value:function(e,t){if("function"!=typeof t)throw new TypeError("["+e+"]'s arguments[0] must be a function, but get a "+typeof t)}},{key:"requireShipping",value:function(){if(!this.config.skillID)throw new Error("Missing `skillID`, please configure `skillID` when initializes the `BotApp`");var e="http://"+this.config.skillID+'/path?openbot=true&request={"query":{"type":"TEXT","original":"ReadyForShipping","rewritten":"ReadyForShipping"},"dialogState":"COMPLETED","intents":[{"name":"ReadyForShipping","score":100,"confirmationStatus":"NONE","slots":[]}]}';this.uploadLinkClicked({url:e})}},{key:"getRegisterResult",value:function(e){this.registerResult?e(this.registerResult):this.registerCallback=e}},{key:"requireLinkAccount",value:function(){this._getJSBridge(function(e){e.callHandler("requireLinkAccount")})}},{key:"onLinkAccountSuccess",value:function(e){this._validateCallback("onLinkAccountSuccess",e),this._getJSBridge(function(t){t.registerHandler("onLinkAccountSuccess",function(t,n){e(JSON.parse(t)),n(!0)})})}},{key:"requireCharge",value:function(e){e=(0,r.default)(e),this._getJSBridge(function(t){t.callHandler("requireCharge",e)})}},{key:"uploadLinkClicked",value:function(e){e=(0,r.default)(e),this._getJSBridge(function(t){t.callHandler("uploadLinkClicked",e)})}},{key:"onChargeStatusChange",value:function(e){this._validateCallback("onChargeStatusChange",e),this._getJSBridge(function(t){t.registerHandler("onChargeStatusChange",function(t,n){e(JSON.parse(t)),n(!0)})})}},{key:"onHandleIntent",value:function(e){this._validateCallback("onHandleIntent",e),this._getJSBridge(function(t){t.registerHandler("onHandleIntent",function(t,n){e(JSON.parse(t)),n("js 回调")})})}},{key:"updateUiContext",value:function(e,t){t&&this._validateCallback("updateUiContext",t),e=(0,r.default)(e),this._getJSBridge(function(n){n.callHandler("updateUiContext",e,function(e){t&&t(e)})})}},{key:"listen",value:function(e){e&&this._validateCallback("listen",e),this._getJSBridge(function(t){t.callHandler("listen",function(t){e&&e(t)})})}},{key:"speak",value:function(e,t){t&&this._validateCallback("speak",t),this._getJSBridge(function(n){n.callHandler("speak",e,function(){t&&t()})})}},{key:"requestClose",value:function(){this._getJSBridge(function(e){e.callHandler("requestClose")})}},{key:"onClickLink",value:function(e){this._validateCallback("onClickLink",e),this._getJSBridge(function(t){t.registerHandler("onClickLink",function(t,n){e(JSON.parse(t)),n(!0)})})}},{key:"onHandleScreenNavigatorEvent",value:function(e){this._validateCallback("onHandleScreenNavigatorEvent",e),this._getJSBridge(function(t){t.registerHandler("onHandleScreenNavigatorEvent",function(t,n){e(JSON.parse(t)),n(!0)})})}}]),e}();e.exports=a},Hsns:function(e,t,n){var r=n("93I4"),i=n("5T2Y").document,o=r(i)&&r(i.createElement);e.exports=function(e){return o?i.createElement(e):{}}},KUxP:function(e,t){e.exports=function(e){try{return!!e()}catch(e){return!0}}},NegM:function(e,t,n){var r=n("2faE"),i=n("rr1i");e.exports=n("jmDH")?function(e,t,n){return r.f(e,t,i(1,n))}:function(e,t,n){return e[t]=n,e}},"RU/L":function(e,t,n){n("Rqdy");var r=n("WEpk").Object;e.exports=function(e,t,n){return r.defineProperty(e,t,n)}},Rqdy:function(e,t,n){var r=n("Y7ZC");r(r.S+r.F*!n("jmDH"),"Object",{defineProperty:n("2faE").f})},SEkw:function(e,t,n){e.exports={default:n("RU/L"),__esModule:!0}},V7oC:function(e,t,n){"use strict";t.__esModule=!0;var r,i=n("SEkw"),o=(r=i)&&r.__esModule?r:{default:r};t.default=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),(0,o.default)(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}()},WEpk:function(e,t){var n=e.exports={version:"2.6.9"};"number"==typeof __e&&(__e=n)},Y7ZC:function(e,t,n){var r=n("5T2Y"),i=n("WEpk"),o=n("2GTP"),u=n("NegM"),a=n("B+OT"),c=function(e,t,n){var l,f,s,d=e&c.F,p=e&c.G,g=e&c.S,v=e&c.P,h=e&c.B,y=e&c.W,k=p?i:i[t]||(i[t]={}),b=k.prototype,S=p?r:g?r[t]:(r[t]||{}).prototype;for(l in p&&(n=t),n)(f=!d&&S&&void 0!==S[l])&&a(k,l)||(s=f?S[l]:n[l],k[l]=p&&"function"!=typeof S[l]?n[l]:h&&f?o(s,r):y&&S[l]==s?function(e){var t=function(t,n,r){if(this instanceof e){switch(arguments.length){case 0:return new e;case 1:return new e(t);case 2:return new e(t,n)}return new e(t,n,r)}return e.apply(this,arguments)};return t.prototype=e.prototype,t}(s):v&&"function"==typeof s?o(Function.call,s):s,v&&((k.virtual||(k.virtual={}))[l]=s,e&c.R&&b&&!b[l]&&u(b,l,s)))};c.F=1,c.G=2,c.S=4,c.P=8,c.B=16,c.W=32,c.U=64,c.R=128,e.exports=c},eUtF:function(e,t,n){e.exports=!n("jmDH")&&!n("KUxP")(function(){return 7!=Object.defineProperty(n("Hsns")("div"),"a",{get:function(){return 7}}).a})},eaoh:function(e,t){e.exports=function(e){if("function"!=typeof e)throw TypeError(e+" is not a function!");return e}},"gDS+":function(e,t,n){e.exports={default:n("oh+g"),__esModule:!0}},iCc5:function(e,t,n){"use strict";t.__esModule=!0,t.default=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}},jmDH:function(e,t,n){e.exports=!n("KUxP")(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})},"oh+g":function(e,t,n){var r=n("WEpk"),i=r.JSON||(r.JSON={stringify:JSON.stringify});e.exports=function(e){return i.stringify.apply(i,arguments)}},rr1i:function(e,t){e.exports=function(e,t){return{enumerable:!(1&e),configurable:!(2&e),writable:!(4&e),value:t}}}});