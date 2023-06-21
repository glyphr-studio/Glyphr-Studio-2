import { addAsChildren, makeElement, textToNode } from '../common/dom.js';
import { getCurrentProject, getCurrentProjectEditor } from '../app/main.js';
import { makeNavButton, makeNavButtonContent } from '../project_editor/navigator.js';
import { toggleNavDropdown } from '../project_editor/navigator.js';
import { makePanel, refreshPanel } from '../panels/panels.js';
import { makeKernToolsButtons, makeViewToolsButtons } from '../edit_canvas/tools/tools.js';
import {
	closeAllInfoBubbles,
	closeEveryTypeOfDialog,
	showError,
	showModalDialog,
} from '../controls/dialogs/dialogs.js';
import { countItems } from '../common/functions.js';
import { KernGroup } from '../project_data/kern_group.js';
import { hexesToChars } from '../common/character_ids.js';

/**
 * Page > Kerning
 * Edit surface for Kerning
 * Comprised of Panels of tools, and the Edit Canvas
 */
export function makePage_Kerning() {
	// log(`makePage_Kerning`, 'start');
	const editor = getCurrentProjectEditor();
	// log('current ProjectEditor');
	// log(editor);
	// log(editor.nav);
	// log(`editor.selectedKernGroupID: ${editor.selectedKernGroupID}`);
	// log(`editor.selectedItemID: ${editor.selectedItemID}`);
	// log(`editor.nav.panel: ${editor.nav.panel}`);

	const selectedKernGroupID = editor.selectedKernGroupID;

	const editingContent = `
		<div class="editor-page__tools-area"></div>
		<div class="editor-page__edit-canvas-wrapper"></div>
		<div class="editor-page__zoom-area"></div>
	`;

	const firstRunContent = `<div class="editor-page__edit-canvas-wrapper" style="grid-column: span 2; overflow-y: scroll;"></div>`;

	const content = makeElement({
		tag: 'div',
		id: 'app__page',
		innerHTML: `
		<div class="editor__page">
			<div class="editor-page__left-area">
				<div class="editor-page__nav-area">
					${makeNavButton({ level: 'l1', superTitle: 'PAGE', title: 'Kerning' })}
				</div>
				<div id="editor-page__panel"></div>
			</div>
			${selectedKernGroupID ? editingContent : firstRunContent}
		</div>
	`,
	});

	// Page Selector
	let l1 = content.querySelector('#nav-button-l1');
	l1.addEventListener('click', function () {
		toggleNavDropdown(l1);
	});

	const navArea = content.querySelector('.editor-page__nav-area');
	const canvasArea = content.querySelector('.editor-page__edit-canvas-wrapper');

	if (!selectedKernGroupID) {
		// Early return for project with zero kern groups
		addAsChildren(canvasArea, makeKerningFirstRunContent());
		navArea.style.display = 'block';
		l1.style.width = '100%';
		l1.style.borderRadius = '4px';
		// log(`makePage_Kerning`, 'end');
		return content;
	}

	const selectedKernGroup = editor.selectedKernGroup;
	const l2Button = makeNavButton({
		level: 'l2',
		superTitle: 'EDITING',
		title: selectedKernGroup.name,
	});
	const l3Button = makeNavButton({ level: 'l3', superTitle: 'PANEL', title: editor.nav.panel });

	navArea.appendChild(textToNode(l2Button));
	navArea.appendChild(textToNode(l3Button));

	const editCanvas = makeElement({
		tag: 'edit-canvas',
		id: 'editor-page__edit-canvas',
		attributes: { 'editing-item-id': editor.selectedKernGroupID },
	});

	canvasArea.appendChild(editCanvas);

	// Kern Selector
	let l2 = content.querySelector('#nav-button-l2');
	l2.addEventListener('click', function () {
		toggleNavDropdown(l2);
	});
	editor.subscribe({
		topic: 'whichKernGroupIsSelected',
		subscriberID: 'nav.kernChooserButton',
		callback: () => {
			l2.innerHTML = makeNavButtonContent(editor.selectedKernGroup.name, 'EDITING');
		},
	});

	// Panel Selector
	let l3 = content.querySelector('#nav-button-l3');
	l3.addEventListener('click', function () {
		toggleNavDropdown(l3);
	});

	// Panel
	const panel = content.querySelector('#editor-page__panel');
	panel.appendChild(makePanel());
	panel.addEventListener('scroll', closeAllInfoBubbles);
	editor.subscribe({
		topic: ['whichKernGroupIsSelected'],
		subscriberID: 'nav.panelChooserButton',
		callback: () => {
			refreshPanel();
		},
	});

	// Tools
	editor.selectedTool = 'kern';
	let toolsArea = content.querySelector('.editor-page__tools-area');
	toolsArea.innerHTML = '';
	let toolsButtons = makeKernToolsButtons();
	if (toolsButtons) addAsChildren(toolsArea, toolsButtons);

	let zoomArea = content.querySelector('.editor-page__zoom-area');
	zoomArea.innerHTML = '';
	let viewButtons = makeViewToolsButtons();
	if (viewButtons) addAsChildren(zoomArea, viewButtons);

	// Canvas
	editor.subscribe({
		topic: 'whichKernGroupIsSelected',
		subscriberID: 'editCanvas.selectedKernGroup',
		callback: (newKernID) => {
			log(`Main Canvas subscriber callback`, 'start');
			log(`new id ${newKernID} on the main canvas`);
			content.querySelector('#editor-page__edit-canvas').setAttribute('editing-item-id', newKernID);
			log(`Main Canvas subscriber callback`, 'end');
		},
	});

	// log(`makePage_Kerning`, 'end');
	return content;
}

