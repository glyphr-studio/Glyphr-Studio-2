import _UI from '../app/settings.js';

/**
 Framework > Event Handlers > Mouse
 All the canvas mouse interaction and tool
 events for all pages can be found here.
 **/

_UI.eventhandlers = {
    'currtool': false,
    'tempnewbasicshape': false,
    'dragselectarea': false,
    'mousex': 0,
    'mousey': 0,
    'rotationcenter': false,
    'ismouseovercec': false,
    'corner': false,
    'toolhandoff': false,
    'lastx': -100,
    'lasty': -100,
    'firstx': -100,
    'firsty': -100,
    'uqhaschanged': false,
    'lastTool': 'pathedit',
    'isSpaceDown': false,
    'isShiftDown': false,
    'hoverpoint': false,
    'multi': false,
};

/* eslint-disable require-jsdoc */

function initEventHandlers() {
    // debug('\n initEventHandlers - START');

    _UI.eventhandlers.eh_pantool = new Tool_Pan();
    _UI.eventhandlers.eh_addrectoval = new Tool_NewBasicShape();
    _UI.eventhandlers.eh_shapeedit = new Tool_ShapeEdit();
    _UI.eventhandlers.eh_addpath = new Tool_NewPath();
    _UI.eventhandlers.eh_pathedit = new Tool_PathEdit();
    _UI.eventhandlers.eh_pathaddpoint = new Tool_PathAddPoint();
    _UI.eventhandlers.eh_slice = new Tool_Slice();
    _UI.eventhandlers.eh_kern = new Tool_Kern();

    // Mouse Event Listeners
    _UI.glyphEditCanvas.addEventListener('mousedown', ev_canvas, false);
    _UI.glyphEditCanvas.addEventListener('mousemove', ev_canvas, false);
    _UI.glyphEditCanvas.addEventListener('mouseup', ev_canvas, false);
    _UI.glyphEditCanvas.customguidetransparency = mouseovercec;
    _UI.glyphEditCanvas.onmouseout = mouseoutcec;
    _UI.glyphEditCanvas.addEventListener('wheel', mousewheel, false);
    if (document.getElementById('navarea_panel')) {
        document.getElementById('navarea_panel').addEventListener('wheel', function(ev) {
ev.stopPropagation();
}, false);
    }

    // Document Key Listeners
    getEditDocument().addEventListener('keypress', keypress, false);
    getEditDocument().addEventListener('keydown', keypress, false);
    getEditDocument().addEventListener('keyup', keyup, false);

    // The general-purpose event handler.
    function ev_canvas(ev) {
        // debug('EVENTHANDLER - Raw mouse event x/y = ' + ev.layerX + ' / ' + ev.layerY);
        mouseovercec();

        let eh = _UI.eventhandlers;

        if (ev.offsetX || ev.offsetX) {
            // IE, Chrome, (Opera?)
            eh.mousex = ev.offsetX;
            eh.mousey = ev.offsetY;
        } else if (ev.layerX || ev.layerX) {
            // Firefox
            eh.mousex = ev.layerX;
            eh.mousey = ev.layerY;
        }

        // debug('EV_CANVAS offsetx / offsety / layerx / layery: ' +  ev.offsetX + ' ' + ev.offsetY + ' ' + ev.layerX + ' ' + ev.layerY);

        // updateCursor();

        // Switch Tool function

        switch (_UI.selectedTool) {
            case 'pathedit': eh.currtool = eh.eh_pathedit; break;
            case 'shaperesize': eh.currtool = eh.eh_shapeedit; break;
            case 'pan': eh.currtool = eh.eh_pantool; break;
            case 'pathaddpoint': eh.currtool = eh.eh_pathaddpoint; break;
            case 'newpath': eh.currtool = eh.eh_addpath; break;
            case 'newrect': eh.currtool = eh.eh_addrectoval; break;
            case 'newoval': eh.currtool = eh.eh_addrectoval; break;
            case 'slice': eh.currtool = eh.eh_slice; break;
            case 'kern': eh.currtool = eh.eh_kern; break;
            case _UI.selectedTool: eh.currtool = eh.eh_pathedit;
        }

        // Call the event handler of the eh.currtool.
        eh.currtool[ev.type](ev);
    }
}


