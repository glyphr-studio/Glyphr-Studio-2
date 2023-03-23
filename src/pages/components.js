import { addAsChildren, makeElement, textToNode } from '../common/dom.js';
import { countItems } from '../common/functions.js';
import { getCurrentProject, getCurrentProjectEditor, log } from '../app/main.js';
import { makeNavButton, makeNavButtonContent } from '../project_editor/navigator.js';
import { toggleNavDropdown } from '../project_editor/navigator.js';
import { makePanel, refreshPanel } from '../panels/panels.js';
import { makeEditToolsButtons, makeViewToolsButtons } from '../edit_canvas/tools/tools.js';
import { removeStopCreatingNewPathButton } from '../edit_canvas/tools/new_path.js';
import { Glyph } from '../project_data/glyph.js';
import { closeEveryTypeOfDialog, showError, showModalDialog } from '../controls/dialogs/dialogs.js';

/**
 * Page > Components
 * Edit surface for Components
 * Comprised of Panels of tools, and the Edit Canvas
 */
export function makePage_Components() {
	// log(`makePage_Components`, 'start');
	const editor = getCurrentProjectEditor();
	// log('current ProjectEditor');
	// log(editor);
	// log(editor.nav);
	// log(`editor.selectedComponentID: ${editor.selectedComponentID}`);
	// log(`editor.selectedItemID: ${editor.selectedItemID}`);
	// log(`editor.nav.panel: ${editor.nav.panel}`);

	const selectedComponentID = editor.selectedComponentID;

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
					${makeNavButton({ level: 'l1', superTitle: 'PAGE', title: 'Components' })}
				</div>
				<div id="editor-page__panel"></div>
			</div>
			${selectedComponentID ? editingContent : firstRunContent}
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

	if (!selectedComponentID) {
		// Early return for project with zero components
		addAsChildren(canvasArea, makeComponentsFirstRunContent());
		navArea.style.display = 'block';
		l1.style.width = '100%';
		l1.style.borderRadius = '4px';
		// log(`makePage_Components`, 'end');
		return content;
	}

	const selectedComponent = editor.selectedComponent;
	const l2Button = makeNavButton({
		level: 'l2',
		superTitle: 'EDITING',
		title: selectedComponent.name,
	});
	const l3Button = makeNavButton({ level: 'l3', superTitle: 'PANEL', title: editor.nav.panel });

	navArea.appendChild(textToNode(l2Button));
	navArea.appendChild(textToNode(l3Button));

	const editCanvas = makeElement({
		tag: 'edit-canvas',
		id: 'editor-page__edit-canvas',
		attributes: { 'editing-item-id': editor.selectedComponentID },
	});

	canvasArea.appendChild(editCanvas);

	// Component Selector
	let l2 = content.querySelector('#nav-button-l2');
	l2.addEventListener('click', function () {
		toggleNavDropdown(l2);
	});
	editor.subscribe({
		topic: 'whichComponentIsSelected',
		subscriberID: 'nav.componentChooserButton',
		callback: () => {
			l2.innerHTML = makeNavButtonContent(editor.selectedComponent.name, 'EDITING');
		},
	});

	// Panel Selector
	let l3 = content.querySelector('#nav-button-l3');
	l3.addEventListener('click', function () {
		toggleNavDropdown(l3);
	});

	// Panel
	content.querySelector('#editor-page__panel').appendChild(makePanel());
	editor.subscribe({
		topic: ['whichComponentIsSelected', 'whichPathIsSelected'],
		subscriberID: 'nav.panelChooserButton',
		callback: () => {
			refreshPanel();
		},
	});

	// Tools
	let toolsArea = content.querySelector('.editor-page__tools-area');
	toolsArea.innerHTML = '';
	let toolsButtons = makeEditToolsButtons();
	if (toolsButtons) addAsChildren(toolsArea, toolsButtons);

	let zoomArea = content.querySelector('.editor-page__zoom-area');
	zoomArea.innerHTML = '';
	let viewButtons = makeViewToolsButtons();
	if (viewButtons) addAsChildren(zoomArea, viewButtons);

	// Canvas
	editor.subscribe({
		topic: 'whichComponentIsSelected',
		subscriberID: 'editCanvas.selectedComponent',
		callback: (newComponentID) => {
			// log(`Main Canvas subscriber callback`, 'start');
			removeStopCreatingNewPathButton();
			// log(`new id ${newComponentID} on the main canvas`);
			content
				.querySelector('#editor-page__edit-canvas')
				.setAttribute('editing-item-id', newComponentID);
			// log(`Main Canvas subscriber callback`, 'end');
		},
	});

	editor.subscribe({
		topic: 'whichPathIsSelected',
		subscriberID: 'editCanvas.selectedPath',
		callback: () => {
			removeStopCreatingNewPathButton();
			editor.editCanvas.redraw({ calledBy: 'Edit canvas subscription to selectedPath' });
		},
	});

	editor.subscribe({
		topic: 'whichPathPointIsSelected',
		subscriberID: 'editCanvas.selectedPathPoint',
		callback: () => {
			editor.editCanvas.redraw({ calledBy: 'Edit canvas subscription to selectedPathPoint' });
		},
	});

	editor.subscribe({
		topic: 'currentItem',
		subscriberID: 'ComponentsPage.l2Nav',
		callback: () => {
			l2.innerHTML = makeNavButtonContent(editor.selectedComponent.name, 'EDITING');
		},
	});

	// log(`makePage_Components`, 'end');
	return content;
}

