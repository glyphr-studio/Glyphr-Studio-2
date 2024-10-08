import { addAsChildren, makeElement } from '../../common/dom.js';
import { closeAllInfoBubbles } from '../dialogs/dialogs.js';

export class TabControl {
	constructor(targetElement) {
		this.tabs = [];
		this.targetElement = targetElement;
		this.targetElement.addEventListener('scroll', closeAllInfoBubbles);
	}

	/**
	 * Saves a new tab object to this tab group
	 * @param {String} tabName - name for the tab
	 * @param {function} contentMaker - function that creates the tab content
	 */
	registerTab(tabName = 'Tab Name', contentMaker = () => {}) {
		let newTab = {
			name: tabName,
			contentMaker: contentMaker,
			tabElement: makeElement({
				className: 'tab-control__tab',
				innerHTML: tabName,
				attributes: { tabindex: 1 },
				onClick: () => {
					this.selectTab(tabName);
				},
			}),
		};

		this.tabs.push(newTab);
	}

	/**
	 * Makes the tabs
	 * @returns {Element}
	 */
	makeTabs() {
		const tabContainer = makeElement({
			tag: 'div',
			className: 'tab-control__tab-container panel__card full-width',
		});

		this.tabs.forEach((tabData) => {
			tabContainer.appendChild(tabData.tabElement);
		});

		return tabContainer;
	}

	/**
	 * Selects the specified tab
	 * @param {String} tabName - which to select
	 */
	selectTab(tabName) {
		this.targetElement.innerHTML = '';
		this.tabs.forEach((tab) => {
			if (tab.name === tabName) {
				tab.tabElement.setAttribute('selected', '');
				addAsChildren(this.targetElement, tab.contentMaker());
			} else {
				tab.tabElement.removeAttribute('selected');
			}
		});
		closeAllInfoBubbles();
	}
}
