/**
		Panel > Attributes > Glyph
		Builds a panel of attributes for a Glyph,
		which changes based on Shape or Path Point
		selection.
**/
import { log } from "../common/functions.js";
import { makeElement } from "../common/dom.js";
import { getCurrentProjectEditor } from "../app/main.js";
import { makeAttributesGroup_pathPoint, makeAttributesGroup_shape, makeInputs_position, makeInputs_size } from "./attributes.js";


export function makePanel_GlyphAttributes() {
	log('makePanel_GlyphAttributes', 'start');
	let projectEditor = getCurrentProjectEditor();
	let selectedShapes = projectEditor.multiSelect.shapes;
	let selectedPoints = projectEditor.multiSelect.points;
	let content = '';
	// log(projectEditor);

	// For debug
	selectedShapes.select(projectEditor.selectedGlyph.shapes[0]);
	selectedPoints.select(projectEditor.selectedGlyph.shapes[0].path.pathPoints[0]);

	log(selectedShapes);
	log(`multiSelect length: ${selectedShapes.length}`);

	content += `
		<div class="panel__section">
			<h3>Glyph</h3>
			${makeInputs_position(projectEditor.selectedGlyph.x, projectEditor.selectedGlyph.y)}
			${makeInputs_size(projectEditor.selectedGlyph.width, projectEditor.selectedGlyph.height)}
		</div>
	`;

	if (selectedShapes.length === 1) {
		// One shape selected
		log('One shape selected');
		if (selectedShapes.singleton.objType === 'ComponentInstance') {
			// component selected
			log("...Component selected");
			content += makeAttributesGroup_componentInstance(selectedShapes.singleton);
		} else {
			// regular shape selected
			log("...Regular shape selected");
			content += makeAttributesGroup_shape(selectedShapes.singleton);

			let isPointSelected = projectEditor.multiSelect.points.count() === 1;
			// if (!(_UI.selectedTool === 'pathEdit' || _UI.selectedTool === 'pathAddPoint'))
			//   isPointSelected = false;

			if (isPointSelected) {
				content += makeAttributesGroup_pathPoint(projectEditor.multiSelect.points.singleton);
			}
		}
	} else {
		// Many shapes selected
		log('More than one shape selected');
		let virtualGlyph = selectedShapes.getGlyph();
		content += `
			<div class="panel__section">
				<h3>${selectedShapes.length} selected shapes</h3>
				${makeInputs_position(virtualGlyph.x, virtualGlyph.y)}
				${makeInputs_size(virtualGlyph.width, virtualGlyph.height)}
			</div>
		`;
	}

	// log(content);
	log('makePanel_GlyphAttributes', 'end');
	return makeElement({content: content});
}


