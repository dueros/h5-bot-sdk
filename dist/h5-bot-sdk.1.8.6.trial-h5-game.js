/*! @baidu/h5-bot-sdk - 1.8.6.trial-h5-game.js */
var BotApp = function (e) {
    var t = {};

    function n(r) {
        if (t[r]) return t[r].exports;
        var i = t[r] = {i: r, l: !1, exports: {}};
        return e[r].call(i.exports, i, i.exports, n), i.l = !0, i.exports
    }

    return n.m = e, n.c = t, n.d = function (e, t, r) {
        n.o(e, t) || Object.defineProperty(e, t, {enumerable: !0, get: r})
    }, n.r = function (e) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {value: "Module"}), Object.defineProperty(e, "__esModule", {value: !0})
    }, n.t = function (e, t) {
        if (1 & t && (e = n(e)), 8 & t) return e;
        if (4 & t && "object" == typeof e && e && e.__esModule) return e;
        var r = Object.create(null);
        if (n.r(r), Object.defineProperty(r, "default", {
            enumerable: !0,
            value: e
        }), 2 & t && "string" != typeof e) for (var i in e) n.d(r, i, function (t) {
            return e[t]
        }.bind(null, i));
        return r
    }, n.n = function (e) {
        var t = e && e.__esModule ? function () {
            return e.default
        } : function () {
            return e
        };
        return n.d(t, "a", t), t
    }, n.o = function (e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
    }, n.p = "", n(n.s = "Vtdi")
}({
    "/h46": function (e, t, n) {
        n("cHUd")("Map")
    }, "29s/": function (e, t, n) {
        var r = n("WEpk"), i = n("5T2Y"), o = i["__core-js_shared__"] || (i["__core-js_shared__"] = {});
        (e.exports = function (e, t) {
            return o[e] || (o[e] = void 0 !== t ? t : {})
        })("versions", []).push({
            version: r.version,
            mode: n("uOPS") ? "pure" : "global",
            copyright: "© 2019 Denis Pushkarev (zloirock.ru)"
        })
    }, "2GTP": function (e, t, n) {
        var r = n("eaoh");
        e.exports = function (e, t, n) {
            if (r(e), void 0 === t) return e;
            switch (n) {
                case 1:
                    return function (n) {
                        return e.call(t, n)
                    };
                case 2:
                    return function (n, r) {
                        return e.call(t, n, r)
                    };
                case 3:
                    return function (n, r, i) {
                        return e.call(t, n, r, i)
                    }
            }
            return function () {
                return e.apply(t, arguments)
            }
        }
    }, "2faE": function (e, t, n) {
        var r = n("5K7Z"), i = n("eUtF"), o = n("G8Mo"), a = Object.defineProperty;
        t.f = n("jmDH") ? Object.defineProperty : function (e, t, n) {
            if (r(e), t = o(t, !0), r(n), i) try {
                return a(e, t, n)
            } catch (e) {
            }
            if ("get" in n || "set" in n) throw TypeError("Accessors not supported!");
            return "value" in n && (e[t] = n.value), e
        }
    }, "5K7Z": function (e, t, n) {
        var r = n("93I4");
        e.exports = function (e) {
            if (!r(e)) throw TypeError(e + " is not an object!");
            return e
        }
    }, "5T2Y": function (e, t) {
        var n = e.exports = "undefined" != typeof window && window.Math == Math ? window : "undefined" != typeof self && self.Math == Math ? self : Function("return this")();
        "number" == typeof __g && (__g = n)
    }, "5vMV": function (e, t, n) {
        var r = n("B+OT"), i = n("NsO/"), o = n("W070")(!1), a = n("VVlx")("IE_PROTO");
        e.exports = function (e, t) {
            var n, s = i(e), u = 0, c = [];
            for (n in s) n != a && r(s, n) && c.push(n);
            for (; t.length > u;) r(s, n = t[u++]) && (~o(c, n) || c.push(n));
            return c
        }
    }, "6/1s": function (e, t, n) {
        var r = n("YqAc")("meta"), i = n("93I4"), o = n("B+OT"), a = n("2faE").f, s = 0,
            u = Object.isExtensible || function () {
                return !0
            }, c = !n("KUxP")(function () {
                return u(Object.preventExtensions({}))
            }), l = function (e) {
                a(e, r, {value: {i: "O" + ++s, w: {}}})
            }, f = e.exports = {
                KEY: r, NEED: !1, fastKey: function (e, t) {
                    if (!i(e)) return "symbol" == typeof e ? e : ("string" == typeof e ? "S" : "P") + e;
                    if (!o(e, r)) {
                        if (!u(e)) return "F";
                        if (!t) return "E";
                        l(e)
                    }
                    return e[r].i
                }, getWeak: function (e, t) {
                    if (!o(e, r)) {
                        if (!u(e)) return !0;
                        if (!t) return !1;
                        l(e)
                    }
                    return e[r].w
                }, onFreeze: function (e) {
                    return c && f.NEED && u(e) && !o(e, r) && l(e), e
                }
            }
    }, "8iia": function (e, t, n) {
        var r = n("QMMT"), i = n("RRc/");
        e.exports = function (e) {
            return function () {
                if (r(this) != e) throw TypeError(e + "#toJSON isn't generic");
                return i(this)
            }
        }
    }, "93I4": function (e, t) {
        e.exports = function (e) {
            return "object" == typeof e ? null !== e : "function" == typeof e
        }
    }, Al62: function (e, t, n) {
        "use strict";
        Object.defineProperty(t, "__esModule", {value: !0});
        var r = a(n("ODRq")), i = a(n("sk9p")), o = a(n("GQeE"));

        function a(e) {
            return e && e.__esModule ? e : {default: e}
        }

        t.getQuery = function (e) {
            var t = (e = (e = e || window.location.search).replace(/^\?+/, "").replace(/&amp;/, "")).split("&"),
                n = t.length, r = {};
            for (; n--;) {
                var i = t[n].split("=");
                if (i[0]) {
                    var o = i[1] || "";
                    try {
                        o = decodeURIComponent(o)
                    } catch (e) {
                        o = unescape(o)
                    }
                    r[decodeURIComponent(i[0])] = o
                }
            }
            return r
        }, t.encodeObjectDataToUrlData = function (e) {
            return e ? (0, o.default)(e).map(function (t) {
                return t + "=" + encodeURIComponent(e[t])
            }).join("&") : ""
        }, t.isSet = function (e) {
            return void 0 !== e
        }, t.parseH5UrlOrigin = function (e) {
            if (e) {
                var t = document.createElement("a");
                return t.href = e, t.origin
            }
            return ""
        }, t.createIframe = function (e) {
            var t = e.left, n = void 0 === t ? "auto" : t, r = e.top, i = void 0 === r ? "auto" : r, o = e.right,
                a = void 0 === o ? "auto" : o, s = e.bottom, u = void 0 === s ? "auto" : s, c = e.width,
                l = void 0 === c ? "100%" : c, f = e.height, d = void 0 === f ? "100%" : f, p = e.background,
                h = void 0 === p ? "rgba(0, 0, 0, 0)" : p, g = e.zIndex, m = void 0 === g ? 9999 : g, _ = e.scrolling,
                v = void 0 === _ ? "no" : _, y = document.createElement("iframe");
            return y.allowTransparency = "true", y.scrolling = v, y.frameBorder = 0, y.style.cssText += "width: " + l + ";\n        height: " + d + ";\n        display: block;\n        left: " + n + ";\n        top: " + i + ";\n        right: " + a + ";\n        bottom: " + u + ";\n        z-index: " + m + ";\n        background: " + h + ";\n        position: fixed;", y
        }, t.parseVersionNumber = function (e) {
            var t = null;
            t = e.indexOf("ContainerVersion") > -1 ? /ContainerVersion\/([\d\.]+)/i : /build\/([\d\.]+);/i;
            var n = t.exec(e);
            return n ? n[1] : null
        }, t.compareShowVersion = function (e, t) {
            var n = String(e).split("."), r = (0, i.default)(n, 4), o = r[0], a = r[1], s = r[2], u = r[3],
                c = String(t).split("."), l = (0, i.default)(c, 4), f = l[0], d = l[1], p = l[2], h = l[3];
            return o > f ? 1 : o < f ? -1 : a > d ? 1 : a < d ? -1 : s > p ? 1 : s < p ? -1 : u > h ? 1 : u < h ? -1 : 0
        }, t.parseIntentSlots = function (e) {
            var t = new r.default;
            Array.isArray(e) ? e.forEach(function (e) {
                t.set(e.name, e.value)
            }) : console.warn("parseIntentSlots: slots is not an Array type");
            return t
        }, t.postMessageToIframe = function (e, t, n) {
            e ? (e.onload = function () {
                e.contentWindow.postMessage(n, t)
            }, e.contentWindow.postMessage(n, t)) : console.error("postMessageToIframe: iframeDOM不存在")
        }
    }, "B+OT": function (e, t) {
        var n = {}.hasOwnProperty;
        e.exports = function (e, t) {
            return n.call(e, t)
        }
    }, C2SN: function (e, t, n) {
        var r = n("93I4"), i = n("kAMH"), o = n("UWiX")("species");
        e.exports = function (e) {
            var t;
            return i(e) && ("function" != typeof (t = e.constructor) || t !== Array && !i(t.prototype) || (t = void 0), r(t) && null === (t = t[o]) && (t = void 0)), void 0 === t ? Array : t
        }
    }, D8kY: function (e, t, n) {
        var r = n("Ojgd"), i = Math.max, o = Math.min;
        e.exports = function (e, t) {
            return (e = r(e)) < 0 ? i(e + t, 0) : o(e, t)
        }
    }, EXMj: function (e, t) {
        e.exports = function (e, t, n, r) {
            if (!(e instanceof t) || void 0 !== r && r in e) throw TypeError(n + ": incorrect invocation!");
            return e
        }
    }, FlQf: function (e, t, n) {
        "use strict";
        var r = n("ccE7")(!0);
        n("MPFp")(String, "String", function (e) {
            this._t = String(e), this._i = 0
        }, function () {
            var e, t = this._t, n = this._i;
            return n >= t.length ? {value: void 0, done: !0} : (e = r(t, n), this._i += e.length, {value: e, done: !1})
        })
    }, FpHa: function (e, t) {
        e.exports = "constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",")
    }, FyfS: function (e, t, n) {
        e.exports = {default: n("Rp86"), __esModule: !0}
    }, G8Mo: function (e, t, n) {
        var r = n("93I4");
        e.exports = function (e, t) {
            if (!r(e)) return e;
            var n, i;
            if (t && "function" == typeof (n = e.toString) && !r(i = n.call(e))) return i;
            if ("function" == typeof (n = e.valueOf) && !r(i = n.call(e))) return i;
            if (!t && "function" == typeof (n = e.toString) && !r(i = n.call(e))) return i;
            throw TypeError("Can't convert object to primitive value")
        }
    }, GQeE: function (e, t, n) {
        e.exports = {default: n("iq4v"), __esModule: !0}
    }, Hsns: function (e, t, n) {
        var r = n("93I4"), i = n("5T2Y").document, o = r(i) && r(i.createElement);
        e.exports = function (e) {
            return o ? i.createElement(e) : {}
        }
    }, JB68: function (e, t, n) {
        var r = n("Jes0");
        e.exports = function (e) {
            return Object(r(e))
        }
    }, Jes0: function (e, t) {
        e.exports = function (e) {
            if (null == e) throw TypeError("Can't call method on  " + e);
            return e
        }
    }, KUxP: function (e, t) {
        e.exports = function (e) {
            try {
                return !!e()
            } catch (e) {
                return !0
            }
        }
    }, M1xp: function (e, t, n) {
        var r = n("a0xu");
        e.exports = Object("z").propertyIsEnumerable(0) ? Object : function (e) {
            return "String" == r(e) ? e.split("") : Object(e)
        }
    }, MPFp: function (e, t, n) {
        "use strict";
        var r = n("uOPS"), i = n("Y7ZC"), o = n("kTiW"), a = n("NegM"), s = n("SBuE"), u = n("j2DC"), c = n("RfKB"),
            l = n("U+KD"), f = n("UWiX")("iterator"), d = !([].keys && "next" in [].keys()), p = function () {
                return this
            };
        e.exports = function (e, t, n, h, g, m, _) {
            u(n, t, h);
            var v, y, b, k = function (e) {
                    if (!d && e in C) return C[e];
                    switch (e) {
                        case"keys":
                        case"values":
                            return function () {
                                return new n(this, e)
                            }
                    }
                    return function () {
                        return new n(this, e)
                    }
                }, w = t + " Iterator", S = "values" == g, T = !1, C = e.prototype,
                I = C[f] || C["@@iterator"] || g && C[g], O = I || k(g), x = g ? S ? k("entries") : O : void 0,
                M = "Array" == t && C.entries || I;
            if (M && (b = l(M.call(new e))) !== Object.prototype && b.next && (c(b, w, !0), r || "function" == typeof b[f] || a(b, f, p)), S && I && "values" !== I.name && (T = !0, O = function () {
                return I.call(this)
            }), r && !_ || !d && !T && C[f] || a(C, f, O), s[t] = O, s[w] = p, g) if (v = {
                values: S ? O : k("values"),
                keys: m ? O : k("keys"),
                entries: x
            }, _) for (y in v) y in C || o(C, y, v[y]); else i(i.P + i.F * (d || T), t, v);
            return v
        }
    }, Mqbl: function (e, t, n) {
        var r = n("JB68"), i = n("w6GO");
        n("zn7N")("keys", function () {
            return function (e) {
                return i(r(e))
            }
        })
    }, MvwC: function (e, t, n) {
        var r = n("5T2Y").document;
        e.exports = r && r.documentElement
    }, NV0k: function (e, t) {
        t.f = {}.propertyIsEnumerable
    }, NegM: function (e, t, n) {
        var r = n("2faE"), i = n("rr1i");
        e.exports = n("jmDH") ? function (e, t, n) {
            return r.f(e, t, i(1, n))
        } : function (e, t, n) {
            return e[t] = n, e
        }
    }, "NsO/": function (e, t, n) {
        var r = n("M1xp"), i = n("Jes0");
        e.exports = function (e) {
            return r(i(e))
        }
    }, NwJ3: function (e, t, n) {
        var r = n("SBuE"), i = n("UWiX")("iterator"), o = Array.prototype;
        e.exports = function (e) {
            return void 0 !== e && (r.Array === e || o[i] === e)
        }
    }, ODRq: function (e, t, n) {
        e.exports = {default: n("UDep"), __esModule: !0}
    }, Ojgd: function (e, t) {
        var n = Math.ceil, r = Math.floor;
        e.exports = function (e) {
            return isNaN(e = +e) ? 0 : (e > 0 ? r : n)(e)
        }
    }, P2sY: function (e, t, n) {
        e.exports = {default: n("UbbE"), __esModule: !0}
    }, QMMT: function (e, t, n) {
        var r = n("a0xu"), i = n("UWiX")("toStringTag"), o = "Arguments" == r(function () {
            return arguments
        }());
        e.exports = function (e) {
            var t, n, a;
            return void 0 === e ? "Undefined" : null === e ? "Null" : "string" == typeof (n = function (e, t) {
                try {
                    return e[t]
                } catch (e) {
                }
            }(t = Object(e), i)) ? n : o ? r(t) : "Object" == (a = r(t)) && "function" == typeof t.callee ? "Arguments" : a
        }
    }, QbLZ: function (e, t, n) {
        "use strict";
        t.__esModule = !0;
        var r, i = n("P2sY"), o = (r = i) && r.__esModule ? r : {default: r};
        t.default = o.default || function (e) {
            for (var t = 1; t < arguments.length; t++) {
                var n = arguments[t];
                for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
            }
            return e
        }
    }, "RRc/": function (e, t, n) {
        var r = n("oioR");
        e.exports = function (e, t) {
            var n = [];
            return r(e, !1, n.push, n, t), n
        }
    }, "RU/L": function (e, t, n) {
        n("Rqdy");
        var r = n("WEpk").Object;
        e.exports = function (e, t, n) {
            return r.defineProperty(e, t, n)
        }
    }, RfKB: function (e, t, n) {
        var r = n("2faE").f, i = n("B+OT"), o = n("UWiX")("toStringTag");
        e.exports = function (e, t, n) {
            e && !i(e = n ? e : e.prototype, o) && r(e, o, {configurable: !0, value: t})
        }
    }, Rp86: function (e, t, n) {
        n("bBy9"), n("FlQf"), e.exports = n("fXsU")
    }, Rqdy: function (e, t, n) {
        var r = n("Y7ZC");
        r(r.S + r.F * !n("jmDH"), "Object", {defineProperty: n("2faE").f})
    }, SBuE: function (e, t) {
        e.exports = {}
    }, SEkw: function (e, t, n) {
        e.exports = {default: n("RU/L"), __esModule: !0}
    }, TJWN: function (e, t, n) {
        "use strict";
        var r = n("5T2Y"), i = n("WEpk"), o = n("2faE"), a = n("jmDH"), s = n("UWiX")("species");
        e.exports = function (e) {
            var t = "function" == typeof i[e] ? i[e] : r[e];
            a && t && !t[s] && o.f(t, s, {
                configurable: !0, get: function () {
                    return this
                }
            })
        }
    }, "U+KD": function (e, t, n) {
        var r = n("B+OT"), i = n("JB68"), o = n("VVlx")("IE_PROTO"), a = Object.prototype;
        e.exports = Object.getPrototypeOf || function (e) {
            return e = i(e), r(e, o) ? e[o] : "function" == typeof e.constructor && e instanceof e.constructor ? e.constructor.prototype : e instanceof Object ? a : null
        }
    }, UDep: function (e, t, n) {
        n("wgeU"), n("FlQf"), n("bBy9"), n("g33z"), n("XLbu"), n("/h46"), n("dVTT"), e.exports = n("WEpk").Map
    }, UO39: function (e, t) {
        e.exports = function (e, t) {
            return {value: t, done: !!e}
        }
    }, UWiX: function (e, t, n) {
        var r = n("29s/")("wks"), i = n("YqAc"), o = n("5T2Y").Symbol, a = "function" == typeof o;
        (e.exports = function (e) {
            return r[e] || (r[e] = a && o[e] || (a ? o : i)("Symbol." + e))
        }).store = r
    }, UbbE: function (e, t, n) {
        n("o8NH"), e.exports = n("WEpk").Object.assign
    }, V7Et: function (e, t, n) {
        var r = n("2GTP"), i = n("M1xp"), o = n("JB68"), a = n("tEej"), s = n("v6xn");
        e.exports = function (e, t) {
            var n = 1 == e, u = 2 == e, c = 3 == e, l = 4 == e, f = 6 == e, d = 5 == e || f, p = t || s;
            return function (t, s, h) {
                for (var g, m, _ = o(t), v = i(_), y = r(s, h, 3), b = a(v.length), k = 0, w = n ? p(t, b) : u ? p(t, 0) : void 0; b > k; k++) if ((d || k in v) && (m = y(g = v[k], k, _), e)) if (n) w[k] = m; else if (m) switch (e) {
                    case 3:
                        return !0;
                    case 5:
                        return g;
                    case 6:
                        return k;
                    case 2:
                        w.push(g)
                } else if (l) return !1;
                return f ? -1 : c || l ? l : w
            }
        }
    }, V7oC: function (e, t, n) {
        "use strict";
        t.__esModule = !0;
        var r, i = n("SEkw"), o = (r = i) && r.__esModule ? r : {default: r};
        t.default = function () {
            function e(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var r = t[n];
                    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), (0, o.default)(e, r.key, r)
                }
            }

            return function (t, n, r) {
                return n && e(t.prototype, n), r && e(t, r), t
            }
        }()
    }, VKFn: function (e, t, n) {
        n("bBy9"), n("FlQf"), e.exports = n("ldVq")
    }, VVlx: function (e, t, n) {
        var r = n("29s/")("keys"), i = n("YqAc");
        e.exports = function (e) {
            return r[e] || (r[e] = i(e))
        }
    }, Vtdi: function (e, t, n) {
        "use strict";
        var r = c(n("gDS+")), i = c(n("QbLZ")), o = c(n("iCc5")), a = c(n("V7oC")), s = n("yMsT"), u = n("Al62");

        function c(e) {
            return e && e.__esModule ? e : {default: e}
        }

        var l = "cancel_pay", f = "go_pay", d = "go_scribe", p = "close_banner", h = "refresh_banner_text",
            g = function () {
                function e() {
                    var t = this, n = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                    (0, o.default)(this, e), this._firePayDialog = function () {
                        t.uploadLinkClicked({url: t._buyUrl, initiator: {type: "AUTO_TRIGGER"}})
                    }, this._screenTouched = function () {
                        window.removeEventListener("touchstart", t._screenTouched, !0), t._startCommonAdSwitch(!0)
                    }, this._JsBridgeForUnitTest = n._JsBridgeForUnitTest, this.config = (0, i.default)({adDisable: !0}, n, {orderZIndex: n.orderZIndex || 9999}), this._commonAdShowTimes = 2, this._commonadSwitchInterval = 1e4, this._commonAdReopenTimeout = 6e4, this._adIframe1BaseUrl = "", this._isAdInit = !1, this._isCommonAdSwitchOff = !1, this._isCommonAdDisplaying = !1, this._gameWrapperMsgTarget = "http://xiaodu.baidu.com", this._gameWrapperHttpsMsgTarget = "https://xiaodu.baidu.com", this._gameBeatReportTimer = null, this._trialGameOrderIframeDOM = null, this._trialGameBannerDOM = null, this._trialGameOrderIframeUrl = "https://xiaodu.baidu.com/saiya/sdk/iframe/trial-game-order.html", this._trialGameMsgTarget = (0, u.parseH5UrlOrigin)(this._trialGameOrderIframeUrl), this._init()
                }

                return (0, a.default)(e, [{
                    key: "_init", value: function () {
                        var e = (0, r.default)({
                            random1: this.config.random1,
                            signature1: this.config.signature1,
                            random2: this.config.random2,
                            signature2: this.config.signature2
                        });
                        this.isInApp() ? this._initInXiaoduApp(e) : this._initInShow(e)
                    }
                }, {
                    key: "_initInShow", value: function (e) {
                        var t = this;
                        this._getJSBridge(function (n) {
                            n.init(function (e, t) {
                                console.log("Receive bridge init message from native: " + e), t({"Javascript Responds": "Ready!"})
                            }), n.callHandler("register", e, function (e) {
                                e = JSON.parse(e), t.registerResult = e, t.registerCallback && t.registerCallback(e), t.registerCallback = null, t.config.skillID && t.requireShipping()
                            }), n.registerHandler("onHandleIntent", function (e, n) {
                                var r = (e = JSON.parse(e)).intent.slots, i = e.intent.name;
                                if ("RenderAdvertisement" === i) t.config.adDisable || t._isCommonAdSwitchOff || e.customData && t._renderAd(JSON.parse(e.customData).jsonData); else if ("AI_DUER_SHOW_GESTURE_RECOGNIZED" === i && t._registerGestureCb) r[0] ? t._registerGestureCb(null, r[0].value) : t._registerGestureCb("Recognize gesture failed", null); else if ("com.baidu.duer.cameraStateChanged" === i && t._getCameraStateCb) t._getCameraStateCb(null, e.customData); else if ("H5gameHeartBeatReport" === i) {
                                    if (r && r.length) {
                                        var o = !1, a = 60, s = (0, u.parseIntentSlots)(r);
                                        if (s.has("needHeartbeatReport") && 1 === Number(s.get("needHeartbeatReport")) && (o = !0), s.has("timeInterval") && (a = Number(s.get("timeInterval"))), s.has("displaySub") && 1 === Number(s.get("displaySub"))) {
                                            var c = JSON.parse(e.customData), l = c.desc, f = c.subUrl;
                                            t._trialGameSubscribeLink = f, t._renderTrialGameSubscribeBanner({desc: l})
                                        }
                                        o ? t._fireGameProcessBeatReport(a) : t._cancelGameProcessBeatReport()
                                    }
                                } else if ("H5gameTrialStatus" === i) {
                                    var d = e.customData ? JSON.parse(e.customData) : null,
                                        p = (0, u.parseIntentSlots)(r);
                                    p.has("needPay") && 1 === Number(p.get("needPay")) && d && (3 === Number(d.payType) ? (t._buyUrl = d.relatedProduct[0].buyUrl, t._firePayDialog(), window.addEventListener("touchstart", t._firePayDialog, !0)) : t._renderTrialGameOrder(d)), d && d.desc && t._tryPostMessageToTrialGameSubscribeBanner({
                                        type: h,
                                        data: d.desc
                                    })
                                } else if ("NotifyBuyStatus" === i) {
                                    var g = null, m = (0, u.parseIntentSlots)(r);
                                    m.has("purchaseResult") && (g = m.get("purchaseResult")), "SUCCESS" === g && (t._closeTrialGameOrder(), t._closeTrialGameBanner(), window.removeEventListener("touchstart", t._firePayDialog, !0))
                                } else t.onHandleIntentCb && t.onHandleIntentCb(e);
                                n("js 回调")
                            }), n.registerHandler("onClickLink", function (e, n) {
                                "http://sdk.bot.dueros.ai?action=unknown_utterance" === (e = JSON.parse(e)).url ? t._handleUnknowUtteranceCb && t._handleUnknowUtteranceCb(null, JSON.parse(e.params)) : t._onClickLinkCb && t._onClickLinkCb(e), n(!0)
                            })
                        }), this.uploadLinkClicked({
                            url: "dueros://" + this.config.skillID + "/h5game/getneedheartbeatreport",
                            initiator: {type: "AUTO_TRIGGER"}
                        }), this._showVersion = this._parseShowVersion(), window.addEventListener("message", function (e) {
                            e.origin === t._adMsgTarget ? t._handleAdEvent(e) : t._handleGameTryPay(e)
                        }), this._logTouch()
                    }
                }, {
                    key: "_initInXiaoduApp", value: function (e) {
                        var t = this;
                        window.addEventListener("message", function (e) {
                            var n = e.data;
                            "wrapper_location_protocal" === n.type && (n.data.indexOf("https") > -1 && (t._gameWrapperMsgTarget = t._gameWrapperHttpsMsgTarget), window.parent.postMessage({
                                type: "register",
                                data: t.config
                            }, t._gameWrapperMsgTarget)), e.origin === t._gameWrapperMsgTarget && (console.log("receive h5game-wrapper's message ", n), "authorized_success" === n.type || "authorized_fail" === n.type ? t._linkAccountResultCb(n) : "bot_info" === n.type ? (t.registerResult = n.data, t.registerCallback && t.registerCallback(t.registerResult), t.registerCallback = null) : "ship" === n.type && t._getShipPayResult && t._getShipPayResult(n.err, n.data))
                        })
                    }
                }, {
                    key: "_handleAdEvent", value: function (e) {
                        var t = this, n = e.data;
                        console.log("receive msg from iframe: ", n), "ad_load_material" === n.type ? (this._isCommonAdDisplaying ? this.config.adSwitchCallback() : this.config.adDisplayCallback(), this._isCommonAdDisplaying = !0, this._execLinkClick(n.data.linkClickUrl.map(function (e) {
                            return {url: e, initiator: {type: "AUTO_TRIGGER"}}
                        }))) : "ad_click" === n.type ? (this.config.adClickCallback(), this._execLinkClick(n.data.linkClickUrl.map(function (e) {
                            return {url: e}
                        })), window.addEventListener("touchstart", this._screenTouched, !0), this._pauseCommonAd()) : "ad_close" === n.type && (this.config.adCloseCallback(), this._execLinkClick(n.data.linkClickUrl.map(function (e) {
                            return {url: e}
                        })), this._closeCommonAd(), "twice" === this.config.adDisplayStrategy && this._commonAdShowTimes > 0 && (this._commonAdShowTimes--, this._lastVerticalAdDisplayIsLeft = !this._lastVerticalAdDisplayIsLeft, clearTimeout(this._commonadReshowTimeout), this._commonadReshowTimeout = setTimeout(function () {
                            t._startCommonAdSwitch(!0)
                        }, this._commonAdReopenTimeout)))
                    }
                }, {
                    key: "_renderTrialGameOrder", value: function (e) {
                        if (!this._trialGameOrderIframeDOM) {
                            console.log("game data", e);
                            var t = Number(e.payType), n = "", r = this._trialGameOrderIframeUrl;
                            1 === t ? n = "rgba(0, 0, 0, 0.3)" : (n = "transparent", r += "#/subscribeV2"), this._trialGameOrderIframeDOM = (0, u.createIframe)({
                                left: 0,
                                top: 0,
                                width: "100%",
                                height: "100%",
                                scrolling: "yes",
                                zIndex: this.config.orderZIndex,
                                background: n
                            }), this._trialGameOrderIframeDOM.src = r, document.body.appendChild(this._trialGameOrderIframeDOM), this._tryPostMessageToTrialGameOrder({
                                relatedProduct: e.relatedProduct,
                                botId: this.config.skillID
                            })
                        }
                    }
                }, {
                    key: "_renderTrialGameSubscribeBanner", value: function (e) {
                        var t = e.desc;
                        if (!this._trialGameBannerDOM) {
                            var n = (0, u.encodeObjectDataToUrlData)({desc: t}),
                                r = this._trialGameOrderIframeUrl + "?" + n + "#/banner";
                            this._trialGameBannerDOM = (0, u.createIframe)({
                                left: "0",
                                bottom: "0",
                                width: "100%",
                                height: "80px",
                                zIndex: this.config.orderZIndex,
                                background: "transparent"
                            }), this._trialGameBannerDOM.src = r, document.body.appendChild(this._trialGameBannerDOM)
                        }
                    }
                }, {
                    key: "_tryPostMessageToTrialGameSubscribeBanner", value: function (e) {
                        (0, u.postMessageToIframe)(this._trialGameBannerDOM, this._trialGameMsgTarget, e)
                    }
                }, {
                    key: "_tryPostMessageToTrialGameOrder", value: function (e) {
                        (0, u.postMessageToIframe)(this._trialGameOrderIframeDOM, this._trialGameMsgTarget, e)
                    }
                }, {
                    key: "_closeTrialGameOrder", value: function () {
                        this._trialGameOrderIframeDOM && (document.body.removeChild(this._trialGameOrderIframeDOM), this._trialGameOrderIframeDOM = null)
                    }
                }, {
                    key: "_closeTrialGameBanner", value: function () {
                        this._trialGameBannerDOM && (document.body.removeChild(this._trialGameBannerDOM), this._trialGameBannerDOM = null)
                    }
                }, {
                    key: "_handleGameTryPay", value: function (e) {
                        var t = e.data;
                        t.type === l ? this.requestClose() : t.type === f ? this.uploadLinkClicked({url: t.data.buyUrl}) : t.type === p ? this._closeTrialGameBanner() : t.type === d && (this._trialGameSubscribeLink ? this.uploadLinkClicked({url: this._trialGameSubscribeLink}) : console.error("订阅游戏失败，没有linkClick地址"))
                    }
                }, {
                    key: "_getJSBridge", value: function (e) {
                        if (this._JsBridgeForUnitTest) return e(this._JsBridgeForUnitTest);
                        window.WebViewJavascriptBridge ? e(window.WebViewJavascriptBridge) : document.addEventListener("WebViewJavascriptBridgeReady", function () {
                            e(WebViewJavascriptBridge)
                        }, !1)
                    }
                }, {
                    key: "_validateCallback", value: function (e, t) {
                        var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0;
                        if ("function" != typeof t) throw new TypeError("[" + e + "]'s arguments[" + n + "] must be a function, but get a " + typeof t)
                    }
                }, {
                    key: "_execLinkClick", value: function (e) {
                        var t = this;
                        Array.isArray(e) ? e.forEach(function (e) {
                            t.uploadLinkClicked(e)
                        }) : this.uploadLinkClicked(e)
                    }
                }, {
                    key: "initAd", value: function () {
                        var e = this, t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                        if (this._isAdInit) throw new Error("`initAd` can only be called once ");
                        if (this.config = (0, i.default)({}, this.config, {
                            adZIndex: t.zIndex || 9999,
                            screenOrientation: t.screenOrientation || "portrait",
                            adDisplayStrategy: t.displayStrategy || "twice",
                            adClickCallback: t.clickCallback || function () {
                            },
                            adCloseCallback: t.closeCallback || function () {
                            },
                            adDisplayCallback: t.displayCallback || function () {
                            },
                            adSwitchCallback: t.switchCallback || function () {
                            },
                            adFirstDisplayTime: void 0 === t.firstDisplayTime ? 10 : t.firstDisplayTime,
                            adBannerPosition: t.bannerPosition || {right: "30px", bottom: "30px"},
                            adPlaceId: t.placeId,
                            _duerosDebugadIframeUrl: t._duerosDebugadIframeUrl,
                            adDisable: !1
                        }), !this.config.adDisable) {
                            if (!/\d+/.test(this.config.adFirstDisplayTime)) throw new Error("firstDisplayTime must be a number, please check configuration");
                            clearTimeout(this._adFirstShowTimer), this._adFirstShowTimer = setTimeout(function () {
                                e._startCommonAdSwitch(!0), e._commonAdShowTimes--
                            }, 1e3 * this.config.adFirstDisplayTime)
                        }
                        this._isAdInit = !0
                    }
                }, {
                    key: "isInApp", value: function () {
                        if (this._appType) return this._appType;
                        var e = window.navigator.userAgent.toLowerCase(), t = "";
                        return e.match(/xiaoduapp\/([\S]+)/) ? t = "ls_m" : e.match("fromapp/xiaoduapp") && (t = "oneApp"), this._appType = "ls_m" === t || "oneApp" === t, this._appType
                    }
                }, {
                    key: "_parseShowVersion", value: function (e) {
                        if (this._showVersion) return this._showVersion;
                        var t = e || navigator.userAgent, n = (0, u.parseVersionNumber)(t);
                        if (n) return this._showVersion = n, n;
                        throw new Error("Device version number parsing failed: " + t)
                    }
                }, {
                    key: "requireUserAgeInfo", value: function (e) {
                        var t = this;
                        if (this.isInApp()) console.warn("requireUserAgeInfo: Your H5 app is not running on the App, and the callback function will not be called"); else if (this._validateCallback("requireUserAgeInfo", e), (0, u.compareShowVersion)(this._parseShowVersion(), "1.35.0.0") >= 0) {
                            if (!this.config.skillID) throw new Error("Missing `skillID`, please configure `skillID` when initializes the `BotApp`");
                            this._getJSBridge(function (n) {
                                n.callHandler("requestUserAgeInfo", null, function (n) {
                                    if (0 === (n = JSON.parse(n)).status) {
                                        if (0 === Number(n.data.is_auth)) {
                                            var r = "dueros://" + t.config.skillID + "/certification?action=realName";
                                            t.uploadLinkClicked({url: r, initiator: {type: "AUTO_TRIGGER"}})
                                        }
                                        e && e(null, n.data)
                                    } else e && e(new s.ServiceError("logid: " + n.logid + ", " + n.msg), n.data), console.error("requireUserAgeInfo has an error: ", n.logid, n.msg)
                                })
                            })
                        } else e(new s.LowVersionErrorMsg, null)
                    }
                }, {
                    key: "requireShipping", value: function () {
                        if (!this.config.skillID) throw new Error("Missing `skillID`, please configure `skillID` when initializes the `BotApp`");
                        var e = "dueros://" + this.config.skillID + "/readyForShipping";
                        this.uploadLinkClicked({url: e, initiator: {type: "AUTO_TRIGGER"}})
                    }
                }, {
                    key: "getRegisterResult", value: function (e) {
                        this.registerResult ? e(this.registerResult) : this.registerCallback = e
                    }
                }, {
                    key: "requireLinkAccount", value: function (e) {
                        this.isInApp() ? (this._validateCallback("requireLinkAccount", e), this._linkAccountResultCb = e, window.parent.postMessage({type: "request_authorization"}, this._gameWrapperMsgTarget)) : (e && console.warn("requireLinkAccount: Your H5 app is not running on the App, and the callback function will not be called"), this._getJSBridge(function (e) {
                            e.callHandler("requireLinkAccount")
                        }))
                    }
                }, {
                    key: "onLinkAccountSuccess", value: function (e) {
                        this._validateCallback("onLinkAccountSuccess", e), this._getJSBridge(function (t) {
                            t.registerHandler("onLinkAccountSuccess", function (t, n) {
                                e(JSON.parse(t)), n(!0)
                            })
                        })
                    }
                }, {
                    key: "requireCharge", value: function (e, t) {
                        if (this.isInApp()) {
                            if ("function" != typeof t) throw new Error("requireCharge: Your web runs in App and and you must pass a function in the position of the second to handle the purchase result.");
                            this._getShipPayResult = t, window.parent.postMessage({
                                type: "charge",
                                data: e
                            }, this._gameWrapperMsgTarget)
                        } else e = (0, r.default)(e), this._getJSBridge(function (t) {
                            t.callHandler("requireCharge", e)
                        })
                    }
                }, {
                    key: "requireBuy", value: function (e, t) {
                        if (this.isInApp()) {
                            if (!e || !e.productId || !e.sellerOrderId) {
                                var n = new Error;
                                throw n.name = "params error", n.message = "requireBuy: arguments[0] must be an `Object` with `productId` and `sellerOrderId`", n
                            }
                            this._validateCallback("requireBuy", t, 1), this._getShipPayResult = t;
                            var r = (0, i.default)({}, e, {
                                product2: e.productId + "|" + e.sellerOrderId + "|skillstoreapp",
                                source: "skillstoreapp",
                                from: "skillstoreapp"
                            });
                            window.parent.postMessage({type: "buy", data: r}, this._gameWrapperMsgTarget)
                        } else console.error("Method `requireBuy` can only be called in App")
                    }
                }, {
                    key: "uploadLinkClicked", value: function (e) {
                        e = (0, r.default)(e), this._getJSBridge(function (t) {
                            t.callHandler("uploadLinkClicked", e)
                        })
                    }
                }, {
                    key: "onChargeStatusChange", value: function (e) {
                        this._validateCallback("onChargeStatusChange", e), this._getJSBridge(function (t) {
                            t.registerHandler("onChargeStatusChange", function (t, n) {
                                e(JSON.parse(t)), n(!0)
                            })
                        })
                    }
                }, {
                    key: "onHandleIntent", value: function (e) {
                        this._validateCallback("onHandleIntent", e), this.onHandleIntentCb = e
                    }
                }, {
                    key: "updateUiContext", value: function (e, t) {
                        t && this._validateCallback("updateUiContext", t, 1), e = (0, r.default)(e), this._getJSBridge(function (n) {
                            n.callHandler("updateUiContext", e, function (e) {
                                t && t(e)
                            })
                        })
                    }
                }, {
                    key: "listen", value: function (e) {
                        e && this._validateCallback("listen", e), this._getJSBridge(function (t) {
                            t.callHandler("listen", function (t) {
                                e && e(t)
                            })
                        })
                    }
                }, {
                    key: "speak", value: function (e, t) {
                        t && this._validateCallback("speak", t, 1), this._getJSBridge(function (n) {
                            n.callHandler("speak", e, function () {
                                t && t()
                            })
                        })
                    }
                }, {
                    key: "requestClose", value: function () {
                        this.isInApp() ? window.parent.postMessage({type: "closeWebView"}, this._gameWrapperMsgTarget) : this._getJSBridge(function (e) {
                            e.callHandler("requestClose")
                        })
                    }
                }, {
                    key: "onClickLink", value: function (e) {
                        this._validateCallback("onClickLink", e), this._onClickLinkCb = e
                    }
                }, {
                    key: "onHandleScreenNavigatorEvent", value: function (e) {
                        this._validateCallback("onHandleScreenNavigatorEvent", e), this._getJSBridge(function (t) {
                            t.registerHandler("onHandleScreenNavigatorEvent", function (t, n) {
                                e(JSON.parse(t)), n(!0)
                            })
                        })
                    }
                }, {
                    key: "onDialogStateChanged", value: function (e) {
                        this._validateCallback("onDialogStateChanged", e), (0, u.compareShowVersion)(this._parseShowVersion(), "1.36.0.0") >= 0 ? this._getJSBridge(function (t) {
                            t.registerHandler("onDialogStateChanged", function (t, n) {
                                var r = JSON.parse(t);
                                e(null, r.data), n(!0)
                            })
                        }) : e(new s.LowVersionErrorMsg, null)
                    }
                }, {
                    key: "onHandleUnknowUtterance", value: function (e) {
                        this._validateCallback("onHandleUnknowUtterance", e), (0, u.compareShowVersion)(this._parseShowVersion(), "1.36.0.0") >= 0 ? this._handleUnknowUtteranceCb = e : e(new s.LowVersionErrorMsg, null)
                    }
                }, {
                    key: "canGoBack", value: function (e) {
                        this._validateCallback("canGoBack", e), (0, u.compareShowVersion)(this._parseShowVersion(), "1.36.0.0") >= 0 ? this._getJSBridge(function (t) {
                            t.callHandler("canGoBack", null, function (t) {
                                t = JSON.parse(t), e(null, t.data)
                            })
                        }) : e(new s.LowVersionErrorMsg, null)
                    }
                }, {
                    key: "registerGesture", value: function (e, t) {
                        var n = this;
                        if (this._validateCallback("registerGesture", t, 1), !Array.isArray(e)) throw new Error("data must be a `Array`");
                        (0, u.compareShowVersion)(this._parseShowVersion(), "1.36.0.0") >= 0 ? this._getJSBridge(function (i) {
                            var o = (0, r.default)({
                                capacityName: "AI_DUER_SHOW_GESTURE_REGISTER",
                                params: {enabledGestures: e}
                            });
                            i.callHandler("triggerDuerOSCapacity", o, function () {
                            }), n._registerGestureCb = t
                        }) : t(new s.LowVersionErrorMsg, null)
                    }
                }, {
                    key: "interruptTTS", value: function () {
                        (0, u.compareShowVersion)(this._parseShowVersion(), "1.36.0.0") >= 0 ? this._getJSBridge(function (e) {
                            var t = (0, r.default)({capacityName: "AI_DUER_SHOW_INTERRPT_TTS", params: null});
                            e.callHandler("triggerDuerOSCapacity", t, function () {
                            })
                        }) : console.error(new s.LowVersionErrorMsg)
                    }
                }, {
                    key: "getCameraState", value: function (e) {
                        var t = this;
                        this._validateCallback("getCameraState", e), (0, u.compareShowVersion)(this._parseShowVersion(), "1.39.0.0") >= 0 ? this._getJSBridge(function (n) {
                            var i = (0, r.default)({capacityName: "AI_DUER_SHOW_GET_CAMERA_STATE", params: null});
                            n.callHandler("triggerDuerOSCapacity", i, function () {
                            }), t._getCameraStateCb = e
                        }) : e(new s.LowVersionErrorMsg, null)
                    }
                }, {
                    key: "sendEvent", value: function (e) {
                        (0, u.compareShowVersion)(this._parseShowVersion(), "1.40.0.0") >= 0 ? this._getJSBridge(function (t) {
                            var n = (0, r.default)(e);
                            t.callHandler("sendEvent", n, function () {
                            })
                        }) : console.error(new s.LowVersionErrorMsg)
                    }
                }, {
                    key: "onBuyStatusChange", value: function (e) {
                        this._validateCallback("getCameraState", e), (0, u.compareShowVersion)(this._parseShowVersion(), "1.40.0.0") >= 0 ? this._getJSBridge(function (t) {
                            t.registerHandler("onBuyStatusChange", function (t, n) {
                                e(JSON.parse(t)), n(!0)
                            })
                        }) : console.error(new s.LowVersionErrorMsg)
                    }
                }, {
                    key: "_renderAd", value: function (e) {
                        var t = this, n = JSON.parse(e), r = decodeURIComponent(n.props.htmlAddress);
                        if (0 === n.status) {
                            if (this._adIframe1) {
                                if (!this.config._duerosDebugadIframeUrl && this._adIframe1BaseUrl !== r) return document.body.removeChild(this._adIframe1), this._adIframe1Loaded = !1, this._adIframe1 = null, void this._renderAd(e)
                            } else {
                                this._adIframe1 = (0, u.createIframe)({
                                    width: 0,
                                    height: 0,
                                    zIndex: this.config.adZIndex,
                                    background: "transparent"
                                });
                                var o = encodeURIComponent((0, u.parseH5UrlOrigin)(window.location.href));
                                this.config._duerosDebugadIframeUrl ? (this._adIframe1BaseUrl = this.config._duerosDebugadIframeUrl, this._adMsgTarget = (0, u.parseH5UrlOrigin)(this.config._duerosDebugadIframeUrl)) : (this._adIframe1BaseUrl = r, this._adMsgTarget = (0, u.parseH5UrlOrigin)(r));
                                var a = "";
                                a = this._adIframe1BaseUrl.indexOf("?") > -1 ? this._adIframe1BaseUrl + "&msgTarget=" + o : this._adIframe1BaseUrl + "?msgTarget=" + o, this._adIframe1.src = a, document.body.appendChild(this._adIframe1)
                            }
                            this._adIframe1.style.display = "block", this._setAdPosition();
                            var s = {
                                type: "ad_set_material",
                                data: (0, i.default)({}, n, {screenOrientation: this.config.screenOrientation})
                            };
                            this._adIframe1Loaded ? this._adIframe1.contentWindow.postMessage(s, this._adMsgTarget) : this._adIframe1.onload = function () {
                                t._adIframe1.contentWindow.postMessage(s, t._adMsgTarget), t._adIframe1Loaded = !0
                            }
                        } else console.error("Failed to get advertisement: ", n)
                    }
                }, {
                    key: "_requestCommonadMaterial", value: function () {
                        var e = "dueros://f34646bc-37b4-a9db-361f-48fe7ca8831d/getAdResources?adPlaceId=" + this.config.adPlaceId + "&botId=" + this.config.skillID;
                        this.uploadLinkClicked({url: e, initiator: {type: "AUTO_TRIGGER"}})
                    }
                }, {
                    key: "_setAdPosition", value: function () {
                        "portrait" === this.config.screenOrientation ? (this._adIframe1.style.cssText += "width: 242px; height: 214px;bottom: 30px;", this._lastVerticalAdDisplayIsLeft ? (this._adIframe1.style.left = "", this._adIframe1.style.right = "23px") : (this._adIframe1.style.left = "23px", this._adIframe1.style.right = "")) : "landscape" === this.config.screenOrientation && (this._adIframe1.style.cssText += "width: 446px; height: 118px;", (0, u.isSet)(this.config.adBannerPosition.top) && (this._adIframe1.style.top = this.config.adBannerPosition.top), (0, u.isSet)(this.config.adBannerPosition.right) && (this._adIframe1.style.right = this.config.adBannerPosition.right), (0, u.isSet)(this.config.adBannerPosition.bottom) && (this._adIframe1.style.bottom = this.config.adBannerPosition.bottom), (0, u.isSet)(this.config.adBannerPosition.left) && (this._adIframe1.style.left = this.config.adBannerPosition.left))
                    }
                }, {
                    key: "_startCommonAdSwitch", value: function (e) {
                        var t = this;
                        this._isCommonAdSwitchOff = !1, e && this._requestCommonadMaterial(), clearInterval(this._commonAdSwitchTimer), this._commonAdSwitchTimer = setInterval(function () {
                            t._requestCommonadMaterial()
                        }, this._commonadSwitchInterval)
                    }
                }, {
                    key: "_closeCommonAd", value: function () {
                        clearInterval(this._commonAdSwitchTimer), this._isCommonAdSwitchOff = !0, this._adIframe1.style.display = "none", this._isCommonAdDisplaying = !1
                    }
                }, {
                    key: "_pauseCommonAd", value: function () {
                        clearInterval(this._commonAdSwitchTimer), this._isCommonAdSwitchOff = !0
                    }
                }, {
                    key: "_logTouch", value: function () {
                        var e = this;
                        window.addEventListener("touchstart", function (t) {
                            var n = t.touches[0];
                            e.sendEvent({
                                namespace: "ai.dueros.device_interface.bot_app_sdk",
                                name: "TouchedDown",
                                needDialogRequestId: !1,
                                payload: {position: {left: parseInt(n.pageX, 10), top: parseInt(n.pageY, 10)}}
                            })
                        }, !0)
                    }
                }, {
                    key: "_reportGameBeat", value: function () {
                        this.uploadLinkClicked({
                            url: "dueros://" + this.config.skillID + "/h5game/heartbeatreport",
                            initiator: {type: "AUTO_TRIGGER"}
                        })
                    }
                }, {
                    key: "_fireGameProcessBeatReport", value: function () {
                        var e = this, t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 60;
                        this._reportGameBeat(), clearInterval(this._gameBeatReportTimer), this._gameBeatReportTimer = setInterval(function () {
                            e._reportGameBeat()
                        }, 1e3 * t)
                    }
                }, {
                    key: "_cancelGameProcessBeatReport", value: function () {
                        clearInterval(this._gameBeatReportTimer)
                    }
                }]), e
            }();
        e.exports = g, window.addEventListener("load", function () {
            var e = (0, u.getQuery)(), t = e.random1, n = e.signature1, r = e.random2, i = e.signature2, o = e.skillID;
            window.botAppInstance = new g({random1: t, signature1: n, random2: r, signature2: i, skillID: o})
        })
    }, W070: function (e, t, n) {
        var r = n("NsO/"), i = n("tEej"), o = n("D8kY");
        e.exports = function (e) {
            return function (t, n, a) {
                var s, u = r(t), c = i(u.length), l = o(a, c);
                if (e && n != n) {
                    for (; c > l;) if ((s = u[l++]) != s) return !0
                } else for (; c > l; l++) if ((e || l in u) && u[l] === n) return e || l || 0;
                return !e && -1
            }
        }
    }, WEpk: function (e, t) {
        var n = e.exports = {version: "2.6.9"};
        "number" == typeof __e && (__e = n)
    }, Wu5q: function (e, t, n) {
        "use strict";
        var r = n("2faE").f, i = n("oVml"), o = n("XJU/"), a = n("2GTP"), s = n("EXMj"), u = n("oioR"), c = n("MPFp"),
            l = n("UO39"), f = n("TJWN"), d = n("jmDH"), p = n("6/1s").fastKey, h = n("n3ko"), g = d ? "_s" : "size",
            m = function (e, t) {
                var n, r = p(t);
                if ("F" !== r) return e._i[r];
                for (n = e._f; n; n = n.n) if (n.k == t) return n
            };
        e.exports = {
            getConstructor: function (e, t, n, c) {
                var l = e(function (e, r) {
                    s(e, l, t, "_i"), e._t = t, e._i = i(null), e._f = void 0, e._l = void 0, e[g] = 0, null != r && u(r, n, e[c], e)
                });
                return o(l.prototype, {
                    clear: function () {
                        for (var e = h(this, t), n = e._i, r = e._f; r; r = r.n) r.r = !0, r.p && (r.p = r.p.n = void 0), delete n[r.i];
                        e._f = e._l = void 0, e[g] = 0
                    }, delete: function (e) {
                        var n = h(this, t), r = m(n, e);
                        if (r) {
                            var i = r.n, o = r.p;
                            delete n._i[r.i], r.r = !0, o && (o.n = i), i && (i.p = o), n._f == r && (n._f = i), n._l == r && (n._l = o), n[g]--
                        }
                        return !!r
                    }, forEach: function (e) {
                        h(this, t);
                        for (var n, r = a(e, arguments.length > 1 ? arguments[1] : void 0, 3); n = n ? n.n : this._f;) for (r(n.v, n.k, this); n && n.r;) n = n.p
                    }, has: function (e) {
                        return !!m(h(this, t), e)
                    }
                }), d && r(l.prototype, "size", {
                    get: function () {
                        return h(this, t)[g]
                    }
                }), l
            }, def: function (e, t, n) {
                var r, i, o = m(e, t);
                return o ? o.v = n : (e._l = o = {
                    i: i = p(t, !0),
                    k: t,
                    v: n,
                    p: r = e._l,
                    n: void 0,
                    r: !1
                }, e._f || (e._f = o), r && (r.n = o), e[g]++, "F" !== i && (e._i[i] = o)), e
            }, getEntry: m, setStrong: function (e, t, n) {
                c(e, t, function (e, n) {
                    this._t = h(e, t), this._k = n, this._l = void 0
                }, function () {
                    for (var e = this._k, t = this._l; t && t.r;) t = t.p;
                    return this._t && (this._l = t = t ? t.n : this._t._f) ? l(0, "keys" == e ? t.k : "values" == e ? t.v : [t.k, t.v]) : (this._t = void 0, l(1))
                }, n ? "entries" : "values", !n, !0), f(t)
            }
        }
    }, "XJU/": function (e, t, n) {
        var r = n("NegM");
        e.exports = function (e, t, n) {
            for (var i in t) n && e[i] ? e[i] = t[i] : r(e, i, t[i]);
            return e
        }
    }, XLbu: function (e, t, n) {
        var r = n("Y7ZC");
        r(r.P + r.R, "Map", {toJSON: n("8iia")("Map")})
    }, Y7ZC: function (e, t, n) {
        var r = n("5T2Y"), i = n("WEpk"), o = n("2GTP"), a = n("NegM"), s = n("B+OT"), u = function (e, t, n) {
            var c, l, f, d = e & u.F, p = e & u.G, h = e & u.S, g = e & u.P, m = e & u.B, _ = e & u.W,
                v = p ? i : i[t] || (i[t] = {}), y = v.prototype, b = p ? r : h ? r[t] : (r[t] || {}).prototype;
            for (c in p && (n = t), n) (l = !d && b && void 0 !== b[c]) && s(v, c) || (f = l ? b[c] : n[c], v[c] = p && "function" != typeof b[c] ? n[c] : m && l ? o(f, r) : _ && b[c] == f ? function (e) {
                var t = function (t, n, r) {
                    if (this instanceof e) {
                        switch (arguments.length) {
                            case 0:
                                return new e;
                            case 1:
                                return new e(t);
                            case 2:
                                return new e(t, n)
                        }
                        return new e(t, n, r)
                    }
                    return e.apply(this, arguments)
                };
                return t.prototype = e.prototype, t
            }(f) : g && "function" == typeof f ? o(Function.call, f) : f, g && ((v.virtual || (v.virtual = {}))[c] = f, e & u.R && y && !y[c] && a(y, c, f)))
        };
        u.F = 1, u.G = 2, u.S = 4, u.P = 8, u.B = 16, u.W = 32, u.U = 64, u.R = 128, e.exports = u
    }, YqAc: function (e, t) {
        var n = 0, r = Math.random();
        e.exports = function (e) {
            return "Symbol(".concat(void 0 === e ? "" : e, ")_", (++n + r).toString(36))
        }
    }, a0xu: function (e, t) {
        var n = {}.toString;
        e.exports = function (e) {
            return n.call(e).slice(8, -1)
        }
    }, aPfg: function (e, t, n) {
        "use strict";
        var r = n("Y7ZC"), i = n("eaoh"), o = n("2GTP"), a = n("oioR");
        e.exports = function (e) {
            r(r.S, e, {
                from: function (e) {
                    var t, n, r, s, u = arguments[1];
                    return i(this), (t = void 0 !== u) && i(u), null == e ? new this : (n = [], t ? (r = 0, s = o(u, arguments[2], 2), a(e, !1, function (e) {
                        n.push(s(e, r++))
                    })) : a(e, !1, n.push, n), new this(n))
                }
            })
        }
    }, bBy9: function (e, t, n) {
        n("w2d+");
        for (var r = n("5T2Y"), i = n("NegM"), o = n("SBuE"), a = n("UWiX")("toStringTag"), s = "CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,TextTrackList,TouchList".split(","), u = 0; u < s.length; u++) {
            var c = s[u], l = r[c], f = l && l.prototype;
            f && !f[a] && i(f, a, c), o[c] = o.Array
        }
    }, cHUd: function (e, t, n) {
        "use strict";
        var r = n("Y7ZC");
        e.exports = function (e) {
            r(r.S, e, {
                of: function () {
                    for (var e = arguments.length, t = new Array(e); e--;) t[e] = arguments[e];
                    return new this(t)
                }
            })
        }
    }, ccE7: function (e, t, n) {
        var r = n("Ojgd"), i = n("Jes0");
        e.exports = function (e) {
            return function (t, n) {
                var o, a, s = String(i(t)), u = r(n), c = s.length;
                return u < 0 || u >= c ? e ? "" : void 0 : (o = s.charCodeAt(u)) < 55296 || o > 56319 || u + 1 === c || (a = s.charCodeAt(u + 1)) < 56320 || a > 57343 ? e ? s.charAt(u) : o : e ? s.slice(u, u + 2) : a - 56320 + (o - 55296 << 10) + 65536
            }
        }
    }, dVTT: function (e, t, n) {
        n("aPfg")("Map")
    }, eUtF: function (e, t, n) {
        e.exports = !n("jmDH") && !n("KUxP")(function () {
            return 7 != Object.defineProperty(n("Hsns")("div"), "a", {
                get: function () {
                    return 7
                }
            }).a
        })
    }, eaoh: function (e, t) {
        e.exports = function (e) {
            if ("function" != typeof e) throw TypeError(e + " is not a function!");
            return e
        }
    }, fNZA: function (e, t, n) {
        var r = n("QMMT"), i = n("UWiX")("iterator"), o = n("SBuE");
        e.exports = n("WEpk").getIteratorMethod = function (e) {
            if (null != e) return e[i] || e["@@iterator"] || o[r(e)]
        }
    }, fXsU: function (e, t, n) {
        var r = n("5K7Z"), i = n("fNZA");
        e.exports = n("WEpk").getIterator = function (e) {
            var t = i(e);
            if ("function" != typeof t) throw TypeError(e + " is not iterable!");
            return r(t.call(e))
        }
    }, fpC5: function (e, t, n) {
        var r = n("2faE"), i = n("5K7Z"), o = n("w6GO");
        e.exports = n("jmDH") ? Object.defineProperties : function (e, t) {
            i(e);
            for (var n, a = o(t), s = a.length, u = 0; s > u;) r.f(e, n = a[u++], t[n]);
            return e
        }
    }, g33z: function (e, t, n) {
        "use strict";
        var r = n("Wu5q"), i = n("n3ko");
        e.exports = n("raTm")("Map", function (e) {
            return function () {
                return e(this, arguments.length > 0 ? arguments[0] : void 0)
            }
        }, {
            get: function (e) {
                var t = r.getEntry(i(this, "Map"), e);
                return t && t.v
            }, set: function (e, t) {
                return r.def(i(this, "Map"), 0 === e ? 0 : e, t)
            }
        }, r, !0)
    }, "gDS+": function (e, t, n) {
        e.exports = {default: n("oh+g"), __esModule: !0}
    }, hDam: function (e, t) {
        e.exports = function () {
        }
    }, iCc5: function (e, t, n) {
        "use strict";
        t.__esModule = !0, t.default = function (e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
    }, iq4v: function (e, t, n) {
        n("Mqbl"), e.exports = n("WEpk").Object.keys
    }, j2DC: function (e, t, n) {
        "use strict";
        var r = n("oVml"), i = n("rr1i"), o = n("RfKB"), a = {};
        n("NegM")(a, n("UWiX")("iterator"), function () {
            return this
        }), e.exports = function (e, t, n) {
            e.prototype = r(a, {next: i(1, n)}), o(e, t + " Iterator")
        }
    }, jmDH: function (e, t, n) {
        e.exports = !n("KUxP")(function () {
            return 7 != Object.defineProperty({}, "a", {
                get: function () {
                    return 7
                }
            }).a
        })
    }, "k/8l": function (e, t, n) {
        e.exports = {default: n("VKFn"), __esModule: !0}
    }, kAMH: function (e, t, n) {
        var r = n("a0xu");
        e.exports = Array.isArray || function (e) {
            return "Array" == r(e)
        }
    }, kTiW: function (e, t, n) {
        e.exports = n("NegM")
    }, kwZ1: function (e, t, n) {
        "use strict";
        var r = n("jmDH"), i = n("w6GO"), o = n("mqlF"), a = n("NV0k"), s = n("JB68"), u = n("M1xp"), c = Object.assign;
        e.exports = !c || n("KUxP")(function () {
            var e = {}, t = {}, n = Symbol(), r = "abcdefghijklmnopqrst";
            return e[n] = 7, r.split("").forEach(function (e) {
                t[e] = e
            }), 7 != c({}, e)[n] || Object.keys(c({}, t)).join("") != r
        }) ? function (e, t) {
            for (var n = s(e), c = arguments.length, l = 1, f = o.f, d = a.f; c > l;) for (var p, h = u(arguments[l++]), g = f ? i(h).concat(f(h)) : i(h), m = g.length, _ = 0; m > _;) p = g[_++], r && !d.call(h, p) || (n[p] = h[p]);
            return n
        } : c
    }, ldVq: function (e, t, n) {
        var r = n("QMMT"), i = n("UWiX")("iterator"), o = n("SBuE");
        e.exports = n("WEpk").isIterable = function (e) {
            var t = Object(e);
            return void 0 !== t[i] || "@@iterator" in t || o.hasOwnProperty(r(t))
        }
    }, mqlF: function (e, t) {
        t.f = Object.getOwnPropertySymbols
    }, n3ko: function (e, t, n) {
        var r = n("93I4");
        e.exports = function (e, t) {
            if (!r(e) || e._t !== t) throw TypeError("Incompatible receiver, " + t + " required!");
            return e
        }
    }, o8NH: function (e, t, n) {
        var r = n("Y7ZC");
        r(r.S + r.F, "Object", {assign: n("kwZ1")})
    }, oVml: function (e, t, n) {
        var r = n("5K7Z"), i = n("fpC5"), o = n("FpHa"), a = n("VVlx")("IE_PROTO"), s = function () {
        }, u = function () {
            var e, t = n("Hsns")("iframe"), r = o.length;
            for (t.style.display = "none", n("MvwC").appendChild(t), t.src = "javascript:", (e = t.contentWindow.document).open(), e.write("<script>document.F=Object<\/script>"), e.close(), u = e.F; r--;) delete u.prototype[o[r]];
            return u()
        };
        e.exports = Object.create || function (e, t) {
            var n;
            return null !== e ? (s.prototype = r(e), n = new s, s.prototype = null, n[a] = e) : n = u(), void 0 === t ? n : i(n, t)
        }
    }, "oh+g": function (e, t, n) {
        var r = n("WEpk"), i = r.JSON || (r.JSON = {stringify: JSON.stringify});
        e.exports = function (e) {
            return i.stringify.apply(i, arguments)
        }
    }, oioR: function (e, t, n) {
        var r = n("2GTP"), i = n("sNwI"), o = n("NwJ3"), a = n("5K7Z"), s = n("tEej"), u = n("fNZA"), c = {}, l = {};
        (t = e.exports = function (e, t, n, f, d) {
            var p, h, g, m, _ = d ? function () {
                return e
            } : u(e), v = r(n, f, t ? 2 : 1), y = 0;
            if ("function" != typeof _) throw TypeError(e + " is not iterable!");
            if (o(_)) {
                for (p = s(e.length); p > y; y++) if ((m = t ? v(a(h = e[y])[0], h[1]) : v(e[y])) === c || m === l) return m
            } else for (g = _.call(e); !(h = g.next()).done;) if ((m = i(g, v, h.value, t)) === c || m === l) return m
        }).BREAK = c, t.RETURN = l
    }, raTm: function (e, t, n) {
        "use strict";
        var r = n("5T2Y"), i = n("Y7ZC"), o = n("6/1s"), a = n("KUxP"), s = n("NegM"), u = n("XJU/"), c = n("oioR"),
            l = n("EXMj"), f = n("93I4"), d = n("RfKB"), p = n("2faE").f, h = n("V7Et")(0), g = n("jmDH");
        e.exports = function (e, t, n, m, _, v) {
            var y = r[e], b = y, k = _ ? "set" : "add", w = b && b.prototype, S = {};
            return g && "function" == typeof b && (v || w.forEach && !a(function () {
                (new b).entries().next()
            })) ? (b = t(function (t, n) {
                l(t, b, e, "_c"), t._c = new y, null != n && c(n, _, t[k], t)
            }), h("add,clear,delete,forEach,get,has,set,keys,values,entries,toJSON".split(","), function (e) {
                var t = "add" == e || "set" == e;
                e in w && (!v || "clear" != e) && s(b.prototype, e, function (n, r) {
                    if (l(this, b, e), !t && v && !f(n)) return "get" == e && void 0;
                    var i = this._c[e](0 === n ? 0 : n, r);
                    return t ? this : i
                })
            }), v || p(b.prototype, "size", {
                get: function () {
                    return this._c.size
                }
            })) : (b = m.getConstructor(t, e, _, k), u(b.prototype, n), o.NEED = !0), d(b, e), S[e] = b, i(i.G + i.W + i.F, S), v || m.setStrong(b, e, _), b
        }
    }, rr1i: function (e, t) {
        e.exports = function (e, t) {
            return {enumerable: !(1 & e), configurable: !(2 & e), writable: !(4 & e), value: t}
        }
    }, sNwI: function (e, t, n) {
        var r = n("5K7Z");
        e.exports = function (e, t, n, i) {
            try {
                return i ? t(r(n)[0], n[1]) : t(n)
            } catch (t) {
                var o = e.return;
                throw void 0 !== o && r(o.call(e)), t
            }
        }
    }, sk9p: function (e, t, n) {
        "use strict";
        t.__esModule = !0;
        var r = o(n("k/8l")), i = o(n("FyfS"));

        function o(e) {
            return e && e.__esModule ? e : {default: e}
        }

        t.default = function (e, t) {
            if (Array.isArray(e)) return e;
            if ((0, r.default)(Object(e))) return function (e, t) {
                var n = [], r = !0, o = !1, a = void 0;
                try {
                    for (var s, u = (0, i.default)(e); !(r = (s = u.next()).done) && (n.push(s.value), !t || n.length !== t); r = !0) ;
                } catch (e) {
                    o = !0, a = e
                } finally {
                    try {
                        !r && u.return && u.return()
                    } finally {
                        if (o) throw a
                    }
                }
                return n
            }(e, t);
            throw new TypeError("Invalid attempt to destructure non-iterable instance")
        }
    }, tEej: function (e, t, n) {
        var r = n("Ojgd"), i = Math.min;
        e.exports = function (e) {
            return e > 0 ? i(r(e), 9007199254740991) : 0
        }
    }, uOPS: function (e, t) {
        e.exports = !0
    }, v6xn: function (e, t, n) {
        var r = n("C2SN");
        e.exports = function (e, t) {
            return new (r(e))(t)
        }
    }, "w2d+": function (e, t, n) {
        "use strict";
        var r = n("hDam"), i = n("UO39"), o = n("SBuE"), a = n("NsO/");
        e.exports = n("MPFp")(Array, "Array", function (e, t) {
            this._t = a(e), this._i = 0, this._k = t
        }, function () {
            var e = this._t, t = this._k, n = this._i++;
            return !e || n >= e.length ? (this._t = void 0, i(1)) : i(0, "keys" == t ? n : "values" == t ? e[n] : [n, e[n]])
        }, "values"), o.Arguments = o.Array, r("keys"), r("values"), r("entries")
    }, w6GO: function (e, t, n) {
        var r = n("5vMV"), i = n("FpHa");
        e.exports = Object.keys || function (e) {
            return r(e, i)
        }
    }, wgeU: function (e, t) {
    }, yMsT: function (e, t, n) {
        "use strict";
        Object.defineProperty(t, "__esModule", {value: !0}), t.ServiceError = t.LowVersionErrorMsg = void 0;
        var r, i = n("iCc5"), o = (r = i) && r.__esModule ? r : {default: r};
        t.LowVersionErrorMsg = function e() {
            (0, o.default)(this, e), this.code = 1001, this.msg = "Device version too low"
        }, t.ServiceError = function e(t) {
            (0, o.default)(this, e), this.code = 1002, this.msg = "Service error, " + t
        }
    }, zn7N: function (e, t, n) {
        var r = n("Y7ZC"), i = n("WEpk"), o = n("KUxP");
        e.exports = function (e, t) {
            var n = (i.Object || {})[e] || Object[e], a = {};
            a[e] = t(n), r(r.S + r.F * o(function () {
                n(1)
            }), "Object", a)
        }
    }
});
