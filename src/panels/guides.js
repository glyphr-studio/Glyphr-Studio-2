/**
		Panel > Guides
		Shows a list of all the system and custom
		guide lines.
**/

import { getCurrentProjectEditor } from '../app/main.js';
import { addAsChildren, makeElement } from '../common/dom.js';
import { makeSingleCheckbox } from './cards.js';

export function makePanel_Guides() {
	const editor = getCurrentProjectEditor();
	const systemGuides = editor.project.metadata.guides.system;
	let systemCard = makeElement({ className: 'panel__card full-width', innerHTML: '<h4>System guides</h4>' });
	addAsChildren(systemCard, makeGuideCheckbox(systemGuides, 'showBaseline', 'Baseline'));
	addAsChildren(systemCard, makeGuideCheckbox(systemGuides, 'showLeftSide', 'Left side'));
	addAsChildren(systemCard, makeGuideCheckbox(systemGuides, 'showRightSide', 'Right side'));

	return [systemCard];
}

export function makeGuideCheckbox(workItem, property, label) {
	let newCheckbox = makeElement({
		tag: 'input',
		attributes: {
			type: 'checkbox',
		},
	});
	if (workItem[property]) newCheckbox.setAttribute('checked', '');

	newCheckbox.addEventListener('change', (event) => {
		let newValue = event.target.checked;
		workItem[property] = !!newValue;
		getCurrentProjectEditor().editCanvas.redraw();
	});

	let newLabel = makeElement({ tag: 'label', innerHTML: label });
	let newRow = makeElement();
	addAsChildren(newRow, [newCheckbox, newLabel]);
	return newRow;
}

	/*
function makeGuidePanel() {
	let user = makeElement({ className: 'panel__card', innerHTML: '<h4>User guides</h4>' });
	let guides = editor.project.projectSettings.guides;
	let tg;

	for (let g of Object.keys(guides)) {
		tg = guides[g];

		if (tg.editable) {
			user.appendChild(
				makeOneGuideRow(tg, 'getCurrentProject().projectSettings.guides.' + g, tg.visible, g)
			);
		} else if (tg.displayName) {
			system.appendChild(
				makeOneGuideRow(tg, 'getCurrentProject().projectSettings.guides.' + g, tg.visible, g)
			);
		}
	}
	*/
	/*
	content += '<h3 style="margin-top:0px; margin-bottom:10px;">options</h3>';
	content +=
		'<table style="width:100%;">' +
		'<tr><td style="width:20px">' +
		checkUI('_UI.showGrid', _UI.showGrid, true) +
		'</td>' +
		'<td><label style="margin-left:10px;" for="showGrid">show grid</label></td></tr>' +
		'<tr><td style="width:20px">' +
		checkUI('_UI.showGuides', _UI.showGuides, true) +
		'</td>' +
		'<td><label style="margin-left:10px;" for="showGuides">show guides</label></td></tr>' +
		'<tr><td style="width:20px">' +
		checkUI('_UI.showGuidesLabels', _UI.showGuidesLabels, true) +
		'</td>' +
		'<td><label style="margin-left:10px;" for="showGuidesLabels">show guide labels</label></td></tr>' +
		'<tr><td style="width:20px">' +
		checkUI('_UI.showOvershoots', _UI.showOvershoots, true) +
		'</td>' +
		'<td><label style="margin-left:10px;" for="showOvershoots">show overshoots (' +
		ps.overshoot +
		' em units)</label></td></tr>' +
		// '<td colspan="2">grid transparency:<input type="range" min="0" max="100" value="'+ps.colors.glyphTransparency+'" step="1" oninput="updateTransparency(\'glyphTransparency\', this.value);"/><span id="glyphTransparency">'+ps.colors.glyphTransparency+'</span>%</td>'+sliderUI('glyphTransparency')+'</tr>'+
		'<td colspan="2">grid ' +
		sliderUI('glyphTransparency', 'glyphTransparency_panel', false, true) +
		'</td></tr>' +
		'</table>';
	*/
	/*
	if (editor.nav.page !== 'kerning') {
		content += '<br><h3 style=" margin-bottom:0px;">system guides</h3>';
		// content += 'transparency:<input type="range" min="0" max="100" value="'+ps.colors.systemGuideTransparency+'" step="1" oninput="updateTransparency(\'systemGuideTransparency\', this.value);"/><span id="systemGuideTransparency">'+ps.colors.systemGuideTransparency+'</span>%<br><br>';
		content +=
			'guide ' +
			sliderUI(
				'systemGuideTransparency',
				'systemGuideTransparency_panel',
				false,
				true
			) +
			'<br><br>';
		content += system;
		content += '<br><h3 style=" margin-bottom:0px;">custom guides</h3>';
		// content += 'transparency:<input type="range" min="0" max="100" value="'+ps.colors.customGuideTransparency+'" step="1" oninput="updateTransparency(\'customGuideTransparency\', this.value);"/><span id="customGuideTransparency">'+ps.colors.customGuideTransparency+'</span>%<br><br>';
		content +=
			'guide ' +
			sliderUI(
				'customGuideTransparency',
				'customGuideTransparency_panel',
				false,
				true
			) +
			'<br><br>';
		content += user;
		content += '<br><button onclick="newGuide();">new guide</button>';
	}

	content += '</div>';
}
	*/

