import { log, roundAndSanitize } from './svg-to-bezier.js';

/**
 * Takes the string value of an element's "transform" attribute, and
 * parses out each individual transform into an object containing the
 * transform's name, and an array of the transform's arguments.
 * @param {Object} tag - XMLtoJSON representation of a single SVG Tag
 * @returns {Array} - Collection of objects containing individual transform names & arguments
 */
export function getTransformData(tag) {
	log(`getTransformData`);
	log(tag);
	if (!tag || !tag?.attributes) return [];

	/* 
		transform attribute (toLowerCase is called to identify these)
		matrix(a,b,c,d,e,f)	// default (1, 0, 0, 1, 0, 0) identity matrix
		translate(x, y) 		// default (0, 0)
		scale(x, y) 				// default (0, 0)
		rotate(a, x, y) 		// default (0, 0, 0)
		skewX(a) 						// default (0)
		skewY(a) 						// default (0)
	*/
	const supported = ['matrix', 'translate', 'scale', 'rotate', 'skewx', 'skewy'];
	let transforms = [];
	let temp;
	let validatedArgs;
	if (tag.attributes?.transform) {
		// log(`Detected transforms`);
		temp = tag.attributes.transform.replaceAll(',', ' ');
		temp = temp.replaceAll('  ', ' ');
		temp = temp.toLowerCase();
		temp = temp.split(')');
		temp.forEach((value) => {
			let data = value.split('(');
			if (data.length === 2) {
				data[0] = data[0].trim();
				data[1] = data[1].trim();
				if (supported.indexOf(data[0]) > -1) {
					validatedArgs = data[1].split(' ');
					validatedArgs = validatedArgs.map((arg) => Number(arg));
					transforms.push({
						name: data[0],
						args: validatedArgs,
					});
				}
			}
		});
	}

	/*
		transform-origin attribute
		ignore keyword values
		(x, y, z) // default to 0,0 - ignore z value
	*/
	if (tag.attributes['transform-origin']) {
		log(`Detected transform origin`);
		temp = tag.attributes['transform-origin'];
		temp = temp.replaceAll(',', ' ');
		temp = temp.replaceAll('  ', ' ');
		validatedArgs = temp.split(' ');
		validatedArgs = validatedArgs.map((arg) => Number(arg));
		transforms.push({
			name: 'origin',
			args: validatedArgs,
		});
	}

	// Finish up
	log(transforms);
	return transforms;
}

/**
 * Applies transforms to data in Bezier Data Format
 * @param {Array} bezierPaths - Collection of Bezier Paths to transform
 * @param {Array} transformData - Collection of transforms to apply
 * @returns {Array} - bezierPaths array
 */
export function applyTransformData(bezierPaths = [], transformData = []) {
	log(`\napplyTransformData`);
	log(`\t P A S S E D\n`);
	log('bezierPaths');
	log(JSON.stringify(bezierPaths));
	log('transformData');
	log(transformData);

	log(`\t V A L I D A T E D\n`);
	const resultBezierPaths = structuredClone(bezierPaths);
	log(`\t RESULT BEZIER PATHS (start)\n`);
	log(JSON.stringify(resultBezierPaths));

	// Transforms get applied from right to left in the
	// order they were included from the attribute
	let orderedTransforms = transformData.reverse();
	let originData = [0, 0];
	for (let t = 0; t < orderedTransforms.length; t++) {
		if (orderedTransforms[t].name === 'origin') {
			originData = orderedTransforms.splice(t, 1);
			originData = originData[0].args;
			break;
		}
	}
	log(`\t ORDERED TRANSFORMS\n`);
	log(JSON.stringify(orderedTransforms));
	log(`originData: ${originData.toString()}`);

	// Start transforming
	orderedTransforms.forEach((oneTransform) => {
		if (transformCurve[oneTransform.name]) {
			log(`\n\t${oneTransform.name}`);
			const transformFn = transformCurve[oneTransform.name];
			resultBezierPaths.forEach((singlePath, pathIndex) => {
				singlePath.forEach((singleCurve, curveIndex) => {
					log(`\n~~~ TRANSFORM CURVE ${curveIndex}`);
					// log(`\t\tbefore transform:`);
					// logCurve(singleCurve);

					const resultCurve = transformFn(singleCurve, oneTransform.args, originData);
					resultBezierPaths[pathIndex][curveIndex] = resultCurve;

					// log(`\t\tafter transform:`);
					// logCurve(resultBezierPaths[pathIndex][curveIndex]);
				});
			});
		}
	});

	log(`\n\t AFTER TRANSFORM PATHS\n`);
	log(JSON.stringify(resultBezierPaths));
	return resultBezierPaths;
}

