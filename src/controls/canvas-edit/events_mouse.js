import { getCurrentProjectEditor } from '../../app/main.js';
import { accentColors } from '../../common/colors.js';
import { updateCursor } from './cursors.js';

/**
 Framework > Event Handlers > Mouse
 All the canvas mouse interaction and tool
 events for all pages can be found here.
 **/

export let eventHandlerData = {
  currentTool: false,
  tempNewBasicShape: false,
  dragSelectArea: false,
  mouseX: 0,
  mouseY: 0,
  rotationCenter: false,
  rotateHandleHeight: 40,
  isMouseOverCanvas: false,
  corner: false,
  toolHandoff: false,
  lastX: -100,
  lastY: -100,
  firstX: -100,
  firstY: -100,
  undoQueueHasChanged: false,
  lastTool: 'pathedit',
  isSpaceDown: false,
  isShiftDown: false,
  hoverPoint: false,
  multi: false,
};

/* eslint-disable require-jsdoc */

export function initEventHandlers(editCanvas) {
  // log('initEventHandlers', 'start');

  let editor = getCurrentProjectEditor();

  editor.eventHandlers.tool_pan = new Tool_Pan();
  editor.eventHandlers.tool_addRectOval = new Tool_NewBasicShape();
  editor.eventHandlers.tool_shapeEdit = new Tool_ShapeEdit();
  editor.eventHandlers.tool_addPath = new Tool_NewPath();
  editor.eventHandlers.tool_pathEdit = new Tool_PathEdit();
  editor.eventHandlers.tool_pathAddPoint = new Tool_PathAddPoint();
  editor.eventHandlers.tool_kern = new Tool_Kern();

  // Mouse Event Listeners
  editCanvas.addEventListener('mousedown', ev_canvas, false);
  editCanvas.addEventListener('mousemove', ev_canvas, false);
  editCanvas.addEventListener('mouseup', ev_canvas, false);
  editCanvas.customGuideTransparency = handleMouseOverCanvas;
  editCanvas.onmouseout = handleMouseLeaveCanvas;
  editCanvas.addEventListener('wheel', mousewheel, false);

  // TODO
  // Document Key Listeners
  // getEditDocument().addEventListener('keypress', keypress, false);
  // getEditDocument().addEventListener('keydown', keypress, false);
  // getEditDocument().addEventListener('keyup', keyup, false);

  // The general-purpose event handler.
  function ev_canvas(ev) {
    // log('EVENTHANDLER - Raw mouse event x/y = ' + ev.layerX + ' / ' + ev.layerY);
    let editor = getCurrentProjectEditor();
    handleMouseOverCanvas();

    let eh = eventHandlerData;

    if (ev.offsetX || ev.offsetX) {
      // IE, Chrome, (Opera?)
      eh.mouseX = ev.offsetX;
      eh.mouseY = ev.offsetY;
    } else if (ev.layerX || ev.layerX) {
      // Firefox
      eh.mouseX = ev.layerX;
      eh.mouseY = ev.layerY;
    }

    // log('EV_CANVAS offsetx / offsety / layerx / layery: ' +  ev.offsetX + ' ' + ev.offsetY + ' ' + ev.layerX + ' ' + ev.layerY);

    // updateCursor();

    // Switch Tool function

    switch (editor.selectedTool) {
      case 'pathedit':
        eh.currentTool = editor.eventHandlers.tool_pathEdit;
        break;
      case 'shaperesize':
        eh.currentTool = editor.eventHandlers.tool_shapeEdit;
        break;
      case 'pan':
        eh.currentTool = editor.eventHandlers.tool_pan;
        break;
      case 'pathaddpoint':
        eh.currentTool = editor.eventHandlers.tool_pathAddPoint;
        break;
      case 'newpath':
        eh.currentTool = editor.eventHandlers.tool_addPath;
        break;
      case 'newrect':
        eh.currentTool = editor.eventHandlers.tool_addRectOval;
        break;
      case 'newoval':
        eh.currentTool = editor.eventHandlers.tool_addRectOval;
        break;
      case 'kern':
        eh.currentTool = editor.eventHandlers.tool_kern;
        break;
      case editor.selectedTool:
        eh.currentTool = editor.eventHandlers.tool_pathEdit;
    }

    // Call the event handler of the eh.currentTool.
    eh.currentTool[ev.type](ev);
  }
}

function handleMouseOverCanvas() {
  // log('handleMouseOverCanvas', 'start');
  eventHandlerData.isMouseOverCanvas = true;
  updateCursor();
  // log('handleMouseOverCanvas', 'end');
}

