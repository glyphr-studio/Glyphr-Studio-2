import { getCurrentProject, getCurrentProjectEditor, log } from '../app/main.js';
import { isOverBoundingBoxHandle } from '../edit_canvas/draw_edit_affordances.js';
import { drawItem } from '../display_canvas/draw_paths.js';
import { addPathToCurrentItem } from '../edit_canvas/tools/tools.js';
import { Glyph } from '../project_data/glyph.js';
import { Path } from '../project_data/path.js';
import { glyphChanged, removeFromUsedIn } from './cross_item_actions.js';

/**
		Multi-Select
		An object that contains pieces of other things (Path Points
		or Paths) and then can use virtual containers (Paths and Glyphs)
		to treat the collections as if they were regular (Paths or Glyphs).

		So:
		 - A random collection of Path Points can be treated like a single Path
		 - A random collection of Paths can be treated like a Glyph
**/

// --------------------------------------------------------------
// COMMON MULTI-SELECT
// --------------------------------------------------------------
class MultiSelect {
	constructor() {
		this.members = [];
		this.singleHandle = false;
	}

	isSelected(obj) {
		// log(`MultiSelect.isSelected`, 'start');
		// log(this.members);
		// log(obj);
		// log(`returning ${this.members.indexOf(obj) > -1}`);
		// log(`MultiSelect.isSelected`, 'end');
		return this.members.indexOf(obj) > -1;
	}

	isSelectable(obj) {
		// log(`MultiSelect.isSelectable`, 'start');
		let types = ['PathPoint', 'Path', 'ComponentInstance'];
		let selectableType = types.includes(obj?.objType);
		// log(`MultiSelect.isSelectable`, 'end');
		return selectableType && !this.isSelected(obj);
	}

	select(obj) {
		// log('MultiSelect.select', 'start');
		// log(`this.members.length: ${this.members.length}`);

		// log(`obj.__ID: ${obj.__ID}`);

		if (this.isSelectable(obj)) {
			// log(`selecting ${obj.objType}`);
			this.members = [obj];
			// log(`JUST SELECTED obj.__ID: ${this.members.at(0).__ID}`);
			this.publishChanges();
		} else {
			// log('this.isSelectable = false, clearing');
			this.clear();
		}
		// log(this.members);
		// log('MultiSelect.select', 'end');
	}

	add(obj) {
		// log(`MultiSelect.add`, 'start');
		// log(obj);
		// log(`this.members.length: ${this.members.length}`);
		// log(this.members.indexOf(obj));

		// log(`obj.__ID: ${obj.__ID}`);

		if (this.isSelectable(obj)) {
			// log(`adding ${obj.objType} "${obj.type ? obj.type : obj.name}"`);
			this.members.push(obj);
			// log(`JUST ADDED obj.__ID: ${this.members.at(-1).__ID}`);
			this.publishChanges();
		}

		// log(this.members);
		// log(`MultiSelect.add`, 'end');
	}

	clear() {
		this.members = [];
		if (this.glyph) this.glyph.ratioLock = false;
		this.singleHandle = false;
		this.publishChanges();
	}

	remove(obj) {
		this.members = this.members.filter(function (m) {
			return m !== obj;
		});
		this.publishChanges();
	}

	removeMissing() {
		this.members = this.members.filter(function (m) {
			return typeof m === 'object';
		});
		this.publishChanges();
	}

	get count() {
		return this.members.length;
	}

	toggle(obj) {
		// log(`MultiSelectPoints.toggle`, 'start');

		if (this.isSelected(obj)) this.remove(obj);
		else this.add(obj);

		this.publishChanges();
		// log(`MultiSelectPoints.toggle`, 'end');
	}

	get type() {
		if (this.members.length === 0) return false;
		else if (this.members.length === 1) return this.members[0].objType;
		else return 'multi';
	}

	get length() {
		return this.members.length;
	}

	set members(arr) {
		this._members = arr;
	}

	get members() {
		return this._members || [];
	}

	get singleton() {
		if (this.members.length === 1) return this.members[0];
		else return false;
	}
}

// --------------------------------------------------------------
// SELECTED POINTS
// --------------------------------------------------------------

export class MultiSelectPoints extends MultiSelect {
	constructor() {
		super();
		this._virtualPath = new Path();
		this._virtualPath.name = 'Multi-selected Points';
	}

	get virtualPath() {
		this._virtualPath._pathPoints = this.members;
		this._virtualPath.changed();
		return this._virtualPath;
	}

