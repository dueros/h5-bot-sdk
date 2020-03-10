/*! @baidu/h5-bot-sdk - 1.7.0 */
var BotApp =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "Vtdi");
/******/ })
/************************************************************************/
/******/ ({

/***/ "29s/":
/***/ (function(module, exports, __webpack_require__) {

var core = __webpack_require__("WEpk");
var global = __webpack_require__("5T2Y");
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: __webpack_require__("uOPS") ? 'pure' : 'global',
  copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
});


/***/ }),

/***/ "2GTP":
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__("eaoh");
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),

/***/ "2faE":
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__("5K7Z");
var IE8_DOM_DEFINE = __webpack_require__("eUtF");
var toPrimitive = __webpack_require__("G8Mo");
var dP = Object.defineProperty;

exports.f = __webpack_require__("jmDH") ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),

/***/ "5K7Z":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("93I4");
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),

/***/ "5T2Y":
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),

/***/ "5vMV":
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__("B+OT");
var toIObject = __webpack_require__("NsO/");
var arrayIndexOf = __webpack_require__("W070")(false);
var IE_PROTO = __webpack_require__("VVlx")('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),

/***/ "93I4":
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),

/***/ "Al62":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* eslint-disable */

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _keys = __webpack_require__("GQeE");

var _keys2 = _interopRequireDefault(_keys);

exports.getQuery = getQuery;
exports.encodeQueryData = encodeQueryData;
exports.isSet = isSet;
exports.parseH5UrlOrigin = parseH5UrlOrigin;

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
    return typeof k !== 'undefined';
}

function parseH5UrlOrigin(url) {
    if (url) {
        var a = document.createElement('a');
        a.href = url;
        return a.origin;
    } else {
        return '';
    }
}

/***/ }),

/***/ "B+OT":
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),

/***/ "D8kY":
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__("Ojgd");
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};


/***/ }),

/***/ "FWYc":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* eslint-disable */

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * @file 广告展示相关事件
 * @author dengxuening<dengxuening@baidu.com>
 */

/**
 * 广告相关事件
 * @type {{SHOW: number, CLICK: number, CLOSE: number}}
 */
var AdAction = exports.AdAction = {
  SHOW: 1,
  CLICK: 2,
  CLOSE: 3
};

/***/ }),

/***/ "FlQf":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $at = __webpack_require__("ccE7")(true);

// 21.1.3.27 String.prototype[@@iterator]()
__webpack_require__("MPFp")(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});


/***/ }),

/***/ "FpHa":
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');


/***/ }),

/***/ "FyfS":
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__("Rp86"), __esModule: true };

/***/ }),

/***/ "G8Mo":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__("93I4");
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),

/***/ "GQeE":
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__("iq4v"), __esModule: true };

/***/ }),

/***/ "Hsns":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("93I4");
var document = __webpack_require__("5T2Y").document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),

/***/ "JB68":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__("Jes0");
module.exports = function (it) {
  return Object(defined(it));
};


/***/ }),

/***/ "Jes0":
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),

/***/ "KUxP":
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),

/***/ "M1xp":
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__("a0xu");
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),

/***/ "MPFp":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__("uOPS");
var $export = __webpack_require__("Y7ZC");
var redefine = __webpack_require__("kTiW");
var hide = __webpack_require__("NegM");
var Iterators = __webpack_require__("SBuE");
var $iterCreate = __webpack_require__("j2DC");
var setToStringTag = __webpack_require__("RfKB");
var getPrototypeOf = __webpack_require__("U+KD");
var ITERATOR = __webpack_require__("UWiX")('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};


/***/ }),

/***/ "Mqbl":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 Object.keys(O)
var toObject = __webpack_require__("JB68");
var $keys = __webpack_require__("w6GO");

__webpack_require__("zn7N")('keys', function () {
  return function keys(it) {
    return $keys(toObject(it));
  };
});


/***/ }),

/***/ "MvwC":
/***/ (function(module, exports, __webpack_require__) {

var document = __webpack_require__("5T2Y").document;
module.exports = document && document.documentElement;


/***/ }),

/***/ "NV0k":
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;


/***/ }),

/***/ "NegM":
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__("2faE");
var createDesc = __webpack_require__("rr1i");
module.exports = __webpack_require__("jmDH") ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ "NsO/":
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__("M1xp");
var defined = __webpack_require__("Jes0");
module.exports = function (it) {
  return IObject(defined(it));
};


/***/ }),

/***/ "Ojgd":
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),

/***/ "P2sY":
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__("UbbE"), __esModule: true };

/***/ }),

/***/ "QMMT":
/***/ (function(module, exports, __webpack_require__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__("a0xu");
var TAG = __webpack_require__("UWiX")('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};


/***/ }),

/***/ "QbLZ":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _assign = __webpack_require__("P2sY");

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _assign2.default || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

/***/ }),

/***/ "RU/L":
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__("Rqdy");
var $Object = __webpack_require__("WEpk").Object;
module.exports = function defineProperty(it, key, desc) {
  return $Object.defineProperty(it, key, desc);
};


/***/ }),

/***/ "RfKB":
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__("2faE").f;
var has = __webpack_require__("B+OT");
var TAG = __webpack_require__("UWiX")('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};


/***/ }),

/***/ "Rp86":
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__("bBy9");
__webpack_require__("FlQf");
module.exports = __webpack_require__("fXsU");


/***/ }),

/***/ "Rqdy":
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__("Y7ZC");
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !__webpack_require__("jmDH"), 'Object', { defineProperty: __webpack_require__("2faE").f });


/***/ }),

/***/ "SBuE":
/***/ (function(module, exports) {

module.exports = {};


/***/ }),

/***/ "SEkw":
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__("RU/L"), __esModule: true };

/***/ }),

