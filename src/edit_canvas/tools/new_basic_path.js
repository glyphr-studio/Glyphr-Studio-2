// ----------------------------------------------------------------
// New Basic Path - adds many points to a new path
// ----------------------------------------------------------------

import { getCurrentProjectEditor, getCurrentProject } from '../../app/main.js';
import { isVal, round } from '../../common/functions.js';
import { ControlPoint } from '../../project_data/control_point.js';
import { Path } from '../../project_data/path.js';
import { PathPoint } from '../../project_data/path_point.js';
import { canvasUIPointSize } from '../draw_edit_affordances.js';
import { cXsX, cYsY } from '../edit_canvas.js';
import { eventHandlerData } from '../events.js';
import { addPathToCurrentItem, switchToolTo } from './tools.js';

export class Tool_NewBasicPath {
	constructor() {
		this.dragging = false;

		this.mousedown = function (ev) {
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
			if (editor.selectedTool === 'newOval') {
				// log(`making Oval path`);
				ehd.newBasicPath = ovalPathFromMaxes(ehd.newBasicPathMaxes, `New oval`);
			} else {
				// log(`making Rectangle path`);
				ehd.newBasicPath = rectPathFromMaxes(ehd.newBasicPathMaxes, `New rectangle`);
			}

			this.dragging = true;
			ehd.firstX = cXsX(ehd.mousePosition.x);
			ehd.firstY = cYsY(ehd.mousePosition.y);
			// log(`ehd.firstX: ${ehd.firstX}`);
			// log(`ehd.firstY: ${ehd.firstY}`);

			editor.multiSelect.paths.clear();

			editor.editCanvas.redraw({ calledBy: 'Event Handler Tool_NewBasicPath mousedown' });

			// log(`Tool_NewBasicPath.mousedown`, 'end');
		};

		this.mousemove = function (ev) {
			// log(`Tool_NewBasicPath.mousemove`, 'start');
			const editor = getCurrentProjectEditor();
			const ehd = eventHandlerData;
			// log(`EHFirst: x ${(ehd.firstX)}, y ${(ehd.firstY)}`);
			// log(`Mouse:   x ${cXsX(ehd.mousePosition.x)}, y ${cYsY(ehd.mousePosition.y)}`);
			// log(`ehd.newBasicPathMaxes before ${JSON.stringify(ehd.newBasicPathMaxes)}`);
			if (ehd.newBasicPathMaxes) {
				ehd.newBasicPathMaxes.xMax = Math.max(ehd.firstX, cXsX(ehd.mousePosition.x));
				ehd.newBasicPathMaxes.xMin = Math.min(ehd.firstX, cXsX(ehd.mousePosition.x));
				ehd.newBasicPathMaxes.yMax = Math.max(ehd.firstY, cYsY(ehd.mousePosition.y));
				ehd.newBasicPathMaxes.yMin = Math.min(ehd.firstY, cYsY(ehd.mousePosition.y));
				// log(`ehd.newBasicPathMaxes afters ${JSON.stringify(ehd.newBasicPathMaxes)}`);

				if (editor.selectedTool === 'newOval') {
					// log(`making Oval path`);
					ehd.newBasicPath = ovalPathFromMaxes(ehd.newBasicPathMaxes, `New oval`);
				} else {
					// log(`making Rectangle path`);
					ehd.newBasicPath = rectPathFromMaxes(ehd.newBasicPathMaxes, `New rectangle`);
				}

				ehd.undoQueueHasChanged = true;
				editor.publish('currentPath', ehd.newBasicPath);
				editor.editCanvas.redraw({ calledBy: 'Event Handler Tool_NewBasicPath mousemove' });
			}
			// log(`Tool_NewBasicPath.mousemove`, 'end');
		};

		this.mouseup = function () {
			// log(`Tool_NewBasicPath.mouseup`, 'start');
			const editor = getCurrentProjectEditor();
			const ehd = eventHandlerData;
			let workItem = editor.selectedItem;

			// Only make the new path if it's not really small
			let xSize = Math.abs(ehd.newBasicPathMaxes.xMax - ehd.newBasicPathMaxes.xMin);
			let ySize = Math.abs(ehd.newBasicPathMaxes.yMax - ehd.newBasicPathMaxes.yMin);
			// log(`xSize: ${xSize}`);
			// log(`ySize: ${ySize}`);

			let path;
			if (xSize > canvasUIPointSize && ySize > canvasUIPointSize) {
				// log(`New path is large enough`);
				let count = workItem.paths.length;

				if (editor.nav.page === 'components') {
					count = Object.keys(editor.project.components).length;
				}

				// Update the fake ... path with new data
				if (editor.selectedTool === 'newOval') {
					// log(`making Oval path`);
					path = ovalPathFromMaxes(ehd.newBasicPathMaxes, `Oval ${count}`);
				} else {
					// log(`making Rectangle path`);
					path = rectPathFromMaxes(ehd.newBasicPathMaxes, `Rectangle ${count}`);
				}

				ehd.newBasicPathMaxes = false;
				ehd.newBasicPath = false;
				path = addPathToCurrentItem(path);
				editor.multiSelect.paths.select(path);
				switchToolTo('resize');
			} else {
				// log(`New path too small`);
				ehd.newBasicPathMaxes = false;
				ehd.newBasicPath = false;
			}

			this.dragging = false;
			ehd.firstX = -100;
			ehd.firstY = -100;

			if (ehd.undoQueueHasChanged) {
				editor.history.addState(`Added path: ${path.name}`);
				ehd.undoQueueHasChanged = false;
			}

			// clickTool('pathEdit');
			editor.editCanvas.redraw({ calledBy: 'Event Handler Tool_NewBasicPath mouseup' });
			// log(`Tool_NewBasicPath.mouseup`, 'end');
		};
	}
}

