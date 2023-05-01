import { makeElement } from '../common/dom.js';
import { getCurrentProject, getCurrentProjectEditor, log } from '../app/main.js';
import { makeNavButton, toggleNavDropdown } from '../project_editor/navigator.js';
import { makeAllItemTypeChooserContent } from '../panels/glyph_chooser.js';
import { makeContributeContent, makePreReleaseNote } from './about.js';
import { showModalDialog } from '../controls/dialogs/dialogs.js';
import { countItems } from '../common/functions.js';

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

	let glyphsContent = makeAllItemTypeChooserContent((glyphID) => {
		// log(`Overview page - Glyph Chooser tile click handler`, 'start');
		// log(`glyphID: ${glyphID}`);

		const editor = getCurrentProjectEditor();
		editor.selectedGlyphID = glyphID;
		editor.nav.page = 'Characters';
		editor.navigate();
		editor.history.addState(`Navigated to ${editor.project.getItemName(glyphID, true)}`);
		// log(`Overview page - Glyph Chooser tile click handler`, 'end');
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

	const project = getCurrentProject();
	const projectSummaryCard = makeElement({
		className: 'panel__card more-padding',
		innerHTML: `
			<h2>Project info</h2>
			<label>Project name: </label><span>${project.settings.project.name}</span>
			<label>Font family: </label><span>${project.settings.font.family}</span>
			<label>Style: </label><span>${project.settings.font.style}</span>
			<label>Glyph count: </label><span>${
				countItems(project.glyphs) + countItems(project.ligatures)
			}</span>
			<label>UPM: </label><span>${project.settings.font.upm}</span>
			<label>Ascent: </label><span>${project.settings.font.ascent}</span>
			<label>Descent: </label><span>${project.settings.font.descent}</span>
			<br><span></span>
		`,
	});
	projectSummaryCard.appendChild(
		makeElement({
			tag: 'fancy-button',
			innerHTML: 'Edit project and font info',
			attributes: { secondary: '' },
			onClick: () => {
				const editor = getCurrentProjectEditor();
				editor.nav.page = 'Settings';
				editor.navigate();
			},
		})
	);

	const contributeCard = makeElement({
		className: 'panel__card full-width more-padding',
		innerHTML: `
			Glyphr Studio is community supported.
			<br>
			`,
	});
	contributeCard.appendChild(
		makeElement({
			tag: 'fancy-button',
			innerHTML: 'Learn how you can help Glyphr Studio!',
			attributes: { secondary: '' },
			onClick: () => {
				showModalDialog(makeContributeContent(), 500);
			},
		})
	);

	panelArea.appendChild(projectSummaryCard);
	panelArea.appendChild(welcomeCard);
	panelArea.appendChild(contributeCard);
	// log(`PageOverview.makePageContent`, 'end');

	return content;
}
