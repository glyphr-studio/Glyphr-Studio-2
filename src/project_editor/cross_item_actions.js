import { getCurrentProject, getCurrentProjectEditor } from '../app/main.js';
import { showToast } from '../controls/dialogs/dialogs.js';
import { ComponentInstance } from '../project_data/component_instance.js';
import { Glyph } from '../project_data/glyph.js';
import { Path } from '../project_data/path.js';
/**
		Cross-item actions
		By default, items in the Glyph Element hierarchy shouldn't 'reach out' and
		make edits to other items. This is the role of the Project Editor. This
		file has many of these types of functions.
**/

/**
 * Project-wide changes
 * Calls .changed() on peer glyph objects to this glyph
 * NOTE: .changed() for other glyph elements are on their respective
 * objects. This one is centrally located because it looks across
 * the whole project.
 * @param {Glyph} glyph - glyph to mark as changed
 */
export function glyphChanged(glyph) {
	// log(`glyphChanged`, 'start');
	// log(glyph);
	if (glyph?.cache) glyph.cache = {};
	glyph.recalculateGlyphMaxes();
	const project = getCurrentProject();
	glyph.usedIn = glyph.usedIn || [];
	glyph.usedIn.forEach((itemID) => {
		const item = project.getItem(itemID);
		if (item) {
			glyphChanged(item);
			if (item.shapes) {
				item.shapes.forEach((shape) => {
					if (shape.objType === 'ComponentInstance') shape.cache = {};
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
 * @param {Number} lastX - x from previous path
 * @param {Number} lastY - y from previous path
 * @returns {String} - PostScript path data
 */
export function makeGlyphPostScript(glyph, lastX, lastY) {
	const g = glyph.transformedGlyph;
	let re;
	let part;
	g.shapes.forEach((shape) => {
		part = shape.makePostScript(lastX, lastY);
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
// Components
// --------------------------------------------------------------
export function insertComponentInstance(sourceID, destinationID, updateAdvanceWidth = false) {
	// log(`insertComponentInstance`, 'start');
	// log('sourceID: ' + sourceID + ' destinationID: ' + destinationID);
	const editor = getCurrentProjectEditor();
	const project = getCurrentProject();

	let select = !destinationID;
	destinationID = destinationID || editor.selectedItemID;
	let destinationGlyph = project.getItem(destinationID, true);

	if (canAddComponentInstance(destinationGlyph, sourceID)) {
		// log(`destinationGlyph`);
		// log(destinationGlyph);
		let sourceItem = project.getItem(sourceID, true);
		let name = `Instance of ${sourceItem.name}`;
		let newComponentInstance = new ComponentInstance({ link: sourceID, name: name });

		// log('INSERT COMPONENT - JSON: \t' + JSON.stringify(newComponentInstance));
		destinationGlyph.addOneShape(newComponentInstance);
		glyphChanged(destinationGlyph);
		if (select) {
			editor.multiSelect.shapes.select(newComponentInstance);
			editor.publish('whatShapeIsSelected', editor.multiSelect.shapes.singleton());
		}

		addLinkToUsedIn(sourceItem, destinationID);

		if (updateAdvanceWidth) destinationGlyph.advanceWidth = sourceItem.advanceWidth;
		// log(`insertComponentInstance`, 'end');
		return true;
	} else {
		showToast("A circular link was found, components can't include links to themselves.");
		// log(`insertComponentInstance`, 'end');
		return false;
	}
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
	// log(`\n⮟sourceGlyph⮟`);
	// log(sourceGlyph);
	let resolvedGlyph = new Glyph({
		id: 'glyph-with-resolved-links',
		name: 'Glyph with resolved links',
	});
	let newPaths = [];
	sourceGlyph.shapes.forEach((shape) => {
		// delete shape.__ID;
		// delete shape.parent;
		if (shape.objType === 'Path') {
			newPaths.push(new Path(shape));
		} else if (shape.objType === 'ComponentInstance') {
			const transformedGlyph = shape.transformedGlyph;
			if (transformedGlyph && transformedGlyph.shapes) {
				const resolvedGlyph = makeGlyphWithResolvedLinks(transformedGlyph);
				newPaths = newPaths.concat(resolvedGlyph.shapes);
			}
		}
	});
	resolvedGlyph.shapes = newPaths;
	resolvedGlyph.parent = getCurrentProject();
	// log(`\n⮟resolvedGlyph⮟`);
	// log(resolvedGlyph);
	// log(`makeGlyphWithResolvedLinks`, 'end');
	return resolvedGlyph;
}

/**
 * Component Instances contain links to other Glyphs, or
 * other Component Instances.  Circular links cause the world
 * to explode, so let's check for those before we add a new link.
 * @param {String} componentID - ID of component to look for
 * @returns {Boolean}
 */
export function canAddComponentInstance(destinationItem, componentID) {
	// log(`canAddComponentInstance`, 'start');
	// log(`destinationItem`);
	// log(destinationItem);
	// log(`componentID: ${componentID}`);

	// log('adding ' + componentID + ' to (me) ' + destinationItem.id);
	if (destinationItem.id === componentID) {
		// log(`canAddComponentInstance`, 'end');
		return false;
	}
	if (!destinationItem.usedIn || destinationItem.usedIn.length === 0) {
		// log(`canAddComponentInstance`, 'end');
		return true;
	}
	let downlinks = collectAllDownstreamLinks(destinationItem, [], true);
	downlinks = downlinks.filter(function (elem, pos) {
		// log(`canAddComponentInstance`, 'end');
		return downlinks.indexOf(elem) === pos;
	});
	let uplinks = collectAllUpstreamLinks(destinationItem, []);
	uplinks = uplinks.filter(function (elem, pos) {
		// log(`canAddComponentInstance`, 'end');
		return uplinks.indexOf(elem) === pos;
	});
	// log('downlinks: ' + downlinks);
	// log('uplinks: ' + uplinks);
	if (downlinks.indexOf(componentID) > -1) {
		// log(`canAddComponentInstance`, 'end');
		return false;
	}
	if (uplinks.indexOf(componentID) > -1) {
		// log(`canAddComponentInstance`, 'end');
		return false;
	}

	// log(`canAddComponentInstance`, 'end');
	return true;
}

/**
 * Look "down" through component instances, collecting IDs
 * @param {Array} result - collection of item IDs
 * @param {Boolean} excludePeers - At the top level, no need to collect IDs
 * @returns {Array}
 */
function collectAllDownstreamLinks(item, result = [], excludePeers = false) {
	item.shapes.forEach((shape) => {
		if (shape.objType === 'ComponentInstance') {
			const linkedShape = getCurrentProject().getItem(shape.link);
			result = result.concat(collectAllDownstreamLinks(linkedShape, result));
			if (!excludePeers) result.push(shape.link);
		}
	});
	return result;
}

/**
 * Look "up" through the usedIn array to collect IDs
 * @param {Array} result - collection of item IDs
 * @returns {Array}
 */
function collectAllUpstreamLinks(item, result = []) {
	item.usedIn.forEach((itemID) => {
		const linkedItem = getCurrentProject().getItem(itemID);
		result = result.concat(collectAllUpstreamLinks(linkedItem, result));
		result.push(itemID);
	});
	return result;
}

/**
 * This method is called on Glyphs just before they are deleted
 * to clean up all the component instance linking
 * @param {Glyph} item - item being deleted
 */
export function deleteLinks(item) {
	// log('Glyph.deleteLinks', 'start');
	// log('passed this as id: ' + item.id);
	// Delete upstream Component Instances
	let upstreamGlyph;
	const project = getCurrentProject();
	for (let c = 0; c < item.usedIn.length; c++) {
		upstreamGlyph = project.getItem(item.usedIn[c]);
		// log('removing from ' + upstreamGlyph.name);
		// log(upstreamGlyph.shapes);
		for (let u = 0; u < upstreamGlyph.shapes.length; u++) {
			if (
				upstreamGlyph.shapes[u].objType === 'ComponentInstance' &&
				upstreamGlyph.shapes[u].link === item.id
			) {
				upstreamGlyph.shapes.splice(u, 1);
				u--;
			}
		}
		// log(upstreamGlyph.shapes);
	}
	// Delete downstream usedIn array values
	for (let s = 0; s < item.shapes.length; s++) {
		if (item.shapes[s].objType === 'ComponentInstance') {
			removeLinkFromUsedIn(project.getItem(item.shapes[s].link), item.id);
		}
	}
}

// --------------------------------------------------------------
// Used-In array
// --------------------------------------------------------------

/**
 * When an Item is linked-to from another ComponentInstance, track
 * where it's being used by adding it to item.usedIn
 * @param {Glyph} item - reference to the item (Glyph, Component, Ligature)
 * @param {String} linkID - itemID where the item is being used as a Component Instance
 */
export function addLinkToUsedIn(item, linkID) {
	// log(`addLinkToUsedIn`, 'start');
	// log(`linkID: ${linkID}`);
	// log(`usedIn BEFORE:`);
	// log(item.usedIn);
	// log(item);
	item.usedIn.push('' + linkID);
	// sort numerically as opposed to alpha
	item.usedIn.sort(function (a, b) {
		return a - b;
	});
	// log(`usedIn AFTER:`);
	// log(item.usedIn);
	// log(`addLinkToUsedIn`, 'end');
}

/**
 * Removes a link from an item's usedIn array
 * @param {Glyph} item - reference to the item (Glyph, Component, Ligature)
 * @param {String} linkID - itemID where the item is being used as a Component Instance
 */
export function removeLinkFromUsedIn(item, linkID) {
	// log(`removeLinkFromUsedIn`, 'start');
	// log(`linkID: ${linkID}`);
	// log(item.usedIn);

	const idIndex = item.usedIn.indexOf('' + linkID);
	// log(`idIndex: ${idIndex}`);

	if (idIndex !== -1) {
		// log(`Removing ${idIndex}`);

		item.usedIn.splice(idIndex, 1);
	}
	// log(item.usedIn);
	// log(`removeLinkFromUsedIn`, 'end');
}