// ----------------------------------------------------------------
// Shape Resize - resizes whole shapes (Arrow / Pointer)
// ----------------------------------------------------------------
function Tool_ShapeEdit() {
    this.dragging = false;
    this.resizing = false;
    this.rotating = false;
    this.dragselecting = false;
    this.didstuff = false;
    this.clickedshape = false;
    _UI.eventhandlers.handle = false;

    this.mousedown = function(ev) {
        // debug('\n Tool_ShapeEdit.mousedown - START');
        // debug('\t x:y ' + _UI.eventhandlers.mousex + ':' + _UI.eventhandlers.mousey);

        this.didstuff = false;
        let eh = _UI.eventhandlers;
        eh.handle = false;
        eh.lastx = eh.mousex;
        eh.firstx = eh.mousex;
        eh.lasty = eh.mousey;
        eh.firsty = eh.mousey;

        this.clickedshape = getClickedShape(eh.mousex, eh.mousey);
        eh.handle = _UI.multiSelect.shapes.isOverBoundingBoxHandle(eh.mousex, eh.mousey);

        // debug('\t clickshape: ' + this.clickedshape);
        // debug('\t corner: ' + eh.handle);
        this.resizing = false;
        this.dragging = false;
        this.rotating = false;
        this.dragselecting = false;

        if (eh.handle) {
            if (eh.handle === 'rotate') {
                // debug('\t mousedown - setting rotating = true');
                this.rotating = true;
                eh.rotationcenter = _UI.multiSelect.shapes.getCenter();
                eh.rotationstarttopy = _UI.multiSelect.shapes.maxes.yMax + (_UI.rotateHandleHeight / getView().dz);
            } else {
                // debug('\t clicked on eh.handle: ' + eh.handle);
                this.resizing = true;
            }
            setCursor(eh.handle);
        } else if (this.clickedshape) {
            // debug('\t clicked on shape = true');
            this.dragging = true;
        } else if (!eh.multi) {
            // debug('\t clicked on nothing');
            clickEmptySpace();
            this.dragselecting = true;
            findAndCallHotspot(eh.mousex, eh.mousey);
        }

        redraw({calledBy: 'Event Handler Tool_ShapeEdit mousedown'});
    };

    this.mousemove = function(ev) {
        let eh = _UI.eventhandlers;
        this.didstuff = false;
        let corner = eh.handle || _UI.multiSelect.shapes.isOverBoundingBoxHandle(eh.mousex, eh.mousey);

        let dz = getView('Event Handler Tool_ShapeEdit mousemove').dz;
        let dx = ((eh.mousex-eh.lastx)/dz) || 0;
        let dy = ((eh.lasty-eh.mousey)/dz) || 0;

        if (this.dragging) {
            // debug('\n Tool_ShapeEdit.mousemove - dragging');
            let cur = 'arrowSquare';

            if (this.clickedshape) {
                if (eh.multi) _UI.multiSelect.shapes.add(this.clickedshape);
                else if (!_UI.multiSelect.shapes.isSelected(this.clickedshape)) {
                    _UI.multiSelect.shapes.select(this.clickedshape);
                }

                if (this.clickedshape.objType === 'ComponentInstance') clickTool('shaperesize');
                _UI.currentPanel = 'npAttributes';
            }

            let singleshape = _UI.multiSelect.shapes.getSingleton();

            if (singleshape) {
                cur = singleshape.isOverBoundingBoxHandle(eh.mousex, eh.mousey);
                if (!cur) cur = isOverShape(eh.mousex, eh.mousey)? 'arrowSquare' : 'arrow';
                dx = singleshape.xLock? 0 : dx;
                dy = singleshape.yLock? 0 : dy;
            }

            _UI.multiSelect.shapes.updateShapePosition(dx, dy);
            this.didstuff = true;
            setCursor(cur);
        } else if (this.resizing) {
            // debug('\n Tool_ShapeEdit.mousemove - resizing');
            eventHandler_ShapeResize();
            this.didstuff = true;
        } else if (this.rotating) {
            let a1 = calculateAngle({x: cx_sx(eh.mousex), y: cy_sy(eh.mousey)}, eh.rotationcenter),
                    a2 = calculateAngle({x: cx_sx(eh.lastx), y: cy_sy(eh.lasty)}, eh.rotationcenter);

            _UI.multiSelect.shapes.rotate(a1-a2, eh.rotationcenter);
            this.didstuff = true;
            setCursor('rotate');
        } else if (corner) {
            // debug('\n Tool_ShapeEdit.mousemove - corner ' + corner);
            // hovering over a corner
            setCursor(corner);
        } else if (eh.multi) {
            setCursor('arrowPlus');
        } else if (isOverShape(eh.mousex, eh.mousey)) {
            setCursor('arrowSquare');
        } else {
            // debug('\n Tool_ShapeEdit.mousemove - fallthrough else');
            setCursor('arrow');
        }

        checkForMouseOverHotspot(eh.mousex, eh.mousey);

        if (this.didstuff) {
            eh.lastx = eh.mousex;
            eh.lasty = eh.mousey;
            eh.uqhaschanged = true;
            redraw({calledBy: 'Event Handler Tool_ShapeEdit mousemove'});
        }
    };

    this.mouseup = function() {
        // debug('Mouse Up');
        let eh = _UI.eventhandlers;

        // New Basic Shape
        if (eh.tempnewbasicshape) {
            eh.tempnewbasicshape = false;
            eh.lastx = eh.firstx;
            eh.lasty = eh.firsty;
            eventHandler_ShapeResize();
        }

        // Clicked a shape to select
        if (this.clickedshape && !this.didstuff) {
            if (eh.multi) _UI.multiSelect.shapes.toggle(this.clickedshape);
            else _UI.multiSelect.shapes.select(this.clickedshape);

            if (this.clickedshape.objType === 'ComponentInstance') clickTool('shaperesize');
            else setCursor('arrowSquare');

            _UI.currentPanel = 'npAttributes';
        }

        // Resized a shape
        if (this.resizing || this.rotating) _UI.multiSelect.shapes.calcMaxes();
        updateCurrentGlyphWidth();

        // Finish Up
        this.clickedshape = false;
        this.didstuff = false;
        this.dragging = false;
        this.resizing = false;
        this.rotating = false;
        eh.handle = false;
        eh.lastx = -100;
        eh.lasty = -100;
        eh.firstx = -100;
        eh.firsty = -100;
        eh.rotationcenter = false;
        eh.rotationstarttopy = false;
        if (eh.uqhaschanged) history_put('Path Edit tool');
        eh.uqhaschanged = false;
        redraw({calledBy: 'Event Handler Tool_ShapeEdit mouseup'});
        // debug('EVENTHANDLER - after Tool_ShapeEdit Mouse Up REDRAW');
    };
}


