import { getCurrentProject, getCurrentProjectEditor } from '../../app/main.js';
import { showToast } from '../../controls/dialogs/dialogs.js';
import { ControlPoint } from '../../project_data/control_point.js';
import { Path } from '../../project_data/path.js';
import { PathPoint } from '../../project_data/path_point.js';
import { cXsX, cYsY } from '../edit_canvas.js';
import { eventHandlerData } from '../events.js';
import { addPathToCurrentItem, switchToolTo } from './tools.js';

export class Tool_Handwriting {
	constructor() {
		this.dragging = false;
		this.points = [];
	}

	mousedown() {
		const editor = getCurrentProjectEditor();
		this.dragging = true;
		this.points = [this.currentPoint()];
		eventHandlerData.newBasicPath = false;
		editor.multiSelect.shapes.clear();
	}

	mousemove() {
		if (!this.dragging) return;
		const next = this.currentPoint();
		const last = this.points.at(-1);
		const minimumDistance = Math.max(
			2,
			getCurrentProjectEditor().toolOptions.handwritingWeight / 8
		);
		if (Math.hypot(next.x - last.x, next.y - last.y) < minimumDistance) return;
		this.points.push(next);
		eventHandlerData.newBasicPath = handwritingPathFromPoints(
			this.points,
			getCurrentProjectEditor().toolOptions.handwritingWeight,
			'New handwriting stroke'
		);
		getCurrentProjectEditor().editCanvas.redraw('handwriting:mousemove');
	}

	mouseup() {
		if (!this.dragging) return;
		const editor = getCurrentProjectEditor();
		const path = handwritingPathFromPoints(
			this.points,
			editor.toolOptions.handwritingWeight,
			`Handwriting ${editor.selectedItem.shapes.length + 1}`
		);
		eventHandlerData.newBasicPath = false;
		this.dragging = false;
		this.points = [];
		if (!path) {
			showToast('Handwriting stroke was too short.');
			editor.editCanvas.redraw('handwriting:short-stroke');
			return;
		}
		const addedPath = addPathToCurrentItem(path);
		editor.multiSelect.shapes.select(addedPath);
		editor.history.addState(`Added handwriting stroke: ${addedPath.name}`);
		switchToolTo('handwriting');
		editor.editCanvas.redraw('handwriting:mouseup');
	}

	currentPoint() {
		return {
			x: cXsX(eventHandlerData.mousePosition.x),
			y: cYsY(eventHandlerData.mousePosition.y),
		};
	}
}

/**
 * Smooths a freehand point list with a three-point moving average, which
 * removes the small wobbles ("wavy lines") that come from drawing with a
 * mouse or trackpad. End points are left alone so the stroke keeps its
 * start and finish.
 * @param {Array} points - raw sampled x/y points
 * @param {Number =} passes - how many smoothing passes to run
 * @returns {Array} - smoothed points
 */
export function smoothPointList(points, passes = 2) {
	if (!Array.isArray(points) || points.length < 3) return points;
	let result = points;
	for (let pass = 0; pass < passes; pass++) {
		const next = [result[0]];
		for (let i = 1; i < result.length - 1; i++) {
			next.push({
				x: (result[i - 1].x + result[i].x + result[i + 1].x) / 3,
				y: (result[i - 1].y + result[i].y + result[i + 1].y) / 3,
			});
		}
		next.push(result[result.length - 1]);
		result = next;
	}
	return result;
}

export function handwritingPathFromPoints(points, weight = 40, name = 'Handwriting stroke') {
	if (!Array.isArray(points) || points.length < 2) return false;
	if (getCurrentProject()?.settings?.project?.autoCorrectWavyLines) {
		points = smoothPointList(points);
	}
	const radius = Math.max(1, weight / 2);
	const left = [];
	const right = [];
	points.forEach((point, index) => {
		const previous = points[Math.max(0, index - 1)];
		const next = points[Math.min(points.length - 1, index + 1)];
		const dx = next.x - previous.x;
		const dy = next.y - previous.y;
		const length = Math.hypot(dx, dy) || 1;
		const nx = (-dy / length) * radius;
		const ny = (dx / length) * radius;
		left.push({ x: point.x + nx, y: point.y + ny });
		right.push({ x: point.x - nx, y: point.y - ny });
	});
	const outline = left.concat(right.reverse());
	return new Path({
		name,
		pathPoints: outline.map((point) => new PathPoint({ p: new ControlPoint({ coord: point }) })),
	});
}
