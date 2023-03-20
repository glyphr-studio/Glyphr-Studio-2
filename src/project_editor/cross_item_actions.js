import { getCurrentProject } from '../app/main.js';
import { hasNonValues, rad, trim } from '../common/functions.js';
import { Glyph } from '../project_data/glyph.js';
import { getOverallMaxes, isAllZeros, Maxes } from '../project_data/maxes.js';
import { Path } from '../project_data/path.js';

// --------------------------------------------------------------
// Project-wide .changed()
// --------------------------------------------------------------

/**
 * Calls .changed() on peer glyph objects to this glyph
 * NOTE: .changed() for other glyph elements are on their respective
 * objects. This one is centrally located because it looks across
 * the whole project.
 * @param {Glyph} glyph - glyph to mark as changed
 */
export function glyphChanged(glyph) {
	recalculateGlyphMaxes(glyph);
	if (glyph.cache) glyph.cache = {};
	const project = getCurrentProject();

	// log(`calling changed on usedIn`);
	glyph.usedIn.forEach(itemID => {
		const item = project.getItem(itemID);
		if (item) glyphChanged(item);
	});
}

// --------------------------------------------------------------
// Get / Make Glyph Maxes
// --------------------------------------------------------------

export function getGlyphMaxes(glyph) {
	// log('Glyph GET maxes', 'start');
	// log('cache before')
	if (!glyph.cache.maxes) {
		// log('detected no maxes cache');
		recalculateGlyphMaxes(glyph);
	} else if (hasNonValues(glyph.cache.maxes)) {
		// log('detected hasNonValues');
		recalculateGlyphMaxes(glyph);
	} else if (isAllZeros(glyph.cache.maxes)) {
		// log('detected all values zero');
		recalculateGlyphMaxes(glyph);
	} else {
		// log('NO DETECTION to recalculate');
	}

	// log('cache after');
	// log(json(glyph.cache, true));
	// log('Glyph GET maxes', 'end');
	return glyph.cache.maxes;
}
/**
 * Calculate the overall maxes for this Glyph
 * @returns {Maxes}
 */
export function recalculateGlyphMaxes(glyph) {
	// log(`recalculateGlyphMaxes - START `);

	let temp = { xMax: 0, xMin: 0, yMax: 0, yMin: 0 };
	// log(glyph.paths);
	if (glyph.paths && glyph.paths.length > 0) {
		// log('... has paths, calling getOverallMaxes');
		temp = getOverallMaxes(
			glyph.paths.map((item) => {
				if (item.objType === 'Path') return item.maxes;
				else return getTransformedGlyph(item).maxes;
			})
		);
	}

	glyph.cache.maxes = new Maxes(temp);
	// log(`result`);
	// log(glyph.cache);
	// log(`recalculateGlyphMaxes`, 'end');
	return glyph.cache.maxes;
}

// --------------------------------------------------------------
// Get / Make Transformed Glyph
// --------------------------------------------------------------
/**
 * Component Instances are basically links to other Glyphs, plus some transformations.
 * This function grabs a clone of the linked-to Glyph, applies the transformations,
 * and returns a Glyph object - while also updating the cache
 * @param {ComponentInstance}
 * @returns {Glyph}
 */

export function getTransformedGlyph(componentInstance) {
	const project = getCurrentProject();
	const linkedGlyph = project.getItem(componentInstance.link);
	if (!linkedGlyph.cache.transformedGlyph) {
		linkedGlyph.cache.transformedGlyph = makeTransformedGlyph(linkedGlyph);
	}
	return linkedGlyph.cache.transformedGlyph;
}

