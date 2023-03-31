import { log } from '../app/main.js';
import { accentColors, uiColors } from '../common/colors.js';
import { makeElement } from '../common/dom.js';

// --------------------------------------------------------------
// Action Button
// --------------------------------------------------------------

export function makeActionButton({
	iconName = 'default',
	iconOptions = false,
	title = '',
	disabled = false,
	onClick = false,
	id = false,
} = {}) {
	// log(`makeActionButton`, 'start');
	// log(`iconName: ${iconName}`);
	// log(`iconOptions: ${iconOptions}`);
	// log(`disabled: ${disabled}`);

	let newButton = makeElement({
		tag: 'button',
		innerHTML: makeActionButtonIcon[iconName](iconOptions),
		attributes: {
			title: title,
		},
	});

	if (onClick) newButton.addEventListener('click', onClick);
	if (disabled) newButton.setAttribute('disabled', 'disabled');
	if (id) newButton.setAttribute('id', id);

	// log(`makeActionButton`, 'end');
	return newButton;
}

// --------------------------------------------------------------
// Action button icons
// --------------------------------------------------------------

export let makeActionButtonIcon = {};

export function svgWrap(content) {
	let re = `
		<svg
			version="1.1" viewBox="0 0 30 30" enable-background="new 0 0 30 30"
			xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
		>
			${content}
		</svg>
	`;

	return re;
}

let actionButtonIconColors = {
	darkFill: accentColors.gray.l25,
	lightFill: accentColors.gray.l85,
	blueOutline: accentColors.blue.l70,
	greenOutline: accentColors.green.l70,
	grayOutline: accentColors.gray.l70,
	redX: uiColors.red,
};

// Universal actions
makeActionButtonIcon.copy = function () {
	let re = '';
	let blue = actionButtonIconColors.blueOutline;
	let gray = actionButtonIconColors.grayOutline;
	let fill = actionButtonIconColors.darkFill;

	re += `
		<polygon fill="${fill}" points="1,22 1,10.4 10.4,1 18,1 18,22"/>
		<path fill="${gray}" d="M17,2v19H2V10.8L10.8,2H17 M19,0h-9L0,10v13h19V0L19,0z"/>
		<polygon fill="${fill}" points="12,29 12,17.4 21.4,8 29,8 29,29"/>
		<path fill="${blue}" d="M28,9v19H13V17.8L21.8,9H28 M30,7h-9L11,17v13h19V7L30,7z"/>
	`;

	return svgWrap(re);
};

makeActionButtonIcon.paste = function () {
	let re = '';
	let blue = actionButtonIconColors.blueOutline;
	let fill = actionButtonIconColors.darkFill;

	re += `
		<rect fill="${fill}" x="5" y="7"	width="20" height="22"/>
		<path fill="${blue}" d="M24,8v20H6V8H24 M26,6H4v24h22V6L26,6z"/>
		<path fill="${fill}" d="M9,9V4h3V3c0-1.3,1.8-2,3-2s3,0.7,3,2v1h3v5H9z"/>
		<path fill="${blue}" d="M15,2c0.9,0,2,0.5,2,1v2h2h1v3H10V5h1h2V3C13,2.5,14.1,2,15,2 M15,0c-1.7,0-4,1-4,3H8v7h14V3h-3C19,1,16.7,0,15,0L15,0z"/>
	`;

	return svgWrap(re);
};

makeActionButtonIcon.pastePathsFromAnotherGlyph = function () {
	let re = '';
	let blue = actionButtonIconColors.blueOutline;
	let fill = actionButtonIconColors.darkFill;

	re += `
		<rect fill="${fill}" x="5" y="7"	width="20" height="22"/>
		<path fill="${blue}" d="M24,8v20H6V8H24 M26,6H4v24h22V6L26,6z"/>
		<path fill="${fill}" d="M9,9V4h3V3c0-1.3,1.8-2,3-2s3,0.7,3,2v1h3v5H9z"/>
		<path fill="${blue}" d="M15,2c0.9,0,2,0.5,2,1v2h2h1v3H10V5h1h2V3C13,2.5,14.1,2,15,2 M15,0c-1.7,0-4,1-4,3H8v7h14V3h-3C19,1,16.7,0,15,0L15,0z"/>
		<path fill="${blue}" d="M17.4,20.6h-4.8l-1,3h1.6v1.7H8v-1.7h1.6l3.6-10.2h-1.6V12h6.8v1.5h-1.7l3.7,10.2H22v1.7h-5.2v-1.7h1.7L17.4,20.6z M16.9,19.1l-1.8-5.6H15l-1.8,5.6H16.9z"/>
	`;

	return svgWrap(re);
};

