import { getCurrentProjectEditor } from '../app/main.js';
import { log } from '../common/functions.js';
import Glyph from '../glyph_elements/glyph.js';
import Shape from '../glyph_elements/shape.js';

/**
		Multi-Select
		An object that contains pieces of other things (Path Points
		or Shapes) and then can use virtual containers (Shapes and Glyphs)
		to treat the collections as if they were regular (Shapes or Glyphs).

		So:
		 - A random collection of Path Points can be treated like a single Shape
		 - A random collection of Shapes can be treated like a Glyph
**/

// --------------------------------------------------------------
// COMMON MULTI-SELECT
// --------------------------------------------------------------
class MultiSelect {
	constructor() {
		this.members = [];
		this.handleSingleton = false;
	}

	isSelectable(obj) {
		log(`MultiSelect.isSelectable`, 'start');
		log(obj);
		log(`obj.objType: ${obj.objType}`);

		let selectable = [
			'Path Point', 'Shape', 'Component Instance'
		];

		log(`MultiSelect.isSelectable`, 'end');
		return selectable.includes(obj?.objType);
	}

	select(obj) {
		log('MultiSelect.select', 'start');
		if (this.isSelectable(obj)) {
			log('selecting object');
			this.members = [obj];
			this.publishChanges();
		} else {
			log('this.isSelectable = false, clearing');
			this.clear();
		}

		log('MultiSelect.select', 'end');
	}

	clear() {
		this.members = [];
		if (this.glyph) this.glyph.ratioLock = false;
		this.handleSingleton = false;
		this.publishChanges();
	}

	add(obj) {
		log(`MultiSelect.add`, 'start');
		if (this.isSelectable(obj) && this.members.indexOf(obj) < 0) {
			this.members.push(obj);
		}
		this.publishChanges();
		log(`MultiSelect.add`, 'end');
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

	count() {
		return this.members.length;
	}

	toggle(obj) {
		if (this.isSelected(obj)) this.remove(obj);
		else this.add(obj);

		this.publishChanges();
	}

	get type() {
		if (this.members.length === 0)
			return false;
		else if (this.members.length === 1)
			return this.members[0].objType;
		else
			return 'multi';
	}

	get length() {
		return this.members.length;
	}

	set members(arr) {
		this._members = arr;
	}

	get members() {
		return this._members;
	}

	get singleton() {
		if (this.members.length === 1)
			return this.members[0];
		else
			return false;
	}

	isSelected(obj) {
		return this.members.indexOf(obj) > -1;
	}
}




// --------------------------------------------------------------
// SELECTED POINTS
// --------------------------------------------------------------

export class MultiSelectPoints extends MultiSelect {
	constructor() {
		super();
		this._shape = new Shape();
	}

	/*
		get glyph() {
		this._glyph.shapes = this.members;
		this._glyph.changed();
		return this._glyph;
	}
	*/
	get shape() {
		this._shape.path = new Path({ pathPoints: this.members });
		// this.shape.calcMaxes();
		return this._shape;
	}

	publishChanges() {
		let editor = getCurrentProjectEditor();
		editor.publish('selectedPathPoints', this.members);
		this.selectShapesThatHaveSelectedPoints();
	}

	updateShapePosition(dx, dy) {
		this.shape.updateShapePosition(dx, dy);
	}

	deletePathPoints() {
		let point;
		let path;
		let pindex;

		for (let m = 0; m < this.members.length; m++) {
			point = this.members[m];
			path = point.parent;
			pindex = point.pointNumber;

			if (pindex > -1) {
				path.pathPoints.splice(pindex, 1);
				// path.calcMaxes();
				path.changed();
			}
		}

		let editor = getCurrentProjectEditor();
		const wi = editor.selectedWorkItem;
		if (wi.objType === 'glyph') wi.removeShapesWithZeroLengthPaths();

		this.clear();
	}

	getSingletonPointNumber() {
		if (!this.members[0]) return false;
		else return this.members[0].pointNumber;
	}

	draw_PathPointHandles() {
		const sh = this.shape;
		draw_PathPointHandles(sh.path.pathPoints);
	}

	draw_PathPoints() {
		// log('MS.points.draw_PathPoints', 'start');
		const sh = this.shape;
		// ('\t shape is ' + json(sh));

		draw_PathPoints(sh.path.pathPoints);

		// log('MS.points.draw_PathPoints', 'end');
	}

	setPointType(t) {
		for (let m = 0; m < this.members.length; m++) {
			this.members[m].setPointType(t);
		}
	}