// ----------------------------------------------------------------
// New Basic Shape - adds many points to a new path
// ----------------------------------------------------------------
function Tool_NewBasicShape() {
    this.dragging = false;

    this.mousedown = function(ev) {
        _UI.eventhandlers.tempnewbasicshape = {
            'xMax': cx_sx(_UI.eventhandlers.mousex),
            'xMin': cx_sx(_UI.eventhandlers.mousex),
            'yMax': cy_sy(_UI.eventhandlers.mousey),
            'yMin': cy_sy(_UI.eventhandlers.mousey),
        };

        let newshape = new Shape({'visible': false, 'name': '...'});
        newshape.path.maxes = _UI.eventhandlers.tempnewbasicshape;
        newshape = addShape(newshape);
        _UI.multiSelect.shapes.select(newshape);

        _UI.eventhandlers.firstx = cx_sx(_UI.eventhandlers.mousex);
        _UI.eventhandlers.firsty = cy_sy(_UI.eventhandlers.mousey);

        this.dragging = true;

        redraw({calledBy: 'Event Handler Tool_NewBasicShape mousedown'});
        // debug('Tool_NewBasicShape MOUSEDOWN - after REDRAW');
    };

    this.mousemove = function(ev) {
        if (_UI.eventhandlers.tempnewbasicshape) {
            _UI.eventhandlers.tempnewbasicshape.xMax = Math.max(_UI.eventhandlers.firstx, cx_sx(_UI.eventhandlers.mousex));
            _UI.eventhandlers.tempnewbasicshape.xMin = Math.min(_UI.eventhandlers.firstx, cx_sx(_UI.eventhandlers.mousex));
            _UI.eventhandlers.tempnewbasicshape.yMax = Math.max(_UI.eventhandlers.firsty, cy_sy(_UI.eventhandlers.mousey));
            _UI.eventhandlers.tempnewbasicshape.yMin = Math.min(_UI.eventhandlers.firsty, cy_sy(_UI.eventhandlers.mousey));

            _UI.eventhandlers.uqhaschanged = true;
            redraw({calledBy: 'Event Handler Tool_NewBasicShape mousemove'});
            // debug('Tool_NewBasicShape MOUSEMOVE past redraw');
        }
    };

    this.mouseup = function() {
        // prevent really small shapes
        let tnbs = _UI.eventhandlers.tempnewbasicshape;

        if ( (Math.abs(tnbs.xMax-tnbs.xMin) > _GP.projectSettings.pointsize) &&
            (Math.abs(tnbs.yMax-tnbs.yMin) > _GP.projectSettings.pointsize) ) {
            let count = (_UI.currentPage === 'components')? (countObjectKeys(_GP.components)) : getSelectedWorkItemShapes().length;
            let s = _UI.multiSelect.shapes.getSingleton();

            if (_UI.selectedTool==='newrect') {
                s.name = ('Rectangle ' + count);
                s.path = rectPathFromMaxes(tnbs);
            } else {
                s.name = ('Oval ' + count);
                s.path = ovalPathFromMaxes(tnbs);
            }

            s.visible = true;
            // updateCurrentGlyphWidth();
        } else {
            _UI.multiSelect.shapes.deleteShapes();
        }

        _UI.eventhandlers.firstx = -100;
        _UI.eventhandlers.firsty = -100;
        _UI.eventhandlers.tempnewbasicshape = false;
        history_put('New Basic Shape tool');
        _UI.eventhandlers.uqhaschanged = false;

        this.dragging = false;

        clickTool('pathedit');
    };
}


