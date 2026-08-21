import { getCurrentProject, getCurrentProjectEditor } from '../app/main.js';
import { editorText } from '../app/editor_i18n.js';
import { addAsChildren, makeElement, textToNode } from '../common/dom.js';
import { makeFancySlider } from '../controls/fancy-slider/fancy_slider.js';
import {
	closeAllInfoBubbles,
	closeEveryTypeOfDialog,
	makeGlassButton,
	showGlassConfirm,
	showGlassModal,
	showToast,
} from '../controls/dialogs/dialogs.js';
import { EditCanvas } from '../edit_canvas/edit_canvas.js';
import { removeStopCreatingNewPathButton } from '../edit_canvas/tools/new_path.js';
import { makeEditToolsButtons, makeViewToolsButtons } from '../edit_canvas/tools/tools.js';
import { makePanel, refreshPanel } from '../panels/panels.js';
import {
	makeNextFeatureTag,
	makeStylisticSetID,
	StylisticSet,
} from '../project_data/stylistic_set.js';
import {
	makeVariableAxisID,
	sanitizeAxisTag,
	STANDARD_AXIS_TYPES,
	VariableAxis,
} from '../project_data/variable_axis.js';
import { makeSingleItemTypeChooserContent } from '../panels/item_chooser.js';
import { Glyph } from '../project_data/glyph.js';

/**
 * Page > Variable & Stylistic sets
 * Design-space metadata for the font: variable axes and stylistic sets.
 *
 * Axis values are stored and previewed here, but they do not deform
 * glyph outlines yet - see the note in the page intro.
 * @returns {Element} - page content
 */
export function makePage_VariableSets() {
	const editor = getCurrentProjectEditor();
	if (
		editor.variableSetsView === 'alternate' &&
		editor.selectedAlternateID &&
		editor.selectedAlternate
	) {
		return makeAlternateEditor(editor);
	}
	editor.variableSetsView = 'overview';

	const content = makeElement({
		tag: 'div',
		id: 'app__page',
		innerHTML: `
			<div class="variable-sets__page">
				<header class="variable-sets__header">
					<h1>${editorText('variableSets')}</h1>
					<p>${editorText('variableSetsBody')}</p>
				</header>
				<section class="variable-sets__section liquid-glass" id="variable-sets__axes"></section>
				<section class="variable-sets__section liquid-glass" id="variable-sets__sets"></section>
			</div>
		`,
	});

	refreshAxesSection(content.querySelector('#variable-sets__axes'));
	refreshSetsSection(content.querySelector('#variable-sets__sets'));

	return content;
}

function makeAlternateEditor(editor) {
	const project = getCurrentProject();
	const alternate = editor.selectedAlternate;
	const set = project.stylisticSets[editor.selectedStylisticSetID];
	const baseName = set ? project.getItemName(set.baseItemID, true) : editorText('character');
	const content = makeElement({
		tag: 'div',
		id: 'app__page',
		innerHTML: `
			<div class="editor__page">
				<div class="editor-page__context-bar liquid-glass">
					<button type="button" class="editor-page__back-button" aria-label="${editorText(
						'backToVariableSets'
					)}">&#8592;<span>${editorText('backToVariableSets')}</span></button>
					<div class="editor-page__context-copy">
						<span>${editorText('editAlternate')}</span>
						<strong>${baseName} · ${set?.feature || ''} · ${alternate.name}</strong>
					</div>
				</div>
				<div class="editor-page__left-area">
					<h2 class="editor-page__panel-title">${editorText('properties')}</h2>
					<div id="editor-page__panel"></div>
				</div>
				<div class="editor-page__tools-area"></div>
				<div class="editor-page__edit-canvas-wrapper">
					<edit-canvas id="editor-page__edit-canvas" editing-item-id="${alternate.id}"></edit-canvas>
				</div>
				<div class="editor-page__zoom-area"></div>
			</div>`,
	});

	if (editor.showPageTransitions) content.classList.add('app__page-animation');
	content.querySelector('.editor-page__back-button').addEventListener('click', () => {
		editor.variableSetsView = 'overview';
		editor.selectedAlternateID = false;
		editor.selectedStylisticSetID = false;
		editor.navigate();
	});

	const panel = content.querySelector('#editor-page__panel');
	panel.appendChild(makePanel());
	panel.addEventListener('scroll', closeAllInfoBubbles);
	editor.subscribe({
		topic: ['whichAlternateIsSelected', 'whichShapeIsSelected'],
		subscriberID: 'alternate.panel',
		callback: () => refreshPanel(),
	});

	if (editor.selectedTool === 'kern') editor.selectedTool = 'resize';
	addAsChildren(content.querySelector('.editor-page__tools-area'), makeEditToolsButtons());
	addAsChildren(content.querySelector('.editor-page__zoom-area'), makeViewToolsButtons());

	editor.subscribe({
		topic: 'whichAlternateIsSelected',
		subscriberID: 'alternate.editCanvas',
		callback: (alternateID) => {
			removeStopCreatingNewPathButton();
			content
				.querySelector('#editor-page__edit-canvas')
				.setAttribute('editing-item-id', alternateID);
		},
	});

	['whichShapeIsSelected', 'whichPathPointIsSelected', 'qualityChecks'].forEach((topic) => {
		editor.subscribe({
			topic,
			subscriberID: `alternate.editCanvas.${topic}`,
			callback: () => {
				/** @type {EditCanvas} */
				const canvas = editor.editCanvas;
				if (canvas?.redraw) canvas.redraw(`subscription:${topic}`);
			},
		});
	});

	return content;
}

