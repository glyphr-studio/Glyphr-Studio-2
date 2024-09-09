import { getTransformData } from '../lib/svg-to-bezier/transforms.js';

export class SVGColorGlyph {
	/**
	 * Create an SVG Color Glyph
	 * @param {String} svgCode - svg code
	 */
	constructor(svgCode) {
		this.cache = {};
		this.untransformedCode = '';
		this.importSVGCode(svgCode);
	}

	get svgCode() {
		if(!this.cache?.svgCode) this.cache.svgCode = this.generateSVGCode();
		return this.cache.svgCode;
	}
	set translateX(value) {
		if (isNaN(Number(value))) this._translateX = 0;
		else this._translateX = Number(value);
	}

	get translateX() {
		return this._translateX;
	}

	set translateY(value) {
		if (isNaN(Number(value))) this._translateY = 0;
		else this._translateY = Number(value);
	}

	get translateY() {
		return this._translateY;
	}

	set scaleX(value) {
		if (isNaN(Number(value))) this._scaleX = 1;
		else this._scaleX = Number(value);
	}

	get scaleX() {
		return this._scaleX;
	}

	set scaleY(value) {
		if (isNaN(Number(value))) this._scaleY = 1;
		else this._scaleY = Number(value);
	}

	get scaleY() {
		return this._scaleY;
	}

	// --------------------------------------------------------------
	// Making an IMG element
	// --------------------------------------------------------------

	/**
	 * Returns an HTML Image object for this glyph, based on the
	 * OpenType SVG data (if there is any).
	 * @return {HTMLImageElement} The image for the glyph.
	 */
	get img() {
		// log(`SVGColorGlyph.img`, 'start');
		if (!this?.cache?.img) {
			this.cache.img = this.makeImgElement();
		}
		// log(this.cache.img);
		// log(`SVGColorGlyph.img`, 'end');
		return this.cache.img;
	}

	/**
	 * Generates an HTML Image object for this glyph, based on the OpenType SVG data.
	 * @return {HTMLImageElement} The image for the glyph.
	 */
	makeImgElement() {
		// log(`Glyph.makeImgElement`, 'start');
		const img = new Image();
		let renderCode = this.svgCode;
		if (renderCode) {
			// log(`\n⮟svgCode⮟`);
			// log(svgCode);

			// Make the viewBox arbitrarily big to be able to draw outside
			// the original viewBox. This scalar is also used in DisplayCanvas.drawPaths
			renderCode = renderCode.replace(/viewBox/i, 'old-viewBox');
			renderCode = renderCode.replace(
				'<svg ',
				`<svg viewBox="-${this.scalar / 2} -${this.scalar / 2} ${this.scalar} ${this.scalar}" `
			);

			// log(renderCode);
			img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(renderCode);
		}
		// log(`Glyph.makeImgElement`, 'end');
		return img;
	}

	/**
	 * This is just an arbitrarily large number used as a buffer for
	 * generating and drawing an SVG Image with a viewBox that should
	 * be big enough to show all the shapes.
	 */
	get scalar() {
		return 8000;
	}

	// --------------------------------------------------------------
	// Import and export
	// --------------------------------------------------------------

	/**
	 * Takes SVG Code, and works with the `transform` attribute
	 * from the top level <svg> tag.
	 * @param {String} importCode - SVG code to extract transforms from
	 */
	importSVGCode(importCode) {
		// log(`SVGColorGlyph.importSVGCode`, 'start');
		const codeStart = importCode.search(/<svg/i);
		// log(`codeStart: ${codeStart}`);
		const svgTagEnd = importCode.indexOf('>', codeStart);
		// log(`svgTagEnd: ${svgTagEnd}`);
		const attributeStart = importCode.search(/ transform=/i);
		// log(`attributeStart: ${attributeStart}`);

		if (attributeStart < svgTagEnd) {
			const quote = importCode.charAt(attributeStart + 11);
			// log(`quote: ${quote}`);
			const attributeEnd = importCode.indexOf(quote, attributeStart + 13);
			// log(`attributeEnd: ${attributeEnd}`);
			const content = importCode.substring(attributeStart + 12, attributeEnd);
			// log(content);

			const parsedTransforms = getTransformData({ attributes: { transform: content } });
			// log(parsedTransforms);

			parsedTransforms.forEach((transform) => {
				if (transform.name === 'translate') {
					importCode = removeTransformByName(importCode, transform.name, attributeStart, attributeEnd);
					this.translateX = transform.args[0];
					this.translateY = transform.args[1];
				}

				if (transform.name === 'scale') {
					importCode = removeTransformByName(importCode, transform.name, attributeStart, attributeEnd);
					this.scaleX = transform.args[0];
					this.scaleY = transform.args[1];
				}
			});

			this.untransformedCode = importCode;
		} else {
			// Add a blank top level Transform attribute
			this.untransformedCode = importCode.substring(0, codeStart + 4);
			this.untransformedCode += ' transform=""';
			this.untransformedCode += importCode.substring(codeStart + 4);
		}
		// log(`SVGColorGlyph.importSVGCode`, 'end');
	}

	generateSVGCode() {
		let insertions = '';
		if (this.translateX || this.translateY) {
			insertions += `translate(${this.translateX || 0}, ${this.translateY || 0})`;
		}

		if (this.scaleX || this.scaleY) {
			insertions += `scale(${this.scaleX || 1}, ${this.scaleY || 1})`;
		}

		if (insertions) {
			const codeStart = this.untransformedCode.search(/<svg/i);
			// log(`codeStart: ${codeStart}`);
			const svgTagEnd = this.untransformedCode.indexOf('>', codeStart);
			// log(`svgTagEnd: ${svgTagEnd}`);
			let attributeStart = this.untransformedCode.search(/ transform=/i);
			// log(`attributeStart: ${attributeStart}`);

			let resultCode = this.untransformedCode.substring(0, attributeStart + 12);
			resultCode += insertions + ' ';
			resultCode += this.untransformedCode.substring(attributeStart + 12);

			return resultCode;
		}

		return this.untransformedCode;
	}
}

// --------------------------------------------------------------
// Helpers
// --------------------------------------------------------------

/**
 * Given a name of a transform, removes it from the SVG Code
 * within a certain range.
 * @param {String} svgCode - SVG Code to remove transform from
 * @param {String} transform - name of the transform to remove
 * @param {Number} start - start of valid range
 * @param {Number} end - end of valid range
 * @returns {String} - SVG Code with transform removed
 */
function removeTransformByName(svgCode, transform, start, end) {
	const transformStart = svgCode.indexOf(transform, start);
	// log(`transformStart: ${transformStart}`);

	if (transformStart < end) {
		const transformEnd = svgCode.indexOf(')', transformStart);
		// log(`transformEnd: ${transformEnd}`);
		svgCode = svgCode.substring(0, transformStart) + svgCode.substring(transformEnd + 1);
	}
	return svgCode;
}