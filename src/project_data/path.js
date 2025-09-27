import {
	calculateDeltaAngle,
	calculateDeltasFromTransform,
	clone,
	hasNonValues,
	niceAngleToRadians,
	parseNumber,
	radiansToNiceAngle,
	round,
	strSan,
	transformOrigins,
	xyPointsAreClose,
} from '../common/functions.js';
import { ControlPoint } from './control_point.js';
import { GlyphElement } from './glyph_element.js';
import { Maxes, getOverallMaxes, isAllZeros } from './maxes.js';
import { PathPoint } from './path_point.js';
import { PolySegment } from './poly_segment.js';
import { Segment } from './segment.js';
import { XYPoint } from './xy_point.js';

/**
 * Glyph Element > Path
 * A Path is a collection of PathPoints, plus
 * a few properties like winding, and maxes.
 * Path now also includes other properties,
 * like Locks.
 */
export class Path extends GlyphElement {
	/**
	 * Create a Path
	 * @param {Object} arg
	 * @param {String =} arg.name
	 * @param {String =} arg.objType
	 * @param {Array =} arg.pathPoints - array of Path Point objects that make up this path
	 * @param {Boolean =} arg.xLock - lock the x property
	 * @param {Boolean =} arg.yLock - lock the y property
	 * @param {Boolean =} arg.wLock - lock the w property
	 * @param {Boolean =} arg.hLock - lock the h property
	 * @param {String =} arg.transformOrigin - set the origin location for transforms
	 * @param {Boolean =} arg.ratioLock - when scaling, keep the aspect ratio
	 * @param {Object =} arg.parent - link to the parent Glyph object
	 */
	constructor({
		name = 'Path',
		objType = 'Path',
		pathPoints = [],
		xLock = false,
		yLock = false,
		wLock = false,
		hLock = false,
		transformOrigin = '',
		ratioLock = false,
		parent = false,
	} = {}) {
		// log(`Path.constructor`, 'start');
		super();
		this.name = name;
		this.pathPoints = pathPoints;
		this.xLock = xLock;
		this.yLock = yLock;
		this.wLock = wLock;
		this.hLock = hLock;
		this.transformOrigin = transformOrigin;
		this.ratioLock = ratioLock;
		this.parent = parent;
		this.link = false;

		this.objType = objType;

		// log(`Path.constructor - End\n`);
	}

	// --------------------------------------------------------------
	// Common Glyphr Studio object methods
	// --------------------------------------------------------------

	/**
	 * Export object properties that need to be saved to a project file
	 * @param {Boolean} verbose - export some extra stuff that makes the saved object more readable
	 * @returns {*}
	 */
	save(verbose = false) {
		const re = {
			name: this.name,
			/**
			 * @type {Array}
			 */
			pathPoints: [],
		};

		if (this.xLock) re.xLock = true;
		if (this.yLock) re.yLock = true;
		if (this.wLock) re.wLock = true;
		if (this.hLock) re.hLock = true;
		if (this.transformOrigin && this.transformOrigin !== 'baseline-left') {
			re.transformOrigin = this.transformOrigin;
		}
		if (this.ratioLock) re.ratioLock = true;

		this.pathPoints.forEach((pp) => {
			re.pathPoints.push(pp.save(verbose));
		});

		if (verbose) re.objType = this.objType;
		// if (!verbose && this.__ID) delete this.__ID;

		return re;
	}

	/**
	 * Create a nicely-formatted string for this object
	 * @param {Number} level - how far down we are
	 * @returns {String}
	 */
	print(level = 0) {
		let ind = '';
		for (let i = 0; i < level; i++) ind += '  ';

		let re = `${ind}{Path\n`;
		ind += '  ';

		re += `${ind}winding: ${this.winding}\n`;
		if (this.name !== 'Path') re += `${ind}name: ${this.name}\n`;
		if (this.xLock) re += `${ind}xLock: ${this.xLock}\n`;
		if (this.yLock) re += `${ind}yLock: ${this.yLock}\n`;
		if (this.wLock) re += `${ind}wLock: ${this.wLock}\n`;
		if (this.hLock) re += `${ind}hLock: ${this.hLock}\n`;
		if (this.ratioLock) re += `${ind}ratioLock: ${this.ratioLock}\n`;

		re += `${ind}pathPoints: [\n`;
		this.pathPoints.forEach((pp, i) => {
			re += pp.print(level + 2, i);
			re += `\n`;
		});
		re += `${ind}]\n`;

		// re += `${ind}maxes: ${this.maxes.print(level + 1)}\n`;

		re += `${ind.substring(2)}}/Path`;

		return re;
	}

	// --------------------------------------------------------------
	// Getters
	// --------------------------------------------------------------

	/**
	 * get name
	 * @returns {String}
	 */
	get name() {
		return this._name || '';
	}

	/**
	 * Get PathPoints
	 * @returns {Array}
	 */
	get pathPoints() {
		return this._pathPoints || [];
	}

	/**
	 * Get Winding
	 * negative = clockwise
	 * positive = counterclockwise
	 * zero = unknown
	 * @returns {Number}
	 */
	get winding() {
		// log(`Path GET winding`, 'start');
		const winding = this.findWinding();
		// log(`Path GET winding`, 'end');
		return winding || 0;
	}

	/**
	 * Get X position
	 * @returns {Number} x
	 */
	get x() {
		return this.maxes.xMin;
	}

