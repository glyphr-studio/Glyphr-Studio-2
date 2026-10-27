/*!
* Font Flux JS v2.9.1
* Copyright (c) 2026 Matt LaGrandeur
* Licensed under GPL-3.0-only. See LICENSE for details.
*/
//#region src/color.js
function e(e) {
	if (typeof e != "string" || e[0] !== "#") throw Error(`Invalid hex color: ${e}`);
	let t, n, r, i, a = e.slice(1);
	if (a.length === 3) t = parseInt(a[0] + a[0], 16), n = parseInt(a[1] + a[1], 16), r = parseInt(a[2] + a[2], 16), i = 255;
	else if (a.length === 4) t = parseInt(a[0] + a[0], 16), n = parseInt(a[1] + a[1], 16), r = parseInt(a[2] + a[2], 16), i = parseInt(a[3] + a[3], 16);
	else if (a.length === 6) t = parseInt(a.slice(0, 2), 16), n = parseInt(a.slice(2, 4), 16), r = parseInt(a.slice(4, 6), 16), i = 255;
	else if (a.length === 8) t = parseInt(a.slice(0, 2), 16), n = parseInt(a.slice(2, 4), 16), r = parseInt(a.slice(4, 6), 16), i = parseInt(a.slice(6, 8), 16);
	else throw Error(`Invalid hex color length: ${e}`);
	if ([
		t,
		n,
		r,
		i
	].some((e) => isNaN(e))) throw Error(`Invalid hex color: ${e}`);
	return {
		blue: r,
		green: n,
		red: t,
		alpha: i
	};
}
function t(e) {
	let t = (e.red & 255).toString(16).padStart(2, "0"), n = (e.green & 255).toString(16).padStart(2, "0"), r = (e.blue & 255).toString(16).padStart(2, "0");
	return e.alpha === 255 || e.alpha === void 0 ? `#${t}${n}${r}` : `#${t}${n}${r}${(e.alpha & 255).toString(16).padStart(2, "0")}`;
}
function n(n) {
	if (!Array.isArray(n)) throw Error("Palette must be an array of colors");
	return n.map((n) => {
		if (typeof n == "string") return e(n), r(n);
		if (n && typeof n == "object" && "red" in n) return t(n);
		throw Error(`Invalid palette color: ${n}`);
	});
}
function r(n) {
	return t(e(n));
}
function i(e) {
	if (!e || typeof e != "object") throw Error("createColorGlyph: input object is required");
	if (!e.name) throw Error("createColorGlyph: name is required");
	if (!e.layers && !e.paint) throw Error("createColorGlyph: either layers (v0) or paint (v1) is required");
	let t = { name: e.name };
	if (e.layers) {
		if (!Array.isArray(e.layers) || e.layers.length === 0) throw Error("createColorGlyph: layers must be a non-empty array");
		t.layers = e.layers.map((e) => {
			if (!e.glyph) throw Error("createColorGlyph: each layer needs a glyph name");
			if (e.paletteIndex == null) throw Error("createColorGlyph: each layer needs a paletteIndex");
			return {
				glyph: e.glyph,
				paletteIndex: e.paletteIndex
			};
		});
	} else t.paint = e.paint;
	return t;
}
function a(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n = 0; n < e.length; n++) t.set(n, e[n].name);
	return t;
}
function o(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n = 0; n < e.length; n++) e[n].name && t.set(e[n].name, n);
	return t;
}
function s(e, t) {
	!e || typeof e != "object" || (e.glyphID !== void 0 && typeof e.glyphID == "number" && (e.glyphID = t.get(e.glyphID) ?? e.glyphID), e.paint && s(e.paint, t), e.sourcePaint && s(e.sourcePaint, t), e.backdropPaint && s(e.backdropPaint, t));
}
function c(e, t) {
	if (!(!e || typeof e != "object")) {
		if (e.glyphID !== void 0 && typeof e.glyphID == "string") {
			let n = t.get(e.glyphID);
			n !== void 0 && (e.glyphID = n);
		}
		e.paint && c(e.paint, t), e.sourcePaint && c(e.sourcePaint, t), e.backdropPaint && c(e.backdropPaint, t);
	}
}
//#endregion
//#region src/otf/charstring_compiler.js
function l(e) {
	if (!Number.isInteger(e) || e < -32768 || e > 32767) return u(e);
	if (e >= -107 && e <= 107) return [e + 139];
	if (e >= 108 && e <= 1131) {
		let t = e - 108;
		return [(t >> 8 & 255) + 247, t & 255];
	}
	if (e >= -1131 && e <= -108) {
		let t = -e - 108;
		return [(t >> 8 & 255) + 251, t & 255];
	}
	let t = e < 0 ? e + 65536 : e;
	return [
		28,
		t >> 8 & 255,
		t & 255
	];
}
function u(e) {
	let t = Math.round(e * 65536), n = t < 0 ? t + 4294967296 : t;
	return [
		255,
		n >> 24 & 255,
		n >> 16 & 255,
		n >> 8 & 255,
		n & 255
	];
}
function d(e, t) {
	let n = Number.isFinite(t) ? l(t) : [];
	if (!e || e.length === 0) return [
		...n,
		...l(0),
		...l(0),
		21,
		14
	];
	let r = [...n], i = 0, a = 0;
	for (let t of e) if (!(!t || t.length === 0)) for (let e of t) switch (e.type) {
		case "M": {
			let t = e.x - i, n = e.y - a;
			t === 0 && n !== 0 ? r.push(...l(n), 4) : n === 0 && t !== 0 ? r.push(...l(t), 22) : r.push(...l(t), ...l(n), 21), i = e.x, a = e.y;
			break;
		}
		case "L": {
			let t = e.x - i, n = e.y - a;
			t === 0 && n !== 0 ? r.push(...l(n), 7) : n === 0 && t !== 0 ? r.push(...l(t), 6) : r.push(...l(t), ...l(n), 5), i = e.x, a = e.y;
			break;
		}
		case "C": {
			let t = e.x1 - i, n = e.y1 - a, o = e.x2 - e.x1, s = e.y2 - e.y1, c = e.x - e.x2, u = e.y - e.y2;
			r.push(...l(t), ...l(n), ...l(o), ...l(s), ...l(c), ...l(u), 8), i = e.x, a = e.y;
			break;
		}
	}
	return r.push(14), r;
}
var f = {
	hstem: [1],
	vstem: [3],
	vmoveto: [4],
	rlineto: [5],
	hlineto: [6],
	vlineto: [7],
	rrcurveto: [8],
	callsubr: [10],
	return: [11],
	endchar: [14],
	hstemhm: [18],
	hintmask: [19],
	cntrmask: [20],
	rmoveto: [21],
	hmoveto: [22],
	vstemhm: [23],
	rcurveline: [24],
	rlinecurve: [25],
	vvcurveto: [26],
	hhcurveto: [27],
	callgsubr: [29],
	vhcurveto: [30],
	hvcurveto: [31],
	dotsection: [12, 0],
	and: [12, 3],
	or: [12, 4],
	not: [12, 5],
	abs: [12, 9],
	add: [12, 10],
	sub: [12, 11],
	div: [12, 12],
	neg: [12, 14],
	eq: [12, 15],
	drop: [12, 18],
	put: [12, 20],
	get: [12, 21],
	ifelse: [12, 22],
	random: [12, 23],
	mul: [12, 24],
	sqrt: [12, 26],
	dup: [12, 27],
	exch: [12, 28],
	index: [12, 29],
	roll: [12, 30],
	hflex: [12, 34],
	flex: [12, 35],
	hflex1: [12, 36],
	flex1: [12, 37]
};
function p(e) {
	let t = [], n = e.split("\n").filter((e) => e.trim().length > 0);
	for (let e of n) {
		let n = e.trim().split(/\s+/);
		if (n.length === 0) continue;
		let r = -1, i = null;
		for (let e = 0; e < n.length; e++) {
			let t = n[e].toLowerCase();
			if (f[t] || t.startsWith("op")) {
				r = e, i = t;
				break;
			}
		}
		if (r === -1) {
			for (let e of n) t.push(...l(parseFloat(e)));
			continue;
		}
		for (let e = 0; e < r; e++) t.push(...l(parseFloat(n[e])));
		if (i.startsWith("op12.")) {
			let e = parseInt(i.slice(5), 10);
			t.push(12, e);
		} else i.startsWith("op") ? t.push(parseInt(i.slice(2), 10)) : t.push(...f[i]);
		if (i === "hintmask" || i === "cntrmask") {
			let e = n.slice(r + 1).join("");
			if (e.length > 0) for (let n = 0; n < e.length; n += 8) {
				let r = e.slice(n, n + 8).padEnd(8, "0");
				t.push(parseInt(r, 2));
			}
		}
	}
	return t;
}
//#endregion
//#region src/svg_path.js
function m(e) {
	if (!e || e.length === 0) return "";
	let t = [];
	for (let n of e) !n || n.length === 0 || (n[0].type ? t.push(h(n)) : t.push(g(n)));
	return t.join(" ");
}
function h(e) {
	let t = [];
	for (let n of e) switch (n.type) {
		case "M":
			t.push(`M${S(n.x)} ${S(n.y)}`);
			break;
		case "L":
			t.push(`L${S(n.x)} ${S(n.y)}`);
			break;
		case "C": t.push(`C${S(n.x1)} ${S(n.y1)} ${S(n.x2)} ${S(n.y2)} ${S(n.x)} ${S(n.y)}`);
	}
	return t.push("Z"), t.join(" ");
}
function g(e) {
	if (e.length === 0) return "";
	let t = [], n = e.length, r = 0;
	for (let t = 0; t < n; t++) if (e[t].onCurve) {
		r = t;
		break;
	}
	let i = e[r];
	t.push(`M${S(i.x)} ${S(i.y)}`);
	let a = 1;
	for (; a < n;) {
		let i = e[(r + a) % n];
		if (i.onCurve) t.push(`L${S(i.x)} ${S(i.y)}`), a++;
		else {
			let o = e[(r + a + 1) % n];
			if (o.onCurve) t.push(`Q${S(i.x)} ${S(i.y)} ${S(o.x)} ${S(o.y)}`), a += 2;
			else {
				let e = (i.x + o.x) / 2, n = (i.y + o.y) / 2;
				t.push(`Q${S(i.x)} ${S(i.y)} ${S(e)} ${S(n)}`), a++;
			}
		}
	}
	let o = e[(r + n - 1) % n];
	return o.onCurve || t.push(`Q${S(o.x)} ${S(o.y)} ${S(i.x)} ${S(i.y)}`), t.push("Z"), t.join(" ");
}
function _(e, t = "cff") {
	let n = b(e);
	if (n.length === 0) return [];
	let r = [], i = null, a = () => {
		i && i.some((e) => e.op !== "M") && r.push(i), i = null;
	};
	for (let e of n) e.op === "M" ? (a(), i = [e]) : e.op === "Z" ? a() : i && i.push(e);
	return a(), t === "truetype" ? r.map((e) => y(e)) : r.map((e) => v(e));
}
function v(e) {
	let t = [];
	for (let n of e) switch (n.op) {
		case "M":
			t.push({
				type: "M",
				x: n.x,
				y: n.y
			});
			break;
		case "L":
			t.push({
				type: "L",
				x: n.x,
				y: n.y
			});
			break;
		case "C":
			t.push({
				type: "C",
				x1: n.x1,
				y1: n.y1,
				x2: n.x2,
				y2: n.y2,
				x: n.x,
				y: n.y
			});
			break;
		case "Q": {
			let e = t[t.length - 1], r = e ? e.x : 0, i = e ? e.y : 0, a = r + 2 / 3 * (n.x1 - r), o = i + 2 / 3 * (n.y1 - i), s = n.x + 2 / 3 * (n.x1 - n.x), c = n.y + 2 / 3 * (n.y1 - n.y);
			t.push({
				type: "C",
				x1: a,
				y1: o,
				x2: s,
				y2: c,
				x: n.x,
				y: n.y
			});
			break;
		}
	}
	return t;
}
function y(e) {
	let t = [];
	for (let n of e) switch (n.op) {
		case "M":
			t.push({
				x: n.x,
				y: n.y,
				onCurve: !0
			});
			break;
		case "L":
			t.push({
				x: n.x,
				y: n.y,
				onCurve: !0
			});
			break;
		case "Q":
			t.push({
				x: n.x1,
				y: n.y1,
				onCurve: !1
			}), t.push({
				x: n.x,
				y: n.y,
				onCurve: !0
			});
			break;
		case "C": {
			let e = t[t.length - 1], r = x(e ? e.x : 0, e ? e.y : 0, n.x1, n.y1, n.x2, n.y2, n.x, n.y);
			for (let e of r) t.push({
				x: e.cx,
				y: e.cy,
				onCurve: !1
			}), t.push({
				x: e.x,
				y: e.y,
				onCurve: !0
			});
			break;
		}
	}
	return t;
}
function b(e) {
	let t = [], n = e.match(/[MmLlHhVvCcSsQqTtZz]|[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?/g);
	if (!n) return t;
	let r = 0, i = 0, a = 0, o = 0, s = "", c = 0, l = 0, u = 0;
	function d() {
		return parseFloat(n[u++]);
	}
	for (; u < n.length;) {
		let e = n[u];
		/[A-Za-z]/.test(e) ? u++ : e = s;
		let f = e === e.toLowerCase();
		switch (e.toUpperCase()) {
			case "M": {
				let e = d(), n = d();
				f && (e += r, n += i), t.push({
					op: "M",
					x: e,
					y: n
				}), r = a = e, i = o = n, s = f ? "l" : "L";
				break;
			}
			case "L": {
				let n = d(), a = d();
				f && (n += r, a += i), t.push({
					op: "L",
					x: n,
					y: a
				}), r = n, i = a, s = e;
				break;
			}
			case "H": {
				let n = d();
				f && (n += r), t.push({
					op: "L",
					x: n,
					y: i
				}), r = n, s = e;
				break;
			}
			case "V": {
				let n = d();
				f && (n += i), t.push({
					op: "L",
					x: r,
					y: n
				}), i = n, s = e;
				break;
			}
			case "C": {
				let n = d(), a = d(), o = d(), u = d(), p = d(), m = d();
				f && (n += r, a += i, o += r, u += i, p += r, m += i), t.push({
					op: "C",
					x1: n,
					y1: a,
					x2: o,
					y2: u,
					x: p,
					y: m
				}), c = o, l = u, r = p, i = m, s = e;
				break;
			}
			case "S": {
				let n = 2 * r - c, a = 2 * i - l;
				s.toUpperCase() !== "C" && s.toUpperCase() !== "S" && (n = r, a = i);
				let o = d(), u = d(), p = d(), m = d();
				f && (o += r, u += i, p += r, m += i), t.push({
					op: "C",
					x1: n,
					y1: a,
					x2: o,
					y2: u,
					x: p,
					y: m
				}), c = o, l = u, r = p, i = m, s = e;
				break;
			}
			case "Q": {
				let n = d(), a = d(), o = d(), u = d();
				f && (n += r, a += i, o += r, u += i), t.push({
					op: "Q",
					x1: n,
					y1: a,
					x: o,
					y: u
				}), c = n, l = a, r = o, i = u, s = e;
				break;
			}
			case "T": {
				let n = 2 * r - c, a = 2 * i - l;
				s.toUpperCase() !== "Q" && s.toUpperCase() !== "T" && (n = r, a = i);
				let o = d(), u = d();
				f && (o += r, u += i), t.push({
					op: "Q",
					x1: n,
					y1: a,
					x: o,
					y: u
				}), c = n, l = a, r = o, i = u, s = e;
				break;
			}
			case "Z":
				t.push({ op: "Z" }), r = a, i = o, s = e;
				break;
			default: s = e;
		}
	}
	return t;
}
function x(e, t, n, r, i, a, o, s, c = 0) {
	let l = (3 * (n + i) - e - o) / 4, u = (3 * (r + a) - t - s) / 4, d = e + 2 / 3 * (l - e), f = t + 2 / 3 * (u - t), p = o + 2 / 3 * (l - o), m = s + 2 / 3 * (u - s), h = Math.hypot(n - d, r - f), g = Math.hypot(i - p, a - m);
	if (Math.max(h, g) <= .5 || c >= 8) return [{
		cx: l,
		cy: u,
		x: o,
		y: s
	}];
	let _ = (e + n) / 2, v = (t + r) / 2, y = (n + i) / 2, b = (r + a) / 2, S = (i + o) / 2, C = (a + s) / 2, w = (_ + y) / 2, T = (v + b) / 2, E = (y + S) / 2, D = (b + C) / 2, O = (w + E) / 2, k = (T + D) / 2, ee = x(e, t, _, v, w, T, O, k, c + 1), te = x(O, k, E, D, S, C, o, s, c + 1);
	return ee.concat(te);
}
function S(e) {
	let t = Math.round(e * 100) / 100;
	return t === Math.floor(t) ? String(t) : t.toFixed(2).replace(/0+$/, "");
}
//#endregion
//#region src/glyph.js
function C(e) {
	if (!e || typeof e != "object") throw Error("createGlyph: options object is required");
	let { name: t, unicode: n, unicodes: r, advanceWidth: i, leftSideBearing: a, advanceHeight: o, topSideBearing: s, path: c, contours: l, charString: u, components: f, instructions: p, format: m = "truetype" } = e;
	if (t == null) throw Error("createGlyph: name is required");
	if (i == null) throw Error("createGlyph: advanceWidth is required");
	let h = {
		name: t,
		advanceWidth: i
	};
	if (r && r.length > 0 ? h.unicodes = r : n != null && (h.unicode = n), a !== void 0 && (h.leftSideBearing = a), o !== void 0 && (h.advanceHeight = o), s !== void 0 && (h.topSideBearing = s), p && (h.instructions = p), u) h.charString = u;
	else if (c) {
		let e = _(c, m);
		h.contours = e, m === "cff" && (h.charString = d(e));
	} else l ? (h.contours = l, l.length > 0 && l[0] && l[0].length > 0 && l[0][0].type && (h.charString = d(l))) : f && (h.components = f);
	return h;
}
function w(e, t) {
	let n = e?.glyphs;
	if (!n || !Array.isArray(n)) return;
	let r = E(t);
	if (r !== void 0) return D(n, r);
	if (typeof t == "string") return n.find((e) => e.name === t);
}
function T(e, t) {
	let n = E(t);
	if (n !== void 0) return D(e, n)?.name;
	if (typeof t == "string") return t;
}
function E(e) {
	if (typeof e == "number") return e;
	if (typeof e == "string") {
		let t = e.match(/^(?:U\+|0x)([0-9A-Fa-f]+)$/i);
		if (t) return parseInt(t[1], 16);
	}
}
function D(e, t) {
	for (let n of e) if (n.unicode === t || n.unicodes && n.unicodes.includes(t) || n.codePoint === t) return n;
}
function O(e) {
	let t = e.transform;
	if (t) {
		if ("scale" in t || "xScale" in t) return t;
		if ("xx" in t || "xy" in t || "yx" in t || "yy" in t) return {
			xScale: t.xx ?? 1,
			scale01: t.xy ?? 0,
			scale10: t.yx ?? 0,
			yScale: t.yy ?? 1
		};
	}
	return typeof e.scale == "number" ? { scale: e.scale } : e.scaleXY && typeof e.scaleXY == "object" ? {
		xScale: e.scaleXY.x ?? 1,
		yScale: e.scaleXY.y ?? 1
	} : null;
}
function k(e, t) {
	let n = e.glyphIndex;
	if (e.glyphName != null) {
		let r = t ? t.get(e.glyphName) : void 0;
		if (r === void 0) throw Error(`Composite component references unknown glyph name "${e.glyphName}". Add that glyph to the font before exporting, or use glyphIndex.`);
		n = r;
	}
	let r = e.flags && e.argument1 !== void 0 && e.argument2 !== void 0, i, a, o;
	r ? (i = { ...e.flags }, a = e.argument1, o = e.argument2) : (i = {
		...e.flags || {},
		argsAreXYValues: !0
	}, a = e.argument1 ?? e.dx ?? 0, o = e.argument2 ?? e.dy ?? 0), e.useMyMetrics && (i.useMyMetrics = !0);
	let s = {
		glyphIndex: n,
		flags: i,
		argument1: a,
		argument2: o
	}, c = O(e);
	return c && (s.transform = c), s;
}
function ee(e) {
	let t = 1, n = 0, r = 0, i = 1, a = O(e);
	a && (typeof a.scale == "number" ? (t = a.scale, i = a.scale) : (typeof a.xScale == "number" && (t = a.xScale), typeof a.yScale == "number" && (i = a.yScale), typeof a.scale01 == "number" && (n = a.scale01), typeof a.scale10 == "number" && (r = a.scale10)));
	let o = 0, s = 0;
	return e.flags?.argsAreXYValues ? (o = e.argument1 || 0, s = e.argument2 || 0) : e.flags ?? (o = e.argument1 ?? e.dx ?? 0, s = e.argument2 ?? e.dy ?? 0), {
		a: t,
		b: n,
		c: r,
		d: i,
		dx: o,
		dy: s
	};
}
function te(e, t, n = 0) {
	if (!t) return [];
	if (!t.components || t.components.length === 0) return Array.isArray(t.contours) ? t.contours.map((e) => e.slice()) : [];
	if (n > 64 || !Array.isArray(e)) throw Error("Composite cycle or excessive component depth.");
	let r = [];
	for (let i of t.components) {
		let t = e[i.glyphIndex];
		if (!t && i.glyphName != null && (t = e.find((e) => e && e.name === i.glyphName)), !t) throw Error("Composite references an unknown glyph.");
		let a = te(e, t, n + 1);
		if (a.length === 0) continue;
		let { a: o, b: s, c, d: l } = ee(i), { dx: u, dy: d } = ee(i);
		if (i.flags?.argsAreXYValues === !1) {
			let e = r.flat()[i.argument1], t = a.flat()[i.argument2];
			if (!e || !t) throw Error("Composite point attachment references an unknown point.");
			u = e.x - (o * t.x + c * t.y), d = e.y - (s * t.x + l * t.y);
		} else i.flags?.scaledComponentOffset && ([u, d] = [o * u + c * d, s * u + l * d]);
		i.flags?.roundXYToGrid && (u = Math.round(u), d = Math.round(d));
		let f = o === 1 && s === 0 && c === 0 && l === 1;
		for (let e of a) r.push(e.map((e) => ({
			x: f ? e.x + u : Math.round(o * e.x + c * e.y + u),
			y: f ? e.y + d : Math.round(s * e.x + l * e.y + d),
			onCurve: e.onCurve
		})));
	}
	return r;
}
//#endregion
//#region src/otf/cff_common.js
function ne(e, t, n = !0) {
	let r = e[t];
	if (r >= 32 && r <= 246) return {
		value: r - 139,
		bytesConsumed: 1
	};
	if (r >= 247 && r <= 250) {
		let n = e[t + 1];
		return {
			value: (r - 247) * 256 + n + 108,
			bytesConsumed: 2
		};
	}
	if (r >= 251 && r <= 254) {
		let n = e[t + 1];
		return {
			value: -(r - 251) * 256 - n - 108,
			bytesConsumed: 2
		};
	}
	if (r === 28) {
		let n = e[t + 1] << 8 | e[t + 2];
		return {
			value: n > 32767 ? n - 65536 : n,
			bytesConsumed: 3
		};
	}
	return r === 29 && n ? {
		value: e[t + 1] << 24 | e[t + 2] << 16 | e[t + 3] << 8 | e[t + 4] | 0,
		bytesConsumed: 5
	} : r === 30 && n ? re(e, t + 1) : r === 255 && !n ? {
		value: (e[t + 1] << 24 | e[t + 2] << 16 | e[t + 3] << 8 | e[t + 4] | 0) / 65536,
		bytesConsumed: 5
	} : null;
}
function re(e, t) {
	let n = [
		"0",
		"1",
		"2",
		"3",
		"4",
		"5",
		"6",
		"7",
		"8",
		"9",
		".",
		"E",
		"E-",
		"",
		"-",
		""
	], r = "", i = t, a = !1;
	for (; !a;) {
		let t = e[i++], o = t >> 4 & 15, s = t & 15;
		o === 15 ? a = !0 : (r += n[o], s === 15 ? a = !0 : r += n[s]);
	}
	return {
		value: r === "" || r === "." ? 0 : parseFloat(r),
		bytesConsumed: 1 + (i - t)
	};
}
function A(e) {
	return Number.isInteger(e) ? ie(e) : ae(e);
}
function ie(e) {
	if (e >= -107 && e <= 107) return [e + 139];
	if (e >= 108 && e <= 1131) {
		let t = e - 108;
		return [247 + (t >> 8 & 3), t & 255];
	}
	if (e >= -1131 && e <= -108) {
		let t = -e - 108;
		return [251 + (t >> 8 & 3), t & 255];
	}
	return e >= -32768 && e <= 32767 ? [
		28,
		e >> 8 & 255,
		e & 255
	] : [
		29,
		e >> 24 & 255,
		e >> 16 & 255,
		e >> 8 & 255,
		e & 255
	];
}
function ae(e) {
	let t = [30], n = e.toString();
	(n.includes("e") || n.includes("E")) && (n = e.toPrecision(10), n.includes(".") && (n = n.replace(/0+$/, "").replace(/\.$/, "")));
	let r = [];
	for (let e of n) switch (e) {
		case "0":
			r.push(0);
			break;
		case "1":
			r.push(1);
			break;
		case "2":
			r.push(2);
			break;
		case "3":
			r.push(3);
			break;
		case "4":
			r.push(4);
			break;
		case "5":
			r.push(5);
			break;
		case "6":
			r.push(6);
			break;
		case "7":
			r.push(7);
			break;
		case "8":
			r.push(8);
			break;
		case "9":
			r.push(9);
			break;
		case ".":
			r.push(10);
			break;
		case "E":
		case "e":
			r.push(11);
			break;
		case "-": r.push(14);
	}
	for (let e = 0; e < r.length - 1; e++) r[e] === 11 && r[e + 1] === 14 && r.splice(e, 2, 12);
	r.push(15);
	for (let e = 0; e < r.length; e += 2) {
		let n = r[e], i = e + 1 < r.length ? r[e + 1] : 15;
		t.push(n << 4 | i);
	}
	return t;
}
function oe(e) {
	return e <= 27;
}
function j(e, t = 0, n = e.length) {
	let r = [], i = [], a = t;
	for (; a < n;) {
		let t = e[a];
		if (oe(t)) {
			let n;
			t === 12 ? (n = 3072 | e[a + 1], a += 2) : (n = t, a += 1), r.push({
				operator: n,
				operands: [...i]
			}), i.length = 0;
		} else {
			let t = ne(e, a, !0);
			t === null ? a += 1 : (i.push(t.value), a += t.bytesConsumed);
		}
	}
	return r;
}
function se(e, t) {
	return le(e, t, 2);
}
function ce(e, t) {
	return le(e, t, 4);
}
function le(e, t, n) {
	if (!Number.isInteger(t) || t < 0 || t + n > e.length) throw RangeError("CFF INDEX count is outside the input");
	let r = 0;
	for (let i = t; i < t + n; i++) r = r * 256 + e[i];
	if (r === 0) return {
		items: [],
		totalBytes: n
	};
	let i = e[t + n];
	if (!Number.isInteger(i) || i < 1 || i > 4) throw RangeError("CFF INDEX offSize must be between 1 and 4");
	let a = t + n + 1, o = a + (r + 1) * i;
	if (!Number.isInteger(r) || r < 0 || o > e.length) throw RangeError("CFF INDEX offset array exceeds the input");
	let s = [], c = 1;
	for (let t = 0; t <= r; t++) {
		let n = 0, r = a + t * i;
		for (let t = 0; t < i; t++) n = n * 256 + e[r + t];
		if (!Number.isInteger(n) || t === 0 && n !== 1 || n < c || n > e.length - o + 1) throw RangeError("CFF INDEX offsets must be ordered, 1-based, and within the input");
		s.push(n), c = n;
	}
	let l = [];
	for (let t = 0; t < r; t++) {
		let n = o + s[t] - 1, r = o + s[t + 1] - 1;
		l.push(new Uint8Array(Array.prototype.slice.call(e, n, r)));
	}
	return {
		items: l,
		totalBytes: o + s[r] - 1 - t
	};
}
function ue(e) {
	let t = e.length;
	if (t === 0) return [0, 0];
	let n = [1];
	for (let t of e) n.push(n[n.length - 1] + t.length);
	let r = n[n.length - 1], i;
	i = r <= 255 ? 1 : r <= 65535 ? 2 : r <= 16777215 ? 3 : 4;
	let a = [];
	a.push(t >> 8 & 255, t & 255), a.push(i);
	for (let e of n) for (let t = i - 1; t >= 0; t--) a.push(e >> t * 8 & 255);
	for (let t of e) for (let e = 0; e < t.length; e++) a.push(t[e]);
	return a;
}
function de(e) {
	let t = e.length;
	if (t === 0) return [
		0,
		0,
		0,
		0
	];
	let n = [1];
	for (let t of e) n.push(n[n.length - 1] + t.length);
	let r = n[n.length - 1], i;
	i = r <= 255 ? 1 : r <= 65535 ? 2 : r <= 16777215 ? 3 : 4;
	let a = [];
	a.push(t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, t & 255), a.push(i);
	for (let e of n) for (let t = i - 1; t >= 0; t--) a.push(e >> t * 8 & 255);
	for (let t of e) for (let e = 0; e < t.length; e++) a.push(t[e]);
	return a;
}
var fe = {
	0: "version",
	1: "Notice",
	2: "FullName",
	3: "FamilyName",
	4: "Weight",
	5: "FontBBox",
	13: "UniqueID",
	14: "XUID",
	15: "charset",
	16: "Encoding",
	17: "CharStrings",
	18: "Private",
	3072: "Copyright",
	3073: "isFixedPitch",
	3074: "ItalicAngle",
	3075: "UnderlinePosition",
	3076: "UnderlineThickness",
	3077: "PaintType",
	3078: "CharstringType",
	3079: "FontMatrix",
	3080: "StrokeWidth",
	3092: "SyntheticBase",
	3093: "PostScript",
	3094: "BaseFontName",
	3095: "BaseFontBlend",
	3102: "ROS",
	3103: "CIDFontVersion",
	3104: "CIDFontRevision",
	3105: "CIDFontType",
	3106: "CIDCount",
	3107: "UIDBase",
	3108: "FDArray",
	3109: "FDSelect",
	3110: "FontName"
}, pe = Object.fromEntries(Object.entries(fe).map(([e, t]) => [t, Number(e)])), me = {
	6: "BlueValues",
	7: "OtherBlues",
	8: "FamilyBlues",
	9: "FamilyOtherBlues",
	10: "StdHW",
	11: "StdVW",
	19: "Subrs",
	20: "defaultWidthX",
	21: "nominalWidthX",
	3081: "BlueScale",
	3082: "BlueShift",
	3083: "BlueFuzz",
	3084: "StemSnapH",
	3085: "StemSnapV",
	3086: "ForceBold",
	3089: "LanguageGroup",
	3090: "ExpansionFactor",
	3091: "initialRandomSeed"
}, he = Object.fromEntries(Object.entries(me).map(([e, t]) => [t, Number(e)])), ge = {
	17: "CharStrings",
	24: "VariationStore",
	3079: "FontMatrix",
	3108: "FDArray",
	3109: "FDSelect"
}, _e = Object.fromEntries(Object.entries(ge).map(([e, t]) => [t, Number(e)])), ve = { 18: "Private" }, ye = {
	6: "BlueValues",
	7: "OtherBlues",
	8: "FamilyBlues",
	9: "FamilyOtherBlues",
	10: "StdHW",
	11: "StdVW",
	19: "Subrs",
	22: "vsindex",
	23: "blend",
	3081: "BlueScale",
	3082: "BlueShift",
	3083: "BlueFuzz",
	3084: "StemSnapH",
	3085: "StemSnapV",
	3089: "LanguageGroup",
	3090: "ExpansionFactor"
};
function be(e, t) {
	let n = {};
	for (let { operator: r, operands: i } of e) {
		let e = t[r] || `op_${r}`;
		n[e] = i.length === 1 ? i[0] : i;
	}
	return n;
}
function xe(e, t) {
	let n = [];
	for (let [r, i] of Object.entries(e)) {
		let e = t[r];
		if (e === void 0) continue;
		let a = Array.isArray(i) ? i : [i];
		n.push({
			operator: e,
			operands: a
		});
	}
	return n;
}
function Se(e, t) {
	let n = e.fonts[0], r = n.fdArray?.[n.fdSelect?.[t] ?? 0] || n;
	return {
		globalSubrs: e.globalSubrs || [],
		localSubrs: r.localSubrs || [],
		nominalWidthX: r.privateDict?.nominalWidthX ?? 0,
		defaultWidthX: r.privateDict?.defaultWidthX ?? 0
	};
}
function Ce(e, t, n) {
	let r = e[t];
	if (r === 0) {
		let r = [];
		for (let i = 0; i < n; i++) r.push(e[t + 1 + i]);
		return r;
	}
	if (r === 3) {
		let r = e[t + 1] << 8 | e[t + 2], i = Array(n), a = t + 3;
		for (let t = 0; t < r; t++) {
			let o = e[a] << 8 | e[a + 1], s = e[a + 2];
			a += 3;
			let c = t < r - 1 ? e[a] << 8 | e[a + 1] : n;
			for (let e = o; e < c; e++) i[e] = s;
		}
		return i;
	}
	if (r === 4) {
		let r = (e[t + 1] << 24 | e[t + 2] << 16 | e[t + 3] << 8 | e[t + 4]) >>> 0, i = Array(n), a = t + 5;
		for (let t = 0; t < r; t++) {
			let o = (e[a] << 24 | e[a + 1] << 16 | e[a + 2] << 8 | e[a + 3]) >>> 0, s = e[a + 4] << 8 | e[a + 5];
			a += 6;
			let c = t < r - 1 ? (e[a] << 24 | e[a + 1] << 16 | e[a + 2] << 8 | e[a + 3]) >>> 0 : n;
			for (let e = o; e < c; e++) i[e] = s;
		}
		return i;
	}
	throw Error(`Unsupported FDSelect format: ${r}`);
}
function we(e) {
	let t = [0];
	for (let n of e) t.push(n);
	return t;
}
function Te(e, t, n) {
	if (t === 0) return "ISOAdobe";
	if (t === 1) return "Expert";
	if (t === 2) return "ExpertSubset";
	let r = e[t], i = [];
	if (r === 0) for (let r = 1; r < n; r++) {
		let n = e[t + 1 + (r - 1) * 2] << 8 | e[t + 2 + (r - 1) * 2];
		i.push(n);
	}
	else if (r === 1) {
		let r = t + 1;
		for (; i.length < n - 1;) {
			let t = e[r] << 8 | e[r + 1], a = e[r + 2];
			r += 3;
			for (let e = 0; e <= a && i.length < n - 1; e++) i.push(t + e);
		}
	} else if (r === 2) {
		let r = t + 1;
		for (; i.length < n - 1;) {
			let t = e[r] << 8 | e[r + 1], a = e[r + 2] << 8 | e[r + 3];
			r += 4;
			for (let e = 0; e <= a && i.length < n - 1; e++) i.push(t + e);
		}
	}
	return i;
}
function Ee(e) {
	if (typeof e == "string") return [];
	let t = [0];
	for (let n of e) t.push(n >> 8 & 255, n & 255);
	return t;
}
function De(e, t) {
	if (t === 0) return "Standard";
	if (t === 1) return "Expert";
	let n = e[t] & 127, r = !!(e[t] & 128), i = [];
	if (n === 0) {
		let n = e[t + 1];
		for (let r = 0; r < n; r++) i.push(e[t + 2 + r]);
	} else if (n === 1) {
		let n = e[t + 1], r = t + 2;
		for (let t = 0; t < n; t++) {
			let t = e[r], n = e[r + 1];
			r += 2;
			for (let e = 0; e <= n; e++) i.push(t + e);
		}
	}
	return {
		format: n,
		codes: i,
		hasSupplement: r
	};
}
//#endregion
//#region src/otf/charstring_interpreter.js
function Oe(e, t) {
	let n = e[t];
	if (n >= 32 && n <= 246) return {
		value: n - 139,
		bytesConsumed: 1
	};
	if (n >= 247 && n <= 250) return {
		value: (n - 247) * 256 + e[t + 1] + 108,
		bytesConsumed: 2
	};
	if (n >= 251 && n <= 254) return {
		value: -(n - 251) * 256 - e[t + 1] - 108,
		bytesConsumed: 2
	};
	if (n === 28) {
		let n = e[t + 1] << 8 | e[t + 2];
		return {
			value: n > 32767 ? n - 65536 : n,
			bytesConsumed: 3
		};
	}
	if (n === 255) {
		let n = (e[t + 1] << 24 | e[t + 2] << 16 | e[t + 3] << 8 | e[t + 4]) >>> 0;
		return {
			value: (n > 2147483647 ? n - 4294967296 : n) / 65536,
			bytesConsumed: 5
		};
	}
	return null;
}
function ke(e) {
	return e < 1240 ? 107 : e < 33900 ? 1131 : 32768;
}
function Ae(e, t = [], n = [], { maxCharStringOperations: r = 1e6 } = {}) {
	if (!Number.isSafeInteger(r) || r < 1) throw Error("Invalid import limit: maxCharStringOperations");
	let i = 0, a = [], o = [], s = null, c = 0, l = 0, u = null, d = !1, f = !0, p = ke(t.length), m = ke(n.length);
	function h(e, t) {
		s && s.length > 0 && o.push(s), c += e, l += t, s = [{
			type: "M",
			x: c,
			y: l
		}];
	}
	function g(e, t) {
		c += e, l += t, s && s.push({
			type: "L",
			x: c,
			y: l
		});
	}
	function _(e, t, n, r, i, a) {
		let o = c + e, u = l + t, d = o + n, f = u + r;
		c = d + i, l = f + a, s && s.push({
			type: "C",
			x1: o,
			y1: u,
			x2: d,
			y2: f,
			x: c,
			y: l
		});
	}
	function v() {
		f && (a.length % 2 != 0 && (u = a.shift()), f = !1, d = !0);
	}
	function y(e) {
		switch (e) {
			case 1:
			case 3:
			case 18:
			case 23:
				d || (a.length % 2 != 0 && (u = a.shift()), d = !0, f = !1), a.length = 0;
				break;
			case 4:
				f && (a.length > 1 && (u = a.shift()), f = !1, d = !0), h(0, a.pop()), a.length = 0;
				break;
			case 5:
				for (let e = 0; e < a.length; e += 2) g(a[e], a[e + 1]);
				a.length = 0;
				break;
			case 6:
				for (let e = 0; e < a.length; e++) e % 2 == 0 ? g(a[e], 0) : g(0, a[e]);
				a.length = 0;
				break;
			case 7:
				for (let e = 0; e < a.length; e++) e % 2 == 0 ? g(0, a[e]) : g(a[e], 0);
				a.length = 0;
				break;
			case 8:
				for (let e = 0; e + 5 < a.length; e += 6) _(a[e], a[e + 1], a[e + 2], a[e + 3], a[e + 4], a[e + 5]);
				a.length = 0;
				break;
			case 10: {
				let e = a.pop() + m;
				n[e] && (callStack.push(null), execute(n[e]));
				break;
			}
			case 11: return;
			case 14:
				!d && a.length > 0 && (u = a.shift(), d = !0, f = !1), s && s.length > 0 && (o.push(s), s = null), a.length = 0;
				break;
			case 19:
			case 20:
				d || (a.length % 2 != 0 && (u = a.shift()), d = !0, f = !1), a.length = 0;
				break;
			case 21:
				v();
				{
					let e = a.pop();
					h(a.pop(), e);
				}
				a.length = 0;
				break;
			case 22:
				f && (a.length > 1 && (u = a.shift()), f = !1, d = !0), h(a.pop(), 0), a.length = 0;
				break;
			case 24:
				{
					let e = a.length - 2, t = 0;
					for (; t < e; t += 6) _(a[t], a[t + 1], a[t + 2], a[t + 3], a[t + 4], a[t + 5]);
					g(a[t], a[t + 1]);
				}
				a.length = 0;
				break;
			case 25:
				{
					let e = a.length - 6, t = 0;
					for (; t < e; t += 2) g(a[t], a[t + 1]);
					_(a[t], a[t + 1], a[t + 2], a[t + 3], a[t + 4], a[t + 5]);
				}
				a.length = 0;
				break;
			case 26:
				{
					let e = 0, t = 0;
					for (a.length % 4 != 0 && (t = a[e++]); e + 3 < a.length; e += 4) _(t, a[e], a[e + 1], a[e + 2], 0, a[e + 3]), t = 0;
				}
				a.length = 0;
				break;
			case 27:
				{
					let e = 0, t = 0;
					for (a.length % 4 != 0 && (t = a[e++]); e + 3 < a.length; e += 4) _(a[e], t, a[e + 1], a[e + 2], a[e + 3], 0), t = 0;
				}
				a.length = 0;
				break;
			case 29: {
				let e = a.pop() + p;
				t[e] && (callStack.push(null), execute(t[e]));
				break;
			}
			case 30:
				{
					let e = 0;
					for (; e < a.length && e + 3 < a.length;) {
						{
							let t = a.length - e === 5 ? a[e + 4] : 0;
							_(0, a[e], a[e + 1], a[e + 2], a[e + 3], t), e += t === 0 ? 4 : 5;
						}
						if (e + 3 < a.length) {
							let t = a.length - e === 5 ? a[e + 4] : 0;
							_(a[e], 0, a[e + 1], a[e + 2], t, a[e + 3]), e += t === 0 ? 4 : 5;
						} else break;
					}
				}
				a.length = 0;
				break;
			case 31:
				{
					let e = 0;
					for (; e < a.length && e + 3 < a.length;) {
						{
							let t = a.length - e === 5 ? a[e + 4] : 0;
							_(a[e], 0, a[e + 1], a[e + 2], t, a[e + 3]), e += t === 0 ? 4 : 5;
						}
						if (e + 3 < a.length) {
							let t = a.length - e === 5 ? a[e + 4] : 0;
							_(0, a[e], a[e + 1], a[e + 2], a[e + 3], t), e += t === 0 ? 4 : 5;
						} else break;
					}
				}
				a.length = 0;
				break;
			default: a.length = 0;
		}
	}
	function b(e) {
		switch (e) {
			case 34:
				{
					let e = a[0], t = a[1], n = a[2], r = a[3], i = a[4], o = a[5], s = -n, c = a[6];
					_(e, 0, t, n, r, 0), _(i, 0, o, s, c, 0);
				}
				a.length = 0;
				break;
			case 35:
				_(a[0], a[1], a[2], a[3], a[4], a[5]), _(a[6], a[7], a[8], a[9], a[10], a[11]), a.length = 0;
				break;
			case 36:
				{
					let e = a[0], t = a[1], n = a[2], r = a[3], i = a[4], o = a[5], s = a[6], c = a[7], l = a[8], u = -(t + r + c);
					_(e, t, n, r, i, 0), _(o, 0, s, c, l, u);
				}
				a.length = 0;
				break;
			case 37:
				{
					let e = a[0], t = a[1], n = a[2], r = a[3], i = a[4], o = a[5], s = a[6], c = a[7], l = a[8], u = a[9], d = a[10], f = e + n + i + s + l, p = t + r + o + c + u, m, h;
					Math.abs(f) > Math.abs(p) ? (m = d, h = -p) : (m = -f, h = d), _(e, t, n, r, i, o), _(s, c, l, u, m, h);
				}
				a.length = 0;
				break;
			default: a.length = 0;
		}
	}
	function x(e, o, s = 0) {
		if (s > 64) throw Error("CFF subroutine recursion exceeds depth 64.");
		let c = o || 0, l = 0;
		for (; l < e.length;) {
			if (++i > r) throw Error("CFF execution exceeds maxCharStringOperations.");
			if (a.length > 513) throw Error("CFF operand stack exceeds limit.");
			let o = e[l], h = Oe(e, l);
			if (h !== null) {
				if (l + h.bytesConsumed > e.length) throw Error("Truncated CFF number.");
				a.push(h.value), l += h.bytesConsumed;
				continue;
			}
			if (o === 12) {
				if (l + 1 >= e.length) throw Error("Truncated CFF operator.");
				l++;
				let t = e[l];
				l++, b(t);
			} else if (o === 19 || o === 20) {
				d || (a.length % 2 != 0 && (u = a.shift()), d = !0, f = !1), c += a.length >> 1, a.length = 0, l++;
				let t = Math.ceil(c / 8);
				if (l += t, l > e.length) throw Error("Truncated CFF hint mask.");
			} else if (o === 1 || o === 3 || o === 18 || o === 23) d || (a.length % 2 != 0 && (u = a.shift()), d = !0, f = !1), c += a.length >> 1, a.length = 0, l++;
			else if (o === 10) {
				l++;
				let e = a.pop() + m;
				n[e] && (c = x(n[e], c, s + 1));
			} else if (o === 29) {
				l++;
				let e = a.pop() + p;
				t[e] && (c = x(t[e], c, s + 1));
			} else if (o === 11) return c;
			else l++, y(o);
		}
		return c;
	}
	return x(e, 0), s && s.length > 0 && o.push(s), {
		contours: o,
		width: u
	};
}
var je = {
	1: "hstem",
	3: "vstem",
	4: "vmoveto",
	5: "rlineto",
	6: "hlineto",
	7: "vlineto",
	8: "rrcurveto",
	10: "callsubr",
	11: "return",
	14: "endchar",
	18: "hstemhm",
	19: "hintmask",
	20: "cntrmask",
	21: "rmoveto",
	22: "hmoveto",
	23: "vstemhm",
	24: "rcurveline",
	25: "rlinecurve",
	26: "vvcurveto",
	27: "hhcurveto",
	29: "callgsubr",
	30: "vhcurveto",
	31: "hvcurveto"
}, Me = {
	0: "dotsection",
	3: "and",
	4: "or",
	5: "not",
	9: "abs",
	10: "add",
	11: "sub",
	12: "div",
	14: "neg",
	15: "eq",
	18: "drop",
	20: "put",
	21: "get",
	22: "ifelse",
	23: "random",
	24: "mul",
	26: "sqrt",
	27: "dup",
	28: "exch",
	29: "index",
	30: "roll",
	34: "hflex",
	35: "flex",
	36: "hflex1",
	37: "flex1"
};
function Ne(e) {
	let t = [], n = [], r = 0, i = 0;
	for (; i < e.length;) {
		let a = e[i], o = Oe(e, i);
		if (o !== null) {
			n.push(o.value), i += o.bytesConsumed;
			continue;
		}
		if (a === 12) {
			i++;
			let r = e[i];
			i++;
			let a = Me[r] || `op12.${r}`;
			t.push(n.length ? `${n.join(" ")} ${a}` : a), n.length = 0;
		} else if (a === 19 || a === 20) {
			let o = a === 19 ? "hintmask" : "cntrmask";
			r += n.length >> 1, i++;
			let s = Math.ceil(r / 8), c = [];
			for (let t = 0; t < s && i < e.length; t++, i++) c.push(e[i].toString(2).padStart(8, "0"));
			let l = n.length ? `${n.join(" ")} ` : "";
			t.push(`${l}${o} ${c.join("")}`), n.length = 0;
		} else if (a === 1 || a === 3 || a === 18 || a === 23) {
			r += n.length >> 1;
			let e = je[a];
			t.push(n.length ? `${n.join(" ")} ${e}` : e), n.length = 0, i++;
		} else {
			let e = je[a] || `op${a}`;
			t.push(n.length ? `${n.join(" ")} ${e}` : e), n.length = 0, i++;
		}
	}
	return n.length && t.push(n.join(" ")), t.join("\n");
}
//#endregion
//#region src/simplify.js
function Pe(e, t = {}) {
	let { header: n, tables: r } = e, i = Re(r), a = Ke(r, t), o = {
		font: i,
		glyphs: a
	}, { pairs: s, classes: c } = qe(r, a);
	s.length > 0 && (o.kerning = s), c && (o.kerningClasses = c), r.fvar && (o.axes = it(r), o.instances = at(r));
	let l = ct(r);
	l && (o.axisMapping = l);
	let u = lt(r);
	u && (o.axisStyles = u);
	let d = ut(r);
	if (d && (o.metricVariations = d), r.GSUB && !r.GSUB._raw) {
		let { substitutions: e, rawLookups: t } = ht(r.GSUB, a);
		o.substitutionMetadata = Fe(r.GSUB), e.length > 0 && (o.substitutions = e), t.length > 0 && (o._rawGSUBLookups = structuredClone(t));
	}
	let f = {};
	r.GPOS && !r.GPOS._raw && (f.GPOS = structuredClone(r.GPOS)), r.GDEF && !r.GDEF._raw && (f.GDEF = structuredClone(r.GDEF)), Object.keys(f).length > 0 && (o.features = f), r.gasp && !r.gasp._raw && r.gasp.gaspRanges && (o.gasp = r.gasp.gaspRanges.map((e) => ({
		maxPPEM: e.rangeMaxPPEM,
		behavior: e.rangeGaspBehavior
	}))), r["cvt "] && !r["cvt "]._raw && r["cvt "].values && (o.cvt = r["cvt "].values.slice()), r.fpgm && !r.fpgm._raw && r.fpgm.instructions && (o.fpgm = r.fpgm.instructions.slice()), r.prep && !r.prep._raw && r.prep.instructions && (o.prep = r.prep.instructions.slice());
	let p = Mt(r);
	p && (o.palettes = p);
	let m = Nt(r, a);
	return m && m.length > 0 && (o.colorGlyphs = m), o.tables = { ...r }, o._header = n, o;
}
function Fe(e) {
	let t = e.featureList?.featureRecords || [], n = [];
	for (let r of e.scriptList?.scriptRecords || []) {
		let e = (e, i) => {
			let a = e?.requiredFeatureIndex;
			if (a === void 0 || a === 65535) return;
			let o = t[a]?.featureTag;
			o && n.push({
				script: r.scriptTag,
				language: i,
				feature: o
			});
		};
		e(r.script.defaultLangSys, null);
		for (let t of r.script.langSysRecords || []) e(t.langSys, t.langSysTag);
	}
	let r = {
		majorVersion: e.majorVersion,
		minorVersion: e.minorVersion,
		featureOrder: t.map((e) => e.featureTag),
		requiredFeatures: n
	};
	return e.featureVariations && (r.featureVariations = structuredClone(e.featureVariations)), r;
}
var Ie = {
	0: "copyright",
	1: "familyName",
	2: "styleName",
	3: "uniqueID",
	4: "fullName",
	5: "version",
	6: "postScriptName",
	7: "trademark",
	8: "manufacturer",
	9: "designer",
	10: "description",
	11: "vendorURL",
	12: "designerURL",
	13: "license",
	14: "licenseURL",
	16: "typographicFamily",
	17: "typographicSubfamily",
	19: "sampleText",
	21: "wwsFamily",
	22: "wwsSubfamily",
	25: "variationsPostScriptNamePrefix"
};
function Le(e, t) {
	if (!e || !e.names) return;
	let n = e.names.filter((e) => e.nameID === t);
	if (n.length === 0) return;
	let r = n.find((e) => e.platformID === 3 && e.encodingID === 1 && e.languageID === 1033);
	if (r) return r.value;
	let i = n.find((e) => e.platformID === 0);
	if (i) return i.value;
	let a = n.find((e) => e.platformID === 1 && e.encodingID === 0 && e.languageID === 0);
	return a ? a.value : n[0].value;
}
function Re(e) {
	let t = e.name, n = e.head, r = e.hhea, i = e["OS/2"], a = e.post, o = {};
	for (let [e, n] of Object.entries(Ie)) {
		let r = Le(t, Number(e));
		r !== void 0 && r.trim() !== "" && (o[n] = r);
	}
	return n && !n._raw && (o.unitsPerEm = n.unitsPerEm, o.created = ft(n.created), o.modified = ft(n.modified), n.macStyle !== void 0 && (o.macStyle = n.macStyle)), r && !r._raw && (o.ascender = r.ascender, o.descender = r.descender, o.lineGap = r.lineGap), a && !a._raw && (o.italicAngle = a.italicAngle, o.underlinePosition = a.underlinePosition, o.underlineThickness = a.underlineThickness, o.isFixedPitch = a.isFixedPitch !== 0), i && !i._raw && (o.weightClass = i.usWeightClass, o.widthClass = i.usWidthClass, o.fsType = i.fsType, o.fsSelection = i.fsSelection, o.achVendID = i.achVendID, i.panose && (o.panose = i.panose)), o;
}
var ze = [
	196,
	197,
	199,
	201,
	209,
	214,
	220,
	225,
	224,
	226,
	228,
	227,
	229,
	231,
	233,
	232,
	234,
	235,
	237,
	236,
	238,
	239,
	241,
	243,
	242,
	244,
	246,
	245,
	250,
	249,
	251,
	252,
	8224,
	176,
	162,
	163,
	167,
	8226,
	182,
	223,
	174,
	169,
	8482,
	180,
	168,
	8800,
	198,
	216,
	8734,
	177,
	8804,
	8805,
	165,
	181,
	8706,
	8721,
	8719,
	960,
	8747,
	170,
	186,
	937,
	230,
	248,
	191,
	161,
	172,
	8730,
	402,
	8776,
	8710,
	171,
	187,
	8230,
	160,
	192,
	195,
	213,
	338,
	339,
	8211,
	8212,
	8220,
	8221,
	8216,
	8217,
	247,
	9674,
	255,
	376,
	8260,
	8364,
	8249,
	8250,
	64257,
	64258,
	8225,
	183,
	8218,
	8222,
	8240,
	194,
	202,
	193,
	203,
	200,
	205,
	206,
	207,
	204,
	211,
	212,
	63743,
	210,
	218,
	219,
	217,
	305,
	710,
	732,
	175,
	728,
	729,
	730,
	184,
	733,
	731,
	711
];
function Be(e, t) {
	return e === 0 ? !0 : e === 3 ? t === 0 || t === 1 || t === 10 : !1;
}
function Ve(e, t) {
	return !t || e < 128 ? e : e <= 255 ? ze[e - 128] : e;
}
function He(e, t, n) {
	let r = 0;
	for (let e of t.groups || t.segments || []) {
		let t = e.startCharCode ?? e.startCode, n = e.endCharCode ?? e.endCode;
		if (!Number.isInteger(t) || !Number.isInteger(n) || t < 0 || n > 1114111 || n < t) throw Error("cmap range is outside Unicode bounds.");
		if (r += n - t + 1, r > 1114112) throw Error("cmap mapping expansion exceeds Unicode budget.");
	}
	switch (t.format) {
		case 0:
			for (let r = 0; r < t.glyphIdArray.length; r++) {
				let i = t.glyphIdArray[r];
				i !== 0 && We(e, i, Ve(r, n));
			}
			break;
		case 4:
			for (let r of t.segments) for (let i = r.startCode; i <= r.endCode; i++) {
				let a;
				if (r.idRangeOffset === 0) a = i + r.idDelta & 65535;
				else {
					let e = r.idRangeOffset / 2 + (i - r.startCode) - (t.segments.length - t.segments.indexOf(r));
					a = t.glyphIdArray[e], a !== void 0 && a !== 0 && (a = a + r.idDelta & 65535);
				}
				a !== void 0 && a !== 0 && We(e, a, Ve(i, n));
			}
			break;
		case 6:
			for (let r = 0; r < t.glyphIdArray.length; r++) {
				let i = t.glyphIdArray[r];
				i !== 0 && We(e, i, Ve(t.firstCode + r, n));
			}
			break;
		case 12:
			for (let r of t.groups) for (let t = r.startCharCode; t <= r.endCharCode; t++) {
				let i = r.startGlyphID + (t - r.startCharCode);
				i !== 0 && We(e, i, Ve(t, n));
			}
			break;
		case 13: for (let r of t.groups) for (let t = r.startCharCode; t <= r.endCharCode; t++) r.glyphID !== 0 && We(e, r.glyphID, Ve(t, n));
	}
}
function Ue(e) {
	let t = /* @__PURE__ */ new Map();
	if (!e || e._raw || !e.subtables) return t;
	let n = e.subtables, r = e.encodingRecords, i;
	if (Array.isArray(r) && r.length > 0) {
		let e = /* @__PURE__ */ new Set(), t = /* @__PURE__ */ new Set();
		for (let n of r) Be(n.platformID, n.encodingID) ? e.add(n.subtableIndex) : n.platformID === 1 && n.encodingID === 0 && t.add(n.subtableIndex);
		i = e.size > 0 ? [...e].map((e) => ({
			index: e,
			translateMacRoman: !1
		})) : t.size > 0 ? [...t].map((e) => ({
			index: e,
			translateMacRoman: !0
		})) : n.map((e, t) => ({
			index: t,
			translateMacRoman: !1
		}));
	} else i = n.map((e, t) => ({
		index: t,
		translateMacRoman: !1
	}));
	for (let { index: e, translateMacRoman: r } of i) {
		let i = n[e];
		i && He(t, i, r);
	}
	return t;
}
function We(e, t, n) {
	e.has(t) || e.set(t, []);
	let r = e.get(t);
	r.includes(n) || r.push(n);
}
function Ge(e, t) {
	if (e.post && !e.post._raw && e.post.glyphNames && e.post.glyphNames.length > 0) return e.post.glyphNames;
	if (e["CFF "] && !e["CFF "]._raw) {
		let t = e["CFF "];
		if (t.fonts && t.fonts[0] && t.fonts[0].charset) {
			let e = t.fonts[0].charset, n = t.strings || [];
			return [".notdef", ...e.map((e) => {
				if (typeof e == "string") return e;
				if (typeof e == "number" && e >= 391) {
					let t = n[e - 391];
					return typeof t == "string" && t !== "" ? t : String(e);
				}
				return String(e);
			})];
		}
	}
	let n = [];
	for (let e = 0; e < t; e++) n.push(e === 0 ? ".notdef" : `glyph${e}`);
	return n;
}
function Ke(e, t) {
	let n = e.glyf && !e.glyf._raw, r = e["CFF "] && !e["CFF "]._raw, i = e.hmtx && !e.hmtx._raw ? e.hmtx : null, a = e.vmtx && !e.vmtx._raw ? e.vmtx : null, o = e.hhea && !e.hhea._raw ? e.hhea : null, s = e.vhea && !e.vhea._raw ? e.vhea : null, c = 0;
	e.maxp && !e.maxp._raw ? c = e.maxp.numGlyphs : n ? c = e.glyf.glyphs.length : r ? c = e["CFF "].fonts[0].charStrings.length : i && (c = i.hMetrics.length + (i.leftSideBearings?.length || 0));
	let l = o ? o.numberOfHMetrics : c, u = s ? s.numOfLongVerMetrics : 0, d = Ue(e.cmap), f = Ge(e, c), p = [];
	for (let o = 0; o < c; o++) {
		let s = {};
		f[o] && (s.name = f[o]);
		let c = d.get(o) || [];
		if (c.length === 1 ? s.unicode = c[0] : c.length > 1 ? (s.unicode = c[0], s.unicodes = c) : s.unicode = null, i && (o < l ? (s.advanceWidth = i.hMetrics[o].advanceWidth, s.leftSideBearing = i.hMetrics[o].lsb) : (s.advanceWidth = i.hMetrics[l - 1].advanceWidth, s.leftSideBearing = i.leftSideBearings[o - l])), a && (o < u ? (s.advanceHeight = a.vMetrics[o].advanceHeight, s.topSideBearing = a.vMetrics[o].topSideBearing) : a.topSideBearings && (s.advanceHeight = a.vMetrics[u - 1].advanceHeight, s.topSideBearing = a.topSideBearings[o - u])), n) {
			let t = e.glyf.glyphs[o];
			t && t.type === "simple" ? (s.contours = structuredClone(t.contours), t.instructions && t.instructions.length > 0 && (s.instructions = t.instructions.slice())) : t && t.type === "composite" && (s.components = structuredClone(t.components), t.instructions && t.instructions.length > 0 && (s.instructions = t.instructions.slice()));
		}
		if (r) {
			let n = e["CFF "], r = n.fonts[0].charStrings;
			if (r[o]) {
				s.charString = r[o].slice(), s.charStringDisassembly = Ne(r[o]);
				let { globalSubrs: e, localSubrs: i } = Se(n, o), a = Ae(r[o], e, i, t);
				a.contours.length > 0 && (s.contours = a.contours);
			}
		}
		p.push(s);
	}
	return p;
}
function qe(e, t) {
	let n = Ye(e, t), r = $e(e, t), i = /* @__PURE__ */ new Map();
	for (let e of n.pairs) i.set(`${e.left}\0${e.right}`, e);
	for (let e of r.pairs) {
		let t = `${e.left}\0${e.right}`;
		i.has(t) || i.set(t, e);
	}
	return {
		pairs: Array.from(i.values()),
		classes: (n.classes && n.classes.length ? n.classes : null) || (r.classes && r.classes.length ? r.classes : null) || null
	};
}
function Je(e) {
	let { leftMembers: t, rightMembers: n, leftCount: r, rightCount: i, valueAt: a } = e, o = {
		leftClasses: {},
		rightClasses: {},
		pairs: []
	}, s = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map(), l = (e, t, n, r, i) => {
		let a = n.get(e);
		if (a !== void 0) return a;
		let o;
		if (t.length === 1) o = t[0];
		else {
			let n = `${i}${e}`;
			r[n] = t, o = `@${n}`;
		}
		return n.set(e, o), o;
	};
	for (let e = 0; e < r; e++) {
		let r = t.get(e);
		if (!(!r || r.length === 0)) for (let t = 0; t < i; t++) {
			let i = a(e, t);
			if (!i) continue;
			let u = n.get(t);
			if (!u || u.length === 0) continue;
			let d = l(e, r, s, o.leftClasses, "kern_L"), f = l(t, u, c, o.rightClasses, "kern_R");
			o.pairs.push({
				left: d,
				right: f,
				value: i
			});
		}
	}
	return o.pairs.length > 0 ? o : null;
}
function Ye(e, t) {
	let n = e.GPOS, r = {
		pairs: [],
		classes: null
	};
	if (!n || n._raw || !n.featureList || !n.lookupList) return r;
	let i = /* @__PURE__ */ new Set();
	for (let e of n.featureList.featureRecords) if (e.featureTag === "kern") for (let t of e.feature.lookupListIndices) i.add(t);
	if (i.size === 0) return r;
	let a = [], o = [];
	for (let e of i) {
		let r = n.lookupList.lookups[e];
		if (!(!r || r.lookupType !== 2)) {
			for (let e of r.subtables) if (e.format === 1) Xe(e, t, a);
			else if (e.format === 2) {
				let n = Ze(e, t);
				n && o.push(n);
			}
		}
	}
	return {
		pairs: a,
		classes: o.length ? o : null
	};
}
function Xe(e, t, n) {
	let r = M(e.coverage);
	for (let i = 0; i < r.length && i < e.pairSets.length; i++) {
		let a = r[i], o = t[a]?.name || `glyph${a}`;
		for (let r of e.pairSets[i]) {
			let e = r.value1?.xAdvance;
			if (e === void 0 || e === 0) continue;
			let i = t[r.secondGlyph]?.name || `glyph${r.secondGlyph}`;
			n.push({
				left: o,
				right: i,
				value: e
			});
		}
	}
}
function Ze(e, t) {
	let n = Qe(e.classDef1, t.length), r = Qe(e.classDef2, t.length), i = new Set(M(e.coverage)), a = /* @__PURE__ */ new Map();
	for (let e of i) {
		let r = n.get(e) ?? 0;
		a.has(r) || a.set(r, []), a.get(r).push(t[e]?.name || `glyph${e}`);
	}
	let o = /* @__PURE__ */ new Map();
	for (let e = 0; e < t.length; e++) {
		let n = r.get(e) ?? 0;
		o.has(n) || o.set(n, []), o.get(n).push(t[e]?.name || `glyph${e}`);
	}
	return Je({
		leftMembers: a,
		rightMembers: o,
		leftCount: e.class1Count,
		rightCount: e.class2Count,
		valueAt: (t, n) => e.class1Records[t]?.[n]?.value1?.xAdvance || 0
	});
}
function M(e) {
	if (e.format === 1) return e.glyphs;
	if (e.format === 2) {
		let t = [];
		for (let n of e.ranges) for (let e = n.startGlyphID; e <= n.endGlyphID; e++) t.push(e);
		return t;
	}
	return [];
}
function Qe(e, t) {
	let n = /* @__PURE__ */ new Map();
	if (e.format === 1) for (let t = 0; t < e.classValues.length; t++) n.set(e.startGlyphID + t, e.classValues[t]);
	else if (e.format === 2) for (let t of e.ranges) for (let e = t.startGlyphID; e <= t.endGlyphID; e++) n.set(e, t.class);
	return n;
}
function $e(e, t) {
	let n = e.kern;
	if (!n || n._raw || !n.subtables) return {
		pairs: [],
		classes: null
	};
	let r = [], i = [];
	for (let e of n.subtables) if (!e._raw) {
		if (e.format === 0 && e.pairs) for (let n of e.pairs) {
			let e = t[n.left]?.name || `glyph${n.left}`, i = t[n.right]?.name || `glyph${n.right}`;
			r.push({
				left: e,
				right: i,
				value: n.value
			});
		}
		else if (e.format === 2 && e.values) {
			let n = et(e, t);
			n && i.push(n);
		} else if (e.format === 3 && e.kernValues) {
			let n = tt(e, t);
			n && i.push(n);
		} else e.format === 1 && e.states && nt(e, t, r);
	}
	return {
		pairs: r,
		classes: i.length ? i : null
	};
}
function et(e, t) {
	let { leftClassTable: n, rightClassTable: r, rowWidth: i, kerningArrayOffset: a, values: o } = e;
	if (!o) return null;
	let s = i > 0 ? i / 2 : 0, c = /* @__PURE__ */ new Map();
	for (let e = 0; e < n.nGlyphs; e++) {
		let r = n.firstGlyph + e, s = n.offsets[e] || 0, l = i > 0 ? Math.floor((s - a) / i) : 0;
		l >= 0 && l < o.length && (c.has(l) || c.set(l, []), c.get(l).push(t[r]?.name || `glyph${r}`));
	}
	let l = /* @__PURE__ */ new Map();
	for (let e = 0; e < r.nGlyphs; e++) {
		let n = r.firstGlyph + e, i = r.offsets[e] || 0, a = Math.floor(i / 2);
		a >= 0 && a < s && (l.has(a) || l.set(a, []), l.get(a).push(t[n]?.name || `glyph${n}`));
	}
	return Je({
		leftMembers: c,
		rightMembers: l,
		leftCount: o.length,
		rightCount: s,
		valueAt: (e, t) => o[e]?.[t] || 0
	});
}
function tt(e, t) {
	let { glyphCount: n, leftClassCount: r, rightClassCount: i, kernValues: a, leftClasses: o, rightClasses: s, kernIndices: c } = e, l = Math.min(n, t.length), u = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Map();
	for (let e = 0; e < l; e++) {
		let n = o[e];
		n < r && (u.has(n) || u.set(n, []), u.get(n).push(t[e]?.name || `glyph${e}`));
		let a = s[e];
		a < i && (d.has(a) || d.set(a, []), d.get(a).push(t[e]?.name || `glyph${e}`));
	}
	return Je({
		leftMembers: u,
		rightMembers: d,
		leftCount: r,
		rightCount: i,
		valueAt: (e, t) => {
			let n = c[e * i + t];
			return n === void 0 || n >= a.length ? 0 : a[n] || 0;
		}
	});
}
function nt(e, t, n) {
	let { stateSize: r, classTable: i, states: a, entryTable: o, valueTable: s, stateArrayOffset: c } = e;
	if (!i || !a || !o || !s || a.length === 0 || r === 0) return;
	let l = /* @__PURE__ */ new Map();
	for (let e = 0; e < i.nGlyphs; e++) {
		let t = i.firstGlyph + e, n = i.classArray[e];
		n >= 4 && l.set(t, n);
	}
	let u = Array.from(l.keys());
	if (u.length !== 0) for (let e of u) for (let i of u) {
		let u = rt(e, i, l, a, o, s, r, c);
		if (u !== 0) {
			let r = t[e]?.name || `glyph${e}`, a = t[i]?.name || `glyph${i}`;
			n.push({
				left: r,
				right: a,
				value: u
			});
		}
	}
}
function rt(e, t, n, r, i, a, o, s) {
	let c = 0, l = 0, u = [], d = [e, t];
	for (let e of d) {
		let t = n.get(e) ?? 1;
		if (t >= o || c >= r.length) break;
		let d = r[c][t];
		if (d === void 0 || d >= i.length) break;
		let f = i[d], p = !!(f.flags & 32768), m = f.flags & 16383;
		if (p && u.push(e), m > 0 && u.length > 0) {
			let e = Math.floor((m - (a._offset || 0)) / 2);
			for (let t = 0; t < u.length; t++) {
				let n = e + t;
				if (n >= 0 && n < a.length) {
					let e = a[n], t = !!(e & 1);
					if (l += t ? e & -2 : e, t) break;
				}
			}
			u.length = 0;
		}
		let h = f.newStateOffset;
		c = o > 0 ? Math.floor((h - s) / o) : 0, (c < 0 || c >= r.length) && (c = 0);
	}
	return l;
}
function it(e) {
	let t = e.fvar;
	return !t || t._raw || !t.axes ? [] : t.axes.map((t) => ({
		tag: t.axisTag,
		name: Le(e.name, t.axisNameID) || t.axisTag,
		min: t.minValue,
		default: t.defaultValue,
		max: t.maxValue,
		hidden: !!(t.flags & 1)
	}));
}
function at(e) {
	let t = e.fvar;
	if (!t || t._raw || !t.instances) return [];
	let n = t.axes;
	return t.instances.map((t) => {
		let r = {};
		for (let e = 0; e < n.length; e++) r[n[e].axisTag] = t.coordinates[e];
		let i = {
			name: Le(e.name, t.subfamilyNameID) || `Instance ${t.subfamilyNameID}`,
			coordinates: r
		};
		if (t.postScriptNameID !== void 0) {
			let n = Le(e.name, t.postScriptNameID);
			n && (i.postScriptName = n);
		}
		return i;
	});
}
var ot = {
	hasc: "ascender",
	hdsc: "descender",
	hlgp: "lineGap",
	hcla: "caretSlopeRise",
	hcld: "caretSlopeRun",
	hcof: "caretOffset",
	hcrn: "hCaretRun",
	hcrs: "hCaretRise",
	vasc: "vAscender",
	vdsc: "vDescender",
	vlgp: "vLineGap",
	xhgt: "xHeight",
	cpht: "capHeight",
	sbxs: "subscriptXSize",
	sbys: "subscriptYSize",
	sbxo: "subscriptXOffset",
	sbyo: "subscriptYOffset",
	spxs: "superscriptXSize",
	spys: "superscriptYSize",
	spxo: "superscriptXOffset",
	spyo: "superscriptYOffset",
	strs: "strikeoutSize",
	stro: "strikeoutOffset",
	unds: "underlineSize",
	undo: "underlineOffset",
	gsp0: "gaspRange0",
	gsp1: "gaspRange1",
	gsp2: "gaspRange2",
	gsp3: "gaspRange3",
	gsp4: "gaspRange4",
	gsp5: "gaspRange5",
	gsp6: "gaspRange6",
	gsp7: "gaspRange7",
	gsp8: "gaspRange8",
	gsp9: "gaspRange9"
}, st = Object.fromEntries(Object.entries(ot).map(([e, t]) => [t, e]));
function ct(e) {
	let t = e.avar, n = e.fvar;
	if (!t || t._raw || !t.segmentMaps || !n || n._raw || !n.axes) return null;
	let r = {}, i = n.axes;
	for (let e = 0; e < t.segmentMaps.length && e < i.length; e++) {
		let n = t.segmentMaps[e];
		if (!n.axisValueMaps || n.axisValueMaps.length === 0) continue;
		let a = n.axisValueMaps;
		(a.length !== 3 || a[0].fromCoordinate !== -1 || a[0].toCoordinate !== -1 || a[1].fromCoordinate !== 0 || a[1].toCoordinate !== 0 || a[2].fromCoordinate !== 1 || a[2].toCoordinate !== 1) && (r[i[e].axisTag] = a.map((e) => ({
			from: e.fromCoordinate,
			to: e.toCoordinate
		})));
	}
	return Object.keys(r).length > 0 ? r : null;
}
function lt(e) {
	let t = e.STAT, n = e.fvar;
	if (!t || t._raw) return null;
	let r = t.designAxes || [], i = n?.axes || [], a = {};
	return t.elidedFallbackNameID !== void 0 && (a.elidedFallbackName = Le(e.name, t.elidedFallbackNameID) || "Regular"), t.axisValues && t.axisValues.length > 0 && (a.values = t.axisValues.map((t) => {
		let n = (e) => e < r.length ? r[e].axisTag : e < i.length ? i[e].axisTag : `axis${e}`, a = {
			name: Le(e.name, t.valueNameID) || "",
			flags: t.flags
		};
		switch (t.format) {
			case 1: return {
				...a,
				axis: n(t.axisIndex),
				value: t.value
			};
			case 2: return {
				...a,
				axis: n(t.axisIndex),
				range: [
					t.rangeMinValue,
					t.nominalValue,
					t.rangeMaxValue
				]
			};
			case 3: return {
				...a,
				axis: n(t.axisIndex),
				value: t.value,
				linkedValue: t.linkedValue
			};
			case 4: {
				let e = {};
				for (let r of t.axisValues) e[n(r.axisIndex)] = r.value;
				return {
					...a,
					values: e
				};
			}
			default: return {
				...a,
				_raw: t
			};
		}
	})), a;
}
function ut(e) {
	let t = e.MVAR, n = e.fvar;
	if (!t || t._raw || !t.itemVariationStore || !n || n._raw || !n.axes) return null;
	let r = t.itemVariationStore, i = r.variationRegionList, a = n.axes, o = i.regions.map((e) => {
		let t = {};
		for (let n = 0; n < e.regionAxes.length && n < a.length; n++) {
			let r = e.regionAxes[n];
			(r.startCoord !== 0 || r.peakCoord !== 0 || r.endCoord !== 0) && (t[a[n].axisTag] = [
				r.startCoord,
				r.peakCoord,
				r.endCoord
			]);
		}
		return { axes: t };
	}), s = {};
	for (let e of t.valueRecords) {
		let t = ot[e.valueTag] || e.valueTag, n = e.deltaSetOuterIndex, i = e.deltaSetInnerIndex, a = r.itemVariationData[n];
		if (!a || i >= a.deltaSets.length) continue;
		let o = a.deltaSets[i], c = [];
		for (let e = 0; e < a.regionIndexes.length; e++) {
			let t = o[e];
			t !== 0 && c.push({
				region: a.regionIndexes[e],
				delta: t
			});
		}
		c.length > 0 && (s[t] = c);
	}
	return Object.keys(s).length === 0 ? null : {
		regions: o,
		metrics: s
	};
}
var dt = Date.UTC(1904, 0, 1, 0, 0, 0);
function ft(e) {
	if (e == null) return;
	let t = typeof e == "bigint" ? e : BigInt(e);
	if (t === 0n) return;
	let n = Number(t) * 1e3 + dt;
	if (!(!Number.isFinite(n) || n < -864e13 || n > 864e13)) return new Date(n).toISOString();
}
function pt(e) {
	if (!e) return 0n;
	let t = Date.parse(e);
	return isNaN(t) ? 0n : BigInt(Math.floor((t - dt) / 1e3));
}
var mt = /* @__PURE__ */ new Set([
	1,
	2,
	3,
	4,
	8
]);
function ht(e, t) {
	let n = [], r = [];
	if (!e.featureList || !e.lookupList) return {
		substitutions: n,
		rawLookups: r
	};
	let i = Ct(e), a = e.lookupList.lookups, o = /* @__PURE__ */ new Set(), s = St(a);
	for (let e = 0; e < a.length; e++) {
		let r = a[e];
		if (!r) continue;
		let c = i.lookupToFeatures.get(e) || [], l = wt(c), u = l.length ? l : [{
			featureTag: "DFLT",
			script: "DFLT",
			language: null,
			allScripts: void 0
		}];
		if (r.lookupType === 5 || r.lookupType === 6) {
			let i = !0, s = [], c = /* @__PURE__ */ new Set();
			for (let n of u) {
				let o = gt(r, e, a, t, n);
				if (!o) {
					i = !1;
					break;
				}
				s.push(...o.rules);
				for (let e of o.usedHelpers) c.add(e);
			}
			if (i) {
				n.push(...s), o.add(e);
				for (let e of c) o.add(e);
			}
			continue;
		}
		if (mt.has(r.lookupType) && (!s.has(e) || c.length > 0)) {
			for (let i of l) {
				let a = Et(r, t, i.featureTag, i.script, i.language, i.allScripts, e);
				n.push(...a);
			}
			if (l.length === 0) {
				let i = Et(r, t, "DFLT", "DFLT", null, void 0, e);
				n.push(...i);
			}
			o.add(e);
		}
	}
	for (let e = 0; e < a.length; e++) !o.has(e) && a[e] && r.push({
		index: e,
		lookup: a[e],
		features: i.lookupToFeatures.get(e) || []
	});
	return {
		substitutions: n,
		rawLookups: r
	};
}
function gt(e, t, n, r, i) {
	let a = [], o = /* @__PURE__ */ new Set();
	for (let s of e.subtables || []) {
		let c = yt(s, e.lookupType, r);
		if (!c) return null;
		for (let s of c) {
			let c = [];
			for (let e of s.records) {
				let t = n[e.lookupListIndex];
				if (!t || !mt.has(t.lookupType)) return null;
				let a = Et(t, r, i.featureTag, i.script, i.language, void 0, e.lookupListIndex).map(vt);
				if (a.length === 0) return null;
				c.push({
					at: e.sequenceIndex,
					lookup: _t(t, e.lookupListIndex),
					substitutions: a
				}), o.add(e.lookupListIndex);
			}
			let l = {
				type: "contextual",
				feature: i.featureTag,
				script: i.script,
				language: i.language,
				backtrack: s.backtrack,
				input: s.input,
				lookahead: s.lookahead,
				actions: c,
				lookup: _t(e, t)
			};
			i.allScripts && (l.allScripts = i.allScripts), a.push(l);
		}
	}
	return {
		rules: a,
		usedHelpers: o
	};
}
function _t(e, t) {
	let n = {
		id: t,
		flags: e.lookupFlag || 0
	};
	return e.markFilteringSet !== void 0 && (n.markFilteringSet = e.markFilteringSet), e.useExtension && (n.useExtension = !0), n;
}
function vt(e) {
	let { feature: t, script: n, language: r, allScripts: i, lookup: a, ...o } = e;
	return o;
}
function yt(e, t, n) {
	let r = {
		backtrack: [],
		lookahead: []
	};
	if (t === 5 && e.format === 1) {
		let t = M(e.coverage), i = [];
		for (let a = 0; a < (e.seqRuleSets || []).length; a++) for (let o of e.seqRuleSets[a] || []) i.push({
			...r,
			input: [[N(n, t[a])], ...o.inputSequence.map((e) => [N(n, e)])],
			records: o.seqLookupRecords || []
		});
		return i;
	}
	if (t === 5 && e.format === 2) {
		let t = bt(e.classDef, n), i = new Set(M(e.coverage)), a = [];
		for (let o = 0; o < (e.classSeqRuleSets || []).length; o++) for (let s of e.classSeqRuleSets[o] || []) a.push({
			...r,
			input: [(t.get(o) || []).filter((e) => i.has(xt(n, e))), ...s.inputSequence.map((e) => t.get(e) || [])],
			records: s.seqLookupRecords || []
		});
		return a;
	}
	if (t === 5 && e.format === 3) return [{
		...r,
		input: e.coverages.map((e) => M(e).map((e) => N(n, e))),
		records: e.seqLookupRecords || []
	}];
	if (t === 6 && e.format === 1) {
		let t = M(e.coverage), r = [];
		for (let i = 0; i < (e.chainedSeqRuleSets || []).length; i++) for (let a of e.chainedSeqRuleSets[i] || []) r.push({
			backtrack: a.backtrackSequence.map((e) => [N(n, e)]),
			input: [[N(n, t[i])], ...a.inputSequence.map((e) => [N(n, e)])],
			lookahead: a.lookaheadSequence.map((e) => [N(n, e)]),
			records: a.seqLookupRecords || []
		});
		return r;
	}
	if (t === 6 && e.format === 2) {
		let t = bt(e.backtrackClassDef, n), r = bt(e.inputClassDef, n), i = bt(e.lookaheadClassDef, n), a = new Set(M(e.coverage)), o = [];
		for (let s = 0; s < (e.chainedClassSeqRuleSets || []).length; s++) for (let c of e.chainedClassSeqRuleSets[s] || []) o.push({
			backtrack: c.backtrackSequence.map((e) => t.get(e) || []),
			input: [(r.get(s) || []).filter((e) => a.has(xt(n, e))), ...c.inputSequence.map((e) => r.get(e) || [])],
			lookahead: c.lookaheadSequence.map((e) => i.get(e) || []),
			records: c.seqLookupRecords || []
		});
		return o;
	}
	return t === 6 && e.format === 3 ? [{
		backtrack: e.backtrackCoverages.map((e) => M(e).map((e) => N(n, e))),
		input: e.inputCoverages.map((e) => M(e).map((e) => N(n, e))),
		lookahead: e.lookaheadCoverages.map((e) => M(e).map((e) => N(n, e))),
		records: e.seqLookupRecords || []
	}] : null;
}
function bt(e, t) {
	let n = Qe(e, t.length), r = /* @__PURE__ */ new Map();
	for (let e = 0; e < t.length; e++) {
		let i = n.get(e) ?? 0;
		r.has(i) || r.set(i, []), r.get(i).push(N(t, e));
	}
	return r;
}
function xt(e, t) {
	return e.findIndex((e) => e.name === t);
}
function St(e) {
	let t = /* @__PURE__ */ new Set(), n = (e) => {
		for (let n of e || []) t.add(n.lookupListIndex);
	};
	for (let t of e) if (t?.lookupType === 5 || t?.lookupType === 6) for (let e of t.subtables || []) {
		n(e.seqLookupRecords);
		for (let t of [
			"seqRuleSets",
			"classSeqRuleSets",
			"chainedSeqRuleSets",
			"chainedClassSeqRuleSets"
		]) for (let r of e[t] || []) for (let e of r || []) n(e.seqLookupRecords);
	}
	return t;
}
function Ct(e) {
	let t = /* @__PURE__ */ new Map(), n = e.scriptList?.scriptRecords || [], r = e.featureList?.featureRecords || [];
	for (let e of n) {
		let n = e.scriptTag, i = e.script;
		i.defaultLangSys && Tt(i.defaultLangSys, n, null, r, t);
		for (let e of i.langSysRecords || []) Tt(e.langSys, n, e.langSysTag, r, t);
	}
	return { lookupToFeatures: t };
}
function wt(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) t.has(n.featureTag) ? t.get(n.featureTag).allScripts.push({
		script: n.script,
		language: n.language
	}) : t.set(n.featureTag, {
		featureTag: n.featureTag,
		script: n.script,
		language: n.language,
		allScripts: [{
			script: n.script,
			language: n.language
		}]
	});
	return Array.from(t.values());
}
function Tt(e, t, n, r, i) {
	for (let a of e.featureIndices || []) {
		let e = r[a];
		if (e) for (let r of e.feature.lookupListIndices || []) {
			i.has(r) || i.set(r, []);
			let a = i.get(r);
			a.some((r) => r.featureTag === e.featureTag && r.script === t && r.language === n) || a.push({
				featureTag: e.featureTag,
				script: t,
				language: n
			});
		}
	}
}
function Et(e, t, n, r, i, a, o) {
	let s = [], c = {
		feature: n,
		script: r,
		language: i,
		lookup: _t(e, o)
	};
	a && (c.allScripts = a);
	for (let n of e.subtables || []) switch (e.lookupType) {
		case 1:
			Dt(n, t, c, s);
			break;
		case 2:
			Ot(n, t, c, s);
			break;
		case 3:
			kt(n, t, c, s);
			break;
		case 4:
			At(n, t, c, s);
			break;
		case 8: jt(n, t, c, s);
	}
	return s;
}
function N(e, t) {
	return e[t]?.name || `glyph${t}`;
}
function Dt(e, t, n, r) {
	let i = M(e.coverage);
	if (e.format === 1) for (let a of i) {
		let i = a + e.deltaGlyphID & 65535;
		r.push({
			type: "single",
			...n,
			from: N(t, a),
			to: N(t, i)
		});
	}
	else if (e.format === 2) for (let a = 0; a < i.length; a++) r.push({
		type: "single",
		...n,
		from: N(t, i[a]),
		to: N(t, e.substituteGlyphIDs[a])
	});
}
function Ot(e, t, n, r) {
	let i = M(e.coverage);
	for (let a = 0; a < i.length; a++) r.push({
		type: "multiple",
		...n,
		from: N(t, i[a]),
		to: (e.sequences[a] || []).map((e) => N(t, e))
	});
}
function kt(e, t, n, r) {
	let i = M(e.coverage);
	for (let a = 0; a < i.length; a++) r.push({
		type: "alternate",
		...n,
		from: N(t, i[a]),
		alternates: (e.alternateSets[a] || []).map((e) => N(t, e))
	});
}
function At(e, t, n, r) {
	let i = M(e.coverage);
	for (let a = 0; a < i.length; a++) {
		let o = e.ligatureSets[a] || [];
		for (let e of o) {
			let o = [N(t, i[a]), ...e.componentGlyphIDs.map((e) => N(t, e))];
			r.push({
				type: "ligature",
				...n,
				components: o,
				ligature: N(t, e.ligatureGlyph)
			});
		}
	}
}
function jt(e, t, n, r) {
	let i = M(e.coverage);
	for (let a = 0; a < i.length; a++) r.push({
		type: "reverse",
		...n,
		from: N(t, i[a]),
		to: N(t, e.substituteGlyphIDs[a]),
		backtrack: (e.backtrackCoverages || []).map((e) => M(e).map((e) => N(t, e))),
		lookahead: (e.lookaheadCoverages || []).map((e) => M(e).map((e) => N(t, e)))
	});
}
function Mt(e) {
	let n = e.CPAL;
	return !n || n._raw || !n.palettes ? null : n.palettes.map((e) => e.map((e) => t(e)));
}
function Nt(e, t) {
	let n = e.COLR;
	if (!n || n._raw) return null;
	let r = a(t), i = [];
	if (n.baseGlyphRecords) for (let e of n.baseGlyphRecords) {
		let t = r.get(e.glyphID) ?? String(e.glyphID), a = [];
		for (let t = 0; t < e.numLayers; t++) {
			let i = n.layerRecords[e.firstLayerIndex + t];
			i && a.push({
				glyph: r.get(i.glyphID) ?? String(i.glyphID),
				paletteIndex: i.paletteIndex
			});
		}
		i.push({
			name: t,
			layers: a
		});
	}
	if (n.baseGlyphPaintRecords) for (let e of n.baseGlyphPaintRecords) {
		let t = r.get(e.glyphID) ?? String(e.glyphID), n = i.findIndex((e) => e.name === t), a = structuredClone(e.paint);
		s(a, r), n >= 0 ? i[n].paint = a : i.push({
			name: t,
			paint: a
		});
	}
	return i;
}
//#endregion
//#region src/convert.js
var Pt = 65536, Ft = 1330926671, It = [
	"CFF ",
	"CFF2",
	"VORG"
], Lt = [
	"glyf",
	"loca",
	"cvt ",
	"fpgm",
	"prep",
	"gasp",
	"hdmx",
	"LTSH",
	"VDMX",
	"gvar",
	"cvar"
];
function Rt(e, t) {
	if (!e || typeof e != "object") throw TypeError("convertOutlines expects a font data object");
	if (t !== "truetype" && t !== "cff") throw Error(`convertOutlines: target must be 'truetype' or 'cff', got '${t}'`);
	if (e.collection && Array.isArray(e.fonts)) throw Error("Outline conversion is not supported for font collections.");
	if (zt(e) === t) return e;
	if (!Array.isArray(e.glyphs)) throw Error("Outline conversion requires simplified glyph data ({ font, glyphs }).");
	let n = e.tables || {};
	if (e.axes?.length || n.fvar || n.gvar || n.CFF2) throw Error("Outline conversion is not supported for variable fonts (fvar/gvar/CFF2).");
	let r = t === "truetype" ? Bt(e) : Ht(e);
	return n.maxp && (r._sourceGlyphNames = e._sourceGlyphNames || Ge(n, n.maxp.numGlyphs)), r;
}
function zt(e) {
	let t = e.tables || {};
	if (t["CFF "] || t.CFF2) return "cff";
	if (t.glyf) return "truetype";
	let n = e.glyphs || [];
	if (n.some((e) => e.components && e.components.length > 0)) return "truetype";
	let r = 0, i = 0;
	for (let e of n) e.charString ? r++ : e.contours && e.contours.length > 0 && !Kt(e.contours) && i++;
	return r > 0 && r >= i ? "cff" : "truetype";
}
function Bt(e) {
	return Yt(e, {
		glyphs: e.glyphs.map((e) => {
			let t = { ...e };
			return delete t.charString, delete t.charStringDisassembly, delete t.components, t.contours = Kt(e.contours) ? e.contours.map(Vt) : Array.isArray(e.contours) ? e.contours : [], t.leftSideBearing = Gt(t.contours), t;
		}),
		tables: qt(e.tables, It),
		_header: Jt(e._header, Pt)
	});
}
function Vt(e) {
	if (!Array.isArray(e) || e.length === 0) return [];
	let t = [], n = 0, r = 0;
	for (let i of e) switch (i.type) {
		case "M":
		case "L":
			t.push({
				x: P(i.x),
				y: P(i.y),
				onCurve: !0
			}), n = i.x, r = i.y;
			break;
		case "Q":
			t.push({
				x: P(i.x1),
				y: P(i.y1),
				onCurve: !1
			}), t.push({
				x: P(i.x),
				y: P(i.y),
				onCurve: !0
			}), n = i.x, r = i.y;
			break;
		case "C": {
			let e = x(n, r, i.x1, i.y1, i.x2, i.y2, i.x, i.y);
			for (let n of e) t.push({
				x: P(n.cx),
				y: P(n.cy),
				onCurve: !1
			}), t.push({
				x: P(n.x),
				y: P(n.y),
				onCurve: !0
			});
			n = i.x, r = i.y;
			break;
		}
	}
	return t;
}
function Ht(e) {
	let t = e.glyphs;
	return Yt(e, {
		glyphs: t.map((e) => {
			let n = { ...e };
			delete n.instructions, delete n.components;
			let r = te(t, e).map(Ut).filter((e) => e.length > 0);
			return n.contours = r, n.charString = d(r, Number.isFinite(e.advanceWidth) ? e.advanceWidth : void 0), n;
		}),
		tables: qt(e.tables, Lt),
		_header: Jt(e._header, Ft),
		cvt: void 0,
		fpgm: void 0,
		prep: void 0,
		gasp: void 0
	});
}
function Ut(e) {
	if (!Array.isArray(e) || e.length === 0) return [];
	let t = e.length, n, r = e.findIndex((e) => e.onCurve);
	if (r === -1) {
		let r = e[t - 1], i = e[0];
		n = [{
			x: (r.x + i.x) / 2,
			y: (r.y + i.y) / 2,
			onCurve: !0
		}, ...e];
	} else {
		n = [];
		for (let i = 0; i < t; i++) n.push(e[(r + i) % t]);
	}
	let i = [];
	for (let e = 0; e < n.length; e++) {
		let t = n[e];
		i.push(t);
		let r = n[(e + 1) % n.length];
		!t.onCurve && !r.onCurve && i.push({
			x: (t.x + r.x) / 2,
			y: (t.y + r.y) / 2,
			onCurve: !0
		});
	}
	let a = i[0], o = [{
		type: "M",
		x: P(a.x),
		y: P(a.y)
	}], s = a.x, c = a.y, l = i.length, u = 1;
	for (; u < l;) {
		let e = i[u];
		if (e.onCurve) o.push({
			type: "L",
			x: P(e.x),
			y: P(e.y)
		}), s = e.x, c = e.y, u++;
		else {
			let t = i[(u + 1) % l];
			o.push(Wt(s, c, e.x, e.y, t.x, t.y)), s = t.x, c = t.y, u += 2;
		}
	}
	return o;
}
function Wt(e, t, n, r, i, a) {
	let o = e + 2 / 3 * (n - e), s = t + 2 / 3 * (r - t), c = i + 2 / 3 * (n - i), l = a + 2 / 3 * (r - a);
	return {
		type: "C",
		x1: P(o),
		y1: P(s),
		x2: P(c),
		y2: P(l),
		x: P(i),
		y: P(a)
	};
}
function P(e) {
	return Math.round(e);
}
function Gt(e) {
	let t = Infinity;
	for (let n of e) for (let e of n) e.x < t && (t = e.x);
	return t === Infinity ? 0 : t;
}
function Kt(e) {
	return Array.isArray(e) && e.length > 0 && Array.isArray(e[0]) && e[0].length > 0 && typeof e[0][0]?.type == "string";
}
function qt(e, t) {
	let n = {};
	if (!e) return n;
	let r = new Set(t);
	for (let [t, i] of Object.entries(e)) r.has(t) || (n[t] = i);
	return n;
}
function Jt(e, t) {
	return e ? {
		...e,
		sfVersion: t
	} : { sfVersion: t };
}
function Yt(e, t) {
	let n = {
		...e,
		...t
	};
	for (let e of Object.keys(t)) t[e] === void 0 && delete n[e];
	return n;
}
//#endregion
//#region src/layout_remap.js
function Xt(e, t, n) {
	let r = structuredClone(e), i = (e) => {
		let r = n.get(e);
		if (r === void 0) throw Error(`${t} references removed glyph ${e}.`);
		return r;
	}, a = () => {
		throw Error(`Glyph topology changes require unsupported reference remapping in ${t}.`);
	};
	if ((r._raw || r.featureVariations || r.itemVariationStore) && a(), t === "COLR") {
		r.version !== 0 && a();
		for (let e of [...r.baseGlyphRecords, ...r.layerRecords]) e.glyphID = i(e.glyphID);
		return r.baseGlyphRecords.sort((e, t) => e.glyphID - t.glyphID), r;
	}
	let o = (e, n) => {
		let r = -1, i = 0;
		for (let n of e) {
			if (!Number.isInteger(n.startGlyphID) || !Number.isInteger(n.endGlyphID) || n.startGlyphID <= r || n.endGlyphID < n.startGlyphID || n.endGlyphID > 65535) throw Error(`${t} has invalid glyph ranges.`);
			if (i += n.endGlyphID - n.startGlyphID + 1, i > 65536) throw Error(`${t} glyph ranges exceed the glyph limit.`);
			r = n.endGlyphID;
		}
		return e.flatMap((e) => Array.from({ length: e.endGlyphID - e.startGlyphID + 1 }, (t, r) => n(e.startGlyphID + r, e)));
	}, s = (e) => e.format === 1 ? e.glyphs : o(e.ranges, (e) => e), c = (e, t) => {
		let n = s(e.coverage).map((e, t) => ({
			glyph: i(e),
			index: t
		})).sort((e, t) => e.glyph - t.glyph);
		t && (e[t] = n.map(({ index: n }) => e[t][n])), e.coverage = {
			format: 1,
			glyphs: n.map(({ glyph: e }) => e)
		};
	}, l = (e) => e && {
		format: 2,
		ranges: (e.format === 1 ? e.classValues.map((t, n) => [e.startGlyphID + n, t]) : o(e.ranges, (e, t) => [e, t.class])).filter(([e, t]) => t && n.has(e)).map(([e, t]) => ({
			startGlyphID: i(e),
			endGlyphID: i(e),
			class: t
		})).sort((e, t) => e.startGlyphID - t.startGlyphID)
	};
	if (t === "GDEF") {
		for (let e of ["glyphClassDef", "markAttachClassDef"]) r[e] && (r[e] = l(r[e]));
		return (r.attachList || r.ligCaretList) && a(), r.markGlyphSetsDef && (r.markGlyphSetsDef.coverages = r.markGlyphSetsDef.coverages.map((e) => {
			let t = { coverage: e };
			return c(t), t.coverage;
		})), r;
	}
	let u = (e, n) => {
		if (n === (t === "GSUB" ? 7 : 9)) {
			e.extensionLookupType === n && a(), u(e.subtable, e.extensionLookupType);
			return;
		}
		if (t === "GSUB") {
			if (n === 1) e.format === 1 && (e.substituteGlyphIDs = s(e.coverage).map((t) => t + e.deltaGlyphID & 65535), e.format = 2, delete e.deltaGlyphID), e.substituteGlyphIDs = e.substituteGlyphIDs.map(i), c(e, "substituteGlyphIDs");
			else if (n === 2 || n === 3) {
				let t = n === 2 ? "sequences" : "alternateSets";
				e[t] = e[t].map((e) => e.map(i)), c(e, t);
			} else if (n === 4) {
				for (let t of e.ligatureSets) for (let e of t) e.ligatureGlyph = i(e.ligatureGlyph), e.componentGlyphIDs = e.componentGlyphIDs.map(i);
				c(e, "ligatureSets");
			} else a();
		} else if (n === 1) c(e, e.format === 2 ? "valueRecords" : void 0);
		else if (n === 2 && e.format === 1) {
			for (let t of e.pairSets) {
				for (let e of t) e.secondGlyph = i(e.secondGlyph);
				t.sort((e, t) => e.secondGlyph - t.secondGlyph);
			}
			c(e, "pairSets");
		} else n === 2 && e.format === 2 ? (e.classDef1 = l(e.classDef1), e.classDef2 = l(e.classDef2), c(e)) : a();
	};
	for (let e of r.lookupList.lookups) for (let t of e.subtables) u(t, e.lookupType);
	return r;
}
//#endregion
//#region src/reader.js
var F = class {
	constructor(e, t = 0) {
		let n = e instanceof Uint8Array ? e : new Uint8Array(e);
		this._view = new DataView(n.buffer, n.byteOffset, n.byteLength), this._pos = t;
	}
	get position() {
		return this._pos;
	}
	get length() {
		return this._view.byteLength;
	}
	get view() {
		return this._view;
	}
	seek(e) {
		return this._pos = e, this;
	}
	skip(e) {
		return this._pos += e, this;
	}
	uint8() {
		let e = this._view.getUint8(this._pos);
		return this._pos += 1, e;
	}
	uint16() {
		let e = this._view.getUint16(this._pos);
		return this._pos += 2, e;
	}
	uint24() {
		let e = this._view.getUint8(this._pos) << 16 | this._view.getUint8(this._pos + 1) << 8 | this._view.getUint8(this._pos + 2);
		return this._pos += 3, e;
	}
	uint32() {
		let e = this._view.getUint32(this._pos);
		return this._pos += 4, e;
	}
	int8() {
		let e = this._view.getInt8(this._pos);
		return this._pos += 1, e;
	}
	int16() {
		let e = this._view.getInt16(this._pos);
		return this._pos += 2, e;
	}
	int32() {
		let e = this._view.getInt32(this._pos);
		return this._pos += 4, e;
	}
	tag() {
		let e = String.fromCharCode(this._view.getUint8(this._pos), this._view.getUint8(this._pos + 1), this._view.getUint8(this._pos + 2), this._view.getUint8(this._pos + 3));
		return this._pos += 4, e;
	}
	offset16() {
		return this.uint16();
	}
	offset32() {
		return this.uint32();
	}
	fixed() {
		let e = this._view.getInt32(this._pos);
		return this._pos += 4, e / 65536;
	}
	fword() {
		return this.int16();
	}
	ufword() {
		return this.uint16();
	}
	f2dot14() {
		let e = this._view.getInt16(this._pos);
		return this._pos += 2, e / 16384;
	}
	longDateTime() {
		let e = this._view.getInt32(this._pos), t = this._view.getUint32(this._pos + 4);
		return this._pos += 8, BigInt(e) << 32n | BigInt(t);
	}
	array(e, t) {
		let n = [], r = this[e].bind(this);
		for (let e = 0; e < t; e++) n.push(r());
		return n;
	}
	bytes(e) {
		let t = [];
		for (let n = 0; n < e; n++) t.push(this._view.getUint8(this._pos + n));
		return this._pos += e, t;
	}
}, I = class {
	constructor(e) {
		this._buffer = new ArrayBuffer(e), this._view = new DataView(this._buffer), this._bytes = new Uint8Array(this._buffer), this._pos = 0;
	}
	get position() {
		return this._pos;
	}
	get length() {
		return this._buffer.byteLength;
	}
	get view() {
		return this._view;
	}
	get bytes() {
		return this._bytes;
	}
	seek(e) {
		return this._pos = e, this;
	}
	skip(e) {
		return this._pos += e, this;
	}
	uint8(e) {
		return this._view.setUint8(this._pos, e), this._pos += 1, this;
	}
	uint16(e) {
		return this._view.setUint16(this._pos, e), this._pos += 2, this;
	}
	uint24(e) {
		return this._view.setUint8(this._pos, e >> 16 & 255), this._view.setUint8(this._pos + 1, e >> 8 & 255), this._view.setUint8(this._pos + 2, e & 255), this._pos += 3, this;
	}
	uint32(e) {
		return this._view.setUint32(this._pos, e), this._pos += 4, this;
	}
	int8(e) {
		return this._view.setInt8(this._pos, e), this._pos += 1, this;
	}
	int16(e) {
		return this._view.setInt16(this._pos, e), this._pos += 2, this;
	}
	int32(e) {
		return this._view.setInt32(this._pos, e), this._pos += 4, this;
	}
	tag(e) {
		for (let t = 0; t < 4; t++) this._view.setUint8(this._pos + t, e.charCodeAt(t));
		return this._pos += 4, this;
	}
	offset16(e) {
		return this.uint16(e);
	}
	offset32(e) {
		return this.uint32(e);
	}
	fixed(e) {
		return this._view.setInt32(this._pos, Math.round(e * 65536)), this._pos += 4, this;
	}
	fword(e) {
		return this.int16(e);
	}
	ufword(e) {
		return this.uint16(e);
	}
	f2dot14(e) {
		return this._view.setInt16(this._pos, Math.round(e * 16384)), this._pos += 2, this;
	}
	longDateTime(e) {
		let t = BigInt(e);
		return this._view.setInt32(this._pos, Number(t >> 32n)), this._view.setUint32(this._pos + 4, Number(t & 4294967295n)), this._pos += 8, this;
	}
	array(e, t) {
		let n = this[e].bind(this);
		for (let e of t) n(e);
		return this;
	}
	rawBytes(e) {
		let t = e instanceof Uint8Array ? e : new Uint8Array(e);
		return this._bytes.set(t, this._pos), this._pos += t.length, this;
	}
	toArray() {
		return Array.from(this._bytes);
	}
};
//#endregion
//#region src/sfnt/table_cmap.js
function Zt(e) {
	let t = new F(e), n = t.uint16(), r = t.uint16(), i = [], a = /* @__PURE__ */ new Set();
	for (let e = 0; e < r; e++) {
		let e = t.uint16(), n = t.uint16(), r = t.offset32();
		a.add(r), i.push({
			platformID: e,
			encodingID: n,
			subtableOffset: r
		});
	}
	let o = [...a].sort((e, t) => e - t), s = o.map((e) => Qt(t, e)), c = new Map(o.map((e, t) => [e, t]));
	return {
		version: n,
		encodingRecords: i.map((e) => ({
			platformID: e.platformID,
			encodingID: e.encodingID,
			subtableIndex: c.get(e.subtableOffset)
		})),
		subtables: s
	};
}
function Qt(e, t) {
	e.seek(t);
	let n = e.uint16();
	switch (n) {
		case 0: return $t(e);
		case 2: return en(e, t);
		case 4: return tn(e, t);
		case 6: return nn(e);
		case 8: return ln(e);
		case 10: return un(e);
		case 12: return rn(e);
		case 13: return an(e);
		case 14: return on(e, t);
		default: return dn(e, t, n);
	}
}
function $t(e) {
	return e.skip(2), {
		format: 0,
		language: e.uint16(),
		glyphIdArray: e.array("uint8", 256)
	};
}
function en(e, t) {
	let n = e.uint16(), r = e.uint16(), i = e.array("uint16", 256), a = 0;
	for (let e = 0; e < 256; e++) i[e] > a && (a = i[e]);
	let o = a / 8 + 1, s = [];
	for (let t = 0; t < o; t++) s.push({
		firstCode: e.uint16(),
		entryCount: e.uint16(),
		idDelta: e.int16(),
		idRangeOffset: e.uint16()
	});
	let c = e.position, l = (t + n - c) / 2;
	return {
		format: 2,
		language: r,
		subHeaderKeys: i,
		subHeaders: s,
		glyphIdArray: e.array("uint16", l)
	};
}
function tn(e, t) {
	let n = e.uint16(), r = e.uint16(), i = e.uint16() / 2;
	if (n < 16 + i * 8 || n % 2 != 0 || t + n > e.length) throw RangeError(`cmap format 4 length ${n} is invalid for ${i} segments or exceeds the cmap table.`);
	e.skip(6);
	let a = e.array("uint16", i);
	e.skip(2);
	let o = e.array("uint16", i), s = e.array("int16", i), c = e.array("uint16", i), l = (n - (e.position - t)) / 2, u = e.array("uint16", l), d = [];
	for (let e = 0; e < i; e++) d.push({
		endCode: a[e],
		startCode: o[e],
		idDelta: s[e],
		idRangeOffset: c[e]
	});
	return {
		format: 4,
		language: r,
		segments: d,
		glyphIdArray: u
	};
}
function nn(e) {
	e.skip(2);
	let t = e.uint16(), n = e.uint16(), r = e.uint16();
	return {
		format: 6,
		language: t,
		firstCode: n,
		glyphIdArray: e.array("uint16", r)
	};
}
function rn(e) {
	e.skip(2), e.skip(4);
	let t = e.uint32(), n = e.uint32(), r = [];
	for (let t = 0; t < n; t++) r.push({
		startCharCode: e.uint32(),
		endCharCode: e.uint32(),
		startGlyphID: e.uint32()
	});
	return {
		format: 12,
		language: t,
		groups: r
	};
}
function an(e) {
	e.skip(2), e.skip(4);
	let t = e.uint32(), n = e.uint32(), r = [];
	for (let t = 0; t < n; t++) r.push({
		startCharCode: e.uint32(),
		endCharCode: e.uint32(),
		glyphID: e.uint32()
	});
	return {
		format: 13,
		language: t,
		groups: r
	};
}
function on(e, t) {
	e.skip(4);
	let n = e.uint32(), r = [];
	for (let i = 0; i < n; i++) {
		let n = e.uint24(), i = e.offset32(), a = e.offset32(), o = null;
		if (i !== 0) {
			let n = e.position;
			o = sn(e, t + i), e.seek(n);
		}
		let s = null;
		if (a !== 0) {
			let n = e.position;
			s = cn(e, t + a), e.seek(n);
		}
		r.push({
			varSelector: n,
			defaultUVS: o,
			nonDefaultUVS: s
		});
	}
	return {
		format: 14,
		varSelectorRecords: r
	};
}
function sn(e, t) {
	e.seek(t);
	let n = e.uint32(), r = [];
	for (let t = 0; t < n; t++) r.push({
		startUnicodeValue: e.uint24(),
		additionalCount: e.uint8()
	});
	return r;
}
function cn(e, t) {
	e.seek(t);
	let n = e.uint32(), r = [];
	for (let t = 0; t < n; t++) r.push({
		unicodeValue: e.uint24(),
		glyphID: e.uint16()
	});
	return r;
}
function ln(e) {
	e.skip(2), e.skip(4);
	let t = e.uint32(), n = e.bytes(8192), r = e.uint32(), i = [];
	for (let t = 0; t < r; t++) i.push({
		startCharCode: e.uint32(),
		endCharCode: e.uint32(),
		startGlyphID: e.uint32()
	});
	return {
		format: 8,
		language: t,
		is32: n,
		groups: i
	};
}
function un(e) {
	e.skip(2), e.skip(4);
	let t = e.uint32(), n = e.uint32(), r = e.uint32();
	return {
		format: 10,
		language: t,
		startCharCode: n,
		glyphIdArray: e.array("uint16", r)
	};
}
function dn(e, t, n) {
	let r;
	return n >= 8 ? (e.skip(2), r = e.uint32()) : r = e.uint16(), e.seek(t), {
		format: n,
		_raw: e.bytes(r)
	};
}
function fn(e) {
	let { version: t, encodingRecords: n, subtables: r } = e, i = n.map((e, t) => ({
		rec: e,
		originalIndex: t
	})).sort((e, t) => e.rec.platformID === t.rec.platformID ? e.rec.encodingID === t.rec.encodingID ? ((r[e.rec.subtableIndex] || {}).language || 0) - ((r[t.rec.subtableIndex] || {}).language || 0) : e.rec.encodingID - t.rec.encodingID : e.rec.platformID - t.rec.platformID).map(({ rec: e }) => e), a = r.map(pn), o = 4 + i.length * 8, s = [], c = o;
	for (let e of a) s.push(c), c += e.length;
	let l = new I(c);
	l.uint16(t), l.uint16(i.length);
	for (let e of i) l.uint16(e.platformID), l.uint16(e.encodingID), l.offset32(s[e.subtableIndex]);
	for (let e = 0; e < a.length; e++) l.seek(s[e]), l.rawBytes(a[e]);
	return l.toArray();
}
function pn(e) {
	switch (e.format) {
		case 0: return mn(e);
		case 2: return hn(e);
		case 4: return _n(e);
		case 6: return vn(e);
		case 8: return yn(e);
		case 10: return bn(e);
		case 12: return xn(e);
		case 13: return Sn(e);
		case 14: return Cn(e);
		default: return e._raw;
	}
}
function mn(e) {
	let t = new I(262);
	return t.uint16(0), t.uint16(262), t.uint16(e.language), t.array("uint8", e.glyphIdArray), t.toArray();
}
function hn(e) {
	let { language: t, subHeaderKeys: n, subHeaders: r, glyphIdArray: i } = e, a = 518 + r.length * 8 + i.length * 2, o = new I(a);
	o.uint16(2), o.uint16(a), o.uint16(t), o.array("uint16", n);
	for (let e of r) o.uint16(e.firstCode), o.uint16(e.entryCount), o.int16(e.idDelta), o.uint16(e.idRangeOffset);
	return o.array("uint16", i), o.toArray();
}
function gn(e) {
	return 16 + e.segments.length * 8 + e.glyphIdArray.length * 2;
}
function _n(e) {
	let { language: t, segments: n, glyphIdArray: r } = e, i = n.length, a = i * 2, o = gn(e);
	if (o > 65535) throw RangeError(`cmap format 4 length ${o} exceeds the uint16 limit of 65535 bytes.`);
	let s = Math.floor(Math.log2(i)), c = 2 ** s * 2, l = a - c, u = new I(o);
	u.uint16(4), u.uint16(o), u.uint16(t), u.uint16(a), u.uint16(c), u.uint16(s), u.uint16(l);
	for (let e of n) u.uint16(e.endCode);
	u.uint16(0);
	for (let e of n) u.uint16(e.startCode);
	for (let e of n) u.int16(e.idDelta);
	for (let e of n) u.uint16(e.idRangeOffset);
	return u.array("uint16", r), u.toArray();
}
function vn(e) {
	let { language: t, firstCode: n, glyphIdArray: r } = e, i = r.length, a = 10 + i * 2, o = new I(a);
	return o.uint16(6), o.uint16(a), o.uint16(t), o.uint16(n), o.uint16(i), o.array("uint16", r), o.toArray();
}
function yn(e) {
	let { language: t, is32: n, groups: r } = e, i = 8208 + r.length * 12, a = new I(i);
	a.uint16(8), a.uint16(0), a.uint32(i), a.uint32(t), a.rawBytes(n), a.uint32(r.length);
	for (let e of r) a.uint32(e.startCharCode), a.uint32(e.endCharCode), a.uint32(e.startGlyphID);
	return a.toArray();
}
function bn(e) {
	let { language: t, startCharCode: n, glyphIdArray: r } = e, i = 20 + r.length * 2, a = new I(i);
	return a.uint16(10), a.uint16(0), a.uint32(i), a.uint32(t), a.uint32(n), a.uint32(r.length), a.array("uint16", r), a.toArray();
}
function xn(e) {
	let t = e.groups.length, n = 16 + t * 12, r = new I(n);
	r.uint16(12), r.uint16(0), r.uint32(n), r.uint32(e.language), r.uint32(t);
	for (let t of e.groups) r.uint32(t.startCharCode), r.uint32(t.endCharCode), r.uint32(t.startGlyphID);
	return r.toArray();
}
function Sn(e) {
	let t = e.groups.length, n = 16 + t * 12, r = new I(n);
	r.uint16(13), r.uint16(0), r.uint32(n), r.uint32(e.language), r.uint32(t);
	for (let t of e.groups) r.uint32(t.startCharCode), r.uint32(t.endCharCode), r.uint32(t.glyphID);
	return r.toArray();
}
function Cn(e) {
	let { varSelectorRecords: t } = e, n = t.map((e) => ({
		defaultUVSBytes: e.defaultUVS ? wn(e.defaultUVS) : null,
		nonDefaultUVSBytes: e.nonDefaultUVS ? Tn(e.nonDefaultUVS) : null
	})), r = 10 + t.length * 11, i = n.map((e) => {
		let t = 0;
		e.defaultUVSBytes && (t = r, r += e.defaultUVSBytes.length);
		let n = 0;
		return e.nonDefaultUVSBytes && (n = r, r += e.nonDefaultUVSBytes.length), {
			defaultUVSOffset: t,
			nonDefaultUVSOffset: n
		};
	}), a = r, o = new I(a);
	o.uint16(14), o.uint32(a), o.uint32(t.length);
	for (let e = 0; e < t.length; e++) o.uint24(t[e].varSelector), o.uint32(i[e].defaultUVSOffset), o.uint32(i[e].nonDefaultUVSOffset);
	for (let e = 0; e < n.length; e++) n[e].defaultUVSBytes && o.rawBytes(n[e].defaultUVSBytes), n[e].nonDefaultUVSBytes && o.rawBytes(n[e].nonDefaultUVSBytes);
	return o.toArray();
}
function wn(e) {
	let t = new I(4 + e.length * 4);
	t.uint32(e.length);
	for (let n of e) t.uint24(n.startUnicodeValue), t.uint8(n.additionalCount);
	return t.toArray();
}
function Tn(e) {
	let t = new I(4 + e.length * 5);
	t.uint32(e.length);
	for (let n of e) t.uint24(n.unicodeValue), t.uint16(n.glyphID);
	return t.toArray();
}
//#endregion
//#region src/validate/tables.js
var En = /* @__PURE__ */ "BASE.CBDT.CBLC.COLR.CPAL.DSIG.EBDT.EBLC.EBSC.GDEF.GPOS.GSUB.HVAR.JSTF.LTSH.MATH.MERG.MVAR.OS/2.PCLT.STAT.SVG .VDMX.VVAR.avar.cmap.fvar.hdmx.head.hhea.hmtx.kern.maxp.meta.name.post.sbix.vhea.vmtx".split("."), Dn = [
	"CFF ",
	"CFF2",
	"VORG"
], On = [
	"cvar",
	"cvt ",
	"fpgm",
	"gasp",
	"glyf",
	"gvar",
	"loca",
	"prep"
], kn = /* @__PURE__ */ new Set([
	...En,
	...Dn,
	...On
]), An = [
	"cmap",
	"head",
	"hhea",
	"hmtx",
	"maxp",
	"name",
	"post"
];
//#endregion
//#region src/validate/validateJSON.js
function L(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function jn(e) {
	return Number.isInteger(e) && e >= 0 && e <= 4294967295;
}
function Mn(e) {
	return Array.isArray(e?._raw);
}
function R(e, t, n, r, i) {
	e.push({
		severity: t,
		code: n,
		message: r,
		path: i
	});
}
function Nn(e) {
	let t = e > 0 ? 2 ** Math.floor(Math.log2(e)) : 0, n = t * 16;
	return {
		searchRange: n,
		entrySelector: t > 0 ? Math.floor(Math.log2(t)) : 0,
		rangeShift: e * 16 - n
	};
}
function Pn(e) {
	return L(e) && (e["CFF "] || e.CFF2) ? 1330926671 : 65536;
}
function Fn(e) {
	let t = e.filter((e) => e.severity === "error"), n = e.filter((e) => e.severity === "warning"), r = e.filter((e) => e.severity === "info");
	return {
		valid: t.length === 0,
		errors: t,
		warnings: n,
		infos: r,
		issues: e,
		summary: {
			errorCount: t.length,
			warningCount: n.length,
			infoCount: r.length,
			issueCount: e.length
		}
	};
}
function In(e) {
	let t = [], n = (e, n, r) => R(t, "error", e, n, r), r = (e, t, r, i) => {
		e !== void 0 && (!Number.isInteger(e) || e < t || e > r) && n("NUMBER_OUT_OF_RANGE", `${i} must be an integer from ${t} to ${r}.`, i);
	};
	if (!L(e?.font) || !Array.isArray(e?.glyphs)) return n("SIMPLIFIED_SHAPE_INVALID", "Simplified fonts require a font object and a glyphs array.", "$"), Fn(t);
	r(e.font.unitsPerEm, 16, 16384, "$.font.unitsPerEm");
	let i = /* @__PURE__ */ new WeakSet(), a = 0, o = (e, t, r = 0) => {
		if (++a > 1e7 || r > 64) return n("COMPLEXITY_LIMIT", "Nested authoring data exceeds the complexity limit.", t), !1;
		if (!e || typeof e != "object") return !0;
		if (i.has(e)) return n("CYCLIC_DATA", "Authoring data must not contain cycles.", t), !1;
		i.add(e);
		for (let n of Object.keys(e)) if (!o(e[n], `${t}.${n}`, r + 1)) return !1;
		return i.delete(e), !0;
	};
	for (let n of [
		"substitutions",
		"kerning",
		"kerningClasses",
		"colorGlyphs"
	]) if (!o(e[n], `$.${n}`)) return Fn(t);
	let s = (e, t, r = !1) => {
		e !== void 0 && (!Array.isArray(e) || r && e.some((e) => !L(e))) && n("ARRAY_SHAPE_INVALID", `${t} must be an array${r ? " of objects" : ""}.`, t);
	};
	for (let t of [
		"kerning",
		"kerningClasses",
		"substitutions",
		"axes",
		"instances",
		"colorGlyphs"
	]) s(e[t], `$.${t}`, !0);
	s(e.palettes, "$.palettes");
	for (let [t, n] of (Array.isArray(e.palettes) ? e.palettes : []).entries()) s(n, `$.palettes[${t}]`);
	for (let [t, n] of e.glyphs.entries()) if (L(n)) {
		for (let e of [
			"unicodes",
			"instructions",
			"charString"
		]) s(n[e], `$.glyphs[${t}].${e}`);
		s(n.components, `$.glyphs[${t}].components`, !0);
	}
	for (let [t, n] of (Array.isArray(e.kerningClasses) ? e.kerningClasses : []).entries()) n && s(n.pairs, `$.kerningClasses[${t}].pairs`, !0);
	for (let [t, n] of (Array.isArray(e.colorGlyphs) ? e.colorGlyphs : []).entries()) n && s(n.layers, `$.colorGlyphs[${t}].layers`, !0);
	if (t.length) return Fn(t);
	(e.glyphs.length < 1 || e.glyphs.length > 65535) && n("GLYPH_COUNT_INVALID", "Glyph count must be between 1 and 65535.", "$.glyphs");
	let c = /* @__PURE__ */ new Set();
	for (let [i, a] of e.glyphs.entries()) {
		let o = `$.glyphs[${i}]`;
		if (!L(a)) {
			n("GLYPH_INVALID", "Glyph must be an object.", o);
			continue;
		}
		a.name && c.has(a.name) && R(t, e._header && e.tables ? "warning" : "error", "GLYPH_NAME_DUPLICATE", `Duplicate glyph name: ${a.name}`, `${o}.name`), a.name && c.add(a.name), a.name !== void 0 && typeof a.name != "string" && n("GLYPH_NAME_INVALID", "Glyph name must be a string.", `${o}.name`);
		for (let e of ["instructions", "charString"]) for (let t of a[e] || []) r(t, 0, 255, `${o}.${e}`);
		for (let e of ["advanceWidth", "advanceHeight"]) r(a[e], 0, 65535, `${o}.${e}`);
		for (let e of ["leftSideBearing", "topSideBearing"]) r(a[e], -32768, 32767, `${o}.${e}`);
		let s = [a.unicode, ...Array.isArray(a.unicodes) ? a.unicodes : []];
		for (let e of s) e != null && (r(e, 0, 1114111, `${o}.unicode`), e >= 55296 && e <= 57343 && n("UNICODE_INVALID", "Unicode mappings cannot contain surrogate code points.", `${o}.unicode`));
		a.contours !== void 0 && !Array.isArray(a.contours) && n("CONTOURS_INVALID", "Contours must be an array.", `${o}.contours`);
		for (let e of Array.isArray(a.contours) ? a.contours : []) {
			if (!Array.isArray(e)) {
				n("CONTOUR_INVALID", "Each contour must be an array.", `${o}.contours`);
				continue;
			}
			for (let t of e) {
				if (!L(t)) {
					n("POINT_INVALID", "Contour points must be objects.", `${o}.contours`);
					continue;
				}
				for (let e of [
					"x",
					"y",
					"x1",
					"y1",
					"x2",
					"y2"
				]) t?.[e] !== void 0 && !Number.isFinite(t[e]) && n("COORDINATE_INVALID", "Outline coordinates must be finite numbers.", `${o}.contours`);
				(t.type === "Z" ? [] : t.type === "C" ? [
					"x",
					"y",
					"x1",
					"y1",
					"x2",
					"y2"
				] : t.type === "Q" ? [
					"x",
					"y",
					"x1",
					"y1"
				] : ["x", "y"]).some((e) => !Number.isFinite(t[e])) && n("COORDINATE_INVALID", "Contour points require finite coordinates for their command.", `${o}.contours`);
			}
		}
	}
	let l = /* @__PURE__ */ new Set(), u = /* @__PURE__ */ new Map();
	for (let t of e.glyphs) if (t) for (let e of [t.unicode, ...t.unicodes || []]) e != null && u.set(e, t.name);
	let d = (e, t) => {
		if (Array.isArray(e)) {
			for (let n of e) d(n, t);
			return;
		}
		let r = typeof e == "string" && /^(?:U\+|0x)([0-9a-f]+)$/i.exec(e), i = typeof e == "number" ? u.get(e) : r ? u.get(parseInt(r[1], 16)) : e;
		c.has(i) || n("GLYPH_REFERENCE_INVALID", `Unknown glyph reference: ${String(e)}`, t);
	};
	for (let [t, i] of e.glyphs.entries()) for (let a of i?.components || []) {
		let i = `$.glyphs[${t}].components`;
		a.glyphName == null && a.glyphIndex === void 0 && n("COMPONENT_REFERENCE_MISSING", "Component requires a glyphName or glyphIndex.", i), r(a.glyphIndex, 0, (e.tables?.maxp?.numGlyphs ?? e.glyphs.length) - 1, `${i}.glyphIndex`);
		for (let e of [
			"dx",
			"dy",
			"argument1",
			"argument2"
		]) r(a[e], a.flags?.argsAreXYValues === !1 ? 0 : -32768, a.flags?.argsAreXYValues === !1 ? 65535 : 32767, `${i}.${e}`);
		for (let e of ["scaleXY", "transform"]) a[e] !== void 0 && !L(a[e]) && n("COMPONENT_TRANSFORM_INVALID", "Component transforms must be objects.", `${i}.${e}`);
		for (let e of [
			a.scale,
			...Object.values(a.scaleXY || {}),
			...Object.values(a.transform || {})
		]) e !== void 0 && (!Number.isFinite(e) || e < -2 || e > 32767 / 16384) && n("COMPONENT_TRANSFORM_INVALID", "Component transforms must fit F2DOT14 (-2 to 1.99993896484375).", i);
		a.glyphName != null && d(a.glyphName, `$.glyphs[${t}].components`);
	}
	for (let [t, n] of (e.kerning || []).entries()) d(n.left, `$.kerning[${t}].left`), d(n.right, `$.kerning[${t}].right`), r(n.value, -32768, 32767, `$.kerning[${t}].value`);
	for (let [t, i] of (e.kerningClasses || []).entries()) for (let e of ["left", "right"]) {
		let a = i[`${e}Classes`] || i.classes || {};
		for (let n of Object.values(a)) d(n, `$.kerningClasses[${t}].${e}Classes`);
		for (let o of i.pairs || []) {
			let i = o[e];
			typeof i == "string" && i.startsWith("@") ? a[i.slice(1)] || n("KERNING_CLASS_INVALID", `Unknown kerning class: ${i}`, `$.kerningClasses[${t}]`) : d(i, `$.kerningClasses[${t}]`), r(o.value, -32768, 32767, `$.kerningClasses[${t}].value`);
		}
	}
	let f = (e, t) => {
		if (!L(e)) {
			n("SUBSTITUTION_INVALID", "Substitution must be an object.", t);
			return;
		}
		if (!Array.isArray(e.actions) && e.actions !== void 0) {
			n("SUBSTITUTION_INVALID", "Substitution actions must be an array.", t);
			return;
		}
		for (let n of [
			"from",
			"to",
			"alternates",
			"components",
			"ligature",
			"input",
			"backtrack",
			"lookahead"
		]) e[n] !== void 0 && d(e[n], `${t}.${n}`);
		e.substitution !== void 0 && f(e.substitution, `${t}.substitution`);
		for (let [r, i] of (e.actions || []).entries()) {
			let e = `${t}.actions[${r}]`;
			if (!L(i)) {
				n("SUBSTITUTION_INVALID", "Substitution actions must be objects.", e);
				continue;
			}
			if (i.substitution !== void 0 && f(i.substitution, `${e}.substitution`), i.substitutions !== void 0 && (s(i.substitutions, `${e}.substitutions`, !0), Array.isArray(i.substitutions))) for (let t of i.substitutions) f(t, `${e}.substitutions`);
		}
	};
	for (let [t, n] of (e.substitutions || []).entries()) f(n, `$.substitutions[${t}]`);
	let p = (t, i) => {
		if (!L(t)) {
			n("PAINT_INVALID", "Paint nodes must be objects.", i);
			return;
		}
		t.glyphID !== void 0 && (typeof t.glyphID == "string" ? d(t.glyphID, `${i}.glyphID`) : r(t.glyphID, 0, e.glyphs.length - 1, `${i}.glyphID`)), t.paletteIndex !== void 0 && (r(t.paletteIndex, 0, 65535, `${i}.paletteIndex`), t.paletteIndex !== 65535 && (!e.palettes?.length || e.palettes.some((e) => t.paletteIndex >= e.length)) && n("PALETTE_REFERENCE_INVALID", "Paint references a missing palette entry.", i));
		for (let [e, r] of Object.entries(t)) if (typeof r == "number" && !Number.isFinite(r) && n("PAINT_INVALID", "Paint numeric values must be finite.", `${i}.${e}`), Array.isArray(r)) for (let t of r) t && typeof t == "object" && p(t, `${i}.${e}`);
		else r && typeof r == "object" && p(r, `${i}.${e}`);
	};
	for (let [t, i] of (e.colorGlyphs || []).entries()) {
		d(i.name, `$.colorGlyphs[${t}].name`), i.paint !== void 0 && p(i.paint, `$.colorGlyphs[${t}].paint`);
		for (let a of i.layers || []) d(a.glyph, `$.colorGlyphs[${t}].layers`), r(a.paletteIndex, 0, 65535, `$.colorGlyphs[${t}].paletteIndex`), a.paletteIndex !== 65535 && e.palettes?.some((e) => a.paletteIndex >= e.length) && n("PALETTE_REFERENCE_INVALID", "Color layer references a missing palette entry.", `$.colorGlyphs[${t}].layers`);
	}
	for (let [t, r] of (Array.isArray(e.axes) ? e.axes : []).entries()) {
		let e = `$.axes[${t}]`;
		(!r || typeof r.tag != "string" || !/^[\x20-\x7e]{4}$/.test(r.tag) || l.has(r.tag)) && n("AXIS_TAG_INVALID", "Axis tags must be unique four-character ASCII strings.", `${e}.tag`), l.add(r?.tag), (!r || ![
			r.min,
			r.default,
			r.max
		].every(Number.isFinite) || r.min > r.default || r.default > r.max) && n("AXIS_RANGE_INVALID", "Axes require finite min <= default <= max.", e);
	}
	for (let [t, r] of (e.instances || []).entries()) {
		let i = `$.instances[${t}].coordinates`;
		if (!L(r.coordinates)) {
			n("INSTANCE_COORDINATES_INVALID", "Instance coordinates must be an object.", i);
			continue;
		}
		for (let [t, a] of Object.entries(r.coordinates)) {
			let r = e.axes?.find((e) => e.tag === t);
			(!r || !Number.isFinite(a) || a < r.min || a > r.max) && n("INSTANCE_COORDINATES_INVALID", `Instance coordinate ${t} must reference an axis and lie within its range.`, i);
		}
	}
	return Fn(t);
}
function Ln(e, t, n, r) {
	let i = e.header;
	if (!L(i)) {
		if (L(e._header)) e.header = { ...e._header }, i = e.header, R(r, "info", "HEADER_PROMOTED", "No \"header\" found; promoted \"_header\" for export compatibility.", n);
		else {
			let a = Pn(e.tables);
			e.header = {
				sfVersion: a,
				numTables: t,
				...Nn(t)
			}, i = e.header, R(r, "info", "HEADER_SYNTHESIZED", `No header found; synthesized one (sfVersion=0x${a.toString(16).toUpperCase().padStart(8, "0")}, ${t} tables).`, n);
			return;
		}
	}
	if (!jn(i.sfVersion)) {
		let t = Pn(e.tables);
		i.sfVersion = t, R(r, "info", "HEADER_SFVERSION_INFERRED", `header.sfVersion was missing or invalid; set to 0x${t.toString(16).toUpperCase().padStart(8, "0")} based on outline tables.`, `${n}.sfVersion`);
	}
	if (i.numTables !== void 0 && (!Number.isInteger(i.numTables) || i.numTables < 0) && R(r, "error", "HEADER_NUMTABLES_INVALID", "header.numTables must be a non-negative integer when provided.", `${n}.numTables`), i.numTables !== t) {
		let e = i.numTables;
		i.numTables = t, R(r, "info", "HEADER_NUMTABLES_CORRECTED", e === void 0 ? `header.numTables was missing; set to ${t}.` : `header.numTables corrected from ${e} to ${t}.`, `${n}.numTables`);
	}
	let a = Nn(t);
	(i.searchRange !== a.searchRange || i.entrySelector !== a.entrySelector || i.rangeShift !== a.rangeShift) && (i.searchRange = a.searchRange, i.entrySelector = a.entrySelector, i.rangeShift = a.rangeShift, R(r, "info", "HEADER_FIELDS_CORRECTED", `Header directory fields auto-corrected for ${t} tables (searchRange=${a.searchRange}, entrySelector=${a.entrySelector}, rangeShift=${a.rangeShift}).`, n));
}
function Rn(e, t, n) {
	if (!Array.isArray(e)) {
		R(n, "error", "TABLE_RAW_INVALID_TYPE", "_raw must be an array of byte values.", t);
		return;
	}
	for (let r = 0; r < e.length; r++) {
		let i = e[r];
		if (!Number.isInteger(i) || i < 0 || i > 255) {
			R(n, "error", "TABLE_RAW_INVALID_BYTE", `_raw[${r}] must be an integer byte (0-255).`, `${t}[${r}]`);
			break;
		}
	}
}
function zn(e, t, n) {
	if (!L(e)) return R(n, "error", "TABLES_MISSING", "Font tables are required and must be an object keyed by 4-char table tag.", t), [];
	let r = Object.keys(e);
	r.length === 0 && R(n, "error", "TABLES_EMPTY", "Font tables object is empty; at least core required tables are needed.", t);
	for (let i of r) {
		(typeof i != "string" || i.length !== 4) && R(n, "error", "TABLE_TAG_INVALID", `Table tag "${i}" must be exactly 4 characters.`, `${t}.${i}`);
		let r = e[i], a = `${t}.${i}`;
		if (!L(r)) {
			R(n, "error", "TABLE_DATA_INVALID", `Table "${i}" must be an object.`, a);
			continue;
		}
		r._checksum !== void 0 && !jn(r._checksum) && R(n, "error", "TABLE_CHECKSUM_INVALID", `Table "${i}" _checksum must be uint32 when provided.`, `${a}._checksum`), r._raw !== void 0 && Rn(r._raw, `${a}._raw`, n);
		let o = kn.has(i), s = Mn(r);
		if (!s && i === "cmap" && Array.isArray(r.subtables)) {
			for (let [e, t] of r.subtables.entries()) if (t?.format === 4 && Array.isArray(t.segments) && Array.isArray(t.glyphIdArray)) {
				let r = gn(t);
				r > 65535 && R(n, "error", "CMAP_FORMAT4_LENGTH_INVALID", `cmap format 4 length ${r} exceeds the uint16 limit of 65535 bytes.`, `${a}.subtables[${e}]`);
			}
		}
		!s && !o ? R(n, "error", "TABLE_WRITER_UNSUPPORTED", `Table "${i}" is parsed JSON but no writer is available. Use _raw for unknown tables.`, a) : s && !o && R(n, "info", "TABLE_UNRECOGNIZED_RAW", `Table "${i}" is not a recognized OpenType table; preserved via _raw bytes.`, a);
	}
	return r;
}
function Bn(e, t, n) {
	let r = (t) => e[t] !== void 0, i = (t) => r(t) && !Mn(e[t]), a = (e, a, o = "requires") => {
		if (i(e)) for (let i of a) r(i) || R(n, "error", "TABLE_DEPENDENCY_MISSING", `Parsed table "${e}" ${o} table "${i}".`, `${t}.${e}`);
	};
	a("hmtx", ["hhea", "maxp"]), a("loca", ["head", "maxp"]), a("glyf", [
		"loca",
		"head",
		"maxp"
	]), a("vmtx", ["vhea", "maxp"]), i("gvar") && !r("fvar") && R(n, "warning", "VARIABLE_TABLE_DEPENDENCY", "Parsed table \"gvar\" usually expects \"fvar\" to describe variation axes.", `${t}.gvar`), i("cvar") && !r("fvar") && R(n, "warning", "VARIABLE_TABLE_DEPENDENCY", "Parsed table \"cvar\" usually expects \"fvar\" to describe variation axes.", `${t}.cvar`);
}
function Vn(e, t, n) {
	let r = (t) => e[t] !== void 0;
	for (let e of An) r(e) || R(n, "error", "REQUIRED_TABLE_MISSING", `Required core table "${e}" is missing.`, t);
	r("OS/2") || R(n, "warning", "RECOMMENDED_TABLE_MISSING", "Recommended table \"OS/2\" is missing.", t);
	let i = r("glyf") || r("loca"), a = r("CFF ") || r("CFF2");
	!i && !a && R(n, "error", "OUTLINE_MISSING", "No outline tables found. Include TrueType (glyf+loca) or CFF (CFF / CFF2) outlines.", t), i && (r("glyf") || R(n, "error", "TRUETYPE_OUTLINE_INCOMPLETE", "TrueType outline requires table \"glyf\".", t), r("loca") || R(n, "error", "TRUETYPE_OUTLINE_INCOMPLETE", "TrueType outline requires table \"loca\".", t)), i && a && R(n, "warning", "MULTIPLE_OUTLINE_TYPES", "Both TrueType and CFF outline tables are present; most fonts use one outline model.", t);
}
function Hn(e, t, n) {
	if (!L(e)) {
		R(n, "error", "FONTDATA_INVALID", "Font data must be an object.", t);
		return;
	}
	Ln(e, zn(e.tables, `${t}.tables`, n).length, `${t}.header`, n), L(e.tables) && (Vn(e.tables, `${t}.tables`, n), Bn(e.tables, `${t}.tables`, n));
}
function Un(e, t, n) {
	let r = e.collection, i = e.fonts;
	if (L(r) || R(n, "error", "COLLECTION_META_INVALID", "collection must be an object for TTC/OTC inputs.", `${t}.collection`), !Array.isArray(i) || i.length === 0) {
		R(n, "error", "COLLECTION_FONTS_INVALID", "fonts must be a non-empty array for TTC/OTC inputs.", `${t}.fonts`);
		return;
	}
	L(r) && r.numFonts !== void 0 && r.numFonts !== i.length && (r.numFonts = i.length, R(n, "info", "COLLECTION_NUMFONTS_CORRECTED", `collection.numFonts corrected to ${i.length} to match fonts array.`, `${t}.collection.numFonts`));
	for (let e = 0; e < i.length; e++) Hn(i[e], `${t}.fonts[${e}]`, n);
}
function Wn(e) {
	let t = [];
	return L(e) ? (e.collection !== void 0 || e.fonts !== void 0 ? Un(e, "$", t) : Hn(e, "$", t), Fn(t)) : (R(t, "error", "INPUT_INVALID", "validateJSON expects a font JSON object.", "$"), Fn(t));
}
//#endregion
//#region src/expand.js
function Gn(e) {
	let t = In(e);
	if (!t.valid) throw Error(t.errors.map((e) => e.message).join("\n"));
	let { font: n } = e, { glyphs: r } = e, i = e.tables;
	if (i?.glyf && e._header) for (let [e, t] of r.entries()) {
		let n = i.glyf.glyphs[e];
		if (!n) continue;
		if ((JSON.stringify(n.contours || []) !== JSON.stringify(t.contours || []) || JSON.stringify(n.components || []) !== JSON.stringify(t.components || [])) && i.gvar) throw Error("Editing imported variable outlines requires remapping retained gvar point data.");
		let r = (n.contours || []).map((e) => e.map((e) => e.onCurve)), a = (t.contours || []).map((e) => e.map((e) => e.onCurve));
		if (n.instructions?.length && JSON.stringify(r) !== JSON.stringify(a) && t.instructions?.length) throw Error("Changing hinted point topology requires explicitly replacing the glyph instructions.");
	}
	if (i?.maxp && e._header) {
		let t = e._sourceGlyphNames || Ge(i, i.maxp.numGlyphs);
		if (t.length !== r.length || t.some((e, t) => e !== r[t]?.name)) {
			if (new Set(t).size !== t.length) throw Error("Glyph topology changes require unique original glyph names for reference remapping.");
			let n = /* @__PURE__ */ new Set([
				"COLR",
				"CPAL",
				"GDEF",
				"GPOS",
				"GSUB",
				"head",
				"hhea",
				"hmtx",
				"vhea",
				"vmtx",
				"maxp",
				"name",
				"OS/2",
				"post",
				"cmap",
				"glyf",
				"loca",
				"gasp",
				"cvt ",
				"fpgm",
				"prep",
				"meta",
				"ltag"
			]), a = r.length >= t.length && t.every((e, t) => e === r[t].name);
			if (a) for (let e of [
				"GDEF",
				"GPOS",
				"GSUB",
				"kern",
				"FFTM",
				"CFF "
			]) n.add(e);
			let o = Object.keys(i).filter((e) => !n.has(e));
			if (o.length) throw Error(`Glyph topology changes require unsupported reference remapping in: ${o.join(", ")}.`);
			if (r[0]?.name !== t[0]) throw Error("The original .notdef glyph must remain at glyph index zero.");
			if (!a && i.cmap?.subtables?.some((e) => ![4, 12].includes(e.format))) throw Error("Glyph topology changes require remapping retained cmap encodings.");
			let s = new Map(r.map((e, t) => [e.name, t]));
			if (!a) {
				let n = new Map(t.flatMap((e, t) => s.has(e) ? [[t, s.get(e)]] : []));
				i = { ...i };
				let r = { ...e.features };
				for (let e of [
					"GDEF",
					"GPOS",
					"GSUB",
					"COLR"
				]) i[e] && (i[e] = Xt(i[e], e, n)), r[e] && (r[e] = Xt(r[e], e, n));
				delete i.cmap, e = {
					...e,
					tables: i,
					features: r
				};
			}
			r = r.map((e) => ({
				...e,
				...e.components ? { components: e.components.map((n) => {
					if (n.glyphName != null || !t.includes(e.name)) return n;
					let r = t[n.glyphIndex];
					if (!s.has(r)) throw Error(`Composite references removed glyph: ${r}`);
					return {
						...n,
						glyphIndex: s.get(r)
					};
				}) } : {}
			}));
		}
	}
	if (i?.fvar?.axes && e._header) {
		let t = e.axes || [];
		if ((i.fvar.axes.length !== t.length || i.fvar.axes.some((e, n) => {
			let r = t[n];
			return !r || e.axisTag !== r.tag || e.minValue !== r.min || e.defaultValue !== r.default || e.maxValue !== r.max;
		})) && [
			"gvar",
			"cvar",
			"HVAR",
			"VVAR",
			"MVAR",
			"CFF2",
			"GDEF",
			"GPOS",
			"COLR",
			"avar"
		].some((e) => i[e])) throw Error("Changing imported axis layout requires remapping retained variation data; axis order, ranges and count must be preserved.");
	}
	let a = !!e.tables?.CFF2, o = r.some((e) => e.components && e.components.length > 0), s = 0, c = 0;
	for (let e of r) e.charString ? s++ : e.contours && e.contours.length > 0 && !Kt(e.contours) && c++;
	let l = !o && s > 0 && s >= c, u = $n(r, l || a), d = !l && !a ? fr(r) : null, f = Kn(r, n, d), p = {};
	if (p.head = Zn(n, f), p.hhea = Qn(n, f, r.length), p.maxp = u, !l && !a && e.tables?.maxp) for (let t of [
		"maxZones",
		"maxTwilightPoints",
		"maxStorage",
		"maxFunctionDefs",
		"maxInstructionDefs",
		"maxStackElements"
	]) p.maxp[t] = Math.max(p.maxp[t], e.tables.maxp[t] || 0);
	p["OS/2"] = er(n, f);
	for (let [t, n] of Object.entries({
		head: [
			"fontRevision",
			"flags",
			"lowestRecPPEM",
			"fontDirectionHint",
			"glyphDataFormat"
		],
		hhea: [
			"caretSlopeRise",
			"caretSlopeRun",
			"caretOffset",
			"reserved1",
			"reserved2",
			"reserved3",
			"reserved4",
			"metricDataFormat"
		],
		"OS/2": [
			"version",
			"ySubscriptXSize",
			"ySubscriptYSize",
			"ySubscriptXOffset",
			"ySubscriptYOffset",
			"ySuperscriptXSize",
			"ySuperscriptYSize",
			"ySuperscriptXOffset",
			"ySuperscriptYOffset",
			"yStrikeoutSize",
			"yStrikeoutPosition",
			"sFamilyClass",
			"usBreakChar",
			"usDefaultChar",
			"usMaxContext",
			"usLowerOpticalPointSize",
			"usUpperOpticalPointSize"
		]
	})) {
		let r = e.tables?.[t];
		if (!(!r || r._raw)) for (let e of n) r[e] !== void 0 && (p[t][e] = r[e]);
	}
	if (p.name = tr(n), e.tables?.name?.names) {
		let t = !!(e.axes && e.axes.length > 0);
		p.name = nr(p.name, e.tables.name, t);
	}
	p.post = ar(n, r, l), p.cmap = or(r);
	let m = e.tables?.cmap;
	if (m && !m._raw) {
		let e = Ue(m), t = Ue(p.cmap);
		if (e.size === t.size && [...e].every(([e, n]) => {
			let r = t.get(e);
			return r?.length === n.length && n.every((e) => r.includes(e));
		})) p.cmap = m;
		else {
			let e = /* @__PURE__ */ new Map();
			for (let t of m.encodingRecords || []) {
				let n = m.subtables[t.subtableIndex];
				(t.platformID === 0 || t.platformID === 3 && [1, 10].includes(t.encodingID)) && n.format !== 14 || (e.has(t.subtableIndex) || (e.set(t.subtableIndex, p.cmap.subtables.length), p.cmap.subtables.push(n)), p.cmap.encodingRecords.push({
					...t,
					subtableIndex: e.get(t.subtableIndex)
				}));
			}
		}
	}
	if (p.hmtx = lr(r), a) {
		if (r.length !== e.tables.maxp?.numGlyphs || r.some((e) => e.contours?.length || e.components?.length || e.charString)) throw Error("CFF2 outline or glyph-count editing is not supported; preserve the imported glyph topology.");
		p.CFF2 = e.tables.CFF2;
	} else l ? p["CFF "] = gr(n, r, e.tables?.["CFF "]) : (p.glyf = d, p.loca = { offsets: [] });
	r.some((e) => e.advanceHeight !== void 0) && (p.vhea = ur(r), p.vmtx = dr(r));
	let h = e._options?.kerningFormat || "gpos", g = e.tables && qe(e.tables, r), _ = g && !e._options?.kerningFormat && JSON.stringify(g.pairs) === JSON.stringify(e.kerning || []) && JSON.stringify(g.classes || []) === JSON.stringify(e.kerningClasses || []), v = e.kerning && e.kerning.length > 0, y = Array.isArray(e.kerningClasses) && e.kerningClasses.some((e) => e && Array.isArray(e.pairs) && e.pairs.length > 0), b = !v && !y && (Array.isArray(e.kerning) || Array.isArray(e.kerningClasses));
	if (b && !_ && e.features?.GPOS) {
		p.GPOS = structuredClone(e.features.GPOS);
		for (let e of p.GPOS.featureList?.featureRecords || []) e.featureTag === "kern" && (e.feature.lookupListIndices = []);
	}
	if (!_ && (v || y)) {
		let t = h === "gpos" || h === "gpos+kern", n = h !== "gpos";
		if (t) {
			let t = e.features?.GPOS, n = t?.scriptList?.scriptRecords && t?.featureList?.featureRecords && t?.lookupList?.lookups, i, a = n && g ? Or(t, e, g, r) : null;
			if (a) i = a;
			else if (y) {
				let a = Ir(e.kerningClasses, e.kerning || [], r);
				a.length > 0 ? i = n && Lr(t, a) || Er(a) : n && (i = t);
			} else i = n ? kr(t, e.kerning, r) : Tr(e.kerning, r);
			i && (p.GPOS = i);
		}
		if (n) {
			let t = e.kerning || [];
			y && (t = t.concat(Fr(e.kerningClasses, r)));
			let n = br(t, r, h);
			n && (p.kern = n);
		}
	}
	e.axes && e.axes.length > 0 && (p.fvar = Rr(e, p.name), e.axisMapping && (p.avar = Hr(e)), e.axisStyles ? p.STAT = i?.STAT && JSON.stringify(lt(i)) === JSON.stringify(e.axisStyles) ? i.STAT : Vr(e, p.name) : e.tables?.STAT || (p.STAT = Br(e, p.name)), e.metricVariations && (p.MVAR = Ur(e))), e.gasp && (p.gasp = {
		version: 1,
		gaspRanges: e.gasp.map((e) => ({
			rangeMaxPPEM: e.maxPPEM,
			rangeGaspBehavior: e.behavior
		}))
	}), e.cvt && (p["cvt "] = { values: e.cvt }), e.fpgm && (p.fpgm = { instructions: e.fpgm }), e.prep && (p.prep = { instructions: e.prep }), e.features && (e.features.GPOS && !p.GPOS && (p.GPOS = e.features.GPOS), e.features.GDEF && (p.GDEF = e.features.GDEF));
	let x = i?.GSUB && ht(i.GSUB, r);
	if (x && JSON.stringify(x.substitutions) === JSON.stringify(e.substitutions || []) && JSON.stringify(x.rawLookups) === JSON.stringify(e._rawGSUBLookups || []) && JSON.stringify(Fe(i.GSUB)) === JSON.stringify(e.substitutionMetadata) ? p.GSUB = i.GSUB : e.substitutions && e.substitutions.length > 0 ? p.GSUB = x && Gr(i.GSUB, x, e, r) || Kr(e.substitutions, e._rawGSUBLookups || [], r, e.substitutionMetadata) : e._rawGSUBLookups && e._rawGSUBLookups.length > 0 && (p.GSUB = x && Gr(i.GSUB, x, e, r) || qr(e._rawGSUBLookups, e.substitutionMetadata)), e.features?.GSUB && !p.GSUB && (p.GSUB = e.features.GSUB), e.palettes && e.palettes.length > 0 && (p.CPAL = i?.CPAL && JSON.stringify(Mt(i)) === JSON.stringify(e.palettes) ? i.CPAL : ci(e.palettes)), e.colorGlyphs && e.colorGlyphs.length > 0 && (p.COLR = i?.COLR && JSON.stringify(Nt(i, r)) === JSON.stringify(e.colorGlyphs) ? i.COLR : li(e.colorGlyphs, r)), e.tables) for (let [t, n] of Object.entries(e.tables)) t === "COLR" && Array.isArray(e.colorGlyphs) || t === "CPAL" && Array.isArray(e.palettes) || ["fvar", "avar"].includes(t) && Array.isArray(e.axes) && e.axes.length === 0 || t === "GSUB" && Array.isArray(e.substitutions) || t === "kern" && b || p[t] || (p[t] = n);
	let S;
	if (e._header) S = {
		...e._header,
		numTables: Object.keys(p).length
	};
	else {
		let e = Object.keys(p).length, t = Math.floor(Math.log2(e)), n = 2 ** t * 16, r = e * 16 - n;
		S = {
			sfVersion: l || a ? 1330926671 : 65536,
			numTables: e,
			searchRange: n,
			entrySelector: t,
			rangeShift: r
		};
	}
	return {
		header: S,
		tables: p
	};
}
function Kn(e, t, n) {
	let r = Infinity, i = Infinity, a = -Infinity, o = -Infinity, s = 0, c = 0, l = Infinity, u = Infinity, d = -Infinity, f = Infinity, p = 0, m = /* @__PURE__ */ new Set();
	for (let [t, h] of e.entries()) {
		let e = h.advanceWidth || 0;
		c += e, e > s && (s = e);
		let g = n ? n.glyphs[t] : qn(h);
		if (g) {
			g.xMin < r && (r = g.xMin), g.yMin < i && (i = g.yMin), g.xMax > a && (a = g.xMax), g.yMax > o && (o = g.yMax);
			let t = h.leftSideBearing ?? g.xMin, n = e - (t + (g.xMax - g.xMin)), s = t + (g.xMax - g.xMin);
			t < l && (l = t), n < u && (u = n), s > d && (d = s);
		}
		let _ = h.unicodes || (h.unicode == null ? [] : [h.unicode]);
		for (let e of _) e < f && (f = e), e > p && (p = e), m.add(e);
	}
	r === Infinity && (r = 0), i === Infinity && (i = 0), a === -Infinity && (a = 0), o === -Infinity && (o = 0), l === Infinity && (l = 0), u === Infinity && (u = 0), d === -Infinity && (d = 0), f === Infinity && (f = 0), p === 0 && (p = 0);
	let h = Jn(e, "xyvw", t.ascender ? Math.round(t.ascender / 2) : 0), g = Jn(e, "HIKLEFJMNTZBDPRAGOQSUVWXY", o);
	return {
		xMin: r,
		yMin: i,
		xMax: a,
		yMax: o,
		advanceWidthMax: s,
		advanceWidthAvg: e.length > 0 ? Math.round(c / e.length) : 0,
		minLSB: l,
		minRSB: u,
		maxExtent: d,
		firstCharIndex: Math.min(f, 65535),
		lastCharIndex: Math.min(p, 65535),
		sxHeight: h,
		sCapHeight: g,
		unicodeRanges: m
	};
}
function qn(e) {
	if (e.contours && e.contours.length > 0) {
		let t = Infinity, n = Infinity, r = -Infinity, i = -Infinity, a = !1;
		for (let o of e.contours) for (let e of o) {
			let o = [
				[e.x, e.y],
				[e.x1, e.y1],
				[e.x2, e.y2]
			];
			for (let [e, s] of o) typeof e == "number" && typeof s == "number" && (a = !0, e < t && (t = e), s < n && (n = s), e > r && (r = e), s > i && (i = s));
		}
		if (a) return {
			xMin: t,
			yMin: n,
			xMax: r,
			yMax: i
		};
	}
	return null;
}
function Jn(e, t, n) {
	for (let n of t) {
		let t = n.charCodeAt(0), r = e.find((e) => (e.unicodes || (e.unicode ? [e.unicode] : [])).includes(t));
		if (r) {
			let e = qn(r);
			if (e) return e.yMax;
		}
	}
	return n || 0;
}
function Yn(e) {
	let t = [
		0,
		0,
		0,
		0
	];
	for (let [n, r, i] of [
		[
			0,
			32,
			126
		],
		[
			1,
			128,
			255
		],
		[
			2,
			256,
			383
		],
		[
			3,
			384,
			591
		],
		[
			7,
			880,
			1023
		],
		[
			9,
			1024,
			1279
		],
		[
			10,
			1328,
			1423
		],
		[
			11,
			1424,
			1535
		],
		[
			13,
			1536,
			1791
		],
		[
			24,
			3584,
			3711
		],
		[
			28,
			4352,
			4607
		],
		[
			30,
			7680,
			7935
		],
		[
			31,
			7936,
			8191
		],
		[
			32,
			8192,
			8303
		],
		[
			33,
			8304,
			8351
		],
		[
			34,
			8352,
			8399
		],
		[
			35,
			8400,
			8447
		],
		[
			36,
			8448,
			8527
		],
		[
			37,
			8528,
			8591
		],
		[
			38,
			8592,
			8703
		],
		[
			39,
			8704,
			8959
		],
		[
			40,
			8960,
			9215
		],
		[
			42,
			9472,
			9599
		],
		[
			43,
			9600,
			9631
		],
		[
			44,
			9632,
			9727
		],
		[
			45,
			9728,
			9983
		],
		[
			46,
			9984,
			10175
		],
		[
			48,
			12288,
			12351
		],
		[
			49,
			12352,
			12447
		],
		[
			50,
			12448,
			12543
		],
		[
			52,
			12544,
			12591
		],
		[
			56,
			44032,
			55215
		],
		[
			57,
			55296,
			57343
		],
		[
			59,
			19968,
			40959
		],
		[
			60,
			57344,
			63743
		],
		[
			62,
			65056,
			65071
		],
		[
			69,
			64336,
			65023
		],
		[
			70,
			65136,
			65279
		],
		[
			78,
			65280,
			65519
		]
	]) for (let a of e) if (a >= r && a <= i) {
		let e = Math.floor(n / 32);
		t[e] |= 1 << n % 32;
		break;
	}
	return t;
}
function Xn(e) {
	return {
		isBold: e.isBold === void 0 ? (e.weightClass || 400) === 700 : !!e.isBold,
		isItalic: e.isItalic === void 0 ? (e.italicAngle || 0) !== 0 : !!e.isItalic
	};
}
function Zn(e, t) {
	let n;
	if (e.macStyle !== void 0) n = e.macStyle;
	else {
		let { isBold: t, isItalic: r } = Xn(e);
		n = 0, t && (n |= 1), r && (n |= 2);
	}
	return {
		majorVersion: 1,
		minorVersion: 0,
		fontRevision: 1,
		checksumAdjustment: 0,
		magicNumber: 1594834165,
		flags: 11,
		unitsPerEm: e.unitsPerEm,
		created: pt(e.created),
		modified: pt(e.modified),
		xMin: t.xMin,
		yMin: t.yMin,
		xMax: t.xMax,
		yMax: t.yMax,
		macStyle: n,
		lowestRecPPEM: 8,
		fontDirectionHint: 2,
		indexToLocFormat: 0,
		glyphDataFormat: 0
	};
}
function Qn(e, t, n) {
	return {
		majorVersion: 1,
		minorVersion: 0,
		ascender: e.ascender || 0,
		descender: e.descender || 0,
		lineGap: e.lineGap || 0,
		advanceWidthMax: t.advanceWidthMax,
		minLeftSideBearing: t.minLSB,
		minRightSideBearing: t.minRSB,
		xMaxExtent: t.maxExtent,
		caretSlopeRise: 1,
		caretSlopeRun: 0,
		caretOffset: 0,
		reserved1: 0,
		reserved2: 0,
		reserved3: 0,
		reserved4: 0,
		metricDataFormat: 0,
		numberOfHMetrics: n
	};
}
function $n(e, t) {
	if (t) return {
		version: 20480,
		numGlyphs: e.length
	};
	let n = 0, r = 0, i = 0, a = 0, o = 0, s = 0, c = 0, l = new Map(e.map((e, t) => [e.name, t])), u = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Set();
	function f(t, n = 0) {
		if (d.has(t)) throw Error("Cyclic composite glyph reference.");
		if (n > 64) throw Error("Composite nesting exceeds the supported depth of 64.");
		if (u.has(t)) return u.get(t);
		let r = e[t];
		if (!r) throw Error(`Invalid composite glyph reference: ${t}`);
		d.add(t);
		let i = r.contours || [], a = Kt(i) ? i.map((e) => Vt(e)) : i, o = {
			points: a.reduce((e, t) => e + t.length, 0),
			contours: a.length,
			depth: 0
		};
		for (let t of r.components || []) {
			if (t.glyphName != null && !l.has(t.glyphName)) throw Error(`Composite references unknown glyph name "${t.glyphName}".`);
			let r = t.glyphName == null ? t.glyphIndex : l.get(t.glyphName);
			if (!Number.isInteger(r) || r < 0 || r >= e.length) throw Error(`Invalid composite glyph reference: ${t.glyphName ?? r}`);
			let i = f(r, n + 1);
			if (o.points += i.points, o.contours += i.contours, o.depth = Math.max(o.depth, i.depth + 1), o.points > 65535 || o.contours > 65535) throw Error("Composite geometry exceeds maxp limits.");
		}
		return d.delete(t), u.set(t, o), o;
	}
	for (let [t, l] of e.entries()) {
		let e = f(t);
		if (l.contours) {
			let t = e.points;
			t > n && (n = t), l.contours.length > r && (r = l.contours.length);
		}
		l.components && (l.components.length > o && (o = l.components.length), s = Math.max(s, e.depth), i = Math.max(i, e.points), a = Math.max(a, e.contours)), l.instructions && l.instructions.length > c && (c = l.instructions.length);
	}
	return {
		version: 65536,
		numGlyphs: e.length,
		maxPoints: n,
		maxContours: r,
		maxCompositePoints: i,
		maxCompositeContours: a,
		maxZones: 2,
		maxTwilightPoints: 0,
		maxStorage: 0,
		maxFunctionDefs: 0,
		maxInstructionDefs: 0,
		maxStackElements: 0,
		maxSizeOfInstructions: c,
		maxComponentElements: o,
		maxComponentDepth: s
	};
}
function er(e, t) {
	let n = e.fsSelection;
	if (n === void 0) {
		let { isBold: t, isItalic: r } = Xn(e);
		n = 0, t && (n |= 32), r && (n |= 1), !t && !r && (n |= 64), n |= 128;
	}
	let r = Yn(t.unicodeRanges), i = t.unicodeRanges.has(32);
	return {
		version: 4,
		xAvgCharWidth: t.advanceWidthAvg,
		usWeightClass: e.weightClass || 400,
		usWidthClass: e.widthClass || 5,
		fsType: e.fsType || 0,
		ySubscriptXSize: Math.round((e.unitsPerEm || 1e3) * .65),
		ySubscriptYSize: Math.round((e.unitsPerEm || 1e3) * .6),
		ySubscriptXOffset: 0,
		ySubscriptYOffset: Math.round((e.unitsPerEm || 1e3) * .075),
		ySuperscriptXSize: Math.round((e.unitsPerEm || 1e3) * .65),
		ySuperscriptYSize: Math.round((e.unitsPerEm || 1e3) * .6),
		ySuperscriptXOffset: 0,
		ySuperscriptYOffset: Math.round((e.unitsPerEm || 1e3) * .35),
		yStrikeoutSize: Math.round((e.unitsPerEm || 1e3) * .05),
		yStrikeoutPosition: Math.round((e.unitsPerEm || 1e3) * .3),
		sFamilyClass: 0,
		panose: e.panose || [
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0
		],
		ulUnicodeRange1: r[0],
		ulUnicodeRange2: r[1],
		ulUnicodeRange3: r[2],
		ulUnicodeRange4: r[3],
		achVendID: e.achVendID || "XXXX",
		fsSelection: n,
		usFirstCharIndex: t.firstCharIndex,
		usLastCharIndex: t.lastCharIndex,
		sTypoAscender: e.ascender || 0,
		sTypoDescender: e.descender || 0,
		sTypoLineGap: e.lineGap || 0,
		usWinAscent: t.yMax > 0 ? t.yMax : e.ascender || 0,
		usWinDescent: t.yMin < 0 ? Math.abs(t.yMin) : 0,
		ulCodePageRange1: 1,
		ulCodePageRange2: 0,
		sxHeight: t.sxHeight,
		sCapHeight: t.sCapHeight,
		usDefaultChar: i ? 32 : 0,
		usBreakChar: i ? 32 : 0,
		usMaxContext: 0
	};
}
function tr(e) {
	let t = [], n = {
		0: e.copyright || "",
		1: e.familyName || "",
		2: e.styleName || "",
		3: e.uniqueID || rr(e),
		4: e.fullName || `${e.familyName || ""} ${e.styleName || ""}`.trim(),
		5: e.version || "Version 1.000",
		6: e.postScriptName || ir(e),
		7: e.trademark || "",
		8: e.manufacturer || "",
		9: e.designer || "",
		10: e.description || "",
		11: e.vendorURL || "",
		12: e.designerURL || "",
		13: e.license || "",
		14: e.licenseURL || "",
		19: e.sampleText || ""
	};
	e.typographicFamily && e.typographicFamily !== (e.familyName || "") && (n[16] = e.typographicFamily), e.typographicSubfamily && e.typographicSubfamily !== (e.styleName || "") && (n[17] = e.typographicSubfamily), e.wwsFamily && (n[21] = e.wwsFamily), e.wwsSubfamily && (n[22] = e.wwsSubfamily), e.variationsPostScriptNamePrefix && (n[25] = e.variationsPostScriptNamePrefix);
	for (let [e, r] of Object.entries(n)) {
		let n = Number(e);
		r && (t.push({
			platformID: 3,
			encodingID: 1,
			languageID: 1033,
			nameID: n,
			value: r
		}), t.push({
			platformID: 1,
			encodingID: 0,
			languageID: 0,
			nameID: n,
			value: r
		}), t.push({
			platformID: 0,
			encodingID: 3,
			languageID: 0,
			nameID: n,
			value: r
		}));
	}
	return {
		version: 0,
		names: t
	};
}
function nr(e, t, n) {
	if (!t?.names?.length) return e;
	let r = (e) => `${e.platformID},${e.encodingID},${e.languageID},${e.nameID}`, i = new Set(e.names.map(r)), a = e.names.slice();
	for (let e of t.names) i.has(r(e)) || (a.push({
		platformID: e.platformID,
		encodingID: e.encodingID,
		languageID: e.languageID,
		nameID: e.nameID,
		value: e.value
	}), i.add(r(e)));
	let o = {
		version: e.version,
		names: a
	};
	return t.version === 1 && t.langTagRecords?.length && (o.version = 1, o.langTagRecords = t.langTagRecords.map((e) => ({ ...e }))), o;
}
function rr(e) {
	let t = e.fullName || `${e.familyName || ""} ${e.styleName || ""}`.trim();
	return e.manufacturer ? `${e.manufacturer}: ${t}` : t;
}
function ir(e) {
	let t = (e) => (e || "").replace(/[^\x21-\x7e]/g, "").replace(/[[\](){}<>/%]/g, "");
	return `${t(e.familyName)}-${t(e.styleName) || "Regular"}`.slice(0, 63);
}
function ar(e, t, n = !1) {
	let r = {
		italicAngle: e.italicAngle || 0,
		underlinePosition: e.underlinePosition || Math.round(-(e.unitsPerEm || 1e3) * .1),
		underlineThickness: e.underlineThickness || Math.round((e.unitsPerEm || 1e3) * .05),
		isFixedPitch: +!!e.isFixedPitch,
		minMemType42: 0,
		maxMemType42: 0,
		minMemType1: 0,
		maxMemType1: 0
	};
	return n ? {
		version: 196608,
		...r
	} : {
		version: 131072,
		...r,
		glyphNames: t.map((e) => String(e.name ?? ".notdef"))
	};
}
function or(e) {
	let t = /* @__PURE__ */ new Map(), n = !1;
	for (let r = 0; r < e.length; r++) {
		let i = e[r], a = i.unicodes || (i.unicode == null ? [] : [i.unicode]);
		for (let e of a) t.has(e) || t.set(e, r), e > 65535 && (n = !0);
	}
	let r = [...t.entries()].sort((e, t) => e[0] - t[0]), i = [], a = [];
	if (n) {
		let e = sr(r);
		i.push({
			format: 12,
			language: 0,
			groups: e
		}), a.push({
			platformID: 3,
			encodingID: 10,
			subtableIndex: 0
		}), a.push({
			platformID: 0,
			encodingID: 4,
			subtableIndex: 0
		});
	}
	let o = r.filter(([e]) => e <= 65535);
	if (o.length > 0 || i.length === 0) {
		let { segments: e, glyphIdArray: t } = cr(o), n = i.length;
		i.push({
			format: 4,
			language: 0,
			segments: e,
			glyphIdArray: t
		}), a.push({
			platformID: 3,
			encodingID: 1,
			subtableIndex: n
		}), a.push({
			platformID: 0,
			encodingID: 3,
			subtableIndex: n
		});
	}
	return {
		version: 0,
		encodingRecords: a,
		subtables: i
	};
}
function sr(e) {
	if (e.length === 0) return [];
	let t = [], n = e[0][0], r = e[0][1], i = n, a = r;
	for (let o = 1; o < e.length; o++) {
		let [s, c] = e[o];
		s === i + 1 && c === a + 1 ? (i = s, a = c) : (t.push({
			startCharCode: n,
			endCharCode: i,
			startGlyphID: r
		}), n = s, r = c, i = s, a = c);
	}
	return t.push({
		startCharCode: n,
		endCharCode: i,
		startGlyphID: r
	}), t;
}
function cr(e) {
	let t = [], n = [], r = e[e.length - 1], i = r?.[0] === 65535, a = {
		startCode: 65535,
		endCode: 65535,
		idDelta: i ? r[1] - 65535 : 1,
		idRangeOffset: 0
	};
	if (i && (e = e.slice(0, -1)), e.length === 0) return t.push(a), {
		segments: t,
		glyphIdArray: n
	};
	let o = e[0][0], s = e[0][1] - e[0][0], c = e[0][0];
	for (let n = 1; n < e.length; n++) {
		let [r, i] = e[n], a = i - r;
		r === c + 1 && a === s ? c = r : (t.push({
			startCode: o,
			endCode: c,
			idDelta: s,
			idRangeOffset: 0
		}), o = r, s = a, c = r);
	}
	return t.push({
		startCode: o,
		endCode: c,
		idDelta: s,
		idRangeOffset: 0
	}), t.push(a), {
		segments: t,
		glyphIdArray: n
	};
}
function lr(e) {
	return {
		hMetrics: e.map((e) => ({
			advanceWidth: e.advanceWidth || 0,
			lsb: e.leftSideBearing ?? 0
		})),
		leftSideBearings: []
	};
}
function ur(e) {
	let t = 0, n = Infinity, r = Infinity, i = -Infinity;
	for (let a of e) {
		let e = a.advanceHeight || 0;
		e > t && (t = e);
		let o = qn(a);
		if (o) {
			let t = a.topSideBearing ?? 0, s = o.yMax - o.yMin, c = e - (t + s), l = t + s;
			t < n && (n = t), c < r && (r = c), l > i && (i = l);
		}
	}
	return n === Infinity && (n = 0), r === Infinity && (r = 0), i === -Infinity && (i = 0), {
		version: 69632,
		vertTypoAscender: 0,
		vertTypoDescender: 0,
		vertTypoLineGap: 0,
		advanceHeightMax: t,
		minTopSideBearing: n,
		minBottomSideBearing: r,
		yMaxExtent: i,
		caretSlopeRise: 0,
		caretSlopeRun: 0,
		caretOffset: 0,
		reserved1: 0,
		reserved2: 0,
		reserved3: 0,
		reserved4: 0,
		metricDataFormat: 0,
		numOfLongVerMetrics: e.length
	};
}
function dr(e) {
	return {
		vMetrics: e.map((e) => ({
			advanceHeight: e.advanceHeight || 0,
			topSideBearing: e.topSideBearing ?? 0
		})),
		topSideBearings: []
	};
}
function fr(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n = 0; n < e.length; n++) {
		let r = e[n] && e[n].name;
		r != null && !t.has(r) && t.set(r, n);
	}
	let n = e.map((e) => {
		if (e.contours && e.contours.length > 0) {
			let t = Kt(e.contours) ? e.contours.map(Vt) : e.contours, n = qn({ contours: t });
			return {
				type: "simple",
				xMin: n ? n.xMin : 0,
				yMin: n ? n.yMin : 0,
				xMax: n ? n.xMax : 0,
				yMax: n ? n.yMax : 0,
				contours: t,
				instructions: e.instructions || [],
				overlapSimple: !1
			};
		}
		return e.components && e.components.length > 0 ? {
			type: "composite",
			xMin: 0,
			yMin: 0,
			xMax: 0,
			yMax: 0,
			components: e.components.map((e) => k(e, t)),
			instructions: e.instructions || []
		} : null;
	});
	for (let e of n) {
		if (e?.type !== "composite") continue;
		let t = qn({ contours: te(n, e) });
		t && Object.assign(e, t);
	}
	return { glyphs: n };
}
function pr(e) {
	let t = Math.round(e);
	if (t >= -107 && t <= 107) return [t + 139];
	if (t >= 108 && t <= 1131) {
		let e = t - 108;
		return [(e >> 8 & 255) + 247, e & 255];
	}
	if (t >= -1131 && t <= -108) {
		let e = -t - 108;
		return [(e >> 8 & 255) + 251, e & 255];
	}
	let n = t < 0 ? t + 65536 : t;
	return [
		28,
		n >> 8 & 255,
		n & 255
	];
}
function mr(e, t, n = {}) {
	if (!Number.isFinite(t)) return e;
	let { globalSubrs: r = [], localSubrs: i = [], nominalWidthX: a = 0, defaultWidthX: o = 0 } = n;
	if (!hr(e)) return e;
	let s = null;
	try {
		s = Ae(e, r, i);
	} catch {
		return e;
	}
	if (s.width !== null && s.width !== void 0 || !s.contours || s.contours.length === 0 || t === o) return e;
	let c = pr(t - a), l = Array(c.length + e.length);
	for (let e = 0; e < c.length; e++) l[e] = c[e];
	for (let t = 0; t < e.length; t++) l[c.length + t] = e[t];
	return l;
}
function hr(e) {
	if (!e || e.length === 0) return !1;
	let t = 0;
	for (; t < e.length;) {
		let n = e[t];
		if (n === 14) return !0;
		if (n >= 32 && n <= 246) {
			t += 1;
			continue;
		}
		if (n >= 247 && n <= 254) {
			t += 2;
			continue;
		}
		if (n === 28) {
			t += 3;
			continue;
		}
		if (n === 255) {
			t += 5;
			continue;
		}
		t += n === 12 ? 2 : 1;
	}
	return !1;
}
function gr(e, t, n) {
	if (n?.fonts?.[0] && n.fonts[0].charStrings.length <= t.length) {
		let r = structuredClone(n), i = n.fonts[0];
		if (!i.topDict?.FontMatrix && e.unitsPerEm !== 1e3 && !i.fdArray?.length) {
			let t = 1 / (e.unitsPerEm || 1e3);
			r.fonts[0].topDict = {
				...r.fonts[0].topDict,
				FontMatrix: [
					t,
					0,
					0,
					t,
					0,
					0
				]
			};
		}
		if (i.charStrings.length !== t.length) {
			if (i.fdArray?.length || i.topDict?.ROS) throw Error("Appending CID CFF glyphs requires per-FD compilation support.");
			r.fonts[0].charset = t.slice(1).map((e) => {
				let t = r.strings.indexOf(e.name);
				return t < 0 && (t = r.strings.length, r.strings.push(e.name || ".notdef")), t + 391;
			});
		}
		return r.fonts[0].charStrings = t.map((e, t) => {
			let r = Se(n, t);
			if (t >= i.charStrings.length) return d(e.contours || [], (e.advanceWidth || 0) - r.nominalWidthX);
			let a = Ae(i.charStrings[t], r.globalSubrs, r.localSubrs).contours;
			if (JSON.stringify(e.contours || []) !== JSON.stringify(a)) {
				if (i.fdArray?.length || i.topDict?.ROS) throw Error("Editing CID CFF outlines requires per-FD compilation support.");
				return d(e.contours || [], (e.advanceWidth || 0) - r.nominalWidthX);
			}
			return mr(e.charString || i.charStrings[t], e.advanceWidth, r);
		}), r;
	}
	let r = e.postScriptName || ir(e), i = t.slice(1).map((e) => e.name || ".notdef"), a = t.map((e) => {
		let t = Number.isFinite(e.advanceWidth) ? e.advanceWidth : void 0;
		return e.charString && e.charString.length > 0 ? mr(e.charString, t) : d(e.contours || [], t);
	}), o = [];
	function s(e) {
		let t = 391 + o.length;
		return o.push(e), t;
	}
	let c = e.fullName || `${e.familyName || ""} ${e.styleName || ""}`.trim(), l = e.familyName || "", u = _r(e.weightClass), f = i.map((e) => s(e)), p = e.unitsPerEm || 1e3, m = {
		FullName: s(c),
		FamilyName: s(l),
		Weight: s(u),
		FontBBox: [
			0,
			e.descender || 0,
			p,
			e.ascender || 0
		]
	};
	if (p !== 1e3) {
		let e = 1 / p;
		m.FontMatrix = [
			e,
			0,
			0,
			e,
			0,
			0
		];
	}
	return {
		majorVersion: 1,
		minorVersion: 0,
		names: [r],
		strings: o,
		globalSubrs: [],
		fonts: [{
			topDict: m,
			charset: f,
			encoding: [],
			charStrings: a,
			privateDict: {},
			localSubrs: []
		}]
	};
}
function _r(e) {
	return !e || e <= 400 ? "Regular" : e <= 500 ? "Medium" : e <= 600 ? "SemiBold" : e <= 700 ? "Bold" : e <= 800 ? "ExtraBold" : "Black";
}
function vr(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let e = 0; e < t.length; e++) t[e].name && n.set(t[e].name, e);
	let r = [];
	for (let t of e) {
		let e = n.get(t.left), i = n.get(t.right);
		e !== void 0 && i !== void 0 && r.push({
			left: e,
			right: i,
			value: t.value
		});
	}
	if (r.length === 0) return null;
	let i = r.length, a = Math.floor(Math.log2(i)), o = 2 ** a * 6;
	return {
		formatVariant: "opentype",
		version: 0,
		nTables: 1,
		subtables: [{
			version: 0,
			coverage: 1,
			format: 0,
			nPairs: i,
			searchRange: o,
			entrySelector: a,
			rangeShift: i * 6 - o,
			pairs: r
		}]
	};
}
function yr(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let e = 0; e < t.length; e++) t[e].name && n.set(t[e].name, e);
	let r = [];
	for (let t of e) {
		let e = n.get(t.left), i = n.get(t.right);
		e !== void 0 && i !== void 0 && r.push({
			left: e,
			right: i,
			value: t.value
		});
	}
	return {
		pairs: r,
		nameToIndex: n
	};
}
function br(e, t, n) {
	switch (n) {
		case "kern-ot-f0":
		case "gpos+kern": return vr(e, t);
		case "kern-ot-f2": return xr(e, t);
		case "kern-apple-f0": return Sr(e, t);
		case "kern-apple-f3": return Cr(e, t);
		default: return vr(e, t);
	}
}
function xr(e, t) {
	let { pairs: n } = yr(e, t);
	if (n.length === 0) return null;
	let { leftClasses: r, rightClasses: i, valueMatrix: a, leftGlyphToClass: o, rightGlyphToClass: s } = wr(n), c = r.length, l = i.length, u = l * 2, d = Array.from(o.keys()).sort((e, t) => e - t), f = Array.from(s.keys()).sort((e, t) => e - t), p = d.length > 0 ? d[0] : 0, m = d.length > 0 ? d[d.length - 1] - p + 1 : 0, h = f.length > 0 ? f[0] : 0, g = f.length > 0 ? f[f.length - 1] - h + 1 : 0, _ = 4 + m * 2, v = 4 + g * 2;
	c * l * 2;
	let y = 8 + _, b = y + v, x = [];
	for (let e = 0; e < m; e++) {
		let t = p + e, n = o.get(t) ?? 0;
		x.push(b + n * u);
	}
	let S = [];
	for (let e = 0; e < g; e++) {
		let t = h + e, n = s.get(t) ?? 0;
		S.push(n * 2);
	}
	return {
		formatVariant: "opentype",
		version: 0,
		nTables: 1,
		subtables: [{
			version: 0,
			coverage: 513,
			format: 2,
			rowWidth: u,
			leftOffsetTable: 8,
			rightOffsetTable: y,
			kerningArrayOffset: b,
			leftClassTable: {
				firstGlyph: p,
				nGlyphs: m,
				offsets: x
			},
			rightClassTable: {
				firstGlyph: h,
				nGlyphs: g,
				offsets: S
			},
			nLeftClasses: c,
			nRightClasses: l,
			values: a
		}]
	};
}
function Sr(e, t) {
	let { pairs: n } = yr(e, t);
	if (n.length === 0) return null;
	let r = n.length, i = Math.floor(Math.log2(r)), a = 2 ** i * 6;
	return {
		formatVariant: "apple",
		version: 65536,
		nTables: 1,
		subtables: [{
			coverage: 0,
			format: 0,
			tupleIndex: 0,
			nPairs: r,
			searchRange: a,
			entrySelector: i,
			rangeShift: r * 6 - a,
			pairs: n
		}]
	};
}
function Cr(e, t) {
	let { pairs: n } = yr(e, t);
	if (n.length === 0) return null;
	let { leftClasses: r, rightClasses: i, valueMatrix: a, leftGlyphToClass: o, rightGlyphToClass: s } = wr(n), c = r.length, l = i.length, u = /* @__PURE__ */ new Set();
	u.add(0);
	for (let e of a) for (let t of e) u.add(t);
	if (c > 255 || l > 255 || u.size > 255) return Sr(e, t);
	let d = Array.from(u).sort((e, t) => e - t), f = /* @__PURE__ */ new Map();
	for (let e = 0; e < d.length; e++) f.set(d[e], e);
	let p = t.length, m = Array(p).fill(0), h = Array(p).fill(0);
	for (let [e, t] of o) e < p && (m[e] = t);
	for (let [e, t] of s) e < p && (h[e] = t);
	let g = [];
	for (let e = 0; e < c; e++) for (let t = 0; t < l; t++) {
		let n = a[e]?.[t] || 0;
		g.push(f.get(n) ?? 0);
	}
	return {
		formatVariant: "apple",
		version: 65536,
		nTables: 1,
		subtables: [{
			coverage: 0,
			format: 3,
			tupleIndex: 0,
			glyphCount: p,
			kernValueCount: d.length,
			leftClassCount: c,
			rightClassCount: l,
			flags: 0,
			kernValues: d,
			leftClasses: m,
			rightClasses: h,
			kernIndices: g
		}]
	};
}
function wr(e) {
	let t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set();
	for (let { left: r, right: i, value: a } of e) t.has(r) || t.set(r, /* @__PURE__ */ new Map()), t.get(r).set(i, a), n.add(i);
	let r = /* @__PURE__ */ new Map();
	for (let [e, n] of t) {
		let t = Array.from(n.entries()).sort((e, t) => e[0] - t[0]);
		r.set(e, t.map((e) => `${e[0]}:${e[1]}`).join(","));
	}
	let i = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map(), o = 1;
	for (let [e, t] of r) i.has(t) || i.set(t, o++), a.set(e, i.get(t));
	let s = /* @__PURE__ */ new Map();
	for (let { left: t, right: n, value: r } of e) s.has(n) || s.set(n, /* @__PURE__ */ new Map()), s.get(n).set(t, r);
	let c = /* @__PURE__ */ new Map();
	for (let [e, t] of s) {
		let n = Array.from(t.entries()).sort((e, t) => e[0] - t[0]);
		c.set(e, n.map((e) => `${e[0]}:${e[1]}`).join(","));
	}
	let l = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Map(), d = 1;
	for (let [e, t] of c) l.has(t) || l.set(t, d++), u.set(e, l.get(t));
	let f = o, p = d, m = [];
	for (let e = 0; e < f; e++) m.push(Array(p).fill(0));
	for (let { left: t, right: n, value: r } of e) {
		let e = a.get(t) ?? 0, i = u.get(n) ?? 0;
		m[e][i] = r;
	}
	return {
		leftClasses: Array.from({ length: f }, (e, t) => t),
		rightClasses: Array.from({ length: p }, (e, t) => t),
		valueMatrix: m,
		leftGlyphToClass: a,
		rightGlyphToClass: u
	};
}
function Tr(e, t) {
	let { pairs: n } = yr(e, t);
	return n.length === 0 ? null : Er([Ar(n)]);
}
function Er(e) {
	return !e || e.length === 0 ? null : {
		majorVersion: 1,
		minorVersion: 0,
		scriptList: { scriptRecords: [{
			scriptTag: "DFLT",
			script: {
				defaultLangSys: {
					lookupOrderOffset: 0,
					requiredFeatureIndex: 65535,
					featureIndices: [0]
				},
				langSysRecords: []
			}
		}] },
		featureList: { featureRecords: [{
			featureTag: "kern",
			feature: {
				featureParamsOffset: 0,
				lookupListIndices: e.map((e, t) => t)
			}
		}] },
		lookupList: { lookups: e }
	};
}
function Dr(e) {
	let t = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new WeakSet(), r = 0, i = (e, a = 0) => {
		if (++r > 1e7 || a > 64) throw Error("Layout dependency traversal exceeds the complexity limit.");
		if (!(!e || typeof e != "object") && !n.has(e)) {
			n.add(e), Number.isInteger(e.lookupListIndex) && t.add(e.lookupListIndex);
			for (let t of Object.values(e)) i(t, a + 1);
		}
	};
	return i(e), t;
}
function Or(e, t, n, r) {
	let i = Dr(e.lookupList), a = e.featureList.featureRecords, o = new Set(a.filter((e) => e.featureTag === "kern").flatMap((e) => e.feature.lookupListIndices));
	if (!o.size) return null;
	let s = structuredClone(e), c = (e, t) => JSON.stringify([T(r, e), T(r, t)]), l = new Map(n.pairs.map((e) => [c(e.left, e.right), e.value])), u = new Map((t.kerning || []).map((e) => [c(e.left, e.right), e.value])), d = new Set([...l.keys(), ...u.keys()].filter((e) => l.get(e) !== u.get(e))), f = JSON.stringify(n.classes || []) !== JSON.stringify(t.kerningClasses || []), p = /* @__PURE__ */ new Set(), m = a.filter((e) => e.featureTag === "kern").length > 1 || !!s.featureVariations;
	for (let e of o) {
		let t = s.lookupList.lookups[e], n = i.has(e) || !!s.featureVariations || a.some((t) => t.featureTag !== "kern" && t.feature.lookupListIndices.includes(e));
		m ||= n || !!t.lookupFlag;
		for (let e of t.subtables) {
			let i = t.lookupType === 9 ? e.subtable : e;
			if (!i || t.lookupType !== 2 && e.extensionLookupType !== 2 || i.format !== 1) {
				m = !0;
				continue;
			}
			let a = i.coverage.glyphs || (i.coverage.ranges || []).flatMap((e) => Array.from({ length: e.endGlyphID - e.startGlyphID + 1 }, (t, n) => e.startGlyphID + n));
			for (let [e, t] of i.pairSets.entries()) for (let o of t) {
				m ||= !!i.valueFormat2 || !!(i.valueFormat1 & -5);
				let t = c(r[a[e]]?.name, r[o.secondGlyph]?.name);
				if (d.has(t)) {
					if (n || p.has(t)) throw Error("Kerning edit requires disambiguating shared or repeated positioning records.");
					if (!(i.valueFormat1 & 4)) throw Error("Kerning edit requires adding a ValueRecord field; edit the raw GPOS table explicitly.");
					o.value1.xAdvance = u.get(t) ?? 0, p.add(t);
				}
			}
		}
	}
	if (!f && [...d].every((e) => p.has(e))) return s;
	if (m) throw Error("Kerning edit requires unsupported reconstruction of retained class, variable, flagged or shared positioning; edit raw GPOS explicitly.");
	return null;
}
function kr(e, t, n) {
	return Lr(e, [Ar(yr(t, n).pairs)]);
}
function Ar(e) {
	let t = /* @__PURE__ */ new Map();
	for (let { left: n, right: r, value: i } of e) t.has(n) || t.set(n, []), t.get(n).push({
		secondGlyph: r,
		value1: { xAdvance: i },
		value2: null
	});
	let n = Array.from(t.keys()).sort((e, t) => e - t), r = n.map((e) => {
		let n = t.get(e);
		return n.sort((e, t) => e.secondGlyph - t.secondGlyph), n;
	});
	return {
		lookupType: 2,
		lookupFlag: 0,
		subtables: [{
			format: 1,
			coverage: {
				format: 1,
				glyphs: n
			},
			valueFormat1: 4,
			valueFormat2: 0,
			pairSets: r
		}]
	};
}
function jr(e) {
	let t = Array.from(e.entries()).sort((e, t) => e[0] - t[0]), n = [];
	for (let [e, r] of t) {
		let t = n[n.length - 1];
		t && t.class === r && e === t.endGlyphID + 1 ? t.endGlyphID = e : n.push({
			startGlyphID: e,
			endGlyphID: e,
			class: r
		});
	}
	return {
		format: 2,
		ranges: n
	};
}
function Mr(e) {
	let t = [];
	for (let n = 0; n < e.length; n++) {
		let r = e[n], i = t[t.length - 1];
		i && r === i.endGlyphID + 1 ? i.endGlyphID = r : t.push({
			startGlyphID: r,
			endGlyphID: r,
			startCoverageIndex: n
		});
	}
	return {
		format: 2,
		ranges: t
	};
}
function Nr(e, t, n) {
	if (typeof e == "string" && e.startsWith("@")) {
		let r = t[e.slice(1)];
		if (!r) return [];
		let i = [];
		for (let e of r) {
			let t = n.get(e);
			t !== void 0 && i.push(t);
		}
		return i;
	}
	let r = n.get(e);
	return r === void 0 ? [] : [r];
}
function Pr(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let e = 0; e < t.length; e++) t[e].name && n.set(t[e].name, e);
	let { leftClasses: r = {}, rightClasses: i = {}, pairs: a = [] } = e, o = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map(), c = [null], l = [null];
	function u(e, t, r, i) {
		if (r.has(e)) return r.get(e);
		let a = i.length;
		return i.push(Nr(e, t, n)), r.set(e, a), a;
	}
	let d = [];
	for (let e of a) {
		if (!e || !e.value) continue;
		let t = u(e.left, r, o, c), n = u(e.right, i, s, l);
		d.push({
			lc: t,
			rc: n,
			value: e.value
		});
	}
	let f = c.length, p = l.length;
	if (f <= 1 || p <= 1 || d.length === 0) return null;
	let m = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map();
	for (let e = 1; e < f; e++) for (let t of c[e]) {
		if (m.has(t) && m.get(t) !== e) return null;
		m.set(t, e);
	}
	for (let e = 1; e < p; e++) for (let t of l[e]) {
		if (h.has(t) && h.get(t) !== e) return null;
		h.set(t, e);
	}
	if (m.size === 0 || h.size === 0) return null;
	let g = [];
	for (let e = 0; e < f; e++) {
		let e = [];
		for (let t = 0; t < p; t++) e.push({
			value1: { xAdvance: 0 },
			value2: null
		});
		g.push(e);
	}
	for (let { lc: e, rc: t, value: n } of d) g[e][t].value1.xAdvance = n;
	return {
		lookupType: 2,
		lookupFlag: 0,
		subtables: [{
			format: 2,
			coverage: Mr(Array.from(m.keys()).sort((e, t) => e - t)),
			valueFormat1: 4,
			valueFormat2: 0,
			classDef1: jr(m),
			classDef2: jr(h),
			class1Count: f,
			class2Count: p,
			class1Records: g
		}]
	};
}
function Fr(e, t) {
	if (!Array.isArray(e)) return [];
	let n = /* @__PURE__ */ new Set();
	for (let e of t) e.name && n.add(e.name);
	function r(e, t) {
		if (typeof e == "string" && e.startsWith("@")) {
			let r = t[e.slice(1)];
			return r ? r.filter((e) => n.has(e)) : [];
		}
		return n.has(e) ? [e] : [];
	}
	let i = [];
	for (let t of e) {
		if (!t || !Array.isArray(t.pairs)) continue;
		let { leftClasses: e = {}, rightClasses: n = {}, pairs: a = [] } = t;
		for (let t of a) {
			if (!t || !t.value) continue;
			let a = r(t.left, e), o = r(t.right, n);
			for (let e of a) for (let n of o) i.push({
				left: e,
				right: n,
				value: t.value
			});
		}
	}
	return i;
}
function Ir(e, t, n) {
	let r = [], i = t ? [...t] : [], a = Array.isArray(e) ? e : [];
	for (let e of a) {
		if (!e || !Array.isArray(e.pairs) || e.pairs.length === 0) continue;
		let t = Pr(e, n);
		t ? r.push(t) : i = i.concat(Fr([e], n));
	}
	if (i.length > 0) {
		let { pairs: e } = yr(i, n);
		e.length > 0 && r.push(Ar(e));
	}
	return r;
}
function Lr(e, t) {
	if (!t || t.length === 0) return null;
	let n = JSON.parse(JSON.stringify(e));
	if (!n.scriptList?.scriptRecords || !n.featureList?.featureRecords || !n.lookupList?.lookups) return null;
	let r = /* @__PURE__ */ new Set();
	for (let e of n.featureList.featureRecords) if (e.featureTag === "kern") for (let t of e.feature.lookupListIndices) r.add(t);
	let i = [];
	for (let e of t) i.push(n.lookupList.lookups.length), n.lookupList.lookups.push(e);
	let a = !1;
	for (let e of n.featureList.featureRecords) e.featureTag === "kern" && (e.feature.lookupListIndices = [...i], a = !0);
	if (!a) {
		n.featureList.featureRecords.push({
			featureTag: "kern",
			feature: {
				featureParamsOffset: 0,
				lookupListIndices: [...i]
			}
		});
		let e = n.featureList.featureRecords.length - 1;
		for (let t of n.scriptList.scriptRecords) {
			t.script.defaultLangSys && t.script.defaultLangSys.featureIndices.push(e);
			for (let n of t.script.langSysRecords || []) n.langSys.featureIndices.push(e);
		}
	}
	return n;
}
function Rr(e, t) {
	let { axes: n, instances: r = [] } = e, i = e.tables?.fvar, a = Math.max(255, ...t.names.map((e) => e.nameID)) + 1, o = n.map((e) => {
		let n = i?.axes.find((t) => t.axisTag === e.tag), r = n?.axisNameID ?? a++;
		return zr(t, r, e.name || e.tag), {
			axisTag: e.tag,
			minValue: e.min,
			defaultValue: e.default,
			maxValue: e.max,
			flags: (n?.flags || 0) & -2 | !!e.hidden,
			axisNameID: r
		};
	}), s = r.map((e, r) => {
		let o = i?.instances[r], s = o?.subfamilyNameID ?? a++;
		zr(t, s, e.name);
		let c = n.map((t) => e.coordinates[t.tag] ?? t.default), l = {
			subfamilyNameID: s,
			flags: o?.flags || 0,
			coordinates: c
		};
		if (e.postScriptName) {
			let n = o?.postScriptNameID === 65535 ? a++ : o?.postScriptNameID ?? a++;
			zr(t, n, e.postScriptName), l.postScriptNameID = n;
		}
		return l;
	});
	return {
		majorVersion: 1,
		minorVersion: 0,
		reserved: 2,
		axisSize: 20,
		instanceSize: 4 + n.length * 4 + (s.some((e) => e.postScriptNameID !== void 0) ? 2 : 0),
		axes: o,
		instances: s
	};
}
function zr(e, t, n) {
	if (!n) return;
	let r = [
		{
			platformID: 3,
			encodingID: 1,
			languageID: 1033,
			nameID: t,
			value: n
		},
		{
			platformID: 1,
			encodingID: 0,
			languageID: 0,
			nameID: t,
			value: n
		},
		{
			platformID: 0,
			encodingID: 3,
			languageID: 0,
			nameID: t,
			value: n
		}
	];
	for (let i of r) {
		let r = e.names.find((e) => e.nameID === t && e.platformID === i.platformID && e.encodingID === i.encodingID && e.languageID === i.languageID);
		r ? r.value = n : e.names.push(i);
	}
}
function Br(e, t) {
	let { axes: n } = e, r = 256;
	for (let e of t.names) e.nameID >= r && (r = e.nameID + 1);
	let i = n.map((e) => {
		let n = r++;
		return zr(t, n, e.name || e.tag), {
			axisTag: e.tag,
			axisNameID: n,
			axisOrdering: 0
		};
	}), a = [];
	for (let e = 0; e < n.length; e++) {
		let i = n[e], o = r++;
		zr(t, o, i.name || i.tag), a.push({
			format: 1,
			axisIndex: e,
			flags: 2,
			valueNameID: o,
			value: i.default
		});
	}
	let o = r++;
	return zr(t, o, "Regular"), {
		majorVersion: 1,
		minorVersion: 1,
		designAxes: i,
		axisValues: a,
		elidedFallbackNameID: o
	};
}
function Vr(e, t) {
	let { axes: n, axisStyles: r } = e, i = 256;
	for (let e of t.names) e.nameID >= i && (i = e.nameID + 1);
	let a = n.map((e) => {
		let n = i++;
		return zr(t, n, e.name || e.tag), {
			axisTag: e.tag,
			axisNameID: n,
			axisOrdering: 0
		};
	}), o = {};
	for (let e = 0; e < n.length; e++) o[n[e].tag] = e;
	let s = [];
	if (r.values) for (let e of r.values) {
		let n = i++;
		if (zr(t, n, e.name || ""), e._raw) s.push({
			...e._raw,
			valueNameID: n
		});
		else if (e.values) {
			let t = Object.entries(e.values).map(([e, t]) => ({
				axisIndex: o[e] ?? 0,
				value: t
			}));
			s.push({
				format: 4,
				axisCount: t.length,
				flags: e.flags ?? 0,
				valueNameID: n,
				axisValues: t
			});
		} else e.range ? s.push({
			format: 2,
			axisIndex: o[e.axis] ?? 0,
			flags: e.flags ?? 0,
			valueNameID: n,
			nominalValue: e.range[1],
			rangeMinValue: e.range[0],
			rangeMaxValue: e.range[2]
		}) : e.linkedValue === void 0 ? s.push({
			format: 1,
			axisIndex: o[e.axis] ?? 0,
			flags: e.flags ?? 0,
			valueNameID: n,
			value: e.value
		}) : s.push({
			format: 3,
			axisIndex: o[e.axis] ?? 0,
			flags: e.flags ?? 0,
			valueNameID: n,
			value: e.value,
			linkedValue: e.linkedValue
		});
	}
	let c = i++;
	return zr(t, c, r.elidedFallbackName || "Regular"), {
		majorVersion: 1,
		minorVersion: 1,
		designAxes: a,
		axisValues: s,
		elidedFallbackNameID: c
	};
}
function Hr(e) {
	let { axes: t, axisMapping: n } = e;
	return {
		majorVersion: 1,
		minorVersion: 0,
		reserved: 0,
		segmentMaps: t.map((e) => {
			let t = n[e.tag];
			return !t || t.length === 0 ? {
				positionMapCount: 3,
				axisValueMaps: [
					{
						fromCoordinate: -1,
						toCoordinate: -1
					},
					{
						fromCoordinate: 0,
						toCoordinate: 0
					},
					{
						fromCoordinate: 1,
						toCoordinate: 1
					}
				]
			} : {
				positionMapCount: t.length,
				axisValueMaps: t.map((e) => ({
					fromCoordinate: e.from,
					toCoordinate: e.to
				}))
			};
		})
	};
}
function Ur(e) {
	let { axes: t, metricVariations: n } = e, { regions: r, metrics: i } = n, a = {};
	for (let e = 0; e < t.length; e++) a[t[e].tag] = e;
	let o = r.map((e) => {
		let n = [];
		for (let r = 0; r < t.length; r++) {
			let i = t[r].tag;
			if (e.axes[i]) {
				let [t, r, a] = e.axes[i];
				n.push({
					startCoord: t,
					peakCoord: r,
					endCoord: a
				});
			} else n.push({
				startCoord: 0,
				peakCoord: 0,
				endCoord: 0
			});
		}
		return { regionAxes: n };
	}), s = /* @__PURE__ */ new Set();
	for (let e of Object.values(i)) for (let t of e) s.add(t.region);
	let c = [...s].sort((e, t) => e - t), l = /* @__PURE__ */ new Map();
	for (let e = 0; e < c.length; e++) l.set(c[e], e);
	let u = Object.entries(i), d = [], f = [];
	for (let [e, t] of u) {
		let n = st[e] || e, r = Array(c.length).fill(0);
		for (let e of t) {
			let t = l.get(e.region);
			t !== void 0 && (r[t] = e.delta);
		}
		d.push(r), f.push({
			valueTag: n,
			deltaSetOuterIndex: 0,
			deltaSetInnerIndex: d.length - 1
		});
	}
	let p = !1;
	for (let e of d) {
		for (let t of e) if (t < -32768 || t > 32767) {
			p = !0;
			break;
		}
		if (p) break;
	}
	let m = [], h = [];
	for (let e = 0; e < c.length; e++) {
		let t = !1;
		for (let n of d) {
			let r = n[e];
			if (p ? r < -32768 || r > 32767 : r < -128 || r > 127) {
				t = !0;
				break;
			}
		}
		(t ? m : h).push(e);
	}
	let g = [...m, ...h], _ = g.map((e) => c[e]), v = d.map((e) => g.map((t) => e[t])), y = p ? m.length | 32768 : m.length;
	return {
		majorVersion: 1,
		minorVersion: 0,
		reserved: 0,
		valueRecordSize: 8,
		valueRecords: f,
		itemVariationStore: {
			format: 1,
			variationRegionList: {
				axisCount: t.length,
				regions: o
			},
			itemVariationData: [{
				itemCount: v.length,
				wordDeltaCount: y,
				regionIndexes: _,
				deltaSets: v
			}]
		}
	};
}
function Wr(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n = 0; n < e.length; n++) e[n].name && t.set(e[n].name, n);
	return t;
}
function z(e, t, n) {
	if (typeof e == "string" && n.has(e)) return n.get(e);
	let r = T(t, e);
	if (r !== void 0) return n.get(r);
}
function Gr(e, t, n, r) {
	let i = t.substitutions, a = n.substitutions || [], o = Dr(e.lookupList), s = (e, t) => JSON.stringify(e) === JSON.stringify(t), c = new Set(i.map((e) => e.lookup?.id)), l = !s(Fe(e), n.substitutionMetadata), u = a.some((e) => !c.has(e.lookup?.id));
	if (l || u) {
		if (e.featureVariations || e.lookupList.lookups.some((e) => ![
			1,
			2,
			3,
			4,
			8
		].includes(e.lookupType)) || e.featureList.featureRecords.some((e) => e.feature.featureParams)) throw Error("Adding GSUB lookups or changing metadata requires explicit raw layout editing for this imported font.");
		return null;
	}
	let d = structuredClone(e), f = Wr(r);
	for (let t of c) {
		let n = i.filter((e) => e.lookup?.id === t), c = a.filter((e) => e.lookup?.id === t);
		if (s(n, c)) continue;
		let l = e.lookupList.lookups[t], u = (e) => [...new Set(e.map((e) => JSON.stringify([
			e.type,
			e.feature,
			e.script,
			e.language,
			e.allScripts,
			e.lookup
		])))];
		if (!l || o.has(t) || l.subtables.length !== 1 || n.some((e) => e.type === "contextual") || u(n).length !== 1 || c.length && !s(u(n), u(c))) throw Error("GSUB edit requires disambiguating shared, contextual or multi-subtable rules; edit raw GSUB explicitly.");
		d.lookupList.lookups[t] = c.length ? Zr(c[0].type, c, r, f) : {
			...l,
			lookupType: 1,
			subtables: [{
				format: 2,
				coverage: {
					format: 1,
					glyphs: []
				},
				substituteGlyphIDs: []
			}]
		};
	}
	let p = t.rawLookups, m = n._rawGSUBLookups || [];
	if (!s(p.map(({ index: e, features: t }) => ({
		index: e,
		features: t
	})), m.map(({ index: e, features: t }) => ({
		index: e,
		features: t
	})))) throw Error("Changing raw GSUB lookup identities requires explicit raw table editing.");
	for (let e of m) d.lookupList.lookups[e.index] = structuredClone(e.lookup);
	return d;
}
function Kr(e, t, n, r = {}) {
	let i = Wr(n), a = [], o = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map(), c = Xr(e), l = -1;
	for (let [e, t] of c) {
		let [r, c] = e.split("\0"), u;
		if (r === "contextual") {
			let e = Qr(t, n, i, a, s, l);
			u = e.lookup, l = e.nextSyntheticLookupId;
		} else u = Zr(r, t, n, i);
		if (!u) continue;
		let d = a.length;
		a.push(u);
		let f = t[0]?.lookup?.id;
		f !== void 0 && s.set(f, d), o.has(c) || o.set(c, {
			lookupIndices: /* @__PURE__ */ new Set(),
			scripts: /* @__PURE__ */ new Map()
		});
		let p = o.get(c);
		p.lookupIndices.add(d);
		for (let e of t) {
			let t = e.allScripts || [{
				script: e.script,
				language: e.language
			}];
			for (let e of t) {
				let t = e.script || "DFLT", n = e.language || null;
				p.scripts.has(t) || p.scripts.set(t, /* @__PURE__ */ new Set()), p.scripts.get(t).add(n);
			}
		}
	}
	for (let e of t) {
		s.set(e.index, a.length), a.push(structuredClone(e.lookup));
		for (let t of e.features) {
			let e = t.featureTag;
			o.has(e) || o.set(e, {
				lookupIndices: /* @__PURE__ */ new Set(),
				scripts: /* @__PURE__ */ new Map()
			});
			let n = o.get(e);
			n.lookupIndices.add(a.length - 1);
			let r = t.script || "DFLT", i = t.language || null;
			n.scripts.has(r) || n.scripts.set(r, /* @__PURE__ */ new Set()), n.scripts.get(r).add(i);
		}
	}
	s.size > 0 && ai(a, s);
	let u = [], d = /* @__PURE__ */ new Map();
	for (let [e, t] of o) d.set(e, u.length), u.push({
		featureTag: e,
		feature: {
			featureParamsOffset: 0,
			lookupListIndices: Array.from(t.lookupIndices).sort((e, t) => e - t)
		}
	});
	let f = /* @__PURE__ */ new Map();
	for (let [e, t] of o) {
		let n = d.get(e);
		for (let [e, r] of t.scripts) {
			f.has(e) || f.set(e, /* @__PURE__ */ new Map());
			let t = f.get(e);
			for (let e of r) t.has(e) || t.set(e, /* @__PURE__ */ new Set()), t.get(e).add(n);
		}
	}
	let p = [];
	for (let [e, t] of f) {
		let n = [], i = null;
		for (let [a, o] of t) {
			let t = {
				lookupOrderOffset: 0,
				requiredFeatureIndex: Jr(r, e, a, d),
				featureIndices: Array.from(o).sort((e, t) => e - t)
			};
			a === null ? i = t : n.push({
				langSysTag: a,
				langSys: t
			});
		}
		if (!i) {
			let n = /* @__PURE__ */ new Set();
			for (let [, e] of t) for (let t of e) n.add(t);
			i = {
				lookupOrderOffset: 0,
				requiredFeatureIndex: Jr(r, e, null, d),
				featureIndices: Array.from(n).sort((e, t) => e - t)
			};
		}
		p.push({
			scriptTag: e,
			script: {
				defaultLangSys: i,
				langSysRecords: n
			}
		});
	}
	let m = Yr(r, d, s), h = {
		majorVersion: r.majorVersion ?? 1,
		minorVersion: m ? Math.max(r.minorVersion ?? 0, 1) : 0,
		scriptList: { scriptRecords: p },
		featureList: { featureRecords: u },
		lookupList: { lookups: a }
	};
	return m && (h.featureVariations = m), h;
}
function qr(e, t = {}) {
	let n = [], r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
	for (let t of e) {
		i.set(t.index, n.length), n.push(structuredClone(t.lookup));
		for (let e of t.features) {
			let t = e.featureTag;
			r.has(t) || r.set(t, {
				lookupIndices: /* @__PURE__ */ new Set(),
				scripts: /* @__PURE__ */ new Map()
			});
			let i = r.get(t);
			i.lookupIndices.add(n.length - 1);
			let a = e.script || "DFLT", o = e.language || null;
			i.scripts.has(a) || i.scripts.set(a, /* @__PURE__ */ new Set()), i.scripts.get(a).add(o);
		}
	}
	i.size > 0 && ai(n, i);
	let a = [], o = /* @__PURE__ */ new Map();
	for (let [e, t] of r) o.set(e, a.length), a.push({
		featureTag: e,
		feature: {
			featureParamsOffset: 0,
			lookupListIndices: Array.from(t.lookupIndices).sort((e, t) => e - t)
		}
	});
	let s = /* @__PURE__ */ new Map();
	for (let [e, t] of r) {
		let n = o.get(e);
		for (let [e, r] of t.scripts) {
			s.has(e) || s.set(e, /* @__PURE__ */ new Map());
			let t = s.get(e);
			for (let e of r) t.has(e) || t.set(e, /* @__PURE__ */ new Set()), t.get(e).add(n);
		}
	}
	let c = [];
	for (let [e, n] of s) {
		let r = null, i = [];
		for (let [a, s] of n) {
			let n = {
				lookupOrderOffset: 0,
				requiredFeatureIndex: Jr(t, e, a, o),
				featureIndices: Array.from(s).sort((e, t) => e - t)
			};
			a === null ? r = n : i.push({
				langSysTag: a,
				langSys: n
			});
		}
		if (!r) {
			let i = /* @__PURE__ */ new Set();
			for (let [, e] of n) for (let t of e) i.add(t);
			r = {
				lookupOrderOffset: 0,
				requiredFeatureIndex: Jr(t, e, null, o),
				featureIndices: Array.from(i).sort((e, t) => e - t)
			};
		}
		c.push({
			scriptTag: e,
			script: {
				defaultLangSys: r,
				langSysRecords: i
			}
		});
	}
	let l = Yr(t, o, i), u = {
		majorVersion: t.majorVersion ?? 1,
		minorVersion: l ? Math.max(t.minorVersion ?? 0, 1) : 0,
		scriptList: { scriptRecords: c },
		featureList: { featureRecords: a },
		lookupList: { lookups: n }
	};
	return l && (u.featureVariations = l), u;
}
function Jr(e, t, n, r) {
	let i = (e.requiredFeatures || []).find((e) => e.script === t && e.language === n);
	return i ? r.get(i.feature) ?? 65535 : 65535;
}
function Yr(e, t, n) {
	if (!e.featureVariations) return null;
	let r = structuredClone(e.featureVariations);
	for (let i of r.featureVariationRecords || []) for (let r of i.featureTableSubstitution?.substitutions || []) {
		let i = e.featureOrder?.[r.featureIndex];
		!i || !t.has(i) || (r.featureIndex = t.get(i), r.feature.lookupListIndices = (r.feature.lookupListIndices || []).map((e) => n.get(e)).filter((e) => e !== void 0));
	}
	return r;
}
function Xr(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) {
		let e = n.lookup || {}, r = e.id === void 0 ? `auto:${e.flags || 0}:${e.markFilteringSet ?? ""}:${+!!e.useExtension}` : `id:${e.id}`, i = `${n.type}\0${n.feature}\0${r}`;
		t.has(i) || t.set(i, []), t.get(i).push(n);
	}
	return t;
}
function Zr(e, t, n, r) {
	let i;
	switch (e) {
		case "single":
			i = ei(t, n, r);
			break;
		case "multiple":
			i = ti(t, n, r);
			break;
		case "alternate":
			i = ni(t, n, r);
			break;
		case "ligature":
			i = ri(t, n, r);
			break;
		case "reverse":
			i = ii(t, n, r);
			break;
		default: return null;
	}
	if (!i) return null;
	let a = t[0]?.lookup;
	return a && (i.lookupFlag = a.flags || 0, a.markFilteringSet !== void 0 && (i.markFilteringSet = a.markFilteringSet, i.lookupFlag |= 16), a.useExtension && (i.useExtension = !0)), i;
}
function Qr(e, t, n, r, i, a) {
	let o = [], s = 5;
	for (let c of e) {
		let e = [];
		for (let o of c.actions || []) {
			let s = o.lookup?.id;
			if (s === void 0 && (s = a--), !i.has(s)) {
				let e = o.substitutions || [], a = e[0]?.type, c = Zr(a, e.map((e) => ({
					...e,
					lookup: o.lookup
				})), t, n);
				if (!c) continue;
				i.set(s, r.length), r.push(c);
			}
			e.push({
				sequenceIndex: o.at,
				lookupListIndex: s
			});
		}
		if (e.length === 0) continue;
		let l = $r(c.input, t, n);
		if (l.some((e) => e.glyphs.length === 0)) continue;
		let u = $r(c.backtrack, t, n), d = $r(c.lookahead, t, n);
		u.length || d.length ? (s = 6, o.push({
			format: 3,
			backtrackCoverages: u,
			inputCoverages: l,
			lookaheadCoverages: d,
			seqLookupRecords: e
		})) : o.push({
			format: 3,
			coverages: l,
			seqLookupRecords: e
		});
	}
	if (o.length === 0) return {
		lookup: null,
		nextSyntheticLookupId: a
	};
	let c = {
		lookupType: s,
		lookupFlag: 0,
		subtables: o
	}, l = e[0]?.lookup;
	return l && (c.lookupFlag = l.flags || 0, l.markFilteringSet !== void 0 && (c.markFilteringSet = l.markFilteringSet, c.lookupFlag |= 16), l.useExtension && (c.useExtension = !0)), {
		lookup: c,
		nextSyntheticLookupId: a
	};
}
function $r(e, t, n) {
	return (e || []).map((e) => ({
		format: 1,
		glyphs: e.map((e) => z(e, t, n)).filter((e) => e !== void 0).sort((e, t) => e - t)
	}));
}
function ei(e, t, n) {
	let r = [], i = [];
	for (let a of e) {
		let e = z(a.from, t, n), o = z(a.to, t, n);
		e !== void 0 && o !== void 0 && (r.push(e), i.push(o));
	}
	if (r.length === 0) return null;
	let a = r.map((e, t) => ({
		from: e,
		to: i[t]
	})).sort((e, t) => e.from - t.from);
	return {
		lookupType: 1,
		lookupFlag: 0,
		subtables: [{
			format: 2,
			coverage: {
				format: 1,
				glyphs: a.map((e) => e.from)
			},
			substituteGlyphIDs: a.map((e) => e.to)
		}]
	};
}
function ti(e, t, n) {
	let r = [];
	for (let i of e) {
		let e = z(i.from, t, n);
		if (e === void 0) continue;
		let a = [], o = !0;
		for (let e of i.to) {
			let r = z(e, t, n);
			if (r === void 0) {
				o = !1;
				break;
			}
			a.push(r);
		}
		o && a.length > 0 && r.push({
			from: e,
			to: a
		});
	}
	return r.length === 0 ? null : (r.sort((e, t) => e.from - t.from), {
		lookupType: 2,
		lookupFlag: 0,
		subtables: [{
			format: 1,
			coverage: {
				format: 1,
				glyphs: r.map((e) => e.from)
			},
			sequences: r.map((e) => e.to)
		}]
	});
}
function ni(e, t, n) {
	let r = [];
	for (let i of e) {
		let e = z(i.from, t, n);
		if (e === void 0) continue;
		let a = [], o = !0;
		for (let e of i.alternates) {
			let r = z(e, t, n);
			if (r === void 0) {
				o = !1;
				break;
			}
			a.push(r);
		}
		o && a.length > 0 && r.push({
			from: e,
			alternates: a
		});
	}
	return r.length === 0 ? null : (r.sort((e, t) => e.from - t.from), {
		lookupType: 3,
		lookupFlag: 0,
		subtables: [{
			format: 1,
			coverage: {
				format: 1,
				glyphs: r.map((e) => e.from)
			},
			alternateSets: r.map((e) => e.alternates)
		}]
	});
}
function ri(e, t, n) {
	let r = /* @__PURE__ */ new Map();
	for (let i of e) {
		if (!i.components || i.components.length < 2) continue;
		let e = z(i.components[0], t, n), a = z(i.ligature, t, n);
		if (e === void 0 || a === void 0) continue;
		let o = [], s = !0;
		for (let e = 1; e < i.components.length; e++) {
			let r = z(i.components[e], t, n);
			if (r === void 0) {
				s = !1;
				break;
			}
			o.push(r);
		}
		s && (r.has(e) || r.set(e, []), r.get(e).push({
			ligatureGlyph: a,
			componentCount: i.components.length,
			componentGlyphIDs: o
		}));
	}
	if (r.size === 0) return null;
	let i = Array.from(r.keys()).sort((e, t) => e - t), a = i.map((e) => r.get(e));
	return {
		lookupType: 4,
		lookupFlag: 0,
		subtables: [{
			format: 1,
			coverage: {
				format: 1,
				glyphs: i
			},
			ligatureSets: a
		}]
	};
}
function ii(e, t, n) {
	let r = [];
	for (let i of e) {
		let e = z(i.from, t, n), a = z(i.to, t, n);
		if (e === void 0 || a === void 0) continue;
		let o = (i.backtrack || []).map((e) => ({
			format: 1,
			glyphs: e.map((e) => z(e, t, n)).filter((e) => e !== void 0).sort((e, t) => e - t)
		})), s = (i.lookahead || []).map((e) => ({
			format: 1,
			glyphs: e.map((e) => z(e, t, n)).filter((e) => e !== void 0).sort((e, t) => e - t)
		}));
		r.push({
			format: 1,
			coverage: {
				format: 1,
				glyphs: [e]
			},
			backtrackCoverages: o,
			lookaheadCoverages: s,
			substituteGlyphIDs: [a]
		});
	}
	return r.length === 0 ? null : {
		lookupType: 8,
		lookupFlag: 0,
		subtables: r
	};
}
function ai(e, t) {
	for (let n of e) if (!(!n || !n.subtables) && (n.lookupType === 5 || n.lookupType === 6)) for (let e of n.subtables) oi(e, t);
}
function oi(e, t) {
	if (e.seqRuleSets) {
		for (let n of e.seqRuleSets) if (n) for (let e of n) si(e.seqLookupRecords, t);
	}
	if (e.classSeqRuleSets) {
		for (let n of e.classSeqRuleSets) if (n) for (let e of n) si(e.seqLookupRecords, t);
	}
	if (e.seqLookupRecords && si(e.seqLookupRecords, t), e.chainedSeqRuleSets) {
		for (let n of e.chainedSeqRuleSets) if (n) for (let e of n) si(e.seqLookupRecords, t);
	}
	if (e.chainedClassSeqRuleSets) {
		for (let n of e.chainedClassSeqRuleSets) if (n) for (let e of n) si(e.seqLookupRecords, t);
	}
}
function si(e, t) {
	if (e) for (let n of e) {
		let e = t.get(n.lookupListIndex);
		e !== void 0 && (n.lookupListIndex = e);
	}
}
function ci(t) {
	return !t || t.length === 0 ? null : {
		version: 0,
		numPaletteEntries: t[0].length,
		palettes: t.map((t) => t.map((t) => e(t)))
	};
}
function li(e, t) {
	if (!e || e.length === 0) return null;
	let n = o(t), r = (e) => n.get(e) ?? 0, i = e.some((e) => e.paint), a = e.filter((e) => e.layers), s = [], l = [], u = a.map((e) => ({
		...e,
		glyphID: r(e.name)
	})).sort((e, t) => e.glyphID - t.glyphID);
	for (let e of u) {
		let t = l.length;
		for (let t of e.layers) l.push({
			glyphID: r(t.glyph),
			paletteIndex: t.paletteIndex
		});
		s.push({
			glyphID: e.glyphID,
			firstLayerIndex: t,
			numLayers: e.layers.length
		});
	}
	if (!i) return {
		version: 0,
		baseGlyphRecords: s,
		layerRecords: l
	};
	let d = e.filter((e) => e.paint), f = [], p = d.map((e) => ({
		...e,
		glyphID: r(e.name)
	})).sort((e, t) => e.glyphID - t.glyphID);
	for (let e of p) {
		let t = structuredClone(e.paint);
		c(t, n), f.push({
			glyphID: e.glyphID,
			paint: t
		});
	}
	return {
		version: 1,
		baseGlyphRecords: s,
		layerRecords: l,
		baseGlyphPaintRecords: f,
		layerPaints: [],
		clipList: null,
		varIndexMap: null,
		itemVariationStore: null
	};
}
//#endregion
//#region src/otf/table_CFF.js
var ui = /* @__PURE__ */ new Set([
	15,
	16,
	17,
	18,
	3108,
	3109
]), di = /* @__PURE__ */ new Set([19]);
function fi(e, t) {
	let n = [];
	for (let { operator: r, operands: i } of e) {
		let e = t.has(r);
		for (let t of i) e && Number.isInteger(t) ? n.push(29, t >>> 24 & 255, t >>> 16 & 255, t >>> 8 & 255, t & 255) : n.push(...A(t));
		r >= 3072 ? n.push(12, r & 255) : n.push(r);
	}
	return n;
}
function pi(e) {
	let t = [];
	for (let n = 0; n < e.length; n++) t.push(e.charCodeAt(n));
	return t;
}
function mi(e) {
	return String.fromCharCode(...e);
}
function hi(e, t) {
	let n = new Uint8Array(e), r = n[0], i = n[1], a = n[2], o = se(n, a);
	a += o.totalBytes;
	let s = o.items.map(mi), c = se(n, a);
	a += c.totalBytes;
	let l = se(n, a);
	return a += l.totalBytes, {
		majorVersion: r,
		minorVersion: i,
		names: s,
		strings: l.items.map(mi),
		globalSubrs: se(n, a).items.map((e) => Array.from(e)),
		fonts: c.items.map((e) => gi(n, e))
	};
}
function gi(e, t) {
	let n = be(j(t, 0, t.length), fe), r = n.CharStrings, i = n.charset ?? 0, a = n.Encoding ?? 0, o = n.Private;
	delete n.CharStrings, delete n.charset, delete n.Encoding, delete n.Private;
	let s = n.FDArray, c = n.FDSelect;
	delete n.FDArray, delete n.FDSelect;
	let l = [];
	r !== void 0 && (l = se(e, r).items.map((e) => Array.from(e)));
	let u = l.length, d = Te(e, i, u), f = De(e, a), p = {}, m = [];
	if (Array.isArray(o) && o.length === 2) {
		let [t, n] = o;
		p = be(j(e, n, n + t), me), p.Subrs !== void 0 && (m = se(e, n + p.Subrs).items.map((e) => Array.from(e)), delete p.Subrs);
	}
	let h = n.ROS !== void 0, g, _;
	h && (s !== void 0 && (g = se(e, s).items.map((t) => {
		let n = be(j(t, 0, t.length), fe), r = {}, i = [];
		if (Array.isArray(n.Private) && n.Private.length === 2) {
			let [t, a] = n.Private;
			r = be(j(e, a, a + t), me), r.Subrs !== void 0 && (i = se(e, a + r.Subrs).items.map((e) => Array.from(e)), delete r.Subrs), delete n.Private;
		}
		return {
			fontDict: n,
			privateDict: r,
			localSubrs: i
		};
	})), c !== void 0 && (_ = Ce(e, c, u)));
	let v = {
		topDict: n,
		charset: d,
		encoding: f,
		charStrings: l,
		privateDict: p,
		localSubrs: m
	};
	return h && (v.isCIDFont = !0, g && (v.fdArray = g), _ && (v.fdSelect = _)), v;
}
function _i(e) {
	let { majorVersion: t = 1, minorVersion: n = 0, names: r = [], strings: i = [], globalSubrs: a = [], fonts: o = [] } = e, s = [
		t,
		n,
		4,
		4
	], c = ue(r.map(pi)), l = ue(i.map(pi)), u = ue(a.map((e) => new Uint8Array(e))), d = o.map((e) => vi(e)), f = ue(o.map((e, t) => yi(e, d[t], 0))), p = s.length + c.length + f.length + l.length + u.length, m = ue(o.map((e, t) => {
		d[t] = vi(e, p);
		let n = yi(e, d[t], p);
		return p += d[t].totalSize, n;
	}));
	if (m.length !== f.length) throw Error("CFF Top DICT INDEX size mismatch — this should not happen with forced int32 offsets");
	let h = [
		...s,
		...c,
		...m,
		...l,
		...u
	];
	for (let e of d) for (let t of e.sections) for (let e = 0; e < t.length; e++) h.push(t[e]);
	return h;
}
function vi(e, t = 0) {
	let n = [], r = {}, i = 0, a = ue((e.charStrings || []).map((e) => !e || e.length === 0 ? new Uint8Array([14]) : new Uint8Array(e)));
	r.charStrings = i, n.push(a), i += a.length;
	let o = e.charset;
	if (typeof o == "string") r.charset = o === "ISOAdobe" ? 0 : o === "Expert" ? 1 : 2, r.charsetIsPredefined = !0;
	else {
		let e = Ee(o || []);
		r.charset = i, r.charsetIsPredefined = !1, n.push(e), i += e.length;
	}
	let s = e.encoding;
	if (typeof s == "string") r.encoding = s === "Standard" ? 0 : 1, r.encodingIsPredefined = !0;
	else if (s && typeof s == "object") {
		let e = bi(s);
		r.encoding = i, r.encodingIsPredefined = !1, n.push(e), i += e.length;
	} else r.encoding = 0, r.encodingIsPredefined = !0;
	let c = xe(e.privateDict || {}, he), l = null;
	if (e.localSubrs && e.localSubrs.length > 0 && (l = ue(e.localSubrs.map((e) => new Uint8Array(e)))), l) {
		let e = fi(c, di).length + 6;
		c.push({
			operator: he.Subrs,
			operands: [e]
		});
	}
	let u = fi(c, di);
	if (r.privateOffset = i, r.privateSize = u.length, n.push(u), i += u.length, l && (n.push(l), i += l.length), e.isCIDFont) {
		if (e.fdSelect) {
			let t = we(e.fdSelect);
			r.fdSelect = i, n.push(t), i += t.length;
		}
		if (e.fdArray) {
			let a = ue(e.fdArray.map((e) => {
				let r = xe(e.privateDict || {}, he), a = e.localSubrs?.length ? ue(e.localSubrs.map((e) => new Uint8Array(e))) : null;
				if (a) {
					let e = fi(r, di).length + 6;
					r.push({
						operator: he.Subrs,
						operands: [e]
					});
				}
				let o = fi(r, di), s = i + t;
				n.push(o), i += o.length, a && (n.push(a), i += a.length);
				let c = xe(e.fontDict || {}, pe);
				return c.push({
					operator: pe.Private,
					operands: [o.length, s]
				}), fi(c, ui);
			}));
			r.fdArray = i, n.push(a), i += a.length;
		}
	}
	return {
		sections: n,
		totalSize: i,
		offsets: r
	};
}
function yi(e, t, n) {
	let r = t.offsets, i = xe(e.topDict || {}, pe);
	return i.push({
		operator: pe.CharStrings,
		operands: [n + r.charStrings]
	}), r.charsetIsPredefined ? r.charset !== 0 && i.push({
		operator: pe.charset,
		operands: [r.charset]
	}) : i.push({
		operator: pe.charset,
		operands: [n + r.charset]
	}), r.encodingIsPredefined ? r.encoding !== 0 && i.push({
		operator: pe.Encoding,
		operands: [r.encoding]
	}) : i.push({
		operator: pe.Encoding,
		operands: [n + r.encoding]
	}), i.push({
		operator: pe.Private,
		operands: [r.privateSize, n + r.privateOffset]
	}), e.isCIDFont && (r.fdArray !== void 0 && i.push({
		operator: pe.FDArray,
		operands: [n + r.fdArray]
	}), r.fdSelect !== void 0 && i.push({
		operator: pe.FDSelect,
		operands: [n + r.fdSelect]
	})), fi(i, ui);
}
function bi(e) {
	let { format: t = 0, codes: n = [], hasSupplement: r = !1 } = e, i = [], a = t | (r ? 128 : 0);
	if (t === 0) {
		i.push(a), i.push(n.length);
		for (let e of n) i.push(e);
	} else if (t === 1) {
		let e = [];
		if (n.length > 0) {
			let t = n[0], r = 0;
			for (let i = 1; i < n.length; i++) n[i] === t + r + 1 ? r++ : (e.push([t, r]), t = n[i], r = 0);
			e.push([t, r]);
		}
		i.push(a), i.push(e.length);
		for (let [t, n] of e) i.push(t, n);
	}
	return i;
}
//#endregion
//#region src/sfnt/item_variation_store.js
var xi = 32768, Si = 32767;
function Ci(e) {
	let t = new F(e), n = t.uint16(), r = t.offset32(), i = t.uint16(), a = t.array("offset32", i), o = wi(t, r), s = [];
	for (let e = 0; e < i; e++) {
		let n = a[e];
		n === 0 ? s.push(null) : s.push(Ti(t, n));
	}
	return {
		format: n,
		variationRegionList: o,
		itemVariationData: s
	};
}
function wi(e, t) {
	e.seek(t);
	let n = e.uint16(), r = e.uint16(), i = [];
	for (let t = 0; t < r; t++) {
		let t = [];
		for (let r = 0; r < n; r++) t.push({
			startCoord: e.f2dot14(),
			peakCoord: e.f2dot14(),
			endCoord: e.f2dot14()
		});
		i.push({ regionAxes: t });
	}
	return {
		axisCount: n,
		regions: i
	};
}
function Ti(e, t) {
	e.seek(t);
	let n = e.uint16(), r = e.uint16(), i = e.uint16(), a = e.array("uint16", i), o = (r & xi) !== 0, s = r & Si, c = [];
	for (let t = 0; t < n; t++) {
		let t = [];
		for (let n = 0; n < s; n++) t.push(o ? e.int32() : e.int16());
		for (let n = s; n < i; n++) t.push(o ? e.int16() : e.int8());
		c.push(t);
	}
	return {
		itemCount: n,
		wordDeltaCount: r,
		regionIndexes: a,
		deltaSets: c
	};
}
function Ei(e) {
	let t = e.variationRegionList, n = e.itemVariationData ?? [], r = n.length, i = 8 + 4 * r, a = t.axisCount, o = t.regions.length, s = 4 + o * a * 6, c = i, l = c + s, u = [], d = [];
	for (let e = 0; e < r; e++) {
		let t = n[e];
		if (!t) {
			u.push(0), d.push(0);
			continue;
		}
		u.push(l);
		let r = t.regionIndexes.length, i = (t.wordDeltaCount & xi) !== 0, a = t.wordDeltaCount & Si, o = 6 + 2 * r, s = i ? 4 : 2, c = i ? 2 : 1, f = a * s + (r - a) * c, p = o + t.itemCount * f;
		d.push(p), l += p;
	}
	let f = new I(l);
	f.uint16(e.format ?? 1), f.offset32(c), f.uint16(r);
	for (let e = 0; e < r; e++) f.offset32(u[e]);
	f.uint16(a), f.uint16(o);
	for (let e of t.regions) for (let t of e.regionAxes) f.f2dot14(t.startCoord), f.f2dot14(t.peakCoord), f.f2dot14(t.endCoord);
	for (let e = 0; e < r; e++) {
		let t = n[e];
		if (!t) continue;
		let r = t.regionIndexes.length, i = (t.wordDeltaCount & xi) !== 0, a = t.wordDeltaCount & Si;
		f.uint16(t.itemCount), f.uint16(t.wordDeltaCount), f.uint16(r), f.array("uint16", t.regionIndexes);
		for (let e of t.deltaSets) {
			for (let t = 0; t < a; t++) i ? f.int32(e[t] ?? 0) : f.int16(e[t] ?? 0);
			for (let t = a; t < r; t++) i ? f.int16(e[t] ?? 0) : f.int8(e[t] ?? 0);
		}
	}
	return f.toArray();
}
//#endregion
//#region src/otf/table_CFF2.js
function Di(e) {
	let t = Ei(e), n = t.length, r = new Uint8Array(2 + n);
	return r[0] = n >> 8 & 255, r[1] = n & 255, r.set(new Uint8Array(t), 2), r;
}
var Oi = Object.fromEntries(Object.entries(ve).map(([e, t]) => [t, Number(e)])), ki = Object.fromEntries(Object.entries(ye).map(([e, t]) => [t, Number(e)])), Ai = /* @__PURE__ */ new Set([
	17,
	24,
	3108,
	3109
]), ji = /* @__PURE__ */ new Set([18]), Mi = /* @__PURE__ */ new Set([19]);
function Ni(e, t) {
	let n = [];
	for (let { operator: r, operands: i } of e) {
		let e = t.has(r);
		for (let t of i) e && Number.isInteger(t) ? n.push(29, t >>> 24 & 255, t >>> 16 & 255, t >>> 8 & 255, t & 255) : n.push(...A(t));
		r >= 3072 ? n.push(12, r & 255) : n.push(r);
	}
	return n;
}
function Pi(e, t) {
	let n = new Uint8Array(e), r = n[0], i = n[1], a = n[2], o = n[3] << 8 | n[4], s = a, c = s + o, l = be(j(n, s, c), ge), u = l.CharStrings, d = l.VariationStore, f = l.FDArray, p = l.FDSelect;
	delete l.CharStrings, delete l.VariationStore, delete l.FDArray, delete l.FDSelect;
	let m = ce(n, c).items.map((e) => Array.from(e)), h = [];
	u !== void 0 && (h = ce(n, u).items.map((e) => Array.from(e)));
	let g = h.length, _ = [];
	f !== void 0 && (_ = ce(n, f).items.map((e) => {
		let t = be(j(e, 0, e.length), {
			...ve,
			...ge
		}), r = {}, i = [], a = [];
		if (Array.isArray(t.Private) && t.Private.length === 2) {
			let [e, o] = t.Private, s = j(n, o, o + e);
			i = s.filter((e) => e.operator !== 19), r = be(s, ye), r.Subrs !== void 0 && (a = ce(n, o + r.Subrs).items.map((e) => Array.from(e)), delete r.Subrs), delete t.Private;
		}
		return {
			fontDict: t,
			privateDict: r,
			privateDictEntries: i,
			localSubrs: a
		};
	}));
	let v = null;
	p !== void 0 && g > 0 && (v = Ce(n, p, g));
	let y = null;
	if (d !== void 0) {
		let e = n[d] << 8 | n[d + 1];
		y = Ci(Array.from(n.slice(d + 2, d + 2 + e)));
	}
	return {
		majorVersion: r,
		minorVersion: i,
		topDict: l,
		globalSubrs: m,
		charStrings: h,
		fontDicts: _,
		fdSelect: v,
		variationStore: y
	};
}
function Fi(e) {
	let { majorVersion: t = 2, minorVersion: n = 0, topDict: r = {}, globalSubrs: i = [], charStrings: a = [], fontDicts: o = [], fdSelect: s = null, variationStore: c = null } = e, l = de(i.map((e) => new Uint8Array(e))), u = de(a.map((e) => new Uint8Array(e))), d = s ? we(s) : null, f = c ? Di(c) : null, p = Ii(r, {
		charStrings: 0,
		fdArray: o.length > 0 ? 0 : void 0,
		fdSelect: s ? 0 : void 0,
		variationStore: c ? 0 : void 0
	}).length, m = 5 + p + l.length, h = m;
	m += u.length;
	let g;
	d && (g = m, m += d.length);
	let _;
	f && (_ = m, m += f.length);
	let v = o.map((e) => {
		let t = xe(e.privateDict || {}, ki);
		if (e.privateDictEntries?.length) {
			let n = be(e.privateDictEntries, ye);
			if (JSON.stringify(n) !== JSON.stringify(e.privateDict || {})) throw Error("Editing imported CFF2 private dictionaries requires ordered blend-program compilation.");
			t = structuredClone(e.privateDictEntries);
		}
		let n = null;
		if (e.localSubrs && e.localSubrs.length > 0 && (n = de(e.localSubrs.map((e) => new Uint8Array(e)))), n) {
			let e = Ni(t, Mi).length + 6;
			t.push({
				operator: 19,
				operands: [e]
			});
		}
		let r = Ni(t, Mi);
		return {
			privBytes: r,
			localSubrBytes: n,
			totalSize: r.length + (n ? n.length : 0)
		};
	}), y = [];
	for (let e of v) y.push({
		offset: m,
		size: e.privBytes.length
	}), m += e.totalSize;
	let b = null, x;
	o.length > 0 && (b = de(o.map((e, t) => {
		let n = xe(e.fontDict || {}, {
			...Oi,
			..._e
		});
		return n.push({
			operator: 18,
			operands: [y[t].size, y[t].offset]
		}), Ni(n, ji);
	})), x = m, m += b.length);
	let S = Ii(r, {
		charStrings: h,
		fdArray: x,
		fdSelect: g,
		variationStore: _
	});
	if (S.length !== p) throw Error("CFF2 TopDICT size mismatch — this should not happen with forced int32 offsets");
	let C = [
		t,
		n,
		5,
		p >> 8 & 255,
		p & 255,
		...S,
		...l,
		...u
	];
	if (d) for (let e = 0; e < d.length; e++) C.push(d[e]);
	if (f) for (let e = 0; e < f.length; e++) C.push(f[e]);
	for (let e of v) {
		for (let t = 0; t < e.privBytes.length; t++) C.push(e.privBytes[t]);
		if (e.localSubrBytes) for (let t = 0; t < e.localSubrBytes.length; t++) C.push(e.localSubrBytes[t]);
	}
	if (b) for (let e = 0; e < b.length; e++) C.push(b[e]);
	return C;
}
function Ii(e, t) {
	let n = xe(e, _e);
	return t.charStrings !== void 0 && n.push({
		operator: _e.CharStrings,
		operands: [t.charStrings]
	}), t.fdArray !== void 0 && n.push({
		operator: _e.FDArray,
		operands: [t.fdArray]
	}), t.fdSelect !== void 0 && n.push({
		operator: _e.FDSelect,
		operands: [t.fdSelect]
	}), t.variationStore !== void 0 && n.push({
		operator: _e.VariationStore,
		operands: [t.variationStore]
	}), Ni(n, Ai);
}
//#endregion
//#region src/otf/table_VORG.js
var Li = 8, Ri = 4;
function zi(e) {
	let t = new F(e), n = t.uint16(), r = t.uint16(), i = t.int16(), a = t.uint16(), o = [];
	for (let e = 0; e < a; e++) o.push({
		glyphIndex: t.uint16(),
		vertOriginY: t.int16()
	});
	return {
		majorVersion: n,
		minorVersion: r,
		defaultVertOriginY: i,
		numVertOriginYMetrics: a,
		vertOriginYMetrics: o
	};
}
function Bi(e) {
	let t = e.majorVersion ?? 1, n = e.minorVersion ?? 0, r = e.defaultVertOriginY ?? 0, i = e.vertOriginYMetrics ?? [], a = e.numVertOriginYMetrics ?? i.length, o = i.slice(0, a);
	for (; o.length < a;) o.push({
		glyphIndex: 0,
		vertOriginY: r
	});
	let s = new I(Li + a * Ri);
	s.uint16(t), s.uint16(n), s.int16(r), s.uint16(a);
	for (let e of o) s.uint16(e.glyphIndex ?? 0), s.int16(e.vertOriginY ?? r);
	return s.toArray();
}
//#endregion
//#region src/sfnt/table_avar.js
var Vi = 8;
function Hi(e) {
	let t = new F(e), n = t.uint16(), r = t.uint16(), i = t.uint16(), a = t.uint16(), o = [];
	for (let e = 0; e < a; e++) {
		let e = t.uint16(), n = [];
		for (let r = 0; r < e; r++) n.push({
			fromCoordinate: t.f2dot14(),
			toCoordinate: t.f2dot14()
		});
		o.push({
			positionMapCount: e,
			axisValueMaps: n
		});
	}
	return {
		majorVersion: n,
		minorVersion: r,
		reserved: i,
		segmentMaps: o
	};
}
function Ui(e) {
	let t = e.majorVersion ?? 1, n = e.minorVersion ?? 0, r = e.reserved ?? 0, i = e.segmentMaps ?? [], a = Vi;
	for (let e of i) {
		let t = e.axisValueMaps?.length ?? e.positionMapCount ?? 0;
		a += 2 + t * 4;
	}
	let o = new I(a);
	o.uint16(t), o.uint16(n), o.uint16(r), o.uint16(i.length);
	for (let e of i) {
		let t = e.axisValueMaps ?? [];
		o.uint16(t.length);
		for (let e of t) o.f2dot14(e.fromCoordinate), o.f2dot14(e.toCoordinate);
	}
	return o.toArray();
}
//#endregion
//#region src/sfnt/opentype_layout_common.js
function B(e, t) {
	e.seek(t);
	let n = e.uint16();
	if (n === 1) {
		let t = e.uint16();
		return {
			format: n,
			glyphs: e.array("uint16", t)
		};
	}
	if (n === 2) {
		let t = e.uint16(), r = [];
		for (let n = 0; n < t; n++) r.push({
			startGlyphID: e.uint16(),
			endGlyphID: e.uint16(),
			startCoverageIndex: e.uint16()
		});
		return {
			format: n,
			ranges: r
		};
	}
	throw Error(`Unknown Coverage format: ${n}`);
}
function V(e) {
	if (e.format === 1) {
		let t = new I(4 + e.glyphs.length * 2);
		return t.uint16(1), t.uint16(e.glyphs.length), t.array("uint16", e.glyphs), t.toArray();
	}
	if (e.format === 2) {
		let t = new I(4 + e.ranges.length * 6);
		t.uint16(2), t.uint16(e.ranges.length);
		for (let n of e.ranges) t.uint16(n.startGlyphID), t.uint16(n.endGlyphID), t.uint16(n.startCoverageIndex);
		return t.toArray();
	}
	throw Error(`Unknown Coverage format: ${e.format}`);
}
function Wi(e, t) {
	e.seek(t);
	let n = e.uint16();
	if (n === 1) {
		let t = e.uint16(), r = e.uint16();
		return {
			format: n,
			startGlyphID: t,
			classValues: e.array("uint16", r)
		};
	}
	if (n === 2) {
		let t = e.uint16(), r = [];
		for (let n = 0; n < t; n++) r.push({
			startGlyphID: e.uint16(),
			endGlyphID: e.uint16(),
			class: e.uint16()
		});
		return {
			format: n,
			ranges: r
		};
	}
	throw Error(`Unknown ClassDef format: ${n}`);
}
function Gi(e) {
	if (e.format === 1) {
		let t = new I(6 + e.classValues.length * 2);
		return t.uint16(1), t.uint16(e.startGlyphID), t.uint16(e.classValues.length), t.array("uint16", e.classValues), t.toArray();
	}
	if (e.format === 2) {
		let t = new I(4 + e.ranges.length * 6);
		t.uint16(2), t.uint16(e.ranges.length);
		for (let n of e.ranges) t.uint16(n.startGlyphID), t.uint16(n.endGlyphID), t.uint16(n.class);
		return t.toArray();
	}
	throw Error(`Unknown ClassDef format: ${e.format}`);
}
function Ki(e, t) {
	e.seek(t);
	let n = e.uint16(), r = e.uint16(), i = e.uint16();
	if (i === 32768) return {
		format: 32768,
		deltaSetOuterIndex: n,
		deltaSetInnerIndex: r
	};
	let a = n, o = r, s = i, c = o - a + 1, l, u, d;
	if (s === 1) l = 2, u = 3, d = 2;
	else if (s === 2) l = 4, u = 15, d = 8;
	else if (s === 3) l = 8, u = 255, d = 128;
	else throw Error(`Unknown Device deltaFormat: ${s} at offset ${t} (words: ${n}, ${r}, ${i})`);
	let f = 16 / l, p = Math.ceil(c / f), m = [];
	for (let t = 0; t < p; t++) {
		let n = e.uint16(), r = Math.min(f, c - t * f);
		for (let e = 0; e < r; e++) {
			let t = n >> 16 - l * (e + 1) & u;
			t >= d && (t -= d * 2), m.push(t);
		}
	}
	return {
		format: s,
		startSize: a,
		endSize: o,
		deltaValues: m
	};
}
function qi(e) {
	if (e.format === 32768) {
		let t = new I(6);
		return t.uint16(e.deltaSetOuterIndex), t.uint16(e.deltaSetInnerIndex), t.uint16(32768), t.toArray();
	}
	let { startSize: t, endSize: n, deltaFormat: r, deltaValues: i } = e, a;
	if (r === 1) a = 2;
	else if (r === 2) a = 4;
	else if (r === 3) a = 8;
	else throw Error(`Unknown Device deltaFormat: ${r}`);
	let o = 16 / a, s = Math.ceil(i.length / o), c = (1 << a) - 1, l = new I(6 + s * 2);
	l.uint16(t), l.uint16(n), l.uint16(r);
	for (let e = 0; e < s; e++) {
		let t = 0, n = Math.min(o, i.length - e * o);
		for (let r = 0; r < n; r++) {
			let n = 16 - a * (r + 1);
			t |= (i[e * o + r] & c) << n;
		}
		l.uint16(t);
	}
	return l.toArray();
}
function Ji(e, t) {
	e.seek(t);
	let n = e.uint16(), r = [];
	for (let t = 0; t < n; t++) r.push({
		scriptTag: e.tag(),
		scriptOffset: e.uint16()
	});
	return { scriptRecords: r.map((n) => ({
		scriptTag: n.scriptTag,
		script: Yi(e, t + n.scriptOffset)
	})) };
}
function Yi(e, t) {
	e.seek(t);
	let n = e.uint16(), r = e.uint16(), i = [];
	for (let t = 0; t < r; t++) i.push({
		langSysTag: e.tag(),
		langSysOffset: e.uint16()
	});
	return {
		defaultLangSys: n === 0 ? null : Xi(e, t + n),
		langSysRecords: i.map((n) => ({
			langSysTag: n.langSysTag,
			langSys: Xi(e, t + n.langSysOffset)
		}))
	};
}
function Xi(e, t) {
	e.seek(t);
	let n = e.uint16(), r = e.uint16(), i = e.uint16();
	return {
		lookupOrderOffset: n,
		requiredFeatureIndex: r,
		featureIndices: e.array("uint16", i)
	};
}
function Zi(e) {
	let { scriptRecords: t } = e, n = t.map((e) => Qi(e.script)), r = 2 + t.length * 6, i = [], a = r;
	for (let e of n) i.push(a), a += e.length;
	let o = new I(a);
	o.uint16(t.length);
	for (let e = 0; e < t.length; e++) o.tag(t[e].scriptTag), o.uint16(i[e]);
	for (let e = 0; e < n.length; e++) o.seek(i[e]), o.rawBytes(n[e]);
	return o.toArray();
}
function Qi(e) {
	let { defaultLangSys: t, langSysRecords: n } = e, r = n.map((e) => $i(e.langSys)), i = t ? $i(t) : null, a = 4 + n.length * 6, o = i ? a : 0;
	i && (a += i.length);
	let s = [];
	for (let e of r) s.push(a), a += e.length;
	let c = new I(a);
	c.uint16(o), c.uint16(n.length);
	for (let e = 0; e < n.length; e++) c.tag(n[e].langSysTag), c.uint16(s[e]);
	i && (c.seek(o), c.rawBytes(i));
	for (let e = 0; e < r.length; e++) c.seek(s[e]), c.rawBytes(r[e]);
	return c.toArray();
}
function $i(e) {
	let t = new I(6 + e.featureIndices.length * 2);
	return t.uint16(e.lookupOrderOffset), t.uint16(e.requiredFeatureIndex), t.uint16(e.featureIndices.length), t.array("uint16", e.featureIndices), t.toArray();
}
function ea(e, t) {
	e.seek(t);
	let n = e.uint16(), r = [];
	for (let t = 0; t < n; t++) r.push({
		featureTag: e.tag(),
		featureOffset: e.uint16()
	});
	return { featureRecords: r.map((n) => ({
		featureTag: n.featureTag,
		feature: ta(e, t + n.featureOffset, n.featureTag)
	})) };
}
function ta(e, t, n) {
	e.seek(t);
	let r = e.uint16(), i = e.uint16(), a = {
		featureParamsOffset: r,
		lookupListIndices: e.array("uint16", i)
	};
	if (r && n === "size" && (e.seek(t + r), a.featureParams = e.array("uint8", 10)), r && /^ss\d\d$/.test(n) && (e.seek(t + r), a.featureParams = e.array("uint8", 4)), r && /^cv\d\d$/.test(n)) {
		e.seek(t + r + 12);
		let n = e.uint16();
		e.seek(t + r), a.featureParams = e.array("uint8", 14 + n * 3);
	}
	return a;
}
function na(e) {
	let { featureRecords: t } = e, n = t.map((e) => ra(e.feature)), r = 2 + t.length * 6, i = [], a = r;
	for (let e of n) i.push(a), a += e.length;
	let o = new I(a);
	o.uint16(t.length);
	for (let e = 0; e < t.length; e++) o.tag(t[e].featureTag), o.uint16(i[e]);
	for (let e = 0; e < n.length; e++) o.seek(i[e]), o.rawBytes(n[e]);
	return o.toArray();
}
function ra(e) {
	let t = 4 + e.lookupListIndices.length * 2, n = e.featureParams || [], r = new I(t + n.length);
	return r.uint16(n.length ? t : 0), r.uint16(e.lookupListIndices.length), r.array("uint16", e.lookupListIndices), r.rawBytes(n), r.toArray();
}
function ia(e, t, n, r) {
	e.seek(t);
	let i = e.uint16();
	return { lookups: e.array("uint16", i).map((i) => aa(e, t + i, n, r)) };
}
function aa(e, t, n, r) {
	e.seek(t);
	let i = e.uint16(), a = e.uint16(), o = e.uint16(), s = e.array("uint16", o), c = a & 16 ? e.uint16() : void 0, l = s.map((r) => n(e, t + r, i)), u = i, d = l;
	r !== void 0 && i === r && l.length > 0 && (u = l[0].extensionLookupType, d = l.map((e) => e.subtable));
	let f = {
		lookupType: u,
		lookupFlag: a,
		subtables: d
	};
	return u !== i && (f.useExtension = !0), c !== void 0 && (f.markFilteringSet = c), f;
}
function oa(e, t, n) {
	let { lookups: r } = e, i = r.map((e) => {
		let n = e.subtables.map((n) => t(n, e.lookupType));
		return {
			...e,
			subtableBytes: n
		};
	}), a = i.map((e) => {
		let { lookupType: t, lookupFlag: n, subtableBytes: r, markFilteringSet: i } = e, a = i !== void 0, o = 6 + r.length * 2 + (a ? 2 : 0), s = r.map((e) => {
			let t = o;
			return o += e.length, t;
		}), c = new I(o);
		c.uint16(t), c.uint16(n), c.uint16(r.length), c.array("uint16", s), a && c.uint16(i);
		for (let e = 0; e < r.length; e++) c.seek(s[e]), c.rawBytes(r[e]);
		return c.toArray();
	}), o = 2 + r.length * 2, s = ((e) => {
		let t = o;
		for (let n of e) {
			if (t > 65535) return !0;
			t += n.length;
		}
		return !1;
	})(a), c = i.some((e) => e.useExtension);
	if ((s || c) && n !== void 0) {
		let e = i.map((e, t) => {
			if (!s && !e.useExtension) return {
				compactBytes: a[t],
				subtableOffsets: [],
				innerDataBytes: []
			};
			let { lookupType: r, lookupFlag: i, subtableBytes: o, markFilteringSet: c } = e, l = c !== void 0, u = 6 + o.length * 2 + (l ? 2 : 0), d = o.map(() => {
				let e = u;
				return u += 8, e;
			}), f = new I(u);
			f.uint16(n), f.uint16(i), f.uint16(o.length), f.array("uint16", d), l && f.uint16(c);
			for (let e = 0; e < o.length; e++) f.seek(d[e]), f.uint16(1), f.uint16(r), f.uint32(0);
			return {
				compactBytes: f.toArray(),
				subtableOffsets: d,
				innerDataBytes: o
			};
		}), t = o, c = e.map((e) => {
			let n = t;
			return t += e.compactBytes.length, n;
		}), l = e.map((e) => e.innerDataBytes.map((e) => {
			let n = t;
			return t += e.length, n;
		})), u = new I(t);
		u.uint16(r.length), u.array("uint16", c);
		for (let t = 0; t < e.length; t++) u.seek(c[t]), u.rawBytes(e[t].compactBytes);
		for (let t = 0; t < e.length; t++) {
			let n = e[t];
			for (let e = 0; e < n.innerDataBytes.length; e++) {
				let r = c[t] + n.subtableOffsets[e], i = l[t][e], a = i - r;
				u.seek(r + 4), u.uint32(a), u.seek(i), u.rawBytes(n.innerDataBytes[e]);
			}
		}
		return u.toArray();
	}
	let l = o, u = a.map((e) => {
		let t = l;
		return l += e.length, t;
	}), d = new I(l);
	d.uint16(r.length), d.array("uint16", u);
	for (let e = 0; e < a.length; e++) d.seek(u[e]), d.rawBytes(a[e]);
	return d.toArray();
}
function sa(e, t) {
	e.seek(t);
	let n = e.uint16();
	if (n === 1) {
		let r = e.uint16(), i = e.uint16(), a = [];
		for (let t = 0; t < i; t++) a.push(e.uint16());
		return {
			format: n,
			coverage: B(e, t + r),
			seqRuleSets: a.map((n) => n === 0 ? null : ca(e, t + n))
		};
	}
	if (n === 2) {
		let r = e.uint16(), i = e.uint16(), a = e.uint16(), o = [];
		for (let t = 0; t < a; t++) o.push(e.uint16());
		return {
			format: n,
			coverage: B(e, t + r),
			classDef: Wi(e, t + i),
			classSeqRuleSets: o.map((n) => n === 0 ? null : la(e, t + n))
		};
	}
	if (n === 3) {
		let r = e.uint16(), i = e.uint16(), a = e.array("uint16", r), o = ua(e, i);
		return {
			format: n,
			coverages: a.map((n) => B(e, t + n)),
			seqLookupRecords: o
		};
	}
	throw Error(`Unknown SequenceContext format: ${n}`);
}
function ca(e, t) {
	e.seek(t);
	let n = e.uint16();
	return e.array("uint16", n).map((n) => {
		e.seek(t + n);
		let r = e.uint16(), i = e.uint16();
		return {
			glyphCount: r,
			inputSequence: e.array("uint16", r - 1),
			seqLookupRecords: ua(e, i)
		};
	});
}
function la(e, t) {
	e.seek(t);
	let n = e.uint16();
	return e.array("uint16", n).map((n) => {
		e.seek(t + n);
		let r = e.uint16(), i = e.uint16();
		return {
			glyphCount: r,
			inputSequence: e.array("uint16", r - 1),
			seqLookupRecords: ua(e, i)
		};
	});
}
function ua(e, t) {
	let n = [];
	for (let r = 0; r < t; r++) n.push({
		sequenceIndex: e.uint16(),
		lookupListIndex: e.uint16()
	});
	return n;
}
function da(e) {
	if (e.format === 1) return fa(e);
	if (e.format === 2) return pa(e);
	if (e.format === 3) return ma(e);
	throw Error(`Unknown SequenceContext format: ${e.format}`);
}
function fa(e) {
	let { coverage: t, seqRuleSets: n } = e, r = V(t), i = n.map((e) => e === null ? null : ha(e)), a = 6 + n.length * 2, o = a;
	a += r.length;
	let s = i.map((e) => {
		if (e === null) return 0;
		let t = a;
		return a += e.length, t;
	}), c = new I(a);
	c.uint16(1), c.uint16(o), c.uint16(n.length), c.array("uint16", s), c.seek(o), c.rawBytes(r);
	for (let e = 0; e < i.length; e++) i[e] && (c.seek(s[e]), c.rawBytes(i[e]));
	return c.toArray();
}
function pa(e) {
	let { coverage: t, classDef: n, classSeqRuleSets: r } = e, i = V(t), a = Gi(n), o = r.map((e) => e === null ? null : ha(e)), s = 8 + r.length * 2, c = s;
	s += i.length;
	let l = s;
	s += a.length;
	let u = o.map((e) => {
		if (e === null) return 0;
		let t = s;
		return s += e.length, t;
	}), d = new I(s);
	d.uint16(2), d.uint16(c), d.uint16(l), d.uint16(r.length), d.array("uint16", u), d.seek(c), d.rawBytes(i), d.seek(l), d.rawBytes(a);
	for (let e = 0; e < o.length; e++) o[e] && (d.seek(u[e]), d.rawBytes(o[e]));
	return d.toArray();
}
function ma(e) {
	let { coverages: t, seqLookupRecords: n } = e, r = t.map(V), i = 6 + t.length * 2 + n.length * 4, a = r.map((e) => {
		let t = i;
		return i += e.length, t;
	}), o = new I(i);
	o.uint16(3), o.uint16(t.length), o.uint16(n.length), o.array("uint16", a), _a(o, n);
	for (let e = 0; e < r.length; e++) o.seek(a[e]), o.rawBytes(r[e]);
	return o.toArray();
}
function ha(e) {
	let t = e.map(ga), n = 2 + e.length * 2, r = t.map((e) => {
		let t = n;
		return n += e.length, t;
	}), i = new I(n);
	i.uint16(e.length), i.array("uint16", r);
	for (let e = 0; e < t.length; e++) i.seek(r[e]), i.rawBytes(t[e]);
	return i.toArray();
}
function ga(e) {
	let { glyphCount: t, inputSequence: n, seqLookupRecords: r } = e, i = new I(4 + (t - 1) * 2 + r.length * 4);
	return i.uint16(t), i.uint16(r.length), i.array("uint16", n), _a(i, r), i.toArray();
}
function _a(e, t) {
	for (let n of t) e.uint16(n.sequenceIndex), e.uint16(n.lookupListIndex);
}
function va(e, t) {
	e.seek(t);
	let n = e.uint16();
	if (n === 1) {
		let r = e.uint16(), i = e.uint16(), a = [];
		for (let t = 0; t < i; t++) a.push(e.uint16());
		return {
			format: n,
			coverage: B(e, t + r),
			chainedSeqRuleSets: a.map((n) => n === 0 ? null : ya(e, t + n))
		};
	}
	if (n === 2) {
		let r = e.uint16(), i = e.uint16(), a = e.uint16(), o = e.uint16(), s = e.uint16(), c = [];
		for (let t = 0; t < s; t++) c.push(e.uint16());
		return {
			format: n,
			coverage: B(e, t + r),
			backtrackClassDef: Wi(e, t + i),
			inputClassDef: Wi(e, t + a),
			lookaheadClassDef: Wi(e, t + o),
			chainedClassSeqRuleSets: c.map((n) => n === 0 ? null : xa(e, t + n))
		};
	}
	if (n === 3) {
		let r = e.uint16(), i = e.array("uint16", r), a = e.uint16(), o = e.array("uint16", a), s = e.uint16(), c = e.array("uint16", s), l = ua(e, e.uint16());
		return {
			format: n,
			backtrackCoverages: i.map((n) => B(e, t + n)),
			inputCoverages: o.map((n) => B(e, t + n)),
			lookaheadCoverages: c.map((n) => B(e, t + n)),
			seqLookupRecords: l
		};
	}
	throw Error(`Unknown ChainedSequenceContext format: ${n}`);
}
function ya(e, t) {
	e.seek(t);
	let n = e.uint16();
	return e.array("uint16", n).map((n) => ba(e, t + n));
}
function ba(e, t) {
	e.seek(t);
	let n = e.uint16(), r = e.array("uint16", n), i = e.uint16(), a = e.array("uint16", i - 1), o = e.uint16();
	return {
		backtrackSequence: r,
		inputGlyphCount: i,
		inputSequence: a,
		lookaheadSequence: e.array("uint16", o),
		seqLookupRecords: ua(e, e.uint16())
	};
}
function xa(e, t) {
	e.seek(t);
	let n = e.uint16();
	return e.array("uint16", n).map((n) => ba(e, t + n));
}
function Sa(e) {
	if (e.format === 1) return Ca(e);
	if (e.format === 2) return wa(e);
	if (e.format === 3) return Ta(e);
	throw Error(`Unknown ChainedSequenceContext format: ${e.format}`);
}
function Ca(e) {
	let { coverage: t, chainedSeqRuleSets: n } = e, r = V(t), i = n.map((e) => e === null ? null : Ea(e)), a = 6 + n.length * 2, o = a;
	a += r.length;
	let s = i.map((e) => {
		if (e === null) return 0;
		let t = a;
		return a += e.length, t;
	}), c = new I(a);
	c.uint16(1), c.uint16(o), c.uint16(n.length), c.array("uint16", s), c.seek(o), c.rawBytes(r);
	for (let e = 0; e < i.length; e++) i[e] && (c.seek(s[e]), c.rawBytes(i[e]));
	return c.toArray();
}
function wa(e) {
	let { coverage: t, backtrackClassDef: n, inputClassDef: r, lookaheadClassDef: i, chainedClassSeqRuleSets: a } = e, o = V(t), s = Gi(n), c = Gi(r), l = Gi(i), u = a.map((e) => e === null ? null : Ea(e)), d = 12 + a.length * 2, f = d;
	d += o.length;
	let p = d;
	d += s.length;
	let m = d;
	d += c.length;
	let h = d;
	d += l.length;
	let g = u.map((e) => {
		if (e === null) return 0;
		let t = d;
		return d += e.length, t;
	}), _ = new I(d);
	_.uint16(2), _.uint16(f), _.uint16(p), _.uint16(m), _.uint16(h), _.uint16(a.length), _.array("uint16", g), _.seek(f), _.rawBytes(o), _.seek(p), _.rawBytes(s), _.seek(m), _.rawBytes(c), _.seek(h), _.rawBytes(l);
	for (let e = 0; e < u.length; e++) u[e] && (_.seek(g[e]), _.rawBytes(u[e]));
	return _.toArray();
}
function Ta(e) {
	let { backtrackCoverages: t, inputCoverages: n, lookaheadCoverages: r, seqLookupRecords: i } = e, a = t.map(V), o = n.map(V), s = r.map(V), c = 4 + t.length * 2 + 2 + n.length * 2 + 2 + r.length * 2 + 2 + i.length * 4, l = a.map((e) => {
		let t = c;
		return c += e.length, t;
	}), u = o.map((e) => {
		let t = c;
		return c += e.length, t;
	}), d = s.map((e) => {
		let t = c;
		return c += e.length, t;
	}), f = new I(c);
	f.uint16(3), f.uint16(t.length), f.array("uint16", l), f.uint16(n.length), f.array("uint16", u), f.uint16(r.length), f.array("uint16", d), f.uint16(i.length), _a(f, i);
	for (let e = 0; e < a.length; e++) f.seek(l[e]), f.rawBytes(a[e]);
	for (let e = 0; e < o.length; e++) f.seek(u[e]), f.rawBytes(o[e]);
	for (let e = 0; e < s.length; e++) f.seek(d[e]), f.rawBytes(s[e]);
	return f.toArray();
}
function Ea(e) {
	let t = e.map(Da), n = 2 + e.length * 2, r = t.map((e) => {
		let t = n;
		return n += e.length, t;
	}), i = new I(n);
	i.uint16(e.length), i.array("uint16", r);
	for (let e = 0; e < t.length; e++) i.seek(r[e]), i.rawBytes(t[e]);
	return i.toArray();
}
function Da(e) {
	let { backtrackSequence: t, inputGlyphCount: n, inputSequence: r, lookaheadSequence: i, seqLookupRecords: a } = e, o = new I(2 + t.length * 2 + 2 + r.length * 2 + 2 + i.length * 2 + 2 + a.length * 4);
	return o.uint16(t.length), o.array("uint16", t), o.uint16(n), o.array("uint16", r), o.uint16(i.length), o.array("uint16", i), o.uint16(a.length), _a(o, a), o.toArray();
}
function Oa(e, t) {
	e.seek(t);
	let n = e.uint16(), r = e.uint16(), i = e.uint32(), a = [];
	for (let t = 0; t < i; t++) a.push({
		conditionSetOffset: e.uint32(),
		featureTableSubstitutionOffset: e.uint32()
	});
	return {
		majorVersion: n,
		minorVersion: r,
		featureVariationRecords: a.map((n) => ({
			conditionSet: n.conditionSetOffset === 0 ? null : ka(e, t + n.conditionSetOffset),
			featureTableSubstitution: n.featureTableSubstitutionOffset === 0 ? null : Aa(e, t + n.featureTableSubstitutionOffset)
		}))
	};
}
function ka(e, t) {
	e.seek(t);
	let n = e.uint16(), r = [];
	for (let t = 0; t < n; t++) r.push(e.uint32());
	return { conditions: r.map((n) => {
		e.seek(t + n);
		let r = e.uint16();
		return r === 1 ? {
			format: r,
			axisIndex: e.uint16(),
			filterRangeMinValue: e.int16(),
			filterRangeMaxValue: e.int16()
		} : {
			format: r,
			_raw: !0
		};
	}) };
}
function Aa(e, t) {
	e.seek(t);
	let n = e.uint16(), r = e.uint16(), i = e.uint16(), a = [];
	for (let n = 0; n < i; n++) {
		let n = e.uint16(), r = ta(e, t + e.uint32());
		a.push({
			featureIndex: n,
			feature: r
		});
	}
	return {
		majorVersion: n,
		minorVersion: r,
		substitutions: a
	};
}
function ja(e) {
	let { majorVersion: t, minorVersion: n, featureVariationRecords: r } = e, i = r.map((e) => ({
		csBytes: e.conditionSet ? Ma(e.conditionSet) : null,
		ftsBytes: e.featureTableSubstitution ? Pa(e.featureTableSubstitution) : null
	})), a = 8 + r.length * 8, o = i.map((e) => {
		let t = e.csBytes ? a : 0;
		e.csBytes && (a += e.csBytes.length);
		let n = e.ftsBytes ? a : 0;
		return e.ftsBytes && (a += e.ftsBytes.length), {
			csOff: t,
			ftsOff: n
		};
	}), s = new I(a);
	s.uint16(t), s.uint16(n), s.uint32(r.length);
	for (let e of o) s.uint32(e.csOff), s.uint32(e.ftsOff);
	for (let e = 0; e < i.length; e++) {
		let t = i[e];
		t.csBytes && (s.seek(o[e].csOff), s.rawBytes(t.csBytes)), t.ftsBytes && (s.seek(o[e].ftsOff), s.rawBytes(t.ftsBytes));
	}
	return s.toArray();
}
function Ma(e) {
	let t = e.conditions.map(Na), n = 2 + e.conditions.length * 4, r = t.map((e) => {
		let t = n;
		return n += e.length, t;
	}), i = new I(n);
	i.uint16(e.conditions.length);
	for (let e of r) i.uint32(e);
	for (let e = 0; e < t.length; e++) i.seek(r[e]), i.rawBytes(t[e]);
	return i.toArray();
}
function Na(e) {
	if (e.format === 1) {
		let t = new I(8);
		return t.uint16(1), t.uint16(e.axisIndex), t.int16(e.filterRangeMinValue), t.int16(e.filterRangeMaxValue), t.toArray();
	}
	throw Error(`Unknown Condition format: ${e.format}`);
}
function Pa(e) {
	let t = e.substitutions.map((e) => ra(e.feature)), n = 6 + e.substitutions.length * 6, r = t.map((e) => {
		let t = n;
		return n += e.length, t;
	}), i = new I(n);
	i.uint16(e.majorVersion), i.uint16(e.minorVersion), i.uint16(e.substitutions.length);
	for (let t = 0; t < e.substitutions.length; t++) i.uint16(e.substitutions[t].featureIndex), i.uint32(r[t]);
	for (let e = 0; e < t.length; e++) i.seek(r[e]), i.rawBytes(t[e]);
	return i.toArray();
}
//#endregion
//#region src/sfnt/table_BASE.js
var Fa = 8, Ia = 12;
function La(e) {
	let t = new F(e), n = t.uint16(), r = t.uint16(), i = t.offset16(), a = t.offset16(), o = n > 1 || n === 1 && r >= 1 ? t.offset32() : 0, s = [
		i,
		a,
		o
	].filter((e) => e > 0);
	return {
		majorVersion: n,
		minorVersion: r,
		horizAxis: i ? za(e, i) : null,
		vertAxis: a ? za(e, a) : null,
		itemVariationStore: o ? Ci(e.slice(o, Ra(e.length, o, s))) : null
	};
}
function Ra(e, t, n) {
	return n.filter((e) => e > t).sort((e, t) => e - t)[0] ?? e;
}
function za(e, t) {
	if (t + 4 > e.length) return null;
	let n = new F(e);
	n.seek(t);
	let r = n.offset16(), i = n.offset16();
	return {
		baseTagList: r ? Ba(n, t + r) : null,
		baseScriptList: i ? Va(n, t + i) : []
	};
}
function Ba(e, t) {
	e.seek(t);
	let n = e.uint16(), r = [];
	for (let t = 0; t < n; t++) r.push(e.tag());
	return r;
}
function Va(e, t) {
	e.seek(t);
	let n = e.uint16(), r = [];
	for (let t = 0; t < n; t++) r.push({
		tag: e.tag(),
		off: e.offset16()
	});
	return r.map((n) => ({
		tag: n.tag,
		...Ha(e, t + n.off)
	}));
}
function Ha(e, t) {
	e.seek(t);
	let n = e.offset16(), r = e.offset16(), i = e.uint16(), a = [];
	for (let t = 0; t < i; t++) a.push({
		tag: e.tag(),
		off: e.offset16()
	});
	return {
		baseValues: n ? Ua(e, t + n) : null,
		defaultMinMax: r ? Wa(e, t + r) : null,
		langSystems: a.map((n) => ({
			tag: n.tag,
			minMax: Wa(e, t + n.off)
		}))
	};
}
function Ua(e, t) {
	e.seek(t);
	let n = e.uint16(), r = e.uint16(), i = [];
	for (let t = 0; t < r; t++) i.push(e.offset16());
	return {
		defaultBaselineIndex: n,
		baseCoords: i.map((n) => n ? Ga(e, t + n) : null)
	};
}
function Wa(e, t) {
	e.seek(t);
	let n = e.offset16(), r = e.offset16(), i = e.uint16(), a = [];
	for (let t = 0; t < i; t++) a.push({
		tag: e.tag(),
		minOff: e.offset16(),
		maxOff: e.offset16()
	});
	return {
		minCoord: n ? Ga(e, t + n) : null,
		maxCoord: r ? Ga(e, t + r) : null,
		featMinMax: a.map((n) => ({
			tag: n.tag,
			minCoord: n.minOff ? Ga(e, t + n.minOff) : null,
			maxCoord: n.maxOff ? Ga(e, t + n.maxOff) : null
		}))
	};
}
function Ga(e, t) {
	e.seek(t);
	let n = e.uint16(), r = e.int16();
	if (n === 1) return {
		format: n,
		coordinate: r
	};
	if (n === 2) return {
		format: n,
		coordinate: r,
		referenceGlyph: e.uint16(),
		baseCoordPoint: e.uint16()
	};
	if (n === 3) {
		let i = e.offset16();
		return {
			format: n,
			coordinate: r,
			device: i ? Ki(e, t + i) : null
		};
	}
	return {
		format: n,
		coordinate: r
	};
}
function Ka(e) {
	let t = e.majorVersion ?? 1, n = e.minorVersion ?? 0, r = t > 1 || t === 1 && n >= 1, i = qa(e.horizAxis), a = qa(e.vertAxis), o = r && e.itemVariationStore ? Ei(e.itemVariationStore) : [], s = r ? Ia : Fa, c = i.length ? s : 0;
	s += i.length;
	let l = a.length ? s : 0;
	s += a.length;
	let u = o.length ? s : 0;
	s += o.length;
	let d = new I(s);
	return d.uint16(t), d.uint16(n), d.offset16(c), d.offset16(l), r && d.offset32(u), d.rawBytes(i), d.rawBytes(a), d.rawBytes(o), d.toArray();
}
function qa(e) {
	if (!e) return [];
	if (e._raw) return e._raw;
	let t = e.baseTagList ? Ja(e.baseTagList) : [], n = Ya(e.baseScriptList ?? []), r = 4, i = t.length ? r : 0;
	r += t.length;
	let a = n.length ? r : 0;
	r += n.length;
	let o = new I(r);
	return o.offset16(i), o.offset16(a), o.rawBytes(t), o.rawBytes(n), o.toArray();
}
function Ja(e) {
	let t = new I(2 + 4 * e.length);
	t.uint16(e.length);
	for (let n of e) t.tag(n);
	return t.toArray();
}
function Ya(e) {
	let t = 2 + 6 * e.length, n = e.map((e) => Xa(e)), r = t, i = n.map((e) => {
		let t = r;
		return r += e.length, t;
	}), a = new I(r);
	a.uint16(e.length);
	for (let t = 0; t < e.length; t++) a.tag(e[t].tag), a.offset16(i[t]);
	for (let e of n) a.rawBytes(e);
	return a.toArray();
}
function Xa(e) {
	let t = Za(e.baseValues), n = Qa(e.defaultMinMax), r = e.langSystems ?? [], i = r.map((e) => Qa(e.minMax)), a = 6 + 6 * r.length, o = t.length ? a : 0;
	a += t.length;
	let s = n.length ? a : 0;
	a += n.length;
	let c = i.map((e) => {
		let t = e.length ? a : 0;
		return a += e.length, t;
	}), l = new I(a);
	l.offset16(o), l.offset16(s), l.uint16(r.length);
	for (let e = 0; e < r.length; e++) l.tag(r[e].tag), l.offset16(c[e]);
	l.rawBytes(t), l.rawBytes(n);
	for (let e of i) l.rawBytes(e);
	return l.toArray();
}
function Za(e) {
	if (!e) return [];
	let t = e.baseCoords ?? [], n = 4 + 2 * t.length, r = t.map((e) => $a(e)), i = n, a = r.map((e) => {
		let t = e.length ? i : 0;
		return i += e.length, t;
	}), o = new I(i);
	o.uint16(e.defaultBaselineIndex ?? 0), o.uint16(t.length);
	for (let e of a) o.offset16(e);
	for (let e of r) o.rawBytes(e);
	return o.toArray();
}
function Qa(e) {
	if (!e) return [];
	let t = e.featMinMax ?? [], n = 6 + 8 * t.length, r = $a(e.minCoord), i = $a(e.maxCoord), a = t.map((e) => ({
		tag: e.tag,
		min: $a(e.minCoord),
		max: $a(e.maxCoord)
	})), o = n, s = r.length ? o : 0;
	o += r.length;
	let c = i.length ? o : 0;
	o += i.length;
	let l = a.map((e) => {
		let t = e.min.length ? o : 0;
		o += e.min.length;
		let n = e.max.length ? o : 0;
		return o += e.max.length, {
			minOff: t,
			maxOff: n
		};
	}), u = new I(o);
	u.offset16(s), u.offset16(c), u.uint16(t.length);
	for (let e = 0; e < t.length; e++) u.tag(t[e].tag), u.offset16(l[e].minOff), u.offset16(l[e].maxOff);
	u.rawBytes(r), u.rawBytes(i);
	for (let e of a) u.rawBytes(e.min), u.rawBytes(e.max);
	return u.toArray();
}
function $a(e) {
	if (!e) return [];
	if (e.format === 1) {
		let t = new I(4);
		return t.uint16(1), t.int16(e.coordinate), t.toArray();
	}
	if (e.format === 2) {
		let t = new I(8);
		return t.uint16(2), t.int16(e.coordinate), t.uint16(e.referenceGlyph ?? 0), t.uint16(e.baseCoordPoint ?? 0), t.toArray();
	}
	if (e.format === 3) {
		let t = e.device ? qi(e.device) : [], n = t.length ? 6 : 0, r = new I(6 + t.length);
		return r.uint16(3), r.int16(e.coordinate), r.offset16(n), r.rawBytes(t), r.toArray();
	}
	return [];
}
//#endregion
//#region src/sfnt/bitmap_common.js
function eo(e) {
	return {
		height: e.uint8(),
		width: e.uint8(),
		bearingX: e.int8(),
		bearingY: e.int8(),
		advance: e.uint8()
	};
}
function to(e, t) {
	e.uint8(t.height ?? 0), e.uint8(t.width ?? 0), e.int8(t.bearingX ?? 0), e.int8(t.bearingY ?? 0), e.uint8(t.advance ?? 0);
}
function no(e) {
	return {
		height: e.uint8(),
		width: e.uint8(),
		horiBearingX: e.int8(),
		horiBearingY: e.int8(),
		horiAdvance: e.uint8(),
		vertBearingX: e.int8(),
		vertBearingY: e.int8(),
		vertAdvance: e.uint8()
	};
}
function ro(e, t) {
	e.uint8(t.height ?? 0), e.uint8(t.width ?? 0), e.int8(t.horiBearingX ?? 0), e.int8(t.horiBearingY ?? 0), e.uint8(t.horiAdvance ?? 0), e.int8(t.vertBearingX ?? 0), e.int8(t.vertBearingY ?? 0), e.uint8(t.vertAdvance ?? 0);
}
//#endregion
//#region src/sfnt/table_CBDT.js
function io(e, t) {
	let n = new F(e), r = n.uint32(), i = t?.CBLC;
	if (!i?.sizes) return {
		version: r,
		data: Array.from(e.slice(4))
	};
	let a = [];
	for (let t of i.sizes) {
		let r = [];
		for (let i of t.indexSubTables ?? []) r.push(so(e, n, i));
		a.push(r);
	}
	return {
		version: r,
		bitmapData: a
	};
}
function ao(e) {
	let t = e.version ?? 196608;
	if (e.data) {
		let n = e.data, r = new I(4 + n.length);
		return r.uint32(t), r.rawBytes(n), r.toArray();
	}
	let n = new I(4);
	return n.uint32(t), n.toArray();
}
function oo(e, t) {
	let n = e.version ?? 196608, r = e.bitmapData ?? [], i = t.sizes ?? [], a = [], o = [], s = 4;
	for (let e = 0; e < i.length; e++) {
		let t = i[e].indexSubTables ?? [], n = r[e] ?? [], c = [];
		for (let e = 0; e < t.length; e++) {
			let r = t[e], { bytes: i, info: o } = lo(n[e] ?? [], r, s);
			c.push(o), a.push(i), s += i.length;
		}
		o.push(c);
	}
	let c = new I(s);
	c.uint32(n);
	for (let e of a) c.rawBytes(e);
	return {
		bytes: c.toArray(),
		offsetInfo: o
	};
}
function so(e, t, n) {
	let { indexFormat: r, imageFormat: i, imageDataOffset: a } = n, o = [];
	switch (r) {
		case 1:
		case 3: {
			let r = n.sbitOffsets;
			for (let n = 0; n < r.length - 1; n++) {
				let s = a + r[n], c = a + r[n + 1] - s;
				c <= 0 ? o.push(null) : o.push(co(e, t, s, i, c));
			}
			break;
		}
		case 2: {
			let r = n.lastGlyphIndex - n.firstGlyphIndex + 1, { imageSize: s } = n;
			for (let n = 0; n < r; n++) {
				let r = a + n * s;
				o.push(co(e, t, r, i, s));
			}
			break;
		}
		case 4: {
			let r = n.glyphArray;
			for (let n = 0; n < r.length - 1; n++) {
				let s = a + r[n].sbitOffset, c = a + r[n + 1].sbitOffset - s;
				c <= 0 ? o.push(null) : o.push(co(e, t, s, i, c));
			}
			break;
		}
		case 5: {
			let r = n.glyphIdArray.length, { imageSize: s } = n;
			for (let n = 0; n < r; n++) {
				let r = a + n * s;
				o.push(co(e, t, r, i, s));
			}
			break;
		}
	}
	return o;
}
function co(e, t, n, r, i) {
	if (i <= 0) return null;
	t.seek(n);
	let a = (t, n) => e.slice(t, t + n);
	switch (r) {
		case 1: return {
			smallMetrics: eo(t),
			imageData: a(t.position, i - 5)
		};
		case 2: return {
			smallMetrics: eo(t),
			imageData: a(t.position, i - 5)
		};
		case 5: return { imageData: a(n, i) };
		case 6: return {
			bigMetrics: no(t),
			imageData: a(t.position, i - 8)
		};
		case 7: return {
			bigMetrics: no(t),
			imageData: a(t.position, i - 8)
		};
		case 8: {
			let e = eo(t);
			t.skip(1);
			let n = t.uint16(), r = [];
			for (let e = 0; e < n; e++) r.push({
				glyphID: t.uint16(),
				xOffset: t.int8(),
				yOffset: t.int8()
			});
			return {
				smallMetrics: e,
				components: r
			};
		}
		case 9: {
			let e = no(t), n = t.uint16(), r = [];
			for (let e = 0; e < n; e++) r.push({
				glyphID: t.uint16(),
				xOffset: t.int8(),
				yOffset: t.int8()
			});
			return {
				bigMetrics: e,
				components: r
			};
		}
		case 17: {
			let e = eo(t), n = t.uint32();
			return {
				smallMetrics: e,
				imageData: a(t.position, n)
			};
		}
		case 18: {
			let e = no(t), n = t.uint32();
			return {
				bigMetrics: e,
				imageData: a(t.position, n)
			};
		}
		case 19: {
			let e = t.uint32();
			return { imageData: a(t.position, e) };
		}
		default: return { imageData: a(n, i) };
	}
}
function lo(e, t, n) {
	let { indexFormat: r, imageFormat: i } = t, a = { imageDataOffset: n }, o = e.map((e) => e ? uo(e, i) : []);
	switch (r) {
		case 1:
		case 3: {
			let e = [0], t = 0;
			for (let n of o) t += n.length, e.push(t);
			a.sbitOffsets = e;
			break;
		}
		case 2:
		case 5:
			a.imageSize = t.imageSize ?? (o.length > 0 ? o[0].length : 0);
			break;
		case 4: {
			let e = t.glyphIdArray ?? [], n = [], r = 0;
			for (let t = 0; t < o.length; t++) n.push({
				glyphID: e[t] ?? 0,
				sbitOffset: r
			}), r += o[t].length;
			n.push({
				glyphID: 0,
				sbitOffset: r
			}), a.glyphArray = n;
			break;
		}
	}
	let s = new I(o.reduce((e, t) => e + t.length, 0));
	for (let e of o) s.rawBytes(e);
	return {
		bytes: s.toArray(),
		info: a
	};
}
function uo(e, t) {
	switch (t) {
		case 1:
		case 2: {
			let t = e.imageData ?? [], n = new I(5 + t.length);
			return to(n, e.smallMetrics ?? {}), n.rawBytes(t), n.toArray();
		}
		case 5: {
			let t = e.imageData ?? [];
			return Array.from(t);
		}
		case 6:
		case 7: {
			let t = e.imageData ?? [], n = new I(8 + t.length);
			return ro(n, e.bigMetrics ?? {}), n.rawBytes(t), n.toArray();
		}
		case 8: {
			let t = e.components ?? [], n = new I(8 + t.length * 4);
			to(n, e.smallMetrics ?? {}), n.uint8(0), n.uint16(t.length);
			for (let e of t) n.uint16(e.glyphID ?? 0), n.int8(e.xOffset ?? 0), n.int8(e.yOffset ?? 0);
			return n.toArray();
		}
		case 9: {
			let t = e.components ?? [], n = new I(10 + t.length * 4);
			ro(n, e.bigMetrics ?? {}), n.uint16(t.length);
			for (let e of t) n.uint16(e.glyphID ?? 0), n.int8(e.xOffset ?? 0), n.int8(e.yOffset ?? 0);
			return n.toArray();
		}
		case 17: {
			let t = e.imageData ?? [], n = new I(9 + t.length);
			return to(n, e.smallMetrics ?? {}), n.uint32(t.length), n.rawBytes(t), n.toArray();
		}
		case 18: {
			let t = e.imageData ?? [], n = new I(12 + t.length);
			return ro(n, e.bigMetrics ?? {}), n.uint32(t.length), n.rawBytes(t), n.toArray();
		}
		case 19: {
			let t = e.imageData ?? [], n = new I(4 + t.length);
			return n.uint32(t.length), n.rawBytes(t), n.toArray();
		}
		default: return Array.from(e.imageData ?? []);
	}
}
//#endregion
//#region src/sfnt/table_bdat.js
function fo(e, t) {
	return io(e, t?.bloc ? { CBLC: t.bloc } : t);
}
function po(e) {
	return ao(e);
}
//#endregion
//#region src/sfnt/table_CBLC.js
var mo = 48;
function ho(e) {
	return _o(e);
}
function go(e, t) {
	return t ? yo(e, t) : So(e);
}
function _o(e) {
	let t = new F(e), n = t.uint16(), r = t.uint16(), i = t.uint32(), a = [], o = [];
	for (let e = 0; e < i; e++) {
		let e = t.uint32();
		t.uint32();
		let n = t.uint32(), r = t.uint32(), i = Co(t), s = Co(t), c = t.uint16(), l = t.uint16(), u = t.uint8(), d = t.uint8(), f = t.uint8(), p = t.int8();
		a.push({
			colorRef: r,
			hori: i,
			vert: s,
			startGlyphIndex: c,
			endGlyphIndex: l,
			ppemX: u,
			ppemY: d,
			bitDepth: f,
			flags: p,
			indexSubTables: []
		}), o.push({
			indexSubTableArrayOffset: e,
			numberOfIndexSubTables: n
		});
	}
	for (let e = 0; e < i; e++) {
		let { indexSubTableArrayOffset: n, numberOfIndexSubTables: r } = o[e];
		r !== 0 && (a[e].indexSubTables = vo(t, n, r));
	}
	return {
		majorVersion: n,
		minorVersion: r,
		sizes: a
	};
}
function vo(e, t, n) {
	e.seek(t);
	let r = [];
	for (let t = 0; t < n; t++) r.push({
		firstGlyphIndex: e.uint16(),
		lastGlyphIndex: e.uint16(),
		indexSubtableOffset: e.uint32()
	});
	let i = [];
	for (let n of r) {
		let r = t + n.indexSubtableOffset;
		e.seek(r);
		let a = e.uint16(), o = e.uint16(), s = e.uint32(), c = {
			firstGlyphIndex: n.firstGlyphIndex,
			lastGlyphIndex: n.lastGlyphIndex,
			indexFormat: a,
			imageFormat: o,
			imageDataOffset: s
		}, l = n.lastGlyphIndex - n.firstGlyphIndex + 1;
		switch (a) {
			case 1:
				c.sbitOffsets = e.array("uint32", l + 1);
				break;
			case 2:
				c.imageSize = e.uint32(), c.bigMetrics = no(e);
				break;
			case 3:
				c.sbitOffsets = e.array("uint16", l + 1);
				break;
			case 4: {
				let t = e.uint32();
				c.glyphArray = [];
				for (let n = 0; n <= t; n++) c.glyphArray.push({
					glyphID: e.uint16(),
					sbitOffset: e.uint16()
				});
				break;
			}
			case 5: {
				c.imageSize = e.uint32(), c.bigMetrics = no(e);
				let t = e.uint32();
				c.glyphIdArray = e.array("uint16", t);
				break;
			}
		}
		i.push(c);
	}
	return i;
}
function yo(e, t) {
	let n = e.majorVersion ?? 2, r = e.minorVersion ?? 0, i = e.sizes ?? [], a = i.map((e, n) => bo(e.indexSubTables ?? [], t[n] ?? [])), o = 8 + i.length * mo, s = [];
	for (let e of a) s.push(o), o += e.length;
	let c = new I(o);
	c.uint16(n), c.uint16(r), c.uint32(i.length);
	for (let e = 0; e < i.length; e++) {
		let t = i[e], n = t.indexSubTables ?? [];
		c.uint32(s[e]), c.uint32(a[e].length), c.uint32(n.length), c.uint32(t.colorRef ?? 0), wo(c, t.hori ?? {}), wo(c, t.vert ?? {}), c.uint16(t.startGlyphIndex ?? 0), c.uint16(t.endGlyphIndex ?? 0), c.uint8(t.ppemX ?? 0), c.uint8(t.ppemY ?? 0), c.uint8(t.bitDepth ?? 0), c.int8(t.flags ?? 0);
	}
	for (let e of a) c.rawBytes(e);
	return c.toArray();
}
function bo(e, t) {
	let n = e.map((e, n) => xo(e, t[n] ?? {})), r = e.length * 8, i = [];
	for (let e of n) i.push(r), r += e.length;
	let a = new I(r);
	for (let t = 0; t < e.length; t++) a.uint16(e[t].firstGlyphIndex), a.uint16(e[t].lastGlyphIndex), a.uint32(i[t]);
	for (let e of n) a.rawBytes(e);
	return a.toArray();
}
function xo(e, t) {
	let n = e.indexFormat, r = e.imageFormat, i = t.imageDataOffset ?? 0;
	switch (n) {
		case 1: {
			let e = t.sbitOffsets ?? [], a = new I(8 + e.length * 4);
			a.uint16(n), a.uint16(r), a.uint32(i);
			for (let t of e) a.uint32(t);
			return a.toArray();
		}
		case 2: {
			let a = new I(20);
			return a.uint16(n), a.uint16(r), a.uint32(i), a.uint32(e.imageSize ?? t.imageSize ?? 0), ro(a, e.bigMetrics ?? {}), a.toArray();
		}
		case 3: {
			let e = t.sbitOffsets ?? [], a = 8 + e.length * 2;
			e.length % 2 != 0 && (a += 2);
			let o = new I(a);
			o.uint16(n), o.uint16(r), o.uint32(i);
			for (let t of e) o.uint16(t);
			return o.toArray();
		}
		case 4: {
			let e = t.glyphArray ?? [], a = e.length > 0 ? e.length - 1 : 0, o = new I(12 + e.length * 4);
			o.uint16(n), o.uint16(r), o.uint32(i), o.uint32(a);
			for (let t of e) o.uint16(t.glyphID), o.uint16(t.sbitOffset);
			return o.toArray();
		}
		case 5: {
			let a = e.glyphIdArray ?? [], o = 24 + a.length * 2;
			a.length % 2 != 0 && (o += 2);
			let s = new I(o);
			s.uint16(n), s.uint16(r), s.uint32(i), s.uint32(e.imageSize ?? t.imageSize ?? 0), ro(s, e.bigMetrics ?? {}), s.uint32(a.length);
			for (let e of a) s.uint16(e);
			return s.toArray();
		}
		default: throw Error(`Unsupported index format: ${n}`);
	}
}
function So(e) {
	let t = e.majorVersion ?? 2, n = e.minorVersion ?? 0, r = e.sizes ?? [], i = e.data ?? [], a = new I(8 + r.length * mo + i.length);
	a.uint16(t), a.uint16(n), a.uint32(r.length);
	for (let e of r) a.uint32(e.indexSubTableArrayOffset ?? 0), a.uint32(e.indexTablesSize ?? 0), a.uint32(e.numberOfIndexSubTables ?? 0), a.uint32(e.colorRef ?? 0), wo(a, e.hori ?? {}), wo(a, e.vert ?? {}), a.uint16(e.startGlyphIndex ?? 0), a.uint16(e.endGlyphIndex ?? 0), a.uint8(e.ppemX ?? 0), a.uint8(e.ppemY ?? 0), a.uint8(e.bitDepth ?? 0), a.int8(e.flags ?? 0);
	return a.rawBytes(i), a.toArray();
}
function Co(e) {
	return {
		ascender: e.int8(),
		descender: e.int8(),
		widthMax: e.uint8(),
		caretSlopeNumerator: e.int8(),
		caretSlopeDenominator: e.int8(),
		caretOffset: e.int8(),
		minOriginSB: e.int8(),
		minAdvanceSB: e.int8(),
		maxBeforeBL: e.int8(),
		minAfterBL: e.int8(),
		pad1: e.int8(),
		pad2: e.int8()
	};
}
function wo(e, t) {
	e.int8(t.ascender ?? 0), e.int8(t.descender ?? 0), e.uint8(t.widthMax ?? 0), e.int8(t.caretSlopeNumerator ?? 0), e.int8(t.caretSlopeDenominator ?? 0), e.int8(t.caretOffset ?? 0), e.int8(t.minOriginSB ?? 0), e.int8(t.minAdvanceSB ?? 0), e.int8(t.maxBeforeBL ?? 0), e.int8(t.minAfterBL ?? 0), e.int8(t.pad1 ?? 0), e.int8(t.pad2 ?? 0);
}
//#endregion
//#region src/sfnt/table_bloc.js
function To(e) {
	return ho(e);
}
function Eo(e) {
	return go(e);
}
//#endregion
//#region src/sfnt/colr_paint.js
var Do = [
	0,
	6,
	5,
	9,
	16,
	20,
	16,
	20,
	12,
	16,
	6,
	3,
	7,
	7,
	8,
	12,
	8,
	12,
	12,
	16,
	6,
	10,
	10,
	14,
	6,
	10,
	10,
	14,
	8,
	12,
	12,
	16,
	8
], Oo = 15, ko = 48;
function Ao(e, t) {
	return t === 1 ? e.uint8() : t === 2 ? e.uint16() : t === 3 ? e.uint24() : e.uint32();
}
function jo(e, t, n) {
	n === 1 ? e.uint8(t) : n === 2 ? e.uint16(t) : n === 3 ? e.uint24(t) : e.uint32(t >>> 0);
}
function Mo(e, t) {
	e.seek(t);
	let n = e.uint8(), r = e.uint8(), i = n === 1 ? e.uint32() : e.uint16(), a = (r & Oo) + 1, o = ((r & ko) >> 4) + 1, s = [];
	for (let t = 0; t < i; t++) {
		let t = Ao(e, o), n = (1 << a) - 1;
		s.push({
			outerIndex: t >> a,
			innerIndex: t & n
		});
	}
	return {
		format: n,
		entryFormat: r,
		mapCount: i,
		entries: s
	};
}
function No(e) {
	let t = e.entries ?? [], n = e.mapCount ?? t.length, r = e.format ?? +(n > 65535), i = 0, a = 0;
	for (let e of t) i = Math.max(i, e.innerIndex ?? 0), a = Math.max(a, e.outerIndex ?? 0);
	let o = 1;
	for (; (1 << o) - 1 < i && o < 16;) o++;
	let s = a << o | i, c = 1;
	for (; c < 4 && s > (c === 1 ? 255 : c === 2 ? 65535 : 16777215);) c++;
	let l = e.entryFormat ?? c - 1 << 4 | o - 1, u = r === 1 ? 6 : 4, d = (l & Oo) + 1, f = ((l & ko) >> 4) + 1, p = new I(u + n * f);
	p.uint8(r), p.uint8(l), r === 1 ? p.uint32(n) : p.uint16(n);
	for (let e = 0; e < n; e++) {
		let n = t[e] ?? {
			outerIndex: 0,
			innerIndex: 0
		};
		jo(p, (n.outerIndex ?? 0) << d | (n.innerIndex ?? 0) & (1 << d) - 1, f);
	}
	return p.toArray();
}
function Po(e, t) {
	let n = /* @__PURE__ */ new Map(), r = Fo(e, t.baseGlyphListOffset, n), i = t.layerListOffset ? Io(e, t.layerListOffset, n) : null, a = t.clipListOffset ? Lo(e, t.clipListOffset) : null, o = t.varIndexMapOffset ? Mo(e, t.varIndexMapOffset) : null;
	t.itemVariationStoreOffset && Ci((e.bytes(0).length, []));
	let s = null;
	if (t.itemVariationStoreOffset) {
		e.seek(t.itemVariationStoreOffset);
		let n = [];
		for (; e.position < e.length;) n.push(e.uint8());
		s = Ci(n);
	}
	return {
		baseGlyphPaintRecords: r,
		layerPaints: i,
		clipList: a,
		varIndexMap: o,
		itemVariationStore: s
	};
}
function Fo(e, t, n) {
	e.seek(t);
	let r = e.uint32(), i = [], a = [];
	for (let t = 0; t < r; t++) a.push({
		glyphID: e.uint16(),
		paintOffset: e.uint32()
	});
	for (let r of a) i.push({
		glyphID: r.glyphID,
		paint: H(e, t + r.paintOffset, n)
	});
	return i;
}
function Io(e, t, n) {
	e.seek(t);
	let r = e.uint32(), i = [];
	for (let t = 0; t < r; t++) i.push(e.uint32());
	let a = [];
	for (let r of i) a.push(H(e, t + r, n));
	return a;
}
function Lo(e, t) {
	e.seek(t);
	let n = e.uint8(), r = e.uint32(), i = [];
	for (let t = 0; t < r; t++) i.push({
		startGlyphID: e.uint16(),
		endGlyphID: e.uint16(),
		clipBoxOffset: e.uint24()
	});
	return {
		format: n,
		clips: i.map((n) => ({
			startGlyphID: n.startGlyphID,
			endGlyphID: n.endGlyphID,
			clipBox: Ro(e, t + n.clipBoxOffset)
		}))
	};
}
function Ro(e, t) {
	e.seek(t);
	let n = e.uint8(), r = {
		format: n,
		xMin: e.fword(),
		yMin: e.fword(),
		xMax: e.fword(),
		yMax: e.fword()
	};
	return n === 2 && (r.varIndexBase = e.uint32()), r;
}
function zo(e, t, n) {
	e.seek(t);
	let r = e.uint8(), i = e.uint16(), a = [];
	for (let t = 0; t < i; t++) {
		let t = {
			stopOffset: e.f2dot14(),
			paletteIndex: e.uint16(),
			alpha: e.f2dot14()
		};
		n && (t.varIndexBase = e.uint32()), a.push(t);
	}
	return {
		extend: r,
		colorStops: a
	};
}
function Bo(e, t, n) {
	e.seek(t);
	let r = {
		xx: e.fixed(),
		yx: e.fixed(),
		xy: e.fixed(),
		yy: e.fixed(),
		dx: e.fixed(),
		dy: e.fixed()
	};
	return n && (r.varIndexBase = e.uint32()), r;
}
function H(e, t, n) {
	if (n.has(t)) return n.get(t);
	e.seek(t);
	let r = e.uint8(), i;
	switch (r) {
		case 1:
			i = Vo(e);
			break;
		case 2:
			i = Ho(e, !1);
			break;
		case 3:
			i = Ho(e, !0);
			break;
		case 4:
			i = Uo(e, t, !1);
			break;
		case 5:
			i = Uo(e, t, !0);
			break;
		case 6:
			i = Wo(e, t, !1);
			break;
		case 7:
			i = Wo(e, t, !0);
			break;
		case 8:
			i = Go(e, t, !1);
			break;
		case 9:
			i = Go(e, t, !0);
			break;
		case 10:
			i = Ko(e, t, n);
			break;
		case 11:
			i = qo(e);
			break;
		case 12:
			i = Jo(e, t, n, !1);
			break;
		case 13:
			i = Jo(e, t, n, !0);
			break;
		case 14:
			i = Yo(e, t, n, !1);
			break;
		case 15:
			i = Yo(e, t, n, !0);
			break;
		case 16:
			i = Xo(e, t, n, !1);
			break;
		case 17:
			i = Xo(e, t, n, !0);
			break;
		case 18:
			i = Zo(e, t, n, !1);
			break;
		case 19:
			i = Zo(e, t, n, !0);
			break;
		case 20:
			i = Qo(e, t, n, !1);
			break;
		case 21:
			i = Qo(e, t, n, !0);
			break;
		case 22:
			i = $o(e, t, n, !1);
			break;
		case 23:
			i = $o(e, t, n, !0);
			break;
		case 24:
			i = es(e, t, n, !1);
			break;
		case 25:
			i = es(e, t, n, !0);
			break;
		case 26:
			i = ts(e, t, n, !1);
			break;
		case 27:
			i = ts(e, t, n, !0);
			break;
		case 28:
			i = ns(e, t, n, !1);
			break;
		case 29:
			i = ns(e, t, n, !0);
			break;
		case 30:
			i = rs(e, t, n, !1);
			break;
		case 31:
			i = rs(e, t, n, !0);
			break;
		case 32:
			i = is(e, t, n);
			break;
		default: return i = {
			format: r,
			_unknown: !0
		}, n.set(t, i), i;
	}
	return i.format = r, n.set(t, i), i;
}
function Vo(e) {
	return {
		numLayers: e.uint8(),
		firstLayerIndex: e.uint32()
	};
}
function Ho(e, t) {
	let n = {
		paletteIndex: e.uint16(),
		alpha: e.f2dot14()
	};
	return t && (n.varIndexBase = e.uint32()), n;
}
function Uo(e, t, n) {
	let r = e.uint24(), i = {
		x0: e.fword(),
		y0: e.fword(),
		x1: e.fword(),
		y1: e.fword(),
		x2: e.fword(),
		y2: e.fword()
	};
	return n && (i.varIndexBase = e.uint32()), i.colorLine = zo(e, t + r, n), i;
}
function Wo(e, t, n) {
	let r = e.uint24(), i = {
		x0: e.fword(),
		y0: e.fword(),
		radius0: e.ufword(),
		x1: e.fword(),
		y1: e.fword(),
		radius1: e.ufword()
	};
	return n && (i.varIndexBase = e.uint32()), i.colorLine = zo(e, t + r, n), i;
}
function Go(e, t, n) {
	let r = e.uint24(), i = {
		centerX: e.fword(),
		centerY: e.fword(),
		startAngle: e.f2dot14(),
		endAngle: e.f2dot14()
	};
	return n && (i.varIndexBase = e.uint32()), i.colorLine = zo(e, t + r, n), i;
}
function Ko(e, t, n) {
	let r = e.uint24();
	return {
		glyphID: e.uint16(),
		paint: H(e, t + r, n)
	};
}
function qo(e) {
	return { glyphID: e.uint16() };
}
function Jo(e, t, n, r) {
	let i = e.uint24(), a = e.uint24();
	return {
		paint: H(e, t + i, n),
		transform: Bo(e, t + a, r)
	};
}
function Yo(e, t, n, r) {
	let i = e.uint24(), a = {
		dx: e.fword(),
		dy: e.fword()
	};
	return r && (a.varIndexBase = e.uint32()), a.paint = H(e, t + i, n), a;
}
function Xo(e, t, n, r) {
	let i = e.uint24(), a = {
		scaleX: e.f2dot14(),
		scaleY: e.f2dot14()
	};
	return r && (a.varIndexBase = e.uint32()), a.paint = H(e, t + i, n), a;
}
function Zo(e, t, n, r) {
	let i = e.uint24(), a = {
		scaleX: e.f2dot14(),
		scaleY: e.f2dot14(),
		centerX: e.fword(),
		centerY: e.fword()
	};
	return r && (a.varIndexBase = e.uint32()), a.paint = H(e, t + i, n), a;
}
function Qo(e, t, n, r) {
	let i = e.uint24(), a = { scale: e.f2dot14() };
	return r && (a.varIndexBase = e.uint32()), a.paint = H(e, t + i, n), a;
}
function $o(e, t, n, r) {
	let i = e.uint24(), a = {
		scale: e.f2dot14(),
		centerX: e.fword(),
		centerY: e.fword()
	};
	return r && (a.varIndexBase = e.uint32()), a.paint = H(e, t + i, n), a;
}
function es(e, t, n, r) {
	let i = e.uint24(), a = { angle: e.f2dot14() };
	return r && (a.varIndexBase = e.uint32()), a.paint = H(e, t + i, n), a;
}
function ts(e, t, n, r) {
	let i = e.uint24(), a = {
		angle: e.f2dot14(),
		centerX: e.fword(),
		centerY: e.fword()
	};
	return r && (a.varIndexBase = e.uint32()), a.paint = H(e, t + i, n), a;
}
function ns(e, t, n, r) {
	let i = e.uint24(), a = {
		xSkewAngle: e.f2dot14(),
		ySkewAngle: e.f2dot14()
	};
	return r && (a.varIndexBase = e.uint32()), a.paint = H(e, t + i, n), a;
}
function rs(e, t, n, r) {
	let i = e.uint24(), a = {
		xSkewAngle: e.f2dot14(),
		ySkewAngle: e.f2dot14(),
		centerX: e.fword(),
		centerY: e.fword()
	};
	return r && (a.varIndexBase = e.uint32()), a.paint = H(e, t + i, n), a;
}
function is(e, t, n) {
	let r = e.uint24(), i = e.uint8(), a = e.uint24();
	return {
		sourcePaint: H(e, t + r, n),
		compositeMode: i,
		backdropPaint: H(e, t + a, n)
	};
}
function as(e) {
	let { baseGlyphPaintRecords: t, layerPaints: n, clipList: r, varIndexMap: i, itemVariationStore: a } = e, o = /* @__PURE__ */ new Map(), s = [];
	function c(e) {
		if (!(!e || o.has(e))) {
			o.set(e, s.length), s.push(e);
			for (let t of os(e)) c(t);
		}
	}
	if (t) for (let e of t) c(e.paint);
	if (n) for (let e of n) c(e);
	let l = ss(s, o), u = /* @__PURE__ */ new Map();
	for (let e of l) u.set(e, cs(e));
	let d = /* @__PURE__ */ new Map(), f = 0;
	for (let e of l) d.set(e, f), f += u.get(e);
	let p = f, m = t ? t.length : 0, h = 4 + m * 6, g = n ? n.length : 0, _ = g > 0 ? 4 + g * 4 : 0, v = r ? ps(r) : [], y = i ? No(i) : [], b = a ? Ei(a) : [], x = h + _ + p + v.length + y.length + b.length, S = h, C = h + _, w = C + p, T = w + v.length, E = T + y.length, D = new I(x);
	D.uint32(m);
	for (let e of t || []) D.uint16(e.glyphID), D.uint32(C - 0 + d.get(e.paint));
	if (g > 0) {
		D.uint32(g);
		for (let e of n) D.uint32(C - S + d.get(e));
	}
	for (let e of l) us(D, e, C + d.get(e), d, C);
	return D.rawBytes(v), D.rawBytes(y), D.rawBytes(b), {
		bodyBytes: D.toArray(),
		bglBodyOffset: 0,
		llBodyOffset: g > 0 ? S : 0,
		clipBodyOffset: v.length > 0 ? w : 0,
		dimBodyOffset: y.length > 0 ? T : 0,
		ivsBodyOffset: b.length > 0 ? E : 0
	};
}
function os(e) {
	if (!e) return [];
	let t = [];
	return e.paint && t.push(e.paint), e.sourcePaint && t.push(e.sourcePaint), e.backdropPaint && t.push(e.backdropPaint), t;
}
function ss(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let t of e) n.set(t, 0);
	for (let t of e) for (let e of os(t)) n.has(e) && n.set(e, n.get(e) + 1);
	let r = [], i = 0;
	for (let t of e) n.get(t) === 0 && r.push(t);
	let a = [], o = /* @__PURE__ */ new Set();
	for (; i < r.length;) {
		let e = r[i++];
		a.push(e), o.add(e);
		for (let t of os(e)) {
			if (!n.has(t)) continue;
			let e = n.get(t) - 1;
			n.set(t, e), e === 0 && r.push(t);
		}
	}
	for (let t of e) o.has(t) || a.push(t);
	return a;
}
function cs(e) {
	let t = Do[e.format] || 0, n = e.format;
	return n === 4 || n === 6 || n === 8 ? t + ls(e.colorLine, !1) : n === 5 || n === 7 || n === 9 ? t + ls(e.colorLine, !0) : n === 12 ? t + 24 : n === 13 ? t + 28 : t;
}
function ls(e, t) {
	if (!e) return 0;
	let n = t ? 10 : 6;
	return 3 + e.colorStops.length * n;
}
function us(e, t, n, r, i) {
	let a = t.format;
	switch (e.uint8(a), a) {
		case 1:
			e.uint8(t.numLayers), e.uint32(t.firstLayerIndex);
			break;
		case 2:
			e.uint16(t.paletteIndex), e.f2dot14(t.alpha);
			break;
		case 3:
			e.uint16(t.paletteIndex), e.f2dot14(t.alpha), e.uint32(t.varIndexBase);
			break;
		case 4:
		case 5: {
			let n = Do[a];
			e.uint24(n), e.fword(t.x0), e.fword(t.y0), e.fword(t.x1), e.fword(t.y1), e.fword(t.x2), e.fword(t.y2), a === 5 && e.uint32(t.varIndexBase), ds(e, t.colorLine, a === 5);
			break;
		}
		case 6:
		case 7: {
			let n = Do[a];
			e.uint24(n), e.fword(t.x0), e.fword(t.y0), e.ufword(t.radius0), e.fword(t.x1), e.fword(t.y1), e.ufword(t.radius1), a === 7 && e.uint32(t.varIndexBase), ds(e, t.colorLine, a === 7);
			break;
		}
		case 8:
		case 9: {
			let n = Do[a];
			e.uint24(n), e.fword(t.centerX), e.fword(t.centerY), e.f2dot14(t.startAngle), e.f2dot14(t.endAngle), a === 9 && e.uint32(t.varIndexBase), ds(e, t.colorLine, a === 9);
			break;
		}
		case 10: {
			let a = i + r.get(t.paint);
			e.uint24(a - n), e.uint16(t.glyphID);
			break;
		}
		case 11:
			e.uint16(t.glyphID);
			break;
		case 12:
		case 13: {
			let o = i + r.get(t.paint), s = Do[a];
			e.uint24(o - n), e.uint24(s), fs(e, t.transform, a === 13);
			break;
		}
		case 14:
		case 15: {
			let o = i + r.get(t.paint);
			e.uint24(o - n), e.fword(t.dx), e.fword(t.dy), a === 15 && e.uint32(t.varIndexBase);
			break;
		}
		case 16:
		case 17: {
			let o = i + r.get(t.paint);
			e.uint24(o - n), e.f2dot14(t.scaleX), e.f2dot14(t.scaleY), a === 17 && e.uint32(t.varIndexBase);
			break;
		}
		case 18:
		case 19: {
			let o = i + r.get(t.paint);
			e.uint24(o - n), e.f2dot14(t.scaleX), e.f2dot14(t.scaleY), e.fword(t.centerX), e.fword(t.centerY), a === 19 && e.uint32(t.varIndexBase);
			break;
		}
		case 20:
		case 21: {
			let o = i + r.get(t.paint);
			e.uint24(o - n), e.f2dot14(t.scale), a === 21 && e.uint32(t.varIndexBase);
			break;
		}
		case 22:
		case 23: {
			let o = i + r.get(t.paint);
			e.uint24(o - n), e.f2dot14(t.scale), e.fword(t.centerX), e.fword(t.centerY), a === 23 && e.uint32(t.varIndexBase);
			break;
		}
		case 24:
		case 25: {
			let o = i + r.get(t.paint);
			e.uint24(o - n), e.f2dot14(t.angle), a === 25 && e.uint32(t.varIndexBase);
			break;
		}
		case 26:
		case 27: {
			let o = i + r.get(t.paint);
			e.uint24(o - n), e.f2dot14(t.angle), e.fword(t.centerX), e.fword(t.centerY), a === 27 && e.uint32(t.varIndexBase);
			break;
		}
		case 28:
		case 29: {
			let o = i + r.get(t.paint);
			e.uint24(o - n), e.f2dot14(t.xSkewAngle), e.f2dot14(t.ySkewAngle), a === 29 && e.uint32(t.varIndexBase);
			break;
		}
		case 30:
		case 31: {
			let o = i + r.get(t.paint);
			e.uint24(o - n), e.f2dot14(t.xSkewAngle), e.f2dot14(t.ySkewAngle), e.fword(t.centerX), e.fword(t.centerY), a === 31 && e.uint32(t.varIndexBase);
			break;
		}
		case 32: {
			let a = i + r.get(t.sourcePaint), o = i + r.get(t.backdropPaint);
			e.uint24(a - n), e.uint8(t.compositeMode), e.uint24(o - n);
			break;
		}
	}
}
function ds(e, t, n) {
	e.uint8(t.extend), e.uint16(t.colorStops.length);
	for (let r of t.colorStops) e.f2dot14(r.stopOffset), e.uint16(r.paletteIndex), e.f2dot14(r.alpha), n && e.uint32(r.varIndexBase);
}
function fs(e, t, n) {
	e.fixed(t.xx), e.fixed(t.yx), e.fixed(t.xy), e.fixed(t.yy), e.fixed(t.dx), e.fixed(t.dy), n && e.uint32(t.varIndexBase);
}
function ps(e) {
	if (!e || !e.clips || e.clips.length === 0) return [];
	let t = [];
	for (let n of e.clips) t.push(ms(n.clipBox));
	let n = 5 + e.clips.length * 7, r = [];
	for (let e of t) r.push(n), n += e.length;
	let i = new I(n);
	i.uint8(e.format || 1), i.uint32(e.clips.length);
	for (let t = 0; t < e.clips.length; t++) i.uint16(e.clips[t].startGlyphID), i.uint16(e.clips[t].endGlyphID), i.uint24(r[t]);
	for (let e of t) i.rawBytes(e);
	return i.toArray();
}
function ms(e) {
	let t = new I(e.format === 2 ? 13 : 9);
	return t.uint8(e.format), t.fword(e.xMin), t.fword(e.yMin), t.fword(e.xMax), t.fword(e.yMax), e.format === 2 && t.uint32(e.varIndexBase), t.toArray();
}
//#endregion
//#region src/sfnt/table_COLR.js
function hs(e) {
	let t = new F(e), n = t.uint16(), r = t.uint16(), i = t.uint32(), a = t.uint32(), o = t.uint16(), s = [];
	if (r > 0 && i > 0) {
		t.seek(i);
		for (let e = 0; e < r; e++) s.push({
			glyphID: t.uint16(),
			firstLayerIndex: t.uint16(),
			numLayers: t.uint16()
		});
	}
	let c = [];
	if (o > 0 && a > 0) {
		t.seek(a);
		for (let e = 0; e < o; e++) c.push({
			glyphID: t.uint16(),
			paletteIndex: t.uint16()
		});
	}
	let l = {
		version: n,
		baseGlyphRecords: s,
		layerRecords: c
	};
	if (n >= 1) {
		t.seek(14);
		let e = Po(t, {
			baseGlyphListOffset: t.uint32(),
			layerListOffset: t.uint32(),
			clipListOffset: t.uint32(),
			varIndexMapOffset: t.uint32(),
			itemVariationStoreOffset: t.uint32()
		});
		l.baseGlyphPaintRecords = e.baseGlyphPaintRecords, l.layerPaints = e.layerPaints, l.clipList = e.clipList, l.varIndexMap = e.varIndexMap, l.itemVariationStore = e.itemVariationStore;
	}
	return l;
}
function gs(e) {
	let { baseGlyphRecords: t, layerRecords: n } = e;
	if (e.version >= 1 && e.baseGlyphPaintRecords) {
		let r = t.length * 6, i = 34 + (r + n.length * 4), a = as({
			baseGlyphPaintRecords: e.baseGlyphPaintRecords,
			layerPaints: e.layerPaints,
			clipList: e.clipList,
			varIndexMap: e.varIndexMap,
			itemVariationStore: e.itemVariationStore
		}), o = a.bodyBytes, s = i + a.bglBodyOffset, c = a.llBodyOffset ? i + a.llBodyOffset : 0, l = a.clipBodyOffset ? i + a.clipBodyOffset : 0, u = a.dimBodyOffset ? i + a.dimBodyOffset : 0, d = a.ivsBodyOffset ? i + a.ivsBodyOffset : 0, f = new I(i + o.length);
		f.uint16(e.version), f.uint16(t.length), f.uint32(t.length > 0 ? 34 : 0), f.uint32(n.length > 0 ? 34 + r : 0), f.uint16(n.length), f.uint32(s), f.uint32(c), f.uint32(l), f.uint32(u), f.uint32(d);
		for (let e of t) f.uint16(e.glyphID), f.uint16(e.firstLayerIndex), f.uint16(e.numLayers);
		for (let e of n) f.uint16(e.glyphID), f.uint16(e.paletteIndex);
		return f.rawBytes(o), f.toArray();
	}
	let r = t.length > 0 ? 14 : 0, i = t.length * 6, a = n.length > 0 ? 14 + i : 0, o = n.length * 4, s = new I(14 + i + o);
	s.uint16(e.version), s.uint16(t.length), s.uint32(r), s.uint32(a), s.uint16(n.length);
	for (let e of t) s.uint16(e.glyphID), s.uint16(e.firstLayerIndex), s.uint16(e.numLayers);
	for (let e of n) s.uint16(e.glyphID), s.uint16(e.paletteIndex);
	return s.toArray();
}
//#endregion
//#region src/sfnt/table_CPAL.js
function _s(e) {
	let t = new F(e), n = t.uint16(), r = t.uint16(), i = t.uint16(), a = t.uint16(), o = t.uint32(), s = [];
	for (let e = 0; e < i; e++) s.push(t.uint16());
	let c = 0, l = 0, u = 0;
	n >= 1 && (c = t.uint32(), l = t.uint32(), u = t.uint32()), t.seek(o);
	let d = [];
	for (let e = 0; e < a; e++) d.push({
		blue: t.uint8(),
		green: t.uint8(),
		red: t.uint8(),
		alpha: t.uint8()
	});
	let f = [];
	for (let e = 0; e < i; e++) {
		let t = s[e], n = [];
		for (let e = 0; e < r; e++) n.push({ ...d[t + e] });
		f.push(n);
	}
	let p = {
		version: n,
		numPaletteEntries: r,
		palettes: f
	};
	if (n >= 1 && c !== 0) {
		t.seek(c), p.paletteTypes = [];
		for (let e = 0; e < i; e++) p.paletteTypes.push(t.uint32());
	}
	if (n >= 1 && l !== 0) {
		t.seek(l), p.paletteLabels = [];
		for (let e = 0; e < i; e++) p.paletteLabels.push(t.uint16());
	}
	if (n >= 1 && u !== 0) {
		t.seek(u), p.paletteEntryLabels = [];
		for (let e = 0; e < r; e++) p.paletteEntryLabels.push(t.uint16());
	}
	return p;
}
function vs(e) {
	let { version: t, numPaletteEntries: n, palettes: r } = e, i = r.length, a = [], o = [];
	for (let e = 0; e < i; e++) {
		a.push(o.length);
		for (let t = 0; t < n; t++) o.push(r[e][t]);
	}
	let s = o.length, c = 12 + i * 2 + (t >= 1 ? 12 : 0), l = c + s * 4, u = 0, d = 0, f = 0;
	t >= 1 && e.paletteTypes && (u = l, l += i * 4), t >= 1 && e.paletteLabels && (d = l, l += i * 2), t >= 1 && e.paletteEntryLabels && (f = l, l += n * 2);
	let p = new I(l);
	p.uint16(t), p.uint16(n), p.uint16(i), p.uint16(s), p.uint32(c);
	for (let e = 0; e < i; e++) p.uint16(a[e]);
	t >= 1 && (p.uint32(u), p.uint32(d), p.uint32(f));
	for (let e of o) p.uint8(e.blue), p.uint8(e.green), p.uint8(e.red), p.uint8(e.alpha);
	if (t >= 1 && e.paletteTypes) for (let t of e.paletteTypes) p.uint32(t);
	if (t >= 1 && e.paletteLabels) for (let t of e.paletteLabels) p.uint16(t);
	if (t >= 1 && e.paletteEntryLabels) for (let t of e.paletteEntryLabels) p.uint16(t);
	return p.toArray();
}
//#endregion
//#region src/sfnt/table_DSIG.js
var ys = 8, bs = 12;
function xs(e) {
	let t = new F(e), n = t.uint32(), r = t.uint16(), i = t.uint16(), a = [];
	for (let e = 0; e < r; e++) a.push({
		format: t.uint32(),
		length: t.uint32(),
		offset: t.offset32()
	});
	return {
		version: n,
		flags: i,
		signatures: a.map((t) => {
			let n = t.offset, r = Math.min(e.length, n + t.length);
			return n <= 0 || n >= e.length || r < n ? {
				...t,
				_raw: []
			} : {
				...t,
				_raw: Array.from(e.slice(n, r))
			};
		})
	};
}
function Ss(e) {
	let t = e.version ?? 1, n = e.flags ?? 0, r = (e.signatures ?? []).map((e) => {
		let t = Cs(e);
		return {
			format: e.format ?? 1,
			bytes: t
		};
	}), i = ys + r.length * bs, a = r.map((e) => {
		let t = {
			format: e.format,
			length: e.bytes.length,
			offset: e.bytes.length ? i : 0
		};
		return i += e.bytes.length, t;
	}), o = new I(i);
	o.uint32(t), o.uint16(r.length), o.uint16(n);
	for (let e of a) o.uint32(e.format), o.uint32(e.length), o.offset32(e.offset);
	for (let e of r) o.rawBytes(e.bytes);
	return o.toArray();
}
function Cs(e) {
	return e ? Array.isArray(e) ? e : e._raw ?? [] : [];
}
//#endregion
//#region src/sfnt/table_EBDT.js
function ws(e, t) {
	return io(e, t?.EBLC ? { CBLC: t.EBLC } : t);
}
function Ts(e) {
	return ao(e);
}
//#endregion
//#region src/sfnt/table_EBLC.js
function Es(e) {
	return ho(e);
}
function Ds(e) {
	return go(e);
}
//#endregion
//#region src/sfnt/table_EBSC.js
var Os = 28;
function ks(e) {
	let t = new F(e), n = t.uint32(), r = t.uint32(), i = [];
	for (let n = 0; n < r; n++) {
		let n = t.position;
		i.push({
			hori: js(t),
			vert: js(t),
			substitutePpemX: t.uint8(),
			substitutePpemY: t.uint8(),
			originalPpemX: t.uint8(),
			originalPpemY: t.uint8(),
			_raw: Array.from(e.slice(n, n + Os))
		});
	}
	return {
		version: n,
		scales: i
	};
}
function As(e) {
	let t = e.version ?? 131072, n = e.scales ?? [], r = new I(8 + n.length * Os);
	r.uint32(t), r.uint32(n.length);
	for (let e of n) {
		if (e._raw && e._raw.length === Os) {
			r.rawBytes(e._raw);
			continue;
		}
		Ms(r, e.hori ?? {}), Ms(r, e.vert ?? {}), r.uint8(e.substitutePpemX ?? 0), r.uint8(e.substitutePpemY ?? 0), r.uint8(e.originalPpemX ?? 0), r.uint8(e.originalPpemY ?? 0);
	}
	return r.toArray();
}
function js(e) {
	return {
		ascender: e.int8(),
		descender: e.int8(),
		widthMax: e.uint8(),
		caretSlopeNumerator: e.int8(),
		caretSlopeDenominator: e.int8(),
		caretOffset: e.int8(),
		minOriginSB: e.int8(),
		minAdvanceSB: e.int8(),
		maxBeforeBL: e.int8(),
		minAfterBL: e.int8(),
		pad1: e.int8(),
		pad2: e.int8()
	};
}
function Ms(e, t) {
	e.int8(t.ascender ?? 0), e.int8(t.descender ?? 0), e.uint8(t.widthMax ?? 0), e.int8(t.caretSlopeNumerator ?? 0), e.int8(t.caretSlopeDenominator ?? 0), e.int8(t.caretOffset ?? 0), e.int8(t.minOriginSB ?? 0), e.int8(t.minAdvanceSB ?? 0), e.int8(t.maxBeforeBL ?? 0), e.int8(t.minAfterBL ?? 0), e.int8(t.pad1 ?? 0), e.int8(t.pad2 ?? 0);
}
//#endregion
//#region src/sfnt/table_fvar.js
var Ns = 16, Ps = 20;
function Fs(e) {
	let t = new F(e), n = t.uint16(), r = t.uint16(), i = t.offset16(), a = t.uint16(), o = t.uint16(), s = t.uint16(), c = t.uint16(), l = t.uint16(), u = [];
	for (let e = 0; e < o; e++) t.seek(i + e * s), u.push({
		axisTag: t.tag(),
		minValue: t.fixed(),
		defaultValue: t.fixed(),
		maxValue: t.fixed(),
		flags: t.uint16(),
		axisNameID: t.uint16()
	});
	let d = [], f = i + o * s, p = l >= 4 + o * 4 + 2;
	for (let e = 0; e < c; e++) {
		t.seek(f + e * l);
		let n = {
			subfamilyNameID: t.uint16(),
			flags: t.uint16(),
			coordinates: []
		};
		for (let e = 0; e < o; e++) n.coordinates.push(t.fixed());
		p && (n.postScriptNameID = t.uint16()), d.push(n);
	}
	return {
		majorVersion: n,
		minorVersion: r,
		reserved: a,
		axisSize: s,
		instanceSize: l,
		axes: u,
		instances: d
	};
}
function Is(e) {
	let t = e.majorVersion ?? 1, n = e.minorVersion ?? 0, r = e.reserved ?? 2, i = e.axes ?? [], a = e.instances ?? [], o = i.length, s = Ps, c = 4 + o * 4, l = a.some((e) => e.postScriptNameID !== void 0), u = l ? c + 2 : c, d = a.length, f = Ns, p = new I(Ns + o * s + d * u);
	p.uint16(t), p.uint16(n), p.offset16(f), p.uint16(r), p.uint16(o), p.uint16(s), p.uint16(d), p.uint16(u);
	for (let e of i) p.tag(e.axisTag), p.fixed(e.minValue), p.fixed(e.defaultValue), p.fixed(e.maxValue), p.uint16(e.flags ?? 0), p.uint16(e.axisNameID ?? 0);
	for (let e of a) {
		p.uint16(e.subfamilyNameID ?? 0), p.uint16(e.flags ?? 0);
		for (let t = 0; t < o; t++) p.fixed(e.coordinates?.[t] ?? 0);
		l && p.uint16(e.postScriptNameID ?? 65535);
	}
	return p.toArray();
}
//#endregion
//#region src/sfnt/table_GDEF.js
function Ls(e) {
	let t = new F(e), n = t.uint16(), r = t.uint16(), i = t.uint16(), a = t.uint16(), o = t.uint16(), s = t.uint16(), c = 0;
	r >= 2 && (c = t.uint16());
	let l = 0;
	r >= 3 && (l = t.uint32());
	let u = {
		majorVersion: n,
		minorVersion: r
	};
	return i !== 0 && (u.glyphClassDef = Wi(t, i)), a !== 0 && (u.attachList = Rs(t, a)), o !== 0 && (u.ligCaretList = zs(t, o)), s !== 0 && (u.markAttachClassDef = Wi(t, s)), c !== 0 && (u.markGlyphSetsDef = Vs(t, c)), l !== 0 && (u.itemVarStoreOffset = l, u.itemVariationStore = Ci(e.slice(l))), u;
}
function Rs(e, t) {
	e.seek(t);
	let n = e.uint16(), r = e.uint16(), i = e.array("uint16", r);
	return {
		coverage: B(e, t + n),
		attachPoints: i.map((n) => {
			e.seek(t + n);
			let r = e.uint16();
			return e.array("uint16", r);
		})
	};
}
function zs(e, t) {
	e.seek(t);
	let n = e.uint16(), r = e.uint16(), i = e.array("uint16", r);
	return {
		coverage: B(e, t + n),
		ligGlyphs: i.map((n) => Bs(e, t + n))
	};
}
function Bs(e, t) {
	e.seek(t);
	let n = e.uint16();
	return e.array("uint16", n).map((n) => {
		let r = t + n;
		e.seek(r);
		let i = e.uint16();
		if (i === 1) return {
			format: i,
			coordinate: e.int16()
		};
		if (i === 2) return {
			format: i,
			caretValuePointIndex: e.uint16()
		};
		if (i === 3) {
			let t = e.int16(), n = e.uint16();
			return {
				format: i,
				coordinate: t,
				device: n === 0 ? null : Ki(e, r + n)
			};
		}
		throw Error(`Unknown CaretValue format: ${i}`);
	});
}
function Vs(e, t) {
	e.seek(t);
	let n = e.uint16(), r = e.uint16(), i = [];
	for (let t = 0; t < r; t++) i.push(e.uint32());
	return {
		format: n,
		coverages: i.map((n) => B(e, t + n))
	};
}
function Hs(e) {
	let { majorVersion: t, minorVersion: n } = e, r = e.glyphClassDef ? Gi(e.glyphClassDef) : null, i = e.attachList ? Us(e.attachList) : null, a = e.ligCaretList ? Gs(e.ligCaretList) : null, o = e.markAttachClassDef ? Gi(e.markAttachClassDef) : null, s = n >= 2 && e.markGlyphSetsDef ? Js(e.markGlyphSetsDef) : null, c = n >= 3 && e.itemVariationStore ? Ei(e.itemVariationStore) : null, l = 12;
	n >= 2 && (l += 2), n >= 3 && (l += 4);
	let u = l, d = r ? u : 0;
	r && (u += r.length);
	let f = i ? u : 0;
	i && (u += i.length);
	let p = a ? u : 0;
	a && (u += a.length);
	let m = o ? u : 0;
	o && (u += o.length);
	let h = s ? u : 0;
	s && (u += s.length);
	let g = c ? u : 0;
	c && (u += c.length);
	let _ = new I(u);
	return _.uint16(t), _.uint16(n), _.uint16(d), _.uint16(f), _.uint16(p), _.uint16(m), n >= 2 && _.uint16(h), n >= 3 && _.uint32(g), r && (_.seek(d), _.rawBytes(r)), i && (_.seek(f), _.rawBytes(i)), a && (_.seek(p), _.rawBytes(a)), o && (_.seek(m), _.rawBytes(o)), s && (_.seek(h), _.rawBytes(s)), c && (_.seek(g), _.rawBytes(c)), _.toArray();
}
function Us(e) {
	let t = V(e.coverage), n = e.attachPoints.map(Ws), r = 4 + e.attachPoints.length * 2, i = r;
	r += t.length;
	let a = n.map((e) => {
		let t = r;
		return r += e.length, t;
	}), o = new I(r);
	o.uint16(i), o.uint16(e.attachPoints.length), o.array("uint16", a), o.seek(i), o.rawBytes(t);
	for (let e = 0; e < n.length; e++) o.seek(a[e]), o.rawBytes(n[e]);
	return o.toArray();
}
function Ws(e) {
	let t = new I(2 + e.length * 2);
	return t.uint16(e.length), t.array("uint16", e), t.toArray();
}
function Gs(e) {
	let t = V(e.coverage), n = e.ligGlyphs.map(Ks), r = 4 + e.ligGlyphs.length * 2, i = r;
	r += t.length;
	let a = n.map((e) => {
		let t = r;
		return r += e.length, t;
	}), o = new I(r);
	o.uint16(i), o.uint16(e.ligGlyphs.length), o.array("uint16", a), o.seek(i), o.rawBytes(t);
	for (let e = 0; e < n.length; e++) o.seek(a[e]), o.rawBytes(n[e]);
	return o.toArray();
}
function Ks(e) {
	let t = e.map(qs), n = 2 + e.length * 2, r = t.map((e) => {
		let t = n;
		return n += e.length, t;
	}), i = new I(n);
	i.uint16(e.length), i.array("uint16", r);
	for (let e = 0; e < t.length; e++) i.seek(r[e]), i.rawBytes(t[e]);
	return i.toArray();
}
function qs(e) {
	if (e.format === 1) {
		let t = new I(4);
		return t.uint16(1), t.int16(e.coordinate), t.toArray();
	}
	if (e.format === 2) {
		let t = new I(4);
		return t.uint16(2), t.uint16(e.caretValuePointIndex), t.toArray();
	}
	if (e.format === 3) {
		let t = e.device ? qi(e.device) : null, n = new I(6 + (t ? t.length : 0));
		return n.uint16(3), n.int16(e.coordinate), n.uint16(t ? 6 : 0), t && n.rawBytes(t), n.toArray();
	}
	throw Error(`Unknown CaretValue format: ${e.format}`);
}
function Js(e) {
	let t = e.coverages.map(V), n = 4 + e.coverages.length * 4, r = t.map((e) => {
		let t = n;
		return n += e.length, t;
	}), i = new I(n);
	i.uint16(e.format), i.uint16(e.coverages.length);
	for (let e of r) i.uint32(e);
	for (let e = 0; e < t.length; e++) i.seek(r[e]), i.rawBytes(t[e]);
	return i.toArray();
}
//#endregion
//#region src/sfnt/table_GPOS.js
function Ys(e) {
	let t = 0, n = e;
	for (; n;) t += n & 1, n >>>= 1;
	return t * 2;
}
function Xs(e, t, n) {
	if (t === 0) return null;
	let r = e.position, i = {};
	t & 1 && (i.xPlacement = e.int16()), t & 2 && (i.yPlacement = e.int16()), t & 4 && (i.xAdvance = e.int16()), t & 8 && (i.yAdvance = e.int16());
	let a = t & 16 ? e.uint16() : 0, o = t & 32 ? e.uint16() : 0, s = t & 64 ? e.uint16() : 0, c = t & 128 ? e.uint16() : 0, l = e.position, u = (i, l) => {
		let u = n + i, d = r + i;
		try {
			return Ki(e, u);
		} catch (i) {
			if (d !== u) try {
				return Ki(e, d);
			} catch {}
			let f = i instanceof Error ? i.message : String(i);
			throw Error(`${f}; ValueRecord context: valueFormat=${t}, subtableOffset=${n}, valueRecordStart=${r}, offsets={xPla:${a},yPla:${o},xAdv:${s},yAdv:${c}}, field=${l}`);
		}
	};
	return a && (i.xPlaDevice = u(a, "xPlaDevice"), e.seek(l)), o && (i.yPlaDevice = u(o, "yPlaDevice"), e.seek(l)), s && (i.xAdvDevice = u(s, "xAdvDevice"), e.seek(l)), c && (i.yAdvDevice = u(c, "yAdvDevice"), e.seek(l)), i;
}
function Zs(e, t) {
	if (t === 0) return null;
	e.seek(t);
	let n = e.uint16(), r = {
		format: n,
		xCoordinate: e.int16(),
		yCoordinate: e.int16()
	};
	if (n === 2) r.anchorPoint = e.uint16();
	else if (n === 3) {
		let n = e.uint16(), i = e.uint16();
		n && (r.xDevice = Ki(e, t + n)), i && (r.yDevice = Ki(e, t + i));
	}
	return r;
}
function Qs(e, t) {
	e.seek(t);
	let n = e.uint16(), r = [];
	for (let t = 0; t < n; t++) {
		let t = e.uint16(), n = e.uint16();
		r.push({
			markClass: t,
			anchorOffset: n
		});
	}
	return r.map((n) => ({
		markClass: n.markClass,
		markAnchor: Zs(e, t + n.anchorOffset)
	}));
}
function $s(e) {
	let t = new F(e), n = t.uint16(), r = t.uint16(), i = t.uint16(), a = t.uint16(), o = t.uint16(), s = 0;
	r >= 1 && (s = t.uint32());
	let c = {
		majorVersion: n,
		minorVersion: r,
		scriptList: Ji(t, i),
		featureList: ea(t, a),
		lookupList: ia(t, o, ec, 9)
	};
	return s !== 0 && (c.featureVariations = Oa(t, s)), c;
}
function ec(e, t, n) {
	switch (n) {
		case 1: return tc(e, t);
		case 2: return nc(e, t);
		case 3: return rc(e, t);
		case 4: return ic(e, t);
		case 5: return ac(e, t);
		case 6: return oc(e, t);
		case 7: return sa(e, t);
		case 8: return va(e, t);
		case 9: return sc(e, t);
		default: throw Error(`Unknown GPOS lookup type: ${n}`);
	}
}
function tc(e, t) {
	e.seek(t);
	let n = e.uint16();
	if (n === 1) {
		let r = e.uint16(), i = e.uint16(), a = Xs(e, i, t);
		return {
			format: n,
			coverage: B(e, t + r),
			valueFormat: i,
			valueRecord: a
		};
	}
	if (n === 2) {
		let r = e.uint16(), i = e.uint16(), a = e.uint16(), o = [];
		for (let n = 0; n < a; n++) o.push(Xs(e, i, t));
		return {
			format: n,
			coverage: B(e, t + r),
			valueFormat: i,
			valueCount: a,
			valueRecords: o
		};
	}
	throw Error(`Unknown SinglePos format: ${n}`);
}
function nc(e, t) {
	e.seek(t);
	let n = e.uint16();
	if (n === 1) {
		let r = e.uint16(), i = e.uint16(), a = e.uint16(), o = e.uint16(), s = e.array("uint16", o).map((n) => {
			let r = t + n;
			e.seek(r);
			let o = e.uint16(), s = [];
			for (let t = 0; t < o; t++) {
				let t = e.uint16(), n = Xs(e, i, r), o = Xs(e, a, r);
				s.push({
					secondGlyph: t,
					value1: n,
					value2: o
				});
			}
			return s;
		});
		return {
			format: n,
			coverage: B(e, t + r),
			valueFormat1: i,
			valueFormat2: a,
			pairSets: s
		};
	}
	if (n === 2) {
		let r = e.uint16(), i = e.uint16(), a = e.uint16(), o = e.uint16(), s = e.uint16(), c = e.uint16(), l = e.uint16(), u = [];
		for (let n = 0; n < c; n++) {
			let n = [];
			for (let r = 0; r < l; r++) {
				let r = Xs(e, i, t), o = Xs(e, a, t);
				n.push({
					value1: r,
					value2: o
				});
			}
			u.push(n);
		}
		return {
			format: n,
			coverage: B(e, t + r),
			valueFormat1: i,
			valueFormat2: a,
			classDef1: Wi(e, t + o),
			classDef2: Wi(e, t + s),
			class1Count: c,
			class2Count: l,
			class1Records: u
		};
	}
	throw Error(`Unknown PairPos format: ${n}`);
}
function rc(e, t) {
	e.seek(t);
	let n = e.uint16();
	if (n !== 1) throw Error(`Unknown CursivePos format: ${n}`);
	let r = e.uint16(), i = e.uint16(), a = [];
	for (let t = 0; t < i; t++) {
		let t = e.uint16(), n = e.uint16();
		a.push({
			entryAnchorOff: t,
			exitAnchorOff: n
		});
	}
	return {
		format: n,
		coverage: B(e, t + r),
		entryExitRecords: a.map((n) => ({
			entryAnchor: n.entryAnchorOff ? Zs(e, t + n.entryAnchorOff) : null,
			exitAnchor: n.exitAnchorOff ? Zs(e, t + n.exitAnchorOff) : null
		}))
	};
}
function ic(e, t) {
	e.seek(t);
	let n = e.uint16();
	if (n !== 1) throw Error(`Unknown MarkBasePos format: ${n}`);
	let r = e.uint16(), i = e.uint16(), a = e.uint16(), o = e.uint16(), s = e.uint16(), c = B(e, t + r), l = B(e, t + i), u = Qs(e, t + o);
	e.seek(t + s);
	let d = e.uint16(), f = [];
	for (let t = 0; t < d; t++) {
		let t = e.array("uint16", a);
		f.push(t);
	}
	return {
		format: n,
		markCoverage: c,
		baseCoverage: l,
		markClassCount: a,
		markArray: u,
		baseArray: f.map((n) => n.map((n) => n ? Zs(e, t + s + n) : null))
	};
}
function ac(e, t) {
	e.seek(t);
	let n = e.uint16();
	if (n !== 1) throw Error(`Unknown MarkLigPos format: ${n}`);
	let r = e.uint16(), i = e.uint16(), a = e.uint16(), o = e.uint16(), s = e.uint16(), c = B(e, t + r), l = B(e, t + i), u = Qs(e, t + o);
	e.seek(t + s);
	let d = e.uint16();
	return {
		format: n,
		markCoverage: c,
		ligatureCoverage: l,
		markClassCount: a,
		markArray: u,
		ligatureArray: e.array("uint16", d).map((n) => {
			let r = t + s + n;
			e.seek(r);
			let i = e.uint16(), o = [];
			for (let t = 0; t < i; t++) {
				let t = e.array("uint16", a);
				o.push(t);
			}
			return o.map((t) => t.map((t) => t ? Zs(e, r + t) : null));
		})
	};
}
function oc(e, t) {
	e.seek(t);
	let n = e.uint16();
	if (n !== 1) throw Error(`Unknown MarkMarkPos format: ${n}`);
	let r = e.uint16(), i = e.uint16(), a = e.uint16(), o = e.uint16(), s = e.uint16(), c = B(e, t + r), l = B(e, t + i), u = Qs(e, t + o);
	e.seek(t + s);
	let d = e.uint16(), f = [];
	for (let t = 0; t < d; t++) {
		let t = e.array("uint16", a);
		f.push(t);
	}
	return {
		format: n,
		mark1Coverage: c,
		mark2Coverage: l,
		markClassCount: a,
		mark1Array: u,
		mark2Array: f.map((n) => n.map((n) => n ? Zs(e, t + s + n) : null))
	};
}
function sc(e, t) {
	e.seek(t);
	let n = e.uint16();
	if (n !== 1) throw Error(`Unknown ExtensionPos format: ${n}`);
	let r = e.uint16(), i = e.uint32();
	return {
		format: n,
		extensionLookupType: r,
		extensionOffset: i,
		subtable: ec(e, t + i, r)
	};
}
function cc(e, t, n, r = 0) {
	if (!t) return [];
	let i = new I(Ys(t));
	return t & 1 && i.int16(e ? e.xPlacement ?? 0 : 0), t & 2 && i.int16(e ? e.yPlacement ?? 0 : 0), t & 4 && i.int16(e ? e.xAdvance ?? 0 : 0), t & 8 && i.int16(e ? e.yAdvance ?? 0 : 0), t & 16 && (e?.xPlaDevice && n.push({
		field: r + i.position,
		device: e.xPlaDevice
	}), i.uint16(0)), t & 32 && (e?.yPlaDevice && n.push({
		field: r + i.position,
		device: e.yPlaDevice
	}), i.uint16(0)), t & 64 && (e?.xAdvDevice && n.push({
		field: r + i.position,
		device: e.xAdvDevice
	}), i.uint16(0)), t & 128 && (e?.yAdvDevice && n.push({
		field: r + i.position,
		device: e.yAdvDevice
	}), i.uint16(0)), i.toArray();
}
function lc(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let { field: r, device: i } of t) {
		let t = qi(i), a = t.join(","), o = n.get(a);
		if (o === void 0) {
			if (o = e.length, o > 65535) throw Error("GPOS Device offset exceeds Offset16 range.");
			n.set(a, o);
			for (let n of t) e.push(n);
		}
		e[r] = o >>> 8, e[r + 1] = o & 255;
	}
	return e;
}
function uc(e) {
	if (!e) return [];
	let { format: t, xCoordinate: n, yCoordinate: r } = e;
	if (t === 1) {
		let e = new I(6);
		return e.uint16(1), e.int16(n), e.int16(r), e.toArray();
	}
	if (t === 2) {
		let t = new I(8);
		return t.uint16(2), t.int16(n), t.int16(r), t.uint16(e.anchorPoint), t.toArray();
	}
	if (t === 3) {
		let t = e.xDevice ? qi(e.xDevice) : null, i = e.yDevice ? qi(e.yDevice) : null, a = 10, o = t ? a : 0;
		t && (a += t.length);
		let s = i ? a : 0;
		i && (a += i.length);
		let c = new I(a);
		return c.uint16(3), c.int16(n), c.int16(r), c.uint16(o), c.uint16(s), t && (c.seek(o), c.rawBytes(t)), i && (c.seek(s), c.rawBytes(i)), c.toArray();
	}
	throw Error(`Unknown Anchor format: ${t}`);
}
function dc(e) {
	let t = e.map((e) => uc(e.markAnchor)), n = 2 + e.length * 4, r = t.map((e) => {
		if (!e.length) return 0;
		let t = n;
		return n += e.length, t;
	}), i = new I(n);
	i.uint16(e.length);
	for (let t = 0; t < e.length; t++) i.uint16(e[t].markClass), i.uint16(r[t]);
	for (let e = 0; e < t.length; e++) t[e].length && (i.seek(r[e]), i.rawBytes(t[e]));
	return i.toArray();
}
function fc(e) {
	let { majorVersion: t, minorVersion: n } = e, r = pc(e), i = Zi(r.scriptList), a = na(r.featureList), o = oa(r.lookupList, _c, 9), s = r.featureVariations ? ja(r.featureVariations) : null, c = 10;
	n >= 1 && (c += 4);
	let l = c, u = l;
	l += i.length;
	let d = l;
	l += a.length;
	let f = l;
	l += o.length;
	let p = s ? l : 0;
	s && (l += s.length);
	let m = new I(l);
	return m.uint16(t), m.uint16(n), m.uint16(u), m.uint16(d), m.uint16(f), n >= 1 && m.uint32(p), m.seek(u), m.rawBytes(i), m.seek(d), m.rawBytes(a), m.seek(f), m.rawBytes(o), s && (m.seek(p), m.rawBytes(s)), m.toArray();
}
function pc(e) {
	let t = e.lookupList.lookups.map((e) => {
		if (e.lookupType !== 2 || !Array.isArray(e.subtables)) return e;
		let t = e.subtables.flatMap((e) => e?.format !== 1 || !Array.isArray(e.pairSets) ? [e] : mc(e));
		return {
			...e,
			subtables: t
		};
	});
	return {
		...e,
		lookupList: {
			...e.lookupList,
			lookups: t
		}
	};
}
function mc(e) {
	let t = gc(e.coverage);
	if (t.length !== e.pairSets.length) return [e];
	let n = Ys(e.valueFormat1) + Ys(e.valueFormat2), r = e.pairSets.map((e) => {
		let t = /* @__PURE__ */ new Map();
		for (let n of e) for (let e of [n.value1, n.value2]) for (let n of [
			"xPlaDevice",
			"yPlaDevice",
			"xAdvDevice",
			"yAdvDevice"
		]) if (e?.[n]) {
			let r = qi(e[n]);
			t.set(r.join(","), r.length);
		}
		return 2 + e.length * (2 + n) + [...t.values()].reduce((e, t) => e + t, 0);
	}), i = r.reduce((e, t) => e + t, 0);
	if (hc(e.pairSets.length, i) <= 65535) return [e];
	let a = [], o = 0;
	for (; o < e.pairSets.length;) {
		let n = o, i = 0, s = !1;
		for (; n < e.pairSets.length;) {
			let e = i + r[n];
			if (hc(n - o + 1, e) > 65535) break;
			i = e, n += 1, s = !0;
		}
		if (!s) throw Error("Cannot encode PairPos format 1: single PairSet exceeds 16-bit offset range");
		a.push({
			...e,
			coverage: {
				format: 1,
				glyphs: t.slice(o, n)
			},
			pairSets: e.pairSets.slice(o, n)
		}), o = n;
	}
	return a;
}
function hc(e, t) {
	return 10 + e * 2 + (4 + e * 2) + t;
}
function gc(e) {
	if (!e) return [];
	if (e.format === 1) return e.glyphs;
	if (e.format === 2) {
		let t = [];
		for (let n of e.ranges) for (let e = n.startGlyphID; e <= n.endGlyphID; e++) t.push(e);
		return t;
	}
	return [];
}
function _c(e, t) {
	switch (t) {
		case 1: return vc(e);
		case 2: return yc(e);
		case 3: return bc(e);
		case 4: return xc(e);
		case 5: return Cc(e);
		case 6: return Tc(e);
		case 7: return da(e);
		case 8: return Sa(e);
		case 9: return Ec(e);
		default: throw Error(`Unknown GPOS lookup type: ${t}`);
	}
}
function vc(e) {
	let t = V(e.coverage), n = [];
	if (e.format === 1) {
		let r = cc(e.valueRecord, e.valueFormat, n, 6), i = 6 + r.length, a = new I(i + t.length);
		return a.uint16(1), a.uint16(i), a.uint16(e.valueFormat), a.rawBytes(r), a.seek(i), a.rawBytes(t), lc(a.toArray(), n);
	}
	if (e.format === 2) {
		let r = Ys(e.valueFormat), i = e.valueRecords.map((t, i) => cc(t, e.valueFormat, n, 8 + i * r)), a = 8 + i.length * r, o = new I(a + t.length);
		o.uint16(2), o.uint16(a), o.uint16(e.valueFormat), o.uint16(e.valueCount);
		for (let e of i) o.rawBytes(e);
		return o.seek(a), o.rawBytes(t), lc(o.toArray(), n);
	}
	throw Error(`Unknown SinglePos format: ${e.format}`);
}
function yc(e) {
	let t = V(e.coverage), n = [];
	if (e.format === 1) {
		let n = e.pairSets.map((t) => {
			let n = [], r = Ys(e.valueFormat1), i = Ys(e.valueFormat2), a = 2 + r + i, o = new I(2 + t.length * a);
			o.uint16(t.length);
			for (let r of t) o.uint16(r.secondGlyph), o.rawBytes(cc(r.value1, e.valueFormat1, n, o.position)), o.rawBytes(cc(r.value2, e.valueFormat2, n, o.position));
			return lc(o.toArray(), n);
		}), r = 10 + e.pairSets.length * 2, i = r;
		r += t.length;
		let a = n.map((e) => {
			let t = r;
			return r += e.length, t;
		}), o = new I(r);
		o.uint16(1), o.uint16(i), o.uint16(e.valueFormat1), o.uint16(e.valueFormat2), o.uint16(e.pairSets.length), o.array("uint16", a), o.seek(i), o.rawBytes(t);
		for (let e = 0; e < n.length; e++) o.seek(a[e]), o.rawBytes(n[e]);
		return o.toArray();
	}
	if (e.format === 2) {
		let r = Gi(e.classDef1), i = Gi(e.classDef2), a = Ys(e.valueFormat1) + Ys(e.valueFormat2), o = 16 + e.class1Count * e.class2Count * a, s = o;
		o += t.length;
		let c = o;
		o += r.length;
		let l = o;
		o += i.length;
		let u = new I(o);
		u.uint16(2), u.uint16(s), u.uint16(e.valueFormat1), u.uint16(e.valueFormat2), u.uint16(c), u.uint16(l), u.uint16(e.class1Count), u.uint16(e.class2Count);
		for (let t of e.class1Records) for (let r of t) u.rawBytes(cc(r.value1, e.valueFormat1, n, u.position)), u.rawBytes(cc(r.value2, e.valueFormat2, n, u.position));
		return u.seek(s), u.rawBytes(t), u.seek(c), u.rawBytes(r), u.seek(l), u.rawBytes(i), lc(u.toArray(), n);
	}
	throw Error(`Unknown PairPos format: ${e.format}`);
}
function bc(e) {
	let t = V(e.coverage), n = e.entryExitRecords.map((e) => ({
		entry: e.entryAnchor ? uc(e.entryAnchor) : null,
		exit: e.exitAnchor ? uc(e.exitAnchor) : null
	})), r = 6 + e.entryExitRecords.length * 4, i = r;
	r += t.length;
	let a = n.map((e) => {
		let t = e.entry ? r : 0;
		e.entry && (r += e.entry.length);
		let n = e.exit ? r : 0;
		return e.exit && (r += e.exit.length), {
			entryOff: t,
			exitOff: n
		};
	}), o = new I(r);
	o.uint16(1), o.uint16(i), o.uint16(e.entryExitRecords.length);
	for (let e of a) o.uint16(e.entryOff), o.uint16(e.exitOff);
	o.seek(i), o.rawBytes(t);
	for (let e = 0; e < n.length; e++) n[e].entry && (o.seek(a[e].entryOff), o.rawBytes(n[e].entry)), n[e].exit && (o.seek(a[e].exitOff), o.rawBytes(n[e].exit));
	return o.toArray();
}
function xc(e) {
	let t = V(e.markCoverage), n = V(e.baseCoverage), r = dc(e.markArray), i = Sc(e.baseArray), a = 12, o = a;
	a += t.length;
	let s = a;
	a += n.length;
	let c = a;
	a += r.length;
	let l = a;
	a += i.length;
	let u = new I(a);
	return u.uint16(1), u.uint16(o), u.uint16(s), u.uint16(e.markClassCount), u.uint16(c), u.uint16(l), u.seek(o), u.rawBytes(t), u.seek(s), u.rawBytes(n), u.seek(c), u.rawBytes(r), u.seek(l), u.rawBytes(i), u.toArray();
}
function Sc(e) {
	let t = e.length > 0 ? e[0].length : 0, n = e.map((e) => e.map(uc)), r = 2 + e.length * t * 2, i = n.map((e) => e.map((e) => {
		if (!e.length) return 0;
		let t = r;
		return r += e.length, t;
	})), a = new I(r);
	a.uint16(e.length);
	for (let n = 0; n < e.length; n++) for (let e = 0; e < t; e++) a.uint16(i[n][e]);
	for (let e = 0; e < n.length; e++) for (let r = 0; r < t; r++) n[e][r].length && (a.seek(i[e][r]), a.rawBytes(n[e][r]));
	return a.toArray();
}
function Cc(e) {
	let t = V(e.markCoverage), n = V(e.ligatureCoverage), r = dc(e.markArray), i = wc(e.ligatureArray, e.markClassCount), a = 12, o = a;
	a += t.length;
	let s = a;
	a += n.length;
	let c = a;
	a += r.length;
	let l = a;
	a += i.length;
	let u = new I(a);
	return u.uint16(1), u.uint16(o), u.uint16(s), u.uint16(e.markClassCount), u.uint16(c), u.uint16(l), u.seek(o), u.rawBytes(t), u.seek(s), u.rawBytes(n), u.seek(c), u.rawBytes(r), u.seek(l), u.rawBytes(i), u.toArray();
}
function wc(e, t) {
	let n = e.map((e) => {
		let n = e.map((e) => e.map(uc)), r = 2 + e.length * t * 2, i = n.map((e) => e.map((e) => {
			if (!e.length) return 0;
			let t = r;
			return r += e.length, t;
		})), a = new I(r);
		a.uint16(e.length);
		for (let n = 0; n < e.length; n++) for (let e = 0; e < t; e++) a.uint16(i[n][e]);
		for (let e = 0; e < n.length; e++) for (let r = 0; r < t; r++) n[e][r].length && (a.seek(i[e][r]), a.rawBytes(n[e][r]));
		return a.toArray();
	}), r = 2 + e.length * 2, i = n.map((e) => {
		let t = r;
		return r += e.length, t;
	}), a = new I(r);
	a.uint16(e.length), a.array("uint16", i);
	for (let e = 0; e < n.length; e++) a.seek(i[e]), a.rawBytes(n[e]);
	return a.toArray();
}
function Tc(e) {
	let t = V(e.mark1Coverage), n = V(e.mark2Coverage), r = dc(e.mark1Array), i = Sc(e.mark2Array), a = 12, o = a;
	a += t.length;
	let s = a;
	a += n.length;
	let c = a;
	a += r.length;
	let l = a;
	a += i.length;
	let u = new I(a);
	return u.uint16(1), u.uint16(o), u.uint16(s), u.uint16(e.markClassCount), u.uint16(c), u.uint16(l), u.seek(o), u.rawBytes(t), u.seek(s), u.rawBytes(n), u.seek(c), u.rawBytes(r), u.seek(l), u.rawBytes(i), u.toArray();
}
function Ec(e) {
	let t = _c(e.subtable, e.extensionLookupType), n = new I(8 + t.length);
	return n.uint16(1), n.uint16(e.extensionLookupType), n.uint32(8), n.rawBytes(t), n.toArray();
}
//#endregion
//#region src/sfnt/table_GSUB.js
function Dc(e) {
	let t = new F(e), n = t.uint16(), r = t.uint16(), i = t.uint16(), a = t.uint16(), o = t.uint16(), s = 0;
	r >= 1 && (s = t.uint32());
	let c = {
		majorVersion: n,
		minorVersion: r,
		scriptList: Ji(t, i),
		featureList: ea(t, a),
		lookupList: ia(t, o, Oc, 7)
	};
	return s !== 0 && (c.featureVariations = Oa(t, s)), c;
}
function Oc(e, t, n) {
	switch (n) {
		case 1: return kc(e, t);
		case 2: return Ac(e, t);
		case 3: return jc(e, t);
		case 4: return Mc(e, t);
		case 5: return sa(e, t);
		case 6: return va(e, t);
		case 7: return Nc(e, t);
		case 8: return Pc(e, t);
		default: throw Error(`Unknown GSUB lookup type: ${n}`);
	}
}
function kc(e, t) {
	e.seek(t);
	let n = e.uint16();
	if (n === 1) {
		let r = e.uint16(), i = e.int16();
		return {
			format: n,
			coverage: B(e, t + r),
			deltaGlyphID: i
		};
	}
	if (n === 2) {
		let r = e.uint16(), i = e.uint16(), a = e.array("uint16", i);
		return {
			format: n,
			coverage: B(e, t + r),
			substituteGlyphIDs: a
		};
	}
	throw Error(`Unknown SingleSubst format: ${n}`);
}
function Ac(e, t) {
	e.seek(t);
	let n = e.uint16();
	if (n !== 1) throw Error(`Unknown MultipleSubst format: ${n}`);
	let r = e.uint16(), i = e.uint16(), a = e.array("uint16", i);
	return {
		format: n,
		coverage: B(e, t + r),
		sequences: a.map((n) => {
			e.seek(t + n);
			let r = e.uint16();
			return e.array("uint16", r);
		})
	};
}
function jc(e, t) {
	e.seek(t);
	let n = e.uint16();
	if (n !== 1) throw Error(`Unknown AlternateSubst format: ${n}`);
	let r = e.uint16(), i = e.uint16(), a = e.array("uint16", i);
	return {
		format: n,
		coverage: B(e, t + r),
		alternateSets: a.map((n) => {
			e.seek(t + n);
			let r = e.uint16();
			return e.array("uint16", r);
		})
	};
}
function Mc(e, t) {
	e.seek(t);
	let n = e.uint16();
	if (n !== 1) throw Error(`Unknown LigatureSubst format: ${n}`);
	let r = e.uint16(), i = e.uint16(), a = e.array("uint16", i);
	return {
		format: n,
		coverage: B(e, t + r),
		ligatureSets: a.map((n) => {
			let r = t + n;
			e.seek(r);
			let i = e.uint16();
			return e.array("uint16", i).map((t) => {
				e.seek(r + t);
				let n = e.uint16(), i = e.uint16();
				return {
					ligatureGlyph: n,
					componentCount: i,
					componentGlyphIDs: e.array("uint16", i - 1)
				};
			});
		})
	};
}
function Nc(e, t) {
	e.seek(t);
	let n = e.uint16();
	if (n !== 1) throw Error(`Unknown ExtensionSubst format: ${n}`);
	let r = e.uint16(), i = e.uint32();
	return {
		format: n,
		extensionLookupType: r,
		extensionOffset: i,
		subtable: Oc(e, t + i, r)
	};
}
function Pc(e, t) {
	e.seek(t);
	let n = e.uint16();
	if (n !== 1) throw Error(`Unknown ReverseChainSingleSubst format: ${n}`);
	let r = e.uint16(), i = e.uint16(), a = e.array("uint16", i), o = e.uint16(), s = e.array("uint16", o), c = e.uint16(), l = e.array("uint16", c);
	return {
		format: n,
		coverage: B(e, t + r),
		backtrackCoverages: a.map((n) => B(e, t + n)),
		lookaheadCoverages: s.map((n) => B(e, t + n)),
		substituteGlyphIDs: l
	};
}
function Fc(e) {
	let { majorVersion: t, minorVersion: n } = e, r = Zi(e.scriptList), i = na(e.featureList), a = oa(e.lookupList, Ic, 7), o = e.featureVariations ? ja(e.featureVariations) : null, s = 10;
	n >= 1 && (s += 4);
	let c = s, l = c;
	c += r.length;
	let u = c;
	c += i.length;
	let d = c;
	c += a.length;
	let f = o ? c : 0;
	o && (c += o.length);
	let p = new I(c);
	return p.uint16(t), p.uint16(n), p.uint16(l), p.uint16(u), p.uint16(d), n >= 1 && p.uint32(f), p.seek(l), p.rawBytes(r), p.seek(u), p.rawBytes(i), p.seek(d), p.rawBytes(a), o && (p.seek(f), p.rawBytes(o)), p.toArray();
}
function Ic(e, t) {
	switch (t) {
		case 1: return Lc(e);
		case 2: return Rc(e);
		case 3: return zc(e);
		case 4: return Bc(e);
		case 5: return da(e);
		case 6: return Sa(e);
		case 7: return Hc(e);
		case 8: return Uc(e);
		default: throw Error(`Unknown GSUB lookup type: ${t}`);
	}
}
function Lc(e) {
	let t = V(e.coverage);
	if (e.format === 1) {
		let n = new I(6 + t.length);
		return n.uint16(1), n.uint16(6), n.int16(e.deltaGlyphID), n.seek(6), n.rawBytes(t), n.toArray();
	}
	if (e.format === 2) {
		let n = 6 + e.substituteGlyphIDs.length * 2, r = n, i = new I(n + t.length);
		return i.uint16(2), i.uint16(r), i.uint16(e.substituteGlyphIDs.length), i.array("uint16", e.substituteGlyphIDs), i.seek(r), i.rawBytes(t), i.toArray();
	}
	throw Error(`Unknown SingleSubst format: ${e.format}`);
}
function Rc(e) {
	let t = V(e.coverage), n = e.sequences.map((e) => {
		let t = new I(2 + e.length * 2);
		return t.uint16(e.length), t.array("uint16", e), t.toArray();
	}), r = 6 + e.sequences.length * 2, i = r;
	r += t.length;
	let a = n.map((e) => {
		let t = r;
		return r += e.length, t;
	}), o = new I(r);
	o.uint16(1), o.uint16(i), o.uint16(e.sequences.length), o.array("uint16", a), o.seek(i), o.rawBytes(t);
	for (let e = 0; e < n.length; e++) o.seek(a[e]), o.rawBytes(n[e]);
	return o.toArray();
}
function zc(e) {
	let t = V(e.coverage), n = e.alternateSets.map((e) => {
		let t = new I(2 + e.length * 2);
		return t.uint16(e.length), t.array("uint16", e), t.toArray();
	}), r = 6 + e.alternateSets.length * 2, i = r;
	r += t.length;
	let a = n.map((e) => {
		let t = r;
		return r += e.length, t;
	}), o = new I(r);
	o.uint16(1), o.uint16(i), o.uint16(e.alternateSets.length), o.array("uint16", a), o.seek(i), o.rawBytes(t);
	for (let e = 0; e < n.length; e++) o.seek(a[e]), o.rawBytes(n[e]);
	return o.toArray();
}
function Bc(e) {
	let t = V(e.coverage), n = e.ligatureSets.map(Vc), r = 6 + e.ligatureSets.length * 2, i = r;
	r += t.length;
	let a = n.map((e) => {
		let t = r;
		return r += e.length, t;
	}), o = new I(r);
	o.uint16(1), o.uint16(i), o.uint16(e.ligatureSets.length), o.array("uint16", a), o.seek(i), o.rawBytes(t);
	for (let e = 0; e < n.length; e++) o.seek(a[e]), o.rawBytes(n[e]);
	return o.toArray();
}
function Vc(e) {
	let t = e.map((e) => {
		let t = new I(4 + (e.componentCount - 1) * 2);
		return t.uint16(e.ligatureGlyph), t.uint16(e.componentCount), t.array("uint16", e.componentGlyphIDs), t.toArray();
	}), n = 2 + e.length * 2, r = t.map((e) => {
		let t = n;
		return n += e.length, t;
	}), i = new I(n);
	i.uint16(e.length), i.array("uint16", r);
	for (let e = 0; e < t.length; e++) i.seek(r[e]), i.rawBytes(t[e]);
	return i.toArray();
}
function Hc(e) {
	let t = Ic(e.subtable, e.extensionLookupType), n = new I(8 + t.length);
	return n.uint16(1), n.uint16(e.extensionLookupType), n.uint32(8), n.rawBytes(t), n.toArray();
}
function Uc(e) {
	let t = V(e.coverage), n = e.backtrackCoverages.map(V), r = e.lookaheadCoverages.map(V), i = 6 + e.backtrackCoverages.length * 2 + 2 + e.lookaheadCoverages.length * 2 + 2 + e.substituteGlyphIDs.length * 2, a = i;
	i += t.length;
	let o = n.map((e) => {
		let t = i;
		return i += e.length, t;
	}), s = r.map((e) => {
		let t = i;
		return i += e.length, t;
	}), c = new I(i);
	c.uint16(1), c.uint16(a), c.uint16(e.backtrackCoverages.length), c.array("uint16", o), c.uint16(e.lookaheadCoverages.length), c.array("uint16", s), c.uint16(e.substituteGlyphIDs.length), c.array("uint16", e.substituteGlyphIDs), c.seek(a), c.rawBytes(t);
	for (let e = 0; e < n.length; e++) c.seek(o[e]), c.rawBytes(n[e]);
	for (let e = 0; e < r.length; e++) c.seek(s[e]), c.rawBytes(r[e]);
	return c.toArray();
}
//#endregion
//#region src/sfnt/table_hdmx.js
var Wc = 8;
function Gc(e, t) {
	let n = new F(e), r = n.uint16(), i = n.uint16(), a = n.uint32(), o = t?.maxp?.numGlyphs, s = [];
	for (let t = 0; t < i && !(n.position + a > e.length || a < 2); t++) {
		let e = n.uint8(), t = n.uint8(), r = a - 2, i = typeof o == "number" ? Math.min(o, r) : r, c = n.bytes(i), l = r - i, u = l > 0 ? n.bytes(l) : [];
		s.push({
			pixelSize: e,
			maxWidth: t,
			widths: c,
			padding: u
		});
	}
	return {
		version: r,
		numRecords: i,
		sizeDeviceRecord: a,
		records: s
	};
}
function Kc(e) {
	let t = e.version ?? 0, n = e.records ?? [], r = qc(2 + Math.max(0, ...n.map((e) => (e.widths ?? []).length))), i = e.sizeDeviceRecord ?? r, a = Math.max(2, i), o = new I(Wc + a * n.length);
	o.uint16(t), o.uint16(n.length), o.uint32(a);
	for (let e of n) {
		o.uint8(e.pixelSize ?? 0), o.uint8(e.maxWidth ?? 0);
		let t = a - 2, n = (e.widths ?? []).slice(0, t), r = e.padding ?? [], i = n.concat(r).slice(0, t);
		for (; i.length < t;) i.push(0);
		o.rawBytes(i);
	}
	return o.toArray();
}
function qc(e) {
	return e + (4 - e % 4) % 4;
}
//#endregion
//#region src/sfnt/table_head.js
var Jc = 54;
function Yc(e) {
	let t = new F(e);
	return {
		majorVersion: t.uint16(),
		minorVersion: t.uint16(),
		fontRevision: t.fixed(),
		checksumAdjustment: t.uint32(),
		magicNumber: t.uint32(),
		flags: t.uint16(),
		unitsPerEm: t.uint16(),
		created: t.longDateTime(),
		modified: t.longDateTime(),
		xMin: t.int16(),
		yMin: t.int16(),
		xMax: t.int16(),
		yMax: t.int16(),
		macStyle: t.uint16(),
		lowestRecPPEM: t.uint16(),
		fontDirectionHint: t.int16(),
		indexToLocFormat: t.int16(),
		glyphDataFormat: t.int16()
	};
}
function Xc(e) {
	let t = new I(Jc);
	return t.uint16(e.majorVersion), t.uint16(e.minorVersion), t.fixed(e.fontRevision), t.uint32(e.checksumAdjustment), t.uint32(e.magicNumber), t.uint16(e.flags), t.uint16(e.unitsPerEm), t.longDateTime(e.created), t.longDateTime(e.modified), t.int16(e.xMin), t.int16(e.yMin), t.int16(e.xMax), t.int16(e.yMax), t.uint16(e.macStyle), t.uint16(e.lowestRecPPEM), t.int16(e.fontDirectionHint), t.int16(e.indexToLocFormat), t.int16(e.glyphDataFormat), t.toArray();
}
//#endregion
//#region src/sfnt/table_hhea.js
var Zc = 36;
function Qc(e) {
	let t = new F(e);
	return {
		majorVersion: t.uint16(),
		minorVersion: t.uint16(),
		ascender: t.fword(),
		descender: t.fword(),
		lineGap: t.fword(),
		advanceWidthMax: t.ufword(),
		minLeftSideBearing: t.fword(),
		minRightSideBearing: t.fword(),
		xMaxExtent: t.fword(),
		caretSlopeRise: t.int16(),
		caretSlopeRun: t.int16(),
		caretOffset: t.int16(),
		reserved1: t.int16(),
		reserved2: t.int16(),
		reserved3: t.int16(),
		reserved4: t.int16(),
		metricDataFormat: t.int16(),
		numberOfHMetrics: t.uint16()
	};
}
function $c(e) {
	let t = new I(Zc);
	return t.uint16(e.majorVersion), t.uint16(e.minorVersion), t.fword(e.ascender), t.fword(e.descender), t.fword(e.lineGap), t.ufword(e.advanceWidthMax), t.fword(e.minLeftSideBearing), t.fword(e.minRightSideBearing), t.fword(e.xMaxExtent), t.int16(e.caretSlopeRise), t.int16(e.caretSlopeRun), t.int16(e.caretOffset), t.int16(e.reserved1), t.int16(e.reserved2), t.int16(e.reserved3), t.int16(e.reserved4), t.int16(e.metricDataFormat), t.uint16(e.numberOfHMetrics), t.toArray();
}
//#endregion
//#region src/sfnt/table_hmtx.js
function el(e, t) {
	let n = t.hhea.numberOfHMetrics, r = t.maxp.numGlyphs, i = new F(e), a = [];
	for (let e = 0; e < n; e++) a.push({
		advanceWidth: i.ufword(),
		lsb: i.fword()
	});
	let o = r - n;
	return {
		hMetrics: a,
		leftSideBearings: i.array("fword", o)
	};
}
function tl(e) {
	let { hMetrics: t, leftSideBearings: n } = e, r = new I(t.length * 4 + n.length * 2);
	for (let e of t) r.ufword(e.advanceWidth), r.fword(e.lsb);
	return r.array("fword", n), r.toArray();
}
//#endregion
//#region src/sfnt/table_HVAR.js
var nl = 20, rl = 15, il = 48;
function al(e) {
	let t = new F(e), n = t.uint16(), r = t.uint16(), i = t.offset32(), a = t.offset32(), o = t.offset32(), s = t.offset32();
	return {
		majorVersion: n,
		minorVersion: r,
		itemVariationStore: i ? Ci(e.slice(i, sl(e.length, i, [
			a,
			o,
			s
		]))) : null,
		advanceWidthMapping: ol(e, a, [
			i,
			o,
			s
		]),
		lsbMapping: ol(e, o, [
			i,
			a,
			s
		]),
		rsbMapping: ol(e, s, [
			i,
			a,
			o
		])
	};
}
function ol(e, t, n) {
	if (!t) return null;
	let r = sl(e.length, t, n);
	if (r <= t || t >= e.length) return {
		format: 0,
		entryFormat: 0,
		mapCount: 0,
		entries: [],
		_raw: []
	};
	let i = Array.from(e.slice(t, r));
	return {
		...cl(i),
		_raw: i
	};
}
function sl(e, t, n) {
	return n.filter((e) => e > t).sort((e, t) => e - t)[0] ?? e;
}
function cl(e) {
	let t = new F(e), n = t.uint8(), r = t.uint8(), i = n === 1 ? t.uint32() : t.uint16(), a = (r & rl) + 1, o = ((r & il) >> 4) + 1, s = [];
	for (let e = 0; e < i; e++) {
		let e = gl(t, o);
		s.push(pl(e, a));
	}
	return {
		format: n,
		entryFormat: r,
		mapCount: i,
		entries: s
	};
}
function ll(e) {
	let t = e.majorVersion ?? 1, n = e.minorVersion ?? 0, r = e.itemVariationStore ? Ei(e.itemVariationStore) : [], i = ul(e.advanceWidthMapping), a = ul(e.lsbMapping), o = ul(e.rsbMapping), s = nl, c = r.length ? s : 0;
	s += r.length;
	let l = i.length ? s : 0;
	s += i.length;
	let u = a.length ? s : 0;
	s += a.length;
	let d = o.length ? s : 0;
	s += o.length;
	let f = new I(s);
	return f.uint16(t), f.uint16(n), f.offset32(c), f.offset32(l), f.offset32(u), f.offset32(d), f.rawBytes(r), f.rawBytes(i), f.rawBytes(a), f.rawBytes(o), f.toArray();
}
function ul(e) {
	return e ? e._raw ? e._raw : dl(e) : [];
}
function dl(e) {
	let t = e.entries ?? [], n = e.mapCount ?? t.length, r = ml(t), i = e.format ?? +(n > 65535), a = e.entryFormat ?? r.entryFormat, o = (a & rl) + 1, s = ((a & il) >> 4) + 1, c = new I((i === 1 ? 6 : 4) + n * s);
	c.uint8(i), c.uint8(a), i === 1 ? c.uint32(n) : c.uint16(n);
	for (let e = 0; e < n; e++) _l(c, fl(t[e] ?? {
		outerIndex: 0,
		innerIndex: 0
	}, o), s);
	return c.toArray();
}
function fl(e, t) {
	let n = (1 << t) - 1;
	return (e.outerIndex ?? 0) << t | (e.innerIndex ?? 0) & n;
}
function pl(e, t) {
	let n = (1 << t) - 1;
	return {
		outerIndex: e >> t,
		innerIndex: e & n
	};
}
function ml(e) {
	let t = 0, n = 0;
	for (let r of e) t = Math.max(t, r.innerIndex ?? 0), n = Math.max(n, r.outerIndex ?? 0);
	let r = 1;
	for (; (1 << r) - 1 < t && r < 16;) r++;
	let i = n << r | t, a = 1;
	for (; a < 4 && i > hl(a);) a++;
	return { entryFormat: a - 1 << 4 | r - 1 };
}
function hl(e) {
	return e === 1 ? 255 : e === 2 ? 65535 : e === 3 ? 16777215 : 4294967295;
}
function gl(e, t) {
	return t === 1 ? e.uint8() : t === 2 ? e.uint16() : t === 3 ? e.uint24() : e.uint32();
}
function _l(e, t, n) {
	n === 1 ? e.uint8(t) : n === 2 ? e.uint16(t) : n === 3 ? e.uint24(t) : e.uint32(t >>> 0);
}
//#endregion
//#region src/sfnt/table_JSTF.js
var vl = 6, yl = 6;
function bl(e) {
	let t = new F(e), n = t.uint16(), r = t.uint16(), i = t.uint16(), a = [];
	for (let e = 0; e < i; e++) a.push({
		tag: t.tag(),
		offset: t.offset16()
	});
	let o = a.map((e) => e.offset).filter((e) => e > 0);
	return {
		majorVersion: n,
		minorVersion: r,
		scripts: a.map((t) => ({
			...t,
			table: Sl(e, t.offset, o)
		}))
	};
}
function xl(e) {
	let t = e.majorVersion ?? 1, n = e.minorVersion ?? 0, r = e.scripts ?? [], i = r.map((e) => Cl(e.table)), a = vl + r.length * yl, o = i.map((e) => {
		if (!e.length) return 0;
		let t = a;
		return a += e.length, t;
	}), s = new I(a);
	s.uint16(t), s.uint16(n), s.uint16(r.length);
	for (let e = 0; e < r.length; e++) {
		let t = (r[e].tag ?? "    ").slice(0, 4).padEnd(4, " ");
		s.tag(t), s.offset16(o[e]);
	}
	for (let e of i) s.rawBytes(e);
	return s.toArray();
}
function Sl(e, t, n) {
	if (!t) return null;
	let r = n.filter((e) => e > t).sort((e, t) => e - t)[0] ?? e.length;
	return r <= t || t >= e.length ? { _raw: [] } : { _raw: Array.from(e.slice(t, r)) };
}
function Cl(e) {
	return e ? Array.isArray(e) ? e : e._raw ?? [] : [];
}
//#endregion
//#region src/sfnt/table_kern.js
var wl = 4, Tl = 6, El = 8, Dl = 8;
function Ol(e) {
	let t = new F(e);
	return (e.length >= 4 ? t.uint32() : 0) === 65536 ? Il(e) : kl(e);
}
function kl(e) {
	let t = new F(e), n = t.uint16(), r = t.uint16(), i = [], a = wl;
	for (let n = 0; n < r && !(a + Tl > e.length); n++) {
		t.seek(a);
		let n = t.uint16(), r = t.uint16(), o = t.uint16(), s = o >> 8 & 255, c = Math.min(e.length, a + Math.max(r, Tl)), l = a + Tl, u = Array.from(e.slice(l, c)), d = {
			version: n,
			coverage: o,
			format: s
		};
		s === 0 ? Object.assign(d, Al(u)) : s === 2 ? Object.assign(d, Ml(u)) : d._raw = u, i.push(d), a = c;
	}
	return {
		formatVariant: "opentype",
		version: n,
		nTables: r,
		subtables: i
	};
}
function Al(e) {
	let t = new F(e);
	if (e.length < 8) return {
		nPairs: 0,
		searchRange: 0,
		entrySelector: 0,
		rangeShift: 0,
		pairs: []
	};
	let n = t.uint16();
	t.uint16(), t.uint16(), t.uint16();
	let r = [];
	for (let i = 0; i < n && !(t.position + 6 > e.length); i++) r.push({
		left: t.uint16(),
		right: t.uint16(),
		value: t.int16()
	});
	let i = r.length, a = Math.floor(Math.log2(Math.max(1, i))), o = 2 ** a * 6;
	return {
		nPairs: i,
		searchRange: o,
		entrySelector: a,
		rangeShift: i * 6 - o,
		pairs: r
	};
}
function jl(e) {
	return Al(e);
}
function Ml(e) {
	let t = new F(e);
	if (e.length < 8) return { _raw: e };
	let n = t.uint16(), r = t.uint16(), i = t.uint16(), a = t.uint16(), o = Nl(t, e, r), s = Nl(t, e, i), c = n > 0 ? n / 2 : 0, l = n > 0 && o.maxOffset >= a ? Math.floor((o.maxOffset - a) / n) + 1 : 1, u = [];
	for (let r = 0; r < l; r++) {
		let i = [], o = a + r * n;
		for (let n = 0; n < c; n++) {
			let r = o + n * 2;
			r + 2 <= e.length ? (t.seek(r), i.push(t.int16())) : i.push(0);
		}
		u.push(i);
	}
	return {
		rowWidth: n,
		leftOffsetTable: r,
		rightOffsetTable: i,
		kerningArrayOffset: a,
		leftClassTable: o,
		rightClassTable: s,
		nLeftClasses: l,
		nRightClasses: c,
		values: u
	};
}
function Nl(e, t, n) {
	if (n + 4 > t.length) return {
		firstGlyph: 0,
		nGlyphs: 0,
		offsets: [],
		maxOffset: 0
	};
	e.seek(n);
	let r = e.uint16(), i = e.uint16(), a = [], o = 0;
	for (let n = 0; n < i; n++) if (e.position + 2 <= t.length) {
		let t = e.uint16();
		a.push(t), t > o && (o = t);
	} else a.push(0);
	return {
		firstGlyph: r,
		nGlyphs: i,
		offsets: a,
		maxOffset: o
	};
}
function Pl(e) {
	let t = new F(e);
	if (e.length < 8) return { _raw: e };
	let n = t.uint16(), r = t.uint8(), i = t.uint8(), a = t.uint8(), o = t.uint8(), s = [];
	for (let n = 0; n < r; n++) t.position + 2 <= e.length ? s.push(t.int16()) : s.push(0);
	let c = [];
	for (let r = 0; r < n; r++) t.position < e.length ? c.push(t.uint8()) : c.push(0);
	let l = [];
	for (let r = 0; r < n; r++) t.position < e.length ? l.push(t.uint8()) : l.push(0);
	let u = [], d = i * a;
	for (let n = 0; n < d; n++) t.position < e.length ? u.push(t.uint8()) : u.push(0);
	return {
		glyphCount: n,
		kernValueCount: r,
		leftClassCount: i,
		rightClassCount: a,
		flags: o,
		kernValues: s,
		leftClasses: c,
		rightClasses: l,
		kernIndices: u
	};
}
function Fl(e) {
	let t = new F(e);
	if (e.length < 12) return { _raw: e };
	let n = t.uint16(), r = t.uint16(), i = t.uint16(), a = t.uint16(), o = t.uint16(), s = 0, c = 0, l = [];
	if (r + 4 <= e.length) {
		t.seek(r), s = t.uint16(), c = t.uint16(), l = [];
		for (let n = 0; n < c; n++) t.position < e.length ? l.push(t.uint8()) : l.push(1);
	}
	let u = Math.min(a, e.length), d = n > 0 ? Math.floor((u - i) / n) : 0, f = [];
	for (let r = 0; r < d; r++) {
		let a = i + r * n;
		t.seek(a);
		let o = [];
		for (let r = 0; r < n; r++) t.position < e.length ? o.push(t.uint8()) : o.push(0);
		f.push(o);
	}
	let p = Math.min(o > a ? o : e.length, e.length), m = Math.floor((p - a) / 4), h = [];
	t.seek(a);
	for (let n = 0; n < m; n++) if (t.position + 4 <= e.length) {
		let e = t.uint16(), n = t.uint16();
		h.push({
			newStateOffset: e,
			flags: n
		});
	}
	let g = [];
	if (o < e.length) for (t.seek(o); t.position + 2 <= e.length;) g.push(t.int16());
	return {
		stateSize: n,
		classTableOffset: r,
		stateArrayOffset: i,
		entryTableOffset: a,
		valueTableOffset: o,
		classTable: {
			firstGlyph: s,
			nGlyphs: c,
			classArray: l
		},
		states: f,
		entryTable: h,
		valueTable: g
	};
}
function Il(e) {
	let t = new F(e), n = t.uint32(), r = t.uint32(), i = [], a = El;
	for (let n = 0; n < r && !(a + Dl > e.length); n++) {
		t.seek(a);
		let n = t.uint32(), r = t.uint8(), o = t.uint8(), s = t.uint16(), c = Math.min(e.length, a + Math.max(n, Dl)), l = Array.from(e.slice(a + Dl, c)), u = {
			coverage: r,
			format: o,
			tupleIndex: s
		};
		o === 0 ? Object.assign(u, jl(l)) : o === 1 ? Object.assign(u, Fl(l)) : o === 2 ? Object.assign(u, Ml(l)) : o === 3 ? Object.assign(u, Pl(l)) : u._raw = l, i.push(u), a = c;
	}
	return {
		formatVariant: "apple",
		version: n,
		nTables: r,
		subtables: i
	};
}
function Ll(e) {
	return e.formatVariant === "apple" ? Vl(e) : Rl(e);
}
function Rl(e) {
	let t = e.version ?? 0, n = e.subtables ?? [], r = n.map((e) => zl(e)), i = n.length, a = new I(wl + r.reduce((e, t) => e + t.length, 0));
	a.uint16(t), a.uint16(i);
	for (let e of r) a.rawBytes(e);
	return a.toArray();
}
function zl(e) {
	let t = e._raw ? e._raw : e.format === 0 ? Bl(e) : e.format === 2 ? Ul(e) : [], n = Tl + t.length, r = e.coverage ?? (e.format ?? 0) << 8, i = new I(n);
	return i.uint16(e.version ?? 0), i.uint16(n), i.uint16(r), i.rawBytes(t), i.toArray();
}
function Bl(e) {
	let t = e.pairs ?? [], n = t.length, r = Math.floor(Math.log2(Math.max(1, n))), i = 2 ** r * 6, a = n * 6 - i, o = new I(8 + n * 6);
	o.uint16(n), o.uint16(e.searchRange ?? i), o.uint16(e.entrySelector ?? r), o.uint16(e.rangeShift ?? a);
	for (let e of t) o.uint16(e.left), o.uint16(e.right), o.int16(e.value);
	return o.toArray();
}
function Vl(e) {
	let t = e.version ?? 65536, n = e.subtables ?? [], r = n.map((e) => {
		let t = Hl(e), n = Dl + t.length, r = new I(n);
		return r.uint32(n), r.uint8(e.coverage ?? 0), r.uint8(e.format ?? 0), r.uint16(e.tupleIndex ?? 0), r.rawBytes(t), r.toArray();
	}), i = n.length, a = new I(El + r.reduce((e, t) => e + t.length, 0));
	a.uint32(t), a.uint32(i);
	for (let e of r) a.rawBytes(e);
	return a.toArray();
}
function Hl(e) {
	if (e._raw) return e._raw;
	switch (e.format) {
		case 0: return Bl(e);
		case 1: return Kl(e);
		case 2: return Ul(e);
		case 3: return Gl(e);
		default: return [];
	}
}
function Ul(e) {
	let { rowWidth: t, leftOffsetTable: n, rightOffsetTable: r, kerningArrayOffset: i, leftClassTable: a, rightClassTable: o, nLeftClasses: s, nRightClasses: c, values: l } = e, u = Wl(a), d = Wl(o), f = s * c * 2, p = new I(Math.max(i + f, n + u.length, r + d.length, 8));
	p.uint16(t), p.uint16(n), p.uint16(r), p.uint16(i), p.seek(n), p.rawBytes(u), p.seek(r), p.rawBytes(d), p.seek(i);
	for (let e = 0; e < s; e++) {
		let t = l[e] || [];
		for (let e = 0; e < c; e++) p.int16(t[e] || 0);
	}
	return p.toArray();
}
function Wl(e) {
	let { firstGlyph: t, nGlyphs: n, offsets: r } = e, i = new I(4 + n * 2);
	i.uint16(t), i.uint16(n);
	for (let e = 0; e < n; e++) i.uint16(r[e] || 0);
	return i.toArray();
}
function Gl(e) {
	let { glyphCount: t, kernValueCount: n, leftClassCount: r, rightClassCount: i, flags: a, kernValues: o, leftClasses: s, rightClasses: c, kernIndices: l } = e, u = r * i, d = new I(6 + n * 2 + t + t + u);
	d.uint16(t), d.uint8(n), d.uint8(r), d.uint8(i), d.uint8(a ?? 0);
	for (let e = 0; e < n; e++) d.int16(o[e] || 0);
	for (let e = 0; e < t; e++) d.uint8(s[e] || 0);
	for (let e = 0; e < t; e++) d.uint8(c[e] || 0);
	for (let e = 0; e < u; e++) d.uint8(l[e] || 0);
	return d.toArray();
}
function Kl(e) {
	let { stateSize: t, classTableOffset: n, stateArrayOffset: r, entryTableOffset: i, valueTableOffset: a, classTable: o, states: s, entryTable: c, valueTable: l } = e, u = 4 + (o?.nGlyphs || 0), d = (s?.length || 0) * t, f = (c?.length || 0) * 4, p = (l?.length || 0) * 2, m = new I(Math.max(10, n + u, r + d, i + f, a + p));
	if (m.uint16(t), m.uint16(n), m.uint16(r), m.uint16(i), m.uint16(a), m.seek(n), m.uint16(o?.firstGlyph || 0), m.uint16(o?.nGlyphs || 0), o?.classArray) for (let e of o.classArray) m.uint8(e);
	if (m.seek(r), s) for (let e of s) for (let t of e) m.uint8(t);
	if (m.seek(i), c) for (let e of c) m.uint16(e.newStateOffset), m.uint16(e.flags);
	if (m.seek(a), l) for (let e of l) m.int16(e);
	return m.toArray();
}
//#endregion
//#region src/sfnt/table_ltag.js
function ql(e) {
	let t = new F(e), n = t.uint32(), r = t.uint32(), i = t.uint32(), a = [], o = [];
	for (let e = 0; e < i; e++) o.push({
		offset: t.uint16(),
		length: t.uint16()
	});
	for (let t of o) {
		let n = e.slice(t.offset, t.offset + t.length);
		a.push(new TextDecoder("utf-8").decode(new Uint8Array(n)));
	}
	return {
		version: n,
		flags: r,
		tags: a
	};
}
function Jl(e) {
	let { version: t, flags: n, tags: r } = e, i = new TextEncoder(), a = r.map((e) => i.encode(e)), o = 12 + r.length * 4, s = new I(o + a.reduce((e, t) => e + t.length, 0));
	s.uint32(t), s.uint32(n), s.uint32(r.length);
	let c = o;
	for (let e of a) s.uint16(c), s.uint16(e.length), c += e.length;
	for (let e of a) s.rawBytes(e);
	return s.toArray();
}
//#endregion
//#region src/sfnt/table_LTSH.js
function Yl(e) {
	let t = new F(e), n = t.uint16(), r = t.uint16();
	return {
		version: n,
		numGlyphs: r,
		yPels: t.bytes(r)
	};
}
function Xl(e) {
	let t = e.version ?? 0, n = e.yPels ?? [], r = e.numGlyphs ?? n.length, i = n.slice(0, r);
	for (; i.length < r;) i.push(0);
	let a = new I(4 + r);
	return a.uint16(t), a.uint16(r), a.rawBytes(i), a.toArray();
}
//#endregion
//#region src/sfnt/table_MATH.js
var Zl = 10;
function Ql(e) {
	let t = new F(e), n = t.uint32(), r = t.offset16(), i = t.offset16(), a = t.offset16(), o = [
		r,
		i,
		a
	].filter((e) => e > 0);
	return {
		version: n,
		mathConstants: eu(e, r, o),
		mathGlyphInfo: eu(e, i, o),
		mathVariants: eu(e, a, o)
	};
}
function $l(e) {
	let t = e.version ?? 65536, n = tu(e.mathConstants), r = tu(e.mathGlyphInfo), i = tu(e.mathVariants), a = Zl, o = n.length ? a : 0;
	a += n.length;
	let s = r.length ? a : 0;
	a += r.length;
	let c = i.length ? a : 0;
	a += i.length;
	let l = new I(a);
	return l.uint32(t), l.offset16(o), l.offset16(s), l.offset16(c), l.rawBytes(n), l.rawBytes(r), l.rawBytes(i), l.toArray();
}
function eu(e, t, n) {
	if (!t) return null;
	let r = n.filter((e) => e > t).sort((e, t) => e - t)[0] ?? e.length;
	return r <= t || t >= e.length ? { _raw: [] } : { _raw: Array.from(e.slice(t, r)) };
}
function tu(e) {
	return e ? Array.isArray(e) ? e : e._raw ?? [] : [];
}
//#endregion
//#region src/sfnt/table_maxp.js
var nu = 6, ru = 32;
function iu(e) {
	let t = new F(e), n = t.uint32(), r = {
		version: n,
		numGlyphs: t.uint16()
	};
	return n === 65536 && (r.maxPoints = t.uint16(), r.maxContours = t.uint16(), r.maxCompositePoints = t.uint16(), r.maxCompositeContours = t.uint16(), r.maxZones = t.uint16(), r.maxTwilightPoints = t.uint16(), r.maxStorage = t.uint16(), r.maxFunctionDefs = t.uint16(), r.maxInstructionDefs = t.uint16(), r.maxStackElements = t.uint16(), r.maxSizeOfInstructions = t.uint16(), r.maxComponentElements = t.uint16(), r.maxComponentDepth = t.uint16()), r;
}
function au(e) {
	let t = e.version === 65536, n = new I(t ? ru : nu);
	return n.uint32(e.version), n.uint16(e.numGlyphs), t && (n.uint16(e.maxPoints), n.uint16(e.maxContours), n.uint16(e.maxCompositePoints), n.uint16(e.maxCompositeContours), n.uint16(e.maxZones), n.uint16(e.maxTwilightPoints), n.uint16(e.maxStorage), n.uint16(e.maxFunctionDefs), n.uint16(e.maxInstructionDefs), n.uint16(e.maxStackElements), n.uint16(e.maxSizeOfInstructions), n.uint16(e.maxComponentElements), n.uint16(e.maxComponentDepth)), n.toArray();
}
//#endregion
//#region src/sfnt/table_MERG.js
function ou(e) {
	if (!e.length) return {
		version: 0,
		data: []
	};
	let t = new F(e);
	return {
		version: e.length >= 2 ? t.uint16() : 0,
		data: e.length >= 2 ? Array.from(e.slice(2)) : []
	};
}
function su(e) {
	let t = e.version ?? 0, n = e.data ?? [], r = new I(2 + n.length);
	return r.uint16(t), r.rawBytes(n), r.toArray();
}
//#endregion
//#region src/sfnt/table_meta.js
var cu = 16, lu = 12;
function uu(e) {
	let t = new F(e), n = t.uint32(), r = t.uint32(), i = t.uint32(), a = t.uint32(), o = [];
	for (let n = 0; n < a; n++) {
		let n = t.tag(), r = t.uint32(), i = t.uint32(), a = r, s = Math.min(e.length, a + i), c = a < cu || a >= e.length || s < a ? [] : Array.from(e.slice(a, s));
		o.push({
			tag: n,
			dataOffset: r,
			dataLength: i,
			data: c
		});
	}
	return {
		version: n,
		flags: r,
		reserved: i,
		dataMaps: o
	};
}
function du(e) {
	let t = e.version ?? 1, n = e.flags ?? 0, r = e.reserved ?? 0, i = (e.dataMaps ?? []).map((e) => ({
		tag: (e.tag ?? "    ").slice(0, 4).padEnd(4, " "),
		data: e.data ?? []
	})), a = cu + i.length * lu, o = i.map((e) => {
		let t = a, n = e.data.length;
		return a += n, {
			tag: e.tag,
			dataOffset: t,
			dataLength: n,
			data: e.data
		};
	}), s = new I(a);
	s.uint32(t), s.uint32(n), s.uint32(r), s.uint32(o.length);
	for (let e of o) s.tag(e.tag), s.uint32(e.dataOffset), s.uint32(e.dataLength);
	for (let e of o) s.rawBytes(e.data);
	return s.toArray();
}
//#endregion
//#region src/sfnt/table_MVAR.js
var fu = 12, pu = 8;
function mu(e) {
	let t = new F(e), n = t.uint16(), r = t.uint16(), i = t.uint16(), a = t.uint16(), o = t.uint16(), s = t.offset16(), c = [];
	for (let n = 0; n < o; n++) {
		let r = fu + n * a;
		if (r >= e.length) {
			c.push({
				valueTag: "    ",
				deltaSetOuterIndex: 0,
				deltaSetInnerIndex: 0,
				_extra: []
			});
			continue;
		}
		t.seek(r);
		let i = {
			valueTag: t.tag(),
			deltaSetOuterIndex: t.uint16(),
			deltaSetInnerIndex: t.uint16()
		};
		a > pu && (i._extra = t.bytes(a - pu)), c.push(i);
	}
	return {
		majorVersion: n,
		minorVersion: r,
		reserved: i,
		valueRecordSize: a,
		valueRecords: c,
		itemVariationStore: s > 0 && s < e.length ? Ci(e.slice(s)) : null
	};
}
function hu(e) {
	let t = e.majorVersion ?? 1, n = e.minorVersion ?? 0, r = e.reserved ?? 0, i = [...e.valueRecords ?? []].sort((e, t) => gu(e.valueTag, t.valueTag)), a = e.valueRecordSize ?? pu, o = i.reduce((e, t) => {
		let n = t._extra?.length ?? 0;
		return Math.max(e, pu + n);
	}, pu), s = Math.max(a, o), c = i.length, l = e.itemVariationStore ? Ei(e.itemVariationStore) : [], u = l.length > 0 || c > 0 ? fu + c * s : 0, d = new I(u > 0 ? u + l.length : fu);
	d.uint16(t), d.uint16(n), d.uint16(r), d.uint16(s), d.uint16(c), d.offset16(u);
	for (let e of i) {
		d.tag(e.valueTag ?? "    "), d.uint16(e.deltaSetOuterIndex ?? 0), d.uint16(e.deltaSetInnerIndex ?? 0);
		let t = e._extra ?? [];
		d.rawBytes(t);
		let n = s - pu - t.length;
		n > 0 && d.rawBytes(Array(n).fill(0));
	}
	return d.rawBytes(l), d.toArray();
}
function gu(e, t) {
	let n = e ?? "    ", r = t ?? "    ";
	for (let e = 0; e < 4; e++) {
		let t = n.charCodeAt(e) - r.charCodeAt(e);
		if (t !== 0) return t;
	}
	return 0;
}
//#endregion
//#region src/sfnt/table_name.js
var _u = [
	196,
	197,
	199,
	201,
	209,
	214,
	220,
	225,
	224,
	226,
	228,
	227,
	229,
	231,
	233,
	232,
	234,
	235,
	237,
	236,
	238,
	239,
	241,
	243,
	242,
	244,
	246,
	245,
	250,
	249,
	251,
	252,
	8224,
	176,
	162,
	163,
	167,
	8226,
	182,
	223,
	174,
	169,
	8482,
	180,
	168,
	8800,
	198,
	216,
	8734,
	177,
	8804,
	8805,
	165,
	181,
	8706,
	8721,
	8719,
	960,
	8747,
	170,
	186,
	937,
	230,
	248,
	191,
	161,
	172,
	8730,
	402,
	8776,
	8710,
	171,
	187,
	8230,
	160,
	192,
	195,
	213,
	338,
	339,
	8211,
	8212,
	8220,
	8221,
	8216,
	8217,
	247,
	9674,
	255,
	376,
	8260,
	8364,
	8249,
	8250,
	64257,
	64258,
	8225,
	183,
	8218,
	8222,
	8240,
	194,
	202,
	193,
	203,
	200,
	205,
	206,
	207,
	204,
	211,
	212,
	63743,
	210,
	218,
	219,
	217,
	305,
	710,
	732,
	175,
	728,
	729,
	730,
	184,
	733,
	731,
	711
], vu = /* @__PURE__ */ new Map();
for (let e = 0; e < 128; e++) vu.set(e, e);
for (let e = 0; e < _u.length; e++) vu.set(_u[e], 128 + e);
function yu(e, t, n) {
	return t === 0 || t === 3 ? xu(e) : t === 1 && n === 0 ? Cu(e) : e.length % 2 == 0 ? xu(e) : "0x:" + e.map((e) => e.toString(16).padStart(2, "0")).join("");
}
function bu(e, t, n) {
	if (e.startsWith("0x:")) {
		let t = e.slice(3), n = [];
		for (let e = 0; e < t.length; e += 2) n.push(parseInt(t.slice(e, e + 2), 16));
		return n;
	}
	return t === 0 || t === 3 ? Su(e) : t === 1 && n === 0 ? wu(e) : Su(e);
}
function xu(e) {
	let t = [];
	for (let n = 0; n + 1 < e.length; n += 2) {
		let r = e[n] << 8 | e[n + 1];
		t.push(r);
	}
	return String.fromCharCode(...t);
}
function Su(e) {
	let t = [];
	for (let n = 0; n < e.length; n++) {
		let r = e.charCodeAt(n);
		t.push(r >> 8 & 255, r & 255);
	}
	return t;
}
function Cu(e) {
	return e.map((e) => e < 128 ? String.fromCharCode(e) : String.fromCharCode(_u[e - 128])).join("");
}
function wu(e) {
	let t = [];
	for (let n = 0; n < e.length; n++) {
		let r = e.charCodeAt(n), i = vu.get(r);
		t.push(i === void 0 ? 63 : i);
	}
	return t;
}
function Tu(e) {
	let t = new F(e), n = t.uint16(), r = t.uint16(), i = t.uint16(), a = [];
	for (let e = 0; e < r; e++) a.push({
		platformID: t.uint16(),
		encodingID: t.uint16(),
		languageID: t.uint16(),
		nameID: t.uint16(),
		length: t.uint16(),
		stringOffset: t.uint16()
	});
	let o = [];
	if (n === 1) {
		let n = t.uint16();
		for (let r = 0; r < n; r++) {
			let n = t.uint16(), r = t.uint16(), a = e.slice(i + r, i + r + n);
			o.push({ tag: xu(a) });
		}
	}
	let s = {
		version: n,
		names: a.map((t) => {
			let n = e.slice(i + t.stringOffset, i + t.stringOffset + t.length);
			return {
				platformID: t.platformID,
				encodingID: t.encodingID,
				languageID: t.languageID,
				nameID: t.nameID,
				value: yu(n, t.platformID, t.encodingID)
			};
		})
	};
	return n === 1 && o.length > 0 && (s.langTagRecords = o), s;
}
function Eu(e) {
	let { version: t, names: n, langTagRecords: r = [] } = e, i = [...n].sort((e, t) => e.platformID === t.platformID ? e.encodingID === t.encodingID ? e.languageID === t.languageID ? e.nameID - t.nameID : e.languageID - t.languageID : e.encodingID - t.encodingID : e.platformID - t.platformID).map((e) => ({
		platformID: e.platformID,
		encodingID: e.encodingID,
		languageID: e.languageID,
		nameID: e.nameID,
		bytes: bu(e.value, e.platformID, e.encodingID)
	})), a = r.map((e) => Su(e.tag)), o = t === 1 ? (t === 1 ? 2 : 0) + r.length * 4 : 0, s = 6 + i.length * 12 + o, c = [], l = 0, u = /* @__PURE__ */ new Map();
	function d(e) {
		let t = e.join(",");
		if (u.has(t)) return u.get(t);
		let n = l;
		return u.set(t, n), c.push(e), l += e.length, n;
	}
	let f = i.map((e) => ({
		...e,
		stringOffset: d(e.bytes),
		stringLength: e.bytes.length
	})), p = a.map((e) => ({
		stringOffset: d(e),
		stringLength: e.length
	})), m = new I(s + l);
	m.uint16(t), m.uint16(i.length), m.uint16(s);
	for (let e of f) m.uint16(e.platformID).uint16(e.encodingID).uint16(e.languageID).uint16(e.nameID).uint16(e.stringLength).uint16(e.stringOffset);
	if (t === 1) {
		m.uint16(p.length);
		for (let e of p) m.uint16(e.stringLength).uint16(e.stringOffset);
	}
	for (let e of c) m.rawBytes(e);
	return m.toArray();
}
//#endregion
//#region src/sfnt/table_OS-2.js
var Du = 78, Ou = 86, ku = 96, Au = 100;
function ju(e) {
	let t = new F(e), n = e.length, r = {};
	return r.version = t.uint16(), r.xAvgCharWidth = t.fword(), r.usWeightClass = t.uint16(), r.usWidthClass = t.uint16(), r.fsType = t.uint16(), r.ySubscriptXSize = t.fword(), r.ySubscriptYSize = t.fword(), r.ySubscriptXOffset = t.fword(), r.ySubscriptYOffset = t.fword(), r.ySuperscriptXSize = t.fword(), r.ySuperscriptYSize = t.fword(), r.ySuperscriptXOffset = t.fword(), r.ySuperscriptYOffset = t.fword(), r.yStrikeoutSize = t.fword(), r.yStrikeoutPosition = t.fword(), r.sFamilyClass = t.int16(), r.panose = t.bytes(10), r.ulUnicodeRange1 = t.uint32(), r.ulUnicodeRange2 = t.uint32(), r.ulUnicodeRange3 = t.uint32(), r.ulUnicodeRange4 = t.uint32(), r.achVendID = t.tag(), r.fsSelection = t.uint16(), r.usFirstCharIndex = t.uint16(), r.usLastCharIndex = t.uint16(), n < Du || (r.sTypoAscender = t.fword(), r.sTypoDescender = t.fword(), r.sTypoLineGap = t.fword(), r.usWinAscent = t.ufword(), r.usWinDescent = t.ufword(), r.version < 1 || n < Ou) || (r.ulCodePageRange1 = t.uint32(), r.ulCodePageRange2 = t.uint32(), r.version < 2 || n < ku) || (r.sxHeight = t.fword(), r.sCapHeight = t.fword(), r.usDefaultChar = t.uint16(), r.usBreakChar = t.uint16(), r.usMaxContext = t.uint16(), r.version < 5 || n < Au) ? r : (r.usLowerOpticalPointSize = t.uint16(), r.usUpperOpticalPointSize = t.uint16(), r);
}
function Mu(e) {
	let t = e.version, n;
	n = t >= 5 ? Au : t >= 2 ? ku : t >= 1 ? Ou : e.sTypoAscender === void 0 ? 68 : Du;
	let r = new I(n);
	return r.uint16(t).fword(e.xAvgCharWidth).uint16(e.usWeightClass).uint16(e.usWidthClass).uint16(e.fsType).fword(e.ySubscriptXSize).fword(e.ySubscriptYSize).fword(e.ySubscriptXOffset).fword(e.ySubscriptYOffset).fword(e.ySuperscriptXSize).fword(e.ySuperscriptYSize).fword(e.ySuperscriptXOffset).fword(e.ySuperscriptYOffset).fword(e.yStrikeoutSize).fword(e.yStrikeoutPosition).int16(e.sFamilyClass).rawBytes(e.panose).uint32(e.ulUnicodeRange1).uint32(e.ulUnicodeRange2).uint32(e.ulUnicodeRange3).uint32(e.ulUnicodeRange4).tag(e.achVendID).uint16(e.fsSelection).uint16(e.usFirstCharIndex).uint16(e.usLastCharIndex), n <= 68 || (r.fword(e.sTypoAscender).fword(e.sTypoDescender).fword(e.sTypoLineGap).ufword(e.usWinAscent).ufword(e.usWinDescent), t < 1) || (r.uint32(e.ulCodePageRange1).uint32(e.ulCodePageRange2), t < 2) || (r.fword(e.sxHeight).fword(e.sCapHeight).uint16(e.usDefaultChar).uint16(e.usBreakChar).uint16(e.usMaxContext), t < 5) || r.uint16(e.usLowerOpticalPointSize).uint16(e.usUpperOpticalPointSize), r.toArray();
}
//#endregion
//#region src/sfnt/table_PCLT.js
var Nu = 54;
function Pu(e) {
	let t = new F(e);
	return {
		version: t.uint32(),
		fontNumber: t.uint32(),
		pitch: t.uint16(),
		xHeight: t.uint16(),
		style: t.uint16(),
		typeFamily: t.uint16(),
		capHeight: t.uint16(),
		symbolSet: t.uint16(),
		typeface: Iu(t.bytes(16)),
		characterComplement: Iu(t.bytes(8)),
		fileName: Iu(t.bytes(6)),
		strokeWeight: t.int8(),
		widthType: t.int8(),
		serifStyle: t.uint8(),
		reserved: t.uint8()
	};
}
function Fu(e) {
	let t = new I(Nu);
	return t.uint32(e.version ?? 65536), t.uint32(e.fontNumber ?? 0), t.uint16(e.pitch ?? 0), t.uint16(e.xHeight ?? 0), t.uint16(e.style ?? 0), t.uint16(e.typeFamily ?? 0), t.uint16(e.capHeight ?? 0), t.uint16(e.symbolSet ?? 0), t.rawBytes(Lu(e.typeface ?? "", 16)), t.rawBytes(Lu(e.characterComplement ?? "", 8)), t.rawBytes(Lu(e.fileName ?? "", 6)), t.int8(e.strokeWeight ?? 0), t.int8(e.widthType ?? 0), t.uint8(e.serifStyle ?? 0), t.uint8(e.reserved ?? 0), t.toArray();
}
function Iu(e) {
	return String.fromCharCode(...e).replace(/\0+$/g, "");
}
function Lu(e, t) {
	let n = Array(t).fill(0);
	for (let r = 0; r < t && r < e.length; r++) {
		let t = e.charCodeAt(r);
		n[r] = t >= 0 && t <= 127 ? t : 63;
	}
	return n;
}
//#endregion
//#region src/sfnt/table_post.js
var Ru = 32, zu = /* @__PURE__ */ ".notdef,.null,nonmarkingreturn,space,exclam,quotedbl,numbersign,dollar,percent,ampersand,quotesingle,parenleft,parenright,asterisk,plus,comma,hyphen,period,slash,zero,one,two,three,four,five,six,seven,eight,nine,colon,semicolon,less,equal,greater,question,at,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,bracketleft,backslash,bracketright,asciicircum,underscore,grave,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,braceleft,bar,braceright,asciitilde,Adieresis,Aring,Ccedilla,Eacute,Ntilde,Odieresis,Udieresis,aacute,agrave,acircumflex,adieresis,atilde,aring,ccedilla,eacute,egrave,ecircumflex,edieresis,iacute,igrave,icircumflex,idieresis,ntilde,oacute,ograve,ocircumflex,odieresis,otilde,uacute,ugrave,ucircumflex,udieresis,dagger,degree,cent,sterling,section,bullet,paragraph,germandbls,registered,copyright,trademark,acute,dieresis,notequal,AE,Oslash,infinity,plusminus,lessequal,greaterequal,yen,mu,partialdiff,summation,product,pi,integral,ordfeminine,ordmasculine,Omega,ae,oslash,questiondown,exclamdown,logicalnot,radical,florin,approxequal,Delta,guillemotleft,guillemotright,ellipsis,nonbreakingspace,Agrave,Atilde,Otilde,OE,oe,endash,emdash,quotedblleft,quotedblright,quoteleft,quoteright,divide,lozenge,ydieresis,Ydieresis,fraction,currency,guilsinglleft,guilsinglright,fi,fl,daggerdbl,periodcentered,quotesinglbase,quotedblbase,perthousand,Acircumflex,Ecircumflex,Aacute,Edieresis,Egrave,Iacute,Icircumflex,Idieresis,Igrave,Oacute,Ocircumflex,apple,Ograve,Uacute,Ucircumflex,Ugrave,dotlessi,circumflex,tilde,macron,breve,dotaccent,ring,cedilla,hungarumlaut,ogonek,caron,Lslash,lslash,Scaron,scaron,Zcaron,zcaron,brokenbar,Eth,eth,Yacute,yacute,Thorn,thorn,minus,multiply,onesuperior,twosuperior,threesuperior,onehalf,onequarter,threequarters,franc,Gbreve,gbreve,Idotaccent,Scedilla,scedilla,Cacute,cacute,Ccaron,ccaron,dcroat".split(","), Bu = new Map(zu.map((e, t) => [e, t]));
function Vu(e) {
	let t = new F(e), n = t.uint32(), r = {
		version: n,
		italicAngle: t.fixed(),
		underlinePosition: t.fword(),
		underlineThickness: t.fword(),
		isFixedPitch: t.uint32(),
		minMemType42: t.uint32(),
		maxMemType42: t.uint32(),
		minMemType1: t.uint32(),
		maxMemType1: t.uint32()
	};
	if (n === 65536 || n === 196608) return r;
	if (n === 131072) {
		let e = t.uint16(), n = t.array("uint16", e), i = -1;
		for (let e of n) e > i && (i = e);
		let a = i >= 258 ? i - 258 + 1 : 0, o = [];
		for (let e = 0; e < a; e++) {
			let e = t.uint8(), n = t.bytes(e);
			o.push(String.fromCharCode(...n));
		}
		return r.glyphNames = n.map((e) => e < 258 ? zu[e] : o[e - 258]), r;
	}
	if (n === 151552) {
		let e = t.uint16();
		return r.glyphNames = t.array("int8", e).map((e, t) => zu[t + e]), r;
	}
	return r;
}
function Hu(e) {
	let { version: t } = e;
	return t === 65536 || t === 196608 ? Uu(e) : t === 131072 ? Wu(e) : t === 151552 ? Gu(e) : Uu(e);
}
function Uu(e) {
	let t = new I(Ru);
	return t.uint32(e.version).fixed(e.italicAngle).fword(e.underlinePosition).fword(e.underlineThickness).uint32(e.isFixedPitch).uint32(e.minMemType42).uint32(e.maxMemType42).uint32(e.minMemType1).uint32(e.maxMemType1), t.toArray();
}
function Wu(e) {
	let { glyphNames: t } = e, n = t.length, r = [], i = [], a = /* @__PURE__ */ new Map();
	for (let e of t) {
		let t = Bu.get(e);
		t === void 0 ? (a.has(e) || (a.set(e, i.length), i.push(e)), r.push(258 + a.get(e))) : r.push(t);
	}
	let o = 0;
	for (let e of i) o += 1 + e.length;
	let s = new I(34 + n * 2 + o);
	s.uint32(e.version).fixed(e.italicAngle).fword(e.underlinePosition).fword(e.underlineThickness).uint32(e.isFixedPitch).uint32(e.minMemType42).uint32(e.maxMemType42).uint32(e.minMemType1).uint32(e.maxMemType1), s.uint16(n);
	for (let e of r) s.uint16(e);
	for (let e of i) {
		s.uint8(e.length);
		for (let t = 0; t < e.length; t++) s.uint8(e.charCodeAt(t));
	}
	return s.toArray();
}
function Gu(e) {
	let { glyphNames: t } = e, n = t.length, r = new I(34 + n);
	r.uint32(e.version).fixed(e.italicAngle).fword(e.underlinePosition).fword(e.underlineThickness).uint32(e.isFixedPitch).uint32(e.minMemType42).uint32(e.maxMemType42).uint32(e.minMemType1).uint32(e.maxMemType1), r.uint16(n);
	for (let e = 0; e < n; e++) {
		let n = t[e], i = Bu.get(n) - e;
		r.int8(i);
	}
	return r.toArray();
}
//#endregion
//#region src/sfnt/table_sbix.js
function Ku(e, t) {
	let n = new F(e), r = n.uint16(), i = n.uint16(), a = n.uint32(), o = n.array("uint32", a), s = t?.maxp?.numGlyphs, c = [];
	for (let t = 0; t < a; t++) {
		let r = o[t], i = o[t + 1] ?? e.length;
		if (r >= e.length || i <= r) {
			c.push({
				ppem: 0,
				ppi: 0,
				glyphs: []
			});
			continue;
		}
		n.seek(r);
		let a = n.uint16(), l = n.uint16();
		s ?? (s = (n.uint32() - 4) / 4 - 1, n.seek(r + 4));
		let u = n.array("uint32", s + 1), d = [];
		for (let t = 0; t < s; t++) {
			let i = r + u[t], a = r + u[t + 1], o = a - i;
			if (o <= 0) {
				d.push(null);
				continue;
			}
			n.seek(i);
			let s = n.int16(), c = n.int16(), l = n.tag(), f = o > 8 ? e.slice(i + 8, a) : [];
			d.push({
				originOffsetX: s,
				originOffsetY: c,
				graphicType: l,
				imageData: f
			});
		}
		c.push({
			ppem: a,
			ppi: l,
			glyphs: d
		});
	}
	return {
		version: r,
		flags: i,
		strikes: c
	};
}
function qu(e) {
	let t = e.version ?? 1, n = e.flags ?? 0, r = e.strikes ?? [], i = r.map((e) => e._raw ? e._raw : Ju(e)), a = 8 + r.length * 4, o = [];
	for (let e of i) o.push(a), a += e.length;
	let s = new I(a);
	s.uint16(t), s.uint16(n), s.uint32(r.length);
	for (let e of o) s.uint32(e);
	for (let e of i) s.rawBytes(e);
	return s.toArray();
}
function Ju(e) {
	let t = e.glyphs ?? [], n = t.length, r = t.map((e) => {
		if (!e) return [];
		let t = e.imageData ?? [], n = new I(8 + t.length);
		return n.int16(e.originOffsetX ?? 0), n.int16(e.originOffsetY ?? 0), n.tag(e.graphicType ?? "png "), n.rawBytes(t), n.toArray();
	}), i = 4 + (n + 1) * 4, a = [];
	for (let e of r) a.push(i), i += e.length;
	a.push(i);
	let o = new I(i);
	o.uint16(e.ppem ?? 0), o.uint16(e.ppi ?? 0);
	for (let e of a) o.uint32(e);
	for (let e of r) o.rawBytes(e);
	return o.toArray();
}
//#endregion
//#region src/sfnt/table_STAT.js
var Yu = 18, Xu = 20, Zu = 8;
function Qu(e) {
	let t = new F(e), n = t.uint16(), r = t.uint16(), i = t.uint16(), a = t.uint16(), o = t.offset32(), s = t.uint16(), c = t.offset32(), l;
	r >= 1 && e.length >= Xu && (l = t.uint16());
	let u = [];
	if (a > 0 && o > 0) for (let e = 0; e < a; e++) {
		t.seek(o + e * i);
		let n = {
			axisTag: t.tag(),
			axisNameID: t.uint16(),
			axisOrdering: t.uint16()
		};
		i > Zu && (n._extra = t.bytes(i - Zu)), u.push(n);
	}
	let d = [];
	if (s > 0 && c > 0) {
		t.seek(c);
		for (let e = 0; e < s; e++) d.push(t.offset16());
	}
	let f = [];
	for (let t = 0; t < d.length; t++) {
		let n = c + d[t], r = e.length;
		for (let e = 0; e < d.length; e++) {
			let t = c + d[e];
			t > n && t < r && (r = t);
		}
		if (n >= e.length) {
			f.push({
				format: 0,
				_raw: []
			});
			continue;
		}
		f.push($u(e, n, r));
	}
	let p = {
		majorVersion: n,
		minorVersion: r,
		designAxisSize: i,
		designAxes: u,
		axisValues: f
	};
	return l !== void 0 && (p.elidedFallbackNameID = l), p;
}
function $u(e, t, n) {
	let r = new F(e);
	r.seek(t);
	let i = r.uint16();
	switch (i) {
		case 1: return {
			format: i,
			axisIndex: r.uint16(),
			flags: r.uint16(),
			valueNameID: r.uint16(),
			value: r.fixed()
		};
		case 2: return {
			format: i,
			axisIndex: r.uint16(),
			flags: r.uint16(),
			valueNameID: r.uint16(),
			nominalValue: r.fixed(),
			rangeMinValue: r.fixed(),
			rangeMaxValue: r.fixed()
		};
		case 3: return {
			format: i,
			axisIndex: r.uint16(),
			flags: r.uint16(),
			valueNameID: r.uint16(),
			value: r.fixed(),
			linkedValue: r.fixed()
		};
		case 4: {
			let e = r.uint16(), t = r.uint16(), n = r.uint16(), a = [];
			for (let t = 0; t < e; t++) a.push({
				axisIndex: r.uint16(),
				value: r.fixed()
			});
			return {
				format: i,
				axisCount: e,
				flags: t,
				valueNameID: n,
				axisValues: a
			};
		}
		default: return {
			format: i,
			_raw: Array.from(e.slice(t, n))
		};
	}
}
function ed(e) {
	let t = e.majorVersion ?? 1, n = e.minorVersion ?? 2, r = e.designAxes ?? [], i = e.axisValues ?? [], a = e.designAxisSize ?? Zu, o = r.reduce((e, t) => {
		let n = t._extra?.length ?? 0;
		return Math.max(e, Zu + n);
	}, Zu), s = Math.max(a, o), c = n >= 1 || e.elidedFallbackNameID !== void 0;
	c && n === 0 && (n = 1);
	let l = c ? Xu : Yu, u = r.length, d = i.length, f = u > 0 ? l : 0, p = u * s, m = d > 0 ? l + p : 0, h = d * 2, g = i.map((e) => td(e)), _ = h, v = g.map((e) => {
		let t = _;
		return _ += e.length, t;
	}), y = g.reduce((e, t) => e + t.length, 0), b = new I(l + p + h + y);
	b.uint16(t), b.uint16(n), b.uint16(s), b.uint16(u), b.offset32(f), b.uint16(d), b.offset32(m), c && b.uint16(e.elidedFallbackNameID ?? 2);
	for (let e of r) {
		b.tag(e.axisTag), b.uint16(e.axisNameID ?? 0), b.uint16(e.axisOrdering ?? 0);
		let t = e._extra ?? [];
		b.rawBytes(t);
		let n = s - Zu - t.length;
		n > 0 && b.rawBytes(Array(n).fill(0));
	}
	for (let e of v) b.offset16(e);
	for (let e of g) b.rawBytes(e);
	return b.toArray();
}
function td(e) {
	if (e._raw) return e._raw;
	switch (e.format) {
		case 1: {
			let t = new I(12);
			return t.uint16(1), t.uint16(e.axisIndex ?? 0), t.uint16(e.flags ?? 0), t.uint16(e.valueNameID ?? 0), t.fixed(e.value ?? 0), t.toArray();
		}
		case 2: {
			let t = new I(20);
			return t.uint16(2), t.uint16(e.axisIndex ?? 0), t.uint16(e.flags ?? 0), t.uint16(e.valueNameID ?? 0), t.fixed(e.nominalValue ?? 0), t.fixed(e.rangeMinValue ?? 0), t.fixed(e.rangeMaxValue ?? 0), t.toArray();
		}
		case 3: {
			let t = new I(16);
			return t.uint16(3), t.uint16(e.axisIndex ?? 0), t.uint16(e.flags ?? 0), t.uint16(e.valueNameID ?? 0), t.fixed(e.value ?? 0), t.fixed(e.linkedValue ?? 0), t.toArray();
		}
		case 4: {
			let t = e.axisValues ?? [], n = e.axisCount ?? t.length, r = new I(8 + n * 6);
			r.uint16(4), r.uint16(n), r.uint16(e.flags ?? 0), r.uint16(e.valueNameID ?? 0);
			for (let e = 0; e < n; e++) {
				let n = t[e] ?? {
					axisIndex: 0,
					value: 0
				};
				r.uint16(n.axisIndex ?? 0), r.fixed(n.value ?? 0);
			}
			return r.toArray();
		}
		default: throw Error(`Unsupported STAT axis value format: ${e.format}`);
	}
}
//#endregion
//#region src/sfnt/table_SVG.js
function nd(e) {
	let t = new F(e), n = t.uint16(), r = t.uint32();
	t.uint32(), t.seek(r);
	let i = t.uint16(), a = [];
	for (let e = 0; e < i; e++) a.push({
		startGlyphID: t.uint16(),
		endGlyphID: t.uint16(),
		svgDocOffset: t.uint32(),
		svgDocLength: t.uint32()
	});
	let o = new TextDecoder("utf-8"), s = /* @__PURE__ */ new Map(), c = [];
	for (let t of a) {
		let n = `${t.svgDocOffset}:${t.svgDocLength}`;
		if (!s.has(n)) {
			let i = r + t.svgDocOffset, a = e.slice(i, i + t.svgDocLength), l = a.length >= 3 && a[0] === 31 && a[1] === 139 && a[2] === 8, u = c.length;
			if (l) c.push({
				compressed: !0,
				data: a
			});
			else {
				let e = o.decode(new Uint8Array(a));
				c.push({
					compressed: !1,
					text: e
				});
			}
			s.set(n, u);
		}
	}
	let l = [];
	for (let e of a) {
		let t = `${e.svgDocOffset}:${e.svgDocLength}`;
		l.push({
			startGlyphID: e.startGlyphID,
			endGlyphID: e.endGlyphID,
			documentIndex: s.get(t)
		});
	}
	return {
		version: n,
		documents: c,
		entries: l
	};
}
function rd(e) {
	let { version: t, documents: n, entries: r } = e, i = new TextEncoder(), a = n.map((e) => e.compressed ? e.data instanceof Uint8Array ? Array.from(e.data) : e.data : Array.from(i.encode(e.text))), o = r.length, s = 2 + o * 12, c = [];
	for (let e = 0; e < a.length; e++) {
		let t = a[e];
		c.push({
			offset: s,
			length: t.length
		}), s += t.length;
	}
	let l = new I(10 + s);
	l.uint16(t), l.uint32(10), l.uint32(0), l.uint16(o);
	for (let e of r) {
		let t = c[e.documentIndex];
		l.uint16(e.startGlyphID), l.uint16(e.endGlyphID), l.uint32(t.offset), l.uint32(t.length);
	}
	for (let e of a) for (let t of e) l.uint8(t);
	return l.toArray();
}
//#endregion
//#region src/sfnt/table_VDMX.js
var id = 6, ad = 4, od = 2, sd = 6;
function cd(e) {
	let t = new F(e), n = t.uint16(), r = t.uint16(), i = t.uint16(), a = [];
	for (let e = 0; e < i; e++) a.push({
		bCharSet: t.uint8(),
		xRatio: t.uint8(),
		yStartRatio: t.uint8(),
		yEndRatio: t.uint8()
	});
	let o = [];
	for (let e = 0; e < i; e++) o.push(t.offset16());
	let s = [...new Set(o)].sort((e, t) => e - t), c = s.map((t) => ud(e, t)), l = new Map(s.map((e, t) => [e, t]));
	return {
		version: n,
		numRecs: r,
		numRatios: i,
		ratios: a.map((e, t) => ({
			...e,
			groupIndex: l.get(o[t]) ?? 0
		})),
		groups: c
	};
}
function ld(e) {
	let t = e.version ?? 0, n = e.ratios ?? [], r = e.groups ?? [], i = r.map((e) => dd(e)), a = e.numRecs ?? Math.max(0, ...r.map((e) => (e.entries ?? []).length)), o = n.length, s = id + o * ad + o * od, c = i.map((e) => {
		let t = s;
		return s += e.length, t;
	}), l = new I(s);
	l.uint16(t), l.uint16(a), l.uint16(o);
	for (let e of n) l.uint8(e.bCharSet ?? 0), l.uint8(e.xRatio ?? 0), l.uint8(e.yStartRatio ?? 0), l.uint8(e.yEndRatio ?? 0);
	for (let e of n) {
		let t = c[e.groupIndex ?? 0] ?? 0;
		l.offset16(t);
	}
	for (let e of i) l.rawBytes(e);
	return l.toArray();
}
function ud(e, t) {
	if (!t || t >= e.length) return {
		recs: 0,
		startsz: 0,
		endsz: 0,
		entries: []
	};
	let n = new F(e, t), r = n.uint16(), i = n.uint8(), a = n.uint8(), o = [];
	for (let t = 0; t < r && !(n.position + sd > e.length); t++) o.push({
		yPelHeight: n.uint16(),
		yMax: n.int16(),
		yMin: n.int16()
	});
	return {
		recs: r,
		startsz: i,
		endsz: a,
		entries: o
	};
}
function dd(e) {
	let t = e.entries ?? [], n = e.recs ?? t.length, r = t.slice(0, n);
	for (; r.length < n;) r.push({
		yPelHeight: 0,
		yMax: 0,
		yMin: 0
	});
	let i = new I(4 + n * sd);
	i.uint16(n), i.uint8(e.startsz ?? 0), i.uint8(e.endsz ?? 0);
	for (let e of r) i.uint16(e.yPelHeight ?? 0), i.int16(e.yMax ?? 0), i.int16(e.yMin ?? 0);
	return i.toArray();
}
//#endregion
//#region src/sfnt/table_vhea.js
var fd = 36;
function pd(e) {
	let t = new F(e);
	return {
		version: t.uint32(),
		vertTypoAscender: t.fword(),
		vertTypoDescender: t.fword(),
		vertTypoLineGap: t.fword(),
		advanceHeightMax: t.ufword(),
		minTopSideBearing: t.fword(),
		minBottomSideBearing: t.fword(),
		yMaxExtent: t.fword(),
		caretSlopeRise: t.int16(),
		caretSlopeRun: t.int16(),
		caretOffset: t.int16(),
		reserved1: t.int16(),
		reserved2: t.int16(),
		reserved3: t.int16(),
		reserved4: t.int16(),
		metricDataFormat: t.int16(),
		numOfLongVerMetrics: t.uint16()
	};
}
function md(e) {
	let t = new I(fd);
	return t.uint32(e.version), t.fword(e.vertTypoAscender), t.fword(e.vertTypoDescender), t.fword(e.vertTypoLineGap), t.ufword(e.advanceHeightMax), t.fword(e.minTopSideBearing), t.fword(e.minBottomSideBearing), t.fword(e.yMaxExtent), t.int16(e.caretSlopeRise), t.int16(e.caretSlopeRun), t.int16(e.caretOffset), t.int16(e.reserved1), t.int16(e.reserved2), t.int16(e.reserved3), t.int16(e.reserved4), t.int16(e.metricDataFormat), t.uint16(e.numOfLongVerMetrics), t.toArray();
}
//#endregion
//#region src/sfnt/table_vmtx.js
function hd(e, t) {
	let n = t.vhea.numOfLongVerMetrics, r = t.maxp.numGlyphs, i = new F(e), a = [];
	for (let e = 0; e < n; e++) a.push({
		advanceHeight: i.ufword(),
		topSideBearing: i.fword()
	});
	let o = r - n;
	return {
		vMetrics: a,
		topSideBearings: i.array("fword", o)
	};
}
function gd(e) {
	let { vMetrics: t, topSideBearings: n } = e, r = new I(t.length * 4 + n.length * 2);
	for (let e of t) r.ufword(e.advanceHeight), r.fword(e.topSideBearing);
	return r.array("fword", n), r.toArray();
}
//#endregion
//#region src/sfnt/table_VVAR.js
var _d = 24, vd = 15, yd = 48;
function bd(e) {
	let t = new F(e), n = t.uint16(), r = t.uint16(), i = t.offset32(), a = t.offset32(), o = t.offset32(), s = t.offset32(), c = t.offset32(), l = [
		i,
		a,
		o,
		s,
		c
	];
	return {
		majorVersion: n,
		minorVersion: r,
		itemVariationStore: i ? Ci(e.slice(i, Sd(e.length, i, l))) : null,
		advanceHeightMapping: xd(e, a, l),
		tsbMapping: xd(e, o, l),
		bsbMapping: xd(e, s, l),
		vOrgMapping: xd(e, c, l)
	};
}
function xd(e, t, n) {
	if (!t) return null;
	let r = Sd(e.length, t, n);
	if (r <= t || t >= e.length) return {
		format: 0,
		entryFormat: 0,
		mapCount: 0,
		entries: [],
		_raw: []
	};
	let i = Array.from(e.slice(t, r));
	return {
		...Cd(i),
		_raw: i
	};
}
function Sd(e, t, n) {
	return n.filter((e) => e > t).sort((e, t) => e - t)[0] ?? e;
}
function Cd(e) {
	let t = new F(e), n = t.uint8(), r = t.uint8(), i = n === 1 ? t.uint32() : t.uint16(), a = (r & vd) + 1, o = ((r & yd) >> 4) + 1, s = [];
	for (let e = 0; e < i; e++) {
		let e = jd(t, o);
		s.push(Od(e, a));
	}
	return {
		format: n,
		entryFormat: r,
		mapCount: i,
		entries: s
	};
}
function wd(e) {
	let t = e.majorVersion ?? 1, n = e.minorVersion ?? 0, r = e.itemVariationStore ? Ei(e.itemVariationStore) : [], i = Td(e.advanceHeightMapping), a = Td(e.tsbMapping), o = Td(e.bsbMapping), s = Td(e.vOrgMapping), c = _d, l = r.length ? c : 0;
	c += r.length;
	let u = i.length ? c : 0;
	c += i.length;
	let d = a.length ? c : 0;
	c += a.length;
	let f = o.length ? c : 0;
	c += o.length;
	let p = s.length ? c : 0;
	c += s.length;
	let m = new I(c);
	return m.uint16(t), m.uint16(n), m.offset32(l), m.offset32(u), m.offset32(d), m.offset32(f), m.offset32(p), m.rawBytes(r), m.rawBytes(i), m.rawBytes(a), m.rawBytes(o), m.rawBytes(s), m.toArray();
}
function Td(e) {
	return e ? e._raw ? e._raw : Ed(e) : [];
}
function Ed(e) {
	let t = e.entries ?? [], n = e.mapCount ?? t.length, r = kd(t), i = e.format ?? +(n > 65535), a = e.entryFormat ?? r.entryFormat, o = (a & vd) + 1, s = ((a & yd) >> 4) + 1, c = new I((i === 1 ? 6 : 4) + n * s);
	c.uint8(i), c.uint8(a), i === 1 ? c.uint32(n) : c.uint16(n);
	for (let e = 0; e < n; e++) Md(c, Dd(t[e] ?? {
		outerIndex: 0,
		innerIndex: 0
	}, o), s);
	return c.toArray();
}
function Dd(e, t) {
	let n = (1 << t) - 1;
	return (e.outerIndex ?? 0) << t | (e.innerIndex ?? 0) & n;
}
function Od(e, t) {
	let n = (1 << t) - 1;
	return {
		outerIndex: e >> t,
		innerIndex: e & n
	};
}
function kd(e) {
	let t = 0, n = 0;
	for (let r of e) t = Math.max(t, r.innerIndex ?? 0), n = Math.max(n, r.outerIndex ?? 0);
	let r = 1;
	for (; (1 << r) - 1 < t && r < 16;) r++;
	let i = n << r | t, a = 1;
	for (; a < 4 && i > Ad(a);) a++;
	return { entryFormat: a - 1 << 4 | r - 1 };
}
function Ad(e) {
	return e === 1 ? 255 : e === 2 ? 65535 : e === 3 ? 16777215 : 4294967295;
}
function jd(e, t) {
	return t === 1 ? e.uint8() : t === 2 ? e.uint16() : t === 3 ? e.uint24() : e.uint32();
}
function Md(e, t, n) {
	n === 1 ? e.uint8(t) : n === 2 ? e.uint16(t) : n === 3 ? e.uint24(t) : e.uint32(t >>> 0);
}
//#endregion
//#region src/sfnt/tuple_variation_common.js
var Nd = 32768, Pd = 4095, Fd = 32768, Id = 16384, Ld = 8192, Rd = 4095, zd = 128, Bd = 127, Vd = 128, Hd = 64, Ud = 63;
function Wd(e) {
	let t = e.uint8(), n;
	if (t === 0) return null;
	if (!(t & 128)) n = t;
	else {
		let r = e.uint8();
		n = (t & 127) << 8 | r;
	}
	let r = [], i = 0;
	for (; r.length < n;) {
		let t = e.uint8(), a = (t & Bd) + 1, o = (t & zd) !== 0;
		for (let t = 0; t < a && r.length < n; t++) {
			let t = o ? e.uint16() : e.uint8();
			i += t, r.push(i);
		}
	}
	return r;
}
function Gd(e) {
	if (e === null) return [0];
	let t = e.length, n = [];
	t < 128 ? n.push(t) : (n.push(128 | t >> 8), n.push(t & 255));
	let r = [], i = 0;
	for (let t of e) r.push(t - i), i = t;
	let a = 0;
	for (; a < r.length;) {
		let e = r[a] > 255, t = 1, i = Math.min(128, r.length - a);
		for (; t < i && r[a + t] > 255 === e;) t++;
		let o = (e ? zd : 0) | t - 1;
		n.push(o);
		for (let i = 0; i < t; i++) {
			let t = r[a + i];
			e ? n.push(t >> 8 & 255, t & 255) : n.push(t & 255);
		}
		a += t;
	}
	return n;
}
function Kd(e, t) {
	let n = [];
	for (; n.length < t;) {
		let r = e.uint8(), i = (r & Ud) + 1;
		if (r & Vd) for (let e = 0; e < i && n.length < t; e++) n.push(0);
		else if (r & Hd) for (let r = 0; r < i && n.length < t; r++) n.push(e.int16());
		else for (let r = 0; r < i && n.length < t; r++) n.push(e.int8());
	}
	return n;
}
function qd(e) {
	let t = [], n = 0;
	for (; n < e.length;) if (e[n] === 0) {
		let r = 1, i = Math.min(64, e.length - n);
		for (; r < i && e[n + r] === 0;) r++;
		t.push(Vd | r - 1), n += r;
	} else if (e[n] < -128 || e[n] > 127) {
		let r = 1, i = Math.min(64, e.length - n);
		for (; r < i;) {
			let t = e[n + r];
			if (t === 0 || t >= -128 && t <= 127) break;
			r++;
		}
		t.push(Hd | r - 1);
		for (let i = 0; i < r; i++) {
			let r = e[n + i] & 65535;
			t.push(r >> 8 & 255, r & 255);
		}
		n += r;
	} else {
		let r = 1, i = Math.min(64, e.length - n);
		for (; r < i;) {
			let t = e[n + r];
			if (t === 0 || t < -128 || t > 127) break;
			r++;
		}
		t.push(r - 1);
		for (let i = 0; i < r; i++) t.push(e[n + i] & 255);
		n += r;
	}
	return t;
}
function Jd(e, t, n, r) {
	if (!e || e.length === 0) return [];
	let i = new F(e), a = i.uint16(), o = i.offset16(), s = a & Pd, c = (a & Nd) !== 0;
	if (s === 0) return [];
	let l = [];
	for (let e = 0; e < s; e++) {
		let e = i.uint16(), r = i.uint16(), a;
		a = r & Fd ? i.array("f2dot14", t) : n[r & Rd] ?? Array(t).fill(0);
		let o = null, s = null;
		r & Id && (o = i.array("f2dot14", t), s = i.array("f2dot14", t)), l.push({
			variationDataSize: e,
			tupleIndex: r,
			peakTuple: a,
			intermediateStartTuple: o,
			intermediateEndTuple: s,
			hasPrivatePoints: (r & Ld) !== 0
		});
	}
	i.seek(o);
	let u = null;
	c && (u = Wd(i));
	let d = [];
	for (let e of l) {
		let t = i.position + e.variationDataSize, n;
		n = e.hasPrivatePoints ? Wd(i) : u;
		let a = n === null ? r : n.length, o = Kd(i, a), s = Kd(i, a);
		d.push({
			peakTuple: e.peakTuple,
			intermediateStartTuple: e.intermediateStartTuple,
			intermediateEndTuple: e.intermediateEndTuple,
			pointIndices: n,
			xDeltas: o,
			yDeltas: s
		}), i.seek(t);
	}
	return d;
}
function Yd(e, t) {
	if (!e || e.length === 0) return [];
	let n = e.length, r = e.every((t) => JSON.stringify(t.pointIndices) === JSON.stringify(e[0].pointIndices)) && n > 1, i = [], a = [];
	r && (a = Gd(e[0].pointIndices), i.push(a));
	let o = [];
	for (let t of e) {
		let e = [];
		r || e.push(...Gd(t.pointIndices)), e.push(...qd(t.xDeltas ?? [])), e.push(...qd(t.yDeltas ?? [])), o.push(e.length), i.push(e);
	}
	let s = [];
	for (let e of i) s.push(...e);
	let c = [];
	for (let i = 0; i < n; i++) {
		let n = e[i], a = Fd;
		r || (a |= Ld), n.intermediateStartTuple && (a |= Id);
		let s = [];
		s.push(o[i] >> 8 & 255), s.push(o[i] & 255), s.push(a >> 8 & 255), s.push(a & 255);
		for (let e = 0; e < t; e++) {
			let t = Math.round((n.peakTuple[e] ?? 0) * 16384) & 65535;
			s.push(t >> 8 & 255, t & 255);
		}
		if (n.intermediateStartTuple) {
			for (let e = 0; e < t; e++) {
				let t = Math.round((n.intermediateStartTuple[e] ?? 0) * 16384) & 65535;
				s.push(t >> 8 & 255, t & 255);
			}
			for (let e = 0; e < t; e++) {
				let t = Math.round((n.intermediateEndTuple[e] ?? 0) * 16384) & 65535;
				s.push(t >> 8 & 255, t & 255);
			}
		}
		c.push(s);
	}
	let l = [];
	for (let e of c) l.push(...e);
	let u = (r ? Nd : 0) | n & Pd, d = 4 + l.length, f = [];
	return f.push(u >> 8 & 255), f.push(u & 255), f.push(d >> 8 & 255), f.push(d & 255), f.push(...l), f.push(...s), f;
}
function Xd(e, t, n) {
	if (!e || e.length < 8) return {
		majorVersion: 1,
		minorVersion: 0,
		tupleVariations: []
	};
	let r = new F(e), i = r.uint16(), a = r.uint16(), o = r.uint16(), s = r.offset16(), c = o & Pd, l = (o & Nd) !== 0;
	if (c === 0) return {
		majorVersion: i,
		minorVersion: a,
		tupleVariations: []
	};
	let u = [];
	for (let e = 0; e < c; e++) {
		let e = r.uint16(), n = r.uint16(), i = null;
		n & Fd && (i = r.array("f2dot14", t));
		let a = null, o = null;
		n & Id && (a = r.array("f2dot14", t), o = r.array("f2dot14", t)), u.push({
			variationDataSize: e,
			tupleIndex: n,
			peakTuple: i,
			intermediateStartTuple: a,
			intermediateEndTuple: o,
			hasPrivatePoints: (n & Ld) !== 0
		});
	}
	r.seek(s);
	let d = null;
	l && (d = Wd(r));
	let f = [];
	for (let e of u) {
		let t = r.position + e.variationDataSize, i;
		i = e.hasPrivatePoints ? Wd(r) : d;
		let a = Kd(r, i === null ? n : i.length);
		f.push({
			peakTuple: e.peakTuple,
			intermediateStartTuple: e.intermediateStartTuple,
			intermediateEndTuple: e.intermediateEndTuple,
			pointIndices: i,
			deltas: a
		}), r.seek(t);
	}
	return {
		majorVersion: i,
		minorVersion: a,
		tupleVariations: f
	};
}
function Zd(e, t) {
	let n = e.majorVersion ?? 1, r = e.minorVersion ?? 0, i = e.tupleVariations ?? [], a = i.length;
	if (a === 0) {
		let e = new I(8);
		return e.uint16(n), e.uint16(r), e.uint16(0), e.offset16(8), e.toArray();
	}
	let o = i.every((e) => JSON.stringify(e.pointIndices) === JSON.stringify(i[0].pointIndices)) && a > 1, s = [];
	o && s.push(Gd(i[0].pointIndices));
	let c = [];
	for (let e of i) {
		let t = [];
		o || t.push(...Gd(e.pointIndices)), t.push(...qd(e.deltas ?? [])), c.push(t.length), s.push(t);
	}
	let l = [];
	for (let e of s) l.push(...e);
	let u = [];
	for (let e = 0; e < a; e++) {
		let n = i[e], r = Fd;
		o || (r |= Ld), n.intermediateStartTuple && (r |= Id), u.push(c[e] >> 8 & 255), u.push(c[e] & 255), u.push(r >> 8 & 255), u.push(r & 255);
		for (let e = 0; e < t; e++) {
			let t = Math.round((n.peakTuple[e] ?? 0) * 16384) & 65535;
			u.push(t >> 8 & 255, t & 255);
		}
		if (n.intermediateStartTuple) {
			for (let e = 0; e < t; e++) {
				let t = Math.round((n.intermediateStartTuple[e] ?? 0) * 16384) & 65535;
				u.push(t >> 8 & 255, t & 255);
			}
			for (let e = 0; e < t; e++) {
				let t = Math.round((n.intermediateEndTuple[e] ?? 0) * 16384) & 65535;
				u.push(t >> 8 & 255, t & 255);
			}
		}
	}
	let d = (o ? Nd : 0) | a & Pd, f = 8 + u.length, p = new I(f + l.length);
	return p.uint16(n), p.uint16(r), p.uint16(d), p.offset16(f), p.rawBytes(u), p.rawBytes(l), p.toArray();
}
//#endregion
//#region src/ttf/table_cvar.js
function Qd(e, t = {}) {
	return Xd(e, t.fvar?.axes?.length ?? 0, t["cvt "]?.values?.length ?? 0);
}
function $d(e) {
	return Zd(e, e.tupleVariations?.[0]?.peakTuple?.length ?? 0);
}
//#endregion
//#region src/ttf/table_cvt.js
function ef(e) {
	let t = new F(e), n = e.length >>> 1;
	return { values: t.array("fword", n) };
}
function tf(e) {
	let t = e.values, n = new I(t.length * 2);
	return n.array("fword", t), n.toArray();
}
//#endregion
//#region src/ttf/table_fpgm.js
function nf(e) {
	return { instructions: Array.from(e) };
}
function rf(e) {
	return Array.from(e.instructions);
}
//#endregion
//#region src/ttf/table_gasp.js
function af(e) {
	let t = new F(e), n = t.uint16(), r = t.uint16(), i = [];
	for (let e = 0; e < r; e++) i.push({
		rangeMaxPPEM: t.uint16(),
		rangeGaspBehavior: t.uint16()
	});
	return {
		version: n,
		gaspRanges: i
	};
}
function of(e) {
	let { version: t, gaspRanges: n } = e, r = new I(4 + n.length * 4);
	r.uint16(t), r.uint16(n.length);
	for (let e of n) r.uint16(e.rangeMaxPPEM), r.uint16(e.rangeGaspBehavior);
	return r.toArray();
}
//#endregion
//#region src/ttf/table_glyf.js
var sf = 1, cf = 2, lf = 4, uf = 8, df = 16, ff = 32, pf = 64, mf = 1, hf = 2, gf = 4, _f = 8, vf = 32, yf = 64, bf = 128, xf = 256, Sf = 512, Cf = 1024, wf = 2048, Tf = 4096;
function Ef(e, t, { maxPoints: n = 1e7 } = {}) {
	let r = t.loca.offsets, i = t.maxp.numGlyphs, a = new F(e), o = [], s = 0;
	for (let t = 0; t < i; t++) {
		let i = r[t], c = r[t + 1];
		if (!Number.isInteger(i) || !Number.isInteger(c) || i < 0 || c < i || c > e.length) throw Error("Invalid glyf loca extent.");
		if (i === c) {
			o.push(null);
			continue;
		}
		a.seek(i);
		let l = a.int16(), u = a.int16(), d = a.int16(), f = a.int16(), p = a.int16();
		if (l >= 0) {
			if (l) {
				if (a.position + l * 2 + 2 > c) throw Error("Truncated glyf contour endpoints.");
				let e = a.position;
				if (a.seek(e + (l - 1) * 2), s += a.uint16() + 1, s > n) throw Error("Glyph point count exceeds maxPoints.");
				a.seek(e);
			}
			o.push(Df(a, l, u, d, f, p));
		} else o.push(Of(a, u, d, f, p));
		if (a.position > c) throw Error("Glyph data exceeds its loca extent.");
	}
	return { glyphs: o };
}
function Df(e, t, n, r, i, a) {
	let o = e.array("uint16", t);
	if (o.some((e, t) => t > 0 && e <= o[t - 1])) throw Error("Glyph contour endpoints must increase.");
	let s = t > 0 ? o[t - 1] + 1 : 0, c = e.uint16(), l = e.bytes(c), u = [];
	for (; u.length < s;) {
		let t = e.uint8();
		if (u.push(t), t & uf) {
			let n = e.uint8();
			if (u.length + n > s) throw Error("Glyph flag repeat exceeds point count.");
			for (let e = 0; e < n; e++) u.push(t);
		}
	}
	let d = Array(s), f = 0;
	for (let t = 0; t < s; t++) {
		let n = u[t];
		if (n & cf) {
			let t = e.uint8();
			f += n & df ? t : -t;
		} else n & df || (f += e.int16());
		d[t] = f;
	}
	let p = Array(s), m = 0;
	for (let t = 0; t < s; t++) {
		let n = u[t];
		if (n & lf) {
			let t = e.uint8();
			m += n & ff ? t : -t;
		} else n & ff || (m += e.int16());
		p[t] = m;
	}
	let h = s > 0 && (u[0] & pf) !== 0, g = [], _ = 0;
	for (let e = 0; e < t; e++) {
		let t = o[e], n = [];
		for (; _ <= t;) n.push({
			x: d[_],
			y: p[_],
			onCurve: (u[_] & sf) !== 0
		}), _++;
		g.push(n);
	}
	return {
		type: "simple",
		xMin: n,
		yMin: r,
		xMax: i,
		yMax: a,
		contours: g,
		instructions: l,
		overlapSimple: h
	};
}
function Of(e, t, n, r, i) {
	let a = [], o, s = !1;
	do {
		o = e.uint16();
		let t = e.uint16(), n, r;
		o & mf ? o & hf ? (n = e.int16(), r = e.int16()) : (n = e.uint16(), r = e.uint16()) : o & hf ? (n = e.int8(), r = e.int8()) : (n = e.uint8(), r = e.uint8());
		let i = {
			glyphIndex: t,
			flags: kf(o),
			argument1: n,
			argument2: r
		};
		o & _f ? i.transform = { scale: e.f2dot14() } : o & yf ? i.transform = {
			xScale: e.f2dot14(),
			yScale: e.f2dot14()
		} : o & bf && (i.transform = {
			xScale: e.f2dot14(),
			scale01: e.f2dot14(),
			scale10: e.f2dot14(),
			yScale: e.f2dot14()
		}), a.push(i), o & xf && (s = !0);
	} while (o & vf);
	let c = [];
	if (s) {
		let t = e.uint16();
		c = e.bytes(t);
	}
	return {
		type: "composite",
		xMin: t,
		yMin: n,
		xMax: r,
		yMax: i,
		components: a,
		instructions: c
	};
}
function kf(e) {
	let t = {};
	return e & mf && (t.argsAreWords = !0), e & hf && (t.argsAreXYValues = !0), e & gf && (t.roundXYToGrid = !0), e & _f && (t.weHaveAScale = !0), e & yf && (t.weHaveAnXAndYScale = !0), e & bf && (t.weHaveATwoByTwo = !0), e & xf && (t.weHaveInstructions = !0), e & Sf && (t.useMyMetrics = !0), e & Cf && (t.overlapCompound = !0), e & wf && (t.scaledComponentOffset = !0), e & Tf && (t.unscaledComponentOffset = !0), t;
}
function Af(e) {
	let { glyphs: t } = e, n = [];
	for (let e of t) {
		if (e === null) {
			n.push([]);
			continue;
		}
		e.type === "simple" ? n.push(Mf(e)) : n.push(Pf(e));
	}
	let r = [], i = [];
	for (let e of n) {
		i.push(r.length);
		for (let t = 0; t < e.length; t++) r.push(e[t]);
		e.length % 2 != 0 && r.push(0);
	}
	return i.push(r.length), {
		bytes: r,
		offsets: i
	};
}
function jf(e) {
	return Af(e).bytes;
}
function Mf(e) {
	let { contours: t, instructions: n, xMin: r, yMin: i, xMax: a, yMax: o, overlapSimple: s } = e, c = t.length, l = [], u = [];
	for (let e of t) {
		for (let t of e) l.push(t);
		u.push(l.length - 1);
	}
	let d = l.length, f = l.map((e) => e.x), p = l.map((e) => e.y), m = Array(d), h = Array(d);
	for (let e = 0; e < d; e++) m[e] = e === 0 ? f[e] : f[e] - f[e - 1], h[e] = e === 0 ? p[e] : p[e] - p[e - 1];
	let g = [], _ = [], v = [];
	for (let e = 0; e < d; e++) {
		let t = 0;
		l[e].onCurve && (t |= sf);
		let n = m[e], r = h[e];
		n === 0 ? t |= df : n >= -255 && n <= 255 ? (t |= cf, n > 0 ? (t |= df, _.push(n)) : _.push(-n)) : _.push(n >> 8 & 255, n & 255), r === 0 ? t |= ff : r >= -255 && r <= 255 ? (t |= lf, r > 0 ? (t |= ff, v.push(r)) : v.push(-r)) : v.push(r >> 8 & 255, r & 255), e === 0 && s && (t |= pf), g.push(t);
	}
	let y = Nf(g), b = c * 2, x = n.length, S = new I(10 + b + 2 + x + y.length + _.length + v.length);
	return S.int16(c), S.int16(r), S.int16(i), S.int16(a), S.int16(o), S.array("uint16", u), S.uint16(n.length), S.rawBytes(n), S.rawBytes(y), S.rawBytes(_), S.rawBytes(v), S.toArray();
}
function Nf(e) {
	let t = [], n = 0;
	for (; n < e.length;) {
		let r = e[n], i = 0;
		for (; n + 1 + i < e.length && e[n + 1 + i] === r && i < 255;) i++;
		i > 0 ? (t.push(r | uf, i), n += 1 + i) : (t.push(r), n++);
	}
	return t;
}
function Pf(e) {
	let { components: t, instructions: n, xMin: r, yMin: i, xMax: a, yMax: o } = e, s = 10;
	for (let e = 0; e < t.length; e++) {
		let n = t[e];
		s += 4;
		let r = n.flags.argsAreWords || Ff(n.argument1, n.argument2, n.flags.argsAreXYValues);
		s += r ? 4 : 2, n.transform && ("scale" in n.transform ? s += 2 : "scale01" in n.transform ? s += 8 : "xScale" in n.transform && (s += 4));
	}
	n && n.length > 0 && (s += 2 + n.length);
	let c = new I(s);
	c.int16(-1), c.int16(r), c.int16(i), c.int16(a), c.int16(o);
	for (let e = 0; e < t.length; e++) {
		let r = t[e], i = e === t.length - 1, a = If(r.flags), o = r.flags.argsAreWords || Ff(r.argument1, r.argument2, r.flags.argsAreXYValues);
		o ? a |= mf : a &= -2, i ? a &= -33 : a |= vf, i && n && n.length > 0 ? a |= xf : i && (a &= -257), c.uint16(a), c.uint16(r.glyphIndex), o ? r.flags.argsAreXYValues ? (c.int16(r.argument1), c.int16(r.argument2)) : (c.uint16(r.argument1), c.uint16(r.argument2)) : r.flags.argsAreXYValues ? (c.int8(r.argument1), c.int8(r.argument2)) : (c.uint8(r.argument1), c.uint8(r.argument2)), r.transform && ("scale" in r.transform ? c.f2dot14(r.transform.scale) : "scale01" in r.transform ? (c.f2dot14(r.transform.xScale), c.f2dot14(r.transform.scale01), c.f2dot14(r.transform.scale10), c.f2dot14(r.transform.yScale)) : "xScale" in r.transform && (c.f2dot14(r.transform.xScale), c.f2dot14(r.transform.yScale)));
	}
	return n && n.length > 0 && (c.uint16(n.length), c.rawBytes(n)), c.toArray();
}
function Ff(e, t, n) {
	return n ? e < -128 || e > 127 || t < -128 || t > 127 : e > 255 || t > 255;
}
function If(e) {
	let t = 0;
	return e.argsAreWords && (t |= mf), e.argsAreXYValues && (t |= hf), e.roundXYToGrid && (t |= gf), e.weHaveAScale && (t |= _f), e.weHaveAnXAndYScale && (t |= yf), e.weHaveATwoByTwo && (t |= bf), e.weHaveInstructions && (t |= xf), e.useMyMetrics && (t |= Sf), e.overlapCompound && (t |= Cf), e.scaledComponentOffset && (t |= wf), e.unscaledComponentOffset && (t |= Tf), t;
}
//#endregion
//#region src/ttf/table_gvar.js
var Lf = 20, Rf = 1;
function zf(e, t = {}) {
	let n = new F(e), r = n.uint16(), i = n.uint16(), a = n.uint16(), o = n.uint16(), s = n.offset32(), c = n.uint16(), l = n.uint16(), u = n.offset32(), d = (l & Rf) !== 0, f = c + 1, p = [];
	for (let e = 0; e < f; e++) d ? p.push(n.uint32()) : p.push(n.uint16() * 2);
	let m = [];
	if (o > 0 && s > 0) {
		n.seek(s);
		for (let e = 0; e < o; e++) {
			let e = [];
			for (let t = 0; t < a; t++) e.push(n.f2dot14());
			m.push(e);
		}
	}
	let h = [];
	for (let n = 0; n < c; n++) {
		let r = p[n], i = p[n + 1], o = Math.max(0, i - r);
		if (o === 0) {
			h.push([]);
			continue;
		}
		let s = u + r, c = e.slice(s, s + o), l = Bf(t, n);
		h.push(Jd(c, a, m, l));
	}
	return {
		majorVersion: r,
		minorVersion: i,
		axisCount: a,
		flags: l,
		sharedTuples: m,
		glyphVariationData: h
	};
}
function Bf(e, t) {
	let n = e.glyf?.glyphs?.[t];
	if (!n) return e.glyf?.glyphs ? 4 : 0;
	if (n.type === "simple" && n.contours) {
		let e = 0;
		for (let t of n.contours) e += t.length;
		return e + 4;
	}
	return n.type === "composite" && n.components ? n.components.length + 4 : 4;
}
function Vf(e) {
	let t = e.majorVersion ?? 1, n = e.minorVersion ?? 0, r = e.axisCount ?? 0, i = e.glyphVariationData ?? [], a = i.length, o = i.map((e) => Array.isArray(e) && (e.length === 0 || typeof e[0] == "number") ? e : Array.isArray(e) ? Yd(e, r) : []), s = e.sharedTuples ?? Hf(i, r), c = s.length, l = c * r * 2, u = [0], d = 0;
	for (let e of o) d += e.length, u.push(d);
	let f = u.every((e) => e % 2 == 0 && e / 2 <= 65535), p = f ? 2 : 4, m = Lf + (a + 1) * p, h = m + l, g = h + d, _ = e.flags ?? 0, v = f ? _ & -2 : _ | Rf, y = new I(g);
	y.uint16(t), y.uint16(n), y.uint16(r), y.uint16(c), y.offset32(m), y.uint16(a), y.uint16(v), y.offset32(h);
	for (let e of u) f ? y.uint16(e / 2) : y.uint32(e);
	for (let e of s) for (let t = 0; t < r; t++) y.f2dot14(e[t] ?? 0);
	for (let e of o) y.rawBytes(e);
	return y.toArray();
}
function Hf(e, t) {
	if (t === 0) return [];
	let n = /* @__PURE__ */ new Set(), r = [];
	for (let t of e) if (Array.isArray(t)) for (let e of t) {
		if (!e || !e.peakTuple) continue;
		let t = e.peakTuple.map((e) => Math.round((e ?? 0) * 16384)).join(",");
		n.has(t) || (n.add(t), r.push(e.peakTuple));
	}
	return r;
}
//#endregion
//#region src/ttf/table_loca.js
function Uf(e, t) {
	let n = t.head.indexToLocFormat, r = t.maxp.numGlyphs + 1, i = new F(e), a = [];
	if (n === 0) for (let e = 0; e < r; e++) a.push(i.uint16() * 2);
	else for (let e = 0; e < r; e++) a.push(i.uint32());
	return { offsets: a };
}
function Wf(e) {
	let { offsets: t } = e;
	if (t.every((e) => e % 2 == 0 && e / 2 <= 65535)) {
		let e = new I(t.length * 2);
		for (let n of t) e.uint16(n / 2);
		return e.toArray();
	}
	let n = new I(t.length * 4);
	for (let e of t) n.uint32(e);
	return n.toArray();
}
//#endregion
//#region src/ttf/table_prep.js
function Gf(e) {
	return { instructions: Array.from(e) };
}
function Kf(e) {
	return Array.from(e.instructions);
}
//#endregion
//#region node_modules/pako/dist/pako.esm.mjs
var qf = 4, Jf = 0, Yf = 1, Xf = 2;
function Zf(e) {
	let t = e.length;
	for (; --t >= 0;) e[t] = 0;
}
var Qf = 29, $f = 256, ep = 286, tp = 30, np = 19, rp = 573, ip = 15, ap = 16, op = 7, sp = 256, cp = 16, lp = 17, up = 18, dp = new Uint8Array([
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	1,
	1,
	1,
	1,
	2,
	2,
	2,
	2,
	3,
	3,
	3,
	3,
	4,
	4,
	4,
	4,
	5,
	5,
	5,
	5,
	0
]), fp = new Uint8Array([
	0,
	0,
	0,
	0,
	1,
	1,
	2,
	2,
	3,
	3,
	4,
	4,
	5,
	5,
	6,
	6,
	7,
	7,
	8,
	8,
	9,
	9,
	10,
	10,
	11,
	11,
	12,
	12,
	13,
	13
]), pp = new Uint8Array([
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	2,
	3,
	7
]), mp = new Uint8Array([
	16,
	17,
	18,
	0,
	8,
	7,
	9,
	6,
	10,
	5,
	11,
	4,
	12,
	3,
	13,
	2,
	14,
	1,
	15
]), hp = 512, gp = Array(576);
Zf(gp);
var _p = Array(60);
Zf(_p);
var vp = Array(hp);
Zf(vp);
var yp = Array(256);
Zf(yp);
var bp = Array(Qf);
Zf(bp);
var xp = Array(tp);
Zf(xp);
function Sp(e, t, n, r, i) {
	this.static_tree = e, this.extra_bits = t, this.extra_base = n, this.elems = r, this.max_length = i, this.has_stree = e && e.length;
}
var Cp, wp, Tp;
function Ep(e, t) {
	this.dyn_tree = e, this.max_code = 0, this.stat_desc = t;
}
var Dp = (e) => e < 256 ? vp[e] : vp[256 + (e >>> 7)], Op = (e, t) => {
	e.pending_buf[e.pending++] = t & 255, e.pending_buf[e.pending++] = t >>> 8 & 255;
}, U = (e, t, n) => {
	e.bi_valid > ap - n ? (e.bi_buf |= t << e.bi_valid & 65535, Op(e, e.bi_buf), e.bi_buf = t >> ap - e.bi_valid, e.bi_valid += n - ap) : (e.bi_buf |= t << e.bi_valid & 65535, e.bi_valid += n);
}, kp = (e, t, n) => {
	U(e, n[t * 2], n[t * 2 + 1]);
}, Ap = (e, t) => {
	let n = 0;
	do
		n |= e & 1, e >>>= 1, n <<= 1;
	while (--t > 0);
	return n >>> 1;
}, jp = (e) => {
	e.bi_valid === 16 ? (Op(e, e.bi_buf), e.bi_buf = 0, e.bi_valid = 0) : e.bi_valid >= 8 && (e.pending_buf[e.pending++] = e.bi_buf & 255, e.bi_buf >>= 8, e.bi_valid -= 8);
}, Mp = (e, t) => {
	let n = t.dyn_tree, r = t.max_code, i = t.stat_desc.static_tree, a = t.stat_desc.has_stree, o = t.stat_desc.extra_bits, s = t.stat_desc.extra_base, c = t.stat_desc.max_length, l, u, d, f, p, m, h = 0;
	for (f = 0; f <= ip; f++) e.bl_count[f] = 0;
	for (n[e.heap[e.heap_max] * 2 + 1] = 0, l = e.heap_max + 1; l < rp; l++) u = e.heap[l], f = n[n[u * 2 + 1] * 2 + 1] + 1, f > c && (f = c, h++), n[u * 2 + 1] = f, !(u > r) && (e.bl_count[f]++, p = 0, u >= s && (p = o[u - s]), m = n[u * 2], e.opt_len += m * (f + p), a && (e.static_len += m * (i[u * 2 + 1] + p)));
	if (h !== 0) {
		do {
			for (f = c - 1; e.bl_count[f] === 0;) f--;
			e.bl_count[f]--, e.bl_count[f + 1] += 2, e.bl_count[c]--, h -= 2;
		} while (h > 0);
		for (f = c; f !== 0; f--) for (u = e.bl_count[f]; u !== 0;) d = e.heap[--l], !(d > r) && (n[d * 2 + 1] !== f && (e.opt_len += (f - n[d * 2 + 1]) * n[d * 2], n[d * 2 + 1] = f), u--);
	}
}, Np = (e, t, n) => {
	let r = Array(16), i = 0, a, o;
	for (a = 1; a <= ip; a++) i = i + n[a - 1] << 1, r[a] = i;
	for (o = 0; o <= t; o++) {
		let t = e[o * 2 + 1];
		t !== 0 && (e[o * 2] = Ap(r[t]++, t));
	}
}, Pp = () => {
	let e, t, n, r, i, a = Array(16);
	for (n = 0, r = 0; r < 28; r++) for (bp[r] = n, e = 0; e < 1 << dp[r]; e++) yp[n++] = r;
	for (yp[n - 1] = r, i = 0, r = 0; r < 16; r++) for (xp[r] = i, e = 0; e < 1 << fp[r]; e++) vp[i++] = r;
	for (i >>= 7; r < tp; r++) for (xp[r] = i << 7, e = 0; e < 1 << fp[r] - 7; e++) vp[256 + i++] = r;
	for (t = 0; t <= ip; t++) a[t] = 0;
	for (e = 0; e <= 143;) gp[e * 2 + 1] = 8, e++, a[8]++;
	for (; e <= 255;) gp[e * 2 + 1] = 9, e++, a[9]++;
	for (; e <= 279;) gp[e * 2 + 1] = 7, e++, a[7]++;
	for (; e <= 287;) gp[e * 2 + 1] = 8, e++, a[8]++;
	for (Np(gp, 287, a), e = 0; e < tp; e++) _p[e * 2 + 1] = 5, _p[e * 2] = Ap(e, 5);
	Cp = new Sp(gp, dp, 257, ep, ip), wp = new Sp(_p, fp, 0, tp, ip), Tp = new Sp([], pp, 0, np, op);
}, Fp = (e) => {
	let t;
	for (t = 0; t < ep; t++) e.dyn_ltree[t * 2] = 0;
	for (t = 0; t < tp; t++) e.dyn_dtree[t * 2] = 0;
	for (t = 0; t < np; t++) e.bl_tree[t * 2] = 0;
	e.dyn_ltree[sp * 2] = 1, e.opt_len = e.static_len = 0, e.sym_next = e.matches = 0;
}, Ip = (e) => {
	e.bi_valid > 8 ? Op(e, e.bi_buf) : e.bi_valid > 0 && (e.pending_buf[e.pending++] = e.bi_buf), e.bi_buf = 0, e.bi_valid = 0;
}, Lp = (e, t, n, r) => {
	let i = t * 2, a = n * 2;
	return e[i] < e[a] || e[i] === e[a] && r[t] <= r[n];
}, Rp = (e, t, n) => {
	let r = e.heap[n], i = n << 1;
	for (; i <= e.heap_len && (i < e.heap_len && Lp(t, e.heap[i + 1], e.heap[i], e.depth) && i++, !Lp(t, r, e.heap[i], e.depth));) e.heap[n] = e.heap[i], n = i, i <<= 1;
	e.heap[n] = r;
}, zp = (e, t, n) => {
	let r, i, a = 0, o, s;
	if (e.sym_next !== 0) do
		r = e.pending_buf[e.sym_buf + a++] & 255, r += (e.pending_buf[e.sym_buf + a++] & 255) << 8, i = e.pending_buf[e.sym_buf + a++], r === 0 ? kp(e, i, t) : (o = yp[i], kp(e, o + $f + 1, t), s = dp[o], s !== 0 && (i -= bp[o], U(e, i, s)), r--, o = Dp(r), kp(e, o, n), s = fp[o], s !== 0 && (r -= xp[o], U(e, r, s)));
	while (a < e.sym_next);
	kp(e, sp, t);
}, Bp = (e, t) => {
	let n = t.dyn_tree, r = t.stat_desc.static_tree, i = t.stat_desc.has_stree, a = t.stat_desc.elems, o, s, c = -1, l;
	for (e.heap_len = 0, e.heap_max = rp, o = 0; o < a; o++) n[o * 2] === 0 ? n[o * 2 + 1] = 0 : (e.heap[++e.heap_len] = c = o, e.depth[o] = 0);
	for (; e.heap_len < 2;) l = e.heap[++e.heap_len] = c < 2 ? ++c : 0, n[l * 2] = 1, e.depth[l] = 0, e.opt_len--, i && (e.static_len -= r[l * 2 + 1]);
	for (t.max_code = c, o = e.heap_len >> 1; o >= 1; o--) Rp(e, n, o);
	l = a;
	do
		o = e.heap[1], e.heap[1] = e.heap[e.heap_len--], Rp(e, n, 1), s = e.heap[1], e.heap[--e.heap_max] = o, e.heap[--e.heap_max] = s, n[l * 2] = n[o * 2] + n[s * 2], e.depth[l] = (e.depth[o] >= e.depth[s] ? e.depth[o] : e.depth[s]) + 1, n[o * 2 + 1] = n[s * 2 + 1] = l, e.heap[1] = l++, Rp(e, n, 1);
	while (e.heap_len >= 2);
	e.heap[--e.heap_max] = e.heap[1], Mp(e, t), Np(n, c, e.bl_count);
}, Vp = (e, t, n) => {
	let r, i = -1, a, o = t[1], s = 0, c = 7, l = 4;
	for (o === 0 && (c = 138, l = 3), t[(n + 1) * 2 + 1] = 65535, r = 0; r <= n; r++) a = o, o = t[(r + 1) * 2 + 1], !(++s < c && a === o) && (s < l ? e.bl_tree[a * 2] += s : a === 0 ? s <= 10 ? e.bl_tree[34]++ : e.bl_tree[36]++ : (a !== i && e.bl_tree[a * 2]++, e.bl_tree[32]++), s = 0, i = a, o === 0 ? (c = 138, l = 3) : a === o ? (c = 6, l = 3) : (c = 7, l = 4));
}, Hp = (e, t, n) => {
	let r, i = -1, a, o = t[1], s = 0, c = 7, l = 4;
	for (o === 0 && (c = 138, l = 3), r = 0; r <= n; r++) if (a = o, o = t[(r + 1) * 2 + 1], !(++s < c && a === o)) {
		if (s < l) do
			kp(e, a, e.bl_tree);
		while (--s !== 0);
		else a === 0 ? s <= 10 ? (kp(e, lp, e.bl_tree), U(e, s - 3, 3)) : (kp(e, up, e.bl_tree), U(e, s - 11, 7)) : (a !== i && (kp(e, a, e.bl_tree), s--), kp(e, cp, e.bl_tree), U(e, s - 3, 2));
		s = 0, i = a, o === 0 ? (c = 138, l = 3) : a === o ? (c = 6, l = 3) : (c = 7, l = 4);
	}
}, Up = (e) => {
	let t;
	for (Vp(e, e.dyn_ltree, e.l_desc.max_code), Vp(e, e.dyn_dtree, e.d_desc.max_code), Bp(e, e.bl_desc), t = 18; t >= 3 && e.bl_tree[mp[t] * 2 + 1] === 0; t--);
	return e.opt_len += 3 * (t + 1) + 5 + 5 + 4, t;
}, Wp = (e, t, n, r) => {
	let i;
	for (U(e, t - 257, 5), U(e, n - 1, 5), U(e, r - 4, 4), i = 0; i < r; i++) U(e, e.bl_tree[mp[i] * 2 + 1], 3);
	Hp(e, e.dyn_ltree, t - 1), Hp(e, e.dyn_dtree, n - 1);
}, Gp = (e) => {
	let t = 4093624447, n;
	for (n = 0; n <= 31; n++, t >>>= 1) if (t & 1 && e.dyn_ltree[n * 2] !== 0) return Jf;
	if (e.dyn_ltree[18] !== 0 || e.dyn_ltree[20] !== 0 || e.dyn_ltree[26] !== 0) return Yf;
	for (n = 32; n < $f; n++) if (e.dyn_ltree[n * 2] !== 0) return Yf;
	return Jf;
}, Kp = !1, qp = (e) => {
	Kp ||= (Pp(), !0), e.l_desc = new Ep(e.dyn_ltree, Cp), e.d_desc = new Ep(e.dyn_dtree, wp), e.bl_desc = new Ep(e.bl_tree, Tp), e.bi_buf = 0, e.bi_valid = 0, Fp(e);
}, Jp = (e, t, n, r) => {
	U(e, 0 + +!!r, 3), Ip(e), Op(e, n), Op(e, ~n), n && e.pending_buf.set(e.window.subarray(t, t + n), e.pending), e.pending += n;
}, Yp = {
	_tr_init: qp,
	_tr_stored_block: Jp,
	_tr_flush_block: (e, t, n, r) => {
		let i, a, o = 0;
		e.level > 0 ? (e.strm.data_type === Xf && (e.strm.data_type = Gp(e)), Bp(e, e.l_desc), Bp(e, e.d_desc), o = Up(e), i = e.opt_len + 3 + 7 >>> 3, a = e.static_len + 3 + 7 >>> 3, a <= i && (i = a)) : i = a = n + 5, n + 4 <= i && t !== -1 ? Jp(e, t, n, r) : e.strategy === qf || a === i ? (U(e, 2 + +!!r, 3), zp(e, gp, _p)) : (U(e, 4 + +!!r, 3), Wp(e, e.l_desc.max_code + 1, e.d_desc.max_code + 1, o + 1), zp(e, e.dyn_ltree, e.dyn_dtree)), Fp(e), r && Ip(e);
	},
	_tr_tally: (e, t, n) => (e.pending_buf[e.sym_buf + e.sym_next++] = t, e.pending_buf[e.sym_buf + e.sym_next++] = t >> 8, e.pending_buf[e.sym_buf + e.sym_next++] = n, t === 0 ? e.dyn_ltree[n * 2]++ : (e.matches++, t--, e.dyn_ltree[(yp[n] + $f + 1) * 2]++, e.dyn_dtree[Dp(t) * 2]++), e.sym_next === e.sym_end),
	_tr_align: (e) => {
		U(e, 2, 3), kp(e, sp, gp), jp(e);
	}
}, Xp = (e, t, n, r) => {
	let i = e & 65535 | 0, a = e >>> 16 & 65535 | 0, o = 0;
	for (; n !== 0;) {
		o = n > 2e3 ? 2e3 : n, n -= o;
		do
			i = i + t[r++] | 0, a = a + i | 0;
		while (--o);
		i %= 65521, a %= 65521;
	}
	return i | a << 16 | 0;
}, Zp = new Uint32Array((() => {
	let e, t = [];
	for (var n = 0; n < 256; n++) {
		e = n;
		for (var r = 0; r < 8; r++) e = e & 1 ? 3988292384 ^ e >>> 1 : e >>> 1;
		t[n] = e;
	}
	return t;
})()), W = (e, t, n, r) => {
	let i = Zp, a = r + n;
	e ^= -1;
	for (let n = r; n < a; n++) e = e >>> 8 ^ i[(e ^ t[n]) & 255];
	return e ^ -1;
}, Qp = {
	2: "need dictionary",
	1: "stream end",
	0: "",
	"-1": "file error",
	"-2": "stream error",
	"-3": "data error",
	"-4": "insufficient memory",
	"-5": "buffer error",
	"-6": "incompatible version"
}, $p = {
	Z_NO_FLUSH: 0,
	Z_PARTIAL_FLUSH: 1,
	Z_SYNC_FLUSH: 2,
	Z_FULL_FLUSH: 3,
	Z_FINISH: 4,
	Z_BLOCK: 5,
	Z_TREES: 6,
	Z_OK: 0,
	Z_STREAM_END: 1,
	Z_NEED_DICT: 2,
	Z_ERRNO: -1,
	Z_STREAM_ERROR: -2,
	Z_DATA_ERROR: -3,
	Z_MEM_ERROR: -4,
	Z_BUF_ERROR: -5,
	Z_NO_COMPRESSION: 0,
	Z_BEST_SPEED: 1,
	Z_BEST_COMPRESSION: 9,
	Z_DEFAULT_COMPRESSION: -1,
	Z_FILTERED: 1,
	Z_HUFFMAN_ONLY: 2,
	Z_RLE: 3,
	Z_FIXED: 4,
	Z_DEFAULT_STRATEGY: 0,
	Z_BINARY: 0,
	Z_TEXT: 1,
	Z_UNKNOWN: 2,
	Z_DEFLATED: 8
}, { _tr_init: em, _tr_stored_block: tm, _tr_flush_block: nm, _tr_tally: rm, _tr_align: im } = Yp, { Z_NO_FLUSH: am, Z_PARTIAL_FLUSH: om, Z_FULL_FLUSH: sm, Z_FINISH: cm, Z_BLOCK: lm, Z_OK: G, Z_STREAM_END: um, Z_STREAM_ERROR: dm, Z_DATA_ERROR: fm, Z_BUF_ERROR: pm, Z_DEFAULT_COMPRESSION: mm, Z_FILTERED: hm, Z_HUFFMAN_ONLY: gm, Z_RLE: _m, Z_FIXED: vm, Z_DEFAULT_STRATEGY: ym, Z_UNKNOWN: bm, Z_DEFLATED: xm } = $p, Sm = 9, Cm = 15, wm = 8, Tm = 573, K = 3, Em = 258, Dm = 262, Om = 32, km = 42, Am = 57, jm = 69, Mm = 73, Nm = 91, Pm = 103, Fm = 113, Im = 666, q = 1, Lm = 2, Rm = 3, zm = 4, Bm = 3, Vm = (e, t) => (e.msg = Qp[t], t), Hm = (e) => e * 2 - (e > 4 ? 9 : 0), Um = (e) => {
	let t = e.length;
	for (; --t >= 0;) e[t] = 0;
}, Wm = (e) => {
	let t, n, r, i = e.w_size;
	t = e.hash_size, r = t;
	do
		n = e.head[--r], e.head[r] = n >= i ? n - i : 0;
	while (--t);
	t = i, r = t;
	do
		n = e.prev[--r], e.prev[r] = n >= i ? n - i : 0;
	while (--t);
}, Gm = (e, t, n) => (t << e.hash_shift ^ n) & e.hash_mask, Km = (e, t) => {
	let n;
	if (e.legacy_hash) n = e.ins_h = Gm(e, e.ins_h, e.window[t + K - 1]);
	else {
		let r = e.window, i = r[t] | r[t + 1] << 8 | r[t + 2] << 16 | r[t + 3] << 24;
		n = e.ins_h = Math.imul(i, 66521) + 66521 >>> 16 & e.hash_mask;
	}
	let r = e.prev[t & e.w_mask] = e.head[n];
	return e.head[n] = t, r;
}, J = (e) => {
	let t = e.state, n = t.pending;
	n > e.avail_out && (n = e.avail_out), n !== 0 && (e.output.set(t.pending_buf.subarray(t.pending_out, t.pending_out + n), e.next_out), e.next_out += n, t.pending_out += n, e.total_out += n, e.avail_out -= n, t.pending -= n, t.pending === 0 && (t.pending_out = 0));
}, Y = (e, t) => {
	nm(e, e.block_start >= 0 ? e.block_start : -1, e.strstart - e.block_start, t), e.block_start = e.strstart, J(e.strm);
}, X = (e, t) => {
	e.pending_buf[e.pending++] = t;
}, qm = (e, t) => {
	e.pending_buf[e.pending++] = t >>> 8 & 255, e.pending_buf[e.pending++] = t & 255;
}, Jm = (e, t, n, r) => {
	let i = e.avail_in;
	return i > r && (i = r), i === 0 ? 0 : (e.avail_in -= i, t.set(e.input.subarray(e.next_in, e.next_in + i), n), e.state.wrap === 1 ? e.adler = Xp(e.adler, t, i, n) : e.state.wrap === 2 && (e.adler = W(e.adler, t, i, n)), e.next_in += i, e.total_in += i, i);
}, Ym = (e, t) => {
	let n = e.max_chain_length, r = e.strstart, i, a, o = e.prev_length, s = e.nice_match, c = e.strstart > e.w_size - Dm ? e.strstart - (e.w_size - Dm) : 0, l = e.window, u = e.w_mask, d = e.prev, f = e.strstart + Em, p = l[r + o - 1], m = l[r + o];
	e.prev_length >= e.good_match && (n >>= 2), s > e.lookahead && (s = e.lookahead);
	do
		if (i = t, l[i + o] === m && l[i + o - 1] === p && l[i] === l[r] && l[++i] === l[r + 1]) {
			r += 2, i++;
			do			;
while (l[++r] === l[++i] && l[++r] === l[++i] && l[++r] === l[++i] && l[++r] === l[++i] && l[++r] === l[++i] && l[++r] === l[++i] && l[++r] === l[++i] && l[++r] === l[++i] && r < f);
			if (a = Em - (f - r), r = f - Em, a > o) {
				if (e.match_start = t, o = a, a >= s) break;
				p = l[r + o - 1], m = l[r + o];
			}
		}
	while ((t = d[t & u]) > c && --n !== 0);
	return o <= e.lookahead ? o : e.lookahead;
}, Xm = (e) => {
	let t = e.w_size, n, r, i;
	do {
		if (r = e.window_size - e.lookahead - e.strstart, e.strstart >= t + (t - Dm) && (e.window.set(e.window.subarray(t, t + t - r), 0), e.match_start -= t, e.strstart -= t, e.block_start -= t, e.insert > e.strstart && (e.insert = e.strstart), Wm(e), r += t), e.strm.avail_in === 0) break;
		if (n = Jm(e.strm, e.window, e.strstart + e.lookahead, r), e.lookahead += n, !e.legacy_hash) {
			if (e.lookahead + e.insert > K) for (i = e.strstart - e.insert; e.insert && (Km(e, i), i++, e.insert--, !(e.lookahead + e.insert <= K)););
		} else if (e.lookahead + e.insert >= K) for (i = e.strstart - e.insert, e.ins_h = e.window[i], e.ins_h = Gm(e, e.ins_h, e.window[i + 1]); e.insert && (Km(e, i), i++, e.insert--, !(e.lookahead + e.insert < K)););
	} while (e.lookahead < Dm && e.strm.avail_in !== 0);
}, Zm = (e, t) => {
	let n = e.pending_buf_size - 5 > e.w_size ? e.w_size : e.pending_buf_size - 5, r, i, a, o = 0, s = e.strm.avail_in;
	do {
		if (r = 65535, a = e.bi_valid + 42 >> 3, e.strm.avail_out < a || (a = e.strm.avail_out - a, i = e.strstart - e.block_start, r > i + e.strm.avail_in && (r = i + e.strm.avail_in), r > a && (r = a), r < n && (r === 0 && t !== cm || t === am || r !== i + e.strm.avail_in))) break;
		o = +(t === cm && r === i + e.strm.avail_in), tm(e, 0, 0, o), e.pending_buf[e.pending - 4] = r, e.pending_buf[e.pending - 3] = r >> 8, e.pending_buf[e.pending - 2] = ~r, e.pending_buf[e.pending - 1] = ~r >> 8, J(e.strm), i && (i > r && (i = r), e.strm.output.set(e.window.subarray(e.block_start, e.block_start + i), e.strm.next_out), e.strm.next_out += i, e.strm.avail_out -= i, e.strm.total_out += i, e.block_start += i, r -= i), r && (Jm(e.strm, e.strm.output, e.strm.next_out, r), e.strm.next_out += r, e.strm.avail_out -= r, e.strm.total_out += r);
	} while (o === 0);
	return s -= e.strm.avail_in, s && (s >= e.w_size ? (e.matches = 2, e.window.set(e.strm.input.subarray(e.strm.next_in - e.w_size, e.strm.next_in), 0), e.strstart = e.w_size, e.insert = e.strstart) : (e.window_size - e.strstart <= s && (e.strstart -= e.w_size, e.window.set(e.window.subarray(e.w_size, e.w_size + e.strstart), 0), e.matches < 2 && e.matches++, e.insert > e.strstart && (e.insert = e.strstart)), e.window.set(e.strm.input.subarray(e.strm.next_in - s, e.strm.next_in), e.strstart), e.strstart += s, e.insert += s > e.w_size - e.insert ? e.w_size - e.insert : s), e.block_start = e.strstart), e.high_water < e.strstart && (e.high_water = e.strstart), o ? zm : t !== am && t !== cm && e.strm.avail_in === 0 && e.strstart === e.block_start ? Lm : (a = e.window_size - e.strstart, e.strm.avail_in > a && e.block_start >= e.w_size && (e.block_start -= e.w_size, e.strstart -= e.w_size, e.window.set(e.window.subarray(e.w_size, e.w_size + e.strstart), 0), e.matches < 2 && e.matches++, a += e.w_size, e.insert > e.strstart && (e.insert = e.strstart)), a > e.strm.avail_in && (a = e.strm.avail_in), a && (Jm(e.strm, e.window, e.strstart, a), e.strstart += a, e.insert += a > e.w_size - e.insert ? e.w_size - e.insert : a), e.high_water < e.strstart && (e.high_water = e.strstart), a = e.bi_valid + 42 >> 3, a = e.pending_buf_size - a > 65535 ? 65535 : e.pending_buf_size - a, n = a > e.w_size ? e.w_size : a, i = e.strstart - e.block_start, (i >= n || (i || t === cm) && t !== am && e.strm.avail_in === 0 && i <= a) && (r = i > a ? a : i, o = +(t === cm && e.strm.avail_in === 0 && r === i), tm(e, e.block_start, r, o), e.block_start += r, J(e.strm)), o ? Rm : q);
}, Qm = (e, t) => {
	let n, r;
	for (;;) {
		if (e.lookahead < Dm) {
			if (Xm(e), e.lookahead < Dm && t === am) return q;
			if (e.lookahead === 0) break;
		}
		if (n = 0, e.lookahead >= K && (n = Km(e, e.strstart)), n !== 0 && e.strstart - n <= e.w_size - Dm && (e.match_length = Ym(e, n)), e.match_length >= K) {
			if (r = rm(e, e.strstart - e.match_start, e.match_length - K), e.lookahead -= e.match_length, e.match_length <= e.max_lazy_match && e.lookahead >= K) {
				e.match_length--;
				do
					e.strstart++, n = Km(e, e.strstart);
				while (--e.match_length !== 0);
				e.strstart++;
			} else e.strstart += e.match_length, e.match_length = 0, e.legacy_hash && (e.ins_h = e.window[e.strstart], e.ins_h = Gm(e, e.ins_h, e.window[e.strstart + 1]));
		} else r = rm(e, 0, e.window[e.strstart]), e.lookahead--, e.strstart++;
		if (r && (Y(e, !1), e.strm.avail_out === 0)) return q;
	}
	return e.insert = e.strstart < 2 ? e.strstart : 2, t === cm ? (Y(e, !0), e.strm.avail_out === 0 ? Rm : zm) : e.sym_next && (Y(e, !1), e.strm.avail_out === 0) ? q : Lm;
}, $m = (e, t) => {
	let n, r, i;
	for (;;) {
		if (e.lookahead < Dm) {
			if (Xm(e), e.lookahead < Dm && t === am) return q;
			if (e.lookahead === 0) break;
		}
		if (n = 0, e.lookahead >= K && (n = Km(e, e.strstart)), e.prev_length = e.match_length, e.prev_match = e.match_start, e.match_length = 2, n !== 0 && e.prev_length < e.max_lazy_match && e.strstart - n <= e.w_size - Dm && (e.match_length = Ym(e, n), e.match_length <= 5 && (e.strategy === hm || e.match_length === K && e.strstart - e.match_start > 4096) && (e.match_length = 2)), e.prev_length >= K && e.match_length <= e.prev_length) {
			i = e.strstart + e.lookahead - K, r = rm(e, e.strstart - 1 - e.prev_match, e.prev_length - K), e.lookahead -= e.prev_length - 1, e.prev_length -= 2;
			do
				++e.strstart <= i && (n = Km(e, e.strstart));
			while (--e.prev_length !== 0);
			if (e.match_available = 0, e.match_length = 2, e.strstart++, r && (Y(e, !1), e.strm.avail_out === 0)) return q;
		} else if (e.match_available) {
			if (r = rm(e, 0, e.window[e.strstart - 1]), r && Y(e, !1), e.strstart++, e.lookahead--, e.strm.avail_out === 0) return q;
		} else e.match_available = 1, e.strstart++, e.lookahead--;
	}
	return e.match_available &&= (r = rm(e, 0, e.window[e.strstart - 1]), 0), e.insert = e.strstart < 2 ? e.strstart : 2, t === cm ? (Y(e, !0), e.strm.avail_out === 0 ? Rm : zm) : e.sym_next && (Y(e, !1), e.strm.avail_out === 0) ? q : Lm;
}, eh = (e, t) => {
	let n, r, i, a, o = e.window;
	for (;;) {
		if (e.lookahead <= Em) {
			if (Xm(e), e.lookahead <= Em && t === am) return q;
			if (e.lookahead === 0) break;
		}
		if (e.match_length = 0, e.lookahead >= K && e.strstart > 0 && (i = e.strstart - 1, r = o[i], r === o[++i] && r === o[++i] && r === o[++i])) {
			a = e.strstart + Em;
			do			;
while (r === o[++i] && r === o[++i] && r === o[++i] && r === o[++i] && r === o[++i] && r === o[++i] && r === o[++i] && r === o[++i] && i < a);
			e.match_length = Em - (a - i), e.match_length > e.lookahead && (e.match_length = e.lookahead);
		}
		if (e.match_length >= K ? (n = rm(e, 1, e.match_length - K), e.lookahead -= e.match_length, e.strstart += e.match_length, e.match_length = 0) : (n = rm(e, 0, e.window[e.strstart]), e.lookahead--, e.strstart++), n && (Y(e, !1), e.strm.avail_out === 0)) return q;
	}
	return e.insert = 0, t === cm ? (Y(e, !0), e.strm.avail_out === 0 ? Rm : zm) : e.sym_next && (Y(e, !1), e.strm.avail_out === 0) ? q : Lm;
}, th = (e, t) => {
	let n;
	for (;;) {
		if (e.lookahead === 0 && (Xm(e), e.lookahead === 0)) {
			if (t === am) return q;
			break;
		}
		if (e.match_length = 0, n = rm(e, 0, e.window[e.strstart]), e.lookahead--, e.strstart++, n && (Y(e, !1), e.strm.avail_out === 0)) return q;
	}
	return e.insert = 0, t === cm ? (Y(e, !0), e.strm.avail_out === 0 ? Rm : zm) : e.sym_next && (Y(e, !1), e.strm.avail_out === 0) ? q : Lm;
};
function nh(e, t, n, r, i) {
	this.good_length = e, this.max_lazy = t, this.nice_length = n, this.max_chain = r, this.func = i;
}
var rh = [
	new nh(0, 0, 0, 0, Zm),
	new nh(4, 4, 8, 4, Qm),
	new nh(4, 5, 16, 8, Qm),
	new nh(4, 6, 32, 32, Qm),
	new nh(4, 4, 16, 16, $m),
	new nh(8, 16, 32, 32, $m),
	new nh(8, 16, 128, 128, $m),
	new nh(8, 32, 128, 256, $m),
	new nh(32, 128, 258, 1024, $m),
	new nh(32, 258, 258, 4096, $m)
], ih = (e) => {
	e.window_size = 2 * e.w_size, Um(e.head), e.max_lazy_match = rh[e.level].max_lazy, e.good_match = rh[e.level].good_length, e.nice_match = rh[e.level].nice_length, e.max_chain_length = rh[e.level].max_chain, e.strstart = 0, e.block_start = 0, e.lookahead = 0, e.insert = 0, e.match_length = e.prev_length = 2, e.match_available = 0, e.ins_h = 0;
};
function ah() {
	this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = xm, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.legacy_hash = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new Uint16Array(Tm * 2), this.dyn_dtree = /* @__PURE__ */ new Uint16Array(122), this.bl_tree = /* @__PURE__ */ new Uint16Array(78), Um(this.dyn_ltree), Um(this.dyn_dtree), Um(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = /* @__PURE__ */ new Uint16Array(16), this.heap = /* @__PURE__ */ new Uint16Array(573), Um(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = /* @__PURE__ */ new Uint16Array(573), Um(this.depth), this.sym_buf = 0, this.lit_bufsize = 0, this.sym_next = 0, this.sym_end = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
}
var oh = (e) => {
	if (!e) return 1;
	let t = e.state;
	return +(!t || t.strm !== e || t.status !== km && t.status !== Am && t.status !== jm && t.status !== Mm && t.status !== Nm && t.status !== Pm && t.status !== Fm && t.status !== Im);
}, sh = (e) => {
	if (oh(e)) return Vm(e, dm);
	e.total_in = e.total_out = 0, e.data_type = bm;
	let t = e.state;
	return t.pending = 0, t.pending_out = 0, t.wrap < 0 && (t.wrap = -t.wrap), t.status = t.wrap === 2 ? Am : t.wrap ? km : Fm, e.adler = t.wrap === 2 ? 0 : 1, t.last_flush = -2, em(t), G;
}, ch = (e) => {
	let t = sh(e);
	return t === G && ih(e.state), t;
}, lh = (e, t) => oh(e) || e.state.wrap !== 2 ? dm : (e.state.gzhead = t, G), uh = (e, t, n, r, i, a, o) => {
	if (!e) return dm;
	let s = 1;
	if (t === mm && (t = 6), r < 0 ? (s = 0, r = -r) : r > 15 && (s = 2, r -= 16), i < 1 || i > Sm || n !== xm || r < 8 || r > 15 || t < 0 || t > 9 || a < 0 || a > vm || r === 8 && s !== 1) return Vm(e, dm);
	r === 8 && (r = 9);
	let c = new ah();
	return e.state = c, c.strm = e, c.status = km, c.wrap = s, c.gzhead = null, c.w_bits = r, c.w_size = 1 << c.w_bits, c.w_mask = c.w_size - 1, c.legacy_hash = +!!o, c.hash_bits = i + 7, !c.legacy_hash && c.hash_bits < 15 && (c.hash_bits = 15), c.hash_size = 1 << c.hash_bits, c.hash_mask = c.hash_size - 1, c.hash_shift = ~~((c.hash_bits + K - 1) / K), c.window = new Uint8Array(c.w_size * 2), c.head = new Uint16Array(c.hash_size), c.prev = new Uint16Array(c.w_size), c.lit_bufsize = 1 << i + 6, c.pending_buf_size = c.lit_bufsize * 4, c.pending_buf = new Uint8Array(c.pending_buf_size), c.sym_buf = c.lit_bufsize, c.sym_end = (c.lit_bufsize - 1) * 3, c.level = t, c.strategy = a, c.method = n, ch(e);
}, dh = {
	deflateInit: (e, t) => uh(e, t, xm, Cm, wm, ym),
	deflateInit2: uh,
	deflateReset: ch,
	deflateResetKeep: sh,
	deflateSetHeader: lh,
	deflate: (e, t) => {
		if (oh(e) || t > lm || t < 0) return e ? Vm(e, dm) : dm;
		let n = e.state;
		if (!e.output || e.avail_in !== 0 && !e.input || n.status === Im && t !== cm) return Vm(e, e.avail_out === 0 ? pm : dm);
		let r = n.last_flush;
		if (n.last_flush = t, n.pending !== 0) {
			if (J(e), e.avail_out === 0) return n.last_flush = -1, G;
		} else if (e.avail_in === 0 && Hm(t) <= Hm(r) && t !== cm) return Vm(e, pm);
		if (n.status === Im && e.avail_in !== 0) return Vm(e, pm);
		if (n.status === km && n.wrap === 0 && (n.status = Fm), n.status === km) {
			let t = xm + (n.w_bits - 8 << 4) << 8, r = -1;
			if (r = n.strategy >= gm || n.level < 2 ? 0 : n.level < 6 ? 1 : n.level === 6 ? 2 : 3, t |= r << 6, n.strstart !== 0 && (t |= Om), t += 31 - t % 31, qm(n, t), n.strstart !== 0 && (qm(n, e.adler >>> 16), qm(n, e.adler & 65535)), e.adler = 1, n.status = Fm, J(e), n.pending !== 0) return n.last_flush = -1, G;
		}
		if (n.status === Am) {
			if (e.adler = 0, X(n, 31), X(n, 139), X(n, 8), n.gzhead) X(n, +!!n.gzhead.text + (n.gzhead.hcrc ? 2 : 0) + (n.gzhead.extra ? 4 : 0) + (n.gzhead.name ? 8 : 0) + (n.gzhead.comment ? 16 : 0)), X(n, n.gzhead.time & 255), X(n, n.gzhead.time >> 8 & 255), X(n, n.gzhead.time >> 16 & 255), X(n, n.gzhead.time >> 24 & 255), X(n, n.level === 9 ? 2 : n.strategy >= gm || n.level < 2 ? 4 : 0), X(n, n.gzhead.os & 255), n.gzhead.extra && n.gzhead.extra.length && (X(n, n.gzhead.extra.length & 255), X(n, n.gzhead.extra.length >> 8 & 255)), n.gzhead.hcrc && (e.adler = W(e.adler, n.pending_buf, n.pending, 0)), n.gzindex = 0, n.status = jm;
			else if (X(n, 0), X(n, 0), X(n, 0), X(n, 0), X(n, 0), X(n, n.level === 9 ? 2 : n.strategy >= gm || n.level < 2 ? 4 : 0), X(n, Bm), n.status = Fm, J(e), n.pending !== 0) return n.last_flush = -1, G;
		}
		if (n.status === jm) {
			if (n.gzhead.extra) {
				let t = n.pending, r = (n.gzhead.extra.length & 65535) - n.gzindex;
				for (; n.pending + r > n.pending_buf_size;) {
					let i = n.pending_buf_size - n.pending;
					if (n.pending_buf.set(n.gzhead.extra.subarray(n.gzindex, n.gzindex + i), n.pending), n.pending = n.pending_buf_size, n.gzhead.hcrc && n.pending > t && (e.adler = W(e.adler, n.pending_buf, n.pending - t, t)), n.gzindex += i, J(e), n.pending !== 0) return n.last_flush = -1, G;
					t = 0, r -= i;
				}
				let i = new Uint8Array(n.gzhead.extra);
				n.pending_buf.set(i.subarray(n.gzindex, n.gzindex + r), n.pending), n.pending += r, n.gzhead.hcrc && n.pending > t && (e.adler = W(e.adler, n.pending_buf, n.pending - t, t)), n.gzindex = 0;
			}
			n.status = Mm;
		}
		if (n.status === Mm) {
			if (n.gzhead.name) {
				let t = n.pending, r;
				do {
					if (n.pending === n.pending_buf_size) {
						if (n.gzhead.hcrc && n.pending > t && (e.adler = W(e.adler, n.pending_buf, n.pending - t, t)), J(e), n.pending !== 0) return n.last_flush = -1, G;
						t = 0;
					}
					r = n.gzindex < n.gzhead.name.length ? n.gzhead.name.charCodeAt(n.gzindex++) & 255 : 0, X(n, r);
				} while (r !== 0);
				n.gzhead.hcrc && n.pending > t && (e.adler = W(e.adler, n.pending_buf, n.pending - t, t)), n.gzindex = 0;
			}
			n.status = Nm;
		}
		if (n.status === Nm) {
			if (n.gzhead.comment) {
				let t = n.pending, r;
				do {
					if (n.pending === n.pending_buf_size) {
						if (n.gzhead.hcrc && n.pending > t && (e.adler = W(e.adler, n.pending_buf, n.pending - t, t)), J(e), n.pending !== 0) return n.last_flush = -1, G;
						t = 0;
					}
					r = n.gzindex < n.gzhead.comment.length ? n.gzhead.comment.charCodeAt(n.gzindex++) & 255 : 0, X(n, r);
				} while (r !== 0);
				n.gzhead.hcrc && n.pending > t && (e.adler = W(e.adler, n.pending_buf, n.pending - t, t));
			}
			n.status = Pm;
		}
		if (n.status === Pm) {
			if (n.gzhead.hcrc) {
				if (n.pending + 2 > n.pending_buf_size && (J(e), n.pending !== 0)) return n.last_flush = -1, G;
				X(n, e.adler & 255), X(n, e.adler >> 8 & 255), e.adler = 0;
			}
			if (n.status = Fm, J(e), n.pending !== 0) return n.last_flush = -1, G;
		}
		if (e.avail_in !== 0 || n.lookahead !== 0 || t !== am && n.status !== Im) {
			let r = n.level === 0 ? Zm(n, t) : n.strategy === gm ? th(n, t) : n.strategy === _m ? eh(n, t) : rh[n.level].func(n, t);
			if ((r === Rm || r === zm) && (n.status = Im), r === q || r === Rm) return e.avail_out === 0 && (n.last_flush = -1), G;
			if (r === Lm && (t === om ? im(n) : t !== lm && (tm(n, 0, 0, !1), t === sm && (Um(n.head), n.lookahead === 0 && (n.strstart = 0, n.block_start = 0, n.insert = 0))), J(e), e.avail_out === 0)) return n.last_flush = -1, G;
		}
		return t === cm ? n.wrap <= 0 ? um : (n.wrap === 2 ? (X(n, e.adler & 255), X(n, e.adler >> 8 & 255), X(n, e.adler >> 16 & 255), X(n, e.adler >> 24 & 255), X(n, e.total_in & 255), X(n, e.total_in >> 8 & 255), X(n, e.total_in >> 16 & 255), X(n, e.total_in >> 24 & 255)) : (qm(n, e.adler >>> 16), qm(n, e.adler & 65535)), J(e), n.wrap > 0 && (n.wrap = -n.wrap), n.pending === 0 ? um : G) : G;
	},
	deflateEnd: (e) => {
		if (oh(e)) return dm;
		let t = e.state.status;
		return e.state = null, t === Fm ? Vm(e, fm) : G;
	},
	deflateSetDictionary: (e, t) => {
		let n = t.length;
		if (oh(e)) return dm;
		let r = e.state, i = r.wrap;
		if (i === 2 || i === 1 && r.status !== km || r.lookahead) return dm;
		if (i === 1 && (e.adler = Xp(e.adler, t, n, 0)), r.wrap = 0, n >= r.w_size) {
			i === 0 && (Um(r.head), r.strstart = 0, r.block_start = 0, r.insert = 0);
			let e = new Uint8Array(r.w_size);
			e.set(t.subarray(n - r.w_size, n), 0), t = e, n = r.w_size;
		}
		let a = e.avail_in, o = e.next_in, s = e.input;
		for (e.avail_in = n, e.next_in = 0, e.input = t, Xm(r); r.lookahead >= K;) {
			let e = r.strstart, t = r.lookahead - 2;
			do
				Km(r, e), e++;
			while (--t);
			r.strstart = e, r.lookahead = 2, Xm(r);
		}
		return r.strstart += r.lookahead, r.block_start = r.strstart, r.insert = r.lookahead, r.lookahead = 0, r.match_length = r.prev_length = 2, r.match_available = 0, e.next_in = o, e.input = s, e.avail_in = a, r.wrap = i, G;
	},
	deflateInfo: "pako deflate (from Nodeca project)"
}, fh = (e, t) => Object.prototype.hasOwnProperty.call(e, t), ph = {
	assign: function(e) {
		let t = Array.prototype.slice.call(arguments, 1);
		for (; t.length;) {
			let n = t.shift();
			if (n) {
				if (typeof n != "object") throw TypeError(n + "must be non-object");
				for (let t in n) fh(n, t) && (e[t] = n[t]);
			}
		}
		return e;
	},
	flattenChunks: (e) => {
		let t = 0;
		for (let n = 0, r = e.length; n < r; n++) t += e[n].length;
		let n = new Uint8Array(t);
		for (let t = 0, r = 0, i = e.length; t < i; t++) {
			let i = e[t];
			n.set(i, r), r += i.length;
		}
		return n;
	}
}, mh = !0;
try {
	String.fromCharCode.apply(null, /* @__PURE__ */ new Uint8Array(1));
} catch {
	mh = !1;
}
var hh = /* @__PURE__ */ new Uint8Array(256);
for (let e = 0; e < 256; e++) hh[e] = e >= 252 ? 6 : e >= 248 ? 5 : e >= 240 ? 4 : e >= 224 ? 3 : e >= 192 ? 2 : 1;
hh[254] = hh[255] = 1;
var gh = (e) => {
	if (typeof TextEncoder == "function" && TextEncoder.prototype.encode) return new TextEncoder().encode(e);
	let t, n, r, i, a, o = e.length, s = 0;
	for (i = 0; i < o; i++) n = e.charCodeAt(i), (n & 64512) == 55296 && i + 1 < o && (r = e.charCodeAt(i + 1), (r & 64512) == 56320 && (n = 65536 + (n - 55296 << 10) + (r - 56320), i++)), s += n < 128 ? 1 : n < 2048 ? 2 : n < 65536 ? 3 : 4;
	for (t = new Uint8Array(s), a = 0, i = 0; a < s; i++) n = e.charCodeAt(i), (n & 64512) == 55296 && i + 1 < o && (r = e.charCodeAt(i + 1), (r & 64512) == 56320 && (n = 65536 + (n - 55296 << 10) + (r - 56320), i++)), n < 128 ? t[a++] = n : n < 2048 ? (t[a++] = 192 | n >>> 6, t[a++] = 128 | n & 63) : n < 65536 ? (t[a++] = 224 | n >>> 12, t[a++] = 128 | n >>> 6 & 63, t[a++] = 128 | n & 63) : (t[a++] = 240 | n >>> 18, t[a++] = 128 | n >>> 12 & 63, t[a++] = 128 | n >>> 6 & 63, t[a++] = 128 | n & 63);
	return t;
}, _h = (e, t) => {
	if (t < 65534 && e.subarray && mh) return String.fromCharCode.apply(null, e.length === t ? e : e.subarray(0, t));
	let n = "";
	for (let r = 0; r < t; r++) n += String.fromCharCode(e[r]);
	return n;
}, vh = {
	string2buf: gh,
	buf2string: (e, t) => {
		let n = t || e.length;
		if (typeof TextDecoder == "function" && TextDecoder.prototype.decode) return new TextDecoder().decode(e.subarray(0, t));
		let r, i, a = Array(n * 2);
		for (i = 0, r = 0; r < n;) {
			let t = e[r++];
			if (t < 128) {
				a[i++] = t;
				continue;
			}
			let o = hh[t];
			if (o > 4) {
				a[i++] = 65533, r += o - 1;
				continue;
			}
			for (t &= o === 2 ? 31 : o === 3 ? 15 : 7; o > 1 && r < n;) t = t << 6 | e[r++] & 63, o--;
			if (o > 1) {
				a[i++] = 65533;
				continue;
			}
			t < 65536 ? a[i++] = t : (t -= 65536, a[i++] = 55296 | t >> 10 & 1023, a[i++] = 56320 | t & 1023);
		}
		return _h(a, i);
	},
	utf8border: (e, t) => {
		t ||= e.length, t > e.length && (t = e.length);
		let n = t - 1;
		for (; n >= 0 && (e[n] & 192) == 128;) n--;
		return n < 0 || n === 0 ? t : n + hh[e[n]] > t ? n : t;
	}
};
function yh() {
	this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
}
var bh = yh, xh = Object.prototype.toString, { Z_NO_FLUSH: Sh, Z_SYNC_FLUSH: Ch, Z_FULL_FLUSH: wh, Z_FINISH: Th, Z_OK: Eh, Z_STREAM_END: Dh, Z_DEFAULT_COMPRESSION: Oh, Z_DEFAULT_STRATEGY: kh, Z_DEFLATED: Ah } = $p, jh = {
	level: Oh,
	method: Ah,
	chunkSize: 16384,
	windowBits: 15,
	memLevel: 8,
	strategy: kh,
	legacyHash: !0
};
function Mh(e) {
	this.options = ph.assign({}, jh, e || {});
	let t = this.options;
	t.raw && t.windowBits > 0 ? t.windowBits = -t.windowBits : t.gzip && t.windowBits > 0 && t.windowBits < 16 && (t.windowBits += 16), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new bh(), this.strm.avail_out = 0;
	let n = dh.deflateInit2(this.strm, t.level, t.method, t.windowBits, t.memLevel, t.strategy, t.legacyHash);
	if (n !== Eh) throw Error(Qp[n]);
	if (t.header && dh.deflateSetHeader(this.strm, t.header), t.dictionary) {
		let e;
		if (e = typeof t.dictionary == "string" ? vh.string2buf(t.dictionary) : xh.call(t.dictionary) === "[object ArrayBuffer]" ? new Uint8Array(t.dictionary) : t.dictionary, n = dh.deflateSetDictionary(this.strm, e), n !== Eh) throw Error(Qp[n]);
		this._dict_set = !0;
	}
}
Mh.prototype.push = function(e, t) {
	let n = this.strm, r = this.options.chunkSize, i, a;
	if (this.ended) return !1;
	for (a = t === ~~t ? t : t === !0 ? Th : Sh, n.input = typeof e == "string" ? vh.string2buf(e) : xh.call(e) === "[object ArrayBuffer]" ? new Uint8Array(e) : e, n.next_in = 0, n.avail_in = n.input.length;;) {
		if (n.avail_out === 0 && (n.output = new Uint8Array(r), n.next_out = 0, n.avail_out = r), (a === Ch || a === wh) && n.avail_out <= 6) {
			this.onData(n.output.subarray(0, n.next_out)), n.avail_out = 0;
			continue;
		}
		if (i = dh.deflate(n, a), i === Dh) return n.next_out > 0 && this.onData(n.output.subarray(0, n.next_out)), i = dh.deflateEnd(this.strm), this.onEnd(i), this.ended = !0, i === Eh;
		if (n.avail_out === 0) {
			this.onData(n.output);
			continue;
		}
		if (a > 0 && n.next_out > 0) {
			this.onData(n.output.subarray(0, n.next_out)), n.avail_out = 0;
			continue;
		}
		if (n.avail_in === 0) break;
	}
	return !0;
}, Mh.prototype.onData = function(e) {
	this.chunks.push(e);
}, Mh.prototype.onEnd = function(e) {
	e === Eh && (this.result = ph.flattenChunks(this.chunks)), this.chunks = [], this.err = e, this.msg = this.strm.msg;
};
function Nh(e, t) {
	let n = new Mh(t);
	if (n.push(e, !0), n.err) throw n.msg || Qp[n.err];
	return n.result;
}
function Ph(e, t) {
	return t ||= {}, t.raw = !0, Nh(e, t);
}
function Fh(e, t) {
	return t ||= {}, t.gzip = !0, Nh(e, t);
}
var Ih = {
	Deflate: Mh,
	deflate: Nh,
	deflateRaw: Ph,
	gzip: Fh,
	constants: $p
}, Lh = 16209, Rh = 16191, zh = function(e, t) {
	let n, r, i, a, o, s, c, l, u, d, f, p, m, h, g, _, v, y, b, x, S, C, w, T, E = e.state;
	n = e.next_in, w = e.input, r = n + (e.avail_in - 5), i = e.next_out, T = e.output, a = i - (t - e.avail_out), o = i + (e.avail_out - 257), s = E.dmax, c = E.wsize, l = E.whave, u = E.wnext, d = E.window, f = E.hold, p = E.bits, m = E.lencode, h = E.distcode, g = (1 << E.lenbits) - 1, _ = (1 << E.distbits) - 1;
	top: do {
		p < 15 && (f += w[n++] << p, p += 8, f += w[n++] << p, p += 8), v = m[f & g];
		dolen: for (;;) {
			if (y = v >>> 24, f >>>= y, p -= y, y = v >>> 16 & 255, y === 0) T[i++] = v & 65535;
			else if (y & 16) {
				b = v & 65535, y &= 15, y && (p < y && (f += w[n++] << p, p += 8), b += f & (1 << y) - 1, f >>>= y, p -= y), p < 15 && (f += w[n++] << p, p += 8, f += w[n++] << p, p += 8), v = h[f & _];
				dodist: for (;;) {
					if (y = v >>> 24, f >>>= y, p -= y, y = v >>> 16 & 255, y & 16) {
						if (x = v & 65535, y &= 15, p < y && (f += w[n++] << p, p += 8, p < y && (f += w[n++] << p, p += 8)), x += f & (1 << y) - 1, x > s) {
							e.msg = "invalid distance too far back", E.mode = Lh;
							break top;
						}
						if (f >>>= y, p -= y, y = i - a, x > y) {
							if (y = x - y, y > l && E.sane) {
								e.msg = "invalid distance too far back", E.mode = Lh;
								break top;
							}
							if (S = 0, C = d, u === 0) {
								if (S += c - y, y < b) {
									b -= y;
									do
										T[i++] = d[S++];
									while (--y);
									S = i - x, C = T;
								}
							} else if (u < y) {
								if (S += c + u - y, y -= u, y < b) {
									b -= y;
									do
										T[i++] = d[S++];
									while (--y);
									if (S = 0, u < b) {
										y = u, b -= y;
										do
											T[i++] = d[S++];
										while (--y);
										S = i - x, C = T;
									}
								}
							} else if (S += u - y, y < b) {
								b -= y;
								do
									T[i++] = d[S++];
								while (--y);
								S = i - x, C = T;
							}
							for (; b > 2;) T[i++] = C[S++], T[i++] = C[S++], T[i++] = C[S++], b -= 3;
							b && (T[i++] = C[S++], b > 1 && (T[i++] = C[S++]));
						} else {
							S = i - x;
							do
								T[i++] = T[S++], T[i++] = T[S++], T[i++] = T[S++], b -= 3;
							while (b > 2);
							b && (T[i++] = T[S++], b > 1 && (T[i++] = T[S++]));
						}
					} else if (y & 64) {
						e.msg = "invalid distance code", E.mode = Lh;
						break top;
					} else {
						v = h[(v & 65535) + (f & (1 << y) - 1)];
						continue dodist;
					}
					break;
				}
			} else if (!(y & 64)) {
				v = m[(v & 65535) + (f & (1 << y) - 1)];
				continue dolen;
			} else if (y & 32) {
				E.mode = Rh;
				break top;
			} else {
				e.msg = "invalid literal/length code", E.mode = Lh;
				break top;
			}
			break;
		}
	} while (n < r && i < o);
	b = p >> 3, n -= b, p -= b << 3, f &= (1 << p) - 1, e.next_in = n, e.next_out = i, e.avail_in = n < r ? 5 + (r - n) : 5 - (n - r), e.avail_out = i < o ? 257 + (o - i) : 257 - (i - o), E.hold = f, E.bits = p;
}, Bh = 15, Vh = 852, Hh = 592, Uh = 0, Wh = 1, Gh = 2, Kh = new Uint16Array([
	3,
	4,
	5,
	6,
	7,
	8,
	9,
	10,
	11,
	13,
	15,
	17,
	19,
	23,
	27,
	31,
	35,
	43,
	51,
	59,
	67,
	83,
	99,
	115,
	131,
	163,
	195,
	227,
	258,
	0,
	0
]), qh = new Uint8Array([
	16,
	16,
	16,
	16,
	16,
	16,
	16,
	16,
	17,
	17,
	17,
	17,
	18,
	18,
	18,
	18,
	19,
	19,
	19,
	19,
	20,
	20,
	20,
	20,
	21,
	21,
	21,
	21,
	16,
	199,
	75
]), Jh = new Uint16Array([
	1,
	2,
	3,
	4,
	5,
	7,
	9,
	13,
	17,
	25,
	33,
	49,
	65,
	97,
	129,
	193,
	257,
	385,
	513,
	769,
	1025,
	1537,
	2049,
	3073,
	4097,
	6145,
	8193,
	12289,
	16385,
	24577,
	0,
	0
]), Yh = new Uint8Array([
	16,
	16,
	16,
	16,
	17,
	17,
	18,
	18,
	19,
	19,
	20,
	20,
	21,
	21,
	22,
	22,
	23,
	23,
	24,
	24,
	25,
	25,
	26,
	26,
	27,
	27,
	28,
	28,
	29,
	29,
	64,
	64
]), Xh = (e, t, n, r, i, a, o, s) => {
	let c = s.bits, l = 0, u = 0, d = 0, f = 0, p = 0, m = 0, h = 0, g = 0, _ = 0, v = 0, y, b, x, S, C, w = null, T, E = /* @__PURE__ */ new Uint16Array(16), D = /* @__PURE__ */ new Uint16Array(16), O = null, k, ee, te;
	for (l = 0; l <= Bh; l++) E[l] = 0;
	for (u = 0; u < r; u++) E[t[n + u]]++;
	for (p = c, f = Bh; f >= 1 && E[f] === 0; f--);
	if (p > f && (p = f), f === 0) return i[a++] = 20971520, i[a++] = 20971520, s.bits = 1, 0;
	for (d = 1; d < f && E[d] === 0; d++);
	for (p < d && (p = d), g = 1, l = 1; l <= Bh; l++) if (g <<= 1, g -= E[l], g < 0) return -1;
	if (g > 0 && (e === Uh || f !== 1)) return -1;
	for (D[1] = 0, l = 1; l < Bh; l++) D[l + 1] = D[l] + E[l];
	for (u = 0; u < r; u++) t[n + u] !== 0 && (o[D[t[n + u]]++] = u);
	if (e === Uh ? (w = O = o, T = 20) : e === Wh ? (w = Kh, O = qh, T = 257) : (w = Jh, O = Yh, T = 0), v = 0, u = 0, l = d, C = a, m = p, h = 0, x = -1, _ = 1 << p, S = _ - 1, e === Wh && _ > Vh || e === Gh && _ > Hh) return 1;
	for (;;) {
		k = l - h, o[u] + 1 < T ? (ee = 0, te = o[u]) : o[u] >= T ? (ee = O[o[u] - T], te = w[o[u] - T]) : (ee = 96, te = 0), y = 1 << l - h, b = 1 << m, d = b;
		do
			b -= y, i[C + (v >> h) + b] = k << 24 | ee << 16 | te | 0;
		while (b !== 0);
		for (y = 1 << l - 1; v & y;) y >>= 1;
		if (y === 0 ? v = 0 : (v &= y - 1, v += y), u++, --E[l] === 0) {
			if (l === f) break;
			l = t[n + o[u]];
		}
		if (l > p && (v & S) !== x) {
			for (h === 0 && (h = p), C += d, m = l - h, g = 1 << m; m + h < f && (g -= E[m + h], !(g <= 0));) m++, g <<= 1;
			if (_ += 1 << m, e === Wh && _ > Vh || e === Gh && _ > Hh) return 1;
			x = v & S, i[x] = p << 24 | m << 16 | C - a | 0;
		}
	}
	return v !== 0 && (i[C + v] = l - h << 24 | 4194304), s.bits = p, 0;
}, Zh = 0, Qh = 1, $h = 2, { Z_FINISH: eg, Z_BLOCK: tg, Z_TREES: ng, Z_OK: rg, Z_STREAM_END: ig, Z_NEED_DICT: ag, Z_STREAM_ERROR: og, Z_DATA_ERROR: sg, Z_MEM_ERROR: cg, Z_BUF_ERROR: lg, Z_DEFLATED: ug } = $p, dg = 16180, fg = 16181, pg = 16182, mg = 16183, hg = 16184, gg = 16185, _g = 16186, vg = 16187, yg = 16188, bg = 16189, xg = 16190, Sg = 16191, Cg = 16192, wg = 16193, Tg = 16194, Eg = 16195, Dg = 16196, Og = 16197, kg = 16198, Ag = 16199, jg = 16200, Mg = 16201, Ng = 16202, Pg = 16203, Fg = 16204, Ig = 16205, Lg = 16206, Rg = 16207, zg = 16208, Z = 16209, Bg = 16210, Vg = 16211, Hg = 852, Ug = 592, Wg = 15, Gg = (e) => (e >>> 24 & 255) + (e >>> 8 & 65280) + ((e & 65280) << 8) + ((e & 255) << 24);
function Kg() {
	this.strm = null, this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = /* @__PURE__ */ new Uint16Array(320), this.work = /* @__PURE__ */ new Uint16Array(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
}
var qg = (e) => {
	if (!e) return 1;
	let t = e.state;
	return +(!t || t.strm !== e || t.mode < dg || t.mode > Vg);
}, Jg = (e) => {
	if (qg(e)) return og;
	let t = e.state;
	return e.total_in = e.total_out = t.total = 0, e.msg = "", t.wrap && (e.adler = t.wrap & 1), t.mode = dg, t.last = 0, t.havedict = 0, t.flags = -1, t.dmax = 32768, t.head = null, t.hold = 0, t.bits = 0, t.lencode = t.lendyn = new Int32Array(Hg), t.distcode = t.distdyn = new Int32Array(Ug), t.sane = 1, t.back = -1, rg;
}, Yg = (e) => {
	if (qg(e)) return og;
	let t = e.state;
	return t.wsize = 0, t.whave = 0, t.wnext = 0, Jg(e);
}, Xg = (e, t) => {
	let n;
	if (qg(e)) return og;
	let r = e.state;
	return t < 0 ? (n = 0, t = -t) : (n = (t >> 4) + 5, t < 48 && (t &= 15)), t && (t < 8 || t > 15) ? og : (r.window !== null && r.wbits !== t && (r.window = null), r.wrap = n, r.wbits = t, Yg(e));
}, Zg = (e, t) => {
	if (!e) return og;
	let n = new Kg();
	e.state = n, n.strm = e, n.window = null, n.mode = dg;
	let r = Xg(e, t);
	return r !== rg && (e.state = null), r;
}, Qg = (e) => Zg(e, Wg), $g = !0, e_, t_, n_ = (e) => {
	if ($g) {
		e_ = /* @__PURE__ */ new Int32Array(512), t_ = /* @__PURE__ */ new Int32Array(32);
		let t = 0;
		for (; t < 144;) e.lens[t++] = 8;
		for (; t < 256;) e.lens[t++] = 9;
		for (; t < 280;) e.lens[t++] = 7;
		for (; t < 288;) e.lens[t++] = 8;
		for (Xh(Qh, e.lens, 0, 288, e_, 0, e.work, { bits: 9 }), t = 0; t < 32;) e.lens[t++] = 5;
		Xh($h, e.lens, 0, 32, t_, 0, e.work, { bits: 5 }), $g = !1;
	}
	e.lencode = e_, e.lenbits = 9, e.distcode = t_, e.distbits = 5;
}, r_ = (e, t, n, r) => {
	let i, a = e.state;
	return a.window === null && (a.window = new Uint8Array(1 << a.wbits)), a.wsize === 0 && (a.wsize = 1 << a.wbits, a.wnext = 0, a.whave = 0), r >= a.wsize ? (a.window.set(t.subarray(n - a.wsize, n), 0), a.wnext = 0, a.whave = a.wsize) : (i = a.wsize - a.wnext, i > r && (i = r), a.window.set(t.subarray(n - r, n - r + i), a.wnext), r -= i, r ? (a.window.set(t.subarray(n - r, n), 0), a.wnext = r, a.whave = a.wsize) : (a.wnext += i, a.wnext === a.wsize && (a.wnext = 0), a.whave < a.wsize && (a.whave += i))), 0;
}, i_ = {
	inflateReset: Yg,
	inflateReset2: Xg,
	inflateResetKeep: Jg,
	inflateInit: Qg,
	inflateInit2: Zg,
	inflate: (e, t) => {
		let n, r, i, a, o, s, c, l, u, d, f, p, m, h, g = 0, _, v, y, b, x, S, C, w, T = /* @__PURE__ */ new Uint8Array(4), E, D, O = new Uint8Array([
			16,
			17,
			18,
			0,
			8,
			7,
			9,
			6,
			10,
			5,
			11,
			4,
			12,
			3,
			13,
			2,
			14,
			1,
			15
		]);
		if (qg(e) || !e.output || !e.input && e.avail_in !== 0) return og;
		n = e.state, n.mode === Sg && (n.mode = Cg), o = e.next_out, i = e.output, c = e.avail_out, a = e.next_in, r = e.input, s = e.avail_in, l = n.hold, u = n.bits, d = s, f = c, w = rg;
		inf_leave: for (;;) switch (n.mode) {
			case dg:
				if (n.wrap === 0) {
					n.mode = Cg;
					break;
				}
				for (; u < 16;) {
					if (s === 0) break inf_leave;
					s--, l += r[a++] << u, u += 8;
				}
				if (n.wrap & 2 && l === 35615) {
					n.wbits === 0 && (n.wbits = 15), n.check = 0, T[0] = l & 255, T[1] = l >>> 8 & 255, n.check = W(n.check, T, 2, 0), l = 0, u = 0, n.mode = fg;
					break;
				}
				if (n.head && (n.head.done = !1), !(n.wrap & 1) || (((l & 255) << 8) + (l >> 8)) % 31) {
					e.msg = "incorrect header check", n.mode = Z;
					break;
				}
				if ((l & 15) !== ug) {
					e.msg = "unknown compression method", n.mode = Z;
					break;
				}
				if (l >>>= 4, u -= 4, C = (l & 15) + 8, n.wbits === 0 && (n.wbits = C), C > 15 || C > n.wbits) {
					e.msg = "invalid window size", n.mode = Z;
					break;
				}
				n.dmax = 1 << n.wbits, n.flags = 0, e.adler = n.check = 1, n.mode = l & 512 ? bg : Sg, l = 0, u = 0;
				break;
			case fg:
				for (; u < 16;) {
					if (s === 0) break inf_leave;
					s--, l += r[a++] << u, u += 8;
				}
				if (n.flags = l, (n.flags & 255) !== ug) {
					e.msg = "unknown compression method", n.mode = Z;
					break;
				}
				if (n.flags & 57344) {
					e.msg = "unknown header flags set", n.mode = Z;
					break;
				}
				n.head && (n.head.text = l >> 8 & 1), n.flags & 512 && n.wrap & 4 && (T[0] = l & 255, T[1] = l >>> 8 & 255, n.check = W(n.check, T, 2, 0)), l = 0, u = 0, n.mode = pg;
			case pg:
				for (; u < 32;) {
					if (s === 0) break inf_leave;
					s--, l += r[a++] << u, u += 8;
				}
				n.head && (n.head.time = l), n.flags & 512 && n.wrap & 4 && (T[0] = l & 255, T[1] = l >>> 8 & 255, T[2] = l >>> 16 & 255, T[3] = l >>> 24 & 255, n.check = W(n.check, T, 4, 0)), l = 0, u = 0, n.mode = mg;
			case mg:
				for (; u < 16;) {
					if (s === 0) break inf_leave;
					s--, l += r[a++] << u, u += 8;
				}
				n.head && (n.head.xflags = l & 255, n.head.os = l >> 8), n.flags & 512 && n.wrap & 4 && (T[0] = l & 255, T[1] = l >>> 8 & 255, n.check = W(n.check, T, 2, 0)), l = 0, u = 0, n.mode = hg;
			case hg:
				if (n.flags & 1024) {
					for (; u < 16;) {
						if (s === 0) break inf_leave;
						s--, l += r[a++] << u, u += 8;
					}
					n.length = l, n.head && (n.head.extra_len = l), n.flags & 512 && n.wrap & 4 && (T[0] = l & 255, T[1] = l >>> 8 & 255, n.check = W(n.check, T, 2, 0)), l = 0, u = 0;
				} else n.head && (n.head.extra = null);
				n.mode = gg;
			case gg:
				if (n.flags & 1024 && (p = n.length, p > s && (p = s), p && (n.head && (C = n.head.extra_len - n.length, n.head.extra || (n.head.extra = new Uint8Array(n.head.extra_len)), n.head.extra.set(r.subarray(a, a + p), C)), n.flags & 512 && n.wrap & 4 && (n.check = W(n.check, r, p, a)), s -= p, a += p, n.length -= p), n.length)) break inf_leave;
				n.length = 0, n.mode = _g;
			case _g:
				if (n.flags & 2048) {
					if (s === 0) break inf_leave;
					p = 0;
					do
						C = r[a + p++], n.head && C && n.length < 65536 && (n.head.name += String.fromCharCode(C));
					while (C && p < s);
					if (n.flags & 512 && n.wrap & 4 && (n.check = W(n.check, r, p, a)), s -= p, a += p, C) break inf_leave;
				} else n.head && (n.head.name = null);
				n.length = 0, n.mode = vg;
			case vg:
				if (n.flags & 4096) {
					if (s === 0) break inf_leave;
					p = 0;
					do
						C = r[a + p++], n.head && C && n.length < 65536 && (n.head.comment += String.fromCharCode(C));
					while (C && p < s);
					if (n.flags & 512 && n.wrap & 4 && (n.check = W(n.check, r, p, a)), s -= p, a += p, C) break inf_leave;
				} else n.head && (n.head.comment = null);
				n.mode = yg;
			case yg:
				if (n.flags & 512) {
					for (; u < 16;) {
						if (s === 0) break inf_leave;
						s--, l += r[a++] << u, u += 8;
					}
					if (n.wrap & 4 && l !== (n.check & 65535)) {
						e.msg = "header crc mismatch", n.mode = Z;
						break;
					}
					l = 0, u = 0;
				}
				n.head && (n.head.hcrc = n.flags >> 9 & 1, n.head.done = !0), e.adler = n.check = 0, n.mode = Sg;
				break;
			case bg:
				for (; u < 32;) {
					if (s === 0) break inf_leave;
					s--, l += r[a++] << u, u += 8;
				}
				e.adler = n.check = Gg(l), l = 0, u = 0, n.mode = xg;
			case xg:
				if (n.havedict === 0) return e.next_out = o, e.avail_out = c, e.next_in = a, e.avail_in = s, n.hold = l, n.bits = u, ag;
				e.adler = n.check = 1, n.mode = Sg;
			case Sg: if (t === tg || t === ng) break inf_leave;
			case Cg:
				if (n.last) {
					l >>>= u & 7, u -= u & 7, n.mode = Lg;
					break;
				}
				for (; u < 3;) {
					if (s === 0) break inf_leave;
					s--, l += r[a++] << u, u += 8;
				}
				switch (n.last = l & 1, l >>>= 1, --u, l & 3) {
					case 0:
						n.mode = wg;
						break;
					case 1:
						if (n_(n), n.mode = Ag, t === ng) {
							l >>>= 2, u -= 2;
							break inf_leave;
						}
						break;
					case 2:
						n.mode = Dg;
						break;
					case 3: e.msg = "invalid block type", n.mode = Z;
				}
				l >>>= 2, u -= 2;
				break;
			case wg:
				for (l >>>= u & 7, u -= u & 7; u < 32;) {
					if (s === 0) break inf_leave;
					s--, l += r[a++] << u, u += 8;
				}
				if ((l & 65535) != (l >>> 16 ^ 65535)) {
					e.msg = "invalid stored block lengths", n.mode = Z;
					break;
				}
				if (n.length = l & 65535, l = 0, u = 0, n.mode = Tg, t === ng) break inf_leave;
			case Tg: n.mode = Eg;
			case Eg:
				if (p = n.length, p) {
					if (p > s && (p = s), p > c && (p = c), p === 0) break inf_leave;
					i.set(r.subarray(a, a + p), o), s -= p, a += p, c -= p, o += p, n.length -= p;
					break;
				}
				n.mode = Sg;
				break;
			case Dg:
				for (; u < 14;) {
					if (s === 0) break inf_leave;
					s--, l += r[a++] << u, u += 8;
				}
				if (n.nlen = (l & 31) + 257, l >>>= 5, u -= 5, n.ndist = (l & 31) + 1, l >>>= 5, u -= 5, n.ncode = (l & 15) + 4, l >>>= 4, u -= 4, n.nlen > 286 || n.ndist > 30) {
					e.msg = "too many length or distance symbols", n.mode = Z;
					break;
				}
				n.have = 0, n.mode = Og;
			case Og:
				for (; n.have < n.ncode;) {
					for (; u < 3;) {
						if (s === 0) break inf_leave;
						s--, l += r[a++] << u, u += 8;
					}
					n.lens[O[n.have++]] = l & 7, l >>>= 3, u -= 3;
				}
				for (; n.have < 19;) n.lens[O[n.have++]] = 0;
				if (n.lencode = n.lendyn, n.lenbits = 7, E = { bits: n.lenbits }, w = Xh(Zh, n.lens, 0, 19, n.lencode, 0, n.work, E), n.lenbits = E.bits, w) {
					e.msg = "invalid code lengths set", n.mode = Z;
					break;
				}
				n.have = 0, n.mode = kg;
			case kg:
				for (; n.have < n.nlen + n.ndist;) {
					for (; g = n.lencode[l & (1 << n.lenbits) - 1], _ = g >>> 24, v = g >>> 16 & 255, y = g & 65535, !(_ <= u);) {
						if (s === 0) break inf_leave;
						s--, l += r[a++] << u, u += 8;
					}
					if (y < 16) l >>>= _, u -= _, n.lens[n.have++] = y;
					else {
						if (y === 16) {
							for (D = _ + 2; u < D;) {
								if (s === 0) break inf_leave;
								s--, l += r[a++] << u, u += 8;
							}
							if (l >>>= _, u -= _, n.have === 0) {
								e.msg = "invalid bit length repeat", n.mode = Z;
								break;
							}
							C = n.lens[n.have - 1], p = 3 + (l & 3), l >>>= 2, u -= 2;
						} else if (y === 17) {
							for (D = _ + 3; u < D;) {
								if (s === 0) break inf_leave;
								s--, l += r[a++] << u, u += 8;
							}
							l >>>= _, u -= _, C = 0, p = 3 + (l & 7), l >>>= 3, u -= 3;
						} else {
							for (D = _ + 7; u < D;) {
								if (s === 0) break inf_leave;
								s--, l += r[a++] << u, u += 8;
							}
							l >>>= _, u -= _, C = 0, p = 11 + (l & 127), l >>>= 7, u -= 7;
						}
						if (n.have + p > n.nlen + n.ndist) {
							e.msg = "invalid bit length repeat", n.mode = Z;
							break;
						}
						for (; p--;) n.lens[n.have++] = C;
					}
				}
				if (n.mode === Z) break;
				if (n.lens[256] === 0) {
					e.msg = "invalid code -- missing end-of-block", n.mode = Z;
					break;
				}
				if (n.lenbits = 9, E = { bits: n.lenbits }, w = Xh(Qh, n.lens, 0, n.nlen, n.lencode, 0, n.work, E), n.lenbits = E.bits, w) {
					e.msg = "invalid literal/lengths set", n.mode = Z;
					break;
				}
				if (n.distbits = 6, n.distcode = n.distdyn, E = { bits: n.distbits }, w = Xh($h, n.lens, n.nlen, n.ndist, n.distcode, 0, n.work, E), n.distbits = E.bits, w) {
					e.msg = "invalid distances set", n.mode = Z;
					break;
				}
				if (n.mode = Ag, t === ng) break inf_leave;
			case Ag: n.mode = jg;
			case jg:
				if (s >= 6 && c >= 258) {
					e.next_out = o, e.avail_out = c, e.next_in = a, e.avail_in = s, n.hold = l, n.bits = u, zh(e, f), o = e.next_out, i = e.output, c = e.avail_out, a = e.next_in, r = e.input, s = e.avail_in, l = n.hold, u = n.bits, n.mode === Sg && (n.back = -1);
					break;
				}
				for (n.back = 0; g = n.lencode[l & (1 << n.lenbits) - 1], _ = g >>> 24, v = g >>> 16 & 255, y = g & 65535, !(_ <= u);) {
					if (s === 0) break inf_leave;
					s--, l += r[a++] << u, u += 8;
				}
				if (v && !(v & 240)) {
					for (b = _, x = v, S = y; g = n.lencode[S + ((l & (1 << b + x) - 1) >> b)], _ = g >>> 24, v = g >>> 16 & 255, y = g & 65535, !(b + _ <= u);) {
						if (s === 0) break inf_leave;
						s--, l += r[a++] << u, u += 8;
					}
					l >>>= b, u -= b, n.back += b;
				}
				if (l >>>= _, u -= _, n.back += _, n.length = y, v === 0) {
					n.mode = Ig;
					break;
				}
				if (v & 32) {
					n.back = -1, n.mode = Sg;
					break;
				}
				if (v & 64) {
					e.msg = "invalid literal/length code", n.mode = Z;
					break;
				}
				n.extra = v & 15, n.mode = Mg;
			case Mg:
				if (n.extra) {
					for (D = n.extra; u < D;) {
						if (s === 0) break inf_leave;
						s--, l += r[a++] << u, u += 8;
					}
					n.length += l & (1 << n.extra) - 1, l >>>= n.extra, u -= n.extra, n.back += n.extra;
				}
				n.was = n.length, n.mode = Ng;
			case Ng:
				for (; g = n.distcode[l & (1 << n.distbits) - 1], _ = g >>> 24, v = g >>> 16 & 255, y = g & 65535, !(_ <= u);) {
					if (s === 0) break inf_leave;
					s--, l += r[a++] << u, u += 8;
				}
				if (!(v & 240)) {
					for (b = _, x = v, S = y; g = n.distcode[S + ((l & (1 << b + x) - 1) >> b)], _ = g >>> 24, v = g >>> 16 & 255, y = g & 65535, !(b + _ <= u);) {
						if (s === 0) break inf_leave;
						s--, l += r[a++] << u, u += 8;
					}
					l >>>= b, u -= b, n.back += b;
				}
				if (l >>>= _, u -= _, n.back += _, v & 64) {
					e.msg = "invalid distance code", n.mode = Z;
					break;
				}
				n.offset = y, n.extra = v & 15, n.mode = Pg;
			case Pg:
				if (n.extra) {
					for (D = n.extra; u < D;) {
						if (s === 0) break inf_leave;
						s--, l += r[a++] << u, u += 8;
					}
					n.offset += l & (1 << n.extra) - 1, l >>>= n.extra, u -= n.extra, n.back += n.extra;
				}
				if (n.offset > n.dmax) {
					e.msg = "invalid distance too far back", n.mode = Z;
					break;
				}
				n.mode = Fg;
			case Fg:
				if (c === 0) break inf_leave;
				if (p = f - c, n.offset > p) {
					if (p = n.offset - p, p > n.whave && n.sane) {
						e.msg = "invalid distance too far back", n.mode = Z;
						break;
					}
					p > n.wnext ? (p -= n.wnext, m = n.wsize - p) : m = n.wnext - p, p > n.length && (p = n.length), h = n.window;
				} else h = i, m = o - n.offset, p = n.length;
				p > c && (p = c), c -= p, n.length -= p;
				do
					i[o++] = h[m++];
				while (--p);
				n.length === 0 && (n.mode = jg);
				break;
			case Ig:
				if (c === 0) break inf_leave;
				i[o++] = n.length, c--, n.mode = jg;
				break;
			case Lg:
				if (n.wrap) {
					for (; u < 32;) {
						if (s === 0) break inf_leave;
						s--, l |= r[a++] << u, u += 8;
					}
					if (f -= c, e.total_out += f, n.total += f, n.wrap & 4 && f && (e.adler = n.check = n.flags ? W(n.check, i, f, o - f) : Xp(n.check, i, f, o - f)), f = c, n.wrap & 4 && (n.flags ? l : Gg(l)) !== n.check) {
						e.msg = "incorrect data check", n.mode = Z;
						break;
					}
					l = 0, u = 0;
				}
				n.mode = Rg;
			case Rg:
				if (n.wrap && n.flags) {
					for (; u < 32;) {
						if (s === 0) break inf_leave;
						s--, l += r[a++] << u, u += 8;
					}
					if (n.wrap & 4 && l !== (n.total & 4294967295)) {
						e.msg = "incorrect length check", n.mode = Z;
						break;
					}
					l = 0, u = 0;
				}
				n.mode = zg;
			case zg:
				w = ig;
				break inf_leave;
			case Z:
				w = sg;
				break inf_leave;
			case Bg: return cg;
			case Vg:
			default: return og;
		}
		return e.next_out = o, e.avail_out = c, e.next_in = a, e.avail_in = s, n.hold = l, n.bits = u, (n.wsize || f !== e.avail_out && n.mode < Z && (n.mode < Lg || t !== eg)) && r_(e, e.output, e.next_out, f - e.avail_out), d -= e.avail_in, f -= e.avail_out, e.total_in += d, e.total_out += f, n.total += f, n.wrap & 4 && f && (e.adler = n.check = n.flags ? W(n.check, i, f, e.next_out - f) : Xp(n.check, i, f, e.next_out - f)), e.data_type = n.bits + (n.last ? 64 : 0) + (n.mode === Sg ? 128 : 0) + (n.mode === Ag || n.mode === Tg ? 256 : 0), (d === 0 && f === 0 || t === eg) && w === rg && (w = lg), w;
	},
	inflateEnd: (e) => {
		if (qg(e)) return og;
		let t = e.state;
		return t.window &&= null, e.state = null, rg;
	},
	inflateGetHeader: (e, t) => {
		if (qg(e)) return og;
		let n = e.state;
		return n.wrap & 2 ? (n.head = t, t.done = !1, rg) : og;
	},
	inflateSetDictionary: (e, t) => {
		let n = t.length, r, i, a;
		return qg(e) || (r = e.state, r.wrap !== 0 && r.mode !== xg) ? og : r.mode === xg && (i = 1, i = Xp(i, t, n, 0), i !== r.check) ? sg : (a = r_(e, t, n, n), a ? (r.mode = Bg, cg) : (r.havedict = 1, rg));
	},
	inflateInfo: "pako inflate (from Nodeca project)"
};
function a_() {
	this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1;
}
var o_ = a_, s_ = Object.prototype.toString, { Z_NO_FLUSH: c_, Z_FINISH: l_, Z_OK: u_, Z_STREAM_END: d_, Z_NEED_DICT: f_, Z_STREAM_ERROR: p_, Z_DATA_ERROR: m_, Z_MEM_ERROR: h_, Z_BUF_ERROR: g_ } = $p, __ = {
	chunkSize: 65536,
	windowBits: 15,
	to: ""
};
function v_(e) {
	this.options = ph.assign({}, __, e || {});
	let t = this.options;
	t.raw && t.windowBits >= 0 && t.windowBits < 16 && (t.windowBits = -t.windowBits, t.windowBits === 0 && (t.windowBits = -15)), t.windowBits >= 0 && t.windowBits < 16 && !(e && e.windowBits) && (t.windowBits += 32), t.windowBits > 15 && t.windowBits < 48 && (t.windowBits & 15 || (t.windowBits |= 15)), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new bh(), this.strm.avail_out = 0;
	let n = i_.inflateInit2(this.strm, t.windowBits);
	if (n !== u_ || (this.header = new o_(), i_.inflateGetHeader(this.strm, this.header), t.dictionary && (typeof t.dictionary == "string" ? t.dictionary = vh.string2buf(t.dictionary) : s_.call(t.dictionary) === "[object ArrayBuffer]" && (t.dictionary = new Uint8Array(t.dictionary)), t.raw && (n = i_.inflateSetDictionary(this.strm, t.dictionary), n !== u_)))) throw Error(Qp[n]);
}
v_.prototype.push = function(e, t) {
	let n = this.strm, r = this.options.chunkSize, i = this.options.dictionary, a, o, s;
	if (this.ended) return !1;
	for (o = t === ~~t ? t : t === !0 ? l_ : c_, n.input = s_.call(e) === "[object ArrayBuffer]" ? new Uint8Array(e) : e, n.next_in = 0, n.avail_in = n.input.length;;) {
		for (n.avail_out === 0 && (n.output = new Uint8Array(r), n.next_out = 0, n.avail_out = r), a = i_.inflate(n, o), a === f_ && i && (a = i_.inflateSetDictionary(n, i), a === u_ ? a = i_.inflate(n, o) : a === m_ && (a = f_)); n.avail_in > 0 && a === d_ && n.state.wrap & 2 && n.state.flags !== 0 && n.input[n.next_in] !== 0;) i_.inflateReset(n), a = i_.inflate(n, o);
		switch (a) {
			case p_:
			case m_:
			case f_:
			case h_: return this.onEnd(a), this.ended = !0, !1;
		}
		if (s = n.avail_out, n.next_out && (n.avail_out === 0 || a === d_ || o > 0)) {
			if (this.options.to === "string") {
				let e = vh.utf8border(n.output, n.next_out), t = n.next_out - e, i = vh.buf2string(n.output, e);
				n.next_out = t, n.avail_out = r - t, t && n.output.set(n.output.subarray(e, e + t), 0), this.onData(i);
			} else this.onData(n.output.length === n.next_out ? n.output : n.output.subarray(0, n.next_out)), n.avail_out = 0, n.next_out = 0;
		}
		if (a !== u_ && a !== g_ || s !== 0) {
			if (a === d_) return a = i_.inflateEnd(this.strm), this.onEnd(a), this.ended = !0, !0;
			if (n.avail_in === 0) {
				if (o === l_) return a = i_.inflateEnd(this.strm), this.onEnd(a === u_ ? g_ : a), this.ended = !0, !1;
				break;
			}
		}
	}
	return !0;
}, v_.prototype.onData = function(e) {
	this.chunks.push(e);
}, v_.prototype.onEnd = function(e) {
	e === u_ && (this.result = this.options.to === "string" ? this.chunks.join("") : ph.flattenChunks(this.chunks)), this.chunks = [], this.err = e, this.msg = this.strm.msg;
};
function y_(e, t) {
	let n = new v_(t);
	if (n.push(e, !0), n.err) throw n.msg || Qp[n.err];
	return n.result;
}
function b_(e, t) {
	return t ||= {}, t.raw = !0, y_(e, t);
}
var x_ = {
	Inflate: v_,
	inflate: y_,
	inflateRaw: b_,
	ungzip: y_,
	constants: $p
}, { Deflate: S_, deflate: C_, deflateRaw: w_, gzip: T_ } = Ih, { Inflate: E_, inflate: D_, inflateRaw: O_, ungzip: k_ } = x_, A_ = C_, j_ = E_, M_ = 2001684038, N_ = 44, P_ = 20, F_ = 12, I_ = 16;
function L_(e, { maxUncompressedBytes: t = 268435456 } = {}) {
	if (!Number.isSafeInteger(t) || t < 1) throw Error("Invalid decompression budget.");
	if (e.byteLength < 44) throw Error("Truncated WOFF1 header.");
	let n = new DataView(e), r = new Uint8Array(e);
	if (n.getUint32(0) !== M_) throw Error("Invalid WOFF1 signature");
	let i = n.getUint32(4), a = n.getUint16(12), o = n.getUint32(24), s = n.getUint32(28), c = n.getUint32(36), l = n.getUint32(40);
	if (44 + a * 20 > e.byteLength) throw Error("WOFF1 directory outside input bounds.");
	if (n.getUint32(16) > t || n.getUint32(32) > t) throw Error("WOFF1 output exceeds decompression budget.");
	for (let [t, n] of [[o, s], [c, l]]) if (t > e.byteLength || n > e.byteLength - t) throw Error("WOFF1 ancillary data range outside input bounds.");
	let u = [], d = N_;
	for (let e = 0; e < a; e++) u.push({
		tag: String.fromCharCode(n.getUint8(d), n.getUint8(d + 1), n.getUint8(d + 2), n.getUint8(d + 3)),
		offset: n.getUint32(d + 4),
		compLength: n.getUint32(d + 8),
		origLength: n.getUint32(d + 12),
		origChecksum: n.getUint32(d + 16)
	}), d += P_;
	let f = 12 + 16 * a;
	for (let n of u) {
		if (n.offset > e.byteLength || n.compLength > e.byteLength - n.offset || n.compLength > n.origLength) throw Error(`WOFF1 table ${n.tag} has an invalid range or length.`);
		if (f += n.origLength + 3 - (n.origLength + 3) % 4, f > t) throw Error("WOFF1 output exceeds decompression budget.");
	}
	let p = (e, t) => {
		let n = new j_(), r = [], i = 0;
		if (n.onData = (e) => {
			if (i += e.length, i > t) throw Error("WOFF1 decompression output exceeds declared length or budget.");
			r.push(e);
		}, n.push(e, !0), n.err || !n.ended) throw Error(n.msg || "Invalid WOFF1 compressed stream.");
		let a = new Uint8Array(i), o = 0;
		for (let e of r) a.set(e, o), o += e.length;
		return a;
	}, m = u.map((e) => {
		let t = r.subarray(e.offset, e.offset + e.compLength), n;
		if (e.compLength < e.origLength) {
			if (n = p(t, e.origLength), n.length !== e.origLength) throw Error(`WOFF1 table '${e.tag}': decompressed size ${n.length} !== expected ${e.origLength}`);
		} else n = t;
		return {
			tag: e.tag,
			checksum: e.origChecksum,
			data: n,
			length: e.origLength,
			paddedLength: e.origLength + (4 - e.origLength % 4) % 4
		};
	}), h = F_ + a * I_, g = h + (4 - h % 4) % 4, { searchRange: _, entrySelector: v, rangeShift: y } = z_(a), b = g;
	for (let e of m) b += e.paddedLength;
	let x = new ArrayBuffer(b), S = new DataView(x), C = new Uint8Array(x);
	S.setUint32(0, i), S.setUint16(4, a), S.setUint16(6, _), S.setUint16(8, v), S.setUint16(10, y);
	let w = m.map((e, t) => ({
		...e,
		originalIndex: t
	})).sort((e, t) => e.tag < t.tag ? -1 : +(e.tag > t.tag));
	for (let e = 0; e < w.length; e++) {
		let t = w[e], n = F_ + e * I_;
		for (let e = 0; e < 4; e++) S.setUint8(n + e, t.tag.charCodeAt(e));
		S.setUint32(n + 4, t.checksum), S.setUint32(n + 8, g), S.setUint32(n + 12, t.length), C.set(t.data, g), g += t.paddedLength;
	}
	let T = null;
	o && s && (T = p(r.subarray(o, o + s), n.getUint32(32)));
	let E = null;
	return c && l && (E = r.slice(c, c + l)), {
		sfnt: x,
		metadata: T,
		privateData: E
	};
}
function R_(e, t = null, n = null) {
	let r = new DataView(e), i = new Uint8Array(e), a = r.getUint32(0), o = r.getUint16(4), s = [];
	for (let e = 0; e < o; e++) {
		let t = F_ + e * I_;
		s.push({
			tag: String.fromCharCode(r.getUint8(t), r.getUint8(t + 1), r.getUint8(t + 2), r.getUint8(t + 3)),
			checksum: r.getUint32(t + 4),
			offset: r.getUint32(t + 8),
			length: r.getUint32(t + 12)
		});
	}
	let c = s.map((e) => {
		let t = i.subarray(e.offset, e.offset + e.length), n = A_(t), r = n.length < e.length;
		return {
			tag: e.tag,
			origChecksum: e.checksum,
			origLength: e.length,
			data: r ? n : t,
			compLength: r ? n.length : e.length
		};
	}), l = null, u = 0;
	t && t.length > 0 && (u = t.length, l = A_(t));
	let d = N_ + o * P_;
	d += (4 - d % 4) % 4;
	for (let e of c) e.woffOffset = d, d += e.compLength, d += (4 - d % 4) % 4;
	let f = 0, p = 0;
	l && (f = d, p = l.length, d += p, d += (4 - d % 4) % 4);
	let m = 0, h = 0;
	n && n.length > 0 && (m = d, h = n.length, d += h);
	let g = d, _ = F_ + o * I_;
	for (let e of c) _ += e.origLength + (4 - e.origLength % 4) % 4;
	let v = new ArrayBuffer(g), y = new DataView(v), b = new Uint8Array(v);
	y.setUint32(0, M_), y.setUint32(4, a), y.setUint32(8, g), y.setUint16(12, o), y.setUint16(14, 0), y.setUint32(16, _), y.setUint16(20, 0), y.setUint16(22, 0), y.setUint32(24, f), y.setUint32(28, p), y.setUint32(32, u), y.setUint32(36, m), y.setUint32(40, h);
	for (let e = 0; e < c.length; e++) {
		let t = c[e], n = N_ + e * P_;
		for (let e = 0; e < 4; e++) y.setUint8(n + e, t.tag.charCodeAt(e));
		y.setUint32(n + 4, t.woffOffset), y.setUint32(n + 8, t.compLength), y.setUint32(n + 12, t.origLength), y.setUint32(n + 16, t.origChecksum);
	}
	for (let e of c) b.set(e.data, e.woffOffset);
	return l && b.set(l, f), n && n.length > 0 && b.set(n, m), v;
}
function z_(e) {
	let t = 1, n = 0;
	for (; t * 2 <= e;) t *= 2, n++;
	t *= 16;
	let r = e * 16 - t;
	return {
		searchRange: t,
		entrySelector: n,
		rangeShift: r
	};
}
//#endregion
//#region src/woff/woff2.js
var B_ = null, V_ = null;
async function H_() {
	if (!V_) try {
		let { brotliCompressSync: e, brotliDecompressSync: t } = await import("node:zlib");
		if (typeof e != "function" || typeof t != "function") throw Error("node:zlib brotli functions unavailable");
		B_ = (t) => new Uint8Array(e(t)), V_ = (e, n) => new Uint8Array(t(e, { maxOutputLength: n }));
	} catch {
		let e = await import("brotli-wasm"), t = await (e.default || e);
		B_ = t.compress, V_ = (e, n) => {
			let r = new t.DecompressStream(), i = [], a = 0, o = 0;
			try {
				for (;;) {
					let s = r.decompress(e.subarray(a), Math.min(65536, n - o + 1)), c = s.buf, l = s.input_offset, u = s.code;
					if (s.free(), a += l, o += c.length, o > n) throw Error("WOFF2 output exceeds decompression budget.");
					if (i.push(c), u === t.BrotliStreamResultCode.ResultSuccess) break;
					if (!l && !c.length || u === t.BrotliStreamResultCode.NeedsMoreInput && a >= e.length) throw Error("Truncated WOFF2 Brotli stream.");
				}
			} finally {
				r.free();
			}
			let s = new Uint8Array(o), c = 0;
			for (let e of i) s.set(e, c), c += e.length;
			return s;
		};
	}
}
function U_() {
	if (!V_) throw Error("WOFF2 support requires initialization. Call `await initWoff2()` before importing or exporting WOFF2 files.");
}
var W_ = 2001684018, G_ = 48, K_ = 12, q_ = 16, J_ = /* @__PURE__ */ "cmap.head.hhea.hmtx.maxp.name.OS/2.post.cvt .fpgm.glyf.loca.prep.CFF .VORG.EBDT.EBLC.gasp.hdmx.kern.LTSH.PCLT.VDMX.vhea.vmtx.BASE.GDEF.GPOS.GSUB.EBSC.JSTF.MATH.CBDT.CBLC.COLR.CPAL.SVG .sbix.acnt.avar.bdat.bloc.bsln.cvar.fdsc.feat.fmtx.fvar.gvar.hsty.just.lcar.mort.morx.opbd.prop.trak.Zapf.Silf.Glat.Gloc.Feat.Sill".split("."), Y_ = /* @__PURE__ */ new Map();
for (let e = 0; e < J_.length; e++) Y_.set(J_[e], e);
function X_(e, t) {
	let n = 0;
	for (let r = 0; r < 5; r++) {
		let i = e[t + r];
		if (r === 0 && i === 128) throw Error("UIntBase128: leading zero");
		if (n & 4261412864) throw Error("UIntBase128: overflow");
		if (n = n << 7 | i & 127, !(i & 128)) return {
			value: n >>> 0,
			bytesRead: r + 1
		};
	}
	throw Error("UIntBase128: exceeds 5 bytes");
}
function Z_(e) {
	let t = [], n = e >>> 0, r = [];
	do
		r.push(n & 127), n >>>= 7;
	while (n > 0);
	r.reverse();
	for (let e = 0; e < r.length; e++) t.push(e < r.length - 1 ? r[e] | 128 : r[e]);
	return t;
}
function Q_(e, t) {
	let n = e[t];
	return n === 253 ? {
		value: e[t + 1] << 8 | e[t + 2],
		bytesRead: 3
	} : n === 255 ? {
		value: e[t + 1] + 253,
		bytesRead: 2
	} : n === 254 ? {
		value: e[t + 1] + 506,
		bytesRead: 2
	} : {
		value: n,
		bytesRead: 1
	};
}
var $_ = ev();
function ev() {
	let e = [];
	for (let t = 0; t < 10; t++) e.push({
		xBits: 0,
		yBits: 8,
		deltaX: 0,
		deltaY: (t >> 1) * 256,
		xSign: 0,
		ySign: t & 1 ? 1 : -1
	});
	for (let t = 0; t < 10; t++) e.push({
		xBits: 8,
		yBits: 0,
		deltaX: (t >> 1) * 256,
		deltaY: 0,
		xSign: t & 1 ? 1 : -1,
		ySign: 0
	});
	let t = [
		1,
		17,
		33,
		49
	], n = [
		[-1, -1],
		[1, -1],
		[-1, 1],
		[1, 1]
	];
	for (let r of t) for (let i of t) for (let [t, a] of n) e.push({
		xBits: 4,
		yBits: 4,
		deltaX: r,
		deltaY: i,
		xSign: t,
		ySign: a
	});
	let r = [
		1,
		257,
		513
	];
	for (let t of r) for (let i of r) for (let [r, a] of n) e.push({
		xBits: 8,
		yBits: 8,
		deltaX: t,
		deltaY: i,
		xSign: r,
		ySign: a
	});
	for (let [t, r] of n) e.push({
		xBits: 12,
		yBits: 12,
		deltaX: 0,
		deltaY: 0,
		xSign: t,
		ySign: r
	});
	for (let [t, r] of n) e.push({
		xBits: 16,
		yBits: 16,
		deltaX: 0,
		deltaY: 0,
		xSign: t,
		ySign: r
	});
	return e;
}
function tv(e, t, n) {
	let r = e & 127, i = !(e & 128), a = $_[r], o = 0, s = 0, c = n;
	if (a.xBits === 0 && a.yBits === 8) s = a.ySign * (t[c++] + a.deltaY);
	else if (a.xBits === 8 && a.yBits === 0) o = a.xSign * (t[c++] + a.deltaX);
	else if (a.xBits === 4 && a.yBits === 4) {
		let e = t[c++];
		o = a.xSign * ((e >> 4 & 15) + a.deltaX), s = a.ySign * ((e & 15) + a.deltaY);
	} else if (a.xBits === 8 && a.yBits === 8) o = a.xSign * (t[c++] + a.deltaX), s = a.ySign * (t[c++] + a.deltaY);
	else if (a.xBits === 12 && a.yBits === 12) {
		let e = t[c++], n = t[c++], r = t[c++];
		o = a.xSign * ((e << 4 | n >> 4) + a.deltaX), s = a.ySign * (((n & 15) << 8 | r) + a.deltaY);
	} else a.xBits === 16 && a.yBits === 16 && (o = a.xSign * ((t[c++] << 8 | t[c++]) + a.deltaX), s = a.ySign * ((t[c++] << 8 | t[c++]) + a.deltaY));
	return {
		dx: o,
		dy: s,
		onCurve: i,
		bytesConsumed: c - n
	};
}
function nv(e, t, n, r, i, a, o, s, c) {
	let l = [];
	pv(l, e), pv(l, i), pv(l, a), pv(l, o), pv(l, s);
	for (let e of t) mv(l, e);
	mv(l, r.length);
	for (let e = 0; e < r.length; e++) l.push(r[e]);
	let u = [], d = [], f = [];
	for (let e = 0; e < n.length; e++) {
		let { dx: t, dy: r, onCurve: i } = n[e], a = +!!i;
		if (e === 0 && c && (a |= 64), t === 0) a |= 16;
		else if (t >= -255 && t <= 255) a |= 2, t > 0 ? (a |= 16, d.push(t)) : d.push(-t);
		else {
			let e = t & 65535;
			d.push(e >> 8 & 255, e & 255);
		}
		if (r === 0) a |= 32;
		else if (r >= -255 && r <= 255) a |= 4, r > 0 ? (a |= 32, f.push(r)) : f.push(-r);
		else {
			let e = r & 65535;
			f.push(e >> 8 & 255, e & 255);
		}
		u.push(a);
	}
	let p = 0;
	for (; p < u.length;) {
		let e = u[p], t = 0;
		for (; p + t + 1 < u.length && u[p + t + 1] === e && t < 255;) t++;
		t > 0 ? (l.push(e | 8), l.push(t), p += t + 1) : (l.push(e), p++);
	}
	for (let e of d) l.push(e);
	for (let e of f) l.push(e);
	return l;
}
function rv(e, t, n, r, i, a) {
	let o = [];
	pv(o, -1), pv(o, n), pv(o, r), pv(o, i), pv(o, a);
	for (let t = 0; t < e.length; t++) o.push(e[t]);
	if (t && t.length > 0) {
		mv(o, t.length);
		for (let e = 0; e < t.length; e++) o.push(t[e]);
	}
	return o;
}
function iv(e, t) {
	let n = e, r = 0, i = n[r] << 8 | n[r + 1];
	if (r += 2, i !== 0) throw Error("WOFF2 glyf transform: reserved != 0");
	let a = n[r] << 8 | n[r + 1];
	r += 2;
	let o = n[r] << 8 | n[r + 1];
	r += 2;
	let s = n[r] << 8 | n[r + 1];
	r += 2;
	let c = fv(n, r);
	r += 4;
	let l = fv(n, r);
	r += 4;
	let u = fv(n, r);
	r += 4;
	let d = fv(n, r);
	r += 4;
	let f = fv(n, r);
	r += 4;
	let p = fv(n, r);
	r += 4;
	let m = fv(n, r);
	r += 4;
	let h = r, g = h + c, _ = g + l, v = _ + u, y = v + d, b = y + f, x = b + p, S = 4 * Math.floor((o + 31) / 32), C = b, w = C + S;
	function T(e) {
		let t = e >> 3, r = 7 - (e & 7);
		return !!(n[C + t] & 1 << r);
	}
	let E = !!(a & 1), D = x + m;
	function O(e) {
		if (!E) return !1;
		let t = e >> 3, r = 7 - (e & 7);
		return !!(n[D + t] & 1 << r);
	}
	let k = h, ee = g, te = _, ne = v, re = y, A = w, ie = x, ae = [], oe = [0], j = 0;
	for (let e = 0; e < o; e++) {
		let t = Q(n, k);
		if (k += 2, t === 0) {
			ae.push(null), oe.push(j);
			continue;
		}
		if (t > 0) {
			let r = [], i = 0;
			for (let e = 0; e < t; e++) {
				let { value: e, bytesRead: t } = Q_(n, ee);
				ee += t, i += e, r.push(i - 1);
			}
			let a = [];
			for (let e = 0; e < i; e++) {
				let e = n[te++], { dx: t, dy: r, onCurve: i, bytesConsumed: o } = tv(e, n, ne);
				ne += o, a.push({
					dx: t,
					dy: r,
					onCurve: i
				});
			}
			let { value: o, bytesRead: s } = Q_(n, ne);
			ne += s;
			let c = n.subarray(ie, ie + o);
			ie += o;
			let l, u, d, f;
			if (T(e)) l = Q(n, A), A += 2, u = Q(n, A), A += 2, d = Q(n, A), A += 2, f = Q(n, A), A += 2;
			else {
				let e = 0, t = 0;
				l = 32767, u = 32767, d = -32768, f = -32768;
				for (let n of a) e += n.dx, t += n.dy, e < l && (l = e), e > d && (d = e), t < u && (u = t), t > f && (f = t);
			}
			let p = nv(t, r, a, c, l, u, d, f, O(e));
			ae.push(p);
			let m = p.length + (p.length % 2 ? 1 : 0);
			j += m, oe.push(j);
		} else {
			let e = re, t = !1;
			for (;;) {
				let e = n[re] << 8 | n[re + 1];
				if (re += 2, re += 2, e & 1 ? re += 4 : re += 2, e & 8 ? re += 2 : e & 64 ? re += 4 : e & 128 && (re += 8), e & 256 && (t = !0), !(e & 32)) break;
			}
			let r = n.subarray(e, re), i = /* @__PURE__ */ new Uint8Array();
			if (t) {
				let { value: e, bytesRead: t } = Q_(n, ne);
				ne += t, i = n.subarray(ie, ie + e), ie += e;
			}
			let a = Q(n, A);
			A += 2;
			let o = Q(n, A);
			A += 2;
			let s = Q(n, A);
			A += 2;
			let c = Q(n, A);
			A += 2;
			let l = rv(r, i, a, o, s, c);
			ae.push(l);
			let u = l.length + (l.length % 2 ? 1 : 0);
			j += u, oe.push(j);
		}
	}
	let se = new Uint8Array(j), ce = 0;
	for (let e of ae) if (e !== null) {
		for (let t = 0; t < e.length; t++) se[ce++] = e[t];
		e.length % 2 && ce++;
	}
	return {
		glyfBytes: se,
		locaOffsets: oe,
		indexFormat: s
	};
}
function av(e, t, n, r, i) {
	let a = e, o = 0, s = a[o++], c = !(s & 1), l = !(s & 2), u = [];
	for (let e = 0; e < t; e++) u.push(a[o] << 8 | a[o + 1]), o += 2;
	let d = [];
	if (c) for (let e = 0; e < t; e++) d.push(Q(a, o)), o += 2;
	else for (let e = 0; e < t; e++) d.push(ov(r, i, e));
	let f = n - t, p = [];
	if (l) for (let e = 0; e < f; e++) p.push(Q(a, o)), o += 2;
	else for (let e = 0; e < f; e++) p.push(ov(r, i, t + e));
	let m = t * 4 + f * 2, h = new Uint8Array(m), g = 0;
	for (let e = 0; e < t; e++) {
		h[g++] = u[e] >> 8 & 255, h[g++] = u[e] & 255;
		let t = d[e] & 65535;
		h[g++] = t >> 8 & 255, h[g++] = t & 255;
	}
	for (let e = 0; e < f; e++) {
		let t = p[e] & 65535;
		h[g++] = t >> 8 & 255, h[g++] = t & 255;
	}
	return h;
}
function ov(e, t, n) {
	let r = t[n];
	return r === t[n + 1] ? 0 : Q(e, r + 2);
}
function sv(e, t) {
	if (t === 0) {
		let t = new Uint8Array(e.length * 2);
		for (let n = 0; n < e.length; n++) {
			let r = e[n] >> 1;
			t[n * 2] = r >> 8 & 255, t[n * 2 + 1] = r & 255;
		}
		return t;
	}
	let n = new Uint8Array(e.length * 4);
	for (let t = 0; t < e.length; t++) {
		let r = e[t];
		n[t * 4] = r >> 24 & 255, n[t * 4 + 1] = r >> 16 & 255, n[t * 4 + 2] = r >> 8 & 255, n[t * 4 + 3] = r & 255;
	}
	return n;
}
function cv(e, { maxUncompressedBytes: t = 268435456, maxTables: n = 4096, maxFonts: r = 64 } = {}) {
	U_();
	for (let [e, t] of Object.entries({
		maxTables: n,
		maxFonts: r
	})) if (!Number.isSafeInteger(t) || t < 1) throw Error(`Invalid import limit: ${e}`);
	if (!Number.isSafeInteger(t) || t < 1) throw Error("Invalid decompression budget.");
	if (e.byteLength < 48) throw Error("Truncated WOFF2 header.");
	let i = new Uint8Array(e), a = new DataView(e);
	if (a.getUint32(0) !== W_) throw Error("Invalid WOFF2 signature");
	let o = a.getUint32(4), s = a.getUint16(12);
	if (s > n) throw Error("WOFF2 table count exceeds maxTables.");
	let c = a.getUint32(20), l = a.getUint32(28), u = a.getUint32(32), d = a.getUint32(40), f = a.getUint32(44);
	if (a.getUint32(16) > t || a.getUint32(36) > t) throw Error("WOFF2 output exceeds decompression budget.");
	for (let [e, t] of [[l, u], [d, f]]) if (e > i.length || t > i.length - e) throw Error("WOFF2 ancillary range outside input bounds.");
	let p = G_, m = [];
	for (let e = 0; e < s; e++) {
		if (p >= i.length) throw Error("Truncated WOFF2 directory.");
		let e = i[p++], t = e & 63, n = e >> 6 & 3, r;
		t === 63 ? (r = String.fromCharCode(i[p], i[p + 1], i[p + 2], i[p + 3]), p += 4) : r = J_[t];
		let { value: a, bytesRead: o } = X_(i, p);
		p += o;
		let s = a, c = r === "glyf" || r === "loca", l = r === "hmtx";
		if (c && n === 0 || l && n === 1 || !c && !l && n !== 0) {
			let { value: e, bytesRead: t } = X_(i, p);
			p += t, s = e;
		}
		r === "loca" && n === 0 && (s = 0), m.push({
			tag: r,
			transformVersion: n,
			origLength: a,
			transformLength: s,
			isTransformed: c ? n === 0 : l ? n === 1 : n !== 0
		});
	}
	let h = null;
	if (o === 1953784678) {
		let e = fv(i, p);
		p += 4;
		let { value: t, bytesRead: a } = Q_(i, p);
		if (p += a, t < 1 || t > r) throw Error("WOFF2 collection count exceeds maxFonts or is empty.");
		let o = [];
		for (let e = 0; e < t; e++) {
			let { value: e, bytesRead: t } = Q_(i, p);
			if (p += t, e > n || e > s) throw Error("WOFF2 face table count exceeds maxTables or directory size.");
			let r = fv(i, p);
			p += 4;
			let a = [];
			for (let t = 0; t < e; t++) {
				let { value: e, bytesRead: t } = Q_(i, p);
				if (p += t, e >= s) throw Error("WOFF2 collection table index outside directory.");
				a.push(e);
			}
			o.push({
				numTables: e,
				flavor: r,
				tableIndices: a
			});
		}
		h = {
			version: e,
			numFonts: t,
			fonts: o
		};
	}
	let g = p, _ = i.subarray(g, g + c), v = m.reduce((e, t) => e + t.transformLength, 0);
	if (m.reduce((e, t) => e + t.origLength + (4 - t.origLength % 4) % 4, 12 + 16 * m.length) > t) throw Error("WOFF2 reconstructed data exceeds decompression budget.");
	if (v > t) throw Error("WOFF2 transformed data exceeds decompression budget.");
	if (p > i.length || c > i.length - p) throw Error("WOFF2 compressed data range outside input bounds.");
	let y = V_(_, Math.max(1, v));
	if (y.length !== v) throw Error("WOFF2 decompressed length does not match its directory.");
	let b = 0, x = /* @__PURE__ */ new Map();
	for (let e of m) {
		let t = e.isTransformed ? e.transformLength : e.origLength, n = y.subarray(b, b + t);
		b += t, x.set(e.tag, {
			data: n,
			entry: e
		});
	}
	let S = /* @__PURE__ */ new Map(), C = null, w = x.get("glyf"), T = x.get("loca");
	if (w && w.entry.isTransformed) {
		let e = T ? T.entry.origLength : 0;
		C = iv(w.data, e), S.set("glyf", C.glyfBytes), S.set("loca", sv(C.locaOffsets, C.indexFormat));
	}
	let E = x.get("hmtx");
	if (E && E.entry.isTransformed && C) {
		let e = x.get("hhea"), t = x.get("maxp"), n = 0, r = 0;
		e && (n = e.data[34] << 8 | e.data[35]), t && (r = t.data[4] << 8 | t.data[5]), S.set("hmtx", av(E.data, n, r, C.glyfBytes, C.locaOffsets));
	}
	let D = [];
	for (let e of m) {
		let t = e.tag, n;
		n = S.has(t) ? S.get(t) : x.get(t).data, D.push({
			tag: t,
			data: n,
			length: n.length
		});
	}
	let O;
	O = h ? uv(h, D, m) : lv(o, D);
	let k = null;
	if (l && u) {
		let e = i.subarray(l, l + u);
		k = V_(e, Math.max(1, a.getUint32(36)));
	}
	let ee = null;
	return d && f && (ee = i.slice(d, d + f)), {
		sfnt: O.buffer,
		metadata: k,
		privateData: ee
	};
}
function lv(e, t) {
	let n = t.length, { searchRange: r, entrySelector: i, rangeShift: a } = hv(n), o = K_ + n * q_, s = o + (4 - o % 4) % 4, c = t.map((e, t) => ({
		...e,
		index: t
	})).sort((e, t) => e.tag < t.tag ? -1 : +(e.tag > t.tag)), l = s;
	for (let e of c) l += e.length + (4 - e.length % 4) % 4;
	let u = new Uint8Array(l), d = new DataView(u.buffer);
	d.setUint32(0, e), d.setUint16(4, n), d.setUint16(6, r), d.setUint16(8, i), d.setUint16(10, a);
	for (let e = 0; e < c.length; e++) {
		let t = c[e], n = K_ + e * q_;
		for (let e = 0; e < 4; e++) u[n + e] = t.tag.charCodeAt(e);
		let r = gv(t.data);
		d.setUint32(n + 4, r), d.setUint32(n + 8, s), d.setUint32(n + 12, t.length), u.set(t.data instanceof Uint8Array ? t.data : new Uint8Array(t.data), s), s += t.length + (4 - t.length % 4) % 4;
	}
	return _v(u, c), u;
}
function uv(e, t, n) {
	let r = [];
	for (let n of e.fonts) {
		let e = n.tableIndices.map((e) => t[e]), i = lv(n.flavor, e);
		r.push(i);
	}
	let i = r.length, a = 12 + i * 4;
	a += (4 - a % 4) % 4;
	let o = [], s = a;
	for (let e of r) o.push(s), s += e.length, s += (4 - s % 4) % 4;
	let c = new Uint8Array(s), l = new DataView(c.buffer);
	l.setUint32(0, 1953784678), l.setUint32(4, e.version), l.setUint32(8, i);
	for (let e = 0; e < i; e++) l.setUint32(12 + e * 4, o[e]);
	for (let e = 0; e < i; e++) c.set(r[e], o[e]);
	return c;
}
function dv(e, t = null, n = null) {
	U_();
	let r = new DataView(e), i = new Uint8Array(e), a = r.getUint32(0), o = r.getUint16(4), s = [];
	for (let e = 0; e < o; e++) {
		let t = K_ + e * q_, n = String.fromCharCode(r.getUint8(t), r.getUint8(t + 1), r.getUint8(t + 2), r.getUint8(t + 3));
		s.push({
			tag: n,
			checksum: r.getUint32(t + 4),
			offset: r.getUint32(t + 8),
			length: r.getUint32(t + 12)
		});
	}
	let c = s.filter((e) => e.tag !== "DSIG"), l = [], u = [], d = K_ + c.length * q_;
	for (let e of c) {
		let t = i.subarray(e.offset, e.offset + e.length), n = Y_.get(e.tag), r = e.tag === "glyf" || e.tag === "loca" ? 3 : 0, a = [(n === void 0 ? 63 : n) | r << 6];
		if (n === void 0) for (let t = 0; t < 4; t++) a.push(e.tag.charCodeAt(t));
		a.push(...Z_(e.length)), l.push(a), u.push(t), d += e.length + (4 - e.length % 4) % 4;
	}
	let f = 0;
	for (let e of u) f += e.length;
	let p = new Uint8Array(f), m = 0;
	for (let e of u) p.set(e, m), m += e.length;
	let h = 0;
	for (let e of c) e.tag === "head" && e.length >= 18 && (p[h + 16] |= 8), h += e.length;
	let g = B_(p), _ = null, v = 0;
	t && t.length > 0 && (v = t.length, _ = B_(t));
	let y = [];
	for (let e of l) y.push(...e);
	let b = G_ + y.length, x = b;
	b += g.length, b += (4 - b % 4) % 4;
	let S = 0, C = 0;
	_ && (b += (4 - b % 4) % 4, S = b, C = _.length, b += C);
	let w = 0, T = 0;
	n && n.length > 0 && (b += (4 - b % 4) % 4, w = b, T = n.length, b += T);
	let E = b, D = new ArrayBuffer(E), O = new DataView(D), k = new Uint8Array(D);
	O.setUint32(0, W_), O.setUint32(4, a), O.setUint32(8, E), O.setUint16(12, c.length), O.setUint16(14, 0), O.setUint32(16, d), O.setUint32(20, g.length), O.setUint16(24, 0), O.setUint16(26, 0), O.setUint32(28, S), O.setUint32(32, C), O.setUint32(36, v), O.setUint32(40, w), O.setUint32(44, T);
	for (let e = 0; e < y.length; e++) k[G_ + e] = y[e];
	return k.set(g instanceof Uint8Array ? g : new Uint8Array(g), x), _ && k.set(_ instanceof Uint8Array ? _ : new Uint8Array(_), S), n && n.length > 0 && k.set(n, w), D;
}
function fv(e, t) {
	return (e[t] << 24 | e[t + 1] << 16 | e[t + 2] << 8 | e[t + 3]) >>> 0;
}
function Q(e, t) {
	let n = e[t] << 8 | e[t + 1];
	return n > 32767 ? n - 65536 : n;
}
function pv(e, t) {
	let n = t & 65535;
	e.push(n >> 8 & 255, n & 255);
}
function mv(e, t) {
	e.push(t >> 8 & 255, t & 255);
}
function hv(e) {
	let t = 1, n = 0;
	for (; t * 2 <= e;) t *= 2, n++;
	t *= 16;
	let r = e * 16 - t;
	return {
		searchRange: t,
		entrySelector: n,
		rangeShift: r
	};
}
function gv(e) {
	let t = 0, n = e.length, r = n + (4 - n % 4) % 4;
	for (let n = 0; n < r; n += 4) t = t + ((e[n] || 0) << 24 | (e[n + 1] || 0) << 16 | (e[n + 2] || 0) << 8 | (e[n + 3] || 0)) >>> 0;
	return t;
}
function _v(e, t) {
	let n = -1;
	for (let r of t) if (r.tag === "head") {
		let t = e[4] << 8 | e[5];
		for (let r = 0; r < t; r++) {
			let t = K_ + r * q_;
			if (String.fromCharCode(e[t], e[t + 1], e[t + 2], e[t + 3]) === "head") {
				n = e[t + 8] << 24 | e[t + 9] << 16 | e[t + 10] << 8 | e[t + 11];
				break;
			}
		}
		break;
	}
	if (n < 0) return;
	e[n + 8] = 0, e[n + 9] = 0, e[n + 10] = 0, e[n + 11] = 0;
	let r = 2981146554 - gv(e) >>> 0;
	e[n + 8] = r >> 24 & 255, e[n + 9] = r >> 16 & 255, e[n + 10] = r >> 8 & 255, e[n + 11] = r & 255;
}
//#endregion
//#region src/export.js
var vv = {
	cmap: fn,
	head: Xc,
	hhea: $c,
	HVAR: ll,
	hmtx: tl,
	maxp: au,
	MVAR: hu,
	name: Eu,
	hdmx: Kc,
	BASE: Ka,
	JSTF: xl,
	MATH: $l,
	MERG: su,
	meta: du,
	DSIG: Ss,
	LTSH: Xl,
	CBLC: go,
	CBDT: ao,
	"OS/2": Mu,
	kern: Ll,
	PCLT: Fu,
	VDMX: ld,
	post: Hu,
	STAT: ed,
	"CFF ": _i,
	CFF2: Fi,
	VORG: Bi,
	fvar: Is,
	avar: Ui,
	loca: Wf,
	glyf: jf,
	gvar: Vf,
	GDEF: Hs,
	GPOS: fc,
	GSUB: Fc,
	"cvt ": tf,
	cvar: $d,
	fpgm: rf,
	prep: Kf,
	gasp: of,
	vhea: md,
	VVAR: wd,
	vmtx: gd,
	COLR: gs,
	CPAL: vs,
	EBDT: Ts,
	EBLC: Ds,
	EBSC: As,
	bloc: Eo,
	bdat: po,
	sbix: qu,
	ltag: Jl,
	"SVG ": rd
}, yv = 12, bv = 16;
function xv(e, t) {
	let n = e.padEnd(4, " "), r = t.padEnd(4, " ");
	for (let e = 0; e < 4; e++) {
		let t = n.charCodeAt(e) - r.charCodeAt(e);
		if (t !== 0) return t;
	}
	return 0;
}
function Sv(e) {
	let t = 0, n = e.length, r = n & -4, i = new DataView(e.buffer, e.byteOffset, e.byteLength);
	for (let e = 0; e < r; e += 4) t = t + i.getUint32(e) >>> 0;
	if (n & 3) {
		let i = 0;
		for (let t = r; t < n; t++) i |= e[t] << 24 - 8 * (t - r);
		t = t + i >>> 0;
	}
	return t;
}
var Cv = /* @__PURE__ */ new Set([
	"sfnt",
	"woff",
	"woff2",
	"cff",
	"ttf",
	"otf"
]), wv = {
	ttf: "truetype",
	otf: "cff"
};
function Tv(e) {
	if (e._standalone === "cff") return "cff";
	let t = e._woff?.version;
	return t === 2 ? "woff2" : t === 1 ? "woff" : "sfnt";
}
function Ev(e, t = {}) {
	if (!e || typeof e != "object") throw TypeError("exportFont expects a font data object");
	let n = t.format ? t.format.toLowerCase() : Tv(e);
	if (!Cv.has(n)) throw Error(`Unknown export format "${n}". Supported: sfnt, woff, woff2, cff, ttf, otf.`);
	if (wv[n] && (e = Rt(e, wv[n]), n = "sfnt"), Ov(e)) {
		if (n === "cff") throw Error("CFF export does not support font collections.");
		if (t.split) return Dv(e, n);
		let r = jv(e);
		return n === "woff" ? R_(r, e._woff?.metadata, e._woff?.privateData) : n === "woff2" ? dv(r, e._woff?.metadata, e._woff?.privateData) : r;
	}
	if (n === "cff") {
		let t = kv(e).tables["CFF "];
		if (!t) throw Error("CFF export requires CFF glyph data. This font uses TrueType outlines.");
		let n = _i(t), r = new ArrayBuffer(n.length);
		return new Uint8Array(r).set(n), r;
	}
	let r = Av(kv(e), 0);
	return n === "woff" ? R_(r, e._woff?.metadata ?? null, e._woff?.privateData ?? null) : n === "woff2" ? dv(r, e._woff?.metadata ?? null, e._woff?.privateData ?? null) : r;
}
function Dv(e, t) {
	let { fonts: n } = e;
	if (!Array.isArray(n) || n.length === 0) throw Error("Collection split expects a non-empty fonts array");
	return n.map((e) => {
		let n = Av(kv(e), 0);
		return t === "woff" ? R_(n) : t === "woff2" ? dv(n) : n;
	});
}
function Ov(e) {
	return e.collection && e.collection.tag === "ttcf" && Array.isArray(e.fonts);
}
function kv(e) {
	if (e.header && e.tables && !(e.font && e.glyphs)) return e;
	if (e._header && e.tables && e.font && e.glyphs) return Gn(e);
	if (e._header && e.tables) return {
		header: e._header,
		tables: e.tables
	};
	if (e.font && e.glyphs) return Gn(e);
	throw Error("exportFont: input must have { header, tables } or { font, glyphs }");
}
function Av(e, t) {
	let { header: n, tables: r } = e, i = Object.keys(r).sort(xv), a = i.length, o = Mv(r), s = i.map((e) => {
		let t = r[e], n;
		if (o.has(e)) n = o.get(e);
		else if (t._raw) n = t._raw;
		else {
			let r = vv[e];
			if (!r) throw Error(`No writer registered for parsed table: ${e}`);
			n = r(t);
		}
		let i = new Uint8Array(n);
		return e === "head" && i.byteLength >= 12 && new DataView(i.buffer).setUint32(8, 0), {
			tag: e,
			data: i,
			length: i.length,
			paddedLength: i.length + (4 - i.length % 4) % 4,
			checksum: Sv(i)
		};
	}), c = yv + a * bv, l = c + (4 - c % 4) % 4;
	for (let e of s) e.offset = l, l += e.paddedLength;
	let u = new ArrayBuffer(l), d = new DataView(u), f = new Uint8Array(u), p = a > 0 ? 2 ** Math.floor(Math.log2(a)) : 0, m = p * 16, h = p > 0 ? Math.floor(Math.log2(p)) : 0, g = a * 16 - m;
	d.setUint32(0, n.sfVersion), d.setUint16(4, a), d.setUint16(6, m), d.setUint16(8, h), d.setUint16(10, g);
	for (let e = 0; e < s.length; e++) {
		let n = s[e], r = yv + e * bv;
		for (let e = 0; e < 4; e++) d.setUint8(r + e, n.tag.charCodeAt(e));
		d.setUint32(r + 4, n.checksum), d.setUint32(r + 8, n.offset + t), d.setUint32(r + 12, n.length);
	}
	for (let e of s) f.set(e.data, e.offset);
	let _ = s.find((e) => e.tag === "head");
	return t === 0 && _?.length >= 12 && d.setUint32(_.offset + 8, 2981146554 - Sv(f) >>> 0), u;
}
function jv(e) {
	let { collection: t, fonts: n } = e;
	if (!Array.isArray(n) || n.length === 0) throw Error("TTC/OTC export expects a non-empty fonts array");
	let r = n.map((e) => kv(e)), i = t.majorVersion ?? 2, a = t.minorVersion ?? 0, o = r.length, s = i >= 2, c = 12 + o * 4 + (s ? 12 : 0), l = c + (4 - c % 4) % 4, u = r.map((e) => new Uint8Array(Av(e, 0))).map((e) => {
		let t = l;
		return l += e.length, l += (4 - l % 4) % 4, t;
	}), d = r.map((e, t) => new Uint8Array(Av(e, u[t]))), f = new ArrayBuffer(l), p = new DataView(f), m = new Uint8Array(f);
	p.setUint8(0, 116), p.setUint8(1, 116), p.setUint8(2, 99), p.setUint8(3, 102), p.setUint16(4, i), p.setUint16(6, a), p.setUint32(8, o);
	for (let e = 0; e < o; e++) p.setUint32(12 + e * 4, u[e]);
	if (s) {
		let e = 12 + o * 4;
		p.setUint32(e + 0, t.dsigTag ?? 0), p.setUint32(e + 4, t.dsigLength ?? 0), p.setUint32(e + 8, t.dsigOffset ?? 0);
	}
	for (let e = 0; e < o; e++) m.set(d[e], u[e]);
	return f;
}
function Mv(e) {
	let t = /* @__PURE__ */ new Map();
	if ((e["CFF "] && !e["CFF "]._raw || e.CFF2 && !e.CFF2._raw) && e.post && !e.post._raw) {
		let n = e.post;
		if (n.version !== 196608) {
			let e = {
				version: 196608,
				italicAngle: n.italicAngle ?? 0,
				underlinePosition: n.underlinePosition ?? 0,
				underlineThickness: n.underlineThickness ?? 0,
				isFixedPitch: n.isFixedPitch ?? 0,
				minMemType42: n.minMemType42 ?? 0,
				maxMemType42: n.maxMemType42 ?? 0,
				minMemType1: n.minMemType1 ?? 0,
				maxMemType1: n.maxMemType1 ?? 0
			};
			t.set("post", Hu(e));
		}
	}
	let n = e.glyf && !e.glyf._raw, r = e.loca && !e.loca._raw;
	if (n && r) {
		let { bytes: n, offsets: r } = Af(e.glyf);
		if (t.set("glyf", n), t.set("loca", Wf({ offsets: r })), e.head && !e.head._raw) {
			let n = +!r.every((e) => e % 2 == 0 && e / 2 <= 65535);
			e.head.indexToLocFormat !== n && t.set("head", Xc({
				...e.head,
				indexToLocFormat: n
			}));
		}
	}
	let i = e.CBLC && !e.CBLC._raw && e.CBLC.sizes, a = e.CBDT && !e.CBDT._raw && e.CBDT.bitmapData;
	if (i && a) {
		let { bytes: n, offsetInfo: r } = oo(e.CBDT, e.CBLC);
		t.set("CBDT", n), t.set("CBLC", go(e.CBLC, r));
	}
	let o = e.EBLC && !e.EBLC._raw && e.EBLC.sizes, s = e.EBDT && !e.EBDT._raw && e.EBDT.bitmapData;
	if (o && s) {
		let { bytes: n, offsetInfo: r } = oo(e.EBDT, e.EBLC);
		t.set("EBDT", n), t.set("EBLC", go(e.EBLC, r));
	}
	let c = e.bloc && !e.bloc._raw && e.bloc.sizes, l = e.bdat && !e.bdat._raw && e.bdat.bitmapData;
	if (c && l) {
		let { bytes: n, offsetInfo: r } = oo(e.bdat, e.bloc);
		t.set("bdat", n), t.set("bloc", go(e.bloc, r));
	}
	return t;
}
//#endregion
//#region src/import.js
var Nv = {
	cmap: Zt,
	head: Yc,
	hhea: Qc,
	HVAR: al,
	hmtx: el,
	maxp: iu,
	MVAR: mu,
	name: Tu,
	hdmx: Gc,
	BASE: La,
	JSTF: bl,
	MATH: Ql,
	MERG: ou,
	meta: uu,
	DSIG: xs,
	LTSH: Yl,
	CBLC: ho,
	CBDT: io,
	"OS/2": ju,
	kern: Ol,
	PCLT: Pu,
	VDMX: cd,
	post: Vu,
	STAT: Qu,
	"CFF ": hi,
	CFF2: Pi,
	VORG: zi,
	fvar: Fs,
	avar: Hi,
	loca: Uf,
	glyf: Ef,
	gvar: zf,
	GDEF: Ls,
	GPOS: $s,
	GSUB: Dc,
	"cvt ": ef,
	cvar: Qd,
	fpgm: nf,
	prep: Gf,
	gasp: af,
	vhea: pd,
	VVAR: bd,
	vmtx: hd,
	COLR: hs,
	CPAL: _s,
	EBLC: Es,
	EBDT: ws,
	EBSC: ks,
	bloc: To,
	bdat: fo,
	sbix: Ku,
	ltag: ql,
	"SVG ": nd
}, Pv = /* @__PURE__ */ "head.maxp.fvar.avar.cvt .hhea.cmap.hmtx.HVAR.name.BASE.JSTF.MATH.STAT.MVAR.OS/2.kern.hdmx.LTSH.MERG.meta.DSIG.PCLT.VDMX.post.CFF .CFF2.VORG.loca.glyf.gvar.cvar.vhea.vmtx.VVAR.CBLC.CBDT.EBLC.EBDT.EBSC.bloc.bdat.sbix.ltag".split(".");
function Fv(e, t = {}) {
	if (!(e instanceof ArrayBuffer)) throw TypeError("importFont expects an ArrayBuffer");
	t = Iv(e, t);
	let n = new Uint8Array(e);
	if (n.length >= 4) {
		let r = String.fromCharCode(n[0], n[1], n[2], n[3]);
		if (r === "wOFF") {
			let { sfnt: n, metadata: r, privateData: i } = L_(e, t), a = Fv(n, t);
			return a._woff = { version: 1 }, r && (a._woff.metadata = r), i && (a._woff.privateData = i), a;
		}
		if (r === "wOF2") {
			let { sfnt: n, metadata: r, privateData: i } = cv(e, t), a = Fv(n, t);
			return a._woff = { version: 2 }, r && (a._woff.metadata = r), i && (a._woff.privateData = i), a;
		}
		if (r === "ttcf") return Rv(e, t);
	}
	return n.length >= 4 && n[0] === 1 && n[1] === 0 && n[3] >= 1 && n[3] <= 4 ? Uv(e, t) : n.length >= 6 && n[0] === 128 && (n[1] === 1 || n[1] === 2) ? Wv(e, t) : n.length >= 2 && n[0] === 37 && n[1] === 33 ? Gv(e, t) : Pe(Lv(e, t), t);
}
function Iv(e, t) {
	let n = {
		maxInputBytes: 268435456,
		maxTableBytes: 268435456,
		maxTables: 4096,
		maxFonts: 64,
		maxGlyphs: 65535,
		maxPoints: 1e7,
		maxCharStringOperations: 1e6,
		...t
	};
	for (let e of [
		"maxInputBytes",
		"maxTableBytes",
		"maxTables",
		"maxFonts",
		"maxGlyphs",
		"maxPoints",
		"maxCharStringOperations"
	]) if (!Number.isSafeInteger(n[e]) || n[e] < 1) throw Error(`Invalid import limit: ${e}`);
	if (e.byteLength > n.maxInputBytes) throw Error("Font input exceeds maxInputBytes.");
	return n;
}
function Lv(e, t = {}) {
	if (!(e instanceof ArrayBuffer)) throw TypeError("importFontTables expects an ArrayBuffer");
	t = Iv(e, t);
	let n = new F(new Uint8Array(e)), r = Bv(n);
	if (r.numTables > t.maxTables) throw Error("Font table count exceeds maxTables.");
	return {
		header: r,
		tables: Hv(e, Vv(n, r.numTables), t)
	};
}
function Rv(e, t) {
	let { faceIndex: n } = t, r = new F(new Uint8Array(e)), i = r.tag();
	if (i !== "ttcf") throw Error("Invalid TTC/OTC collection signature");
	let a = r.uint16(), o = r.uint16(), s = r.uint32();
	if (s > t.maxFonts) throw Error("Collection count exceeds maxFonts.");
	if (s === 0 || s > Math.floor((e.byteLength - r.position) / 4)) throw Error("Invalid collection font count or truncated offset array.");
	let c = r.array("uint32", s);
	if (n !== void 0 && (!Number.isInteger(n) || n < 0 || n >= s)) throw Error(`faceIndex must be between 0 and ${s - 1}.`);
	let l, u, d;
	a >= 2 && (l = r.uint32(), u = r.uint32(), d = r.uint32());
	let f = (n === void 0 ? c : [c[n]]).map((n) => {
		let r = new F(new Uint8Array(e), n), i = Bv(r);
		if (i.numTables > t.maxTables) throw Error("Font table count exceeds maxTables.");
		return Pe({
			header: i,
			tables: Hv(e, zv(e, Vv(r, i.numTables), n), t)
		}, t);
	}), p = {
		tag: i,
		majorVersion: a,
		minorVersion: o,
		numFonts: s
	};
	return a >= 2 && (p.dsigTag = l, p.dsigLength = u, p.dsigOffset = d), n === void 0 ? {
		collection: p,
		fonts: f
	} : f[0];
}
function zv(e, t, n) {
	let r = t.find((e) => e.tag === "head");
	if (!r) return t;
	let i = r.offset, a = n + r.offset, o = i + r.length <= e.byteLength, s = a + r.length <= e.byteLength;
	if (!o && s) return t.map((e) => ({
		...e,
		offset: n + e.offset
	}));
	if (o && !s || !o && !s) return t;
	let c = Yc(Array.from(new Uint8Array(e, i, r.length))), l = Yc(Array.from(new Uint8Array(e, a, r.length))), u = c.magicNumber === 1594834165;
	return l.magicNumber === 1594834165 && !u ? t.map((e) => ({
		...e,
		offset: n + e.offset
	})) : t;
}
function Bv(e) {
	return {
		sfVersion: e.uint32(),
		numTables: e.uint16(),
		searchRange: e.uint16(),
		entrySelector: e.uint16(),
		rangeShift: e.uint16()
	};
}
function Vv(e, t) {
	if (t > Math.floor((e.length - e.position) / 16)) throw Error("Truncated SFNT table directory.");
	let n = [], r = /* @__PURE__ */ new Set();
	for (let i = 0; i < t; i++) {
		n.push({
			tag: e.tag(),
			checksum: e.uint32(),
			offset: e.offset32(),
			length: e.uint32()
		});
		let t = n[n.length - 1];
		if (r.has(t.tag)) throw Error(`Duplicate SFNT table tag: ${t.tag}`);
		r.add(t.tag);
	}
	return n;
}
function Hv(e, t, n) {
	let r = {}, i = 0;
	for (let r of t) {
		if (i += r.length, i > n.maxTableBytes) throw Error("Font table data exceeds maxTableBytes.");
		if (r.offset > e.byteLength || r.length > e.byteLength - r.offset) throw Error(`SFNT table ${r.tag} range is outside input bounds.`);
	}
	let a = new Map(t.map((e) => [e.tag, e])), o = Pv.filter((e) => a.has(e)), s = t.map((e) => e.tag).filter((e) => !o.includes(e)), c = [...o, ...s];
	for (let t of c) {
		let i = a.get(t), o = i.offset, s = new Uint8Array(e, o, i.length), c = Array.from(s), l = Nv[t];
		if (l) {
			if (r[t] = {
				...l(c, r, n),
				_checksum: i.checksum
			}, t === "maxp" && r.maxp.numGlyphs > n.maxGlyphs) throw Error("Glyph count exceeds maxGlyphs.");
		} else r[t] = {
			_raw: c,
			_checksum: i.checksum
		};
	}
	if (r.loca && r.glyf && !r.glyf._raw && delete r.loca.offsets, r.CBLC && r.CBDT?.bitmapData) for (let e of r.CBLC.sizes) for (let t of e.indexSubTables ?? []) delete t.imageDataOffset, delete t.sbitOffsets, t.glyphArray && (t.glyphIdArray = t.glyphArray.slice(0, -1).map((e) => e.glyphID), delete t.glyphArray);
	if (r.EBLC && r.EBDT?.bitmapData) for (let e of r.EBLC.sizes) for (let t of e.indexSubTables ?? []) delete t.imageDataOffset, delete t.sbitOffsets, t.glyphArray && (t.glyphIdArray = t.glyphArray.slice(0, -1).map((e) => e.glyphID), delete t.glyphArray);
	if (r.bloc && r.bdat?.bitmapData) for (let e of r.bloc.sizes) for (let t of e.indexSubTables ?? []) delete t.imageDataOffset, delete t.sbitOffsets, t.glyphArray && (t.glyphIdArray = t.glyphArray.slice(0, -1).map((e) => e.glyphID), delete t.glyphArray);
	return r;
}
function Uv(e, t = {}) {
	let n = hi(Array.from(new Uint8Array(e))), r = n.fonts[0], i = r?.topDict || {}, a = r?.charStrings || [], o = a.length;
	if (o > (t.maxGlyphs ?? 65535)) throw Error("Glyph count exceeds maxGlyphs.");
	let s = i.FontBBox || [
		0,
		0,
		1e3,
		1e3
	], c = s[3] - s[1] || 1e3, l = n.names && n.names[0] || "CFFFont", u = { "CFF ": n };
	u.head = {
		majorVersion: 1,
		minorVersion: 0,
		magicNumber: 1594834165,
		unitsPerEm: c,
		created: 0n,
		modified: 0n,
		xMin: s[0],
		yMin: s[1],
		xMax: s[2],
		yMax: s[3],
		flags: 11,
		macStyle: 0,
		lowestRecPPEM: 8,
		fontDirectionHint: 2,
		indexToLocFormat: 0,
		glyphDataFormat: 0
	}, u.maxp = {
		version: 20480,
		numGlyphs: o
	};
	let d = s[3], f = s[1];
	u.hhea = {
		majorVersion: 1,
		minorVersion: 0,
		ascender: d,
		descender: f,
		lineGap: 0,
		advanceWidthMax: 0,
		minLeftSideBearing: 0,
		minRightSideBearing: 0,
		xMaxExtent: s[2],
		caretSlopeRise: 1,
		caretSlopeRun: 0,
		caretOffset: 0,
		reserved0: 0,
		reserved1: 0,
		reserved2: 0,
		reserved3: 0,
		metricDataFormat: 0,
		numberOfHMetrics: o
	};
	let p = [];
	for (let e = 0; e < o; e++) {
		let r = Se(n, e), i = r.defaultWidthX;
		if (a[e] && a[e].length > 0) {
			let n = Ae(a[e], r.globalSubrs, r.localSubrs, t);
			n.width !== void 0 && (i = n.width + r.nominalWidthX);
		}
		p.push({
			advanceWidth: i,
			lsb: 0
		});
	}
	if (u.hmtx = { hMetrics: p }, u.name = {
		format: 0,
		names: [
			{
				nameID: 1,
				platformID: 3,
				encodingID: 1,
				languageID: 1033,
				value: l
			},
			{
				nameID: 2,
				platformID: 3,
				encodingID: 1,
				languageID: 1033,
				value: "Regular"
			},
			{
				nameID: 4,
				platformID: 3,
				encodingID: 1,
				languageID: 1033,
				value: l
			},
			{
				nameID: 6,
				platformID: 3,
				encodingID: 1,
				languageID: 1033,
				value: l
			}
		]
	}, u.post = {
		version: 196608,
		italicAngle: i.ItalicAngle || 0,
		underlinePosition: i.UnderlinePosition || -100,
		underlineThickness: i.UnderlineThickness || 50,
		isFixedPitch: i.isFixedPitch || 0
	}, r?.encoding && typeof r.encoding != "string") {
		let e = r.encoding.codes || [], t = Array(256).fill(0);
		for (let n = 0; n < e.length && n < 256; n++) {
			let r = e[n];
			r >= 0 && r < 256 && (t[r] = n + 1);
		}
		u.cmap = {
			version: 0,
			subtables: [{
				platformID: 1,
				encodingID: 0,
				format: 0,
				glyphIdArray: t
			}]
		};
	}
	u["OS/2"] = {
		version: 4,
		xAvgCharWidth: 0,
		usWeightClass: 400,
		usWidthClass: 5,
		fsType: 0,
		ySubscriptXSize: Math.round(c * .65),
		ySubscriptYSize: Math.round(c * .6),
		ySubscriptXOffset: 0,
		ySubscriptYOffset: Math.round(c * .075),
		ySuperscriptXSize: Math.round(c * .65),
		ySuperscriptYSize: Math.round(c * .6),
		ySuperscriptXOffset: 0,
		ySuperscriptYOffset: Math.round(c * .35),
		yStrikeoutSize: Math.round(c * .05),
		yStrikeoutPosition: Math.round(c * .3),
		sFamilyClass: 0,
		panose: [
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0
		],
		ulUnicodeRange1: 0,
		ulUnicodeRange2: 0,
		ulUnicodeRange3: 0,
		ulUnicodeRange4: 0,
		achVendID: "    ",
		fsSelection: 64,
		usFirstCharIndex: 0,
		usLastCharIndex: 65535,
		sTypoAscender: d,
		sTypoDescender: f,
		sTypoLineGap: 0,
		usWinAscent: Math.abs(d),
		usWinDescent: Math.abs(f),
		ulCodePageRange1: 0,
		ulCodePageRange2: 0,
		sxHeight: Math.round(c * .5),
		sCapHeight: Math.round(c * .7),
		usDefaultChar: 0,
		usBreakChar: 32,
		usMaxContext: 0
	};
	let m = Pe({
		header: { sfVersion: 1330926671 },
		tables: u
	}, t);
	return m._standalone = "cff", m;
}
function Wv(e, t) {
	let n = new Uint8Array(e), r = [], i = [], a = 0;
	for (; a < n.length && n[a] === 128;) {
		let t = n[a + 1];
		if (t === 3) break;
		if (a + 6 > n.length) throw Error("Truncated PFB segment header.");
		let o = new DataView(e).getUint32(a + 2, !0);
		if (a += 6, o > n.length - a) throw Error("PFB segment outside input bounds.");
		let s = n.slice(a, a + o);
		a += o, t === 1 ? r.push(s) : t === 2 && i.push(s);
	}
	let o = ey(r), s = ey(i);
	return $v(new TextDecoder("latin1").decode(o), s, t);
}
function Gv(e, t) {
	let n = new TextDecoder("latin1").decode(new Uint8Array(e)), r = n.indexOf("currentfile eexec");
	if (r === -1) throw Error("PFA: could not find \"currentfile eexec\" marker");
	let i = n.slice(0, r + 17), a = n.slice(r + 17).replace(/\s/g, ""), o = a.search(/0{64,}$/), s = o > 0 ? a.slice(0, o) : a, c = new Uint8Array(s.length / 2);
	for (let e = 0; e < c.length; e++) c[e] = parseInt(s.slice(e * 2, e * 2 + 2), 16);
	return $v(i, c, t);
}
function Kv(e, t, n) {
	let r = new Uint8Array(e.length), i = t;
	for (let t = 0; t < e.length; t++) {
		let n = e[t];
		r[t] = n ^ i >>> 8, i = (n + i) * 52845 + 22719 & 65535;
	}
	return r.slice(n);
}
function qv(e, t, n) {
	let r = [], i = 0, a = [], o = [], s = null, c = 0, l = 0, u = 0, d = 0, f = [], p = !1;
	function m(e, t) {
		s && s.length > 0 && o.push(s), s = [{
			type: "M",
			x: e,
			y: t
		}];
	}
	function h(e, t) {
		s && s.push({
			type: "L",
			x: e,
			y: t
		});
	}
	function g(e, t, n, r, i, a) {
		s && s.push({
			type: "C",
			x1: e,
			y1: t,
			x2: n,
			y2: r,
			x: i,
			y: a
		});
	}
	function _(e, v) {
		if (v > 64) throw Error("Type 1 subroutine depth exceeds 64.");
		let y = 0;
		for (; y < e.length;) {
			if (++i > n.maxCharStringOperations) throw Error("Type 1 execution exceeds maxCharStringOperations.");
			if (r.length > 513) throw Error("Type 1 operand stack exceeds 513.");
			let b = e[y];
			if (b >= 32 && b <= 246) {
				r.push(b - 139), y++;
				continue;
			}
			if (b >= 247 && b <= 250) {
				r.push((b - 247) * 256 + e[y + 1] + 108), y += 2;
				continue;
			}
			if (b >= 251 && b <= 254) {
				r.push(-(b - 251) * 256 - e[y + 1] - 108), y += 2;
				continue;
			}
			if (b === 255) {
				let t = (e[y + 1] << 24 | e[y + 2] << 16 | e[y + 3] << 8 | e[y + 4]) >> 0;
				r.push(t), y += 5;
				continue;
			}
			if (b === 12) {
				let t = e[y + 1];
				switch (y += 2, t) {
					case 0:
						r.length = 0;
						break;
					case 6:
						r.length = 0;
						break;
					case 7:
						d = r[r.length - 4] || 0, u = r[r.length - 2] || 0, c = d, l = r[r.length - 3] || 0, r.length = 0;
						break;
					case 12: {
						let e = r.pop(), t = r.pop();
						r.push(e === 0 ? 0 : t / e);
						break;
					}
					case 16: {
						let e = r.pop(), t = r.pop(), n = r.splice(r.length - t, t);
						if (e === 0) {
							if (p = !1, f.length >= 7) {
								let e = f;
								g(e[1].x, e[1].y, e[2].x, e[2].y, e[3].x, e[3].y), g(e[4].x, e[4].y, e[5].x, e[5].y, e[6].x, e[6].y), c = e[6].x, l = e[6].y;
							}
							f = [], a.push(n[1]), a.push(n[0]);
						} else e === 1 ? (p = !0, f = [{
							x: c,
							y: l
						}], a.push(...n)) : e === 2 ? a.push(...n) : e === 3 ? a.push(3) : a.push(...n);
						break;
					}
					case 17:
						a.length > 0 ? r.push(a.pop()) : r.push(0);
						break;
					case 33:
						c = r[r.length - 2] || 0, l = r[r.length - 1] || 0, r.length = 0;
						break;
					default: r.length = 0;
				}
				continue;
			}
			switch (y++, b) {
				case 1:
				case 3:
					r.length = 0;
					break;
				case 4: {
					let e = r.pop() || 0;
					p ? (l += e, f.push({
						x: c,
						y: l
					})) : (l += e, m(c, l)), r.length = 0;
					break;
				}
				case 5: {
					let e = r.pop() || 0, t = r.pop() || 0;
					c += t, l += e, h(c, l), r.length = 0;
					break;
				}
				case 6: {
					let e = r.pop() || 0;
					c += e, h(c, l), r.length = 0;
					break;
				}
				case 7: {
					let e = r.pop() || 0;
					l += e, h(c, l), r.length = 0;
					break;
				}
				case 8: {
					let e = r.pop() || 0, t = r.pop() || 0, n = r.pop() || 0, i = r.pop() || 0, a = r.pop() || 0, o = r.pop() || 0, s = c + o, u = l + a, d = s + i, f = u + n;
					c = d + t, l = f + e, g(s, u, d, f, c, l), r.length = 0;
					break;
				}
				case 9:
					s && s.length > 0 && (o.push(s), s = null), r.length = 0;
					break;
				case 10: {
					let e = r.pop();
					e >= 0 && e < t.length && t[e] && _(t[e], v + 1);
					break;
				}
				case 11: return;
				case 13:
					u = r.pop() || 0, d = r.pop() || 0, c = d, r.length = 0;
					break;
				case 14:
					s && s.length > 0 && (o.push(s), s = null);
					return;
				case 21: {
					let e = r.pop() || 0, t = r.pop() || 0;
					p ? (c += t, l += e, f.push({
						x: c,
						y: l
					})) : (c += t, l += e, m(c, l)), r.length = 0;
					break;
				}
				case 22: {
					let e = r.pop() || 0;
					p ? (c += e, f.push({
						x: c,
						y: l
					})) : (c += e, m(c, l)), r.length = 0;
					break;
				}
				case 30: {
					let e = r.pop() || 0, t = r.pop() || 0, n = r.pop() || 0, i = r.pop() || 0, a = c, o = l + i, s = a + n, u = o + t;
					c = s + e, l = u, g(a, o, s, u, c, l), r.length = 0;
					break;
				}
				case 31: {
					let e = r.pop() || 0, t = r.pop() || 0, n = r.pop() || 0, i = r.pop() || 0, a = c + i, o = l, s = a + n, u = o + t;
					c = s, l = u + e, g(a, o, s, u, c, l), r.length = 0;
					break;
				}
				default: r.length = 0;
			}
		}
	}
	return _(e, 0), s && s.length > 0 && o.push(s), {
		contours: o,
		width: u
	};
}
function Jv(e) {
	let t = {};
	for (let n of [
		"FontName",
		"FamilyName",
		"FullName",
		"Weight",
		"version",
		"Notice"
	]) {
		let r = e.match(RegExp(`/${n}\\s*\\(([^)]*)\\)`));
		if (r) t[n] = r[1];
		else {
			let r = e.match(RegExp(`/${n}\\s+/([^\\s]+)`));
			r && (t[n] = r[1]);
		}
	}
	for (let n of [
		"PaintType",
		"FontType",
		"UniqueID",
		"ItalicAngle",
		"isFixedPitch",
		"UnderlinePosition",
		"UnderlineThickness"
	]) {
		let r = e.match(RegExp(`/${n}\\s+(-?[\\d.]+)`));
		r && (t[n] = parseFloat(r[1]));
	}
	let n = e.match(/\/isFixedPitch\s+(true|false)/);
	n && (t.isFixedPitch = +(n[1] === "true"));
	let r = e.match(/\/FontBBox\s*\{\s*(-?[\d.]+)\s+(-?[\d.]+)\s+(-?[\d.]+)\s+(-?[\d.]+)\s*\}/);
	if (r) t.FontBBox = r.slice(1, 5).map(Number);
	else {
		let n = e.match(/\/FontBBox\s*\[\s*(-?[\d.]+)\s+(-?[\d.]+)\s+(-?[\d.]+)\s+(-?[\d.]+)\s*\]/);
		n && (t.FontBBox = n.slice(1, 5).map(Number));
	}
	let i = e.match(/\/FontMatrix\s*\[\s*([\d.e+-]+)\s+([\d.e+-]+)\s+([\d.e+-]+)\s+([\d.e+-]+)\s+([\d.e+-]+)\s+([\d.e+-]+)\s*\]/);
	return i && (t.FontMatrix = i.slice(1, 7).map(Number)), t.encoding = Yv(e), t;
}
function Yv(e) {
	let t = /* @__PURE__ */ new Map(), n = /dup\s+(\d+)\s+\/([^\s]+)\s+put/g, r;
	for (; (r = n.exec(e)) !== null;) t.set(parseInt(r[1]), r[2]);
	return t;
}
function Xv(e, t) {
	let n = new TextDecoder("latin1").decode(e), r = n.match(/\/lenIV\s+(\d+)/), i = r ? parseInt(r[1]) : 4, a = {};
	for (let e of [
		"BlueFuzz",
		"BlueScale",
		"BlueShift",
		"ForceBold",
		"StdHW",
		"StdVW",
		"defaultWidthX",
		"nominalWidthX"
	]) {
		let t = n.match(RegExp(`/${e}\\s+(-?[\\d.]+)`));
		t && (a[e] = parseFloat(t[1]));
	}
	for (let e of [
		"BlueValues",
		"OtherBlues",
		"FamilyBlues",
		"FamilyOtherBlues",
		"StemSnapH",
		"StemSnapV"
	]) {
		let t = n.match(RegExp(`/${e}\\s*\\[([^\\]]+)\\]`));
		t && (a[e] = t[1].trim().split(/\s+/).map(Number));
	}
	let o = [], s = n.match(/\/Subrs\s+(\d+)\s+array/);
	if (s) {
		let t = parseInt(s[1]);
		if (t > 65535) throw Error("Type 1 subroutine count exceeds 65535.");
		Zv(n.slice(s.index), e.slice(Qv(e, s.index)), t, i, (e, n) => {
			if (e >= t) throw Error("Type 1 subroutine index outside declared array.");
			o[e] = n;
		});
	}
	let c = /* @__PURE__ */ new Map(), l = n.match(/\/CharStrings\s+(\d+)\s+dict/);
	if (l) {
		if (Number(l[1]) > t.maxGlyphs) throw Error("Type 1 glyph count exceeds maxGlyphs.");
		let r = n.slice(l.index), a = e.slice(Qv(e, l.index)), o = /\/([^\s]+)\s+(\d+)\s+(?:RD|-\|)\s/g, s;
		for (; (s = o.exec(r)) !== null;) {
			let e = s[1], n = parseInt(s[2]), r = Qv(a, s.index + s[0].length), o = Kv(a.slice(r, r + n), 4330, i);
			if (c.set(e, o), c.size > t.maxGlyphs) throw Error("Type 1 glyph count exceeds maxGlyphs.");
		}
	}
	return {
		charStrings: c,
		subrs: o,
		privateDict: a
	};
}
function Zv(e, t, n, r, i) {
	let a = /dup\s+(\d+)\s+(\d+)\s+(?:RD|-\|)\s/g, o;
	for (; (o = a.exec(e)) !== null;) {
		let e = parseInt(o[1]), n = parseInt(o[2]), a = Qv(t, o.index + o[0].length);
		i(e, Kv(t.slice(a, a + n), 4330, r));
	}
}
function Qv(e, t) {
	return t;
}
function $v(e, t, n) {
	let r = Kv(t, 55665, 4), i = Jv(e), { charStrings: a, subrs: o, privateDict: s } = Xv(r, n);
	if (a.size + +!a.has(".notdef") > n.maxGlyphs) throw Error("Type 1 glyph count exceeds maxGlyphs.");
	let c = i.FontBBox || [
		0,
		0,
		1e3,
		1e3
	], l = i.FontMatrix || [
		.001,
		0,
		0,
		.001,
		0,
		0
	], u = Math.round(1 / l[0]), d = i.FontName || i.FamilyName || "Type1Font", f = c[3], p = c[1], m = [], h = [];
	if (a.has(".notdef")) {
		let e = qv(a.get(".notdef"), o, n);
		m.push({
			name: ".notdef",
			unicode: null,
			advanceWidth: e.width,
			contours: e.contours.length > 0 ? e.contours : void 0
		}), h.push(".notdef");
	} else m.push({
		name: ".notdef",
		unicode: null,
		advanceWidth: 0
	}), h.push(".notdef");
	let g = /* @__PURE__ */ new Map();
	for (let [e, t] of i.encoding) g.set(t, e);
	for (let [e, t] of a) {
		if (e === ".notdef") continue;
		let r = qv(t, o, n), i = g.get(e) ?? null;
		m.push({
			name: e,
			unicode: i,
			advanceWidth: r.width,
			contours: r.contours.length > 0 ? r.contours : void 0
		}), h.push(e);
	}
	let _ = {
		font: {
			familyName: i.FamilyName || d,
			styleName: "Regular",
			fullName: i.FullName || d,
			postScriptName: d,
			unitsPerEm: u,
			ascender: f,
			descender: p,
			lineGap: 0,
			created: (/* @__PURE__ */ new Date()).toISOString().slice(0, 19) + "Z",
			modified: (/* @__PURE__ */ new Date()).toISOString().slice(0, 19) + "Z"
		},
		glyphs: m,
		tables: {},
		_header: { sfVersion: 1330926671 },
		_standalone: "type1"
	};
	return i.Weight && (_.font.weight = i.Weight), i.version && (_.font.version = i.version), i.Notice && (_.font.copyright = i.Notice), _;
}
function ey(e) {
	let t = e.reduce((e, t) => e + t.length, 0), n = new Uint8Array(t), r = 0;
	for (let t of e) n.set(t, r), r += t.length;
	return n;
}
//#endregion
//#region src/json.js
var ty = /* @__PURE__ */ new Set([
	"_dirty",
	"_fileName",
	"_originalBuffer",
	"_collection",
	"_collectionFonts"
]);
function ny(e, t = 2) {
	let n = {
		...e,
		_schemaVersion: 1
	};
	return JSON.stringify(n, function(e, t) {
		if (!(this === n && ty.has(e))) {
			if (typeof t == "bigint") {
				let e = Number(t);
				return Number.isSafeInteger(e) ? e : { $fontFluxBigInt: t.toString() };
			}
			return ArrayBuffer.isView(t) && !(t instanceof DataView) ? Array.from(t) : t;
		}
	}, t);
}
function ry(e) {
	let t = JSON.parse(e, (e, t) => {
		if (t && typeof t == "object" && Object.keys(t).length === 1 && typeof t.$fontFluxBigInt == "string") {
			if (!/^-?\d+$/.test(t.$fontFluxBigInt)) throw Error("Invalid exact integer encoding.");
			return BigInt(t.$fontFluxBigInt);
		}
		return t;
	});
	if (t?._schemaVersion !== void 0 && t._schemaVersion !== 1) throw Error(`Unsupported Font Flux JSON schema version: ${t._schemaVersion}`);
	return t && typeof t == "object" && delete t._schemaVersion, t;
}
//#endregion
//#region src/kerning.js
function iy(e) {
	if (!e || typeof e != "object") throw Error("createKerning: input is required (object or array)");
	let t = Array.isArray(e) ? e : [e], n = {}, r = [];
	for (let e of t) if (e.classes) for (let [t, r] of Object.entries(e.classes)) {
		if (!Array.isArray(r)) throw Error(`createKerning: class "${t}" must be an array of glyph names`);
		n[t] = r;
	}
	for (let e of t) if (e.left !== void 0 && e.right !== void 0 && e.value !== void 0) ay(e.left, e.right, e.value, n, r);
	else if (e.left !== void 0 && e.pairs) {
		let t = cy(e.left, n);
		for (let [i, a] of Object.entries(e.pairs)) {
			let e = cy(i, n);
			for (let n of t) for (let t of e) r.push({
				left: n,
				right: t,
				value: a
			});
		}
	} else if (e.groups) for (let [t, i] of Object.entries(e.groups)) {
		let e = cy(t, n);
		for (let [t, a] of Object.entries(i)) {
			let i = cy(t, n);
			for (let t of e) for (let e of i) r.push({
				left: t,
				right: e,
				value: a
			});
		}
	}
	else if (e.classes && e.pairs) for (let t of e.pairs) ay(t.left, t.right, t.value, n, r);
	let i = /* @__PURE__ */ new Map();
	for (let e of r) i.set(`${e.left}\0${e.right}`, e);
	return [...i.values()];
}
function ay(e, t, n, r, i) {
	let a = cy(e, r), o = cy(t, r);
	for (let e of a) for (let t of o) i.push({
		left: e,
		right: t,
		value: n
	});
}
function oy(e, t, n) {
	let r = e?.kerning, i = e?.kerningClasses, a = Array.isArray(r) && r.length > 0, o = Array.isArray(i) && i.some((e) => e && Array.isArray(e.pairs) && e.pairs.length > 0);
	if (!a && !o) return;
	let s = e.glyphs, c = T(s, t), l = T(s, n);
	if (c !== void 0 && l !== void 0) {
		if (a) for (let e = r.length - 1; e >= 0; e--) {
			let t = r[e];
			if (t.left === c && t.right === l) return t.value;
		}
		if (o) for (let e = i.length - 1; e >= 0; e--) {
			let t = sy(i[e], c, l);
			if (t !== void 0) return t;
		}
	}
}
function sy(e, t, n) {
	let { leftClasses: r = {}, rightClasses: i = {}, pairs: a = [] } = e, o = (e, t, n) => {
		if (typeof e == "string" && e.startsWith("@")) {
			let r = n[e.slice(1)];
			return Array.isArray(r) && r.includes(t);
		}
		return e === t;
	};
	for (let e = a.length - 1; e >= 0; e--) {
		let s = a[e];
		if (o(s.left, t, r) && o(s.right, n, i)) return s.value;
	}
}
function cy(e, t) {
	if (typeof e == "string" && e.startsWith("@")) {
		let n = e.slice(1), r = t[n];
		if (!r) throw Error(`createKerning: unknown class "@${n}"`);
		return r;
	}
	return [e];
}
//#endregion
//#region src/substitution.js
function ly(e) {
	if (!e || typeof e != "object") throw Error("createSubstitution: input is required (object or array)");
	let t = Array.isArray(e) ? e : [e], n = {}, r = [];
	for (let e of t) if (e.classes) for (let [t, r] of Object.entries(e.classes)) {
		if (!Array.isArray(r)) throw Error(`createSubstitution: class "${t}" must be an array of glyph names`);
		n[t] = r;
	}
	for (let e of t) {
		let t = e.type;
		if (!t) throw Error("createSubstitution: each rule must have a \"type\" (single, multiple, alternate, ligature, reverse, contextual)");
		let i = e.feature || "liga", a = e.script || "DFLT", o = e.language || null;
		if (t === "contextual") {
			if (!Array.isArray(e.input) || e.input.length === 0) throw Error("createSubstitution: contextual rules require a non-empty \"input\" array");
			if (!Array.isArray(e.actions) || e.actions.length === 0) throw Error("createSubstitution: contextual rules require a non-empty \"actions\" array");
			let s = {
				type: t,
				feature: i,
				script: a,
				language: o,
				backtrack: py(e.backtrack, n),
				input: py(e.input, n),
				lookahead: py(e.lookahead, n),
				actions: e.actions.map((e) => my(e, n))
			};
			e.lookup && (s.lookup = { ...e.lookup }), r.push(s);
			continue;
		}
		let s = e.substitutions ? e.substitutions : e.substitution ? [e.substitution] : [];
		if (s.length === 0) throw Error(`createSubstitution: rule of type "${t}" must have "substitution" or "substitutions"`);
		for (let c of s) {
			let s = {
				type: t,
				feature: i,
				script: a,
				language: o
			}, l = c.lookup || e.lookup;
			switch (l && (s.lookup = { ...l }), t) {
				case "single":
					r.push({
						...s,
						from: dy(c.from, n),
						to: dy(c.to, n)
					});
					break;
				case "multiple":
					r.push({
						...s,
						from: dy(c.from, n),
						to: fy(c.to, n)
					});
					break;
				case "alternate":
					r.push({
						...s,
						from: dy(c.from, n),
						alternates: fy(c.alternates, n)
					});
					break;
				case "ligature":
					r.push({
						...s,
						components: fy(c.components, n),
						ligature: dy(c.ligature, n)
					});
					break;
				case "reverse":
					r.push({
						...s,
						from: dy(c.from, n),
						to: dy(c.to, n),
						backtrack: (c.backtrack || []).map((e) => fy(e, n)),
						lookahead: (c.lookahead || []).map((e) => fy(e, n))
					});
					break;
				default: throw Error(`createSubstitution: unknown type "${t}". Valid: single, multiple, alternate, ligature, reverse, contextual`);
			}
		}
	}
	return r;
}
function uy(e, t, n = {}) {
	let r = e?.substitutions;
	if (!r || !Array.isArray(r) || r.length === 0) return [];
	let i = e.glyphs, a = T(i, t);
	return a === void 0 ? [] : r.filter((e) => {
		if (n.type && e.type !== n.type || n.feature && e.feature !== n.feature) return !1;
		switch (e.type) {
			case "single":
			case "multiple":
			case "alternate":
			case "reverse": return e.from === a;
			case "ligature": return e.components && e.components.includes(a);
			case "contextual": return [
				...e.backtrack,
				...e.input,
				...e.lookahead
			].some((e) => e.includes(a));
			default: return !1;
		}
	});
}
function dy(e, t) {
	if (typeof e == "string" && e.startsWith("@")) {
		let n = e.slice(1), r = t[n];
		if (!r) throw Error(`createSubstitution: unknown class "@${n}"`);
		return r;
	}
	return e;
}
function fy(e, t) {
	if (!Array.isArray(e)) throw Error("createSubstitution: expected an array of glyph references");
	let n = [];
	for (let r of e) if (typeof r == "string" && r.startsWith("@")) {
		let e = r.slice(1), i = t[e];
		if (!i) throw Error(`createSubstitution: unknown class "@${e}"`);
		n.push(...i);
	} else n.push(r);
	return n;
}
function py(e, t) {
	return (e || []).map((e) => fy(e, t));
}
function my(e, t) {
	if (!Number.isInteger(e.at) || e.at < 0) throw Error("createSubstitution: contextual action \"at\" must be a non-negative integer");
	let n = e.substitutions || (e.substitution ? [e.substitution] : []);
	if (n.length === 0) throw Error("createSubstitution: contextual actions require \"substitution\" or \"substitutions\"");
	let r = [];
	for (let i of n) {
		let n = ly({
			type: i.type || e.type,
			feature: "DFLT",
			substitution: i,
			classes: t
		});
		r.push(...n.map(({ feature: e, script: t, language: n, lookup: r, ...i }) => i));
	}
	let i = {
		at: e.at,
		substitutions: r
	};
	return e.lookup && (i.lookup = { ...e.lookup }), i;
}
//#endregion
//#region src/validate/diagnoseFont.js
var hy = /* @__PURE__ */ new Map([
	[65536, "TrueType"],
	[1330926671, "OpenType (CFF)"],
	[1953658213, "TrueType (Apple)"]
]);
function $(e, t, n, r) {
	e.push({
		severity: t,
		code: n,
		message: r
	});
}
function gy(e) {
	let t = e.filter((e) => e.severity === "error"), n = e.filter((e) => e.severity === "warning"), r = e.filter((e) => e.severity === "info");
	return {
		valid: t.length === 0,
		errors: t,
		warnings: n,
		infos: r,
		issues: e,
		summary: {
			errorCount: t.length,
			warningCount: n.length,
			infoCount: r.length,
			issueCount: e.length
		}
	};
}
function _y(e) {
	for (let t = 0; t < e.length; t++) {
		let n = e.charCodeAt(t);
		if (n < 32 || n > 126) return !1;
	}
	return !0;
}
function vy(e, t, n) {
	let r = new DataView(e.buffer, e.byteOffset, e.byteLength), i = 0, a = n & -4;
	for (let e = 0; e < a; e += 4) i = i + r.getUint32(t + e) >>> 0;
	if (n & 3) {
		let r = 0;
		for (let i = a; i < n; i++) r |= e[t + i] << 24 - 8 * (i - a);
		i = i + r >>> 0;
	}
	return i;
}
function yy(e, t) {
	if (!(e instanceof ArrayBuffer)) return $(t, "error", "NOT_ARRAYBUFFER", "Input is not an ArrayBuffer."), null;
	if (e.byteLength < 12) return $(t, "error", "TOO_SHORT", `File is only ${e.byteLength} bytes — too short for a valid font header (minimum 12 bytes).`), null;
	let n = new Uint8Array(e), r = String.fromCharCode(n[0], n[1], n[2], n[3]);
	if (r === "wOFF") {
		$(t, "info", "FORMAT_WOFF1", "File is WOFF1-wrapped."), Ry(e, t);
		try {
			let { sfnt: n } = L_(e);
			return $(t, "info", "WOFF1_UNWRAPPED", "WOFF1 wrapper decompressed successfully."), {
				format: "woff1",
				sfnt: n
			};
		} catch (e) {
			return $(t, "error", "WOFF1_UNWRAP_FAILED", `WOFF1 decompression failed: ${e.message}`), null;
		}
	}
	if (r === "wOF2") {
		$(t, "info", "FORMAT_WOFF2", "File is WOFF2-wrapped."), zy(e, t);
		try {
			let { sfnt: n } = cv(e);
			return $(t, "info", "WOFF2_UNWRAPPED", "WOFF2 wrapper decompressed successfully."), {
				format: "woff2",
				sfnt: n
			};
		} catch (e) {
			return $(t, "error", "WOFF2_UNWRAP_FAILED", `WOFF2 decompression failed: ${e.message}`), null;
		}
	}
	return r === "ttcf" ? ($(t, "info", "FORMAT_COLLECTION", "File is a font collection (TTC/OTC). Diagnosing the first font in the collection."), {
		format: "collection",
		sfnt: e
	}) : {
		format: "sfnt",
		sfnt: e
	};
}
function by(e, t) {
	let n = new F(new Uint8Array(e)), r;
	try {
		r = {
			sfVersion: n.uint32(),
			numTables: n.uint16(),
			searchRange: n.uint16(),
			entrySelector: n.uint16(),
			rangeShift: n.uint16()
		};
	} catch (e) {
		return $(t, "error", "HEADER_UNREADABLE", `Could not read font header: ${e.message}`), null;
	}
	let i = hy.get(r.sfVersion);
	i ? $(t, "info", "SF_VERSION", `sfVersion indicates ${i}.`) : $(t, "error", "BAD_SF_VERSION", `Unrecognized sfVersion ${"0x" + r.sfVersion.toString(16).padStart(8, "0")}. Expected 0x00010000 (TrueType), 0x4F54544F (OTTO), or 0x74727565 ('true').`), r.numTables === 0 ? $(t, "error", "NO_TABLES", "numTables is 0 — the font contains no tables.") : r.numTables > 200 && $(t, "warning", "EXCESSIVE_TABLES", `numTables is ${r.numTables}, which is unusually high.`);
	let a = 12 + r.numTables * 16;
	if (a > e.byteLength) return $(t, "error", "DIRECTORY_TRUNCATED", `Table directory requires ${a} bytes but the file is only ${e.byteLength} bytes. The file appears truncated.`), null;
	if (r.numTables > 0) {
		let e = 2 ** Math.floor(Math.log2(r.numTables)), n = e * 16, i = Math.floor(Math.log2(e)), a = r.numTables * 16 - n;
		r.searchRange !== n && $(t, "warning", "BAD_SEARCH_RANGE", `searchRange is ${r.searchRange}, expected ${n}.`), r.entrySelector !== i && $(t, "warning", "BAD_ENTRY_SELECTOR", `entrySelector is ${r.entrySelector}, expected ${i}.`), r.rangeShift !== a && $(t, "warning", "BAD_RANGE_SHIFT", `rangeShift is ${r.rangeShift}, expected ${a}.`);
	}
	return r;
}
function xy(e, t, n) {
	let r = new F(new Uint8Array(e), 12), i = [], a = /* @__PURE__ */ new Set();
	for (let o = 0; o < t.numTables; o++) {
		let t;
		try {
			t = {
				tag: r.tag(),
				checksum: r.uint32(),
				offset: r.uint32(),
				length: r.uint32()
			};
		} catch (e) {
			$(n, "error", "DIRECTORY_ENTRY_UNREADABLE", `Could not read table directory entry ${o}: ${e.message}`);
			continue;
		}
		if (!_y(t.tag)) {
			let e = [...t.tag].map((e) => e.charCodeAt(0).toString(16).padStart(2, "0")).join(" ");
			$(n, "error", "BAD_TABLE_TAG", `Table ${o} has non-printable tag bytes (${e}).`);
		}
		a.has(t.tag) && $(n, "error", "DUPLICATE_TABLE", `Duplicate table tag '${t.tag}'.`), a.add(t.tag), t.offset + t.length > e.byteLength && $(n, "error", "TABLE_OUT_OF_BOUNDS", `Table '${t.tag}' extends beyond end of file (offset ${t.offset} + length ${t.length} = ${t.offset + t.length}, but file is ${e.byteLength} bytes).`), t.length === 0 && $(n, "warning", "EMPTY_TABLE", `Table '${t.tag}' has zero length.`), t.offset % 4 != 0 && $(n, "warning", "TABLE_MISALIGNED", `Table '${t.tag}' at offset ${t.offset} is not 4-byte aligned.`), i.push(t);
	}
	for (let e = 1; e < i.length; e++) if (i[e - 1].tag.padEnd(4, " ") >= i[e].tag.padEnd(4, " ")) {
		$(n, "error", "DIRECTORY_NOT_SORTED", `Table directory is not sorted: '${i[e - 1].tag}' precedes '${i[e].tag}'. Tables must be sorted in ascending order by 4-byte tag.`);
		break;
	}
	for (let e of i) e.length > 1073741824 && $(n, "error", "TABLE_LENGTH_EXCEEDS_1GB", `Table '${e.tag}' has length ${e.length} bytes (> 1 GiB); Firefox/OTS will reject it.`);
	let o = i.filter((t) => t.length > 0 && t.offset + t.length <= e.byteLength).slice().sort((e, t) => e.offset - t.offset);
	for (let e = 1; e < o.length; e++) {
		let t = o[e - 1], r = o[e], i = t.offset + t.length;
		i > r.offset && $(n, "error", "TABLES_OVERLAPPING", `Tables '${t.tag}' and '${r.tag}' overlap (${t.tag} ends at ${i}, ${r.tag} starts at ${r.offset}).`);
	}
	return i;
}
function Sy(e, t) {
	let n = new Set(e.map((e) => e.tag));
	for (let e of An) n.has(e) || $(t, "error", "MISSING_REQUIRED_TABLE", `Required table '${e}' is missing.`);
	let r = n.has("glyf") && n.has("loca"), i = n.has("CFF ") || n.has("CFF2");
	!r && !i && $(t, "error", "NO_OUTLINES", "No outline data found. Expected glyf+loca (TrueType) or CFF/CFF2 (OpenType)."), r && i && $(t, "warning", "MIXED_OUTLINES", "Font has both TrueType (glyf) and CFF outlines — unusual.");
	for (let e of n) kn.has(e) || $(t, "info", "UNKNOWN_TABLE", `Unrecognized table '${e}' — will be preserved as raw bytes.`);
}
function Cy(e, t, n) {
	let r = new Uint8Array(e);
	for (let i of t) {
		if (i.offset + i.length > e.byteLength || i.length === 0 || i.tag === "head") continue;
		let t = vy(r, i.offset, i.length);
		t !== i.checksum && $(n, "warning", "BAD_CHECKSUM", `Table '${i.tag}' checksum mismatch: directory says 0x${i.checksum.toString(16).padStart(8, "0")}, computed 0x${t.toString(16).padStart(8, "0")}.`);
	}
}
function wy(e, t, n) {
	let r = new Map(t.map((e) => [e.tag, e])), i = {}, a = Pv.filter((e) => r.has(e)), o = t.map((e) => e.tag).filter((e) => !a.includes(e)), s = [...a, ...o];
	for (let t of s) {
		let a = r.get(t);
		if (a.offset + a.length > e.byteLength) continue;
		let o = Nv[t];
		if (o) try {
			let r = new Uint8Array(e, a.offset, a.length);
			i[t] = o(Array.from(r), i), $(n, "info", "TABLE_PARSED", `Table '${t}' parsed successfully.`);
		} catch (e) {
			$(n, "error", "TABLE_PARSE_FAILED", `Table '${t}' failed to parse: ${e.message}`);
		}
	}
	return i;
}
function Ty(e) {
	return e >= 6155 && e <= 6157 || e >= 65024 && e <= 65039 || e >= 917760 && e <= 917999;
}
function Ey(e) {
	if (e.idRangeOffset === 0) {
		let t = e.startCode + e.idDelta & 65535, n = e.endCode + e.idDelta & 65535;
		return Math.max(t, n);
	}
	return null;
}
function Dy(e, t, n) {
	typeof e.version == "number" && e.version !== 0 && $(n, "error", "CMAP_VERSION_INVALID", `cmap.version is ${e.version}; must be 0.`);
	let r = e.encodingRecords || [], i = e.subtables || [];
	if (r.length === 0) {
		$(n, "error", "CMAP_NO_SUBTABLES", "cmap has no encoding records.");
		return;
	}
	let a = !1;
	for (let e of r) {
		let t = i[e.subtableIndex];
		if (!t) continue;
		let n = t.format, r = `${e.platformID}-${e.encodingID}-${n}`;
		if (r === "3-1-4" || r === "3-10-12" || r === "3-10-13" || r === "0-3-4" || r === "3-0-4") {
			a = !0;
			break;
		}
	}
	a || $(n, "error", "CMAP_NO_SUPPORTED_SUBTABLE", "cmap has no supported Unicode subtable (expected one of (3,1,4), (3,10,12), (3,10,13), (0,3,4), or (3,0,4)).");
	for (let e of r) {
		if (e.platformID !== 3) continue;
		let t = i[e.subtableIndex];
		if (t && t.language !== void 0 && t.language !== 0) {
			$(n, "error", "CMAP_LANGUAGE_NONZERO_FOR_WINDOWS", `cmap subtable (pid=3, eid=${e.encodingID}, fmt=${t.format}) has language=${t.language}; Windows-platform subtables must use language=0.`);
			break;
		}
	}
	let o = t?.numGlyphs;
	for (let e = 0; e < i.length; e++) {
		let t = i[e];
		if (!t) continue;
		let r = t.format;
		if (r === 4) {
			let r = t.segments || [];
			if (r.length < 1) {
				$(n, "error", "CMAP_FORMAT4_SEGCOUNT_INVALID", `cmap format-4 subtable ${e} has no segments.`);
				continue;
			}
			let i = r[r.length - 1];
			(i.startCode !== 65535 || i.endCode !== 65535) && $(n, "error", "CMAP_FORMAT4_INVALID_TERMINATOR", `cmap format-4 subtable ${e}: final segment is [${i.startCode.toString(16)}-${i.endCode.toString(16)}], must be [FFFF-FFFF].`);
			let a = -1;
			for (let t = 0; t < r.length; t++) {
				let i = r[t];
				if (i.startCode > i.endCode) {
					$(n, "error", "CMAP_FORMAT4_RANGES_OUT_OF_ORDER", `cmap format-4 subtable ${e} segment ${t}: startCode (0x${i.startCode.toString(16)}) > endCode (0x${i.endCode.toString(16)}).`);
					break;
				}
				if (i.endCode <= a) {
					$(n, "error", "CMAP_FORMAT4_RANGES_OUT_OF_ORDER", `cmap format-4 subtable ${e} segment ${t}: endCode (0x${i.endCode.toString(16)}) is not greater than previous endCode (0x${a.toString(16)}).`);
					break;
				}
				a = i.endCode;
			}
			if (o !== void 0) {
				let i = !1;
				for (let t = 0; t < r.length && !i; t++) {
					let a = r[t], s = Ey(a);
					s !== null && s >= o && ($(n, "error", "CMAP_GLYPH_OUT_OF_RANGE", `cmap format-4 subtable ${e} segment ${t}: glyph id ${s} >= numGlyphs (${o}).`), i = !0);
				}
				let a = t.glyphIdArray || [];
				for (let t = 0; t < a.length && !i; t++) a[t] !== 0 && a[t] >= o && ($(n, "error", "CMAP_GLYPH_OUT_OF_RANGE", `cmap format-4 subtable ${e} glyphIdArray[${t}] = ${a[t]} >= numGlyphs (${o}).`), i = !0);
			}
		} else if (r === 12 || r === 13) {
			let i = t.groups || [], a = -1, s = !1, c = !1;
			for (let t = 0; t < i.length; t++) {
				let l = i[t];
				if (l.endCharCode < l.startCharCode && !s) {
					$(n, "error", "CMAP_FORMAT12_END_BEFORE_START", `cmap format-${r} subtable ${e} group ${t}: endCharCode (0x${l.endCharCode.toString(16)}) < startCharCode (0x${l.startCharCode.toString(16)}).`), s = !0;
					break;
				}
				if (l.startCharCode <= a && !s) {
					$(n, "error", "CMAP_FORMAT12_GROUPS_OUT_OF_ORDER", `cmap format-${r} subtable ${e} group ${t}: startCharCode (0x${l.startCharCode.toString(16)}) is not greater than previous endCharCode (0x${a.toString(16)}).`), s = !0;
					break;
				}
				if (a = l.endCharCode, o !== void 0 && !c) {
					if (r === 12) {
						let r = l.endCharCode - l.startCharCode, i = l.startGlyphID + r;
						i >= o && ($(n, "error", "CMAP_GLYPH_OUT_OF_RANGE", `cmap format-12 subtable ${e} group ${t}: maps to glyph id ${i} >= numGlyphs (${o}).`), c = !0);
					} else r === 13 && l.glyphID >= o && ($(n, "error", "CMAP_GLYPH_OUT_OF_RANGE", `cmap format-13 subtable ${e} group ${t}: glyphID ${l.glyphID} >= numGlyphs (${o}).`), c = !0);
				}
			}
		} else if (r === 14) {
			let r = t.varSelectorRecords || [], i = -1, a = !1, s = !1;
			for (let t = 0; t < r.length; t++) {
				let c = r[t];
				if (!Ty(c.varSelector) && !s) {
					$(n, "error", "CMAP_FORMAT14_VS_OUT_OF_RANGE", `cmap format-14 subtable ${e} record ${t}: varSelector U+${c.varSelector.toString(16).toUpperCase()} is not in a valid variation-selector range.`), s = !0;
					break;
				}
				if (c.varSelector <= i && !a) {
					$(n, "error", "CMAP_FORMAT14_VS_OUT_OF_ORDER", `cmap format-14 subtable ${e} record ${t}: varSelector U+${c.varSelector.toString(16).toUpperCase()} is not greater than previous (U+${i.toString(16).toUpperCase()}).`), a = !0;
					break;
				}
				if (i = c.varSelector, o !== void 0 && c.nonDefaultUVS) {
					for (let r of c.nonDefaultUVS) if (r.glyphID >= o) {
						$(n, "error", "CMAP_GLYPH_OUT_OF_RANGE", `cmap format-14 subtable ${e} record ${t}: nonDefaultUVS mapping has glyphID ${r.glyphID} >= numGlyphs (${o}).`);
						break;
					}
				}
			}
		}
	}
}
var Oy = 783, ky = 127;
function Ay(e, t, n) {
	typeof e.usWeightClass == "number" && (e.usWeightClass < 1 || e.usWeightClass > 1e3) && $(n, "warning", "OS2_WEIGHT_CLAMPED", `OS/2.usWeightClass is ${e.usWeightClass}; must be in [1, 1000].`), typeof e.usWidthClass == "number" && (e.usWidthClass < 1 || e.usWidthClass > 9) && $(n, "warning", "OS2_WIDTH_CLAMPED", `OS/2.usWidthClass is ${e.usWidthClass}; must be in [1, 9].`), typeof e.fsType == "number" && e.fsType & -784 && $(n, "warning", "OS2_FSTYPE_RESERVED_BITS_SET", `OS/2.fsType has reserved bits set (0x${(e.fsType >>> 0).toString(16).padStart(4, "0")}); valid mask is 0x${Oy.toString(16).padStart(4, "0")}.`);
	for (let t of [
		"ySubscriptXSize",
		"ySubscriptYSize",
		"ySuperscriptXSize",
		"ySuperscriptYSize",
		"yStrikeoutSize"
	]) if (typeof e[t] == "number" && e[t] < 0) {
		$(n, "warning", "OS2_NEGATIVE_SIZE", `OS/2.${t} is ${e[t]}; must be ≥ 0.`);
		break;
	}
	if (typeof e.usFirstCharIndex == "number" && typeof e.usLastCharIndex == "number" && e.usFirstCharIndex > e.usLastCharIndex && $(n, "warning", "OS2_FIRST_LAST_CHAR_INVERTED", `OS/2.usFirstCharIndex (${e.usFirstCharIndex}) > usLastCharIndex (${e.usLastCharIndex}).`), typeof e.sTypoLineGap == "number" && e.sTypoLineGap < 0 && $(n, "warning", "OS2_TYPO_LINEGAP_NEGATIVE", `OS/2.sTypoLineGap is ${e.sTypoLineGap}; must be ≥ 0.`), typeof e.sxHeight == "number" && e.sxHeight < 0 && $(n, "warning", "OS2_X_HEIGHT_NEGATIVE", `OS/2.sxHeight is ${e.sxHeight}; must be ≥ 0.`), typeof e.sCapHeight == "number" && e.sCapHeight < 0 && $(n, "warning", "OS2_CAP_HEIGHT_NEGATIVE", `OS/2.sCapHeight is ${e.sCapHeight}; must be ≥ 0.`), typeof e.usLowerOpticalPointSize == "number" && e.usLowerOpticalPointSize > 65534 && $(n, "warning", "OS2_OPTICAL_POINTSIZE_OUT_OF_RANGE", `OS/2.usLowerOpticalPointSize is ${e.usLowerOpticalPointSize}; must be ≤ 0xFFFE.`), typeof e.usUpperOpticalPointSize == "number" && e.usUpperOpticalPointSize < 2 && $(n, "warning", "OS2_OPTICAL_POINTSIZE_OUT_OF_RANGE", `OS/2.usUpperOpticalPointSize is ${e.usUpperOpticalPointSize}; must be ≥ 2.`), t && typeof e.fsSelection == "number" && typeof t.macStyle == "number") {
		let r = !!(e.fsSelection & 1), i = !!(e.fsSelection & 32), a = !!(t.macStyle & 1), o = !!(t.macStyle & 2);
		(r !== o || i !== a) && $(n, "warning", "OS2_FSSELECTION_HEAD_MACSTYLE_MISMATCH", `OS/2.fsSelection (italic=${r}, bold=${i}) does not match head.macStyle (italic=${o}, bold=${a}).`), t.macStyle & -128 && $(n, "warning", "HEAD_MACSTYLE_RESERVED_BITS_SET", `head.macStyle has reserved bits set (0x${t.macStyle.toString(16).padStart(4, "0")}); valid mask is 0x${ky.toString(16).padStart(4, "0")}.`);
	}
}
var jy = 32768, My = 200, Ny = /[\x00-\x20\x7F-\uFFFF[\](){}<>/%]/;
function Py(e, t, n, r) {
	typeof e.version == "number" && e.version > 1 && $(r, "error", "NAME_FORMAT_INVALID", `name table format is ${e.version}; must be 0 or 1.`);
	let i = t.find((e) => e.tag === "name");
	if (i && i.length >= 6 && i.offset + i.length <= n.byteLength) {
		let e = new DataView(n, i.offset, i.length), t = e.getUint16(2), a = e.getUint16(4), o = 6 + t * 12;
		(a < o || a > i.length) && $(r, "error", "NAME_STRING_OFFSET_INVALID", `name.stringOffset (${a}) is outside the table (records end at ${o}, table length ${i.length}).`);
		let s = !1, c = Math.min(t, Math.floor((i.length - 6) / 12));
		for (let t = 0; t < c; t++) {
			let n = 6 + t * 12, o = e.getUint16(n + 8), c = a + e.getUint16(n + 10), l = c + o;
			l > i.length && (s ||= ($(r, "error", "NAME_RECORD_OUT_OF_BOUNDS", `name record ${t} string overruns the table (offset ${c} + length ${o} = ${l}, table length ${i.length}).`), !0)), o > jy && $(r, "warning", "NAME_STRING_TOO_LONG", `name record ${t} (nameID=${e.getUint16(n + 6)}) is ${o} bytes; > ${jy} is suspicious.`);
		}
	}
	if (Array.isArray(e.langTagRecords)) for (let t = 0; t < e.langTagRecords.length; t++) {
		let n = (e.langTagRecords[t].tag ?? "").length * 2;
		n > My && $(r, "error", "NAME_LANG_TAG_TOO_LONG", `name.langTagRecord ${t} is ${n} bytes; spec limit is ${My}.`);
	}
	let a = e.nameRecords ?? e.names ?? e.records ?? [];
	for (let e of a) {
		if (e.nameID !== 6) continue;
		let t = e.value ?? e.string ?? "";
		if (typeof t == "string" && Ny.test(t)) {
			$(r, "warning", "NAME_POSTSCRIPT_NAME_INVALID_CHARS", `PostScript name "${t}" contains invalid characters; only printable 7-bit ASCII excluding [](){}<>/% is allowed.`);
			break;
		}
	}
}
var Fy = 44, Iy = 20, Ly = 48;
function Ry(e, t) {
	if (e.byteLength < Fy) return;
	let n = new DataView(e), r = n.getUint32(8), i = n.getUint16(12), a = n.getUint16(14), o = n.getUint32(16), s = n.getUint32(24), c = n.getUint32(28), l = n.getUint32(36), u = n.getUint32(40);
	a !== 0 && $(t, "error", "WOFF1_RESERVED_FIELD_NONZERO", `WOFF1 header reserved field is 0x${a.toString(16)}; must be 0.`), r !== e.byteLength && $(t, "error", "WOFF1_FILE_SIZE_MISMATCH", `WOFF1 header.length (${r}) does not match file size (${e.byteLength}).`);
	let d = Fy + i * Iy;
	if (d <= e.byteLength) {
		let e = 12 + 16 * i;
		for (let t = 0; t < i; t++) {
			let r = n.getUint32(Fy + t * Iy + 12);
			e += r + 3 & -4;
		}
		e !== o && $(t, "error", "WOFF1_SFNT_SIZE_MISMATCH", `WOFF1 header.totalSfntSize (${o}) does not match computed size from directory (${e}).`);
	}
	s === 0 == (c === 0) ? c > 0 && (s < d || s + c > e.byteLength) && $(t, "error", "WOFF1_METADATA_BLOCK_INVALID", `WOFF1 metadata block (offset ${s}, length ${c}) is out of bounds (file size ${e.byteLength}, directory ends at ${d}).`) : $(t, "error", "WOFF1_METADATA_BLOCK_INVALID", `WOFF1 metadata block has inconsistent offset/length (offset=${s}, length=${c}); both must be zero or both non-zero.`), l === 0 == (u === 0) ? u > 0 && (l < d || l + u > e.byteLength) && $(t, "error", "WOFF1_PRIVATE_BLOCK_INVALID", `WOFF1 private block (offset ${l}, length ${u}) is out of bounds (file size ${e.byteLength}, directory ends at ${d}).`) : $(t, "error", "WOFF1_PRIVATE_BLOCK_INVALID", `WOFF1 private block has inconsistent offset/length (offset=${l}, length=${u}); both must be zero or both non-zero.`);
	let f = d;
	if (d <= e.byteLength) for (let e = 0; e < i; e++) {
		let t = n.getUint32(Fy + e * Iy + 4) + n.getUint32(Fy + e * Iy + 8) + 3 & -4;
		t > f && (f = t);
	}
	if (c > 0) {
		let e = s + c + 3 & -4;
		e > f && (f = e);
	}
	if (u > 0) {
		let e = l + u;
		e > f && (f = e);
	}
	if (f > 0 && f < e.byteLength) {
		let n = e.byteLength - f;
		n > 3 && $(t, "warning", "WOFF1_TRAILING_JUNK", `WOFF1 file has ${n} bytes of trailing data after the last block (ends at ${f}, file size ${e.byteLength}).`);
	}
}
function zy(e, t) {
	if (e.byteLength < Ly) return;
	let n = new DataView(e), r = n.getUint32(8), i = n.getUint16(14), a = n.getUint32(16), o = n.getUint32(20);
	i !== 0 && $(t, "error", "WOFF2_RESERVED_FIELD_NONZERO", `WOFF2 header reserved field is 0x${i.toString(16)}; must be 0.`), r !== e.byteLength && $(t, "error", "WOFF2_FILE_SIZE_MISMATCH", `WOFF2 header.length (${r}) does not match file size (${e.byteLength}).`), a < 12 && $(t, "error", "WOFF2_DECOMPRESSED_SIZE_INVALID", `WOFF2 header.totalSfntSize (${a}) is too small to be a valid SFNT.`), o > e.byteLength && $(t, "error", "WOFF2_DECOMPRESSED_SIZE_INVALID", `WOFF2 header.totalCompressedSize (${o}) exceeds file size (${e.byteLength}).`);
}
var By = 224;
function Vy(e, t) {
	let n = e.axes ?? [], r = /* @__PURE__ */ new Set();
	for (let e = 0; e < n.length; e++) {
		let i = n[e];
		i.minValue <= i.defaultValue && i.defaultValue <= i.maxValue || $(t, "error", "FVAR_AXIS_RANGE_INVALID", `fvar axis '${i.axisTag}' violates min ≤ default ≤ max (min=${i.minValue}, default=${i.defaultValue}, max=${i.maxValue}).`), r.has(i.axisTag) ? $(t, "error", "FVAR_AXIS_DUPLICATE_TAG", `fvar has multiple axes with tag '${i.axisTag}'.`) : r.add(i.axisTag);
	}
	let i = e.instances ?? [];
	for (let e = 0; e < i.length; e++) {
		let r = i[e], a = r.coordinates ?? r.coords ?? [];
		for (let r = 0; r < Math.min(a.length, n.length); r++) {
			let i = a[r], o = n[r];
			if (typeof i != "number" || i < o.minValue || i > o.maxValue) {
				$(t, "error", "FVAR_INSTANCE_OUT_OF_RANGE", `fvar instance ${e} coordinate for axis '${o.axisTag}' is ${i}, outside axis range [${o.minValue}, ${o.maxValue}].`);
				break;
			}
		}
	}
}
function Hy(e, t, n) {
	let r = e?.lookupList?.lookups ?? [], i = t === "GSUB" ? 8 : 9, a = !1, o = !1;
	for (let e = 0; e < r.length; e++) {
		let s = r[e];
		if ((typeof s.lookupType != "number" || s.lookupType < 1 || s.lookupType > i) && (a ||= ($(n, "error", `${t}_LOOKUP_TYPE_INVALID`, `${t} lookup ${e} has invalid lookupType ${s.lookupType}; must be in [1, ${i}].`), !0)), typeof s.lookupFlag == "number" && (s.lookupFlag & By) !== 0 && !o && ($(n, "warning", "LAYOUT_LOOKUP_FLAG_RESERVED", `${t} lookup ${e} has reserved bits set in lookupFlag (0x${s.lookupFlag.toString(16).padStart(4, "0")}); reserved mask is 0x${By.toString(16).padStart(4, "0")}.`), o = !0), typeof s.lookupFlag == "number" && s.lookupFlag & 65280) {
			$(n, "error", "LAYOUT_LOOKUP_FLAG_INVALID", `${t} lookup ${e} has bits set outside the valid lookupFlag mask 0x00FF (got 0x${s.lookupFlag.toString(16).padStart(4, "0")}).`);
			break;
		}
	}
}
var Uy = 65534, Wy = 65534;
function Gy(e, t, n) {
	let r = e.axes ?? [], i = e.instances ?? [], a = /* @__PURE__ */ new Set();
	if (t && Array.isArray(t.names)) for (let e of t.names) e && typeof e.nameID == "number" && a.add(e.nameID);
	for (let e = 0; e < r.length; e++) {
		let t = r[e];
		typeof t.flags == "number" && (t.flags & Uy) !== 0 && $(n, "warning", "FVAR_AXIS_FLAGS_RESERVED", `fvar axis '${t.axisTag}' has reserved bits set in flags (0x${t.flags.toString(16).padStart(4, "0")}); only bit 0 (HIDDEN_AXIS) is defined.`), typeof t.axisNameID == "number" && t.axisNameID < 256 ? $(n, "warning", "FVAR_AXIS_NAMEID_RESERVED", `fvar axis '${t.axisTag}' axisNameID is ${t.axisNameID}; axis name IDs should be ≥ 256.`) : typeof t.axisNameID == "number" && a.size > 0 && !a.has(t.axisNameID) && $(n, "warning", "FVAR_AXIS_NAMEID_MISSING", `fvar axis '${t.axisTag}' axisNameID ${t.axisNameID} has no matching name record.`);
	}
	for (let e = 0; e < i.length; e++) {
		let t = i[e];
		typeof t.flags == "number" && (t.flags & Wy) !== 0 && $(n, "warning", "FVAR_INSTANCE_FLAGS_RESERVED", `fvar instance ${e} has reserved bits set in flags (0x${t.flags.toString(16).padStart(4, "0")}).`);
		let r = [["subfamilyNameID", t.subfamilyNameID], ["postScriptNameID", t.postScriptNameID]];
		for (let [t, i] of r) i !== void 0 && i !== 65535 && typeof i == "number" && a.size > 0 && !a.has(i) && i !== 2 && i !== 17 && i !== 6 && $(n, "warning", "FVAR_INSTANCE_NAMEID_MISSING", `fvar instance ${e} ${t} ${i} has no matching name record.`);
	}
}
function Ky(e, t, n) {
	typeof e.majorVersion == "number" && e.majorVersion !== 1 && $(n, "error", "STAT_VERSION_INVALID", `STAT majorVersion must be 1, got ${e.majorVersion}.`), typeof e.designAxisSize == "number" && e.designAxisSize < 8 && $(n, "error", "STAT_DESIGN_AXIS_SIZE_INVALID", `STAT designAxisSize must be ≥ 8, got ${e.designAxisSize}.`);
	let r = e.designAxes ?? [], i = t?.axes ?? [], a = /* @__PURE__ */ new Set();
	for (let e = 0; e < r.length; e++) {
		let t = r[e];
		typeof t.axisTag == "string" && (a.has(t.axisTag) && $(n, "warning", "STAT_AXIS_DUPLICATE_TAG", `STAT designAxes contains duplicate axisTag '${t.axisTag}'.`), a.add(t.axisTag));
	}
	if (i.length > 0) for (let e of i) a.has(e.axisTag) || $(n, "warning", "STAT_MISSING_FVAR_AXIS", `STAT designAxes is missing an entry for fvar axis '${e.axisTag}'.`);
	let o = e.axisValues ?? [];
	for (let e = 0; e < o.length; e++) {
		let t = o[e];
		if (!(!t || typeof t != "object") && ((t.format === 1 || t.format === 2 || t.format === 3) && typeof t.axisIndex == "number" && (t.axisIndex < 0 || t.axisIndex >= r.length) && $(n, "error", "STAT_AXIS_VALUE_AXIS_INDEX_OUT_OF_RANGE", `STAT axisValue ${e} (format ${t.format}) references axisIndex ${t.axisIndex} but only ${r.length} design axes are defined.`), t.format === 2 && typeof t.rangeMinValue == "number" && typeof t.rangeMaxValue == "number" && typeof t.nominalValue == "number" && !(t.rangeMinValue <= t.nominalValue && t.nominalValue <= t.rangeMaxValue) && $(n, "error", "STAT_AXIS_VALUE_RANGE_INVALID", `STAT axisValue ${e} (format 2) violates rangeMin ≤ nominal ≤ rangeMax (min=${t.rangeMinValue}, nominal=${t.nominalValue}, max=${t.rangeMaxValue}).`), t.format === 4 && Array.isArray(t.axisValues))) {
			for (let i of t.axisValues) if (typeof i.axisIndex == "number" && (i.axisIndex < 0 || i.axisIndex >= r.length)) {
				$(n, "error", "STAT_AXIS_VALUE_AXIS_INDEX_OUT_OF_RANGE", `STAT axisValue ${e} (format 4) sub-record references axisIndex ${i.axisIndex} but only ${r.length} design axes are defined.`);
				break;
			}
		}
	}
}
function qy(e, t, n) {
	let r = e.segmentMaps ?? [], i = t?.axes ?? [];
	i.length > 0 && r.length !== i.length && $(n, "error", "AVAR_SEGMENT_COUNT_MISMATCH", `avar has ${r.length} segment maps but fvar declares ${i.length} axes.`);
	for (let e = 0; e < r.length; e++) {
		let t = r[e].axisValueMaps ?? [], i = -Infinity, a = !1, o = !1, s = !1, c = !1, l = !1;
		for (let r = 0; r < t.length; r++) {
			let { fromCoordinate: u, toCoordinate: d } = t[r];
			!c && (typeof u != "number" || typeof d != "number" || u < -1 || u > 1 || d < -1 || d > 1) && ($(n, "error", "AVAR_COORD_OUT_OF_RANGE", `avar axis ${e} segment map entry ${r} has out-of-range coordinate (from=${u}, to=${d}); both must be in [-1, 1].`), c = !0), !l && typeof u == "number" && u <= i && ($(n, "error", "AVAR_FROM_COORD_NOT_INCREASING", `avar axis ${e} segment map fromCoordinate values must be strictly increasing (entry ${r} = ${u}, previous = ${i}).`), l = !0), typeof u == "number" && (i = u), u === -1 && d === -1 && (a = !0), u === 0 && d === 0 && (o = !0), u === 1 && d === 1 && (s = !0);
		}
		t.length > 0 && !(a && o && s) && $(n, "error", "AVAR_MISSING_REQUIRED_ENDPOINTS", `avar axis ${e} segment map must include (-1,-1), (0,0), and (1,1) entries when non-empty.`);
	}
}
function Jy(e, t, n, r) {
	if (!e) return;
	let i = e.variationRegionList;
	if (!i) return;
	t > 0 && typeof i.axisCount == "number" && i.axisCount !== t && $(r, "error", "IVS_AXIS_COUNT_MISMATCH", `${n} ItemVariationStore declares axisCount=${i.axisCount} but fvar has ${t} axes.`);
	let a = i.regions ?? [], o = !1;
	for (let e = 0; e < a.length; e++) {
		let t = a[e].regionAxes ?? [];
		for (let i = 0; i < t.length; i++) {
			let { startCoord: a, peakCoord: s, endCoord: c } = t[i];
			!o && (typeof a != "number" || typeof s != "number" || typeof c != "number" || a < -1 || a > 1 || s < -1 || s > 1 || c < -1 || c > 1) && ($(r, "error", "IVS_REGION_COORD_OUT_OF_RANGE", `${n} ItemVariationStore region ${e} axis ${i} has out-of-range coords (start=${a}, peak=${s}, end=${c}); all must be in [-1, 1].`), o = !0), !o && typeof a == "number" && typeof s == "number" && typeof c == "number" && !(a <= s && s <= c) && ($(r, "error", "IVS_REGION_PEAK_OUT_OF_ORDER", `${n} ItemVariationStore region ${e} axis ${i} violates start ≤ peak ≤ end (start=${a}, peak=${s}, end=${c}).`), o = !0);
		}
	}
	let s = e.itemVariationData ?? [], c = !1;
	for (let e = 0; e < s.length; e++) {
		let t = s[e];
		if (!t) continue;
		let i = t.regionIndexes ?? [];
		for (let t = 0; t < i.length; t++) i[t] >= a.length && !c && ($(r, "error", "IVS_REGION_INDEX_OUT_OF_RANGE", `${n} ItemVariationData ${e} regionIndex ${i[t]} is ≥ regionCount (${a.length}).`), c = !0);
	}
}
function Yy(e, t, n) {
	typeof e.valueRecordSize == "number" && e.valueRecordSize < 8 && $(n, "error", "MVAR_VALUE_RECORD_SIZE_INVALID", `MVAR valueRecordSize must be ≥ 8, got ${e.valueRecordSize}.`);
	let r = e.itemVariationStore, i = e.valueRecords ?? [], a = r?.itemVariationData ?? [], o = !1, s = !1;
	for (let e = 0; e < i.length; e++) {
		let t = i[e], r = t.deltaSetOuterIndex, c = t.deltaSetInnerIndex;
		!o && typeof r == "number" && r >= a.length && ($(n, "error", "MVAR_DELTA_SET_OUTER_OUT_OF_RANGE", `MVAR record '${t.valueTag}' deltaSetOuterIndex ${r} is ≥ ItemVariationData count (${a.length}).`), o = !0);
		let l = a[r];
		!s && l && typeof c == "number" && c >= (l.itemCount ?? 0) && ($(n, "error", "MVAR_DELTA_SET_INNER_OUT_OF_RANGE", `MVAR record '${t.valueTag}' deltaSetInnerIndex ${c} is ≥ itemCount (${l.itemCount}).`), s = !0);
	}
	Jy(r, t?.axes?.length ?? 0, "MVAR", n);
}
function Xy(e, t, n, r) {
	Jy(e.itemVariationStore, n?.axes?.length ?? 0, t, r);
}
function Zy(e, t, n, r, i) {
	if (i ||= Qy(), typeof e.majorVersion == "number" && e.majorVersion !== 1 && $(r, "error", "GDEF_VERSION_INVALID", `GDEF majorVersion must be 1, got ${e.majorVersion}.`), e.glyphClassDef && eb(e.glyphClassDef, t, "GDEF.glyphClassDef", r, { maxClass: 4 }, i), e.markAttachClassDef && eb(e.markAttachClassDef, t, "GDEF.markAttachClassDef", r, {}, i), e.attachList?.coverage && $y(e.attachList.coverage, t, "GDEF.attachList.coverage", r, i), e.ligCaretList?.coverage && $y(e.ligCaretList.coverage, t, "GDEF.ligCaretList.coverage", r, i), e.markGlyphSetsDef?.coverages) for (let n = 0; n < e.markGlyphSetsDef.coverages.length; n++) $y(e.markGlyphSetsDef.coverages[n], t, `GDEF.markGlyphSetsDef.coverages[${n}]`, r, i);
	e.itemVariationStore && Jy(e.itemVariationStore, n?.axes?.length ?? 0, "GDEF", r);
}
function Qy() {
	return {
		coverages: /* @__PURE__ */ new WeakSet(),
		classDefs: /* @__PURE__ */ new WeakSet()
	};
}
function $y(e, t, n, r, i) {
	if (e) {
		if (i) {
			if (i.coverages.has(e)) return;
			i.coverages.add(e);
		}
		if (e.format !== 1 && e.format !== 2) {
			$(r, "error", "COVERAGE_FORMAT_INVALID", `${n}: Coverage format must be 1 or 2, got ${e.format}.`);
			return;
		}
		if (e.format === 1) {
			let i = e.glyphs ?? [], a = -1;
			for (let e = 0; e < i.length; e++) {
				let o = i[e];
				if (t > 0 && o >= t) {
					$(r, "error", "COVERAGE_GLYPH_OUT_OF_RANGE", `${n}: Coverage format 1 references glyphID ${o} but font has only ${t} glyphs.`);
					return;
				}
				if (o <= a) {
					$(r, "error", "COVERAGE_GLYPHS_NOT_SORTED", `${n}: Coverage format 1 glyph list is not strictly ascending at index ${e} (got ${o} after ${a}).`);
					return;
				}
				a = o;
			}
		} else {
			let i = e.ranges ?? [], a = -1;
			for (let e = 0; e < i.length; e++) {
				let o = i[e];
				if (typeof o.startGlyphID != "number" || typeof o.endGlyphID != "number" || o.startGlyphID > o.endGlyphID) {
					$(r, "error", "COVERAGE_RANGE_INVALID", `${n}: Coverage format 2 range ${e} is invalid (start=${o.startGlyphID}, end=${o.endGlyphID}).`);
					return;
				}
				if (t > 0 && o.endGlyphID >= t) {
					$(r, "error", "COVERAGE_GLYPH_OUT_OF_RANGE", `${n}: Coverage format 2 range ${e} endGlyphID ${o.endGlyphID} is ≥ numGlyphs (${t}).`);
					return;
				}
				if (o.startGlyphID <= a) {
					$(r, "error", "COVERAGE_RANGES_NOT_SORTED", `${n}: Coverage format 2 ranges overlap or are not sorted at index ${e} (start=${o.startGlyphID}, prev end=${a}).`);
					return;
				}
				a = o.endGlyphID;
			}
		}
	}
}
function eb(e, t, n, r, i = {}, a) {
	if (!e) return;
	if (a) {
		if (a.classDefs.has(e)) return;
		a.classDefs.add(e);
	}
	if (e.format !== 1 && e.format !== 2) {
		$(r, "error", "CLASSDEF_FORMAT_INVALID", `${n}: ClassDef format must be 1 or 2, got ${e.format}.`);
		return;
	}
	let o = i.maxClass;
	if (e.format === 1) {
		let i = e.startGlyphID ?? 0, a = e.classValues ?? [];
		if (t > 0 && i + a.length > t) {
			$(r, "error", "CLASSDEF_GLYPH_OUT_OF_RANGE", `${n}: ClassDef format 1 covers glyphs [${i}, ${i + a.length - 1}] but font has only ${t} glyphs.`);
			return;
		}
		if (o !== void 0) {
			for (let e = 0; e < a.length; e++) if (a[e] > o) {
				$(r, "error", "CLASSDEF_CLASS_OUT_OF_RANGE", `${n}: ClassDef format 1 entry ${e} has class ${a[e]}, which exceeds the maximum ${o} for this table.`);
				return;
			}
		}
	} else {
		let i = e.ranges ?? [], a = -1;
		for (let e = 0; e < i.length; e++) {
			let s = i[e];
			if (s.startGlyphID > s.endGlyphID) {
				$(r, "error", "CLASSDEF_RANGE_INVALID", `${n}: ClassDef format 2 range ${e} is invalid (start=${s.startGlyphID}, end=${s.endGlyphID}).`);
				return;
			}
			if (t > 0 && s.endGlyphID >= t) {
				$(r, "error", "CLASSDEF_GLYPH_OUT_OF_RANGE", `${n}: ClassDef format 2 range ${e} endGlyphID ${s.endGlyphID} is ≥ numGlyphs (${t}).`);
				return;
			}
			if (s.startGlyphID <= a) {
				$(r, "error", "CLASSDEF_RANGES_NOT_SORTED", `${n}: ClassDef format 2 ranges overlap or are not sorted at index ${e} (start=${s.startGlyphID}, prev end=${a}).`);
				return;
			}
			if (o !== void 0 && s.class > o) {
				$(r, "error", "CLASSDEF_CLASS_OUT_OF_RANGE", `${n}: ClassDef format 2 range ${e} has class ${s.class}, which exceeds the maximum ${o} for this table.`);
				return;
			}
			a = s.endGlyphID;
		}
	}
}
function tb(e, t, n, r, i) {
	i ||= Qy();
	let a = e?.lookupList?.lookups ?? [];
	for (let e = 0; e < a.length; e++) {
		let o = a[e], s = o.subtables ?? [];
		for (let a = 0; a < s.length; a++) {
			let c = s[a];
			if (!c || typeof c != "object") continue;
			let l = `${t} lookup ${e} (type ${o.lookupType}) subtable ${a}`;
			if (c.coverage && $y(c.coverage, n, `${l}.coverage`, r, i), Array.isArray(c.coverages)) for (let e = 0; e < c.coverages.length; e++) $y(c.coverages[e], n, `${l}.coverages[${e}]`, r, i);
			if (c.classDef && eb(c.classDef, n, `${l}.classDef`, r, {}, i), t === "GSUB" && o.lookupType === 1 && Array.isArray(c.substituteGlyphIDs)) {
				for (let e of c.substituteGlyphIDs) if (n > 0 && e >= n) {
					$(r, "error", "GSUB_SUBSTITUTE_GLYPH_OUT_OF_RANGE", `${l}: substituteGlyphID ${e} is ≥ numGlyphs (${n}).`);
					break;
				}
			}
			if (t === "GSUB" && o.lookupType === 4 && Array.isArray(c.ligatureSets)) {
				let e = !1;
				for (let t of c.ligatureSets) {
					if (e) break;
					for (let i of t ?? []) {
						if (n > 0 && i.ligatureGlyph >= n) {
							$(r, "error", "GSUB_LIGATURE_GLYPH_OUT_OF_RANGE", `${l}: ligatureGlyph ${i.ligatureGlyph} is ≥ numGlyphs (${n}).`), e = !0;
							break;
						}
						for (let t of i.componentGlyphIDs ?? []) if (n > 0 && t >= n) {
							$(r, "error", "GSUB_LIGATURE_COMPONENT_OUT_OF_RANGE", `${l}: ligature componentGlyphID ${t} is ≥ numGlyphs (${n}).`), e = !0;
							break;
						}
					}
				}
			}
		}
	}
}
function nb(e, t) {
	typeof e.version == "number" && e.version !== 65536 && $(t, "error", "MATH_VERSION_INVALID", `MATH table version must be 0x00010000, got 0x${e.version.toString(16).padStart(8, "0")}.`);
}
var rb = /* @__PURE__ */ new Set([
	1,
	3,
	4,
	5,
	6,
	7,
	8,
	10,
	11,
	14,
	18,
	19,
	20,
	21,
	22,
	23,
	24,
	25,
	26,
	27,
	29,
	30,
	31
]), ib = /* @__PURE__ */ new Set([
	1,
	3,
	4,
	5,
	6,
	7,
	8,
	10,
	11,
	15,
	16,
	18,
	19,
	20,
	21,
	22,
	23,
	24,
	25,
	26,
	27,
	29,
	30,
	31
]), ab = /* @__PURE__ */ new Set([
	34,
	35,
	36,
	37,
	0,
	3,
	4,
	5,
	9,
	10,
	11,
	12,
	14,
	15,
	18,
	20,
	21,
	22,
	23,
	24,
	26,
	27,
	28,
	29,
	30
]), ob = 10, sb = 48, cb = 513;
function lb(e, t, n, r = !1) {
	let i = r ? [{
		charStrings: e.charStrings || [],
		localSubrs: e.fontDicts?.[0]?.localSubrs || []
	}] : e.fonts || [], a = e.globalSubrs || [], o = ub(a.length), s = /* @__PURE__ */ new Set();
	function c(e, t, r) {
		s.has(e) || (s.add(e), $(n, t, e, r));
	}
	for (let e = 0; e < i.length; e++) {
		let n = i[e], s = n.charStrings || [], l = n.localSubrs || [], u = ub(l.length);
		for (let n = 0; n < s.length; n++) {
			let i = s[n];
			if (!i || i.length === 0) continue;
			let d = {
				stack: [],
				maxStackSeen: 0,
				stemCount: 0,
				depth: 0,
				returned: !1,
				saw: {
					endchar: !1,
					anyDraw: !1
				}
			};
			db(i, d, l, u, a, o, t, e, n, c, r), d.maxStackSeen > (r ? cb : sb) && c("CFF_STACK_OVERFLOW", "error", `${t}: charstring for glyph ${n} pushed ${d.maxStackSeen} operands, exceeding the ${r ? "CFF2" : "Type 2"} limit of ${r ? cb : sb}.`);
		}
	}
}
function ub(e) {
	return e < 1240 ? 107 : e < 33900 ? 1131 : 32768;
}
function db(e, t, n, r, i, a, o, s, c, l, u) {
	if (t.depth > ob) {
		l("CFF_SUBR_DEPTH_EXCEEDED", "error", `${o}: charstring for glyph ${c} exceeded subroutine recursion depth ${ob}.`);
		return;
	}
	let d = 0;
	for (; d < e.length;) {
		let f = e[d];
		if (f === 28 || f >= 32) {
			let n = fb(e, d);
			if (n === null) {
				l("CFF_INVALID_NUMBER", "error", `${o}: charstring for glyph ${c} contains a malformed numeric operand at byte ${d}.`);
				return;
			}
			if (d + n.bytesConsumed > e.length) {
				l("CFF_TRUNCATED_OPERAND", "error", `${o}: charstring for glyph ${c} truncated mid-operand at byte ${d}.`);
				return;
			}
			t.stack.push(n.value), t.stack.length > t.maxStackSeen && (t.maxStackSeen = t.stack.length), d += n.bytesConsumed;
			continue;
		}
		if (f === 12) {
			if (d + 1 >= e.length) {
				l("CFF_TRUNCATED_OPERATOR", "error", `${o}: charstring for glyph ${c} ends mid-escaped operator at byte ${d}.`);
				return;
			}
			let n = e[d + 1];
			if (!ab.has(n)) {
				l("CFF_INVALID_OPERATOR", "error", `${o}: charstring for glyph ${c} uses unrecognised two-byte operator 12 ${n} at byte ${d}.`);
				return;
			}
			let r = {
				34: 7,
				35: 13,
				36: 9,
				37: 11
			}[n];
			if (r !== void 0 && t.stack.length < r) {
				l("CFF_STACK_UNDERFLOW", "error", `${o}: charstring for glyph ${c} two-byte op ${n} requires ${r} operands but stack has ${t.stack.length}.`);
				return;
			}
			t.stack.length = 0, t.saw.anyDraw = !0, d += 2;
			continue;
		}
		if (!(u ? ib : rb).has(f)) {
			l("CFF_INVALID_OPERATOR", "error", `${o}: charstring for glyph ${c} uses unknown operator 0x${f.toString(16).padStart(2, "0")} at byte ${d}.`);
			return;
		}
		if (u && f === 15) {
			if (t.stack.length < 1) {
				l("CFF_STACK_UNDERFLOW", "error", `${o}: charstring for glyph ${c} vsindex with empty stack at byte ${d}.`);
				return;
			}
			t.stack.pop(), d++;
			continue;
		}
		if (u && f === 16) {
			if (t.stack.length < 1) {
				l("CFF_STACK_UNDERFLOW", "error", `${o}: charstring for glyph ${c} blend with empty stack at byte ${d}.`);
				return;
			}
			let e = t.stack.pop();
			typeof e == "number" && e >= 0 && e <= t.stack.length ? t.stack.length = e : t.stack.length = 0, d++;
			continue;
		}
		if (f === 1 || f === 3 || f === 18 || f === 23) {
			t.stemCount += t.stack.length >> 1, t.stack.length = 0, d++;
			continue;
		}
		if (f === 19 || f === 20) {
			t.stemCount += t.stack.length >> 1, t.stack.length = 0, d++;
			let n = Math.ceil(t.stemCount / 8);
			if (d + n > e.length) {
				l("CFF_TRUNCATED_OPERATOR", "error", `${o}: charstring for glyph ${c} truncated mid-mask at byte ${d}.`);
				return;
			}
			d += n;
			continue;
		}
		if (f === 10 || f === 29) {
			if (t.stack.length < 1) {
				l("CFF_STACK_UNDERFLOW", "error", `${o}: charstring for glyph ${c} ${f === 10 ? "callsubr" : "callgsubr"} with empty stack at byte ${d}.`);
				return;
			}
			let e = t.stack.pop(), p = e + (f === 10 ? r : a), m = f === 10 ? n : i;
			if (p < 0 || p >= m.length) {
				l("CFF_SUBR_INDEX_OUT_OF_RANGE", "error", `${o}: charstring for glyph ${c} ${f === 10 ? "callsubr" : "callgsubr"} index ${e} (biased ${p}) out of range [0, ${m.length}).`);
				return;
			}
			t.depth++, db(m[p], t, n, r, i, a, o, s, c, l, u), t.depth--, d++;
			continue;
		}
		if (f === 11) {
			t.returned = !0;
			return;
		}
		if (f === 14) {
			t.saw.endchar = !0, t.stack.length = 0, d++;
			continue;
		}
		t.stack.length = 0, t.saw.anyDraw = !0, d++;
	}
}
function fb(e, t) {
	let n = e[t];
	if (n >= 32 && n <= 246) return {
		value: n - 139,
		bytesConsumed: 1
	};
	if (n >= 247 && n <= 250) return t + 1 >= e.length ? null : {
		value: (n - 247) * 256 + e[t + 1] + 108,
		bytesConsumed: 2
	};
	if (n >= 251 && n <= 254) return t + 1 >= e.length ? null : {
		value: -(n - 251) * 256 - e[t + 1] - 108,
		bytesConsumed: 2
	};
	if (n === 28) {
		if (t + 2 >= e.length) return null;
		let n = e[t + 1] << 8 | e[t + 2];
		return {
			value: n > 32767 ? n - 65536 : n,
			bytesConsumed: 3
		};
	}
	if (n === 255) {
		if (t + 4 >= e.length) return null;
		let n = (e[t + 1] << 24 | e[t + 2] << 16 | e[t + 3] << 8 | e[t + 4]) >>> 0;
		return {
			value: (n > 2147483647 ? n - 4294967296 : n) / 65536,
			bytesConsumed: 5
		};
	}
	return null;
}
var pb = 16;
function mb(e, t, n) {
	let r = e?.glyphs;
	if (!Array.isArray(r)) return;
	let i = !1, a = !1, o = !1;
	function s(e, c) {
		if (i || a) return;
		let l = r[e];
		if (!(!l || !Array.isArray(l.components))) {
			if (c.length >= pb) {
				a = !0, $(n, "error", "GLYF_COMPOSITE_DEPTH_EXCEEDED", `glyf composite glyph chain starting at glyph ${c[0]} exceeds maximum nesting depth ${pb}.`);
				return;
			}
			for (let r of l.components) {
				let l = r.glyphIndex ?? r.glyphID;
				if (typeof l == "number") {
					if (t > 0 && (l < 0 || l >= t)) {
						o || (o = !0, $(n, "error", "GLYF_COMPOSITE_GLYPH_OUT_OF_RANGE", `glyf composite glyph ${e} references component glyph ${l}, which is out of range [0, ${t}).`));
						continue;
					}
					if (c.includes(l)) {
						i = !0, $(n, "error", "GLYF_COMPOSITE_CYCLE", `glyf composite glyph chain forms a cycle: ${[...c, l].join(" → ")}.`);
						return;
					}
					if (c.push(l), s(l, c), c.pop(), i || a) return;
				}
			}
		}
	}
	for (let e = 0; e < r.length; e++) {
		let t = r[e];
		if (t && Array.isArray(t.components) && (s(e, [e]), i || a)) break;
	}
}
function hb(e, t, n) {
	let r = e?.glyphs;
	if (!Array.isArray(r)) return;
	let i = t?.xMin, a = t?.xMax, o = t?.yMin, s = t?.yMax, c = !1, l = !1, u = !1;
	for (let e = 0; e < r.length; e++) {
		let t = r[e];
		t && (!c && typeof t.xMin == "number" && typeof t.xMax == "number" && t.xMin > t.xMax && (c = !0, $(n, "warning", "GLYF_BBOX_INVERTED", `glyf glyph ${e} has xMin (${t.xMin}) > xMax (${t.xMax}).`)), !c && typeof t.yMin == "number" && typeof t.yMax == "number" && t.yMin > t.yMax && (c = !0, $(n, "warning", "GLYF_BBOX_INVERTED", `glyf glyph ${e} has yMin (${t.yMin}) > yMax (${t.yMax}).`)), !l && typeof i == "number" && typeof a == "number" && typeof t.xMin == "number" && typeof t.xMax == "number" && (t.xMin < i || t.xMax > a) && (l = !0, $(n, "warning", "GLYF_BBOX_OUTSIDE_HEAD", `glyf glyph ${e} bounding box [${t.xMin},${t.xMax}] x [${t.yMin},${t.yMax}] extends outside the head.bbox [${i},${a}] x [${o},${s}].`)), !u && typeof t.numberOfContours == "number" && t.numberOfContours < -1 && (u = !0, $(n, "error", "GLYF_NUM_CONTOURS_INVALID", `glyf glyph ${e} numberOfContours = ${t.numberOfContours}; only ≥ -1 is valid (-1 indicates a composite).`)));
	}
}
var gb = [
	[6155, 6157],
	[65024, 65039],
	[917760, 917999]
];
function _b(e, t) {
	let n = e?.subTables ?? e?.subtables ?? [], r = !1, i = !1;
	for (let e of n) {
		if (e?.format !== 14) continue;
		let n = e.varSelectorRecords ?? e.variationSelectors ?? [], a = -1;
		for (let e = 0; e < n.length; e++) {
			let o = n[e], s = o.varSelector ?? o.variationSelector;
			typeof s == "number" && (!gb.some(([e, t]) => s >= e && s <= t) && !r && (r = !0, $(t, "error", "CMAP_FORMAT14_VS_OUT_OF_RANGE", `cmap format 14 record ${e} variation selector U+${s.toString(16).toUpperCase().padStart(4, "0")} is not in any defined VS range (Mongolian FVS, FE00–FE0F, or E0100–E01EF).`)), s <= a && !i && (i = !0, $(t, "error", "CMAP_FORMAT14_VS_OUT_OF_ORDER", `cmap format 14 variation selectors must be strictly ascending; record ${e} U+${s.toString(16).toUpperCase()} follows U+${a.toString(16).toUpperCase()}.`)), a = s);
		}
	}
}
function vb(e, t) {
	let n = e?.subTables ?? e?.subtables ?? [], r = !1, i = !1, a = !1;
	for (let e of n) {
		if (e?.format !== 12 && e?.format !== 13) continue;
		let n = e.groups ?? e.sequentialMapGroups ?? e.constantMapGroups ?? [];
		for (let o = 0; o < n.length; o++) {
			let s = n[o], c = s.startCharCode ?? s.startcharCode ?? s.start, l = s.endCharCode ?? s.endcharCode ?? s.end;
			if (typeof c == "number" && typeof l == "number" && (l < c && !a && (a = !0, $(t, "error", "CMAP_FORMAT12_END_BEFORE_START", `cmap format ${e.format} group ${o} has endCharCode (U+${l.toString(16).toUpperCase()}) < startCharCode (U+${c.toString(16).toUpperCase()}).`)), o > 0)) {
				let a = n[o - 1], s = a.startCharCode ?? a.startcharCode ?? a.start, u = a.endCharCode ?? a.endcharCode ?? a.end;
				typeof s == "number" && c <= s && !r && (r = !0, $(t, "error", "CMAP_FORMAT12_GROUPS_NOT_SORTED", `cmap format ${e.format} groups must be sorted by startCharCode; group ${o} (U+${c.toString(16).toUpperCase()}) follows group ${o - 1} (U+${s.toString(16).toUpperCase()}).`)), typeof u == "number" && c <= u && !i && (i = !0, $(t, "error", "CMAP_FORMAT12_GROUPS_OVERLAP", `cmap format ${e.format} group ${o} (U+${c.toString(16).toUpperCase()}–U+${l.toString(16).toUpperCase()}) overlaps with group ${o - 1} (ends at U+${u.toString(16).toUpperCase()}).`));
			}
		}
	}
}
function yb(e, t, n) {
	if (!e || e.length === 0) return;
	let r = 0, i = 0, a = !1, o = !1, s = !1, c = !1, l = !1;
	for (; r < e.length;) {
		let u = e[r];
		if (u >= 176 && u <= 183) {
			let i = (u & 7) + 1;
			if (r++, r + i > e.length) {
				o || (o = !0, $(n, "error", "TT_INSTR_TRUNCATED_PUSH", `${t}: PUSHB[${i - 1}] at byte ${r - 1} would read ${i} operands past end of stream (length ${e.length}).`));
				return;
			}
			r += i;
			continue;
		}
		if (u >= 184 && u <= 191) {
			let i = ((u & 7) + 1) * 2;
			if (r++, r + i > e.length) {
				o || (o = !0, $(n, "error", "TT_INSTR_TRUNCATED_PUSH", `${t}: PUSHW[${u & 7}] at byte ${r - 1} would read ${i} operand bytes past end of stream (length ${e.length}).`));
				return;
			}
			r += i;
			continue;
		}
		if (u === 64) {
			if (r++, r >= e.length) {
				o || (o = !0, $(n, "error", "TT_INSTR_TRUNCATED_PUSH", `${t}: NPUSHB at end of stream with no count byte.`));
				return;
			}
			let i = e[r];
			if (r++, r + i > e.length) {
				o || (o = !0, $(n, "error", "TT_INSTR_TRUNCATED_PUSH", `${t}: NPUSHB at byte ${r - 2} declares ${i} operands but only ${e.length - r} remain.`));
				return;
			}
			r += i;
			continue;
		}
		if (u === 65) {
			if (r++, r >= e.length) {
				o || (o = !0, $(n, "error", "TT_INSTR_TRUNCATED_PUSH", `${t}: NPUSHW at end of stream with no count byte.`));
				return;
			}
			let i = e[r] * 2;
			if (r++, r + i > e.length) {
				o || (o = !0, $(n, "error", "TT_INSTR_TRUNCATED_PUSH", `${t}: NPUSHW at byte ${r - 2} declares ${i / 2} word operands but only ${e.length - r} bytes remain.`));
				return;
			}
			r += i;
			continue;
		}
		if (u === 88) {
			i++, r++;
			continue;
		}
		if (u === 89) {
			i === 0 ? s || (s = !0, $(n, "error", "TT_INSTR_UNBALANCED_EIF", `${t}: EIF at byte ${r} with no matching IF.`)) : i--, r++;
			continue;
		}
		if (u === 44) {
			a && !c && (c = !0, $(n, "error", "TT_INSTR_NESTED_FDEF", `${t}: FDEF at byte ${r} nested inside another FDEF.`)), a = !0, r++;
			continue;
		}
		if (u === 45) {
			!a && !l && (l = !0, $(n, "error", "TT_INSTR_STRAY_ENDF", `${t}: ENDF at byte ${r} with no matching FDEF.`)), a = !1, r++;
			continue;
		}
		r++;
	}
	i !== 0 && $(n, "error", "TT_INSTR_UNBALANCED_IF", `${t}: ${i} unclosed IF block(s) at end of stream.`), a && $(n, "error", "TT_INSTR_UNCLOSED_FDEF", `${t}: FDEF was never closed by ENDF before end of stream.`);
}
function bb(e, t) {
	e.fpgm?.instructions && yb(e.fpgm.instructions, "fpgm", t), e.prep?.instructions && yb(e.prep.instructions, "prep", t);
	let n = e.glyf?.glyphs;
	if (Array.isArray(n)) {
		let e = t.length;
		for (let r = 0; r < n.length; r++) {
			let i = n[r]?.instructions;
			if (!(!i || i.length === 0) && (yb(i, `glyf glyph ${r}`, t), t.length > e)) break;
		}
	}
}
function xb(e, t, n, r) {
	let i = new Set(t.map((e) => e.tag));
	if (e.head) {
		e.head.magicNumber !== 1594834165 && $(n, "error", "BAD_MAGIC_NUMBER", `head.magicNumber is 0x${(e.head.magicNumber >>> 0).toString(16).padStart(8, "0")}, expected 0x5F0F3CF5.`);
		let t = e.head.unitsPerEm;
		t !== void 0 && (t < 16 || t > 16384) && $(n, "error", "BAD_UNITS_PER_EM", `head.unitsPerEm is ${t} — must be between 16 and 16384.`), e.head.majorVersion !== void 0 && e.head.majorVersion !== 1 && $(n, "error", "HEAD_MAJOR_VERSION_UNSUPPORTED", `head.majorVersion is ${e.head.majorVersion}, expected 1.`);
		let { xMin: r, xMax: i, yMin: a, yMax: o } = e.head;
		r !== void 0 && i !== void 0 && r > i && $(n, "error", "HEAD_BBOX_INVERTED", `head.xMin (${r}) is greater than head.xMax (${i}).`), a !== void 0 && o !== void 0 && a > o && $(n, "error", "HEAD_BBOX_INVERTED", `head.yMin (${a}) is greater than head.yMax (${o}).`);
		let s = e.head.indexToLocFormat;
		s !== void 0 && s !== 0 && s !== 1 && $(n, "error", "HEAD_INDEX_TO_LOC_FORMAT_INVALID", `head.indexToLocFormat is ${s}; must be 0 (short offsets) or 1 (long offsets).`);
		let c = e.head.glyphDataFormat;
		c !== void 0 && c !== 0 && $(n, "error", "HEAD_GLYPH_DATA_FORMAT_INVALID", `head.glyphDataFormat is ${c}; must be 0.`);
	}
	if (e.maxp) {
		let t = e.maxp.version;
		t !== void 0 && t !== 20480 && t !== 65536 && $(n, "error", "MAXP_VERSION_INVALID", `maxp.version is 0x${(t >>> 0).toString(16).padStart(8, "0")}; must be 0x00005000 (0.5) or 0x00010000 (1.0).`), e.maxp.numGlyphs === 0 && $(n, "error", "MAXP_NUMGLYPHS_ZERO", "maxp.numGlyphs is 0 — font contains no glyphs."), t === 20480 && i.has("glyf") && $(n, "error", "MAXP_VERSION_MISMATCH_FOR_OUTLINE", "maxp.version is 0.5 (CFF) but font contains a glyf table; TrueType outlines require maxp 1.0."), t === 65536 && (i.has("CFF ") || i.has("CFF2")) && !i.has("glyf") && $(n, "error", "MAXP_VERSION_MISMATCH_FOR_OUTLINE", "maxp.version is 1.0 (TrueType) but font has only CFF/CFF2 outlines; CFF requires maxp 0.5.");
	}
	if (e.hhea && e.hhea.majorVersion !== void 0 && e.hhea.majorVersion !== 1 && $(n, "error", "HHEA_MAJOR_VERSION_UNSUPPORTED", `hhea.majorVersion is ${e.hhea.majorVersion}, expected 1.`), e.post && typeof e.post.version == "number") {
		let t = e.post.version;
		t !== 65536 && t !== 131072 && t !== 151552 && t !== 196608 && $(n, "error", "POST_VERSION_UNSUPPORTED", `post.version is 0x${(t >>> 0).toString(16).padStart(8, "0")}; must be 1.0, 2.0, 2.5, or 3.0.`), t === 131072 && e.maxp && typeof e.post.numGlyphs == "number" && e.post.numGlyphs !== e.maxp.numGlyphs && $(n, "error", "POST_NUMGLYPHS_MISMATCH", `post.numGlyphs (${e.post.numGlyphs}) does not match maxp.numGlyphs (${e.maxp.numGlyphs}).`);
	}
	if (e["OS/2"] && typeof e["OS/2"].version == "number") {
		let t = e["OS/2"].version;
		(t < 0 || t > 5) && $(n, "error", "OS2_VERSION_INVALID", `OS/2.version is ${t}; must be in range 0..5.`);
	}
	if (e["OS/2"] && Ay(e["OS/2"], e.head, n), e.maxp && e.hmtx) {
		let t = e.maxp.numGlyphs, r = e.hmtx.hMetrics?.length ?? 0, i = e.hmtx.leftSideBearings?.length ?? 0, a = r + i;
		a !== t && $(n, "warning", "HMTX_GLYPH_MISMATCH", `hmtx has ${a} entries (${r} metrics + ${i} LSBs) but maxp.numGlyphs is ${t}.`);
	}
	if (e.hhea && e.hmtx) {
		let t = e.hhea.numberOfHMetrics, r = e.hmtx.hMetrics?.length ?? 0;
		r !== t && $(n, "warning", "HHEA_HMTX_MISMATCH", `hhea.numberOfHMetrics is ${t} but hmtx has ${r} full metric entries.`);
	}
	if (e.loca && e.glyf) {
		let r = e.loca.offsets;
		if (r && r.length > 0) {
			let e = t.find((e) => e.tag === "glyf");
			if (e) {
				let t = r[r.length - 1];
				t > e.length && $(n, "error", "LOCA_BEYOND_GLYF", `loca final offset (${t}) exceeds glyf table length (${e.length}).`);
			}
		}
	}
	let a = e["CFF "] || e.CFF2;
	if (a && e.maxp) {
		let t = a.topDict?.charStrings?.length ?? a.charStrings?.length ?? null;
		t !== null && t !== e.maxp.numGlyphs && $(n, "warning", "CFF_GLYPH_MISMATCH", `CFF charStrings count (${t}) doesn't match maxp.numGlyphs (${e.maxp.numGlyphs}).`);
	}
	if (e.name) {
		Py(e.name, t, r, n);
		let i = e.name.nameRecords ?? e.name.names ?? e.name.records ?? [], a = i.some((e) => e.nameID === 1), o = i.some((e) => e.nameID === 2);
		a || $(n, "warning", "NO_FAMILY_NAME", "name table has no family name (nameID 1)."), o || $(n, "warning", "NO_STYLE_NAME", "name table has no style name (nameID 2).");
		for (let e = 1; e < i.length; e++) {
			let t = i[e - 1], r = i[e];
			if ((t.platformID - r.platformID || t.encodingID - r.encodingID || t.languageID - r.languageID || t.nameID - r.nameID) >= 0) {
				$(n, "error", "NAME_RECORDS_NOT_SORTED", `name records are not sorted: record ${e - 1} (pid=${t.platformID}, eid=${t.encodingID}, lid=${t.languageID}, nid=${t.nameID}) precedes record ${e} (pid=${r.platformID}, eid=${r.encodingID}, lid=${r.languageID}, nid=${r.nameID}).`);
				break;
			}
		}
	}
	if (e.cmap?.encodingRecords) {
		let t = e.cmap.encodingRecords, r = e.cmap.subtables || [];
		for (let e = 1; e < t.length; e++) {
			let i = t[e - 1], a = t[e], o = (r[i.subtableIndex] || {}).language || 0, s = (r[a.subtableIndex] || {}).language || 0;
			if ((i.platformID - a.platformID || i.encodingID - a.encodingID || o - s) >= 0) {
				$(n, "error", "CMAP_SUBTABLES_NOT_SORTED", `cmap encoding records are not sorted: record ${e - 1} (pid=${i.platformID}, eid=${i.encodingID}, lang=${o}) precedes record ${e} (pid=${a.platformID}, eid=${a.encodingID}, lang=${s}).`);
				break;
			}
		}
	}
	e.cmap && Dy(e.cmap, e.maxp, n);
	let o = e["CFF "];
	if (o?.fonts) for (let e = 0; e < o.fonts.length; e++) {
		let t = o.fonts[e].charStrings || [];
		for (let r = 0; r < t.length; r++) {
			let i = t[r];
			if (!i || i.length === 0) {
				$(n, "error", "CFF_EMPTY_CHARSTRING", `CFF font ${e}: charstring for glyph ${r} is empty (must contain at least an endchar operator).`);
				break;
			}
			let a = i[i.length - 1];
			if (a !== 14 && a !== 11) {
				$(n, "warning", "CFF_CHARSTRING_NO_ENDCHAR", `CFF font ${e}: charstring for glyph ${r} does not terminate with endchar (last byte = 0x${a.toString(16).padStart(2, "0")}).`);
				break;
			}
		}
	}
	if (i.has("CFF ") || i.has("CFF2")) {
		let i;
		if (e.post && typeof e.post.version == "number") i = e.post.version;
		else if (r) {
			let e = t.find((e) => e.tag === "post");
			e && e.length >= 4 && e.offset + 4 <= r.byteLength && (i = new DataView(r).getUint32(e.offset));
		}
		i !== void 0 && i !== 196608 && $(n, "error", "POST_VERSION_INVALID_FOR_CFF", `post table version is ${`0x${(i >>> 0).toString(16).padStart(8, "0")}`} but CFF-flavored fonts must use 0x00030000 (3.0).`);
	}
	if (e.vhea && e.vmtx) {
		let t = e.vhea.numOfLongVerMetrics ?? e.vhea.numberOfVMetrics, r = e.vmtx.metrics?.length ?? 0;
		t !== void 0 && r !== t && $(n, "warning", "VHEA_VMTX_MISMATCH", `vhea.numOfLongVerMetrics is ${t} but vmtx has ${r} full metric entries.`);
	}
	i.has("gvar") && !i.has("fvar") && $(n, "error", "GVAR_WITHOUT_FVAR", "gvar table present without fvar — glyph variations require a variation axis table.");
	for (let e of [
		"HVAR",
		"VVAR",
		"MVAR",
		"avar"
	]) i.has(e) && !i.has("fvar") && $(n, "error", `${e.toUpperCase()}_WITHOUT_FVAR`, `${e} table present without fvar — variation tables require a variation axis table.`);
	let s = e.maxp?.numGlyphs ?? 0, c = e.fvar, l = Qy();
	c && (Vy(c, n), Gy(c, e.name, n)), e.STAT && Ky(e.STAT, c, n), e.avar && qy(e.avar, c, n), e.HVAR && Xy(e.HVAR, "HVAR", c, n), e.VVAR && Xy(e.VVAR, "VVAR", c, n), e.MVAR && Yy(e.MVAR, c, n), e.GDEF && Zy(e.GDEF, s, c, n, l), e.GSUB && (Hy(e.GSUB, "GSUB", n), tb(e.GSUB, "GSUB", s, n, l)), e.GPOS && (Hy(e.GPOS, "GPOS", n), tb(e.GPOS, "GPOS", s, n, l)), e.MATH && nb(e.MATH, n), e["CFF "] && lb(e["CFF "], "CFF", n, !1), e.CFF2 && lb(e.CFF2, "CFF2", n, !0), e.glyf && (mb(e.glyf, s, n), hb(e.glyf, e.head, n)), e.cmap && (_b(e.cmap, n), vb(e.cmap, n)), bb(e, n);
}
function Sb(e) {
	let t = new F(new Uint8Array(e));
	t.skip(4);
	let n = t.uint16();
	t.skip(2);
	let r = t.uint32();
	return r === 0 ? null : {
		majorVersion: n,
		numFonts: r,
		firstOffset: t.uint32()
	};
}
function Cb(e) {
	let t = [];
	e && typeof e.byteLength == "number" && e.byteLength > 1073741824 && $(t, "error", "FILE_EXCEEDS_1GB", `Font file is ${e.byteLength} bytes (> 1 GiB); Firefox/OTS will reject it.`);
	let n = yy(e, t);
	if (!n) return gy(t);
	let r = n.sfnt;
	if (n.format === "collection") try {
		let n = Sb(r);
		if (!n || n.numFonts === 0) return $(t, "error", "EMPTY_COLLECTION", "Collection contains no fonts."), gy(t);
		if (n.majorVersion !== 1 && n.majorVersion !== 2) return $(t, "error", "TTC_VERSION_INVALID", `TTC majorVersion is ${n.majorVersion}; must be 1 or 2.`), gy(t);
		if (n.numFonts > 65536) return $(t, "error", "TTC_TOO_MANY_FONTS", `TTC numFonts is ${n.numFonts}; must be ≤ 65536.`), gy(t);
		$(t, "info", "COLLECTION_INFO", `Collection contains ${n.numFonts} font(s). Diagnosing the first font at offset ${n.firstOffset}.`), r = e;
	} catch (e) {
		return $(t, "error", "COLLECTION_HEADER_UNREADABLE", `Could not read collection header: ${e.message}`), gy(t);
	}
	let i = by(r, t);
	if (!i) return gy(t);
	let a = xy(r, i, t);
	return a.length === 0 && i.numTables > 0 ? ($(t, "error", "NO_READABLE_ENTRIES", "Could not read any table directory entries."), gy(t)) : (Sy(a, t), Cy(r, a, t), xb(wy(r, a, t), a, t, r), gy(t));
}
//#endregion
//#region src/font_flux.js
function wb(e) {
	if (typeof e == "string") return {
		kind: "json",
		text: e
	};
	let t, n;
	if (e instanceof ArrayBuffer) n = e, t = new Uint8Array(e);
	else if (ArrayBuffer.isView(e)) t = new Uint8Array(e.buffer, e.byteOffset, e.byteLength), n = t.slice().buffer;
	else throw TypeError("FontFlux.open() expects an ArrayBuffer, Uint8Array, or JSON string.");
	let r = 0;
	for (t.length >= 3 && t[0] === 239 && t[1] === 187 && t[2] === 191 && (r = 3); r < t.length && (t[r] === 32 || t[r] === 9 || t[r] === 10 || t[r] === 13);) r++;
	return r < t.length && (t[r] === 123 || t[r] === 91) ? {
		kind: "json",
		text: new TextDecoder("utf-8", { fatal: !1 }).decode(t)
	} : {
		kind: "binary",
		buffer: n
	};
}
var Tb = {
	name: ".notdef",
	advanceWidth: 500,
	contours: [[
		{
			x: 50,
			y: 0,
			onCurve: !0
		},
		{
			x: 50,
			y: 700,
			onCurve: !0
		},
		{
			x: 450,
			y: 700,
			onCurve: !0
		},
		{
			x: 450,
			y: 0,
			onCurve: !0
		}
	]]
};
function Eb(e, t) {
	let n = new Set(e.map((e) => e.name)), r;
	if (t.unicode != null) {
		let e = t.unicode.toString(16).toUpperCase();
		r = t.unicode <= 65535 ? `uni${e.padStart(4, "0")}` : `u${e.padStart(6, "0")}`;
	} else r = t.name || "glyph";
	if (!n.has(r)) return r;
	let i = 1;
	for (; n.has(`${r}.${i}`);) i++;
	return `${r}.${i}`;
}
var Db = class e {
	constructor(e) {
		this._data = e;
	}
	static create(t = {}) {
		let { family: n = "Untitled", style: r = "Regular", unitsPerEm: i = 1e3, ascender: a = 800, descender: o = -200 } = t, s = {
			font: {
				familyName: n,
				styleName: r,
				unitsPerEm: i,
				ascender: a,
				descender: o,
				lineGap: 0
			},
			glyphs: [{ ...Tb }, {
				name: "space",
				unicode: 32,
				advanceWidth: Math.round(i / 4)
			}],
			kerning: [],
			gasp: [{
				maxPPEM: 65535,
				behavior: 10
			}]
		};
		return new e(s);
	}
	static open(t, n = {}) {
		let r = wb(t);
		if (r.kind === "json") {
			let t = ry(r.text);
			if (t && t.collection && Array.isArray(t.fonts)) {
				if (n.faceIndex !== void 0) {
					if (!Number.isInteger(n.faceIndex) || n.faceIndex < 0 || n.faceIndex >= t.fonts.length) throw Error("faceIndex is outside the collection.");
					return new e(t.fonts[n.faceIndex]);
				}
				throw Error("FontFlux.open() received a font collection JSON. Use FontFlux.openAll() for collections.");
			}
			return new e(t);
		}
		if (n.faceIndex === void 0 && r.buffer.byteLength >= 4 && new DataView(r.buffer).getUint32(0) === 1953784678) throw Error("FontFlux.open() received a font collection (TTC/OTC). Use openAll() or specify faceIndex.");
		let i = Fv(r.buffer, n);
		if (i.collection && i.fonts) throw Error("FontFlux.open() received a font collection (TTC/OTC). Use FontFlux.openAll() for collections.");
		return new e(i);
	}
	static openAll(t, n = {}) {
		let r = wb(t);
		if (r.kind === "json") {
			let t = ry(r.text);
			return t && t.collection && Array.isArray(t.fonts) ? t.fonts.map((t) => new e(t)) : [new e(t)];
		}
		let i = Fv(r.buffer, {
			...n,
			faceIndex: void 0
		});
		return i.collection && i.fonts ? i.fonts.map((t) => new e(t)) : [new e(i)];
	}
	static fromJSON(t) {
		let n = ry(t);
		return new e(n);
	}
	static async initWoff2() {
		return H_();
	}
	static exportCollection(e, t = {}) {
		if (!Array.isArray(e) || e.length === 0) throw Error("exportCollection requires a non-empty array of FontFlux instances");
		return Ev({
			collection: {
				tag: "ttcf",
				majorVersion: 2,
				minorVersion: 0,
				numFonts: e.length
			},
			fonts: e.map((e) => e._data)
		}, t);
	}
	static diagnose(e) {
		return Cb(e);
	}
	static svgToContours(e, t) {
		return _(e, t);
	}
	static contoursToSVG(e) {
		return m(e);
	}
	static compileCharString(e) {
		return d(e);
	}
	static assembleCharString(e) {
		return p(e);
	}
	static interpretCharString(e, t, n) {
		return Ae(e, t, n);
	}
	static disassembleCharString(e) {
		return Ne(e);
	}
	get data() {
		return this._data;
	}
	get info() {
		return this._data.font;
	}
	get glyphs() {
		return this._data.glyphs;
	}
	get kerning() {
		return this._data.kerning || (this._data.kerning = []), this._data.kerning;
	}
	get axes() {
		return this._data.axes;
	}
	get instances() {
		return this._data.instances;
	}
	get features() {
		return this._data.features;
	}
	get tables() {
		return this._data.tables;
	}
	get glyphCount() {
		return this._data.glyphs.length;
	}
	get format() {
		return this._data.tables?.CFF2 ? "cff2" : this._data._header?.sfVersion === 1330926671 || this._data.glyphs.some((e) => e.charString) ? "cff" : "truetype";
	}
	getInfo() {
		return this._data.font;
	}
	setInfo(e) {
		Object.assign(this._data.font, e);
	}
	listGlyphs() {
		return this._data.glyphs.map((e, t) => ({
			name: e.name,
			unicode: e.unicode ?? null,
			index: t
		}));
	}
	getGlyph(e) {
		return w(this._data, e);
	}
	hasGlyph(e) {
		return w(this._data, e) !== void 0;
	}
	getGlyphContours(e) {
		let t = w(this._data, e);
		return t ? te(this._data.glyphs, t) : [];
	}
	addGlyph(e) {
		let t = e;
		(t.path || t.name && t.advanceWidth && !t._created) && (t = C(t));
		let n = this._data.glyphs;
		if (t.unicode != null) {
			let e = n.findIndex((e) => e.unicode === t.unicode);
			if (e >= 0) {
				n[e] = t;
				return;
			}
		}
		let r = n.findIndex((e) => e.name === t.name);
		if (r >= 0) {
			let e = n[r];
			if (e.unicode == null || t.unicode == null || e.unicode === t.unicode) {
				n[r] = t;
				return;
			}
			t.name = Eb(n, t);
		}
		n.push(t);
	}
	removeGlyph(e) {
		let t = this._data.glyphs, n = w(this._data, e);
		if (!n) return !1;
		let r = t.indexOf(n);
		return r < 0 ? !1 : (t.splice(r, 1), this._data.kerning && n.name && (this._data.kerning = this._data.kerning.filter((e) => e.left !== n.name && e.right !== n.name)), !0);
	}
	getKerning(e, t) {
		return oy(this._data, e, t);
	}
	addKerning(e) {
		let t = iy(e);
		this._data.kerning || (this._data.kerning = []);
		for (let e of t) {
			let t = this._data.kerning.findIndex((t) => t.left === e.left && t.right === e.right);
			t >= 0 ? this._data.kerning[t] = e : this._data.kerning.push(e);
		}
	}
	removeKerning(e, t) {
		if (!this._data.kerning) return !1;
		let n = this._data.glyphs, r = T(n, e), i = T(n, t);
		if (!r || !i) return !1;
		let a = this._data.kerning.findIndex((e) => e.left === r && e.right === i);
		return a < 0 ? !1 : (this._data.kerning.splice(a, 1), !0);
	}
	listKerning() {
		return this._data.kerning || [];
	}
	clearKerning() {
		this._data.kerning = [], this._data.kerningClasses = [];
	}
	get substitutions() {
		return this._data.substitutions || (this._data.substitutions = []), this._data.substitutions;
	}
	listSubstitutions(e) {
		let t = this._data.substitutions || [];
		return e ? t.filter((t) => !(e.type && t.type !== e.type || e.feature && t.feature !== e.feature)) : t;
	}
	getSubstitution(e, t) {
		return uy(this._data, e, t);
	}
	addSubstitution(e) {
		let t = ly(e);
		this._data.substitutions || (this._data.substitutions = []);
		for (let e of t) this._data.substitutions.push(e);
	}
	removeSubstitution(e) {
		if (!this._data.substitutions) return 0;
		let t = this._data.substitutions.length;
		return this._data.substitutions = this._data.substitutions.filter((t) => !!(e.type && t.type !== e.type || e.feature && t.feature !== e.feature || e.from && t.from !== e.from || e.ligature && t.ligature !== e.ligature)), t - this._data.substitutions.length;
	}
	clearSubstitutions() {
		this._data.substitutions = [], this._data._rawGSUBLookups = [], delete this._data.substitutionMetadata, this._data.features && delete this._data.features.GSUB;
	}
	listAxes() {
		return this._data.axes || [];
	}
	getAxis(e) {
		return this._data.axes?.find((t) => t.tag === e);
	}
	addAxis(e) {
		this._data.axes || (this._data.axes = []);
		let t = this._data.axes.findIndex((t) => t.tag === e.tag);
		t >= 0 ? this._data.axes[t] = e : this._data.axes.push(e);
	}
	removeAxis(e) {
		if (!this._data.axes) return !1;
		let t = this._data.axes.findIndex((t) => t.tag === e);
		return t < 0 ? !1 : (this._data.axes.splice(t, 1), this._data.instances && (this._data.instances = this._data.instances.filter((t) => !t.coordinates || !(e in t.coordinates))), this._data.axes.length === 0 && (this._data.instances = []), !0);
	}
	setAxis(e, t) {
		let n = this._data.axes?.find((t) => t.tag === e);
		return n ? (Object.assign(n, t), !0) : !1;
	}
	listInstances() {
		return this._data.instances || [];
	}
	addInstance(e) {
		this._data.instances || (this._data.instances = []);
		let t = this._data.instances.findIndex((t) => t.name === e.name);
		t >= 0 ? this._data.instances[t] = e : this._data.instances.push(e);
	}
	removeInstance(e) {
		if (!this._data.instances) return !1;
		let t = this._data.instances.findIndex((t) => t.name === e);
		return t < 0 ? !1 : (this._data.instances.splice(t, 1), !0);
	}
	get palettes() {
		return this._data.palettes || (this._data.palettes = []), this._data.palettes;
	}
	getPalette(e) {
		return this._data.palettes?.[e];
	}
	addPalette(e) {
		this._data.palettes || (this._data.palettes = []);
		let t = n(e);
		return this._data.palettes.push(t), this._data.palettes.length - 1;
	}
	removePalette(e) {
		return !this._data.palettes || e < 0 || e >= this._data.palettes.length ? !1 : (this._data.palettes.splice(e, 1), !0);
	}
	setPaletteColor(e, t, r) {
		let i = this._data.palettes?.[e];
		if (!i) throw Error(`Palette ${e} does not exist`);
		if (t < 0 || t >= i.length) throw Error(`Color index ${t} out of range`);
		i[t] = n([r])[0];
	}
	get colorGlyphs() {
		return this._data.colorGlyphs || (this._data.colorGlyphs = []), this._data.colorGlyphs;
	}
	getColorGlyph(e) {
		let t = T(this._data.glyphs, e);
		if (t) return this._data.colorGlyphs?.find((e) => e.name === t);
	}
	addColorGlyph(e) {
		let t = i(e);
		this._data.colorGlyphs || (this._data.colorGlyphs = []);
		let n = this._data.colorGlyphs.findIndex((e) => e.name === t.name);
		n >= 0 ? this._data.colorGlyphs[n] = t : this._data.colorGlyphs.push(t);
	}
	removeColorGlyph(e) {
		if (!this._data.colorGlyphs) return !1;
		let t = T(this._data.glyphs, e);
		if (!t) return !1;
		let n = this._data.colorGlyphs.findIndex((e) => e.name === t);
		return n < 0 ? !1 : (this._data.colorGlyphs.splice(n, 1), !0);
	}
	listColorGlyphs() {
		return (this._data.colorGlyphs || []).map((e) => ({
			name: e.name,
			type: e.layers ? "layers" : "paint"
		}));
	}
	getFeatures() {
		return this._data.features || {};
	}
	setFeatures(e) {
		this._data.features || (this._data.features = {}), Object.assign(this._data.features, e);
	}
	getHinting() {
		return {
			gasp: this._data.gasp,
			cvt: this._data.cvt,
			fpgm: this._data.fpgm,
			prep: this._data.prep
		};
	}
	setHinting(e) {
		e.gasp !== void 0 && (this._data.gasp = e.gasp), e.cvt !== void 0 && (this._data.cvt = e.cvt), e.fpgm !== void 0 && (this._data.fpgm = e.fpgm), e.prep !== void 0 && (this._data.prep = e.prep);
	}
	export(e) {
		return Ev(this._data, e);
	}
	convertOutlines(e) {
		return this._data = Rt(this._data, e), this;
	}
	toJSON(e) {
		return ny(this._data, e);
	}
	validate() {
		let e = In(this._data);
		if (!e.valid) return e;
		try {
			let t = Wn(kv(structuredClone(this._data)));
			return Fn([...e.issues, ...t.issues]);
		} catch (t) {
			return Fn([...e.issues, {
				severity: "error",
				code: "EXPORT_RESOLUTION_FAILED",
				message: t.message,
				path: "$"
			}]);
		}
	}
	detach() {
		return delete this._data._header, delete this._data.tables, delete this._data._woff, this;
	}
};
//#endregion
//#region src/main.js
async function Ob() {
	return H_();
}
//#endregion
export { Db as FontFlux, Cb as diagnoseFont, ry as fontFromJSON, ny as fontToJSON, Ob as initWoff2 };
