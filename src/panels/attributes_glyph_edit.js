import { getCurrentProjectEditor } from '../app/main.js';
import { makeElement } from '../common/dom.js';
import { eventHandlerData } from '../edit_canvas/events.js';
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
	let msShapes = editor.multiSelect.shapes;
	let msPoints = editor.multiSelect.points;

	// log(`msPoints.length: ${msPoints.length}`);
	// if (eventHandlerData.selecting && (msShapes.length > 0 || msPoints.length > 0)) {
	if (eventHandlerData.selecting) {
		// log('makePanel_GlyphAttributes', 'end');
		return [makeCard_dragToSelectSummary()];
	}

	let content = [];
	// log(editor);

	// Path Points
	// log(msPoints);
	if (msPoints.length === 1) {
		// log(`pushing point card`);
		content.push(makeCard_pathPointAttributes(msPoints.singleton));
	} else if (msPoints.length > 1) {
		let virtualShape = msPoints.virtualShape;
		content.push(makeCard_multiSelectPathPointAttributes(virtualShape));
	}

	// Shapes
	if (msShapes.length === 1) {
		// One shape selected
		// log('One shape selected');
		// log(msShapes.singleton);
		if (msShapes.singleton.objType === 'ComponentInstance') {
			// component selected
			// log('...Component selected');
			content.push(makeCard_componentInstanceAttributes(msShapes.singleton));
		} else {
			// regular path selected
			// log('...Regular path selected');
			content.push(makeCard_pathAttributes(msShapes.singleton));
		}
	} else if (msShapes.length > 1 && msPoints.length === 0) {
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
		topic: ['whichShapeIsSelected', 'whichPathPointIsSelected', 'glyphDisplayMode'],
		subscriberID: 'attributesPanel',
		callback: () => {
			refreshPanel();
		},
	});

	// log(content);
	// log('makePanel_GlyphAttributes', 'end');
	return content;
}

function makeCard_dragToSelectSummary() {
	const editor = getCurrentProjectEditor();
	let pointCount = editor.multiSelect.points.length;
	let shapeCount = editor.multiSelect.shapes.length;
	let text = '';

	if (pointCount === 0) {
		if (shapeCount === 0) text = 'Drag to select...';
		if (shapeCount === 1) text = '1 selected shape';
		if (shapeCount > 1) text = `${shapeCount} selected shapes`;
	} else {
		let pName = pointCount > 1 ? 'path points' : 'path point';
		let sName = shapeCount > 1 ? 'shapes' : 'shape';
		text = `${pointCount} selected ${pName} across ${shapeCount} ${sName}`;
	}

	let multiPathPointCard = makeElement({
		tag: 'div',
		className: 'panel__card',
		innerHTML: `<h3>${text}</h3>`,
	});

	return multiPathPointCard;
}
