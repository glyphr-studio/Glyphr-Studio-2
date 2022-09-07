// ----------------------------------------------------------------
// New Basic Path - adds many points to a new path
// ----------------------------------------------------------------

import { getCurrentProjectEditor, getCurrentProject } from '../../app/main.js';
import { isVal, round } from '../../common/functions.js';
import { ControlPoint } from '../../project_data/control_point.js';
import { Coord } from '../../project_data/coord.js';
import { Path } from '../../project_data/path.js';
import { PathPoint } from '../../project_data/path_point.js';
import { cXsX, cYsY } from '../canvas-edit.js';
import { eventHandlerData } from '../events_mouse.js';
import { action_addPath } from './tools.js';

export class Tool_NewBasicPath {
	constructor() {
		this.dragging = false;

		this.mousedown = function (ev) {
			log(`Tool_NewBasicPath.mousedown`, 'start');

			eventHandlerData.tempNewBasicPath = {
				xMax: cXsX(eventHandlerData.mouseX),
				xMin: cXsX(eventHandlerData.mouseX),
				yMax: cYsY(eventHandlerData.mouseY),
				yMin: cYsY(eventHandlerData.mouseY),
			};

			// This is the fake path that shows up in the layers panel
			// while dragging is happening
			let newPath = new Path({name: '...' });
			newPath.path.maxes = eventHandlerData.tempNewBasicPath;
			newPath = action_addPath(newPath);
			let editor = getCurrentProjectEditor();
			editor.multiSelect.paths.select(newPath);

			eventHandlerData.firstX = cXsX(eventHandlerData.mouseX);
			eventHandlerData.firstY = cYsY(eventHandlerData.mouseY);

			this.dragging = true;

			editor.editCanvas.redraw({ calledBy: 'Event Handler Tool_NewBasicPath mousedown' });

			log(`Tool_NewBasicPath.mousedown`, 'end');
		};

		this.mousemove = function (ev) {
			// log(`Tool_NewBasicPath.mousemove`, 'start');
			let ehd = eventHandlerData;
			let tnbs = eventHandlerData.tempNewBasicPath;
			if (tnbs) {
				tnbs.xMax = Math.max(ehd.firstX, cXsX(ehd.mouseX));
				tnbs.xMin = Math.min(ehd.firstX, cXsX(ehd.mouseX));
				tnbs.yMax = Math.max(ehd.firstY, cYsY(ehd.mouseY));
				tnbs.yMin = Math.min(ehd.firstY, cYsY(ehd.mouseY));
				// log(`tnbs is now ${JSON.stringify(tnbs)}`);

				let editor = getCurrentProjectEditor();
				// TODO history
				// eventHandlerData.undoQueueHasChanged = true;
				editor.editCanvas.redraw({ calledBy: 'Event Handler Tool_NewBasicPath mousemove' });
			}
			// log(`Tool_NewBasicPath.mousemove`, 'end');
		};

		this.mouseup = function () {
			log(`Tool_NewBasicPath.mouseup`, 'start');

			let tnbs = eventHandlerData.tempNewBasicPath;
			let editor = getCurrentProjectEditor();
			let workItem = editor.selectedWorkItem;
			let ps = editor.project.projectSettings;

			// Only make the new path if it's not really small
			let xSize = Math.abs(tnbs.xMax - tnbs.xMin);
			let ySize = Math.abs(tnbs.yMax - tnbs.yMin);
			log(`xSize: ${xSize}`);
			log(`ySize: ${ySize}`);
			log(`ps.pointSize: ${ps.pointSize}`);

			if (xSize > ps.pointSize && ySize > ps.pointSize) {
				log(`Temp path is large enough`);
				let count = workItem.paths.length;

				if(editor.nav.page === 'components') {
					count = Object.keys(editor.project.components).length;
				}

				// Update the fake ... path with new data
				let s = editor.multiSelect.paths.singleton;

				if (editor.selectedTool === 'newRectangle') {
					log(`making Rectangle path`);

					s.name = 'Rectangle ' + count;
					s.path = rectPathFromMaxes(tnbs);
				} else {
					log(`making Oval path`);

					s.name = 'Oval ' + count;
					s.path = ovalPathFromMaxes(tnbs);
				}

				log('paths before');
				log(workItem.paths);
				let newPath = workItem.addOnePath(s);
				editor.multiSelect.paths.select(newPath);
				log('paths after');
				log(workItem.paths);
				// updateCurrentGlyphWidth();

			} else {
				log(`Dragged path too small`);
				// Remove the fake ... path
				editor.multiSelect.paths.deletePaths();
			}

			eventHandlerData.firstX = -100;
			eventHandlerData.firstY = -100;
			eventHandlerData.tempNewBasicPath = false;
			// TODO history
			// historyPut('New Basic Path tool');
			// eventHandlerData.undoQueueHasChanged = false;

			this.dragging = false;

			// clickTool('pathEdit');
				editor.editCanvas.redraw({ calledBy: 'Event Handler Tool_NewBasicPath mouseup' });
			log(`Tool_NewBasicPath.mouseup`, 'end');
		};
	}
}