/*
		Individual transform functions
*/

// Map transform names to their conversion function
const transformCurve = {
	matrix: matrixTransformCurve,
	translate: translateTransformCurve,
	scale: scaleTransformCurve,
	rotate: rotateTransformCurve,
	skewx: skewxTransformCurve,
	skewy: skewyTransformCurve,
};

function matrixTransformCurve(curve = [], args = [], origin = []) {
	log(`:: TRANSFORM CURVE :: matrix`);
	const resultCurve = [];
	while (args.length < 6) args.push(0);
	log(`\t\tmatrix: ${args.toString()}`);

	function calculateNewPoint(oldPoint) {
		if (oldPoint === false) return false;
		const oldX = oldPoint.x;
		const oldY = oldPoint.y;
		const newPoint = { x: 0, y: 0 };
		newPoint.x = roundAndSanitize(1 * args[0] * oldX + 1 * args[2] * oldY + 1 * args[4]);
		newPoint.y = roundAndSanitize(1 * args[1] * oldX + 1 * args[3] * oldY + 1 * args[5]);

		return newPoint;
	}

	resultCurve[0] = calculateNewPoint(curve[0]);
	resultCurve[1] = calculateNewPoint(curve[1]);
	resultCurve[2] = calculateNewPoint(curve[2]);
	resultCurve[3] = calculateNewPoint(curve[3]);

	return resultCurve;
}

function translateTransformCurve(curve = [], args = [], origin = []) {
	log(`:: TRANSFORM CURVE :: translate`);
	const resultCurve = [];
	const dx = args[0] || 0;
	const dy = args[1] || 0;
	log(`\t\ttranslate: ${dx}, ${dy}`);
	log(`\t\tcurve[0]: ${curve[0].x}, ${curve[0].y}`);

	function calculateNewPoint(oldPoint) {
		if (oldPoint === false) return false;
		const newPoint = { x: 0, y: 0 };
		newPoint.x = roundAndSanitize(oldPoint.x + dx);
		newPoint.y = roundAndSanitize(oldPoint.y + dy);

		return newPoint;
	}

	resultCurve[0] = calculateNewPoint(curve[0]);
	resultCurve[1] = calculateNewPoint(curve[1]);
	resultCurve[2] = calculateNewPoint(curve[2]);
	resultCurve[3] = calculateNewPoint(curve[3]);

	return resultCurve;
}

function scaleTransformCurve(curve = [], args = [], origin = []) {
	log(`:: TRANSFORM CURVE :: scale`);
	const scaleX = args[0];
	let scaleY = args[1];
	if (!scaleY) scaleY = scaleX;
	const resultCurve = [];
	log(`\t\tscale args: ${args.toString()}`);
	log(`\t\tscale validated: ${scaleX}, ${scaleY}`);

	function calculateNewPoint(oldPoint) {
		if (oldPoint === false) return false;
		const newPoint = { x: 0, y: 0 };
		newPoint.x = roundAndSanitize(oldPoint.x * scaleX);
		newPoint.y = roundAndSanitize(oldPoint.y * scaleY);

		return newPoint;
	}

	resultCurve[0] = calculateNewPoint(curve[0]);
	resultCurve[1] = calculateNewPoint(curve[1]);
	resultCurve[2] = calculateNewPoint(curve[2]);
	resultCurve[3] = calculateNewPoint(curve[3]);

	return resultCurve;
}

