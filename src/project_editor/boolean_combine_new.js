import { paper } from '../app/app';
import { getCurrentProjectEditor, log } from '../app/main';
import { addPathToCurrentItem } from '../edit_canvas/tools/tools';
import { ioSVG_convertSVGTagsToGlyph } from '../formats_io/svg_outline_import';

/**
 * Combines an array of paths, separating them out by winding
 * @param {Array} paths - paths to combine
 * @returns {Array} - resulting paths
 */
export function combinePaths(gsPaths = [], operation = 'unite') {
	log(`combinePaths`, 'start');
	log(`operation: ${operation}`);
	// log(`\n⮟gsPaths⮟`);
	// log(gsPaths);

	// Convert to Paper
	let inputPaths = [];
	gsPaths.forEach((gsPath) => {
		inputPaths = inputPaths.concat(convertToPaperPath(gsPath));
	});
	log(`\n⮟paperPaths⮟`);
	console.table(inputPaths);

	// Combine
	let combinedPath;
	if (operation === 'divide') {
		let resultPaths = splitShapesOnEmptyPaths(inputPaths);
		combinedPath = new paper.CompoundPath({ children: resultPaths });
	} else if (operation === 'subtract') {
		let cutterPath = inputPaths.pop();
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

	log(`\n⮟combinedPath⮟`);
	log(combinedPath);

	// Convert back to Glyphr Studio
	let newGSPaths = [];
	if (combinedPath?.children) {
		combinedPath.children.forEach((path) => {
			newGSPaths = newGSPaths.concat(convertToGlyphrStudioPath(path));
		});
	} else if (combinedPath?.segments?.length) {
		newGSPaths = convertToGlyphrStudioPath(combinedPath);
	}
	log(`\n⮟newGSPaths⮟`);
	log(newGSPaths);

	log(`combinePaths`, 'end');
	return newGSPaths;
}

function splitShapesOnEmptyPaths(shapes = []) {
	// once the shapes have been cut down by the shapes above them, we can
	// cut the shapes on paths.
	for (let i = 0; i < shapes.length; i++) {
		let path = shapes[i];

		console.log('I have a path');
		for (let j = 0; j < i; j++) {
			const candidate = shapes[j];
			if (path.intersects(candidate)) {
				// this causes Paper to reset some part of state.
				// without it, paper will occasionally return empty on the divide.
				new paper.Layer([candidate, path]).exportSVG();

				let dividedShape = candidate.divide(path) && candidate.divide(path);

				let dividedShapes = dividedShape.children || [dividedShape];
				dividedShapes = dividedShapes.filter((s) => s.segments.length);
				dividedShapes.forEach((s) => {
					s.closed = 'true';
				});
				console.log({ dividedShapes });

				let subtractedPath = path.subtract(candidate);
				let subtractedPaths = subtractedPath.children || [subtractedPath];
				subtractedPaths = subtractedPaths.filter((s) => s.segments.length);
				console.log({ subtractedPaths });

				if (dividedShapes.length) {
					shapes.splice(j, 1);
					shapes.splice(j, 0, ...dividedShapes);
					j += dividedShapes.length - 1;
					i += dividedShapes.length - 1;
				}

				shapes.splice(i, 1, ...subtractedPaths);
				path = shapes[i];
			}
		}
	}

	return shapes;
}

/*
	[x] unite
	[ ] divide
	[x] subtract
	[x] exclude
	[x] intersect
*/

// --------------------------------------------------------------
// Conversion Functions
// --------------------------------------------------------------

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

function convertToGlyphrStudioPath(paperPath) {
	// log(`convertToGlyphrStudioPath`, 'start');
	const newGSPaths = ioSVG_convertSVGTagsToGlyph(
		`<svg><path d="${paperPathSVGData(paperPath)}"></path></svg>`
	).shapes;

	// log(`\n⮟newGSPaths[0]⮟`);
	// log(clone(newGSPaths[0]));
	// log(`convertToGlyphrStudioPath`, 'end');
	return newGSPaths;
}

function paperPathSVGData(paperPath) {
	// log(`paperPathSVGData`, 'start');
	// log(paperPath);
	const pathSVG = paperPath.exportSVG();
	// log(pathSVG);
	const result = pathSVG.getAttribute('d');
	// log(result);
	// log(`paperPathSVGData`, 'end');
	return result;
}

// --------------------------------------------------------------
// TEST FUNCTIONS
// --------------------------------------------------------------

export function paperRoundTripTest(gsPaths = []) {
	log(`paperRoundTripTest`, 'start');
	log(`\n⮟gsPaths⮟`);
	log(gsPaths);

	let newPaperPaths = [];

	gsPaths.forEach((gsPath) => {
		newPaperPaths = newPaperPaths.concat(convertToPaperPath(gsPath));
	});

	log(`\n⮟newPaperPaths⮟`);
	log(newPaperPaths);

	let newGSPaths = [];

	newPaperPaths.forEach((paperPath) => {
		newGSPaths = newGSPaths.concat(convertToGlyphrStudioPath(paperPath));
	});

	log(`\n⮟newGSPaths⮟`);
	log(newGSPaths);

	const editor = getCurrentProjectEditor();
	editor.multiSelect.shapes.deleteShapes();
	newGSPaths.forEach((newPath) => addPathToCurrentItem(newPath));

	log(`paperRoundTripTest`, 'end');
}