/***/ "U+KD":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = __webpack_require__("B+OT");
var toObject = __webpack_require__("JB68");
var IE_PROTO = __webpack_require__("VVlx")('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};


/***/ }),

/***/ "UO39":
/***/ (function(module, exports) {

module.exports = function (done, value) {
  return { value: value, done: !!done };
};


/***/ }),

/***/ "UWiX":
/***/ (function(module, exports, __webpack_require__) {

var store = __webpack_require__("29s/")('wks');
var uid = __webpack_require__("YqAc");
var Symbol = __webpack_require__("5T2Y").Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;


/***/ }),

/***/ "UbbE":
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__("o8NH");
module.exports = __webpack_require__("WEpk").Object.assign;


/***/ }),

/***/ "V7oC":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _defineProperty = __webpack_require__("SEkw");

var _defineProperty2 = _interopRequireDefault(_defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

/***/ }),

/***/ "VKFn":
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__("bBy9");
__webpack_require__("FlQf");
module.exports = __webpack_require__("ldVq");


/***/ }),

/***/ "VVlx":
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__("29s/")('keys');
var uid = __webpack_require__("YqAc");
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};


/***/ }),

/***/ "Vtdi":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* eslint-disable */

var _slicedToArray2 = __webpack_require__("sk9p");

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _stringify = __webpack_require__("gDS+");

var _stringify2 = _interopRequireDefault(_stringify);

var _extends2 = __webpack_require__("QbLZ");

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = __webpack_require__("iCc5");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__("V7oC");

var _createClass3 = _interopRequireDefault(_createClass2);

var _errors = __webpack_require__("yMsT");

var _events = __webpack_require__("FWYc");

var _utils = __webpack_require__("Al62");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @callback requestCallback 一种回调函数(随便定义的名字。。。)
 */

/**
 * 与Native的交互做了封装
 * @class
 */
