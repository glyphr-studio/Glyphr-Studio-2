import { makePage_OpenProject } from '../pages/open_project.js';
import { makePage_GlyphEdit } from '../pages/glyph_edit.js';
import { makePage_Overview } from '../pages/overview.js';
import { makePage_About } from '../pages/about.js';
import { getCurrentProjectEditor } from '../app/main.js';
import { addAsChildren, makeElement } from '../common/dom.js';
import { makeGlyphChooserContent } from '../panels/glyph_chooser.js';
import { makeAppTopBar } from '../app/app.js';
import { makeIcon } from '../common/graphics.js';
import { accentColors } from '../common/colors.js';
import { makePage_Help } from '../pages/help.js';
import { refreshPanel } from '../panels/panels.js';
import { makePage_LivePreview } from '../pages/live_preview.js';

// --------------------------------------------------------------
// Navigation
// --------------------------------------------------------------

export class Navigator {
	constructor() {
		this.page = 'Overview';
		this.panel = 'Attributes';
		this.pageContents = {};
	}

	/**
	 * List of pages the editor supports
	 */
	get tableOfContents() {
		return {
			'Open project': {
				pageMaker: makePage_OpenProject,
				iconName: false,
			},
			'Overview': {
				pageMaker: makePage_Overview,
				iconName: 'page_overview',
			},
			'Glyph edit': {
				pageMaker: makePage_GlyphEdit,
				iconName: 'page_glyphEdit',
			},
			'Ligatures': {
				pageMaker: false,
				iconName: 'page_ligatures',
			},
			'Components': {
				pageMaker: false,
				iconName: 'page_components',
			},
			'Kerning': {
				pageMaker: false,
				iconName: 'page_kerning',
			},
			'Live preview': {
				pageMaker: makePage_LivePreview,
				iconName: 'page_livePreview',
			},
			'Global actions': {
				pageMaker: false,
				iconName: 'page_globalActions',
			},
			'Settings': {
				pageMaker: false,
				iconName: 'page_settings',
			},
			'Import & export': {
				pageMaker: false,
				iconName: 'page_importAndExport',
			},
			'Help': {
				pageMaker: makePage_Help,
				iconName: 'page_help',
			},
			'About': {
				pageMaker: makePage_About,
				iconName: 'page_about',
			},
		};
	}

	/**
	 * Changes the page of this Project Editor
	 * @param {string} pageName - where to go
	 */
	navigate(pageName) {
		// log(`Navigator.navigate`, 'start');

		// log(`pageName : ${pageName}`);
		let fadePageIn = false;
		if (pageName) {
			fadePageIn = this.page !== pageName;
			this.page = pageName;
		}

		// log(`this.page: ${this.page}`);
		// log(`this.panel: ${this.panel}`);

		const wrapper = document.getElementById('app__wrapper');

		// log(`wrapper before:`);
		// log(wrapper);

		if (wrapper) {
			const pageContent = this.makePageContent(fadePageIn);
			wrapper.innerHTML = makeAppTopBar();
			wrapper.appendChild(pageContent);
		} else {
			console.warn(`app__wrapper could not be found, navigation failed`);
		}

		// log(`Navigator.navigate`, 'end');
	}

	/**
	 * Sets the current view to the appropriate Page
	 * @returns {object} Page Loader object - {string} content and {function} callback
	 */
	makePageContent(fadePageIn = false) {
		// log(`Navigator.makePageContent`, 'start');
		const editorContent = makeElement({ tag: 'div', id: 'app__main-content', className: fadePageIn? 'page-fade-in' : ''});

		// Default page loader fallback
		let pageContent = makeElement({ tag: 'h1', innerHTML: 'Uninitialized page content' });
		let currentPageMaker = this.tableOfContents[this.page].pageMaker;
		// log(`page detected as ${this.page}`);

		if (!currentPageMaker) {
			console.warn(`No page maker for ${this.page}`);
			pageContent.innerHTML += `<br>${this.page}`;
		} else {
			// if (!this.pageContents[this.page]) {
			// 	this.pageContents[this.page] = this.tableOfContents[this.page].pageMaker();
			// }
			// If there is page content, set it
			// pageContent = this.pageContents[this.page];
			pageContent = this.tableOfContents[this.page].pageMaker();
		}

		// Append results
		editorContent.appendChild(pageContent);

		// log(`this.pageContents`);
		// log(this.pageContents);

		// log(`Navigator.makePageContent`, 'end');

		return editorContent;
	}

	/**
	 * Returns True if the current page has a glyph chooser panel
	 * @returns {boolean}
	 */
	get isOnChooserPanelPage() {
		const nh = this.page;
		return (
			nh === 'Glyph edit' ||
			nh === 'components' ||
			nh === 'kerning' ||
			nh === 'import svg' ||
			nh === 'ligatures'
		);
	}

	/**
	 * Returns true if the current page has an Edit Canvas
	 * @returns {boolean}
	 */
	get isOnEditCanvasPage() {
		const nh = this.page;
		return nh === 'Glyph edit' || nh === 'components' || nh === 'kerning' || nh === 'ligatures';
	}

	/**
	 * Returns true if the current page has no panels
	 * @returns {boolean}
	 */
	get isOnNoNavPage() {
		const nh = this.page;
		return (
			nh === 'font settings' ||
			nh === 'project settings' ||
			nh === 'global actions' ||
			nh === 'export font' ||
			nh === 'help' ||
			nh === 'about'
		);
	}
}

