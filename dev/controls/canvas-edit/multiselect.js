import _UI from '../app/settings.js';

/**
    Multi-Select
    Wrapper object to be used by the UI to handle
    actions that pertain to many selected shapes
    or path points.
**/


// --------------------------------------------------------------
// COMMON MULTI-SELECT OBJECT
// --------------------------------------------------------------
    function MultiSelect() {
        this.members = [];
        this.handlesingleton = false;
    }

    MultiSelect.prototype.isSelectable = function(obj) {
        if (obj && (
            obj.objType === 'pathpoint' ||
            obj.objType === 'Shape' ||
            obj.objType === 'ComponentInstance'
        )) return true;
        else {
            // debug('MultiSelect - cannot select \n' + obj.objType);
            return false;
        }
    };

    MultiSelect.prototype.select = function(obj) {
        // debug('\n MultiSelect.select - START');
        if (this.isSelectable(obj)) {
            // debug('\t selecting object');
            this.members = [obj];
            this.selectShapesThatHaveSelectedPoints();
        } else {
            // debug('\t this.isSelectable = false, clearing');
            this.clear();
        }

        // debug(' MultiSelect.select - END\n');
    };

    MultiSelect.prototype.clear = function() {
        this.members = [];
        if (this.glyph) this.glyph.ratioLock = false;
        this.handlesingleton = false;
        this.selectShapesThatHaveSelectedPoints();
    };

    MultiSelect.prototype.add = function(obj) {
        if (this.isSelectable(obj) && this.members.indexOf(obj) < 0) this.members.push(obj);
        this.selectShapesThatHaveSelectedPoints();
    };

    MultiSelect.prototype.remove = function(obj) {
        this.members = this.members.filter(function(m) {
            return m !== obj;
        });
        this.selectShapesThatHaveSelectedPoints();
    };

    MultiSelect.prototype.removeMissing = function() {
        this.members = this.members.filter(function(m) {
            return typeof m === 'object';
        });
        this.selectShapesThatHaveSelectedPoints();
    };

    MultiSelect.prototype.toggle = function(obj) {
        if (this.isSelected(obj)) this.remove(obj);
        else this.add(obj);
        this.selectShapesThatHaveSelectedPoints();
    };

    MultiSelect.prototype.getType = function() {
        if (this.members.length === 0) return false;
        else if (this.members.length === 1) return this.members[0].objType;
        else return 'multi';
    };

    MultiSelect.prototype.count = function() {
        return this.members.length;
    };

    MultiSelect.prototype.getMembers = function() {
        return this.members;
    };

    MultiSelect.prototype.getSingleton = function() {
        if (this.members.length === 1) return this.members[0];
        else return false;
    };

    MultiSelect.prototype.isSelected = function(obj) {
        return this.members.indexOf(obj) > -1;
    };