// ----------------------------------------------------------------
// New Path - adds many points to a new path (Pen Plus)
// ----------------------------------------------------------------
function Tool_NewPath() {
    this.dragging = false;
    this.firstpoint = true;
    this.currpt = {};
    this.newshape = false;

    this.mousedown = function(ev) {
        // debug('\n Tool_NewPath.mousedown - START');

        let eh = _UI.eventhandlers;
        let newpoint = new PathPoint({
            p: new Coord({x: cx_sx(eh.mousex), y: cy_sy(eh.mousey)}),
            h1: new Handle({point: new Coord({x: cx_sx(eh.mousex-100), y: cy_sy(eh.mousey)}), use: false}),
            h2: new Handle({point: new Coord({x: cx_sx(eh.mousex+100), y: cy_sy(eh.mousey)}), use: false}),
            type: 'flat',
        });

        if (this.firstpoint) {
            // make a new shape with the new pathpoint
            let count = (_UI.currentPage === 'components')? (countObjectKeys(_GP.components)) : getSelectedWorkItemShapes().length;
            this.newshape = addShape(new Shape({'name': ('Shape '+count), 'path': new Path()}));
            this.currpt = this.newshape.path.addPathPoint(newpoint);
        } else if (this.newshape) {
            let targetSize = _GP.projectSettings.pointsize/getView('Event Handler Tool_PathEdit.mousedown').dz;
            if (this.newshape.path.isOverFirstPoint(cx_sx(eh.mousex), cy_sy(eh.mousey), targetSize)) {
                // clicked on an existing control point in this path
                // if first point - close the path

                eh.toolhandoff = true;
                eh.eh_pathedit.dragging = true;
                eh.lastx = eh.mousex;
                eh.lasty = eh.mousey;
                _UI.multiSelect.points.select(this.newshape.path.pathPoints[0]);
                _UI.selectedTool = 'pathedit';

                this.dragging = false;
                this.firstpoint = false;
                this.currpt = {};

                redraw({calledBy: 'Event Handler Tool_NewPath mousedown'});
                return;
            }

            this.currpt = this.newshape.path.addPathPoint(newpoint);
            // _UI.multiSelect.points.select(this.currpt);
        }

        this.firstpoint = false;
        this.dragging = true;
        eh.lastx = eh.mousex;
        eh.lasty = eh.mousey;

        redraw({calledBy: 'Event Handler Tool_NewPath mousedown'});
        // debug(' Tool_NewPath.mousedown - END\n');
    };

    this.mousemove = function(ev) {
        let eh = _UI.eventhandlers;
        let targetSize = _GP.projectSettings.pointsize/getView('Event Handler Tool_PathEdit.mousedown').dz;

        if (this.dragging) {
            // avoid really small handles
            if ((Math.abs(this.currpt.p.x-cx_sx(eh.mousex)) > (_GP.projectSettings.pointsize*2)) ||
                (Math.abs(this.currpt.p.y-cy_sy(eh.mousey)) > (_GP.projectSettings.pointsize*2)) ) {
                this.currpt.h1.use = true;
                this.currpt.h2.use = true;
                this.currpt.h2.x = cx_sx(eh.mousex);
                this.currpt.h2.y = cy_sy(eh.mousey);
                this.currpt.makeSymmetric('h2');
            }

            setCursor('penCircle');
            eh.lastx = eh.mousex;
            eh.lasty = eh.mousey;
            eh.uqhaschanged = true;

            redraw({calledBy: 'Event Handler Tool_NewPath mousemove'});
        } else if (this.newshape && this.newshape.path.isOverFirstPoint(cx_sx(eh.mousex), cy_sy(eh.mousey), targetSize)) {
            setCursor('penSquare');
        } else {
            setCursor('penPlus');
        }
    };

    this.mouseup = function() {
        // debug('\n Tool_NewPath.mouseup - START');
        setCursor('penPlus');

        if (_UI.eventhandlers.uqhaschanged) {
            if (this.newshape) this.newshape.path.calcMaxes();
            updateCurrentGlyphWidth();
            // For new shape tools, mouse up always adds to the undo-queue
            history_put('New Path tool');
            _UI.eventhandlers.uqhaschanged = false;
            redraw({calledBy: 'Event Handler Tool_NewPath mouseup'});
        }

        this.dragging = false;
        this.firstpoint = false;
        this.currpt = {};
        _UI.eventhandlers.lastx = -100;
        _UI.eventhandlers.lasty = -100;
        // debug(' Tool_NewPath.mouseup - END\n');
    };
}