makeActionButtonIcon.addPath = function (isComponentInstance = false) {
	let re = '';
	let accent = actionButtonIconColors.blueOutline;
	let fill = actionButtonIconColors.darkFill;
	if (isComponentInstance) {
		accent = actionButtonIconColors.greenOutline;
		fill = actionButtonIconColors.lightFill;
	}

	// path
	re += `
		<rect fill="${fill}" x="1" y="1"	width="16" height="16"/>
		<path fill="${accent}" d="M16,2v14H2V2H16 M18,0H0v18h18V0L18,0z"/>
	`;

	// add
	re += `
		<rect x="21" y="15" fill="${accent}" width="3" height="15"/>
		<rect x="15" y="21" fill="${accent}" width="15" height="3"/>
	`;

	return svgWrap(re);
};

makeActionButtonIcon.undo = function () {
	let re = '';
	let blue = actionButtonIconColors.blueOutline;
	let fill = actionButtonIconColors.darkFill;

	re += `
		<path fill="${fill}" d="M20.1,23c4.6-5,6.6-9.6,5.5-12.8C24.9,8.2,22.9,7,20,7c-5.9,0-8.8,5.3-8.9,5.5L10.9,13l2.4,4.1l-12,0.8l4-14.4l2.5,4.2l0.9-1.1c0,0,4-4.6,11.2-4.6c4.1,0,7.9,2.8,8.8,6.5C29.4,10.8,29.3,16.3,20.1,23z"/>
		<path fill="${blue}" d="M20,3c3.1,0,6.9,2,7.8,5.7c0.5,2.1-0.1,4.4-1.6,6.7c0.7-2,0.9-3.9,0.3-5.5C25.7,7.4,23.3,6,20,6c-6.5,0-9.6,5.8-9.8,6.1l-0.5,1l0.6,1l1.3,2.2l-8.9,0.6L5.7,6l0.6,1l1.4,2.4l1.8-2.2C9.6,7.2,13.2,3,20,3 M20,1C12.2,1,8,6,8,6L5,1L0,19l15-1l-3-5c0,0,2.6-5,8-5c7.7,0,7.2,9.2-8,21C39.8,15,29.5,1,20,1L20,1z"/>
	`;

	return svgWrap(re);
};

makeActionButtonIcon.linkToGlyph = function () {
	let re = '';
	let green = actionButtonIconColors.greenOutline;

	re += `
		<path fill="${green}" d="M18,8.8L8.8,18c-0.5,0.5-1.3,0.5-1.8,0s-0.5-1.3,0-1.8L16.2,7c0.5-0.5,1.3-0.5,1.8,0S18.5,8.3,18,8.8z"/>
		<path fill="${green}" d="M7.5,21.2c-1.1,1.1-2.8,1.8-4.1,0.5s-0.6-3,0.5-4.1l5.9-5.9c-1.8-0.5-3.8,0.1-5.5,1.8L2,15.7c-2.4,2.4-2.6,5.7-0.5,7.8s5.4,2,7.8-0.5l2.3-2.3c1.7-1.7,2.3-3.7,1.8-5.5L7.5,21.2z"/>
		<path fill="${green}" d="M21.2,7.5c1.1-1.1,1.8-2.8,0.5-4.1s-3-0.6-4.1,0.5l-5.9,5.9c-0.5-1.8,0.1-3.8,1.8-5.5L15.7,2c2.4-2.4,5.7-2.6,7.8-0.5s2,5.4-0.5,7.8l-2.3,2.3c-1.7,1.7-3.7,2.3-5.5,1.8L21.2,7.5z"/>
		<rect x="21" y="15" fill="${green}" width="3" height="15"/>
		<rect x="15" y="21" fill="${green}" width="15" height="3"/>
	`;

	return svgWrap(re);
};