// --------------------------------------------------------------
// SELECTED POINTS
// --------------------------------------------------------------

    // Initialize fake Shape of multiselected Points
    _UI.multiSelect.points = new MultiSelect();
    _UI.multiSelect.points.shape = new Shape({'name': 'multiselected points', 'path': new Path()});

    _UI.multiSelect.points.getShape = function() {
        this.shape.path = new Path({pathPoints: this.members});
        // this.shape.calcMaxes();
        return this.shape;
    };

    _UI.multiSelect.points.updateShapePosition = function(dx, dy) {
        this.getShape().updateShapePosition(dx, dy);
    };

    _UI.multiSelect.points.deletePathPoints = function() {
        let point, path, pindex;

        for (let m=0; m<this.members.length; m++) {
            point = this.members[m];
            path = point.parent;
            pindex = point.pointNumber;

            if (pindex > -1) {
                path.pathPoints.splice(pindex, 1);
                // path.calcMaxes();
                path.changed();
            }
        }

        let wi = getSelectedWorkItem();
        if (wi.objType === 'glyph') wi.removeShapesWithZeroLengthPaths();

        this.clear();
    };

    _UI.multiSelect.points.getSingletonPointNumber = function() {
        if (!this.members[0]) return false;
        else return this.members[0].pointNumber;
    };

    _UI.multiSelect.points.draw_PathPointHandles = function() {
        let sh = this.getShape();
        draw_PathPointHandles(sh.path.pathPoints);
    };

    _UI.multiSelect.points.draw_PathPoints = function() {
        // debug('\n MS.points.draw_PathPoints - START');
        let sh = this.getShape();
        // ('\t shape is ' + json(sh));

        draw_PathPoints(sh.path.pathPoints);

        // debug(' MS.points.draw_PathPoints - END\n');
    };

    _UI.multiSelect.points.setPointType = function(t) {
        for (let m=0; m<this.members.length; m++) {
            this.members[m].setPointType(t);
        }
    };

    _UI.multiSelect.points.insertPathPoint = function() {
        let path, pp;
        let newpoints = [];

        for (let m=0; m<this.members.length; m++) {
            path = this.members[m].parent;
            pp = this.members[m].pointNumber;
            newpoints.push(path.insertPathPoint(false, pp));
        }

        this.clear();

        for (let n=0; n<newpoints.length; n++) this.add(newpoints[n]);
    };

    _UI.multiSelect.points.resetHandles = function() {
        for (let m=0; m<this.members.length; m++) {
            // debug(this.members[m]);
            this.members[m].resetHandles();
        }
    };

    _UI.multiSelect.points.resolvePointType = function() {
        for (let m=0; m<this.members.length; m++) {
            // debug(this.members[m]);
            this.members[m].resolvePointType();
        }
    };

    _UI.multiSelect.points.updatePathPointPosition = function(controlpoint, dx, dy) {
        if (controlpoint === 'p') {
            for (let m=0; m<this.members.length; m++) {
                this.members[m].updatePathPointPosition(controlpoint, dx, dy);
            }
        } else if (this.handlesingleton) {
            this.handlesingleton.updatePathPointPosition(controlpoint, dx, dy);
        }
    };

    _UI.multiSelect.points.selectShapesThatHaveSelectedPoints = function() {
        // debug('\n MS.points.selectShapesThatHaveSelectedPoints - START');
        _UI.multiSelect.shapes.clear();
        let points = _UI.multiSelect.points.getMembers();
        let shapes = getSelectedWorkItemShapes();
        let path;
        let count = 0;

        if (points.length === 0) return;

        // debug('\t selected points ' + points);
        // debug('\t WI shapes ' + shapes);

        for (let p=0; p<points.length; p++) {
            path = points[p].parent;

            for (let s=0; s<shapes.length; s++) {
                if (shapes[s].objType !==  'ComponentInstance') {
                    if (path === shapes[s].path) {
                        _UI.multiSelect.shapes.add(shapes[s]);
                        count++;
                    }
                }
            }
        }

        // debug(' MS.points.selectShapesThatHaveSelectedPoints - Selected ' + count + ' - END\n');
    };


