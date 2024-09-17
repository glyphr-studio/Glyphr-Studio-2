import { emailLink } from '../app/app.js';
import { makeElement } from '../common/dom.js';
import { TabControl } from '../controls/tabs/tab_control.js';
import { makeNavButton, toggleNavDropdown } from '../project_editor/navigator.js';

/**
 * Page > Help
 * Help content for Glyphr Studio.
 * @returns {Element} - page content
 */
export function makePage_Help() {
	const content = makeElement({
		tag: 'div',
		id: 'app__page',
		innerHTML: `
		<div class="content__page">
			<div class="content-page__left-area">
				<div class="content-page__nav-area">
					${makeNavButton({ level: 'l1', superTitle: 'PAGE', title: 'Help' })}
				</div>
				<div id="content-page__panel"></div>
			</div>
			<div class="content-page__right-area"></div>
		</div>
	`,
	});

	// Page Selector
	let l1 = content.querySelector('#nav-button-l1');
	l1.addEventListener('click', function () {
		toggleNavDropdown(l1);
	});

	const rightArea = content.querySelector('.content-page__right-area');
	const tabControl = new TabControl(rightArea);

	tabControl.registerTab('Overview', makeHelpOverview);
	tabControl.registerTab('Keyboard shortcuts', makeKeyboardShortcutReference);
	tabControl.selectTab('Overview');

	const panelArea = content.querySelector('#content-page__panel');
	panelArea.appendChild(tabControl.makeTabs());

	return content;
}

/**
 * Makes the overview content
 * @returns {Element}
 */
function makeHelpOverview() {
	const content = makeElement({
		innerHTML: `
		<h1>Help</h1>
		<p>
			Help articles for Glyphr Studio v2 will be at
			<a href="https://www.glyphrstudio.com/help" target="_blank">glyphrstudio.com/help</a>,
			please email us if you find anything missing.
		</p>
		<p>
			At any time, you can reach out for any help you need:
			${emailLink()}
		</p>
	`,
	});

	return content;
}

/**
 * Makes the keyboard shortcut table content
 * @returns {Element}
 */
export function makeKeyboardShortcutReference() {
	let content = makeElement({
		innerHTML: `
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
				Copy the selected shapes
			</label>

			<span>
				<code>ctrl</code><code>v</code>
			</span>
			<label>
				Paste the selected shapes
			</label>

			<span>
				<code>ctrl</code><code>a</code>
			</span>
			<label>
				Select all shapes
			</label>

			<span>
				<code>del</code> or<br>
				<code>backspace</code>
			</span>
			<label>
				Delete the selected shapes or path points
			</label>

			<span>
				<code>⇦</code>
				<code>⇧</code>
				<code>⇨</code>
				<code>⇩</code>
			</span>
			<label>
				Nudge the selected shape or path point <span class="number">1em</span><br>
				Press <code>shift</code> to nudge <span class="number">10em</span>
			</label>

			<span>
				<code>ctrl</code><i><code>Click an Edit Canvas shape</code></i>
				or<br>
				<code>ctrl</code><i><code>Click a Layers Panel shape</code></i>
			</span>
			<label>
				Toggle selection for that shape (multi-select)
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

			<span>
				<code>shift</code>
				<i><code>Shape Rotation handle</code></i>
			</span>
			<label>
				Snap rotation degrees to whole numbers
			</label>

			<span>
				<code>shift</code>
				<i><code>Add Path Point tool</code></i>
			</span>
			<label>
				Snap the new point's coordinates to whole numbers
			</label>

		</div>
	`,
	});

	return content;
}