// --------------------------------------------------------------
// Helpers
// --------------------------------------------------------------

export function makeNavButton(properties = {}) {
	let title = properties.title || 't i t l e';
	let superTitle = properties.superTitle || 's u p e r t i t l e';
	let level = properties.level || '';

	return `
		<button
			data-nav-type="${superTitle}"
			class="nav-button"
			id="nav-button${level ? `-${level}` : ''}"
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

export function toggleNavDropdown(parentElement) {
	let dropdown = document.getElementById('nav-dropdown');

	if (dropdown) {
		closeAllDialogs();
	} else {
		showNavDropdown(parentElement);
	}
}

export function showNavDropdown(parentElement) {
	// log(`showNavDropdown`, 'start');
	let size = '500px';
	let rect = parentElement.getBoundingClientRect();
	let parentStyle = getComputedStyle(parentElement);
	let top = rect.top + rect.height - 3;

	let dropdownContent = makeElement({ tag: 'h3', content: 'Uninitialized' });
	let dropdownType = parentElement.getAttribute('data-nav-type');
	// log(`dropdownType: ${dropdownType}`);

	if (dropdownType === 'PAGE') {
		dropdownContent = makePageChooserContent();
		size = `${parentElement.parentElement.getBoundingClientRect().width - 2}px`;
	}

	if (dropdownType === 'EDITING') {
		dropdownContent = makeGlyphChooserContent((glyphID) => {
			const editor = getCurrentProjectEditor();
			editor.selectedGlyphID = glyphID;
			editor.history.addState(`Navigated to ${editor.project.getGlyphName(glyphID, true)}`);
			closeAllDialogs();
		});
		size = '80%';
	}

	if (dropdownType === 'PANEL') {
		dropdownContent = makePanelChooserContent();
		size = `${rect.width - 2}px`;
	}

	let dropDown = makeElement({
		tag: 'dialog',
		id: 'nav-dropdown',
		attributes: {
			style: `
			left: ${rect.left + 1}px;
			top: ${top}px;
			width: ${size};
			background-color: ${parentStyle.backgroundColor};
			border-color: ${parentStyle.backgroundColor};
		`,
		},
	});

	dropDown.addEventListener('mouseleave', closeAllDialogs);

	addAsChildren(dropDown, dropdownContent);
	// log(`dropDown:`);
	// log(dropDown);
	closeAllDialogs();
	document.getElementById('app__wrapper').appendChild(dropDown);
	// log(`showNavDropdown`, 'end');
}

function makePageChooserContent() {
	// log(`makePageChooserContent`, 'start');

	let content = makeElement();
	let pageButton;
	let toc = getCurrentProjectEditor().nav.tableOfContents;

	Object.keys(toc).forEach((pageName) => {
		if (pageName !== 'Open project' && toc[pageName].pageMaker) {
			// if(pageName !== 'Open project'){
			pageButton = makeNavButton_Page(pageName, toc[pageName].iconName);
			content.appendChild(pageButton);
		}
	});

	// log(`makePageChooserContent`, 'end');
	return content;
}

function makeNavButton_Page(pageName, iconName) {
	let button = makeElement({ tag: 'button', className: 'nav-dropdown__button' });
	button.innerHTML += makeIcon({ name: iconName, color: accentColors.blue.l90 });
	button.appendChild(makeElement({ content: pageName }));
	button.addEventListener('click', () => getCurrentProjectEditor().navigate(pageName));
	return button;
}

function makePanelChooserContent() {
	// log(`makePanelChooserContent`, 'start');

	let content = makeElement();
	let pageButton;
	let panels = listOfPanels();
	let shownPanels = ['Attributes', 'Layers', 'History', 'Guides'];

	shownPanels.forEach((panelName) => {
		pageButton = makeNavButton_Panel(panelName, panels[panelName].iconName);
		content.appendChild(pageButton);
	});

	// log(`makePanelChooserContent`, 'end');
	return content;
}

function makeNavButton_Panel(panelName, iconName) {
	let button = makeElement({ tag: 'button', className: 'nav-dropdown__button' });
	button.innerHTML += makeIcon({ name: iconName, color: accentColors.blue.l90 });
	button.appendChild(makeElement({ content: panelName }));
	button.addEventListener('click', () => {
		// log(`navButton.click`, 'start');
		// log(`panelName: ${panelName}`);
		const editor = getCurrentProjectEditor();
		editor.nav.panel = panelName;
		editor.navigate();
		// log(`navButton.click`, 'end');
	});
	return button;
}

/**
 * List of panels the editor supports
 */
function listOfPanels() {
	return {
		Chooser: {
			name: 'Chooser',
			panelMaker: false,
			iconName: 'panel_chooser',
		},
		Layers: {
			name: 'Layers',
			panelMaker: false,
			iconName: 'panel_layers',
		},
		Guides: {
			name: 'Guides',
			panelMaker: false,
			iconName: 'panel_guides',
		},
		History: {
			name: 'History',
			panelMaker: false,
			iconName: 'panel_history',
		},
		Attributes: {
			name: 'Attributes',
			panelMaker: false,
			iconName: 'panel_attributes',
		},
	};
}