// --------------------------------------------------------------
// Variable axes
// --------------------------------------------------------------

/**
 * Rebuilds the variable axes section in place.
 * @param {Element} section - section element to fill
 */
function refreshAxesSection(section) {
	if (!section) return;
	const project = getCurrentProject();
	section.replaceChildren();

	const header = makeElement({ className: 'variable-sets__section-header' });
	header.appendChild(textToNode(`<h2>${editorText('variableAxes')}</h2>`));

	const headerActions = makeElement({ className: 'variable-sets__section-header-actions' });
	headerActions.appendChild(makeGlassButton(editorText('editCharacters'), navigateToCharacters));
	headerActions.appendChild(
		makeGlassButton(editorText('addAxis'), () => showAddAxisModal(section), true)
	);
	header.appendChild(headerActions);
	section.appendChild(header);
	section.appendChild(
		textToNode(`<p class="variable-sets__hint">${editorText('editCharactersBody')}</p>`)
	);

	const axisIDs = Object.keys(project.variableAxes);
	if (!axisIDs.length) {
		section.appendChild(
			textToNode(`<p class="variable-sets__empty">${editorText('noVariableAxes')}</p>`)
		);
		return;
	}

	const list = makeElement({ className: 'variable-sets__axis-list' });
	axisIDs.forEach((axisID) => {
		list.appendChild(makeAxisRow(axisID, project.variableAxes[axisID], section));
	});
	section.appendChild(list);
}

/**
 * Sends the user to the Characters overview page so they can draw or edit
 * the outlines that a variable axis interpolates between.
 */
function navigateToCharacters() {
	const editor = getCurrentProjectEditor();
	editor.characterView = 'overview';
	editor.nav.page = 'Characters';
	editor.navigate();
}

/**
 * Makes one editable axis row - tag, name, min/default/max, and a slider.
 * @param {String} axisID - project key for this axis
 * @param {VariableAxis} axis - the axis
 * @param {Element} section - parent section, for refreshes
 * @returns {Element}
 */