function handleMouseLeaveCanvas() {
  // log('handleMouseLeaveCanvas', 'start');
  eventHandlerData.isMouseOverCanvas = false;
  // Fixes a Chrome cursor problem
  document.onselectstart = function () {};
  updateCursor();
  // log('handleMouseLeaveCanvas', 'end');
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
  eventHandlerData.handle = false;

  this.mousedown = function (ev) {
    // log('Tool_ShapeEdit.mousedown', 'start');
    // log('x:y ' + eventHandlerData.mouseX + ':' + eventHandlerData.mouseY);

    this.didstuff = false;
    let eh = eventHandlerData;
    eh.handle = false;
    eh.lastX = eh.mouseX;
    eh.firstX = eh.mouseX;
    eh.lastY = eh.mouseY;
    eh.firstY = eh.mouseY;

    this.clickedshape = getClickedShape(eh.mouseX, eh.mouseY);
    let editor = getCurrentProjectEditor();
    eh.handle = editor.multiSelect.shapes.isOverBoundingBoxHandle(
      eh.mouseX,
      eh.mouseY
    );

    // log('clickshape: ' + this.clickedshape);
    // log('corner: ' + eh.handle);
    this.resizing = false;
    this.dragging = false;
    this.rotating = false;
    this.dragselecting = false;

    if (eh.handle) {
      if (eh.handle === 'rotate') {
        // log('mousedown - setting rotating = true');
        this.rotating = true;
        eh.rotationCenter = editor.multiSelect.shapes.center;
        eh.rotationstarttopy =
          editor.multiSelect.shapes.maxes.yMax +
          editor.rotateHandleHeight / getView().dz;
      } else {
        // log('clicked on eh.handle: ' + eh.handle);
        this.resizing = true;
      }
      setCursor(eh.handle);
    } else if (this.clickedshape) {
      // log('clicked on shape = true');
      this.dragging = true;
    } else if (!eh.multi) {
      // log('clicked on nothing');
      clickEmptySpace();
      this.dragselecting = true;
      findAndCallHotspot(eh.mouseX, eh.mouseY);
    }

    redraw({ calledBy: 'Event Handler Tool_ShapeEdit mousedown' });
  };

  this.mousemove = function (ev) {
    let eh = eventHandlerData;
    this.didstuff = false;
    let corner =
      eh.handle ||
      editor.multiSelect.shapes.isOverBoundingBoxHandle(eh.mouseX, eh.mouseY);

    let dz = getView('Event Handler Tool_ShapeEdit mousemove').dz;
    let dx = (eh.mouseX - eh.lastX) / dz || 0;
    let dy = (eh.lastY - eh.mouseY) / dz || 0;

    if (this.dragging) {
      // log('Tool_ShapeEdit.mousemove - dragging');
      let cur = 'arrowSquare';

      if (this.clickedshape) {
        if (eh.multi) editor.multiSelect.shapes.add(this.clickedshape);
        else if (!editor.multiSelect.shapes.isSelected(this.clickedshape)) {
          editor.multiSelect.shapes.select(this.clickedshape);
        }

        if (this.clickedshape.objType === 'ComponentInstance')
          clickTool('shaperesize');
        editor.nav.panel = 'Attributes';
      }

      let singleshape = editor.multiSelect.shapessingleton;

      if (singleshape) {
        cur = singleshape.isOverBoundingBoxHandle(eh.mouseX, eh.mouseY);
        if (!cur)
          cur = isOverShape(eh.mouseX, eh.mouseY) ? 'arrowSquare' : 'arrow';
        dx = singleshape.xLock ? 0 : dx;
        dy = singleshape.yLock ? 0 : dy;
      }

      editor.multiSelect.shapes.updateShapePosition(dx, dy);
      this.didstuff = true;
      setCursor(cur);
    } else if (this.resizing) {
      // log('Tool_ShapeEdit.mousemove - resizing');
      eventHandler_ShapeResize();
      this.didstuff = true;
    } else if (this.rotating) {
      let a1 = calculateAngle(
          { x: cXsX(eh.mouseX), y: cYsY(eh.mouseY) },
          eh.rotationCenter
        ),
        a2 = calculateAngle(
          { x: cXsX(eh.lastX), y: cYsY(eh.lastY) },
          eh.rotationCenter
        );

      editor.multiSelect.shapes.rotate(a1 - a2, eh.rotationCenter);
      this.didstuff = true;
      setCursor('rotate');
    } else if (corner) {
      // log('Tool_ShapeEdit.mousemove - corner ' + corner);
      // hovering over a corner
      setCursor(corner);
    } else if (eh.multi) {
      setCursor('arrowPlus');
    } else if (isOverShape(eh.mouseX, eh.mouseY)) {
      setCursor('arrowSquare');
    } else {
      // log('Tool_ShapeEdit.mousemove - fallthrough else');
      setCursor('arrow');
    }

    checkForMouseOverHotspot(eh.mouseX, eh.mouseY);

    if (this.didstuff) {
      eh.lastX = eh.mouseX;
      eh.lastY = eh.mouseY;
      eh.undoQueueHasChanged = true;
      redraw({ calledBy: 'Event Handler Tool_ShapeEdit mousemove' });
    }
  };

  this.mouseup = function () {
    // log('Mouse Up');
    let eh = eventHandlerData;

    // New Basic Shape
    if (eh.tempNewBasicShape) {
      eh.tempNewBasicShape = false;
      eh.lastX = eh.firstX;
      eh.lastY = eh.firstY;
      eventHandler_ShapeResize();
    }

    // Clicked a shape to select
    if (this.clickedshape && !this.didstuff) {
      if (eh.multi) editor.multiSelect.shapes.toggle(this.clickedshape);
      else editor.multiSelect.shapes.select(this.clickedshape);

      if (this.clickedshape.objType === 'ComponentInstance')
        clickTool('shaperesize');
      else setCursor('arrowSquare');

      editor.nav.panel = 'Attributes';
    }

    // Resized a shape
    // if (this.resizing || this.rotating) editor.multiSelect.shapes.calcMaxes();
    updateCurrentGlyphWidth();

    // Finish Up
    this.clickedshape = false;
    this.didstuff = false;
    this.dragging = false;
    this.resizing = false;
    this.rotating = false;
    eh.handle = false;
    eh.lastX = -100;
    eh.lastY = -100;
    eh.firstX = -100;
    eh.firstY = -100;
    eh.rotationCenter = false;
    eh.rotationstarttopy = false;
    if (eh.undoQueueHasChanged) historyPut('Path Edit tool');
    eh.undoQueueHasChanged = false;
    redraw({ calledBy: 'Event Handler Tool_ShapeEdit mouseup' });
    // log('EVENTHANDLER - after Tool_ShapeEdit Mouse Up REDRAW');
  };
}