// ----------------------------------------------------------------
// Path Edit - selects points and moves points and handles (Pen)
// ----------------------------------------------------------------
function Tool_PathEdit() {
    this.dragging = false;
    this.controlpoint = false;

    this.mousedown = function(ev) {
        // debug('\n Tool_PathEdit.mousedown - START');
        let eh = _UI.eventhandlers;
        eh.lastx = eh.mousex;
        eh.lasty = eh.mousey;
        let targetSize = _GP.projectSettings.pointsize/getView('Event Handler Tool_PathEdit.mousedown').dz;
        this.controlpoint = getSelectedWorkItem().isOverControlPoint(cx_sx(eh.mousex), cy_sy(eh.mousey), targetSize, eh.multi);
        let s = getClickedShape(eh.mousex, eh.mousey);

        // debug(this.controlpoint);

        if (this.controlpoint) {
            this.dragging = true;
            if (this.controlpoint.type === 'p') {
                if (eh.multi) _UI.multiSelect.points.toggle(this.controlpoint.point);
                else if (!_UI.multiSelect.points.isSelected(this.controlpoint.point)) _UI.multiSelect.points.select(this.controlpoint.point);
                setCursor('penSquare');
            } else {
                _UI.multiSelect.points.handlesingleton = this.controlpoint.point;
                setCursor('penCircle');
            }

            // selectShapesThatHaveSelectedPoints();
        } else if (s) {
            clickEmptySpace();
            _UI.multiSelect.shapes.select(s);
        } else {
            _UI.multiSelect.shapes.calcMaxes();
            clickEmptySpace();
            findAndCallHotspot(eh.mousex, eh.mousey);
        }

        if (_UI.multiSelect.shapes.getMembers().length) _UI.currentPanel = 'npAttributes';
        redraw({calledBy: 'Event Handler Tool_PathEdit mousedown'});
        // debug(' Tool_PathEdit.mousedown - END\n');
    };

    this.mousemove = function(ev) {
        // debug('\n Tool_PathEdit.mousemove - START');
        let eh = _UI.eventhandlers;
        let sp = _UI.multiSelect.points;

        if (eh.toolhandoff) {
            eh.toolhandoff = false;
            this.controlpoint = {
                'type': 'h2',
                'point': sp.getSingleton(),
            };

            this.controlpoint.point.h2.use = true;
            this.controlpoint.point.h2.x = cx_sx(eh.mousex);
            this.controlpoint.point.h2.y = cy_sy(eh.mousey);
            _UI.multiSelect.points.handlesingleton = this.controlpoint.point;

            this.dragging = true;

            // debug('\t TOOLHANDOFF this.controlpoint = ');
            // debug(this.controlpoint);
        }

        if (this.dragging) {
            // debug('\t Dragging');


            // Moving points if mousedown
            let dz = getView('Event Handler Tool_PathEdit mousemove').dz;
            let dx = (eh.mousex-eh.lastx)/dz;
            let dy = (eh.lasty-eh.mousey)/dz;
            let cpt = this.controlpoint.type;

            if (this.controlpoint.type === 'p') setCursor('penSquare');
            else setCursor('penCircle');

            if (sp.getMembers().length === 1) {
                // debug('\t this.controlpoint.point ' + this.controlpoint.point);
                // debug('\t this.controlpoint.type ' + cpt);
                let cpx = this.controlpoint.point[cpt];
                if (cpx && cpx.xLock) dx = 0;
                if (cpx && cpx.yLock) dy = 0;
            }

            sp.getMembers().forEach(function(point, i) {
            // debug('\t UpdatePPP ' + cpt + '\t' + dx + '\t' + dy);
                if (ev.ctrlKey || ev.metaKey) return;
                point.updatePathPointPosition(cpt, dx, dy);
            });
            _UI.multiSelect.shapes.calcMaxes();

            eh.lastx = eh.mousex;
            eh.lasty = eh.mousey;
            eh.uqhaschanged = true;
            // selectShapesThatHaveSelectedPoints();
            redraw({calledBy: 'Event Handler Tool_PathEdit mousemove'});
        }

        checkForMouseOverHotspot(eh.mousex, eh.mousey);

        let targetSize = _GP.projectSettings.pointsize/getView('Event Handler Tool_PathEdit.mousedown').dz;
        let cp = _UI.multiSelect.shapes.isOverControlPoint(cx_sx(eh.mousex), cy_sy(eh.mousey), targetSize);
        if (cp.type === 'p') setCursor('penSquare');
        else if (_UI.multiSelect.points.isSelected(cp.point)) setCursor('penCircle');
        if (!cp && eh.multi) setCursor('penPlus');

        // debug(' Tool_PathEdit.mousemove - END\n');
    };

    this.mouseup = function() {
        // debug('\n Tool_PathEdit.mouseup - START');
        let eh = _UI.eventhandlers;
        this.dragging = false;
        this.controlpoint = false;
        eh.toolhandoff = false;
        _UI.multiSelect.points.handlesingleton = false;
        eh.lastx = -100;
        eh.lasty = -100;

        if (eh.uqhaschanged) {
            _UI.multiSelect.shapes.calcMaxes();
            updateCurrentGlyphWidth();
            history_put('Path Edit tool');
            eh.uqhaschanged = false;
            redraw({calledBy: 'Event Handler Tool_PathEdit mouseup'});
        }
        // debug(' Tool_PathEdit.mouseup - END\n');
    };
}


