/**
		Guide
		An object used by the UI for drawing guide
		lines on the edit canvas, and for saving
		custom guides to a Glyphr Studio Project.
**/

export class Guide {
	constructor(oa = {}) {
		// log(`Guide.constructor`, 'start');
		this.objType = 'Guide';
		this.angle = oa.angle === 0 ? 0 : 90;
		this.name = oa.name;
		this.location = !isNaN(parseInt(oa.location)) ? parseInt(oa.location) : 200;
		this.color = oa.color || defaultCustomGuideColor;
		this.visible = !!oa.visible;
		// log(`Guide.constructor`, 'end');
	}

	save() {
		let result = {};

		let n = this.name;
		if (n !== 'Horizontal guide' && n !== 'Vertical guide' && n !== 'Guide') {
			result.name = this.name;
		}
		if (this.angle !== 90) result.angle = this.angle;
		if (this.location !== 200) result.location = this.location;
		if (this.color !== defaultCustomGuideColor) result.color = this.color;
		if (!this.visible) result.visible = this.visible;

		return result;
	}

	get name() {
		if (!this._name) {
			if (this.angle === 90) this._name = 'Horizontal guide';
			else if (this.angle === 0) this._name = 'Vertical guide';
			else this._name = 'Guide';
		}
		return this._name;
	}

	set name(newName) {
		if (!newName) {
			if (this.angle === 90) newName = 'Horizontal guide';
			else if (this.angle === 0) newName = 'Vertical guide';
			else newName = 'Guide';
		}
		this._name = newName;
	}
}

// --------------------------------------------------------------
// Colors
// --------------------------------------------------------------

export const defaultCustomGuideColor = 'rgb(127, 0, 255)';
export const guideColorLight = 'rgb(227, 190, 171)';
export const guideColorMedium = 'rgb(212, 154, 125)';
export const guideColorDark = 'rgb(191, 106, 64)';
