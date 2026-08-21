import { getCurrentProject, getCurrentProjectEditor } from '../../app/main.js';
import { isVal, round } from '../../common/functions.js';
import { showToast } from '../../controls/dialogs/dialogs.js';
import { ControlPoint } from '../../project_data/control_point.js';
import { Maxes, isMaxes } from '../../project_data/maxes.js';
import { Path } from '../../project_data/path.js';
import { PathPoint } from '../../project_data/path_point.js';
import { canvasUIPointSize } from '../draw_edit_affordances.js';
import { cXsX, cYsY } from '../edit_canvas.js';
import { eventHandlerData } from '../events.js';
import { addPathToCurrentItem, switchToolTo } from './tools.js';

/**
 * Tools that produce a curved outline rather than a rectangle.
 * @param {String} tool - selected tool name
 * @returns {Boolean}
 */
export function isRoundTool(tool) {
	return tool === 'newOval' || tool === 'newCircle';
}

/**
 * Display name for the shape a tool creates.
 * @param {String} tool - selected tool name
 * @returns {String}
 */
export function newBasicPathName(tool) {
	if (tool === 'newCircle') return 'Circle';
	if (tool === 'newOval') return 'Oval';
	return 'Rectangle';
}

/**
 * The circle tool is the oval tool with its bounds forced square, so a
 * drag always produces a true circle. Squares off around the drag
 * origin, using the larger of the two drag dimensions.
 * @param {Object} maxes - bounds being dragged out
 * @param {Number} firstX - x the drag started at
 * @param {Number} firstY - y the drag started at
 */
function constrainMaxesToSquare(maxes, firstX, firstY) {
	const size = Math.max(maxes.xMax - maxes.xMin, maxes.yMax - maxes.yMin);
	if (maxes.xMin === firstX) maxes.xMax = firstX + size;
	else maxes.xMin = firstX - size;
	if (maxes.yMin === firstY) maxes.yMax = firstY + size;
	else maxes.yMin = firstY - size;
}

/**
	// ----------------------------------------------------------------
	// New Basic Path - adds many points to a new path
	// ----------------------------------------------------------------
 */
export class Tool_NewBasicPath {
	constructor() {
		this.dragging = false;
	}
	makePaths(maxes, name) {
		const editor = getCurrentProjectEditor();
		const radius = editor.toolOptions.borderRadius;
		const weight = editor.toolOptions.shapeWeight;
		const makePath = isRoundTool(editor.selectedTool) ? ovalPathFromMaxes : rectPathFromMaxes;
		const outer = makePath(maxes, name, radius);
		if (!weight) return [outer];

		const inset = Math.min(weight, (maxes.xMax - maxes.xMin) / 2, (maxes.yMax - maxes.yMin) / 2);
		const innerMaxes = {
			xMin: maxes.xMin + inset,
			xMax: maxes.xMax - inset,
			yMin: maxes.yMin + inset,
			yMax: maxes.yMax - inset,
		};
		if (innerMaxes.xMin >= innerMaxes.xMax || innerMaxes.yMin >= innerMaxes.yMax) return [outer];
		const inner = makePath(innerMaxes, `${name} cutout`, Math.max(0, radius - inset));
		inner.reverseWinding();
		return [outer, inner];
	}
	mousedown() {
		// log(`Tool_NewBasicPath.mousedown`, 'start');
		const editor = getCurrentProjectEditor();
		const ehd = eventHandlerData;
		ehd.newBasicPathMaxes = {
			xMax: cXsX(ehd.mousePosition.x),
			xMin: cXsX(ehd.mousePosition.x),
			yMax: cYsY(ehd.mousePosition.y),
			yMin: cYsY(ehd.mousePosition.y),
		};

		// This is the fake path that shows up in the layers panel
		// while dragging is happening
		ehd.newBasicPath = this.makePaths(
			ehd.newBasicPathMaxes,
			newBasicPathName(editor.selectedTool)
		)[0];

		this.dragging = true;
		ehd.firstX = cXsX(ehd.mousePosition.x);
		ehd.firstY = cYsY(ehd.mousePosition.y);
		// log(`ehd.firstX: ${ehd.firstX}`);
		// log(`ehd.firstY: ${ehd.firstY}`);

		editor.multiSelect.shapes.clear();

		editor.editCanvas.redraw('newBasicPath:mousedown');

		// log(`Tool_NewBasicPath.mousedown`, 'end');
	}

