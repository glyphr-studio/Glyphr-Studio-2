import { makeElement } from '../common/dom.js';
import { getCurrentProjectEditor } from '../app/main.js';
import { makeNavButton, makeNavButtonContent, showNavDropdown} from '../project_editor/navigator.js';
import { makeChooserContent_Glyphs } from '../panels/panel-choosers.js';
import { makePanel_OverviewAttributes } from '../panels/attributes_panel_overview.js';


/**
 * Page > Overview
 * The first page you land on, with project
 * and glyph information
 */
export class PageOverview {
	/**
	 * Initialize this page
	 */
	constructor() {}

	/**
	 * Load the Open Project page
	 * @returns {object} HTML Element + callback function
	 */
	makePageContent() {
		log(`PageOverview.makePageContent`, 'start');

		const content = makeElement({
			tag: 'div',
			id: 'app__page',
			innerHTML: `
			<div class="editor__page">
				<div class="overview__left-area">
					<div class="overview__nav-area">
						${makeNavButton({level: 'l1', superTitle: 'PAGE', title: 'Overview'})}
					</div>
					<div id="overview__panel">
						${makePanel_OverviewAttributes()}
					</div>
				</div>
				<div class="overview__right-area"></div>
			</div>
		`,
		});

		log(content);

		let glyphsContent = makeChooserContent_Glyphs((glyphID) => {
			const editor = getCurrentProjectEditor();
			editor.selectedGlyphID = glyphID;
			editor.navigate('Glyph edit');
		}, false);

		content.querySelector('.overview__right-area').appendChild(glyphsContent);
		// Page Selector
		let l1 = content.querySelector('#nav-button-l1');
		l1.addEventListener('click', function(){ showNavDropdown(l1); });

		log(`PageOverview.makePageContent`, 'end');

		return content;
	}
}