	/**
	 * Get Y position
	 * @returns {Number} y
	 */
	get y() {
		return this.maxes.yMax;
	}

	/**
	 * Get Height
	 * @returns {Number}
	 */
	get height() {
		const h = this.maxes.yMax - this.maxes.yMin;
		return Math.max(h, 0);
	}

	/**
	 * Get Width
	 * @returns {Number}
	 */
	get width() {
		const w = this.maxes.xMax - this.maxes.xMin;
		return Math.max(w, 0);
	}

	/**
	 * get xLock
	 * @returns {Boolean}
	 */
	get xLock() {
		return !!this._xLock;
	}

	/**
	 * get yLock
	 * @returns {Boolean}
	 */
	get yLock() {
		return !!this._yLock;
	}

	/**
	 * get wLock
	 * @returns {Boolean}
	 */
	get wLock() {
		return !!this._wLock;
	}

	/**
	 * get hLock
	 * @returns {Boolean}
	 */
	get hLock() {
		return !!this._hLock;
	}

	/**
	 * get transformOrigin
	 * @returns {String}
	 */
	get transformOrigin() {
		if (!this._transformOrigin) this._transformOrigin = 'baseline-left';
		return this._transformOrigin;
	}

	/**
	 * get ratioLock
	 * @returns {Boolean}
	 */
	get ratioLock() {
		return !!this._ratioLock;
	}

	/**
	 * Get Maxes
	 * @returns {Maxes}
	 */
	get maxes() {
		// log('Path GET maxes', 'start');
		// log('cache before');
		// log(json(this.cache, true));

		if (!this.cache.maxes) {
			// log('detected no maxes cache');
			this.recalculateMaxes();
		} else if (hasNonValues(this.cache.maxes)) {
			// log('detected hasNonValues');
			this.recalculateMaxes();
		} else if (isAllZeros(this.cache.maxes)) {
			// log('detected all values zero');
			this.recalculateMaxes();
		} else {
			// log('NO DETECTION to recalculate');
		}

		// log('cache after');
		// log(json(this.cache, true));
		// log('Path GET maxes', 'end');
		return new Maxes(this.cache.maxes);
	}

	/**
	 * Get or generate SVG path data
	 * @returns {String}
	 */
	get svgPathData() {
		if (this.cache.svgPathData) {
			return this.cache.svgPathData;
		}

		this.cache.svgPathData = this.makeSVGPathData();
		return this.cache.svgPathData;
	}

	// --------------------------------------------------------------
	//  Setters
	// --------------------------------------------------------------

	/**
	 * set name
	 * @param {String} name
	 */
	set name(name) {
		name = strSan(name);
		// log('sanitized: ' + name);
		if (name !== '') {
			this._name = name;
		}
	}

	/**
	 * Set PathPoints
	 * @param {Array} newPathPoints - array of Path Points
	 */
	set pathPoints(newPathPoints) {
		this._pathPoints = [];

		if (newPathPoints && newPathPoints.length) {
			// log('NEW PATH : Hydrating Path Points, length ' + pathPoints.length);
			for (let i = 0; i < newPathPoints.length; i++) {
				this._pathPoints[i] = new PathPoint(newPathPoints[i]);
				this._pathPoints[i].parent = this;
			}
		}
	}

	/**
	 * Set X position
	 * @param {Number} x
	 */
	set x(x) {
		this.setShapePosition(x, false);
	}

	/**
	 * Set Y position
	 * @param {Number} y
	 */
	set y(y) {
		this.setShapePosition(false, y);
	}

	/**
	 * Set Height
	 * @param {Number} h
	 */
	set height(h) {
		this.setShapeSize({ height: h });
	}

	/**
	 * Set Width
	 * @param {Number} w
	 */
	set width(w) {
		this.setShapeSize({ width: w });
	}

	/**
	 * set xLock
	 * @param {Boolean} xLock
	 */
	set xLock(xLock) {
		this._xLock = !!xLock;
	}

	/**
	 * set yLock
	 * @param {Boolean} yLock
	 */
	set yLock(yLock) {
		this._yLock = !!yLock;
	}

	/**
	 * set wLock
	 * @param {Boolean} wLock
	 */
	set wLock(wLock) {
		this._wLock = !!wLock;
	}

	/**
	 * set hLock
	 * @param {Boolean} hLock
	 */
	set hLock(hLock) {
		this._hLock = !!hLock;
	}

	/**
	 * set transformOrigin
	 * @param {String} transformOrigin - which point to set
	 */
	set transformOrigin(transformOrigin) {
		if (transformOrigins.indexOf(transformOrigin) > -1) {
			this._transformOrigin = transformOrigin;
		} else {
			this._transformOrigin = 'baseline-left';
		}
	}

	/**
	 * set ratioLock
	 * @param {Boolean} ratioLock
	 */
	set ratioLock(ratioLock) {
		this._ratioLock = !!ratioLock;
	}

	/**
	 * Set Maxes
	 * @param {Maxes} maxes
	 */
	set maxes(maxes) {
		// log(`Path SET maxes`, 'start');
		this.cache.maxes = {};
		this.cache.maxes = new Maxes(maxes);
		// log(`Path SET maxes`, 'end');
	}

	/**
	 * Set or generate SVG path data
	 * @param {String} data
	 */
	set svgPathData(data) {
		this.cache.svgPathData = data;
	}

