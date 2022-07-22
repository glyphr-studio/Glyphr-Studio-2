export { makeNavButton, showNavDropdown, closeNavDropdown };
import { createElement } from '../common/functions.js';

function makeNavButton(properties = {}) {
	let title = properties.title || 't i t l e';
	let superTitle = properties.superTitle || 's u p e r t i t l e';
	let level = properties.level || '';
	let size = properties.size || 500;

	return `
		<button class="nav-button" id="nav-button${level? `-${level}` : ''}" onClick="showNavDropdown(this, size);">
			<span class="nav-button__super-title">${superTitle}</span>
			<span class="nav-button__title">${title}</span>
		</button>
	`;
}

function showNavDropdown(parentElement) {
	log(`showNavDropdown`, 'start');
	let size = 600;
	let left = parentElement.windowLeft;
	let top = parentElement.windowTop;

	let dropDown = createElement({tag: 'dialog', attributes: {style: `left: ${left}px; top: ${top}px; width: ${size}px;`}});
	log(`dropDown: ${dropDown}`);

	dropDown.innerHTML = `
	<div class="nav-dropdown__header-bar">title</div>
	<button onClick="closeNavDropdown();">close</button>
	<button>Thing 1</button>
	<button>Thing 2</button>
	<button>Thing 3</button>
	<button>Thing 4</button>
	`;

	document.appendChild(dropDown);
	log(`showNavDropdown`, 'end');
}

function closeNavDropdown() {
	document.getElementById('nav-dropdown').style.display = 'none';
}