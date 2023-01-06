import { GlyphElement } from './glyph_element.js';
import { isAllZeros, Maxes } from './maxes.js';
import { Path } from './path.js';
import { ComponentInstance } from './component_instance.js';
import { getOverallMaxes } from './maxes.js';
import { json, clone, hasNonValues, isVal, trim } from '../common/functions.js';
import { parseUnicodeInput, getUnicodeName, hexToHTML, hexToChars } from '../common/unicode.js';
import { getCurrentProject } from '../app/main.js';
// import { combinePaths } from '../panels/REFACTOR_path.js';

/**
 * Glyph Element > Glyph
 * A single collection of outlines that could
 * either represent a character, or be used as
 * part of another character through components.
 * The following objects are stored as Glyph
 * Objects:
 *   Glyphs (Characters)
 *   Ligatures
 *   Components
 */
export class Glyph extends GlyphElement {
	/**
	 * Create a Glyph
	 * @param {string} id - unique identifier (Unicode code point)
	 * @param {number} advanceWidth - manual setting for advance width
	 * @param {boolean} ratioLock - maintain aspect ratio while resizing
	 * @param {boolean} paths - collection of Paths and Component Instances in this Glyph
	 * @param {array} usedIn - array of IDs where this Glyph is used as a component instance
	 */
	constructor({ id = false, paths = [], advanceWidth = 0, ratioLock = false, usedIn = [] } = {}) {
		// log(`Glyph.constructor`, 'start');
		super();
		this.id = id;
		this.paths = paths;
		this.advanceWidth = advanceWidth;
		this.ratioLock = ratioLock;
		this.usedIn = usedIn;

		this.objType = 'Glyph';
		// log(this.print());
		// log(`Glyph.constructor`, 'end');
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
			id: this._id,
			objType: this.objType,
		};

		if (this.advanceWidth !== 0) re.advanceWidth = this.advanceWidth;
		if (this.ratioLock !== false) re.ratioLock = this.ratioLock;
		if (this.usedIn.length) re.usedIn = this.usedIn;

		if (this.paths && this.paths.length) {
			re.paths = [];
			for (let s = 0; s < this.paths.length; s++) re.paths.push(this.paths[s].save(verbose));
		}

		if (!verbose) {
			delete re.objType;
			delete re.name;
		}
		if (this.__ID) re.__ID = this.__ID;

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

		let re = `${ind}{Glyph\n`;
		ind += '  ';

		re += `${ind}id: ${this.id}\n`;
		re += `${ind}name: ${this.name}\n`;

		if (this.advanceWidth !== 0) re += `${ind}advanceWidth: ${this.advanceWidth}\n`;
		if (this.ratioLock !== false) re += `${ind}ratioLock: ${this.ratioLock}\n`;
		if (this.usedIn.length) re += `${ind}usedIn: ${JSON.stringify(this.usedIn)}\n`;

		if (this.paths && this.paths.length) {
			re += `${ind}paths: [\n`;
			this._paths.forEach((sh) => {
				re += sh.print(level + 2);
				re += `\n`;
			});
			re += `${ind}]\n`;
		} else {
			re += `${ind}paths: []\n`;
		}

		if (this.maxes) re += `${ind}maxes: ${this.maxes.print(level + 1)}\n`;

		re += `${ind.substring(2)}}/Glyph ${this.id}`;