var BotApp = function () {

    /**
     * @constructor
     * @param {Object} config 必填，身份校验等相关信息
     * @param {string} config.random1 // 必填，随机字符串，长度不限，由开发者自己生成
     * @param {string} config.signature1 // 必填，将(random1 + appkey)的字符串拼接后做MD5运算得出
     * @param {string} config.random2 //  必填，随机字符串，长度不限，由开发者自己生成
     * @param {string} config.signature2 // 必填，将(random2 + appkey)的字符串拼接后做MD5运算得出
     * @param {string} config.skillID // 必填，技能ID
     * @param {number} config.zIndex // 选填，默认值：9999，广告等浮层的层级，
     * @param {boolean} config.adDisable // 选填，默认值：false，是否禁用广告
     * @param {number} config.screenShapeType // 当adDisable为false时必填，游戏的屏幕类型，1 => 竖屏，2 => 全屏
     * @param {number} config.adDisplayStrategy // 选填，广告展示策略，1 => 用户关闭后不再填充广告， 2 => 用户关闭后再填充一次
     * @param {Function} config.adDisplayCallback // 选填，广告状态发生改变时的回调
     * @param {number} config.adFirstShowTime // 选填，单位秒，广告第一次展示在游戏打开后多久
     * @param {Object} config.adBannerPos // 选填，调整banner广告在游戏页面中的位置。值为CSS中的left、top、right、bottom，例如：adBannerPos: {left: '20px', top: '20px'}
     * @param {string} config._duerosDebugadIframeUrl // 选填，内部使用，设置广告iframe的URL地址
     */
    function BotApp() {
        var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        (0, _classCallCheck3.default)(this, BotApp);

        this.config = (0, _extends3.default)({
            zIndex: 9999,
            adDisable: false,
            screenShapeType: 1, // 1 => 竖屏， 2 => 全屏
            adDisplayStrategy: 1, // 1 => 用户关闭后不再填充广告， 2 => 用户关闭后再填充一次
            adDisplayCallback: function adDisplayCallback(err, data) {},
            adFirstShowTime: 10,
            adBannerPos: {
                right: '30px',
                bottom: '30px'
            }
        }, config);
        this._init();

        // session期间最多弹出广告2次
        this._commonAdShowTimes = 2;

        // 广告弹出后，每次切换间隔10s
        this._commonadSwitchInterval = 10000;

        // 广告关闭后，下次打开在60s后
        this._commonAdReopenTimeout = 60000;

        // 广告iframe baseUrl
        this._adIframe1BaseUrl = '';
    }

    (0, _createClass3.default)(BotApp, [{
        key: "_init",
        value: function _init() {
            var _this = this;

            var registerConfig = (0, _stringify2.default)({
                random1: this.config.random1,
                signature1: this.config.signature1,
                random2: this.config.random2,
                signature2: this.config.signature2
            });

            this._isCommonAdClosed = false;
            this._gameWrapperMsgTarget = 'http://xiaodu.baidu.com';

            if (this.isInApp()) {
                window.addEventListener('message', function (event) {
                    var data = event.data;
                    if (data.type === 'wrapper_location_protocal') {
                        // 如果检测到父页面是https协议的，则升级为https
                        if (data.data.indexOf('https') > -1) {
                            _this._gameWrapperMsgTarget = 'https://xiaodu.baidu.com';
                        }
                        // 确认链接是否是https之后开始注册
                        window.parent.postMessage({
                            type: 'register',
                            data: _this.config
                        }, _this._gameWrapperMsgTarget);
                    }

                    if (event.origin === _this._gameWrapperMsgTarget) {
                        console.log('receive h5game-wrapper\'s message ', data);
                        if (data.type === 'authorized_success' || data.type === 'authorized_fail') {
                            _this._linkAccountResultCb(data);
                        } else if (data.type === 'bot_info') {
                            _this.registerResult = data.data;
                            _this.registerCallback && _this.registerCallback(_this.registerResult);
                            _this.registerCallback = null;
                        } else if (data.type === 'ship') {
                            _this._getShipPayResult && _this._getShipPayResult(data.err, data.data);
                        }
                    }
                });
            } else {
                this._getJSBridge(function (bridge) {
                    bridge.init(function (message, responseCallback) {
                        var data = {
                            'Javascript Responds': 'Ready!'
                        };
                        console.log('Receive bridge init message from native: ' + message);
                        responseCallback(data);
                    });

                    // Native依赖这几个参数进行身份校验
                    bridge.callHandler('register', registerConfig, function (payload) {
                        payload = JSON.parse(payload);
                        _this.registerResult = payload;
                        _this.registerCallback && _this.registerCallback(payload);
                        _this.registerCallback = null;

                        if (_this.config.skillID) {
                            _this.requireShipping();
                        }
                    });
                });
                this._showVersion = this._parseShowVersion();

                window.addEventListener('message', function (event) {
                    if (event.origin === _this._adMsgTarget) {
                        var data = event.data;
                        console.log('receive msg from iframe: ', data);
                        if (data.type === 'ad_load_material') {
                            // todo ... 告知开发者广告打开情况
                            _this._adDisplayCallback(null, {
                                action: 'SHOW'
                            });
                            _this._execLinkClick(data.data.linkClickUrl);
                        } else if (data.type === 'ad_click') {
                            _this._adDisplayCallback(null, {
                                action: 'CLICK'
                            });
                            _this._execLinkClick(data.data.linkClickUrl);
                        } else if (data.type === 'ad_close') {
                            _this._adDisplayCallback(null, {
                                action: 'CLOSE'
                            });
                            _this._execLinkClick(data.data.linkClickUrl);

                            _this._closeCommonAd();

                            // 如果开发者选择广告策略 2
                            // 则在某一时间之后再次打开
                            if (_this.config.adDisplayStrategy === 2) {
                                // 如果广告打开次数还有剩余
                                if (_this._commonAdShowTimes > 0) {
                                    _this._commonAdShowTimes--;

                                    // 控制竖屏广告展示在屏幕左侧还是右侧
                                    if (_this._lastVerticalAdDisplayIsLeft) {
                                        _this._lastVerticalAdDisplayIsLeft = false;
                                    } else {
                                        _this._lastVerticalAdDisplayIsLeft = true;
                                    }
                                    clearTimeout(_this._commonadReshowTimeout);
                                    _this._commonadReshowTimeout = setTimeout(function () {
                                        _this._startCommonAdSwitch(true);
                                    }, _this._commonAdReopenTimeout);
                                }
                            }
                        }
                    }
                });
            }

            this._adDisplayCallback = this.config.adDisplayCallback ? this.config.adDisplayCallback : function () {};

            if (!this.config.adDisable) {
                // 校验是否是数字，随后在某一时间开始弹出广告
                if (/\d+/.test(this.config.adFirstShowTime)) {
                    clearTimeout(this._adFirstShowTimer);
                    this._adFirstShowTimer = setTimeout(function () {
                        _this._startCommonAdSwitch(true);
                        _this._commonAdShowTimes--;
                    }, this.config.adFirstShowTime * 1000);
                } else {
                    throw new Error('adFirstShowTime must be a number, please check configuration');
                }
            }
        }
    }, {
        key: "_getJSBridge",
        value: function _getJSBridge(cb) {
            if (window.WebViewJavascriptBridge) {
                cb(window.WebViewJavascriptBridge);
            } else {
                document.addEventListener('WebViewJavascriptBridgeReady', function () {
                    cb(WebViewJavascriptBridge);
                }, false);
            }
        }
    }, {
        key: "_validateCallback",
        value: function _validateCallback(fnName, arg) {
            var index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

            if (typeof arg !== 'function') {
                throw new TypeError("[" + fnName + "]'s arguments[" + index + "] must be a function, but get a " + typeof arg);
            }
        }

        /**
         * 执行LinkClick
         * @param {Array|string} linkClickUrl 要执行的LinkClickUrl，可能为数组
         * @private
         */

    }, {
        key: "_execLinkClick",
        value: function _execLinkClick(linkClickUrl) {
            var _this2 = this;

            if (Array.isArray(linkClickUrl)) {
                linkClickUrl.forEach(function (url) {
                    _this2.uploadLinkClicked({
                        url: url
                    });
                });
            } else {
                this.uploadLinkClicked({
                    url: linkClickUrl
                });
            }
        }

        // 判断APP的类型

    }, {
        key: "isInApp",
        value: function isInApp() {
            if (this._appType) {
                return this._appType;
            } else {
                var ua = window.navigator.userAgent.toLowerCase();
                var appType = '';
                if (ua.match(/xiaoduapp\/([\S]+)/)) {
                    // 小度音箱APP
                    appType = 'ls_m';
                } else if (ua.match('fromapp/xiaoduapp')) {
                    // 小度APP
                    appType = 'oneApp';
                }
                this._appType = appType === 'ls_m' || appType === 'oneApp';
                return this._appType;
            }
        }

        /**
         * 将SHOW端设备里的版本后解析出来
         * @returns {string}
         * @private
         */

    }, {
        key: "_parseShowVersion",
        value: function _parseShowVersion() {
            if (this._showVersion) {
                return this._showVersion;
            }
            var ua = navigator.userAgent;
            var reg = /build\/([\d\.]+);/i;
            var result = reg.exec(ua);
            if (result) {
                this._showVersion = result[1];
                return result[1];
            } else {
                throw new Error('Device version number parsing failed: ' + ua);
            }
        }

        /**
         * SHOW端设备的版本号对比
         * @param {string} a 版本号
         * @param {string} b 版本号
         * @returns {number} 如果返回0，则表示版本号相同，如果返回1，a版本号大于b版本号，如果返回-1则a版本号小于b
         * @private
         */

    }, {
        key: "_compareShowVersion",
        value: function _compareShowVersion(a, b) {
            var _String$split = String(a).split('.'),
                _String$split2 = (0, _slicedToArray3.default)(_String$split, 4),
                a1 = _String$split2[0],
                a2 = _String$split2[1],
                a3 = _String$split2[2],
                a4 = _String$split2[3];

            var _String$split3 = String(b).split('.'),
                _String$split4 = (0, _slicedToArray3.default)(_String$split3, 4),
                b1 = _String$split4[0],
                b2 = _String$split4[1],
                b3 = _String$split4[2],
                b4 = _String$split4[3];

            var aSize = Number(a1) * 1000 + Number(a2) * 100 + Number(a3) * 10 + Number(a4);
            var bSize = Number(b1) * 1000 + Number(b2) * 100 + Number(b3) * 10 + Number(b4);
            if (aSize === bSize) {
                return 0;
            } else if (aSize > bSize) {
                return 1;
            } else {
                return -1;
            }
        }

        /**
         * 获取用户实名认证的年龄段信息
         * SHOW 1.35.0.0及其以后的版本可用
         *
         * @param {requestCallback} cb
         */

    }, {
        key: "requireUserAgeInfo",
        value: function requireUserAgeInfo(cb) {
            var _this3 = this;

            if (this.isInApp()) {
                console.warn('requireUserAgeInfo: Your H5 app is not running on the App, and the callback function will not be called');
                return;
            } else {
                this._validateCallback('requireUserAgeInfo', cb);
                if (this._compareShowVersion(this._parseShowVersion(), '1.35.0.0') >= 0) {
                    if (this.config.skillID) {
                        this._getJSBridge(function (bridge) {
                            bridge.callHandler('requestUserAgeInfo', null, function (payload) {
                                payload = JSON.parse(payload);
                                if (payload.status === 0) {
                                    cb && cb(null, payload.data);
                                } else {
                                    cb && cb(new _errors.ServiceError("logid: " + payload.logid + ", " + payload.msg), payload.data);
                                    console.error('requireUserAgeInfo has an error: ', payload.logid, payload.msg);
                                }

                                if (payload.status !== 0 || Number(payload.data.is_auth) === 0) {
                                    var link = "dueros://" + _this3.config.skillID + "/certification?action=realName";
                                    _this3.uploadLinkClicked({
                                        url: link
                                    });
                                }
                            });
                        });
                    } else {
                        throw new Error('Missing `skillID`, please configure `skillID` when initializes the `BotApp`');
                    }
                } else {
                    cb(new _errors.LowVersionErrorMsg(), null);
                }
            }
        }
    }, {
        key: "requireShipping",
        value: function requireShipping() {
            if (this.config.skillID) {
                var link = "dueros://" + this.config.skillID + "/readyForShipping";
                this.uploadLinkClicked({
                    url: link
                });
            } else {
                throw new Error('Missing `skillID`, please configure `skillID` when initializes the `BotApp`');
            }
        }
    }, {
        key: "getRegisterResult",
        value: function getRegisterResult(cb) {
            if (this.registerResult) {
                cb(this.registerResult);
            } else {
                this.registerCallback = cb;
            }
        }

        /**
         * 发起账户oauth授权操作，调用此方法后
         * 小度有屏音箱会展示一个授权页面，App上会弹出授权浮层
         * 仅当运行环境是App时才会触发回调
         */

    }, {
        key: "requireLinkAccount",
        value: function requireLinkAccount(cb) {
            if (this.isInApp()) {
                this._validateCallback('requireLinkAccount', cb);
                this._linkAccountResultCb = cb;
                window.parent.postMessage({
                    type: 'request_authorization'
                }, this._gameWrapperMsgTarget);
            } else {
                if (cb) {
                    console.warn('requireLinkAccount: Your H5 app is not running on the App, and the callback function will not be called');
                }
                this._getJSBridge(function (bridge) {
                    bridge.callHandler('requireLinkAccount');
                });
            }
        }

        /**
         * 接收账号oauth授权成功指令
         * @param {requestCallback} cb 授权成功后会调用此函数
         */

    }, {
        key: "onLinkAccountSuccess",
        value: function onLinkAccountSuccess(cb) {
            this._validateCallback('onLinkAccountSuccess', cb);
            this._getJSBridge(function (bridge) {
                bridge.registerHandler('onLinkAccountSuccess', function (payload, callback) {
                    cb(JSON.parse(payload));
                    callback(true);
                });
            });
        }

        /**
         * 发起收款操作，调用此函数小度有屏音箱
         * 会展示付款二维码
         * @param {Object} data 携带订单号，商品名称等参数
         * @param {Function} cb 购买结果回调，当在App中运行时本参数必填
         */

    }, {
        key: "requireCharge",
        value: function requireCharge(data, cb) {
            if (this.isInApp()) {
                if (typeof cb !== 'function') {
                    throw new Error('requireCharge: Your web runs in App and and you must pass a function' + ' in the position of the second to handle the purchase result.');
                }
                this._getShipPayResult = cb;
                window.parent.postMessage({
                    type: 'charge',
                    data: data
                }, this._gameWrapperMsgTarget);
            } else {
                data = (0, _stringify2.default)(data);
                this._getJSBridge(function (bridge) {
                    bridge.callHandler('requireCharge', data);
                });
            }
        }
    }, {
        key: "requireBuy",
        value: function requireBuy(data, cb) {
            if (this.isInApp()) {
                if (!data || !data.productId || !data.sellerOrderId) {
                    var e = new Error();
                    e.name = 'params error';
                    e.message = 'requireBuy: arguments[0] must be an `Object` with `productId` and `sellerOrderId`';
                    throw e;
                }
                this._validateCallback('requireBuy', cb, 1);
                this._getShipPayResult = cb;
                var postData = (0, _extends3.default)({}, data, {
                    product2: data.productId + "|" + data.sellerOrderId + "|skillstoreapp",
                    source: 'skillstoreapp',
                    from: 'skillstoreapp'
                });

                window.parent.postMessage({
                    type: 'buy',
                    data: postData
                }, this._gameWrapperMsgTarget);
            } else {
                console.error('Method `requireBuy` can only be called in App');
            }
        }

        /**
         * 上报屏幕上的链接点击事件
         * @param {Object} data 要上报的数据
         * @param {string} data.url 点击了的链接
         */

    }, {
        key: "uploadLinkClicked",
        value: function uploadLinkClicked(data) {
            data = (0, _stringify2.default)(data);
            this._getJSBridge(function (bridge) {
                bridge.callHandler('uploadLinkClicked', data);
            });
        }

        /**
         * 接收DuerOS收款成功后的通知
         * @param {Function} cb 收款成功后会调用此函数
         */

    }, {
        key: "onChargeStatusChange",
        value: function onChargeStatusChange(cb) {
            this._validateCallback('onChargeStatusChange', cb);
            this._getJSBridge(function (bridge) {
                bridge.registerHandler('onChargeStatusChange', function (payload, callback) {
                    cb(JSON.parse(payload));
                    callback(true);
                });
            });
        }

        /**
         * 接收DuerOS下发的意图解析结果
         * @param {requestCallback} cb 收到意图解析结果后此回调函数会被触发
         */

    }, {
        key: "onHandleIntent",
        value: function onHandleIntent(cb) {
            var _this4 = this;

            this._validateCallback('onHandleIntent', cb);
            this._getJSBridge(function (bridge) {
                bridge.registerHandler('onHandleIntent', function (payload, callback) {
                    payload = JSON.parse(payload);
                    if (payload.intent.name === 'RenderAdvertisement') {
                        // _isCommonAdClosed是个开关。因为广告物料的返回是异步的，且有时间间隔
                        // 如果刚好在网络请求期间用户点击了关闭，然后物料返回
                        // 了，这时就又会渲染广告，造成关不掉的现象
                        if (!_this4.config.adDisable && !_this4._isCommonAdClosed) {
                            if (payload.customData) {
                                _this4._renderAd(JSON.parse(payload.customData).jsonData);
                            }
                        }
                    } else {
                        cb(payload);
                    }
                    callback('js 回调');
                });
            });
        }

        /**
         * 新增一个自定义交互元素描述。
         * @param {Object} data 需要上传的端状态数据
         * @param {requestCallback} [cb] 可选参数，发起上传操作后的回调
         */

    }, {
        key: "updateUiContext",
        value: function updateUiContext(data, cb) {
            if (cb) {
                this._validateCallback('updateUiContext', cb, 1);
            }
            data = (0, _stringify2.default)(data);
            this._getJSBridge(function (bridge) {
                bridge.callHandler('updateUiContext', data, function (result) {
                    cb && cb(result);
                });
            });
        }

        /**
         * 开启聆听。设备进入语音交互状态
         * @param {requestCallback} [cb] 可选参数，该函数会收到聆听是否发起成功的的数据
         */

    }, {
        key: "listen",
        value: function listen(cb) {
            if (cb) {
                this._validateCallback('listen', cb);
            }
            this._getJSBridge(function (bridge) {
                bridge.callHandler('listen', function (result) {
                    cb && cb(result);
                });
            });
        }

        /**
         * 播报TTS语音
         * @param {string} data 要播报的文字
         * @param {requestCallback} [cb] 可选参数，TTS播报完毕后会回调此函数
         */

    }, {
        key: "speak",
        value: function speak(data, cb) {
            if (cb) {
                this._validateCallback('speak', cb, 1);
            }
            this._getJSBridge(function (bridge) {
                bridge.callHandler('speak', data, function () {
                    // TTS 播报完毕后调用此函数
                    cb && cb();
                });
            });
        }

        /**
         * 请求关闭app
         */

    }, {
        key: "requestClose",
        value: function requestClose() {
            if (this.isInApp()) {
                window.parent.postMessage({
                    type: 'closeWebView'
                }, this._gameWrapperMsgTarget);
            } else {
                this._getJSBridge(function (bridge) {
                    bridge.callHandler('requestClose');
                });
            }
        }

        /**
         * 接收ClickLink。ClickLink是一种Directive，用户新增自定义交互之后，云端会解析用户定义的交互，
         * 下发对应的指令。例如APP通过updateUiContext(UiContextPayload)新增自定义交互之后DuerOS会通
         * 过此接口下发上面定义的url。
         * @param {requestCallback} cb
         */

    }, {
        key: "onClickLink",
        value: function onClickLink(cb) {
            var _this5 = this;

            this._validateCallback('onClickLink', cb);
            this._getJSBridge(function (bridge) {
                bridge.registerHandler('onClickLink', function (payload, callback) {
                    payload = JSON.parse(payload);
                    if (payload.url === 'http://sdk.bot.dueros.ai?action=unknown_utterance') {
                        _this5._handleUnknowUtteranceCb && _this5._handleUnknowUtteranceCb(null, JSON.parse(payload.params));
                    } else {
                        cb(payload);
                    }
                    // 告知app是否处理成功
                    callback(true);
                });
            });
        }

        /**
         * 屏幕监听屏幕导航指令。
         * @param {requestCallback} cb 当用户发起语音请求，要求滚动屏幕时，本回调函数会被调用。
         */

    }, {
        key: "onHandleScreenNavigatorEvent",
        value: function onHandleScreenNavigatorEvent(cb) {
            this._validateCallback('onHandleScreenNavigatorEvent', cb);
            this._getJSBridge(function (bridge) {
                bridge.registerHandler('onHandleScreenNavigatorEvent', function (payload, callback) {
                    // payload可能是一下几种值
                    // NAV_SCROLL_LEFT = 1;
                    // NAV_SCROLL_RIGHT = 2;
                    // NAV_SCROLL_UP = 3;
                    // NAV_SCROLL_DOWN = 4;
                    // NAV_NEXT_PAGE = 5;
                    // NAV_PREVIOUS_PAGE = 6;
                    // NAV_GO_BACK = 7;
                    // NAV_GO_HOMEPAGE = 8;
                    cb(JSON.parse(payload));
                    callback(true); // 告知处理是否成功
                });
            });
        }
    }, {
        key: "onDialogStateChanged",
        value: function onDialogStateChanged(cb) {
            this._validateCallback('onDialogStateChanged', cb);
            if (this._compareShowVersion(this._parseShowVersion(), '1.36.0.0') >= 0) {
                this._getJSBridge(function (bridge) {
                    bridge.registerHandler('onDialogStateChanged', function (state, callback) {
                        cb(null, state);
                        callback(true); // 告知处理是否成功
                    });
                });
            } else {
                cb(new _errors.LowVersionErrorMsg(), null);
            }
        }
    }, {
        key: "onHandleUnknowUtterance",
        value: function onHandleUnknowUtterance(cb) {
            this._validateCallback('onHandleUnknowUtterance', cb);
            if (this._compareShowVersion(this._parseShowVersion(), '1.36.0.0') >= 0) {
                this._handleUnknowUtteranceCb = cb;
            } else {
                cb(new _errors.LowVersionErrorMsg(), null);
            }
        }
    }, {
        key: "canGoBack",
        value: function canGoBack(cb) {
            this._validateCallback('canGoBack', cb);
            if (this._compareShowVersion(this._parseShowVersion(), '1.36.0.0') >= 0) {
                this._getJSBridge(function (bridge) {
                    bridge.callHandler('canGoBack', null, function (payload) {
                        payload = JSON.parse(payload);
                        cb(null, payload.data);
                    });
                });
            } else {
                cb(new _errors.LowVersionErrorMsg(), null);
            }
        }

        /**
         * 从意图槽位中解析广告物料并渲染广告
         * @param {string} data
         * @private
         */

    }, {
        key: "_renderAd",
        value: function _renderAd(data) {
            var _this6 = this;

            var _data = JSON.parse(data);
            var serverAdIframeAddr = decodeURIComponent(_data.props.htmlAddress);
            if (_data.status === 0) {
                if (!this._adIframe1) {
                    this._adIframe1 = document.createElement('iframe');
                    var adIframeQuery = encodeURIComponent((0, _utils.parseH5UrlOrigin)(window.location.href));
                    if (this.config._duerosDebugadIframeUrl) {
                        this._adIframe1BaseUrl = this.config._duerosDebugadIframeUrl;
                        this._adMsgTarget = (0, _utils.parseH5UrlOrigin)(this.config._duerosDebugadIframeUrl);
                    } else {
                        this._adIframe1BaseUrl = serverAdIframeAddr;
                        this._adMsgTarget = (0, _utils.parseH5UrlOrigin)(serverAdIframeAddr);
                    }

                    var adIframeUrl = '';
                    if (this._adIframe1BaseUrl.indexOf('?') > -1) {
                        adIframeUrl = this._adIframe1BaseUrl + "&msgTarget=" + adIframeQuery;
                    } else {
                        adIframeUrl = this._adIframe1BaseUrl + "?msgTarget=" + adIframeQuery;
                    }

                    this._adIframe1.src = adIframeUrl;
                    this._adIframe1.scrolling = 'no';
                    this._adIframe1.frameBorder = 0;
                    this._adIframe1.allowTransparency = 'true';
                    document.body.appendChild(this._adIframe1);
                    this._adIframe1.style.cssText += "display: block; z-index: " + this.config.zIndex + ";position: fixed; background-color=transparent;";
                } else if (!this.config._duerosDebugadIframeUrl && this._adIframe1BaseUrl !== serverAdIframeAddr) {
                    document.body.removeChild(this._adIframe1);
                    this._adIframe1Loaded = false;
                    this._adIframe1 = null;
                    this._renderAd(data);
                    return;
                }
                this._adIframe1.style.display = 'block';
                this._setAdPosition();
                var postData = {
                    type: 'ad_set_material',
                    data: (0, _extends3.default)({}, _data, {
                        screenShapeType: this.config.screenShapeType
                    })
                };

                if (this._adIframe1Loaded) {
                    this._adIframe1.contentWindow.postMessage(postData, this._adMsgTarget);
                } else {
                    this._adIframe1.onload = function () {
                        _this6._adIframe1.contentWindow.postMessage(postData, _this6._adMsgTarget);
                        _this6._adIframe1Loaded = true;
                    };
                }
            } else {
                console.error('Failed to get advertisement: ', _data);
            }
        }

        /**
         * 获取广告物料
         * @private
         */

    }, {
        key: "_requestCommonadMaterial",
        value: function _requestCommonadMaterial() {
            // todo ... test
            var url = "dueros://f34646bc-37b4-a9db-361f-48fe7ca8831d/getAdResources?adPlaceId=5bnTSA3%2Bk%2FlCppVdt9bzxe%2B7gnZMFYgnMQLXt3dB%2FWFKf4lyam1he4m8ubUrZ0dj2d5T49v1ld1b9JHT%2B6ZhWIp9T6niQuPFPWCZ%2BpOIZhg%3D&botId=" + this.config.skillID;
            // if (this.config.screenShapeType === 1) {
            //     url = 'dueros://f34646bc-37b4-a9db-361f-48fe7ca8831d/getAdResources?adPlaceId=5bnTSA3%2Bk%2FlCppVdt9bzxe%2B7gnZMFYgnMQLXt3dB%2FWFKf4lyam1he4m8ubUrZ0dj2d5T49v1ld1b9JHT%2B6ZhWIp9T6niQuPFPWCZ%2BpOIZhg%3D&botId=3fa55179-6903-4094-57cf-8ae21d9a6123';
            // } else if (this.config.screenShapeType === 2) {
            //     url = 'dueros://f34646bc-37b4-a9db-361f-48fe7ca8831d/getAdResources?adPlaceId=5bnTSA3%2Bk%2FlCppVdt9bzxe%2B7gnZMFYgnMQLXt3dB%2FWFKf4lyam1he4m8ubUrZ0dj2d5T49v1ld1b9JHT%2B6ZhWIp9T6niQuPFPWCZ%2BpOIZhg%3D&botId=3fa55179-6903-4094-57cf-8ae21d9a6123'
            // }
            this.uploadLinkClicked({
                url: url
            });
        }
    }, {
        key: "_setAdPosition",
        value: function _setAdPosition() {
            // 如果是竖屏游戏
            if (this.config.screenShapeType === 1) {
                this._adIframe1.style.cssText += 'width: 242px; height: 214px;bottom: 30px;';
                if (this._lastVerticalAdDisplayIsLeft) {
                    this._adIframe1.style.left = '';
                    this._adIframe1.style.right = '23px';
                } else {
                    this._adIframe1.style.left = '23px';
                    this._adIframe1.style.right = '';
                }
                // 如果是全屏游戏
            } else if (this.config.screenShapeType === 2) {
                this._adIframe1.style.cssText += 'width: 446px; height: 118px;';
                if ((0, _utils.isSet)(this.config.adBannerPos.top)) {
                    this._adIframe1.style.top = this.config.adBannerPos.top;
                }
                if ((0, _utils.isSet)(this.config.adBannerPos.right)) {
                    this._adIframe1.style.right = this.config.adBannerPos.right;
                }
                if ((0, _utils.isSet)(this.config.adBannerPos.bottom)) {
                    this._adIframe1.style.bottom = this.config.adBannerPos.bottom;
                }
                if ((0, _utils.isSet)(this.config.adBannerPos.left)) {
                    this._adIframe1.style.left = this.config.adBannerPos.left;
                }
            }
        }

        /**
         * 开始轮换广告
         * @param {boolean} fireImmediately 是否立即轮换一次广告
         * @private
         */

    }, {
        key: "_startCommonAdSwitch",
        value: function _startCommonAdSwitch(fireImmediately) {
            var _this7 = this;

            this._isCommonAdClosed = false;
            if (fireImmediately) {
                // 请求到素材后，会在onHandleIntent里处理
                this._requestCommonadMaterial();
            }
            clearInterval(this._commonAdSwitchTimer);
            this._commonAdSwitchTimer = setInterval(function () {
                // 请求到素材后，会在onHandleIntent里处理
                _this7._requestCommonadMaterial();
            }, this._commonadSwitchInterval);
        }

        /**
         * 停止广告轮换
         * @private
         */

    }, {
        key: "_stopCommonAdSwitch",
        value: function _stopCommonAdSwitch() {
            clearInterval(this._commonAdSwitchTimer);
        }
    }, {
        key: "_closeCommonAd",
        value: function _closeCommonAd() {
            this._stopCommonAdSwitch();
            this._isCommonAdClosed = true;
            this._adIframe1.style.display = 'none';
        }
    }]);
    return BotApp;
}(); /*
      * @file H5 bot app SDK
      * @author dengxuening<dengxuening@baidu.com>
      */

