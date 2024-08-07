import { getCurrentProjectEditor } from '../app/main.js';
import { makeElement } from '../common/dom.js';
import { showAddComponentDialog } from '../pages/components.js';
import { showAddLigatureDialog } from '../pages/ligatures.js';
import { makeCard_componentInstanceAttributes } from './card_component_instance.js';
import {
	makeCard_glyphAttributes,
	makeCard_glyphLinks,
	makeCard_glyphNavigation,
} from './card_glyph.js';
import { makeCard_multiSelectPathAttributes, makeCard_pathAttributes } from './card_path.js';
import {
	makeCard_multiSelectPathPointAttributes,
	makeCard_pathPointAttributes,
} from './card_path_point.js';
import { refreshPanel } from './panels.js';

// --------------------------------------------------------------
// Glyph Edit pages attributes panel
// --------------------------------------------------------------

export function makePanel_GlyphAttributes() {
	// log('makePanel_GlyphAttributes', 'start');
	const editor = getCurrentProjectEditor();
	let content = [];
	// log(editor);

	// Path Points
	let selPoints = editor.multiSelect.points;
	// log(selPoints);
	if (selPoints.length === 1) {
		// log(`pushing point card`);
		content.push(makeCard_pathPointAttributes(selPoints.singleton));
	} else if (selPoints.length > 1) {
		let virtualShape = selPoints.virtualShape;
		content.push(makeCard_multiSelectPathPointAttributes(virtualShape));
	}

	// Shapes
	let msShapes = editor.multiSelect.shapes;
	if (msShapes.length === 1) {
		// One shape selected
		// log('One shape selected');
		// log(msShapes.singleton);
		if (msShapes.singleton.objType === 'ComponentInstance') {
			// component selected
			// log("...Component selected");
			content.push(makeCard_componentInstanceAttributes(msShapes.singleton));
		} else {
			// regular path selected
			// log("...Regular path selected");
			content.push(makeCard_pathAttributes(msShapes.singleton));
		}
	} else if (msShapes.length > 1 && selPoints.length === 0) {
		// Many shapes selected
		// log('More than one shape selected');
		content.push(makeCard_multiSelectPathAttributes(msShapes.virtualGlyph));
	}

	// Glyph
	content.push(makeCard_glyphAttributes(editor.selectedItem));
	content.push(makeCard_glyphNavigation(editor.selectedItem));
	const linksCard = makeCard_glyphLinks(editor.selectedItem);
	if (linksCard) content.push(linksCard);

	// Create
	if (editor.nav.page === 'Ligatures') {
		content.push(
			makeElement({
				tag: 'fancy-button',
				content: 'Create a new ligature',
				attributes: { secondary: '' },
				onClick: showAddLigatureDialog,
				style: 'margin-top: 10px;',
			})
		);
	}
	if (editor.nav.page === 'Components') {
		content.push(
			makeElement({
				tag: 'fancy-button',
				content: 'Create a new component',
				attributes: { secondary: '' },
				onClick: showAddComponentDialog,
				style: 'margin-top: 10px;',
			})
		);
	}

	// Subscribers
	editor.subscribe({
		topic: 'whichShapeIsSelected',
		subscriberID: 'attributesPanel',
		callback: () => {
			refreshPanel();
		},
	});
	editor.subscribe({
		topic: 'whichPathPointIsSelected',
		subscriberID: 'attributesPanel',
		callback: () => {
			refreshPanel();
		},
	});

	// log(content);
	// log('makePanel_GlyphAttributes', 'end');
	return content;
}