	mousemove() {
		// log(`Tool_NewBasicPath.mousemove`, 'start');
		const editor = getCurrentProjectEditor();
		const ehd = eventHandlerData;
		// log(`EHFirst: x ${(ehd.firstX)}, y ${(ehd.firstY)}`);
		// log(`Mouse:   x ${cXsX(ehd.mousePosition.x)}, y ${cYsY(ehd.mousePosition.y)}`);
		// log(`ehd.newBasicPathMaxes before ${JSON.stringify(ehd.newBasicPathMaxes)}`);
		if (isMaxes(ehd.newBasicPathMaxes)) {
			ehd.newBasicPathMaxes.xMax = Math.max(ehd.firstX, cXsX(ehd.mousePosition.x));
			ehd.newBasicPathMaxes.xMin = Math.min(ehd.firstX, cXsX(ehd.mousePosition.x));
			ehd.newBasicPathMaxes.yMax = Math.max(ehd.firstY, cYsY(ehd.mousePosition.y));
			ehd.newBasicPathMaxes.yMin = Math.min(ehd.firstY, cYsY(ehd.mousePosition.y));
			if (editor.selectedTool === 'newCircle') {
				constrainMaxesToSquare(ehd.newBasicPathMaxes, ehd.firstX, ehd.firstY);
			}
			// log(`ehd.newBasicPathMaxes afters ${JSON.stringify(ehd.newBasicPathMaxes)}`);

			ehd.newBasicPath = this.makePaths(
				ehd.newBasicPathMaxes,
				newBasicPathName(editor.selectedTool)
			)[0];

			ehd.undoQueueHasChanged = true;
			editor.publish('currentPath', ehd.newBasicPath);
			editor.editCanvas.redraw('newBasicPath:mousemove');
		}
		// log(`Tool_NewBasicPath.mousemove`, 'end');
	}

	mouseup() {
		// log(`Tool_NewBasicPath.mouseup`, 'start');
		const editor = getCurrentProjectEditor();
		const ehd = eventHandlerData;

		// Only make the new path if it's not really small
		let xSize = Math.abs(ehd.newBasicPathMaxes.xMax - ehd.newBasicPathMaxes.xMin);
		let ySize = Math.abs(ehd.newBasicPathMaxes.yMax - ehd.newBasicPathMaxes.yMin);
		// log(`xSize: ${xSize}`);
		// log(`ySize: ${ySize}`);

		let path;
		if (xSize > canvasUIPointSize && ySize > canvasUIPointSize) {
			// log(`New path is large enough`);
			let count = editor.selectedItem.shapes.length;

			if (editor.nav.page === 'components') {
				count = Object.keys(editor.project.components).length;
			}

			// Update the fake ... path with new data
			const paths = this.makePaths(
				ehd.newBasicPathMaxes,
				`${newBasicPathName(editor.selectedTool)} ${count}`
			);

			ehd.newBasicPathMaxes = false;
			ehd.newBasicPath = false;
			const addedPaths = paths.map((newPath) => addPathToCurrentItem(newPath));
			path = addedPaths[0];
			// log(`\n⮟Added path⮟`);
			// log(path);
			editor.multiSelect.shapes.select(path);
			addedPaths.slice(1).forEach((addedPath) => editor.multiSelect.shapes.add(addedPath));
			switchToolTo('resize');
		} else {
			// log(`New path too small`);
			ehd.newBasicPathMaxes = false;
			ehd.newBasicPath = false;
			ehd.undoQueueHasChanged = false;
			showToast('New shape was too small.');
		}

		this.dragging = false;
		ehd.firstX = -100;
		ehd.firstY = -100;

		if (ehd.undoQueueHasChanged) {
			editor.history.addState(`Added path: ${path.name}`);
			ehd.undoQueueHasChanged = false;
		}

		// selectTool('pathEdit');
		editor.editCanvas.redraw('newBasicPath:mouseup');
		// log(`Tool_NewBasicPath.mouseup`, 'end');
	}
}

/**
 * Makes a rectangular path from a Maxes object
 * @param {Maxes | Object} maxes - bound object to make the rectangle from
 * @param {String} name
 * @returns {Path}
 */
