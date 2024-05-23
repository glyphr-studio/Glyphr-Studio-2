import { getCurrentProject, getCurrentProjectEditor } from '../app/main.js';
import { showToast } from '../controls/dialogs/dialogs.js';
import { drawShape } from '../display_canvas/draw_paths.js';
import { isOverBoundingBoxHandle } from '../edit_canvas/draw_edit_affordances.js';
import { addPathToCurrentItem } from '../edit_canvas/tools/tools.js';
import { Glyph } from '../project_data/glyph.js';
import { Path } from '../project_data/path.js';
import { PathPoint } from '../project_data/path_point.js';
// import { combinePaths } from './boolean_combine.js';
import { combinePaths } from './boolean_combine.js';
import { makeGlyphWithResolvedLinks, removeLinkFromUsedIn } from './cross_item_actions.js';

/**
		Multi-Select
		An object that contains pieces of other things (Path Points
		or Shapes) and then can use virtual containers (Paths and Glyphs)
		to treat the collections as if they were regular (Paths or Glyphs).

		So:
		 - A random collection of Path Points can be treated like a single Path
		 - A random collection of Shapes can be treated like a Glyph
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
		// log(`obj.objType: ${obj.objType}`);
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

	clear() {
		// overwritten by extended classes
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

	publishChanges() {
		// overwritten by extended classes
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

	/**
	 * @returns {PathPoint | Path | Boolean}
	 */
	get singleton() {
		let result = false;
		// log(`MultiSelect GET singleton`, 'start');
		if (this.members.length === 1) {
			result = this.members[0];
			// log(`result.objType: ${result.objType}`);
		}

		// log(`MultiSelect GET singleton`, 'end');
		return result;
	}
}

// --------------------------------------------------------------
// SELECTED POINTS
// --------------------------------------------------------------

export class MultiSelectPoints extends MultiSelect {
	constructor() {
		super();
		this._virtualShape = new Path({
			name: 'Multi-selected Path Points',
			objType: 'VirtualShape',
		});
	}

	get virtualShape() {
		// log(`MultiSelectPoints GET virtualShape`, 'start');
		this._virtualShape._pathPoints = this.members;
		this._virtualShape.changed();
		// log(`MultiSelectPoints GET virtualShape`, 'end');
		return this._virtualShape;
	}

	get hasMultipleParents() {
		for (let c = 0; c < this.members.length; c++) {
			let checkParent = this.members[c].parent;
			for (let a = 0; a < this.members.length; a++) {
				if (c !== a) {
					if (checkParent !== this.members[a].parent) {
						return true;
					}
				}
			}
		}
		return false;
	}

	publishChanges(topic = 'whichPathPointIsSelected') {
		// log(`MultiSelectPoints.publishChanges`, 'start');
		const editor = getCurrentProjectEditor();
		editor.publish(topic, this.members);
		// log(`MultiSelectPoints.publishChanges`, 'end');
	}

	clear() {
		this.members = [];
		// if (this.virtualGlyph) this.virtualGlyph.ratioLock = false;
		this.singleHandle = false;
		this.publishChanges();
	}

	changed() {
		this.members.forEach((member) => {
			member.changed();
			// glyphChanged(member.parent.parent);
		});
	}

	updateShapePosition(dx, dy) {
		this.virtualShape.updateShapePosition(dx, dy);
		this.changed();
	}

