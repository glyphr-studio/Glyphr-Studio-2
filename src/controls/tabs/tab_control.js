import { addAsChildren, makeElement } from '../../common/dom.js';
import { closeAllInfoBubbles } from '../dialogs/dialogs.js';

export class TabControl {
	constructor(targetElement) {
		this.tabs = [];
		this.targetElement = targetElement;
		this.targetElement.addEventListener('scroll', closeAllInfoBubbles);
	}

	/**
	 *
	 * @param {String} tabName - name for the tab
	 * @param {HTMLElement | String} tabContent - what to put in the tab
	 */
	registerTab(tabName = 'Tab Name', tabContent = '') {
		let newTab = {
			name: tabName,
			content: tabContent,
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

	selectTab(tabName) {
		this.targetElement.innerHTML = '';
		this.tabs.forEach((tab) => {
			if (tab.name === tabName) {
				tab.tabElement.setAttribute('selected', '');
				addAsChildren(this.targetElement, tab.content);
			} else {
				tab.tabElement.removeAttribute('selected');
			}
		});
		closeAllInfoBubbles();
	}
}