// ----------------------------------------------------------------
// New Basic Shape - adds many points to a new path
// ----------------------------------------------------------------
function Tool_NewBasicShape() {
  this.dragging = false;

  this.mousedown = function (ev) {
    eventHandlerData.tempNewBasicShape = {
      xMax: cXsX(eventHandlerData.mouseX),
      xMin: cXsX(eventHandlerData.mouseX),
      yMax: cYsY(eventHandlerData.mouseY),
      yMin: cYsY(eventHandlerData.mouseY),
    };

    let newshape = new Shape({ visible: false, name: '...' });
    newshape.path.maxes = eventHandlerData.tempNewBasicShape;
    newshape = addShape(newshape);
    let editor = getCurrentProjectEditor();
    editor.multiSelect.shapes.select(newshape);

    eventHandlerData.firstX = cXsX(eventHandlerData.mouseX);
    eventHandlerData.firstY = cYsY(eventHandlerData.mouseY);

    this.dragging = true;

    redraw({ calledBy: 'Event Handler Tool_NewBasicShape mousedown' });
    // log('Tool_NewBasicShape MOUSEDOWN - after REDRAW');
  };

  this.mousemove = function (ev) {
    if (eventHandlerData.tempNewBasicShape) {
      eventHandlerData.tempNewBasicShape.xMax = Math.max(
        eventHandlerData.firstX,
        cXsX(eventHandlerData.mouseX)
      );
      eventHandlerData.tempNewBasicShape.xMin = Math.min(
        eventHandlerData.firstX,
        cXsX(eventHandlerData.mouseX)
      );
      eventHandlerData.tempNewBasicShape.yMax = Math.max(
        eventHandlerData.firstY,
        cYsY(eventHandlerData.mouseY)
      );
      eventHandlerData.tempNewBasicShape.yMin = Math.min(
        eventHandlerData.firstY,
        cYsY(eventHandlerData.mouseY)
      );

      eventHandlerData.undoQueueHasChanged = true;
      redraw({ calledBy: 'Event Handler Tool_NewBasicShape mousemove' });
      // log('Tool_NewBasicShape MOUSEMOVE past redraw');
    }
  };

  this.mouseup = function () {
    // prevent really small shapes
    let tnbs = eventHandlerData.tempNewBasicShape;
    let editor = getCurrentProjectEditor();

    if (
      Math.abs(tnbs.xMax - tnbs.xMin) >
        getCurrentProject().projectSettings.pointSize &&
      Math.abs(tnbs.yMax - tnbs.yMin) >
        getCurrentProject().projectSettings.pointSize
    ) {
      let count =
        editor.nav.page === 'components'
          ? Object.keys(getCurrentProject().components).length
          : getSelectedWorkItemShapes().length;
      let s = editor.multiSelect.shapessingleton;

      if (editor.selectedTool === 'newrect') {
        s.name = 'Rectangle ' + count;
        s.path = rectPathFromMaxes(tnbs);
      } else {
        s.name = 'Oval ' + count;
        s.path = ovalPathFromMaxes(tnbs);
      }

      s.visible = true;
      // updateCurrentGlyphWidth();
    } else {
      editor.multiSelect.shapes.deleteShapes();
    }

    eventHandlerData.firstX = -100;
    eventHandlerData.firstY = -100;
    eventHandlerData.tempNewBasicShape = false;
    historyPut('New Basic Shape tool');
    eventHandlerData.undoQueueHasChanged = false;

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

  this.mousedown = function (ev) {
    // log('Tool_NewPath.mousedown', 'start');

    let eh = eventHandlerData;
    let newpoint = new PathPoint({
      p: { point: { x: cXsX(eh.mouseX), y: cYsY(eh.mouseY) } },
      h1: {
        point: { x: cXsX(eh.mouseX - 100), y: cYsY(eh.mouseY) },
        use: false,
      },
      h2: {
        point: { x: cXsX(eh.mouseX + 100), y: cYsY(eh.mouseY) },
        use: false,
      },
      type: 'flat',
    });

    if (this.firstpoint) {
      // make a new shape with the new pathpoint
      let count =
        editor.nav.page === 'components'
          ? Object.keys(getCurrentProject().components).length
          : getSelectedWorkItemShapes().length;
      this.newshape = addShape(
        new Shape({ name: 'Shape ' + count, path: new Path() })
      );
      this.currpt = this.newshape.path.addPathPoint(newpoint);
    } else if (this.newshape) {
      let targetSize =
        getCurrentProject().projectSettings.pointSize /
        getView('Event Handler Tool_PathEdit.mousedown').dz;
      if (
        this.newshape.path.isOverFirstPoint(
          cXsX(eh.mouseX),
          cYsY(eh.mouseY),
          targetSize
        )
      ) {
        // clicked on an existing control point in this path
        // if first point - close the path

        eh.toolHandoff = true;
        eh.tool_pathEdit.dragging = true;
        eh.lastX = eh.mouseX;
        eh.lastY = eh.mouseY;
        let editor = getCurrentProjectEditor();
        editor.multiSelect.points.select(this.newshape.path.pathPoints[0]);
        editor.selectedTool = 'pathedit';

        this.dragging = false;
        this.firstpoint = false;
        this.currpt = {};

        redraw({ calledBy: 'Event Handler Tool_NewPath mousedown' });
        return;
      }

      this.currpt = this.newshape.path.addPathPoint(newpoint);
      // editor.multiSelect.points.select(this.currpt);
    }

    this.firstpoint = false;
    this.dragging = true;
    eh.lastX = eh.mouseX;
    eh.lastY = eh.mouseY;

    redraw({ calledBy: 'Event Handler Tool_NewPath mousedown' });
    // log('Tool_NewPath.mousedown', 'end');
  };

  this.mousemove = function (ev) {
    let eh = eventHandlerData;
    let targetSize =
      getCurrentProject().projectSettings.pointSize /
      getView('Event Handler Tool_PathEdit.mousedown').dz;

    if (this.dragging) {
      // avoid really small handles
      if (
        Math.abs(this.currpt.p.x - cXsX(eh.mouseX)) >
          getCurrentProject().projectSettings.pointSize * 2 ||
        Math.abs(this.currpt.p.y - cYsY(eh.mouseY)) >
          getCurrentProject().projectSettings.pointSize * 2
      ) {
        this.currpt.h1.use = true;
        this.currpt.h2.use = true;
        this.currpt.h2.x = cXsX(eh.mouseX);
        this.currpt.h2.y = cYsY(eh.mouseY);
        this.currpt.makeSymmetric('h2');
      }

      setCursor('penCircle');
      eh.lastX = eh.mouseX;
      eh.lastY = eh.mouseY;
      eh.undoQueueHasChanged = true;

      redraw({ calledBy: 'Event Handler Tool_NewPath mousemove' });
    } else if (
      this.newshape &&
      this.newshape.path.isOverFirstPoint(
        cXsX(eh.mouseX),
        cYsY(eh.mouseY),
        targetSize
      )
    ) {
      setCursor('penSquare');
    } else {
      setCursor('penPlus');
    }
  };

  this.mouseup = function () {
    // log('Tool_NewPath.mouseup', 'start');
    setCursor('penPlus');

    if (eventHandlerData.undoQueueHasChanged) {
      // if (this.newshape) this.newshape.path.calcMaxes();
      updateCurrentGlyphWidth();
      // For new shape tools, mouse up always adds to the undo-queue
      historyPut('New Path tool');
      eventHandlerData.undoQueueHasChanged = false;
      redraw({ calledBy: 'Event Handler Tool_NewPath mouseup' });
    }

    this.dragging = false;
    this.firstpoint = false;
    this.currpt = {};
    eventHandlerData.lastX = -100;
    eventHandlerData.lastY = -100;
    // log('Tool_NewPath.mouseup', 'end');
  };
}

// ----------------------------------------------------------------
// Path Edit - selects points and moves points and handles (Pen)
// ----------------------------------------------------------------
function Tool_PathEdit() {
  this.dragging = false;
  this.controlpoint = false;

  this.mousedown = function (ev) {
    // log('Tool_PathEdit.mousedown', 'start');
    let eh = eventHandlerData;
    let editor = getCurrentProjectEditor();
    eh.lastX = eh.mouseX;
    eh.lastY = eh.mouseY;
    let targetSize =
      getCurrentProject().projectSettings.pointSize /
      getView('Event Handler Tool_PathEdit.mousedown').dz;
    this.controlpoint = getSelectedWorkItem().isOverControlPoint(
      cXsX(eh.mouseX),
      cYsY(eh.mouseY),
      targetSize,
      eh.multi
    );
    let s = getClickedShape(eh.mouseX, eh.mouseY);

    // log(this.controlpoint);

    if (this.controlpoint) {
      this.dragging = true;
      if (this.controlpoint.type === 'p') {
        if (eh.multi) editor.multiSelect.points.toggle(this.controlpoint.point);
        else if (!editor.multiSelect.points.isSelected(this.controlpoint.point))
          editor.multiSelect.points.select(this.controlpoint.point);
        setCursor('penSquare');
      } else {
        editor.multiSelect.points.handleSingleton = this.controlpoint.point;
        setCursor('penCircle');
      }

      // selectShapesThatHaveSelectedPoints();
    } else if (s) {
      clickEmptySpace();
      editor.multiSelect.shapes.select(s);
    } else {
      // editor.multiSelect.shapes.calcMaxes();
      clickEmptySpace();
      findAndCallHotspot(eh.mouseX, eh.mouseY);
    }

    if (editor.multiSelect.shapes.members.length)
      editor.nav.panel = 'Attributes';
    redraw({ calledBy: 'Event Handler Tool_PathEdit mousedown' });
    // log('Tool_PathEdit.mousedown', 'end');
  };

  this.mousemove = function (ev) {
    // log('Tool_PathEdit.mousemove', 'start');
    let eh = eventHandlerData;
    let editor = getCurrentProjectEditor();
    let sp = editor.multiSelect.points;

    if (eh.toolHandoff) {
      eh.toolHandoff = false;
      this.controlpoint = {
        type: 'h2',
        point: spsingleton,
      };

      this.controlpoint.point.h2.use = true;
      this.controlpoint.point.h2.x = cXsX(eh.mouseX);
      this.controlpoint.point.h2.y = cYsY(eh.mouseY);
      editor.multiSelect.points.handleSingleton = this.controlpoint.point;

      this.dragging = true;

      // log('toolHandoff this.controlpoint = ');
      // log(this.controlpoint);
    }

    if (this.dragging) {
      // log('Dragging');

      // Moving points if mousedown
      let dz = getView('Event Handler Tool_PathEdit mousemove').dz;
      let dx = (eh.mouseX - eh.lastX) / dz;
      let dy = (eh.lastY - eh.mouseY) / dz;
      let cpt = this.controlpoint.type;

      if (this.controlpoint.type === 'p') setCursor('penSquare');
      else setCursor('penCircle');

      if (sp.members.length === 1) {
        // log('this.controlpoint.point ' + this.controlpoint.point);
        // log('this.controlpoint.type ' + cpt);
        let cpx = this.controlpoint.point[cpt];
        if (cpx && cpx.xLock) dx = 0;
        if (cpx && cpx.yLock) dy = 0;
      }

      sp.members.forEach(function (point, i) {
        // log('UpdatePPP ' + cpt + '\t' + dx + '\t' + dy);
        if (ev.ctrlKey || ev.metaKey) return;
        point.updatePathPointPosition(cpt, dx, dy);
      });
      // editor.multiSelect.shapes.calcMaxes();

      eh.lastX = eh.mouseX;
      eh.lastY = eh.mouseY;
      eh.undoQueueHasChanged = true;
      // selectShapesThatHaveSelectedPoints();
      redraw({ calledBy: 'Event Handler Tool_PathEdit mousemove' });
    }

    checkForMouseOverHotspot(eh.mouseX, eh.mouseY);

    let targetSize =
      getCurrentProject().projectSettings.pointSize /
      getView('Event Handler Tool_PathEdit.mousedown').dz;
    let cp = editor.multiSelect.shapes.isOverControlPoint(
      cXsX(eh.mouseX),
      cYsY(eh.mouseY),
      targetSize
    );
    if (cp.type === 'p') setCursor('penSquare');
    else if (editor.multiSelect.points.isSelected(cp.point))
      setCursor('penCircle');
    if (!cp && eh.multi) setCursor('penPlus');

    // log('Tool_PathEdit.mousemove', 'end');
  };

  this.mouseup = function () {
    // log('Tool_PathEdit.mouseup', 'start');
    let eh = eventHandlerData;
    this.dragging = false;
    this.controlpoint = false;
    eh.toolHandoff = false;
    let editor = getCurrentProjectEditor();
    editor.multiSelect.points.handleSingleton = false;
    eh.lastX = -100;
    eh.lastY = -100;

    if (eh.undoQueueHasChanged) {
      // editor.multiSelect.shapes.calcMaxes();
      updateCurrentGlyphWidth();
      historyPut('Path Edit tool');
      eh.undoQueueHasChanged = false;
      redraw({ calledBy: 'Event Handler Tool_PathEdit mouseup' });
    }
    // log('Tool_PathEdit.mouseup', 'end');
  };
}

// ----------------------------------------------------------------
// Path Add Point - adds points to an existing path (Pen Plus)
// ----------------------------------------------------------------
function Tool_PathAddPoint() {
  this.addpoint = false;

  this.mousedown = function (ev) {
    let editor = getCurrentProjectEditor();
    let singleshape = editor.multiSelect.shapessingleton;
    let s = getClickedShape(eventHandlerData.mouseX, eventHandlerData.mouseY);

    if (
      this.addpoint &&
      singleshape &&
      singleshape.objType !== 'ComponentInstance'
    ) {
      let p = singleshape.path.insertPathPoint(
        this.addpoint.split,
        this.addpoint.point
      );
      if (p) editor.multiSelect.points.select(p);
      historyPut('Added point to path');
    } else if (s) {
      editor.multiSelect.points.clear();
      if (eventHandlerData.multi) editor.multiSelect.shapes.add(s);
      else editor.multiSelect.shapes.select(s);

      if (s.objType === 'ComponentInstance') clickTool('shaperesize');
      editor.nav.panel = 'Attributes';
    } else {
      editor.selectedTool = 'newpath';
      eventHandlerData.currentTool = eventHandlerData.tool_addPath;
      eventHandlerData.currentTool.dragging = true;
      eventHandlerData.currentTool.firstpoint = true;
      eventHandlerData.currentTool.mousedown(ev);
    }

    eventHandlerData.hoverPoint = false;
    redraw({ calledBy: 'Tool_PathAddPoint.mousedown' });
  };

  this.mousemove = function (ev) {
    let editor = getCurrentProjectEditor();
    let singleshape = editor.multiSelect.shapessingleton;
    if (singleshape) {
      let pt = singleshape.path.getClosestPointOnCurve({
        x: cXsX(eventHandlerData.mouseX),
        y: cYsY(eventHandlerData.mouseY),
      });
      if (pt && pt.distance < 20) {
        this.addpoint = pt;
        let ptsize = getCurrentProject().projectSettings.pointSize;
        let ptx = makeCrisp(sXcX(pt.x) - ptsize / 2);
        let pty = makeCrisp(sYcY(pt.y) - ptsize / 2);
        openNotation(
          'x: ' + round(pt.x, 3) + '<br>y: ' + round(pt.y, 3),
          ptx,
          pty
        );
        eventHandlerData.hoverPoint = {
          fill: accentColors.blue.l75,
          x: ptx,
          y: pty,
          size: ptsize,
        };
      } else {
        this.addpoint = false;
        eventHandlerData.hoverPoint = false;
        closeNotation();
      }
    } else {
      this.addpoint = false;
      eventHandlerData.hoverPoint = false;
      closeNotation();
    }

    redraw({ calledBy: 'Tool_PathAddPoint.mousemove', redrawPanels: false });
  };

  this.mouseup = function () {};
}

// ----------------------------------------------------------------
// Pan - moves the canvas view
// ----------------------------------------------------------------
function Tool_Pan() {
  this.dragging = false;
  this.deltax = 0;
  this.deltay = 0;

  this.mousedown = function (ev) {
    // log('PAN TOOL - mouse down: ' + eventHandlerData.mouseX + ':' + eventHandlerData.mouseY);
    let v = getView('Event Handler Tool_Pan mousedown');
    this.deltax = eventHandlerData.mouseX - v.dx;
    this.deltay = eventHandlerData.mouseY - v.dy;
    this.dragging = true;
  };

  this.mouseup = function () {
    // log('PAN TOOL - Mouse Up');
    this.dragging = false;
    this.deltax = 0;
    this.deltay = 0;
  };

  this.mousemove = function (ev) {
    if (this.dragging) {
      // Moving shapes if mousedown
      setView({
        dx: eventHandlerData.mouseX - this.deltax,
        dy: eventHandlerData.mouseY - this.deltay,
      });
      redraw({
        calledBy: 'Event Handler Tool_Pan mousemove',
        redrawPanels: false,
      });
    }
  };
}

// ----------------------------------------------------------------
// Kern - moves the left kern group
// ----------------------------------------------------------------
function Tool_Kern() {
  this.dragging = false;
  this.deltax = 0;

  this.mousedown = function (ev) {
    // log('Tool_Kern - mouse down: ' + eventHandlerData.mouseX + ':' + eventHandlerData.mouseY);
    let v = getView('Event Handler Tool_Kern mousedown');
    this.deltax = eventHandlerData.mouseX;
    this.dragging = true;
  };

  this.mouseup = function () {
    // log('Tool_Kern - Mouse Up');
    this.dragging = false;
    this.deltax = 0;
    historyPut('Kern Adjustment: ' + getSelectedKern().value);
    // redraw({calledBy:'Kern.mouseup'});
  };

  this.mousemove = function (ev) {
    if (this.dragging) {
      // Moving shapes if mousedown
      let sk = getSelectedKern();
      let val = 1 * sk.value;
      updateKernValue(
        getSelectedKernID(),
        round(
          val + (1 * (eventHandlerData.mouseX - this.deltax)) / getView().dz
        )
      );
      this.deltax = eventHandlerData.mouseX;
      redraw({ calledBy: 'Kern.mousemove', redrawPanels: false });
    }
  };
}

// Helper Functions

function clickEmptySpace() {
  let editor = getCurrentProjectEditor();
  editor.multiSelect.points.clear();
  editor.multiSelect.shapes.clear();
}

function eventHandler_ShapeResize() {
  // log('eventHandler_ShapeResize', 'start');
  let editor = getCurrentProjectEditor();
  let s = editor.multiSelect.shapes;
  let pcorner = eventHandlerData.handle;
  // log('handle ' + pcorner);

  let maxes = s.maxes;
  let mx = cXsX(eventHandlerData.mouseX);
  let my = cYsY(eventHandlerData.mouseY);
  let lx = cXsX(eventHandlerData.lastX);
  let ly = cYsY(eventHandlerData.lastY);
  let dh = ly - my;
  let dw = lx - mx;
  let rl = s.getAttribute('ratioLock');

  // log('eventHandler_ShapeResize dw/dh/rl: ' + dw + '/' + dh + '/' + rl);

  // Check that the shape won't have negative dimensions
  if (mx >= maxes.xMax && maxes.xMax - maxes.xMin + dw < 2) dw = 0;
  if (my >= maxes.yMax && maxes.yMax - maxes.yMin + dh < 2) dh = 0;

  // Resize the shape
  switch (pcorner) {
    case 'n':
      if (canResize('n')) {
        setCursor('n-resize');
        s.updateShapeSize(0, dh * -1, rl);
      }
      break;

    case 'ne':
      if (canResize('ne')) {
        setCursor('ne-resize');
        s.updateShapeSize(dw * -1, dh * -1, rl);
      }
      break;

    case 'e':
      if (canResize('e')) {
        setCursor('e-resize');
        s.updateShapeSize(dw * -1, 0, rl);
      }
      break;

    case 'se':
      if (canResize('se')) {
        setCursor('se-resize');
        s.updateShapeSize(dw * -1, dh, rl);
        s.updateShapePosition(0, dh * -1);
      }
      break;

    case 's':
      if (canResize('s')) {
        setCursor('s-resize');
        s.updateShapePosition(0, dh * -1);
        s.updateShapeSize(0, dh, rl);
      }
      break;

    case 'sw':
      if (canResize('sw')) {
        setCursor('sw-resize');
        s.updateShapeSize(dw, dh, rl);
        s.updateShapePosition(dw * -1, dh * -1);
      }
      break;

    case 'w':
      if (canResize('w')) {
        setCursor('w-resize');
        s.updateShapeSize(dw, 0, rl);
        s.updateShapePosition(dw * -1, 0);
      }
      break;

    case 'nw':
      if (canResize('nw')) {
        setCursor('nw-resize');
        s.updateShapeSize(dw, dh * -1, rl);
        s.updateShapePosition(dw * -1, 0);
      }
      break;
  }

  // if(!eventHandlerData.tempNewBasicShape) s.calcMaxes();

  // log('eventHandler_ShapeResize - Done lx/rx/ty/by: ' + s.path.maxes.xMin + ',' + s.path.maxes.xMax + ',' + s.path.maxes.yMax + ',' + s.path.maxes.yMin);
}

function checkForMouseOverHotspot(x, y) {
  if (isHotspotHere(x, y)) {
    let hs = findAndUnderlineHotspot(x, y);
    setCursor('pointer');
    if (hs !== eventHandlerData.canvasHotSpotHovering)
      redraw({
        calledBy: 'checkForMouseOverHotspot',
        redrawPanels: false,
        redrawTools: false,
      });
    eventHandlerData.canvasHotSpotHovering = hs;
  } else {
    if (eventHandlerData.canvasHotSpotHovering)
      redraw({
        calledBy: 'checkForMouseOverHotspot',
        redrawPanels: false,
        redrawTools: false,
      });
    eventHandlerData.canvasHotSpotHovering = false;
  }
}

function updateTNBS(dx, dy, dw, dh) {
  // log('updateTNBS dx/dy/dw/dh = '+dx+' '+dy+' '+dw+' '+dh);
  eventHandlerData.tempNewBasicShape.xMin += dx;
  eventHandlerData.tempNewBasicShape.yMax += dy;
  eventHandlerData.tempNewBasicShape.xMax += dw + dx;
  eventHandlerData.tempNewBasicShape.yMin += dh + dy;
}

function updateDragSelectArea(dx, dy, dw, dh) {
  // log('updateDragSelectArea dx/dy/dw/dh = '+dx+' '+dy+' '+dw+' '+dh);
  eventHandlerData.dragSelectArea.xMin += dx;
  eventHandlerData.dragSelectArea.yMax += dy;
  eventHandlerData.dragSelectArea.xMax += dw + dx;
  eventHandlerData.dragSelectArea.yMin += dh + dy;
}

function canResize(pc) {
  let editor = getCurrentProjectEditor();
  let rl = editor.multiSelect.shapes.getAttribute('ratioLock');
  let xl = editor.multiSelect.shapes.getAttribute('xLock');
  let yl = editor.multiSelect.shapes.getAttribute('yLock');
  let wl = editor.multiSelect.shapes.getAttribute('wLock');
  let hl = editor.multiSelect.shapes.getAttribute('hLock');
  let re = true;

  switch (pc) {
    case 'nw':
      re = rl ? false : !yl && !hl && !xl && !wl;
      break;
    case 'n':
      re = !yl && !hl;
      break;
    case 'ne':
      re = rl ? false : !yl && !hl && !wl;
      break;
    case 'e':
      re = !wl;
      break;
    case 'se':
      re = rl ? false : !hl && !wl;
      break;
    case 's':
      re = !hl;
      break;
    case 'sw':
      re = rl ? false : !hl && !xl && !wl;
      break;
    case 'w':
      re = !xl && !wl;
  }

  // log('canResize ' + pc + ' returning ' + re);
  return re;
}

function mousewheel(event) {
  let delta = event.deltaY * -1;
  // log('MOUSEWHEEL - deltaY: ' + event.deltaY);

  let canzoom =
    onCanvasEditPage() &&
    document.getElementById('dialog_box').style.display !== 'block';

  if (canzoom) {
    if (event.ctrlKey || event.metaKey) {
      event.preventDefault();
      // log('MOUSEWHEEL: canzoom=true and delta=' + delta );
      if (delta > 0) {
        viewZoom(1.1);
      } else {
        viewZoom(0.9);
      }
    }
  }
}