// --------------------------------------------------------------
// SELECTED SHAPES
// --------------------------------------------------------------

    // Initialize fake Glyph of multiselected shapes
    _UI.multiSelect.shapes = new MultiSelect();
    _UI.multiSelect.shapes.glyph = new Glyph({'name': 'multiselected shapes'});

    _UI.multiSelect.shapes.getGlyph = function() {
        this.glyph.shapes = this.members;
        this.glyph.changed();
        return this.glyph;
    };

    _UI.multiSelect.shapes.contains = function(objtypename) {
        if (this.members.length === 0) return false;
        let re = false;
        for (let m=0; m<this.members.length; m++) {
            re = this.members[m].objType === objtypename;
            if (re) return true;
        }

        return false;
    };

    _UI.multiSelect.shapes.selectShapesThatHaveSelectedPoints = function() {};

    _UI.multiSelect.shapes.combine = function() {
        // debug('\n multiSelect.shapes.combine - START');

        let ns = new Glyph(clone(_UI.multiSelect.shapes.getGlyph()));

        ns.flattenGlyph();

        let cs = combineShapes(ns.shapes);

        // If everything worked, delete original shapes and add new ones
        if (cs) {
            this.deleteShapes();

            for (let n=0; n<cs.length; n++) addShape(cs[n]);

            history_put('Combined shapes');
        }

        // debug(' multiSelect.shapes.combine - END\n');
    };

    _UI.multiSelect.shapes.deleteShapes = function() {
        // debug('\n deleteShape - START');
        let wishapes = getSelectedWorkItemShapes();
        let sels = this.getMembers();
        let curs, i;

        if (sels.length === 0) _UI.multiSelect.shapes.clear();
        else {
            for (let s=0; s<sels.length; s++) {
                curs = sels[s];

                if (curs.objType === 'ComponentInstance') {
                    removeFromUsedIn(curs.link, _UI.selectedGlyph);
                }

                i = wishapes.indexOf(curs);
                if (i > -1) wishapes.splice(i, 1);
            }

            _UI.multiSelect.shapes.select(wishapes[i] || wishapes[wishapes.length-1]);
            let singleshape = _UI.multiSelect.shapes.getSingleton();
            if (singleshape && singleshape.objType === 'ComponentInstance') clickTool('shaperesize');
        }

        updateCurrentGlyphWidth();
        // debug(' deleteShape - END\n');
    };

    _UI.multiSelect.shapes.align = function(edge) {
        // showToast('align ' + edge);
        let g = this.getGlyph();
        let gnum = g.shapes.length;
        g.alignShapes(edge);

        history_put('Aligned ' + gnum + ' shapes ' + edge);
    };

    // Wrapper functions

    _UI.multiSelect.shapes.changed = function() {
        for (let m=0; m<this.members.length; m++) {
            this.members[m].changed();
        }
    };

    // convert to name setter
    _UI.multiSelect.shapes.changeShapeName = function(n) {
 this.getSingleton().changeShapeName(n);
};

    _UI.multiSelect.shapes.updateShapePosition = function(dx, dy) {
 this.getGlyph().updateGlyphPosition(dx, dy);
};

    _UI.multiSelect.shapes.setShapePosition = function(nx, ny) {
 this.getGlyph().setGlyphPosition(nx, ny);
};

    _UI.multiSelect.shapes.updateShapeSize = function(dw, dh, ratioLock) {
        if (this.members.length === 1) this.members[0].updateShapeSize(dw, dh, ratioLock);
        else if (this.members.length > 1) this.getGlyph().updateGlyphSize(dw, dh, ratioLock);
    };

    _UI.multiSelect.shapes.setShapeSize = function(nw, nh, ratioLock) {
 this.getGlyph().setGlyphSize(nw, nh, ratioLock);
};

    _UI.multiSelect.shapes.rotate = function(angle, about) {
 this.getGlyph().rotate(angle, about);
};

    _UI.multiSelect.shapes.rotateable = function() {
        if (this.members.length === 1) return true;
        else return !this.contains(( 'ComponentInstance'));
    };

    _UI.multiSelect.shapes.flipNS = function(mid) {
 this.getGlyph().flipNS(mid);
};

    _UI.multiSelect.shapes.flipEW = function(mid) {
 this.getGlyph().flipEW(mid);
};

    _UI.multiSelect.shapes.getAttribute = function(attr) {
        if (this.members.length === 1) return this.members[0][attr];
        else if (this.members.length > 1) return this.getGlyph()[attr] || false;
        else return false;
    };

    _UI.multiSelect.shapes.isOverControlPoint = function(x, y, targetSize, noHandles) {
        if (this.members.length === 0) return false;
        let re = false;
        for (let m=0; m<this.members.length; m++) {
            re = this.members[m].isOverControlPoint(x, y, targetSize, noHandles);
            if (re) return re;
        }

        return false;
    };

    _UI.multiSelect.shapes.isOverBoundingBoxHandle = function(px, py) {
        // debug('\n SelectedShapes.isOverBoundingBoxHandle - START');
        // debug('\t passed x/y: ' + px + '/' + py);

        if (this.members.length === 0) {
            return false;
        } else if (this.members.length === 1) {
            // debug('\t calling singleton method');
            return this.members[0].isOverBoundingBoxHandle(px, py);
        }

        let c = isOverBoundingBoxHandle(px, py, this.getGlyph().maxes, _UI.multiSelectThickness);
        // debug('\t SelectedShapes.isOverBoundingBoxHandle returning ' + c);
        return c;
    };

    _UI.multiSelect.shapes.getCenter = function() {
 return this.getGlyph().center;
};

    // _UI.multiSelect.shapes.calcMaxes = function() {
    //     for (let m=0; m<this.members.length; m++) {
    //         this.members[m].calcMaxes();
    //     }
    // };

    _UI.multiSelect.shapes.getMaxes = function() {
        if (this.members.length === 1) return this.members[0].maxes;
        else return this.getGlyph().maxes;
    };

    _UI.multiSelect.shapes.drawShape = function(lctx, view) {
        let failed = false;
        let drewshape = false;
        for (let m=0; m<this.members.length; m++) {
            drewshape = this.members[m].drawShape(lctx, view);
            failed = failed || !drewshape;
        }

        return !failed;
    };

    _UI.multiSelect.shapes.draw_PathPoints = function() {
        // debug('\n MS.shapes.draw_PathPoints - START');
        let s;
        for (let m=0; m<this.members.length; m++) {
            s = this.members[m];
            // debug('\t drawing points on shape ' + m + ' as ' + s.path.pathPoints);
                if (s.objType !==  'ComponentInstance') draw_PathPoints(this.members[m].path.pathPoints);
        }

        // debug(' MS.shapes.draw_PathPoints - END\n');
    };

    _UI.multiSelect.shapes.reverseWinding = function() {
        for (let m=0; m<this.members.length; m++) {
            this.members[m].reverseWinding();
        }
    };

    _UI.multiSelect.shapes.draw_PathOutline = function() {
        if (this.members.length === 1) {
            this.members[0].draw_PathOutline();
        } else {
            for (let m=0; m<this.members.length; m++) {
                this.members[m].draw_PathOutline(false, _UI.multiSelectThickness);
            }
        }
    };

    _UI.multiSelect.shapes.draw_BoundingBox = function() {
        if (this.members.length === 1) {
            this.members[0].draw_BoundingBox();
        } else if (this.members.length > 1) {
            let bmaxes = clone(_UI.mins);

            for (let m=0; m<this.members.length; m++) {
                bmaxes = getOverallMaxes([bmaxes, this.members[m].maxes]);
            }

            draw_BoundingBox(bmaxes, _UI.colors.gray, _UI.multiSelectThickness);
        }
    };

    _UI.multiSelect.shapes.draw_RotationAffordance = function() {
        let ss;
        if (this.members.length === 1) {
            ss = this.members[0];
            let accent = ss.objType === 'ComponentInstance'? _UI.colors.green : _UI.colors.blue;
            draw_RotationAffordance(accent, false);
        } else if (this.members.length > 1) {
            ss = this.getGlyph();
            draw_RotationAffordance(_UI.colors.gray, _UI.multiSelectThickness);
        }
    };

    _UI.multiSelect.shapes.draw_BoundingBoxHandles = function() {
        if (this.members.length === 1) {
            this.members[0].draw_BoundingBoxHandles();
        } else if (this.members.length > 1) {
            let bmaxes = clone(_UI.mins);

            for (let m=0; m<this.members.length; m++) {
                bmaxes = getOverallMaxes([bmaxes, this.members[m].maxes]);
            }

            draw_BoundingBoxHandles(bmaxes, _UI.colors.gray, _UI.multiSelectThickness);
        }
    };