function makeAxisRow(axisID, axis, section) {
	const editor = getCurrentProjectEditor();
	const row = makeElement({ className: 'variable-sets__axis-row' });

	const title = makeElement({ className: 'variable-sets__axis-title' });
	title.innerHTML = `<strong>${axis.name}</strong><code>${axis.tag}</code>`;

	const removeButton = makeGlassButton(editorText('remove'), () => {
		showGlassConfirm({
			title: editorText('removeAxisTitle'),
			message: editorText('removeAxisBody'),
			confirmLabel: editorText('removeAxis'),
			onConfirm: () => {
				editor.history.addWholeProjectChangePreState(`Removed variable axis: ${axis.name}`);
				delete getCurrentProject().variableAxes[axisID];
				editor.history.addWholeProjectChangePostState();
				refreshAxesSection(section);
				showToast(`Removed variable axis:<br>${axis.name}`);
			},
		});
	});
	title.appendChild(removeButton);
	row.appendChild(title);

	// Numeric range inputs
	const numbers = makeElement({ className: 'variable-sets__axis-numbers' });
	const sliderHost = makeElement({ className: 'variable-sets__axis-slider' });
	let sliderChangeOpen = false;

	/**
	 * Rebuilds the slider so its min/max track the numeric inputs.
	 */
	const rebuildSlider = () => {
		sliderHost.replaceChildren();
		sliderHost.appendChild(
			makeFancySlider(
				axis.clamp(axis.value),
				(value) => {
					if (!sliderChangeOpen) {
						editor.history.addWholeProjectChangePreState(
							`Changed variable axis value: ${axis.name}`
						);
						sliderChangeOpen = true;
					}
					axis.value = axis.clamp(value);
				},
				axis.min,
				axis.max,
				1,
				() => {
					if (!sliderChangeOpen) return;
					editor.history.addWholeProjectChangePostState();
					sliderChangeOpen = false;
				}
			)
		);
	};

	[
		{ key: 'min', label: editorText('min') },
		{ key: 'defaultValue', label: editorText('defaultValue') },
		{ key: 'max', label: editorText('max') },
	].forEach(({ key, label }) => {
		const field = makeElement({ tag: 'label', className: 'variable-sets__field' });
		field.appendChild(makeElement({ tag: 'span', content: label }));
		const input = /** @type {HTMLInputElement} */ (
			makeElement({ tag: 'input', attributes: { type: 'number', step: '1' } })
		);
		input.value = String(axis[key]);
		input.addEventListener('change', () => {
			const value = Number(input.value);
			if (!isFinite(value)) {
				input.value = String(axis[key]);
				return;
			}
			editor.history.addWholeProjectChangePreState(`Changed variable axis: ${axis.name}`);
			axis[key] = value;
			if (axis.min > axis.max) {
				const swap = axis.min;
				axis.min = axis.max;
				axis.max = swap;
			}
			axis.defaultValue = axis.clamp(axis.defaultValue);
			axis.value = axis.clamp(axis.value);
			rebuildSlider();
			editor.history.addWholeProjectChangePostState();
		});
		field.appendChild(input);
		numbers.appendChild(field);
	});

	row.appendChild(numbers);
	rebuildSlider();
	row.appendChild(sliderHost);

	return row;
}

/**
 * Modal for adding a new variable axis.
 * @param {Element} section - axes section to refresh afterwards
 */
function showAddAxisModal(section) {
	const project = getCurrentProject();
	const editor = getCurrentProjectEditor();

	const form = makeElement({ className: 'variable-sets__form' });

	const typeField = makeElement({ tag: 'label', className: 'variable-sets__field' });
	typeField.appendChild(makeElement({ tag: 'span', content: editorText('axisType') }));
	const typeSelect = /** @type {HTMLSelectElement} */ (makeElement({ tag: 'select' }));
	STANDARD_AXIS_TYPES.forEach((type, index) => {
		const option = makeElement({
			tag: 'option',
			content: type.custom && type.name === 'Custom' ? 'Custom…' : `${type.name} (${type.tag})`,
		});
		option.setAttribute('value', String(index));
		typeSelect.appendChild(option);
	});
	typeField.appendChild(typeSelect);
	form.appendChild(typeField);

	const nameField = makeElement({ tag: 'label', className: 'variable-sets__field' });
	nameField.appendChild(makeElement({ tag: 'span', content: editorText('axisName') }));
	const nameInput = /** @type {HTMLInputElement} */ (
		makeElement({ tag: 'input', attributes: { type: 'text' } })
	);
	nameField.appendChild(nameInput);
	form.appendChild(nameField);

	const tagField = makeElement({ tag: 'label', className: 'variable-sets__field' });
	tagField.appendChild(makeElement({ tag: 'span', content: editorText('axisTag') }));
	const tagInput = /** @type {HTMLInputElement} */ (
		makeElement({ tag: 'input', attributes: { type: 'text', maxlength: '4' } })
	);
	tagField.appendChild(tagInput);
	form.appendChild(tagField);

	const rangeRow = makeElement({ className: 'variable-sets__axis-numbers' });
	const rangeInputs = {};
	[
		{ key: 'min', label: editorText('min') },
		{ key: 'default', label: editorText('defaultValue') },
		{ key: 'max', label: editorText('max') },
	].forEach(({ key, label }) => {
		const field = makeElement({ tag: 'label', className: 'variable-sets__field' });
		field.appendChild(makeElement({ tag: 'span', content: label }));
		const input = /** @type {HTMLInputElement} */ (
			makeElement({ tag: 'input', attributes: { type: 'number', step: '1' } })
		);
		rangeInputs[key] = input;
		field.appendChild(input);
		rangeRow.appendChild(field);
	});
	form.appendChild(rangeRow);

	const applyType = () => {
		const type = STANDARD_AXIS_TYPES[Number(typeSelect.value)];
		const isCustom = type.name === 'Custom';
		nameInput.value = isCustom ? '' : type.name;
		tagInput.value = isCustom ? '' : type.tag;
		tagInput.disabled = !type.custom;
		rangeInputs.min.value = String(type.min);
		rangeInputs.default.value = String(type.default);
		rangeInputs.max.value = String(type.max);
	};
	typeSelect.addEventListener('change', applyType);
	typeSelect.value = '0';
	applyType();

	const layer = showGlassModal({
		title: editorText('addVariableAxis'),
		description: editorText('addVariableAxisBody'),
		bodyNode: form,
		componentName: 'variable-axis-add',
		maxWidth: 520,
		actions: [
			makeGlassButton(editorText('cancel'), () => closeEveryTypeOfDialog()),
			makeGlassButton(
				editorText('addAxis'),
				() => {
					const name = nameInput.value.trim() || 'Custom axis';
					const tag = sanitizeAxisTag(tagInput.value || 'CSTM');
					const axis = new VariableAxis({
						tag: tag,
						name: name,
						min: Number(rangeInputs.min.value),
						max: Number(rangeInputs.max.value),
						defaultValue: Number(rangeInputs.default.value),
					});
					if (axis.min > axis.max) {
						const swap = axis.min;
						axis.min = axis.max;
						axis.max = swap;
					}
					axis.defaultValue = axis.clamp(axis.defaultValue);
					axis.value = axis.defaultValue;

					const axisID = makeVariableAxisID(project.variableAxes, axis.tag);
					editor.history.addWholeProjectChangePreState(`Added variable axis: ${axis.name}`);
					project.variableAxes[axisID] = axis;
					editor.history.addWholeProjectChangePostState();

					closeEveryTypeOfDialog();
					refreshAxesSection(section);
					showToast(`Added variable axis:<br>${axis.name}`);
				},
				true
			),
		],
	});
	return layer;
}

