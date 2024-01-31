// import * as paper from '../lib/paper-core.js';
// --------------------------------------------------------------
// Combine all paths

import { getCurrentProjectEditor } from '../app/main';
import { addPathToCurrentItem } from '../edit_canvas/tools/tools';
import { ioSVG_convertSVGTagsToGlyph } from '../formats_io/svg_outline_import';

// --------------------------------------------------------------
const paper = window.paper;
/**
 * Combines an array of paths, separating them out by winding
 * @param {Array} paths - paths to combine
 * @returns {Array} - resulting paths
 */
export function combineAllPaths(gsPaths = []) {
	log(`combineAllPaths (PAPER)`, 'start');
	log(`\n⮟gsPaths⮟`);
	log(gsPaths);

	paper.setup();

	const paperPaths = [];

	gsPaths.forEach((gsPath) => {
		paperPaths.push(new paper.Path(gsPath.makeSVGPathData()));
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

	const newPathData = combinedPath.exportSVG().getAttribute('d');

	const newGSPaths = ioSVG_convertSVGTagsToGlyph(
		`<svg><path d="${newPathData}"></path></svg>`
	).shapes;
	log(`\n⮟newGSPaths⮟`);
	log(newGSPaths);
	const editor = getCurrentProjectEditor();
	editor.multiSelect.shapes.deleteShapes();
	newGSPaths.forEach((newPath) => addPathToCurrentItem(newPath));

	log(`combineAllPaths (PAPER)`, 'end');
}