BotApp.AdAction = _events.AdAction;


module.exports = BotApp;

/***/ }),

/***/ "W070":
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__("NsO/");
var toLength = __webpack_require__("tEej");
var toAbsoluteIndex = __webpack_require__("D8kY");
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};


/***/ }),

/***/ "WEpk":
/***/ (function(module, exports) {

var core = module.exports = { version: '2.6.9' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),

/***/ "Y7ZC":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("5T2Y");
var core = __webpack_require__("WEpk");
var ctx = __webpack_require__("2GTP");
var hide = __webpack_require__("NegM");
var has = __webpack_require__("B+OT");
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && has(exports, key)) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),

/***/ "YqAc":
/***/ (function(module, exports) {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),

/***/ "a0xu":
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),

/***/ "bBy9":
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__("w2d+");
var global = __webpack_require__("5T2Y");
var hide = __webpack_require__("NegM");
var Iterators = __webpack_require__("SBuE");
var TO_STRING_TAG = __webpack_require__("UWiX")('toStringTag');

var DOMIterables = ('CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,' +
  'DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,' +
  'MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,' +
  'SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,' +
  'TextTrackList,TouchList').split(',');

for (var i = 0; i < DOMIterables.length; i++) {
  var NAME = DOMIterables[i];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  if (proto && !proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = Iterators.Array;
}


/***/ }),