	publishChanges(topic = 'whichPathPointIsSelected') {
		// log(`MultiSelectPoints.publishChanges`, 'start');
		const editor = getCurrentProjectEditor();
		editor.publish(topic, this.members);
		// log(`MultiSelectPoints.publishChanges`, 'end');
	}

	changed() {
		this.members.forEach((member) => {
			member.changed();
			glyphChanged(member.parent.parent);
		});
	}

	updatePathPosition(dx, dy) {
		this.virtualPath.updatePathPosition(dx, dy);
		this.changed();
	}

	deletePathPoints() {
		let point;
		let parentPath;
		let pointIndex;
		let minPointIndex = Number.MAX_SAFE_INTEGER;

		for (let m = 0; m < this.members.length; m++) {
			point = this.members[m];
			parentPath = point.parent;
			pointIndex = point.pointNumber;

			if (pointIndex > -1) {
				parentPath.pathPoints.splice(pointIndex, 1);
				parentPath.changed();
				minPointIndex = Math.min(pointIndex, minPointIndex);
			}
		}

		this.clear();
		return minPointIndex;
	}

	getSingletonPointNumber() {
		if (!this.members[0]) return false;
		else return this.members[0].pointNumber;
	}

	setPointType(t) {
		for (let m = 0; m < this.members.length; m++) {
			this.members[m].setPointType(t);
		}
		this.changed();
	}

	resetHandles() {
		for (let m = 0; m < this.members.length; m++) {
			// log(this.members[m]);
			this.members[m].resetHandles();
		}
		this.changed();
	}

	resolvePointType() {
		for (let m = 0; m < this.members.length; m++) {
			// log(this.members[m]);
			this.members[m].resolvePointType();
		}
		this.changed();
	}

	updatePathPointPosition(dx, dy) {
		// log(`MultiSelectPoints.updatePathPointPosition`, 'start');
		// log(`dx, dy: ${dx}, ${dy}`);
		// log(`this.singleHandle: ${this.singleHandle}`);

		if (this.singleHandle) {
			this.singleton.updatePathPointPosition(this.singleHandle, dx, dy);
		} else {
			for (let m = 0; m < this.members.length; m++) {
				this.members[m].updatePathPointPosition('p', dx, dy);
			}
		}
		this.changed();
		// log(`MultiSelectPoints.updatePathPointPosition`, 'end');
	}
}

// --------------------------------------------------------------
// SELECTED PATHS
// --------------------------------------------------------------

export class MultiSelectPaths extends MultiSelect {
	constructor() {
		super();
		this._virtualGlyph = new Glyph();
		this._virtualGlyph.name = 'Multi-Selected Paths';
		this._virtualGlyph.id = 'Multi-Selected Paths';
	}

	get virtualGlyph() {
		// needs to be _paths, otherwise Glyph.paths setter
		// imports copies of the new array values.
		this._virtualGlyph._paths = this.members;
		this._virtualGlyph.changed();

		return this._virtualGlyph;
	}

	publishChanges(topic = 'whichPathIsSelected') {
		const editor = getCurrentProjectEditor();
		editor.publish(topic, this.members);
	}

	changed() {
		this.members.forEach((member) => {
			member.changed();
			glyphChanged(member.parent);
		});
	}

	get maxes() {
		// log(`MultiSelectPaths VirtualGlyph GET maxes`, 'start');
		let result = this.virtualGlyph.maxes;
		// log(result);
		// log(`MultiSelectPaths VirtualGlyph GET maxes`, 'end');
		return result;
	}

	get ratioLock() {
		if (this.members.length === 1) return this.members[0].ratioLock;
		else return false;
	}

	selectAll() {
		const currItem = getCurrentProjectEditor().selectedItem;
		if (currItem.paths) {
			currItem.paths.forEach((shape) => {
				this.add(shape);
			});
		}
	}

	contains(objTypeName) {
		if (this.members.length === 0) return false;
		let re = false;
		for (let m = 0; m < this.members.length; m++) {
			re = this.members[m].objType === objTypeName;
			if (re) return true;
		}

		return false;
	}

	// just define this as nothing so it can be called from the root class
	// selectPathsThatHaveSelectedPoints() {}