	/**
	 * Indicates that this object has lockable properties
	 * @returns {Boolean}
	 */
	get isLockable() {
		return true;
	}

	/**
	 * Checks to see if a property is locked.
	 * @param {String} propertyName - property to check if locked
	 * @returns {Boolean}
	 */
	isLocked(propertyName) {
		if (propertyName === 'x') return this.xLock;
		if (propertyName === 'y') return this.yLock;
		if (propertyName === 'width') return this.wLock;
		if (propertyName === 'height') return this.hLock;
		return false;
	}

	/**
	 * Sets locks based on property name
	 * @param {String} propertyName - property to lock
	 */
	lock(propertyName) {
		if (propertyName === 'x') this.xLock = true;
		if (propertyName === 'y') this.yLock = true;
		if (propertyName === 'width') this.wLock = true;
		if (propertyName === 'height') this.hLock = true;
	}

	/**
	 * Sets locks based on property name
	 * @param {String} propertyName - property to unlock
	 */
	unlock(propertyName) {
		if (propertyName === 'x') this.xLock = false;
		if (propertyName === 'y') this.yLock = false;
		if (propertyName === 'width') this.wLock = false;
		if (propertyName === 'height') this.hLock = false;
	}

	// --------------------------------------------------------------
	//  SIZE AND POSITION
	// --------------------------------------------------------------

	/**
	 * Sets the overall Path width or height to a specific value
	 * @param {Object} arg
	 * @param {Number | Boolean =} arg.width - new Width
	 * @param {Number | Boolean =} arg.height - new Height
	 * @param {Boolean =} arg.ratioLock - if one is changed, change the other
	 * @param {String | Boolean =} arg.transformOrigin - name of transform origin point
	 * @returns {Path} - reference to this path
	 */
	setShapeSize({ width = false, height = false, ratioLock = false, transformOrigin = false } = {}) {
		if (width !== false) width = parseNumber(width);
		if (height !== false) height = parseNumber(height);

		const dw = width !== false ? width - this.width : 0;
		const dh = height !== false ? height - this.height : 0;

		this.updateShapeSize({
			width: dw,
			height: dh,
			ratioLock: ratioLock,
			transformOrigin: transformOrigin,
		});

		return this;
	}

	/**
	 * Updates the overall Path width or height by a delta value
	 * @param {Object} arg
	 * @param {Number | Boolean =} arg.width - delta width
	 * @param {Number | Boolean =} arg.height - delta height
	 * @param {Boolean =} arg.ratioLock - if one is changed, change the other
	 * @param {String | Boolean =} arg.transformOrigin - name of transform origin point
	 */
	updateShapeSize({ width = 0, height = 0, ratioLock = false, transformOrigin = false } = {}) {
		// log('Path.updateShapeSize', 'start');
		let dw = parseNumber(width);
		let dh = parseNumber(height);
		// log(`dw: ${dw}`);
		// log(`dh: ${dh}`);
		if (!dw && !dh) return;

		// Lock Aspect Ratio
		if (ratioLock) {
			if (dw !== dh) {
				const ratio = this.width / this.height;
				if (Math.abs(dw) > Math.abs(dh)) {
					dh = dw / ratio;
				} else {
					dw = dh * ratio;
				}
			}
		}

		// log('dw / dh is now ' + dw + ' / ' + dh);
		let oldWidth = this.width;
		if (oldWidth === 0) oldWidth = 1;

		let oldHeight = this.height;
		if (oldHeight === 0) oldHeight = 1;

		const newWidth = Math.max(oldWidth + dw, 1);
		const newHeight = Math.max(oldHeight + dh, 1);
		const ratioHeight = newHeight / oldHeight;
		const ratioWidth = newWidth / oldWidth;

		// If ratio locked, keep both w&h from bottoming out at 1
		if (ratioLock) {
			if (newWidth <= 1 || newHeight <= 1) {
				// log('RETURNING: ratioLock forcing width or height to be less than 1.');
				return;
			}
		}

		let deltas = calculateDeltasFromTransform(dw, dh, this.maxes, transformOrigin);
		let xAdjustment = this.maxes.xMin; // + deltas.deltaX;
		let yAdjustment = this.maxes.yMin; // + deltas.deltaY;
		// ControlPoint.x and ControlPoint.y for type === 'p' also moves h1 / h2
		// Directly access .coord to avoid this
		this.pathPoints.forEach((pp) => {
			pp.p.coord.x = (pp.p.coord.x - this.maxes.xMin) * ratioWidth + xAdjustment;
			pp.h1.coord.x = (pp.h1.coord.x - this.maxes.xMin) * ratioWidth + xAdjustment;
			pp.h2.coord.x = (pp.h2.coord.x - this.maxes.xMin) * ratioWidth + xAdjustment;
			pp.p.coord.y = (pp.p.coord.y - this.maxes.yMin) * ratioHeight + yAdjustment;
			pp.h1.coord.y = (pp.h1.coord.y - this.maxes.yMin) * ratioHeight + yAdjustment;
			pp.h2.coord.y = (pp.h2.coord.y - this.maxes.yMin) * ratioHeight + yAdjustment;
		});

		this.updateShapePosition(deltas.deltaX, deltas.deltaY);
		// log('Path.updateShapeSize', 'end');
	}

