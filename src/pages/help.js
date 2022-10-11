import { makeElement } from '../common/dom.js';
import { makeNavButton, toggleNavDropdown } from '../project_editor/navigator.js';
import { getCurrentProjectEditor } from '../app/main.js';
import { emailLink } from '../app/app.js';

/**
 * Page > About
 * Information about Glyphr Studio
 */
export function makePage_Help() {
	const editor = getCurrentProjectEditor();
	const app = window._GlyphrStudioApp;
	const content = makeElement({
		tag: 'div',
		id: 'app__page',
		innerHTML: `
		<div class="content__page">
			<div class="content-page__left-area">
				<div class="content-page__nav-area">
					${makeNavButton({ level: 'l1', superTitle: 'PAGE', title: 'Help' })}
				</div>
				<div id="content-page__panel">

				</div>
			</div>
			<div class="content-page__right-area">
				<h1>Help</h1>
				<p>
					Help articles for Glyphr Studio v2 will be at
					<a href="https://www.glyphrstudio.com/help/v2" target="_new">glyphrstudio.com/help/v2</a>,
					though during the Alpha/Beta stages content may be sparse.
				</p>
				<p>
					At any time, you can reach out to ${emailLink()} for any help you need.
				</p>

				<br><br>

				<h1>Keyboard shortcut reference</h1>
				${makeKeyboardShortcutReference()}

			</div>
		</div>
	`,
	});

	// Page Selector
	let l1 = content.querySelector('#nav-button-l1');
	l1.addEventListener('click', function () {
		toggleNavDropdown(l1);
	});

	return content;
}

export function makeKeyboardShortcutReference() {
	let content = `
		<div class="keyboardShortcutTable">

		</div>
	`;
	return content;
}