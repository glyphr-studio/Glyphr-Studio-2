import { getCurrentProjectEditor } from '../../../app/main.js';
import { accentColors, uiColors } from '../../../common/colors.js';
import { makeElement } from '../../../common/dom.js';
import { log } from '../../../common/functions.js';
import { setCursor } from '../cursors.js';
import { eventHandlerData } from '../events_mouse.js';


// --------------------------------------------------------------
// Making tool buttons
// --------------------------------------------------------------
export function makeEditToolsButtons() {
	// log('update_ToolsArea', 'start');
	let editor = getCurrentProjectEditor();

	if (!editor.onCanvasEditPage()) {
		// log('returning, !onCanvasEditPage');
		return '';
	}

	if (!editor.selectedWorkItemID) {
		// log('returning, !selectedWorkItemID');
		return '';
	}

	// All the various permutations of states
	let penClickable = true;
	let penAddPointClickable = true;
	let isSelected = false;
	const hasComponentInstance = editor.multiSelect.shapes.contains('ComponentInstance');

	if (editor.selectedTool === 'pathEdit') {
		pathEditClass = 'button__call-to-action';
	} else if (hasComponentInstance) {
		pathEditClass = 'button__disabled';
		penClickable = false;
		penAddPointClickable = false;
	}

	if (editor.selectedTool === 'pathAddPoint') {
		pathAddPointClass = 'button__call-to-action';
	} else if (hasComponentInstance) {
		pathAddPointClass = 'button__disabled';
		penClickable = false;
		penAddPointClickable = false;
	}

	if (editor.multiSelect.shapes.count() > 1) {
		pathAddPointClass = 'button__disabled';
		penAddPointClickable = false;
	}

	// newRectangle
	isSelected = (editor.selectedTool === 'newRectangle');
	let newRectangle = makeElement({
		tag: 'button',
		title: 'New rectangle',
		className: 'canvas-edit__tool',
		innerHTML: makeToolButton({name: 'tool_newRectangle', selected: isSelected})
	});
	newRectangle.addEventListener('click', () => clickTool('newRectangle'));
	if(isSelected) newRectangle.classList.add('button__call-to-action');

	// newOval
	isSelected = (editor.selectedTool === 'newOval');
	let newOval = makeElement({
		tag: 'button',
		title: 'New oval',
		className: 'canvas-edit__tool',
		innerHTML: makeToolButton({name: 'tool_newOval', selected: isSelected})
	});
	newOval.addEventListener('click', () => clickTool('newOval'));
	if(isSelected) newOval.classList.add('button__call-to-action');

	// newPath
	isSelected = (editor.selectedTool === 'newPath');
	let newPath = makeElement({
		tag: 'button',
		title: 'New path',
		className: 'canvas-edit__tool',
		innerHTML: makeToolButton({name: 'tool_newPath', selected: isSelected})
	});
	newPath.addEventListener('click', () => clickTool('newPath'));
	if(isSelected) newPath.classList.add('button__call-to-action');


	// pathAddPoint
	isSelected = (editor.selectedTool === 'pathAddPoint');
	let pathAddPoint = makeElement({
		tag: 'button',
		title: 'Add path point',
		className: 'canvas-edit__tool',
		innerHTML: makeToolButton({name: 'tool_penPlus', selected: isSelected, disabled: !penAddPointClickable})
	});
	if(penAddPointClickable) pathAddPoint.addEventListener('click', () => clickTool('pathAddPoint'));
	if(isSelected) pathAddPoint.classList.add('button__call-to-action');

	// pathEdit
	isSelected = (editor.selectedTool === 'pathEdit');
	let pathEdit = makeElement({
		tag: 'button',
		title: 'Path edit',
		className: 'canvas-edit__tool',
		innerHTML: makeToolButton({name: 'tool_pen', selected: isSelected, disabled: !penClickable})
	});
	pathEdit.addEventListener('click', () => clickTool('pathEdit'));
	if(isSelected) pathEdit.classList.add('button__call-to-action');

	// shapeResize
	isSelected = (editor.selectedTool === 'shapeResize');
	let shapeResize = makeElement({
		tag: 'button',
		title: 'Shape edit',
		className: 'canvas-edit__tool',
		innerHTML: makeToolButton({name: 'tool_arrow', selected: isSelected, disabled: !penClickable})
	});
	shapeResize.addEventListener('click', () => clickTool('shapeResize'));
	if(isSelected) shapeResize.classList.add('button__call-to-action');

	// Done editing path
	let finishPath = makeElement({
		tag: 'button',
		className: 'button__call-to-action',
		title: 'Done editing path',
		content: 'Done editing path'
	});
	finishPath.addEventListener('click', () => clickTool('pathEdit'));


	// Put it all together
	let content = makeElement();

	const onGlyphEditPage = editor.nav.page === 'Glyph edit';
	const onComponentPage = editor.nav.page === 'Components';
	const onLigaturesPage = editor.nav.page === 'Ligatures';
	const selectedWorkItem = editor.selectedWorkItem;

	if (onGlyphEditPage || onLigaturesPage) {
		content.appendChild(newRectangle);
		content.appendChild(newOval);
		content.appendChild(newPath);
	}

	if (onComponentPage && selectedWorkItem && !selectedWorkItem.shape) {
		content.appendChild(newRectangle);
		content.appendChild(newOval);
		content.appendChild(newPath);
	}

	if (onGlyphEditPage || onComponentPage || onLigaturesPage) {
		content.appendChild(pathAddPoint);
		content.appendChild(pathEdit);
		content.appendChild(shapeResize);
		if (editor.selectedTool === 'newPath') {
			content.appendChild(finishPath);
		}
	}

	// log('update_ToolsArea', 'end');
	return content;
}