	/**
	 * Moves a path to a specific position
	 * @param {Number | Boolean =} nx - new X
	 * @param {Number | Boolean =} ny - new Y
	 */
	setShapePosition(nx = false, ny = false) {
		// log('Path.setShapePosition', 'start');
		// log(`nx:${nx}\tny:${ny}`);

		if (nx !== false) nx = parseNumber(nx);
		if (ny !== false) ny = parseNumber(ny);

		const dx = nx !== false ? nx * 1 - this.maxes.xMin : 0;
		const dy = ny !== false ? ny * 1 - this.maxes.yMax : 0;
		// log('dx dy: ' + dx + ' ' + dy);

		this.updateShapePosition(dx, dy);
		// log('Path.setShapePosition', 'end');
	}

	/**
	 * Moves the path based on delta values
	 * @param {Number} dx - delta X
	 * @param {Number} dy - delta Y
	 */
	updateShapePosition(dx = 0, dy = 0) {
		// log('Path.updateShapePosition', 'start');
		// log(`\n⮟this⮟`);
		// log(this);
		dx = parseNumber(dx);
		dy = parseNumber(dy);

		// log(`dx:${dx}\tdy:${dy}`);
		// log(`this.pathPoints.length: ${this.pathPoints.length}`);
		for (let d = 0; d < this.pathPoints.length; d++) {
			const pp = this.pathPoints[d];
			if (pp && pp.p) {
				// log(`\n⮟pp⮟`);
				// log(pp);
				// log('-------------------- pathPoint #' + d);
				// log(`BEFORE pp.p.x: ${pp.p.x}`);
				pp.updatePathPointPosition('p', dx, dy);
				// log(`AFTERS pp.p.x: ${pp.p.x}`);
			}
		}
		// We need this here even though .changed()
		// should have propagated from the PathPoint
		// this.changed();

		// log('Path.updateShapePosition', 'end');
	}

	/**
	 * Rotate this path about a point
	 * @param {Number} angle - how much to rotate (radians)
	 * @param {XYPoint} about - x/y center of rotation
	 */
	rotate(angle, about = this.maxes.center) {
		// log('Path.rotate', 'start');
		for (let d = 0; d < this.pathPoints.length; d++) {
			// log('starting point ' + d);
			const pp = this.pathPoints[d];
			pp.rotate(angle, about);
			// log('p['+d+'].p.x ' + pp.p.x);
		}

		// log('Path.rotate', 'end');
	}

	skew(angle, about = { x: 0, y: 0 }) {
		log('Path.skew', 'start');
		const angleRadians = niceAngleToRadians(angle);
		log(`angle: ${angle}`);
		log(`angleRadians: ${angleRadians}`);
		log(`back again: ${radiansToNiceAngle(angleRadians)}`);

		for (let d = 0; d < this.pathPoints.length; d++) {
			const pp = this.pathPoints[d];
			const h1dx = (pp.h1.y - about.y) * Math.tan(angleRadians);
			pp.h1.coord.x += h1dx;
			const h2dx = (pp.h2.y - about.y) * Math.tan(angleRadians);
			pp.h2.coord.x += h2dx;
			const pdx = (pp.p.y - about.y) * Math.tan(angleRadians);
			log(`point ${d} pdx: ${pdx}`);
			pp.p.coord.x += pdx;
		}

		log('Path.skew', 'end');
	}

	// --------------------------------------------------------------
	//  Methods
	// --------------------------------------------------------------

	/**
	 * Get the next point number in the path
	 * Handle looping
	 * @param {Number} pointNumber - point number
	 * @returns {Number}
	 */
	getNextPointNumber(pointNumber = 0) {
		pointNumber = parseNumber(pointNumber);
		pointNumber += 1;
		pointNumber = pointNumber % this.pathPoints.length;
		return pointNumber;
	}

	/**
	 * Get the previous point number in the path
	 * Handle looping
	 * @param {Number} pointNumber - point number
	 * @returns {Number}
	 */
	getPreviousPointNumber(pointNumber = 0) {
		pointNumber = parseNumber(pointNumber);
		pointNumber -= 1;
		if (pointNumber < 0) {
			pointNumber = pointNumber + this.pathPoints.length;
		}

		return pointNumber;
	}

	/**
	 * Looks for a point in the path that matches a given point
	 * @param {XYPoint} point - Point to test for
	 * @param {Boolean =} wantSecond - return the second result, not the first
	 * @returns {PathPoint | Boolean}
	 */
	containsPoint(point, wantSecond) {
		for (let pp = 0; pp < this.pathPoints.length; pp++) {
			if (xyPointsAreClose(point, this.pathPoints[pp].p, 0.01)) {
				if (wantSecond) wantSecond = false;
				else return this.pathPoints[pp];
			}
		}
		return false;
	}

