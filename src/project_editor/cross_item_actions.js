import { getCurrentProject, log } from '../app/main.js';
import { Glyph } from '../project_data/glyph.js';
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
	// log(`glyphChanged`, 'start');
	// log(glyph);
	if (glyph.cache) glyph.cache = {};
	const project = getCurrentProject();
	glyph.usedIn.forEach((itemID) => {
		const item = project.getItem(itemID);
		if (item) {
			glyphChanged(item);
			if (item.paths) {
				item.paths.forEach(pathItem => {
					if (pathItem.objType === 'ComponentInstance') pathItem.cache = {};
				});
			}
		}
	});
	// log(`glyphChanged`, 'end');
}



// --------------------------------------------------------------
// Make other languages
// --------------------------------------------------------------

export function makeGlyphSVGforExport(glyph) {
	// log('Glyph.makeSVGforExport', 'start');
	// log(glyph);
	let size = Math.max(glyph.maxes.height, glyph.maxes.width);
	let svg = glyph.svgPathData;
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
 * Make a PostScript path from this path
 * PostScript paths use relative MoveTo commands, so
 * this path must know about where the last path left off
 * @param {number} lastX - x from previous path
 * @param {number} lastY - y from previous path
 * @returns {string} - PostScript path data
 */
export function makeGlyphPostScript(glyph, lastX, lastY) {
	const g = glyph.transformedGlyph;
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
export function makeGlyphWithResolvedLinks(sourceGlyph) {
	// log(`makeGlyphWithResolvedLinks`, 'start');
	let newPaths = [];
	sourceGlyph.paths.forEach((item) => {
		if (item.objType === 'Path') {
			newPaths.push(new Path(item));
		} else if (item.objType === 'ComponentInstance') {
			const transformedGlyph = item.transformedGlyph;
			if (transformedGlyph && transformedGlyph.paths) {
				const resolvedGlyph = makeGlyphWithResolvedLinks(transformedGlyph);
				newPaths = newPaths.concat(resolvedGlyph.paths);
			}
		}
	});

	// log(`makeGlyphWithResolvedLinks`, 'end');
	return new Glyph({ paths: newPaths, parent: getCurrentProject() });
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
			removeFromUsedIn(project.getItem(glyph.paths[s].link), glyph.id);
		}
	}
}

	// --------------------------------------------------------------
	// Used-In array
	// --------------------------------------------------------------

	/**
	 * When a Glyph is linked-to from another ComponentInstance, track
	 * where it's being used by adding it to glyph.usedIn
	 * @param {Glyph} glyph - reference to the Glyph
	 * @param {string} linkID - GlyphID where the Glyph is being used as a Component Instance
	 */
	export function addToUsedIn(glyph, linkID) {
		glyph.usedIn.push('' + linkID);
		// sort numerically as opposed to alpha
		glyph.usedIn.sort(function (a, b) {
			return a - b;
		});
	}

	/**
	 * Removes a link from a glyph's usedIn array
	 * @param {Glyph} glyph - reference to the Glyph
	 * @param {string} linkID - GlyphID where the Glyph is being used as a Component Instance
	 */
	export function removeFromUsedIn(glyph, linkID) {
		// log(`removeFromUsedIn`, 'start');
		// log(`linkID: ${linkID}`);
		// log(glyph.usedIn);

		const idIndex = glyph.usedIn.indexOf('' + linkID);
		// log(`idIndex: ${idIndex}`);

		if (idIndex !== -1) {
			// log(`Removing ${idIndex}`);

			glyph.usedIn.splice(idIndex, 1);
		}
		// log(glyph.usedIn);
		// log(`removeFromUsedIn`, 'end');
	}