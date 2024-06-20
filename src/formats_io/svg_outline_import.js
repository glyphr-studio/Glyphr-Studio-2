import { showError } from '../controls/dialogs/dialogs.js';
import { SVGtoBezier } from '../lib/svg-to-bezier/svg-to-bezier.js';
import { ControlPoint } from '../project_data/control_point.js';
import { Coord } from '../project_data/coord.js';
import { Glyph } from '../project_data/glyph.js';
import { Path } from '../project_data/path.js';
import { PathPoint } from '../project_data/path_point.js';

/**
 * Imports SVG data shapes as a Glyphr Studio Glyph object
 * @param {String} svgData - SVG document in text form
 * @param {Boolean} showErrors - pop an UI error dialog
 * @returns {Glyph} - Glyphr Studio Glyph result
 */
export function ioSVG_convertSVGTagsToGlyph(svgData, showErrors = true) {
	// log('ioSVG_convertSVGTagsToGlyph', 'start');

	// log(`Passed svgData`);
	// log(svgData);

	const bezierData = SVGtoBezier(svgData);
	// log(`Resulting Bezier Data`);
	// log(bezierData);

	if (showErrors && bezierData.length === 0) {
		showError(`
			Could not find any SVG tags to import.
			Supported tags are: &lt;path&gt;, &lt;rect&gt;, &lt;polygon&gt;, &lt;polyline&gt;, and &lt;ellipse&gt;.`);
		// log('ioSVG_convertSVGTagsToGlyph', 'end');
		return new Glyph();
	}

	let pathCounter = 0;
	let newPaths = [];

	bezierData.forEach((path) => {
		// Remove line-to commands that don't go anywhere
		path = path.filter((bezier) => {
			return !(
				bezier[0].x === bezier[3].x &&
				bezier[0].y === bezier[3].y &&
				bezier[1] === false &&
				bezier[2] === false
			);
		});

		if (path.length) {
			pathCounter++;
			// log(`pathCounter: ${pathCounter}`);
			const isPathClosed = path[0][0].x === path.at(-1)[3].x && path[0][0].y === path.at(-1)[3].y;
			let thisPath = new Path({ name: `Path ${pathCounter}` });
			let newPoint;

			if (!isPathClosed) {
				newPoint = new PathPoint();
				newPoint.p = new ControlPoint({ coord: new Coord({ x: path[0][0].x, y: path[0][0].y }) });
				if (path[0][1]) {
					newPoint.h2 = new ControlPoint({
						coord: new Coord({ x: path[0][1].x, y: path[0][1].y }),
					});
				}
				thisPath.addPathPoint(newPoint);
			}

			for (let b = 0; b < path.length - 1; b++) {
				// log(`>>>>Bezier path: ${b} and ${b + 1}`);
				thisPath.addPathPoint(makePathPointFromBeziers(path[b], path[b + 1]));
				// log(thisPath.print());
			}

			if (isPathClosed) {
				// log(`>>>>Bezier path: at(-1) and 0`);
				thisPath.addPathPoint(makePathPointFromBeziers(path.at(-1), path[0]));
			} else {
				newPoint = new PathPoint();
				newPoint.p = new ControlPoint({
					coord: new Coord({ x: path.at(-1)[3].x, y: path.at(-1)[3].y }),
				});
				if (path.at(-1)[2]) {
					newPoint.h1 = new ControlPoint({
						coord: new Coord({ x: path.at(-1)[2].x, y: path.at(-1)[2].y }),
					});
				}
				thisPath.addPathPoint(newPoint);
			}

			// log(`Done with one path:`);
			// log(`\n⮟thisPath⮟`);
			// log(thisPath);
			newPaths.push(thisPath);
		}
	});

	const resultGlyph = new Glyph({ shapes: newPaths });
	resultGlyph.changed();

	// log(`RESULTING paths in a glyph`);
	// log(resultGlyph);

	// log('ioSVG_convertSVGTagsToGlyph', 'end');
	return resultGlyph;
}

/**
 * Given two Bezier paths, using the point in common, create
 * a Glyphr Studio path point.
 * @param {Object} seg1 - curve data in Bezier format
 * @param {Object} seg2 - curve data in Bezier format
 * @returns {PathPoint}
 */
function makePathPointFromBeziers(seg1, seg2) {
	// log(`makePathPointFromBeziers`, 'start');
	// log(`seg1: ${JSON.stringify(seg1)}`);
	// log(`seg2: ${JSON.stringify(seg2)}`);

	if (seg1[3].x !== seg2[0].x || seg1[3].y !== seg2[0].y) {
		// console.warn(`Segments do not share endpoints`);
	}

	let newPoint = new PathPoint();
	newPoint.p = new ControlPoint({ coord: { x: seg2[0].x, y: seg2[0].y } });

	if (seg1[2]) {
		newPoint.h1 = new ControlPoint({ coord: { x: seg1[2].x, y: seg1[2].y }, use: true });
	} else {
		// console.warn(`NOT SETTING h1`);
		// log(seg1[2]);
	}

	if (seg2[1]) {
		newPoint.h2 = new ControlPoint({ coord: { x: seg2[1].x, y: seg2[1].y }, use: true });
	} else {
		// console.warn(`NOT SETTING h2`);
		// log(seg2[1]);
	}

	// log(newPoint.print());
	// log(`makePathPointFromBeziers`, 'end');
	return newPoint;
}
