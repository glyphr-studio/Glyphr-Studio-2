import { GlyphElement } from './glyph_element.js';
import { XYPoint } from './xy_point.js';
import { Maxes } from './maxes.js';
import { Segment } from './segment.js';
import { PolySegment } from './poly_segment.js';
import { PathPoint } from './path_point.js';
import { getOverallMaxes, maxesOverlap } from './maxes.js';
import { findSegmentIntersections } from './poly_segment.js';
import {
	clone,
	round,
	isVal,
	hasNonValues,
	duplicates,
	pointsAreEqual,
	strSan,
} from '../common/functions.js';

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
	 * @param {array} pathPoints - array of Path Point objects that make up this path
	 * @param {number} winding - number representing winding direction
	 * @param {object} parent - link to the parent Glyph object
	 */
	constructor({
		name = 'Path',
		pathPoints = [],
		winding,
		xLock = false,
		yLock = false,
		wLock = false,
		hLock = false,
		ratioLock = false,
		parent = false,
	} = {}) {
		// log(`Path.constructor`, 'start');
		super();
		this.name = name;
		this.pathPoints = pathPoints;
		this.winding = winding;
		this.xLock = xLock;
		this.yLock = yLock;
		this.wLock = wLock;
		this.hLock = hLock;
		this.ratioLock = ratioLock;
		this.parent = parent;

		this.objType = 'Path';

		// log(`Path.constructor - End\n`);
	}

	// --------------------------------------------------------------
	// Common Glyphr Studio object methods
	// --------------------------------------------------------------

	/**
	 * Export object properties that need to be saved to a project file
	 * @param {boolean} verbose - export some extra stuff that makes the saved object more readable
	 * @returns {*}
	 */
	save(verbose = false) {
		const re = {
			name: this.name,
			pathPoints: [],
			winding: this.winding,
		};

		if (this.xLock) re.xLock = true;
		if (this.yLock) re.yLock = true;
		if (this.wLock) re.wLock = true;
		if (this.hLock) re.hLock = true;
		if (this.ratioLock) re.ratioLock = true;

		this._pathPoints.forEach((pp) => {
			re.pathPoints.push(pp.save(verbose));
		});

		if (verbose) re.objType = this.objType;

		return re;
	}

	/**
	 * Create a nicely-formatted string for this object
	 * @param {number} level - how far down we are
	 * @returns {string}
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
		this._pathPoints.forEach((pp, i) => {
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
	 * @returns {string}
	 */
	get name() {
		return this._name;
	}

	/**
	 * Get PathPoints
	 * @returns {array}
	 */
	get pathPoints() {
		return this._pathPoints;
	}

	/**
	 * Get Winding
	 * negative = clockwise
	 * positive = counterclockwise
	 * zero = unknown
	 * @returns {number}
	 */
	get winding() {
		if (!isVal(this._winding)) {
			if (this.findWinding) {
				this.findWinding();
			} else {
				this._winding = 0;
			}
		}
		return this._winding;
	}

	/**
	 * Get X position
	 * @returns {number} x
	 */
	get x() {
		return this.maxes.xMin;
	}

	/**
	 * Get Y position
	 * @returns {number} y
	 */
	get y() {
		return this.maxes.yMax;
	}

	/**
	 * Get Height
	 * @returns {number}
	 */
	get height() {
		const h = this.maxes.yMax - this.maxes.yMin;
		return Math.max(h, 0);
	}

	/**
	 * Get Width
	 * @returns {number}
	 */
	get width() {
		const w = this.maxes.xMax - this.maxes.xMin;
		return Math.max(w, 0);
	}

	/**
	 * get xLock
	 * @returns {boolean}
	 */
	get xLock() {
		return this._xLock;
	}

	/**
	 * get yLock
	 * @returns {boolean}
	 */
	get yLock() {
		return this._yLock;
	}

	/**
	 * get wLock
	 * @returns {boolean}
	 */
	get wLock() {
		return this._wLock;
	}

	/**
	 * get hLock
	 * @returns {boolean}
	 */
	get hLock() {
		return this._hLock;
	}

	/**
	 * get ratioLock
	 * @returns {boolean}
	 */
	get ratioLock() {
		return this._ratioLock;
	}

	/**
	 * Get Maxes
	 * @returns {Maxes}
	 */
	get maxes() {
		// log('Path GET maxes', 'start');
		if (!this.cache.maxes || hasNonValues(this.cache.maxes)) {
			// log('no cache, recalculateMaxes');
			this.recalculateMaxes();
			// log('Path GET maxes', 'end');
		}

		// log('returning ' + json(this.maxes, true));
		// log('Path GET maxes', 'end');
		return new Maxes(this.cache.maxes);
	}

	/**
	 * Get or generate SVG path data
	 * @returns {string}
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
	 * @param {string} name
	 * @returns {Path} - reference to this Path
	 */
	set name(name) {
		name = strSan(name);
		// log('sanitized: ' + name);
		if (name !== '') {
			this._name = name;
		} else {
			return false;
		}

		return this;
	}

	/**
	 * Set PathPoints
	 * @param {array} pathPoints - array of Path Points
	 * @returns {Path} - reference to this Path
	 */
	set pathPoints(newPathPoints) {
		this._pathPoints = [];

		if (newPathPoints && newPathPoints.length) {
			// log('NEW PATH : Hydrating Path Points, length ' + pathPoints.length);
			for (let i = 0; i < newPathPoints.length; i++) {
				newPathPoints[i].parent = this;
				this._pathPoints[i] = new PathPoint(newPathPoints[i]);
			}
		}
	}

	/**
	 * Set Winding
	 * negative = clockwise
	 * positive = counterclockwise
	 * zero = unknown
	 * @param {number} winding
	 * @returns {Path} - reference to this Path
	 */
	set winding(winding) {
		if (isVal(winding)) this._winding = winding;
		else this.findWinding();
	}

	/**
	 * Set X position
	 * @param {number} x
	 * @returns {Path} - reference to this Path
	 */
	set x(x) {
		this.setPathPosition(x, false);
	}

	/**
	 * Set Y position
	 * @param {number} y
	 * @returns {Path} - reference to this Path
	 */
	set y(y) {
		this.setPathPosition(false, y);
	}

	/**
	 * Set Height
	 * @param {number} h
	 * @returns {Path} - reference to this Path
	 */
	set height(h) {
		this.setPathSize(false, h);
	}

	/**
	 * Set Width
	 * @param {number} w
	 * @returns {Path} - reference to this Path
	 */
	set width(w) {
		this.setPathSize(w, false);
	}

	/**
	 * set xLock
	 * @param {boolean} xLock
	 * @returns {Path} - reference to this Path
	 */
	set xLock(xLock) {
		this._xLock = !!xLock;
		return this;
	}

	/**
	 * set yLock
	 * @param {boolean} yLock
	 * @returns {Path} - reference to this Path
	 */
	set yLock(yLock) {
		this._yLock = !!yLock;
		return this;
	}

	/**
	 * set wLock
	 * @param {boolean} wLock
	 * @returns {Path} - reference to this Path
	 */
	set wLock(wLock) {
		this._wLock = !!wLock;
		return this;
	}

	/**
	 * set hLock
	 * @param {boolean} hLock
	 * @returns {Path} - reference to this Path
	 */
	set hLock(hLock) {
		this._hLock = !!hLock;
		return this;
	}

	/**
	 * set ratioLock
	 * @param {boolean} ratioLock
	 * @returns {Path} - reference to this Path
	 */
	set ratioLock(ratioLock) {
		this._ratioLock = !!ratioLock;
		return this;
	}

	/**
	 * Set Maxes
	 * @param {Maxes} maxes
	 * @returns {Path} - reference to this Path
	 */
	set maxes(maxes) {
		// log(`Path SET maxes`, 'start');
		this.cache.maxes = {};
		this.cache.maxes = new Maxes(maxes);
		// log(`Path SET maxes`, 'end');
	}

	/**
	 * Set or generate SVG path data
	 * @param {string} data
	 * @returns {Path} - reference to this Path
	 */
	set svgPathData(data) {
		this.cache.svgPathData = data;
	}

	/**
	 * For glyph elements with lockable parameters, this function
	 * will be overwritten to return a boolean.
	 * By default, properties are all unlocked.
	 * @param {string} propertyName - property to check if locked
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
	 * @param {string} propertyName - property to lock
	 */
	lock(propertyName) {
		if (propertyName === 'x') this.xLock = true;
		if (propertyName === 'y') this.yLock = true;
		if (propertyName === 'width') this.wLock = true;
		if (propertyName === 'height') this.hLock = true;
	}

	/**
	 * Sets locks based on property name
	 * @param {string} propertyName - property to unlock
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
	 * @param {number} nw - new Width
	 * @param {number} nh - new Height
	 * @param {boolean} ratioLock - if one is changed, change the other
	 * @returns {Path} - reference to this path
	 */
	setPathSize(nw = false, nh = false, ratioLock = false) {
		if (nw !== false) nw = parseFloat(nw);
		if (nh !== false) nh = parseFloat(nh);

		const dw = nw !== false ? nw - this.width : 0;
		const dh = nh !== false ? nh - this.height : 0;

		this.updatePathSize(dw, dh, ratioLock);

		return this;
	}

	/**
	 * Updates the overall Path width or height by a delta value
	 * @param {number} dw - delta width
	 * @param {number} dh - delta height
	 * @param {boolean} ratioLock - if one is changed, change the other
	 * @returns {Path} - reference to this path
	 */
	updatePathSize(dw = 0, dh = 0, ratioLock = false) {
		// log('Path.updatePathSize', 'start');
		// log('dw,dh,rl\t'+dw+' , '+dh+' , '+ratioLock);
		dw = parseFloat(dw);
		dh = parseFloat(dh);
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

		// ControlPoint.x and ControlPoint.y for type === 'p' also moves h1 / h2
		// Directly access .coord to avoid this
		for (let e = 0; e < this.pathPoints.length; e++) {
			const pp = this.pathPoints[e];
			pp.p.coord.x = (pp.p.coord.x - this.maxes.xMin) * ratioWidth + this.maxes.xMin;
			pp.h1.coord.x = (pp.h1.coord.x - this.maxes.xMin) * ratioWidth + this.maxes.xMin;
			pp.h2.coord.x = (pp.h2.coord.x - this.maxes.xMin) * ratioWidth + this.maxes.xMin;
			pp.p.coord.y = (pp.p.coord.y - this.maxes.yMin) * ratioHeight + this.maxes.yMin;
			pp.h1.coord.y = (pp.h1.coord.y - this.maxes.yMin) * ratioHeight + this.maxes.yMin;
			pp.h2.coord.y = (pp.h2.coord.y - this.maxes.yMin) * ratioHeight + this.maxes.yMin;
		}

		if (this.checkForNaN()) {
			// log('NAN FOUND IN THIS PATH');
			// log('this.maxes = ' + json(this.maxes));
			// log('oldWidth = ' + oldWidth);
			// log('oldHeight = ' + oldHeight);
			// log('newWidth = ' + newWidth);
			// log('newHeight = ' + newHeight);
			// log('ratioHeight = ' + ratioHeight);
			// log('ratioWidth = ' + ratioWidth);
		}

		// log('Path.updatePathSize', 'end');
	}

	/**
	 * Moves a path to a specific position
	 * @param {number} nx - new X
	 * @param {number} ny - new Y
	 * @returns {Path} - reference to this path
	 */
	setPathPosition(nx = false, ny = false) {
		// log('Path.setPathPosition', 'start');
		// log('nx ny force:\t ' + nx + '\t ' + ny + '\t ' + force);

		if (nx !== false) nx = parseFloat(nx);
		if (ny !== false) ny = parseFloat(ny);

		const dx = nx !== false ? nx * 1 - this.maxes.xMin : 0;
		const dy = ny !== false ? ny * 1 - this.maxes.yMax : 0;
		// log('dx dy: ' + dx + ' ' + dy);

		this.updatePathPosition(dx, dy);
		// log('Path.setPathPosition', 'end');
	}

	/**
	 * Moves the path based on delta values
	 * @param {number} dx - delta X
	 * @param {number} dy - delta Y
	 * @returns {Path} - reference to this path
	 */
	updatePathPosition(dx = 0, dy = 0) {
		// log('Path.updatePathPosition', 'start');

		dx = parseFloat(dx);
		dy = parseFloat(dy);

		// log(`dx:${dx}\tdy:${dy}`);
		for (let d = 0; d < this.pathPoints.length; d++) {
			const pp = this.pathPoints[d];
			// log('-------------------- pathPoint #' + d);
			pp.updatePathPointPosition('p', dx, dy);
		}

		// log('Path.updatePathPosition', 'end');
	}

	/**
	 * Rotate this path about a point
	 * @param {number} angle - how much to rotate (radians)
	 * @param {XYPoint} about - x/y center of rotation
	 * @returns {Path} - reference to this path
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

	// --------------------------------------------------------------
	//  Methods
	// --------------------------------------------------------------

	/**
	 * Get the next point number in the path
	 * Handle looping
	 * @param {number} pointNumber - point number
	 * @returns {number}
	 */
	getNextPointNum(pointNumber = 0) {
		pointNumber = parseInt(pointNumber);
		pointNumber += 1;
		pointNumber = pointNumber % this.pathPoints.length;
		return pointNumber;
	}

	/**
	 * Get the previous point number in the path
	 * Handle looping
	 * @param {number} pointNumber - point number
	 * @returns {number}
	 */
	getPreviousPointNum(pointNumber = 0) {
		pointNumber = parseInt(pointNumber);
		pointNumber -= 1;
		if (pointNumber < 0) {
			pointNumber = pointNumber + this.pathPoints.length;
		}

		return pointNumber;
	}

	/**
	 * If this path overlaps itself, add Path Points
	 * where it overlaps
	 */
	addPointsAtPathIntersections() {
		const polySegment = this.makePolySegment();
		polySegment.splitSegmentsAtIntersections();
		const newPath = polySegment.getPath();
		// this._pathPoints = clone(newPath.pathPoints);
		this._pathPoints = newPath.pathPoints;
	}

	/**
	 * Looks for a point in the path that matches a given point
	 * @param {XYPoint} point - Point to test for
	 * @param {boolean} wantSecond - return the second result, not the first
	 * @returns {PathPoint}
	 */
	containsPoint(point, wantSecond) {
		for (let pp = 0; pp < this.pathPoints.length; pp++) {
			if (pointsAreEqual(point, this.pathPoints[pp].p, 0.01)) {
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
	 * Make SVG from this Path
	 * @param {number} size - how big
	 * @param {number} gutter - margin
	 * @param {number} upm - project UPM size
	 * @param {number} descender - project descender size
	 * @returns {string} - svg
	 */
	makeSVG(size = 50, gutter = 5, upm = 1000, descender = 300) {
		const charScale = (size - gutter * 2) / size;
		const gutterScale = (gutter / size) * upm;
		const vbSize = upm - gutter * 2;
		let re = `<svg version="1.1" ';
			xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
			width="${size}" height="${size}" viewBox="0,0,${vbSize},${vbSize}"
		>
			<g transform="
				translate(${gutterScale},${upm - descender - gutterScale / 2})
				scale(${charScale}, -${charScale})"
			>
				<path d="${this.svgPathData}"/>
			</g>
		</svg>`;
		return re;
	}

	/**
	 * Create SVG data
	 * @param {string} glyphName - Name of the glyph this path belongs to
	 * @param {number} roundValue - how many decimal places
	 * @returns {string}
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

		// log('makePathPostScript:\n\t ' + re);
		if (re.indexOf('NaN') > -1) {
			console.warn(glyphName + ' PathPoint 0 MOVE has NaN: ' + re);
			// log(this.pathPoints[0]);
		}

		for (let cp = 0; cp < this.pathPoints.length; cp++) {
			p1 = this.pathPoints[cp];
			// p2 = this.pathPoints[(cp+1) % this.pathPoints.length];
			p2 = this.pathPoints[this.getNextPointNum(cp)];
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
	 * Make a PostScript path from this path
	 * PostScript paths use relative MoveTo commands, so
	 * this path must know about where the last path left off
	 * @param {number} lastX - x from previous path
	 * @param {number} lastY - y from previous path
	 * @returns {string} - PostScript path data
	 */
	makePostScript(lastX = 0, lastY = 0) {
		return this.makePathPostScript(lastX, lastY);
	}

	/**
	 * Converts this path to Post Script
	 * @param {number} lastX - Last x value in the sequence
	 * @param {number} lastY - Last y value in the sequence
	 * @returns {string}
	 */
	makePathPostScript(lastX = 0, lastY = 0) {
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
		let re =
			'\t\t\t\t' +
			(this.pathPoints[0].p.x - lastX) +
			' ' +
			(this.pathPoints[0].p.y - lastY) +
			' rmoveto \n';

		// log('makePathPostScript:\n\t ' + re);
		for (let cp = 0; cp < this.pathPoints.length; cp++) {
			p1 = this.pathPoints[cp];
			// p2 = this.pathPoints[(cp+1) % this.pathPoints.length];
			p2 = this.pathPoints[this.getNextPointNum(cp)];
			p1h2x = p1.h2.x - p1.p.x;
			p1h2y = p1.h2.y - p1.p.y;
			p2h1x = p2.h1.x - p1.h2.x;
			p2h1y = p2.h1.y - p1.h2.y;
			p2ppx = p2.p.x - p2.h1.x;
			p2ppy = p2.p.y - p2.h1.y;
			trr =
				'\t\t\t\t' +
				p1h2x +
				' ' +
				p1h2y +
				' ' +
				p2h1x +
				' ' +
				p2h1y +
				' ' +
				p2ppx +
				' ' +
				p2ppy +
				' rrcurveto \n';
			// log('' + trr);
			re += trr;
		}

		return {
			re: re,
			lastX: p2.p.x,
			lastY: p2.p.y,
		};
	}

	/**
	 * Get a part of the path in Segment format
	 * @param {number} num - segment number
	 * @returns {Segment}
	 */
	makeSegment(num = 0) {
		// log('Path.makeSegment', 'start');
		// log('passed ' + num);
		// make a segment

		num = num % this.pathPoints.length;

		// check cache
		if (!this.cache.segments) this.cache.segments = [];
		if (this.cache.segments[num]) return this.cache.segments[num];

		// log('validated as ' + num);
		const pp1 = this.pathPoints[num];
		// var pp2 = this.pathPoints[(num+1)%this.pathPoints.length];
		const pp2 = this.pathPoints[this.getNextPointNum(num)];

		const re = new Segment({
			p1x: pp1.p.x,
			p1y: pp1.p.y,
			p2x: pp1.h2.x,
			p2y: pp1.h2.y,
			p3x: pp2.h1.x,
			p3y: pp2.h1.y,
			p4x: pp2.p.x,
			p4y: pp2.p.y,
		});
		this.cache.segments[num] = re;
		// log(re.print());
		// log('Path.makeSegment', 'end');

		return re;
	}

	/**
	 * Use a quick algorithm to get a segment's length
	 * @param {number} num - segment number
	 * @returns {number}
	 */
	calculateQuickSegmentLength(num = 0) {
		let re = this.makeSegment(num);
		re = re.quickLength;
		return re;
	}

	/**
	 * PolySegment is an industry-standard way of describing Bezier paths
	 * @returns {PolySegment}
	 */
	makePolySegment() {
		// log(`Path.makePolySegment`, 'start');

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

	// --------------------------------------------------------------
	// methods for Actions
	// --------------------------------------------------------------

	/**
	 * Finds either the clockwise or counterclockwise winding of a path
	 * @param {boolean} secondTry - If the first try fails, do a trick for a second pass
	 * @returns {number} - negative = clockwise, positive = counterclockwise, 0 = unknown
	 */
	findWinding(secondTry) {
		// log('Path.findWinding', 'start');
		let j;
		let k;
		let z;
		let count = -1;
		const parr = this.pathPoints;

		if (parr.length === 2) {
			count = parr[1].p.x > parr[0].p.x ? -1 : 1;
		} else if (parr.length > 2) {
			for (let i = 0; i < parr.length; i++) {
				j = (i + 1) % parr.length;
				k = (i + 2) % parr.length;
				z = (parr[j].p.x - parr[i].p.x) * (parr[k].p.y - parr[j].p.y);
				z -= (parr[j].p.y - parr[i].p.y) * (parr[k].p.x - parr[j].p.x);

				if (z < 0) count--;
				else if (z > 0) count++;
			}
		}

		// negative = clockwise
		// positive = counterclockwise
		if (count === 0 && !secondTry) {
			// log('second try...');
			this.reverseWinding();
			count = this.findWinding(true) * -1;
			this.reverseWinding();
		}

		this._winding = count;
		// if(!secondTry) {
		//   log('returning: ' + count);
		//   log('Path.findWinding', 'end');
		// }
		return count;
	}

	/**
	 * Reverses the order of the path points in the path,
	 * thus reversing the winding
	 */
	reverseWinding() {
		// log('Path.reverseWinding', 'start');
		let ht;
		let pp;

		if (this.pathPoints) {
			for (let i = 0; i < this.pathPoints.length; i++) {
				pp = this.pathPoints[i];
				ht = pp.h1;
				pp.h1 = pp.h2;
				pp.h2 = ht;
			}

			this.pathPoints.reverse();
			this.winding *= -1;

			if (this.winding === 0 || !isVal(this.winding)) {
				this.findWinding(true);
			}
		}
		// log('Path.reverseWinding', 'end');
	}

	/**
	 * Flips a path about a horizontal line
	 * @param {number} mid - y value about which to flip
	 * @returns {Path} - reference to this path
	 */
	flipNS(mid = this.maxes.center.y) {
		// log(`Path.flipNS`, 'start');
		// log(`mid: ${mid}`);

		// log(this.print());
		// const startingY = this.y;

		for (let e = 0; e < this.pathPoints.length; e++) {
			const pp = this.pathPoints[e];
			pp.p.coord.y += (mid - pp.p.coord.y) * 2;
			pp.h1.coord.y += (mid - pp.h1.coord.y) * 2;
			pp.h2.coord.y += (mid - pp.h2.coord.y) * 2;
		}
		// this.y = startingY;
		this.reverseWinding();

		// log(this.print());
		// log(`Path.flipNS`, 'end');
	}

	/**
	 * Flips a path about a vertical line
	 * @param {number} mid - x value about which to flip
	 * @returns {Path} - reference to this path
	 */
	flipEW(mid = this.maxes.center.x) {
		// log(`Path.flipEW`, 'start');
		// log(this.print());
		// const startingX = this.x;
		// log(`calculating mid: (width)/2 + x = mid: ${this.width}/2 + ${this.x} = ${mid}`);

		for (let e = 0; e < this.pathPoints.length; e++) {
			const pp = this.pathPoints[e];
			pp.p.coord.x += (mid - pp.p.coord.x) * 2;
			pp.h1.coord.x += (mid - pp.h1.coord.x) * 2;
			pp.h2.coord.x += (mid - pp.h2.coord.x) * 2;
		}
		// this.x = startingX;
		this.reverseWinding();

		// log(`Path.flipEW`, 'end');
	}

	/**
	 * Round all point x/y values to a certain precision
	 * @param {number} precision - how many decimal places to round to
	 * @returns {Path} - reference to this path
	 */
	roundAll(precision = 0) {
		for (let e = 0; e < this.pathPoints.length; e++) {
			const pp = this.pathPoints[e];
			pp.roundAll(precision);
		}
		return this;
	}

	/**
	 * Adds a Path Point to the end of this path
	 * @param {PathPoint} newPoint - Path Point to add
	 * @returns {PathPoint} - reference to the added point
	 */
	addPathPoint(newPoint) {
		// log('Path.addPathPoint', 'start');
		// log('newPoint = ' + newPoint);
		newPoint.parent = this;
		this.pathPoints.push(newPoint);
		this.findWinding();
		this.changed();
		// log('Path.addPathPoint', 'end');

		return newPoint;
	}

	/**
	 * Add a Path Point along a curve at a certain distance
	 * @param {number} t - decimal from 0 to 1 representing how far along the curve to split
	 * @param {number} pointNumber - point number before the new split
	 * @returns {PathPoint} - reference to the added path point
	 */
	insertPathPoint(pointNumber = 0, t = 0.5) {
		const pp1i = pointNumber;
		const pp1 = pp1i === false ? this.pathPoints[0] : this.pathPoints[pp1i];
		// var pp2i = (pp1i+1)%this.pathPoints.length;
		const pp2i = this.getNextPointNum(pp1i);
		const pp2 = this.pathPoints[pp2i];
		let nP;
		let nH1;
		let nH2;
		let ppn;

		if (this.pathPoints.length > 1) {
			const splits = this.makeSegment(pp1i).split(t);
			const s1 = splits[0];
			const s2 = splits[1];

			// New Point
			nP = { coord: { x: s1.p4x, y: s1.p4y } };
			nH1 = { coord: { x: s1.p3x, y: s1.p3y } };
			nH2 = { coord: { x: s2.p2x, y: s2.p2y } };
			ppn = new PathPoint({ p: nP, h1: nH1, h2: nH2, type: 'flat' });
			ppn.roundAll();

			// Update P1
			if (pp1.type === 'symmetric') pp1.type = 'flat';
			pp1.h2.x = s1.p2x;
			pp1.h2.y = s1.p2y;
			pp1.roundAll();

			// Update P2
			if (pp2.type === 'symmetric') pp2.type = 'flat';
			pp2.h1.x = s2.p3x;
			pp2.h1.y = s2.p3y;
			pp2.roundAll();
		} else {
			// just make a random point
			const d = 100;
			nP = { coord: { x: pp1.p.x + d, y: pp1.p.y + d } };
			nH1 = { coord: { x: pp1.h2.x + d, y: pp1.h2.y + d } };
			nH2 = { coord: { x: pp1.h1.x + d, y: pp1.h1.y + d } };
			ppn = new PathPoint({ p: nP, h1: nH1, h2: nH2, type: pp1.type });
		}

		// Insert
		ppn.parent = this;
		this.pathPoints.splice(pp2i, 0, ppn);
		// this.selectPathPoint(pp2i);

		return ppn;
	}

	/**
	 * Given a target point, find the closes point on this path
	 * @param {XYPoint} point - x/y value to target
	 * @param {boolean} wantSecond - return the second result
	 * @returns {object}
	 */
	findClosestPointOnCurve(point = new XYPoint(), wantSecond = false) {
		let grains = 10000;
		let first = false;
		let second = false;
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
		return wantSecond ? second : first;
	}

	/**
	 * Get an X/Y value from a curve split
	 * @param {number} t - decimal from 0 to 1 how far along the curve to split
	 * @param {number} pointNumber - after which point to split
	 * @returns {XYPoint}
	 */
	findXYPointFromSplit(t, pointNumber = 0) {
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
		// log(`before ${this.cache.maxes.print()}`);
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
	 * Looks through the whole path and sets erroneous values to 0
	 * @param {string} calledBy - message for who called this
	 */
	validate() {
		let tp;
		for (let pp = 0; pp < this.pathPoints.length; pp++) {
			tp = this.pathPoints[pp];
			if (!tp.p.x && tp.p.x !== 0) {
				// log(`VALIDATE PATH: ${calledBy} - resetting point ${pp} p.x from ${tp.p.x}`);
				tp.p.x = 0;
			}
			if (!tp.p.y && tp.p.y !== 0) {
				// log(`VALIDATE PATH: ${calledBy} - resetting point ${pp} p.y from ${tp.p.y}`);
				tp.p.y = 0;
			}
			if (!tp.h1.x && tp.h1.x !== 0) {
				// log(`VALIDATE PATH: ${calledBy} - resetting point ${pp} h1.x from ${tp.h1.x}`);
				tp.h1.x = 0;
			}
			if (!tp.h1.y && tp.h1.y !== 0) {
				// log(`VALIDATE PATH: ${calledBy} - resetting point ${pp} h1.y from ${tp.h1.y}`);
				tp.h1.y = 0;
			}
			if (!tp.h2.x && tp.h2.x !== 0) {
				// log(`VALIDATE PATH: ${calledBy} - resetting point ${pp} h2.x from ${tp.h2.x}`);
				tp.h2.x = 0;
			}
			if (!tp.h2.y && tp.h2.y !== 0) {
				// log(`VALIDATE PATH: ${calledBy} - resetting point ${pp} h2.y from ${tp.h2.y}`);
				tp.h2.y = 0;
			}
			tp.roundAll();
		}
	}

	/**
	 * Checks all the data for NaN
	 * @returns {boolean}
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

// --------------------------------------------------------------
// Boolean Combine
// --------------------------------------------------------------

/**
 * Find overlaps between two paths
 * @param {Path} p1 - first path
 * @param {Path} p2 - second path
 * @returns {array}
 */
export function findPathIntersections(p1, p2) {
	// log('findPathIntersections', 'start');
	let intersects = [];

	// Find overlaps at boundaries
	intersects = intersects.concat(findPathPointIntersections(p1, p2));

	intersects = intersects.concat(findPathPointBoundaryIntersections(p1, p2));

	intersects = intersects.filter(duplicates);
	// log('intersections after boundary detection');
	// log(intersects);

	// Maxes within boundaries
	if (!maxesOverlap(p1.maxes, p2.maxes)) {
		// log(p1.maxes);
		// log(p2.maxes);
		// log('paths don't intersect');
		// log(`findPathIntersections`, 'end');
		return intersects;
	}

	// Continue with recursive overlap detection
	let bs;
	let ts;
	const segmentOverlaps = [];

	/**
	 * Quickly find if two segments could overlap by checking
	 * their bounding boxes
	 * @param {Path} p1 - first path
	 * @param {PathPoint} p1p - first path point
	 * @param {Path} p2 - second path
	 * @param {PathPoint} p2p - second path point
	 */
	function pushSegOverlaps(p1, p1p, p2, p2p) {
		// log('pushSegOverlaps - p1p ' + p1p + ' - p2p ' + p2p);
		bs = p1.makeSegment(p1p);
		ts = p2.makeSegment(p2p);

		if (maxesOverlap(bs.getFastMaxes(), ts.getFastMaxes())) {
			// log('\t\t pushed!');
			segmentOverlaps.push({ bottom: bs, top: ts });
		}
	}

	// Find overlaps within a single segment -- don't care about this case
	// Find overlaps within a single path -- don't care about this case

	// Find overlaps between two paths
	for (let bpp = 0; bpp < p1.pathPoints.length; bpp++) {
		for (let tpp = 0; tpp < p2.pathPoints.length; tpp++) {
			pushSegOverlaps(p1, bpp, p2, tpp);
		}
	}

	// log('segmentOverlaps are now:');
	// segmentOverlaps.forEach((element) => {
	// log(`bottom:\n${element.bottom.print()}\ntop:\n${element.top.print()}`);
	// });

	// Use overlaps to find intersections
	let re = [];
	for (let v = 0; v < segmentOverlaps.length; v++) {
		re = findSegmentIntersections(segmentOverlaps[v].bottom, segmentOverlaps[v].top, 0);
		if (re.length > 0) {
			intersects = intersects.concat(re);
		}
		// log('intersects is now');
		// log(intersects);
	}

	// log('pre filter ' + intersects);
	intersects = intersects.filter(duplicates);

	// log('returning ' + intersects);
	// log('findPathIntersections', 'end');
	return intersects;
}

/**
 * Collects instances of path points being on a bounding
 * box of the other path
 * @param {Path} p1 - first path
 * @param {Path} p2 - second path
 * @returns {array}
 */
export function findPathPointBoundaryIntersections(p1, p2) {
	let re = [];

	/**
	 * Check points in a path against the bounding box of another path
	 * @param {Path} chk - first point to check
	 * @param {Path} against - check against these maxes
	 */
	function check(chk, against) {
		const m = against.maxes;
		let tpp;
		for (let pp = 0; pp < chk.pathPoints.length; pp++) {
			tpp = chk.pathPoints[pp];

			if (tpp.p.x === m.xMin || tpp.p.x === m.xMax) {
				if (tpp.p.y <= m.yMax && tpp.p.y >= m.yMin) {
					re.push('' + tpp.p.x + '/' + tpp.p.y);
				}
			}
			if (tpp.p.y === m.yMin || tpp.p.y === m.yMax) {
				if (tpp.p.x <= m.xMax && tpp.p.x >= m.xMin) {
					re.push('' + tpp.p.x + '/' + tpp.p.y);
				}
			}
		}
	}

	check(p1, p2);
	check(p2, p1);

	re = re.filter(duplicates);

	return re;
}

/**
 * Finds x/y overlaps between any points given two paths
 * @param {Path} p1 - first path
 * @param {Path} p2 - second path
 * @returns {array} - collection of IX strings, representing xy points
 */
export function findPathPointIntersections(p1, p2) {
	// log('findPathPointIntersections', 'start');
	let re = [];
	let ix;

	// log(p1.toString());
	// log(p2.toString());

	for (let pp1 = 0; pp1 < p1.pathPoints.length; pp1++) {
		for (let pp2 = 0; pp2 < p2.pathPoints.length; pp2++) {
			if (pointsAreEqual(p1.pathPoints[pp1].p, p2.pathPoints[pp2].p, 0.01)) {
				ix = '' + p1.pathPoints[pp1].p.x + '/' + p1.pathPoints[pp1].p.y;
				// log(`found ${ix}`);

				re.push(ix);
			}
		}
	}

	re = re.filter(duplicates);

	// log('returning ' + re);
	// log('findPathPointIntersections', 'end');
	return re;
}
