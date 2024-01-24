import { getCurrentProjectEditor, getGlyphrStudioApp } from '../app/main.js';
import { showToast } from '../controls/dialogs/dialogs.js';
import { refreshPanel } from '../panels/panels.js';
import { Glyph } from '../project_data/glyph.js';
import { GlyphrStudioProject } from '../project_data/glyphr_studio_project.js';
import { KernGroup } from '../project_data/kern_group.js';

/**
	History
	An object that stores a Glyphr Studio Project
	state, to enable undo.  History changes are saved per
	item (Glyph, Component, Ligature, Kern)
**/
export class History {
	constructor() {
		this.queue = [];
		this.initialTimeStamp = false;
		this.initialProject = false;
	}

	/**
	 * Calculates the number of unique changes in the undo queue
	 * (Whole project changes have two entries in the queue)
	 */
	get length() {
		let items = this.queue.filter((item) => item.title !== '_whole_project_change_post_state_');
		return items.length;
	}

	/**
	 * Capture the current state of an Item (and related Items) and put
	 * it into the History queue.
	 * 	- For normal changes, call addState after change is made
	 * 	- For deleting items, call addState before deletion, and mark as itemWasDeleted
	 * @param {String} title - What to call this change in the History panel
	 * @param {Object} itemWasDeleted - flag so the item can be added back to the project
	 */
	addState(title = '', itemWasDeleted = false) {
		// log(`History.addState`, 'start');
		const entry = makeHistoryEntry({ title: title, itemWasDeleted: itemWasDeleted });
		this.queue.unshift(entry);
		this.updateAfterSaveState();
		// log(this);
		// log(`History.addState`, 'end');
	}

	/**
	 * #### Call this method *before* a whole-project change
	 * Capture the current state of the entire Project and put it into the History queue.
	 * This is used for cross-item actions, where multiple dependent items are updated at
	 * once, or for bulk actions, where many items are modified at the same time.
	 * @param {String} title - What to call this change in the History panel
	 */
	addWholeProjectChangePreState(title = '') {
		title = title || `Update to many items across the project.`;
		const entry = makeHistoryEntry({ title: title, wholeProjectSave: true });
		if (this.queue.length) {
			entry.itemID = this.queue[0].itemID;
			entry.page = this.queue[0].page;
		} else {
			const editor = getCurrentProjectEditor();
			entry.itemID = editor.selectedItemID;
			entry.page = editor.nav.page;
		}
		this.queue.unshift(entry);
		this.updateAfterSaveState();
	}

	/**
	 * #### Call this method *after* a whole-project change
	 */
	addWholeProjectChangePostState() {
		const entry = makeHistoryEntry({
			title: '_whole_project_change_post_state_',
			wholeProjectSave: true,
		});
		if (this.queue.length) {
			entry.itemID = this.queue[0].itemID;
			entry.page = this.queue[0].page;
		} else {
			const editor = getCurrentProjectEditor();
			entry.itemID = editor.selectedItemID;
			entry.page = editor.nav.page;
		}
		this.queue.unshift(entry);
	}

	/**
	 * Update common project, editor, and UI stuff after a new state is added
	 */
	updateAfterSaveState() {
		const editor = getCurrentProjectEditor();
		editor.setProjectAsUnsaved();
		if (editor.nav.panel === 'History') {
			refreshPanel();
		}

		const undoButton = document.getElementById('actionButtonUndo');
		if (undoButton) undoButton.removeAttribute('disabled');

		if (editor.project.settings.app.autoSave) {
			const app = getGlyphrStudioApp();
			if (app.settings.dev.mode && app.settings.dev.autoSave) {
				app.addAutoSaveState();
			} else {
				app.addAutoSaveState();
			}
		}
	}

