import { getCurrentProject, getCurrentProjectEditor, log } from '../app/main.js';
import { clone } from '../common/functions.js';
import { showToast } from '../controls/dialogs/dialogs.js';
import { refreshPanel } from '../panels/panels.js';
import { Glyph } from '../project_data/glyph.js';
import { GlyphrStudioProject } from '../project_data/glyphr_studio_project.js';

/**
	History
	An object that stores a Glyphr Studio Project
	state, to enable undo.  History changes are saved per
	item (Glyph, Component, Ligature, Kern)
**/

// TODO History assumes Glyph only, extend to Item

export class History {
	constructor() {
		this.queue = [];
		this.initialTimeStamp = false;
		this.initialProject = false;
	}

	/**
	 * Capture the current state of an Item (and related Items) and put
	 * it into the History queue.
	 * 	- For normal changes, call addState after change is made
	 * 	- For deleting items, call addState before deletion, and mark as itemWasDeleted
	 * @param {String} changeTitle - What to call this change in the History panel
	 * @param {Object} options - additional information:
	 * 	- itemWasDeleted: flag so the item can be added back to the project
	 * 	- otherChanges: array of other items that should be updated,
	 * 	  (for example, changing a Component also changes Glyphs it's linked to)
	 */
	addState(title = '', options = {}) {
		// log(`History.addState`, 'start');
		const editor = getCurrentProjectEditor();
		const changedItem = editor.selectedItem;
		title = title || `Change to ${changedItem.name}`;
		const entry = makeHistoryEntry(editor.selectedItemID, title, changedItem, options.itemWasDeleted);
		this.queue.unshift(entry);

		if (options.otherChanges) {
			//TODO Components
		}

		editor.setProjectAsUnsaved();
		if (editor.nav.panel === 'History') {
			refreshPanel();
		}

		const undoButton = document.getElementById('actionButtonUndo');
		if (undoButton) undoButton.removeAttribute('disabled');
		// log(this);
		// log(`History.addState`, 'end');
	}

	/**
	 * Get the latest change, and restore it to the currently selected item.
	 * The current state is at queue index 0, so to undo we need to take two
	 * steps back and restore queue index 1.
	 */
	restoreState() {
		// log(`History.restoreState`, 'start');
		// log(this.queue);
		const editor = getCurrentProjectEditor();

		let q = this.queue;

		if (q.length === 0) {
			editor.setProjectAsSaved();
			const undoButton = document.getElementById('actionButtonUndo');
			if (undoButton) undoButton.setAttribute('disabled', 'disabled');
			// log(`Queue is 0, returning`);
			// log(`History.restoreState`, 'end');
			return;
		}

		if (q.length > 1 && q[0].itemID !== q[1].itemID) {
			// Assumes navigate adds an entry to the queue
			editor.selectedGlyphID = q[1].itemID;
			q.shift();
			// TODO Kern Undo - go to kern page
			// TODO Ligature Undo - go to Ligature page
			// TODO Component - go to Component page
			editor.nav.page = 'Glyph edit';
			editor.navigate();

			if (q[0]?.itemWasDeleted) {
				showToast(`Restored deleted item<br>${q[0].itemState.name}`);
			} else {
				showToast('Navigated without undo-ing');
				// log(`Need to navigate to next changed glyph`);
				// log(`History.restoreState`, 'end');
				return;
			}
		}

		let nextEntry;
		if (q.length === 1) {
			// With only one change in the queue, undo falls back to the initial project state
			nextEntry = {
				itemState: this.initialProject.glyphs[editor.selectedGlyphID].save(),
				itemID: editor.selectedGlyphID,
				title: 'Initial state',
			};
			// log(`Queue length was 1, setting 'nextEntry' to base project`);
			// log(nextEntry);
		} else {
			nextEntry = q[1];
		}

		// --------------------------------------------------------------
		// Everything checks out, proceed with the undo
		// --------------------------------------------------------------

		// log(`Undoing: ${nextEntry.title}`);
		// log(`Replacing current glyph with:`);
		// log(nextEntry.itemState);

		// Clear selections
		editor.multiSelect.points.clear();
		editor.multiSelect.paths.clear();

		// Overwrite the current item with the redo state
		editor.selectedGlyph = nextEntry.itemState;

		// Index 0 is the previous current state, so remove it
		q.shift();

		editor.publish('currentItem', editor.selectedItem);
		if (editor.nav.panel === 'History') {
			refreshPanel();
		}

		if (q.length === 0) {
			editor.setProjectAsSaved();
			const undoButton = document.getElementById('actionButtonUndo');
			if (undoButton) undoButton.setAttribute('disabled', 'disabled');
		}
		// log(q);
		// log(`History.restoreState`, 'end');
	}
}

function makeHistoryEntry(itemID, title, changedItem, itemWasDeleted = false) {
	let newEntry = {
		timeStamp: new Date().getTime(),
		itemID: itemID,
		title: title,
		itemState: new Glyph(changedItem.save()),
		itemWasDeleted: itemWasDeleted,
	};

	return newEntry;
}