		return re;
	}

	// --------------------------------------------------------------
	// Getters
	// --------------------------------------------------------------

	/**
	 * get id
	 * @returns {string}
	 */
	get id() {
		return this._id;
	}

	/**
	 * get paths
	 * @returns {array}
	 */
	get paths() {
		return this._paths;
	}

	/**
	 * get advanceWidth
	 * @returns {number}
	 */
	get advanceWidth() {
		return this._advanceWidth;
	}

	/**
	 * get ratioLock
	 * @returns {boolean}
	 */
	get ratioLock() {
		return this._ratioLock;
	}

	/**
	 * get usedIn
	 * @returns {array}
	 */
	get usedIn() {
		// log(`Glyph.usedIn Getter - is array? ${Array.isArray(this._usedIn)}`);
		return this._usedIn || [];
	}

	// computed properties

	/**
	 * Get X position
	 * This is a calculated property
	 * based on all the Paths in this Glyph
	 * @returns {number}
	 */
	get x() {
		return this.maxes.xMin;
	}

	/**
	 * Get Y position
	 * This is a calculated property
	 * based on all the Paths in this Glyph
	 * @returns {number}
	 */
	get y() {
		return this.maxes.yMax;
	}

	/**
	 * Get Width
	 * This is a calculated property
	 * based on all the Paths in this Glyph
	 * @returns {number}
	 */
	get width() {
		const w = this.maxes.xMax - this.maxes.xMin;
		return Math.max(w, 0);
	}

	/**
	 * Get Height
	 * This is a calculated property
	 * based on all the Paths in this Glyph
	 * @returns {number}
	 */
	get height() {
		const h = this.maxes.yMax - this.maxes.yMin;
		return Math.max(h, 0);
	}

	/**
	 * get leftSideBearing
	 * This is a calculated-on-the-fly property
	 * @returns {number}
	 */
	get leftSideBearing() {
		return this.maxes.xMin;
	}

	/**
	 * get rightSideBearing
	 * This is a calculated-on-the-fly property
	 * @returns {number}
	 */
	get rightSideBearing() {
		let rightMax = this.maxes.xMax;
		let advance = this.advanceWidth;
		return advance - rightMax;
	}

	/**
	 * get maxes
	 * @returns {Maxes}
	 */
	get maxes() {
		// log('Glyph GET maxes', 'start');
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
		// log('Glyph GET maxes', 'end');
		return new Maxes(this.cache.maxes);
	}

	/**
	 * get name
	 * @returns {string}
	 */
	get name() {
		// log('Glyph GET name', 'start');
		let name = getUnicodeName(this.id);
		// log(`ID: ${this.id} result: ${name}`);
		// log('Glyph GET name', 'end');
		return this._name || name;
	}

	/**
	 * get char name
	 * @returns {string}
	 */
	get char() {
		return hexToChars(this.id);
	}

	/**
	 * get HTML Char Code
	 * @returns {String}
	 */
	get charCode() {
		const code = hexToHTML(this.id);
		return code || '';
	}

	/**
	 * get SVG Path Data
	 * @returns {string}
	 */
	get svgPathData() {
		if (this.cache.svgPathData) return this.cache.svgPathData;
		this.cache.svgPathData = this.makeSVGPathData();
		return this.cache.svgPathData;
	}

	// --------------------------------------------------------------
	// Setters
	// --------------------------------------------------------------

	/**
	 * set id
	 * @param {string} newID
	 */
	set id(newID) {
		// log(`Glyph SET id`, 'start');
		// log(`passed newID: ${newID}`);

		newID = parseUnicodeInput(newID);
		newID = newID.join ? newID.join('') : '0x0000';
		this._id = newID;
		// log(`this._id: ${this._id}`);

		// log(`Glyph SET id`, 'end');
	}

	/**
	 * set paths
	 * @param {array} paths
	 */
	set paths(newPaths = []) {
		// log(`Glyph.paths setter - Start`);
		// log(`passed length ${newPaths.length}`);

		this._paths = [];

		if (newPaths && newPaths.length) {
			newPaths.forEach((path) => {
				this.addOnePath(path);
			});
		}

		this.changed();
		// log(`Glyph.paths is now length = ${this.paths? this.paths.length : 'NULL'}`);
		// log(`Glyph.paths setter - End\n`);
	}

	/**
	 * Adds a new path to this glyph, making sure linking is in place
	 * @param {Path} newPath - Path to add to this glyph
	 */
	addOnePath(newPath) {
		// log(`Glyph.addOnePath`, 'start');
		// log(newPath);

		if (isVal(newPath.link)) {
			// log(`hydrating ci - name: ${newPath.name}`);
			newPath.parent = this;
			this._paths.push(new ComponentInstance(newPath));
		} else {
			// log(`hydrating path - name: ${newPath.name}`);
			newPath.parent = this;
			this._paths.push(new Path(newPath));
		}
		this.changed();
		// log(`Glyph.addOnePath`, 'end');
		return this._paths.at(-1);
	}

	/**
	 * set advanceWidth
	 * @param {number} advanceWidth
	 */
	set advanceWidth(advanceWidth) {
		// log(`Glyph SET advanceWidth`, 'start');
		// log(`advanceWidth: ${advanceWidth}`);

		this._advanceWidth = parseFloat(advanceWidth);
		// log(`parseFloat(advanceWidth): ${parseFloat(advanceWidth)}`);

		if (isNaN(this._advanceWidth)) this._advanceWidth = 0;
		// log(`this._advanceWidth: ${this._advanceWidth}`);

		// log(`Glyph SET advanceWidth`, 'end');
	}

	/**
	 * set ratioLock
	 * @param {boolean} ratioLock
	 */
	set ratioLock(ratioLock) {
		this._ratioLock = !!ratioLock;
	}

	/**
	 * set usedIn
	 * @param {array} usedIn
	 */
	set usedIn(usedIn) {
		this._usedIn = usedIn || [];
	}

	// computed properties

	/**
	 * Set name
	 * This usually is not necessary, Glyph.name (getter)
	 * does a lookup of unicode names.
	 * @param {string} newName
	 */
	set name(newName) {
		this._name = newName;
	}

	/**
	 * Set X position
	 * @param {number} x
	 */
	set x(x) {
		// log(`Glyph SET x`);
		// log(x);
		this.setGlyphPosition(x, false);
	}

	/**
	 * Set Y position
	 * @param {number} y
	 */
	set y(y) {
		this.setGlyphPosition(false, y);
	}

	/**
	 * Set Width
	 * @param {number} w
	 */
	set width(w) {
		this.setGlyphSize(w, false);
	}

	/**
	 * Set Height
	 * @param {number} h
	 */
	set height(h) {
		this.setGlyphSize(false, h);
	}

	/**
	 * set leftSideBearing
	 * This is a convenience method, not a glyph property
	 * @param {number} newLSB - what to set LSB to
	 */
	set leftSideBearing(newLSB) {
		let delta = newLSB - this.leftSideBearing;
		this.setGlyphPosition(newLSB);
		this.advanceWidth += delta;
	}

	/**
	 * set rightSideBearing
	 * This is a convenience method, not a glyph property
	 * @param {number} newRSB - what to set RSB to
	 */
	set rightSideBearing(newRSB) {
		let delta = newRSB - this.rightSideBearing;
		this.advanceWidth += delta;
	}

	/**
	 * Set Maxes
	 * @param {Maxes} maxes
	 */
	set maxes(maxes) {
		this.cache.maxes = {};
		this.cache.maxes = new Maxes(maxes);
	}

	// --------------------------------------------------------------
	// Transform & move
	// --------------------------------------------------------------

	/**
	 * Move all the paths in this glyph as one group
	 * @param {number} nx - new x
	 * @param {number} ny - new y
	 */
	setGlyphPosition(nx, ny) {
		// log('Glyph.setGlyphPosition', 'start');
		// log(`nx/ny: ${nx} ${ny}`);
		const m = this.maxes;
		// log(this.maxes.print());

		if (nx !== false) nx = parseFloat(nx);
		if (ny !== false) ny = parseFloat(ny);
		// log(`nx/ny: ${nx} ${ny}`);
		const dx = nx !== false ? nx - m.xMin : 0;
		const dy = ny !== false ? ny - m.yMax : 0;
		// log(`dx/dy: ${dx} ${dy}`);
		this.updateGlyphPosition(dx, dy);
		// log('Glyph.setGlyphPosition', 'end');
	}

	/**
	 * Update all the paths' positions in this glyph as one group
	 * @param {number} dx - delta x
	 * @param {number} dy - delta y
	 */
	updateGlyphPosition(dx, dy) {
		// log('Glyph.updateGlyphPosition', 'start');
		// log('dx/dy: ' + dx + ' ' + dy);
		// log('number of paths: ' + this.paths.length);

		dx = parseFloat(dx) || 0;
		dy = parseFloat(dy) || 0;
		for (let i = 0; i < this.paths.length; i++) {
			const path = this.paths[i];
			// log(`moving path #${i} - ${path.name}`);
			path.updatePathPosition(dx, dy);
		}
		// log(this.name);
		// log('Glyph.updateGlyphPosition', 'end');
	}

	/**
	 * Set all the sizes of the paths in this glyph as one group
	 * @param {number} nw - new width
	 * @param {number} nh - new height
	 * @param {boolean} ratioLock - true to scale width and height 1:1
	 */
	setGlyphSize(nw, nh, ratioLock) {
		const m = this.maxes;
		if (nw !== false) nw = parseFloat(nw);
		if (nh !== false) nh = parseFloat(nh);
		const ch = m.yMax - m.yMin;
		const cw = m.xMax - m.xMin;
		let dw = nw !== false ? nw - cw : 0;
		let dh = nh !== false ? nh - ch : 0;
		if (ratioLock) {
			if (Math.abs(nh) > Math.abs(nw)) dw = cw * (nh / ch) - cw;
			else dh = ch * (nw / cw) - ch;
		}
		this.updateGlyphSize(dw, dh, false);
	}

	/**
	 * Update all the sizes of the paths in this glyph as one group
	 * @param {number} dw - delta width
	 * @param {number} dh - delta height
	 * @param {boolean} ratioLock - true to scale width and height 1:1
	 */
	updateGlyphSize(dw, dh, ratioLock) {
		// log('Glyph.updateGlyphSize', 'start');
		// log('number of paths: ' + this.paths.length);
		// log('dw dh rl:\t' + dw + '/' + dh + '/' + ratioLock);
		const m = this.maxes;
		if (dw !== false) dw = parseFloat(dw) || 0;
		if (dh !== false) dh = parseFloat(dh) || 0;
		// log('adjust dw/dh:\t' + dw + '/' + dh);
		const oldW = m.xMax - m.xMin;
		const oldH = m.yMax - m.yMin;
		let newW = oldW + dw;
		let newH = oldH + dh;
		if (Math.abs(newW) < 1) newW = 1;
		if (Math.abs(newH) < 1) newH = 1;
		// log('new w/h:\t' + newW + '/' + newH);
		let ratioHeight = newH / oldH;
		let ratioWidth = newW / oldW;
		// log('ratio dw/dh:\t' + ratioWidth + '/' + ratioHeight);
		if (ratioLock) {
			// Assuming only one will be nonzero
			// if(Math.abs(ratioHeight) > Math.abs(ratioWidth)) ratioWidth = ratioHeight;
			// else ratioHeight = ratioWidth;
			if (dw !== 0 && dh === 0) ratioHeight = ratioWidth;
			else ratioWidth = ratioHeight;
		}
		// log('ratio dw/dh:\t' + ratioWidth + '/' + ratioHeight);

		let path;
		let pathMaxes;
		let oldPathWidth;
		let oldPathHeight;
		let oldPathX;
		let oldPathY;
		let newPathWidth;
		let newPathHeight;
		let newPathX;
		let newPathY;
		let deltaWidth;
		let deltaHeight;
		let deltaX;
		let deltaY;

		// log('Before Maxes ' + json(m, true));
		for (let i = 0; i < this.paths.length; i++) {
			path = this.paths[i];
			// log('>>> Updating ' + path.objType + ' ' + i + '/' + this.paths.length + ' : ' + path.name);
			pathMaxes = path.maxes;

			// scale
			oldPathWidth = pathMaxes.xMax - pathMaxes.xMin;
			newPathWidth = oldPathWidth * ratioWidth;

			if (ratioWidth === 0) deltaWidth = false;
			else deltaWidth = newPathWidth - oldPathWidth;

			oldPathHeight = pathMaxes.yMax - pathMaxes.yMin;
			newPathHeight = oldPathHeight * ratioHeight;

			if (ratioHeight === 0) deltaHeight = false;
			else deltaHeight = newPathHeight - oldPathHeight;

			// log('Path ' + i + ' dw dh ' + deltaWidth + ' ' + deltaHeight);
			path.updatePathSize(deltaWidth, deltaHeight, false);

			// move
			oldPathX = pathMaxes.xMin - m.xMin;
			newPathX = oldPathX * ratioWidth;

			if (ratioWidth === 0) deltaX = false;
			else deltaX = newPathX - oldPathX;

			oldPathY = pathMaxes.yMin - m.yMin;
			newPathY = oldPathY * ratioHeight;

			if (ratioHeight === 0) deltaY = false;
			else deltaY = newPathY - oldPathY;

			// log('Path Pos ' + i + ' dx dy ' + deltaX + ' ' + deltaY);
			path.updatePathPosition(deltaX, deltaY, true);
		}

		// log('Afters Maxes ' + json(this.maxes, true));
		// log(this.name);
		// log('Glyph.updateGlyphSize', 'end');
	}

	/**
	 * Flips this glyph about a horizontal line
	 * @param {number} mid - y value about which to flip
	 * @returns {Glyph} - reference to this glyph
	 */
	flipNS(mid = this.maxes.center.y) {
		// log(`Glyph.flipNS`, 'start');

		// const m = this.maxes;
		// mid = isVal(mid) ? mid : (m.yMax - m.yMin) / 2 + m.yMin;
		// log(`mid: ${mid}`);

		for (let s = 0; s < this.paths.length; s++) {
			this.paths[s].flipNS(mid);
		}

		// log(`Glyph.flipNS`, 'end');
		return this;
	}

	/**
	 * Flips this glyph about a vertical line
	 * @param {number} mid - y value about which to flip
	 * @returns {Glyph} - reference to this glyph
	 */
	flipEW(mid = this.maxes.center.x) {
		// log('Glyph.flipEW', 'start');
		// log('' + this.name);
		// log('passed mid = ' + mid);
		for (let s = 0; s < this.paths.length; s++) {
			this.paths[s].flipEW(mid);
		}

		// log('maxes = ' + json(this.maxes, true));
		return this;
	}

	/**
	 * Round all point x/y values to a certain precision
	 * @param {number} precision - how many decimal places to round to
	 * @returns {Glyph} - reference to this glyph
	 */
	roundAll(precision = 0) {
		for (let p = 0; p < this.paths.length; p++) {
			this.paths[p].roundAll(precision);
		}
		return this;
	}

	/**
	 * Rotate about a point
	 * @param {number} angle - how much to rotate (radians)
	 * @param {XYPoint} about - x/y center of rotation
	 * @returns {Glyph} - reference to this glyph
	 */
	rotate(angle, about) {
		about = about || this.maxes.center;
		for (let s = 0; s < this.paths.length; s++) {
			this.paths[s].rotate(angle, about);
		}

		return this;
	}

	/**
	 * Reverses the order of the path points in all the paths,
	 * thus reversing the winding
	 * @returns {Glyph} - reference to this glyph
	 */
	reverseWinding() {
		for (let s = 0; s < this.paths.length; s++) {
			this.paths[s].reverseWinding();
		}

		return this;
	}

	// --------------------------------------------------------------
	// Alignment
	// --------------------------------------------------------------

	/**
	 * Move all the paths to align with an edge
	 * @param {string} edge - which edge to align all the paths to
	 */
	alignPaths(edge) {
		// log('Glyph.alignPaths', 'start');
		// log('edge: ' + edge);
		const glyphMaxes = this.maxes;

		if (edge === 'top') {
			this.paths.forEach((path) => {
				// log(`just setting to glyph.yMax: ${glyphMaxes.yMax}`);
				path.setPathPosition(false, glyphMaxes.yMax);
			});
		}

		if (edge === 'middle') {
			this.paths.forEach((path) => {
				let delta = glyphMaxes.center.y - path.maxes.center.y;
				// log(`delta: ${delta}`);
				path.updatePathPosition(0, delta);
			});
		}

		if (edge === 'bottom') {
			this.paths.forEach((path) => {
				let delta = glyphMaxes.yMin - path.maxes.yMin;
				// log(`delta: ${delta}`);
				path.updatePathPosition(0, delta);
			});
		}

		if (edge === 'left') {
			this.paths.forEach((path) => {
				// log(`just setting to glyph.xMin: ${glyphMaxes.xMin}`);
				path.setPathPosition(glyphMaxes.xMin, false);
			});
		}

		if (edge === 'center') {
			this.paths.forEach((path) => {
				let delta = glyphMaxes.center.x - path.maxes.center.x;
				// log(`delta: ${delta}`);
				path.updatePathPosition(delta, 0);
			});
		}

		if (edge === 'right') {
			this.paths.forEach((path) => {
				let delta = glyphMaxes.xMax - path.maxes.xMax;
				// log(`delta: ${delta}`);
				path.updatePathPosition(delta, 0);
			});
		}

		// log('Glyph.alignPaths', 'end');
	}

	// --------------------------------------------------------------
	// Calculating dimensions
	// --------------------------------------------------------------

	/**
	 * Calculate the overall maxes for this Glyph
	 * @returns {Maxes}
	 */
	recalculateMaxes() {
		// log(`Glyph.recalculateMaxes - START `);

		let temp = { xMax: 0, xMin: 0, yMax: 0, yMin: 0 };
		// log(this.paths);
		if (this.paths && this.paths.length > 0) {
			// log('... has paths, calling getOverallMaxes');
			temp = getOverallMaxes(this.paths.map((path) => path.maxes));
		}

		this.cache.maxes = new Maxes(temp);
		// log(`result`);
		// log(this.cache);
		// log(`Glyph.recalculateMaxes`, 'end');
		return this.cache.maxes;
	}

	// --------------------------------------------------------------
	// Export to different languages
	// --------------------------------------------------------------

	/**
	 * Make SVG from this Path
	 * @param {number} size - how big the resulting SVG should be
	 * @param {number} padding - interior space around the glyph
	 * @returns {string} - svg
	 */
	makeSVG(size = 500, padding = 10) {
		// log('Glyph.makeSVG', 'start');
		// log(this);
		const fmd = getCurrentProject().metadata.font;
		const scale = (size - padding * 2) / fmd.upm;
		const scaledUPM = size / fmd.upm;
		const translateY = fmd.ascent * scale + padding * 2;

		let re = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" `;
		re += `width="${size}" height="${size}" viewBox="0,0,${size},${size}">\n`;
		re += `\t<g transform="translate(${padding},${translateY}) scale(${scaledUPM}, -${scaledUPM})">\n`;
		re += `\t\t<path d="${this.svgPathData}"/>\n`;
		re += `\t</g>\n</svg>`;

		// log('Glyph.makeSVG', 'end');
		return re;
	}

	/**
	 * Make the data (attribute d="") for an SVG path tag
	 * @returns {string}
	 */
	makeSVGPathData() {
		if (this.cache.svg) return this.cache.svg;

		let pathData = '';
		let item;

		// Make Path Data
		this.paths.forEach((path) => {
			item = path.clone();
			// log(`item ${j} of ${this.paths.length}`);
			// log(item);
			if (item.objType === 'ComponentInstance') {
				const workingItem = item.transformedGlyph;
				if (workingItem) pathData += workingItem.svgPathData;
			} else {
				pathData += item.svgPathData;
				pathData += ' ';
			}
		});

		if (trim(pathData) === '') pathData = 'M0,0Z';
		this.cache.svg = pathData;
		return pathData;
	}

	makeOpenTypeJSpath(openTypePath) {
		this.paths.forEach((path) => {
			openTypePath = path.makeOpenTypeJSpath(openTypePath);
		});
		return openTypePath;
	}

	// --------------------------------------------------------------
	// Boolean Combine
	// --------------------------------------------------------------

	/**
	 * Converts all the Component Instances in this Glyph to stand-alone paths
	 * @returns {Glyph}
	 */
	flattenGlyph() {
		// log(`Glyph.flattenGlyph`, 'start');

		const result = [];
		let ts;
		let tg;
		for (let s = 0; s < this.paths.length; s++) {
			ts = this.paths[s];
			// log(`path ${s} is ${ts.objType}`);

			if (ts.objType === 'Path') {
				result.push(ts.save());
			} else if (ts.objType === 'ComponentInstance') {
				tg = ts.transformedGlyph;
				tg = tg.flattenGlyph();
				for (let c = 0; c < tg.paths.length; c++) {
					result.push(tg.paths[c].save());
				}
			} else {
				// log('Glyph.flattenGlyph', - ERROR - none path or ci in paths array');
			}
		}
		this.paths = result;

		// log(`Glyph.flattenGlyph`, 'end');
		return this;
	}

	/**
	 * Boolean combine all paths in this Glyph to as few paths as possible
	 * @param {boolean} doNotToast - don't show progress messages
	 * @returns {Glyph} - reference to this Glyph
	 */
	combineAllPaths() {
		// log('Glyph.combineAllPaths', 'start');

		this.flattenGlyph();
		/*

			TODO Boolean Combine get functionality from V1

		const paths = combinePaths(this.paths, doNotToast);
		if (paths) {
			// log('new paths');
			this.paths = paths;
			// log(this.paths);
		}

		// log(`this glyph AFTER`);
		// log(this.print());

		// log(this.name);
		// log('Glyph.combineAllPaths', 'end');
		*/
		return this;
	}

	// --------------------------------------------------------------
	// Methods
	// --------------------------------------------------------------

	/**
	 * Return true if there is anything to draw for this Glyph
	 * @returns {boolean}
	 */
	hasPaths() {
		let tg;
		for (let s = 0; s < this.paths.length; s++) {
			if (this.paths[s].objType !== 'ComponentInstance') return true;
			else {
				tg = this.paths[s].transformedGlyph;
				if (tg.hasPaths()) return true;
			}
		}
		return false;
	}

	// --------------------------------------------------------------
	// Used-In array
	// --------------------------------------------------------------

	/**
	 * When this Glyph is linked-to from another ComponentInstance, track
	 * where it's being used by adding it to this.usedIn
	 * @param {string} linkID - GlyphID where this Glyph is being used as a Component Instance
	 * @returns {Glyph} - reference to this Glyph
	 */
	addToUsedIn(linkID) {
		this.usedIn.push('' + linkID);
		// sort numerically as opposed to alpha
		this.usedIn.sort(function (a, b) {
			return a - b;
		});

		return this;
	}

	/**
	 * Removes a link from this usedIn array
	 * @param {string} linkID - GlyphID where this Glyph is being used as a Component Instance
	 * @returns {Glyph} - reference to this Glyph
	 */
	removeFromUsedIn(linkID) {
		const id = this.usedIn.indexOf('' + linkID);
		if (id !== -1) {
			this.usedIn.splice(id, 1);
		}

		return this;
	}
}