export function makeKernToolsButtons() {
	// Kern
	const kern =
		'<button title="kern" class="' +
		(st === 'kern' ? 'button__call-to-action ' : ' ') +
		'tool" onclick="clickTool(\'kern\');"/>' +
		makeToolButton({ name: 'tool_kern', selected: st === 'kern' }) +
		'</button>';
}

export function makeContextGlyphControls() {
	// Context Glyphs
	let ctxg = '<div class="contextglyphsarea">';
	ctxg += '<div id="contextglyphsoptions">';
	ctxg +=
		'<b>Context Glyphs</b> are letters you can display around the glyph you are currently editing.<br><br>';
	ctxg += checkUI(
		'getCurrentProject().projectSettings.showContextGlyphGuides',
		getCurrentProject().projectSettings.showContextGlyphGuides,
		true
	);
	ctxg +=
		'<label style="margin-left:10px; position:relative; top:-6px;" for="showContextGlyphGuides">show guides</label><br>';
	ctxg +=
		'glyph ' +
		sliderUI(
		'contextGlyphTransparency',
		'contextGlyphTransparency_dropdown',
		true,
		false
		);
	ctxg += '<br/>';
	ctxg +=
		'guide ' +
		sliderUI(
		'systemGuideTransparency',
		'systemGuideTransparency_dropdown',
		true,
		false
		);
	ctxg += '</div>';
	ctxg +=
		'<input type="text" id="contextglyphsinput" oninput="updateContextGlyphs();" ';
	ctxg += 'onblur="_UI.focusElement = false;" onmouseover="mouseoutcec();" ';
	ctxg +=
		'title="context glyphs\ndisplay glyphs before or after the currently-selected glyph" ';
	ctxg += 'value="' + getContextGlyphString() + '"/>';
	ctxg +=
		'<button id="contextglyphsoptionsbutton" onclick="showCtxGlyphsOptions();">&#x23F7;</button>';
	ctxg += '</div>';
}

export function makeViewToolsButtons() {
	let content = '';
	// Pan
	content += `
		<button
			title="scroll and pan"
			class="${(st === 'pan' ? 'button__call-to-action ' : ' ')} tool"
			onclick="clickTool('pan');"
		/>
		${makeToolButton({ name: 'tool_pan', selected: st === 'pan' })}
		</button>
	`;
	content += '<span style="width:15px; display:inline-block;">&nbsp;</span>';

	// Zoom
	content += `
		<button
			title="zoom: one to one"
			class="tool"
			onclick="setView({dz:1});redraw({calledBy:\'updatetools\'});"
		>
		${makeToolButton({ name: 'tool_zoom1to1' })}
		</button>
	`;

	content += `
		<button
			title="zoom: fit to screen"
			class="tool"
			onclick="fitViewToContextGlyphs(); redraw({calledBy:\'updatetools\'});"
		>
		${makeToolButton({ name: 'tool_zoomEm' })}
		</button>
	`;

	content += `
		<input
			type="number"
			title="zoom level"
			class="zoomreadout"
			value="${round(getView('updatetools').dz * 100, 2)}"
			onchange="setViewZoom(this.value);"
		/>
	`;

	content += `
		<button
			title="zoom: in"
			class="tool"
			onclick="viewZoom(1.1, true);"
		>
		${makeToolButton({ name: 'tool_zoomIn' })}
		</button>
	`;

	content += `
		<button
			title="zoom: out"
			class="tool"
			onclick="viewZoom(.9, true);"
		>
		${makeToolButton({ name: 'tool_zoomOut' })}
		</button>
	`;

	return makeElement({content: content});
}