/***/ "ccE7":
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__("Ojgd");
var defined = __webpack_require__("Jes0");
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};


/***/ }),

/***/ "eUtF":
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__("jmDH") && !__webpack_require__("KUxP")(function () {
  return Object.defineProperty(__webpack_require__("Hsns")('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ "eaoh":
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),

/***/ "fNZA":
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__("QMMT");
var ITERATOR = __webpack_require__("UWiX")('iterator');
var Iterators = __webpack_require__("SBuE");
module.exports = __webpack_require__("WEpk").getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};


/***/ }),

/***/ "fXsU":
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__("5K7Z");
var get = __webpack_require__("fNZA");
module.exports = __webpack_require__("WEpk").getIterator = function (it) {
  var iterFn = get(it);
  if (typeof iterFn != 'function') throw TypeError(it + ' is not iterable!');
  return anObject(iterFn.call(it));
};


/***/ }),

/***/ "fpC5":
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__("2faE");
var anObject = __webpack_require__("5K7Z");
var getKeys = __webpack_require__("w6GO");

module.exports = __webpack_require__("jmDH") ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};


/***/ }),

/***/ "gDS+":
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__("oh+g"), __esModule: true };

/***/ }),

/***/ "hDam":
/***/ (function(module, exports) {

module.exports = function () { /* empty */ };


/***/ }),

