import { getCurrentProjectEditor } from '../app/main';
import colorStyle from '../common/colors.css?inline';
import { addAsChildren, makeElement } from '../common/dom';
import resetStyle from '../common/resets.css?inline';
import { closeEveryTypeOfDialog, makeModalDialog, showToast } from '../controls/dialogs/dialogs';
import dialogStyle from '../controls/dialogs/dialogs.css?inline';
import { DisplayCanvas } from '../display_canvas/display_canvas';
import { TextBlockOptions } from '../display_canvas/text_block_options';
import { makeToolButtonSVG } from '../edit_canvas/tools/tools';
import { makePanel_LivePreview } from '../panels/live_preview';
import panelStyle from '../panels/panels.css?inline';
import popOutWindowStyle from './pop-out-window.css?inline';

export function openPopOutWindow() {
	// log(`openPopOutWindow`, 'start');
	const editor = getCurrentProjectEditor();
	editor.popOutWindow = window.open('', 'glyphr-studio-pop-out-live-preview');

	// Init window properties
	let popDoc = editor.popOutWindow.document;

	popDoc.head.appendChild(makeElement({ tag: 'title', content: 'Live Preview - Glyphr Studio' }));

	const resets = makeElement({ tag: 'style', innerHTML: resetStyle });
	popDoc.head.appendChild(resets);
	const colors = makeElement({ tag: 'style', innerHTML: colorStyle });
	popDoc.head.appendChild(colors);
	const popWindow = makeElement({ tag: 'style', innerHTML: popOutWindowStyle });
	popDoc.head.appendChild(popWindow);
	const dialogs = makeElement({ tag: 'style', innerHTML: dialogStyle });
	popDoc.head.appendChild(dialogs);
	const panels = makeElement({ tag: 'style', innerHTML: panelStyle });
	popDoc.head.appendChild(panels);

	popDoc.body.appendChild(
		makeElement({
			tag: 'div',
			id: 'pop-out__wrapper',
		})
	);

	editor.popOutWindow.addEventListener('beforeunload', closePopOutWindow);
	window.addEventListener('beforeunload', closePopOutWindow);
	editor.popOutWindow.addEventListener('resize', livePreviewPopOutWindowResize);

	editor.subscribe({
		topic: '*',
		subscriberID: 'livePreviewPopOutWindow',
		callback: redrawPopOutWindow,
	});

	let favIcon = makeElement({
		tag: 'link',
		attributes: { rel: 'shortcut icon', href: '../common/graphics/logo-icon-color.ico' },
	});

	popDoc.head.appendChild(favIcon);

	updatePopOutWindowContent();
	// log(`openPopOutWindow`, 'end');
}

export function updatePopOutWindowContent() {
	// log(`updatePopOutWindowContent`, 'start');
	const editor = getCurrentProjectEditor();
	let popDoc = editor.popOutWindow.document;
	const popWrapper = popDoc.querySelector('#pop-out__wrapper');
	popWrapper.innerHTML = '';
	// log(popWrapper);
	// log(popWrapper.getClientRects()[0]);

	editor.livePreviews.forEach((options, index) => {
		// index 0 is for the Live Previews Page
		// the rest are for the Pop Out Window
		if (index !== 0) {
			// log(`appending new display canvas`);
			// log(options);
			options.widthAdjustment = -20;
			popWrapper.appendChild(new DisplayCanvas(options));
		}
	});

	// Preview controls
	const footer = makeElement({ tag: 'div', className: 'pop-out__footer' });
	const editPreviewsButton = makeElement({
		tag: 'fancy-button',
		content: 'Edit live previews',
		attributes: { minimal: '' },
	});
	editPreviewsButton.addEventListener('click', showEditLivePreviewDialog);

	const addPreviewButton = makeElement({
		tag: 'fancy-button',
		content: 'Add a live preview',
		attributes: { minimal: '' },
	});
	addPreviewButton.addEventListener('click', () => {
		// log(`addPreviewButton ONCLICK`, 'start');
		let newPreview = new TextBlockOptions({ text: 'new live preview' });
		// log(`\n⮟newPreview⮟`);
		// log(newPreview);
		const editor = getCurrentProjectEditor();
		editor.livePreviews.push(newPreview);
		selectedLivePreview = editor.livePreviews.length - 1;
		updatePopOutWindowContent();
		showEditLivePreviewDialog();
		// log(`addPreviewButton ONCLICK`, 'end');
	});

	// addAsChildren(footer, [editPreviewsButton, addPreviewButton]);
	if (editor.livePreviews.length > 1) footer.appendChild(editPreviewsButton);
	footer.appendChild(addPreviewButton);
	popWrapper.appendChild(footer);

	// Update buttons
	const popButton = document.getElementById('editor-page__tool__open-live-preview-pop-out');
	if (popButton) {
		popButton.innerHTML = makeToolButtonSVG({
			name: 'closeLivePreview',
			selected: false,
		});
	}
	// log(popDoc);
	// editor.popOutWindow.setTimeout(refreshPopOutWindow, 10);
	// log(`updatePopOutWindowContent`, 'end');
}