	// --------------------------------------------------------------
	//  Translate to other languages
	// --------------------------------------------------------------
	/**
	 * Create SVG data
	 * @param {String} glyphName - Name of the glyph this path belongs to
	 * @param {Number} roundValue - how many decimal places
	 * @returns {String}
	 */
	makeSVGPathData(glyphName = 'not specified', roundValue = 8) {
		// log('Path.makeSVGPathData', 'start');
		// log('Glyph name: ' + glyphName);
		// log(this.pathPoints);

		if (!this.pathPoints || !this.pathPoints.length) {
			return '';
		}

		let p1;
		let p2;
		let trr = '';
		let re =
			'M' +
			round(this.pathPoints[0].p.x, roundValue) +
			',' +
			round(this.pathPoints[0].p.y, roundValue);

		if (re.indexOf('NaN') > -1) {
			console.warn(glyphName + ' PathPoint 0 MOVE has NaN: ' + re);
			// log(this.pathPoints[0]);
		}

		for (let cp = 0; cp < this.pathPoints.length; cp++) {
			p1 = this.pathPoints[cp];
			// p2 = this.pathPoints[(cp+1) % this.pathPoints.length];
			p2 = this.pathPoints[this.getNextPointNumber(cp)];
			trr =
				' C' +
				round(p1.h2.x, roundValue) +
				',' +
				round(p1.h2.y, roundValue) +
				',' +
				round(p2.h1.x, roundValue) +
				',' +
				round(p2.h1.y, roundValue) +
				',' +
				round(p2.p.x, roundValue) +
				',' +
				round(p2.p.y, roundValue);
			// log('' + trr);
			if (trr.indexOf('NaN') > -1) {
				console.warn(glyphName + ' PathPoint ' + cp + ' has NaN: ' + trr);
			}
			re += trr;
		}

		re += 'Z';

		// log('returning: ' + re);
		// log('Path.makeSVGPathData', 'end');
		return re;
	}

	/**
	 * Converts this path to Post Script
	 * @param {Number} lastX - Last x value in the sequence
	 * @param {Number} lastY - Last y value in the sequence
	 * @returns {Object}
	 */
	makePostScript(lastX = 0, lastY = 0) {
		// log(`Path.makePostScript`, 'start');

		if (!this.pathPoints) {
			return { re: '', lastX: lastX, lastY: lastY };
		}

		let p1;
		let p2;
		let p1h2x;
		let p1h2y;
		let p2h1x;
		let p2h1y;
		let p2ppx;
		let p2ppy;
		let trr = '';
		let re = `${this.pathPoints[0].p.x - lastX} ${this.pathPoints[0].p.y - lastY} rmoveto
		`;

		// log('\n\t ' + re);
		for (let cp = 0; cp < this.pathPoints.length; cp++) {
			p1 = this.pathPoints[cp];
			// p2 = this.pathPoints[(cp+1) % this.pathPoints.length];
			p2 = this.pathPoints[this.getNextPointNumber(cp)];
			p1h2x = p1.h2.x - p1.p.x;
			p1h2y = p1.h2.y - p1.p.y;
			p2h1x = p2.h1.x - p1.h2.x;
			p2h1y = p2.h1.y - p1.h2.y;
			p2ppx = p2.p.x - p2.h1.x;
			p2ppy = p2.p.y - p2.h1.y;
			trr = `
					${p1h2x} ${p1h2y} ${p2h1x} ${p2h1y} ${p2ppx} ${p2ppy} rrcurveto
			`;
			// log('' + trr);
			re += trr;
		}

		// log(`Path.makePostScript`, 'end');
		return {
			re: re.replaceAll('\t', ''),
			lastX: p2.p.x,
			lastY: p2.p.y,
		};
	}

	// --------------------------------------------------------------
	// Boolean Combine
	// --------------------------------------------------------------
	/**
	 * PolySegment is an industry-standard way of describing Bezier paths
	 * @returns {PolySegment}
	 */
	makePolySegment() {
		// log(`Path.makePolySegment`, 'start');
		// log(`pathNumber: ${pathNumber}`);
		const seg = [];
		for (let pp = 0; pp < this.pathPoints.length; pp++) {
			seg.push(this.makeSegment(pp));
		}

		const re = new PolySegment({ segments: seg });

		// log(`returning`);
		// log(re);
		// log(`Path.makePolySegment`, 'end');

		return re;
	}

	/**
	 * Get a part of the path in Segment format
	 * @param {Number} num - segment number
	 * @returns {Segment}
	 */
	makeSegment(num = 0) {
		// log('Path.makeSegment', 'start');
		// log('passed ' + num);
		num = num % this.pathPoints.length;

		// check cache
		if (!this.cache.segments) this.cache.segments = [];
		if (this.cache.segments[num]) {
			// log(`Returning cached segment`);
			// log('Path.makeSegment', 'end');
			return this.cache.segments[num];
		}

		// log('validated as ' + num);
		const pp1 = this.pathPoints[num];
		let randomID = Math.round(Math.random() * 10000);
		if (!pp1.pointID) pp1.pointID = `point-${num}-${randomID}`;
		// let pp2 = this.pathPoints[(num+1)%this.pathPoints.length];
		const next = this.getNextPointNumber(num);
		const pp2 = this.pathPoints[next];
		if (!pp2.pointID) pp2.pointID = `point-${next}-${randomID}`;
		// log(pp1);
		// log(pp2);
		const re = new Segment({
			point1ID: pp1.pointID,
			p1x: pp1.p.x,
			p1y: pp1.p.y,
			p2x: pp1.h2.x,
			p2y: pp1.h2.y,
			p3x: pp2.h1.x,
			p3y: pp2.h1.y,
			p4x: pp2.p.x,
			p4y: pp2.p.y,
			point2ID: pp2.pointID,
		});
		this.cache.segments[num] = re;
		// log(re.print());
		// log('Path.makeSegment', 'end');

		return re;
	}
	/**
	 * If this path overlaps itself, add Path Points
	 * where it overlaps
	 */
	addPointsAtPathIntersections() {
		const polySegment = this.makePolySegment();
		polySegment.splitSegmentsAtIntersections();
		const newPath = polySegment.path;
		// this._pathPoints = clone(newPath.pathPoints);
		this._pathPoints = newPath.pathPoints;
	}