export function clickTool(ctool) {
	log('clickTool', 'start');
	let editor = getCurrentProjectEditor();
	editor.selectedTool = ctool;

	log('passed: ' + ctool + ' and editor.selectedTool now is: ' + editor.selectedTool);

	editor.eventHandlers.tool_addPath.firstpoint = true;
	editor.eventHandlers.multi = false;

	if (ctool === 'newRectangle') {
		setCursor('crosshairsSquare');
		clickEmptySpace();
	} else if (ctool === 'newOval') {
		setCursor('crosshairsCircle');
		clickEmptySpace();
	} else if (ctool === 'newPath') {
		setCursor('penPlus');
		clickEmptySpace();
	} else if (ctool === 'pathEdit') {
		setCursor('pen');
	} else if (ctool === 'shapeResize') {
		setCursor('arrow');
	}

	eventHandlerData.hoverPoint = false;
	// closeNotation();
	// updateCursor();

	editor.editCanvas.redraw({ calledBy: 'clicktool', redrawPanels: false });
	log('clickTool', 'end');
}


//	-----------------
//	Button Functions
//	-----------------
export function addShape(newShape){
	// debug('addShape - START');
	// debug('\t name: ' + newShape.name);
	// debug('\t objtype: ' + newShape.objtype);

	if(newShape){
		if(newShape.objtype === 'componentinstance'){
			// debug('\t is a Component instance');
			_UI.selectedToolName = 'shapeResize';
		} else if(newShape.path && (_UI.selectedToolName === 'shapeResize')) {
			// debug('\t triggered as true: newShape.path && _UI.selectedToolName == shapeResize \n\t NOT calling calcmaxes, okay?');
			//newShape.calcMaxes();
		}
	} else {
		// debug('\t passed null, creating new shape.');
		newShape = new Shape({});
		newShape.name = ('Rectangle ' + ((getSelectedWorkItemShapes().length*1)+1));
	}

	let sg = getSelectedWorkItem();

	sg.shapes.push(newShape);
	_UI.ms.shapes.select(newShape);
	sg.changed();

	_UI.current_panel = 'npAttributes';

	// debug('\t returns: ' + newShape.name);
	// debug('addShape - END\n');
	return newShape;
}

export function addBasicShape(type){
	let hd = 50;
	let th = 500;
	let tw = 300;
	let newShape = new Shape({});
	let parr = false;
	let shapetype = 'Shape ';
	let p1,p2,p3,p4;

	if(type === 'oval'){
		p1 = new PathPoint({'P':new Coord({'x':0,'y':(th/2)}), 'H1':new Coord({'x':0,'y':hd}), 'H2':new Coord({'x':0,'y':(th-hd)}), 'type':'symmetric'});
		p2 = new PathPoint({'P':new Coord({'x':(tw/2),'y':th}), 'H1':new Coord({'x':hd,'y':th}), 'H2':new Coord({'x':(tw-hd),'y':th}), 'type':'symmetric'});
		p3 = new PathPoint({'P':new Coord({'x':tw,'y':(th/2)}), 'H1':new Coord({'x':tw,'y':(th-hd)}), 'H2':new Coord({'x':tw,'y':hd}), 'type':'symmetric'});
		p4 = new PathPoint({'P':new Coord({'x':(tw/2),'y':0}), 'H1':new Coord({'x':(tw-hd),'y':0}), 'H2':new Coord({'x':hd,'y':0}), 'type':'symmetric'});
		parr = [p1,p2,p3,p4];
		shapetype = 'Oval ';
	} else {
		p1 = new PathPoint({'P':new Coord({'x':0,'y':0}), 'H1':new Coord({'x':hd,'y':0}), 'H2':new Coord({'x':0,'y':hd})});
		p2 = new PathPoint({'P':new Coord({'x':0,'y':th}), 'H1':new Coord({'x':0,'y':(th-hd)}), 'H2':new Coord({'x':hd,'y':th})});
		p3 = new PathPoint({'P':new Coord({'x':tw,'y':th}), 'H1':new Coord({'x':(tw-hd),'y':th}), 'H2':new Coord({'x':tw,'y':(th-hd)})});
		p4 = new PathPoint({'P':new Coord({'x':tw,'y':0}), 'H1':new Coord({'x':tw,'y':hd}), 'H2':new Coord({'x':(tw-hd),'y':0})});
		parr = [p1,p2,p3,p4];
		shapetype = 'Rectangle ';
	}

	newShape.path = new Path({'pathpoints':parr});
	newShape.name = (shapetype + getSelectedWorkItemShapes().length+1);

	getSelectedWorkItemShapes().push(newShape);
	_UI.ms.shapes.select(newShape);
	updateCurrentGlyphWidth();
}

