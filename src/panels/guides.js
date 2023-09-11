import { getCurrentProject, getCurrentProjectEditor } from '../app/main.js';
import { addAsChildren, makeElement } from '../common/dom.js';
import { makeDirectCheckbox, makeSingleLabel } from './cards.js';

/**
		Panel > Guides
		Shows a list of all the system and custom
		guide lines.
**/

export function makePanel_Guides() {
	return [makeSystemGuidesCard(), makeCustomGuidesCard()];
}

export function makeSystemGuidesCard() {
	let systemCard = makeElement({
		className: 'panel__card',
		innerHTML: '<h3>System guides</h3>',
	});

	addAsChildren(systemCard, [
		makeSystemGuideRow('ascent', 'Ascent'),
		makeSystemGuideRow('capHeight', 'Cap height'),
		makeSystemGuideRow('xHeight', 'X height'),
		makeSystemGuideRow('baseline', 'Baseline'),
		makeSystemGuideRow('descent', 'Descent'),
		makeSystemGuideRow('leftSide', 'Left side'),
		makeSystemGuideRow('rightSide', 'Right side'),
	]);
	return systemCard;
}

function makeSystemGuideRow(property, title) {
	const systemGuides = getCurrentProjectEditor().systemGuides;
	return [
		makeSingleLabel(title),
		makeDirectCheckbox(systemGuides, property, (newValue) => {
			const editor = getCurrentProjectEditor();
			let shownGuides = editor.project.settings.app.guides.systemGuides;
			if (newValue) {
				if (!shownGuides.includes(property)) {
					shownGuides.push(property);
				}
			} else {
				if (shownGuides.includes(property)) {
					shownGuides = shownGuides.filter((g) => g !== property);
				}
			}
			editor.editCanvas.redraw();
		}),
	];
}

function makeCustomGuidesCard() {
	let customCard = makeElement({
		className: 'panel__card',
		innerHTML: '<h3>Custom guides</h3>',
	});

	const guides = getCurrentProject().settings.app.guides.custom;

	guides.forEach((guide) => {
		addAsChildren(customCard, makeCustomGuideRow(guide));
	});

	return customCard;
}

function makeCustomGuideRow(guide) {
	return [
		makeSingleLabel(guide.name),
		makeDirectCheckbox(guide, 'visible', () => {
			const editor = getCurrentProjectEditor();
			editor.editCanvas.redraw();
		}),
	];
}

export function makeGuideCheckbox(item, property, label) {
	let newCheckbox = makeElement({
		tag: 'input',
		attributes: {
			type: 'checkbox',
		},
	});
	if (item[property]) newCheckbox.setAttribute('checked', '');

	newCheckbox.addEventListener('change', (event) => {
		let newValue = event.target.checked;
		item[property] = !!newValue;
		getCurrentProjectEditor().editCanvas.redraw();
	});

	let newLabel = makeElement({ tag: 'label', innerHTML: label });
	let newRow = makeElement();
	addAsChildren(newRow, [newCheckbox, newLabel]);
	return newRow;
}

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
*/