export function rectPathFromMaxes(maxes = {}, name = 'Rectangle') {
	// log(`rectPathFromMaxes`, 'start');
	// log(JSON.stringify(maxes));
	let fmd = getCurrentProject().metadata.font;

	//Default Path size
	let lx = isVal(maxes.xMin) ? maxes.xMin : 0;
	let ty = isVal(maxes.yMax) ? maxes.yMax : fmd.ascent;
	let rx = isVal(maxes.xMax) ? maxes.xMax : 100;
	let by = isVal(maxes.yMin) ? maxes.yMin : 0;

	// log(`lx: ${lx}, ty: ${ty}, rx: ${rx}, by: ${by}`);
	// let qw = round((rx-lx)/4);
	// let qh = round((ty-by)/4);

	// First Point
	let Pul = new ControlPoint({ coord: { x: lx, y: ty } });
	// log(Pul);
	// let H1ul = new ControlPoint({coord:{x:lx, y:(ty-qh)}});
	// let H2ul = new ControlPoint({coord:{x:(lx+qw), y:ty}});

	// Second Point
	let Pur = new ControlPoint({ coord: { x: rx, y: ty } });
	// log(Pur);
	// let H1ur = new ControlPoint({coord:{x:(rx-qw), y:ty}});
	// let H2ur = new ControlPoint({coord:{x:rx, y:(ty-qh)}});

	// Third Point
	let Plr = new ControlPoint({ coord: { x: rx, y: by } });
	// log(Plr);
	// let H1lr = new ControlPoint({coord:{x:rx, y:(by+qh)}});
	// let H2lr = new ControlPoint({coord:{x:(rx-qw), y:by}});

	// Fourth Point
	let Pll = new ControlPoint({ coord: { x: lx, y: by } });
	// log(Pll);
	// let H1ll = new ControlPoint({coord:{x:(lx+qw), y:by}});
	// let H2ll = new ControlPoint({coord:{x:lx, y:(by+qh)}});

	let newPoints = [];
	// newPoints[0] = new PathPoint({p:Pul, h1:H1ul, h2:H2ul});
	// newPoints[1] = new PathPoint({p:Pur, h1:H1ur, h2:H2ur});
	// newPoints[2] = new PathPoint({p:Plr, h1:H1lr, h2:H2lr});
	// newPoints[3] = new PathPoint({p:Pll, h1:H1ll, h2:H2ll});
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

export function ovalPathFromMaxes(maxes = {}, name = 'Oval') {
	let fmd = getCurrentProject().metadata.font;

	//Default Circle size
	let lx = isVal(maxes.xMin) ? maxes.xMin : 0;
	let ty = isVal(maxes.yMax) ? maxes.yMax : fmd.xHeight || 500;
	let rx = isVal(maxes.xMax) ? maxes.xMax : fmd.xHeight || 500;
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
	let H2r = new ControlPoint({ coord: { x: rx, y: by - hhd } });

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