// --------------------------------------------------------------
// Stylistic sets
// --------------------------------------------------------------

/**
 * Rebuilds the stylistic sets section in place.
 * @param {Element} section - section element to fill
 */
function refreshSetsSection(section) {
	if (!section) return;
	const project = getCurrentProject();
	section.replaceChildren();

	const header = makeElement({ className: 'variable-sets__section-header' });
	header.appendChild(textToNode(`<h2>${editorText('stylisticSets')}</h2>`));
	header.appendChild(
		makeGlassButton(editorText('addStylisticSet'), () => showAddStylisticSetModal(section), true)
	);
	section.appendChild(header);

	const setIDs = Object.keys(project.stylisticSets);
	if (!setIDs.length) {
		section.appendChild(
			textToNode(`<p class="variable-sets__empty">${editorText('noStylisticSets')}</p>`)
		);
		return;
	}

	const list = makeElement({ className: 'variable-sets__set-list' });
	setIDs.forEach((setID) => {
		list.appendChild(makeStylisticSetRow(setID, project.stylisticSets[setID], section));
	});
	section.appendChild(list);
}

/**
 * Makes one stylistic set row - base character plus its alternates list.
 * @param {String} setID - project key for this set
 * @param {StylisticSet} set - the stylistic set
 * @param {Element} section - parent section, for refreshes
 * @returns {Element}
 */
