import { getCurrentProjectEditor } from '../app/main';
import { makeElement } from '../common/dom';
import { makeToolButtonSVG } from '../edit_canvas/tools/tools';
import style from './pop-out-window.css?inline';
import color from '../common/colors.css?inline';
import reset from '../common/resets.css?inline';

export function openPopOutWindow() {
	log(`openPopOutWindow`, 'start');
	const editor = getCurrentProjectEditor();
	editor.popOutWindow = window.open('', 'glyphr-studio-pop-out-live-preview');

	// Init window properties
	let popDoc = editor.popOutWindow.document;
	popDoc.head.appendChild(makeElement({ tag: 'title', content: 'Live Preview - Glyphr Studio' }));

	const resets = makeElement({ tag: 'style', innerHTML: reset });
	popDoc.head.appendChild(resets);
	const colors = makeElement({ tag: 'style', innerHTML: color });
	popDoc.head.appendChild(colors);
	const styles = makeElement({ tag: 'style', innerHTML: style });
	popDoc.head.appendChild(styles);

	popDoc.body.appendChild(
		makeElement({
			tag: 'div',
			id: 'pop-out__wrapper',
		})
	);

	editor.popOutWindow.addEventListener('beforeunload', closePopOutWindow);
	window.addEventListener('beforeunload', closePopOutWindow);

	editor.subscribe({
		topic: '*',
		subscriberID: 'livePreviewPopOutWindow',
		callback: redrawPopOutWindow,
	});

	const popWrapper = popDoc.querySelector('#pop-out__wrapper');
	log(popWrapper);
	log(popWrapper.getClientRects()[0]);
	popWrapper.appendChild(
		makeElement({
			tag: 'display-canvas',
			attributes: {
				text: `the quick brown fox jumps over the lazy dog.
THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG.`,
			},
		})
	);

	// Update buttons
	const popButton = document.getElementById('editor-page__tool__open-live-preview-pop-out');
	if (popButton) {
		popButton.innerHTML = makeToolButtonSVG({
			name: 'closeLivePreview',
			selected: false,
		});
	}
	log(popDoc);
	// editor.popOutWindow.setTimeout(refreshPopOutWindow, 10);
	log(`openPopOutWindow`, 'end');
}

export function closePopOutWindow(event) {
	log(`closePopOutWindow`, 'start');

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

	log(`closePopOutWindow`, 'end');
	return undefined;
}

function redrawPopOutWindow() {
	const editor = getCurrentProjectEditor();
	const canvases = editor.popOutWindow.document.body.querySelectorAll('display-canvas');
	canvases.forEach((can) => can.redraw());
}
