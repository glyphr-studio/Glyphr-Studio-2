import { getCurrentProjectEditor } from "../app/main.js";
import { makeCard_projectActions } from "./actions_cards.js";
import {
	makeCard_glyphAttributes,
	makeCard_pathAttributes,
	makeCard_multiSelectPathAttributes,
	makeCard_pathPointAttributes
} from "./attribute_cards.js";
import { refreshPanel } from "./panels.js";

/**
	Panel > Attributes > Glyph
	Builds a panel of attributes for a Glyph,
	which changes based on Path or Path Point
	selection.
**/

export function makePanel_GlyphAttributes() {
	// log('makePanel_GlyphAttributes', 'start');
	let editor = getCurrentProjectEditor();
	let content = [];
	// log(editor);

	// Path Points
	let selPoints = editor.multiSelect.points;
	// log(selPoints);
	if(selPoints.length === 1) {
		// log(`pushing point card`);
		content.push(makeCard_pathPointAttributes(selPoints.singleton));
	}

	// Paths
	let selPaths = editor.multiSelect.paths;
	if (selPaths.length === 1) {
		// One path selected
		// log('One path selected');
		// log(selPaths.singleton);
		if (selPaths.singleton.objType === 'ComponentInstance') {
			// component selected
			// log("...Component selected");
			content.push(makeCard_componentInstanceAttributes(selPaths.singleton));
		} else {
			// regular path selected
			// log("...Regular path selected");
			content.push(makeCard_pathAttributes(selPaths.singleton));
		}
	} else if (selPaths.length > 1) {
		// Many paths selected
		// log('More than one path selected');
		let virtualGlyph = selPaths.getGlyph();
		content.push(makeCard_multiSelectPathAttributes(virtualGlyph));
	}

	// Glyph
	content.push(makeCard_glyphAttributes(editor.selectedGlyph));

	// Actions
	// content.push(makeCard_projectActions());

	// TODO used-in glyph card

	// Subscriber
	editor.subscribe({
		topic: 'whichPathIsSelected',
		subscriberID: 'attributesPanel',
		callback: () => { refreshPanel(); }
	});
	editor.subscribe({
		topic: 'whichPathPointIsSelected',
		subscriberID: 'attributesPanel',
		callback: () => { refreshPanel(); }
	});

	// log(content);
	// log('makePanel_GlyphAttributes', 'end');
	return content;
}
