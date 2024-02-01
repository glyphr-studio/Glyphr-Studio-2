// import * as paper from '../lib/paper-core.js';
// --------------------------------------------------------------
// Combine all paths

import { paper } from '../app/app';
import { getCurrentProjectEditor } from '../app/main';
import { addPathToCurrentItem } from '../edit_canvas/tools/tools';
import { convert_makeGlyphrStudioPath, convert_makePaperPath } from '../paper_conversions';

// --------------------------------------------------------------

/**
 * Combines an array of paths, separating them out by winding
 * @param {Array} paths - paths to combine
 * @returns {Array} - resulting paths
 */
export function combineAllPaths(gsPaths = []) {
	log(`combineAllPaths (PAPER)`, 'start');
	log(`\n⮟gsPaths⮟`);
	log(gsPaths);

	let paperPaths = [];

	gsPaths.forEach((gsPath) => {
		paperPaths = paperPaths.concat(convert_makePaperPath(gsPath));
	});

	log(`\n⮟paperPaths⮟`);
	log(paperPaths);

	let combinedPath = new paper.Path();

	paperPaths.forEach((paperPath) => {
		combinedPath = combinedPath.unite(paperPath);
	});

	log(`\n⮟combinedPath⮟`);
	log(combinedPath);
	log(combinedPath.exportSVG().getAttribute('d'));
	log(combinedPath.exportSVG());

	let newGSPaths = [];
	newGSPaths = convert_makeGlyphrStudioPath(combinedPath);

	log(`\n⮟newGSPaths⮟`);
	log(newGSPaths);
	const editor = getCurrentProjectEditor();
	editor.multiSelect.shapes.deleteShapes();
	newGSPaths.forEach((newPath) => addPathToCurrentItem(newPath));

	log(`combineAllPaths (PAPER)`, 'end');
}

export function paperRoundTripTest(gsPaths = []) {
	log(`paperRoundTripTest`, 'start');
	log(`\n⮟gsPaths⮟`);
	log(gsPaths);

	let newPaperPaths = [];

	gsPaths.forEach((gsPath) => {
		newPaperPaths = newPaperPaths.concat(convert_makePaperPath(gsPath));
	});

	log(`\n⮟newPaperPaths⮟`);
	log(newPaperPaths);

	let newGSPaths = [];

	newPaperPaths.forEach((paperPath) => {
		newGSPaths = newGSPaths.concat(convert_makeGlyphrStudioPath(paperPath));
	});

	log(`\n⮟newGSPaths⮟`);
	log(newGSPaths);

	const editor = getCurrentProjectEditor();
	editor.multiSelect.shapes.deleteShapes();
	newGSPaths.forEach((newPath) => addPathToCurrentItem(newPath));

	log(`paperRoundTripTest`, 'end');
}
