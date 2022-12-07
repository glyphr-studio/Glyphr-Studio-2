import { ovalPathFromMaxes, rectPathFromMaxes } from '../edit_canvas/tools/new-basic-path.js';
import { Path } from '../project_data/path.js';
import { XYPoint } from './xy_point.js';
/**
	IO > Import > SVG Outlines
	Takes a set of XML and pulls out any path or
	path data that could be converted into a
	Glyphr Studio path.  Ignores lots of XML tags
	and attributes.
**/

function ioSVG_convertTagsToGlyph(svgData) {
	// log('ioSVG_convertTagsToGlyph', 'start');

	const newPaths = [];
	let data = {};
	let pathCounter = 0;
	const error = false;
	const grabTags = ['path', 'rect', 'polyline', 'polygon', 'ellipse', 'circle'];
	let jsonData;

	try {
		jsonData = convertXMLtoJSON(svgData);
	} catch (e) {
		if (e.message === 'XMLdoc.getElementsByTagName(...)[0] is undefined') {
			e.message =
				'No SVG Path or Path Tags could be found.  Make sure the SVG code is in proper XML format.';
		}
		showErrorMessageBox(e.message);
		return;
	}

	const unsortedPathTags = ioSVG_getTags(jsonData, grabTags);
	const pathTags = {};

	// log('unsorted pathTags from imported XML: ');
	// log(unsortedPathTags);

	// get a sorted pathTags object
	for (let g = 0; g < grabTags.length; g++) pathTags[grabTags[g]] = [];
	for (let s = 0; s < unsortedPathTags.length; s++)
		pathTags[unsortedPathTags[s].name].push(unsortedPathTags[s]);

	// log('pathTags from imported XML: ');
	// log(pathTags);

	function pushPath(path) {
		pathCounter++;
		n = n + ' ' + pathCounter;
		newPaths.push(new Path(path));
	}

	/*
		GET PATH TAGS
	*/
	if (pathTags.path.length) {
		data = '';
		tag = {};

		for (let p = 0; p < pathTags.path.length; p++) {
			// Compound Paths are treated as different Glyphr Paths
			data = pathTags.path[p].attributes.d;
			data = cleanAndFormatPathPointData(data);

			for (let d = 0; d < data.length; d++) {
				if (data[d].length) {
					tag = ioSVG_convertPathTag(data[d]);
					if (tag.pathPoints.length) {
						tag.name = 'Path';
						pushPath(tag);
					}
				}
			}
		}
	}

	/*
			GET RECT TAGS
		*/
	if (pathTags.rect.length) {
		data = {};
		let maxes;
		let x;
		let y;
		let w;
		let h;
		let rect;

		for (let r = 0; r < pathTags.rect.length; r++) {
			data = pathTags.rect[r].attributes || {};
			x = data.x * 1 || 0;
			y = data.y * 1 || 0;
			w = data.width * 1 || 0;
			h = data.height * 1 || 0;

			if (!(w === 0 && h === 0)) {
				maxes = {
					xMax: x + w,
					xMin: x,
					yMax: y + h,
					yMin: y,
				};

				rect = rectPathFromMaxes(maxes);
				rect.name = 'Rectangle';
				pushPath(rect);
			}
		}
	}

	/*
			GET POLYLINE OR POLYGON TAGS
		*/
	let poly = pathTags.polygon;
	poly = poly.concat(pathTags.polyline);

	if (poly.length) {
		data = {};
		let pathPoints;
		let point;
		let px;
		let py;

		for (let po = 0; po < poly.length; po++) {
			data = poly[po].attributes.points;
			data = cleanAndFormatPathPointData(data);
			data = data[0].split(',');

			// log('Polyline or Polygon data, cleaned & formatted:');
			// log(data);

			if (data.length) {
				pathPoints = [];

				for (let co = 0; co < data.length; co += 2) {
					px = data[co] || 0;
					py = data[co + 1] || 0;

					point = new XYPoint(px, py);
					/*
					 *
					 * // TODO REFACTOR
					 *
					 */
					pathPoints.push({
						p: { coord: point },
						h1: { coord: point },
						h2: { coord: point },
						useH1: false,
						useH2: false,
					});
				}

				pushPath(new Path({ name: 'Polygon', pathPoints: pathPoints }));
			}
		}
	}

	/*
			GET ELLIPSE OR CIRCLE TAGS
		*/
	let ellipsoids = pathTags.circle;
	ellipsoids = ellipsoids.concat(pathTags.ellipse);

	if (ellipsoids.length) {
		data = {};
		let ellipseMaxes;
		let rx;
		let ry;
		let cx;
		let cy;
		let ellipse;

		for (let c = 0; c < ellipsoids.length; c++) {
			data = ellipsoids[c].attributes;
			rx = data.r * 1 || data.rx * 1 || 0;
			rx = Math.abs(rx);
			ry = data.r * 1 || data.ry * 1 || 0;
			ry = Math.abs(ry);
			cx = data.cx * 1 || 0;
			cy = data.cy * 1 || 0;

			if (!(rx === 0 && ry === 0)) {
				ellipseMaxes = {
					xMin: cx - rx,
					xMax: cx + rx,
					yMin: cy - ry,
					yMax: cy + ry,
				};

				ellipse = ovalPathFromMaxes(ellipseMaxes);
				ellipse.name = 'Oval';
				pushPath(ellipse);
			}
		}
	}

	if (pathCounter === 0) {
		showErrorMessageBox(
			'Could not find any SVG tags to import.  Supported tags are: &lt;path&gt;, &lt;rect&gt;, &lt;polygon&gt;, &lt;polyline&gt;, and &lt;ellipse&gt;.'
		);
		return;
	}

	if (error) {
		showErrorMessageBox(
			'A transform attribute was found.  It will be ignored, probably resulting in unexpected path outlines.  Check the Import SVG section of the Help page.'
		);
	}

	const resultGlyph = new Glyph({ paths: newPaths });
	resultGlyph.changed(true);

	// log(resultGlyph);

	// log('ioSVG_convertTagsToGlyph', 'end');
	return resultGlyph;
}