// (shared icons, Glyph and Path)
makeActionButtonIcon.round = function () {
	let red = actionButtonIconColors.redX;
	let fill = actionButtonIconColors.darkFill;

	let re = `
		<path fill="${red}" d="M17.4,21.9c0.4,0.5,2-0.5,1.4-1.4c-1.3-1.9-4.8-5.9-6.5-7.3C11.1,12.2,10,13,10,13S14.4,17.5,17.4,21.9z"/>
		<path fill="${red}" d="M12.2,21.6c-0.5,1-2.1-0.1-1.3-1.2c1.5-2.2,4.4-6.4,6.5-7.9c1.3-1,2.1-0.1,2.1-0.1S14.9,16.7,12.2,21.6z"/>
		<path fill="${red}" d="M28,21.9c0.4,0.5,2-0.5,1.4-1.4c-1.3-1.9-4.8-5.9-6.5-7.3c-1.2-1-2.3-0.3-2.3-0.3S24.9,17.5,28,21.9z"/>
		<path fill="${red}" d="M22.7,21.6c-0.5,1-2.1-0.1-1.3-1.2c1.5-2.2,4.4-6.4,6.5-7.9c1.3-1,2.1-0.1,2.1-0.1S25.5,16.7,22.7,21.6z"/>
		<path fill="${fill}" d="M2,20V9H0V7h4v13h2v2H0v-2H2z"/>
		<path fill="${fill}" d="M7,22v-2h2v2H7z"/>
	`;

	return svgWrap(re);
};

makeActionButtonIcon.flipVertical = function () {
	let re = '';
	let blue = actionButtonIconColors.blueOutline;
	let gray = actionButtonIconColors.grayOutline;
	let fill = actionButtonIconColors.darkFill;

	re += `
		<polygon fill="${fill}" points="6.4,13 1,7.6 1,1 14.7,1 29,9.6 29,13"/>
		<path fill="${gray}" d="M14.2,2L28,10.1V12H6.8L2,7.2V2h12 M15,0H0v8l6,6h24V9L15,0L15,0z"/>
		<polygon fill="${fill}" points="1,29 1,22.4 6.4,17 29,17 29,20.4 14.7,29"/>
		<path fill="${blue}" d="M28,18v1.9L14.4,28H2v-5.2L6.8,18H28 M30,16H6l-6,6v8h15l15-9V16L30,16z"/>
	`;

	return svgWrap(re);
};

makeActionButtonIcon.flipHorizontal = function () {
	let re = '';
	let blue = actionButtonIconColors.blueOutline;
	let gray = actionButtonIconColors.grayOutline;
	let fill = actionButtonIconColors.darkFill;

	re += `
		<polygon fill="${fill}" points="1,29 1,15.3 9.6,1 13,1 13,23.6 7.6,29"/>
		<path fill="${gray}" d="M12,2v21.2L7.2,28H2V15.6L10.1,2H12 M14,0H9L0,15v15h8l6-6V0L14,0z"/>
		<polygon fill="${fill}" points="22.4,29 17,23.6 17,1 20.4,1 29,15.3 29,29"/>
		<path fill="${blue}" d="M19.9,2L28,15.6V28h-5.2L18,23.2V2H19.9 M21,0h-5v24l6,6h8V15L21,0L21,0z"/>
	`;

	return svgWrap(re);
};