	insertPathPoint() {
		let path;
		let pp;
		const newpoints = [];

		for (let m = 0; m < this.members.length; m++) {
			path = this.members[m].parent;
			pp = this.members[m].pointNumber;
			newpoints.push(path.insertPathPoint(false, pp));
		}

		this.clear();

		for (let n = 0; n < newpoints.length; n++) this.add(newpoints[n]);
	}

	resetHandles() {
		for (let m = 0; m < this.members.length; m++) {
			// log(this.members[m]);
			this.members[m].resetHandles();
		}
	}

	resolvePointType() {
		for (let m = 0; m < this.members.length; m++) {
			// log(this.members[m]);
			this.members[m].resolvePointType();
		}
	}

	updatePathPointPosition(controlpoint, dx, dy) {
		if (controlpoint === 'p') {
			for (let m = 0; m < this.members.length; m++) {
				this.members[m].updatePathPointPosition(controlpoint, dx, dy);
			}
		} else if (this.handleSingleton) {
			this.handleSingleton.updatePathPointPosition(controlpoint, dx, dy);
		}
	}

	selectShapesThatHaveSelectedPoints() {
		// log('MS.points.selectShapesThatHaveSelectedPoints', 'start');
		// this.clear();
		const points = this.members;
		const shapes = getCurrentProjectEditor().selectedWorkItem.shapes;
		let path;
		let count = 0;

		if (points.length === 0) return;

		// log('selected points ' + points);
		// log('WI shapes ' + shapes);

		for (let p = 0; p < points.length; p++) {
			path = points[p].parent;

			for (let s = 0; s < shapes.length; s++) {
				if (shapes[s].objType !== 'ComponentInstance') {
					if (path === shapes[s].path) {
						shapes.add(shapes[s]);
						count++;
					}
				}
			}
		}

		// log('MS.points.selectShapesThatHaveSelectedPoints - Selected ' + count + '', 'end');
	}
}


// --------------------------------------------------------------
// SELECTED SHAPES
// --------------------------------------------------------------

export class MultiSelectShapes extends MultiSelect {
	constructor() {
		super();
		this.glyph = new Glyph();
	}

	set glyph(newGlyph) {
		this._glyph = newGlyph;
	}

	get glyph() {
		this._glyph.shapes = this.members;
		this._glyph.changed();
		return this._glyph;
	}

	contains(objtypename) {
		if (this.members.length === 0) return false;
		let re = false;
		for (let m = 0; m < this.members.length; m++) {
			re = this.members[m].objType === objtypename;
			if (re) return true;
		}

		return false;
	}

	publishChanges() {
		let editor = getCurrentProjectEditor();
		editor.publish('selectedShape', this.members);
	}

	selectShapesThatHaveSelectedPoints() {}

	combine() {
		// log('multiSelect.shapes.combine', 'start');

		const ns = new Glyph(clone(this.glyph));

		ns.flattenGlyph();

		const cs = combineShapes(ns.shapes);

		// If everything worked, delete original shapes and add new ones
		if (cs) {
			this.deleteShapes();

			for (let n = 0; n < cs.length; n++) action_addShape(cs[n]);

			historyPut('Combined shapes');
		}

		// log('multiSelect.shapes.combine', 'end');
	}

	deleteShapes() {
		// log('deleteShape', 'start');
		let editor = getCurrentProjectEditor();
		const wishapes = editor.selectedWorkItem.shapes;
		const sels = this.members;
		let curs;
		let i;

		if (sels.length === 0) clear();
		else {
			for (let s = 0; s < sels.length; s++) {
				curs = sels[s];

				if (curs.objType === 'ComponentInstance') {
					removeFromUsedIn(curs.link, editor.selectedGlyph);
				}

				i = wishapes.indexOf(curs);
				if (i > -1) wishapes.splice(i, 1);
			}

			this.select(wishapes[i] || wishapes[wishapes.length - 1]);
		}

		// TODO publish change
		// log('deleteShape', 'end');
	}

	align(edge) {
		// showToast('align ' + edge);
		const g = this.glyph;
		const gnum = g.shapes.length;
		g.alignShapes(edge);

		historyPut('Aligned ' + gnum + ' shapes ' + edge);
	}

	// Wrapper functions

	changed() {
		for (let m = 0; m < this.members.length; m++) {
			this.members[m].changed();
		}
	}

	// convert to name setter
	changeShapeName(n) {
		this.singleton.changeShapeName(n);
	}

	updateShapePosition(dx, dy) {
		this.glyph.updateGlyphPosition(dx, dy);
	}

	setShapePosition(nx, ny) {
		this.glyph.setGlyphPosition(nx, ny);
	}

	updateShapeSize(dw, dh, ratioLock) {
		if (this.members.length === 1)
			this.members[0].updateShapeSize(dw, dh, ratioLock);
		else if (this.members.length > 1)
			this.glyph.updateGlyphSize(dw, dh, ratioLock);
	}

