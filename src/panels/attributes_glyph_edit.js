import { getCurrentProjectEditor } from "../app/main.js";
import { makeCard_glyphAttributes } from "./card_glyph.js";
import { makeCard_multiSelectPathAttributes, makeCard_pathAttributes } from "./card_path.js";
import { makeCard_multiSelectPathPointAttributes, makeCard_pathPointAttributes } from "./card_path_point.js";
import { refreshPanel } from "./panels.js";

/**
	Panel > Attributes > Glyph
	Builds a panel of attributes for a Glyph,
	which changes based on Path or Path Point
	selection.
**/

export function makePanel_GlyphAttributes() {
	// log('makePanel_GlyphAttributes', 'start');
	const editor = getCurrentProjectEditor();
	let content = [];
	// log(editor);

	// Path Points
	let selPoints = editor.multiSelect.points;
	// log(selPoints);
	if(selPoints.length === 1) {
		// log(`pushing point card`);
		content.push(makeCard_pathPointAttributes(selPoints.singleton));
	} else if (selPoints.length > 1) {
		let virtualPath = selPoints.virtualPath;
		content.push(makeCard_multiSelectPathPointAttributes(virtualPath));
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
		content.push(makeCard_multiSelectPathAttributes(selPaths.virtualGlyph));
	}

	// Glyph
	content.push(makeCard_glyphAttributes(editor.selectedGlyph));

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
