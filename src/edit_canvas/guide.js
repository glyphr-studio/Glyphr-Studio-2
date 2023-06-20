import { getCurrentProjectEditor, getCurrentProject } from '../app/main.js';
import {
	getColorFromRGBA,
	makeRandomSaturatedColor,
	shiftColor,
	transparencyToAlpha,
} from '../common/colors.js';
import { isVal, makeCrisp } from '../common/functions.js';

/**
		Guide
		An object used by the UI for drawing guide
		lines on the edit canvas, and for saving
		custom guides to a Glyphr Studio Project.
**/
export class Guide {
	constructor(oa) {
		this.objType = 'Guide';
		this.type = oa.type || 'vertical';
		this.name = oa.name || this.type + ' guide';
		this.location = isVal(oa.location) ? oa.location : 200;
		this.angle = oa.angle || false;
		this.color = oa.color || makeRandomSaturatedColor();
		this.visible = isVal(oa.visible) ? oa.visible : true;
		this.displayName = isVal(oa.displayName) ? oa.displayName : true;
		this.editable = isVal(oa.editable) ? oa.editable : true;
	}

	draw(delta, ctx) {
		// log('\nGuide.draw', 'start');
		// log('name: ' + this.name);
		// log('delta: ' + delta);
		if (!this.visible) return;
		delta = delta * 1;
		let canvasSize = 1000;
		let psc = getCurrentProject().projectSettings.colors;
		const editor = getCurrentProjectEditor();
		let v = editor.view;
		let start = { x: 0, y: 0 };
		let end = { x: 0, y: 0 };
		let label = { x: 0, y: 0 };
		let pad = 5;
		let pos;
		// log('view: ' + JSON.stringify(v));
		// log('location: ' + this.location);
		if (this.type === 'horizontal') {
			pos = makeCrisp(v.dy - this.location * v.dz);
			if (delta) pos += delta * v.dz;
			start.x = 0;
			start.y = pos;
			end.x = canvasSize;
			end.y = pos;
			label.x = 25;
			label.y = pos - pad;
		} else if (this.type === 'vertical') {
			pos = makeCrisp(v.dx - this.location * v.dz * -1);
			if (delta) pos += delta * v.dz;
			start.x = pos;
			start.y = 0;
			end.x = pos;
			end.y = canvasSize;
			label.x = pos + pad;
			label.y = 11;
		}

		let alpha = transparencyToAlpha(
			this.editable ? psc.customGuideTransparency : psc.systemGuideTransparency
		);
		let color = getColorFromRGBA(this.color, alpha);
		if (color !== 'rgb(255,255,255)') {
			// Draw Line
			// log('start: ' + JSON.stringify(start) + ' / end: ' + JSON.stringify(end));
			ctx.strokeStyle = color;
			ctx.globalAlpha = 1;
			ctx.lineWidth = 1;
			if (isVal(delta)) ctx.strokeStyle = shiftColor(color, 0.6, true);
			ctx.beginPath();
			ctx.moveTo(start.x, start.y);
			ctx.lineTo(end.x, end.y);
			ctx.stroke();
			ctx.closePath();
			// Draw Label
			if (this.displayName && getCurrentProject().settings.app.showGuidesLabels && !delta) {
				ctx.fillStyle = color;
				ctx.font = '10px Tahoma, Verdana, sans-serif';
				ctx.fillText(this.name, label.x, label.y);
			}
		}
		// log('Guide.draw', 'end');
	}
}
