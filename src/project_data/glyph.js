import { hexesToChars, isHex } from '../common/character_ids.js';
import {
	calculateDeltasFromTransform,
	hasNonValues,
	numSan,
	parseNumber,
	remove,
	transformOrigins,
	trim,
} from '../common/functions.js';
import { getUnicodeName } from '../lib/unicode/unicode_names.js';
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
	 * @param {Object} args
	 * @param {String =} args.id - unique identifier (Unicode code point)
	 * @param {Object =} args.parent - link to the Glyphr Studio Project
	 * @param {String =} args.objType - object type identifier
	 * @param {String =} args.name - name of this glyph
	 * @param {Number =} args.advanceWidth - manual setting for advance width
	 * @param {String =} args.transformOrigin - set the origin location for transforms
	 * @param {Boolean =} args.ratioLock - maintain aspect ratio while resizing
	 * @param {Array =} args.usedIn - where this glyph is used as a component instance
	 * @param {Array =} args.gsub - for ligatures, what characters does this lig replace
	 * @param {Array =} args.shapes - collection of Paths and Component Instances in this Glyph
	 * @param {String =} args.contextCharacters - what other glyphs to show around this one
	 */
	constructor({
		id = '',
		parent = false,
		objType = 'Glyph',
		name = '',
		shapes = [],
		advanceWidth = 0,
		transformOrigin = '',
		ratioLock = false,
		usedIn = [],
		gsub = [],
		contextCharacters = '',
	} = {}) {
		// log(`Glyph.constructor`, 'start');
		super();
		this.id = id;
		this.parent = parent;
		this.objType = objType;
		this.name = name;
		this.shapes = shapes;
		this.advanceWidth = advanceWidth;
		this.transformOrigin = transformOrigin;
		this.ratioLock = ratioLock;
		this.usedIn = usedIn;
		this.gsub = gsub;
		this.contextCharacters = contextCharacters;

		// Changed state metadata
		this.hasChangedThisSession = false;
		this.wasCreatedThisSession = true;

		if (this.id && this.id.startsWith('liga-') && this.gsub.length === 0) {
			// A ligature that is missing it's gsub property
			let charArr = this.id.split('-');
			charArr.shift();
			// log(`\n⮟charArr⮟`);
			// log(charArr);
			this.gsub = charArr.map((value) => {
				if (isHex(value)) return Number(value);
				else return value.codePointAt(0);
			});
		}
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
			id: this.id,
		};
		if (this.objType === 'Component') re.name = this.name;

		if (this.advanceWidth !== 0) re.advanceWidth = this.advanceWidth;
		if (this.transformOrigin && this.transformOrigin !== 'baseline-left') {
			re.transformOrigin = this.transformOrigin;
		}
		if (this.ratioLock !== false) re.ratioLock = this.ratioLock;
		if (this.usedIn.length) re.usedIn = this.usedIn;
		if (this.gsub.length) re.gsub = this.gsub;
		let cc = this.contextCharacters;
		if (cc.length && cc !== this.char) re.contextCharacters = cc;

		if (this.shapes && this.shapes.length) {
			re.shapes = [];
			for (let s = 0; s < this.shapes.length; s++) {
				if (this.shapes[s].objType === 'Path' && this.shapes[s].pathPoints.length === 0) {
					console.warn(`Empty Path found in Glyph ${this.id} - ${this.name}`);
				} else {
					re.shapes.push(this.shapes[s].save(verbose));
				}
			}
		}

		if (verbose) {
			re.objType = this.objType;
			re.name = this.name;
		}
		// if (!verbose && this?.__ID) delete this.__ID;

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
		if (this.transformOrigin !== false) re += `${ind}transformOrigin: ${this.transformOrigin}\n`;
		if (this.ratioLock !== false) re += `${ind}ratioLock: ${this.ratioLock}\n`;
		if (this.usedIn.length) re += `${ind}usedIn: ${JSON.stringify(this.usedIn)}\n`;
		if (this.gsub.length) re += `${ind}gsub: ${JSON.stringify(this.gsub)}\n`;

		if (this.shapes && this.shapes.length) {
			re += `${ind}shapes: [\n`;
			this.shapes.forEach((shape) => {
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
	 * get shapes
	 * @returns {Array}
	 */
	get shapes() {
		return this._shapes || [];
	}

	/**
	 * get advanceWidth
	 * @returns {Number}
	 */
	get advanceWidth() {
		return this._advanceWidth || 0;
	}

	/**
	 * get transformOrigin
	 * @returns {String | Boolean}
	 */
	get transformOrigin() {
		if (!this._transformOrigin) this._transformOrigin = 'baseline-left';
		return this._transformOrigin || '';
	}

	/**
	 * get ratioLock
	 * @returns {Boolean}
	 */
	get ratioLock() {
		return this._ratioLock || false;
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
	 * Calculates session edit state
	 * @returns {String}
	 */
	get sessionState() {
		if (this.hasChangedThisSession === true) return 'changed';
		if (this.wasCreatedThisSession === true) return 'new';
		return 'old';
	}

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
		const w = numSan(this.maxes.xMax - this.maxes.xMin);
		return Math.max(w, 0);
	}

	/**
	 * Get Height
	 * This is a calculated property
	 * based on all the Shapes in this Glyph
	 * @returns {Number}
	 */
	get height() {
		const h = numSan(this.maxes.yMax - this.maxes.yMin);
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
				let suffixArr = suffix.split('-');
				name = 'Ligature ';
				suffixArr.forEach((char) => {
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
			result = this.gsub.reduce((acc, value) => `${acc}${String.fromCodePoint(value)}`, '');
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

	/**
	 * Used to check for the 'too many points' warning
	 */
	get pointCount() {
		let count = 0;
		this.shapes.forEach((shape) => {
			if (shape.objType === 'ComponentInstance') {
				count += shape.pointCount;
			} else {
				shape.pathPoints.forEach((point) => {
					count++;
					if (point?.h1?.use) count++;
					if (point?.h2?.use) count++;
				});
			}
		});
		return count;
	}

	// --------------------------------------------------------------
	// Setters
	// --------------------------------------------------------------

	/**
	 * set paths
	 * @param {Array} newShapes - collection of Path or Component Instance
	 */
	set shapes(newShapes) {
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
	 * @param {Path | ComponentInstance | Object} newShape - Path to add to this
	 * @returns {Path | ComponentInstance | undefined} the added shape
	 */
	addOneShape(newShape = {}) {
		// log(`Glyph.addOneShape`, 'start');
		// log(newShape);
		if (!newShape) return;
		if (!Array.isArray(this._shapes)) this._shapes = [];
		if (newShape?.link) {
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

		this._advanceWidth = parseNumber(advanceWidth);
		// log(`parseNumber(advanceWidth): ${parseNumber(advanceWidth)}`);

		if (isNaN(this._advanceWidth)) this._advanceWidth = 0;
		// log(`this._advanceWidth: ${this._advanceWidth}`);

		// log(`Glyph SET advanceWidth`, 'end');
	}

	/**
	 * set transformOrigin
	 * @param {String} transformOrigin - which point to set
	 */
	set transformOrigin(transformOrigin) {
		if (transformOrigins.indexOf(transformOrigin) > -1) {
			this._transformOrigin = transformOrigin;
		} else {
			this._transformOrigin = false;
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
	set contextCharacters(chars) {
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
		this.setGlyphSize({ width: w });
	}

	/**
	 * Set Height
	 * @param {Number} h
	 */
	set height(h) {
		this.setGlyphSize({ height: h });
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
	 * @param {Number | Boolean} nx - new x
	 * @param {Number | Boolean} ny - new y
	 */
	setGlyphPosition(nx = false, ny = false, updateComponentInstances = true) {
		// log('Glyph.setGlyphPosition', 'start');
		// log(`nx/ny: ${nx} ${ny}`);
		const m = this.maxes;
		// log(this.maxes.print());

		if (nx !== false) nx = parseNumber(nx);
		if (ny !== false) ny = parseNumber(ny);
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
	updateGlyphPosition(dx = 0, dy = 0, updateComponentInstances = true) {
		// log('Glyph.updateGlyphPosition', 'start');
		// log('dx/dy: ' + dx + ' ' + dy);
		// log('number of shapes: ' + this.shapes.length);

		dx = parseNumber(dx) || 0;
		dy = parseNumber(dy) || 0;
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
	 * @param {Object} args
	 * @param {Number | Boolean =} args.width - new width
	 * @param {Number | Boolean =} args.height - new height
	 * @param {Boolean=} args.ratioLock - true to scale width and height 1:1
	 * @param {Boolean=} args.updateComponentInstances - true to update component instances
	 * @param {Array =} args.instanceIDsToSkip - component instances with these Item IDs will be skipped
	 * @param {String =} args.transformOrigin - name of transform origin point
	 */
	setGlyphSize({
		width = false,
		height = false,
		ratioLock = false,
		updateComponentInstances = true,
		instanceIDsToSkip = [],
		transformOrigin = '',
	} = {}) {
		const m = this.maxes;
		if (width !== false) width = parseNumber(width);
		if (height !== false) height = parseNumber(height);
		const ch = m.yMax - m.yMin;
		const cw = m.xMax - m.xMin;
		let dw = width !== false ? width - cw : 0;
		let dh = height !== false ? height - ch : 0;
		height = parseNumber(height);
		width = parseNumber(width);
		if (ratioLock) {
			if (Math.abs(height) > Math.abs(width)) dw = cw * (height / ch) - cw;
			else dh = ch * (width / cw) - ch;
		}

		this.updateGlyphSize({
			width: dw,
			height: dh,
			updateComponentInstances: updateComponentInstances,
			instanceIDsToSkip: instanceIDsToSkip,
			transformOrigin: transformOrigin,
		});
	}

	/**
	 * Update all the sizes of the Shapes in this glyph as one group
	 * @param {Object} args
	 * @param {Number =} args.width - delta width
	 * @param {Number =} args.height - delta height
	 * @param {Boolean =} args.ratioLock - true to scale width and height 1:1
	 * @param {Boolean =} args.updateComponentInstances - true to update component instances
	 * @param {Array =} args.instanceIDsToSkip - component instances with these Item IDs will be skipped
	 * @param {String =} args.transformOrigin - name of transform origin point
	 */
	updateGlyphSize({
		width = 0,
		height = 0,
		ratioLock = false,
		updateComponentInstances = true,
		instanceIDsToSkip = [],
		transformOrigin = '',
	} = {}) {
		// log('Glyph.updateGlyphSize', 'start');
		// log(`width: ${width}`);
		// log(`height: ${height}`);
		// log(`transformOrigin: ${transformOrigin}`);
		// log(`ratioLock: ${ratioLock}`);
		// log('number of shapes: ' + this.shapes.length);
		const glyphMaxes = this.maxes;
		let dW = parseNumber(width) || 0;
		let dH = parseNumber(height) || 0;
		// log('adjust dW/dH:\t' + dW + '/' + dH);
		const oldW = glyphMaxes.width;
		const oldH = glyphMaxes.height;
		let newW = oldW + dW;
		let newH = oldH + dH;
		if (Math.abs(newW) < 1) newW = 1;
		if (Math.abs(newH) < 1) newH = 1;
		// log('new w/h:\t' + newW + '/' + newH);
		let ratioHeight = newH / oldH;
		let ratioWidth = newW / oldW;

		// log('ratio dW/dH:\t' + ratioWidth + '/' + ratioHeight);
		if (ratioLock) {
			// Assuming only one will be nonzero
			// if(Math.abs(ratioHeight) > Math.abs(ratioWidth)) ratioWidth = ratioHeight;
			// else ratioHeight = ratioWidth;
			if (dW !== 0 && dH === 0) {
				ratioHeight = ratioWidth;
				newH = oldH * ratioHeight;
				dH = newH - oldH;
			} else {
				ratioWidth = ratioHeight;
				newW = oldW * ratioWidth;
				dW = newW - oldW;
			}
		}
		// log('ratio dW/dH:\t' + ratioWidth + '/' + ratioHeight);

		const deltas = calculateDeltasFromTransform(dW, dH, this.maxes, transformOrigin);
		// log(`\n⮟this.maxes⮟`);
		// log(this.maxes);
		this.shapes.forEach((shape) => {
			if (shape.objType === 'ComponentInstance') {
				if (!updateComponentInstances) return;
				if (instanceIDsToSkip?.includes(shape.link)) return;
			}

			const shapeMaxes = shape.maxes;

			// scale
			const oldShapeWidth = shapeMaxes.xMax - shapeMaxes.xMin;
			const newShapeWidth = oldShapeWidth * ratioWidth;

			let deltaWidth = 0;
			if (ratioWidth !== 0) deltaWidth = newShapeWidth - oldShapeWidth;

			const oldShapeHeight = shapeMaxes.yMax - shapeMaxes.yMin;
			const newShapeHeight = oldShapeHeight * ratioHeight;

			let deltaHeight = 0;
			if (ratioHeight !== 0) deltaHeight = newShapeHeight - oldShapeHeight;

			// log(`deltaHeight: ${deltaHeight}`);
			// log(`deltaWidth: ${deltaWidth}`);
			shape.updateShapeSize({
				width: deltaWidth,
				height: deltaHeight,
				transformOrigin: 'bottom-left',
			});

			// move
			const oldShapeX = shapeMaxes.xMin - glyphMaxes.xMin;
			const newShapeX = oldShapeX * ratioWidth;

			let deltaX = 0;
			if (ratioWidth !== 0) deltaX = newShapeX - oldShapeX;

			const oldShapeY = shapeMaxes.yMin - glyphMaxes.yMin;
			const newShapeY = oldShapeY * ratioHeight;

			let deltaY = 0;
			if (ratioHeight !== 0) deltaY = newShapeY - oldShapeY;

			shape.updateShapePosition(deltaX, deltaY, true);
		});

		this.updateGlyphPosition(deltas.deltaX, deltas.deltaY);
		// log(`\n⮟this.maxes⮟`);
		// log(this.maxes);
		// log(this.name);
		// log('Glyph.updateGlyphSize', 'end');
	}

	/**
	 * Iterates over just the paths in this glyph and skews
	 * them a given number of degrees.
	 * @param {Number} angle - degrees to skew the paths
	 * @param {Object} about - skew origin
	 */
	skewAngle(angle, about = { x: 0, y: 0 }) {
		this.shapes.forEach((shape) => {
			if (shape.objType !== 'ComponentInstance') {
				shape.skewAngle(angle, about);
			}
		});
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
	 * @param {Object} about - x/y center of rotation
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
	 * @returns {String} - SVG definition for the path d="" attribute
	 */
	get svgPathData() {
		// log(`Glyph GET svgPathData`, 'start');
		// log(this);
		if (!this?.cache?.svgPathData) {
			this.cache.svgPathData = this.makeSVGPathData();
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
