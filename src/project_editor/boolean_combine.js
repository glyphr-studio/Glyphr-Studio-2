// import { paper } from '../app/app.js';
import paperCore from 'paper/dist/paper-core';
import { ioSVG_convertSVGTagsToGlyph } from '../formats_io/svg_outline_import.js';

const paper = paperCore;
paper.setup('');

/**
 * Combines an array of paths, separating them out by winding
 * @param {Array} gsPaths - paths to combine
 * @param {String} operation - how to combine the paths
 * @returns {Array | String} - resulting paths
 */
export function combinePaths(gsPaths = [], operation = 'unite') {
	// log(`combinePaths`, 'start');
	// log(`operation: ${operation}`);

	// Initial checks
	if (gsPaths.length === 0) return 'No paths were found to combine.';
	if (['divide', 'subtract', 'intersect', 'unite', 'exclude'].indexOf(operation) < 0) {
		return `Unknown combine operation: ${operation}`;
	}

	// Convert to Paper
	let inputPaths = [];
	gsPaths.forEach((gsPath) => {
		inputPaths = inputPaths.concat(convertToPaperPath(gsPath));
	});
	// log(`\n⮟paperPaths⮟`);
	// console.table(inputPaths);

	// Combine
	let combinedPath;
	if (operation === 'divide') {
		let resultPaths = combineDividePaths(inputPaths);
		combinedPath = new paper.CompoundPath({ children: resultPaths });
	} else if (operation === 'subtract') {
		const cutterPath = inputPaths.pop();
		let resultSubtractions = [];
		inputPaths.forEach((subjectPath) => resultSubtractions.push(subjectPath.subtract(cutterPath)));
		combinedPath = new paper.CompoundPath({ children: resultSubtractions });
	} else if (operation === 'intersect') {
		combinedPath = inputPaths.shift();
		inputPaths.forEach((path) => (combinedPath = combinedPath.intersect(path)));
	} else {
		combinedPath = new paper.Path();
		inputPaths.forEach((path) => {
			if (operation === 'unite') combinedPath = combinedPath.unite(path);
			if (operation === 'exclude') combinedPath = combinedPath.exclude(path);
			if (operation === 'intersect') combinedPath = combinedPath.intersect(path);
		});
	}

	// log(`\n⮟combinedPath⮟`);
	// log(combinedPath);

	// Convert back to Glyphr Studio
	let newGSPaths = [];
	if (combinedPath?.children) {
		combinedPath.children.forEach((path) => {
			newGSPaths = newGSPaths.concat(convertToGlyphrStudioPaths(path));
		});
	} else if (combinedPath?.segments?.length) {
		newGSPaths = convertToGlyphrStudioPaths(combinedPath);
	}
	// log(`\n⮟newGSPaths⮟`);
	// log(newGSPaths);

	// log(`combinePaths`, 'end');
	return newGSPaths;
}

/**
 * Given an array of paper.js Path objects, use those paths both
 * as cutters and bases, to achieve a "pathfinder" like divide result
 * @param {Array} paths - paper.js Path objects to divide
 * @returns {Array} - paper.js Path objects results
 */
function combineDividePaths(paths = []) {
	for (let b = 0; b < paths.length; b++) {
		let basePath = paths[b];
		for (let c = 0; c < b; c++) {
			const cutterPath = paths[c];
			if (basePath.intersects(cutterPath)) {
				// Hacky thing to make paper return the appropriate divided paths
				new paper.Layer([cutterPath, basePath]).exportSVG();

				const divideResult = cutterPath.divide(basePath);
				let results = divideResult.children || [divideResult];
				results = results.filter((path) => path.segments.length);
				results.forEach((path) => (path.closed = 'true'));

				const subtractedPath = basePath.subtract(cutterPath);
				let subtractedPaths = subtractedPath.children || [subtractedPath];
				subtractedPaths = subtractedPaths.filter((path) => path.segments.length);

				if (results.length) {
					paths.splice(c, 1);
					paths.splice(c, 0, ...results);
					c += results.length - 1;
					b += results.length - 1;
				}

				paths.splice(b, 1, ...subtractedPaths);
				basePath = paths[b];
			}
		}
	}

	return paths;
}

// --------------------------------------------------------------
// Conversion Functions
// --------------------------------------------------------------

/**
 * Converts a Glyphr Studio path to a Paper path
 * @param {Object} gsPath - the Glyphr Studio Path to convert
 * @returns {paper.Path} - paper.js Path
 */
function convertToPaperPath(gsPath) {
	// log(`convertToPaperPath`, 'start');
	// log(`\n⮟gsPath⮟`);
	// log(gsPath);

	const pathData = gsPath.svgPathData;
	const resultPath = new paper.Path(pathData);

	// log(`\n⮟resultPath⮟`);
	// log(resultPath);
	// log(`convertToPaperPath`, 'end');
	return resultPath;
}

/**
 * Converts a Paper path to a Glyphr Studio path
 * @param {paper.Path} paperPath - paper.js Path to convert
 * @returns {Array} - Array of Glyphr Studio paths
 */
function convertToGlyphrStudioPaths(paperPath) {
	// log(`convertToGlyphrStudioPaths`, 'start');
	const paperPathData = paperPathSVGData(paperPath);
	// log(paperPathData);
	if (paperPathData === '') return [];

	let newGSPaths = [];
	let newGSGlyph = ioSVG_convertSVGTagsToGlyph(
		`<svg><path d="${paperPathData}"></path></svg>`,
		false
	);

	if (!newGSGlyph.shapes) return [];
	else newGSPaths = newGSGlyph.shapes;

	// log(`\n⮟newGSPaths⮟`);
	// log(clone(newGSPaths));
	// log(`convertToGlyphrStudioPaths`, 'end');
	return newGSPaths;
}

/**
 * Gets the equivalent SVG <path d=""> attribute value from a Paper path
 * @param {paper.Path} paperPath - path to get the data from
 * @returns {String} - "d" attribute data
 */
function paperPathSVGData(paperPath) {
	// log(`paperPathSVGData`, 'start');
	// log(paperPath);
	const pathSVG = paperPath.exportSVG();
	// log(pathSVG);
	let result = '';
	if (typeof pathSVG !== 'string') result = pathSVG.getAttribute('d');

	// log(result);
	// log(`paperPathSVGData`, 'end');
	return result;
}
