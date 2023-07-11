import { getCurrentProjectEditor } from '../app/main';
import { makeElement } from '../common/dom';
import { makeToolButtonSVG } from '../edit_canvas/tools/tools';
import style from './pop-out-window.css?inline';

export function openPopOutWindow() {
	log(`openPopOutWindow`, 'start');
	const editor = getCurrentProjectEditor();
	editor.popOutWindow = window.open('', 'glyphr-studio-pop-out-live-preview');
	const styles = makeElement({ tag: 'style', innerHTML: style });

	// Init window properties
	let popDoc = editor.popOutWindow.document;
	popDoc.head.appendChild(makeElement({ tag: 'title', content: 'Live Preview - Glyphr Studio' }));
	popDoc.head.appendChild(styles);
	popDoc.body.appendChild(
		makeElement({
			tag: 'div',
			id: 'pop-out__wrapper',
			innerHTML: `
				<h1>${editor.selectedItem.name}</h1>
				<display-canvas text="${editor.selectedItem.char}"></display-canvas>
			`,
		})
	);

	editor.subscribe({
		topic: '*',
		subscriberID: 'LivePreviewPopOutWindow',
		callback: refreshPopOutWindow,
	});

	// Update buttons
	const popButton = document.getElementById('editor-page__tool__open-live-preview-pop-out');
	if (popButton) {
		popButton.innerHTML = makeToolButtonSVG({
			name: 'closeLivePreview',
			selected: false,
		});
	}

	// refreshPopOutWindow();
	log(`openPopOutWindow`, 'end');
}

export function closePopOutWindow() {
	try {
		getCurrentProjectEditor().popOutWindow.close();
	} catch (e) {
		console.warn('Could not close pop-out window');
	}
	// Update buttons
	const popButton = document.getElementById('editor-page__tool__open-live-preview-pop-out');
	if (popButton) {
		popButton.innerHTML = makeToolButtonSVG({
			name: 'openLivePreview',
			selected: false,
		});
	}
}

// function asyncRefreshPopOutWindow() {
// 	window.requestAnimationFrame(refreshPopOutWindow);
// }

function refreshPopOutWindow() {
	log(`refreshPopOutWindow`, 'start');
	const editor = getCurrentProjectEditor();
	const popDoc = editor.popOutWindow.document;
	log(popDoc);

	// Clear old contents
	while (popDoc.body.firstChild) {
		popDoc.body.removeChild(popDoc.body.firstChild);
	}

	// Make new contents
	let wrapper = popDoc.body.querySelector('#pop-out__wrapper');
	let can = makeElement({
		tag: 'display-canvas',
		attributes: {
			text: editor.selectedItem.char,
		},
	});
	wrapper.innerHTML = `<h1>${editor.selectedItem.name}</h1>`;
	wrapper.appendChild(can);
	log(`refreshPopOutWindow`, 'end');
}