export function turnSelectedShapeIntoAComponent(){
	let s = clone(_UI.ms.shapes.getMembers(), 'turnSelectedShapeIntoAComponent');
	let n = s.length === 1? ('Component ' + s[0].name) : ('Component ' + (getLength(_GP.components)+1));

	_UI.ms.shapes.deleteShapes();
	let newid = createNewComponent(new Glyph({'shapes':s, 'name':n}));
	insertComponentInstance(newid);
	_UI.selectedToolName = 'shapeResize';
	selectShape(getSelectedWorkItemShapes().length-1);
	redraw({calledby:'turnSelectedShapeIntoAComponent'});
}

export function getShapeAtLocation(x,y){
	log(`getShapeAtLocation`, 'start');
	log('checking x:' + x + ' y:' + y);

	let shape;
	let editor = getCurrentProjectEditor();
	let sws = editor.selectedWorkItem?.shapes;
	log(sws);
	for(let j=(sws.length-1); j>=0; j--){
		shape = sws[j];
		log('Checking shape ' + j);

		if(isThisShapeHere(shape, x, y)){
			return shape;
		}
	}

	// clickEmptySpace();
	log(`getShapeAtLocation`, 'end');
	return false;
}

function isThisShapeHere(shape, px, py) {
	let editor = getCurrentProjectEditor();
	let gctx = editor.ghostCTX;

	gctx.clearRect(0,0,editor.canvasSize, editor.canvasSize);
	gctx.fillStyle = 'rgba(0,0,255,0.2)';
	gctx.beginPath();
	shape.drawShape(gctx, editor.view);
	gctx.closePath();
	gctx.fill();

	let imageData = gctx.getImageData(px, py, 1, 1);
	// debug('ISHERE? alpha = ' + imageData.data[3] + '  returning: ' + (imageData.data[3] > 0));
	return (imageData.data[3] > 0);
}


//	---------------------
//	Tools buttons graphics
//	---------------------
let white = uiColors.offwhite;
let black = uiColors.enabled.resting.text;
let icons = {};

export function makeToolButton(oa) {
	log(`makeToolButton`, 'start');
	log(`oa.name: ${oa.name}`);
	let colorOutline = accentColors.blue.l75;
	let colorFill = accentColors.gray.l40;
	let icon = icons[oa.name];

	if (oa.selected) {
		colorOutline = black;
		colorFill = white;
	} else if (oa.disabled) {
		colorOutline = accentColors.gray.l40;
		colorFill = accentColors.gray.l30;
	}

	let innerHTML = '';
	if (icon.fill) {
		innerHTML += `
			<g pointer-events="none" fill="${colorFill}">
			${icon.fill}
			</g>
		`;
	}

	innerHTML += `
		<g pointer-events="none" fill="${colorOutline}">
		${icon.outline}
		</g>
	`;

	let content = `
		<svg
			version="1.1"
			xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
			x="0px" y="0px" width="20px" height="30px" viewBox="0 0 20 20"
		>
			${innerHTML}
		</svg>
	`;

	log(`makeToolButton`, 'end');
	return content;
}

icons.tool_arrow = {
	fill:`
		<rect x="11" y="14" width="1" height="4"></rect>
		<rect x="12" y="16" width="1" height="2"></rect>
		<rect x="9" y="12" width="1" height="2"></rect>
		<rect x="5" y="3" width="2" height="1"></rect>
		<rect x="10" y="7" width="1" height="9"></rect>
		<rect x="5" y="6" width="5" height="6"></rect>
		<rect x="12" y="9" width="1" height="3"></rect>
		<rect x="11" y="8" width="1" height="4"></rect>
		<rect x="14" y="11" width="1" height="1"></rect>
		<rect x="13" y="10" width="1" height="2"></rect>
		<rect x="5" y="15" width="1" height="1"></rect>
		<rect x="5" y="2" width="1" height="1"></rect>
		<rect x="5" y="14" width="2" height="1"></rect>
		<rect x="5" y="13" width="3" height="1"></rect>
		<rect x="5" y="4" width="3" height="1"></rect>
		<rect x="5" y="12" width="4" height="1"></rect>
		<rect x="5" y="5" width="4" height="1"></rect>
	`,
	outline:`
		<rect x="4" width="1" height="17"></rect>
		<rect x="5" y="1" width="1" height="1"></rect>
		<rect x="7" y="3" width="1" height="1"></rect>
		<rect x="6" y="2" width="1" height="1"></rect>
		<rect x="9" y="5" width="1" height="1"></rect>
		<rect x="8" y="4" width="1" height="1"></rect>
		<rect x="11" y="7" width="1" height="1"></rect>
		<rect x="10" y="6" width="1" height="1"></rect>
		<rect x="11" y="12" width="5" height="1"></rect>
		<rect x="12" y="8" width="1" height="1"></rect>
		<rect x="13" y="9" width="1" height="1"></rect>
		<rect x="14" y="10" width="1" height="1"></rect>
		<rect x="15" y="11" width="1" height="1"></rect>
		<rect x="11" y="18" width="2" height="1"></rect>
		<rect x="5" y="16" width="1" height="1"></rect>
		<rect x="6" y="15" width="1" height="1"></rect>
		<rect x="7" y="14" width="1" height="1"></rect>
		<rect x="8" y="13" width="1" height="1"></rect>
		<rect x="9" y="14" width="1" height="2"></rect>
		<rect x="10" y="16" width="1" height="2"></rect>
		<rect x="11" y="12" width="1" height="2"></rect>
		<rect x="12" y="14" width="1" height="2"></rect>
		<rect x="13" y="16" width="1" height="2"></rect>
	`
};

