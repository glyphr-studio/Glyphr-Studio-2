import { getCurrentProject, getCurrentProjectEditor } from "../app/main.js";
import { makeElement } from "../common/dom.js";
import { log } from "../common/functions.js";
import { areHexValuesEqual, basicLatinOrder } from "../common/unicode.js";
import GlyphTile from "../controls/glyph-tile/glyph-tile.js";

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
	let editor = getCurrentProjectEditor();

	// let content = `<div class="glyph-chooser__tile-grid">`;
	let container = makeElement({tag: 'div', className: 'glyph-chooser__tile-grid'});

	basicLatinOrder.forEach(glyphID => {
		let oneTile = (editor.selectedGlyphID === glyphID)?
			new GlyphTile({glyph: glyphID, selected: 'true'}) :
			new GlyphTile({glyph: glyphID});

		oneTile.addEventListener('click', () => {
			editor.selectedGlyphID = glyphID;
		});

		editor.subscribe({
			topic:'selectedGlyphID',
			subscriberName: `Glyph tile ${glyphID}`,
			callback: (newGlyphID) => {
				// log('selectedGlyphID subscriber callback');
				// log(`checking if ${glyph.id} === ${glyphID}`);
				if(areHexValuesEqual(newGlyphID, glyphID)){
					// log(`Callback: setting ${oneTile.getAttribute('glyph')} attribute to selected`);
					oneTile.setAttribute('selected', '');
				} else {
					// log(`Callback: removing ${oneTile.getAttribute('glyph')} attribute selected`);
					oneTile.removeAttribute('selected');
				}
			}
		});

		container.appendChild(oneTile);
	});

	log('Project Editor PubSub:');
	log(editor.subscribers);

	log(container);
	log(`makeChooserContent_Glyphs`, 'end');
	return container;
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