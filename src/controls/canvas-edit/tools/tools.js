import { getCurrentProjectEditor } from '../../../app/main.js';
import { accentColors, uiColors } from '../../../common/colors.js';
import { makeElement } from '../../../common/dom.js';
import { log } from '../../../common/functions.js';


// -------------------
// Update Tools
// -------------------
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

	let pathEditClass = '';
	let pathAddPointClass = '';
	let penClickable = true;
	let penAddPointClickable = true;
	const hasComponentInstance = editor.multiSelect.shapes.contains('ComponentInstance');

	if (editor.selectedTool === 'pathedit') {
		pathEditClass = 'button--call-to-action';
	} else if (hasComponentInstance) {
		pathEditClass = 'buttondis';
		penClickable = false;
		penAddPointClickable = false;
	}

	if (editor.selectedTool === 'pathaddpoint') {
		pathAddPointClass = 'button--call-to-action';
	} else if (hasComponentInstance) {
		pathAddPointClass = 'buttondis';
		penClickable = false;
		penAddPointClickable = false;
	}

	if (editor.multiSelect.shapes.count() > 1) {
		pathAddPointClass = 'buttondis';
		penAddPointClickable = false;
	}

	const st = editor.selectedTool;

	// log(`selected glyph ${selectedWorkItem.name} selected tool ${st}`);

	// New Shape
	let newshape = '';
	newshape += `
		<button
			onmouseover="mouseovercec();"
			title="new rectangle shape"
			class="${(st === 'newrect' ? 'button--call-to-action ' : ' ')} tool"
			onclick="clickTool('newrect');"
		>
			${makeToolButton({ name: 'tool_newRect', selected: st === 'newrect' })}
		</button>
	`;

	newshape += `
		<button
			onmouseover="mouseovercec();"
			title="new oval shape"
			class="${(st === 'newoval' ? 'button--call-to-action ' : ' ')} tool"
			onclick="clickTool('newoval');"
		>
			${makeToolButton({ name: 'tool_newOval', selected: st === 'newoval' })}
		</button>
	`;

	newshape += `
		<button
			onmouseover="mouseovercec();"
			title="new path shape"
			class="${(st === 'newpath' ? 'button--call-to-action ' : ' ')} tool"
			onclick="clickTool('newpath');"
		>
			${makeToolButton({ name: 'tool_newPath', selected: st === 'newpath' })}
		</button>
	`;

	newshape += '<br>';

	// Path and Shape Edit
	let edittools = '';
	edittools += `
		<button
			onmouseover="mouseovercec();"
			title="add path point"
			class="${pathAddPointClass} tool"
			${(penAddPointClickable ? `onclick="clickTool('pathaddpoint');"` : '')}
		/>
		${makeToolButton({name: 'tool_penPlus', selected: st === 'pathaddpoint', disabled: !penAddPointClickable})}
		</button>
	`;

	edittools += `
		<button
			onmouseover="mouseovercec();"
			title="path edit"
			class="${pathEditClass} tool"
			${(penClickable ? `onclick="clickTool('pathedit');"` : '')}
		/>
		${makeToolButton({name: 'tool_pen', selected: st === 'pathedit', disabled: !penClickable})}
		</button>
	`;

	edittools += `
		<button
			onmouseover="mouseovercec();"
			title="shape edit"
			class="${(st === 'shaperesize' ? 'button--call-to-action ' : '')} tool"
			onclick="clickTool('shaperesize');"
		/>
		${makeToolButton({name: 'tool_arrow', selected: st === 'shaperesize'})}
		</button>
	`;

	edittools += '<br>';

	let donepath = '<div style="height:5px;">&nbsp;</div>';
	donepath += `
		<button
			class="button--call-to-action"
			style="width:94px; font-size:.8em; padding:2px;"
			title="done editing path"
			onclick="clickTool('pathedit');"
		>
		done editing path
		</button>
	`;


	//
	// Put it all together
	//

	let content = '';

	const onGlyphEditPage = editor.nav.page === 'Glyph edit';
	const onComponentPage = editor.nav.page === 'Components';
	const onLigaturesPage = editor.nav.page === 'Ligatures';
	const selectedWorkItem = editor.selectedWorkItem;

	if (onGlyphEditPage || onLigaturesPage) content += newshape;
	if (onComponentPage && selectedWorkItem && !selectedWorkItem.shape)
		content += newshape;

	if (onGlyphEditPage || onComponentPage || onLigaturesPage) {
		content += edittools;
		if (editor.selectedTool === 'newpath') content += donepath;
	}

	return makeElement({content: content});

	// log('update_ToolsArea', 'end');
}