export function makeTransformedGlyph(componentInstance) {
	// log('ComponentInstance.makeTransformedGlyph', 'start');
	// log(`name: ${this.name}`);
	const project = getCurrentProject();
	const linkedGlyph = project.getItem(componentInstance.link);
	if (!linkedGlyph) {
		console.warn(`
				Tried to get Component: ${componentInstance.link} but it
				doesn't exist - bad usedIn array maintenance.
			`);
		return false;
	}

	let newGlyph = new Glyph(linkedGlyph);
	newGlyph = convertLinksToPaths(newGlyph);

	// log(`translateX: ${componentInstance.translateX}`);
	// log(`translateY: ${componentInstance.translateY}`);
	// log(`resizeWidth: ${componentInstance.resizeWidth}`);
	// log(`resizeHeight: ${componentInstance.resizeHeight}`);
	// log(`flipEW: ${componentInstance.isFlippedEW}`);
	// log(`flipNS: ${componentInstance.isFlippedNS}`);
	// log(`reverseWinding: ${componentInstance.reverseWinding}`);
	// log(`rotation: ${componentInstance.rotation}`);

	if (
		componentInstance.translateX ||
		componentInstance.translateY ||
		componentInstance.resizeWidth ||
		componentInstance.resizeHeight ||
		componentInstance.isFlippedEW ||
		componentInstance.isFlippedNS ||
		componentInstance.reverseWinding ||
		componentInstance.rotation
	) {
		// log('Modifying w ' + componentInstance.resizeWidth + ' h ' + componentInstance.resizeHeight);
		// log('before maxes ' + json(newGlyph.maxes, true));
		if (componentInstance.rotateFirst)
			newGlyph.rotate(rad(componentInstance.rotation, newGlyph.maxes.center));
		if (componentInstance.isFlippedEW) newGlyph.flipEW();
		if (componentInstance.isFlippedNS) newGlyph.flipNS();
		newGlyph.updateGlyphPosition(componentInstance.translateX, componentInstance.translateY, true);
		newGlyph.updateGlyphSize(componentInstance.resizeWidth, componentInstance.resizeHeight, false);
		if (componentInstance.reverseWinding) newGlyph.reverseWinding();
		if (!componentInstance.rotateFirst)
			newGlyph.rotate(rad(componentInstance.rotation, newGlyph.maxes.center));
		// log('afters maxes ' + json(newGlyph.maxes, true));
	} else {
		// log('Not changing, no deltas');
	}

	// log(newGlyph);
	// log('ComponentInstance.makeTransformedGlyph', 'end');

	return newGlyph;
}

// --------------------------------------------------------------
// Make other languages
// --------------------------------------------------------------

export function makeGlyphSVGforExport(glyph) {
	// log('Glyph.makeSVGforExport', 'start');
	// log(glyph);
	let size = Math.max(glyph.maxes.height, glyph.maxes.width);
	let svg = getGlyphSVGPathData(glyph);
	// log(svg);

	let re = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" `;
	re += `width="${size}" height="${size}" viewBox="0,0,${size},${size}">\n`;
	re += `\t<g transform="translate(100,${size})">\n`;
	re += `\t\t<path d="${svg}"/>\n`;
	re += `\t</g>\n</svg>`;

	// log(re);
	// log('Glyph.makeSVGforExport', 'end');
	return re;
}

/**
 * Get / Make the data (attribute d="") for an SVG path tag
 * @param {Glyph} - glyph object to get/make the path data for
 * @returns {string} - SVG definition for the path d="" attribute
 */
export function getGlyphSVGPathData(glyph) {
	if (!glyph.cache.svgPathData) {
		glyph.cache.svgPathData = makeGlyphSVGPathData(glyph);
	}
	return glyph.cache.svgPathData;
}

export function makeGlyphSVGPathData(glyph) {
	// log(`makeGlyphSVGPathData()`, 'start');

	let pathData = '';

	// Make Path Data
	glyph.paths.forEach((item) => {
		// log(`item ${j} of ${glyph.paths.length}`);
		// log(item);
		// log(`PATH DATA START`);
		// log(pathData);
		if (item.objType === 'ComponentInstance') {
			const workingItem = getTransformedGlyph(item);
			if (workingItem) pathData += makeGlyphSVGPathData(workingItem);
		} else {
			pathData += item.svgPathData;
			pathData += ' ';
		}
		// log(`PATH DATA END`);
		// log(pathData);
	});

	if (trim(pathData) === '') pathData = 'M0,0Z';
	// log(`RETURNING`);
	// log(pathData);
	// log(`makeGlyphSVGPathData()`, 'end');
	return pathData;
}

/**
 * Make a PostScript path from this path
 * PostScript paths use relative MoveTo commands, so
 * this path must know about where the last path left off
 * @param {number} lastX - x from previous path
 * @param {number} lastY - y from previous path
 * @returns {string} - PostScript path data
 */
export function makeGlyphPostScript(glyph, lastX, lastY) {
	const g = makeTransformedGlyph(glyph);
	let re;
	let part;
	g.paths.forEach((path) => {
		part = path.makePostScript(lastX, lastY);
		lastX = part.lastX;
		lastY = part.lastY;
		re += part.re;
	});
	return {
		re: re,
		lastX: lastX,
		lastY: lastY,
	};
}

// --------------------------------------------------------------
// Component links and usedin array stuff
// --------------------------------------------------------------

