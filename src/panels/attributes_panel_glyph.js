import { getCurrentProjectEditor } from "../app/main.js";
import { makeCard_projectActions } from "./actions_cards.js";
import {
	makeCard_glyphAttributes,
	makeCard_pathAttributes,
	makeCard_multiSelectPathAttributes,
	makeCard_pathPointAttributes
} from "./attribute_cards.js";

/**
	Panel > Attributes > Glyph
	Builds a panel of attributes for a Glyph,
	which changes based on Path or Path Point
	selection.
**/

export function makePanel_GlyphAttributes() {
	log('makePanel_GlyphAttributes', 'start');
	let projectEditor = getCurrentProjectEditor();
	let content = [];
	// log(projectEditor);

	// Glyph
	content.push(makeCard_glyphAttributes(projectEditor.selectedGlyph));

	// Paths
	let selPaths = projectEditor.multiSelect.paths;
	if (selPaths.length === 1) {
		// One path selected
		log('One path selected');
		log(selPaths.singleton);
		if (selPaths.singleton.objType === 'ComponentInstance') {
			// component selected
			log("...Component selected");
			content.push(makeCard_componentInstanceAttributes(selPaths.singleton));
		} else {
			// regular path selected
			log("...Regular path selected");
			content.push(makeCard_pathAttributes(selPaths.singleton));
		}
	} else if (selPaths.length > 1) {
		// Many paths selected
		log('More than one path selected');
		let virtualGlyph = selPaths.getGlyph();
		content.push(makeCard_multiSelectPathAttributes(virtualGlyph));
	}

	// Path Points
	let selPoints = projectEditor.multiSelect.points;
	if(selPoints.length === 1) {
		content.push(makeCard_pathPointAttributes(selPoints.singleton));
	}

	// Actions
	content.push(makeCard_projectActions());

	log(content);
	log('makePanel_GlyphAttributes', 'end');
	return content;
}
