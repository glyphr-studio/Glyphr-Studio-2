import { makeElement } from '../common/dom.js';
import { makeNavButton, toggleNavDropdown } from '../project_editor/navigator.js';
import { makeGlyphrStudioLogo } from '../common/graphics.js';

/**
 * Page > About
 * Information about Glyphr Studio
 */
export class PageAbout {
	/**
	 * Initialize this page
	 */
	constructor() {}

	/**
	 * Load the Open Project page
	 * @returns {object} HTML Element + callback function
	 */
	makePageContent() {
		// log(`PageAbout.makePageContent`, 'start');

		const content = makeElement({
			tag: 'div',
			id: 'app__page',
			innerHTML: `
			<div class="content__page">
				<div class="content-page__left-area">
					<div class="content-page__nav-area">
						${makeNavButton({level: 'l1', superTitle: 'PAGE', title: 'About'})}
					</div>
					<div id="content-page__panel">
						<div class="panel__card full-width">
							<h3>Helpful links</h3>
							<span>thing</span>
							<span>thing</span>
							<span>thing</span>
							<span>thing</span>
						</div>
					</div>
				</div>
				<div class="content-page__right-area">
					<h1>About Glyphr Studio v2</h1>
					${makeGlyphrStudioLogo()}
				</div>
			</div>
		`,
		});
		
		// Page Selector
		let l1 = content.querySelector('#nav-button-l1');
		l1.addEventListener('click', function(){ toggleNavDropdown(l1); });

		return content;
	}
}
