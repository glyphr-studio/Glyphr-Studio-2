import { deg, parseNumber, rad, strSan } from '../common/functions.js';
import { makeGlyphWithResolvedLinks } from '../project_editor/cross_item_actions.js';
import { GlyphElement } from './glyph_element.js';

/**
 * Glyph Element > Component Instance
 * Component Instances are a link to any other
 * Glyph Object (Glyphs, Components, or Ligatures).
 * Additionally they hold transformation info about
 * how they differ from their root component.
 * Component Instances surface *all* the same
 * methods as a Path, and are stored along side
 * regular Paths in a Glyph.
 */
export class ComponentInstance extends GlyphElement {
	/**
	 * Create a ComponentInstance
	 * @param {Object} arg
	 * @param {String | false =} arg.link - Root component that this instances is based on
	 * @param {String =} arg.name - name
	 * @param {Number =} arg.translateX - horizontal position difference
	 * @param {Number =} arg.translateY - vertical position difference
	 * @param {Number =} arg.resizeWidth - horizontal size difference
	 * @param {Number =} arg.resizeHeight - vertical size difference
	 * @param {Boolean =} arg.isFlippedEW - flipped horizontally
	 * @param {Boolean =} arg.isFlippedNS - flipped vertically
	 * @param {Boolean =} arg.reverseWinding - paths have opposite winding
	 * @param {Number =} arg.rotation - rotation difference
	 * @param {Boolean =} arg.rotateFirst - rotate/resize is different than resize/rotate
	 * @param {Boolean =} arg.xLock - can the path be moved horizontally
	 * @param {Boolean =} arg.yLock - can the path be moved vertically
	 * @param {Boolean =} arg.wLock - can the path be resized horizontally
	 * @param {Boolean =} arg.hLock - can the path be resized vertically
	 * @param {Boolean =} arg.ratioLock - while resizing, maintain aspect ratio
	 * @param {Object =} arg.parent - link to the parent Glyph object
	 */
	constructor({
		link = false,
		name = 'Component Instance',
		translateX = 0,
		translateY = 0,
		resizeWidth = 0,
		resizeHeight = 0,
		isFlippedNS = false,
		isFlippedEW = false,
		reverseWinding = false,
		rotation = 0,
		rotateFirst = false,
		xLock = false,
		yLock = false,
		wLock = false,
		hLock = false,
		ratioLock = false,
		parent = false,
	} = {}) {
		super();
		this.parent = parent;
		this.name = name;

		// Component instance properties
		this.link = link;
		this.translateX = translateX;
		this.translateY = translateY;
		this.resizeWidth = resizeWidth;
		this.resizeHeight = resizeHeight;
		this.isFlippedNS = isFlippedNS; // These have a different name because there is a function 'flipNS'
		this.isFlippedEW = isFlippedEW; // These have a different name because there is a function 'flipEW'
		this.reverseWinding = reverseWinding;
		this.rotation = rotation;
		this.rotateFirst = rotateFirst;

		// Path-like properties
		this.xLock = xLock;
		this.yLock = yLock;
		this.wLock = wLock;
		this.hLock = hLock;
		this.ratioLock = ratioLock;

		this.objType = 'ComponentInstance';
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
			link: this.link,
		};

		if (this.name !== 'Component Instance') re.name = this.name;
		if (this.translateX !== 0) re.translateX = this.translateX;
		if (this.translateY !== 0) re.translateY = this.translateY;
		if (this.resizeWidth !== 0) re.resizeWidth = this.resizeWidth;
		if (this.resizeHeight !== 0) re.resizeHeight = this.resizeHeight;
		if (this.isFlippedNS !== false) re.isFlippedNS = this.isFlippedNS;
		if (this.isFlippedEW !== false) re.isFlippedEW = this.isFlippedEW;
		if (this.reverseWinding !== false) re.reverseWinding = this.reverseWinding;
		if (this.rotation !== 0) re.rotation = this.rotation;
		if (this.rotateFirst !== false) re.rotateFirst = this.rotateFirst;
		if (this.xLock !== false) re.xLock = this.xLock;
		if (this.yLock !== false) re.yLock = this.yLock;
		if (this.wLock !== false) re.wLock = this.wLock;
		if (this.hLock !== false) re.hLock = this.hLock;
		if (this.ratioLock !== false) re.ratioLock = this.ratioLock;

		if (verbose) re.objType = this.objType;

