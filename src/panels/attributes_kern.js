/**
		Panel > Kern
		Shows a list of all the kern pairs.
**/

import { getCurrentProjectEditor } from '../app/main';
import { makeCard_kernGroup } from './card_kern_group';

export function makePanel_KernGroupAttributes() {
	// log('makePanel_KernGroupAttributes', 'start');
	const editor = getCurrentProjectEditor();
	// log('makePanel_KernGroupAttributes', 'end');
	return makeCard_kernGroup(editor.selectedKernGroup);
}

/*


















function makeOneKernPairRow(k, id) {
	let selstyle = '';
	if (getselectedKernGroupID() === id)
		selstyle = 'style="background-color:' + _UI.colors.blue.l55 + '; ';

	let re = '<table class="kernrow"><tr>';
	re += '<td class="selkern" ' + selstyle + 'onclick="selectKern(\'' + id + '\');"></td>';
	re +=
		'<td><input class="rowleftgroup" type="text" onchange="updateKernGroup(\'' +
		id +
		"', 'left', this.value);\" value=\"" +
		hexesToChars(k.leftGroup.join('')) +
		'"></td>';
	re +=
		'<td><input class="rowrightgroup" type="text" onchange="updateKernGroup(\'' +
		id +
		"', 'right', this.value);\" value=\"" +
		hexesToChars(k.rightGroup.join('')) +
		'"></td>';
	re +=
		'<td><input class="kernvalue" type="number" id="' +
		id +
		'" value="' +
		k.value +
		'" onchange="_UI.focusElement=this.id; updateKernValue(\'' +
		id +
		'\', this.value);"></td>';
	re +=
		'<td><button class="guideremove" onclick="deleteKernPair(\'' +
		id +
		'\');">&times</button></td>';

	re += '</tr></table>';
	return re;
}

function addCommonKernPairs() {
	let add = ['A', 'VWY', 'A', 'CO', 'VWY', 'A', 'FP', 'A', 'O', 'A', 'L', 'TVW'];
	let nid;

	for (let k = 0; k < add.length; k += 2) {
		nid = generateNewID(getCurrentProject().kerning);
		getCurrentProject().kerning[nid] = new KernGroup({
			leftGroup: parseKernGroupInput(add[k]),
			rightGroup: parseKernGroupInput(add[k + 1]),
		});
	}

	_UI.selectedKernGroup = getFirstID(getCurrentProject().kerning);
	redraw({ calledBy: 'addCommonKernPairs' });
}

function updateKernValue(id, val) {
	let k = getCurrentProject().kerning[id];
	k.value = val;
	// selectKern(id);
	document.getElementById(id).value = val;
	editor.history.addState(k.getName() + ' value: ' + val);
}

function updateKernGroup(id, side, val) {
	let k = getCurrentProject().kerning[id];
	if (side === 'left') k.leftGroup = parseKernGroupInput(val);
	else if (side === 'right') k.rightGroup = parseKernGroupInput(val);
	selectKern(id);
	editor.history.addState('Updated Members: ' + k.getName());
}

function selectKern(id) {
	_UI.selectedKernGroup = id;
	redraw({ calledBy: 'selectKern' });
}

function showNewKernPairDialog() {
	let con = '<h1>New Kern Pair</h1>';
	con += '<div style="width:500px;">';
	con += 'Create a new kern pair by specifying a glyph for the left and right sides. ';
	con +=
		'Each side of the kern pair can also be a group of glyphs.  When any glyph from the left side is displayed before any glyph in the right side, the pair will be kerned.<br><br>';
	con +=
		'Glyphs can also be specified in Unicode format (like U+0066) or hexadecimal format (like 0x0066). ';
	con +=
		'Hexadecimal, Unicode, and regular glyph formats cannot be mixed - choose one type!<br><br>';
	con += '<h3>Kern Pair Glyphs</h3>';
	con +=
		'<input type="text" id="leftGroup" style="font-size:24px; width:45%; padding:8px; text-align:right;"/>';
	con += '<input type="text" id="rightGroup" style="font-size:24px; width:45%; padding:8px;"/><br>';
	con +=
		'<button class="button__call-to-action" onclick="createNewKernPair();">create new kern pair</button>';
	con += '</div>';

	openDialog(con);
}

function createNewKernPair() {
	let l = parseKernGroupInput(document.getElementById('leftGroup').value);
	let r = parseKernGroupInput(document.getElementById('rightGroup').value);

	if (!l || !l.length) showError('The left kern group cannot be empty.');
	else if (!r || !r.length) showError('The right kern group cannot be empty.');
	else {
		let id = generateNewID(getCurrentProject().kerning, 'kern');

		getCurrentProject().kerning[id] = new KernGroup({
			leftGroup: l,
			rightGroup: r,
		});

		closeDialog();
		_UI.selectedKernGroup = id;
		redraw({ calledBy: 'createNewKernPair' });
	}
}

function parseKernGroupInput(chars) {
	chars = trim(chars);
	chars = parseCharsInputAsHex(chars);
	if (chars === false) return false;
	chars = chars.filter(function (elem, pos) {
		return chars.indexOf(elem) === pos;
	});
	return chars;
}

function deleteKernPair(id) {
	let k = getCurrentProject().kerning[id];
	showToast('Deleted ' + k.getName());

	delete getCurrentProject().kerning[id];
	_UI.selectedKernGroup = getFirstID(getCurrentProject().kerning);
	redraw({ calledBy: 'deleteKernPair' });
}

*/