function makeComponentsFirstRunContent() {

	let componentExampleTable = '';
	[
		{
			root: 'A',
			instances:
				'&#xC0;&#xC1;&#xC2;&#xC3;&#xC4;&#xC5;&#x100;&#x102;&#x104;&#x1DE;&#x1FA;&#x200;&#x226;&#x23A;&#x1E00;&#x24B6;&#x2C6F;',
		},
		{
			root: 'N',
			instances:
				'&#xD1;&#x143;&#x145;&#x147;&#x19D;&#x1F8;&#x1E44;&#x1E46;&#x1E48;&#x1E4A;&#x24C3;&#xA790;&#xA7A4;',
		},
	].forEach((example) => {
		componentExampleTable += `
			<span class="first-run__example-wrapper">
					<pre>${example.root}</pre>
					<span> ➞ </span>
					<pre>${example.instances}</pre>
			</span>
		`;
	});

	const content = makeElement({
		className: 'editor-page__first-run',
		innerHTML: `
			<h1>There are no components in your project</h1>
			<p>
				Components are a Glyphr Studio feature that lets you re-use a collection of paths
				across many different glyphs. The root is called a 'Component' and these are added
				by reference to other glyphs, where they are called 'Component Instances'.
				Updating the root component will also update all component instances.
			</p>
			<p>
				<div class="first-run__examples-table">
					${componentExampleTable}
				</div>
				Diacritic glyphs (glyphs with accents) are just one example of where having a shared
				component root can be used across many individual characters.
			</p>
		`,
	});

	const addOneComponentButton = makeElement({
		tag: 'fancy-button',
		innerHTML: 'Create a new component',
		onClick: showAddComponentDialog,
	});

	content.appendChild(addOneComponentButton);
	return content;
}

function addComponent(name) {
	const newID = makeComponentID();
	const project = getCurrentProject();
	if (project.components[newID]) {
		return 'Component already exists';
	}

	project.components[newID] = new Glyph({
		id: newID,
		parent: project,
		objType: 'Component',
		name: name,
		component: name.split('').map((char) => char.codePointAt(0)),
	});

	return project.components[newID];
}

export function makeComponentID() {
	// log(`makeComponentID`, 'start');

	const project = getCurrentProject();
	let counter = countItems(project.components);
	while (project.components[`comp-${counter}`]) counter++;
	// log(`makeComponentID`, 'end');
	return `comp-${counter}`;
}

export function showAddComponentDialog() {
	const content = makeElement({
		innerHTML: `
			<h2>Add a new component</h2>
				Specify a name to create a new component:
				<br>
				<input id="components__new-component-input" type="text"
					autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
				/>
				<br><br>
				<fancy-button disabled id="components__add-new-component-button">Add new component to project</fancy-button>
		`,
	});

	const submitButton = content.querySelector('#components__add-new-component-button');
	const newComponentInput = content.querySelector('#components__new-component-input');

	newComponentInput.addEventListener('keyup', () => {
		if (newComponentInput.value.length < 1) {
			submitButton.setAttribute('disabled', '');
		} else {
			submitButton.removeAttribute('disabled');
		}
	});

	submitButton.addEventListener('click', () => {
		const result = addComponent(newComponentInput.value);
		if (typeof result === 'string') {
			showError(result);
		} else {
			const editor = getCurrentProjectEditor();
			editor.selectedComponentID = result.id;
			editor.navigate();
			closeEveryTypeOfDialog();
		}
	});

	showModalDialog(content, 500);
}