function makeStylisticSetRow(setID, set, section) {
	const project = getCurrentProject();
	const editor = getCurrentProjectEditor();
	const row = makeElement({ className: 'variable-sets__set-row' });

	const title = makeElement({ className: 'variable-sets__set-title' });
	const baseName = project.getItemName(set.baseItemID, true) || set.baseItemID;
	title.innerHTML = `<strong>${set.name || baseName}</strong><code>${set.feature}</code>
		<span class="variable-sets__set-base">${editorText('base')}: ${baseName}</span>`;

	title.appendChild(
		makeGlassButton(editorText('removeSet'), () => {
			showGlassConfirm({
				title: editorText('removeSetTitle'),
				message: editorText('removeSetBody'),
				confirmLabel: editorText('removeSet'),
				onConfirm: () => {
					editor.history.addWholeProjectChangePreState(`Removed stylistic set: ${set.feature}`);
					delete getCurrentProject().stylisticSets[setID];
					editor.history.addWholeProjectChangePostState();
					refreshSetsSection(section);
					showToast(`Removed stylistic set:<br>${set.feature}`);
				},
			});
		})
	);
	row.appendChild(title);

	const alternates = makeElement({ className: 'variable-sets__alternates' });
	if (!set.alternates.length) {
		alternates.appendChild(
			textToNode(`<p class="variable-sets__empty">${editorText('noAlternates')}</p>`)
		);
	}
	set.alternates.forEach((alternateID, index) => {
		const entry = makeElement({ className: 'variable-sets__alternate' });
		entry.appendChild(
			makeElement({
				tag: 'span',
				content: `${index + 1}. ${project.getItemName(alternateID, true) || alternateID}`,
			})
		);
		entry.appendChild(
			makeGlassButton(editorText('edit'), () => {
				editor.variableSetsView = 'alternate';
				editor.selectedStylisticSetID = setID;
				editor.selectedAlternateID = alternateID;
				editor.navigate();
			})
		);
		entry.appendChild(
			makeGlassButton(editorText('remove'), () => {
				editor.history.addWholeProjectChangePreState(`Removed alternate from ${set.feature}`);
				set.alternates.splice(index, 1);
				editor.history.addWholeProjectChangePostState();
				refreshSetsSection(section);
			})
		);
		alternates.appendChild(entry);
	});

	alternates.appendChild(
		makeGlassButton(editorText('addAlternate'), () => {
			addAlternateToSet(set, section);
		})
	);

	row.appendChild(alternates);
	return row;
}

/**
 * Creates a new alternate Glyph for a set and stores a reference to it.
 * The alternate is a regular Glyph in the project's dedicated alternates
 * collection, separate from Characters and Components.
 * @param {StylisticSet} set - the set to add to
 * @param {Element} section - sets section to refresh
 */
function addAlternateToSet(set, section) {
	const project = getCurrentProject();
	const editor = getCurrentProjectEditor();
	const baseItem = project.getItem(set.baseItemID);

	const alternateID = makeAlternateID(project, set);
	const alternateName = `${project.getItemName(set.baseItemID, true)} alt ${
		set.alternates.length + 1
	}`;

	editor.history.addWholeProjectChangePreState(`Added alternate to ${set.feature}`);
	// Alternates start with the base character's spacing but no outlines.
	// This keeps the alternate intentionally blank until it is designed.
	const alternate = new Glyph({
		id: alternateID,
		parent: project,
		objType: 'Alternate',
		name: alternateName,
		advanceWidth: baseItem?.advanceWidth || project.defaultAdvanceWidth,
		shapes: [],
	});
	project.alternates[alternateID] = alternate;
	set.alternates.push(alternateID);
	editor.history.addWholeProjectChangePostState();

	refreshSetsSection(section);
	showToast(`Created alternate:<br>${alternateName}`);
}

/**
 * Makes a unique ID for a stylistic alternate.
 * @param {Object} project - current project
 * @param {StylisticSet} set - the owning set
 * @returns {String}
 */
function makeAlternateID(project, set) {
	let counter = 1;
	while (project.alternates[`alt-${set.feature}-${counter}`]) counter++;
	return `alt-${set.feature}-${counter}`;
}

/**
 * Modal for adding a stylistic set - pick a base character first.
 * @param {Element} section - sets section to refresh afterwards
 */
function showAddStylisticSetModal(section) {
	const project = getCurrentProject();
	const editor = getCurrentProjectEditor();

	const chooserHost = makeElement({ className: 'variable-sets__chooser' });
	chooserHost.appendChild(
		makeSingleItemTypeChooserContent('Characters', (itemID) => {
			const feature = makeNextFeatureTag(project.stylisticSets);
			const set = new StylisticSet({
				name: `${project.getItemName(itemID, true)} alternates`,
				baseItemID: itemID,
				feature: feature,
			});
			const setID = makeStylisticSetID(project.stylisticSets);

			editor.history.addWholeProjectChangePreState(`Added stylistic set: ${feature}`);
			project.stylisticSets[setID] = set;
			editor.history.addWholeProjectChangePostState();

			closeEveryTypeOfDialog();
			refreshSetsSection(section);
			showToast(`Added stylistic set:<br>${feature}`);
		})
	);

	return showGlassModal({
		title: editorText('addStylisticSet'),
		description: editorText('addStylisticSetBody'),
		bodyNode: chooserHost,
		componentName: 'stylistic-set-add',
		maxWidth: 720,
	});
}