/*
function makeOneGuideRow(guide, path, currViz, id) {
	return makeElement({
		content: `color: ${guide.color} / type: ${guide.type}`,
	});
	let sys = !guide.editable;
	let re = '<table class="guideRow"><tr>';

	re += '<td class="guideColor" style="background-color:' + guide.color + ';"';
	if (!sys) {
		re +=
			" customGuideTransparency=\"hideAllSatChoosers(); this.style.cursor='pointer'; this.style.borderColor='" +
			guide.color +
			'\';"';
		re += ' onmouseout="this.style.borderColor=\'rgb(250,252,255)\';"';
		re +=
			' onclick="hideAllSatChoosers(); showGuideSatChooser(this, \'' +
			id +
			'\');"';
	}
	re += '>';
	re += '</td>';

	re += '<td>';
	re += checkUI(path + '.visible', currViz, true);
	re += '</td>';

	re += '<td>';
	if (guide.type === 'horizontal') {
		re +=
			'<button ' +
			(sys ? 'disabled' : '') +
			' class="guidetype" onclick="updateGuide(\'' +
			id +
			"', 'type', 'vertical');\">&mdash;</button>";
	} else {
		re +=
			'<button ' +
			(sys ? 'disabled' : '') +
			' class="guidetype" onclick="updateGuide(\'' +
			id +
			"', 'type', 'horizontal');\">|</button>";
	}
	re += '</td>';

	re += '<td>';
	re +=
		'<input ' +
		(sys ? 'disabled' : '') +
		' type="text" class="guidename" value="' +
		guide.name +
		'" onchange="updateGuide(\'' +
		id +
		"', 'name', this.value);\"/>";
	re += '</td>';

	re += '<td>';
	re +=
		'<input ' +
		(sys ? 'disabled' : '') +
		' type="number" id="' +
		id +
		'" class="guidelocation" value="' +
		round(guide.location, 3) +
		'" onchange="_UI.focusElement=this.id; updateGuide(\'' +
		id +
		"', 'location', (1*this.value));\"/>";
	re += '</td>';

	if (!sys) {
		re += '<td>';
		re +=
			'<button class="guideremove" onclick="deleteGuide(\'' +
			id +
			'\');">&times</button>';
		re += '</td>';
	}

	re += '</tr></table>';
	return re;
}

function updateGuide(id, key, value) {
	let g = getCurrentProject().projectSettings.guides[id];
	g[key] = value;
	if (key === 'type') {
		if (g.name === 'horizontal guide') g.name = 'vertical guide';
		else if (g.name === 'vertical guide') g.name = 'horizontal guide';
	}
	redraw({ calledBy: 'updateGuide' });
}

function deleteGuide(id) {
	let g = getCurrentProject().projectSettings.guides[id];
	showToast('Deleted ' + g.name);

	delete getCurrentProject().projectSettings.guides[id];
	redraw({ calledBy: 'deleteGuide' });
}

function showGuideSatChooser(ctx, id) {
	let sc = new SatChooser({
		clickCallback: function (args) {
			getCurrentProject().projectSettings.guides[id].color = args.colorstring;
			redraw({ calledBy: 'SatChooser.callback' });
		},
	});
	sc.show({ elem: ctx });
}

function hideAllSatChoosers() {
	let scid = document.getElementById('satChooser');
	while (scid) {
		scid.parentNode.removeChild(scid);
		scid = document.getElementById('satChooser');
	}
}

function newGuide() {
	let g = getCurrentProject().projectSettings.guides;
	let id = generateNewID(g, 'guide');

	g[id] = new Guide({});

	redraw({ calledBy: 'newGuide' });
}

*/
