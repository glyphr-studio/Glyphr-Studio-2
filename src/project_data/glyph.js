import { GlyphElement } from './glyph_element.js';
import { Maxes } from './maxes.js';
import { Path } from './path.js';
import { Shape } from './shape.js';
import { ComponentInstance } from './component_instance.js';
import { getOverallMaxes } from './maxes.js';
import { json, clone, hasNonValues, isVal, trim } from '../common/functions.js';
import { parseUnicodeInput, getUnicodeName, hexToHTML, hexToChars } from '../common/unicode.js';
// import { combineShapes } from '../panels/REFACTOR_shape.js';

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
	 * @param {boolean} isAutoWide - is advance width automatically calculated
	 * @param {number} glyphWidth - manual setting for advance width
	 * @param {number} leftSideBearing - left side bearing distance
	 * @param {number} rightSideBearing - right side bearing distance
	 * @param {boolean} ratioLock - maintain aspect ratio while resizing
	 * @param {boolean} shapes - collection of Shapes and Component Instances in this Glyph
	 * @param {array} usedIn - array of IDs where this Glyph is used as a component instance
	 */
	constructor({
		id = false,
		shapes = [],
		isAutoWide = true,
		glyphWidth = 0,
		leftSideBearing = false,
		rightSideBearing = false,
		ratioLock = false,
		usedIn = [],
	} = {}) {
		// log(`Glyph.constructor`, 'start');
		super();
		this.id = id;
		this.shapes = shapes;
		this.isAutoWide = isAutoWide;
		this.glyphWidth = glyphWidth;
		this.leftSideBearing = leftSideBearing;
		this.rightSideBearing = rightSideBearing;
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
		};

		if (this.isAutoWide !== true) re.isAutoWide = this.isAutoWide;
		if (this.glyphWidth !== 0) re.glyphWidth = this.glyphWidth;
		if (this.leftSideBearing !== false)
			re.leftSideBearing = this.leftSideBearing;
		if (this.rightSideBearing !== false)
			re.rightSideBearing = this.rightSideBearing;
		if (this.ratioLock !== false) re.ratioLock = this.ratioLock;
		if (this.usedIn.length) re.usedIn = this.usedIn;

		if (this.shapes && this.shapes.length) {
			re.shapes = [];
			for (let s = 0; s < this.shapes.length; s++)
				re.shapes.push(this.shapes[s].save(verbose));
		}

		if (!verbose) {
			delete re.objType;
			delete re.name;
		}

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

		if (this.isAutoWide !== true)
			re += `${ind}isAutoWide: ${this.isAutoWide}\n`;
		if (this.glyphWidth !== 0) re += `${ind}glyphWidth: ${this.glyphWidth}\n`;
		if (this.leftSideBearing !== false)
			re += `${ind}leftSideBearing: ${this.leftSideBearing}\n`;
		if (this.rightSideBearing !== false)
			re += `${ind}rightSideBearing: ${this.rightSideBearing}\n`;
		if (this.ratioLock !== false) re += `${ind}ratioLock: ${this.ratioLock}\n`;
		if (this.usedIn.length)
			re += `${ind}usedIn: ${JSON.stringify(this.usedIn)}\n`;

		if (this.shapes && this.shapes.length) {
			re += `${ind}shapes: [\n`;
			this._shapes.forEach((sh) => {
				re += sh.print(level + 2);
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
	 * @returns {string}
	 */
	get id() {
		return this._id;
	}

	/**
	 * get shapes
	 * @returns {array}
	 */
	get shapes() {
		return this._shapes;
	}

	/**
	 * get isAutoWide
	 * @returns {boolean}
	 */
	get isAutoWide() {
		return this._isAutoWide;
	}

	/**
	 * get glyphWidth
	 * @returns {number}
	 */
	get glyphWidth() {
		return this._glyphWidth;
	}

	/**
	 * get leftSideBearing
	 * @returns {number}
	 */
	get leftSideBearing() {
		return this._leftSideBearing;
	}

	/**
	 * get rightSideBearing
	 * @returns {number}
	 */
	get rightSideBearing() {
		return this._rightSideBearing;
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
	 * @returns {number}
	 */
	get x() {
		return this.maxes.xMin;
	}

	/**
	 * Get Y position
	 * @returns {number}
	 */
	get y() {
		return this.maxes.yMax;
	}

	/**
	 * Get Width
	 * @returns {number}
	 */
	get width() {
		if (this.isAutoWide) {
			const w = this.maxes.xMax - this.maxes.xMin;
			return Math.max(w, 0);
		} else {
			return this.glyphWidth;
		}
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
	 * get maxes
	 * @returns {boolean}
	 */
	get maxes() {
		// log('Glyph.getMaxes', 'start');
		if (!this.cache.maxes || hasNonValues(this.cache.maxes)) {
			this.calcMaxes();
		}
		// log('returning ' + json(this.maxes));
		// log(this.name);
		// log('Glyph.getMaxes', 'end');
		return new Maxes(this.cache.maxes);
	}

	// Computed properties

	/**
	 * get name
	 * @returns {string}
	 */
	get name() {
		// log('Glyph GET name', 'start');
		let name = getUnicodeName(this.id);
		// log(`ID: ${this.id} result: ${name}`);
		// log('Glyph GET name', 'end');
		return name;
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
	 * get Left Side Bearing
	 * @returns {number}
	 */
	get lsb() {
		// Nullish coalescing would be great here
		if (this._leftSideBearing === 0) return this._leftSideBearing;
		else return this._leftSideBearing || false;
	}

	/**
	 * get Right Side Bearing
	 * @returns {number}
	 */
	get rsb() {
		// Nullish coalescing would be great here
		if (this._rightSideBearing === 0) return this._rightSideBearing;
		else return this._rightSideBearing || false;
	}

	/**
	 * get Advance Width
	 * @returns {number}
	 */
	get advanceWidth() {
		if (this.isAutoWide) return this.width + this.lsb + this.rsb;
		else return this.glyphWidth;
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
	 * @returns {Glyph} - reference to this Glyph
	 */
	set id(newID) {
		newID = parseUnicodeInput(newID);
		newID = newID.join ? newID.join('') : '0x0000';
		this._id = newID;
	}

	/**
	 * set shapes
	 * @param {array} shapes
	 * @returns {Glyph} - reference to this Glyph
	 */
	set shapes(newShapes = []) {
		// log(`Glyph.shapes setter - Start`);
		// log(`passed length ${newShapes.length}`);

		this._shapes = [];

		if (newShapes && newShapes.length) {
			for (let i = 0; i < newShapes.length; i++) {
				this.addOneShape(newShapes[i]);
			}
		}

		// log(`Glyph.shapes is now length = ${this.shapes? this.shapes.length : 'NULL'}`);
		// log(` Glyph.shapes setter - End\n`);
	}

	/**
	 * Adds a new shape to this glyph, making sure linking is in place
	 * @param {Shape} newShape - Shape to add to this glyph
	 */
	addOneShape(newShape) {
		if (isVal(newShape.link)) {
			// log(`hydrating ci ${i} - name: ${newShape.name}`);
			newShape.parent = this;
			this._shapes.push(new ComponentInstance(newShape));
		} else {
			// log(`hydrating sh ${i} - name: ${newShape.name}`);
			newShape.parent = this;
			this._shapes.push(new Shape(newShape));
		}
		return this._shapes.at(-1);
	}

	/**
	 * set isAutoWide
	 * @param {boolean} isAutoWide
	 * @returns {Glyph} - reference to this Glyph
	 */
	set isAutoWide(isAutoWide) {
		this._isAutoWide = !!isAutoWide;
	}

	/**
	 * set glyphWidth
	 * @param {number} glyphWidth
	 * @returns {Glyph} - reference to this Glyph
	 */
	set glyphWidth(glyphWidth) {
		this._glyphWidth = parseFloat(glyphWidth);
		if (isNaN(this._glyphWidth)) this._glyphWidth = 0;
	}

	/**
	 * set leftSideBearing
	 * @param {number} leftSideBearing
	 * @returns {Glyph} - reference to this Glyph
	 */
	set leftSideBearing(leftSideBearing) {
		if (leftSideBearing === false) {
			this._leftSideBearing = false;
		} else {
			this._leftSideBearing = parseFloat(leftSideBearing);
			if (isNaN(this._leftSideBearing)) this._leftSideBearing = 0;
		}
	}

	/**
	 * set rightSideBearing
	 * @param {number} rightSideBearing
	 * @returns {Glyph} - reference to this Glyph
	 */
	set rightSideBearing(rightSideBearing) {
		if (rightSideBearing === false) {
			this._rightSideBearing = false;
		} else {
			this._rightSideBearing = parseFloat(rightSideBearing);
			if (isNaN(this._rightSideBearing)) this._rightSideBearing = 0;
		}
	}

	/**
	 * set ratioLock
	 * @param {boolean} ratioLock
	 * @returns {Glyph} - reference to this Glyph
	 */
	set ratioLock(ratioLock) {
		this._ratioLock = !!ratioLock;
	}

	/**
	 * set usedIn
	 * @param {array} usedIn
	 * @returns {Glyph} - reference to this Glyph
	 */
	set usedIn(usedIn) {
		this._usedIn = usedIn || [];
	}

	// computed properties

	/**
	 * Set X position
	 * @param {number} x
	 * @returns {Glyph} - reference to this Glyph
	 */
	set x(x) {
		this.setGlyphPosition(x, false);
	}

	/**
	 * Set Y position
	 * @param {number} y
	 * @returns {Glyph} - reference to this Glyph
	 */
	set y(y) {
		this.setGlyphPosition(false, y);
	}

	/**
	 * Set Width
	 * @param {number} w
	 * @returns {Glyph} - reference to this Glyph
	 */
	set width(w) {
		this.setGlyphSize(w, false);
	}

	/**
	 * Set Height
	 * @param {number} h
	 * @returns {Glyph} - reference to this Glyph
	 */
	set height(h) {
		this.setGlyphSize(false, h);
	}

	/**
	 * Set Maxes
	 * @param {Maxes} maxes
	 * @returns {Glyph} - reference to this Glyph
	 */
	set maxes(maxes) {
		this.cache.maxes = {};
		this.cache.maxes = new Maxes(maxes);
	}

	// --------------------------------------------------------------
	// Transform & move
	// --------------------------------------------------------------

	/**
	 * Move all the shapes in this glyph as one group
	 * @param {number} nx - new x
	 * @param {number} ny - new y
	 */
	setGlyphPosition(nx, ny) {
		// log('Glyph.setGlyphPosition', 'start');
		// log('nx/ny: ' + nx + ' ' + ny);
		const m = this.maxes;
		if (nx !== false) nx = parseFloat(nx);
		if (ny !== false) ny = parseFloat(ny);
		const dx = nx !== false ? nx - m.xMin : 0;
		const dy = ny !== false ? ny - m.yMax : 0;
		this.updateGlyphPosition(dx, dy);
		// log('Glyph.setGlyphPosition', 'end');
	}

	/**
	 * Update all the shapes' positions in this glyph as one group
	 * @param {number} dx - delta x
	 * @param {number} dy - delta y
	 */
	updateGlyphPosition(dx, dy) {
		// log('Glyph.updateGlyphPosition', 'start');
		// log('dx/dy: ' + dx + ' ' + dy);
		// log('number of shapes: ' + this.shapes.length);
		dx = parseFloat(dx) || 0;
		dy = parseFloat(dy) || 0;
		const cs = this.shapes;
		for (let i = 0; i < cs.length; i++) {
			cs[i].updateShapePosition(dx, dy);
		}
		// log(this.name);
		// log('Glyph.updateGlyphPosition', 'end');
	}

	/**
	 * Set all the sizes of the shapes in this glyph as one group
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
	 * Update all the sizes of the shapes in this glyph as one group
	 * @param {number} dw - delta width
	 * @param {number} dh - delta height
	 * @param {boolean} ratioLock - true to scale width and height 1:1
	 */
	updateGlyphSize(dw, dh, ratioLock) {
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
	 * @param {number} mid - y value about which to flip
	 * @returns {Glyph} - reference to this glyph
	 */
	flipNS(mid) {
		const m = this.maxes;
		mid = isVal(mid) ? mid : (m.yMax - m.yMin) / 2 + m.yMin;
		for (let s = 0; s < this.shapes.length; s++) {
			this.shapes[s].flipNS(mid);
		}

		return this;
	}

	/**
	 * Flips this glyph about a vertical line
	 * @param {number} mid - y value about which to flip
	 * @returns {Glyph} - reference to this glyph
	 */
	flipEW(mid) {
		// log('Glyph.flipEW', 'start');
		// log('' + this.name);
		// log('passed mid = ' + mid);
		const m = this.maxes;
		mid = isVal(mid) ? mid : (m.xMax - m.xMin) / 2 + m.xMin;
		// log('mid = ' + mid);
		// log('maxes = ' + json(m, true));
		for (let s = 0; s < this.shapes.length; s++) {
			this.shapes[s].flipEW(mid);
		}

		// log('maxes = ' + json(this.maxes, true));
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
		for (let s = 0; s < this.shapes.length; s++) {
			this.shapes[s].rotate(angle, about);
		}

		return this;
	}

	/**
	 * Reverses the order of the path points in all the paths,
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
	// Alignment
	// --------------------------------------------------------------

	/**
	 * Move all the shapes to align with an edge
	 * @param {string} edge - which edge to align all the shapes to
	 */
	alignShapes(edge) {
		// log('Glyph.alignShapes', 'start');
		// log('edge: ' + edge);
		let target;
		let offset;

		if (edge === 'top') {
			target = -999999;
			this.shapes.forEach(function (v) {
				target = Math.max(target, v.maxes.yMax);
			});
			// log('found TOP: ' + target);
			this.shapes.forEach(function (v) {
				v.setShapePosition(false, target);
			});
		} else if (edge === 'middle') {
			target = this.maxes.center.y;
			// log('found MIDDLE: ' + target);
			this.shapes.forEach(function (v) {
				offset = v.maxes.center.y;
				v.updateShapePosition(false, target - offset);
			});
		} else if (edge === 'bottom') {
			target = 999999;
			this.shapes.forEach(function (v) {
				target = Math.min(target, v.maxes.yMin);
			});
			// log('found BOTTOM: ' + target);
			this.shapes.forEach(function (v) {
				offset = v.maxes.yMin;
				v.updateShapePosition(false, target - offset);
			});
		} else if (edge === 'left') {
			target = 999999;
			this.shapes.forEach(function (v) {
				target = Math.min(target, v.maxes.xMin);
			});
			// log('found LEFT: ' + target);
			this.shapes.forEach(function (v) {
				v.setShapePosition(target, false);
			});
		} else if (edge === 'center') {
			target = this.maxes.center.x;
			// log('found CENTER: ' + target);
			this.shapes.forEach(function (v) {
				offset = v.maxes.center.x;
				v.updateShapePosition(target - offset, false);
			});
		} else if (edge === 'right') {
			target = -999999;
			this.shapes.forEach(function (v) {
				target = Math.max(target, v.maxes.xMax);
			});
			// log('found RIGHT: ' + target);
			this.shapes.forEach(function (v) {
				offset = v.maxes.xMax;
				v.updateShapePosition(target - offset, false);
			});
		}

		// log('Glyph.alignShapes', 'end');
	}

	// --------------------------------------------------------------
	// Calculating dimensions
	// --------------------------------------------------------------

	/**
	 * Calculate the overall maxes for this Glyph
	 * @returns {Maxes}
	 */
	calcMaxes() {
		// log(`Glyph.calcMaxes - START `);
		this.cache.maxes = {};
		let tm;
		if (this.shapes && this.shapes.length > 0) {
			for (let jj = 0; jj < this.shapes.length; jj++) {
				// log(`++++++ START shape ${jj}`);
				tm = this.shapes[jj].maxes;
				// log(`before ${this.maxes.print()}`);
				this.cache.maxes = getOverallMaxes([tm, this.maxes]);
				// log(`afters ${this.maxes.print()}`);
				// log(`++++++ end shape ${jj}`);
			}
		} else {
			// log(`No shapes, returning zeros`);
			this.cache.maxes = { xMax: 0, xMin: 0, yMax: 0, yMin: 0 };
		}

		// log(`result: ${this.maxes.print()}`);
		// log(`Glyph.calcMaxes`, 'end');
		return this.maxes;
	}


	// --------------------------------------------------------------
	// Export to different languages
	// --------------------------------------------------------------

	/**
	 * Make SVG from this Shape
	 * @param {number} size - how big
	 * @param {number} gutter - margin
	 * @param {number} emSquare - em square of the font
	 * @param {number} desc - descender value of the font (positive integer)
	 * @returns {string} - svg
	 */
	makeSVG(size = 50, gutter = 5, emSquare = 1000, desc = 300) {
		// log('Glyph.makeSVG', 'start');

		const charScale = (size - gutter * 2) / size;
		const gutterScale = (gutter / size) * emSquare;
		const vbSize = emSquare - gutter * 2;
		const pathData = this.svgPathData;

		// Assemble SVG
		let re = '<svg version="1.1" ';
		re +=
			'xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ';
		re +=
			'width="' +
			size +
			'" height="' +
			size +
			'" viewBox="0,0,' +
			vbSize +
			',' +
			vbSize +
			'">';
		re +=
			'<g transform="translate(' +
			gutterScale +
			',' +
			(emSquare - desc - gutterScale / 2) +
			') scale(' +
			charScale +
			',-' +
			charScale +
			')">';
		// re += '<rect x="0" y="-'+desc+'" height="'+desc+'" width="1000" fill="lime"/>';
		// re += '<rect x="0" y="0" height="'+(emSquare-desc)+'" width="1000" fill="cyan"/>';
		re += '<path d="' + pathData + '"/>';
		re += '</g>';
		re += '</svg>';
		// log('Glyph.makeSVG', 'end');
		return re;
	}

	/**
	 * Make the data (attribute d="") for an SVG path tag
	 * @returns {string}
	 */
	makeSVGPathData() {
		if (this.cache.svg) return this.cache.svg;

		const sl = this.shapes;
		let pathData = '';
		let shape;
		let path;
		let tg;

		// Make Path Data
		for (let j = 0; j < sl.length; j++) {
			shape = sl[j];
			if (shape.objType === 'ComponentInstance') {
				tg = shape.transformedGlyph;
				if (tg) pathData += tg.svgPathData;
			} else {
				path = new Path(clone(shape.path));
				path.updatePathPosition(this.lsb, 0, true);
				pathData += shape.path.svgPathData;
				if (j < sl.length - 1) pathData += ' ';
			}
		}
		if (trim(pathData) === '') pathData = 'M0,0Z';
		this.cache.svg = pathData;
		return pathData;
	}

	// --------------------------------------------------------------
	// Boolean Combine
	// --------------------------------------------------------------

	/**
	 * Converts all the Component Instances in this Glyph to stand-alone shapes
	 * @returns {Glyph}
	 */
	flattenGlyph() {
		// log(`Glyph.flattenGlyph`, 'start');

		const reshapes = [];
		let ts;
		let tg;
		for (let s = 0; s < this.shapes.length; s++) {
			ts = this.shapes[s];
			// log(`shape ${s} is ${ts.objType}`);

			if (ts.objType === 'Shape') {
				reshapes.push(ts.save());
			} else if (ts.objType === 'ComponentInstance') {
				tg = ts.transformedGlyph;
				tg = tg.flattenGlyph();
				for (let c = 0; c < tg.shapes.length; c++) {
					reshapes.push(tg.shapes[c].save());
				}
			} else {
				// log('Glyph.flattenGlyph', - ERROR - none shape or ci in shapes array');
			}
		}
		this.shapes = reshapes;

		// log(`Glyph.flattenGlyph`, 'end');
		return this;
	}

	/**
	 * Boolean combine all shapes in this Glyph to as few shapes as possible
	 * @param {boolean} doNotToast - don't show progress messages
	 * @returns {Glyph} - reference to this Glyph
	 */
	combineAllShapes() {
		// log('Glyph.combineAllShapes', 'start');

		this.flattenGlyph();
		/*

			TODO get functionality from V1

		const shapes = combineShapes(this.shapes, doNotToast);
		if (shapes) {
			// log('new shapes');
			this.shapes = shapes;
			// log(this.shapes);
		}

		// log(`this glyph AFTER`);
		// log(this.print());

		// log(this.name);
		// log('Glyph.combineAllShapes', 'end');
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
	hasShapes() {
		let tg;
		for (let s = 0; s < this.shapes.length; s++) {
			if (this.shapes[s].objType !== 'ComponentInstance') return true;
			else {
				tg = this.shapes[s].transformedGlyph;
				if (tg.hasShapes()) return true;
			}
		}
		return false;
	}

	/**
	 * Clean up any shapes with zero path points
	 * @returns {Glyph} - reference to this Glyph
	 */
	removeShapesWithZeroLengthPaths() {
		for (let s = 0; s < this.shapes.length; s++) {
			if (this.shapes[s].path && this.shapes[s].path.pathPoints.length === 0) {
				this.shapes.splice(s, 1);
				s--;
			}
		}

		return this;
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
