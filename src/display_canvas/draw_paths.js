import { getCurrentProject } from '../app/main.js';
import { round } from '../common/functions.js';
import { sXcX, sYcY } from '../edit_canvas/edit_canvas.js';

// --------------------------------------------------------------
// Glyph
// --------------------------------------------------------------

/**
 * Draw a Glyph to a canvas
 * @param {Glyph} glyph - what glyph to draw
 * @param {Object} ctx - canvas context
 * @param {Object} view - x/y/z view object
 * @param {Number} alpha - transparency between 0 and 1
 * @param {String} fill - glyph fill color
 * @returns {Number} - Advance Width, according to view.z
 */
export function drawGlyph(glyph, ctx, view = { x: 0, y: 0, z: 1 }, alpha = 1, fill = '#000') {
	// log('drawGlyph', 'start');
	// log(glyph.name);
	// log('view ' + json(view, true));
	// log(ctx);
	if (!glyph.shapes) {
		console.warn(`Glyph ${glyph.name} has no shapes to draw`);
		return false;
	}

	let drewShape;
	ctx.beginPath();
	glyph.shapes.forEach((shape) => {
		// log(`${glyph.name} drawing ${shape.objType} #${j} "${shape.name}"`);
		drewShape = drawShape(shape, ctx, view);
		if (!drewShape) {
			// log('Could not draw shape ' + shape.name + ' in Glyph ' + glyph.name);
			if (shape.objType === 'ComponentInstance' && !getCurrentProject().getItem(shape.link)) {
				console.warn(`>>> Component Instance has bad link: ${shape.link} from ${glyph.id}`);
				const i = glyph.shapes.indexOf(shape);
				if (i > -1) {
					glyph.shapes.splice(i, 1);
					console.warn('>>> Deleted the Instance');
				}
			}
		}
	});
	ctx.closePath();
	ctx.fillStyle = fill;
	ctx.globalAlpha = alpha;
	ctx.fill('nonzero');
	ctx.globalAlpha = 1;

	// log(glyph.name);
	// log('drawGlyph', 'end');

	return glyph.advanceWidth * view.dz;
}

// --------------------------------------------------------------
// SHARED path and component instance
// --------------------------------------------------------------
/**
 *
 * @param {Path or ComponentInstance} shape - what thing to draw
 * @param {Object} ctx - canvas context
 * @param {Object} view - view
 */
export function drawShape(shape, ctx, view) {
	if (shape.objType === 'ComponentInstance') {
		return drawComponentInstanceToCanvas(shape, ctx, view);
	} else {
		return drawPathToCanvas(shape, ctx, view);
	}
}

// --------------------------------------------------------------
// Component Instance
// --------------------------------------------------------------

/**
 * Draw this Path to a canvas
 * @param {ComponentInstance} componentInstance - what to draw
 * @param {Object} ctx - canvas context
 * @param {view} view
 * @returns {Boolean}
 */
function drawComponentInstanceToCanvas(componentInstance, ctx, view) {
	// log('drawComponentInstanceToCanvas', 'start');
	// Have to iterate through paths instead of using drawGlyph
	// due to stacking paths with appropriate winding

	const glyph = componentInstance.transformedGlyph;
	// log(glyph);
	if (!glyph) return false;
	let drewShape = false;
	let failed = false;

	glyph.shapes.forEach((shape) => {
		drewShape = drawShape(shape, ctx, view);
		failed = failed || !drewShape;
	});

	// log(`!failed: ${!failed}`);
	// log('drawComponentInstanceToCanvas', 'end');
	return !failed;
}

// --------------------------------------------------------------
// Path
// --------------------------------------------------------------

/**
 * Draw a path to a canvas
 * @param {Path} path - what path to draw
 * @param {Object} ctx - HTML Canvas Context
 * @param {Object} view - View object with x / y offset and Zoom
 * @param {Boolean} snap - snap values to whole numbers
 */
function drawPathToCanvas(path, ctx, view, snap = false) {
	// log('drawPathToCanvas', 'start');
	// log(ctx);

	// log(`view ${view.dx}, ${view.dy}, ${view.dz}`);
	// log(path);

	// let currView = ProjectEditor.('drawPathToCanvas');
	// view = view || clone(currView);
	// setView(view);

	if (!path?.pathPoints || path.pathPoints === false) {
		// log(`RETURNING FALSE: path.pathPoints does not exist`);
		// log('drawPathToCanvas', 'end');
		return false;
	}

	if (path.pathPoints.length < 2) {
		// log(`RETURNING FALSE: ${path.pathPoints.length} points in the path`);
		// log('drawPathToCanvas', 'end');
		return false;
	}

	let pp;
	let np;
	const precision = snap ? 0 : 9;
	const p1x = sXcX(round(path.pathPoints[0].p.x, precision), view);
	const p1y = sYcY(round(path.pathPoints[0].p.y, precision), view);
	let p2x;
	let p2y;
	let p3x;
	let p3y;
	let p4x;
	let p4y;

	// log('end of top section');

	ctx.moveTo(p1x, p1y);
	// log(`move to ${p1x}, ${p1y}`);

	for (let cp = 0; cp < path.pathPoints.length; cp++) {
		pp = path.pathPoints[cp];
		// np = path.pathPoints[(cp+1) % path.pathPoints.length];
		np = path.pathPoints[path.getNextPointNum(cp)];

		if (!pp.h2.use && !np.h1.use) {
			// straight line
			p4x = sXcX(round(np.p.x, precision), view);
			p4y = sYcY(round(np.p.y, precision), view);

			// log(`lineTo ${p4x}, ${p4y}`);
			ctx.lineTo(p4x, p4y);
		} else {
			// curved line
			p2x = sXcX(round(pp.h2.x, precision), view);
			p2y = sYcY(round(pp.h2.y, precision), view);
			p3x = sXcX(round(np.h1.x, precision), view);
			p3y = sYcY(round(np.h1.y, precision), view);
			p4x = sXcX(round(np.p.x, precision), view);
			p4y = sYcY(round(np.p.y, precision), view);

			// log(`curveTo ${p2x}, ${p2y}, ${p3x}, ${p3y}, ${p4x}, ${p4y}`);
			ctx.bezierCurveTo(p2x, p2y, p3x, p3y, p4x, p4y);
		}
	}

	// log('drawPathToCanvas', 'end');
	return true;
}
