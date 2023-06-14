import { SVGtoBezier } from '../lib/svg-to-bezier/svg-to-bezier.js';
import { Glyph } from '../project_data/glyph.js';
import { Path } from '../project_data/path.js';
import { PathPoint } from '../project_data/path_point.js';
import { ControlPoint } from '../project_data/control_point.js';

export function ioSVG_convertSVGTagsToGlyph(svgData) {
	// log('ioSVG_convertSVGTagsToGlyph', 'start');

	// log(`Passed svgData`);
	// log(svgData);

	const bezierData = SVGtoBezier(svgData);
	// log(`Resulting Bezier Data`);
	// log(bezierData);

	if (bezierData.length === 0) {
		// showError(`
		// 	Could not find any SVG tags to import.
		// 	Supported tags are: &lt;path&gt;, &lt;rect&gt;, &lt;polygon&gt;, &lt;polyline&gt;, and &lt;ellipse&gt;.`
		// );
		// log('ioSVG_convertSVGTagsToGlyph', 'end');
		return;
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
				newPoint = new PathPoint({ p: { coord: { x: path[0][0].x, y: path[0][0].y } } });
				if (path[0][1]) {
					newPoint.h2 = new ControlPoint({ coord: { x: path[0][1].x, y: path[0][1].y } });
				}
				thisPath.addPathPoint(newPoint);
			}

			for (let b = 0; b < path.length - 1; b++) {
				// log(`>>>>Bezier path: ${b} and ${b + 1}`);
				thisPath.addPathPoint(makePathPointFromBeziers(path[b], path[b + 1]));
			}

			if (isPathClosed) {
				// log(`>>>>Bezier path: at(-1) and 0`);
				thisPath.addPathPoint(makePathPointFromBeziers(path.at(-1), path[0]));
			} else {
				newPoint = new PathPoint({ p: { coord: { x: path.at(-1)[3].x, y: path.at(-1)[3].y } } });
				if (path.at(-1)[2]) {
					newPoint.h1 = new ControlPoint({ coord: { x: path.at(-1)[2].x, y: path.at(-1)[2].y } });
				}
				thisPath.addPathPoint(newPoint);
			}

			newPaths.push(thisPath);
		}
	});

	const resultGlyph = new Glyph({ shapes: newPaths });
	resultGlyph.changed(true);

	// log(`RESULTING paths in a glyph`);
	// log(resultGlyph);

	// log('ioSVG_convertSVGTagsToGlyph', 'end');
	return resultGlyph;
}

function makePathPointFromBeziers(seg1, seg2) {
	// log(`makePathPointFromBeziers`, 'start');
	// log(`seg1: ${JSON.stringify(seg1)}`);
	// log(`seg2: ${JSON.stringify(seg2)}`);

	if (seg1[3].x !== seg2[0].x || seg1[3].y !== seg2[0].y) {
		// console.warn(`Segments do not share endpoints`);
	}

	let newPoint = new PathPoint({
		p: { coord: { x: seg2[0].x, y: seg2[0].y } },
	});

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