function rotateTransformCurve(curve = [], args = [], origin = []) {
	log(`:: TRANSFORM CURVE :: rotate`);
	log(`origin: ${origin.toString()}`);
	const angle = angleToRadians(args[0]);
	const about = { x: 0, y: 0 };
	if (!args[1]) args[1] = 0;
	if (!args[2]) args[2] = 0;

	about.x = args[1] + origin[0];
	about.y = args[2] + origin[1];

	const resultCurve = [];
	log(`\t\trotate args: ${args.toString()}`);
	log(`\t\trotate validated: ${angle}`);
	log(`\t\trotate about: ${about.x}, ${about.y}`);

	function calculateNewPoint(point) {
		if (!point) return false;

		const newPoint = { x: 0, y: 0 };
		newPoint.x = roundAndSanitize(
			Math.cos(angle) * (point.x - about.x) - Math.sin(angle) * (point.y - about.y) + about.x
		);
		newPoint.y = roundAndSanitize(
			Math.sin(angle) * (point.x - about.x) + Math.cos(angle) * (point.y - about.y) + about.y
		);

		// log(newPoint);
		// log('rotate', 'end');
		return newPoint;
	}

	resultCurve[0] = calculateNewPoint(curve[0]);
	resultCurve[1] = calculateNewPoint(curve[1]);
	resultCurve[2] = calculateNewPoint(curve[2]);
	resultCurve[3] = calculateNewPoint(curve[3]);

	return resultCurve;
}

function skewxTransformCurve(curve = [], args = [], origin = []) {
	log(`:: TRANSFORM CURVE :: skewx`);
	const resultCurve = [];
	log(`\t\tskewx: ${args.toString()}`);
	const radians = angleToRadians(args[0]);
	const yMultiplier = Math.tan(radians);

	function calculateNewPoint(oldPoint) {
		if (!oldPoint) return false;
		const oldX = oldPoint.x;
		const oldY = oldPoint.y;
		const newPoint = { x: 0, y: 0 };

		newPoint.x = roundAndSanitize(oldX + yMultiplier * oldY);
		newPoint.y = roundAndSanitize(oldY);

		return newPoint;
	}

	resultCurve[0] = calculateNewPoint(curve[0]);
	resultCurve[1] = calculateNewPoint(curve[1]);
	resultCurve[2] = calculateNewPoint(curve[2]);
	resultCurve[3] = calculateNewPoint(curve[3]);

	return resultCurve;
}

function skewyTransformCurve(curve = [], args = [], origin = []) {
	log(`:: TRANSFORM CURVE :: skewy`);
	const resultCurve = [];
	log(`\t\tskewy: ${args.toString()}`);
	const radians = angleToRadians(args[0]);
	const xMultiplier = Math.tan(radians);

	function calculateNewPoint(oldPoint) {
		if (!oldPoint) return false;
		const oldX = oldPoint.x;
		const oldY = oldPoint.y;
		const newPoint = { x: 0, y: 0 };

		newPoint.x = roundAndSanitize(oldX);
		newPoint.y = roundAndSanitize(oldY + xMultiplier * oldX);

		return newPoint;
	}

	resultCurve[0] = calculateNewPoint(curve[0]);
	resultCurve[1] = calculateNewPoint(curve[1]);
	resultCurve[2] = calculateNewPoint(curve[2]);
	resultCurve[3] = calculateNewPoint(curve[3]);

	return resultCurve;
}

/*
	Helper functions
*/
function angleToRadians(angle) {
	let result = (Math.PI / 180) * parseFloat(angle);
	return result;
}

function logCurve(curve) {
	// console.log(JSON.stringify(curve));
	console.table({
		x: [curve[0].x, curve[1]?.x, curve[2]?.x, curve[3].x],
		y: [curve[0].y, curve[1]?.y, curve[2]?.y, curve[3].y],
	});
}
