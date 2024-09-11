import { getTransformData } from '../lib/svg-to-bezier/transforms';

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
		if (!this.cache?.svgCode) this.cache.svgCode = this.generateSVGCode();
		return this.cache.svgCode;
	}
	set translateX(value) {
		if (isNaN(Number(value))) this._translateX = 0;
		else {
			this._translateX = Number(value);
			this.cache = {};
		}
	}

	get translateX() {
		if (!isNaN(Number(this._translateX))) return this._translateX;
		else return 0;
	}

	set translateY(value) {
		if (isNaN(Number(value))) this._translateY = 0;
		else {
			this._translateY = Number(value);
			this.cache = {};
		}
	}

	get translateY() {
		if (!isNaN(Number(this._translateY))) return this._translateY;
		else return 0;
	}

	set scaleX(value) {
		if (isNaN(Number(value))) this._scaleX = 1;
		else {
			this._scaleX = Number(value);
			this.cache = {};
		}
	}

	get scaleX() {
		if (!isNaN(Number(this._scaleX))) return this._scaleX;
		else return 1;
	}

	set scaleY(value) {
		if (isNaN(Number(value))) this._scaleY = 1;
		else {
			this._scaleY = Number(value);
			this.cache = {};
		}
	}

	get scaleY() {
		if (!isNaN(Number(this._scaleY))) return this._scaleY;
		else return 1;
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
			// log(`\n⮟renderCode⮟`);
			// log(renderCode);

			// Make the viewBox arbitrarily big to be able to draw outside
			// the original viewBox.
			renderCode = renderCode.replace(/viewBox/i, 'old-viewBox');
			renderCode = renderCode.replace(
				'<svg ',
				`<svg viewBox="-${this.viewPad / 2} -${this.viewPad / 2} ${this.viewPad} ${this.viewPad}" `
			);

			// log(renderCode);
			// saveTextFile('.svg', renderCode);
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
	get viewPad() {
		return 8000;
	}

	// --------------------------------------------------------------
	// Import and export
	// --------------------------------------------------------------

	/**
	 * In order to enable updating a SVG's position and scale after it is imported,
	 * Glyphr Studio pulls top-level transformation data out of the svg tag.
	 * Internally, this is stored as an object which can be updated by the Project Editor.
	 * When this SVG Color Glyph gets saved back out to a font file, a new top-level g tag
	 * will be created with the Glyphr Studio updates as transforms.
	 *
	 * This function basically sets up all the correct stuff and removes appropriate code
	 * from the provided SVG.
	 *
	 * @param {String} importCode - SVG code to import
	 */
	importSVGCode(importCode) {
		// log(`SVGColorGlyph.importSVGCode`, 'start');
		// log(importCode);
		const svgData = scrapeTransformData(importCode, /<svg/i);
		const gsData = scrapeTransformData(importCode, /<g id="glyphr-studio-transforms"/i);

		/*
			If the font was previously edited and saved with Glyphr Studio, it should
			not have any transforms in the svg tag, only in a top-level g tag that is
			created and maintained by Glyphr Studio.
			But, if for some reason transforms were added to the top level svg tag,
			it supersedes any children, so we have to treat it like brand new svg code.
			This is a very low probably edge case, but if there are both svg and g tag
			transforms, it will be parsed again, and an additional layer of g tag will be
			added to store Glyphr Studio's transforms.
		*/
		let data = gsData;
		if (svgData.parsedTransforms.length) data = svgData;

		// log(data);
		if (data.parsedTransforms.length) {
			data.parsedTransforms.forEach((transform) => {
				if (transform.name === 'translate') {
					importCode = removeTransformByName(
						importCode,
						transform.name,
						data.attributeStart,
						data.attributeEnd
					);
					this.translateX = transform.args[0];
					this.translateY = transform.args[1];
				}

				if (transform.name === 'scale') {
					importCode = removeTransformByName(
						importCode,
						transform.name,
						data.attributeStart,
						data.attributeEnd
					);
					this.scaleX = transform.args[0];
					this.scaleY = transform.args[1];
				}
			});
		}

		importCode = importCode.replaceAll(/ transform=""/gi, '');
		importCode = importCode.replaceAll(/ transform=''/gi, '');
		this.untransformedCode = importCode;
		// log(`SVGColorGlyph.importSVGCode`, 'end');
	}

	generateSVGCode() {
		// log(`SVGColorGlyph.generateSVGCode`, 'start');
		// log(`this.translateX: ${this.translateX}`);
		// log(`this.translateY: ${this.translateY}`);
		// log(`this.scaleX: ${this.scaleX}`);
		// log(`this.scaleY: ${this.scaleY}`);
		let insertions = '';
		if (this.translateX || this.translateY) {
			insertions += `translate(${this.translateX || 0}, ${this.translateY || 0})`;
		}

		if (this.scaleX || this.scaleY) {
			if (!(this.scaleX === 1 && this.scaleY === 1)) {
				insertions += ` scale(${this.scaleX || 1}, ${this.scaleY || 1})`;
			}
		}

		// log(`insertions: ${insertions}`);
		if (insertions) {
			const codeStart = this.untransformedCode.search(/<svg/i);
			const svgTagEnd = this.untransformedCode.indexOf('>', codeStart);

			let resultCode = this.untransformedCode.substring(0, svgTagEnd + 1);
			resultCode += `<g id="glyphr-studio-transforms" transform="${insertions}">`;
			resultCode += this.untransformedCode.substring(svgTagEnd + 1);
			resultCode = resultCode.replace('</svg>', '</g></svg>');

			// log(resultCode);
			// log(`SVGColorGlyph.generateSVGCode`, 'end');
			return resultCode;
		}

		// log(`SVGColorGlyph.generateSVGCode`, 'end');
		return this.untransformedCode;
	}
}

// --------------------------------------------------------------
// Helpers
// --------------------------------------------------------------

/**
 * Scrapes and parses the first transform attribute from SVG code, given
 * a starting point in the code.
 * @param {String} svgCode - code to scrape from
 * @param {RegExp} startAt - regex to search for (hopefully case insensitive)
 * @returns {Object} - with any parsed transform data, and the discovered
 * string index for the start and end of the transform attribute
 */
function scrapeTransformData(svgCode, startAt) {
	const codeStart = svgCode.search(startAt);
	// log(`codeStart: ${codeStart}`);
	const svgTagEnd = svgCode.indexOf('>', codeStart);
	// log(`svgTagEnd: ${svgTagEnd}`);
	const attributeStart = svgCode.search(/ transform=/i);
	// log(`attributeStart: ${attributeStart}`);

	if (attributeStart < svgTagEnd) {
		const quote = svgCode.charAt(attributeStart + 11);
		// log(`quote: ${quote}`);
		const attributeEnd = svgCode.indexOf(quote, attributeStart + 13);
		// log(`attributeEnd: ${attributeEnd}`);
		const content = svgCode.substring(attributeStart + 12, attributeEnd);
		// log(content);

		const parsedTransforms = getTransformData({ attributes: { transform: content } });
		// log(parsedTransforms);

		return { parsedTransforms, attributeStart, attributeEnd };
	}

	return { parsedTransforms: [], attributeStart: -1, attributeEnd: -1 };
}

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
