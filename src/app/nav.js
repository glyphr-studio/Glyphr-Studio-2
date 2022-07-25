export { makeNavButton, showNavDropdown };
import { makeElement } from '../common/dom.js';
import { log } from '../common/functions.js';
import { getGlyphrStudioApp } from './main.js';

function makeNavButton(properties = {}) {
	let title = properties.title || 't i t l e';
	let superTitle = properties.superTitle || 's u p e r t i t l e';
	let level = properties.level || '';
	let size = properties.size || 500;

	return `
		<button class="nav-button" id="nav-button${level? `-${level}` : ''}">
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

	let dropDown = makeElement({
		tag: 'dialog',
		id: 'nav-dropdown',
		attributes: {style: `left: ${rect.left}px; top: ${top}px; width: ${size}px;`},
		innerHTML: `
			<div class="nav-dropdown__header-bar">title</div>
			<button onClick="closeAllDialogs();">close</button>
			<button>Thing 1</button>
			<button>Thing 2</button>
			<button>Thing 3</button>
			<button>Thing 4</button>
		`
	});

	log(`dropDown:`);
	log(dropDown);
	closeAllDialogs();
	document.getElementById('app__wrapper').appendChild(dropDown);
	log(`showNavDropdown`, 'end');
}