/**
 * Converts all the Component Instances in this Glyph to stand-alone paths
 * @returns {Glyph}
 */
export function convertLinksToPaths(glyph) {
	// log(`convertLinksToPaths`, 'start');

	const newPaths = [];
	let newItem;
	glyph.paths.forEach((item) => {
		if (item.objType === 'Path') {
			newItem = new Path(item);
			newItem.parent = glyph;
			newPaths.push(newItem);
		} else if (item.objType === 'ComponentInstance') {
			item.transformedGlyph.paths.forEach((tgItem) => {
				newItem = new Path(tgItem);
				newItem.parent = glyph;
				newPaths.push(newItem);
			});
		} else {
			// log('Glyph.convertLinksToPaths', - ERROR - none path or ci in paths array');
		}
	});
	glyph.paths = newPaths;

	// log(`convertLinksToPaths`, 'end');
	return glyph;
}

/**
 * Component Instances contain links to other Glyphs, or
 * other Component Instances.  Circular links cause the world
 * to explode, so let's check for those before we add a new link.
 * @param {string} componentID - ID of component to look for
 * @returns {boolean}
 */
export function canAddComponent(destinationGlyph, componentID) {
	// log('Glyph.canAddComponent', 'start');
	// log('adding ' + componentID + ' to (me) ' + destinationGlyph.id);
	if (destinationGlyph.id === componentID) return false;
	if (destinationGlyph.usedIn.length === 0) return true;
	let downlinks = collectAllDownstreamLinks(destinationGlyph, [], true);
	downlinks = downlinks.filter(function (elem, pos) {
		return downlinks.indexOf(elem) === pos;
	});
	let uplinks = collectAllUpstreamLinks(destinationGlyph, []);
	uplinks = uplinks.filter(function (elem, pos) {
		return uplinks.indexOf(elem) === pos;
	});
	// log('downlinks: ' + downlinks);
	// log('uplinks: ' + uplinks);
	if (downlinks.indexOf(componentID) > -1) return false;
	if (uplinks.indexOf(componentID) > -1) return false;

	return true;
}

/**
 * Look "down" through component instances, collecting IDs
 * @param {array} re - collection of glyph IDs
 * @param {boolean} excludePeers - At the top level, no need to collect IDs
 * @returns {array}
 */
function collectAllDownstreamLinks(glyph, re = [], excludePeers = false) {
	for (let s = 0; s < glyph.paths.length; s++) {
		if (glyph.paths[s].objType === 'ComponentInstance') {
			re = re.concat(
				getCurrentProject().getItem(glyph.paths[s].link).collectAllDownstreamLinks(re)
			);
			if (!excludePeers) re.push(glyph.paths[s].link);
		}
	}
	return re;
}

/**
 * Look "up" through the usedIn array to collect IDs
 * @param {array} re - collection of glyph IDs
 * @returns {array}
 */
function collectAllUpstreamLinks(glyph, re = []) {
	for (let g = 0; g < glyph.usedIn.length; g++) {
		re = re.concat(getCurrentProject().getItem(glyph.usedIn[g]).collectAllUpstreamLinks(re));
		re.push(glyph.usedIn[g]);
	}
	return re;
}

/**
 * This method is called on Glyphs just before they are deleted
 * to clean up all the component instance linking
 * @param {Glyph} glyph - ID of the glyph being deleted
 */
export function deleteLinks(glyph) {
	// log('Glyph.deleteLinks', 'start');
	// log('passed this as id: ' + glyph.id);
	// Delete upstream Component Instances
	let upstreamGlyph;
	const project = getCurrentProject();
	for (let c = 0; c < glyph.usedIn.length; c++) {
		upstreamGlyph = project.getItem(glyph.usedIn[c]);
		// log('removing from ' + upstreamGlyph.name);
		// log(upstreamGlyph.paths);
		for (let u = 0; u < upstreamGlyph.paths.length; u++) {
			if (
				upstreamGlyph.paths[u].objType === 'ComponentInstance' &&
				upstreamGlyph.paths[u].link === glyph.id
			) {
				upstreamGlyph.paths.splice(u, 1);
				u--;
			}
		}
		// log(upstreamGlyph.paths);
	}
	// Delete downstream usedIn array values
	for (let s = 0; s < glyph.paths.length; s++) {
		if (glyph.paths[s].objType === 'ComponentInstance') {
			glyph.removeFromUsedIn(glyph.paths[s].link, glyph.id);
		}
	}
}
