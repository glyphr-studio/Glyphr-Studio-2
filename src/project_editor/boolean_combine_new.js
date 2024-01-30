// import * as paper from '../lib/paper-core.js';
// --------------------------------------------------------------
// Combine all paths
// --------------------------------------------------------------
const paper = window.paper;
/**
 * Combines an array of paths, separating them out by winding
 * @param {Array} paths - paths to combine
 * @returns {Array} - resulting paths
 */
export function combineAllPaths(paths = []) {
	paper.setup();
	let paperPath = new paper.Path();
	console.log(paperPath);
	console.log(paper.PathItem.unite(paperPath));
}
