import { getCurrentProject, getCurrentProjectEditor } from '../app/main.js';
import { clone } from '../common/functions.js';
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
	 * @param {String} changeTitle - What to call this change in the History panel
	 * @param {Array} otherChanges - Array of IDs for other items that are changed
	 * (for example, changing a Component also changes Glyphs it's linked to)
	 */
	addState(title = '', otherChanges = false) {
		// log(`History.addState`, 'start');
		const editor = getCurrentProjectEditor();
		const changedItem = editor.selectedItem;
		title = title || `Change to ${changedItem.name}`;
		const entry = makeHistoryEntry(editor, title, changedItem);
		this.queue.unshift(entry);

		if (otherChanges.length) {
			//TODO implement other change saves
		}

		editor.setProjectAsUnsaved();
		if (editor.nav.panel === 'History') {
			refreshPanel();
		}

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
			// log(`Queue is 0, returning`);
			// log(`History.restoreState`, 'end');
			return;
		}

		if (q.length > 1 && q[0].itemID !== q[1].itemID) {
			// Assumes navigate adds an entry to the queue
			editor.selectedGlyphID = q[1].itemID;
			q.shift();
			editor.navigate('Glyph edit');
			// log(`Need to navigate to next changed glyph`);
			// log(`History.restoreState`, 'end');
			return;
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

		editor.publish('currentGlyph', editor.selectedItem);
		if (editor.nav.panel === 'History') {
			refreshPanel();
		}

		// log(q);
		// log(`History.restoreState`, 'end');
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
