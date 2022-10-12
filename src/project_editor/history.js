import { getCurrentProject, getCurrentProjectEditor } from '../app/main.js';
import { clone } from '../common/functions.js';

/**
	History
	An object that stores a Glyphr Studio Project
	state, to enable undo.  History changes are saved per
	item (Glyph, Component, Ligature, Kern)
**/

export class History {
	constructor() {
		const editor = getCurrentProjectEditor();
		this.queue = [];
		this.baseState = clone(editor.project);
		this.baseTimeStamp = new Date().getTime();
	}

	/**
	 * Capture the current state of an Item (and related Items) and put
	 * it into the History queue.
	 * @param {String} changedItemID - ID of the Glyph, Component, Ligature, or Kern
	 * @param {*} otherChanges - Array of IDs for other items that are changed
	 * (for example, changing a Component also changes Glyphs it's linked to)
	 */
	put(changedItemID, otherChanges = false) {
		// log(`History.put`, 'start');
		const project = getCurrentProject();
		const changedItem = project.getItem(changedItemID);

		let entry = {
			timeStamp: new Date().getTime(),
			itemID: changedItemID,
			itemState: clone(changedItem),
		};

		if (otherChanges.length) {
			//fill
		}

		this.queue.push(entry);

		// setProjectAsUnsaved();
		// log(`History.put`, 'end');
	}

	pull() {
		log(`History.pull`, 'start');

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

		if (this.queue.length === 0) setProjectAsSaved();

		log(`History.pull`, 'end');
	}
}
