import { getCurrentProjectEditor } from '../app/main.js';
import { addAsChildren, makeElement } from '../common/dom.js';
import { makeChooserContent_Glyphs, makeChooserContent_Pages, makeChooserContent_Panels } from '../panels/panel-choosers.js';


export function makeNavButton(properties = {}) {
	let title = properties.title || 't i t l e';
	let superTitle = properties.superTitle || 's u p e r t i t l e';
	let level = properties.level || '';

	return `
		<button
			data-nav-type="${superTitle}"
			class="nav-button"
			id="nav-button${level? `-${level}` : ''}"
			title="${title}"
		>
			${makeNavButtonContent(title, superTitle)}
		</button>
	`;
}

export function makeNavButtonContent(title, superTitle) {
	return `
		<span class="nav-button__super-title">${superTitle}</span>
		<span class="nav-button__title" title="${title}">${title}</span>
	`;
}

export function showNavDropdown(parentElement) {
	log(`showNavDropdown`, 'start');
	log(`parentElement:`);
	log(parentElement.getBoundingClientRect());
	let size = '500px';
	let rect = parentElement.getBoundingClientRect();
	let parentStyle = getComputedStyle(parentElement);
	let top = rect.top + rect.height - 3;

	let dropdownContent = makeElement({tag: 'h3', content: 'Uninitialized'});
	let dropdownType = parentElement.getAttribute('data-nav-type');
	log(`dropdownType: ${dropdownType}`);

	if(dropdownType === 'PAGE') {
		dropdownContent = makeChooserContent_Pages();
		size = `${parentElement.parentElement.getBoundingClientRect().width}px`;
	}

	if(dropdownType === 'EDITING') {
		dropdownContent = makeChooserContent_Glyphs((glyphID) => {
			let editor = getCurrentProjectEditor();
			editor.selectedGlyphID = glyphID;
			closeAllDialogs();
		});
		size = '80%';
	}

	if(dropdownType === 'PANEL') {
		dropdownContent = makeChooserContent_Panels();
		size = `${rect.width}px`;
	}

	let dropDown = makeElement({
		tag: 'dialog',
		id: 'nav-dropdown',
		attributes: {style: `
			left: ${rect.left}px;
			top: ${top}px;
			width: ${size};
			background-color: ${parentStyle.backgroundColor};
			border-color: ${parentStyle.backgroundColor};
		`}
	});

	addAsChildren(dropDown, dropdownContent);
	log(`dropDown:`);
	log(dropDown);
	closeAllDialogs();
	document.getElementById('app__wrapper').appendChild(dropDown);
	log(`showNavDropdown`, 'end');
}