// ----------------------------------------------------------------
// Path Add Point - adds points to an existing path (Pen Plus)
// ----------------------------------------------------------------
function Tool_PathAddPoint() {
    this.addpoint = false;

    this.mousedown = function(ev) {
        let singleshape = _UI.multiSelect.shapes.getSingleton();
        let s = getClickedShape(_UI.eventhandlers.mousex, _UI.eventhandlers.mousey);

        if (this.addpoint && singleshape && singleshape.objType !==  'ComponentInstance') {
            let p = singleshape.path.insertPathPoint(this.addpoint.split, this.addpoint.point);
            if (p) _UI.multiSelect.points.select(p);
            history_put('Added point to path');
        } else if (s) {
            _UI.multiSelect.points.clear();
            if (_UI.eventhandlers.multi) _UI.multiSelect.shapes.add(s);
            else _UI.multiSelect.shapes.select(s);

            if (s.objType === 'ComponentInstance') clickTool('shaperesize');
            _UI.currentPanel = 'npAttributes';
        } else {
            _UI.selectedTool = 'newpath';
            _UI.eventhandlers.currtool = _UI.eventhandlers.eh_addpath;
            _UI.eventhandlers.currtool.dragging = true;
            _UI.eventhandlers.currtool.firstpoint = true;
            _UI.eventhandlers.currtool.mousedown(ev);
        }

        _UI.eventhandlers.hoverpoint = false;
        redraw({calledBy: 'Tool_PathAddPoint.mousedown'});
    };

    this.mousemove = function(ev) {
        let singleshape = _UI.multiSelect.shapes.getSingleton();
        if (singleshape) {
            let pt = singleshape.path.getClosestPointOnCurve({'x': cx_sx(_UI.eventhandlers.mousex), 'y': cy_sy(_UI.eventhandlers.mousey)});
            if (pt && pt.distance < 20) {
                this.addpoint = pt;
                let ptsize = _GP.projectSettings.pointsize;
                let ptx = makeCrisp(sx_cx(pt.x) - (ptsize/2));
                let pty = makeCrisp(sy_cy(pt.y) - (ptsize/2));
                openNotation(('x: ' + round(pt.x, 3) + '<br>y: ' + round(pt.y, 3)), ptx, pty);
                _UI.eventhandlers.hoverpoint = {'fill': _UI.colors.blue.l75, 'x': ptx, 'y': pty, 'size': ptsize};
            } else {
                this.addpoint = false;
                _UI.eventhandlers.hoverpoint = false;
                closeNotation();
            }
        } else {
            this.addpoint = false;
            _UI.eventhandlers.hoverpoint = false;
            closeNotation();
        }

        redraw({calledBy: 'Tool_PathAddPoint.mousemove', redrawPanels: false});
    };

    this.mouseup = function() {};
}


