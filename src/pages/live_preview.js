import { makeElement } from '../common/dom.js';
import { getCurrentProjectEditor } from '../app/main.js';
import { makeNavButton } from '../project_editor/navigator.js';
import { toggleNavDropdown } from '../project_editor/navigator.js';

/**
 * Page > Live preview
 * Preview text blocks made up of the font
 * currently being edited.
 */

let livePreviewData = {
	glyphSequence: {},
	ctx: false,
	canvas: false,
	sampleText: '',
	fontScale: 100,
	fontsize: 48,
	lineGap: false,
	padSize: 0,
	showGlyphExtras: false,
	showLineExtras: false,
	showPageExtras: false,
	flattenGlyphs: false,
	cache: {},
};

export function makePage_LivePreview() {
	log(`makePage_LivePreview`, 'start');
	const editor = getCurrentProjectEditor();
	// log('current ProjectEditor');
	// log(editor);
	// log(editor.nav);
	// log(editor.selectedGlyph);

	let previewString = 'ABC';
	const content = makeElement({
		tag: 'div',
		id: 'app__page',
		innerHTML: `
		<div class="content__page">
			<div class="content-page__left-area">
				<div class="content-page__nav-area">
					${makeNavButton({ level: 'l1', superTitle: 'PAGE', title: 'Live preview' })}
				</div>
				<div class="content-page__panel"></div>
			</div>
			<div class="live-preview-page__canvas-wrapper">
				<display-canvas id="live-preview-page__canvas" glyphs="${previewString}"></display-canvas>
			</div>
		</div>
	`,
	});

	let lp = livePreviewData;
	// lp.canvas = content.querySelector('#live-preview-page__canvas');
	// lp.canvas.width = 800;
	// lp.canvas.height = 600;
	// lp.ctx = lp.canvas.getContext('2d');

	// lp.glyphSequence = new GlyphSequence({
	// 	glyphString: lp.sampleText,
	// 	lineGap: lp.lineGap,
	// 	maxes: {
	// 		xMin: 10,
	// 		xMax: 790,
	// 		yMin: 10 + _GP.projectSettings.ascent * lp.fontScale,
	// 		yMax: false,
	// 	},
	// 	scale: lp.fontScale,
	// 	drawPageExtras: draw_LivePreviewPageExtras,
	// 	drawLineExtras: draw_LivePreviewLineExtras,
	// 	drawGlyphExtras: draw_LivePreviewGlyphExtras,
	// 	drawGlyph: draw_LivePreviewGlyph,
	// });

	lp.cache = {};

	editor.previewCanvas = content.querySelector('#live-preview-page__canvas');
	// Page Selector
	let l1 = content.querySelector('#nav-button-l1');
	l1.addEventListener('click', function () {
		toggleNavDropdown(l1);
	});

	let panelArea = content.querySelector('.content-page__panel');
	panelArea.appendChild(
		makeElement({
			tag: 'div',
			className: 'panel__card full-width',
			innerHTML: '<button id="livePreviewRefresh">Refresh</button>',
		})
	);

	panelArea.querySelector('#livePreviewRefresh').addEventListener('click', () => {
		lp.previewCanvas.redraw();
	});

	log(`makePage_LivePreview`, 'end');
	return content;
}

// --------------------------------------------------------------
// OLD STUFF
// --------------------------------------------------------------

// --------------------------------------------------------------
// OLD STUFF
// --------------------------------------------------------------

/*
		makePanel_TestDriveAttributes
		This function is called by the overall Redraw function, and it loads content to
		the left panel - usually options for the Edit Canvas.
	*/
function makePanel_TestDriveAttributes() {
	if (_UI.current_panel !== 'npAttributes') return;
	let content = '</div><div class="panel_section">';
	content += '<h2>options</h2><div>' + drawTDOptions() + '</div>';
	content += '</div><div class="panel_section">';
	content += '<h2>sample text</h2><div>' + drawSampleTextButtons() + '</div>';
	content += '</td></tr></table></div>';

	return content;
}