function makeKerningFirstRunContent() {
	const content = makeElement({
		className: 'editor-page__first-run',
		innerHTML: `
			<h1>There are no kern pairs in your project</h1>
			<p>
				Kerning is an advanced feature of fonts that recognizes a pair of characters, then
				adjusts the spacing between them to some custom value. The default spacing between
				characters is zero - which is to say, the white space (side bearings) within each
				character are the only space shown.
			</p>
			<p>
				Some letter combinations, like <code>VA</code>
				as an example, if the default side bearing spacing
				is used, the letters visually look very far apart. Kerning can help the visual flow of
				character pairs look more well considered. Many character pairs may need either negative
				or positive kern values to make them "look right".
			</p>
			<h2>Class-based kerning</h2>
			<p>
				Font files encode kerning values as three pieces of information: a left character, a right
				character, and a horizontal adjustment value. Fonts with many characters can end up having
				a huge amount of kern pairs. Glyphr Studio uses a system called Class-based Kerning, where
				groups of characters with similar edges (like
					<code>V</code><code>v</code><code>W</code><code>w</code>
					)
				can be treated as a single left-hand group, and a group of right-hand characters (for example,
				<code>A</code><code>/</code>) can be treated as single group - which can be given a single value.
				When a font is exported, the permutations are saved as individual kern pairs. But, while
				editing, grouping common characters often simplifies the overall kerning process.
			</p>
		`,
	});

	const addOneKernButton = makeElement({
		tag: 'fancy-button',
		innerHTML: 'Create a new kern pair',
		onClick: showAddKernDialog,
	});

	content.appendChild(addOneKernButton);
	return content;
}

function addKern(leftGroup, rightGroup, value) {
	// log(`addKern`, 'start');

	// Finish up creating new ID and Kern
	const newID = makeKernID();
	// log(`newID: ${newID}`);

	const project = getCurrentProject();

	project.addNewItem(
		new KernGroup({
			leftGroup: leftGroup,
			rightGroup: rightGroup,
			value: value,
		}),
		'KernGroup',
		newID
	);

	getCurrentProjectEditor().selectedKernGroupID = newID;

	// log(`addKern`, 'end');
	return project.kerning[newID];
}

export function makeKernID(kernGroups = getCurrentProject().kerning) {
	// log(`makeKernID`, 'start');
	let counter = countItems(kernGroups);
	while (kernGroups[`kern-${counter}`]) counter++;
	// log(`makeKernID`, 'end');
	return `kern-${counter}`;
}

export function showAddKernDialog() {
	const content = makeElement({
		innerHTML: `
			<h2>Add a new kern group</h2>
				Create a new kern group by specifying which characters should be in the left-side group,
				the right-side group, then what distance in <code>Em</code> units should be used for the
				kern value.
				<br><br>

				<h3>Left group</h3>
				<input id="kerning__add-new-kern-group__left-group" type="text"
					autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
				/>
				<br><br>
				<h3>Right group</h3>
				<input id="kerning__add-new-kern-group__right-group" type="text"
					autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
				/>
				<br><br>
				<h3>Value</h3>
				<input id="kerning__add-new-kern-group__value" type="text"
					autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
				/>
				<br><br>
				<fancy-button disabled id="kerning__add-new-kern-group__submit-button">Add new kern group</fancy-button>
		`,
	});

	const submitButton = content.querySelector('#kerning__add-new-kern-group__submit-button');

	submitButton.addEventListener('click', () => {
		// log(`showAddKernDialog button click handler`, 'start');
		const newKernLeft = content.querySelector('#kerning__add-new-kern-group__left-group');
		const newKernRight = content.querySelector('#kerning__add-new-kern-group__right-group');
		const newKernValue = content.querySelector('#kerning__add-new-kern-group__value');

		const result = addKern(
			newKernLeft.value.split(),
			newKernRight.value.split(),
			parseInt(newKernValue.value)
		);
		// log(`result: ${result}`);

		if (typeof result === 'string') {
			showError(result);
		} else {
			const editor = getCurrentProjectEditor();
			editor.navigate();
			closeEveryTypeOfDialog();
		}
		// log(`showAddKernDialog button click handler`, 'end');
	});

	showModalDialog(content, 500);
}

export function makeKernGroupCharChips(group) {
	// log(`makeKernGroupCharChips`, 'start');
	// log(`group: ${group}`);

	const wrapper = makeElement();
	group.forEach((charID) => {
		// log(`charID: ${charID}`);

		let char = hexesToChars(charID);
		// log(char);
		wrapper.appendChild(makeElement({ tag: 'code', innerHTML: char }));
	});
	// log(`makeKernGroupCharChips`, 'end');
	return wrapper;
}