// Glyph actions
makeActionButtonIcon.exportGlyphSVG = function () {
	let blue = actionButtonIconColors.blueOutline;
	let fill = actionButtonIconColors.darkFill;

	let re = `
		<polygon fill="${fill}" points="3,8 3,30 27,30 27,0 11,0"/>
		<path fill="${blue}" d="M9.2,19.9c-0.4,0.4-1,0.6-1.6,0.6c-0.7,0-1.3-0.2-1.8-0.7v0.6H4.9v-2.6h0.9v0.6c0.4,0.8,1,1.2,1.7,1.2 c0.4,0,0.7-0.1,0.9-0.3c0.2-0.2,0.4-0.5,0.4-0.9c0-0.3-0.1-0.6-0.3-0.7c-0.2-0.2-0.6-0.3-1.1-0.5c-0.6-0.2-1.1-0.3-1.4-0.5 c-0.3-0.2-0.6-0.4-0.7-0.7c-0.2-0.3-0.3-0.6-0.3-1c0-0.6,0.2-1.1,0.6-1.5C5.9,13.2,6.4,13,7,13c0.6,0,1.1,0.2,1.6,0.6v-0.5h0.9 v2.2H8.6v-0.5c-0.4-0.6-0.9-0.8-1.5-0.8c-0.4,0-0.7,0.1-0.9,0.3c-0.2,0.2-0.3,0.4-0.3,0.7c0,0.2,0.1,0.4,0.2,0.5 c0.1,0.1,0.2,0.3,0.4,0.3c0.2,0.1,0.5,0.2,1,0.3c0.6,0.2,1.1,0.3,1.4,0.5c0.3,0.1,0.5,0.4,0.7,0.7c0.2,0.3,0.3,0.7,0.3,1.2 C9.9,19,9.7,19.5,9.2,19.9z"/>
		<path fill="${blue}" d="M21.4,13c1,0,1.9,0.3,2.5,0.9v-0.8h0.9v2.4H24c-0.2-0.4-0.5-0.8-0.9-1.1c-0.4-0.3-0.9-0.5-1.5-0.5 c-0.8,0-1.4,0.3-1.9,0.8c-0.5,0.5-0.7,1.2-0.7,1.9c0,0.9,0.3,1.5,0.8,2.1c0.5,0.5,1.2,0.8,1.9,0.8c0.6,0,1.1-0.2,1.5-0.5 c0.5-0.3,0.7-0.7,0.8-1.3h-1.3v-0.9h2.6c0,0.1,0,0.2,0,0.3c0,1-0.3,1.8-1,2.4c-0.7,0.6-1.5,0.9-2.6,0.9c-1.3,0-2.3-0.4-2.9-1.1 c-0.6-0.7-1-1.6-1-2.6c0-1.1,0.3-2,1-2.7C19.4,13.4,20.3,13,21.4,13z"/>
		<polygon fill="${blue}" points="14.1,18.9 15.9,14 15,14 15,13.1 17.8,13.1 17.8,14 16.9,14 14.5,20.4 13.5,20.4 11.1,14 10.2,14 10.2,13.1 13.1,13.1 13.1,14 12.2,14"/>
	`;

	return svgWrap(re);
};

makeActionButtonIcon.deleteGlyph = function () {
	let red = actionButtonIconColors.redX;
	let fill = actionButtonIconColors.darkFill;

	let re = `
		<path fill="${fill}" d="M20.2,18.5H10L7.8,25h3.5v3.6H0V25h3.5l7.8-21.8H7.8V0h14.6v3.2h-3.6l8,21.8H30v3.6H18.8V25h3.5L20.2,18.5zM19.2,15.2L15.4,3.2H15l-4,11.9H19.2z"/>
		<path fill="${red}" d="M26.4,29c0.6,0.8,3.5-0.8,2.4-2.2c-2.4-3.1-8.6-9.6-11.5-11.9c-2.1-1.7-4.1-0.4-4.1-0.4S21,21.9,26.4,29z"/>
		<path fill="${red}" d="M17.2,28.8c-0.9,1.6-3.7-0.2-2.3-2c2.7-3.6,7.9-10.4,11.5-13c2.3-1.7,3.7-0.1,3.7-0.1S22.1,20.7,17.2,28.8z"/>
	`;

	return svgWrap(re);
};

// Path actions
makeActionButtonIcon.reverseWinding = function () {
	let re = '';
	let blue = actionButtonIconColors.blueOutline;
	let gray = actionButtonIconColors.grayOutline;

	re += `
		<path fill="${gray}" d="M3.7,7.8V5L0,8.7l3.7,3.7V9.6c6.2,0,11.2,5,11.2,11.2h1.9C16.8,13.6,10.9,7.8,3.7,7.8z"/>
		<path fill="${blue}" d="M25.2,22.3C25.2,10,15.2,0,3,0v3.2c10.5,0,19.1,8.6,19.1,19.1h-4.8l6.4,6.4l6.4-6.4H25.2z"/>
	`;

	return svgWrap(re);
};

