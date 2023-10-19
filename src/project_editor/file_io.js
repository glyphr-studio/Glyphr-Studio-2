import { getCurrentProjectEditor } from '../app/main.js';

/**
 * Saves a file
 * @param {String} fileName - name for the saved file
 * @param {String} buffer - data for the file
 * @param {String} fileType - file suffix
 */
export function saveFile(fileName, buffer, fileType) {
	fileType = fileType || 'text/plain;charset=utf-8';
	const fileBlob = new Blob([buffer], { type: fileType, endings: 'native' });

	try {
		// IE
		window.navigator.msSaveBlob(fileBlob, fileName);
	} catch (err) {
		// Others
		const link = document.createElement('a');
		window.URL = window.URL || window.webkitURL;
		link.href = window.URL.createObjectURL(fileBlob);
		link.download = fileName;

		const event = new MouseEvent('click', {
			view: window,
			bubbles: true,
			cancelable: true,
		});
		link.dispatchEvent(event);
	}
}

/**
 * Generates a date suffix for file saves
 * @returns {String}
 */
export function makeFileDateString() {
	const d = new Date();
	const yr = d.getFullYear();
	const mo = d.getMonth() + 1;
	const day = d.getDate();
	const hr = d.getHours();
	const min = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
	const sec = (d.getSeconds() < 10 ? '0' : '') + d.getSeconds();

	return `${yr}.${mo}.${day}-${hr}.${min}.${sec}`;
}

// ---------------------------------------------------------------------
// Local Storage
// ---------------------------------------------------------------------

/**
 * Wrapper for window.localStorage.setItem
 * @param {String} key - storage key
 * @param {*} value - what to save
 */
export function localStorageSet(key, value) {
	key = 'GlyphrStudio_' + key;

	if (value.save) value = JSON.stringify(value.save());
	else if (typeof value != 'string') value = JSON.stringify(value);

	window.localStorage.setItem(key, value);
}

/**
 * Wrapper for window.localStorage.getItem
 * @param {String} key - key to look for
 * @returns {*}
 */
export function localStorageGet(key) {
	if (window.localStorage[key]) {
		return JSON.parse(window.localStorage.getItem(key));
	} else if (window.localStorage['GlyphrStudio_' + key]) {
		return JSON.parse(window.localStorage.getItem('GlyphrStudio_' + key));
	} else {
		return undefined;
	}
}

// --------------------------------------------------------------
// Fancy File open/save
// --------------------------------------------------------------

export async function open(UI) {
	if (window.showOpenFilePicker && window.showSaveFilePicker) {
		const pickerOptions = {
			types: [
				{
					description: 'Markdown',
					accept: { 'text/*': ['.md', '.txt'] },
				},
			],
			excludeAcceptAllOption: true,
			multiple: false,
		};

		const [fileHandle] = await window.showOpenFilePicker(pickerOptions);
		await updateCurrentFile(fileHandle, UI);
		log(UI.currentFile);
	} else {
		log('\t file open fallback');
		const fileInput = document.createElement('input');
		fileInput.setAttribute('type', 'file');
		fileInput.addEventListener('change', () => {
			const file = fileInput.files[0];
			const reader = new FileReader();
			reader.onload = (function (theFile) {
				return function () {
					UI.currentFile.text = reader.result;
					UI.currentFile.blob = theFile;
					UI.currentFile.handle = false;
					log(UI.currentFile);
				};
			})(file);
			reader.readAsText(file);
		});

		fileInput.click();
	}

	log('open - completed file');
}

export async function save(markdown, UI, fileHandle, callback = false) {
	log(`\n save${fileHandle ? '' : ' as'} - START`);

	if (window.showOpenFilePicker && window.showSaveFilePicker) {
		const isSaveAs = !fileHandle;

		const pickerOptions = {
			types: [
				{
					suggestedName: getDocumentName(),
					description: 'Markdown',
					accept: { 'text/*': ['.md', '.txt'] },
				},
			],
		};

		if (isSaveAs) fileHandle = await window.showSaveFilePicker(pickerOptions);

		const writable = await fileHandle.createWritable();
		await writable.write(markdown);
		await writable.close();
		await updateCurrentFile(fileHandle, UI);
		if (callback) callback();

		if (isSaveAs) {
			const docName = getDocumentName();
			document.getElementById('fileNameTitle').innerHTML = docName;
		}
	} else {
		log('\t file save fallback');
		const blob = new Blob([markdown], { type: 'text/plain;charset=utf-8', endings: 'native' });

		const link = document.createElement('a');
		window.URL = window.URL || window.webkitURL;
		link.href = window.URL.createObjectURL(blob);
		link.download = getDocumentName();
		link.click();
	}

	// setDocumentAsSaved();
}

function getDocumentName() {
	return getCurrentProjectEditor().project.settings.project.name;
}

async function updateCurrentFile(fileHandle, UI) {
	log('\n\nupdateCurrentFile');
	UI.currentFile.handle = fileHandle;
	log(UI.currentFile);
	UI.currentFile.blob = await UI.currentFile.handle.getFile();
	UI.currentFile.text = await UI.currentFile.blob.text();
}