	setShapeSize(nw, nh, ratioLock) {
		this.glyph.setGlyphSize(nw, nh, ratioLock);
	}

	rotate(angle, about) {
		this.glyph.rotate(angle, about);
	}

	isRotateable() {
		if (this.members.length === 1) return true;
		else return !this.contains('ComponentInstance');
	}

	flipNS(mid) {
		this.glyph.flipNS(mid);
	}

	flipEW(mid) {
		this.glyph.flipEW(mid);
	}

	getAttribute(attr) {
		if (this.members.length === 1) return this.members[0][attr];
		else if (this.members.length > 1) return this.glyph[attr] || false;
		else return false;
	}

	isOverControlPoint(
		x,
		y,
		targetSize,
		noHandles
	) {
		if (this.members.length === 0) return false;
		let re = false;
		for (let m = 0; m < this.members.length; m++) {
			re = this.members[m].isOverControlPoint(x, y, targetSize, noHandles);
			if (re) return re;
		}

		return false;
	}

	isOverBoundingBoxHandle(px, py) {
		// log('SelectedShapes.isOverBoundingBoxHandle', 'start');
		// log('passed x/y: ' + px + '/' + py);

		if (this.members.length === 0) {
			return false;
		} else if (this.members.length === 1) {
			// log('calling singleton method');
			return this.members[0].isOverBoundingBoxHandle(px, py);
		}

		const c = isOverBoundingBoxHandle(
			px,
			py,
			this.glyph.maxes,
			_UI.multiSelectThickness
		);
		// log('SelectedShapes.isOverBoundingBoxHandle returning ' + c);
		return c;
	}

	getCenter() {
		return this.glyph.center;
	}

	// calcMaxes = function() {
	//     for (let m=0; m<this.members.length; m++) {
	//         this.members[m].calcMaxes();
	//     }
	// }

	getMaxes() {
		if (this.members.length === 1) return this.members[0].maxes;
		else return this.glyph.maxes;
	}

	drawShape(lctx, view) {
		let failed = false;
		let drewshape = false;
		for (let m = 0; m < this.members.length; m++) {
			drewshape = this.members[m].drawShape(lctx, view);
			failed = failed || !drewshape;
		}

		return !failed;
	}

	draw_PathPoints() {
		// log('MS.shapes.draw_PathPoints', 'start');
		let s;
		for (let m = 0; m < this.members.length; m++) {
			s = this.members[m];
			// log('drawing points on shape ' + m + ' as ' + s.path.pathPoints);
			if (s.objType !== 'ComponentInstance')
				draw_PathPoints(this.members[m].path.pathPoints);
		}

		// log('MS.shapes.draw_PathPoints', 'end');
	}

	reverseWinding() {
		for (let m = 0; m < this.members.length; m++) {
			this.members[m].reverseWinding();
		}
	}

	/* this should just be drawShape */
	// drawPathOutline() {
	// 	if (this.members.length === 1) {
	// 		this.members[0].drawPathOutline();
	// 	} else {
	// 		for (let m = 0; m < this.members.length; m++) {
	// 			this.members[m].drawPathOutline(false, _UI.multiSelectThickness);
	// 		}
	// 	}
	// }

	drawBoundingBox() {
		if (this.members.length === 1) {
			this.members[0].drawBoundingBox();
		} else if (this.members.length > 1) {
			let bmaxes = clone(_UI.mins);

			for (let m = 0; m < this.members.length; m++) {
				bmaxes = getOverallMaxes([bmaxes, this.members[m].maxes]);
			}

			drawBoundingBox(bmaxes, _UI.colors.gray, _UI.multiSelectThickness);
		}
	}

	draw_RotationAffordance() {
		let ss;
		if (this.members.length === 1) {
			ss = this.members[0];
			const accent =
				ss.objType === 'ComponentInstance' ? _UI.colors.green : _UI.colors.blue;
			draw_RotationAffordance(accent, false);
		} else if (this.members.length > 1) {
			ss = this.glyph;
			draw_RotationAffordance(_UI.colors.gray, _UI.multiSelectThickness);
		}
	}

	drawBoundingBoxHandles() {
		if (this.members.length === 1) {
			this.members[0].drawBoundingBoxHandles();
		} else if (this.members.length > 1) {
			let bmaxes = clone(_UI.mins);

			for (let m = 0; m < this.members.length; m++) {
				bmaxes = getOverallMaxes([bmaxes, this.members[m].maxes]);
			}

			drawBoundingBoxHandles(bmaxes, _UI.colors.gray, _UI.multiSelectThickness);
		}
	}
}