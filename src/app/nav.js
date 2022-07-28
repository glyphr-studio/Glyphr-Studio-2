export { makeNavButton, makeNavButtonContent, showNavDropdown };
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
			${makeNavButtonContent(title, superTitle)};
		</button>
	`;
}

function makeNavButtonContent(title, superTitle) {
	return `
		<span class="nav-button__super-title">${superTitle}</span>
		<span class="nav-button__title">${title}</span>
	`;
}

function showNavDropdown(parentElement) {
	log(`showNavDropdown`, 'start');
	log(`parentElement:`);
	log(parentElement.getBoundingClientRect());
	let size = '500px';
	let rect = parentElement.getBoundingClientRect();
	let parentStyle = getComputedStyle(parentElement);
	let top = rect.top + rect.height - 3;

	let dropdownContent = '<h3>uninitialized</h3>';
	let dropdownType = parentElement.getAttribute('data-nav-type');
	log(`dropdownType: ${dropdownType}`);

	if(dropdownType === 'PAGE') {
		dropdownContent = makeChooserContent_Pages();
		size = `${parentElement.parentElement.getBoundingClientRect().width}px`;
	}

	if(dropdownType === 'EDITING') {
		dropdownContent = makeChooserContent_Glyphs();
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

	dropDown.appendChild(dropdownContent);
	log(`dropDown:`);
	log(dropDown);
	closeAllDialogs();
	document.getElementById('app__wrapper').appendChild(dropDown);
	log(`showNavDropdown`, 'end');
}