	deleteShapesPoints() {
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

	get highestSelectedPointNumber() {
		if (!this.members[0]) return false;
		this.members.sort((a, b) => a.pointNumber - b.pointNumber);
		let highest = this.members.at(-1).pointNumber;
		// log(`highest: ${highest}`);
		let parentPath = this.members[0].parent;
		if (highest === parentPath.pathPoints.length - 1) {
			highest = 0;
			while (this.isSelected(parentPath.pathPoints[highest])) {
				// log(`adding one`);
				highest++;
				// log(`highest: ${highest}`);
			}
			highest -= 1;
		}
		// log(`highest selected point number: ${highest}`);
		return highest;
	}

	get lowestSelectedPointNumber() {
		if (!this.members[0]) return false;
		this.members.sort((a, b) => a.pointNumber - b.pointNumber);
		let lowest = this.members[0].pointNumber;
		// log(`lowest: ${lowest}`);
		let parentPath = this.members[0].parent;
		if (lowest === 0) {
			lowest = parentPath.pathPoints.length - 1;
			while (this.isSelected(parentPath.pathPoints[lowest])) {
				// log(`subtracting one`);
				lowest--;
				// log(`lowest: ${lowest}`);
			}
			lowest += 1;
		}
		// log(`lowest selected point number: ${lowest}`);
		return lowest;
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

	roundAll(precision = 9) {
		for (let m = 0; m < this.members.length; m++) {
			// log(this.members[m]);
			this.members[m].roundAll(precision);
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

		if (this.singleHandle && this.singleton) {
			this.members[0].updatePathPointPosition(this.singleHandle, dx, dy);
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
// SELECTED SHAPES
// --------------------------------------------------------------

export class MultiSelectShapes extends MultiSelect {
	constructor() {
		super();
		this._virtualGlyph = new Glyph({
			name: 'Multi-selected Shapes',
			id: 'Multi-selected Shapes',
			objType: 'VirtualGlyph',
		});
	}

	get virtualGlyph() {
		// log(`MultiSelectShapes GET virtualGlyph`, 'start');
		// needs to be _shapes, otherwise Glyph.shapes setter
		// imports copies of the new array values.
		this._virtualGlyph._shapes = this.members;
		this._virtualGlyph.changed();

		// log(`MultiSelectShapes GET virtualGlyph`, 'end');
		return this._virtualGlyph;
	}

	get allPathPoints() {
		let result = [];
		this.members.forEach((shape) => {
			if (shape?.pathPoints) {
				result = result.concat(shape.pathPoints);
			}
		});
		return result;
	}

	publishChanges(topic = 'whichShapeIsSelected') {
		const editor = getCurrentProjectEditor();
		editor.publish(topic, this.members);
	}

	clear() {
		this.members = [];
		this.virtualGlyph.ratioLock = false;
		this.singleHandle = false;
		this.publishChanges();
	}

	changed() {
		this.members.forEach((member) => {
			member.changed();
			// glyphChanged(member.parent);
		});
		// this.virtualGlyph.changed();
	}

	get maxes() {
		// log(`MultiSelectShapes VirtualGlyph GET maxes`, 'start');
		let result = this.virtualGlyph.maxes;
		// log(result);
		// log(`MultiSelectShapes VirtualGlyph GET maxes`, 'end');
		return result;
	}

	get ratioLock() {
		if (this.members.length === 1) return this.members[0].ratioLock;
		else return this.virtualGlyph.ratioLock;
	}

	selectAll() {
		const currItem = getCurrentProjectEditor().selectedItem;
		if (currItem.shapes) {
			currItem.shapes.forEach((shape) => {
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

	combine(operation = 'unite') {
		// log('MultiSelectShapes.combine', 'start');
		let success = true;
		const newGlyph = makeGlyphWithResolvedLinks(this.virtualGlyph);
		const combineResult = combinePaths(newGlyph.shapes, operation);
		// log(`\n⮟combineResult⮟`);
		// log(combineResult);

		// If everything worked, delete original paths and add new ones
		if (Array.isArray(combineResult)) {
			this.deleteShapes();
			combineResult.forEach((shape) => addPathToCurrentItem(shape));
			showToast(`Combine shapes: ${operation} complete!`, 2000);
		} else {
			success = false;
			showToast(`Combine shapes error:<br>${combineResult}`, 2000);
		}

		// log('MultiSelectShapes.combine', 'end');
		return success;
	}

	deleteShapes() {
		// log('deleteShapes', 'start');
		const editor = getCurrentProjectEditor();
		const project = getCurrentProject();
		const itemShapes = editor.selectedItem.shapes;
		let index;

		if (this.members.length === 0) this.clear();
		else {
			this.members.forEach((item) => {
				if (item.objType === 'ComponentInstance') {
					removeLinkFromUsedIn(project.getItem(item.link), item.parent.id);
				}
				index = itemShapes.indexOf(item);
				if (index > -1) itemShapes.splice(index, 1);
			});
		}

		this.select(itemShapes.at(-1));
		// log('deleteShapes', 'end');
	}

	align(edge) {
		// showToast('align ' + edge);
		const glyphMaxes = this.maxes;
		this.virtualGlyph.shapes.forEach((shape) => {
			if (edge === 'top') {
				let delta = glyphMaxes.yMax - shape.maxes.yMax;
				// log(`delta: ${delta}`);
				shape.updateShapePosition(0, delta);
			}

			if (edge === 'middle') {
				let delta = glyphMaxes.center.y - shape.maxes.center.y;
				// log(`delta: ${delta}`);
				shape.updateShapePosition(0, delta);
			}

			if (edge === 'bottom') {
				let delta = glyphMaxes.yMin - shape.maxes.yMin;
				// log(`delta: ${delta}`);
				shape.updateShapePosition(0, delta);
			}

			if (edge === 'left') {
				let delta = glyphMaxes.xMin - shape.maxes.xMin;
				// log(`delta: ${delta}`);
				shape.updateShapePosition(delta, 0);
			}

			if (edge === 'center') {
				let delta = glyphMaxes.center.x - shape.maxes.center.x;
				// log(`delta: ${delta}`);
				shape.updateShapePosition(delta, 0);
			}

			if (edge === 'right') {
				let delta = glyphMaxes.xMax - shape.maxes.xMax;
				// log(`delta: ${delta}`);
				shape.updateShapePosition(delta, 0);
			}
		});

		// log('Glyph.alignShapes', 'end');
	}

	updateShapePosition(dx, dy) {
		// log(`MultiSelectShape.updateShapePosition`, 'start');
		// log(`dx: ${dx} dy: ${dy}`);
		this.virtualGlyph.updateGlyphPosition(dx, dy);
		// The "real" glyph is updated through the parent.changed() hierarchy
		// This virtual glyph needs a manual call.
		this.changed();
		// log(`MultiSelectShape.updateShapePosition`, 'end');
	}

	setShapePosition(nx, ny) {
		this.virtualGlyph.setGlyphPosition(nx, ny);
		this.changed();
	}

	updateShapeSize(resizeOptions) {
		this.virtualGlyph.updateGlyphSize(resizeOptions);
		this.changed();
	}

	setShapeSize(resizeOptions) {
		this.virtualGlyph.setGlyphSize(resizeOptions);
		this.changed();
	}

	rotate(angle, about) {
		this.virtualGlyph.rotate(angle, about);
		this.changed();
	}

	isRotatable() {
		if (this.members.length === 1) return true;
		else return !this.contains('Component Instance');
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
		// log('MultiSelectedShapes.isOverBoundingBoxHandle', 'start');
		// log('passed x/y: ' + px + '/' + py);

		/** @type {String | false} */
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
		// log('MultiSelectedShapes.isOverBoundingBoxHandle', 'end');
		return re;
	}

	getCenter() {
		return this.virtualGlyph.maxes.center;
	}

	drawShapes(ctx, view) {
		let failed = false;
		let drewShape = false;
		for (let m = 0; m < this.members.length; m++) {
			drewShape = drawShape(this.members[m], ctx, view);
			failed = failed || !drewShape;
		}

		return !failed;
	}

	reverseWinding() {
		for (let m = 0; m < this.members.length; m++) {
			this.members[m].reverseWinding();
		}
		this.changed();
	}
}