makeActionButtonIcon.switchPathComponent = function (isComponentInstance = false) {
	// log(`makeActionButtonIcon.switchComponent`, 'start');
	// log(`isComponentInstance: ${isComponentInstance}`);
	let re = '';
	let before = actionButtonIconColors.blueOutline;
	let after = actionButtonIconColors.greenOutline;
	let beforeFill = actionButtonIconColors.darkFill;
	let afterFill = actionButtonIconColors.lightFill;
	if (isComponentInstance) {
		before = actionButtonIconColors.greenOutline;
		after = actionButtonIconColors.blueOutline;
		beforeFill = actionButtonIconColors.lightFill;
		afterFill = actionButtonIconColors.darkFill;
	}

	re += `
	<polygon fill="${beforeFill}" points="5.1,21 1,17.2 1,1 3.4,1 10,11.3 10,21"/>
	<path fill="${before}" d="M2.9,2L9,11.6V20H5.5L2,16.7V2H2.9 M3.9,0H0v17.6L4.7,22H11V11L3.9,0L3.9,0z"/>
	<polygon fill="${afterFill}" points="21.8,29 16,23.6 16,1 19.8,1 29,15.3 29,29"/>
	<path fill="${after}" d="M19.1,2L28,15.6V28h-5.8L17,23.1V2h2 M20.4,0H15v24l6.4,6H30V15L20.4,0L20.4,0z"/>
	`;

	// log(`makeActionButtonIcon.switchComponent`, 'end');
	return svgWrap(re);
};

// Boolean combine actions
makeActionButtonIcon.subtractUsingBottom = function () {
	let re = '';
	let blue = actionButtonIconColors.blueOutline;
	let fill = actionButtonIconColors.darkFill;
	let sub = actionButtonIconColors.lightFill;

	re += `
		<path fill="${fill}" d="M11,29v-6c6.6,0,12-5.4,12-12h6v18H11z"/>
		<path fill="${blue}" d="M28,12v16H12v-4c6.4-0.5,11.5-5.6,12-12H28 M30,10h-8.1c0,0.3,0.1,0.7,0.1,1c0,6.1-4.9,11-11,11c-0.3,0-0.7,0-1-0.1V30h20V10L30,10z"/>
		<circle fill="${sub}" cx="11" cy="11" r="11"/>
	`;

	return svgWrap(re);
};

makeActionButtonIcon.subtractUsingTop = function () {
	let re = '';
	let blue = actionButtonIconColors.blueOutline;
	let fill = actionButtonIconColors.darkFill;
	let sub = actionButtonIconColors.lightFill;

	re += `
		<rect fill="${sub}" x="11" y="11" width="19" height="19"/>
		<path fill="${fill}" d="M10,21c-5-0.5-9-4.8-9-10C1,5.5,5.5,1,11,1c5.2,0,9.4,4,10,9H10V21z"/>
		<path fill="${blue}" d="M11,2c4.3,0,7.9,3,8.8,7H11H9v2v8.8c-4-0.9-7-4.5-7-8.8C2,6,6,2,11,2 M11,0C4.9,0,0,4.9,0,11s4.9,11,11,11V11h11C22,4.9,17.1,0,11,0L11,0z"/>
	`;

	return svgWrap(re);
};

makeActionButtonIcon.combine = function () {
	let re = '';
	let blue = actionButtonIconColors.blueOutline;
	let fill = actionButtonIconColors.darkFill;

	re += `
		<path fill="${fill}" d="M11,29v-8L10.1,21C4.9,20.5,1,16.2,1,11C1,5.5,5.5,1,11,1c5.2,0,9.5,3.9,10,9.1L21,11h8v18H11z"/>
		<path fill="${blue}" d="M11,2c4.7,0,8.5,3.5,9,8.2l0.2,1.8h1.8H28v16H12v-6.1v-1.8L10.2,20C5.5,19.5,2,15.7,2,11C2,6,6,2,11,2M11,0C4.9,0,0,4.9,0,11c0,5.7,4.4,10.4,10,10.9V30h20V10h-8.1C21.4,4.4,16.7,0,11,0L11,0z"/>
	`;

	return svgWrap(re);
};