function cleanAndFormatPathPointData(data) {
	/*
			Takes a string representing input from a <path> tag's
			'd' attribute.

			Returns an array of strings.  Each array element
			representing one Glyphr Studio path.  String will be
			comma separated Path Commands and Values

	*/
	let returnData = [];

	// log('cleanAndFormatPathPointData', 'start');
	// log('dirty data\n\t ' + data);

	// Move commands for a path are treated as different Glyphr Paths
	data = data.replace(/M/g, ',z,M');
	data = data.replace(/m/g, ',z,m');

	// Parse in the path data, comma separating everything
	data = data.replace(/(\s+)/g, ',');

	// Normalize Z end path command
	data = data.replace(/Z/gi, 'z');

	// Put commas between Path Commands and preceding numbers
	let curr = 0;
	while (curr < data.length) {
		if (ioSVG_isPathCommand(data.charAt(curr))) {
			data = data.slice(0, curr) + ',' + data.charAt(curr) + ',' + data.slice(curr + 1);
			curr++;
		}
		if (curr > 1000000) {
			showErrorMessageBox('SVG path data longer than a million points is super uncool.');
			return;
		} else {
			curr++;
		}
	}

	// Clean up negative numbers, and scientific notation numbers
	data = data.replace(/e-/g, '~~~');
	data = data.replace(/-/g, ',-');
	data = data.replace(/~~~/g, 'e-');

	// Clean up  whitespace
	// if(data.charAt(0) === ' ') data = data.slice(1);
	data = data.replace(/(\s+)/g, '');

	// Clean up some commas
	data = data.replace(/,+/g, ',');
	if (data.charAt(0) === ',') data = data.slice(1);

	// Remove extra Z commands
	// log('2nd to last char ' + data.charAt(data.length-2));
	if (data.charAt(data.length - 2) === 'z') data = data.slice(0, -2);
	// if(data.substr(-2) === ',z') data = data.slice(0, -2);
	// if(data.substr(0, 3) === ',z,') data = data.slice(3);
	// log('first two chars are |' + data.substr(0,2) + '|');
	if (data.substring(0, 2) === 'z,') data = data.slice(2);

	// Clean up commas again
	data = data.replace(/,+/g, ',');
	if (data.charAt(data.length - 1) === ',') data = data.slice(0, -1);
	if (data.charAt(0) === ',') data = data.slice(1);

	// Check for 'double decimal' numbers
	data = data.split(',');
	let first = -1;
	let second = -1;
	let subsequence = '';

	data.forEach(function (v, i, a) {
		// Search for two instances of '.'
		// log('v: ' + v);
		first = v.indexOf('.');
		// log('first: ' + first);

		if (first > -1) {
			second = v.indexOf('.', first + 1);
			// log('second: ' + second);
			if (second > -1) {
				returnData.push(v.slice(0, second));
				subsequence = v.slice(second);
				// log('just the tail: ' + subsequence);
				subsequence = subsequence.replace(/\./g, ',0.');
				if (subsequence.charAt(0) === ',') subsequence = subsequence.slice(1);
				// log('added zeros: ' + subsequence);
				subsequence = subsequence.split(',');
				// log('subsequence: ' + subsequence);
				returnData = returnData.concat(subsequence);
			} else {
				// no two instances of '.'
				returnData.push(v);
			}
		} else {
			// no two instances of '.'
			returnData.push(v);
		}

		first = -1;
		second = -1;
		subsequence = '';
	});

	// Make into an array
	returnData = returnData.join(',');
	returnData = returnData.split(',z');

	// log('clean data\n\t ' + returnData);
	// log('cleanAndFormatPathPointData', 'end');

	return returnData;
}

