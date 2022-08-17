import { getCurrentProjectEditor } from '../app/main.js';
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
    if (obj &&
      (obj.objType === 'pathpoint' ||
        obj.objType === 'Shape' ||
        obj.objType === 'ComponentInstance'))
      return true;
    else {
      // log('MultiSelect - cannot select \n' + obj.objType);
      return false;
    }
  }

  select(obj) {
    // log('MultiSelect.select', 'start');
    if (this.isSelectable(obj)) {
      // log('selecting object');
      this.members = [obj];
      this.selectShapesThatHaveSelectedPoints();
    } else {
      // log('this.isSelectable = false, clearing');
      this.clear();
    }

    // log('MultiSelect.select', 'end');
  }

  clear() {
    this.members = [];
    if (this.glyph)
      this.glyph.ratioLock = false;
    this.handleSingleton = false;
    this.selectShapesThatHaveSelectedPoints();
  }

  add(obj) {
    if (this.isSelectable(obj) && this.members.indexOf(obj) < 0)
      this.members.push(obj);
    this.selectShapesThatHaveSelectedPoints();
  }

  remove(obj) {
    this.members = this.members.filter(function (m) {
      return m !== obj;
    });
    this.selectShapesThatHaveSelectedPoints();
  }

  removeMissing() {
    this.members = this.members.filter(function (m) {
      return typeof m === 'object';
    });
    this.selectShapesThatHaveSelectedPoints();
  }

  count() {
    return this.members.length;
  }

  toggle(obj) {
    if (this.isSelected(obj))
      this.remove(obj);
    else
      this.add(obj);
    this.selectShapesThatHaveSelectedPoints();
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
    this.shape = new Shape();
  }

  getShape() {
    this.shape.path = new Path({ pathPoints: this.members });
    // this.shape.calcMaxes();
    return this.shape;
  }

  updateShapePosition(dx, dy) {
    this.getShape().updateShapePosition(dx, dy);
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

    const wi = getSelectedWorkItem();
    if (wi.objType === 'glyph') wi.removeShapesWithZeroLengthPaths();

    this.clear();
  }

  getSingletonPointNumber() {
    if (!this.members[0]) return false;
    else return this.members[0].pointNumber;
  }

  draw_PathPointHandles() {
    const sh = this.getShape();
    draw_PathPointHandles(sh.path.pathPoints);
  }

  draw_PathPoints() {
    // log('MS.points.draw_PathPoints', 'start');
    const sh = this.getShape();
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
            add(shapes[s]);
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

  selectShapesThatHaveSelectedPoints() {}

  combine() {
    // log('multiSelect.shapes.combine', 'start');

    const ns = new Glyph(clone(getGlyph()));

    ns.flattenGlyph();

    const cs = combineShapes(ns.shapes);

    // If everything worked, delete original shapes and add new ones
    if (cs) {
      this.deleteShapes();

      for (let n = 0; n < cs.length; n++) addShape(cs[n]);

      historyPut('Combined shapes');
    }

    // log('multiSelect.shapes.combine', 'end');
  }

  deleteShapes() {
    // log('deleteShape', 'start');
    const wishapes = getSelectedWorkItemShapes();
    const sels = this.members;
    let curs;
    let i;

    if (sels.length === 0) clear();
    else {
      for (let s = 0; s < sels.length; s++) {
        curs = sels[s];

        if (curs.objType === 'ComponentInstance') {
          removeFromUsedIn(curs.link, _UI.selectedGlyph);
        }

        i = wishapes.indexOf(curs);
        if (i > -1) wishapes.splice(i, 1);
      }

      select(wishapes[i] || wishapes[wishapes.length - 1]);
      const singleshape = getSingleton();
      if (singleshape && singleshape.objType === 'ComponentInstance')
        clickTool('shaperesize');
    }

    updateCurrentGlyphWidth();
    // log('deleteShape', 'end');
  }

  align(edge) {
    // showToast('align ' + edge);
    const g = this.getGlyph();
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
    thissingleton.changeShapeName(n);
  }

  updateShapePosition(dx, dy) {
    this.getGlyph().updateGlyphPosition(dx, dy);
  }

  setShapePosition(nx, ny) {
    this.getGlyph().setGlyphPosition(nx, ny);
  }

  updateShapeSize(dw, dh, ratioLock) {
    if (this.members.length === 1)
      this.members[0].updateShapeSize(dw, dh, ratioLock);
    else if (this.members.length > 1)
      this.getGlyph().updateGlyphSize(dw, dh, ratioLock);
  }

  setShapeSize(nw, nh, ratioLock) {
    this.getGlyph().setGlyphSize(nw, nh, ratioLock);
  }

  rotate(angle, about) {
    this.getGlyph().rotate(angle, about);
  }

  rotateable() {
    if (this.members.length === 1) return true;
    else return !this.contains('ComponentInstance');
  }

  flipNS(mid) {
    this.getGlyph().flipNS(mid);
  }

  flipEW(mid) {
    this.getGlyph().flipEW(mid);
  }

  getAttribute(attr) {
    if (this.members.length === 1) return this.members[0][attr];
    else if (this.members.length > 1) return this.getGlyph()[attr] || false;
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
      this.getGlyph().maxes,
      _UI.multiSelectThickness
    );
    // log('SelectedShapes.isOverBoundingBoxHandle returning ' + c);
    return c;
  }

  getCenter() {
    return this.getGlyph().center;
  }

  // calcMaxes = function() {
  //     for (let m=0; m<this.members.length; m++) {
  //         this.members[m].calcMaxes();
  //     }
  // }

  getMaxes() {
    if (this.members.length === 1) return this.members[0].maxes;
    else return this.getGlyph().maxes;
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

  draw_PathOutline() {
    if (this.members.length === 1) {
      this.members[0].draw_PathOutline();
    } else {
      for (let m = 0; m < this.members.length; m++) {
        this.members[m].draw_PathOutline(false, _UI.multiSelectThickness);
      }
    }
  }

  draw_BoundingBox() {
    if (this.members.length === 1) {
      this.members[0].draw_BoundingBox();
    } else if (this.members.length > 1) {
      let bmaxes = clone(_UI.mins);

      for (let m = 0; m < this.members.length; m++) {
        bmaxes = getOverallMaxes([bmaxes, this.members[m].maxes]);
      }

      draw_BoundingBox(bmaxes, _UI.colors.gray, _UI.multiSelectThickness);
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
      ss = this.getGlyph();
      draw_RotationAffordance(_UI.colors.gray, _UI.multiSelectThickness);
    }
  }

  draw_BoundingBoxHandles() {
    if (this.members.length === 1) {
      this.members[0].draw_BoundingBoxHandles();
    } else if (this.members.length > 1) {
      let bmaxes = clone(_UI.mins);

      for (let m = 0; m < this.members.length; m++) {
        bmaxes = getOverallMaxes([bmaxes, this.members[m].maxes]);
      }

      draw_BoundingBoxHandles(bmaxes, _UI.colors.gray, _UI.multiSelectThickness);
    }
  }
}