makeActionButtonIcon.deletePath = function (isComponentInstance = false) {
	let re = '';
	let red = actionButtonIconColors.redX;
	let accent = actionButtonIconColors.blueOutline;
	let fill = actionButtonIconColors.darkFill;
	if (isComponentInstance) {
		accent = actionButtonIconColors.greenOutline;
		fill = actionButtonIconColors.lightFill;
	}

	// path
	re += `
		<rect fill="${fill}" x="1" y="1"	width="16" height="16"/>
		<path fill="${accent}" d="M16,2v14H2V2H16 M18,0H0v18h18V0L18,0z"/>
	`;

	// delete
	re += `
		<path fill="${red}" d="M26.4,29c0.6,0.8,3.5-0.8,2.4-2.2c-2.4-3.1-8.6-9.6-11.5-11.9c-2.1-1.7-4.1-0.4-4.1-0.4S21,21.9,26.4,29z"/>
		<path fill="${red}" d="M17.2,28.8c-0.9,1.6-3.7-0.2-2.3-2c2.7-3.6,7.9-10.4,11.5-13c2.3-1.7,3.7-0.1,3.7-0.1S22.1,20.7,17.2,28.8z"/>
	`;

	return svgWrap(re);
};

// Layer actions
makeActionButtonIcon.moveLayerDown = function () {
	let re = '';
	let accent = actionButtonIconColors.blueOutline;
	let fill = actionButtonIconColors.darkFill;

	re += `
		<rect fill="${accent}" x="23" y="21" width="2" height="7"/>
		<path fill="${accent}" d="M20,26h8l-4,4C24,30,19.9,25.9,20,26z"/>
		<polygon fill="${accent}" points="15,17 5.4,12.5 0,15 15,22 30,15 24.6,12.5"/>
		<polygon fill="${fill}" points="15,14 0,7 15,0 30,7"/>
	`;

	return svgWrap(re);
};

makeActionButtonIcon.moveLayerUp = function () {
	let re = '';
	let accent = actionButtonIconColors.blueOutline;
	let fill = actionButtonIconColors.darkFill;

	re += `
		<rect fill="${accent}" x="23" y="23" width="2" height="7"/>
		<path fill="${accent}" d="M20,25h8l-4-4C24,21,19.9,25.1,20,25z"/>
		<polygon fill="${fill}" points="15,17 5.4,12.5 0,15 15,22 30,15 24.6,12.5"/>
		<polygon fill="${accent}" points="15,14 0,7 15,0 30,7"/>
	`;

	return svgWrap(re);
};

// Path align actions
makeActionButtonIcon.align = function (edge) {
	let re = '';
	let blue = actionButtonIconColors.blueOutline;
	let fill = actionButtonIconColors.darkFill;

	switch (edge) {
		case 'bottom':
			re += `
				<rect fill="${fill}" x="1" y="21" width="6" height="8"/>
				<path fill="${blue}" d="M6,22v6H2v-6H6 M8,20H0v10h8V20L8,20z"/>
				<rect fill="${fill}" x="12" y="5" width="6" height="24"/>
				<path fill="${blue}" d="M17,6v22h-4V6H17 M19,4h-8v26h8V4L19,4z"/>
				<rect fill="${fill}" x="23" y="15" width="6" height="14"/>
				<path fill="${blue}" d="M28,16v12h-4V16H28 M30,14h-8v16h8V14L30,14z"/>
			`;
			break;

		case 'middle':
			re += `
				<rect fill="${fill}" x="1" y="11" width="6" height="8"/>
				<path fill="${blue}" d="M6,12v6H2v-6H6 M8,10H0v10h8V10L8,10z"/>
				<rect fill="${fill}" x="12" y="3" width="6" height="24"/>
				<path fill="${blue}" d="M17,4v22h-4V4H17 M19,2h-8v26h8V2L19,2z"/>
				<rect fill="${fill}" x="23" y="8" width="6" height="14"/>
				<path fill="${blue}" d="M28,9v12h-4V9H28 M30,7h-8v16h8V7L30,7z"/>
			`;
			break;

		case 'top':
			re += `
				<rect fill="${fill}" x="1" y="1" width="6" height="8"/>
				<path fill="${blue}" d="M6,2v6H2V2H6 M8,0H0v10h8V0L8,0z"/>
				<rect fill="${fill}" x="12" y="1" width="6" height="24"/>
				<path fill="${blue}" d="M17,2v22h-4V2H17 M19,0h-8v26h8V0L19,0z"/>
				<rect fill="${fill}" x="23" y="1" width="6" height="14"/>
				<path fill="${blue}" d="M28,2v12h-4V2H28 M30,0h-8v16h8V0L30,0z"/>
			`;
			break;

		case 'left':
			re += `
				<rect fill="${fill}" x="1" y="1" width="8" height="6"/>
				<path fill="${blue}" d="M8,2v4H2V2H8 M10,0H0v8h10V0L10,0z"/>
				<rect fill="${fill}" x="1" y="12" width="24" height="6"/>
				<path fill="${blue}" d="M24,13v4H2v-4H24 M26,11H0v8h26V11L26,11z"/>
				<rect fill="${fill}" x="1" y="23" width="14" height="6"/>
				<path fill="${blue}" d="M14,24v4H2v-4H14 M16,22H0v8h16V22L16,22z"/>
			`;
			break;

		case 'center':
			re += `
				<rect fill="${fill}" x="11" y="1" width="8" height="6"/>
				<path fill="${blue}" d="M18,2v4h-6V2H18 M20,0H10v8h10V0L20,0z"/>
				<rect fill="${fill}" x="3" y="12" width="24" height="6"/>
				<path fill="${blue}" d="M26,13v4H4v-4H26 M28,11H2v8h26V11L28,11z"/>
				<rect fill="${fill}" x="8" y="23" width="14" height="6"/>
				<path fill="${blue}" d="M21,24v4H9v-4H21 M23,22H7v8h16V22L23,22z"/>
			`;
			break;

		case 'right':
			re += `
				<rect fill="${fill}" x="21" y="1" width="8" height="6"/>
				<path fill="${blue}" d="M28,2v4h-6V2H28 M30,0H20v8h10V0L30,0z"/>
				<rect fill="${fill}" x="5" y="12" width="24" height="6"/>
				<path fill="${blue}" d="M28,13v4H6v-4H28 M30,11H4v8h26V11L30,11z"/>
				<rect fill="${fill}" x="15" y="23" width="14" height="6"/>
				<path fill="${blue}" d="M28,24v4H16v-4H28 M30,22H14v8h16V22L30,22z"/>
			`;
			break;
	}

	return svgWrap(re);
};

