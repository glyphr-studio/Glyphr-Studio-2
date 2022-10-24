import { getCurrentProject, getCurrentProjectEditor } from '../app/main.js';
import { clone } from '../common/functions.js';
import { refreshPanel } from '../panels/panels.js';
import { Glyph } from '../project_data/glyph.js';

/**
	History
	An object that stores a Glyphr Studio Project
	state, to enable undo.  History changes are saved per
	item (Glyph, Component, Ligature, Kern)
**/

export class History {
	constructor(editor) {
		this.queue = [];
		const initial = makeHistoryEntry(editor, 'Initial state', editor.selectedGlyph);
		this.currentState = initial;
	}

	/**
	 * Capture the current state of an Item (and related Items) and put
	 * it into the History queue.
	 * @param {String} changeTitle - What to call this change in the History panel
	 * @param {Array} otherChanges - Array of IDs for other items that are changed
	 * (for example, changing a Component also changes Glyphs it's linked to)
	 */
	addState(title = '', otherChanges = false) {
		log(`History.addState`, 'start');
		const editor = getCurrentProjectEditor();
		this.queue.unshift(this.currentState);

		const changedItem = editor.selectedItem;
		title = title || `Change to ${changedItem.name}`;
		this.currentState = makeHistoryEntry(editor, title, changedItem);

		if (otherChanges.length) {
			//fill
		}

		editor.setProjectAsUnsaved();
		if (editor.nav.panel === 'History') {
			refreshPanel();
		}

		log(this);
		log(`History.addState`, 'end');
	}

	/**
	 * Get the latest change, and restore it to the currently selected item
	 */
	restoreState() {
		log(`History.restoreState`, 'start');
		log(this.queue);
		const editor = getCurrentProjectEditor();

		if (this.queue.length === 0) {
			log(`Queue is 0, returning`);
			log(`History.restoreState`, 'end');
			editor.setProjectAsSaved();
			return;
		}

		let currentID = editor.selectedItemID;
		let nextEntry = this.queue[0];

		if (currentID === nextEntry.itemID) {
			// Changes exist in the queue
			// make sure the next one is a change for the current glyph
			log(`Undoing: ${nextEntry.title}`);
			log(`Replacing current glyph with:`);
			log(nextEntry.itemState);

			// Clear selections
			editor.multiSelect.points.clear();
			editor.multiSelect.paths.clear();

			// Overwrite the current item with the redo state
			editor.selectedGlyph = nextEntry.itemState;
			this.queue.splice(0, 1);

			editor.publish('currentGlyph', editor.selectedItem);
			if (editor.nav.panel === 'History') {
				refreshPanel();
			}
		} else {
			// If the next undo item is a different glyph,
			// navigate to that glyph before undo-ing
			/*
			showToast(
				'Navigated without undo-ing.<br>Undo again to roll back changes for this glyph.',
				2000
			);
			*/
			editor.navigate(nextEntry.itemID);
		}

		log(this.queue);
		log(`History.restoreState`, 'end');
	}
}

function makeHistoryEntry(editor, title, changedItem) {
	let newEntry = {
		timeStamp: new Date().getTime(),
		itemID: editor.selectedGlyphID,
		title: title,
		itemState: new Glyph(changedItem.save()),
	};

	return newEntry;
}