// ----------------------------------------------------------------
// Slice - cuts a shape along a certain line
// ----------------------------------------------------------------
function Tool_Slice() {
    this.mousedown = function(ev) {
        redraw({calledBy: 'Tool_PathAddPoint.mousedown'});
    };

    this.mousemove = function(ev) {
        redraw({calledBy: 'Tool_PathAddPoint.mousemove', redrawPanels: false});
    };

    this.mouseup = function() {};
}


// ----------------------------------------------------------------
// Pan - moves the canvas view
// ----------------------------------------------------------------
function Tool_Pan() {
    this.dragging = false;
    this.deltax = 0;
    this.deltay = 0;

    this.mousedown = function(ev) {
        // debug('PAN TOOL - mouse down: ' + _UI.eventhandlers.mousex + ':' + _UI.eventhandlers.mousey);
        let v = getView('Event Handler Tool_Pan mousedown');
        this.deltax = (_UI.eventhandlers.mousex-v.dx);
        this.deltay = (_UI.eventhandlers.mousey-v.dy);
        this.dragging = true;
    };

    this.mouseup = function() {
        // debug('PAN TOOL - Mouse Up');
        this.dragging = false;
        this.deltax = 0;
        this.deltay = 0;
    };

    this.mousemove = function(ev) {
        if (this.dragging) {
            // Moving shapes if mousedown
            setView({'dx': (_UI.eventhandlers.mousex-this.deltax), 'dy': (_UI.eventhandlers.mousey-this.deltay)});
            redraw({calledBy: 'Event Handler Tool_Pan mousemove', redrawPanels: false});
        }
    };
}


// ----------------------------------------------------------------
// Kern - moves the left kern group
// ----------------------------------------------------------------
function Tool_Kern() {
    this.dragging = false;
    this.deltax = 0;

    this.mousedown = function(ev) {
        // debug('Tool_Kern - mouse down: ' + _UI.eventhandlers.mousex + ':' + _UI.eventhandlers.mousey);
        let v = getView('Event Handler Tool_Kern mousedown');
        this.deltax = (_UI.eventhandlers.mousex);
        this.dragging = true;
    };

    this.mouseup = function() {
        // debug('Tool_Kern - Mouse Up');
        this.dragging = false;
        this.deltax = 0;
        history_put('Kern Adjustment: ' + getSelectedKern().value);
        // redraw({calledBy:'Kern.mouseup'});
    };

    this.mousemove = function(ev) {
        if (this.dragging) {
            // Moving shapes if mousedown
            let sk = getSelectedKern();
            let val = (1*sk.value);
            updateKernValue(getSelectedKernID(), round(val + (1*(_UI.eventhandlers.mousex - this.deltax)/getView().dz)));
            this.deltax = (_UI.eventhandlers.mousex);
            redraw({calledBy: 'Kern.mousemove', redrawPanels: false});
        }
    };
}


// Helper Functions

function clickEmptySpace() {
    _UI.multiSelect.points.clear();
    _UI.multiSelect.shapes.clear();
}

function eventHandler_ShapeResize() {
    // debug('\n eventHandler_ShapeResize - START');
    let s = _UI.multiSelect.shapes;
    let pcorner = _UI.eventhandlers.handle;
    // debug('\t handle ' + pcorner);

    let maxes = s.maxes;
    let mx = cx_sx(_UI.eventhandlers.mousex);
    let my = cy_sy(_UI.eventhandlers.mousey);
    let lx = cx_sx(_UI.eventhandlers.lastx);
    let ly = cy_sy(_UI.eventhandlers.lasty);
    let dh = (ly-my);
    let dw = (lx-mx);
    let rl = s.getAttribute('ratioLock');

    // debug('\t eventHandler_ShapeResize dw/dh/rl: ' + dw + '/' + dh + '/' + rl);

    // Check that the shape won't have negative dimensions
    if (mx >= maxes.xMax && maxes.xMax-maxes.xMin+dw < 2) dw=0;
    if (my >= maxes.yMax && maxes.yMax-maxes.yMin+dh < 2) dh=0;

    // Resize the shape
    switch (pcorner) {
        case 'n':
            if (canResize('n')) {
                setCursor('n-resize');
                s.updateShapeSize(0, dh*-1, rl);
            }
            break;

        case 'ne':
            if (canResize('ne')) {
                setCursor('ne-resize');
                s.updateShapeSize(dw*-1, dh*-1, rl);
            }
            break;

        case 'e':
            if (canResize('e')) {
                setCursor('e-resize');
                s.updateShapeSize(dw*-1, 0, rl);
            }
            break;

        case 'se':
            if (canResize('se')) {
                setCursor('se-resize');
                s.updateShapeSize(dw*-1, dh, rl);
                s.updateShapePosition(0, dh*-1);
            }
            break;

        case 's':
            if (canResize('s')) {
                setCursor('s-resize');
                s.updateShapePosition(0, dh*-1);
                s.updateShapeSize(0, dh, rl);
            }
            break;

        case 'sw':
            if (canResize('sw')) {
                setCursor('sw-resize');
                s.updateShapeSize(dw, dh, rl);
                s.updateShapePosition(dw*-1, dh*-1);
            }
            break;

        case 'w':
            if (canResize('w')) {
                setCursor('w-resize');
                s.updateShapeSize(dw, 0, rl);
                s.updateShapePosition(dw*-1, 0);
            }
            break;

        case 'nw':
            if (canResize('nw')) {
                setCursor('nw-resize');
                s.updateShapeSize(dw, dh*-1, rl);
                s.updateShapePosition(dw*-1, 0);
            }
            break;
    }

    // if(!_UI.eventhandlers.tempnewbasicshape) s.calcMaxes();

    // debug('eventHandler_ShapeResize - Done lx/rx/ty/by: ' + s.path.maxes.xMin + ',' + s.path.maxes.xMax + ',' + s.path.maxes.yMax + ',' + s.path.maxes.yMin);
}