export function closePopOutWindow(event) {
	// log(`closePopOutWindow`, 'start');

	if (event) event.preventDefault();
	const editor = getCurrentProjectEditor();

	try {
		editor.popOutWindow.close();
	} catch (e) {
		console.warn('Could not close pop-out window');
	}

	editor.popOutWindow = false;
	editor.unsubscribe({ idToRemove: 'livePreviewPopOutWindow' });
	window.removeEventListener('beforeunload', closePopOutWindow);

	// Update buttons
	const popButton = document.getElementById('editor-page__tool__open-live-preview-pop-out');
	if (popButton) {
		popButton.innerHTML = makeToolButtonSVG({
			name: 'openLivePreview',
			selected: false,
		});
	}

	// log(`closePopOutWindow`, 'end');
	return undefined;
}

function redrawPopOutWindow() {
	const editor = getCurrentProjectEditor();
	const canvases = editor.popOutWindow.document.body.querySelectorAll('display-canvas');
	canvases.forEach((can) => can.redraw());
}

export function makeLivePreviewPopOutCard(showBlurb = false) {
	const card = makeElement({
		tag: 'div',
		className: 'panel__card full-width',
		innerHTML: '<h3>Pop out live preview</h3>',
	});
	if (showBlurb) {
		card.innerHTML += `
			A full-screen live preview can be launched in a new window,
			useful for sentence or paragraph scale previews of your typeface.`;
	}
	const button = makeElement({
		tag: 'fancy-button',
		attributes: { secondary: '' },
		content: 'Launch live preview in a new window',
	});
	// button.innerHTML += makeToolButtonSVG({ name: 'openLivePreview' });
	button.addEventListener('click', openPopOutWindow);
	card.appendChild(button);

	return card;
}

export function livePreviewPopOutWindowResize() {
	// log(`livePreviewPopOutWindowResize`, 'start');
	const editor = getCurrentProjectEditor();
	let popDoc = editor.popOutWindow.document;
	const allDisplayCanvases = popDoc.querySelectorAll('display-canvas');
	// log(allDisplayCanvases);
	allDisplayCanvases.forEach((displayCanvas) => {
		// log(`displayCanvas.options.name: ${displayCanvas.getAttribute('title')}`);
		displayCanvas.resizeAndRedraw(-50);
	});
	// log(`livePreviewPopOutWindowResize`, 'end');
}

// --------------------------------------------------------------
// Pop out window options dialog
// --------------------------------------------------------------

let selectedLivePreview = 1;
function showEditLivePreviewDialog() {
	// log(`showEditLivePreviewDialog`, 'start');
	const editor = getCurrentProjectEditor();
	const popDoc = editor.popOutWindow.document;
	let panelArea = makeElement({ tag: 'div', id: 'content-page__panel' });
	let header = makeElement({ tag: 'h1', content: 'Live Preview options' });
	// log(`selectedLivePreview: ${selectedLivePreview}`);
	// log(`\n⮟editor.livePreviews⮟`);
	// log(editor.livePreviews);
	let selected = editor.livePreviews[selectedLivePreview];
	// log(`\n⮟selected⮟`);
	// log(selected);
	let previewChooser = makeElement({
		tag: 'option-chooser',
		attributes: {
			'selected-name': `${selectedLivePreview}: ${selected.displayName}`,
			'selected-id': `${selectedLivePreview}: ${selected.displayName} ${selected.fontSize}px`,
		},
	});

	for (let i = 1; i < editor.livePreviews.length; i++) {
		let preview = editor.livePreviews[i];
		let option = makeElement({
			tag: 'option',
			innerHTML: `${i}: ${preview.displayName}`,
			attributes: { note: `${preview.fontSize}px` },
		});

		option.addEventListener('click', () => {
			selectedLivePreview = i;
			closeEveryTypeOfDialog();
			showEditLivePreviewDialog();
		});

		previewChooser.appendChild(option);
	}

	let saveButton = makeElement({ tag: 'fancy-button', content: 'Save' });
	saveButton.addEventListener('click', closeEveryTypeOfDialog);

	let deleteButton = makeElement({
		tag: 'fancy-button',
		content: 'Delete',
		attributes: { danger: '' },
	});
	deleteButton.addEventListener('click', () => {
		const previews = getCurrentProjectEditor().livePreviews;
		let name = previews[selectedLivePreview].displayName;
		previews.splice(selectedLivePreview, 1);
		if (selectedLivePreview >= previews.length) selectedLivePreview = previews.length - 1;
		closeEveryTypeOfDialog();
		updatePopOutWindowContent();
		if (previews.length > 1) showEditLivePreviewDialog();
		showToast(`Deleted live preview<br>${name}`);
	});

	let commitButtons = makeElement();
	addAsChildren(commitButtons, [saveButton, deleteButton]);

	let previewSelectorCard = makeElement({
		tag: 'div',
		className: 'panel__card no-card',
		innerHTML: `<h3>Edit live preview:</h3>`,
	});
	addAsChildren(previewSelectorCard, [previewChooser, commitButtons]);

	addAsChildren(panelArea, [
		header,
		previewSelectorCard,
		makePanel_LivePreview(editor.livePreviews[selectedLivePreview], false),
	]);

	let diag = makeModalDialog(panelArea, 500);
	popDoc.body.appendChild(diag);
	// log(`showEditLivePreviewDialog`, 'end');
}
