export { makeNavButton, showNavDropdown };
import { makeElement } from '../common/dom.js';
import { log } from '../common/functions.js';
import { makeChooserContent_Glyphs, makeChooserContent_Pages, makeChooserContent_Panels } from '../panels/panel-choosers.js';
import { getGlyphrStudioApp } from './main.js';

function makeNavButton(properties = {}) {
	let title = properties.title || 't i t l e';
	let superTitle = properties.superTitle || 's u p e r t i t l e';
	let level = properties.level || '';

	return `
		<button data-nav-type="${superTitle}" class="nav-button" id="nav-button${level? `-${level}` : ''}">
			<span class="nav-button__super-title">${superTitle}</span>
			<span class="nav-button__title">${title}</span>
		</button>
	`;
}

function showNavDropdown(parentElement) {
	log(`showNavDropdown`, 'start');
	log(`parentElement:`);
	log(parentElement.getBoundingClientRect());
	let size = 600;
	let rect = parentElement.getBoundingClientRect();
	let top = rect.top + rect.height + 2;

	let dropdownContent = '<h3>uninitialized</h3>';
	let dropdownType = parentElement.getAttribute('data-nav-type');
	log(`dropdownType: ${dropdownType}`);

	if(dropdownType === 'PAGE') dropdownContent = makeChooserContent_Pages();
	if(dropdownType === 'EDITING') dropdownContent = makeChooserContent_Glyphs();
	if(dropdownType === 'PANEL') dropdownContent = makeChooserContent_Panels();

	let dropDown = makeElement({
		tag: 'dialog',
		id: 'nav-dropdown',
		attributes: {style: `left: ${rect.left}px; top: ${top}px; width: ${size}px;`},
		innerHTML: dropdownContent
	});

	log(`dropDown:`);
	log(dropDown);
	closeAllDialogs();
	document.getElementById('app__wrapper').appendChild(dropDown);
	log(`showNavDropdown`, 'end');
}