export function makePointButton(type, selected) {
	let color = _UI.colors.gray.l40;
	let bgcolor = 'transparent';

	if (selected) {
		color = _UI.colors.blue.l65;
		bgcolor = _UI.colors.gray.offWhite;
	}

	// log("MAKEPOINTBUTTON - " + type + " selected: " + selected + " color: " + color);
	let re = '';

	re +=
		'<button class="pointtypebutton" style="background-color:' +
		bgcolor +
		';" ';
	re +=
		'onclick="_UI.multiSelect.points.setPointType(\'' +
		type +
		"'); historyPut('Point Type: " +
		type +
		"'); redraw({calledBy:'pointDetails'});\" ";
	re += 'title="point type: ' + type + '" ';
	re += '>';
	re += '<svg version="1.1" ';
	re +=
		'xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ';
	re += 'x="0px" y="0px" width="20px" height="20px" viewBox="0 0 20 20" ';
	re += '><g fill="' + color + '">';
	re += '<rect x="8" y="8" width="1" height="4"/>';
	re += '<rect x="11" y="8" width="1" height="4"/>';
	re += '<rect x="8" y="8" width="4" height="1"/>';
	re += '<rect x="8" y="11" width="4" height="1"/>';
	re += '<rect x="4" y="4" width="1" height="1"/>';
	re += '<rect x="5" y="5" width="1" height="1"/>';
	re += '<rect x="6" y="6" width="1" height="1"/>';
	re += '<rect x="7" y="7" width="1" height="1"/>';
	re += '<circle cx="3" cy="3" r="1.5"/>';

	switch (type) {
		case 'corner':
			re += '<rect x="7" y="12" width="1" height="1"/>';
			re += '<rect x="6" y="13" width="1" height="1"/>';
			re += '<rect x="5" y="14" width="1" height="1"/>';
			re += '<rect x="4" y="15" width="1" height="1"/>';
			re += '<circle cx="3" cy="17" r="1.5"/>';
			break;

		case 'symmetric':
			re += '<rect x="12" y="12" width="1" height="1"/>';
			re += '<rect x="13" y="13" width="1" height="1"/>';
			re += '<rect x="14" y="14" width="1" height="1"/>';
			re += '<rect x="15" y="15" width="1" height="1"/>';
			re += '<circle cx="17" cy="17" r="1.5"/>';
			break;

		case 'flat':
			re += '<rect x="12" y="12" width="1" height="1"/>';
			re += '<rect x="13" y="13" width="1" height="1"/>';
			re += '<circle cx="15" cy="15" r="1.5"/>';
			break;
	}

	re += '</g></svg></button>';

	return re;
}

	/*
OLD GLYPH DETAILS
	if (projectEditor.nav.page === 'components') return content;

	// AUTO GLYPH WIDTH
	content += '<h3> glyph width </h3>';

	content +=`
		<label>auto calculate <span class="unit">(em units)</span></label>
		<input type="checkbox" checked="getSelectedWorkItem().isAutoWide"/>
	`;

	if (!glyph.isAutoWide) {
		content +=
			'<input type="number" id="charaw" step="' +
			spinn +
			'" ' +
			'value="' +
			round(glyph.glyphWidth, 3) +
			'" ' +
			'onchange="_UI.focusElement=this.id; getSelectedWorkItem().glyphWidth = (this.value*1); redraw({calledBy:{calledBy:\'glyphDetails\'}});">';
	} else {
		content +=
			'<input type="number" disabled="disabled" ' +
			'value="' +
			round(glyph.glyphWidth, 3) +
			'"/>';
	}

	content += '</td>' + '</tr>';

	// LEFT SIDE BEARING
	if (glyph.isAutoWide) {
		content +=
			'<tr><td colspan=2 class="detailtitle"><h3> left side bearing </h3>';

		content +=
			'<tr>' +
			'<td> use default <span class="unit">(em units)</span> </td>' +
			'<td>' +
			// checkUI(  'getSelectedWorkItem().leftSideBearing',  glyph.leftSideBearing,  true,  true) +
			'&emsp;';

		if (glyph.leftSideBearing) {
			if (glyph.leftSideBearing === true)
				glyph.leftSideBearing = getCurrentProject().projectSettings.defaultLSB;
			content +=
				'<input type="number" id="charlsb" step="' +
				spinn +
				'" ' +
				'value="' +
				glyph.leftSideBearing +
				'" ' +
				'onchange="_UI.focusElement=this.id; getSelectedWorkItem().leftSideBearing = (this.value*1); redraw({calledBy:\'glyphDetails\'});">';
		} else {
			content +=
				'<input type="number" disabled="disabled" ' +
				'value="' +
				round(getCurrentProject().projectSettings.defaultLSB, 3) +
				'"/>';
		}
		content += '</td>' + '</tr>';
	}

	// RIGHT SIDE BEARING
	if (glyph.isAutoWide) {
		content +=
			'<tr><td colspan=2 class="detailtitle"><h3> right side bearing </h3>';

		content +=
			'<tr>' +
			'<td> use default <span class="unit">(em units)</span> </td>' +
			'<td>' +
			// checkUI(  'getSelectedWorkItem().rightSideBearing',  glyph.rightSideBearing,  true,  true) +
			'&emsp;';

		if (glyph.rightSideBearing) {
			if (glyph.rightSideBearing === true)
				glyph.rightSideBearing = getCurrentProject().projectSettings.defaultRSB;
			content +=
				'<input type="number" id="charrsb" step="' +
				spinn +
				'" ' +
				'value="' +
				glyph.rightSideBearing +
				'" ' +
				'onchange="_UI.focusElement=this.id; getSelectedWorkItem().rightSideBearing = (this.value*1); redraw({calledBy:\'glyphDetails\'});">';
		} else {
			content +=
				'<input type="number" disabled="disabled" ' +
				'value="' +
				round(getCurrentProject().projectSettings.defaultRSB, 3) +
				'"/>';
		}
		content += '</td>' + '</tr>';
	}

	// USED IN
	if (glyph.usedIn.length > 0) {
		content +=
			'<tr><td colspan=2><br class="detailtitle"><h3>glyphs that use this component</h3>';
		content += '<tr><td colspan=2>';
		content += makeUsedInThumbs();
		content += '';
	}

	return content;
}

*/