// Point actions
makeActionButtonIcon.resetPathPoint = function () {
	let re = '';
	let blue = actionButtonIconColors.blueOutline;
	let gray = actionButtonIconColors.grayOutline;

	// Other handles
	re += `
		<circle display="inline" fill="${gray}" cx="20" cy="27" r="3"/>
		<circle display="inline" fill="${gray}" cx="27" cy="13" r="3"/>
		<line display="inline" fill="none" stroke="${gray}" stroke-miterlimit="10" x1="20" y1="27" x2="13" y2="13"/>
		<line display="inline" fill="none" stroke="${gray}" stroke-miterlimit="10" x1="13" y1="13" x2="27" y2="13"/>
	`;

	// Handles
	re += `
		<line stroke="${blue}" fill="none" stroke-miterlimit="10" x1="4" y1="22" x2="22" y2="4"/>
		<rect fill="#FFFFFF" x="9.5" y="9.5" width="7" height="7"/>
		<path fill="${blue}" d="M16,10v6h-6v-6H16 M17,9h-1h-6H9v1v6v1h1h6h1v-1v-6V9L17,9z"/>
		<circle fill="${blue}" cx="3" cy="23" r="3"/>
		<circle fill="${blue}" cx="23" cy="3" r="3"/>
	`;

	return svgWrap(re);
};

makeActionButtonIcon.deletePathPoint = function () {
	let re = '';
	let blue = actionButtonIconColors.blueOutline;
	let red = actionButtonIconColors.redX;

	// Handles
	re += `
		<line stroke="${blue}" fill="none" stroke-miterlimit="10" x1="4" y1="22" x2="22" y2="4"/>
		<rect fill="#FFFFFF" x="9.5" y="9.5" width="7" height="7"/>
		<path fill="${blue}" d="M16,10v6h-6v-6H16 M17,9h-1h-6H9v1v6v1h1h6h1v-1v-6V9L17,9z"/>
		<circle fill="${blue}" cx="3" cy="23" r="3"/>
		<circle fill="${blue}" cx="23" cy="3" r="3"/>
	`;

	// delete
	re += `
		<path fill="${red}" d="M26.4,29c0.6,0.8,3.5-0.8,2.4-2.2c-2.4-3.1-8.6-9.6-11.5-11.9c-2.1-1.7-4.1-0.4-4.1-0.4S21,21.9,26.4,29z"/>
		<path fill="${red}" d="M17.2,28.8c-0.9,1.6-3.7-0.2-2.3-2c2.7-3.6,7.9-10.4,11.5-13c2.3-1.7,3.7-0.1,3.7-0.1S22.1,20.7,17.2,28.8z"/>';
	`;

	return svgWrap(re);
};

