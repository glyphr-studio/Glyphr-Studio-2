import { hexesToChars } from '../common/character_ids.js';
import { hasNonValues, isVal, remove, trim } from '../common/functions.js';
import { getUnicodeName } from '../lib/unicode_names.js';
import { ComponentInstance } from './component_instance.js';
import { GlyphElement } from './glyph_element.js';
import { Maxes, getOverallMaxes, isAllZeros } from './maxes.js';
import { Path } from './path.js';

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
	 * @param {String} id - unique identifier (Unicode code point)
	 * @param {Object} parent - link to the Glyphr Studio Project
	 * @param {Number} advanceWidth - manual setting for advance width
	 * @param {Boolean} ratioLock - maintain aspect ratio while resizing
	 * @param {Boolean} shapes - collection of Paths and Component Instances in this Glyph
	 * @param {Array} usedIn - array of IDs where this Glyph is used as a component instance
	 */
	constructor({
		id = false,
		parent = false,
		objType = 'Glyph',
		name = false,
		shapes = [],
		advanceWidth = 0,
		ratioLock = false,
		usedIn = [],
		gsub = [],
		contextCharacters = '',
	} = {}) {
		// log(`Glyph.constructor`, 'start');
		super();
		this.id = id;
		this.parent = parent;
		this.name = name;
		this.shapes = shapes;
		this.advanceWidth = advanceWidth;
		this.ratioLock = ratioLock;
		this.usedIn = usedIn;
		this.gsub = gsub;
		this.contextCharacters = contextCharacters;

		this.objType = objType;
		// log(`this.id: ${this.id}`);
		// log(`this.ident: ${this.ident}`);
		// log(this.print());
		// log(`Glyph.constructor`, 'end');
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
			id: this._id,
			objType: this.objType,
		};

		if (this.advanceWidth !== 0) re.advanceWidth = this.advanceWidth;
		if (this.ratioLock !== false) re.ratioLock = this.ratioLock;
		if (this.usedIn.length) re.usedIn = this.usedIn;
		if (this.gsub.length) re.gsub = this.gsub;
		let cc = this.contextCharacters;
		if (cc.length && cc !== this.char) re.contextCharacters = cc;

		if (this.shapes && this.shapes.length) {
			re.shapes = [];
			for (let s = 0; s < this.shapes.length; s++) re.shapes.push(this.shapes[s].save(verbose));
		}

		if (!verbose) {
			if (this.objType === 'Glyph') delete re.name;
			delete re.objType;
		}
		if (!verbose && this.__ID) delete this.__ID;

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

		let re = `${ind}{Glyph\n`;
		ind += '  ';

		re += `${ind}id: ${this.id}\n`;
		re += `${ind}name: ${this.name}\n`;

		if (this.advanceWidth !== 0) re += `${ind}advanceWidth: ${this.advanceWidth}\n`;
		if (this.ratioLock !== false) re += `${ind}ratioLock: ${this.ratioLock}\n`;
		if (this.usedIn.length) re += `${ind}usedIn: ${JSON.stringify(this.usedIn)}\n`;
		if (this.gsub.length) re += `${ind}gsub: ${JSON.stringify(this.gsub)}\n`;

		if (this.shapes && this.shapes.length) {
			re += `${ind}shapes: [\n`;
			this._shapes.forEach((shape) => {
				re += shape.print(level + 2);
				re += `\n`;
			});
			re += `${ind}]\n`;
		} else {
			re += `${ind}shapes: []\n`;
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
	 * @returns {String}
	 */
	get id() {
		return this._id;
	}

	/**
	 * get shapes
	 * @returns {Array}
	 */
	get shapes() {
		return this._shapes;
	}

	/**
	 * get advanceWidth
	 * @returns {Number}
	 */
	get advanceWidth() {
		return this._advanceWidth;
	}

	/**
	 * get ratioLock
	 * @returns {Boolean}
	 */
	get ratioLock() {
		return this._ratioLock;
	}

	/**
	 * get usedIn
	 * @returns {Array}
	 */
	get usedIn() {
		// log(`Glyph.usedIn Getter - is array? ${Array.isArray(this._usedIn)}`);
		return this._usedIn || [];
	}

	/**
	 * get gsub
	 * @returns {Array}
	 */
	get gsub() {
		// log(`Glyph.gsub Getter - is array? ${Array.isArray(this._gsub)}`);
		return this._gsub || [];
	}

	/**
	 * get contextCharacters
	 * @returns {String}
	 */
	get contextCharacters() {
		if (!this._contextCharacters || this._contextCharacters === this.char) return this.char;
		else return this._contextCharacters;
	}

	// computed properties

	/**
	 * Get X position
	 * This is a calculated property
	 * based on all the Shapes in this Glyph
	 * @returns {Number}
	 */
	get x() {
		return this.maxes.xMin;
	}

	/**
	 * Get Y position
	 * This is a calculated property
	 * based on all the Shapes in this Glyph
	 * @returns {Number}
	 */
	get y() {
		return this.maxes.yMax;
	}

	/**
	 * Get Width
	 * This is a calculated property
	 * based on all the Shapes in this Glyph
	 * @returns {Number}
	 */
	get width() {
		const w = this.maxes.xMax - this.maxes.xMin;
		return Math.max(w, 0);
	}

	/**
	 * Get Height
	 * This is a calculated property
	 * based on all the Shapes in this Glyph
	 * @returns {Number}
	 */
	get height() {
		const h = this.maxes.yMax - this.maxes.yMin;
		return Math.max(h, 0);
	}

	/**
	 * get leftSideBearing
	 * This is a calculated-on-the-fly property
	 * @returns {Number}
	 */
	get leftSideBearing() {
		return this.maxes.xMin;
	}

	/**
	 * get rightSideBearing
	 * This is a calculated-on-the-fly property
	 * @returns {Number}
	 */
	get rightSideBearing() {
		let rightMax = this.maxes.xMax;
		let advance = this.advanceWidth;
		return advance - rightMax;
	}

	/**
	 * get name
	 * @returns {String}
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
	 * @returns {String}
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
		this.shapes.forEach((shape) => {
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
	 * @param {String} newID
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
	 * @param {Array} newShapes - collection of Path or Component Instance
	 */
	set shapes(newShapes = []) {
		// log(`Glyph.shapes setter - Start`);
		// log(`passed length ${newShapes.length}`);

		this._shapes = [];

		if (newShapes && newShapes.length) {
			newShapes.forEach((shape) => {
				this.addOneShape(shape);
			});
		}

		this.changed();
		// log(`Glyph.shapes is now length = ${this.shapes? this.shapes.length : 'NULL'}`);
		// log(`Glyph.shapes setter - End\n`);
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
			this._shapes.push(new ComponentInstance(newShape));
		} else {
			// log(`hydrating path - name: ${newShape.name}`);
			newShape.parent = this;
			this._shapes.push(new Path(newShape));
		}
		this.changed();
		// log(`Glyph.addOneShape`, 'end');
		return this._shapes.at(-1);
	}

	/**
	 * set advanceWidth
	 * @param {Number} advanceWidth
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
	 * @param {Boolean} ratioLock
	 */
	set ratioLock(ratioLock) {
		this._ratioLock = !!ratioLock;
	}

	/**
	 * set usedIn
	 * @param {Array} usedIn
	 */
	set usedIn(usedIn) {
		this._usedIn = usedIn || [];
	}

	/**
	 * set gsub
	 * @param {Array} gsub
	 */
	set gsub(gsub) {
		// log(`Glyph SET gsub`, 'start');
		// log(`gsub: ${gsub}`);

		this._gsub = gsub || [];
		// log(`Glyph SET gsub`, 'end');
	}

	/**
	 * set contextCharacters
	 * @returns {String}
	 */
	set contextCharacters(chars = false) {
		if (!chars || chars === this.char || typeof chars !== 'string') delete this._contextCharacters;
		else this._contextCharacters = chars;
	}

	// computed properties

	/**
	 * Set name
	 * This usually is not necessary, Glyph.name (getter)
	 * does a lookup of unicode names.
	 * @param {String} newName
	 */
	set name(newName) {
		this._name = newName;
	}

	/**
	 * Set X position
	 * @param {Number} x
	 */
	set x(x) {
		// log(`Glyph SET x`);
		// log(x);
		this.setGlyphPosition(x, false);
	}

	/**
	 * Set Y position
	 * @param {Number} y
	 */
	set y(y) {
		this.setGlyphPosition(false, y);
	}

	/**
	 * Set Width
	 * @param {Number} w
	 */
	set width(w) {
		this.setGlyphSize(w, false);
	}

	/**
	 * Set Height
	 * @param {Number} h
	 */
	set height(h) {
		this.setGlyphSize(false, h);
	}

	/**
	 * set leftSideBearing
	 * This is a convenience method, not a glyph property
	 * @param {Number} newLSB - what to set LSB to
	 */
	set leftSideBearing(newLSB) {
		let delta = newLSB - this.leftSideBearing;
		this.setGlyphPosition(newLSB);
		this.advanceWidth += delta;
	}

	/**
	 * set rightSideBearing
	 * This is a convenience method, not a glyph property
	 * @param {Number} newRSB - what to set RSB to
	 */
	set rightSideBearing(newRSB) {
		let delta = newRSB - this.rightSideBearing;
		this.advanceWidth += delta;
	}

	// --------------------------------------------------------------
	// Transform & move
	// --------------------------------------------------------------

	/**
	 * Move all the Shapes in this glyph as one group
	 * @param {Number} nx - new x
	 * @param {Number} ny - new y
	 */
	setGlyphPosition(nx, ny, updateComponentInstances = true) {
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
		this.updateGlyphPosition(dx, dy, updateComponentInstances);
		// log('Glyph.setGlyphPosition', 'end');
	}

	/**
	 * Update all the shapes' positions in this glyph as one group
	 * @param {Number} dx - delta x
	 * @param {Number} dy - delta y
	 */
	updateGlyphPosition(dx, dy, updateComponentInstances = true) {
		// log('Glyph.updateGlyphPosition', 'start');
		// log('dx/dy: ' + dx + ' ' + dy);
		// log('number of shapes: ' + this.shapes.length);

		dx = parseFloat(dx) || 0;
		dy = parseFloat(dy) || 0;
		for (let i = 0; i < this.shapes.length; i++) {
			const shape = this.shapes[i];
			if (shape.objType === 'ComponentInstance' && !updateComponentInstances) continue;
			// log(`moving shape #${i} - ${shape.name}`);
			// log(`BEFORE shape.maxes.xMin: ${shape.maxes.xMin}`);
			shape.updateShapePosition(dx, dy);
			// log(`AFTERS shape.maxes.xMin: ${shape.maxes.xMin}`);
		}
		// log(this.name);
		// log('Glyph.updateGlyphPosition', 'end');
	}

	/**
	 * Set all the sizes of the Shapes in this glyph as one group
	 * @param {Number} nw - new width
	 * @param {Number} nh - new height
	 * @param {Boolean} ratioLock - true to scale width and height 1:1
	 */
	setGlyphSize(nw, nh, ratioLock, updateComponentInstances = true) {
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
		this.updateGlyphSize(dw, dh, false, updateComponentInstances);
	}

	/**
	 * Update all the sizes of the Shapes in this glyph as one group
	 * @param {Number} dw - delta width
	 * @param {Number} dh - delta height
	 * @param {Boolean} ratioLock - true to scale width and height 1:1
	 */
	updateGlyphSize(dw, dh, ratioLock, updateComponentInstances = true) {
		// log('Glyph.updateGlyphSize', 'start');
		// log('number of shapes: ' + this.shapes.length);
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

		let shape;
		let shapeMaxes;
		let oldShapeWidth;
		let oldShapeHeight;
		let oldShapeX;
		let oldShapeY;
		let newShapeWidth;
		let newShapeHeight;
		let newShapeX;
		let newShapeY;
		let deltaWidth;
		let deltaHeight;
		let deltaX;
		let deltaY;

		// log('Before Maxes ' + json(m, true));
		for (let i = 0; i < this.shapes.length; i++) {
			shape = this.shapes[i];
			if (shape.objType === 'ComponentInstance' && !updateComponentInstances) continue;

			// log('>>> Updating ' + shape.objType + ' ' + i + '/' + this.shapes.length + ' : ' + shape.name);
			shapeMaxes = shape.maxes;

			// scale
			oldShapeWidth = shapeMaxes.xMax - shapeMaxes.xMin;
			newShapeWidth = oldShapeWidth * ratioWidth;

			if (ratioWidth === 0) deltaWidth = false;
			else deltaWidth = newShapeWidth - oldShapeWidth;

			oldShapeHeight = shapeMaxes.yMax - shapeMaxes.yMin;
			newShapeHeight = oldShapeHeight * ratioHeight;

			if (ratioHeight === 0) deltaHeight = false;
			else deltaHeight = newShapeHeight - oldShapeHeight;

			// log('Shape ' + i + ' dw dh ' + deltaWidth + ' ' + deltaHeight);
			shape.updateShapeSize(deltaWidth, deltaHeight, false);

			// move
			oldShapeX = shapeMaxes.xMin - m.xMin;
			newShapeX = oldShapeX * ratioWidth;

			if (ratioWidth === 0) deltaX = false;
			else deltaX = newShapeX - oldShapeX;

			oldShapeY = shapeMaxes.yMin - m.yMin;
			newShapeY = oldShapeY * ratioHeight;

			if (ratioHeight === 0) deltaY = false;
			else deltaY = newShapeY - oldShapeY;

			// log('Shape Pos ' + i + ' dx dy ' + deltaX + ' ' + deltaY);
			shape.updateShapePosition(deltaX, deltaY, true);
		}

		// log('Afters Maxes ' + json(this.maxes, true));
		// log(this.name);
		// log('Glyph.updateGlyphSize', 'end');
	}

	/**
	 * Flips this glyph about a horizontal line
	 * @param {Number} mid - y value about which to flip
	 * @returns {Glyph} - reference to this glyph
	 */
	flipNS(mid = this.maxes.center.y) {
		// log(`Glyph.flipNS`, 'start');

		// const m = this.maxes;
		// mid = isVal(mid) ? mid : (m.yMax - m.yMin) / 2 + m.yMin;
		// log(`mid: ${mid}`);

		for (let s = 0; s < this.shapes.length; s++) {
			this.shapes[s].flipNS(mid);
		}

		// log(`Glyph.flipNS`, 'end');
		return this;
	}

	/**
	 * Flips this glyph about a vertical line
	 * @param {Number} mid - y value about which to flip
	 * @returns {Glyph} - reference to this glyph
	 */
	flipEW(mid = this.maxes.center.x) {
		// log('Glyph.flipEW', 'start');
		// log('' + this.name);
		// log('passed mid = ' + mid);
		for (let s = 0; s < this.shapes.length; s++) {
			this.shapes[s].flipEW(mid);
		}

		// log('maxes = ' + json(this.maxes, true));
		return this;
	}

	/**
	 * Round all point x/y values to a certain precision
	 * @param {Number} precision - how many decimal places to round to
	 * @returns {Glyph} - reference to this glyph
	 */
	roundAll(precision = 0) {
		this.shapes.forEach((shape) => {
			if (shape.roundAll) {
				shape.roundAll(precision);
			}
		});
		return this;
	}

	/**
	 * Rotate about a point
	 * @param {Number} angle - how much to rotate (radians)
	 * @param {XYPoint} about - x/y center of rotation
	 * @returns {Glyph} - reference to this glyph
	 */
	rotate(angle, about) {
		about = about || this.maxes.center;
		for (let s = 0; s < this.shapes.length; s++) {
			this.shapes[s].rotate(angle, about);
		}

		return this;
	}

	/**
	 * Reverses the order of the path points in all the shapes,
	 * thus reversing the winding
	 * @returns {Glyph} - reference to this glyph
	 */
	reverseWinding() {
		for (let s = 0; s < this.shapes.length; s++) {
			this.shapes[s].reverseWinding();
		}

		return this;
	}

	// --------------------------------------------------------------
	// SVG
	// --------------------------------------------------------------

	/**
	 * Get / Make the data (attribute d="") for an SVG path tag
	 * @param {Glyph} - glyph object to get/make the path data for
	 * @returns {String} - SVG definition for the path d="" attribute
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

		let pathData = 'M0,0';

		// Make Path Data
		this.shapes.forEach((shape) => {
			// log(`shape ${j} of ${this.shapes.length}`);
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

		if (trim(pathData) === 'M0,0') pathData = 'M0,0Z';
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
		// log(this.shapes);
		if (this.shapes && this.shapes.length > 0) {
			// log('... has shapes, calling getOverallMaxes');
			overallMaxes = getOverallMaxes(this.shapes.map((item) => item.maxes));
		}

		this.cache.maxes = new Maxes(overallMaxes);
		// log(`result`);
		// log(this.cache);
		// log(`recalculateGlyphMaxes`, 'end');
		return this.cache.maxes;
	}
}
