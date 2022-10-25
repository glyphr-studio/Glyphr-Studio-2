import { makeElement } from '../common/dom.js';
import { getCurrentProjectEditor } from '../app/main.js';
import { makeNavButton, showNavDropdown } from '../project_editor/navigator.js';
import { makeGlyphChooserContent } from '../panels/glyph_chooser.js';
import { makeAlpha1Message, makeContributeMessage } from './about.js';

/**
 * Page > Overview
 * The first page you land on, with project
 * and glyph information
 */
export function makePage_Overview() {
	const editor = getCurrentProjectEditor();
	const content = makeElement({
		tag: 'div',
		id: 'app__page',
		innerHTML: `
		<div class="editor__page">
			<div class="content-page__left-area">
				<div class="content-page__nav-area">
					${makeNavButton({ level: 'l1', superTitle: 'PAGE', title: 'Overview' })}
				</div>
				<div id="content-page__panel">
					${makeAlpha1Message()}
					<br>
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
		editor.history.addState(`Navigated to ${editor.project.getGlyphName(glyphID, true)}`);

	}, false);

	content.querySelector('.content-page__right-area').appendChild(glyphsContent);
	// Page Selector
	let l1 = content.querySelector('#nav-button-l1');
	l1.addEventListener('click', function () {
		showNavDropdown(l1);
	});

	// log(`PageOverview.makePageContent`, 'end');

	return content;
}
