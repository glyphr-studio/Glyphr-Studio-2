import { getCurrentProject } from '../app/main';

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
	// log(`Glyph.changed - Start`);
	glyph.recalculateMaxes();
	if (glyph.cache) glyph.cache = {};
	const project = getCurrentProject();

	// log(`calling changed on usedIn`);
	for (let g = 0; g < glyph.usedIn.length; g++) {
		glyphChanged(project.getGlyph(glyph.usedIn[g]));
	}
	// log(` Glyph.changed - End\n`);
}
/*
	changed(descend, ascend) {
			this.cache = {};
			if (ascend) {
					for (let g = 0; g < this.usedIn.length; g++) {
							getCurrentProject().getGlyph(this.usedIn[g]).changed(descend, ascend);
					}
			}
			if (descend) {
					for (let s = 0; s < this.paths.length; s++)
							this.paths[s].changed(descend, ascend);
			}
			this.recalculateMaxes();
	}
*/

// --------------------------------------------------------------
// Component Instance links
// --------------------------------------------------------------

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
				getCurrentProject().getGlyph(glyph.paths[s].link).collectAllDownstreamLinks(re)
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
		re = re.concat(getCurrentProject().getGlyph(glyph.usedIn[g]).collectAllUpstreamLinks(re));
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
		upstreamGlyph = project.getGlyph(glyph.usedIn[c]);
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
