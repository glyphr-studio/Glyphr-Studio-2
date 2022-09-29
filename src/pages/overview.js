import { makeElement } from '../common/dom.js';
import { getCurrentProjectEditor } from '../app/main.js';
import { makeNavButton, makeNavButtonContent, showNavDropdown} from '../project_editor/navigator.js';
import { makeGlyphChooserContent } from '../panels/glyph_chooser.js';


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
		// log(`PageOverview.makePageContent`, 'start');

		const editor = getCurrentProjectEditor();
		const content = makeElement({
			tag: 'div',
			id: 'app__page',
			innerHTML: `
			<div class="editor__page">
				<div class="content-page__left-area">
					<div class="content-page__nav-area">
						${makeNavButton({level: 'l1', superTitle: 'PAGE', title: 'Overview'})}
					</div>
					<div id="content-page__panel">
						<div class="panel__card full-width">
							<h3>${editor.project.projectSettings.name}</h3>
							<span>More settings can be found on the Settings page</span>
						</div>
					</div>
				</div>
				<div class="content-page__right-area"></div>
			</div>
		`,
		});

		// log(content);

		let glyphsContent = makeGlyphChooserContent((glyphID) => {
			const editor = getCurrentProjectEditor();
			editor.selectedGlyphID = glyphID;
			editor.navigate('Glyph edit');
		}, false);

		content.querySelector('.content-page__right-area').appendChild(glyphsContent);
		// Page Selector
		let l1 = content.querySelector('#nav-button-l1');
		l1.addEventListener('click', function(){ showNavDropdown(l1); });

		// log(`PageOverview.makePageContent`, 'end');

		return content;
	}
}