function ioSVG_getTags(obj, grabTags) {
	// log('ioSVG_getTags \t Start');
	// log('grabTags: ' + JSON.stringify(grabTags));
	// log('passed obj: ');
	// log(obj);

	if (typeof grabTags === 'string') grabTags = [grabTags];
	let result = [];

	if (obj.content) {
		for (let c = 0; c < obj.content.length; c++) {
			result = result.concat(ioSVG_getTags(obj.content[c], grabTags));
		}
	} else {
		if (grabTags.indexOf(obj.name) > -1) {
			result = [obj];
		}
	}

	// log('ioSVG_getTags \t End \n');
	return result;
}

function ioSVG_getFirstTagInstance(obj, tagname) {
	// log('ioSVG_getFirstTagInstance', 'start');
	// log('finding ' + tagname + ' in:');
	// log(obj);

	if (tagname === obj.name) {
		// log('ioSVG_getFirstTagInstance - tagname === obj.name', 'end');
		return obj;
	} else if (obj.content) {
		for (let c = 0; c < obj.content.length; c++) {
			const sub = ioSVG_getFirstTagInstance(obj.content[c], tagname);
			if (sub) {
				// log('ioSVG_getFirstTagInstance - looked through obj and found it', 'end');
				return sub;
			}
		}
	} else {
		// log('ioSVG_getFirstTagInstance - NO obj.content FOUND', 'end');
		return false;
	}
}

function ioSVG_convertPathTag(data) {
	// log('ioSVG_convertPathTag', 'start');
	// log('passed data ' + data);

	// Parse comma separated data into commands / data chunks
	data = data.split(',');
	const chunks = [];
	let commandPosition = 0;
	let command;
	let dataChunk = [];
	curr = 1;

	while (curr <= data.length) {
		if (ioSVG_isPathCommand(data[curr])) {
			dataChunk = data.slice(commandPosition + 1, curr);
			command = data[commandPosition];

			for (let i = 0; i < dataChunk.length; i++) dataChunk[i] = Number(dataChunk[i]);

			// log('Handling command ' + command);
			// log('With data ' + dataChunk);

			chunks.push({ command: command, data: dataChunk });
			commandPosition = curr;
		}
		curr++;
	}

	// Fencepost
	dataChunk = data.slice(commandPosition + 1, curr);
	command = data[commandPosition];
	for (let j = 0; j < dataChunk.length; j++) dataChunk[j] = Number(dataChunk[j]);
	// log('FENCEPOST');
	// log('Handling command ' + command);
	// log('With data ' + dataChunk);
	chunks.push({ command: command, data: dataChunk });

	// log('chunks data is \n' + json(chunks, true));

	// Turn the commands and data into Glyphr objects
	let paths = [];
	for (let c = 0; c < chunks.length; c++) {
		// log('\n\t Path Chunk ' + c);
		// log('' + chunks[c].command + ' : ' + chunks[c].data);
		if (chunks[c].command) {
			paths = ioSVG_handlePathChunk(chunks[c], paths, c === chunks.length - 1);
		}
	}

	// Combine 1st and last point
	const fp = paths[0];
	const lp = paths[paths.length - 1];
	if (fp.p.x === lp.p.x && fp.p.y === lp.p.y) {
		// log('fp/lp same:\nFirst Point: '+json(fp)+'\nLast Point:  '+json(lp));
		fp.h1.x = lp.h1.x;
		fp.h1.y = lp.h1.y;
		fp.h1.use = lp.h1.use;
		paths.pop();
		fp.resolvePointType();
		// log('AFTER:\nFirst Point: '+json(fp));
	}

	const newPath = new Path({ pathPoints: paths });
	newPath.validate('Import SVG');

	// log('unscaled path:');
	// log(newPath);
	// log('ioSVG_convertTag', 'end');
	return newPath;
}

