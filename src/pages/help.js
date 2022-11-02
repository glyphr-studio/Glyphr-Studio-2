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
				<p>
					At any time, you can reach out to ${emailLink()} for any help you need.
				</p>
				</div>
			</div>
			<div class="content-page__right-area">
				<h1>Help</h1>
				<p>
					Help articles for Glyphr Studio v2 will be at
					<a href="https://www.glyphrstudio.com/v2/help" target="_blank">glyphrstudio.com/v2/help</a>,
					though during the Alpha/Beta stages content may be sparse.
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
			<h3>View</h3>
			<span>
				<code>ctrl</code><code>scroll wheel</code>
			</span>
			<label>
				Zoom in and out
			</label>

			<span>
				<code>ctrl</code><code>+</code>
			</span>
			<label>
				Zoom in
			</label>

			<span>
				<code>ctrl</code><code>-</code>
			</span>
			<label>
				Zoom out
			</label>

			<span>
				<code>ctrl</code><code>0</code>
			</span>
			<label>
				Auto-fit glyph on the screen
			</label>

			<h3>Editing</h3>
			<span>
				<code>ctrl</code><code>c</code>
			</span>
			<label>
				Copy the selected paths
			</label>

			<span>
				<code>ctrl</code><code>v</code>
			</span>
			<label>
				Paste the selected paths
			</label>

			<span>
				<code>ctrl</code><code>a</code>
			</span>
			<label>
				Select all paths
			</label>

			<span>
				<code>del</code> or<br>
				<code>backspace</code>
			</span>
			<label>
				Delete the selected paths or path points
			</label>

			<span>
				<code>⇦</code>
				<code>⇧</code>
				<code>⇨</code>
				<code>⇩</code>
			</span>
			<label>
				Nudge the selected path or path point <span class="number">1em</span><br>
				Press <code>shift</code> to nudge <span class="number">10em</span>
			</label>

			<h3>Tools</h3>
			<span>
				<code>v</code>
			</span>
			<label>Switch to the arrow tool</label>

			<span>
				<code>b</code>
			</span>
			<label>Switch to the pen tool</label>

			<span>
				<code>space</code> or<br>
				<code>scroll wheel click</code>
			</span>
			<label>
				Toggle the pan tool
			</label>

		</div>
	`;
	return content;
}
