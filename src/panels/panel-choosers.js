import { getCurrentProject } from "../app/main.js";
import { log } from "../common/functions.js";

export {makeChooserContent_Pages, makeChooserContent_Glyphs, makeChooserContent_Panels };

function makeChooserContent_Pages(){
	log(`makeChooserContent_Pages`, 'start');

	let content = `
		<button>Glyph edit</button><br>
		<button>Glyph edit</button><br>
		<button>Glyph edit</button><br>
		<button>Glyph edit</button><br>
	`;

	log(`makeChooserContent_Pages`, 'end');
	return content;
}

function makeChooserContent_Glyphs(){
	log(`makeChooserContent_Glyphs`, 'start');
	let project = getCurrentProject();
	let content = ``;

	Object.entries(project.glyphs).map(entry => {
		// let key = entry[0];
		// let value = entry[1];
		content += `
			<div class="panel-chooser__glyph-tile">
				<canvas-display width="100" height="100" glyphs="${entry[1].char}"></canvas-display>
				<br>
				${entry[1].name}
				<br>
				${entry[0]}
			</div>
		`;
	});
	log(`makeChooserContent_Glyphs`, 'end');
	return content;
}

function makeChooserContent_Panels(){
	log(`makeChooserContent_Panels`, 'start');

	let content = `
		<button>Attributes</button><br>
		<button>Layers</button><br>
		<button>Guides</button><br>
		<button>History</button><br>
	`;

	log(`makeChooserContent_Panels`, 'end');
	return content;
}