import { paper } from '../app/app';
import { getCurrentProjectEditor } from '../app/main';
import { clone } from '../common/functions';
import { addPathToCurrentItem } from '../edit_canvas/tools/tools';
import { ioSVG_convertSVGTagsToGlyph } from '../formats_io/svg_outline_import';

/**
 * Combines an array of paths, separating them out by winding
 * @param {Array} paths - paths to combine
 * @returns {Array} - resulting paths
 */
export function combinePaths(gsPaths = [], operation = 'unite') {
	log(`combinePaths`, 'start');
	log(`\n⮟gsPaths⮟`);
	log(gsPaths);

	// Convert to Paper
	let paperPaths = [];

	gsPaths.forEach((gsPath) => {
		paperPaths = paperPaths.concat(convertToPaperPath(gsPath));
	});

	log(`\n⮟paperPaths⮟`);
	log(paperPaths);

	// Combine
	let combinedPath = new paper.Path();

	paperPaths.forEach((paperPath) => {
		if(operation === 'unite') combinedPath = combinedPath.unite(paperPath);
		if(operation === 'divide') combinedPath = combinedPath.divide(paperPath);
		if(operation === 'subtract') combinedPath = combinedPath.subtract(paperPath);
		if(operation === 'exclude') combinedPath = combinedPath.exclude(paperPath);
		if(operation === 'intersect') combinedPath = combinedPath.intersect(paperPath);
	});

	// Convert back to Glyphr Studio
	let newGSPaths = convertToGlyphrStudioPath(combinedPath);
	log(`\n⮟newGSPaths⮟`);
	log(newGSPaths);

	// Update the project
	const editor = getCurrentProjectEditor();
	editor.multiSelect.shapes.deleteShapes();
	newGSPaths.forEach((newPath) => addPathToCurrentItem(newPath));
	// TODO add history

	log(`combinePaths`, 'end');
}

// --------------------------------------------------------------
// Conversion Functions
// --------------------------------------------------------------

function convertToPaperPath(gsPath) {
	log(`convertToPaperPath`, 'start');
	log(`\n⮟gsPath⮟`);
	log(gsPath);

	const pathData = gsPath.svgPathData;
	log(`\n⮟pathData⮟`);
	log(pathData);
	const resultPath = new paper.Path(pathData);

	log(`\n⮟resultPath⮟`);
	log(resultPath);
	log(`convertToPaperPath`, 'end');
	return resultPath;
}

function convertToGlyphrStudioPath(paperPath) {
	log(`convertToGlyphrStudioPath`, 'start');

	const newPathSVG = paperPath.exportSVG();
	log(newPathSVG);
	const newGSPaths = ioSVG_convertSVGTagsToGlyph(
		`<svg><path d="${newPathSVG.getAttribute('d')}"></path></svg>`
	).shapes;

	log(`\n⮟newGSPaths[0]⮟`);
	log(clone(newGSPaths[0]));

	log(`convertToGlyphrStudioPath`, 'end');
	return newGSPaths;
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
