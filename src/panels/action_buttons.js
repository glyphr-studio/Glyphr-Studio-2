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
	onClick = () => {},
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

export function svgWrap(content, size = '20') {
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

const icon = {
	actionDarkBlue: accentColors.royal.l50,
	actionLightBlue: accentColors.royal.l85,
	crossProjectDarkPurple: accentColors.purple.l45,
	crossProjectLightPurple: accentColors.purple.l85,
	componentDarkGreen: accentColors.green.l65,
	componentLightGreen: accentColors.green.l95,
	dangerRed: uiColors.red,
	darkGray: accentColors.gray.l10,
	mediumGray: accentColors.gray.l50,
	lightGray: accentColors.gray.l80,
	combineOutline: accentColors.royal.l40,
	combineFill: accentColors.royal.l80,
};

const overlay = {
	delete: `
		<g data-name="Overlay Delete">
			<path d="M17.617,8.683c.749-1.101,3.184.156,1.787,1.787-3.574,4.169-8.404,10.53-10.721,8.934,0-1.191,5.317-5.404,8.934-10.721Z" fill="${icon.dangerRed}"/>
			<path d="M10.47,8.555c-1.445-.867-3.208.882-1.787,1.787,7.317,4.658,7.317,9.658,11.317,9.658-1.165-2.388-4-8.128-9.53-11.445Z" fill="${icon.dangerRed}"/>
		</g>`,
	add: `
		<g data-name="Overlay Add">
			<rect x="14" y="10" width="2" height="10" fill="${icon.actionDarkBlue}"/>
			<rect x="10" y="14" width="10" height="2" fill="${icon.actionDarkBlue}"/>
		</g>`,
};

// Universal actions
makeActionButtonIcon.copy = () => {
	const re = `
		<g>
			<polygon points=".5 15.516 .5 6.223 6.207 .516 11.5 .516 11.5 15.516 .5 15.516" fill="${icon.darkGray}"/>
			<path d="M11,1v14H1V6.431L6.414,1h4.586M12,h-6L0,6v10h12Vh0Z" fill="${icon.lightGray}"/>
		</g>
		<g>
			<polygon points="8.5 19.516 8.5 10.223 14.207 4.516 19.5 4.516 19.5 19.516 8.5 19.516" fill="${icon.actionLightBlue}"/>
			<path d="M19,5v14h-10v-8.586l5.414-5.414h4.586M20,4h-6l-6,6v10h12V4h0Z" fill="${icon.actionDarkBlue}"/>
		</g>
	`;

	return svgWrap(re);
};

makeActionButtonIcon.paste = () => {
	const re = `
		<g data-name="Clipboard">
			<g>
				<rect x="3.5" y="4.5" width="13" height="15" fill="${icon.lightGray}"/>
				<path d="M16,5v14H4V5h12M17,4H3v16h14V4h0Z" fill="${icon.actionDarkBlue}"/>
			</g>
			<g>
				<path d="M6.5,5.5v-3h1v-.5c0-.901,1.505-1.5,2.5-1.5s2.5.599,2.5,1.5v.5h1v3h-7Z" fill="${icon.lightGray}"/>
				<path d="M10,1c.836,0,2,.504,2,1v1h1v2h-6v-2h1v-1c0-.496,1.164-1,2-1M10,0c-1.105,0-3,.667-3,2h-1v4h8V2h-1c0-1.333-1.895-2-3-2h0Z" fill="${icon.actionDarkBlue}"/>
			</g>
		</g>
	`;

	return svgWrap(re);
};

makeActionButtonIcon.clearClipboard = () => {
	const re = `
		<g data-name="Clipboard">
			<g>
				<rect x="3.5" y="4.5" width="13" height="15" fill="${icon.lightGray}"/>
				<path d="M16,5v14H4V5h12M17,4H3v16h14V4h0Z" fill="${icon.actionDarkBlue}"/>
			</g>
			<g>
				<path d="M6.5,5.5v-3h1v-.5c0-.901,1.505-1.5,2.5-1.5s2.5.599,2.5,1.5v.5h1v3h-7Z" fill="${icon.lightGray}"/>
				<path d="M10,1c.836,0,2,.504,2,1v1h1v2h-6v-2h1v-1c0-.496,1.164-1,2-1M10,0c-1.105,0-3,.667-3,2h-1v4h8V2h-1c0-1.333-1.895-2-3-2h0Z" fill="${icon.actionDarkBlue}"/>
			</g>
		</g>
		${overlay.delete}
	`;

	return svgWrap(re);
};

makeActionButtonIcon.pastePathsFromAnotherGlyph = () => {
	const re = `
		<g data-name="Clipboard">
			<g>
				<rect x="3.5" y="4.5" width="13" height="15" fill="${icon.actionLightBlue}"/>
				<path d="M16,5v14H4V5h12M17,4H3v16h14V4h0Z" fill="${icon.mediumGray}"/>
			</g>
			<g>
				<path d="M6.5,5.5v-3h1v-.5c0-.901,1.505-1.5,2.5-1.5s2.5.599,2.5,1.5v.5h1v3h-7Z" fill="${icon.actionLightBlue}"/>
				<path d="M10,1c.836,0,2,.504,2,1v1h1v2h-6v-2h1v-1c0-.496,1.164-1,2-1M10,0c-1.105,0-3,.667-3,2h-1v4h8V2h-1c0-1.333-1.895-2-3-2h0Z" fill="${icon.mediumGray}"/>
			</g>
		</g>
		<g data-name="Get Shapes">
			<path d="M13.26,16l-2.548-7h.787v-1h-3v1h.787l-2.548,7h-1.24v1h3v-1h-.696l.728-2h2.937l.728,2h-.696v1h3v-1h-1.24ZM8.896,13l1.104-3.034,1.104,3.034h-2.209Z" fill="${icon.actionDarkBlue}"/>
		</g>
	`;

	return svgWrap(re);
};

makeActionButtonIcon.pastePathsFromAnotherProject = () => {
	const re = `
		<g data-name="Paste from other project">
			<g>
				<path d="M7,1c2.753,0,4.269,0,5.135.865.865.865.865,2.382.865,5.135s0,4.269-.865,5.135c-.865.865-2.382.865-5.135.865s-4.269,0-5.135-.865c-.865-.865-.865-2.382-.865-5.135S1,2.731,1.865,1.865c.865-.865,2.382-.865,5.135-.865Z" fill="${icon.crossProjectLightPurple}"/>
				<path d="M7,1c2.753,0,4.269,0,5.135.865.865.865.865,2.382.865,5.135s0,4.269-.865,5.135c-.865.865-2.382.865-5.135.865s-4.269,0-5.135-.865c-.865-.865-.865-2.382-.865-5.135S1,2.731,1.865,1.865c.865-.865,2.382-.865,5.135-.865M7,0C4.079,0,2.317,0,1.158,1.158,0,2.317,0,4.079,0,7S0,11.683,1.158,12.842c1.158,1.158,2.921,1.158,5.842,1.158s4.683,0,5.842-1.158c1.158-1.158,1.158-2.921,1.158-5.842s0-4.683-1.158-5.842c-1.158-1.158-2.921-1.158-5.842-1.158h0Z" fill="${icon.crossProjectDarkPurple}"/>
				<rect x="3" y="3" width="2" height="2" fill="${icon.crossProjectDarkPurple}"/>
				<rect x="6" y="3" width="2" height="2" fill="${icon.crossProjectDarkPurple}"/>
				<rect x="3" y="6" width="2" height="2" fill="${icon.crossProjectDarkPurple}"/>
				<rect x="6" y="6" width="2" height="2" fill="${icon.crossProjectDarkPurple}"/>
				<rect x="3" y="9" width="2" height="2" fill="${icon.crossProjectDarkPurple}"/>
				<rect x="9" y="3" width="2" height="2" fill="${icon.crossProjectDarkPurple}"/>
			</g>
			<g>
				<path d="M13.5,8c2.523,0,3.913,0,4.707.793.793.793.793,2.183.793,4.707s0,3.913-.793,4.707c-.793.793-2.183.793-4.707.793s-3.913,0-4.707-.793c-.793-.793-.793-2.183-.793-4.707s0-3.913.793-4.707c.793-.793,2.183-.793,4.707-.793Z" fill="${icon.crossProjectLightPurple}"/>
				<path d="M13.5,8c2.523,0,3.913,0,4.707.793.793.793.793,2.183.793,4.707s0,3.913-.793,4.707c-.793.793-2.183.793-4.707.793s-3.913,0-4.707-.793c-.793-.793-.793-2.183-.793-4.707s0-3.913.793-4.707c.793-.793,2.183-.793,4.707-.793M13.5,7c-2.699,0-4.328,0-5.414,1.086-1.086,1.086-1.086,2.715-1.086,5.414s0,4.328,1.086,5.414c1.086,1.086,2.715,1.086,5.414,1.086s4.328,0,5.414-1.086c1.086-1.086,1.086-2.715,1.086-5.414s0-4.328-1.086-5.414c-1.086-1.086-2.715-1.086-5.414-1.086h0Z" fill="${icon.crossProjectDarkPurple}"/>
				<path d="M16.76,17l-2.548-7h.787v-1h-3v1h.787l-2.548,7h-1.24v1h3v-1h-.696l.728-2h2.937l.728,2h-.696v1h3v-1h-1.24ZM12.396,14l1.104-3.034,1.104,3.034h-2.209Z" fill="${icon.crossProjectDarkPurple}"/>
			</g>
		</g>
	`;

	return svgWrap(re);
};

makeActionButtonIcon.addShape = function (isComponentInstance = false) {
	let border = icon.mediumGray;
	let fill = icon.lightGray;
	if (isComponentInstance) {
		border = icon.componentDarkGreen;
		fill = icon.componentLightGreen;
	}

	const re = `
		<g data-name="Shape">
			<rect x="0.5" y="0.5" width="11" height="11" fill="${fill}" style="stroke: ${border}; stroke-width: 1px"/>
		</g>
		${overlay.add}
	`;

	return svgWrap(re);
};

makeActionButtonIcon.undo = () => {
	const re = `
		<g data-name="Undo">
			<path d="M11.57,17.559c3.981-4.076,5.808-8.73,4.98-11.283-.378-1.168-1.278-1.812-2.534-1.812-1.636,0-3.766,1.064-6.333,3.165l-.351.287,1.792,2.685-8.467.847L3.211,1.234l1.66,2.49.421-.302C7.95,1.511,10.639.5,13.066.5c3.236,0,5.725,1.856,6.34,4.729.703,3.278-1.076,8.189-7.836,12.331Z" fill="${icon.actionLightBlue}"/>
			<path d="M13.065,0v1c2.992,0,5.289,1.702,5.853,4.334.541,2.526-.498,6.084-4.398,9.473,2.312-3.343,3.173-6.63,2.506-8.686-.444-1.37-1.541-2.156-3.009-2.156h0c-1.754,0-3.991,1.103-6.649,3.278l-.702.575.504.755,1.078,1.615-6.932.693L3.422,2.452l.746,1.119.575.862.841-.605c2.573-1.85,5.16-2.828,7.481-2.828V0M13.066,0c-2.342,0-5.115.893-8.066,3.016L3,.016,0,12.016l10.003-1-2.003-3c2.638-2.158,4.644-3.051,6.016-3.052,4.35,0,2.336,8.97-6.059,15.052C24.568,12.55,21.842.001,13.066,0h0Z" fill="${icon.actionDarkBlue}"/>
		</g>
	`;

	return svgWrap(re);
};

makeActionButtonIcon.linkToGlyph = () => {
	const re = `
		<g data-name="Link Component">
			<g>
				<path d="M11.521,5.653l-5.869,5.869c-.324.324-.849.324-1.174,0s-.324-.85,0-1.174l5.869-5.869c.324-.324.849-.324,1.174,0s.324.85,0,1.174Z" fill="${icon.componentDarkGreen}"/><path d="M11.521,5.653l-5.869,5.869c-.324.324-.849.324-1.174,0s-.324-.85,0-1.174l5.869-5.869c.324-.324.849-.324,1.174,0s.324.85,0,1.174Z" fill="${icon.componentDarkGreen}"/>
				<path d="M4.783,13.565c-.712.712-1.781,1.165-2.647.299s-.413-1.935.299-2.647l3.804-3.804c-1.152-.289-2.439.091-3.5,1.153l-1.478,1.478c-1.561,1.561-1.686,3.616-.304,4.999,1.382,1.382,3.438,1.257,4.999-.304l1.478-1.478c1.062-1.062,1.442-2.349,1.153-3.5l-3.804,3.804Z" fill="${icon.componentDarkGreen}"/><path d="M11.521,5.653l-5.869,5.869c-.324.324-.849.324-1.174,0s-.324-.85,0-1.174l5.869-5.869c.324-.324.849-.324,1.174,0s.324.85,0,1.174Z" fill="${icon.componentDarkGreen}"/>
				<path d="M13.565,4.783c.712-.712,1.165-1.781.299-2.647s-1.935-.413-2.647.299l-3.804,3.804c-.289-1.152.091-2.439,1.153-3.5l1.478-1.478c1.561-1.561,3.616-1.686,4.999-.304s1.257,3.438-.304,4.999l-1.478,1.478c-1.062,1.062-2.349,1.442-3.5,1.153l3.804-3.804Z" fill="${icon.componentDarkGreen}"/><path d="M11.521,5.653l-5.869,5.869c-.324.324-.849.324-1.174,0s-.324-.85,0-1.174l5.869-5.869c.324-.324.849-.324,1.174,0s.324.85,0,1.174Z" fill="${icon.componentDarkGreen}"/>
			</g>
		</g>
		${overlay.add}
	`;

	return svgWrap(re);
};

// (shared icons, Glyph and Path)
makeActionButtonIcon.round = () => {
	let re = `
		<g data-name="Round">
			<path d="M2,12v-5h-1v-1h2v6h1v1H1v-1h1Z" fill="${icon.darkGray}"/>
			<path d="M5,13v-1h1v1h-1Z" fill="${icon.darkGray}"/>
			<g>
				<path d="M11.643,6.748c.447-.657,1.9.093,1.066,1.066-2.132,2.488-5.014,6.283-6.397,5.331,0-.711,3.172-3.224,5.331-6.397Z" fill="${icon.dangerRed}"/>
				<path d="M7.379,6.671c-.862-.517-1.914.526-1.066,1.066,4.366,2.779,4.366,5.763,6.752,5.763-.695-1.425-2.387-4.85-5.686-6.829Z" fill="${icon.dangerRed}"/>
			</g>
			<g>
				<path d="M18.579,6.748c.447-.657,1.9.093,1.066,1.066-2.132,2.488-5.014,6.283-6.397,5.331,0-.711,3.172-3.224,5.331-6.397Z" fill="${icon.dangerRed}"/>
				<path d="M14.314,6.671c-.862-.517-1.914.526-1.066,1.066,4.366,2.779,4.366,5.763,6.752,5.763-.695-1.425-2.387-4.85-5.686-6.829Z" fill="${icon.dangerRed}"/>
			</g>
		</g>
	`;

	return svgWrap(re);
};

makeActionButtonIcon.flipVertical = () => {
	const re = `
		<g data-name="Flip Vertical">
			<g>
				<polygon points="4.207 8.516 .5 4.809 .5 .516 9.861 .516 19.5 6.3 19.5 8.516 4.207 8.516" fill="${icon.darkGray}"/>
				<path d="M9.723,1l9.277,5.566v1.434H4.414l-3.414-3.414V1h8.723M10,H0v5l4,4h16v-3L10,h0Z" fill="${icon.lightGray}"/>
			</g>
			<g>
				<polygon points=".5 19.516 .5 15.223 4.207 11.516 19.5 11.516 19.5 13.733 9.861 19.516 .5 19.516" fill="${icon.actionLightBlue}"/>
				<path d="M19,12v1.434l-9.277,5.566H1v-3.586l3.414-3.414h14.586M20,11H4L0,15v5h10l10-6v-3h0Z" fill="${icon.actionDarkBlue}"/>
			</g>
		</g>
	`;

	return svgWrap(re);
};

makeActionButtonIcon.flipHorizontal = () => {
	const re = `
		<g data-name="Flip Horizontal">
			<g>
				<polygon points=".5 19.5 .5 10.139 6.283 .5 8.5 .5 8.5 15.793 4.793 19.5 .5 19.5" fill="${icon.lightGray}"/>
				<path d="M8,1v14.586l-3.414,3.414H1v-8.723L6.566,1h1.434M9,0h-3L0,10v10h5l4-4V0h0Z" fill="${icon.mediumGray}"/>
			</g>
			<g>
				<polygon points="15.207 19.5 11.5 15.793 11.5 .5 13.717 .5 19.5 10.139 19.5 19.5 15.207 19.5" fill="${icon.actionLightBlue}"/>
				<path d="M13.434,1l5.566,9.277v8.723h-3.586l-3.414-3.414V1h1.434M14,0h-3v16l4,4h5v-10L14,0h0Z" fill="${icon.actionDarkBlue}"/>
			</g>
		</g>
	`;

	return svgWrap(re);
};

makeActionButtonIcon.transforms = () => {
	const re = `
			<g>
				<rect x="3.429" y="3.429" width="13.142" height="13.142" transform="translate(-4.142 10) rotate(-45)" fill="${icon.actionLightBlue}"/>
				<path d="M10,1.414l8.586,8.586-8.586,8.586L1.414,10,10,1.414M10,0L0,10l10,10,10-10L10,0h0Z" fill="${icon.actionDarkBlue}"/>
			</g>
			<g>
				<polygon points="1.032 15.5 9.716 4.5 18.968 4.5 10.284 15.5 1.032 15.5" fill="${icon.actionLightBlue}"/>
				<path d="M17.936,5l-7.895,10H2.064l7.895-10h7.978M20,4h-10.526L0,16h10.526l9.474-12h0Z" fill="${icon.actionDarkBlue}"/>
			</g>
			<g>
				<rect x="6.625" y="6.625" width="6.75" height="6.75" fill="${icon.lightGray}"/>
				<path d="M12.75,7.25v5.5h-5.5v-5.5h5.5M14,6H6v8h8V6h0Z" fill="${icon.mediumGray}"/>
			</g>
	`;
	return svgWrap(re);
};

// Glyph actions
makeActionButtonIcon.exportGlyphSVG = () => {
	let re = `
		<g data-name="SVG Export">
			<g>
				<path d="M2.84,15.822c.318,0,.574-.051.769-.151s.293-.251.293-.452c0-.136-.038-.251-.115-.344-.077-.092-.223-.181-.44-.265-.217-.085-.539-.185-.965-.301-.39-.105-.735-.237-1.034-.398-.299-.161-.532-.368-.699-.621-.167-.253-.25-.569-.25-.946,0-.382.106-.722.319-1.019.213-.298.527-.532.941-.702.414-.171.92-.256,1.52-.256.571,0,1.068.073,1.492.22.424.147.791.333,1.1.558l-.76,1.121c-.265-.164-.551-.296-.856-.395-.306-.098-.613-.148-.923-.148s-.54.042-.69.124-.226.206-.226.371c0,.109.039.202.118.281.078.078.226.159.443.241.217.082.535.184.953.304.414.117.775.251,1.082.404.307.153.546.357.714.612.169.255.254.592.254,1.01,0,.466-.139.857-.416,1.173-.277.315-.645.551-1.103.708-.458.157-.961.236-1.507.236-.619,0-1.166-.089-1.64-.265-.475-.177-.878-.41-1.212-.7l.959-1.073c.249.193.531.354.847.482.316.129.661.193,1.034.193Z" fill="${icon.mediumGray}"/>
				<path d="M13.058,10.575l-2.134,6.404h-2.243l-2.159-6.404h2.056l1.248,4.945,1.302-4.945h1.93Z" fill="${icon.mediumGray}"/>
				<path d="M19.554,9.551l.446,1.399c-.225.089-.488.153-.79.193-.302.04-.653.06-1.055.06.402.173.709.387.92.642.211.255.317.59.317,1.004s-.11.783-.332,1.106c-.221.324-.534.578-.94.763-.406.185-.886.277-1.441.277-.136,0-.265-.006-.386-.018-.121-.012-.239-.03-.356-.054-.068.036-.121.089-.157.157-.036.069-.054.139-.054.211,0,.1.041.191.124.272.082.08.276.121.582.121h1.049c.498,0,.929.08,1.293.241.364.161.646.38.847.657.201.277.302.594.302.953,0,.655-.288,1.171-.863,1.55-.575.378-1.429.567-2.563.567-.82,0-1.454-.084-1.902-.25-.448-.167-.76-.405-.935-.711-.175-.308-.263-.673-.263-1.095h1.689c0,.185.037.337.112.455.074.118.217.206.428.263.211.056.518.084.919.084.406,0,.716-.032.929-.096s.359-.152.437-.262c.078-.111.118-.235.118-.371,0-.189-.074-.342-.223-.458-.149-.117-.384-.175-.706-.175h-1.019c-.691,0-1.194-.127-1.507-.382-.313-.256-.47-.554-.47-.896,0-.237.063-.462.19-.675.127-.213.304-.392.534-.536-.41-.218-.704-.474-.881-.769-.177-.296-.265-.651-.265-1.064,0-.483.123-.898.368-1.246s.584-.616,1-.805c.432-.188.926-.283,1.48-.283.478.008.894-.025,1.248-.099.354-.075.671-.177.953-.308.281-.131.551-.271.808-.419ZM16.593,11.612c-.302,0-.541.096-.718.287s-.265.453-.265.787c0,.353.09.625.271.814.181.189.418.283.712.283.317,0,.559-.094.726-.283s.25-.468.25-.838c0-.357-.082-.622-.247-.793-.165-.17-.408-.256-.73-.256Z" fill="${icon.mediumGray}"/>
			</g>
			<rect x="4" y="0" width="12" height="2" fill="${icon.actionDarkBlue}"/>
			<polygon points="14 6 10 2 6 6 9 6 9 9 11 9 11 6 14 6" fill="${icon.actionDarkBlue}"/>
		</g>
	`;

	return svgWrap(re);
};

makeActionButtonIcon.importGlyphSVG = () => {
	let re = `
		<g data-name="SVG Import">
			<polygon points="20 2 18 0 14 4 12 2 12 8 18 8 16 6 20 2" fill="${icon.actionDarkBlue}"/>
			<g>
				<path d="M2.84,15.805c.318,0,.574-.051.769-.151s.293-.251.293-.452c0-.136-.038-.251-.115-.344-.077-.092-.223-.181-.44-.265-.217-.085-.539-.185-.965-.301-.39-.105-.735-.237-1.034-.398-.299-.161-.532-.368-.699-.621-.167-.253-.25-.569-.25-.946,0-.382.106-.722.319-1.019.213-.298.527-.532.941-.702.414-.171.92-.256,1.52-.256.571,0,1.068.073,1.492.22.424.147.791.333,1.1.558l-.76,1.121c-.265-.164-.551-.296-.856-.395-.306-.098-.613-.148-.923-.148s-.54.042-.69.124-.226.206-.226.371c0,.109.039.202.118.281.078.078.226.159.443.241.217.082.535.184.953.304.414.117.775.251,1.082.404.307.153.546.357.714.612.169.255.254.592.254,1.01,0,.466-.139.857-.416,1.173-.277.315-.645.551-1.103.708-.458.157-.961.236-1.507.236-.619,0-1.166-.089-1.64-.265C.737,16.726.334,16.492,0,16.203l.959-1.073c.249.193.531.354.847.482.316.129.661.193,1.034.193Z" fill="${icon.mediumGray}"/>
				<path d="M13.058,10.559l-2.134,6.404h-2.243l-2.159-6.404h2.056l1.248,4.945,1.302-4.945h1.93Z" fill="${icon.mediumGray}"/>
				<path d="M19.554,9.534l.446,1.399c-.225.089-.488.153-.79.193-.302.04-.653.06-1.055.06.402.173.709.387.92.642.211.255.317.59.317,1.004s-.11.783-.332,1.106c-.221.324-.534.578-.94.763-.406.185-.886.277-1.441.277-.136,0-.265-.006-.386-.018-.121-.012-.239-.03-.356-.054-.068.036-.121.089-.157.157-.036.069-.054.139-.054.211,0,.1.041.191.124.272.082.08.276.121.582.121h1.049c.498,0,.929.08,1.293.241.364.161.646.38.847.657.201.277.302.594.302.953,0,.655-.288,1.171-.863,1.55-.575.378-1.429.567-2.563.567-.82,0-1.454-.084-1.902-.25-.448-.167-.76-.405-.935-.711-.175-.308-.263-.673-.263-1.095h1.689c0,.185.037.337.112.455.074.118.217.206.428.263.211.056.518.084.919.084.406,0,.716-.032.929-.096s.359-.152.437-.262c.078-.111.118-.235.118-.371,0-.189-.074-.342-.223-.458-.149-.117-.384-.175-.706-.175h-1.019c-.691,0-1.194-.127-1.507-.382-.313-.256-.47-.554-.47-.896,0-.237.063-.462.19-.675.127-.213.304-.392.534-.536-.41-.218-.704-.474-.881-.769-.177-.296-.265-.651-.265-1.064,0-.483.123-.898.368-1.246s.584-.616,1.016-.805c.432-.188.926-.283,1.48-.283.478.008.894-.025,1.248-.099.354-.075.671-.177.953-.308.281-.131.551-.271.808-.419ZM16.593,11.596c-.302,0-.541.096-.718.287s-.265.453-.265.787c0,.353.09.625.271.814.181.189.418.283.712.283.317,0,.559-.094.726-.283s.25-.468.25-.838c0-.357-.082-.622-.247-.793-.165-.17-.408-.256-.73-.256Z" fill="${icon.mediumGray}"/>
			</g>
		</g>
	`;

	return svgWrap(re);
};

makeActionButtonIcon.deleteGlyph = () => {
	let re = `
		<g data-name="Glyph">
			<path d="M15.743,15L11,2h2V0S4,0,4,0v2s2,0,2,0L1,15H0v2h5.95l.05-2h-2l1.5-4h6l1.5,4h-2l.05,2h5.95v-2h-1.257ZM6,9l2.5-6.5,2.5,6.5h-5Z" fill="${icon.mediumGray}"/>
		</g>
		${overlay.delete}
	`;

	return svgWrap(re);
};

// Path actions
makeActionButtonIcon.switchPathComponent = function (isComponentInstance = false) {
	let beforeFill = icon.lightGray;
	let beforeBorder = icon.mediumGray;
	let afterFill = icon.componentLightGreen;
	let afterBorder = icon.componentDarkGreen;
	if (isComponentInstance) {
		beforeFill = icon.componentLightGreen;
		beforeBorder = icon.componentDarkGreen;
		afterFill = icon.lightGray;
		afterBorder = icon.mediumGray;
	}

	const re = `
		<g data-name="Switch Shape Component">
			<g>
				<polygon points="3.207 14.5 .5 11.793 .5 .5 2.743 .5 7.5 7.16 7.5 14.5 3.207 14.5" fill="${beforeFill}"/>
				<path d="M2.485,1l4.515,6.32v6.68h-3.586l-2.414-2.414V1h1.485M3,0H0v12l3,3h5V7L3,0h0Z" fill="${beforeBorder}"/>
			</g>
			<g>
				<polygon points="14.207 19.5 10.5 15.793 10.5 .5 13.732 .5 19.5 9.151 19.5 19.5 14.207 19.5" fill="${afterFill}"/>
				<path d="M13.465,1l5.535,8.303v9.697h-4.586l-3.414-3.414V1h2.465M14,0h-4v16l4,4h6v-11L14,0h0Z" fill="${afterBorder}"/>
			</g>
		</g>
	`;

	return svgWrap(re);
};

makeActionButtonIcon.deleteShape = function (isComponentInstance = false) {
	let border = icon.mediumGray;
	let fill = icon.lightGray;
	if (isComponentInstance) {
		border = icon.componentDarkGreen;
		fill = icon.componentLightGreen;
	}

	const re = `
		<g data-name="Shape">
			<rect x="0.5" y="0.5" width="11" height="11" fill="${fill}" style="stroke: ${border}; stroke-width: 1px"/>
		</g>
		${overlay.delete}
	`;

	return svgWrap(re);
};

// Boolean combine actions
makeActionButtonIcon.combine_unite = () => {
	const re = `
		<g data-name="Unite">
			<path d="M15.164,6.4c-.8-3.104-3.61-5.4-6.964-5.4-3.976,0-7.2,3.223-7.2,7.2,0,3.354,2.296,6.164,5.4,6.964v3.836h12.6V6.4h-3.836Z" fill="${icon.combineFill}"/>
			<path d="M15.738,6c-.889-3.449-4.011-6-7.738-6C3.582,0,0,3.582,0,8,0,11.726,2.551,14.848,6,15.738v4.262h14V6h-4.262ZM18,18h-10v-4c-.702,0-1.373-.127-2-.35-2.327-.826-4-3.044-4-5.65,0-3.308,2.692-6,6-6,2.606,0,4.824,1.673,5.65,4,.223.627.35,1.298.35,2h4v10Z" fill="${icon.combineOutline}"/>/>
		</g>
	`;

	return svgWrap(re);
};

makeActionButtonIcon.combine_divide = () => {
	const re = `
		<g data-name="Divide">
			<path d="M15.164,6.4c-.8-3.104-3.61-5.4-6.964-5.4-3.976,0-7.2,3.223-7.2,7.2,0,3.354,2.296,6.164,5.4,6.964v3.836h12.6V6.4h-3.836Z" fill="${icon.combineFill}"/>
			<path d="M15.738,6c-.889-3.449-4.011-6-7.738-6C3.582,0,0,3.582,0,8,0,11.726,2.551,14.848,6,15.738v4.262h14V6h-4.262ZM2,8c0-3.308,2.692-6,6-6,2.606,0,4.824,1.673,5.65,4h-7.65v7.65c-2.327-.826-4-3.044-4-5.65ZM14,8c0,3.308-2.692,6-6,6v-6h6ZM18,18h-10v-2c4.418,0,8-3.582,8-8h2v10Z" fill="${icon.combineOutline}"/>
		</g>
	`;

	return svgWrap(re);
};

makeActionButtonIcon.combine_subtract = () => {
	const re = `
		<g data-name="Subtract">
			<path d="M15,6.337c-.791-3.068-3.568-5.337-6.883-5.337-3.93,0-7.117,3.186-7.117,7.117,0,3.315,2.27,6.092,5.337,6.883V6.337h8.663Z" fill="${icon.combineFill}"/>
			<path d="M15.738,6c-.889-3.449-4.011-6-7.738-6C3.582,0,0,3.582,0,8,0,11.726,2.551,14.848,6,15.738v4.262h14V6h-4.262ZM2,8c0-3.308,2.692-6,6-6,2.606,0,4.824,1.673,5.65,4h-7.65v7.65c-2.327-.826-4-3.044-4-5.65ZM18,18h-10v-10h10v10Z" fill="${icon.combineOutline}"/>
		</g>
	`;

	return svgWrap(re);
};

makeActionButtonIcon.combine_exclude = () => {
	const re = `
		<g data-name="Exclude">
			<path d="M15.347,7c0,5-3.347,8.347-8.347,8.347v3.653h12V7h-3.653Z" fill="${icon.combineFill}"/>
			<path d="M15,6.337c-.791-3.068-3.568-5.337-6.883-5.337-3.93,0-7.117,3.186-7.117,7.117,0,3.315,2.27,6.092,5.337,6.883V6.337h8.663Z" fill="${icon.combineFill}"/>
			<path d="M15.738,6c-.889-3.449-4.011-6-7.738-6C3.582,0,0,3.582,0,8,0,11.726,2.551,14.848,6,15.738v4.262h14V6h-4.262ZM2,8c0-3.308,2.692-6,6-6,2.606,0,4.824,1.673,5.65,4h-7.65v7.65c-2.327-.826-4-3.044-4-5.65ZM14,8c0,3.308-2.692,6-6,6v-6h6ZM18,18h-10v-2c4.418,0,8-3.582,8-8h2v10Z" fill="${icon.combineOutline}"/>
		</g>
	`;

	return svgWrap(re);
};

makeActionButtonIcon.combine_intersect = () => {
	const re = `
		<g data-name="Intersect">
			<path d="M15,8.6c0-.554-.078-1.088-.21-1.6h-7.79v7.79c.512.132,1.046.21,1.6.21,3.535,0,6.4-2.865,6.4-6.4Z" fill="${icon.combineFill}"/>
			<path d="M15.738,6c-.889-3.449-4.011-6-7.738-6C3.582,0,0,3.582,0,8,0,11.726,2.551,14.848,6,15.738v4.262h14V6h-4.262ZM2,8c0-3.308,2.692-6,6-6,2.606,0,4.824,1.673,5.65,4h-7.65v7.65c-2.327-.826-4-3.044-4-5.65ZM14,8c0,3.308-2.692,6-6,6v-6h6ZM18,18h-10v-2c4.418,0,8-3.582,8-8h2v10Z" fill="${icon.combineOutline}"/>
		</g>
	`;

	return svgWrap(re);
};

// Kerning actions
makeActionButtonIcon.edit = () => {
	const re = `
		<g data-name="Edit">
			<path d="M19.095.921c-1.051-1.051-2.739-1.261-3.767-.232L2.654,13.378,0,19.35l.667.667,5.972-2.654,12.689-12.673c1.028-1.028.819-2.716-.233-3.768Z" fill="${icon.lightGray}"/>
			<path d="M19.095.921c-.581-.581-1.356-.905-2.107-.905-.608,0-1.2.212-1.66.672L2.654,13.378,0,19.35l.667.667,5.972-2.654,12.689-12.673c1.028-1.028.819-2.716-.233-3.768ZM1.436,18.58l1.975-4.445,2.469,2.469-4.445,1.975ZM6.646,15.956l-2.586-2.586L14.354,3.077l2.586,2.586L6.646,15.956ZM18.621,3.982l-.974.974-2.586-2.586.974-.974c.314-.314.691-.379.953-.379.494,0,1.017.229,1.4.612.349.349.57.81.606,1.266.024.301-.021.734-.374,1.087Z" fill="${icon.actionDarkBlue}"/>
		</g>
	`;

	return svgWrap(re);
};

makeActionButtonIcon.delete = () => {
	const re = `
		<g data-name="Big delete">
			<path d="M15.96.683c1.355-1.819,5.401.267,3.03,3.05C12.929,10.85,3.838,18.983.808,18.983c0-2.033,9.091-10.167,15.152-18.3Z" fill="${icon.dangerRed}"/>
			<path d="M3.838.683C1.583-1.082-1.478,2.008.808,3.733c12.121,9.15,14.142,15.25,19.192,16.267C18.025,15.924,12.929,7.8,3.838.683Z" fill="${icon.dangerRed}"/>
		</g>
	`;

	return svgWrap(re);
};

makeActionButtonIcon.createNewKernGroup = () => {
	const re = `
		<g data-name="Kern Group">
			<polygon points="16 1 8 1 8 0 7 0 7 3 8 3 8 2 16 2 16 1" fill="${icon.darkGray}"/>
			<polygon points="0 16 8 16 8 17 9 17 9 14 8 14 8 15 0 15 0 16" fill="${icon.darkGray}"/>
			<path d="M7.76,12l-2.548-7h.787v-1h-3v1h.787l-2.548,7H0v1h3v-1h-.696l.728-2h2.937l.728,2h-.696v1h3v-1h-1.24ZM3.396,9l1.104-3.034,1.104,3.034h-2.209Z" fill="${icon.darkGray}"/>
			<polygon points="16 4 13 4 13 5 13.848 5 11.5 11.45 9.152 5 10 5 10 4 7 4 7 5 8.088 5 11 13 12 13 14.912 5 16 5 16 4" fill="${icon.darkGray}"/>
		</g>
		${overlay.add}
	`;

	return svgWrap(re);
};

makeActionButtonIcon.deleteSingleLetterPair = () => {
	const re = `
		<g data-name="Kern Group">
			<polygon points="16 1 8 1 8 0 7 0 7 3 8 3 8 2 16 2 16 1" fill="${icon.darkGray}"/>
			<polygon points="0 16 8 16 8 17 9 17 9 14 8 14 8 15 0 15 0 16" fill="${icon.darkGray}"/>
			<path d="M7.76,12l-2.548-7h.787v-1h-3v1h.787l-2.548,7H0v1h3v-1h-.696l.728-2h2.937l.728,2h-.696v1h3v-1h-1.24ZM3.396,9l1.104-3.034,1.104,3.034h-2.209Z" fill="${icon.darkGray}"/>
			<polygon points="16 4 13 4 13 5 13.848 5 11.5 11.45 9.152 5 10 5 10 4 7 4 7 5 8.088 5 11 13 12 13 14.912 5 16 5 16 4" fill="${icon.darkGray}"/>
		</g>
		${overlay.delete}
	`;

	return svgWrap(re);
};

makeActionButtonIcon.findSingleLetterPair = () => {
	const re = `
		<g data-name="Kern Group">
			<polygon points="16 1 8 1 8 0 7 0 7 3 8 3 8 2 16 2 16 1" fill="${icon.darkGray}"/>
			<polygon points="0 16 8 16 8 17 9 17 9 14 8 14 8 15 0 15 0 16" fill="${icon.darkGray}"/>
			<path d="M7.76,12l-2.548-7h.787v-1h-3v1h.787l-2.548,7H0v1h3v-1h-.696l.728-2h2.937l.728,2h-.696v1h3v-1h-1.24ZM3.396,9l1.104-3.034,1.104,3.034h-2.209Z" fill="${icon.darkGray}"/>
			<polygon points="16 4 13 4 13 5 13.848 5 11.5 11.45 9.152 5 10 5 10 4 7 4 7 5 8.088 5 11 13 12 13 14.912 5 16 5 16 4" fill="${icon.darkGray}"/>
		</g>
		<g data-name="Overlay Find">
			<g>
				<circle cx="14" cy="14" r="3.1" fill="${accentColors.gray.l99}"/>
				<path d="M14,11.8c1.213,0,2.2.987,2.2,2.2s-.987,2.2-2.2,2.2-2.2-.987-2.2-2.2.987-2.2,2.2-2.2M14,10c-2.209,0-4,1.791-4,4s1.791,4,4,4,4-1.791,4-4-1.791-4-4-4h0Z" fill="${icon.actionDarkBlue}"/>
			</g>
			<line x1="19.2" y1="19.2" x2="16" y2="16" style="stroke: ${icon.actionDarkBlue}; stroke-width: 1.8px;"/>
		</g>
	`;

	return svgWrap(re);
};

// Layer actions
makeActionButtonIcon.moveLayerDown = () => {
	const re = `
		<g data-name="Layer Down">
			<path d="M17,17v-3h-2v3h-2.001l3,3s3.048-3.048,3-3h-1.999Z" fill="${icon.actionDarkBlue}"/>
			<polygon points="10 10 0 5 10 0 20 5 10 10" fill="${icon.lightGray}"/>
			<polygon points="10 12.236 2.764 8.618 0 10 10 15 20 10 17.236 8.618 10 12.236" fill="${icon.actionDarkBlue}"/>
		</g>
	`;

	return svgWrap(re);
};

makeActionButtonIcon.moveLayerUp = () => {
	const re = `
		<g data-name="Layer Up">
			<path d="M19,16.999l-3-2.999s-3.047,3.047-3,2.999h1.999v3.001h2v-3h2Z" fill="${icon.actionDarkBlue}"/>
			<polygon points="10 10 0 5 10 0 20 5 10 10" fill="${icon.actionDarkBlue}"/>
			<polygon points="10 12.236 2.764 8.618 0 10 10 15 20 10 17.236 8.618 10 12.236" fill="${icon.lightGray}"/>
		</g>
	`;

	return svgWrap(re);
};

makeActionButtonIcon.moveLayerTop = () => {
	const re = `
		<g id="d" data-name="Layer Top / Bottom">
			<polygon id="e" data-name="bottom" points="10 17.236 2.764 13.618 0 15 10 20 20 15 17.236 13.618 10 17.236" fill="${icon.lightGray}"/>
			<polygon id="f" data-name="middle" points="10 12.236 2.764 8.618 0 10 10 15 20 10 17.236 8.618 10 12.236" fill="${icon.lightGray}"/>
			<polygon id="g" data-name="top" points="10 10 0 5 10 0 20 5 10 10" fill="${icon.actionDarkBlue}"/>
		</g>
	`;

	return svgWrap(re);
};

makeActionButtonIcon.moveLayerBottom = () => {
	const re = `
		<g id="d" data-name="Layer Top / Bottom">
			<polygon id="e" data-name="bottom" points="10 17.236 2.764 13.618 0 15 10 20 20 15 17.236 13.618 10 17.236" fill="${icon.actionDarkBlue}"/>
			<polygon id="f" data-name="middle" points="10 12.236 2.764 8.618 0 10 10 15 20 10 17.236 8.618 10 12.236" fill="${icon.lightGray}"/>
			<polygon id="g" data-name="top" points="10 10 0 5 10 0 20 5 10 10" fill="${icon.lightGray}"/>
		</g>
	`;

	return svgWrap(re);
};

// Shape align actions
makeActionButtonIcon.align_shapes = function (edge) {
	let re = '';
	let fill = icon.mediumGray;

	switch (edge) {
		case 'bottom':
			re = `
		<g data-name="Align Shapes Bottom">
			<rect x="0" y="18" width="20" height="2" fill="${icon.actionDarkBlue}"/>
			<rect x="1" y="11" width="4" height="6" fill="${fill}"/>
			<rect x="8" y="1" width="4" height="16" fill="${fill}"/>
			<rect x="15" y="5" width="4" height="12" fill="${fill}"/>
		</g>`;
			break;

		case 'middle':
			re = `
		<g data-name="Align Shapes Middle">
			<rect x="0" y="9" width="20" height="2" fill="${icon.actionDarkBlue}"/>
			<rect x="1" y="7" width="4" height="6" fill="${fill}"/>
			<rect x="8" y="2" width="4" height="16" fill="${fill}"/>
			<rect x="15" y="4" width="4" height="12" fill="${fill}"/>
		</g>`;
			break;

		case 'top':
			re = `
		<g data-name="Align Shapes Top">
			<rect x="0" y="0" width="20" height="2" fill="${icon.actionDarkBlue}"/>
			<rect x="1" y="3" width="4" height="6" fill="${fill}"/>
			<rect x="8" y="3" width="4" height="16" fill="${fill}"/>
			<rect x="15" y="3" width="4" height="12" fill="${fill}"/>
		</g>`;
			break;

		case 'left':
			re = `
		<g data-name="Align Shapes Left">
			<rect x="0" y="0" width="2" height="20" fill="${icon.actionDarkBlue}"/>
			<rect x="3" y="1" width="6" height="4" fill="${fill}"/>
			<rect x="3" y="8" width="16" height="4" fill="${fill}"/>
			<rect x="3" y="15" width="12" height="4" fill="${fill}"/>
		</g>`;
			break;

		case 'center':
			re = `
		<g data-name="Align Shapes Center">
			<rect x="9" y="0" width="2" height="20" fill="${icon.actionDarkBlue}"/>
			<rect x="7" y="1" width="6" height="4" fill="${fill}"/>
			<rect x="2" y="8" width="16" height="4" fill="${fill}"/>
			<rect x="4" y="15" width="12" height="4" fill="${fill}"/>
		</g>`;
			break;

		case 'right':
			re = `
		<g data-name="Align Shapes Right">
			<rect x="18" y="0" width="2" height="20" fill="${icon.actionDarkBlue}"/>
			<rect x="11" y="1" width="6" height="4" fill="${fill}"/>
			<rect x="1" y="8" width="16" height="4" fill="${fill}"/>
			<rect x="5" y="15" width="12" height="4" fill="${fill}"/>
		</g>`;
			break;
	}

	return svgWrap(re);
};

// Point align actions
makeActionButtonIcon.align_points = function (edge) {
	let re = '';
	let oldPoint = icon.lightGray;

	switch (edge) {
		case 'bottom':
			re = `
		<g data-name="Align Points Bottom">
			<rect x="7" y="4" width="5" height="5" fill="${oldPoint}"/>
			<rect x="0" y="8" width="5" height="5" fill="${oldPoint}"/>
			<rect x="14" y="0" width="5" height="5" fill="${oldPoint}"/>
			<rect x="0" y="15" width="5" height="5" fill="${icon.actionDarkBlue}"/>
			<rect x="1" y="16" width="3" height="3" fill="${icon.lightGray}"/>
			<rect x="7" y="15" width="5" height="5" fill="${icon.actionDarkBlue}"/>
			<rect x="8" y="16" width="3" height="3" fill="${icon.lightGray}"/>
			<rect x="14" y="15" width="5" height="5" fill="${icon.actionDarkBlue}"/>
			<rect x="15" y="16" width="3" height="3" fill="${icon.lightGray}"/>
		</g>`;
			break;

		case 'middle':
			re = `
		<g data-name="Align Points Middle">
			<rect x="0" y="0" width="5" height="5" fill="${oldPoint}"/>
			<rect x="7" y="0" width="5" height="5" fill="${oldPoint}"/>
			<rect x="14" y="14" width="5" height="5" fill="${oldPoint}"/>
			<rect x="0" y="7" width="5" height="5" fill="${icon.actionDarkBlue}"/>
			<rect x="1" y="8" width="3" height="3" fill="${icon.lightGray}"/>
			<rect x="7" y="7" width="5" height="5" fill="${icon.actionDarkBlue}"/>
			<rect x="8" y="8" width="3" height="3" fill="${icon.lightGray}"/>
			<rect x="14" y="7" width="5" height="5" fill="${icon.actionDarkBlue}"/>
			<rect x="15" y="8" width="3" height="3" fill="${icon.lightGray}"/>
		</g>`;
			break;

		case 'top':
			re = `
		<g data-name="Align Points Top">
			<rect x="7" y="11" width="5" height="5" fill="${oldPoint}"/>
			<rect x="0" y="7" width="5" height="5" fill="${oldPoint}"/>
			<rect x="14" y="15" width="5" height="5" fill="${oldPoint}"/>
			<rect x="0" y="0" width="5" height="5" fill="${icon.actionDarkBlue}"/>
			<rect x="1" y="1" width="3" height="3" fill="${icon.lightGray}"/>
			<rect x="7" y="0" width="5" height="5" fill="${icon.actionDarkBlue}"/>
			<rect x="8" y="1" width="3" height="3" fill="${icon.lightGray}"/>
			<rect x="14" y="0" width="5" height="5" fill="${icon.actionDarkBlue}"/>
			<rect x="15" y="1" width="3" height="3" fill="${icon.lightGray}"/>
		</g>`;
			break;

		case 'left':
			re = `
		<g data-name="Align Points left">
			<rect x="11" y="7" width="5" height="5" fill="${oldPoint}"/>
			<rect x="7" y="14" width="5" height="5" fill="${oldPoint}"/>
			<rect x="0" y="14" width="5" height="5" fill="${icon.actionDarkBlue}"/>
			<rect x="1" y="15" width="3" height="3" fill="${icon.lightGray}"/>
			<rect x="0" y="7" width="5" height="5" fill="${icon.actionDarkBlue}"/>
			<rect x="1" y="8" width="3" height="3" fill="${icon.lightGray}"/>
			<rect x="0" y="0" width="5" height="5" fill="${icon.actionDarkBlue}"/>
			<rect x="1" y="1" width="3" height="3" fill="${icon.lightGray}"/>
			<rect x="15" y="0" width="5" height="5" fill="${oldPoint}"/>
		</g>`;
			break;

		case 'center':
			re = `
		<g data-name="Align Points Center">
			<rect x="14" y="14" width="5" height="5" fill="${oldPoint}"/>
			<rect x="7" y="14" width="5" height="5" fill="${icon.actionDarkBlue}"/>
			<rect x="8" y="15" width="3" height="3" fill="${icon.lightGray}"/>
			<rect x="7" y="7" width="5" height="5" fill="${icon.actionDarkBlue}"/>
			<rect x="8" y="8" width="3" height="3" fill="${icon.lightGray}"/>
			<rect x="7" y="0" width="5" height="5" fill="${icon.actionDarkBlue}"/>
			<rect x="8" y="1" width="3" height="3" fill="${icon.lightGray}"/>
			<rect x="0" y="0" width="5" height="5" fill="${oldPoint}"/>
			<rect x="0" y="7" width="5" height="5" fill="${oldPoint}"/>
		</g>`;
			break;

		case 'right':
			re = `
		<g data-name="Align Points Right">
			<rect x="4" y="7" width="5" height="5" fill="${oldPoint}"/>
			<rect x="8" y="14" width="5" height="5" fill="${oldPoint}"/>
			<rect x="15" y="14" width="5" height="5" fill="${icon.actionDarkBlue}"/>
			<rect x="16" y="15" width="3" height="3" fill="${icon.lightGray}"/>
			<rect x="15" y="7" width="5" height="5" fill="${icon.actionDarkBlue}"/>
			<rect x="16" y="8" width="3" height="3" fill="${icon.lightGray}"/>
			<rect x="15" y="0" width="5" height="5" fill="${icon.actionDarkBlue}"/>
			<rect x="16" y="1" width="3" height="3" fill="${icon.lightGray}"/>
			<rect x="0" y="0" width="5" height="5" fill="${oldPoint}"/>
		</g>`;
			break;
	}

	return svgWrap(re);
};

// Point actions
makeActionButtonIcon.resetPathPoint = () => {
	const re = `
		<g data-name="Old Handles">
			<circle cx="13" cy="18" r="2" fill="${icon.lightGray}"/>
			<circle cx="18" cy="9" r="2" fill="${icon.lightGray}"/>
			<polyline points="13 18 9 9 18 9" style="fill: none; stroke: ${icon.lightGray};"/>
		</g>
		<g data-name="PathPoint">
			<line x1="3" y1="15" x2="15" y2="3" style="fill: none; stroke: ${icon.actionDarkBlue};"/>
			<rect x="6.5" y="6.516" width="5" height="5" fill="${icon.lightGray}"/>
			<path d="M11,7v4h-4v-4h4M12,6h-6v6h6v-6h0Z" fill="${icon.actionDarkBlue}"/>
			<circle cx="16" cy="2" r="2" fill="${icon.actionDarkBlue}"/>
			<circle cx="2" cy="16" r="2" fill="${icon.actionDarkBlue}"/>
		</g>
	`;

	return svgWrap(re);
};

makeActionButtonIcon.deletePathPoint = () => {
	const re = `
		<g data-name="PathPoint">
			<line x1="3" y1="15" x2="15" y2="3" style="fill: none; stroke: ${icon.mediumGray};"/>
			<rect x="6.5" y="6.516" width="5" height="5" fill="${icon.lightGray}"/>
			<path d="M11,7v4h-4v-4h4M12,6h-6v6h6v-6h0Z" fill="${icon.mediumGray}"/>
			<circle cx="16" cy="2" r="2" fill="${icon.mediumGray}"/>
			<circle cx="2" cy="16" r="2" fill="${icon.mediumGray}"/>
		</g>
		${overlay.delete}
	`;

	return svgWrap(re);
};

makeActionButtonIcon.insertPathPoint = () => {
	const re = `
		<g data-name="PathPoint">
			<line x1="3" y1="15" x2="15" y2="3" style="fill: none; stroke: ${icon.mediumGray};"/>
			<rect x="6.5" y="6.516" width="5" height="5" fill="${icon.lightGray}"/>
			<path d="M11,7v4h-4v-4h4M12,6h-6v6h6v-6h0Z" fill="${icon.mediumGray}"/>
			<circle cx="16" cy="2" r="2" fill="${icon.mediumGray}"/>
			<circle cx="2" cy="16" r="2" fill="${icon.mediumGray}"/>
		</g>
		${overlay.add}
	`;

	return svgWrap(re);
};

makeActionButtonIcon.mergePathPoints = () => {
	const re = `
		<g data-name="Merge Points">
			<g>
				<line x1="6" y1="18" x2="6.447" y2="17.106" style="fill: none; stroke: ${icon.actionDarkBlue}; stroke-width: 2px;"/>
				<line x1="6.891" y1="16.217" x2="13.331" y2="3.339" style="fill: none; stroke: ${icon.actionDarkBlue}; stroke-dasharray: 2 1; stroke-width: 2px;"/>
				<line x1="13.553" y1="2.894" x2="14" y2="2" style="fill: none; stroke: ${icon.actionDarkBlue}; stroke-width: 2px;"/>
			</g>
			<path d="M5,17h-2.092c-.207-.581-.756-1-1.408-1C.672,16,0,16.672,0,17.5s.672,1.5,1.5,1.5c.652,0,1.202-.419,1.408-1h2.092v-1Z" fill="${icon.mediumGray}"/>
			<path d="M15,3h2.092c.207.581.756,1,1.408,1,.828,0,1.5-.672,1.5-1.5s-.672-1.5-1.5-1.5c-.652,0-1.202.419-1.408,1h-2.092v1Z" fill="${icon.mediumGray}"/>
			<g>
				<rect x="4.5" y="15.5" width="4" height="4" fill="${icon.lightGray}"/>
				<path d="M8,16v3h-3v-3h3M9,15h-5v5h5v-5h0Z" fill="${icon.mediumGray}"/>
			</g>
			<g>
				<rect x="11.5" y=".5" width="4" height="4" fill="${icon.lightGray}"/>
				<path d="M15,1v3h-3V1h3M16,0h-5v5h5V0h0Z" fill="${icon.mediumGray}"/>
			</g>
		</g>
	`;

	return svgWrap(re);
};

makeActionButtonIcon.selectNextPathPoint = () => {
	const re = `
		<g data-name="Next Path Point">
			<g>
				<rect x="14.5" y="7.516" width="5" height="5" fill="${icon.lightGray}"/>
				<path d="M19,8v4h-4v-4h4M20,7h-6v6h6v-6h0Z" fill="${icon.mediumGray}"/>
			</g>
			<polygon points="13 10 7 4 7 8 3 7.945 3 12 7 12 7 16 13 10" fill="${icon.actionDarkBlue}"/>
			<rect x="0" y="8" width="2" height="4" fill="${icon.actionDarkBlue}"/>
		</g>
	`;

	return svgWrap(re);
};

makeActionButtonIcon.selectPreviousPathPoint = () => {
	const re = `
		<g data-name="Previous Path Point">
			<g>
				<rect x=".5" y="7.516" width="5" height="5" fill="${icon.lightGray}"/>
				<path d="M5,8v4H1v-4h4M6,7H0v6h6v-6h0Z" fill="${icon.mediumGray}"/>
			</g>
			<polygon points="7 10 13 16 13 12 17 12.088 17 8 13 8 13 4 7 10" fill="${icon.actionDarkBlue}"/>
			<rect x="18" y="8" width="2" height="4" fill="${icon.actionDarkBlue}"/>
		</g>
	`;

	return svgWrap(re);
};

// Dev actions for testing and default
makeActionButtonIcon.default = () => {
	let re = `<rect width="20" height="20" fill="${icon.dangerRed}"/>`;
	return svgWrap(re);
};

makeActionButtonIcon.test = () => {
	let re = `
		<path d="M28.05,23.82c-1.65-1.79-9.55-13.02-9.55-17.82V3h1c.28,0,.5-.72,.5-1s-.22-1-.5-1H10.5c-.28,0-.5,.72-.5,1s.22,1,.5,1h1v3c0,4.8-7.9,16.03-9.55,17.82-.58,.55-.95,1.32-.95,2.18,0,1.66,1.34,3,3,3H26c1.66,0,3-1.34,3-3,0-.86-.37-1.63-.95-2.18ZM13.5,6V3h3v3c0,2.76,2.01,6.95,4.25,10.72-3.27,1.69-5.6-.72-7.75-.72-.34,0-1.86-.31-4,1.15,2.34-3.88,4.5-8.28,4.5-11.15Zm3.5,20c-1.66,0-3-1.34-3-3s1.34-3,3-3,3,1.34,3,3-1.34,3-3,3Zm-6-7.5c0-.83,.67-1.5,1.5-1.5s1.5,.67,1.5,1.5-.67,1.5-1.5,1.5-1.5-.67-1.5-1.5Z" fill="${icon.dangerRed}"/>
		<circle cx="15" cy="14" r="1" fill="${icon.dangerRed}"/>
	`;

	return svgWrap(re);
};
