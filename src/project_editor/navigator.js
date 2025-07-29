import { showAppErrorPage } from '../app/app.js';
import { getCurrentProject, getCurrentProjectEditor } from '../app/main.js';
import { makeAppTopBar } from '../app/menu.js';
import { accentColors } from '../common/colors.js';
import { addAsChildren, insertAfter, makeElement } from '../common/dom.js';
import { countItems } from '../common/functions.js';
import { makeIcon } from '../common/graphics.js';
import { animateRemove, closeEveryTypeOfDialog } from '../controls/dialogs/dialogs.js';
import { makePage_About } from '../pages/about.js';
import { makePage_Characters } from '../pages/characters.js';
import { makePage_Components } from '../pages/components.js';
import { makePage_GlobalActions } from '../pages/global_actions.js';
import { makePage_Help } from '../pages/help.js';
import { makePage_Kerning } from '../pages/kerning.js';
import { makePage_Ligatures } from '../pages/ligatures.js';
import { livePreviewPageWindowResize, makePage_LivePreview } from '../pages/live_preview.js';
import { makePage_Overview } from '../pages/overview.js';
import { makePage_Settings } from '../pages/settings.js';
import { makeSingleItemTypeChooserContent } from '../panels/item_chooser.js';

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
			Overview: {
				pageMaker: makePage_Overview,
				iconName: 'page_overview',
			},
			'Design glyphs': {
				type: 'subtitle',
			},
			Characters: {
				pageMaker: makePage_Characters,
				iconName: 'page_characters',
			},
			Ligatures: {
				pageMaker: makePage_Ligatures,
				iconName: 'page_ligatures',
			},
			Components: {
				pageMaker: makePage_Components,
				iconName: 'page_components',
			},
			Refine: {
				type: 'subtitle',
			},
			Kerning: {
				pageMaker: makePage_Kerning,
				iconName: 'page_kerning',
			},
			'Live preview': {
				pageMaker: makePage_LivePreview,
				iconName: 'page_livePreview',
			},
			'Global actions': {
				pageMaker: makePage_GlobalActions,
				iconName: 'page_globalActions',
			},
			'Settings & more': {
				type: 'subtitle',
			},
			Settings: {
				pageMaker: makePage_Settings,
				iconName: 'page_settings',
			},
			'Import & export': {
				pageMaker: false,
				iconName: 'page_importAndExport',
			},
			Help: {
				pageMaker: makePage_Help,
				iconName: 'page_help',
			},
			About: {
				pageMaker: makePage_About,
				iconName: 'page_about',
			},
		};
	}

	/**
	 * Changes the page of this Project Editor
	 * @param {Boolean =} test - set to true when running from Vitest
	 */
	navigate(test = false) {
		// log(`Navigator.navigate`, 'start');
		// log(`this.page: ${this.page}`);
		// log(`this.panel: ${this.panel}`);
		// log(`editor.selectedItemID: ${getCurrentProjectEditor().selectedItemID}`);

		closeEveryTypeOfDialog();
		const wrapper = document.querySelector('#app__wrapper');

		// log(`wrapper before:`);
		// log(wrapper);

		if (wrapper) {
			try {
				const pageContent = this.makePageContent();
				wrapper.innerHTML = '';
				wrapper.appendChild(makeAppTopBar());
				wrapper.appendChild(pageContent);
			} catch (e) {
				console.warn(`Navigation failed:`, e);
				showAppErrorPage(`Oops, navigation failed!`, e);
				// log(getCurrentProject());
			}
		} else {
			if (!test) console.warn(`Navigation failed: app__wrapper could not be found.`);
		}
		// log(`Navigator.navigate`, 'end');
	}

	/**
	 * Sets the current view to the appropriate Page
	 * @returns {Object} Page Loader object - {string} content and {function} callback
	 */
	makePageContent() {
		// log(`Navigator.makePageContent`, 'start');
		const editorContent = makeElement({
			tag: 'div',
			id: 'app__main-content',
		});

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

			window.removeEventListener('resize', livePreviewPageWindowResize);

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
	 * Returns True if the current page has an item chooser panel
	 * @returns {Boolean}
	 */
	get isOnChooserPanelPage() {
		const nh = this.page;
		return nh === 'Characters' || nh === 'Components' || nh === 'Kerning' || nh === 'Ligatures';
	}

	/**
	 * Returns true if the current page has an Edit Canvas
	 * @returns {Boolean}
	 */
	get isOnEditCanvasPage() {
		const nh = this.page;
		return nh === 'Characters' || nh === 'Components' || nh === 'Kerning' || nh === 'Ligatures';
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
	closeAllNavMenus();
	showNavDropdown(parentElement);
}

/**
 *	Close all the main nav menu dropdowns
 * @param {Boolean} isChooserMenu - The Item Chooser can be inside a nav menu,
 *	this method gets called from other dropdowns, so we have to know if this is
 *	being called from a control inside a nav menu or from outside of it.
 */
export function closeAllNavMenus(isChooserMenu = false) {
	// log(`closeAllNavMenus`, 'start');
	let navMenus = document.querySelectorAll('nav');
	// log(navMenus);
	navMenus.forEach((elem) => {
		if (isChooserMenu) {
			if (elem.id !== 'nav-dropdown-chooser') animateRemove(elem);
		} else {
			animateRemove(elem);
		}
	});
	// log(`closeAllNavMenus`, 'end');
}

export function showNavDropdown(parentElement) {
	// log(`showNavDropdown`, 'start');
	let size = '500px';
	let navID;
	let rect = parentElement.getBoundingClientRect();
	let parentStyle = getComputedStyle(parentElement);
	let top = rect.top + rect.height - 3;

	let dropdownContent = makeElement({ tag: 'h3', content: 'Uninitialized' });
	let dropdownType = parentElement.getAttribute('data-nav-type');
	// log(`dropdownType: ${dropdownType}`);

	if (dropdownType === 'PAGE') {
		dropdownContent = makePageChooserContent();
		size = `${parentElement.parentElement.getBoundingClientRect().width - 2}px`;
		navID = 'nav-dropdown-page';
	}

	if (dropdownType === 'EDITING') {
		const editor = getCurrentProjectEditor();
		const project = getCurrentProject();
		dropdownContent = makeSingleItemTypeChooserContent(editor.nav.page, (itemID) => {
			editor.selectedItemID = itemID;
			editor.history.addState(`Navigated to ${editor.project.getItemName(itemID, true)}`);
			closeAllNavMenus();
		});

		if (
			(editor.nav.page === 'Ligatures' && countItems(project.ligatures) > 25) ||
			(editor.nav.page === 'Components' && countItems(project.components) > 25) ||
			editor.nav.page === 'Characters'
		) {
			size = '80%';
		} else {
			size = `${parentElement.getBoundingClientRect().width - 2}px`;
		}

		navID = 'nav-dropdown-chooser';
	}

	if (dropdownType === 'PANEL') {
		dropdownContent = makePanelChooserContent();
		size = `${rect.width - 2}px`;
		navID = 'nav-dropdown-panel';
	}

	let dropDown = makeElement({
		tag: 'nav',
		id: navID,
		attributes: { tabindex: '-1' },
		style: `
			left: ${rect.left + 1}px;
			top: ${top}px;
			min-width: ${size};
			max-width: 60%;
			background-color: ${parentStyle.backgroundColor};
			border-color: ${parentStyle.backgroundColor};
		`,
	});

	addAsChildren(dropDown, dropdownContent);
	// log(`dropDown:`);
	// log(dropDown);
	// closeAllNavMenus();
	closeEveryTypeOfDialog();

	// let appWrapper = document.querySelector('#app__wrapper');
	// appWrapper.appendChild(dropDown).focus();
	insertAfter(parentElement, dropDown);

	// log(`showNavDropdown`, 'end');
}

function makePageChooserContent() {
	// log(`makePageChooserContent`, 'start');

	let content = makeElement();
	let pageButton;
	let toc = getCurrentProjectEditor().nav.tableOfContents;

	Object.keys(toc).forEach((itemName) => {
		if (toc[itemName]?.type === 'subtitle') {
			content.appendChild(
				makeElement({ tag: 'h3', content: itemName, className: 'nav-dropdown__subtitle' })
			);
		} else if (itemName !== 'Open project' && toc[itemName].pageMaker) {
			pageButton = makeNavButton_Page(itemName, toc[itemName].iconName);
			content.appendChild(pageButton);
		}
	});

	// log(`makePageChooserContent`, 'end');
	return content;
}

function makeNavButton_Page(pageName, iconName) {
	let button = makeElement({
		tag: 'button',
		className: 'nav-dropdown__button',
		attributes: { tabindex: '0' },
	});
	button.innerHTML += makeIcon({ name: iconName, color: accentColors.blue.l90 });
	button.appendChild(makeElement({ content: pageName }));
	button.addEventListener('click', () => {
		let editor = getCurrentProjectEditor();
		if (editor.nav.page !== pageName) {
			editor.multiSelect.shapes.clear();
			editor.multiSelect.points.clear();
		}

		// Ensure the selected Panel is availabe for the new page, otherwise default to Attributes
		editor.nav.page = pageName;
		if (panelsPerPage?.[pageName]) {
			if(!panelsPerPage[pageName].includes(editor.nav.panel)) editor.nav.panel = 'Attributes';
		}

		editor.navigate();
		if (editor.selectedItemID) {
			let lastChange = editor.history.queue[0] || false;

			// Only add a nav item to the history queue if the previous undo item:
			//  - matches the current selected item
			//  - is not a whole project save
			if (
				lastChange &&
				!(lastChange.wholeProjectSave || lastChange.itemID === editor.selectedItemID)
			) {
				editor.history.addState(
					`Navigated to ${editor.project.getItemName(editor.selectedItemID, true)}`
				);
			}
		}
	});
	return button;
}

const panelsPerPage = {
	Characters: ['Attributes', 'Layers', 'ContextCharacters', 'History', 'Guides', 'CharacterInfo'],
	Ligatures: ['Attributes', 'Layers', 'History', 'Guides', 'QualityChecks'],
	Components: ['Attributes', 'Layers', 'History', 'Guides', 'QualityChecks'],
	Kerning: ['Attributes', 'History'],
};

function makePanelChooserContent() {
	// log(`makePanelChooserContent`, 'start');
	let content = makeElement();
	let pageButton;
	let panels = listOfPanels();
	let page = getCurrentProjectEditor().nav.page;
	panelsPerPage[page].forEach((panelName) => {
		pageButton = makeNavButton_Panel(panels[panelName].name, panels[panelName].iconName);
		content.appendChild(pageButton);
	});

	// log(`makePanelChooserContent`, 'end');
	return content;
}

function makeNavButton_Panel(panelName, iconName) {
	let button = makeElement({
		tag: 'button',
		className: 'nav-dropdown__button',
		attributes: { tabindex: '0' },
	});
	button.innerHTML += makeIcon({ name: iconName, color: accentColors.blue.l90 });
	button.appendChild(makeElement({ content: panelName }));
	button.addEventListener('click', () => {
		// log(`navButton.click`, 'start');
		// log(`panelName: ${panelName}`);
		const editor = getCurrentProjectEditor();
		editor.nav.panel = panelName;
		editor.showPageTransitions = false;
		editor.navigate();
		editor.showPageTransitions = true;
		// log(`navButton.click`, 'end');
	});
	return button;
}

/**
 * List of panels the editor supports
 */
function listOfPanels() {
	return {
		Attributes: {
			name: 'Attributes',
			panelMaker: false,
			iconName: 'panel_attributes',
		},
		Layers: {
			name: 'Layers',
			panelMaker: false,
			iconName: 'panel_layers',
		},
		ContextCharacters: {
			name: 'Context characters',
			panelMaker: false,
			iconName: 'panel_contextCharacters',
		},
		History: {
			name: 'History',
			panelMaker: false,
			iconName: 'panel_history',
		},
		Guides: {
			name: 'Guides',
			panelMaker: false,
			iconName: 'panel_guides',
		},
		CharacterInfo: {
			name: 'Character info',
			panelMaker: false,
			iconName: 'panel_characterInfo',
		},
		QualityChecks: {
			name: 'Quality checks',
			panelMaker: false,
			iconName: 'panel_qualityChecks',
		},
	};
}