	/**
	 * Get the latest change, and restore it to the currently selected item.
	 * The current state is at queue index 0, so to undo we need to take two
	 * steps back and restore queue index 1.
	 */
	restoreState() {
		// log(`History.restoreState`, 'start');
		const editor = getCurrentProjectEditor();

		let q = this.queue;

		// --------------------------------------------------------------
		// Check for empty queue
		// --------------------------------------------------------------

		if (q.length === 0) {
			editor.setProjectAsSaved();
			const undoButton = document.getElementById('actionButtonUndo');
			if (undoButton) undoButton.setAttribute('disabled', 'disabled');
			showToast(`No more undo`);
			// log(`Queue is 0, returning`);
			// log(`History.restoreState`, 'end');
			return;
		}

		// --------------------------------------------------------------
		// Check if next item is different than current item
		// --------------------------------------------------------------

		if (q[0] && q[1]) {
			if (q[0].itemID !== q[1].itemID) {
				// Assumes navigate adds an entry to the queue
				if(q[1].page) editor.nav.page = q[1].page;
				if(q[1].itemID) editor.selectedItemID = q[1].itemID;
				q.shift();
				editor.navigate();

				if (q[0]?.itemWasDeleted) {
					showToast(`Restored deleted item<br>${q[0].itemState.name}`);
				} else {
					showToast('Navigated without undo-ing');
					// log(`Need to navigate to next changed item`);
					// log(`History.restoreState`, 'end');
					return;
				}
			}
		}

		// --------------------------------------------------------------
		// get the next item
		// --------------------------------------------------------------

		let nextEntry;
		if (q.length === 1) {
			// With only one change in the queue, undo falls back to the initial project state
			// log(this.initialProject);
			let baseItemState;
			let baseItem;
			if (editor.nav.page === 'Characters') {
				// log(`editor.selectedGlyphID : ${editor.selectedGlyphID}`);
				baseItem = this.initialProject.glyphs[editor.selectedGlyphID];
				// log(baseItem);
				baseItemState = baseItem.save();
			} else if (editor.nav.page === 'Ligatures') {
				// log(`editor.selectedLigatureID : ${editor.selectedLigatureID}`);
				baseItem = this.initialProject.ligatures[editor.selectedLigatureID];
				// log(baseItem);
				baseItemState = baseItem.save();
			} else if (editor.nav.page === 'Components') {
				// log(`editor.selectedComponentID : ${editor.selectedComponentID}`);
				baseItem = this.initialProject.components[editor.selectedComponentID];
				// log(baseItem);
				baseItemState = baseItem.save();
			} else if (editor.nav.page === 'Kerning') {
				// log(`editor.selectedKernGroupID : ${editor.selectedKernGroupID}`);
				baseItem = this.initialProject.kerning[editor.selectedKernGroupID];
				// log(baseItem);
				baseItemState = baseItem.save();
			}
			nextEntry = {
				itemState: baseItemState,
				itemID: editor.selectedItemID,
				title: 'Initial state',
			};
			// log(`Queue length was 1, setting 'nextEntry' to base project`);
			// log(nextEntry);
		} else {
			nextEntry = q[1];
		}

		// --------------------------------------------------------------
		// proceed with the undo
		// --------------------------------------------------------------

		// log(`Undoing to: ${nextEntry.title}`);
		// log(`nextEntry:`);
		// log(nextEntry);

		// Clear selections
		editor.multiSelect.points.clear();
		editor.multiSelect.shapes.clear();

		// Overwrite the current item with the previous state
		if (nextEntry.wholeProjectSave) {
			// log(`Overwriting whole project`);
			// log(`\n⮟nextEntry.itemState⮟`);
			// log(nextEntry.itemState);
			editor._project = nextEntry.itemState;
			if (q[0].wholeProjectSave) q.shift();
		} else {
			// log(editor.selectedItem.print());
			// log(`overwriting ${editor.selectedItem.name}`);
			// log(`with:`);
			// log(nextEntry.itemState);
			editor.selectedItem = nextEntry.itemState;
			// log(editor.selectedItem.print());
		}
		editor.publish('currentItem', editor.selectedItem);

		// Index 0 is the previous current state, so remove it
		q.shift();

		// Finalize UI stuff
		if (editor.nav.panel === 'History') refreshPanel();
		if (q.length === 0) {
			editor.setProjectAsSaved();
			const undoButton = document.getElementById('actionButtonUndo');
			if (undoButton) undoButton.setAttribute('disabled', 'disabled');
		}

		// log(q);
		// log(`History.restoreState`, 'end');
	}
}

function makeHistoryEntry({ title = '', itemWasDeleted = false, wholeProjectSave = false }) {
	const editor = getCurrentProjectEditor();
	let page;
	let item;

	if (wholeProjectSave) {
		// Whole project save point
		item = new GlyphrStudioProject(editor.project.save(), 'makeHistoryEntry');
		title = title || `Changes across many items.`;
		page = false;
	} else {
		// Single item save point
		item = editor.selectedItem;
		if (editor.nav.page === 'Kerning') item = new KernGroup(item.save());
		else item = new Glyph(item.save());
		title = title || `Change to ${item.name}`;
		page = editor.nav.page;
	}

	let newEntry = {
		timeStamp: new Date().getTime(),
		itemID: editor.selectedItemID,
		itemState: item,
		title: title,
		page: page,
		itemWasDeleted: itemWasDeleted,
		wholeProjectSave: wholeProjectSave,
	};

	return newEntry;
}
