// ----------------------------------------------------------------
// New Basic Shape - adds many points to a new path
// ----------------------------------------------------------------

import { getCurrentProjectEditor, getCurrentProject } from '../../app/main.js';
import { isVal, round } from '../../common/functions.js';
import { ControlPoint } from '../../project_data/control_point.js';
import { Coord } from '../../project_data/coord.js';
import { Path } from '../../project_data/path.js';
import { PathPoint } from '../../project_data/path_point.js';
import { Shape } from '../../project_data/shape.js';
import { cXsX, cYsY } from '../canvas-edit.js';
import { eventHandlerData } from '../events_mouse.js';
import { action_addShape } from './tools.js';

export class Tool_NewBasicShape {
	constructor() {
		this.dragging = false;

		this.mousedown = function (ev) {
			log(`Tool_NewBasicShape.mousedown`, 'start');

			eventHandlerData.tempNewBasicShape = {
				xMax: cXsX(eventHandlerData.mouseX),
				xMin: cXsX(eventHandlerData.mouseX),
				yMax: cYsY(eventHandlerData.mouseY),
				yMin: cYsY(eventHandlerData.mouseY),
			};

			// This is the fake shape that shows up in the layers panel
			// while dragging is happening
			let newShape = new Shape({name: '...' });
			newShape.path.maxes = eventHandlerData.tempNewBasicShape;
			newShape = action_addShape(newShape);
			let editor = getCurrentProjectEditor();
			editor.multiSelect.shapes.select(newShape);

			eventHandlerData.firstX = cXsX(eventHandlerData.mouseX);
			eventHandlerData.firstY = cYsY(eventHandlerData.mouseY);

			this.dragging = true;

			editor.editCanvas.redraw({ calledBy: 'Event Handler Tool_NewBasicShape mousedown' });

			log(`Tool_NewBasicShape.mousedown`, 'end');
		};

		this.mousemove = function (ev) {
			// log(`Tool_NewBasicShape.mousemove`, 'start');
			let ehd = eventHandlerData;
			let tnbs = eventHandlerData.tempNewBasicShape;
			if (tnbs) {
				tnbs.xMax = Math.max(ehd.firstX, cXsX(ehd.mouseX));
				tnbs.xMin = Math.min(ehd.firstX, cXsX(ehd.mouseX));
				tnbs.yMax = Math.max(ehd.firstY, cYsY(ehd.mouseY));
				tnbs.yMin = Math.min(ehd.firstY, cYsY(ehd.mouseY));
				// log(`tnbs is now ${JSON.stringify(tnbs)}`);

				let editor = getCurrentProjectEditor();
				// TODO history
				// eventHandlerData.undoQueueHasChanged = true;
				editor.editCanvas.redraw({ calledBy: 'Event Handler Tool_NewBasicShape mousemove' });
			}
			// log(`Tool_NewBasicShape.mousemove`, 'end');
		};

		this.mouseup = function () {
			log(`Tool_NewBasicShape.mouseup`, 'start');

			let tnbs = eventHandlerData.tempNewBasicShape;
			let editor = getCurrentProjectEditor();
			let workItem = editor.selectedWorkItem;
			let ps = editor.project.projectSettings;

			// Only make the new shape if it's not really small
			let xSize = Math.abs(tnbs.xMax - tnbs.xMin);
			let ySize = Math.abs(tnbs.yMax - tnbs.yMin);
			log(`xSize: ${xSize}`);
			log(`ySize: ${ySize}`);
			log(`ps.pointSize: ${ps.pointSize}`);

			if (xSize > ps.pointSize && ySize > ps.pointSize) {
				log(`Temp shape is large enough`);
				let count = workItem.shapes.length;

				if(editor.nav.page === 'components') {
					count = Object.keys(editor.project.components).length;
				}

				// Update the fake ... shape with new data
				let s = editor.multiSelect.shapes.singleton;

				if (editor.selectedTool === 'newRectangle') {
					log(`making Rectangle shape`);

					s.name = 'Rectangle ' + count;
					s.path = rectPathFromMaxes(tnbs);
				} else {
					log(`making Oval shape`);

					s.name = 'Oval ' + count;
					s.path = ovalPathFromMaxes(tnbs);
				}

				log('shapes before');
				log(workItem.shapes);
				let newShape = workItem.addOneShape(s);
				editor.multiSelect.shapes.select(newShape);
				log('shapes after');
				log(workItem.shapes);
				// updateCurrentGlyphWidth();

			} else {
				log(`Dragged shape too small`);
				// Remove the fake ... shape
				editor.multiSelect.shapes.deleteShapes();
			}

			eventHandlerData.firstX = -100;
			eventHandlerData.firstY = -100;
			eventHandlerData.tempNewBasicShape = false;
			// TODO history
			// historyPut('New Basic Shape tool');
			// eventHandlerData.undoQueueHasChanged = false;

			this.dragging = false;

			// clickTool('pathEdit');
				editor.editCanvas.redraw({ calledBy: 'Event Handler Tool_NewBasicShape mouseup' });
			log(`Tool_NewBasicShape.mouseup`, 'end');
		};
	}
}

export function rectPathFromMaxes(maxes){
	log(`rectPathFromMaxes`, 'start');
	log(JSON.stringify(maxes));
	let ps = getCurrentProject().projectSettings;

	//Default Shape size
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