export function makeKernToolsButtons() {
	// Kern
	const kern =
		'<button title="kern" class="' +
		(st === 'kern' ? 'button--call-to-action ' : ' ') +
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
			class="${(st === 'pan' ? 'button--call-to-action ' : ' ')} tool"
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
	// log('clickTool', 'start');
	editor.selectedTool = ctool;

	// log('passed: ' + ctool + ' and editor.selectedTool now is: ' + editor.selectedTool);

	_UI.eventhandlers.tool_addPath.firstpoint = true;
	_UI.eventhandlers.multi = false;

	if (ctool === 'newrect') {
		setCursor('crosshairsSquare');
		clickEmptySpace();
	} else if (ctool === 'newoval') {
		setCursor('crosshairsCircle');
		clickEmptySpace();
	} else if (ctool === 'newpath') {
		setCursor('penPlus');
		clickEmptySpace();
	} else if (ctool === 'pathedit') {
		setCursor('pen');
	} else if (ctool === 'shaperesize') {
		setCursor('arrow');
	}

	_UI.eventhandlers.hoverpoint = false;
	closeNotation();
	// updateCursor();

	redraw({ calledBy: 'clicktool', redrawPanels: false });
	}


//	-----------------
//	Button Functions
//	-----------------
export function addShape(newshape){
	// debug('addShape - START');
	// debug('\t name: ' + newshape.name);
	// debug('\t objtype: ' + newshape.objtype);

	if(newshape){
		if(newshape.objtype === 'componentinstance'){
			// debug('\t is a Component instance');
			_UI.selectedToolName = 'shaperesize';
		} else if(newshape.path && (_UI.selectedToolName === 'shaperesize')) {
			// debug('\t triggered as true: newshape.path && _UI.selectedToolName == shaperesize \n\t NOT calling calcmaxes, okay?');
			//newshape.calcMaxes();
		}
	} else {
		// debug('\t passed null, creating new shape.');
		newshape = new Shape({});
		newshape.name = ('Rectangle ' + ((getSelectedWorkItemShapes().length*1)+1));
	}

	let sg = getSelectedWorkItem();

	sg.shapes.push(newshape);
	_UI.ms.shapes.select(newshape);
	sg.changed();

	_UI.current_panel = 'npAttributes';

	// debug('\t returns: ' + newshape.name);
	// debug('addShape - END\n');
	return newshape;
}

export function addBasicShape(type){
	let hd = 50;
	let th = 500;
	let tw = 300;
	let newshape = new Shape({});
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

	newshape.path = new Path({'pathpoints':parr});
	newshape.name = (shapetype + getSelectedWorkItemShapes().length+1);

	getSelectedWorkItemShapes().push(newshape);
	_UI.ms.shapes.select(newshape);
	updateCurrentGlyphWidth();
}