makeActionButtonIcon.insertPathPoint = function () {
	let re = '';
	let blue = actionButtonIconColors.blueOutline;

	// Handles
	re += `
		<line stroke="${blue}" fill="none" stroke-miterlimit="10" x1="4" y1="22" x2="22" y2="4"/>
		<rect fill="#FFFFFF" x="9.5" y="9.5" width="7" height="7"/>
		<path fill="${blue}" d="M16,10v6h-6v-6H16 M17,9h-1h-6H9v1v6v1h1h6h1v-1v-6V9L17,9z"/>
		<circle fill="${blue}" cx="3" cy="23" r="3"/>
		<circle fill="${blue}" cx="23" cy="3" r="3"/>
	`;

	// add
	re += `
		<rect x="21" y="15" fill="${blue}" width="3" height="15"/>
		<rect x="15" y="21" fill="${blue}" width="15" height="3"/>';
	`;

	return svgWrap(re);
};

makeActionButtonIcon.selectNextPathPoint = function () {
	let re = '';
	let blue = actionButtonIconColors.blueOutline;
	let gray = actionButtonIconColors.grayOutline;
	re += `
		<rect x="22.5" y="11.5" width="7" height="7" fill="white"/>
		<path d="m29,12v6h-6v-6h6m1-1h-8v8h8v-8h0Z" fill="${blue}"/>
		<path d="m19,15s-7-7-7-7v5h-6v4h6v5s7-7,7-7Z" fill="${gray}"/>
		<rect y="13" width="3" height="4" fill="${gray}"/>
	`;
	return svgWrap(re);
};

makeActionButtonIcon.selectPreviousPathPoint = function () {
	let re = '';
	let blue = actionButtonIconColors.blueOutline;
	let gray = actionButtonIconColors.grayOutline;
	re += `
		<rect x=".5" y="11.5" width="7" height="7" fill="white"/>
		<path d="m7,12v6H1v-6h6m1-1H0v8h8v-8h0Z" fill="${blue}"/>
		<path d="m11,15s7-7,7-7v5h6v4h-6s0,5,0,5l-7-7Z" fill="${gray}"/>
		<rect x="27" y="13" width="3" height="4" fill="${gray}"/>
	`;
	return svgWrap(re);
};

// Dev actions for testing and default
makeActionButtonIcon.default = function () {
	let re = `<rect width="30" height="30" fill="${actionButtonIconColors.greenOutline}"/>`;
	return svgWrap(re);
};

makeActionButtonIcon.test = function () {
	let re = `
		<path d="M28.05,23.82c-1.65-1.79-9.55-13.02-9.55-17.82V3h1c.28,0,.5-.72,.5-1s-.22-1-.5-1H10.5c-.28,0-.5,.72-.5,1s.22,1,.5,1h1v3c0,4.8-7.9,16.03-9.55,17.82-.58,.55-.95,1.32-.95,2.18,0,1.66,1.34,3,3,3H26c1.66,0,3-1.34,3-3,0-.86-.37-1.63-.95-2.18ZM13.5,6V3h3v3c0,2.76,2.01,6.95,4.25,10.72-3.27,1.69-5.6-.72-7.75-.72-.34,0-1.86-.31-4,1.15,2.34-3.88,4.5-8.28,4.5-11.15Zm3.5,20c-1.66,0-3-1.34-3-3s1.34-3,3-3,3,1.34,3,3-1.34,3-3,3Zm-6-7.5c0-.83,.67-1.5,1.5-1.5s1.5,.67,1.5,1.5-.67,1.5-1.5,1.5-1.5-.67-1.5-1.5Z" fill=${actionButtonIconColors.redX}/>
		<circle cx="15" cy="14" r="1" fill=${actionButtonIconColors.redX}/>
	`;

	return svgWrap(re);
};
