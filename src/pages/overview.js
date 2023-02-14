import { makeElement } from '../common/dom.js';
import { getCurrentProjectEditor } from '../app/main.js';
import { makeNavButton, toggleNavDropdown } from '../project_editor/navigator.js';
import { makeGlyphChooserContent } from '../panels/glyph_chooser.js';
import { makePreReleaseNote } from './about.js';

/**
 * Page > Overview
 * The first page you land on, with project
 * and glyph information
 */
export function makePage_Overview() {
	const content = makeElement({
		tag: 'div',
		id: 'app__page',
		innerHTML: `
		<div class="content__page">
			<div class="content-page__left-area">
				<div class="content-page__nav-area">
					${makeNavButton({ level: 'l1', superTitle: 'PAGE', title: 'Overview' })}
				</div>
				<div id="content-page__panel"></div>
			</div>
			<div class="content-page__right-area"></div>
		</div>
	`,
	});

	// log(content);

	let glyphsContent = makeGlyphChooserContent((glyphID) => {
		const editor = getCurrentProjectEditor();
		editor.selectedGlyphID = glyphID;
		editor.nav.page = 'Glyph edit';
		editor.navigate();
		editor.history.addState(`Navigated to ${editor.project.getGlyphName(glyphID, true)}`);
	}, false);

	content.querySelector('.content-page__right-area').appendChild(glyphsContent);
	// Page Selector
	let l1 = content.querySelector('#nav-button-l1');
	l1.addEventListener('click', function () {
		toggleNavDropdown(l1);
	});

	const panelArea = content.querySelector('#content-page__panel');
	const welcomeCard = makeElement({
		className: 'panel__card full-width more-padding',
	});
	welcomeCard.appendChild(makePreReleaseNote(false));
	panelArea.appendChild(welcomeCard);
	// log(`PageOverview.makePageContent`, 'end');

	return content;
}
