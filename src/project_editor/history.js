import { getCurrentProjectEditor } from '../app/main.js';
import { clone } from '../common/functions.js';

/**
	History
	An object that stores a Glyphr Studio Project
	state, to enable undo.  History is saved per
	page... essentially, each page gets it's own
	undo queue.
**/

export class History {
	constructor({queue = [], parentName = 'undefined'}) {
		const editor = getCurrentProjectEditor();
		this.queue = queue;
		this.parentName = parentName;
		this.currstate = clone(editor.project[this.parentName], 'History');
		this.initialstate = clone(editor.project[this.parentName], 'History');
		this.initialdate = new Date().getTime();
	}

	put(des) {
		// log('\n History.put - START');
		let selected = getSelectedItem();
		this.queue = this.queue || [];
		this.queue.push({
			'name': selected.name,
			'id': selected.id,
			'description': des,
			'date': new Date().getTime(),
			'state': clone(this.currstate, 'History.put')
		});

		this.currstate = clone(editor.project[this.parentName], 'History.put');

		setProjectAsUnsaved();
		markSelectedItemAsChanged();

		// log(' History.put - END\n');
	}
	pull() {
		// log('\n History.pull - START');
		// log('\t queue.length ' + this.queue.length);
		const editor = getCurrentProjectEditor();
		if (this.queue.length === 0)
			return;

		let currentID = getSelectedItemID();
		let nextID = this.queue[this.queue.length - 1].id;

		if (currentID === nextID) {
			let top = this.queue.length ? this.queue.pop().state : this.initialstate;

			if (this.parentName === 'kerning')
				hydrateGlyphrObjectList(HKern, clone(top, 'History.pull'), editor.project[kerning]);
			else
				hydrateGlyphrObjectList(Glyph, clone(top, 'History.pull'), editor.project[this.parentName]);

			this.currstate = clone(top, 'History.pull');

			let selwi = getSelectedItem();
			if (selwi && selwi.changed)
				selwi.changed(true, true);

		} else {
			// If the next undo item is a different glyph,
			// navigate to that glyph before undo-ing
			showToast('Navigated without undo-ing.<br>Undo again to roll back changes for this glyph.', 2000);
			selectGlyph(nextID);
		}


		if (_UI.current_page === 'import svg') {
			update_NavPanels();

		} else if (_UI.current_page === 'components') {
			if (!editor.project.components[_UI.selectedcomponent]) {
				_UI.selectedcomponent = getFirstID(editor.project.components);
			}
		} else if (_UI.current_page === 'ligatures') {
			if (!editor.project.ligatures[_UI.selectedligature]) {
				_UI.selectedligature = getFirstID(editor.project.ligatures);
			}
		}

		_UI.ms.paths.clear();
		_UI.ms.points.clear();
		// update_NavPanels();
		redraw({ calledby: 'history_pull', redrawpanels: true });


		// log('\t after redraw');
		let empty = true;
		for (let q in _UI.history) {
			if (_UI.history.hasOwnProperty(q) && _UI.history[q].queue.length) {
				empty = false;
				break;
			}
		}
		if (empty)
			setProjectAsSaved();


		// log(' History.pull - END\n');
	}
}



// Global Accessor Functions
function history_put(dsc){
	if(getCurrentProjectEditor().nav.isOnEditCanvasPage){
		let queue = _UI.current_page === 'import svg'? 'glyph edit' : _UI.current_page;
		window.setTimeout(function(){
			_UI.history[queue].put(dsc);
		}, 10);
	}
}

function history_pull(){
	if(getCurrentProjectEditor().nav.isOnEditCanvasPage){
		closeDialog();
		closeNotation();
		window.setTimeout(function(){
			_UI.history[_UI.current_page].pull();
		}, 10);
	}
}

function history_length() {
	if(getCurrentProjectEditor().nav.isOnEditCanvasPage){
		return _UI.history[_UI.current_page].queue.length || 0;
	}

	return 0;
}