/***/ "iCc5":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

/***/ }),

/***/ "iq4v":
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__("Mqbl");
module.exports = __webpack_require__("WEpk").Object.keys;


/***/ }),

/***/ "j2DC":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var create = __webpack_require__("oVml");
var descriptor = __webpack_require__("rr1i");
var setToStringTag = __webpack_require__("RfKB");
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__("NegM")(IteratorPrototype, __webpack_require__("UWiX")('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};


/***/ }),

/***/ "jmDH":
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__("KUxP")(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ "k/8l":
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__("VKFn"), __esModule: true };

/***/ }),

/***/ "kTiW":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("NegM");


/***/ }),

/***/ "kwZ1":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 19.1.2.1 Object.assign(target, source, ...)
var DESCRIPTORS = __webpack_require__("jmDH");
var getKeys = __webpack_require__("w6GO");
var gOPS = __webpack_require__("mqlF");
var pIE = __webpack_require__("NV0k");
var toObject = __webpack_require__("JB68");
var IObject = __webpack_require__("M1xp");
var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || __webpack_require__("KUxP")(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = gOPS.f;
  var isEnum = pIE.f;
  while (aLen > index) {
    var S = IObject(arguments[index++]);
    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) {
      key = keys[j++];
      if (!DESCRIPTORS || isEnum.call(S, key)) T[key] = S[key];
    }
  } return T;
} : $assign;