export function rectPathFromMaxes(maxes = {}, name = 'Rectangle', borderRadius = 0) {
	// log(`rectPathFromMaxes`, 'start');
	// log(JSON.stringify(maxes));
	let fontSettings = getCurrentProject().settings.font;

	//Default Path size
	let lx = isVal(maxes.xMin) ? maxes.xMin : 0;
	let ty = isVal(maxes.yMax) ? maxes.yMax : fontSettings.ascent;
	let rx = isVal(maxes.xMax) ? maxes.xMax : 100;
	let by = isVal(maxes.yMin) ? maxes.yMin : 0;

	// log(`lx: ${lx}, ty: ${ty}, rx: ${rx}, by: ${by}`);

	const radius = Math.max(0, Math.min(borderRadius, (rx - lx) / 2, (ty - by) / 2));
	if (radius) return roundedRectPath(lx, ty, rx, by, radius, name);

	// First Point
	let Pul = new ControlPoint({ coord: { x: lx, y: ty } });
	// log(Pul);

	// Second Point
	let Pur = new ControlPoint({ coord: { x: rx, y: ty } });
	// log(Pur);

	// Third Point
	let Plr = new ControlPoint({ coord: { x: rx, y: by } });
	// log(Plr);

	// Fourth Point
	let Pll = new ControlPoint({ coord: { x: lx, y: by } });
	// log(Pll);

	let newPoints = [];
	newPoints[0] = new PathPoint({ p: Pul });
	newPoints[1] = new PathPoint({ p: Pur });
	newPoints[2] = new PathPoint({ p: Plr });
	newPoints[3] = new PathPoint({ p: Pll });
	// log(newPoints);

	let newPath = new Path({ name: name, pathPoints: newPoints });
	// log(newPath);
	// log(`rectPathFromMaxes`, 'end');

	return newPath;
}

function roundedRectPath(lx, ty, rx, by, radius, name) {
	const k = radius * 0.5522847498;
	const point = (x, y, h1, h2) =>
		new PathPoint({
			p: new ControlPoint({ coord: { x, y } }),
			h1: h1
				? new ControlPoint({ coord: { x: h1[0], y: h1[1] } })
				: new ControlPoint({ use: false }),
			h2: h2
				? new ControlPoint({ coord: { x: h2[0], y: h2[1] } })
				: new ControlPoint({ use: false }),
		});
	const points = [
		point(lx + radius, ty, [lx + radius - k, ty]),
		point(rx - radius, ty, false, [rx - radius + k, ty]),
		point(rx, ty - radius, [rx, ty - radius + k]),
		point(rx, by + radius, false, [rx, by + radius - k]),
		point(rx - radius, by, [rx - radius + k, by]),
		point(lx + radius, by, false, [lx + radius - k, by]),
		point(lx, by + radius, [lx, by + radius - k]),
		point(lx, ty - radius, false, [lx, ty - radius + k]),
	];
	return new Path({ name, pathPoints: points });
}

/**
 * Makes an oval path from a Maxes object
 * @param {Maxes | Object} maxes - bound object to make the rectangle from
 * @param {String} name
 * @returns {Path}
 */
export function ovalPathFromMaxes(maxes, name = 'Oval') {
	let fontSettings = getCurrentProject().settings.font;

	//Default Circle size
	let lx = isVal(maxes.xMin) ? maxes.xMin : 0;
	let ty = isVal(maxes.yMax) ? maxes.yMax : fontSettings.xHeight || 500;
	let rx = isVal(maxes.xMax) ? maxes.xMax : fontSettings.xHeight || 500;
	let by = isVal(maxes.yMin) ? maxes.yMin : 0;

	let hw = round((rx - lx) / 2);
	let hh = round((ty - by) / 2);
	let hwd = round(hw * 0.448);
	let hhd = round(hh * 0.448);

	// First Point - Top
	let Pt = new ControlPoint({ coord: { x: lx + hw, y: ty } });
	let H1t = new ControlPoint({ coord: { x: lx + hwd, y: ty } });
	let H2t = new ControlPoint({ coord: { x: rx - hwd, y: ty } });

	// Second Point - Right
	let Pr = new ControlPoint({ coord: { x: rx, y: by + hh } });
	let H1r = new ControlPoint({ coord: { x: rx, y: ty - hhd } });
	let H2r = new ControlPoint({ coord: { x: rx, y: by + hhd } });

	// Third Point - Bottom
	let Pb = new ControlPoint({ coord: { x: lx + hw, y: by } });
	let H1b = new ControlPoint({ coord: { x: rx - hwd, y: by } });
	let H2b = new ControlPoint({ coord: { x: lx + hwd, y: by } });

	// Fourth Point - Left
	let Pl = new ControlPoint({ coord: { x: lx, y: by + hh } });
	let H1l = new ControlPoint({ coord: { x: lx, y: by + hhd } });
	let H2l = new ControlPoint({ coord: { x: lx, y: ty - hhd } });

	let newPoints = [];
	newPoints[0] = new PathPoint({ p: Pt, h1: H1t, h2: H2t, type: 'symmetric' });
	newPoints[1] = new PathPoint({ p: Pr, h1: H1r, h2: H2r, type: 'symmetric' });
	newPoints[2] = new PathPoint({ p: Pb, h1: H1b, h2: H2b, type: 'symmetric' });
	newPoints[3] = new PathPoint({ p: Pl, h1: H1l, h2: H2l, type: 'symmetric' });

	return new Path({ name: name, pathPoints: newPoints });
}