icons.tool_penPlus = {
	fill:`
		<rect x="5" y="4" width="5" height="14"></rect>
		<rect x="10" y="8" width="2" height="6"></rect>
		<rect x="3" y="8" width="2" height="6"></rect>
	`,
	outline:`
		<rect id="MINUS_SHAPE" x="14" y="16" width="5" height="1"></rect>
		<rect id="PLUS_SHAPE" x="16" y="14" width="1" height="5"></rect>
		<rect x="4" y="16" width="1" height="3"></rect>
		<rect x="10" y="16" width="1" height="3"></rect>
		<rect x="7" y="1" width="1" height="12"></rect>
		<rect x="4" y="18" width="7" height="1"></rect>
		<rect x="4" y="16" width="7" height="1"></rect>
		<rect x="8" y="2" width="1" height="2"></rect>
		<rect x="9" y="4" width="1" height="2"></rect>
		<rect x="10" y="6" width="1" height="2"></rect>
		<rect x="3" y="8" width="1" height="2"></rect>
		<rect x="2" y="10" width="1" height="2"></rect>
		<rect x="12" y="10" width="1" height="2"></rect>
		<rect x="6" y="10" width="3" height="2"></rect>
		<rect x="3" y="12" width="1" height="2"></rect>
		<rect x="4" y="14" width="1" height="2"></rect>
		<rect x="6" y="2" width="1" height="2"></rect>
		<rect x="5" y="4" width="1" height="2"></rect>
		<rect x="4" y="6" width="1" height="2"></rect>
		<rect x="11" y="8" width="1" height="2"></rect>
		<rect x="11" y="12" width="1" height="2"></rect>
		<rect x="10" y="14" width="1" height="2"></rect>
	`
};

icons.tool_penMinus = {
	fill:`
		<rect x="5" y="4" width="5" height="14"></rect>
		<rect x="10" y="8" width="2" height="6"></rect>
		<rect x="3" y="8" width="2" height="6"></rect>
	`,
	outline:`
		<rect id="MINUS_SHAPE" x="14" y="16" width="5" height="1"></rect>
		<rect x="4" y="16" width="1" height="3"></rect>
		<rect x="10" y="16" width="1" height="3"></rect>
		<rect x="7" y="1" width="1" height="12"></rect>
		<rect x="4" y="18" width="7" height="1"></rect>
		<rect x="4" y="16" width="7" height="1"></rect>
		<rect x="8" y="2" width="1" height="2"></rect>
		<rect x="9" y="4" width="1" height="2"></rect>
		<rect x="10" y="6" width="1" height="2"></rect>
		<rect x="3" y="8" width="1" height="2"></rect>
		<rect x="2" y="10" width="1" height="2"></rect>
		<rect x="12" y="10" width="1" height="2"></rect>
		<rect x="6" y="10" width="3" height="2"></rect>
		<rect x="3" y="12" width="1" height="2"></rect>
		<rect x="4" y="14" width="1" height="2"></rect>
		<rect x="6" y="2" width="1" height="2"></rect>
		<rect x="5" y="4" width="1" height="2"></rect>
		<rect x="4" y="6" width="1" height="2"></rect>
		<rect x="11" y="8" width="1" height="2"></rect>
		<rect x="11" y="12" width="1" height="2"></rect>
		<rect x="10" y="14" width="1" height="2"></rect>
	`
};