export function rectPathFromMaxes(maxes){
	log(`rectPathFromMaxes`, 'start');
	log(JSON.stringify(maxes));
	let ps = getCurrentProject().projectSettings;

	//Default Path size
	let lx = isVal(maxes.xMin)? maxes.xMin : 0;
	let ty = isVal(maxes.yMax)? maxes.yMax : ps.ascent;
	let rx = isVal(maxes.xMax)? maxes.xMax : 100;
	let by = isVal(maxes.yMin)? maxes.yMin : 0;

	log(`lx: ${lx}, ty: ${ty}, rx: ${rx}, by: ${by}`);
	// let qw = round((rx-lx)/4);
	// let qh = round((ty-by)/4);

	// First Point
	let Pul = new ControlPoint({coord:{x:lx, y:ty}});
	log(Pul);
	// let H1ul = new ControlPoint({coord:{x:lx, y:(ty-qh)}});
	// let H2ul = new ControlPoint({coord:{x:(lx+qw), y:ty}});

	// Second Point
	let Pur = new ControlPoint({coord:{x:rx, y:ty}});
	log(Pur);
	// let H1ur = new ControlPoint({coord:{x:(rx-qw), y:ty}});
	// let H2ur = new ControlPoint({coord:{x:rx, y:(ty-qh)}});

	// Third Point
	let Plr = new ControlPoint({coord:{x:rx, y:by}});
	log(Plr);
	// let H1lr = new ControlPoint({coord:{x:rx, y:(by+qh)}});
	// let H2lr = new ControlPoint({coord:{x:(rx-qw), y:by}});

	// Fourth Point
	let Pll = new ControlPoint({coord:{x:lx, y:by}});
	log(Pll);
	// let H1ll = new ControlPoint({coord:{x:(lx+qw), y:by}});
	// let H2ll = new ControlPoint({coord:{x:lx, y:(by+qh)}});

	let newPoints = [];
	// newPoints[0] = new PathPoint({p:Pul, h1:H1ul, h2:H2ul});
	// newPoints[1] = new PathPoint({p:Pur, h1:H1ur, h2:H2ur});
	// newPoints[2] = new PathPoint({p:Plr, h1:H1lr, h2:H2lr});
	// newPoints[3] = new PathPoint({p:Pll, h1:H1ll, h2:H2ll});
	newPoints[0] = new PathPoint({p:Pul});
	newPoints[1] = new PathPoint({p:Pur});
	newPoints[2] = new PathPoint({p:Plr});
	newPoints[3] = new PathPoint({p:Pll});
	log(newPoints);

	let newPath = new Path({pathPoints: newPoints});
	log(newPath.print());
	log(`rectPathFromMaxes`, 'end');

	return newPath;
}

export function ovalPathFromMaxes(maxes = {}){
	let ps = getCurrentProject().projectSettings;

	//Default Circle size
	let lx = isVal(maxes.xMin)? maxes.xMin : 0;
	let ty = isVal(maxes.yMax)? maxes.yMax : ps.xheight || 500;
	let rx = isVal(maxes.xMax)? maxes.xMax : ps.xheight || 500;
	let by = isVal(maxes.yMin)? maxes.yMin : 0;


	let hw = round((rx-lx)/2);
	let hh = round((ty-by)/2);
	let hwd = round(hw*0.448);
	let hhd = round(hh*0.448);

	// First Point - Top
	let Pt = new ControlPoint({coord:{'x':(lx+hw), 'y':ty}});
	let H1t = new ControlPoint({coord:{'x':(lx+hwd), 'y':ty}});
	let H2t = new ControlPoint({coord:{'x':(rx-hwd), 'y':ty}});

	// Second Point - Right
	let Pr = new ControlPoint({coord:{'x':rx, 'y':(by+hh)}});
	let H1r = new ControlPoint({coord:{'x':rx, 'y':(ty-hhd)}});
	let H2r = new ControlPoint({coord:{'x':rx, 'y':(by-hhd)}});

	// Third Point - Bottom
	let Pb = new ControlPoint({coord:{'x':(lx+hw), 'y':by}});
	let H1b = new ControlPoint({coord:{'x':(rx-hwd), 'y':by}});
	let H2b = new ControlPoint({coord:{'x':(lx+hwd), 'y':by}});

	// Fourth Point - Left
	let Pl = new ControlPoint({coord:{'x':lx, 'y':(by+hh)}});
	let H1l = new ControlPoint({coord:{'x':lx, 'y':(by+hhd)}});
	let H2l = new ControlPoint({coord:{'x':lx, 'y':(ty-hhd)}});


	let newPoints = [];
	newPoints[0] = new PathPoint({p:Pt, h1:H1t, h2:H2t, type:'symmetric'});
	newPoints[1] = new PathPoint({p:Pr, h1:H1r, h2:H2r, type:'symmetric'});
	newPoints[2] = new PathPoint({p:Pb, h1:H1b, h2:H2b, type:'symmetric'});
	newPoints[3] = new PathPoint({p:Pl, h1:H1l, h2:H2l, type:'symmetric'});

	return new Path({pathPoints:newPoints});
}
