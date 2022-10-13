import { getCurrentProject, getCurrentProjectEditor } from '../app/main.js';
import { clone } from '../common/functions.js';
import { refreshPanel } from '../panels/panels.js';

/**
	History
	An object that stores a Glyphr Studio Project
	state, to enable undo.  History changes are saved per
	item (Glyph, Component, Ligature, Kern)
**/

export class History {
	constructor(project) {
		// const project = getCurrentProject();
		this.queue = [];
		this.baseState = clone(project);
		this.baseTimeStamp = new Date().getTime();
	}

	/**
	 * Capture the current state of an Item (and related Items) and put
	 * it into the History queue.
	 * @param {String} changeTitle - What to call this change in the History panel
	 * @param {Array} otherChanges - Array of IDs for other items that are changed
	 * (for example, changing a Component also changes Glyphs it's linked to)
	 */
	addState(title = '', otherChanges = false) {
		// log(`History.addState`, 'start');
		const editor = getCurrentProjectEditor();
		const changedItem = editor.selectedItem;
		title = title || `Change to ${changedItem.name}`;

		let entry = {
			timeStamp: new Date().getTime(),
			itemID: editor.selectedItemID,
			title: title,
			itemState: clone(changedItem),
		};

		if (otherChanges.length) {
			//fill
		}

		this.queue.unshift(entry);
		editor.setProjectAsUnsaved();
		if (editor.nav.panel === 'History') {
			refreshPanel();
		}

		// log(`History.addState`, 'end');
	}

	restoreState() {
		log(`History.restoreState`, 'start');

		// log('\t queue.length ' + this.queue.length);
		const editor = getCurrentProjectEditor();
		if (this.queue.length === 0) return;

		let currentID = editor.selectedItemID;
		let nextEntry = this.queue[this.queue.length - 1];

		if (currentID === nextEntry.itemID) {
			if (this.queue.length > 0) {
				if (this.parentName === 'kerning') {
					hydrateGlyphrObjectList(HKern, clone(nextEntry.itemState));
				} else {
					hydrateGlyphrObjectList(Glyph, clone(nextEntry.itemState));
				}
			} else {
				// refer to the base project in the History object
			}
		} else {
			// If the next undo item is a different glyph,
			// navigate to that glyph before undo-ing
			/*
			showToast(
				'Navigated without undo-ing.<br>Undo again to roll back changes for this glyph.',
				2000
			);
			selectGlyph(nextID);
			*/
		}

		if (this.queue.length === 0) editor.setProjectAsSaved();
		if (editor.nav.panel === 'History') {
			refreshPanel();
		}

		log(`History.restoreState`, 'end');
	}
}