	/**
	 * Use a quick algorithm to get a segment's length
	 * @param {Number} num - segment number
	 * @returns {Number}
	 */
	calculateQuickSegmentLength(num = 0) {
		let re = this.makeSegment(num);
		return re.quickLength;
	}

	// --------------------------------------------------------------
	// methods for Actions
	// --------------------------------------------------------------

	/**
	 * Finds either the clockwise or counterclockwise winding of a path
	 * @returns {Number} - negative = clockwise, positive = counterclockwise, 0 = unknown
	 */
	findWinding() {
		// log(`Path.findWinding`, 'start');
		// negative = clockwise
		// positive = counterclockwise
		let windingNumber = 0;
		const numPoints = this.pathPoints.length;

		/**
		 * For a path with only two points, works out winding based on handle position.
		 * Assumes this path does not cross over itself.
		 * Initial calculation is based on assuming the point in question is
		 * to the left of the other point. This function can be re-used if
		 * the point is to the right if the 'flip' variable is set to true.
		 * Flip works through arcane magic, and it's true nature is unknown.
		 */
		function determinePointWindingByHandles(point, flip = false) {
			let result = 0;
			if (point.h1.y > point.p.y) {
				if (point.h2.y < point.p.y) {
					result = 1; // Counterclockwise
				} else if (point.h2.y > point.p.y) {
					if (point.h1.x < point.h2.x) {
						result = 1; // Counterclockwise
					} else if (point.h1.x > point.h2.x) {
						result = -1; // Clockwise
					}
					if (flip) result *= -1;
				}
			} else if (point.h1.y < point.p.y) {
				if (point.h2.y > point.p.y) {
					result = -1; // Clockwise
				} else if (point.h2.y < point.p.y) {
					if (point.h1.x < point.h2.x) {
						result = -1; // Clockwise
					} else if (point.h1.x > point.h2.x) {
						result = 1; // Counterclockwise
					}
					if (flip) result *= -1;
				}
			}
			if (flip) result *= -1;

			return result;
		}

		if (this.pathPoints.length < 2) {
			/*
				LESS THAN TWO POINTS - winding is unknowable
			*/
			windingNumber = 0;
		} else if (this.pathPoints.length === 2) {
			/*
				TWO POINTS
			*/
			let pp0 = this.pathPoints[0];
			let pp1 = this.pathPoints[1];
			if (!pp0.h1.use && !pp0.h2.use && !pp1.h1.use && !pp1.h2.use) {
				/*
					TWO POINTS with no handles = a straight line, winding is unknowable.
				*/
				windingNumber = 0;
			} else {
				/*
					TWO POINTS with at least one handle
				*/
				const leftPoint = pp1.p.x < pp0.p.x ? pp1 : pp0;
				const rightPoint = pp1.p.x >= pp0.p.x ? pp1 : pp0;
				windingNumber = determinePointWindingByHandles(leftPoint, false);
				if (windingNumber === 0) windingNumber = determinePointWindingByHandles(rightPoint, true);
			}
		} else if (this.pathPoints.length > 2) {
			/*
				MORE THAN TWO POINTS - use angle aggregate to determine winding.
			*/
			for (let i = 0; i < this.pathPoints.length; i++) {
				const thisP = this.pathPoints[i].p;
				const nextP = this.pathPoints[(i + 1) % numPoints].p;
				const nextNextP = this.pathPoints[(i + 2) % numPoints].p;
				// log(`point ${i} - x:${round(thisP.x)} y:${round(thisP.y)}`);
				const angle = calculateDeltaAngle(thisP, nextP, nextNextP);
				windingNumber += angle;
				// log(`\t angle: ${round(angle)} windingNumber: ${round(windingNumber)}`);
			}
		}

		// log(`returning ${windingNumber}`);
		// log(`Path.findWinding`, 'end');
		return windingNumber;
	}

	/**
	 * Reverses the order of the path points in the path,
	 * thus reversing the winding
	 */
	reverseWinding() {
		// log('Path.reverseWinding', 'start');
		let ht;

		if (this.pathPoints) {
			this.pathPoints.forEach((pp) => {
				ht = pp.h1;
				pp.h1 = pp.h2;
				pp.h2 = ht;
			});

			this.pathPoints.reverse();
			// this.winding *= -1;
			let end = this.pathPoints.pop();
			this.pathPoints.unshift(end);
		}
		// log('Path.reverseWinding', 'end');
	}

	/**
	 * Flips a path about a horizontal line
	 * @param {Number} mid - y value about which to flip
	 */
	flipNS(mid = this.maxes.center.y) {
		// log(`Path.flipNS`, 'start');
		// log(`mid: ${mid}`);

		// log(this.print());
		// const startingY = this.y;

		this.pathPoints.forEach((pp) => {
			pp.p.coord.y += (mid - pp.p.coord.y) * 2;
			pp.h1.coord.y += (mid - pp.h1.coord.y) * 2;
			pp.h2.coord.y += (mid - pp.h2.coord.y) * 2;
		});
		// this.y = startingY;
		this.reverseWinding();

		// log(this.print());
		// log(`Path.flipNS`, 'end');
	}

