import { accentColors, uiColors } from '../common/colors.js';
import { makeElement } from '../common/dom.js';

// --------------------------------------------------------------
// Action Buttons
// --------------------------------------------------------------

export function makeActionButton({
	iconName = 'default',
	iconOptions = false,
	title = '',
	disabled = false,
	onClick = () => { },
	id = false,
} = {}) {
	// log(`makeActionButton`, 'start');
	// log(`iconName: ${iconName}`);
	// log(`iconOptions: ${iconOptions}`);
	// log(`disabled: ${disabled}`);
	// log(`${makeActionButtonIcon[iconName](iconOptions)}`);
	let newButton = makeElement({
		tag: 'button',
		innerHTML: makeActionButtonIcon[iconName](iconOptions),
		attributes: {
			title: title,
		},
	});

	if (onClick) newButton.addEventListener('click', onClick);
	if (disabled) newButton.setAttribute('disabled', 'disabled');
	if (typeof id === 'string') newButton.setAttribute('id', id);

	// log(`makeActionButton`, 'end');
	return newButton;
}

// --------------------------------------------------------------
// Action button icons
// --------------------------------------------------------------

export let makeActionButtonIcon = {};

export function svgWrap(content, size = '30') {
	let re = `
		<svg
			version="1.1" viewBox="0 0 ${size} ${size}"
			height="100%" width="100%"
			xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
		>
			${content}
			`;

	return re;
}

let actionButtonIconColors = {
	darkFill: accentColors.gray.l25,
	lightFill: accentColors.gray.l85,
	blueOutline: accentColors.blue.l70,
	greenOutline: accentColors.green.l70,
	grayOutline: accentColors.gray.l70,
	purpleOutline: accentColors.purple.l40,
	redX: uiColors.red,
};