export function turnSelectedShapeIntoAComponent(){
	let s = clone(_UI.ms.shapes.getMembers(), 'turnSelectedShapeIntoAComponent');
	let n = s.length === 1? ('Component ' + s[0].name) : ('Component ' + (getLength(_GP.components)+1));

	_UI.ms.shapes.deleteShapes();
	let newid = createNewComponent(new Glyph({'shapes':s, 'name':n}));
	insertComponentInstance(newid);
	_UI.selectedToolName = 'shaperesize';
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
//	TOOLS BUTTONS
//	---------------------
let white = uiColors.offwhite;
let black = uiColors.enabled.resting.text;
let icons = {};

export function makeToolButton(oa) {
	// log("MAKETOOLBUTTON - oa: " + json(oa));

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

	let content = `
		<svg version="1.1"
			xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
			x="0px" y="0px" width="20px" height="20px" viewBox="0 0 20 20"
		> `;

	if (icon.fill) {
		content += `
			<g pointer-events="none" fill="${colorFill}">
			${icon.fill}
			</g>
		`;
	}

	content += `
		<g pointer-events="none" fill="${colorOutline}">
		${icon.outline}
		</g>
	</svg>
	`;

	return content;
}

icons.tool_arrow = {
	fill:`
		<rect x="11" y="14" width="1" height="4"/>
		<rect x="12" y="16" width="1" height="2"/>
		<rect x="9" y="12" width="1" height="2"/>
		<rect x="5" y="3" width="2" height="1"/>
		<rect x="10" y="7" width="1" height="9"/>
		<rect x="5" y="6" width="5" height="6"/>
		<rect x="12" y="9" width="1" height="3"/>
		<rect x="11" y="8" width="1" height="4"/>
		<rect x="14" y="11" width="1" height="1"/>
		<rect x="13" y="10" width="1" height="2"/>
		<rect x="5" y="15" width="1" height="1"/>
		<rect x="5" y="2" width="1" height="1"/>
		<rect x="5" y="14" width="2" height="1"/>
		<rect x="5" y="13" width="3" height="1"/>
		<rect x="5" y="4" width="3" height="1"/>
		<rect x="5" y="12" width="4" height="1"/>
		<rect x="5" y="5" width="4" height="1"/>
	`,
	outline:`
		<rect x="4" width="1" height="17"/>
		<rect x="5" y="1" width="1" height="1"/>
		<rect x="7" y="3" width="1" height="1"/>
		<rect x="6" y="2" width="1" height="1"/>
		<rect x="9" y="5" width="1" height="1"/>
		<rect x="8" y="4" width="1" height="1"/>
		<rect x="11" y="7" width="1" height="1"/>
		<rect x="10" y="6" width="1" height="1"/>
		<rect x="11" y="12" width="5" height="1"/>
		<rect x="12" y="8" width="1" height="1"/>
		<rect x="13" y="9" width="1" height="1"/>
		<rect x="14" y="10" width="1" height="1"/>
		<rect x="15" y="11" width="1" height="1"/>
		<rect x="11" y="18" width="2" height="1"/>
		<rect x="5" y="16" width="1" height="1"/>
		<rect x="6" y="15" width="1" height="1"/>
		<rect x="7" y="14" width="1" height="1"/>
		<rect x="8" y="13" width="1" height="1"/>
		<rect x="9" y="14" width="1" height="2"/>
		<rect x="10" y="16" width="1" height="2"/>
		<rect x="11" y="12" width="1" height="2"/>
		<rect x="12" y="14" width="1" height="2"/>
		<rect x="13" y="16" width="1" height="2"/>
	`
};

icons.tool_penPlus = {
	fill:`
		<rect x="5" y="4" width="5" height="14"/>
		<rect x="10" y="8" width="2" height="6"/>
		<rect x="3" y="8" width="2" height="6"/>
	`,
	outline:`
		<rect id="MINUS_SHAPE" x="14" y="16" width="5" height="1"/>
		<rect id="PLUS_SHAPE" x="16" y="14" width="1" height="5"/>
		<rect x="4" y="16" width="1" height="3"/>
		<rect x="10" y="16" width="1" height="3"/>
		<rect x="7" y="1" width="1" height="12"/>
		<rect x="4" y="18" width="7" height="1"/>
		<rect x="4" y="16" width="7" height="1"/>
		<rect x="8" y="2" width="1" height="2"/>
		<rect x="9" y="4" width="1" height="2"/>
		<rect x="10" y="6" width="1" height="2"/>
		<rect x="3" y="8" width="1" height="2"/>
		<rect x="2" y="10" width="1" height="2"/>
		<rect x="12" y="10" width="1" height="2"/>
		<rect x="6" y="10" width="3" height="2"/>
		<rect x="3" y="12" width="1" height="2"/>
		<rect x="4" y="14" width="1" height="2"/>
		<rect x="6" y="2" width="1" height="2"/>
		<rect x="5" y="4" width="1" height="2"/>
		<rect x="4" y="6" width="1" height="2"/>
		<rect x="11" y="8" width="1" height="2"/>
		<rect x="11" y="12" width="1" height="2"/>
		<rect x="10" y="14" width="1" height="2"/>
	`
};

icons.tool_penMinus = {
	fill:`
		<rect x="5" y="4" width="5" height="14"/>
		<rect x="10" y="8" width="2" height="6"/>
		<rect x="3" y="8" width="2" height="6"/>
	`,
	outline:`
		<rect id="MINUS_SHAPE" x="14" y="16" width="5" height="1"/>
		<rect x="4" y="16" width="1" height="3"/>
		<rect x="10" y="16" width="1" height="3"/>
		<rect x="7" y="1" width="1" height="12"/>
		<rect x="4" y="18" width="7" height="1"/>
		<rect x="4" y="16" width="7" height="1"/>
		<rect x="8" y="2" width="1" height="2"/>
		<rect x="9" y="4" width="1" height="2"/>
		<rect x="10" y="6" width="1" height="2"/>
		<rect x="3" y="8" width="1" height="2"/>
		<rect x="2" y="10" width="1" height="2"/>
		<rect x="12" y="10" width="1" height="2"/>
		<rect x="6" y="10" width="3" height="2"/>
		<rect x="3" y="12" width="1" height="2"/>
		<rect x="4" y="14" width="1" height="2"/>
		<rect x="6" y="2" width="1" height="2"/>
		<rect x="5" y="4" width="1" height="2"/>
		<rect x="4" y="6" width="1" height="2"/>
		<rect x="11" y="8" width="1" height="2"/>
		<rect x="11" y="12" width="1" height="2"/>
		<rect x="10" y="14" width="1" height="2"/>
	`
};

icons.tool_pen = {
	fill:`
		<rect x="7" y="4" width="5" height="14"/>
		<rect x="12" y="8" width="2" height="6"/>
		<rect x="5" y="8" width="2" height="6"/>
	`,
	outline:`
		<rect x="6" y="16" width="1" height="3"/>
		<rect x="12" y="16" width="1" height="3"/>
		<rect x="9" y="1" width="1" height="12"/>
		<rect x="6" y="18" width="7" height="1"/>
		<rect x="6" y="16" width="7" height="1"/>
		<rect x="10" y="2" width="1" height="2"/>
		<rect x="11" y="4" width="1" height="2"/>
		<rect x="12" y="6" width="1" height="2"/>
		<rect x="5" y="8" width="1" height="2"/>
		<rect x="4" y="10" width="1" height="2"/>
		<rect x="14" y="10" width="1" height="2"/>
		<rect x="8" y="10" width="3" height="2"/>
		<rect x="5" y="12" width="1" height="2"/>
		<rect x="6" y="14" width="1" height="2"/>
		<rect x="8" y="2" width="1" height="2"/>
		<rect x="7" y="4" width="1" height="2"/>
		<rect x="6" y="6" width="1" height="2"/>
		<rect x="13" y="8" width="1" height="2"/>
		<rect x="13" y="12" width="1" height="2"/>
		<rect x="12" y="14" width="1" height="2"/>
	`
};

icons.tool_shapeResize = {
	fill:`
		<rect x="1" y="1" display="inline" fill="${white}" width="4" height="4"/>
		<rect x="8" y="8" display="inline" fill="${white}" width="4" height="4"/>
		<rect x="15" y="15" display="inline" fill="${white}" width="4" height="4"/>
		<rect x="15" y="1" display="inline" fill="${white}" width="4" height="4"/>
		<rect x="1" y="15" display="inline" fill="${white}" width="4" height="4"/>
	`,
	outline:`
		<rect x="16" y="5" width="1" height="10"/>
		<rect x="5" y="16" width="10" height="1"/>
		<rect x="5" y="3" width="10" height="1"/>
		<rect x="3" y="5" width="1" height="10"/>
		<rect x="1" y="1" width="4" height="1"/>
		<rect x="1" y="4" width="4" height="1"/>
		<rect x="1" y="1" width="1" height="4"/>
		<rect x="4" y="1" width="1" height="4"/>
		<rect x="15" y="1" width="4" height="1"/>
		<rect x="15" y="4" width="4" height="1"/>
		<rect x="15" y="1" width="1" height="4"/>
		<rect x="18" y="1" width="1" height="4"/>
		<rect x="15" y="15" width="4" height="1"/>
		<rect x="15" y="18" width="4" height="1"/>
		<rect x="15" y="15" width="1" height="4"/>
		<rect x="18" y="15" width="1" height="4"/>
		<rect x="1" y="15" width="4" height="1"/>
		<rect x="1" y="18" width="4" height="1"/>
		<rect x="1" y="15" width="1" height="4"/>
		<rect x="4" y="15" width="1" height="4"/>
		<rect x="8" y="8" width="4" height="1"/>
		<rect x="8" y="11" width="4" height="1"/>
		<rect x="8" y="8" width="1" height="4"/>
		<rect x="11" y="8" width="1" height="4"/>
	`
};

icons.tool_newRect = {
	fill: `<rect x="2" y="2" width="12" height="12"/>
`,
	outline:`
		<rect x="1" y="1" width="13" height="1"/>
		<rect x="1" y="13" width="13" height="1"/>
		<rect x="14" y="16" width="5" height="1"/>
		<rect x="1" y="2" width="1" height="12"/>
		<rect x="13" y="2" width="1" height="12"/>
		<rect x="16" y="14" width="1" height="5"/>
	`
};

icons.tool_newOval = {
	fill:`
		<rect x="6" y="2" width="4" height="1"/>
		<rect x="6" y="12" width="4" height="1"/>
		<rect x="5" y="10.1" width="4" height="1"/>
		<rect x="2" y="6" width="1" height="3"/>
		<rect x="13" y="6" width="1" height="3"/>
		<rect x="11" y="5.1" width="1" height="3"/>
		<rect x="3" y="3" width="10" height="9"/>
	`,
	outline:`
		<rect x="6" y="1" width="4" height="1"/>
		<rect x="4" y="2" width="2" height="1"/>
		<rect x="6" y="13" width="4" height="1"/>
		<rect x="1" y="6" width="1" height="3"/>
		<rect x="2" y="4" width="1" height="2"/>
		<rect x="10" y="2" width="2" height="1"/>
		<rect x="13" y="4" width="1" height="2"/>
		<rect x="4" y="12" width="2" height="1"/>
		<rect x="2" y="9" width="1" height="2"/>
		<rect x="10" y="12" width="2" height="1"/>
		<rect x="13" y="9" width="1" height="2"/>
		<rect x="14" y="6" width="1" height="3"/>
		<rect x="14" y="16" width="5" height="1"/>
		<rect x="16" y="14" width="1" height="5"/>
		<rect x="12" y="3" width="1" height="1"/>
		<rect x="12" y="11" width="1" height="1"/>
		<rect x="3" y="11" width="1" height="1"/>
		<rect x="3" y="3" width="1" height="1"/>
	`
};

icons.tool_newPath = {
	fill:`
		<rect x="5" y="2" width="5" height="13"/>
		<rect x="10" y="4" width="2" height="11"/>
		<rect x="3" y="9" width="2" height="6"/>
		<rect x="6" y="15" width="3" height="1"/>
		<rect x="12" y="6" width="2" height="7"/>
		<rect x="2" y="2" width="3" height="1"/>
		<rect x="4" y="3" width="3" height="1"/>
	`,
	outline:`
		<rect x="14" y="16" width="5" height="1"/>
		<rect x="16" y="14" width="1" height="5"/>
		<rect x="8" y="2" width="2" height="1"/>
		<rect x="2" y="1" width="6" height="1"/>
		<rect x="6" y="16" width="3" height="1"/>
		<rect x="10" y="3" width="1" height="1"/>
		<rect x="11" y="4" width="1" height="1"/>
		<rect x="12" y="5" width="1" height="1"/>
		<rect x="1" y="1" width="1" height="2"/>
		<rect x="2" y="3" width="2" height="1"/>
		<rect x="4" y="4" width="1" height="1"/>
		<rect x="2" y="10" width="1" height="4"/>
		<rect x="3" y="9" width="1" height="1"/>
		<rect x="3" y="14" width="1" height="1"/>
		<rect x="5" y="5" width="1" height="3"/>
		<rect x="4" y="8" width="1" height="1"/>
		<rect x="12" y="13" width="1" height="1"/>
		<rect x="11" y="14" width="1" height="1"/>
		<rect x="9" y="15" width="2" height="1"/>
		<rect x="4" y="15" width="2" height="1"/>
		<rect x="13" y="11" width="1" height="2"/>
		<rect x="13" y="6" width="1" height="2"/>
		<rect x="14" y="8" width="1" height="3"/>
	`
};

icons.tool_zoomEm = {
	outline:`
		<polygon points="15,3 11,3 11,5 13,5 13,6 12,6 12,7 11,7 11,8 10,8 9,8 9,7 8,7 8,6 7,6 7,5 9,5 9,3 5,3 3,3 3,5 3,9 5,9 5,7 6,7 6,8 7,8 7,9 8,9 8,10 8,11 7,11 7,12 6,12 6,13 5,13 5,11 3,11 3,15 3,17 5,17 9,17 9,15 7,15 7,14 8,14 8,13 9,13 9,12 10,12 11,12 11,13 12,13 12,14 13,14 13,15 11,15 11,17 15,17 17,17 17,15 17,11 15,11 15,13 14,13 14,12 13,12 13,11 12,11 12,10 12,9 13,9 13,8 14,8 14,7 15,7 15,9 17,9 17,5 17,3"/>
		<rect x="18" y="1" width="1" height="18"/>
		<rect x="1" y="18" width="18" height="1"/>
		<rect x="1" y="1" width="18" height="1"/>
		<rect x="1" y="1" width="1" height="18"/>
	`
};

icons.tool_zoom1to1 = {
	outline:`
		<rect x="5" y="4" width="2" height="12"/>
		<rect x="14" y="4" width="2" height="12"/>
		<rect x="18" y="1" width="1" height="18"/>
		<rect x="1" y="1" width="1" height="18"/>
		<rect x="13" y="5" width="1" height="1"/>
		<rect x="4" y="5" width="1" height="1"/>
		<rect x="9" y="11" width="2" height="2"/>
		<rect x="9" y="7" width="2" height="2"/>
		<rect x="1" y="1" width="18" height="1"/>
		<rect x="1" y="18" width="18" height="1"/>
	`
};

icons.tool_zoomIn = {
	outline:`
		<rect x="9" y="3" width="2" height="14"/>
		<rect x="3" y="9" width="14" height="2"/>
	`
};

icons.tool_zoomOut = {
	outline: `<rect x="3" y="9" width="14" height="2"/>`
};

icons.tool_pan = {
	fill:`
		<rect x="9" y="1" width="2" height="18"/>
		<rect x="1" y="9" width="18" height="2"/>
		<rect x="2" y="7" width="2" height="6"/>
		<rect x="7" y="16" width="6" height="2"/>
		<rect x="16" y="7" width="2" height="6"/>
		<rect x="7" y="2" width="6" height="2"/>
	`,
	outline:`
		<rect x="8" y="4" width="1" height="5"/>
		<rect x="8" y="11" width="1" height="5"/>
		<rect x="11" y="4" width="1" height="5"/>
		<rect x="11" y="11" width="1" height="5"/>
		<rect x="4" y="8" width="4" height="1"/>
		<rect x="11" y="8" width="5" height="1"/>
		<rect x="4" y="11" width="4" height="1"/>
		<rect x="4" y="12" width="1" height="2"/>
		<rect x="4" y="6" width="1" height="2"/>
		<rect x="2" y="12" width="1" height="1"/>
		<rect x="1" y="11" width="1" height="1"/>
		<rect x="0" y="9" width="1" height="2"/>
		<rect x="1" y="8" width="1" height="1"/>
		<rect x="3" y="6" width="1" height="1"/>
		<rect x="2" y="7" width="1" height="1"/>
		<rect x="3" y="13" width="1" height="1"/>
		<rect x="11" y="11" width="5" height="1"/>
		<rect x="12" y="15" width="2" height="1"/>
		<rect x="6" y="15" width="2" height="1"/>
		<rect x="12" y="17" width="1" height="1"/>
		<rect x="13" y="16" width="1" height="1"/>
		<rect x="11" y="18" width="1" height="1"/>
		<rect x="9" y="19" width="2" height="1"/>
		<rect x="8" y="18" width="1" height="1"/>
		<rect x="7" y="17" width="1" height="1"/>
		<rect x="6" y="16" width="1" height="1"/>
		<rect x="15" y="6" width="1" height="2"/>
		<rect x="15" y="12" width="1" height="2"/>
		<rect x="17" y="7" width="1" height="1"/>
		<rect x="16" y="6" width="1" height="1"/>
		<rect x="18" y="8" width="1" height="1"/>
		<rect x="19" y="9" width="1" height="2"/>
		<rect x="18" y="11" width="1" height="1"/>
		<rect x="17" y="12" width="1" height="1"/>
		<rect x="16" y="13" width="1" height="1"/>
		<rect x="6" y="4" width="2" height="1"/>
		<rect x="12" y="4" width="2" height="1"/>
		<rect x="7" y="2" width="1" height="1"/>
		<rect x="6" y="3" width="1" height="1"/>
		<rect x="8" y="1" width="1" height="1"/>
		<rect x="9" y="0" width="2" height="1"/>
		<rect x="11" y="1" width="1" height="1"/>
		<rect x="12" y="2" width="1" height="1"/>
		<rect x="13" y="3" width="1" height="1"/>
	`
};

icons.tool_kern = {
	fill:`
		<rect x="1" y="9" width="18" height="2"/>
		<rect x="2" y="7" width="2" height="6"/>
		<rect x="16" y="7" width="2" height="6"/>
	`,
	outline:`
		<rect x="4" y="8" width="12" height="1"/>
		<rect x="4" y="11" width="12" height="1"/>
		<rect x="4" y="12" width="1" height="2"/>
		<rect x="4" y="6" width="1" height="2"/>
		<rect x="2" y="12" width="1" height="1"/>
		<rect x="1" y="11" width="1" height="1"/>
		<rect y="9" width="1" height="2"/>
		<rect x="1" y="8" width="1" height="1"/>
		<rect x="3" y="6" width="1" height="1"/>
		<rect x="2" y="7" width="1" height="1"/>
		<rect x="3" y="13" width="1" height="1"/>
		<rect x="15" y="6" width="1" height="2"/>
		<rect x="15" y="12" width="1" height="2"/>
		<rect x="17" y="7" width="1" height="1"/>
		<rect x="16" y="6" width="1" height="1"/>
		<rect x="18" y="8" width="1" height="1"/>
		<rect x="19" y="9" width="1" height="2"/>
		<rect x="18" y="11" width="1" height="1"/>
		<rect x="17" y="12" width="1" height="1"/>
		<rect x="16" y="13" width="1" height="1"/>
		<rect x="9" y="2" width="2" height="16"/>
	`
};
