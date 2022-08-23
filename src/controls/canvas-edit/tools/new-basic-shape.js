// ----------------------------------------------------------------
// New Basic Shape - adds many points to a new path
// ----------------------------------------------------------------

import { getCurrentProjectEditor, getCurrentProject } from '../../../app/main.js';
import { isVal, log, round } from '../../../common/functions.js';
import Coord from '../../../glyph_elements/coord.js';
import Path from '../../../glyph_elements/path.js';
import PathPoint from '../../../glyph_elements/path_point.js';
import Shape from '../../../glyph_elements/shape.js';
import { cXsX, cYsY } from '../canvas-edit.js';
import { eventHandlerData } from '../events_mouse.js';
import { addShape } from './tools.js';

export default class Tool_NewBasicShape {
	constructor() {
		this.dragging = false;

		this.mousedown = function (ev) {
			eventHandlerData.tempNewBasicShape = {
				xMax: cXsX(eventHandlerData.mouseX),
				xMin: cXsX(eventHandlerData.mouseX),
				yMax: cYsY(eventHandlerData.mouseY),
				yMin: cYsY(eventHandlerData.mouseY),
			};

			let newShape = new Shape({name: '...' });
			newShape.path.maxes = eventHandlerData.tempNewBasicShape;
			newShape = addShape(newShape);
			let editor = getCurrentProjectEditor();
			editor.multiSelect.shapes.select(newShape);

			eventHandlerData.firstX = cXsX(eventHandlerData.mouseX);
			eventHandlerData.firstY = cYsY(eventHandlerData.mouseY);

			this.dragging = true;

			editor.editCanvas.redraw({ calledBy: 'Event Handler Tool_NewBasicShape mousedown' });
			// log('Tool_NewBasicShape MOUSEDOWN - after REDRAW');
		};

		this.mousemove = function (ev) {
			if (eventHandlerData.tempNewBasicShape) {
				eventHandlerData.tempNewBasicShape.xMax = Math.max(
					eventHandlerData.firstX,
					cXsX(eventHandlerData.mouseX)
				);
				eventHandlerData.tempNewBasicShape.xMin = Math.min(
					eventHandlerData.firstX,
					cXsX(eventHandlerData.mouseX)
				);
				eventHandlerData.tempNewBasicShape.yMax = Math.max(
					eventHandlerData.firstY,
					cYsY(eventHandlerData.mouseY)
				);
				eventHandlerData.tempNewBasicShape.yMin = Math.min(
					eventHandlerData.firstY,
					cYsY(eventHandlerData.mouseY)
				);

				let editor = getCurrentProjectEditor();
				// TODO history
				// eventHandlerData.undoQueueHasChanged = true;
				editor.editCanvas.redraw({ calledBy: 'Event Handler Tool_NewBasicShape mousemove' });
				// log('Tool_NewBasicShape MOUSEMOVE past redraw');
			}
		};

		this.mouseup = function () {
			let tnbs = eventHandlerData.tempNewBasicShape;
			let editor = getCurrentProjectEditor();
			let ps = editor.project.projectSettings;

			// prevent really small shapes
			if (Math.abs(tnbs.xMax - tnbs.xMin) > ps.pointSize &&
				Math.abs(tnbs.yMax - tnbs.yMin) > ps.pointSize) {
				let count = editor.nav.page === 'components' ?
					Object.keys(editor.project.components).length :
					editor.selectedWorkItem.shapes.length;
				let s = editor.multiSelect.shapes.singleton;

				if (editor.selectedTool === 'newRectangle') {
					s.name = 'Rectangle ' + count;
					s.path = rectPathFromMaxes(tnbs);
				} else {
					s.name = 'Oval ' + count;
					s.path = ovalPathFromMaxes(tnbs);
				}

				// updateCurrentGlyphWidth();
			} else {
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
		};
	}
}

export function rectPathFromMaxes(maxes){
	let ps = getCurrentProject().projectSettings;

	//Default Shape size
	let lx = isVal(maxes.xMin)? maxes.xMin : 0;
	let ty = isVal(maxes.yMax)? maxes.yMax : ps.ascent;
	let rx = isVal(maxes.xMax)? maxes.xMax : 100;
	let by = isVal(maxes.yMin)? maxes.yMin : 0;

	let qw = round((rx-lx)/4);
	let qh = round((ty-by)/4);

	// First Point
	let Pul = new Coord({'x':lx, 'y':ty});
	let H1ul = new Coord({'x':lx, 'y':(ty-qh)});
	let H2ul = new Coord({'x':(lx+qw), 'y':ty});

	// Second Point
	let Pur = new Coord({'x':rx, 'y':ty});
	let H1ur = new Coord({'x':(rx-qw), 'y':ty});
	let H2ur = new Coord({'x':rx, 'y':(ty-qh)});

	// Third Point
	let Plr = new Coord({'x':rx, 'y':by});
	let H1lr = new Coord({'x':rx, 'y':(by+qh)});
	let H2lr = new Coord({'x':(rx-qw), 'y':by});

	// Fourth Point
	let Pll = new Coord({'x':lx, 'y':by});
	let H1ll = new Coord({'x':(lx+qw), 'y':by});
	let H2ll = new Coord({'x':lx, 'y':(by+qh)});

	let newPoints = [];
	newPoints[0] = new PathPoint({p:Pul, h1:H1ul, h2:H2ul});
	newPoints[1] = new PathPoint({p:Pur, h1:H1ur, h2:H2ur});
	newPoints[2] = new PathPoint({p:Plr, h1:H1lr, h2:H2lr});
	newPoints[3] = new PathPoint({p:Pll, h1:H1ll, h2:H2ll});

	let newPath = new Path({pathPoints:newPoints, 'leftx':lx, 'rightx':rx, 'topy':ty, 'bottomy':by});
	//debug('RETURNING PATH: ' + JSON.stringify(newPath));

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
	let Pt = new Coord({'x':(lx+hw), 'y':ty});
	let H1t = new Coord({'x':(lx+hwd), 'y':ty});
	let H2t = new Coord({'x':(rx-hwd), 'y':ty});

	// Second Point - Right
	let Pr = new Coord({'x':rx, 'y':(by+hh)});
	let H1r = new Coord({'x':rx, 'y':(ty-hhd)});
	let H2r = new Coord({'x':rx, 'y':(by-hhd)});

	// Third Point - Bottom
	let Pb = new Coord({'x':(lx+hw), 'y':by});
	let H1b = new Coord({'x':(rx-hwd), 'y':by});
	let H2b = new Coord({'x':(lx+hwd), 'y':by});

	// Fourth Point - Left
	let Pl = new Coord({'x':lx, 'y':(by+hh)});
	let H1l = new Coord({'x':lx, 'y':(by+hhd)});
	let H2l = new Coord({'x':lx, 'y':(ty-hhd)});


	let newPoints = [];
	newPoints[0] = new PathPoint({p:Pt, h1:H1t, h2:H2t, type:'symmetric'});
	newPoints[1] = new PathPoint({p:Pr, h1:H1r, h2:H2r, type:'symmetric'});
	newPoints[2] = new PathPoint({p:Pb, h1:H1b, h2:H2b, type:'symmetric'});
	newPoints[3] = new PathPoint({p:Pl, h1:H1l, h2:H2l, type:'symmetric'});

	return new Path({pathPoints:newPoints});
}