	/*
	// TODO boolean combine
	combine() {
		// log('MultiSelectPaths.combine', 'start');
		const ns = this.virtualGlyph.clone();
		ns.makeGlyphWithResolvedLinks();
		const cs = combinePaths(ns.paths);

		// If everything worked, delete original paths and add new ones
		if (cs) {
			this.deletePaths();
			for (let n = 0; n < cs.length; n++) addPathToCurrentItem(cs[n]);
			editor.history.addState('Combined paths');
		}

		// log('MultiSelectPaths.combine', 'end');
	}
*/
	deletePaths() {
		// log('deletePath', 'start');
		const editor = getCurrentProjectEditor();
		const project = getCurrentProject();
		const itemPaths = editor.selectedItem.paths;
		let index;

		if (this.members.length === 0) this.clear();
		else {
			this.members.forEach((item) => {
				if (item.objType === 'ComponentInstance') {
					removeFromUsedIn(project.getItem(item.link), item.parent.id);
				}
				index = itemPaths.indexOf(item);
				if (index > -1) itemPaths.splice(index, 1);
			});
		}

		this.select(itemPaths.at(-1));

		// TODO publish change
		// log('deletePath', 'end');
	}

	align(edge) {
		// showToast('align ' + edge);
		const g = this.virtualGlyph;
		g.alignShapes(edge);
		getCurrentProjectEditor().history.addState('Aligned paths ' + edge);
	}

	changePathName(n) {
		this.singleton.changePathName(n);
	}

	updatePathPosition(dx, dy) {
		// log(`MultiSelectPath.updatePathPosition`, 'start');
		// log(`dx: ${dx} dy: ${dy}`);
		this.virtualGlyph.updateGlyphPosition(dx, dy);
		// The "real" glyph is updated through the parent.changed() hierarchy
		// This virtual glyph needs a manual call.
		this.changed();
		// log(`MultiSelectPath.updatePathPosition`, 'end');
	}

	setPathPosition(nx, ny) {
		this.virtualGlyph.setGlyphPosition(nx, ny);
		this.changed();
	}

	updatePathSize(dw, dh, ratioLock) {
		this.virtualGlyph.updateGlyphSize(dw, dh, ratioLock);
		this.changed();
	}

	setPathSize(nw, nh, ratioLock) {
		this.virtualGlyph.setGlyphSize(nw, nh, ratioLock);
		this.changed();
	}

	rotate(angle, about) {
		this.virtualGlyph.rotate(angle, about);
		this.changed();
	}

	isRotatable() {
		if (this.members.length === 1) return true;
		else return !this.contains('ComponentInstance');
	}

	flipNS(mid) {
		this.virtualGlyph.flipNS(mid);
		this.changed();
	}

	flipEW(mid) {
		this.virtualGlyph.flipEW(mid);
		this.changed();
	}

	getAttribute(attr) {
		if (this.members.length === 1) return this.members[0][attr];
		else if (this.members.length > 1) return this.virtualGlyph[attr] || false;
		else return false;
	}

	isOverBoundingBoxHandle(px, py) {
		// log('SelectedPaths.isOverBoundingBoxHandle', 'start');
		// log('passed x/y: ' + px + '/' + py);

		let re = false;
		if (this.members.length === 0) {
			// log('no members, returning false');
			re = false;
		} else if (this.members.length === 1) {
			// log('calling singleton for size');
			re = isOverBoundingBoxHandle(px, py, this.members[0].maxes);
		} else {
			// log('calling virtual glyph for size');
			re = isOverBoundingBoxHandle(px, py, this.virtualGlyph.maxes);
		}

		// log(`returning: ${re}`);
		// log('SelectedPaths.isOverBoundingBoxHandle', 'end');
		return re;
	}

	getCenter() {
		return this.virtualGlyph.maxes.center;
	}

	drawPaths(ctx, view) {
		let failed = false;
		let drewPath = false;
		for (let m = 0; m < this.members.length; m++) {
			drewPath = drawItem(this.members[m], ctx, view);
			failed = failed || !drewPath;
		}

		return !failed;
	}

	/*
	draw_PathPoints() {
		// log('MultiSelectPaths.draw_PathPoints', 'start');
		let s;
		for (let m = 0; m < this.members.length; m++) {
			s = this.members[m];
			// log('drawing points on path ' + m + ' as ' + s.pathPoints);
			if (s.objType !== 'ComponentInstance') draw_PathPoints(this.members[m].pathPoints);
		}

		// log('MultiSelectPaths.draw_PathPoints', 'end');
	}
*/
	reverseWinding() {
		for (let m = 0; m < this.members.length; m++) {
			this.members[m].reverseWinding();
		}
		this.changed();
	}
}