		return re;
	}

	// --------------------------------------------------------------
	// Get / Make Transformed Glyph
	// --------------------------------------------------------------
	/**
	 * Component Instances are basically links to other Glyphs, plus some transformations.
	 * This function grabs a clone of the linked-to Glyph, applies the transformations,
	 * and returns a Glyph object - while also updating the cache
	 * @returns {Object}
	 */
	get transformedGlyph() {
		if (!this.cache.transformedGlyph) {
			this.cache.transformedGlyph = this.makeTransformedGlyph();
		}
		return this.cache.transformedGlyph;
	}

	makeTransformedGlyph() {
		// log('makeTransformedGlyph', 'start');
		// log(`name: ${this.name}`);
		// log(`link: ${this.link}`);
		// log(`\n⮟this⮟`);
		// log(this);

		const linkedGlyph = this.getCrossLinkedItem();
		if (!linkedGlyph) {
			console.warn(
				`Tried to get Component: ${this.link} but it doesn't exist - bad usedIn array maintenance.`
			);
			// log('makeTransformedGlyph', 'end');
			return false;
		}

		const newGlyph = makeGlyphWithResolvedLinks(linkedGlyph);
		// log(`\n⮟newGlyph⮟`);
		// log(newGlyph);
		// log(`translateX: ${this.translateX}`);
		// log(`translateY: ${this.translateY}`);
		// log(`resizeWidth: ${this.resizeWidth}`);
		// log(`resizeHeight: ${this.resizeHeight}`);
		// log(`flipEW: ${this.isFlippedEW}`);
		// log(`flipNS: ${this.isFlippedNS}`);
		// log(`reverseWinding: ${this.reverseWinding}`);
		// log(`rotation: ${this.rotation}`);

		if (
			this.translateX ||
			this.translateY ||
			this.resizeWidth ||
			this.resizeHeight ||
			this.isFlippedEW ||
			this.isFlippedNS ||
			this.reverseWinding ||
			this.rotation
		) {
			// log('Modifying w ' + this.resizeWidth + ' h ' + this.resizeHeight);
			// log(`before maxes ${this.maxes.print()}`);
			if (this.rotateFirst) newGlyph.rotate(rad(this.rotation * -1), newGlyph.maxes.center);
			if (this.isFlippedEW) newGlyph.flipEW();
			if (this.isFlippedNS) newGlyph.flipNS();
			newGlyph.updateGlyphPosition(this.translateX, this.translateY, true);
			newGlyph.updateGlyphSize({ width: this.resizeWidth, height: this.resizeHeight });
			if (this.reverseWinding) newGlyph.reverseWinding();
			if (!this.rotateFirst) newGlyph.rotate(rad(this.rotation * -1), newGlyph.maxes.center);
			// log(`afters maxes ${this.maxes.print()}`);
		} else {
			// log('Not changing, no deltas');
		}

		// log(`\n⮟newGlyph⮟`);
		// log(newGlyph);
		// log('makeTransformedGlyph', 'end');

		return newGlyph;
	}

	getCrossLinkedItem() {
		// log(`ComponentInstance.getCrossLinkedItem`, 'start');
		let project = this?.parent?.parent;
		// log(`\n⮟project⮟`);
		// log(project);
		let item;
		if (project && project.getItem) item = project.getItem(this.link);
		// log(`\n⮟item⮟`);
		// log(item);
		// log(`ComponentInstance.getCrossLinkedItem`, 'end');
		return item;
	}

	// --------------------------------------------------------------
	// Getters
	// --------------------------------------------------------------

	/**
	 * get link
	 * @returns {String | false}
	 */
	get link() {
		return this._link || false;
	}

	/**
	 * get name
	 * @returns {String}
	 */
	get name() {
		return this._name || '';
	}

	/**
	 * get translateX
	 * @returns {Number}
	 */
	get translateX() {
		return this._translateX || 0;
	}

	/**
	 * get translateY
	 * @returns {Number}
	 */
	get translateY() {
		return this._translateY || 0;
	}

	/**
	 * get resizeWidth
	 * @returns {Number}
	 */
	get resizeWidth() {
		return this._scaleW || 0;
	}

	/**
	 * get resizeHeight
	 * @returns {Number}
	 */
	get resizeHeight() {
		return this._scaleH || 0;
	}

	/**
	 * get isFlippedEW
	 * @returns {Boolean}
	 */
	get isFlippedEW() {
		return !!this._isFlippedEW;
	}

	/**
	 * get isFlippedNS
	 * @returns {Boolean}
	 */
	get isFlippedNS() {
		return !!this._isFlippedNS;
	}

	/**
	 * get reverseWinding
	 * @returns {Boolean}
	 */
	get reverseWinding() {
		return !!this._reverseWinding;
	}

	/**
	 * get rotation
	 * @returns {Number}
	 */
	get rotation() {
		return this._rotation || 0;
	}

	/**
	 * get rotateFirst
	 * @returns {Boolean}
	 */
	get rotateFirst() {
		return !!this._rotateFirst;
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
	 * get ratioLock
	 * @returns {Boolean}
	 */
	get ratioLock() {
		return !!this._ratioLock;
	}

	// Computed properties

	/**
	 * get x
	 * @returns {Number}
	 */
	get x() {
		return this.maxes.xMin;
	}

	/**
	 * get y
	 * @returns {Number}
	 */
	get y() {
		return this.maxes.yMax;
	}

	/**
	 * get width
	 * @returns {Number} width
	 */
	get width() {
		const g = this.transformedGlyph.maxes;
		return g.width;
	}

	/**
	 * get height
	 * @returns {Number} height
	 */
	get height() {
		const g = this.transformedGlyph.maxes;
		return g.height;
	}

	/**
	 * get maxes
	 * @returns {Object} maxes
	 */
	get maxes() {
		return this.transformedGlyph.maxes;
	}

	/**
	 * center
	 * @returns {Object}
	 */
	get center() {
		return this.transformedGlyph.maxes.center;
	}

	/**
	 * get svgPathData
	 */
	get svgPathData() {
		let result = this.transformedGlyph.svgPathData;
		return result;
	}

	// --------------------------------------------------------------
	// Setters
	// --------------------------------------------------------------

	/**
	 * set link
	 * @param {String | false} link
	 * @returns {ComponentInstance} - reference to this ComponentInstance
	 */
	set link(link) {
		this._link = link;
		this.changed();
	}

	/**
	 * set name
	 * @param {String} name
	 * @returns {ComponentInstance} - reference to this ComponentInstance
	 */
	set name(name) {
		name = strSan(name);
		if (name !== '') {
			this._name = name;
		} else {
			// showToast(
			// 	'Invalid component instance name - component instance names must only contain alphanumeric characters or spaces.'
			// );
		}
	}

	/**
	 * set translateX
	 * @param {Number} translateX
	 * @returns {ComponentInstance} - reference to this ComponentInstance
	 */
	set translateX(translateX) {
		this._translateX = parseNumber(translateX);
		if (isNaN(this._translateX)) this._translateX = 0;
		this.changed();
	}

	/**
	 * set translateY
	 * @param {Number} translateY
	 * @returns {ComponentInstance} - reference to this ComponentInstance
	 */
	set translateY(translateY) {
		this._translateY = parseNumber(translateY);
		if (isNaN(this._translateY)) this._translateY = 0;
		this.changed();
	}

	/**
	 * set resizeWidth
	 * @param {Number} resizeWidth
	 * @returns {ComponentInstance} - reference to this ComponentInstance
	 */
	set resizeWidth(resizeWidth) {
		this._scaleW = parseNumber(resizeWidth);
		if (isNaN(this._scaleW)) this._scaleW = 0;
		this.changed();
	}

	/**
	 * set resizeHeight
	 * @param {Number} resizeHeight
	 * @returns {ComponentInstance} - reference to this ComponentInstance
	 */
	set resizeHeight(resizeHeight) {
		this._scaleH = parseNumber(resizeHeight);
		if (isNaN(this._scaleH)) this._scaleH = 0;
		this.changed();
	}

	/**
	 * set isFlippedNS
	 * @param {Boolean} isFlippedNS
	 * @returns {ComponentInstance} - reference to this ComponentInstance
	 */
	set isFlippedNS(isFlippedNS) {
		this._isFlippedNS = !!isFlippedNS;
		this.changed();
	}

	/**
	 * set isFlippedEW
	 * @param {Boolean} isFlippedEW
	 * @returns {ComponentInstance} - reference to this ComponentInstance
	 */
	set isFlippedEW(isFlippedEW) {
		this._isFlippedEW = !!isFlippedEW;
		this.changed();
	}

	/**
	 * set reverseWinding
	 * @param {Boolean} reverseWinding
	 * @returns {ComponentInstance} - reference to this ComponentInstance
	 */
	set reverseWinding(reverseWinding) {
		this._reverseWinding = !!reverseWinding;
		this.changed();
	}

	/**
	 * set rotation
	 * @param {Number} rotation
	 * @returns {ComponentInstance} - reference to this ComponentInstance
	 */
	set rotation(rotation) {
		// log(`ComponentInstance SET rotation`, 'start');
		// log(`PASSED rotation: ${rotation}`);
		this._rotation = parseNumber(rotation);
		if (isNaN(this._rotation)) this._rotation = 0;
		this.changed();
		// log(`SET this._rotation: ${this._rotation}`);
		// log(`ComponentInstance SET rotation`, 'end');
	}

	/**
	 * set rotateFirst
	 * @param {Boolean} rotateFirst
	 * @returns {ComponentInstance} - reference to this ComponentInstance
	 */
	set rotateFirst(rotateFirst) {
		this._rotateFirst = !!rotateFirst;
		this.changed();
	}

	/**
	 * set xLock
	 * @param {Boolean} xLock
	 * @returns {ComponentInstance} - reference to this ComponentInstance
	 */
	set xLock(xLock) {
		this._xLock = !!xLock;
	}

	/**
	 * set yLock
	 * @param {Boolean} yLock
	 * @returns {ComponentInstance} - reference to this ComponentInstance
	 */
	set yLock(yLock) {
		this._yLock = !!yLock;
	}

	/**
	 * set wLock
	 * @param {Boolean} wLock
	 * @returns {ComponentInstance} - reference to this ComponentInstance
	 */
	set wLock(wLock) {
		this._wLock = !!wLock;
	}

	/**
	 * set hLock
	 * @param {Boolean} hLock
	 * @returns {ComponentInstance} - reference to this ComponentInstance
	 */
	set hLock(hLock) {
		this._hLock = !!hLock;
	}

	/**
	 * set ratioLock
	 * @param {Boolean} ratioLock
	 * @returns {ComponentInstance} - reference to this ComponentInstance
	 */
	set ratioLock(ratioLock) {
		this._ratioLock = !!ratioLock;
	}

	// --------------------------------------------------------------
	// Parity methods, shared between Paths and ComponentInstances
	// --------------------------------------------------------------

	/**
	 * updateShapePosition
	 * @param {Number} dx - delta x
	 * @param {Number} dy - delta y
	 */
	updateShapePosition(dx, dy) {
		// log('ComponentInstance.updateShapePosition', 'start');
		// log('passed dx/dy/force: ' + dx + ' / ' + dy + ' / ' + force);
		// log('translate was: ' + this.translateX + ' / ' + this.translateY);
		dx = parseNumber(dx) || 0;
		dy = parseNumber(dy) || 0;
		this.translateX = 1 * this.translateX + dx;
		this.translateY = 1 * this.translateY + dy;
		// log('translate now: ' + this.translateX + ' / ' + this.translateY);
		// log('ComponentInstance.updateShapePosition', 'end');
	}

	/**
	 * updateShapeSize
	 * @param {Object} arg
	 * @param {Number | Boolean =} arg.width - delta width
	 * @param {Number | Boolean =} arg.height - delta height
	 * @param {Boolean =} arg.ratioLock - maintain aspect ratio
	 */
	updateShapeSize({ width = false, height = false, ratioLock = false }) {
		// log('ComponentInstance.updateShapeSize', 'start');
		width = parseNumber(width);
		height = parseNumber(height);
		if (ratioLock) {
			const ts = this.transformedGlyph.maxes;
			const w = ts.xMax - ts.xMin;
			const h = ts.yMax - ts.yMin;
			if (Math.abs(width) > Math.abs(height)) {
				height = width * (h / w);
			} else {
				width = height * (w / h);
			}
		}
		// log('translate was: ' + this.resizeWidth + ' / ' + this.resizeHeight);
		this.resizeWidth = 1 * this.resizeWidth + width;
		this.resizeHeight = 1 * this.resizeHeight + height;
		if (this.rotation === 0) this.rotateFirst = false;
		// log('translate now: ' + this.resizeWidth + ' / ' + this.resizeHeight);
		// log('ComponentInstance.updateShapeSize', 'end');
	}

	/**
	 * flipEW
	 * @param {Number} mid - x value about which to flip
	 * @returns {ComponentInstance} - reference to this component instance
	 */
	flipEW(mid) {
		this.isFlippedEW = !this.isFlippedEW;
		if (mid) {
			const g = this.transformedGlyph.maxes;
			this.translateX += mid - g.xMax + mid - g.xMin;
		}
		if (this.rotation === 0) this.rotateFirst = false;
		return this;
	}

	/**
	 * flipNS
	 * @param {Number} mid - y value about which to flip
	 * @returns {ComponentInstance} - reference to this component instance
	 */
	flipNS(mid) {
		this.isFlippedNS = !this.isFlippedNS;
		if (mid) {
			const g = this.transformedGlyph.maxes;
			this.translateY += mid - g.yMax + mid - g.yMin;
		}
		if (this.rotation === 0) this.rotateFirst = false;
		return this;
	}

	/**
	 * rotate
	 * @param {Number} deltaRadians - how much to rotate (radians)
	 * @returns {ComponentInstance} - reference to this component instance
	 */
	rotate(deltaRadians) {
		// log('ComponentInstance.rotate', 'start');
		// log(`deltaRadians: ${deltaRadians}`);
		const deltaDegrees = deg(deltaRadians) * -1;
		// log(`deltaDegrees: ${deltaDegrees}`);
		// log(`this.rotation WAS: ${this.rotation}`);
		this.rotation = this.rotation + deltaDegrees;
		if (
			this.resizeHeight === 0 &&
			this.resizeWidth === 0 &&
			!this.isFlippedEW &&
			!this.isFlippedNS
		) {
			this.rotateFirst = true;
		}
		// log(`this.rotation NOW: ${this.rotation}`);
		// log('ComponentInstance.rotate', 'end');
		return this;
	}
}