// Universal actions
makeActionButtonIcon.copy = () => {
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

makeActionButtonIcon.paste = () => {
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

makeActionButtonIcon.clearClipboard = () => {
	let re = '';
	let blue = actionButtonIconColors.blueOutline;
	let fill = actionButtonIconColors.darkFill;
	let red = actionButtonIconColors.redX;

	re += `
		<rect fill="${fill}" x="5" y="7"	width="20" height="22"/>
		<path fill="${blue}" d="M24,8v20H6V8H24 M26,6H4v24h22V6L26,6z"/>
		<path fill="${fill}" d="M9,9V4h3V3c0-1.3,1.8-2,3-2s3,0.7,3,2v1h3v5H9z"/>
		<path fill="${blue}" d="M15,2c0.9,0,2,0.5,2,1v2h2h1v3H10V5h1h2V3C13,2.5,14.1,2,15,2 M15,0c-1.7,0-4,1-4,3H8v7h14V3h-3C19,1,16.7,0,15,0L15,0z"/>
		<path fill="${red}" d="M26.4,29c0.6,0.8,3.5-0.8,2.4-2.2c-2.4-3.1-8.6-9.6-11.5-11.9c-2.1-1.7-4.1-0.4-4.1-0.4S21,21.9,26.4,29z"/>
		<path fill="${red}" d="M17.2,28.8c-0.9,1.6-3.7-0.2-2.3-2c2.7-3.6,7.9-10.4,11.5-13c2.3-1.7,3.7-0.1,3.7-0.1S22.1,20.7,17.2,28.8z"/>
	`;

	return svgWrap(re);
};

makeActionButtonIcon.pastePathsFromAnotherGlyph = () => {
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

makeActionButtonIcon.pastePathsFromAnotherProject = () => {
	let background = actionButtonIconColors.lightFill;
	let purple = actionButtonIconColors.purpleOutline;

	const re = `
		<path fill="${background}" d="m11.5,1c4.817,0,7.471,0,8.986,1.514,1.514,1.515,1.514,4.168,1.514,8.986s0,7.471-1.514,8.985c-1.515,1.515-4.168,1.515-8.986,1.515s-7.471,0-8.985-1.515c-1.515-1.514-1.515-4.168-1.515-8.985s0-7.471,1.515-8.986c1.514-1.514,4.168-1.514,8.985-1.514"/>
		<path fill="${purple}" d="m11.5,23c-5.084,0-7.886,0-9.692-1.808-1.808-1.808-1.808-4.608-1.808-9.692S0,3.615,1.808,1.808C3.614,0,6.416,0,11.5,0s7.886,0,9.692,1.808c1.808,1.808,1.808,4.608,1.808,9.692s0,7.885-1.808,9.692c-1.807,1.808-4.608,1.808-9.692,1.808Zm0-21c-4.55,0-7.057,0-8.278,1.222s-1.222,3.729-1.222,8.278,0,7.057,1.222,8.278,3.728,1.222,8.278,1.222,7.057,0,8.278-1.222,1.222-3.729,1.222-8.278,0-7.057-1.222-8.278-3.728-1.222-8.278-1.222Z"/>
		<rect fill="${purple}" x="5" y="5" width="3" height="3"/>
		<path fill="${background}" d="m18.5,8c4.817,0,7.471,0,8.986,1.514,1.514,1.515,1.514,4.168,1.514,8.986s0,7.471-1.514,8.985c-1.515,1.515-4.168,1.515-8.986,1.515s-7.471,0-8.985-1.515c-1.515-1.514-1.515-4.168-1.515-8.985s0-7.471,1.515-8.986c1.514-1.514,4.168-1.514,8.985-1.514"/>
		<path fill="${purple}" d="m28.192,8.808c-1.807-1.808-4.608-1.808-9.692-1.808-.176,0-.329,0-.5,0v-2.001h-3v2.033c-.735.022-1.389.068-2,.133v-2.166h-3v2.961c-.437.228-.841.495-1.192.847-.352.352-.618.756-.847,1.192h-2.961v3h2.166c-.065.611-.111,1.265-.133,2h-2.033v3h2.001c0,.171,0,.324,0,.5,0,5.084,0,7.885,1.808,9.692,1.807,1.808,4.608,1.808,9.692,1.808s7.886,0,9.692-1.808c1.808-1.808,1.808-4.608,1.808-9.692s0-7.885-1.808-9.692Zm-1.414,17.971c-1.222,1.222-3.728,1.222-8.278,1.222s-7.057,0-8.278-1.222-1.222-3.729-1.222-8.278,0-7.057,1.222-8.278,3.728-1.222,8.278-1.222,7.057,0,8.278,1.222,1.222,3.729,1.222,8.278,0,7.057-1.222,8.278Z"/>
		<path fill="${purple}" d="m20.233,20h-3.467l-1.092,3h1.525v2h-5.2v-2h1.733l3.467-9h-1.733v-2h6.067v2h-1.733l3.467,9h1.733v2h-5.2v-2h1.517l-1.083-3Zm-.433-1l-1.3-4-1.3,4h2.6Z"/>
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

makeActionButtonIcon.undo = () => {
	let re = '';
	let blue = actionButtonIconColors.blueOutline;
	let fill = actionButtonIconColors.darkFill;

	re += `
		<path fill="${fill}" d="M20.1,23c4.6-5,6.6-9.6,5.5-12.8C24.9,8.2,22.9,7,20,7c-5.9,0-8.8,5.3-8.9,5.5L10.9,13l2.4,4.1l-12,0.8l4-14.4l2.5,4.2l0.9-1.1c0,0,4-4.6,11.2-4.6c4.1,0,7.9,2.8,8.8,6.5C29.4,10.8,29.3,16.3,20.1,23z"/>
		<path fill="${blue}" d="M20,3c3.1,0,6.9,2,7.8,5.7c0.5,2.1-0.1,4.4-1.6,6.7c0.7-2,0.9-3.9,0.3-5.5C25.7,7.4,23.3,6,20,6c-6.5,0-9.6,5.8-9.8,6.1l-0.5,1l0.6,1l1.3,2.2l-8.9,0.6L5.7,6l0.6,1l1.4,2.4l1.8-2.2C9.6,7.2,13.2,3,20,3 M20,1C12.2,1,8,6,8,6L5,1L0,19l15-1l-3-5c0,0,2.6-5,8-5c7.7,0,7.2,9.2-8,21C39.8,15,29.5,1,20,1L20,1z"/>
	`;

	return svgWrap(re);
};

makeActionButtonIcon.linkToGlyph = () => {
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
makeActionButtonIcon.round = () => {
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

makeActionButtonIcon.flipVertical = () => {
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

makeActionButtonIcon.flipHorizontal = () => {
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
makeActionButtonIcon.exportGlyphSVG = () => {
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

makeActionButtonIcon.deleteGlyph = () => {
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
makeActionButtonIcon.reverseWinding = () => {
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

// Boolean combine actions
makeActionButtonIcon.combine_unite = () => {
	let re = '';
	let blue = actionButtonIconColors.blueOutline;
	let fill = actionButtonIconColors.darkFill;

	re += `
		<path d="M15.164,6.4c-.8-3.104-3.61-5.4-6.964-5.4-3.976,0-7.2,3.223-7.2,7.2,0,3.354,2.296,6.164,5.4,6.964v3.836h12.6V6.4h-3.836Z" style="fill: ${fill};"/>
		<path d="M15.738,6c-.889-3.449-4.011-6-7.738-6C3.582,0,0,3.582,0,8c0,3.726,2.551,6.848,6,7.738v4.262h14V6h-4.262ZM18,18h-10v-4c-.702,0-1.373-.127-2-.35-2.327-.826-4-3.044-4-5.65,0-3.308,2.692-6,6-6,2.606,0,4.824,1.673,5.65,4,.223.627.35,1.298.35,2h4v10Z" style="fill: ${blue};"/>
	`;

	return svgWrap(re, '20');
};

makeActionButtonIcon.combine_divide = () => {
	let re = '';
	let blue = actionButtonIconColors.blueOutline;
	let fill = actionButtonIconColors.darkFill;

	re += `
		<path d="M15.164,6.4c-.8-3.104-3.61-5.4-6.964-5.4C4.224,1,1,4.223,1,8.2c0,3.354,2.296,6.164,5.4,6.964v3.836h12.6V6.4h-3.836Z" style="fill: ${fill};"/>
		<path d="M15.738,6c-.889-3.449-4.011-6-7.738-6C3.582,0,0,3.582,0,8c0,3.726,2.551,6.848,6,7.738v4.262h14V6h-4.262ZM2,8c0-3.308,2.692-6,6-6,2.606,0,4.824,1.673,5.65,4h-7.65v7.65c-2.327-.826-4-3.044-4-5.65ZM14,8c0,3.308-2.692,6-6,6v-6h6ZM18,18h-10v-2c4.418,0,8-3.582,8-8h2v10Z" style="fill: ${blue};"/>
	`;

	return svgWrap(re, '20');
};

makeActionButtonIcon.combine_subtract = () => {
	let re = '';
	let blue = actionButtonIconColors.blueOutline;
	let fill = actionButtonIconColors.darkFill;

	re += `
		<path d="M15,6.337c-.791-3.068-3.568-5.337-6.883-5.337C4.186,1,1,4.186,1,8.117c0,3.315,2.27,6.092,5.337,6.883V6.337h8.663Z" style="fill: ${fill};"/>
		<path d="M15.738,6c-.889-3.449-4.011-6-7.738-6C3.582,0,0,3.582,0,8c0,3.726,2.551,6.848,6,7.738v4.262h14V6h-4.262ZM2,8c0-3.308,2.692-6,6-6,2.606,0,4.824,1.673,5.65,4h-7.65v7.65c-2.327-.826-4-3.044-4-5.65ZM18,18h-10v-10h10v10Z" style="fill: ${blue};"/>
	`;

	return svgWrap(re, '20');
};

makeActionButtonIcon.combine_exclude = () => {
	let re = '';
	let blue = actionButtonIconColors.blueOutline;
	let fill = actionButtonIconColors.darkFill;

	re += `
		<path d="M15.347,7c0,5-3.347,8.347-8.347,8.347v3.653h12V7h-3.653Z" style="fill: ${fill};"/>
		<path d="M15,6.337c-.791-3.068-3.568-5.337-6.883-5.337-3.93,0-7.117,3.186-7.117,7.117,0,3.315,2.27,6.092,5.337,6.883V6.337h8.663Z" style="fill: ${fill};"/>
		<path d="M15.738,6c-.889-3.449-4.011-6-7.738-6C3.582,0,0,3.582,0,8c0,3.726,2.551,6.848,6,7.738v4.262h14V6h-4.262ZM2,8c0-3.308,2.692-6,6-6,2.606,0,4.824,1.673,5.65,4h-7.65v7.65c-2.327-.826-4-3.044-4-5.65ZM14,8c0,3.308-2.692,6-6,6v-6h6ZM18,18h-10v-2c4.418,0,8-3.582,8-8h2v10Z" style="fill: ${blue};"/>
	`;

	return svgWrap(re, '20');
};

makeActionButtonIcon.combine_intersect = () => {
	let re = '';
	let blue = actionButtonIconColors.blueOutline;
	let fill = actionButtonIconColors.darkFill;

	re += `
		<path d="M15,8.6c0-.554-.078-1.088-.21-1.6h-7.79v7.79c.512.132,1.046.21,1.6.21,3.535,0,6.4-2.865,6.4-6.4Z" style="fill: ${fill};"/>
		<path d="M15.738,6c-.889-3.449-4.011-6-7.738-6C3.582,0,0,3.582,0,8c0,3.726,2.551,6.848,6,7.738v4.262h14V6h-4.262ZM2,8c0-3.308,2.692-6,6-6,2.606,0,4.824,1.673,5.65,4h-7.65v7.65c-2.327-.826-4-3.044-4-5.65ZM14,8c0,3.308-2.692,6-6,6v-6h6ZM18,18h-10v-2c4.418,0,8-3.582,8-8h2v10Z" style="fill: ${blue};"/>
	`;

	return svgWrap(re, '20');
};

// Kerning actions
makeActionButtonIcon.edit = () => {
	let re = '';
	let accent = actionButtonIconColors.blueOutline;
	let fill = actionButtonIconColors.darkFill;

	re += `
		<path fill="${accent}" d="m28.643,1.357c-1.577-1.577-4.109-1.891-5.651-.349L4,20,0,29l1,1,9-4L28.992,7.008c1.542-1.542,1.228-4.074-.349-5.651Z"/>
		<path fill="${fill}" d="m28.643,1.357C27.771.486,26.608,0,25.482,0,24.57,0,23.682.318,22.992,1.008L4,20,0,29l1,1,9-4L28.992,7.008c1.542-1.542,1.228-4.074-.349-5.651ZM6.268,20.561l15.793-15.793,3.172,3.172-15.793,15.793-3.172-3.172Zm-.662.752l3.082,3.082-5.548,2.466,2.466-5.548ZM27.577,5.594l-1.638,1.638-3.172-3.172,1.638-1.638c.281-.28.643-.423,1.076-.423.611,0,1.264.288,1.747.771.44.44.719,1.018.765,1.586.028.346-.021.842-.416,1.237Z"/>
	`;

	return svgWrap(re);
};

makeActionButtonIcon.delete = () => {
	let re = '';
	let red = actionButtonIconColors.redX;

	re += `
		<path fill="${red}" d="m23.597,28.681c1.121,1.472,6.349-1.368,4.386-3.98C23.74,19.055,12.613,7.416,7.367,3.301,3.535.295,0,2.518,0,2.518c0,0,13.846,13.354,23.597,26.164Z"/>
		<path fill="${red}" d="m6.893,28.339c-1.703,2.813-6.56-.4-4.174-3.566C7.551,18.364,16.797,6.057,23.298,1.396c4.182-2.998,6.702-.235,6.702-.235,0,0-14.277,12.59-23.107,27.178Z"/>
	`;

	return svgWrap(re);
};

makeActionButtonIcon.createNewKernGroup = () => {
	let re = '';
	let green = actionButtonIconColors.greenOutline;
	let fill = actionButtonIconColors.darkFill;
	re += `
		<path d="m16.306,19.001l-4.324-11.39h-1.593v-1.611h5.08v1.611h-1.487l3.278,8.641,3.19-8.641h-1.501v-1.611h4.941v1.611h-1.563l-4.235,11.39h-1.786Z" fill="${fill}"/>
		<path d="m12.197,17.375l-3.58-9.75h1.57v-1.625H3.548v1.625h1.517l-3.493,9.75H0v1.625h5.116v-1.625h-1.578l.994-2.941h4.679l.966,2.941h-1.615v1.625h5.088v-1.625h-1.453Zm-7.181-4.463l1.751-5.287h.273l1.682,5.287h-3.705Z" fill="${fill}"/>
		<polygon points="13 20.5 13 22.5 0 22.5 0 23.5 13 23.5 13 25.5 14 25.5 14 20.5 13 20.5" fill="${fill}"/>
		<polygon points="24 2 10 2 10 0 9 0 9 5 10 5 10 3 24 3 24 2" fill="${fill}"/>
		<rect x="21" y="15" width="3" height="15" fill="${green}"/>
		<rect x="21" y="15" width="3" height="15" transform="translate(45 0) rotate(90)" fill="${green}"/>
	`;

	return svgWrap(re);
};

makeActionButtonIcon.deleteSingleLetterPair = () => {
	let re = '';
	let red = actionButtonIconColors.redX;
	let fill = actionButtonIconColors.darkFill;
	re += `
		<path d="m16.306,19.001l-4.324-11.39h-1.593v-1.611h5.08v1.611h-1.487l3.278,8.641,3.19-8.641h-1.501v-1.611h4.941v1.611h-1.563l-4.235,11.39h-1.786Z" fill="${fill}"/>
		<path d="m12.197,17.375l-3.58-9.75h1.57v-1.625H3.548v1.625h1.517l-3.493,9.75H0v1.625h5.116v-1.625h-1.578l.994-2.941h4.679l.966,2.941h-1.615v1.625h5.088v-1.625h-1.453Zm-7.181-4.463l1.751-5.287h.273l1.682,5.287h-3.705Z" fill="${fill}"/>
		<path d="m26.428,29.033c.625.821,3.542-.763,2.447-2.22-2.367-3.149-8.574-9.642-11.5-11.938-2.138-1.677-4.11-.437-4.11-.437,0,0,7.723,7.449,13.163,14.595Z" fill="${red}"/>
		<path d="m17.111,28.842c-.95,1.569-3.659-.223-2.328-1.989,2.695-3.575,7.853-10.44,11.479-13.04,2.333-1.673,3.739-.131,3.739-.131,0,0-7.964,7.023-12.889,15.16Z" fill="${red}"/>
	`;

	return svgWrap(re);
};

makeActionButtonIcon.findSingleLetterPair = () => {
	let re = '';
	let blue = actionButtonIconColors.blueOutline;
	let fill = actionButtonIconColors.darkFill;
	re += `
		<path d="m16.306,19.001l-4.324-11.39h-1.593v-1.611h5.08v1.611h-1.487l3.278,8.641,3.19-8.641h-1.501v-1.611h4.941v1.611h-1.563l-4.235,11.39h-1.786Z" fill="${fill}"/>
		<path d="m12.197,17.375l-3.58-9.75h1.57v-1.625H3.548v1.625h1.517l-3.493,9.75H0v1.625h5.116v-1.625h-1.578l.994-2.941h4.679l.966,2.941h-1.615v1.625h5.088v-1.625h-1.453Zm-7.181-4.463l1.751-5.287h.273l1.682,5.287h-3.705Z" fill="${fill}"/>
		<path d="m30,28l-5.154-5.154c.728-1.104,1.154-2.425,1.154-3.846,0-3.866-3.134-7-7-7s-7,3.134-7,7,3.134,7,7,7c1.421,0,2.742-.426,3.846-1.154l5.154,5.154,2-2Zm-15.5-9c0-2.481,2.019-4.5,4.5-4.5s4.5,2.019,4.5,4.5-2.019,4.5-4.5,4.5-4.5-2.019-4.5-4.5Z" fill="${blue}"/>
	`;

	return svgWrap(re);
};

// Layer actions
makeActionButtonIcon.moveLayerDown = () => {
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

makeActionButtonIcon.moveLayerUp = () => {
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
				<rect x="0" y="18" width="20" height="2" style="fill: ${blue};"/>
				<rect x="1" y="11" width="4" height="6" style="fill: ${fill};"/>
				<rect x="8" y="1" width="4" height="16" style="fill: ${fill};"/>
				<rect x="15" y="5" width="4" height="12" style="fill: ${fill};"/>
			`;
			break;

		case 'middle':
			re += `
				<rect x="0" y="9" width="20" height="2" style="fill: ${blue};"/>
				<rect x="1" y="7" width="4" height="6" style="fill: ${fill};"/>
				<rect x="8" y="2" width="4" height="16" style="fill: ${fill};"/>
				<rect x="15" y="4" width="4" height="12" style="fill: ${fill};"/>
			`;
			break;

		case 'top':
			re += `
				<rect x="0" width="20" height="2" style="fill: ${blue};"/>
				<rect x="1" y="3" width="4" height="6" style="fill: ${fill};"/>
				<rect x="8" y="3" width="4" height="16" style="fill: ${fill};"/>
				<rect x="15" y="3" width="4" height="12" style="fill: ${fill};"/>
			`;
			break;

		case 'left':
			re += `
				<rect x="0" width="2" height="20" style="fill: ${blue};"/>
				<rect x="3" y="1" width="6" height="4" style="fill: ${fill};"/>
				<rect x="3" y="8" width="16" height="4" style="fill: ${fill};"/>
				<rect x="3" y="15" width="12" height="4" style="fill: ${fill};"/>
			`;
			break;

		case 'center':
			re += `
				<rect x="9.016" width="2" height="20" style="fill: ${blue};"/>
				<rect x="7" y="1" width="6" height="4" style="fill: ${fill};"/>
				<rect x="2" y="8" width="16" height="4" style="fill: ${fill};"/>
				<rect x="4" y="15" width="12" height="4" style="fill: ${fill};"/>
			`;
			break;

		case 'right':
			re += `
				<rect x="18" width="2" height="20" style="fill: ${blue};"/>
				<rect x="11" y="1" width="6" height="4" style="fill: ${fill};"/>
				<rect x="1" y="8" width="16" height="4" style="fill: ${fill};"/>
				<rect x="5" y="15" width="12" height="4" style="fill: ${fill};"/>
			`;
			break;
	}

	return svgWrap(re, '20');
};

// Point actions
makeActionButtonIcon.resetPathPoint = () => {
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

makeActionButtonIcon.deletePathPoint = () => {
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

makeActionButtonIcon.insertPathPoint = () => {
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

makeActionButtonIcon.selectNextPathPoint = () => {
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

makeActionButtonIcon.selectPreviousPathPoint = () => {
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
makeActionButtonIcon.default = () => {
	let re = `<rect width="30" height="30" fill="${actionButtonIconColors.greenOutline}"/>`;
	return svgWrap(re);
};

makeActionButtonIcon.test = () => {
	let re = `
		<path d="M28.05,23.82c-1.65-1.79-9.55-13.02-9.55-17.82V3h1c.28,0,.5-.72,.5-1s-.22-1-.5-1H10.5c-.28,0-.5,.72-.5,1s.22,1,.5,1h1v3c0,4.8-7.9,16.03-9.55,17.82-.58,.55-.95,1.32-.95,2.18,0,1.66,1.34,3,3,3H26c1.66,0,3-1.34,3-3,0-.86-.37-1.63-.95-2.18ZM13.5,6V3h3v3c0,2.76,2.01,6.95,4.25,10.72-3.27,1.69-5.6-.72-7.75-.72-.34,0-1.86-.31-4,1.15,2.34-3.88,4.5-8.28,4.5-11.15Zm3.5,20c-1.66,0-3-1.34-3-3s1.34-3,3-3,3,1.34,3,3-1.34,3-3,3Zm-6-7.5c0-.83,.67-1.5,1.5-1.5s1.5,.67,1.5,1.5-.67,1.5-1.5,1.5-1.5-.67-1.5-1.5Z" fill="${actionButtonIconColors.redX}"/>
		<circle cx="15" cy="14" r="1" fill="${actionButtonIconColors.redX}"/>
	`;

	return svgWrap(re);
};