function drawSampleTextButtons() {
	let content = '<h3>Pangrams</h3>';
	content += makeTDButton('the five boxing wizards jump quickly');
	content += makeTDButton('pack my box with five dozen liquor jugs');
	content += makeTDButton('the quick brown fox jumps over a lazy dog');
	content += makeTDButton('amazingly few discotheques provide jukeboxes');
	content += makeTDButton('quick enemy movement will<br>jeopardize six of the gunboats');
	content += '<br><h3>Glyph sets</h3>';
	content += makeTDButton('abcdefghijklmnopqrstuvwxyz');
	content += makeTDButton('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
	content += makeTDButton('0123456789');
	content += makeTDSymbolButton();
	content += makeTDPermutationButtons();

	return content;
}

function makeTDButton(text) {
	let val = text.replace('<br>', ' ');
	return (
		'<button class="sampleText" onclick="livePreviewData.sampleText=\'' +
		val +
		'\';redraw_TestDrive();">' +
		text +
		'</button><br>'
	);
}

function makeTDSymbolButton() {
	let sym = [
		'&#x21;',
		'&#x22;',
		'&#x23;',
		'&#x24;',
		'&#x25;',
		'&#x26;',
		'&#x27;',
		'&#x28;',
		'&#x29;',
		'&#x2A;',
		'&#x2B;',
		'&#x2C;',
		'&#x2D;',
		'&#x2E;',
		'&#x2F;',
		'&#x3A;',
		'&#x3B;',
		'&#x3C;',
		'&#x3D;',
		'&#x3E;',
		'&#x3F;',
		'&#x40;',
		'&#x5B;',
		'&#x5C;',
		'&#x5D;',
		'&#x5E;',
		'&#x5F;',
		'&#x60;',
		'&#x7B;',
		'&#x7C;',
		'&#x7D;',
		'&#x7E;',
	];

	let re = '<button class="sampleText" onclick="clickTDSymbolButton();">';
	re += sym.join('');
	re += '</button><br>';

	return re;
}

function clickTDSymbolButton() {
	let sym = [
		0x21, 0x22, 0x23, 0x24, 0x25, 0x26, 0x27, 0x28, 0x29, 0x2a, 0x2b, 0x2c, 0x2d, 0x2e, 0x2f, 0x3a,
		0x3b, 0x3c, 0x3d, 0x3e, 0x3f, 0x40, 0x5b, 0x5c, 0x5d, 0x5e, 0x5f, 0x60, 0x7b, 0x7c, 0x7d, 0x7e,
	];

	let con = '';
	for (let s = 0; s < sym.length; s++) con += String.fromCharCode(sym[s]);

	livePreviewData.sampleText = con;

	redraw_TestDrive();
}

function makeTDPermutationButtons() {
	let re =
		'<button class="sampleText" onclick="clickTDPermutationButton(true);">All upper case letter permutations</button><br>';
	re +=
		'<button class="sampleText" onclick="clickTDPermutationButton(false);">All lower case letter permutations</button><br>';

	return re;
}

function clickTDPermutationButton(upper) {
	let seq = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	if (!upper) seq = seq.toLowerCase();
	let con = '';

	for (let first = 0; first < seq.length; first++) {
		for (let second = 0; second < seq.length; second++) {
			con += seq.charAt(first) + seq.charAt(second) + ' ';
		}
		con += '\n';
	}

	livePreviewData.sampleText = con;

	redraw_TestDrive();
}

function drawTDOptions() {
	if (!livePreviewData.lineGap) livePreviewData.lineGap = _GP.projectSettings.lineGap;
	if (!Number.isFinite(livePreviewData.padSize)) livePreviewData.padSize = 0;

	let flattenMessage =
		'<h1>Combine Glyphs Shapes</h1>' +
		'In <a href=# onclick=navToProjectSettings()>Project Settings &rsaquo; Export Options</a> you have the option to combine all glyph shapes.<br>' +
		'Having glyphs with many overlapping paths in a font can sometimes cause issues.<br>' +
		'So, this setting will flatten each glyph as it&prime;s exported to your font.<br><br>' +
		'Selecting this option in Test Drive here will <i>preview</i> how your glyph shapes will be <br>' +
		'combined. This preview will not change your designs in Glyphr Studio. There is a<br>' +
		'Combine Shapes action in Glyph Edit if you wish to permanently combine shapes.<br><br>' +
		'As a warning, this process is time intensive, so the first time you type a letter<br>' +
		'it may take a few seconds to render.';

	let content = '<table class="detail">';
	content +=
		'<tr><td> font size <span class="unit">(px)</span> </td><td><input type="number" value="' +
		livePreviewData.fontsize +
		'" onchange="changeFontScale(this.value); redraw_TestDrive();"></td></tr>';
	content +=
		'<tr><td> 96dpi font size <span class="unit">(pt)</span> </td><td><input type="number" disabled="disabled" id="roughPointSize" valu="75"/></td></tr>';
	content +=
		'<tr><td> line gap <span class="unit">(em units)</span> </td><td><input type="number" value="' +
		livePreviewData.lineGap +
		'" onchange="changeLineGap(this.value); redraw_TestDrive();"></td></tr>';
	// content += '<tr><td> glyph spacing <span class="unit">(em units)</span> </td><td><input type="number" value="'+livePreviewData.padSize+'" onchange="livePreviewData.padSize=this.value*1; redraw_TestDrive();"></td></tr>';
	content +=
		'<tr><td> <label for="showGlyphExtras">show glyph boxes</label> </td><td>' +
		checkUI('livePreviewData.showGlyphExtras', livePreviewData.showGlyphExtras, true) +
		'</td></tr>';
	content +=
		'<tr><td> <label for="showLineExtras">show baseline</label> </td><td>' +
		checkUI('livePreviewData.showLineExtras', livePreviewData.showLineExtras, true) +
		'</td></tr>';
	content +=
		'<tr><td> <label for="showPageExtras">show page borders</label> </td><td>' +
		checkUI('livePreviewData.showPageExtras', livePreviewData.showPageExtras, true) +
		'</td></tr>';

	content +=
		'<tr><td> <label for="flattenGlyphs">preview combine glyph shapes</label>' +
		helpUI(flattenMessage) +
		' </td><td>' +
		checkUI('livePreviewData.flattenGlyphs', livePreviewData.flattenGlyphs, false) +
		'</td></tr>';

	content +=
		'<tr><td colspan=2><button onclick="createImage();">generate png file</button></td></tr>';
	content += '</table>';
	return content;
}

function navToProjectSettings() {
	_UI.current_page = 'project settings';
	navigate();
}