	/**
	 * Flips a path about a vertical line
	 * @param {Number} mid - x value about which to flip
	 */
	flipEW(mid = this.maxes.center.x) {
		// log(`Path.flipEW`, 'start');
		// log(this.print());
		// const startingX = this.x;
		// log(`calculating mid: (width)/2 + x = mid: ${this.width}/2 + ${this.x} = ${mid}`);

		this.pathPoints.forEach((pp) => {
			pp.p.coord.x += (mid - pp.p.coord.x) * 2;
			pp.h1.coord.x += (mid - pp.h1.coord.x) * 2;
			pp.h2.coord.x += (mid - pp.h2.coord.x) * 2;
		});
		// this.x = startingX;
		this.reverseWinding();

		// log(`Path.flipEW`, 'end');
	}

	/**
	 * Round all point x/y values to a certain precision
	 * @param {Number} precision - how many decimal places to round to
	 * @returns {Path} - reference to this path
	 */
	roundAll(precision = 0) {
		this.pathPoints.forEach((pp) => pp.roundAll(precision));
		return this;
	}

	/**
	 * Adds a Path Point to the end of this path
	 * @param {PathPoint} newPoint - Path Point to add
	 * @returns {PathPoint | Object} - reference to the added point
	 */
	addPathPoint(newPoint) {
		// log('Path.addPathPoint', 'start');
		// log('newPoint = ' + newPoint);
		newPoint = new PathPoint(newPoint);
		newPoint.parent = this;
		this.pathPoints.push(newPoint);
		this.changed();
		// log('Path.addPathPoint', 'end');

		return newPoint;
	}

	/**
	 * Add a Path Point along a curve at a certain distance
	 * @param {Number} pointNumber - point number before the new split
	 * @param {Number} t - decimal from 0 to 1 representing how far along the curve to split
	 * @returns {PathPoint} - reference to the added path point
	 */
	insertPathPoint(pointNumber = 0, t = 0.5, round = false) {
		// log(`Path.insertPathPoint`, 'start');
		// log(`pointNumber: ${pointNumber}`);
		// log(`t: ${t}`);
		// log(`round: ${round}`);

		const pp1 = this.pathPoints[pointNumber];
		const pp2i = this.getNextPointNumber(pointNumber);
		const pp2 = this.pathPoints[pp2i];
		let nP;
		let nH1;
		let nH2;
		let ppn;

		if (this.pathPoints.length > 1) {
			const splits = this.makeSegment(pointNumber).split(t);
			const s1 = splits[0];
			const s2 = splits[1];
			// log(`new segments:`);
			// console.table(s1.valuesAsArray);
			// console.table(s2.valuesAsArray);

			// New Point
			nP = new ControlPoint({ coord: { x: s1.p4x, y: s1.p4y } });
			nH1 = new ControlPoint({ coord: { x: s1.p3x, y: s1.p3y } });
			nH2 = new ControlPoint({ coord: { x: s2.p2x, y: s2.p2y } });
			ppn = new PathPoint({ p: nP, h1: nH1, h2: nH2 }); // don't include type for ppn

			// Update P1
			if (pp1.type === 'symmetric') pp1.type = 'flat';
			pp1.h2.x = s1.p2x;
			pp1.h2.y = s1.p2y;

			// Update P2
			if (pp2.type === 'symmetric') pp2.type = 'flat';
			pp2.h1.x = s2.p3x;
			pp2.h1.y = s2.p3y;
		} else {
			// just make a random point
			const d = 100;
			nP = new ControlPoint({ coord: { x: pp1.p.x + d, y: pp1.p.y + d } });
			nH1 = new ControlPoint({ coord: { x: pp1.h2.x + d, y: pp1.h2.y + d } });
			nH2 = new ControlPoint({ coord: { x: pp1.h1.x + d, y: pp1.h1.y + d } });
			ppn = new PathPoint({ p: nP, h1: nH1, h2: nH2, type: pp1.type });
		}

		// Round
		if (round) ppn.roundAll(0);

		// Insert
		ppn.parent = this;
		this.pathPoints.splice(pp2i, 0, ppn);

		// log(`\n⮟ppn⮟`);
		// log(ppn);

		// log(`Path.insertPathPoint`, 'end');
		return ppn;
	}