icons.tool_pen = {
	fill:`
		<rect x="7" y="4" width="5" height="14"></rect>
		<rect x="12" y="8" width="2" height="6"></rect>
		<rect x="5" y="8" width="2" height="6"></rect>
	`,
	outline:`
		<rect x="6" y="16" width="1" height="3"></rect>
		<rect x="12" y="16" width="1" height="3"></rect>
		<rect x="9" y="1" width="1" height="12"></rect>
		<rect x="6" y="18" width="7" height="1"></rect>
		<rect x="6" y="16" width="7" height="1"></rect>
		<rect x="10" y="2" width="1" height="2"></rect>
		<rect x="11" y="4" width="1" height="2"></rect>
		<rect x="12" y="6" width="1" height="2"></rect>
		<rect x="5" y="8" width="1" height="2"></rect>
		<rect x="4" y="10" width="1" height="2"></rect>
		<rect x="14" y="10" width="1" height="2"></rect>
		<rect x="8" y="10" width="3" height="2"></rect>
		<rect x="5" y="12" width="1" height="2"></rect>
		<rect x="6" y="14" width="1" height="2"></rect>
		<rect x="8" y="2" width="1" height="2"></rect>
		<rect x="7" y="4" width="1" height="2"></rect>
		<rect x="6" y="6" width="1" height="2"></rect>
		<rect x="13" y="8" width="1" height="2"></rect>
		<rect x="13" y="12" width="1" height="2"></rect>
		<rect x="12" y="14" width="1" height="2"></rect>
	`
};

icons.tool_shapeResize = {
	fill:`
		<rect x="1" y="1" display="inline" fill="${white}" width="4" height="4"></rect>
		<rect x="8" y="8" display="inline" fill="${white}" width="4" height="4"></rect>
		<rect x="15" y="15" display="inline" fill="${white}" width="4" height="4"></rect>
		<rect x="15" y="1" display="inline" fill="${white}" width="4" height="4"></rect>
		<rect x="1" y="15" display="inline" fill="${white}" width="4" height="4"></rect>
	`,
	outline:`
		<rect x="16" y="5" width="1" height="10"></rect>
		<rect x="5" y="16" width="10" height="1"></rect>
		<rect x="5" y="3" width="10" height="1"></rect>
		<rect x="3" y="5" width="1" height="10"></rect>
		<rect x="1" y="1" width="4" height="1"></rect>
		<rect x="1" y="4" width="4" height="1"></rect>
		<rect x="1" y="1" width="1" height="4"></rect>
		<rect x="4" y="1" width="1" height="4"></rect>
		<rect x="15" y="1" width="4" height="1"></rect>
		<rect x="15" y="4" width="4" height="1"></rect>
		<rect x="15" y="1" width="1" height="4"></rect>
		<rect x="18" y="1" width="1" height="4"></rect>
		<rect x="15" y="15" width="4" height="1"></rect>
		<rect x="15" y="18" width="4" height="1"></rect>
		<rect x="15" y="15" width="1" height="4"></rect>
		<rect x="18" y="15" width="1" height="4"></rect>
		<rect x="1" y="15" width="4" height="1"></rect>
		<rect x="1" y="18" width="4" height="1"></rect>
		<rect x="1" y="15" width="1" height="4"></rect>
		<rect x="4" y="15" width="1" height="4"></rect>
		<rect x="8" y="8" width="4" height="1"></rect>
		<rect x="8" y="11" width="4" height="1"></rect>
		<rect x="8" y="8" width="1" height="4"></rect>
		<rect x="11" y="8" width="1" height="4"></rect>
	`
};

icons.tool_newRectangle = {
	fill: `<rect x="2" y="2" width="12" height="12"></rect>
`,
	outline:`
		<rect x="1" y="1" width="13" height="1"></rect>
		<rect x="1" y="13" width="13" height="1"></rect>
		<rect x="14" y="16" width="5" height="1"></rect>
		<rect x="1" y="2" width="1" height="12"></rect>
		<rect x="13" y="2" width="1" height="12"></rect>
		<rect x="16" y="14" width="1" height="5"></rect>
	`
};

icons.tool_newOval = {
	fill:`
		<rect x="6" y="2" width="4" height="1"></rect>
		<rect x="6" y="12" width="4" height="1"></rect>
		<rect x="5" y="10.1" width="4" height="1"></rect>
		<rect x="2" y="6" width="1" height="3"></rect>
		<rect x="13" y="6" width="1" height="3"></rect>
		<rect x="11" y="5.1" width="1" height="3"></rect>
		<rect x="3" y="3" width="10" height="9"></rect>
	`,
	outline:`
		<rect x="6" y="1" width="4" height="1"></rect>
		<rect x="4" y="2" width="2" height="1"></rect>
		<rect x="6" y="13" width="4" height="1"></rect>
		<rect x="1" y="6" width="1" height="3"></rect>
		<rect x="2" y="4" width="1" height="2"></rect>
		<rect x="10" y="2" width="2" height="1"></rect>
		<rect x="13" y="4" width="1" height="2"></rect>
		<rect x="4" y="12" width="2" height="1"></rect>
		<rect x="2" y="9" width="1" height="2"></rect>
		<rect x="10" y="12" width="2" height="1"></rect>
		<rect x="13" y="9" width="1" height="2"></rect>
		<rect x="14" y="6" width="1" height="3"></rect>
		<rect x="14" y="16" width="5" height="1"></rect>
		<rect x="16" y="14" width="1" height="5"></rect>
		<rect x="12" y="3" width="1" height="1"></rect>
		<rect x="12" y="11" width="1" height="1"></rect>
		<rect x="3" y="11" width="1" height="1"></rect>
		<rect x="3" y="3" width="1" height="1"></rect>
	`
};

