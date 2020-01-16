! function(t, e) {
    "object" == typeof exports && "undefined" != typeof module ? e(exports) : "function" == typeof define && define.amd ? define(["exports"], e) : e((t = t || self).maptastic = {})
}(this, function(t) {
    "use strict";

    function s(t) {
        return (s = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
            return typeof t
        } : function(t) {
            return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
        })(t)
    }

    function i(t, e) {
        for (var s = 0; s < e.length; s++) {
            var i = e[s];
            i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i)
        }
    }

    function e(t) {
        var e;
        return "object" === s(t) ? "object" === s(e = t[0]) ? "object" === s(e[0]) ? function(t) {
            for (var e = [];
                "object" === s(t);) e.push(t.length), t = t[0];
            return e
        }(t) : [t.length, e.length] : [t.length] : []
    }

    function n(t) {
        var e, s = t.length,
            i = Array(s);
        for (e = s - 1; - 1 !== e; --e) i[e] = t[e];
        return i
    }

    function v(t) {
        return "object" !== s(t) ? t : function t(e, s, i, n) {
            if (i === s.length - 1) return n(e);
            var o, r = s[i],
                a = Array(r);
            for (o = r - 1; 0 <= o; o--) a[o] = t(e[o], s, i + 1, n);
            return a
        }(t, e(t), 0, n)
    }

    function l(t, e, s) {
        return function(t, e) {
            var s, i, n, o, r, a = t.LU,
                h = a.length,
                l = v(e),
                c = t.P;
            for (s = h - 1; - 1 !== s; --s) l[s] = e[s];
            for (s = 0; s < h; ++s)
                for ((n = c[s]) !== s && (r = l[s], l[s] = l[n], l[n] = r), o = a[s], i = 0; i < s; ++i) l[s] -= l[i] * o[i];
            for (s = h - 1; 0 <= s; --s) {
                for (o = a[s], i = s + 1; i < h; ++i) l[s] -= l[i] * o[i];
                l[s] /= o[s]
            }
            return l
        }(function(t, e) {
            var s, i, n, o, r, a, h, l, c, u = 1 < arguments.length && void 0 !== e && e,
                y = Math.abs,
                f = t.length,
                g = f - 1,
                d = new Array(f);
            for (u || (t = v(t)), n = 0; n < f; ++n) {
                for (c = y((a = t[h = n])[n]), i = n + 1; i < f; ++i) c < (o = y(t[i][n])) && (c = o, h = i);
                for ((d[n] = h) != n && (t[n] = t[h], t[h] = a, a = t[n]), r = a[n], s = n + 1; s < f; ++s) t[s][n] /= r;
                for (s = n + 1; s < f; ++s) {
                    for (l = t[s], i = n + 1; i < g; ++i) l[i] -= l[n] * a[i], l[++i] -= l[n] * a[i];
                    i === g && (l[i] -= l[n] * a[i])
                }
            }
            return {
                LU: t,
                P: d
            }
        }(t, s), e)
    }
    var o = Object.prototype.hasOwnProperty;

    function h(t, e, s) {
        return t && o.call(t, e) && null !== t[e] ? t[e] : s
    }

    function P(t, e, s, i) {
        return Math.sqrt(Math.pow(s - t, 2) + Math.pow(i - e, 2))
    }

    function m(t, e, s, i) {
        var n = e[1] * i[0] - e[0] * i[1] + (i[1] - e[1]) * t[0] + (e[0] - i[0]) * t[1],
            o = e[0] * s[1] - e[1] * s[0] + (e[1] - s[1]) * t[0] + (s[0] - e[0]) * t[1];
        if (n < 0 != o < 0) return !1;
        var r = -s[1] * i[0] + e[1] * (i[0] - s[0]) + e[0] * (s[1] - i[1]) + s[0] * i[1];
        return r < 0 && (n = -n, o = -o, r = -r), 0 < n && 0 < o && n + o < r
    }

    function c(t, e, s) {
        var i = t[e][0],
            n = t[e][1];
        t[e][0] = t[s][0], t[e][1] = t[s][1], t[s][0] = i, t[s][1] = n
    }

    function p(t, e) {
        for (var s = Math.sin(e), i = Math.cos(e), n = [0, 0], o = 0; o < t.targetPoints.length; o++) n[0] += t.targetPoints[o][0], n[1] += t.targetPoints[o][1];
        n[0] /= 4, n[1] /= 4;
        for (var r = 0; r < t.targetPoints.length; r++) {
            var a = t.targetPoints[r][0] - n[0],
                h = t.targetPoints[r][1] - n[1];
            t.targetPoints[r][0] = a * i - h * s + n[0], t.targetPoints[r][1] = a * s + h * i + n[1]
        }
    }

    function w(t, e) {
        for (var s = [0, 0], i = 0; i < t.targetPoints.length; i++) s[0] += t.targetPoints[i][0], s[1] += t.targetPoints[i][1];
        s[0] /= 4, s[1] /= 4;
        for (var n = 0; n < t.targetPoints.length; n++) {
            var o = t.targetPoints[n][1] - s[1];
            t.targetPoints[n][0] = (t.targetPoints[n][0] - s[0]) * e + s[0], t.targetPoints[n][1] = o * e + s[1]
        }
    }

    function u(t) {
        for (var e = [], s = 0; s < t.length; s++) e.push(t[s].slice(0, 2));
        return e
    }
    t.Maptastic = function() {
        function a(t) {
            ! function(t, e) {
                if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
            }(this, a), this.canvas = null, this.context = null, this.layers = [], this.configActive = !1, this.dragging = !1, this.dragOffset = [0, 0], this.selectedLayer = null, this.selectedPoint = null, this.selectionRadius = 20, this.hoveringPoint = null, this.hoveringLayer = null, this.dragOperation = "move", this.isLayerSoloed = !1, this.mousePosition = [0, 0], this.mouseDelta = [0, 0], this.mouseDownPoint = [], this.showLayerNames = h(t, "labels", !0), this.showCrosshairs = h(t, "crosshairs", !1), this.showScreenBounds = h(t, "screenbounds", !1), this.autoSave = h(t, "autoSave", !0), this.layoutChangeListener = h(t, "onchange", function() {}), this.localStorageKey = "maptastic.layers";
            for (var e = h(t, "layers", []), s = arguments.length, i = new Array(1 < s ? s - 1 : 0), n = 1; n < s; n++) i[n - 1] = arguments[n];
            for (var o = e.concat(i, [t]), r = 0; r < o.length; r++)(o[r] instanceof HTMLElement || "string" == typeof o[r]) && this.addLayer(o[r]);
            h(t, "autoLoad", !0) && this.loadSettings(), this.init()
        }
        var t, e, s;
        return t = a, (e = [{
            key: "init",
            value: function() {
                var e = this,
                    t = document.createElement("canvas");
                t.style.display = "none", t.style.position = "fixed", t.style.top = "0px", t.style.left = "0px", t.style.zIndex = "1000000", this.canvas = t, this.context = t.getContext("2d"), document.body.appendChild(t), window.addEventListener("resize", function(t) {
                    return e.resize()
                }), window.addEventListener("mousemove", function(t) {
                    return e.mouseMove(t)
                }), window.addEventListener("mouseup", function(t) {
                    return e.mouseUp(t)
                }), window.addEventListener("mousedown", function(t) {
                    return e.mouseDown(t)
                }), window.addEventListener("keydown", function(t) {
                    return e.keyDown(t)
                }), this.resize()
            }
        }, {
            key: "notifyChangeListener",
            value: function() {
                this.layoutChangeListener()
            }
        }, {
            key: "resize",
            value: function() {
                var t = window,
                    e = t.innerHeight;
                this.canvas.width = t.innerWidth, this.canvas.height = e, this.draw()
            }
        }, {
            key: "draw",
            value: function() {
                if (this.configActive) {
                    this.context.strokeStyle = "red", this.context.lineWidth = 2, this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
                    for (var t = 0; t < this.layers.length; t++)
                        if (this.layers[t].visible) {
                            this.layers[t].element.style.visibility = "visible", this.context.beginPath(), this.context.strokeStyle = this.layers[t] === this.hoveringLayer ? "red" : this.layers[t] === this.selectedLayer ? "red" : "white", this.context.moveTo(this.layers[t].targetPoints[0][0], this.layers[t].targetPoints[0][1]);
                            for (var e = 0; e < this.layers[t].targetPoints.length; e++) this.context.lineTo(this.layers[t].targetPoints[e][0], this.layers[t].targetPoints[e][1]);
                            this.context.lineTo(this.layers[t].targetPoints[3][0], this.layers[t].targetPoints[3][1]), this.context.closePath(), this.context.stroke();
                            for (var s = [0, 0], i = 0; i < this.layers[t].targetPoints.length; i++) this.context.strokeStyle = this.layers[t].targetPoints[i] === this.hoveringPoint ? "red" : this.layers[t].targetPoints[i] === this.selectedPoint ? "red" : "white", s[0] += this.layers[t].targetPoints[i][0], s[1] += this.layers[t].targetPoints[i][1], this.context.beginPath(), this.context.arc(this.layers[t].targetPoints[i][0], this.layers[t].targetPoints[i][1], this.selectionRadius / 2, 0, 2 * Math.PI, !1), this.context.stroke();
                            if (s[0] /= 4, s[1] /= 4, this.showLayerNames) {
                                var n = this.layers[t].element.id.toUpperCase();
                                this.context.font = "16px sans-serif", this.context.textAlign = "center";
                                var o = [this.context.measureText(n).width + 8, 32];
                                this.context.fillStyle = "white", this.context.fillRect(s[0] - o[0] / 2, s[1] - o[1] + 8, o[0], o[1]), this.context.fillStyle = "black", this.context.fillText(n, s[0], s[1])
                            }
                        } else this.layers[t].element.style.visibility = "hidden";
                    if (this.showCrosshairs && (this.context.strokeStyle = "yellow", this.context.lineWidth = 1, this.context.beginPath(), this.context.moveTo(this.mousePosition[0], 0), this.context.lineTo(this.mousePosition[0], this.canvas.height), this.context.moveTo(0, this.mousePosition[1]), this.context.lineTo(this.canvas.width, this.mousePosition[1]), this.context.stroke()), this.showScreenBounds) {
                        this.context.fillStyle = "black", this.context.lineWidth = 4, this.context.fillRect(0, 0, this.canvas.width, this.canvas.height), this.context.strokeStyle = "#909090", this.context.beginPath();
                        for (var r = this.canvas.width / 10, a = this.canvas.height / 10, h = 0; h < 10; h++) this.context.moveTo(h * r, 0), this.context.lineTo(h * r, this.canvas.height), this.context.moveTo(0, h * a), this.context.lineTo(this.canvas.width, h * a);
                        this.context.stroke(), this.context.strokeStyle = "white", this.context.strokeRect(2, 2, this.canvas.width - 4, this.canvas.height - 4);
                        var l = Math.round(.6 * a);
                        this.context.font = l + "px mono,sans-serif", this.context.fillRect(2 * r + 2, 3 * a + 2, this.canvas.width - 4 * r - 4, this.canvas.height - 6 * a - 4), this.context.fillStyle = "white", this.context.fontSize = 20, this.context.fillText(this.canvas.width + " x " + this.canvas.height, this.canvas.width / 2, this.canvas.height / 2 + .75 * l), this.context.fillText("display size", this.canvas.width / 2, this.canvas.height / 2 - .75 * l)
                    }
                }
            }
        }, {
            key: "updateTransform",
            value: function() {
                for (var t = ["", "-webkit-", "-moz-", "-ms-", "-o-"].reduce(function(t, e) {
                        return e + "transform" in document.body.style ? e : t
                    }) + "transform", e = 0; e < this.layers.length; e++) {
                    for (var s = [], i = [], n = 0, o = this.layers[e].sourcePoints.length; n < o; ++n) {
                        var r = this.layers[e].sourcePoints[n],
                            a = this.layers[e].targetPoints[n];
                        s.push([r[0], r[1], 1, 0, 0, 0, -r[0] * a[0], -r[1] * a[0]]), i.push(a[0]), s.push([0, 0, 0, r[0], r[1], 1, -r[0] * a[1], -r[1] * a[1]]), i.push(a[1])
                    }
                    var h = l(s, i, !0);
                    this.layers[e].element.style[t] = "matrix3d(" + [h[0], h[3], 0, h[6], h[1], h[4], 0, h[7], 0, 0, 1, 0, h[2], h[5], 0, 1].join(",") + ")", this.layers[e].element.style[t + "-origin"] = "0px 0px 0px"
                }
            }
        }, {
            key: "keyDown",
            value: function(t) {
                if (!this.configActive) return 32 == t.keyCode && t.shiftKey ? void this.setConfigEnabled(!0) : void 0;
                var e = t.shiftKey ? 10 : 1,
                    s = !1,
                    i = [0, 0];
                switch (t.keyCode) {
                    case 32:
                        if (t.shiftKey) return void this.setConfigEnabled(!1);
                        break;
                    case 37:
                        i[0] -= e;
                        break;
                    case 38:
                        i[1] -= e;
                        break;
                    case 39:
                        i[0] += e;
                        break;
                    case 40:
                        i[1] += e;
                        break;
                    case 67:
                        this.showCrosshairs = !this.showCrosshairs, s = !0;
                        break;
                    case 83:
                        if (this.isLayerSoloed) {
                            for (var n = 0; n < this.layers.length; n++) this.layers[n].visible = !0;
                            s = !(this.isLayerSoloed = !1)
                        } else if (null != this.selectedLayer) {
                            for (var o = 0; o < this.layers.length; o++) this.layers[o].visible = !1;
                            this.selectedLayer.visible = !0, this.isLayerSoloed = s = !0
                        }
                        break;
                    case 66:
                        this.showScreenBounds = !this.showScreenBounds, this.draw();
                        break;
                    case 72:
                        this.selectedLayer && (c(this.selectedLayer.sourcePoints, 0, 1), c(this.selectedLayer.sourcePoints, 3, 2), this.updateTransform(), this.draw());
                        break;
                    case 86:
                        this.selectedLayer && (c(this.selectedLayer.sourcePoints, 0, 3), c(this.selectedLayer.sourcePoints, 1, 2), this.updateTransform(), this.draw());
                        break;
                    case 82:
                        this.selectedLayer && (p(this.selectedLayer, Math.PI / 2), this.updateTransform(), this.draw())
                }
                if (!this.showScreenBounds)
                    if (this.selectedPoint) this.selectedPoint[0] += i[0], this.selectedPoint[1] += i[1], s = !0;
                    else if (this.selectedLayer) {
                    if (1 == t.altKey) p(this.selectedLayer, .01 * i[0]), w(this.selectedLayer, -.005 * i[1] + 1);
                    else
                        for (var r = 0; r < this.selectedLayer.targetPoints.length; r++) this.selectedLayer.targetPoints[r][0] += i[0], this.selectedLayer.targetPoints[r][1] += i[1];
                    s = !0
                }
                s && (this.updateTransform(), this.draw(), this.autoSave && this.saveSettings(), this.notifyChangeListener())
            }
        }, {
            key: "mouseMove",
            value: function(t) {
                var e, s, i, n;
                if (this.configActive)
                    if (t.preventDefault(), this.mouseDelta[0] = t.clientX - this.mousePosition[0], this.mouseDelta[1] = t.clientY - this.mousePosition[1], this.mousePosition[0] = t.clientX, this.mousePosition[1] = t.clientY, this.dragging) {
                        var o = t.shiftKey ? .1 : 1;
                        if (this.selectedPoint) this.selectedPoint[0] += this.mouseDelta[0] * o, this.selectedPoint[1] += this.mouseDelta[1] * o;
                        else if (this.selectedLayer)
                            if (1 == t.altKey) p(this.selectedLayer, this.mouseDelta[0] * (.01 * o)), w(this.selectedLayer, this.mouseDelta[1] * (-.005 * o) + 1);
                            else
                                for (var r = 0; r < this.selectedLayer.targetPoints.length; r++) this.selectedLayer.targetPoints[r][0] += this.mouseDelta[0] * o, this.selectedLayer.targetPoints[r][1] += this.mouseDelta[1] * o;
                        this.updateTransform(), this.autoSave && this.saveSettings(), this.draw(), this.notifyChangeListener()
                    } else {
                        this.canvas.style.cursor = "default";
                        var a = t.clientX,
                            h = t.clientY,
                            l = null != this.hoveringPoint,
                            c = null != this.hoveringLayer;
                        this.hoveringPoint = null;
                        for (var u = 0; u < this.layers.length; u++) {
                            var y = this.layers[u];
                            if (y.visible)
                                for (var f = 0; f < y.targetPoints.length; f++) {
                                    var g = y.targetPoints[f];
                                    if (P(g[0], g[1], a, h) < this.selectionRadius) {
                                        this.canvas.style.cursor = "pointer", this.hoveringPoint = g;
                                        break
                                    }
                                }
                        }
                        this.hoveringLayer = null;
                        for (var d = 0; d < this.layers.length; d++)
                            if (this.layers[d].visible && (void 0, i = m(e = this.mousePosition, (s = this.layers[d]).targetPoints[0], s.targetPoints[1], s.targetPoints[2]), n = m(e, s.targetPoints[3], s.targetPoints[0], s.targetPoints[2]), i || n)) {
                                this.hoveringLayer = this.layers[d];
                                break
                            }!this.showCrosshairs && l == (null != this.hoveringPoint) && c == (null != this.hoveringLayer) || this.draw()
                    }
            }
        }, {
            key: "mouseUp",
            value: function(t) {
                this.configActive && (t.preventDefault(), this.dragging = !1)
            }
        }, {
            key: "mouseDown",
            value: function(t) {
                if (this.configActive && !this.showScreenBounds) {
                    t.preventDefault(), this.hoveringPoint = null, this.hoveringLayer ? (this.selectedLayer = this.hoveringLayer, this.dragging = !0) : this.selectedLayer = null, this.selectedPoint = null;
                    var e = t.clientX,
                        s = t.clientY;
                    this.mouseDownPoint[0] = e, this.mouseDownPoint[1] = s;
                    for (var i = 0; i < this.layers.length; i++)
                        for (var n = this.layers[i], o = 0; o < n.targetPoints.length; o++) {
                            var r = n.targetPoints[o];
                            if (P(r[0], r[1], e, s) < this.selectionRadius) {
                                this.selectedLayer = n, this.selectedPoint = r, this.dragging = !0, this.dragOffset[0] = t.clientX - r[0], this.dragOffset[1] = t.clientY - r[1];
                                break
                            }
                        }
                    return this.draw(), !1
                }
            }
        }, {
            key: "addLayer",
            value: function(t, e) {
                var s;
                if ("string" == typeof t) {
                    if (!(s = document.getElementById(t))) throw new Error("Maptastic: No element found with id: " + t)
                } else t instanceof HTMLElement && (s = t);
                for (var i = 0; i < this.layers.length; i++) this.layers[i].element.id == s.id && (this.layers[i].targetPoints = u(layout[a].targetPoints));
                var n = s.offsetLeft,
                    o = s.offsetTop;
                s.style.position = "fixed", s.style.display = "block", s.style.top = "0px", s.style.left = "0px", s.style.padding = "0px", s.style.margin = "0px";
                var r = {
                    visible: !0,
                    element: s,
                    width: s.clientWidth,
                    height: s.clientHeight,
                    sourcePoints: [],
                    targetPoints: []
                };
                if (r.sourcePoints.push([0, 0], [r.width, 0], [r.width, r.height], [0, r.height]), e) r.targetPoints = u(e);
                else {
                    r.targetPoints.push([0, 0], [r.width, 0], [r.width, r.height], [0, r.height]);
                    for (var a = 0; a < r.targetPoints.length; a++) r.targetPoints[a][0] += n, r.targetPoints[a][1] += o
                }
                this.layers.push(r), this.updateTransform()
            }
        }, {
            key: "saveSettings",
            value: function() {
                localStorage.setItem(this.localStorageKey, JSON.stringify(this.getLayout()))
            }
        }, {
            key: "loadSettings",
            value: function() {
                if (localStorage.getItem(this.localStorageKey)) {
                    for (var t = JSON.parse(localStorage.getItem(this.localStorageKey)), e = 0; e < t.length; e++)
                        for (var s = 0; s < this.layers.length; s++) this.layers[s].element.id == t[e].id && (this.layers[s].targetPoints = u(t[e].targetPoints), this.layers[s].sourcePoints = u(t[e].sourcePoints));
                    this.updateTransform()
                }
            }
        }, {
            key: "setConfigEnabled",
            value: function(t) {
                this.configActive = t, this.canvas.style.display = t ? "block" : "none", t ? this.draw() : (this.selectedPoint = null, this.selectedLayer = null, this.dragging = !1, this.showScreenBounds = !1)
            }
        }, {
            key: "getLayout",
            value: function() {
                for (var t = [], e = 0; e < this.layers.length; e++) t.push({
                    id: this.layers[e].element.id,
                    targetPoints: u(this.layers[e].targetPoints),
                    sourcePoints: u(this.layers[e].sourcePoints)
                });
                return t
            }
        }, {
            key: "setLayout",
            value: function(t) {
                for (var e = 0; e < t.length; e++) {
                    for (var s = !1, i = 0; i < this.layers.length; i++) this.layers[i].element.id == t[e].id && (console.log("Setting points."), this.layers[i].targetPoints = u(t[e].targetPoints), this.layers[i].sourcePoints = u(t[e].sourcePoints), s = !0);
                    if (s) console.log("Maptastic: Element '" + t[e].id + "' is already mapped.");
                    else {
                        var n = document.getElementById(t[e].id);
                        n ? this.addLayer(n, t[e].targetPoints) : console.log("Maptastic: Can't find element: " + t[e].id)
                    }
                }
                this.updateTransform(), this.draw()
            }
        }]) && i(t.prototype, e), s && i(t, s), a
    }(), Object.defineProperty(t, "__esModule", {
        value: !0
    })
});
//# sourceMappingURL=maptastic.js.map