	/**
	 * Takes two or more Path Points from this path and merges them.
	 * The new P coordinate will be an average of all the other P coordinates.
	 * The resulting H1 will be the H1 from the first Path Point.
	 * The resulting H2 will be the H2 from the last Path Point.
	 * H1 and H2 will be moved according to the delta between their previous P
	 * coordinates and the new resulting P cooridinate.
	 * @param {Array} points - points in this path to merge
	 * @returns {PathPoint} - resulting single point
	 */
	mergePathPoints(points = []) {
		// log(`Path.mergePathPoints`, 'start');
		if (points.length < 2) return;

		// find new x and y
		let newX = 0;
		let newY = 0;
		for (let i = 0; i < points.length; i++) {
			newX += points[i].p.x;
			newY += points[i].p.y;
		}
		newX /= points.length;
		newY /= points.length;

		// Find new h1 and h2
		/*
			!Important! Assumes points are contiguous
			and are in order, even across point zero.
			So, for a path of length 10, a valid set
			could be [8, 9, 0, 1, 2] but not [0, 1, 2, 8, 9].
			msPoints.sortPathPointsByContiguous() will ensure this.
		*/
		let lowPoint = points.at(0);
		let highPoint = points.at(-1);

		// log(`\n⮟Point ${highPoint.pointNumber} is highPoint.h2⮟`);
		// log(highPoint.h2);
		// log(`\n⮟Point ${lowPoint.pointNumber} is lowPoint.h1⮟`);
		// log(lowPoint.h1);

		const newH1 = new ControlPoint(lowPoint.h1);
		// log(`\n⮟newH1⮟`);
		// log(newH1);
		const newH2 = new ControlPoint(highPoint.h2);
		// log(`\n⮟newH2⮟`);
		// log(newH2);

		// Assemble new point
		const newPoint = new PathPoint({
			p: new ControlPoint({ coord: { x: newX, y: newY } }),
			h1: newH1,
			h2: newH2,
		});
		newPoint.parent = this;

		// Remove old points
		const insertPosition = points[0].pointNumber;
		for (let i = 0; i < points.length; i++) {
			// log(`Loop ${i} Removing point ${points[i].pointNumber}`);
			this.pathPoints.splice(points[i].pointNumber, 1);
		}

		// Add new point
		this.pathPoints.splice(insertPosition, 0, newPoint);
		this.changed();
		// log(`Path.mergePathPoints`, 'end');
		return newPoint;
	}

	/**
	 * Given a target point, find the closes point on this path
	 * @param {XYPoint} point - x/y value to target
	 * @param {Boolean} wantSecond - return the second result
	 * @returns {Object}
	 */
	findClosestPointOnCurve(point = new XYPoint(), wantSecond = false) {
		// log(`Path.findClosestPointOnCurve`, 'start');
		// log(`point.x: ${point.x}`);
		// log(`point.y: ${point.y}`);
		let grains = 10000;
		/**
		 * @type {Boolean | Object}
		 */
		let first = false;
		let second;
		let minDistance = 999999999;
		let check;
		let d;

		for (let pp = 0; pp < this.pathPoints.length; pp++) {
			grains = this.makeSegment(pp).quickLength * 100;

			for (let t = 0; t < 1; t += 1 / grains) {
				check = this.findXYPointFromSplit(t, pp);
				d = Math.sqrt(
					(check.x - point.x) * (check.x - point.x) + (check.y - point.y) * (check.y - point.y)
				);

				if (d < minDistance) {
					if (first && first.point !== pp) second = clone(first);

					minDistance = d;
					first = {
						point: pp,
						split: t,
						distance: d,
						x: check.x,
						y: check.y,
					};
				}
			}
		}
		let result = wantSecond ? second : first;
		// log(`\n⮟result⮟`);
		// log(result);
		// log(`Path.findClosestPointOnCurve`, 'end');
		return result;
	}

	/**
	 * Get an X/Y value from a curve split
	 * @param {Number =} t - decimal from 0 to 1 how far along the curve to split
	 * @param {Number =} pointNumber - after which point to split
	 * @returns {XYPoint}
	 */
	findXYPointFromSplit(t = 0.5, pointNumber = 0) {
		if (this.pathPoints.length > 1) {
			const seg = this.makeSegment(pointNumber);
			return seg.findXYPointFromSplit(t);
		} else {
			return this.pathPoints[0].p;
		}
	}

	// -----------------------------------------------------------------------------
	// Calc Maxes
	// -----------------------------------------------------------------------------

	/**
	 * Find the bounding box for this path
	 */
	recalculateMaxes() {
		// log('Path.recalculateMaxes', 'start');
		// log(`before ${this.cache?.maxes?.print()}`);
		this.cache.maxes = new Maxes();

		if (!this.cache.segments) this.cache.segments = [];

		// log('this');
		// log(this);

		let maxesArray = this.pathPoints.map((point, index) => {
			let seg = this.makeSegment(index);
			return seg.maxes;
		});
		// log('maxesArray');
		// log(maxesArray);

		this.cache.maxes = getOverallMaxes(maxesArray);
		// for (let s = 0; s < this.pathPoints.length; s++) {
		// 	// log('++++++ starting seg ' + s);
		// 	seg = this.makeSegment(s);
		// 	// log(`this seg maxes ${seg.maxes.print()}`);
		// 	// log(`this maxes ${this.cache.maxes.print()}`);

		// 	this.cache.maxes = getOverallMaxes([this.cache.maxes, seg.maxes]);
		// 	// log(`path maxes is now ${this.cache.maxes.print()}`);
		// 	// log('++++++ ending seg ' + s);
		// }

		// this.maxes.roundAll(4);
		// log(`after> ${this.cache.maxes.print()}`);
		// log('Path.recalculateMaxes', 'end');
	}

	/**
	 * Checks all the data for NaN
	 * @returns {Boolean}
	 */
	checkForNaN() {
		for (let pp = 0; pp < this.pathPoints.length; pp++) {
			const tp = this.pathPoints[pp];
			if (
				isNaN(tp.p.x) ||
				isNaN(tp.p.y) ||
				isNaN(tp.h1.x) ||
				isNaN(tp.h1.y) ||
				isNaN(tp.h2.x) ||
				isNaN(tp.h2.y)
			) {
				return true;
			}
		}
		return false;
	}
}