function checkForMouseOverHotspot(x, y) {
    if (isHotspotHere(x, y)) {
        let hs = findAndUnderlineHotspot(x, y);
        setCursor('pointer');
        if (hs !== _UI.canvasHotSpotHovering) redraw({calledBy: 'checkForMouseOverHotspot', redrawPanels: false, redrawTools: false});
        _UI.canvasHotSpotHovering = hs;
    } else {
        if (_UI.canvasHotSpotHovering) redraw({calledBy: 'checkForMouseOverHotspot', redrawPanels: false, redrawTools: false});
        _UI.canvasHotSpotHovering = false;
    }
}

function updateTNBS(dx, dy, dw, dh) {
    // debug('updateTNBS dx/dy/dw/dh = '+dx+' '+dy+' '+dw+' '+dh);
    _UI.eventhandlers.tempnewbasicshape.xMin += (dx);
    _UI.eventhandlers.tempnewbasicshape.yMax += (dy);
    _UI.eventhandlers.tempnewbasicshape.xMax += (dw+dx);
    _UI.eventhandlers.tempnewbasicshape.yMin += (dh+dy);
}

function updateDragSelectArea(dx, dy, dw, dh) {
    // debug('updateDragSelectArea dx/dy/dw/dh = '+dx+' '+dy+' '+dw+' '+dh);
    _UI.eventhandlers.dragselectarea.xMin += (dx);
    _UI.eventhandlers.dragselectarea.yMax += (dy);
    _UI.eventhandlers.dragselectarea.xMax += (dw+dx);
    _UI.eventhandlers.dragselectarea.yMin += (dh+dy);
}

function canResize(pc) {
    let rl = _UI.multiSelect.shapes.getAttribute('ratioLock');
    let xl = _UI.multiSelect.shapes.getAttribute('xLock');
    let yl = _UI.multiSelect.shapes.getAttribute('yLock');
    let wl = _UI.multiSelect.shapes.getAttribute('wLock');
    let hl = _UI.multiSelect.shapes.getAttribute('hLock');
    let re = true;

    switch (pc) {
        case 'nw': re = rl? false : (!yl && !hl && !xl && !wl); break;
        case 'n': re = (!yl && !hl); break;
        case 'ne': re = rl? false : (!yl && !hl && !wl); break;
        case 'e': re = (!wl); break;
        case 'se': re = rl? false : (!hl && !wl); break;
        case 's': re = (!hl); break;
        case 'sw': re = rl? false : (!hl && !xl && !wl); break;
        case 'w': re = (!xl && !wl);
    }

    // debug('\t canResize ' + pc + ' returning ' + re);
    return re;
}

function mousewheel(event) {
    let delta = (event.deltaY*-1);
    // debug('MOUSEWHEEL - deltaY: ' + event.deltaY);

    let canzoom = onCanvasEditPage() && (document.getElementById('dialog_box').style.display !== 'block');

    if (canzoom) {
        if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            // debug('MOUSEWHEEL: canzoom=true and delta=' + delta );
            if (delta > 0) {
 viewZoom(1.1);
} else {
 viewZoom(0.9);
}
        }
    }
}
