import { GlyphElement } from './glyph_element.js';
import { getOverallMaxes, isAllZeros, Maxes } from './maxes.js';
import { Path } from './path.js';
import { ComponentInstance } from './component_instance.js';
import { hasNonValues, isVal, json, remove, trim } from '../common/functions.js';
import { hexesToChars } from '../common/character_ids.js';
import { getUnicodeName } from '../lib/unicode_names.js';
import { log } from '../app/main.js';
// import { log } from '../app/main.js';

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
	 * @param {object} parent - link to the Glyphr Studio Project
	 * @param {number} advanceWidth - manual setting for advance width
	 * @param {boolean} ratioLock - maintain aspect ratio while resizing
	 * @param {boolean} paths - collection of Paths and Component Instances in this Glyph
	 * @param {array} usedIn - array of IDs where this Glyph is used as a component instance
	 */
	constructor({
		id = false,
		parent = false,
		objType = 'Glyph',
		name = false,
		paths = [],
		advanceWidth = 0,
		ratioLock = false,
		usedIn = [],
		gsub = [],
		contextGlyphs = '',
	} = {}) {
		// log(`Glyph.constructor`, 'start');
		super();
		this.id = id;
		this.parent = parent;
		this.name = name;
		this.paths = paths;
		this.advanceWidth = advanceWidth;
		this.ratioLock = ratioLock;
		this.usedIn = usedIn;
		this.gsub = gsub;
		this.contextGlyphs = contextGlyphs;

		this.objType = objType;
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
		if (this.gsub.length) re.gsub = this.gsub;

		if (this.paths && this.paths.length) {
			re.paths = [];
			for (let s = 0; s < this.paths.length; s++) re.paths.push(this.paths[s].save(verbose));
		}

		if (!verbose) {
			if (this.objType === 'Glyph') delete re.name;
			delete re.objType;
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
		if (this.gsub.length) re += `${ind}gsub: ${JSON.stringify(this.gsub)}\n`;

		if (this.paths && this.paths.length) {
			re += `${ind}paths: [\n`;
			this._paths.forEach((shape) => {
				re += shape.print(level + 2);
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

	/**
	 * get gsub
	 * @returns {array}
	 */
	get gsub() {
		// log(`Glyph.gsub Getter - is array? ${Array.isArray(this._gsub)}`);
		return this._gsub || [];
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
	 * get name
	 * @returns {string}
	 */
	get name() {
		// log('Glyph GET name', 'start');
		// log(this);

		let name = this._name;
		if (!name && !this.id) return '[no id]';
		// log(`this.id: ${this.id}`);
		// log(`name: ${name}`);

		if (!name) {
			if (this.id.startsWith('liga-')) {
				let suffix = remove(this.id, 'liga-');
				suffix = suffix.split('-');
				name = 'Ligature ';
				suffix.forEach((char) => {
					if (char.length === 1) name += char;
					else name += hexesToChars(char);
				});
			} else if (this.id.startsWith('comp-')) {
				let suffix = remove(this.id, 'comp-');
				name = `Component ${suffix}`;
			} else if (this.id.startsWith('glyph-')) {
				let suffix = remove(this.id, 'glyph-');
				name = getUnicodeName(suffix);
			}

			this._name = name;
		}
		// log(`ID: ${this.id} result: ${name}`);
		// log('Glyph GET name', 'end');
		return name;
	}

	/**
	 * Get character associated with this Glyph.
	 * If this is a Ligature, returns a string of
	 * characters.
	 * @returns {string}
	 */
	get char() {
		// log(`Glyph GET char`, 'start');
		// log(this);
		let result;
		if (this.gsub.length) {
			// log(`this.gsub.length: ${this.gsub.length}`);
			// log(this.gsub);
			result = this.gsub.reduce((acc, value) => `${acc}${String.fromCharCode(value)}`, '');
		} else {
			result = hexesToChars(remove(this.id, 'glyph-'));
		}
		// log(`result: ${result}`);
		// log(`Glyph GET char`, 'end');
		return result;
	}

	get chars() {
		return this.char;
	}

	/**
	 * Used by the UI to describe what this glyph contains
	 */
	get contentType() {
		if (this.cache.contentType) return this.cache.contentType;
		let result = 'unknown';
		let paths = 0;
		let componentInstances = 0;
		this.paths.forEach((shape) => {
			if (shape.objType === 'ComponentInstance') componentInstances++;
			if (shape.objType === 'Path') paths++;
		});
		if (paths > 0 && componentInstances === 0) result = 'paths';
		if (componentInstances > 0 && paths === 0) result = 'component instances';
		if (paths > 0 && componentInstances > 0) result = 'items';

		this.cache.contentType = result;
		return result;
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
		this._id = newID;
		// log(`this._id: ${this._id}`);
		// log(`Glyph SET id`, 'end');
	}

	/**
	 * set paths
	 * @param {array} newShapes - collection of Path or Component Instance
	 */
	set paths(newShapes = []) {
		// log(`Glyph.paths setter - Start`);
		// log(`passed length ${newShapes.length}`);

		this._paths = [];

		if (newShapes && newShapes.length) {
			newShapes.forEach((shape) => {
				this.addOneShape(shape);
			});
		}

		this.changed();
		// log(`Glyph.paths is now length = ${this.paths? this.paths.length : 'NULL'}`);
		// log(`Glyph.paths setter - End\n`);
	}

	/**
	 * Adds a new path to this glyph, making sure linking is in place
	 * @param {Path or ComponentInstance} newShape - Path to add to this glyph
	 */
	addOneShape(newShape) {
		// log(`Glyph.addOneShape`, 'start');
		// log(newShape);

		if (isVal(newShape.link)) {
			// log(`hydrating ci - name: ${newShape.name}`);
			newShape.parent = this;
			this._paths.push(new ComponentInstance(newShape));
		} else {
			// log(`hydrating path - name: ${newShape.name}`);
			newShape.parent = this;
			this._paths.push(new Path(newShape));
		}
		this.changed();
		// log(`Glyph.addOneShape`, 'end');
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

	/**
	 * set gsub
	 * @param {array} gsub
	 */
	set gsub(gsub) {
		// log(`Glyph SET gsub`, 'start');
		// log(`gsub: ${gsub}`);

		this._gsub = gsub || [];
		// log(`Glyph SET gsub`, 'end');
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
			// log(`BEFORE path.maxes.xMin: ${path.maxes.xMin}`);
			path.updatePathPosition(dx, dy);
			// log(`AFTERS path.maxes.xMin: ${path.maxes.xMin}`);
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
	// SVG
	// --------------------------------------------------------------

	/**
	 * Get / Make the data (attribute d="") for an SVG path tag
	 * @param {Glyph} - glyph object to get/make the path data for
	 * @returns {string} - SVG definition for the path d="" attribute
	 */
	get svgPathData() {
		// log(`Glyph GET svgPathData`, 'start');
		// log(this);
		if (!this?.cache?.svgPathData) {
			this.cache.svgPathData = this.makeSVGPathData(this);
		}
		// log(`Glyph GET svgPathData`, 'end');
		return this.cache.svgPathData;
	}

	makeSVGPathData() {
		// log(`makeSVGPathData()`, 'start');

		let pathData = '';

		// Make Path Data
		this.paths.forEach((shape) => {
			// log(`shape ${j} of ${this.paths.length}`);
			// log(shape);
			// log(`PATH DATA START`);
			// log(pathData);
			if (shape.objType === 'ComponentInstance') {
				const workingItem = shape.transformedGlyph;
				if (workingItem) pathData += workingItem.svgPathData;
			} else {
				pathData += shape.svgPathData;
				pathData += ' ';
			}
			// log(`PATH DATA END`);
			// log(pathData);
		});

		if (trim(pathData) === '') pathData = 'M0,0Z';
		// log(`RETURNING`);
		// log(pathData);
		// log(`makeSVGPathData()`, 'end');
		return pathData;
	}

	// --------------------------------------------------------------
	// Get / Make Glyph Maxes
	// --------------------------------------------------------------

	get maxes() {
		// log('Glyph GET maxes', 'start');
		// log('cache before');
		if (!this.cache.maxes) {
			// log('detected no maxes cache');
			this.recalculateGlyphMaxes();
		} else if (hasNonValues(this.cache.maxes)) {
			// log('detected hasNonValues');
			this.recalculateGlyphMaxes();
		} else if (isAllZeros(this.cache.maxes)) {
			// log('detected all values zero');
			this.recalculateGlyphMaxes();
		} else {
			// log('NO DETECTION to recalculate');
		}

		// log('cache after');
		// log(json(this.cache, true));
		// log('Glyph GET maxes', 'end');
		return this.cache.maxes;
	}

	/**
	 * Calculate the overall maxes for this Glyph
	 * @returns {Maxes}
	 */
	recalculateGlyphMaxes() {
		// log(`recalculateGlyphMaxes - START `);

		let overallMaxes = { xMax: 0, xMin: 0, yMax: 0, yMin: 0 };
		// log(this.paths);
		if (this.paths && this.paths.length > 0) {
			// log('... has paths, calling getOverallMaxes');
			overallMaxes = getOverallMaxes(this.paths.map((item) => item.maxes));
		}

		this.cache.maxes = new Maxes(overallMaxes);
		// log(`result`);
		// log(this.cache);
		// log(`recalculateGlyphMaxes`, 'end');
		return this.cache.maxes;
	}

	// --------------------------------------------------------------
	// Alignment
	// --------------------------------------------------------------

	/**
	 * Move all the paths to align with an edge
	 * @param {string} edge - which edge to align all the paths to
	 */
	alignShapes(edge) {
		// log('Glyph.alignShapes', 'start');
		// log('edge: ' + edge);
		const glyphMaxes = this.maxes;

		if (edge === 'top') {
			this.paths.forEach((shape) => {
				// log(`just setting to glyph.yMax: ${glyphMaxes.yMax}`);
				shape.setPathPosition(false, glyphMaxes.yMax);
			});
		}

		if (edge === 'middle') {
			this.paths.forEach((shape) => {
				let delta = glyphMaxes.center.y - shape.maxes.center.y;
				// log(`delta: ${delta}`);
				shape.updatePathPosition(0, delta);
			});
		}

		if (edge === 'bottom') {
			this.paths.forEach((shape) => {
				let delta = glyphMaxes.yMin - shape.maxes.yMin;
				// log(`delta: ${delta}`);
				shape.updatePathPosition(0, delta);
			});
		}

		if (edge === 'left') {
			this.paths.forEach((shape) => {
				// log(`just setting to glyph.xMin: ${glyphMaxes.xMin}`);
				shape.setPathPosition(glyphMaxes.xMin, false);
			});
		}

		if (edge === 'center') {
			this.paths.forEach((shape) => {
				let delta = glyphMaxes.center.x - shape.maxes.center.x;
				// log(`delta: ${delta}`);
				shape.updatePathPosition(delta, 0);
			});
		}

		if (edge === 'right') {
			this.paths.forEach((shape) => {
				let delta = glyphMaxes.xMax - shape.maxes.xMax;
				// log(`delta: ${delta}`);
				shape.updatePathPosition(delta, 0);
			});
		}

		// log('Glyph.alignShapes', 'end');
	}

	// --------------------------------------------------------------
	// Export to different languages
	// --------------------------------------------------------------

	makeOpenTypeJSpath(openTypePath) {
		this.paths.forEach((shape) => {
			openTypePath = shape.makeOpenTypeJSpath(openTypePath);
		});
		return openTypePath;
	}

	// --------------------------------------------------------------
	// Boolean Combine
	// --------------------------------------------------------------

	/**
	 * Boolean combine all paths in this Glyph to as few paths as possible
	 * @param {boolean} doNotToast - don't show progress messages
	 * @returns {Glyph} - reference to this Glyph
	 */
	combineAllPaths() {
		// log('Glyph.combineAllPaths', 'start');

		// this.makeGlyphWithResolvedLinks();
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
}
