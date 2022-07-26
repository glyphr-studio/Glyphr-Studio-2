import { getCurrentProject } from "../app/main.js";
import { log } from "../common/functions.js";
import { basicLatinOrder } from "../common/unicode.js";

export {makeChooserContent_Pages, makeChooserContent_Glyphs, makeChooserContent_Panels };

function makeChooserContent_Pages(){
	log(`makeChooserContent_Pages`, 'start');

	let content = `
		<button>Glyph edit</button>
		<button>Glyph edit</button>
		<button>Glyph edit</button>
		<button>Glyph edit</button>
		<br>
	`;

	log(`makeChooserContent_Pages`, 'end');
	return content;
}

function makeChooserContent_Glyphs(){
	log(`makeChooserContent_Glyphs`, 'start');
	let project = getCurrentProject();
	let content = `<div class="glyph-chooser__tile-grid">`;

	basicLatinOrder.forEach(glyphID => {
		content += `<glyph-tile glyph="${glyphID}"></glyph-tile>`;
	});

	content += '</div>';
	log(`makeChooserContent_Glyphs`, 'end');
	return content;
}

function makeChooserContent_Panels(){
	log(`makeChooserContent_Panels`, 'start');

	let content = `
		<button>Attributes</button>
		<button>Layers</button>
		<button>Guides</button>
		<button>History</button>
		<br>
	`;

	log(`makeChooserContent_Panels`, 'end');
	return content;
}