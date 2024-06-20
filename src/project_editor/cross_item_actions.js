import { getCurrentProject, getCurrentProjectEditor } from '../app/main.js';
import { duplicates } from '../common/functions.js';
import { showToast } from '../controls/dialogs/dialogs.js';
import { copyShapesFromTo } from '../panels/actions.js';
import { ComponentInstance } from '../project_data/component_instance.js';
import { Glyph } from '../project_data/glyph.js';
import { KernGroup } from '../project_data/kern_group.js';
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
	if (glyph.constructor.name !== 'Glyph') {
		// log(`glyphChanged`, 'end');
		return;
	}
	glyph.recalculateGlyphMaxes();
	const project = getCurrentProject();
	glyph.usedIn = glyph.usedIn || [];
	glyph.usedIn.forEach((itemID) => {
		if (itemID !== glyph.id) {
			const item = project.getItem(itemID);
			if (item) {
				glyphChanged(item);
				if (item.shapes) {
					item.shapes.forEach((shape) => {
						if (shape.objType === 'ComponentInstance') shape.cache = {};
					});
				}
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
	let exportGlyph = new Glyph(glyph);
	exportGlyph.flipNS();
	let size = Math.max(exportGlyph.maxes.height, exportGlyph.maxes.width);
	let svg = exportGlyph.svgPathData;
	// log(svg);

	let re = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" `;
	// re += `width="${size}" height="${size}" viewBox="0,0,${size},${size}">\n`;
	re += `viewBox="0,0,${size},${size}">\n`;
	re += `\t<g>\n`;
	re += `\t\t<path d="${svg}"/>\n`;
	re += `\t</g>\n</svg>`;

	// log(re);
	// log('Glyph.makeSVGforExport', 'end');
	return re;
}

// --------------------------------------------------------------
// Components
// --------------------------------------------------------------

// This is used for Global Actions - do not update History, it's handled over there
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
			editor.publish('whatShapeIsSelected', editor.multiSelect.shapes.singleton);
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
	let resolvedGlyph = new Glyph(sourceGlyph);
	resolvedGlyph.id = 'glyph-with-resolved-links';
	resolvedGlyph.name = 'Glyph with resolved links';
	resolvedGlyph.shapes = [];
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
	newPaths.forEach((path) => resolvedGlyph.addOneShape(path));
	// resolvedGlyph.shapes = newPaths;
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
 * @param {Boolean =} unlinkComponentInstances -
 * 		if true, component instances will be turned into paths
 * 		if false, component instances will simply be removed
 */
export function resolveItemLinks(item, unlinkComponentInstances = false) {
	// log('Glyph.resolveItemLinks', 'start');
	// log('passed this as id: ' + item.id);
	// Delete upstream Component Instances
	if (item.objType === 'KernGroup') return;
	let upstreamGlyph;
	// const editor = getCurrentProjectEditor();
	const project = getCurrentProject();
	for (let c = 0; c < item.usedIn.length; c++) {
		upstreamGlyph = project.getItem(item.usedIn[c]);
		// log('removing from ' + upstreamGlyph.name);
		// log(upstreamGlyph.shapes);
		if (upstreamGlyph) {
			for (let u = 0; u < upstreamGlyph.shapes.length; u++) {
				const shape = upstreamGlyph.shapes[u];
				if (shape.objType === 'ComponentInstance' && shape.link === item.id) {
					if (unlinkComponentInstances) {
						// const sourceItem = editor.project.getItem(shape.link);
						copyShapesFromTo(shape.transformedGlyph, upstreamGlyph);
					}
					upstreamGlyph.shapes.splice(u, 1);
					u--;
				}
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

/**
 * Gets a collection of component instances that have a given root glyph
 * @param {Glyph} rootGlyph - Glyph that is used other places as Component Instances
 * @returns {Array} - collection of component instances
 */
export function getComponentInstancesFromRoot(rootGlyph) {
	let results = [];
	let destinationGlyph;
	if (rootGlyph.usedIn.length) {
		rootGlyph.usedIn.filter(duplicates).forEach((destinationGlyphID) => {
			destinationGlyph = getCurrentProject().getItem(destinationGlyphID);
			destinationGlyph.shapes.forEach((shape) => {
				if (shape.link && shape.link === rootGlyph.id) results.push(shape);
			});
		});
	}
	return results;
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
export function addLinkToUsedIn(item, linkID = '') {
	// log(`addLinkToUsedIn`, 'start');
	// log(`linkID: ${linkID}`);
	// log(`usedIn BEFORE:`);
	// log(item.usedIn);
	// log(item);
	if (item.id !== linkID) {
		item.usedIn.push('' + linkID);
		// sort numerically as opposed to alpha
		item.usedIn.sort();
	}
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

// --------------------------------------------------------------
// Kerning
// --------------------------------------------------------------

/**
 * Finds the largest advance width amongst a collection of Glyph IDs
 * @param {Array} sideGroup - collection of glyph IDs
 * @returns {Number} - Max advance width for the members
 */
export function kernGroupSideMaxWidth(sideGroup = []) {
	let width = 0;
	const project = getCurrentProject();
	sideGroup.forEach((id) => {
		let item = project.getItem(`glyph-${id}`);
		if (item && item.advanceWidth) width = Math.max(width, item.advanceWidth);
	});
	return width;
}

/**
 * Calculates how wide this Kern Group should be displayed
 * @param {KernGroup} kernGroup - Kern Group to calculate
 * @returns {Number} - display width (em units)
 */
export function kernGroupDisplayWidth(kernGroup) {
	// log(`KernGroup GET groupWidth`, 'start');
	const project = getCurrentProject();
	let leftWidth = kernGroupSideMaxWidth(kernGroup.leftGroup) || project.defaultAdvanceWidth;
	let rightWidth = kernGroupSideMaxWidth(kernGroup.rightGroup) || project.defaultAdvanceWidth;
	let width = leftWidth - kernGroup.value + rightWidth;
	// log(`KernGroup GET groupWidth`, 'end');
	return width;
}
