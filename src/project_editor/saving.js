// --------------------------------------------------------------
// File Saver
// --------------------------------------------------------------

/**
 * Saves a file
 * @param {string} fileName - name for the saved file
 * @param {string} buffer - data for the file
 * @param {string} fileType - file suffix
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
		// link.onclick = ("alert("+window.URL.createObjectURL(fileBlob)+");");
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
 * @returns {string}
 */
export function makeDateStampSuffix() {
	const d = new Date();
	const yr = d.getFullYear();
	const mo = d.getMonth() + 1;
	const day = d.getDate();
	const hr = d.getHours();
	const min = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
	const sec = (d.getSeconds() < 10 ? '0' : '') + d.getSeconds();

	return '' + yr + '.' + mo + '.' + day + '-' + hr + '.' + min + '.' + sec;
}

// ---------------------------------------------------------------------
// Local Storage
// ---------------------------------------------------------------------

/**
 * Wrapper for window.localStorage.setItem
 * @param {string} key - storage key
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
 * @param {string} key - key to look for
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