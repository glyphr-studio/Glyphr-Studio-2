import { makeElement } from '../common/dom.js';
import { ioFont_importFont } from '../formats_io/otf/font_import.js';
import { fetchFont } from '../formats_io/fetch_font.js';
import { cancelDefaultEventActions } from '../edit_canvas/events.js';

/**
 * Page > Open Project
 * The first page you see when you open Glyphr Studio.
 */
let isSecondProject;

/**
 * Page maker when a font is not found
 * @returns {Element}
 */
export function makeFontIdNotFoundPage() {
	const content = makeElement({
		tag: 'div',
		id: 'fontIdNotFound__page',
		innerHTML: `
			<h1>Font ID not found</h1>
		`,
		style: `
			display: flex;
			align-items: center;
			justify-content: center;
			height: 100%;
		`
	});

	return content;
}

/**
 * Page maker when project is loading a font
 * @returns {Element}
 */
export function makeLoadingFontPage() {
	const content = makeElement({
		tag: 'div',
		id: 'fontLoader__page',
		innerHTML: `
			<div id='fontLoader__pageContainer'>
				<span id='loader'></span>
				<h1>Loading font</h1>
			</div>
		`,
		style: `
			display: flex;
			align-items: center;
			justify-content: center;
			height: 100%;
		`
	});

	return content;
}

/**
 * Loads font based on the font id in the URL
 */
export async function loadFont() {
	const url = new URL(window.location.href);
	const params = new URLSearchParams(url.search);
	const fontId = params.get('id')
	if(!fontId) throw new Error("No font id found in url");

	const font = await fetchFont(fontId)
	ioFont_importFont(font);
}

/**
 * Checks if URL has a font id
 */
export function hasFontId() {
	const url = new URL(window.location.href);
	const params = new URLSearchParams(url.search);
	return params.has('id')
}

/**
 * Shows an OS File Picker, then returns the selected files
 * to a provided callback function.
 * @param {Function} callback - what to do with the files
 * @param {Object} pickerOptions - OS File Picker Options Object
 */
export async function getFilesFromFilePicker(callback, pickerOptions = {}) {
	/** @ts-ignore */
	if (window.showOpenFilePicker) {
		/** @ts-ignore */
		const files = await window.showOpenFilePicker(pickerOptions);
		callback(files);
	} else {
		// showError(`Can't open OS File Picker. Try dragging and dropping a file instead.`);
		/** @type {any} */
		const fallbackFileChooser = makeElement({ tag: 'input', attributes: { type: 'file' } });
		fallbackFileChooser.addEventListener('change', (event) => {
			// log(fallbackFileChooser.files);
			cancelDefaultEventActions(event);
			callback(fallbackFileChooser.files);
		});
		fallbackFileChooser.click();
	}
}