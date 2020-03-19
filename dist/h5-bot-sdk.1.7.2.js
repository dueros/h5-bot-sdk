/*! @baidu/h5-bot-sdk - 1.7.2 */
var BotApp=function(e){var t={};function n(r){if(t[r])return t[r].exports;var i=t[r]={i:r,l:!1,exports:{}};return e[r].call(i.exports,i,i.exports,n),i.l=!0,i.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)n.d(r,i,function(t){return e[t]}.bind(null,i));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s="Vtdi")}({"29s/":function(e,t,n){var r=n("WEpk"),i=n("5T2Y"),o=i["__core-js_shared__"]||(i["__core-js_shared__"]={});(e.exports=function(e,t){return o[e]||(o[e]=void 0!==t?t:{})})("versions",[]).push({version:r.version,mode:n("uOPS")?"pure":"global",copyright:"© 2019 Denis Pushkarev (zloirock.ru)"})},"2GTP":function(e,t,n){var r=n("eaoh");e.exports=function(e,t,n){if(r(e),void 0===t)return e;switch(n){case 1:return function(n){return e.call(t,n)};case 2:return function(n,r){return e.call(t,n,r)};case 3:return function(n,r,i){return e.call(t,n,r,i)}}return function(){return e.apply(t,arguments)}}},"2faE":function(e,t,n){var r=n("5K7Z"),i=n("eUtF"),o=n("G8Mo"),a=Object.defineProperty;t.f=n("jmDH")?Object.defineProperty:function(e,t,n){if(r(e),t=o(t,!0),r(n),i)try{return a(e,t,n)}catch(e){}if("get"in n||"set"in n)throw TypeError("Accessors not supported!");return"value"in n&&(e[t]=n.value),e}},"5K7Z":function(e,t,n){var r=n("93I4");e.exports=function(e){if(!r(e))throw TypeError(e+" is not an object!");return e}},"5T2Y":function(e,t){var n=e.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=n)},"5vMV":function(e,t,n){var r=n("B+OT"),i=n("NsO/"),o=n("W070")(!1),a=n("VVlx")("IE_PROTO");e.exports=function(e,t){var n,s=i(e),u=0,c=[];for(n in s)n!=a&&r(s,n)&&c.push(n);for(;t.length>u;)r(s,n=t[u++])&&(~o(c,n)||c.push(n));return c}},"93I4":function(e,t){e.exports=function(e){return"object"==typeof e?null!==e:"function"==typeof e}},Al62:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r,i=n("GQeE"),o=(r=i)&&r.__esModule?r:{default:r};t.getQuery=function(e){var t=(e=(e=e||window.location.search).replace(/^\?+/,"").replace(/&amp;/,"")).split("&"),n=t.length,r={};for(;n--;){var i=t[n].split("=");if(i[0]){var o=i[1]||"";try{o=decodeURIComponent(o)}catch(e){o=unescape(o)}r[decodeURIComponent(i[0])]=o}}return r},t.encodeQueryData=function(e){return e?(0,o.default)(e).map(function(t){return t+"="+encodeURIComponent(e[t])}).join("&"):""},t.isSet=function(e){return void 0!==e},t.parseH5UrlOrigin=function(e){if(e){var t=document.createElement("a");return t.href=e,t.origin}return""}},"B+OT":function(e,t){var n={}.hasOwnProperty;e.exports=function(e,t){return n.call(e,t)}},D8kY:function(e,t,n){var r=n("Ojgd"),i=Math.max,o=Math.min;e.exports=function(e,t){return(e=r(e))<0?i(e+t,0):o(e,t)}},FlQf:function(e,t,n){"use strict";var r=n("ccE7")(!0);n("MPFp")(String,"String",function(e){this._t=String(e),this._i=0},function(){var e,t=this._t,n=this._i;return n>=t.length?{value:void 0,done:!0}:(e=r(t,n),this._i+=e.length,{value:e,done:!1})})},FpHa:function(e,t){e.exports="constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",")},FyfS:function(e,t,n){e.exports={default:n("Rp86"),__esModule:!0}},G8Mo:function(e,t,n){var r=n("93I4");e.exports=function(e,t){if(!r(e))return e;var n,i;if(t&&"function"==typeof(n=e.toString)&&!r(i=n.call(e)))return i;if("function"==typeof(n=e.valueOf)&&!r(i=n.call(e)))return i;if(!t&&"function"==typeof(n=e.toString)&&!r(i=n.call(e)))return i;throw TypeError("Can't convert object to primitive value")}},GQeE:function(e,t,n){e.exports={default:n("iq4v"),__esModule:!0}},Hsns:function(e,t,n){var r=n("93I4"),i=n("5T2Y").document,o=r(i)&&r(i.createElement);e.exports=function(e){return o?i.createElement(e):{}}},JB68:function(e,t,n){var r=n("Jes0");e.exports=function(e){return Object(r(e))}},Jes0:function(e,t){e.exports=function(e){if(null==e)throw TypeError("Can't call method on  "+e);return e}},KUxP:function(e,t){e.exports=function(e){try{return!!e()}catch(e){return!0}}},M1xp:function(e,t,n){var r=n("a0xu");e.exports=Object("z").propertyIsEnumerable(0)?Object:function(e){return"String"==r(e)?e.split(""):Object(e)}},MPFp:function(e,t,n){"use strict";var r=n("uOPS"),i=n("Y7ZC"),o=n("kTiW"),a=n("NegM"),s=n("SBuE"),u=n("j2DC"),c=n("RfKB"),l=n("U+KD"),f=n("UWiX")("iterator"),d=!([].keys&&"next"in[].keys()),p=function(){return this};e.exports=function(e,t,n,h,g,m,v){u(n,t,h);var _,y,k,b=function(e){if(!d&&e in x)return x[e];switch(e){case"keys":case"values":return function(){return new n(this,e)}}return function(){return new n(this,e)}},w=t+" Iterator",S="values"==g,C=!1,x=e.prototype,I=x[f]||x["@@iterator"]||g&&x[g],O=I||b(g),T=g?S?b("entries"):O:void 0,A="Array"==t&&x.entries||I;if(A&&(k=l(A.call(new e)))!==Object.prototype&&k.next&&(c(k,w,!0),r||"function"==typeof k[f]||a(k,f,p)),S&&I&&"values"!==I.name&&(C=!0,O=function(){return I.call(this)}),r&&!v||!d&&!C&&x[f]||a(x,f,O),s[t]=O,s[w]=p,g)if(_={values:S?O:b("values"),keys:m?O:b("keys"),entries:T},v)for(y in _)y in x||o(x,y,_[y]);else i(i.P+i.F*(d||C),t,_);return _}},Mqbl:function(e,t,n){var r=n("JB68"),i=n("w6GO");n("zn7N")("keys",function(){return function(e){return i(r(e))}})},MvwC:function(e,t,n){var r=n("5T2Y").document;e.exports=r&&r.documentElement},NV0k:function(e,t){t.f={}.propertyIsEnumerable},NegM:function(e,t,n){var r=n("2faE"),i=n("rr1i");e.exports=n("jmDH")?function(e,t,n){return r.f(e,t,i(1,n))}:function(e,t,n){return e[t]=n,e}},"NsO/":function(e,t,n){var r=n("M1xp"),i=n("Jes0");e.exports=function(e){return r(i(e))}},Ojgd:function(e,t){var n=Math.ceil,r=Math.floor;e.exports=function(e){return isNaN(e=+e)?0:(e>0?r:n)(e)}},P2sY:function(e,t,n){e.exports={default:n("UbbE"),__esModule:!0}},QMMT:function(e,t,n){var r=n("a0xu"),i=n("UWiX")("toStringTag"),o="Arguments"==r(function(){return arguments}());e.exports=function(e){var t,n,a;return void 0===e?"Undefined":null===e?"Null":"string"==typeof(n=function(e,t){try{return e[t]}catch(e){}}(t=Object(e),i))?n:o?r(t):"Object"==(a=r(t))&&"function"==typeof t.callee?"Arguments":a}},QbLZ:function(e,t,n){"use strict";t.__esModule=!0;var r,i=n("P2sY"),o=(r=i)&&r.__esModule?r:{default:r};t.default=o.default||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}},"RU/L":function(e,t,n){n("Rqdy");var r=n("WEpk").Object;e.exports=function(e,t,n){return r.defineProperty(e,t,n)}},RfKB:function(e,t,n){var r=n("2faE").f,i=n("B+OT"),o=n("UWiX")("toStringTag");e.exports=function(e,t,n){e&&!i(e=n?e:e.prototype,o)&&r(e,o,{configurable:!0,value:t})}},Rp86:function(e,t,n){n("bBy9"),n("FlQf"),e.exports=n("fXsU")},Rqdy:function(e,t,n){var r=n("Y7ZC");r(r.S+r.F*!n("jmDH"),"Object",{defineProperty:n("2faE").f})},SBuE:function(e,t){e.exports={}},SEkw:function(e,t,n){e.exports={default:n("RU/L"),__esModule:!0}},"U+KD":function(e,t,n){var r=n("B+OT"),i=n("JB68"),o=n("VVlx")("IE_PROTO"),a=Object.prototype;e.exports=Object.getPrototypeOf||function(e){return e=i(e),r(e,o)?e[o]:"function"==typeof e.constructor&&e instanceof e.constructor?e.constructor.prototype:e instanceof Object?a:null}},UO39:function(e,t){e.exports=function(e,t){return{value:t,done:!!e}}},UWiX:function(e,t,n){var r=n("29s/")("wks"),i=n("YqAc"),o=n("5T2Y").Symbol,a="function"==typeof o;(e.exports=function(e){return r[e]||(r[e]=a&&o[e]||(a?o:i)("Symbol."+e))}).store=r},UbbE:function(e,t,n){n("o8NH"),e.exports=n("WEpk").Object.assign},V7oC:function(e,t,n){"use strict";t.__esModule=!0;var r,i=n("SEkw"),o=(r=i)&&r.__esModule?r:{default:r};t.default=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),(0,o.default)(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}()},VKFn:function(e,t,n){n("bBy9"),n("FlQf"),e.exports=n("ldVq")},VVlx:function(e,t,n){var r=n("29s/")("keys"),i=n("YqAc");e.exports=function(e){return r[e]||(r[e]=i(e))}},Vtdi:function(e,t,n){"use strict";var r=l(n("sk9p")),i=l(n("gDS+")),o=l(n("QbLZ")),a=l(n("iCc5")),s=l(n("V7oC")),u=n("yMsT"),c=n("Al62");function l(e){return e&&e.__esModule?e:{default:e}}var f=function(){function e(){var t=this,n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};(0,a.default)(this,e),this.screenTouched=function(){window.removeEventListener("touchstart",t.screenTouched,!0),t._startCommonAdSwitch(!0)},this.config=(0,o.default)({adDisable:!0},n),this._init(),this._commonAdShowTimes=2,this._commonadSwitchInterval=1e4,this._commonAdReopenTimeout=6e4,this._adIframe1BaseUrl="",this._isAdInit=!1}return(0,s.default)(e,[{key:"_init",value:function(){var e=this,t=(0,i.default)({random1:this.config.random1,signature1:this.config.signature1,random2:this.config.random2,signature2:this.config.signature2});this._isCommonAdSwitchOff=!1,this._isCommonAdDisplaying=!1,this._gameWrapperMsgTarget="http://xiaodu.baidu.com",this.isInApp()?window.addEventListener("message",function(t){var n=t.data;"wrapper_location_protocal"===n.type&&(n.data.indexOf("https")>-1&&(e._gameWrapperMsgTarget="https://xiaodu.baidu.com"),window.parent.postMessage({type:"register",data:e.config},e._gameWrapperMsgTarget)),t.origin===e._gameWrapperMsgTarget&&(console.log("receive h5game-wrapper's message ",n),"authorized_success"===n.type||"authorized_fail"===n.type?e._linkAccountResultCb(n):"bot_info"===n.type?(e.registerResult=n.data,e.registerCallback&&e.registerCallback(e.registerResult),e.registerCallback=null):"ship"===n.type&&e._getShipPayResult&&e._getShipPayResult(n.err,n.data))}):(this._getJSBridge(function(n){n.init(function(e,t){console.log("Receive bridge init message from native: "+e),t({"Javascript Responds":"Ready!"})}),n.callHandler("register",t,function(t){t=JSON.parse(t),e.registerResult=t,e.registerCallback&&e.registerCallback(t),e.registerCallback=null,e.config.skillID&&e.requireShipping()}),n.registerHandler("onHandleIntent",function(t,n){"RenderAdvertisement"===(t=JSON.parse(t)).intent.name?e.config.adDisable||e._isCommonAdSwitchOff||t.customData&&e._renderAd(JSON.parse(t.customData).jsonData):e.onHandleIntentCb&&e.onHandleIntentCb(t),n("js 回调")})}),this._showVersion=this._parseShowVersion(),window.addEventListener("message",function(t){if(t.origin===e._adMsgTarget){var n=t.data;console.log("receive msg from iframe: ",n),"ad_load_material"===n.type?(e._isCommonAdDisplaying?e.config.adSwitchCallback():e.config.adDisplayCallback(),e._isCommonAdDisplaying=!0,e._execLinkClick(n.data.linkClickUrl.map(function(e){return{url:e,initiator:{type:"AUTO_TRIGGER"}}}))):"ad_click"===n.type?(e.config.adClickCallback(),e._execLinkClick(n.data.linkClickUrl.map(function(e){return{url:e}})),window.addEventListener("touchstart",e.screenTouched,!0),e._pauseCommonAd()):"ad_close"===n.type&&(e.config.adCloseCallback(),e._execLinkClick(n.data.linkClickUrl.map(function(e){return{url:e}})),e._closeCommonAd(),"twice"===e.config.adDisplayStrategy&&e._commonAdShowTimes>0&&(e._commonAdShowTimes--,e._lastVerticalAdDisplayIsLeft?e._lastVerticalAdDisplayIsLeft=!1:e._lastVerticalAdDisplayIsLeft=!0,clearTimeout(e._commonadReshowTimeout),e._commonadReshowTimeout=setTimeout(function(){e._startCommonAdSwitch(!0)},e._commonAdReopenTimeout)))}}))}},{key:"_getJSBridge",value:function(e){window.WebViewJavascriptBridge?e(window.WebViewJavascriptBridge):document.addEventListener("WebViewJavascriptBridgeReady",function(){e(WebViewJavascriptBridge)},!1)}},{key:"_validateCallback",value:function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0;if("function"!=typeof t)throw new TypeError("["+e+"]'s arguments["+n+"] must be a function, but get a "+typeof t)}},{key:"_execLinkClick",value:function(e){var t=this;Array.isArray(e)?e.forEach(function(e){t.uploadLinkClicked(e)}):this.uploadLinkClicked(e)}},{key:"initAd",value:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};if(this._isAdInit)throw new Error("`initAd` can only be called once ");if(this.config=(0,o.default)({},this.config,{adZIndex:t.zIndex||9999,screenOrientation:t.screenOrientation||"portrait",adDisplayStrategy:t.displayStrategy||"twice",adClickCallback:t.clickCallback||function(){},adCloseCallback:t.closeCallback||function(){},adDisplayCallback:t.displayCallback||function(){},adSwitchCallback:t.switchCallback||function(){},adFirstDisplayTime:void 0===t.firstDisplayTime?10:t.firstDisplayTime,adBannerPosition:t.bannerPosition||{right:"30px",bottom:"30px"},adPlaceId:t.placeId,_duerosDebugadIframeUrl:t._duerosDebugadIframeUrl,adDisable:!1}),!this.config.adDisable){if(!/\d+/.test(this.config.adFirstDisplayTime))throw new Error("firstDisplayTime must be a number, please check configuration");clearTimeout(this._adFirstShowTimer),this._adFirstShowTimer=setTimeout(function(){e._startCommonAdSwitch(!0),e._commonAdShowTimes--},1e3*this.config.adFirstDisplayTime)}this._isAdInit=!0}},{key:"isInApp",value:function(){if(this._appType)return this._appType;var e=window.navigator.userAgent.toLowerCase(),t="";return e.match(/xiaoduapp\/([\S]+)/)?t="ls_m":e.match("fromapp/xiaoduapp")&&(t="oneApp"),this._appType="ls_m"===t||"oneApp"===t,this._appType}},{key:"_parseShowVersion",value:function(){if(this._showVersion)return this._showVersion;var e=navigator.userAgent,t=/build\/([\d\.]+);/i.exec(e);if(t)return this._showVersion=t[1],t[1];throw new Error("Device version number parsing failed: "+e)}},{key:"_compareShowVersion",value:function(e,t){var n=String(e).split("."),i=(0,r.default)(n,4),o=i[0],a=i[1],s=i[2],u=i[3],c=String(t).split("."),l=(0,r.default)(c,4),f=l[0],d=l[1],p=l[2],h=l[3],g=1e3*Number(o)+100*Number(a)+10*Number(s)+Number(u),m=1e3*Number(f)+100*Number(d)+10*Number(p)+Number(h);return g===m?0:g>m?1:-1}},{key:"requireUserAgeInfo",value:function(e){var t=this;if(this.isInApp())console.warn("requireUserAgeInfo: Your H5 app is not running on the App, and the callback function will not be called");else if(this._validateCallback("requireUserAgeInfo",e),this._compareShowVersion(this._parseShowVersion(),"1.35.0.0")>=0){if(!this.config.skillID)throw new Error("Missing `skillID`, please configure `skillID` when initializes the `BotApp`");this._getJSBridge(function(n){n.callHandler("requestUserAgeInfo",null,function(n){if(0===(n=JSON.parse(n)).status?e&&e(null,n.data):(e&&e(new u.ServiceError("logid: "+n.logid+", "+n.msg),n.data),console.error("requireUserAgeInfo has an error: ",n.logid,n.msg)),0!==n.status||0===Number(n.data.is_auth)){var r="dueros://"+t.config.skillID+"/certification?action=realName";t.uploadLinkClicked({url:r,initiator:{type:"AUTO_TRIGGER"}})}})})}else e(new u.LowVersionErrorMsg,null)}},{key:"requireShipping",value:function(){if(!this.config.skillID)throw new Error("Missing `skillID`, please configure `skillID` when initializes the `BotApp`");var e="dueros://"+this.config.skillID+"/readyForShipping";this.uploadLinkClicked({url:e,initiator:{type:"AUTO_TRIGGER"}})}},{key:"getRegisterResult",value:function(e){this.registerResult?e(this.registerResult):this.registerCallback=e}},{key:"requireLinkAccount",value:function(e){this.isInApp()?(this._validateCallback("requireLinkAccount",e),this._linkAccountResultCb=e,window.parent.postMessage({type:"request_authorization"},this._gameWrapperMsgTarget)):(e&&console.warn("requireLinkAccount: Your H5 app is not running on the App, and the callback function will not be called"),this._getJSBridge(function(e){e.callHandler("requireLinkAccount")}))}},{key:"onLinkAccountSuccess",value:function(e){this._validateCallback("onLinkAccountSuccess",e),this._getJSBridge(function(t){t.registerHandler("onLinkAccountSuccess",function(t,n){e(JSON.parse(t)),n(!0)})})}},{key:"requireCharge",value:function(e,t){if(this.isInApp()){if("function"!=typeof t)throw new Error("requireCharge: Your web runs in App and and you must pass a function in the position of the second to handle the purchase result.");this._getShipPayResult=t,window.parent.postMessage({type:"charge",data:e},this._gameWrapperMsgTarget)}else e=(0,i.default)(e),this._getJSBridge(function(t){t.callHandler("requireCharge",e)})}},{key:"requireBuy",value:function(e,t){if(this.isInApp()){if(!e||!e.productId||!e.sellerOrderId){var n=new Error;throw n.name="params error",n.message="requireBuy: arguments[0] must be an `Object` with `productId` and `sellerOrderId`",n}this._validateCallback("requireBuy",t,1),this._getShipPayResult=t;var r=(0,o.default)({},e,{product2:e.productId+"|"+e.sellerOrderId+"|skillstoreapp",source:"skillstoreapp",from:"skillstoreapp"});window.parent.postMessage({type:"buy",data:r},this._gameWrapperMsgTarget)}else console.error("Method `requireBuy` can only be called in App")}},{key:"uploadLinkClicked",value:function(e){e=(0,i.default)(e),this._getJSBridge(function(t){t.callHandler("uploadLinkClicked",e)})}},{key:"onChargeStatusChange",value:function(e){this._validateCallback("onChargeStatusChange",e),this._getJSBridge(function(t){t.registerHandler("onChargeStatusChange",function(t,n){e(JSON.parse(t)),n(!0)})})}},{key:"onHandleIntent",value:function(e){this._validateCallback("onHandleIntent",e),this.onHandleIntentCb=e}},{key:"updateUiContext",value:function(e,t){t&&this._validateCallback("updateUiContext",t,1),e=(0,i.default)(e),this._getJSBridge(function(n){n.callHandler("updateUiContext",e,function(e){t&&t(e)})})}},{key:"listen",value:function(e){e&&this._validateCallback("listen",e),this._getJSBridge(function(t){t.callHandler("listen",function(t){e&&e(t)})})}},{key:"speak",value:function(e,t){t&&this._validateCallback("speak",t,1),this._getJSBridge(function(n){n.callHandler("speak",e,function(){t&&t()})})}},{key:"requestClose",value:function(){this.isInApp()?window.parent.postMessage({type:"closeWebView"},this._gameWrapperMsgTarget):this._getJSBridge(function(e){e.callHandler("requestClose")})}},{key:"onClickLink",value:function(e){var t=this;this._validateCallback("onClickLink",e),this._getJSBridge(function(n){n.registerHandler("onClickLink",function(n,r){"http://sdk.bot.dueros.ai?action=unknown_utterance"===(n=JSON.parse(n)).url?t._handleUnknowUtteranceCb&&t._handleUnknowUtteranceCb(null,JSON.parse(n.params)):e(n),r(!0)})})}},{key:"onHandleScreenNavigatorEvent",value:function(e){this._validateCallback("onHandleScreenNavigatorEvent",e),this._getJSBridge(function(t){t.registerHandler("onHandleScreenNavigatorEvent",function(t,n){e(JSON.parse(t)),n(!0)})})}},{key:"onDialogStateChanged",value:function(e){this._validateCallback("onDialogStateChanged",e),this._compareShowVersion(this._parseShowVersion(),"1.36.0.0")>=0?this._getJSBridge(function(t){t.registerHandler("onDialogStateChanged",function(t,n){var r=JSON.parse(t);e(null,r.data),n(!0)})}):e(new u.LowVersionErrorMsg,null)}},{key:"onHandleUnknowUtterance",value:function(e){this._validateCallback("onHandleUnknowUtterance",e),this._compareShowVersion(this._parseShowVersion(),"1.36.0.0")>=0?this._handleUnknowUtteranceCb=e:e(new u.LowVersionErrorMsg,null)}},{key:"canGoBack",value:function(e){this._validateCallback("canGoBack",e),this._compareShowVersion(this._parseShowVersion(),"1.36.0.0")>=0?this._getJSBridge(function(t){t.callHandler("canGoBack",null,function(t){t=JSON.parse(t),e(null,t.data)})}):e(new u.LowVersionErrorMsg,null)}},{key:"_renderAd",value:function(e){var t=this,n=JSON.parse(e),r=decodeURIComponent(n.props.htmlAddress);if(0===n.status){if(this._adIframe1){if(!this.config._duerosDebugadIframeUrl&&this._adIframe1BaseUrl!==r)return document.body.removeChild(this._adIframe1),this._adIframe1Loaded=!1,this._adIframe1=null,void this._renderAd(e)}else{this._adIframe1=document.createElement("iframe");var i=encodeURIComponent((0,c.parseH5UrlOrigin)(window.location.href));this.config._duerosDebugadIframeUrl?(this._adIframe1BaseUrl=this.config._duerosDebugadIframeUrl,this._adMsgTarget=(0,c.parseH5UrlOrigin)(this.config._duerosDebugadIframeUrl)):(this._adIframe1BaseUrl=r,this._adMsgTarget=(0,c.parseH5UrlOrigin)(r));var a="";a=this._adIframe1BaseUrl.indexOf("?")>-1?this._adIframe1BaseUrl+"&msgTarget="+i:this._adIframe1BaseUrl+"?msgTarget="+i,this._adIframe1.src=a,this._adIframe1.scrolling="no",this._adIframe1.frameBorder=0,this._adIframe1.allowTransparency="true",document.body.appendChild(this._adIframe1),this._adIframe1.style.cssText+="display: block; z-index: "+this.config.adZIndex+";position: fixed; background-color=transparent;"}this._adIframe1.style.display="block",this._setAdPosition();var s={type:"ad_set_material",data:(0,o.default)({},n,{screenOrientation:this.config.screenOrientation})};this._adIframe1Loaded?this._adIframe1.contentWindow.postMessage(s,this._adMsgTarget):this._adIframe1.onload=function(){t._adIframe1.contentWindow.postMessage(s,t._adMsgTarget),t._adIframe1Loaded=!0}}else console.error("Failed to get advertisement: ",n)}},{key:"_requestCommonadMaterial",value:function(){var e="dueros://f34646bc-37b4-a9db-361f-48fe7ca8831d/getAdResources?adPlaceId="+this.config.adPlaceId+"&botId="+this.config.skillID;this.uploadLinkClicked({url:e,initiator:{type:"AUTO_TRIGGER"}})}},{key:"_setAdPosition",value:function(){"portrait"===this.config.screenOrientation?(this._adIframe1.style.cssText+="width: 242px; height: 214px;bottom: 30px;",this._lastVerticalAdDisplayIsLeft?(this._adIframe1.style.left="",this._adIframe1.style.right="23px"):(this._adIframe1.style.left="23px",this._adIframe1.style.right="")):"landscape"===this.config.screenOrientation&&(this._adIframe1.style.cssText+="width: 446px; height: 118px;",(0,c.isSet)(this.config.adBannerPosition.top)&&(this._adIframe1.style.top=this.config.adBannerPosition.top),(0,c.isSet)(this.config.adBannerPosition.right)&&(this._adIframe1.style.right=this.config.adBannerPosition.right),(0,c.isSet)(this.config.adBannerPosition.bottom)&&(this._adIframe1.style.bottom=this.config.adBannerPosition.bottom),(0,c.isSet)(this.config.adBannerPosition.left)&&(this._adIframe1.style.left=this.config.adBannerPosition.left))}},{key:"_startCommonAdSwitch",value:function(e){var t=this;this._isCommonAdSwitchOff=!1,e&&this._requestCommonadMaterial(),clearInterval(this._commonAdSwitchTimer),this._commonAdSwitchTimer=setInterval(function(){t._requestCommonadMaterial()},this._commonadSwitchInterval)}},{key:"_closeCommonAd",value:function(){clearInterval(this._commonAdSwitchTimer),this._isCommonAdSwitchOff=!0,this._adIframe1.style.display="none",this._isCommonAdDisplaying=!1}},{key:"_pauseCommonAd",value:function(){clearInterval(this._commonAdSwitchTimer),this._isCommonAdSwitchOff=!0}}]),e}();e.exports=f},W070:function(e,t,n){var r=n("NsO/"),i=n("tEej"),o=n("D8kY");e.exports=function(e){return function(t,n,a){var s,u=r(t),c=i(u.length),l=o(a,c);if(e&&n!=n){for(;c>l;)if((s=u[l++])!=s)return!0}else for(;c>l;l++)if((e||l in u)&&u[l]===n)return e||l||0;return!e&&-1}}},WEpk:function(e,t){var n=e.exports={version:"2.6.9"};"number"==typeof __e&&(__e=n)},Y7ZC:function(e,t,n){var r=n("5T2Y"),i=n("WEpk"),o=n("2GTP"),a=n("NegM"),s=n("B+OT"),u=function(e,t,n){var c,l,f,d=e&u.F,p=e&u.G,h=e&u.S,g=e&u.P,m=e&u.B,v=e&u.W,_=p?i:i[t]||(i[t]={}),y=_.prototype,k=p?r:h?r[t]:(r[t]||{}).prototype;for(c in p&&(n=t),n)(l=!d&&k&&void 0!==k[c])&&s(_,c)||(f=l?k[c]:n[c],_[c]=p&&"function"!=typeof k[c]?n[c]:m&&l?o(f,r):v&&k[c]==f?function(e){var t=function(t,n,r){if(this instanceof e){switch(arguments.length){case 0:return new e;case 1:return new e(t);case 2:return new e(t,n)}return new e(t,n,r)}return e.apply(this,arguments)};return t.prototype=e.prototype,t}(f):g&&"function"==typeof f?o(Function.call,f):f,g&&((_.virtual||(_.virtual={}))[c]=f,e&u.R&&y&&!y[c]&&a(y,c,f)))};u.F=1,u.G=2,u.S=4,u.P=8,u.B=16,u.W=32,u.U=64,u.R=128,e.exports=u},YqAc:function(e,t){var n=0,r=Math.random();e.exports=function(e){return"Symbol(".concat(void 0===e?"":e,")_",(++n+r).toString(36))}},a0xu:function(e,t){var n={}.toString;e.exports=function(e){return n.call(e).slice(8,-1)}},bBy9:function(e,t,n){n("w2d+");for(var r=n("5T2Y"),i=n("NegM"),o=n("SBuE"),a=n("UWiX")("toStringTag"),s="CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,TextTrackList,TouchList".split(","),u=0;u<s.length;u++){var c=s[u],l=r[c],f=l&&l.prototype;f&&!f[a]&&i(f,a,c),o[c]=o.Array}},ccE7:function(e,t,n){var r=n("Ojgd"),i=n("Jes0");e.exports=function(e){return function(t,n){var o,a,s=String(i(t)),u=r(n),c=s.length;return u<0||u>=c?e?"":void 0:(o=s.charCodeAt(u))<55296||o>56319||u+1===c||(a=s.charCodeAt(u+1))<56320||a>57343?e?s.charAt(u):o:e?s.slice(u,u+2):a-56320+(o-55296<<10)+65536}}},eUtF:function(e,t,n){e.exports=!n("jmDH")&&!n("KUxP")(function(){return 7!=Object.defineProperty(n("Hsns")("div"),"a",{get:function(){return 7}}).a})},eaoh:function(e,t){e.exports=function(e){if("function"!=typeof e)throw TypeError(e+" is not a function!");return e}},fNZA:function(e,t,n){var r=n("QMMT"),i=n("UWiX")("iterator"),o=n("SBuE");e.exports=n("WEpk").getIteratorMethod=function(e){if(null!=e)return e[i]||e["@@iterator"]||o[r(e)]}},fXsU:function(e,t,n){var r=n("5K7Z"),i=n("fNZA");e.exports=n("WEpk").getIterator=function(e){var t=i(e);if("function"!=typeof t)throw TypeError(e+" is not iterable!");return r(t.call(e))}},fpC5:function(e,t,n){var r=n("2faE"),i=n("5K7Z"),o=n("w6GO");e.exports=n("jmDH")?Object.defineProperties:function(e,t){i(e);for(var n,a=o(t),s=a.length,u=0;s>u;)r.f(e,n=a[u++],t[n]);return e}},"gDS+":function(e,t,n){e.exports={default:n("oh+g"),__esModule:!0}},hDam:function(e,t){e.exports=function(){}},iCc5:function(e,t,n){"use strict";t.__esModule=!0,t.default=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}},iq4v:function(e,t,n){n("Mqbl"),e.exports=n("WEpk").Object.keys},j2DC:function(e,t,n){"use strict";var r=n("oVml"),i=n("rr1i"),o=n("RfKB"),a={};n("NegM")(a,n("UWiX")("iterator"),function(){return this}),e.exports=function(e,t,n){e.prototype=r(a,{next:i(1,n)}),o(e,t+" Iterator")}},jmDH:function(e,t,n){e.exports=!n("KUxP")(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})},"k/8l":function(e,t,n){e.exports={default:n("VKFn"),__esModule:!0}},kTiW:function(e,t,n){e.exports=n("NegM")},kwZ1:function(e,t,n){"use strict";var r=n("jmDH"),i=n("w6GO"),o=n("mqlF"),a=n("NV0k"),s=n("JB68"),u=n("M1xp"),c=Object.assign;e.exports=!c||n("KUxP")(function(){var e={},t={},n=Symbol(),r="abcdefghijklmnopqrst";return e[n]=7,r.split("").forEach(function(e){t[e]=e}),7!=c({},e)[n]||Object.keys(c({},t)).join("")!=r})?function(e,t){for(var n=s(e),c=arguments.length,l=1,f=o.f,d=a.f;c>l;)for(var p,h=u(arguments[l++]),g=f?i(h).concat(f(h)):i(h),m=g.length,v=0;m>v;)p=g[v++],r&&!d.call(h,p)||(n[p]=h[p]);return n}:c},ldVq:function(e,t,n){var r=n("QMMT"),i=n("UWiX")("iterator"),o=n("SBuE");e.exports=n("WEpk").isIterable=function(e){var t=Object(e);return void 0!==t[i]||"@@iterator"in t||o.hasOwnProperty(r(t))}},mqlF:function(e,t){t.f=Object.getOwnPropertySymbols},o8NH:function(e,t,n){var r=n("Y7ZC");r(r.S+r.F,"Object",{assign:n("kwZ1")})},oVml:function(e,t,n){var r=n("5K7Z"),i=n("fpC5"),o=n("FpHa"),a=n("VVlx")("IE_PROTO"),s=function(){},u=function(){var e,t=n("Hsns")("iframe"),r=o.length;for(t.style.display="none",n("MvwC").appendChild(t),t.src="javascript:",(e=t.contentWindow.document).open(),e.write("<script>document.F=Object<\/script>"),e.close(),u=e.F;r--;)delete u.prototype[o[r]];return u()};e.exports=Object.create||function(e,t){var n;return null!==e?(s.prototype=r(e),n=new s,s.prototype=null,n[a]=e):n=u(),void 0===t?n:i(n,t)}},"oh+g":function(e,t,n){var r=n("WEpk"),i=r.JSON||(r.JSON={stringify:JSON.stringify});e.exports=function(e){return i.stringify.apply(i,arguments)}},rr1i:function(e,t){e.exports=function(e,t){return{enumerable:!(1&e),configurable:!(2&e),writable:!(4&e),value:t}}},sk9p:function(e,t,n){"use strict";t.__esModule=!0;var r=o(n("k/8l")),i=o(n("FyfS"));function o(e){return e&&e.__esModule?e:{default:e}}t.default=function(e,t){if(Array.isArray(e))return e;if((0,r.default)(Object(e)))return function(e,t){var n=[],r=!0,o=!1,a=void 0;try{for(var s,u=(0,i.default)(e);!(r=(s=u.next()).done)&&(n.push(s.value),!t||n.length!==t);r=!0);}catch(e){o=!0,a=e}finally{try{!r&&u.return&&u.return()}finally{if(o)throw a}}return n}(e,t);throw new TypeError("Invalid attempt to destructure non-iterable instance")}},tEej:function(e,t,n){var r=n("Ojgd"),i=Math.min;e.exports=function(e){return e>0?i(r(e),9007199254740991):0}},uOPS:function(e,t){e.exports=!0},"w2d+":function(e,t,n){"use strict";var r=n("hDam"),i=n("UO39"),o=n("SBuE"),a=n("NsO/");e.exports=n("MPFp")(Array,"Array",function(e,t){this._t=a(e),this._i=0,this._k=t},function(){var e=this._t,t=this._k,n=this._i++;return!e||n>=e.length?(this._t=void 0,i(1)):i(0,"keys"==t?n:"values"==t?e[n]:[n,e[n]])},"values"),o.Arguments=o.Array,r("keys"),r("values"),r("entries")},w6GO:function(e,t,n){var r=n("5vMV"),i=n("FpHa");e.exports=Object.keys||function(e){return r(e,i)}},yMsT:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.ServiceError=t.LowVersionErrorMsg=void 0;var r,i=n("iCc5"),o=(r=i)&&r.__esModule?r:{default:r};t.LowVersionErrorMsg=function e(){(0,o.default)(this,e),this.code=1001,this.msg="Device version too low"},t.ServiceError=function e(t){(0,o.default)(this,e),this.code=1002,this.msg="Service error, "+t}},zn7N:function(e,t,n){var r=n("Y7ZC"),i=n("WEpk"),o=n("KUxP");e.exports=function(e,t){var n=(i.Object||{})[e]||Object[e],a={};a[e]=t(n),r(r.S+r.F*o(function(){n(1)}),"Object",a)}}});