/***/ }),

/***/ "ldVq":
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__("QMMT");
var ITERATOR = __webpack_require__("UWiX")('iterator');
var Iterators = __webpack_require__("SBuE");
module.exports = __webpack_require__("WEpk").isIterable = function (it) {
  var O = Object(it);
  return O[ITERATOR] !== undefined
    || '@@iterator' in O
    // eslint-disable-next-line no-prototype-builtins
    || Iterators.hasOwnProperty(classof(O));
};


/***/ }),

/***/ "mqlF":
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;


/***/ }),

/***/ "o8NH":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.1 Object.assign(target, source)
var $export = __webpack_require__("Y7ZC");

$export($export.S + $export.F, 'Object', { assign: __webpack_require__("kwZ1") });


/***/ }),

/***/ "oVml":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = __webpack_require__("5K7Z");
var dPs = __webpack_require__("fpC5");
var enumBugKeys = __webpack_require__("FpHa");
var IE_PROTO = __webpack_require__("VVlx")('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__("Hsns")('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__("MvwC").appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),

/***/ "oh+g":
/***/ (function(module, exports, __webpack_require__) {

var core = __webpack_require__("WEpk");
var $JSON = core.JSON || (core.JSON = { stringify: JSON.stringify });
module.exports = function stringify(it) { // eslint-disable-line no-unused-vars
  return $JSON.stringify.apply($JSON, arguments);
};


/***/ }),

