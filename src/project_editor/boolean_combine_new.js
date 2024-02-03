import { paper } from '../app/app';
import { getCurrentProjectEditor, log } from '../app/main';
import { valuesAreClose } from '../common/functions';
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
	log(inputPaths);

	// Combine
	let combinedPath;
	if (operation === 'divide') {
		// FIRST PASS
		log(`============================\n FIRST PASS`);
		let firstResult = [];
		inputPaths.forEach((cutter) => {
			inputPaths.forEach((base) => {
				if (cutter !== base && cutter.intersects(base)) {
					let cutResult = base.divide(cutter, { insert: false });
					log(`\n⮟cutResult⮟`);
					log(cutResult);
					firstResult = firstResult.concat(cutResult.children);
				}
			});
		});
		log(`firstResult.length: ${firstResult.length}`);
		firstResult = removeSimilarPaperPaths(firstResult);
		log(`firstResult.length: ${firstResult.length}`);
		log(`\n⮟firstResult⮟`);
		log(firstResult);

		// 	// SECOND PASS
		// 	log(`============================\n SECOND PASS`);
		// 	let secondResult = [];
		// 	inputPaths.forEach((base) => {
		// 		firstResult.forEach((cutter) => {
		// 			if (cutter !== base) {
		// 				let cutResult = base.divide(cutter);
		// 				if (cutResult.children) cutResult = cutResult.children;
		// 				else cutResult = [cutResult];
		// 				log(`\n⮟cutResult⮟`);
		// 				log(cutResult);
		// 				secondResult = secondResult.concat(cutResult);
		// 			}
		// 		});
		// 	});
		// 	secondResult = removeSimilarPaperPaths(secondResult);
		// 	secondResult = removeSimilarPaperPaths(secondResult, firstResult);
		// 	secondResult = removeSimilarPaperPaths(secondResult, inputPaths);
		// 	log(`\n⮟secondResult⮟`);
		// 	log(secondResult);

		// Finish up
		combinedPath = new paper.CompoundPath({ children: firstResult });
	} else if (operation === 'subtract') {
		let cutterPath = inputPaths.pop();
		let resultSubtractions = [];
		inputPaths.forEach((subjectPath) => resultSubtractions.push(subjectPath.subtract(cutterPath)));
		combinedPath = new paper.CompoundPath({ children: resultSubtractions });
	} else if (operation === 'intersect') {
		combinedPath = inputPaths.shift();
		inputPaths.forEach((paperPath) => (combinedPath = combinedPath.intersect(paperPath)));
	} else {
		combinedPath = new paper.Path();
		inputPaths.forEach((paperPath) => {
			if (operation === 'unite') combinedPath = combinedPath.unite(paperPath);
			if (operation === 'exclude') combinedPath = combinedPath.exclude(paperPath);
			if (operation === 'intersect') combinedPath = combinedPath.intersect(paperPath);
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
// Comparisons
// --------------------------------------------------------------

function arePaperSegmentsEquivalent(seg1, seg2) {
	let threshold = 0.0000001;

	// Point
	if (!valuesAreClose(seg1?.point?.x, seg2?.point?.x, threshold)) return false;
	if (!valuesAreClose(seg1?.point?.y, seg2?.point?.y, threshold)) return false;

	// Handle In
	if (seg1.handleIn && seg2.handleIn) {
		if (!valuesAreClose(seg1?.handleIn?.x, seg2?.handleIn?.x, threshold)) return false;
		if (!valuesAreClose(seg1?.handleIn?.y, seg2?.handleIn?.y, threshold)) return false;
	} else if (seg1.handleIn === undefined && seg2.handleIn === undefined) {
		// this is fine
	} else {
		return false;
	}

	// Handle Out
	if (seg1.handleOut && seg2.handleOut) {
		if (!valuesAreClose(seg1?.handleOut?.x, seg2?.handleOut?.x, threshold)) return false;
		if (!valuesAreClose(seg1?.handleOut?.y, seg2?.handleOut?.y, threshold)) return false;
	} else if (seg1.handleOut === undefined && seg2.handleOut === undefined) {
		// this is fine
	} else {
		return false;
	}

	// Passes everything, return true
	return true;
}

function arePaperPathsEquivalent(path1, path2) {
	if (!path1?.segments) {
		return false;
	} else if (!path2?.segments) {
		return false;
	} else if (path1?.segments?.length !== path2?.segments?.length) {
		return false;
	}

	for (let i = 0; i < path1.segments.length; i++) {
		let matchFound = false;
		for (let j = 0; j < path2.segments.length; j++) {
			if (arePaperSegmentsEquivalent(path1.segments[i], path2.segments[j])) {
				matchFound = true;
				break;
			}
		}
		if (!matchFound) return false;
	}

	return true;
}

function removeSimilarPaperPaths(paperPaths, checkPaths = false) {
	let results = [];
	if (!checkPaths) checkPaths = paperPaths;

	for (let i = 0; i < paperPaths.length; i++) {
		let subject = paperPaths[i];
		let isUnique = true;
		for (let j = i + 1; j < checkPaths.length; j++) {
			if (arePaperPathsEquivalent(subject, checkPaths[j])) {
				isUnique = false;
				break;
			}
		}
		if (isUnique) results.push(subject);
	}

	return results;
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
