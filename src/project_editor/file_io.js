import { getCurrentProject, getCurrentProjectEditor } from '../app/main.js';

/**
 * If this browser is capable of directly saving to a file using the
 * window's showSaveFilePicker, then it does that. Otherwise, it falls
 * back to downloading the file to the browser's downloads folder
 * @param {String} fileSuffix - 'gs2' or 'svg'
 * @param {String} fileContent - Text content of the file
 */
export async function saveTextFile(fileSuffix, fileContent, saveAsCopy = false) {
	if (isFancyFileIOEnabled()) {
		let fileHandle = getCurrentProjectEditor().loadedFilehandle;
		if (saveAsCopy) fileHandle = false;
		await saveTextFileDirectly(fileSuffix, fileContent, fileHandle);
	} else {
		saveTextFileAsDownload(fileSuffix, fileContent);
	}
}

/**
 * Saves a file as a browser download
 * @param {String} fileSuffix - name for the saved file
 * @param {String} fileContent - data for the file
 */
function saveTextFileAsDownload(fileSuffix, fileContent) {
	const fileType = 'text/plain;charset=utf-8';
	const fileBlob = new Blob([fileContent], { type: fileType, endings: 'native' });
	let fileName = makeFileName(fileSuffix, true);
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

// --------------------------------------------------------------
// Fancy File open/save
// --------------------------------------------------------------

export function isFancyFileIOEnabled() {
	return window.showOpenFilePicker && window.showSaveFilePicker;
}

/**
 * Saves a text file directly to an existing file, or prompts for 'save as' if no
 * current file handle exists.
 * @param {String} fileSuffix - 'gs2' or 'svg'
 * @param {String} fileContent - text content to save
 * @param {Object} fileHandle - reference to the existing file, or 'false' for 'save as'
 */
async function saveTextFileDirectly(fileSuffix, fileContent, fileHandle = false) {
	// log(`saveTextFileDirectly`, 'start');
	const isSaveAs = !fileHandle;
	// log(`isSaveAs: ${isSaveAs}`);
	let fileName = makeFileName(fileSuffix);
	const pickerOptions = {
		suggestedName: fileName,
		types: [
			{
				description: 'Glyphr Studio Project file',
				accept: { 'application/json': ['.gs2'] },
			},
		],
	};

	if (isSaveAs) fileHandle = await window.showSaveFilePicker(pickerOptions);

	const writable = await fileHandle.createWritable();
	await writable.write(fileContent);
	await writable.close();
	const editor = getCurrentProjectEditor();
	editor.loadedFileHandle = fileHandle;

	// log(`saveTextFileDirectly`, 'end');
}

function getDocumentName() {
	const projectName = getCurrentProjectEditor().project.settings.project.name;
	return `${projectName} - Glyphr Studio Project.gs2`;
}

export async function open(UI) {
	if (isFancyFileIOEnabled()) {
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
		// await updateEditorLoadedFile(fileHandle, UI);
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

// --------------------------------------------------------------
// Naming helpers
// --------------------------------------------------------------

/**
 * Creates a file name based on the project name, the type of file,
 * and the type of download
 * @param {String} suffix - 'gs2' or 'svg'
 * @param {Boolean} includeDateString - add a unique date stamp to the file name
 * @returns {String} - appropriate file name
 */
export function makeFileName(suffix, includeDateString = false) {
	const project = getCurrentProject();
	let fileName = project.settings.project.name;

	if (suffix === 'gs2') {
		fileName += ' - Glyphr Studio Project';
		if (includeDateString) fileName += ` - ${makeFileDateString()}`;
	} else if (suffix === 'svg') {
		fileName += ` - SVG Font - ${makeFileDateString()}`;
	}

	fileName += `.${suffix}`;

	return fileName;
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
