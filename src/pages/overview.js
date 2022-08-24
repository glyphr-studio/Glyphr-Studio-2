import { makeElement } from '../common/dom.js';
import { log } from '../common/functions.js';
import { getCurrentProjectEditor } from '../app/main.js';
import { makeNavButton, makeNavButtonContent } from '../app/nav.js';
import { showNavDropdown } from '../app/nav.js';
import { makeChooserContent_Glyphs } from '../panels/panel-choosers.js';
import makePanel_OverviewAttributes from '../panels/attributes_overview.js';


/**
 * Page > Overview
 * The first page you land on, with project
 * and glyph information
 */
export default class PageOverview {
	/**
	 * Initialize this page
	 */
	constructor() {}

	/**
	 * Load the Open Project page
	 * @returns {object} HTML Element + callback function
	 */
	pageLoader() {
		log(`PageOverview.pageLoader`, 'start');

		const content = makeElement({
			tag: 'div',
			id: 'app__page',
			innerHTML: `
			<div class="overview__page">
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
			let projectEditor = getCurrentProjectEditor();
			projectEditor.selectedGlyphID = glyphID;
			projectEditor.navigate('Glyph edit');
		}, false);

		content.querySelector('.overview__right-area').appendChild(glyphsContent);
		// Page Selector
		let l1 = content.querySelector('#nav-button-l1');
		l1.addEventListener('click', function(){ showNavDropdown(l1); });

		const callback = function () {};

		log(`PageOverview.pageLoader`, 'end');

		return { content: content, callback: callback };
	}
}