/***/ "rr1i":
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),

/***/ "sk9p":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _isIterable2 = __webpack_require__("k/8l");

var _isIterable3 = _interopRequireDefault(_isIterable2);

var _getIterator2 = __webpack_require__("FyfS");

var _getIterator3 = _interopRequireDefault(_getIterator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = (0, _getIterator3.default)(arr), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if ((0, _isIterable3.default)(Object(arr))) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

/***/ }),

/***/ "tEej":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__("Ojgd");
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),

/***/ "uOPS":
/***/ (function(module, exports) {

module.exports = true;


/***/ }),

/***/ "w2d+":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var addToUnscopables = __webpack_require__("hDam");
var step = __webpack_require__("UO39");
var Iterators = __webpack_require__("SBuE");
var toIObject = __webpack_require__("NsO/");

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__("MPFp")(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');


/***/ }),

/***/ "w6GO":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__("5vMV");
var enumBugKeys = __webpack_require__("FpHa");

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};


/***/ }),

/***/ "yMsT":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* eslint-disable */

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ServiceError = exports.LowVersionErrorMsg = undefined;

var _classCallCheck2 = __webpack_require__("iCc5");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @file 各种报错信息
 * @author dengxuening<dengxuening@baidu.com>
 */

/**
 * SHOW设备版本低时的错误
 */
var LowVersionErrorMsg = exports.LowVersionErrorMsg = function LowVersionErrorMsg() {
    (0, _classCallCheck3.default)(this, LowVersionErrorMsg);

    this.code = 1001;
    this.msg = 'Device version too low';
};

var ServiceError = exports.ServiceError = function ServiceError(msg) {
    (0, _classCallCheck3.default)(this, ServiceError);

    this.code = 1002;
    this.msg = 'Service error, ' + msg;
};

/***/ }),

/***/ "zn7N":
/***/ (function(module, exports, __webpack_require__) {

// most Object methods by ES6 should accept primitives
var $export = __webpack_require__("Y7ZC");
var core = __webpack_require__("WEpk");
var fails = __webpack_require__("KUxP");
module.exports = function (KEY, exec) {
  var fn = (core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function () { fn(1); }), 'Object', exp);
};


/***/ })

/******/ });