icons.tool_newPath = {
	fill:`
		<rect x="5" y="2" width="5" height="13"></rect>
		<rect x="10" y="4" width="2" height="11"></rect>
		<rect x="3" y="9" width="2" height="6"></rect>
		<rect x="6" y="15" width="3" height="1"></rect>
		<rect x="12" y="6" width="2" height="7"></rect>
		<rect x="2" y="2" width="3" height="1"></rect>
		<rect x="4" y="3" width="3" height="1"></rect>
	`,
	outline:`
		<rect x="14" y="16" width="5" height="1"></rect>
		<rect x="16" y="14" width="1" height="5"></rect>
		<rect x="8" y="2" width="2" height="1"></rect>
		<rect x="2" y="1" width="6" height="1"></rect>
		<rect x="6" y="16" width="3" height="1"></rect>
		<rect x="10" y="3" width="1" height="1"></rect>
		<rect x="11" y="4" width="1" height="1"></rect>
		<rect x="12" y="5" width="1" height="1"></rect>
		<rect x="1" y="1" width="1" height="2"></rect>
		<rect x="2" y="3" width="2" height="1"></rect>
		<rect x="4" y="4" width="1" height="1"></rect>
		<rect x="2" y="10" width="1" height="4"></rect>
		<rect x="3" y="9" width="1" height="1"></rect>
		<rect x="3" y="14" width="1" height="1"></rect>
		<rect x="5" y="5" width="1" height="3"></rect>
		<rect x="4" y="8" width="1" height="1"></rect>
		<rect x="12" y="13" width="1" height="1"></rect>
		<rect x="11" y="14" width="1" height="1"></rect>
		<rect x="9" y="15" width="2" height="1"></rect>
		<rect x="4" y="15" width="2" height="1"></rect>
		<rect x="13" y="11" width="1" height="2"></rect>
		<rect x="13" y="6" width="1" height="2"></rect>
		<rect x="14" y="8" width="1" height="3"></rect>
	`
};

icons.tool_zoomEm = {
	outline:`
		<polygon points="15,3 11,3 11,5 13,5 13,6 12,6 12,7 11,7 11,8 10,8 9,8 9,7 8,7 8,6 7,6 7,5 9,5 9,3 5,3 3,3 3,5 3,9 5,9 5,7 6,7 6,8 7,8 7,9 8,9 8,10 8,11 7,11 7,12 6,12 6,13 5,13 5,11 3,11 3,15 3,17 5,17 9,17 9,15 7,15 7,14 8,14 8,13 9,13 9,12 10,12 11,12 11,13 12,13 12,14 13,14 13,15 11,15 11,17 15,17 17,17 17,15 17,11 15,11 15,13 14,13 14,12 13,12 13,11 12,11 12,10 12,9 13,9 13,8 14,8 14,7 15,7 15,9 17,9 17,5 17,3"/>
		<rect x="18" y="1" width="1" height="18"></rect>
		<rect x="1" y="18" width="18" height="1"></rect>
		<rect x="1" y="1" width="18" height="1"></rect>
		<rect x="1" y="1" width="1" height="18"></rect>
	`
};

icons.tool_zoom1to1 = {
	outline:`
		<rect x="5" y="4" width="2" height="12"></rect>
		<rect x="14" y="4" width="2" height="12"></rect>
		<rect x="18" y="1" width="1" height="18"></rect>
		<rect x="1" y="1" width="1" height="18"></rect>
		<rect x="13" y="5" width="1" height="1"></rect>
		<rect x="4" y="5" width="1" height="1"></rect>
		<rect x="9" y="11" width="2" height="2"></rect>
		<rect x="9" y="7" width="2" height="2"></rect>
		<rect x="1" y="1" width="18" height="1"></rect>
		<rect x="1" y="18" width="18" height="1"></rect>
	`
};

icons.tool_zoomIn = {
	outline:`
		<rect x="9" y="3" width="2" height="14"></rect>
		<rect x="3" y="9" width="14" height="2"></rect>
	`
};

icons.tool_zoomOut = {
	outline: `<rect x="3" y="9" width="14" height="2"></rect>`
};