function ioSVG_isPathCommand(c) {
	if ('MmLlCcSsZzHhVvAaQqTt'.indexOf(c) > -1) return c;
	return false;
}

function ioSVG_handlePathChunk(chunk, paths, isLastPoint) {
	// log('ioSVG_handlePathChunk', 'start');
	// log('chunk: ' + json(chunk, true));

	const cmd = chunk.command;
	let currentData = [];
	const isCommand = function (str) {
		return str.indexOf(cmd) > -1;
	};
	let p;
	let nx;
	let ny;
	let h1;
	/*
	 *
	 * // TODO REFACTOR
	 *
	 */
	let lastPoint = paths[paths.length - 1] || new PathPoint();
	let previousX;
	let previousY;

	// log('previous point: \t'+lastPoint.p.x+','+lastPoint.p.y);

	/*
			Path Instructions: Capital is absolute, lowercase is relative
			M m        MoveTo
			L l        LineTo
			H h        Horizontal Line
			V v        Vertical Line
			C c        Bezier (can be chained)
			S s        Smooth Bezier
			Q q        Quadratic Bezier (can be chained)
			T t        Smooth Quadratic
			Z z        Close Path

			Partially supported, just draw a line to the end point
			A a        ArcTo
	*/

	if (isCommand('MmLlHhVv')) {
		// ABSOLUTE line methods
		// relative line methods

		nx = lastPoint.p.x;
		ny = lastPoint.p.y;

		while (chunk.data.length) {
			// Grab the next chunk of data and make sure it's length=2
			currentData = [];
			currentData = chunk.data.splice(0, 2);

			if (currentData.length % 2 !== 0 && isCommand('MmLl')) {
				showErrorMessageBox(
					'Move or Line path command (M, m, L, l) was expecting 2 arguments, was passed [' +
						currentData +
						']\n<br>Failing "gracefully" by filling in default data.'
				);
				while (currentData.length < 2) {
					currentData.push(currentData[currentData.length - 1] + 100);
				}
			}
			// log('\n\t command ' + cmd + ' while loop data ' + currentData);

			previousX = lastPoint.p.x;
			previousY = lastPoint.p.y;

			switch (cmd) {
				case 'L':
				case 'M':
					// ABSOLUTE line to
					// ABSOLUTE move to
					nx = currentData[0];
					ny = currentData[1];
					break;
				case 'l':
				case 'm':
					// relative line to
					// relative move to
					nx = currentData[0] + previousX;
					ny = currentData[1] + previousY;
					break;
				case 'H':
					// ABSOLUTE horizontal line to
					nx = currentData[0];
					// chunk.data.unshift(currentData[1]);
					break;
				case 'h':
					// relative horizontal line to
					nx = currentData[0] + previousX;
					// chunk.data.unshift(currentData[1]);
					break;
				case 'V':
					// ABSOLUTE vertical line to
					ny = currentData[0];
					// chunk.data.unshift(currentData[1]);
					break;
				case 'v':
					// relative vertical line to
					ny = currentData[0] + previousY;
					// chunk.data.unshift(currentData[1]);
					break;
			}

			// log('linear end nx ny\t' + nx + ' ' + ny);
			p = new XYPoint(nx, ny);
			// log('new point ' + p.x + '\t' + p.y);

			lastPoint.h2.use = false;
			/*
			 *
			 * // TODO REFACTOR
			 *
			 */
			paths.push(
				new PathPoint({
					p: clone(p),
					h1: clone(p),
					h2: clone(p),
					type: 'corner',
					useH1: false,
					useH2: true,
				})
			);
			lastPoint = paths[paths.length - 1];
		}

		// log('completed while loop');
	} else if (isCommand('Aa')) {
		// ABSOLUTE arc to
		// relative arc to

		showErrorMessageBox(
			'Arc To path commands (A or a) are not directly supported.  A straight line will be drawn from the beginning to the end of the arc.'
		);
		nx = lastPoint.p.x;
		ny = lastPoint.p.y;

		if (chunk.data.length % 7 !== 0) {
			showErrorMessageBox(
				'Arc To path command (A or a) was expecting 7 arguments, was passed [' +
					chunk.data +
					']\n<br>Failing "gracefully" by just drawing a line to the last two data points as if they were a x/y point.'
			);
			chunk.data.splice(0, chunk.data.length - 2, 0, 0, 0, 0, 0);
		}

		while (chunk.data.length) {
			currentData = [];
			currentData = chunk.data.splice(0, 7);
			currentData = currentData.splice(5, 2);
			// log('\n\t command ' + cmd + ' while loop data ' + currentData);

			previousX = lastPoint.p.x;
			previousY = lastPoint.p.y;

			nx = currentData[0];
			ny = currentData[1];

			if (cmd === 'a') {
				nx += previousX;
				ny += previousY;
			}

			// log('linear end nx ny\t' + nx + ' ' + ny);
			p = new Coord({ x: nx, y: ny });
			// log('new point ' + p.x + '\t' + p.y);

			lastPoint.type = 'corner';
			lastPoint.h2.use = true;
			lastPoint.makePointedTo(p.x, p.y, false, 'h2', true);

			/*
			 *
			 * // TODO REFACTOR
			 *
			 */
			const pp = new PathPoint({
				p: p,
				h1: clone(p),
				h2: clone(p),
				type: 'corner',
				useH1: true,
				useH2: true,
			});
			pp.makePointedTo(previousX, previousY, false, 'h1', true);
			paths.push(pp);

			lastPoint = paths[paths.length - 1];
		}

		// log('completed while loop');
	} else if (isCommand('Qq')) {
		// ABSOLUTE quadratic bezier curve to
		// relative quadratic bezier curve to

		currentData = [];
		while (chunk.data.length) {
			// Grab the next chunk of data and make sure it's length=4
			currentData = chunk.data.splice(0, 4);
			if (currentData.length % 4 !== 0) {
				showErrorMessageBox(
					'Quadratic Bezier path command (Q or q) was expecting 4 arguments, was passed [' +
						currentData +
						']\n<br>Failing "gracefully" by filling in default data.'
				);
				while (currentData.length < 4) {
					currentData.push(currentData[currentData.length - 1] + 100);
				}
			}
			// log('\n\n\t command ' + cmd + ' while loop data ' + currentData);

			if (isCommand('q')) {
				// Relative offset for q
				previousX = lastPoint.p.x;
				previousY = lastPoint.p.y;
				currentData[0] += previousX;
				currentData[1] += previousY;
				currentData[2] += previousX;
				currentData[3] += previousY;
			}

			q = new Coord({ x: currentData[0], y: currentData[1] });
			currentData = [lastPoint.p.x, lastPoint.p.y].concat(currentData);
			currentData = convertQuadraticToCubic(currentData);
			// log('command ' + cmd + ' after Q>C convert ' + currentData);

			lastPoint.h2 = new Coord({ x: currentData[0], y: currentData[1] });
			lastPoint.h2.use = true;
			lastPoint.resolvePointType();

			h1 = new Coord({ x: currentData[2], y: currentData[3] });
			p = new Coord({ x: currentData[4], y: currentData[5] });

			// log('bezier end Px Py\t'+p.x+' '+p.y+'\tH1x H1y:'+h1.x+' '+h1.y);

			/*
			 *
			 * // TODO REFACTOR
			 *
			 */
			paths.push(
				new PathPoint({
					p: clone(p),
					h1: clone(h1),
					h2: clone(p),
					q: clone(q),
					useH1: true,
					useH2: true,
					type: 'corner',
				})
			);
			lastPoint = paths[paths.length - 1];
		}

		// log('completed while loop');
	} else if (isCommand('Tt')) {
		// ABSOLUTE quadratic symmetric bezier curve to
		// relative quadratic symmetric bezier curve to

		currentData = [];
		// Loop through (potentially) PolyBeziers
		while (chunk.data.length) {
			// Grab the next chunk of data and make sure it's length=2
			currentData = [];
			currentData = chunk.data.splice(0, 2);
			if (currentData.length % 2 !== 0) {
				showErrorMessageBox(
					'Symmetric Bezier path command (T or t) was expecting 2 arguments, was passed [' +
						currentData +
						']\n<br>Failing "gracefully" by filling in default data.'
				);
				while (currentData.length < 2) {
					currentData.push(currentData[currentData.length - 1] + 100);
				}
			}
			// log('\n\t command ' + cmd + ' while loop data ' + currentData);

			if (isCommand('t')) {
				// Relative offset for t
				previousX = lastPoint.p.x;
				previousY = lastPoint.p.y;
				currentData[0] += previousX;
				currentData[1] += previousY;
			}

			q = new Coord(findSymmetricPoint(lastPoint.p, lastPoint.Q));
			currentData = [lastPoint.p.x, lastPoint.p.y, q.x, q.y].concat(currentData);

			// log('command ' + cmd + ' before Q>C convert ' + currentData);
			currentData = convertQuadraticToCubic(currentData);
			// log('command ' + cmd + ' afters Q>C convert ' + currentData);

			lastPoint.h2 = new Coord({ x: currentData[0], y: currentData[1] });
			lastPoint.h2.use = true;
			lastPoint.resolvePointType();

			h1 = new Coord({ x: currentData[2], y: currentData[3] });
			p = new Coord({ x: currentData[4], y: currentData[5] });

			// log('bezier end Px Py\t'+p.x+' '+p.y+'\tH1x H1y:'+h1.x+' '+h1.y);

			/*
			 *
			 * // TODO REFACTOR
			 *
			 */
			paths.push(
				new PathPoint({
					p: clone(p),
					h1: clone(h1),
					h2: clone(p),
					q: clone(q),
					useH1: true,
					useH2: true,
					type: 'corner',
				})
			);
			lastPoint = paths[paths.length - 1];
		}

		// log('completed while loop');
	} else if (isCommand('Cc')) {
		// ABSOLUTE bezier curve to
		// relative bezier curve to
		// The three subsequent x/y points are relative to the last command's x/y point
		// relative x/y point (n) is NOT relative to (n-1)

		currentData = [];
		// Loop through (potentially) PolyBeziers
		while (chunk.data.length) {
			// Grab the next chunk of data and make sure it's length=6
			currentData = [];
			currentData = chunk.data.splice(0, 6);
			if (currentData.length % 6 !== 0) {
				showErrorMessageBox(
					'Bezier path command (C or c) was expecting 6 arguments, was passed [' +
						currentData +
						']\n<br>Failing "gracefully" by filling in default data.'
				);
				while (currentData.length < 6) {
					currentData.push(currentData[currentData.length - 1] + 100);
				}
			}
			// log('\n\n\t command ' + cmd + ' while loop data ' + currentData);

			lastPoint.h2 = new Coord({ x: currentData[0], y: currentData[1] });
			lastPoint.h2.use = true;
			lastPoint.resolvePointType();

			h1 = new Coord({ x: currentData[2], y: currentData[3] });
			p = new Coord({ x: currentData[4], y: currentData[5] });

			if (isCommand('c')) {
				// Relative offset for c
				previousX = lastPoint.p.x;
				previousY = lastPoint.p.y;
				lastPoint.h2.x += previousX;
				lastPoint.h2.y += previousY;
				h1.x += previousX;
				h1.y += previousY;
				p.x += previousX;
				p.y += previousY;
			}

			// log('bezier end Px Py\t'+p.x+' '+p.y+'\tH1x H1y:'+h1.x+' '+h1.y);
			/*
			 *
			 * // TODO REFACTOR
			 *
			 */
			paths.push(
				new PathPoint({
					p: clone(p),
					h1: clone(h1),
					h2: clone(p),
					useH1: true,
					useH2: true,
					type: 'corner',
				})
			);
			lastPoint = paths[paths.length - 1];
		}

		// log('completed while loop');
	} else if (isCommand('Ss')) {
		// ABSOLUTE symmetric bezier curve to
		// relative symmetric bezier curve to

		currentData = [];
		// Loop through (potentially) PolyBeziers
		while (chunk.data.length) {
			// Grab the next chunk of data and make sure it's length=4
			currentData = [];
			currentData = chunk.data.splice(0, 4);
			if (currentData.length % 4 !== 0) {
				showErrorMessageBox(
					'Symmetric Bezier path command (S or s) was expecting 4 arguments, was passed [' +
						currentData +
						']\n<br>Failing "gracefully" by filling in default data.'
				);
				while (currentData.length < 4) {
					currentData.push(currentData[currentData.length - 1] + 100);
				}
			}
			// log('\n\t command ' + cmd + ' while loop data ' + currentData);

			lastPoint.makeSymmetric('h1');
			lastPoint.h2.use = true;

			h1 = new Coord({ x: currentData[0], y: currentData[1] });
			p = new Coord({ x: currentData[2], y: currentData[3] });

			// log('p before: ' + json(p, true));

			if (isCommand('s')) {
				// Relative offset for st
				previousX = lastPoint.p.x;
				previousY = lastPoint.p.y;
				h1.x += previousX;
				h1.y += previousY;
				p.x += previousX;
				p.y += previousY;
			}

			// log('p afters: ' + json(p, true));
			// log('h1 after: ' + json(h1, true));

			/*
			 *
			 * // TODO REFACTOR
			 *
			 */
			paths.push(
				new PathPoint({
					p: clone(p),
					h1: clone(h1),
					h2: clone(p),
					type: 'symmetric',
					useH1: true,
					useH2: true,
				})
			);
			lastPoint = paths[paths.length - 1];
		}

		// log('completed while loop');
	} else if (isCommand('Zz')) {
		// End Path
	} else {
		showErrorMessageBox('Unrecognized path command ' + cmd + ', ignoring and moving on...');
	}

	// Finish up last point
	if (isLastPoint) {
		const added = paths[paths.length - 1];
		added.resolvePointType();
	}

	// log('Resulting Path Chunk');
	// log(paths);

	// log('ioSVG_handlePathChunk', 'end');

	return paths;
}

function findSymmetricPoint(p, h) {
	// log('findSymmetricPoint', 'start');
	p = p || { x: 0, y: 0 };
	h = h || { x: 0, y: 0 };

	// log('p: ' + json(p, true));
	// log('h: ' + json(h, true));

	const re = {
		x: p.x - h.x + p.x,
		y: p.y - h.y + p.y,
	};

	// log('returning ' + json(re, true));
	// log('findSymmetricPoint', 'end');

	return re;
}

function convertQuadraticToCubic(data) {
	// log('convertQuadraticToCubic', 'start');
	// log('data: ' + json(data, true));
	const re = [];

	const q0x = data[0];
	const q0y = data[1];
	const q1x = data[2];
	const q1y = data[3];
	const q2x = data[4];
	const q2y = data[5];

	const c1x = q0x + (2 / 3) * (q1x - q0x);
	const c1y = q0y + (2 / 3) * (q1y - q0y);

	const c2x = q2x + (2 / 3) * (q1x - q2x);
	const c2y = q2y + (2 / 3) * (q1y - q2y);

	re.push(c1x);
	re.push(c1y);
	re.push(c2x);
	re.push(c2y);
	re.push(q2x);
	re.push(q2y);

	return re;
}
