import { makeElement } from '../../common/dom';
import { countItems, duplicates } from '../../common/functions';
import { ProjectEditor } from '../../project_editor/project_editor';
import { emailLink } from '../app';
import { getCurrentProjectEditor, getGlyphrStudioApp } from '../main';
import { updateContent_addComponents, updateFooter_addComponents } from './action_add_components';
import { updateContent_addKernGroups, updateFooter_addKernGroups } from './action_add_kern_groups';
import {
	updateCharacterCopyTable,
	updateContent_copyShapes,
	updateFooter_copyShapes,
} from './action_copy_shapes';
import {
	updateContent_overwriteItems,
	updateFooter_overwriteItems,
} from './action_overwrite_items';
import {
	updateContent_overwriteSettings,
	updateFooter_overwriteSettings,
} from './action_overwrite_settings';

/** @type {ProjectEditor} */
export let sourceEditor;
/** @type {ProjectEditor} */
export let destinationEditor;
/** @type {Array} */
export let selectedItemIDs = [];
/** @type {Object | false} */
export let selectedRange = false;

/**
 * Make the Cross-project Actions page
 * @returns {HTMLElement}
 */
export function makePage_CrossProjectActions() {
	const content = makeElement({
		tag: 'div',
		id: 'app__page',
		innerHTML: `
			<div id="cross-project-actions__page">
				<div class="cross-project-actions__page-header">
					<h1>Cross&#8209;project&nbsp;actions</h1><span></span><span id="cross-project-actions__close-button">✖</span>
					<option-chooser id="cross-project-actions__action-chooser" selected-name="Choose an action to get started...">
						<option>Copy character or ligature shapes</option>
						<option>Overwrite characters or ligatures</option>
						<option>Add component roots</option>
						<option>Add kern groups</option>
						<option>Overwrite settings</option>
					</option-chooser>
					<span id="cross-project-actions__item-count"></span>
					<span></span>
				</div>
				<div id="cross-project-actions__page-content">
					<div class="cross-project-actions__welcome-content">
						<h2>These actions help you move and copy items between the two projects you have open.</h2>
						<br>
						To get started, choose an action from the dropdown at the top of the page.
						<br><br>
						Each action has the concept of a <code>source</code> and <code>destination</code> project. You can
						easily flip the relationship with this control that is displayed at the top of each page:
						<br>
						<div id="cross-project-actions__welcome-flipper"></div>
						<br><br>
						New cross-project actions are easy to add. If you have any ideas for other capabilities,
						please send us an email: ${emailLink()}
						<br><br>
						<a href="https://www.glyphrstudio.com/help/getting-started/working-with-multiple-projects.html" target="_blank">More help about working with multiple projects</a>
					</div>
				</div>
				<div id="cross-project-actions__page-footer">
				</div>
			</div>
		`,
	});

	// Set up projects
	const app = getGlyphrStudioApp();
	sourceEditor = app.otherProjectEditor;
	destinationEditor = app.selectedProjectEditor;

	// Set up window
	const closeButton = content.querySelector('#cross-project-actions__close-button');
	closeButton.addEventListener('click', () => {
		getCurrentProjectEditor().navigate();
	});

	// Make content
	let actionChooser = content.querySelector('#cross-project-actions__action-chooser');
	actionChooser.addEventListener('change', () => {
		updateCrossProjectActionsPage(content);
	});

	let flipperContent = content.querySelector('#cross-project-actions__welcome-flipper');
	flipperContent.appendChild(makeProjectFlipper());
	// updateCrossProjectActionsPage(content);
	return content;
}

/**
 * Refresh the Cross-project Actions page
 * @param {Element} content - page wrapper
 */
function updateCrossProjectActionsPage(content) {
	// log(`updateCrossProjectActionsPage`, 'start');
	let actionChooser = content.querySelector('#cross-project-actions__action-chooser');
	let selectedAction = actionChooser.getAttribute('selected-id');
	// log(`selectedAction: ${selectedAction}`);
	/** @type {HTMLElement} */
	let pageContent = content.querySelector('#cross-project-actions__page-content');
	let pageFooter = content.querySelector('#cross-project-actions__page-footer');

	pageContent.innerHTML = '';
	pageFooter.innerHTML = '';
	selectedItemIDs = [];
	selectedRange = false;
	if (selectedAction === 'Copy character or ligature shapes') {
		updateContent_copyShapes(pageContent);
		updateFooter_copyShapes(pageFooter);
	} else if (selectedAction === 'Overwrite characters or ligatures') {
		updateContent_overwriteItems(pageContent);
		updateFooter_overwriteItems(pageFooter);
	} else if (selectedAction === 'Add component roots') {
		updateContent_addComponents(pageContent);
		updateFooter_addComponents(pageFooter);
	} else if (selectedAction === 'Add kern groups') {
		updateContent_addKernGroups(pageContent);
		updateFooter_addKernGroups(pageFooter);
	} else if (selectedAction === 'Overwrite settings') {
		updateContent_overwriteSettings(pageContent);
		updateFooter_overwriteSettings(pageFooter);
	} else if (selectedAction === 'Merge two projects') {
		pageContent.innerHTML = 'Merge two projects';
	}
	// log(`updateCrossProjectActionsPage`, 'end');
}

/**
 * Control to switch source / destination projects
 * @param {String} textPrefix - label for the text
 * @returns {Element}
 */