icons.tool_pan = {
	fill:`
		<rect x="9" y="1" width="2" height="18"></rect>
		<rect x="1" y="9" width="18" height="2"></rect>
		<rect x="2" y="7" width="2" height="6"></rect>
		<rect x="7" y="16" width="6" height="2"></rect>
		<rect x="16" y="7" width="2" height="6"></rect>
		<rect x="7" y="2" width="6" height="2"></rect>
	`,
	outline:`
		<rect x="8" y="4" width="1" height="5"></rect>
		<rect x="8" y="11" width="1" height="5"></rect>
		<rect x="11" y="4" width="1" height="5"></rect>
		<rect x="11" y="11" width="1" height="5"></rect>
		<rect x="4" y="8" width="4" height="1"></rect>
		<rect x="11" y="8" width="5" height="1"></rect>
		<rect x="4" y="11" width="4" height="1"></rect>
		<rect x="4" y="12" width="1" height="2"></rect>
		<rect x="4" y="6" width="1" height="2"></rect>
		<rect x="2" y="12" width="1" height="1"></rect>
		<rect x="1" y="11" width="1" height="1"></rect>
		<rect x="0" y="9" width="1" height="2"></rect>
		<rect x="1" y="8" width="1" height="1"></rect>
		<rect x="3" y="6" width="1" height="1"></rect>
		<rect x="2" y="7" width="1" height="1"></rect>
		<rect x="3" y="13" width="1" height="1"></rect>
		<rect x="11" y="11" width="5" height="1"></rect>
		<rect x="12" y="15" width="2" height="1"></rect>
		<rect x="6" y="15" width="2" height="1"></rect>
		<rect x="12" y="17" width="1" height="1"></rect>
		<rect x="13" y="16" width="1" height="1"></rect>
		<rect x="11" y="18" width="1" height="1"></rect>
		<rect x="9" y="19" width="2" height="1"></rect>
		<rect x="8" y="18" width="1" height="1"></rect>
		<rect x="7" y="17" width="1" height="1"></rect>
		<rect x="6" y="16" width="1" height="1"></rect>
		<rect x="15" y="6" width="1" height="2"></rect>
		<rect x="15" y="12" width="1" height="2"></rect>
		<rect x="17" y="7" width="1" height="1"></rect>
		<rect x="16" y="6" width="1" height="1"></rect>
		<rect x="18" y="8" width="1" height="1"></rect>
		<rect x="19" y="9" width="1" height="2"></rect>
		<rect x="18" y="11" width="1" height="1"></rect>
		<rect x="17" y="12" width="1" height="1"></rect>
		<rect x="16" y="13" width="1" height="1"></rect>
		<rect x="6" y="4" width="2" height="1"></rect>
		<rect x="12" y="4" width="2" height="1"></rect>
		<rect x="7" y="2" width="1" height="1"></rect>
		<rect x="6" y="3" width="1" height="1"></rect>
		<rect x="8" y="1" width="1" height="1"></rect>
		<rect x="9" y="0" width="2" height="1"></rect>
		<rect x="11" y="1" width="1" height="1"></rect>
		<rect x="12" y="2" width="1" height="1"></rect>
		<rect x="13" y="3" width="1" height="1"></rect>
	`
};

icons.tool_kern = {
	fill:`
		<rect x="1" y="9" width="18" height="2"></rect>
		<rect x="2" y="7" width="2" height="6"></rect>
		<rect x="16" y="7" width="2" height="6"></rect>
	`,
	outline:`
		<rect x="4" y="8" width="12" height="1"></rect>
		<rect x="4" y="11" width="12" height="1"></rect>
		<rect x="4" y="12" width="1" height="2"></rect>
		<rect x="4" y="6" width="1" height="2"></rect>
		<rect x="2" y="12" width="1" height="1"></rect>
		<rect x="1" y="11" width="1" height="1"></rect>
		<rect y="9" width="1" height="2"></rect>
		<rect x="1" y="8" width="1" height="1"></rect>
		<rect x="3" y="6" width="1" height="1"></rect>
		<rect x="2" y="7" width="1" height="1"></rect>
		<rect x="3" y="13" width="1" height="1"></rect>
		<rect x="15" y="6" width="1" height="2"></rect>
		<rect x="15" y="12" width="1" height="2"></rect>
		<rect x="17" y="7" width="1" height="1"></rect>
		<rect x="16" y="6" width="1" height="1"></rect>
		<rect x="18" y="8" width="1" height="1"></rect>
		<rect x="19" y="9" width="1" height="2"></rect>
		<rect x="18" y="11" width="1" height="1"></rect>
		<rect x="17" y="12" width="1" height="1"></rect>
		<rect x="16" y="13" width="1" height="1"></rect>
		<rect x="9" y="2" width="2" height="16"></rect>
	`
};