export function makeProjectFlipper(textPrefix = 'From') {
	let sourceProject = sourceEditor.project.settings.project;
	let destinationProject = destinationEditor.project.settings.project;
	const wrapper = makeElement({
		tag: 'span',
		id: 'cross-project-actions__project-flipper',
		innerHTML: `
			${textPrefix} project
			<code id="project-flipper-source-name"
				title="${sourceProject.name}\n${sourceProject.id}">
				${sourceProject.name}
			</code>
			to
			<code id="project-flipper-destination-name"
				title="${destinationProject.name}\n${destinationProject.id}">
				${destinationProject.name}
			</code>
		`,
	});

	const flipButton = makeElement({
		className: 'flip-button',
		innerHTML: '⮀',
		title: 'Flip from/to projects',
		onClick: flipProjects,
	});
	wrapper.appendChild(flipButton);
	return wrapper;
}

/**
 * Switch source / destination projects
 */
function flipProjects() {
	let temp = sourceEditor;
	sourceEditor = destinationEditor;
	destinationEditor = temp;

	let welcomeFlipper = document.querySelector('#cross-project-actions__welcome-flipper');
	if (welcomeFlipper) {
		welcomeFlipper.innerHTML = '';
		welcomeFlipper.appendChild(makeProjectFlipper());
	} else {
		// @ts-expect-error 'property does exist'
		updateCrossProjectActionsPage(document);
	}
}

/**
 * Flip all checkboxes
 */
export function toggleCheckboxes() {
	/** @type {HTMLInputElement} */
	const checkbox = document.querySelector('#toggle-all-checkbox');
	let state = checkbox.checked;
	const checkboxes = document.querySelectorAll('.item-select-checkbox');
	checkboxes.forEach((/** @type {HTMLInputElement} */ box) => {
		box.checked = state;
		updateSelectedIDs(box.getAttribute('item-id'), box.checked);
	});
}

/**
 * Clear checkboxes
 */
export function clearAllSelections() {
	selectedItemIDs = [];
	document.querySelector('#cross-project-actions__item-count').innerHTML = '';
}

/**
 * Update the selected state of an item by ID
 * @param {String} itemID - ID for the item to update
 * @param {Boolean} add - should it be added or not
 */
export function updateSelectedIDs(itemID, add = true) {
	if (add) selectedItemIDs.push(itemID);
	else selectedItemIDs.splice(selectedItemIDs.indexOf(itemID), 1);
	selectedItemIDs = selectedItemIDs.filter(duplicates);
	selectedItemIDs = selectedItemIDs.filter((item) => !!item);
	document.querySelector('#cross-project-actions__item-count').innerHTML = `
		${selectedItemIDs.length} item${selectedItemIDs.length === 1 ? '' : 's'} selected
	`;
}

/**
 * Makes the Item and Range Chooser control
 * @param {Object} param0 - range chooser options
 * @param {Function} updateHandler - callback for when this range is selected
 * @returns {Element}
 */
export function makeItemAndRangeChooser(
	{ showLigatures = false, showComponents = false, showKernGroups = false },
	updateHandler
) {
	// log(`\n⮟sourceEditor⮟`);
	// log(sourceEditor);
	const project = sourceEditor.project;

	if (!selectedRange) selectedRange = sourceEditor.selectedCharacterRange;
	// log(selectedRange);
	let optionChooser = makeElement({
		tag: 'option-chooser',
		className: 'cross-project-actions__range-chooser',
		attributes: {
			'selected-name': selectedRange.name || selectedRange,
			'selected-id': selectedRange.id || selectedRange,
		},
	});

	let option;
	let addHR = false;

	if (showLigatures) {
		let ligatureCount = countItems(project.ligatures);
		if (ligatureCount) {
			// log(`range.name: Ligatures`);
			option = makeElement({
				tag: 'option',
				innerHTML: 'Ligatures',
				attributes: { note: `${ligatureCount}&nbsp;items` },
			});
			option.addEventListener('click', () => {
				selectedRange = 'Ligatures';
				updateHandler();
			});
			optionChooser.appendChild(option);
			addHR = true;
		}
	}

	if (showComponents) {
		let componentCount = countItems(project.components);
		if (componentCount) {
			// log(`range.name: Components`);
			option = makeElement({
				tag: 'option',
				innerHTML: 'Components',
				attributes: { note: `${componentCount}&nbsp;items` },
			});
			option.addEventListener('click', () => {
				selectedRange = 'Components';
				updateHandler();
			});
			optionChooser.appendChild(option);
			addHR = true;
		}
	}

	if (showKernGroups) {
		let kernCount = countItems(project.kerning);
		if (kernCount) {
			// log(`range.name: Kern groups`);
			option = makeElement({
				tag: 'option',
				innerHTML: 'Kern groups',
				attributes: { note: `${kernCount}&nbsp;items` },
			});
			option.addEventListener('click', () => {
				selectedRange = 'Kern groups';
				updateHandler();
			});
			optionChooser.appendChild(option);
			addHR = true;
		}
	}

	if (addHR) optionChooser.appendChild(makeElement({ tag: 'hr' }));

	let ranges = project.settings.project.characterRanges;
	// log(ranges);
	ranges.forEach((range) => {
		// log(`range.name: ${range.name}`);
		option = makeElement({
			tag: 'option',
			innerHTML: range.name,
			attributes: { note: range.note },
		});

		option.addEventListener('click', () => {
			selectedRange = range;
			let table = document.getElementById('cross-project-actions__character-action-table');
			updateCharacterCopyTable(table);
		});

		optionChooser.appendChild(option);
	});

	return optionChooser;
}
