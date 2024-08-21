import { getCurrentProjectEditor } from '../../app/main.js';
import { accentColors } from '../../common/colors.js';
import { addAsChildren, makeElement } from '../../common/dom.js';
import { round } from '../../common/functions.js';
import { drawShape } from '../../display_canvas/draw_paths.js';
import { ComponentInstance } from '../../project_data/component_instance.js';
import { Path } from '../../project_data/path.js';
import { closePopOutWindow, openPopOutWindow } from '../../project_editor/pop_out_window.js';
import { cXsX, cYsY } from '../edit_canvas.js';
import { stopCreatingNewPath } from './new_path.js';

// --------------------------------------------------------------
// Making tool buttons
// --------------------------------------------------------------
/**
 * Makes the tools buttons
 * @returns {Array}
 */
export function makeEditToolsButtons() {
	// log('makeEditToolsButtons', 'start');
	const editor = getCurrentProjectEditor();

	if (!editor.nav.isOnEditCanvasPage) {
		// log('returning, !isOnEditCanvasPage');
		// log('makeEditToolsButtons', 'end');
		return [];
	}

	if (!editor.selectedItemID) {
		// log('returning, !selectedItemID');
		// log('makeEditToolsButtons', 'end');
		return [];
	}

	// All the various permutations of states
	// log(`editor.selectedTool: ${editor.selectedTool}`);

	let defaultDisabledState = editor.project.settings.app.displaySVGGlyphs;

	// Button data
	let toolButtonData = {
		newRectangle: { title: 'New rectangle', disabled: defaultDisabledState },
		newOval: { title: 'New oval', disabled: defaultDisabledState },
		newPath: { title: 'New path', disabled: defaultDisabledState },
		pathAddPoint: { title: 'Add path point', disabled: defaultDisabledState },
		pathEdit: { title: 'Path edit', disabled: defaultDisabledState },
		resize: { title: 'Resize', disabled: defaultDisabledState },
	};

	// Disable pen and add path point buttons for certain conditions
	const hasComponentInstance = editor.multiSelect.shapes.contains('ComponentInstance');

	if (editor.selectedTool !== 'pathEdit' && hasComponentInstance) {
		toolButtonData.pathEdit.disabled = true;
	}

	if (editor.selectedTool !== 'pathAddPoint' && hasComponentInstance) {
		toolButtonData.pathAddPoint.disabled = true;
	}

	if (editor.multiSelect.shapes.count > 1) {
		toolButtonData.pathAddPoint.disabled = true;
	}

	// Make all the new buttons
	let toolButtonElements = {};

	Object.keys(toolButtonData).forEach((buttonName) => {
		// log(`buttonName: ${buttonName}`);

		let isSelected = editor.selectedTool === buttonName;

		let newToolButton = makeElement({
			tag: 'button',
			title: toolButtonData[buttonName].title,
			className: 'editor-page__tool',
			innerHTML: makeToolButtonSVG({
				name: buttonName,
				selected: isSelected,
				disabled: toolButtonData[buttonName].disabled,
			}),
		});

		if (toolButtonData[buttonName].disabled) {
			newToolButton.setAttribute('disabled', 'disabled');
		}

		newToolButton.addEventListener('click', () => clickTool(buttonName));

		if (isSelected) newToolButton.classList.add('editor-page__tool-selected');

		editor.subscribe({
			topic: 'whichToolIsSelected',
			subscriberID: `tools.${buttonName}`,
			callback: (newSelectedTool) => {
				let isSelected = newSelectedTool === buttonName;
				newToolButton.classList.toggle('editor-page__tool-selected', isSelected);
				newToolButton.innerHTML = makeToolButtonSVG({ name: buttonName, selected: isSelected });
			},
		});

		toolButtonElements[buttonName] = newToolButton;
	});

	// Put it all together
	let content = [];

	const onGlyphEditPage = editor.nav.page === 'Characters';
	const onComponentPage = editor.nav.page === 'Components';
	const onLigaturesPage = editor.nav.page === 'Ligatures';
	const selectedItem = editor.selectedItem;

	if (onGlyphEditPage || onLigaturesPage) {
		content.push(toolButtonElements.newRectangle);
		content.push(toolButtonElements.newOval);
		content.push(toolButtonElements.newPath);
	}

	if (onComponentPage && selectedItem && !selectedItem.pathPoints) {
		content.push(toolButtonElements.newRectangle);
		content.push(toolButtonElements.newOval);
		content.push(toolButtonElements.newPath);
	}

	if (onGlyphEditPage || onComponentPage || onLigaturesPage) {
		content.push(toolButtonElements.pathAddPoint);
		content.push(makeElement({ tag: 'div', style: 'height: 20px;' }));
		content.push(toolButtonElements.pathEdit);
		content.push(toolButtonElements.resize);
	}

	// log('makeEditToolsButtons', 'end');
	return content;
}

/**
 * Makes the view control buttons
 * @returns {Array} - an array of Elements
 */
export function makeViewToolsButtons() {
	// log(`makeViewToolsButtons`, 'start');

	// Button data
	let viewButtonTitles = {
		pan: 'Pan the edit canvas',
		zoom1to1: 'Zoom so 1 pixel = 1 em',
		zoomEm: 'Zoom to fit a full Em',
		zoomIn: 'Zoom in 10%',
		zoomOut: 'Zoom out 10%',
	};

	let viewButtonElements = {};
	const editor = getCurrentProjectEditor();

	Object.keys(viewButtonTitles).forEach((buttonName) => {
		// log(`buttonName: ${buttonName}`);

		let isSelected = editor.selectedTool === buttonName;
		let newToolButton = makeElement({
			tag: 'button',
			className: 'editor-page__tool',
			title: viewButtonTitles[buttonName],
			innerHTML: makeToolButtonSVG({
				name: buttonName,
				selected: isSelected,
			}),
		});
		newToolButton.addEventListener('click', () => clickTool(buttonName));

		if (isSelected) newToolButton.classList.add('editor-page__tool-selected');

		if (buttonName === 'pan') {
			editor.subscribe({
				topic: 'whichToolIsSelected',
				subscriberID: `tools.${buttonName}`,
				callback: (newSelectedTool) => {
					let isSelected = newSelectedTool === buttonName;
					newToolButton.classList.toggle('editor-page__tool-selected', isSelected);
					newToolButton.innerHTML = makeToolButtonSVG({ name: buttonName, selected: isSelected });
				},
			});
		}

		viewButtonElements[buttonName] = newToolButton;
	});

	// text zoom control
	let zoomReadoutNumber = '--';
	let view = editor.view;
	if (view) zoomReadoutNumber = '' + round(editor.view.dz * 100, 2);

	let zoomReadout = makeElement({
		tag: 'input',
		className: 'editor-page__zoom-readout',
		title: 'Zoom level',
		innerHTML: `${zoomReadoutNumber}%`,
	});
	zoomReadout.setAttribute('value', zoomReadoutNumber);
	zoomReadout.setAttribute('disabled', '');
	zoomReadout.addEventListener('change', () => {
		getCurrentProjectEditor().setViewZoom(this.value);
		this.innerHTML = `${this.value}%`;
		this.value = `${zoomReadoutNumber}%`;
	});

	editor.subscribe({
		topic: 'editCanvasView',
		subscriberID: 'tools.zoomReadout',
		callback: (newView) => {
			let zoomReadoutNumber = round(newView.dz * 100, 2);
			zoomReadout.setAttribute('value', '' + zoomReadoutNumber);
			zoomReadout.innerHTML = `${zoomReadoutNumber}%`;
			// @ts-ignore
			zoomReadout.value = `${zoomReadoutNumber}%`;
		},
	});

	// Live Preview pop-out
	let isPoppedOut = editor.popOutWindow !== false;
	let livePreviewPopOut = makeElement({
		tag: 'button',
		className: 'editor-page__tool',
		id: 'editor-page__tool__open-live-preview-pop-out',
		title: 'Pop out a Live Preview window',
		innerHTML: makeToolButtonSVG({
			name: isPoppedOut ? 'closeLivePreview' : 'openLivePreview',
			selected: false,
		}),
	});
	livePreviewPopOut.addEventListener('click', () => {
		// log(`Live Preview Pop Out CLICK HANDLER`, 'start');
		// log(`editor.popOutWindow: ${editor.popOutWindow}`);
		if (editor.popOutWindow === false) openPopOutWindow();
		else closePopOutWindow();
		// log(`Live Preview Pop Out CLICK HANDLER`, 'end');
	});

	// Put it all together
	let responsiveGroup = makeElement({ className: 'editor-page__responsive-group' });

	addAsChildren(responsiveGroup, [
		makeElement({ tag: 'div', content: '&emsp;' }),
		viewButtonElements.zoomOut,
		zoomReadout,
		viewButtonElements.zoomIn,
		makeElement({ tag: 'div', content: '&emsp;' }),
		viewButtonElements.zoom1to1,
	]);

	// log(`makeViewToolsButtons`, 'end');
	let result = [
		viewButtonElements.pan,
		responsiveGroup,
		makeColorStandardToggleButton(),
		viewButtonElements.zoomEm,
		livePreviewPopOut,
	];
	return result;
}

/**
 * Event handler for clicking a tool button
 * @param {String} tool - which tool was clicked
 */
export function clickTool(tool) {
	// log('clickTool', 'start');
	const editor = getCurrentProjectEditor();
	let zoomTools = ['zoom1to1', 'zoomEm', 'zoomIn', 'zoomOut'];

	if (zoomTools.includes(tool)) {
		if (tool === 'zoom1to1') editor.view = { dz: 1 };
		if (tool === 'zoomEm') editor.autoFitView();
		if (tool === 'zoomIn') editor.view = { dz: (editor.view.dz *= 1.1) };
		if (tool === 'zoomOut') editor.view = { dz: (editor.view.dz *= 0.9) };
		editor.publish('editCanvasView', editor.view);
	} else {
		switchToolTo(tool);
	}

	if (tool === 'resize') editor.multiSelect.points.clear();

	if (tool === 'newPath') {
		editor.multiSelect.points.clear();
		editor.multiSelect.shapes.clear();
	} else {
		stopCreatingNewPath();
	}

	// log('clickTool', 'end');
}

/**
 * Handle switching the tool on the current Editor
 * @param {String} newTool - which tool to switch to
 */
export function switchToolTo(newTool) {
	// log(`switchToolTo`, 'start');
	// log(`newTool: ${newTool}`);

	const editor = getCurrentProjectEditor();
	editor.selectedTool = newTool;
	editor.publish('whichToolIsSelected', newTool);
	// log(`switchToolTo`, 'end');
}

/**
 * Makes the Kern Tool button
 * @returns {Element}
 */
export function makeKernToolButton() {
	// Kern
	const editor = getCurrentProjectEditor();
	const kernToolButton = makeElement({
		tag: 'button',
		className: 'editor-page__tool editor-page__tool-selected',
		title: 'Adjust kern value',
		innerHTML: makeToolButtonSVG({
			name: 'kern',
			selected: true,
		}),
	});

	kernToolButton.addEventListener('click', () => clickTool('kern'));

	editor.subscribe({
		topic: 'whichToolIsSelected',
		subscriberID: `tools.kern`,
		callback: (newSelectedTool) => {
			let isSelected = newSelectedTool === 'kern';
			kernToolButton.classList.toggle('editor-page__tool-selected', isSelected);
			kernToolButton.innerHTML = makeToolButtonSVG({ name: 'kern', selected: isSelected });
		},
	});
	return kernToolButton;
}

export function makeColorStandardToggleButton() {
	const src = `iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAALxJREFUeNpiYBjsgBGZoyyvwHvH+/8nFBVX5FG4z74eROFLB0MZVYxgs5iQJe8+fPBZZSsjH8mGIQEmJNf9RzGUFMMCv2IaiGHow0d8pBqGYSA2Q0kxDKuB6IZKn2VkJNYwnAYiGwo2CGgoXsM0thE2EN1QWLLAZxhBA3EaisMwogzEMFSThxGXYUQbiNNQKLjIUE+6gRiGMoYxohtGsoG4DKXIQHRD9RmvM1JsID5DmSgp+1C8P2QAQIABAFCpVZv4PI0zAAAAAElFTkSuQmCC`;

	let toggleButton = makeElement({
		tag: 'button',
		title: 'Toggle between viewing SVG Glyphs and Standard Glyphs',
		className: 'editor-page__tool',
	});

	const editor = getCurrentProjectEditor();
	const isColor = editor.project.settings.app.displaySVGGlyphs;
	const imgWrapper = makeElement({
		tag: 'div',
		style: `
			width: 20px;
			height: 20px;
			border: 0px solid black;
			border-radius: ${isColor ? '0px 0px 0px 20px' : '0px 20px 0px 0px'};
			margin: -1px 0px 0px -1px;
			background-position: top left;
			background-size: 20px 20px;
			background-image: url(data:image/png;base64,${src});`,
	});

	// const img = new Image();
	// img.src = `data:image/png;base64,${src}`;
	// imgWrapper.appendChild(img);

	toggleButton.appendChild(imgWrapper);

	toggleButton.addEventListener('click', () => {
		editor.project.settings.app.displaySVGGlyphs = !editor.project.settings.app.displaySVGGlyphs;
		getCurrentProjectEditor().publish('glyphDisplayMode', editor.project.settings.app);
	});

	editor.subscribe({
		topic: 'glyphDisplayMode',
		subscriberID: `colorStandardToggleButton`,
		callback: () => {
			const isColor = editor.project.settings.app.displaySVGGlyphs;
			imgWrapper.style.borderRadius = `${isColor ? '0px 0px 0px 20px' : '0px 20px 0px 0px'}`;
		},
	});

	return toggleButton;
}

// --------------------------------------------------------------
// Button helper functions
// --------------------------------------------------------------

/**
 * Adds a given path to the current work item
 * @param {Path} newPath - Path to add
 * @returns {Path} - Path that was added, with updated properties
 */
export function addPathToCurrentItem(newPath) {
	// log(`addPathToCurrentItem`, 'start');
	// log(`name: ${ewPath.name}`);
	// log(`objType: ${ewPath.objType}`);

	const editor = getCurrentProjectEditor();
	if (newPath) {
		if (newPath.objType === 'ComponentInstance') {
			// log(`is a Component instance`);
			editor.selectedTool = 'pathEdit';
		} else if (newPath && editor.selectedTool === 'pathEdit') {
			// log(`triggered as true: newPath && editor.selectedTool == pathEdit \n\t NOT calling calcmaxes, okay?`);
		}
	} else {
		// log(`passed null, creating new path.`);
		newPath = new Path({});
		newPath.name = 'Rectangle ' + (editor.selectedItem.shapes.length * 1 + 1);
	}

	let sg = editor.selectedItem;

	newPath = sg.addOneShape(newPath);

	// log(`returns: ${ewPath.name}`);
	// log(`addPathToCurrentItem`, 'end');
	return newPath;
}

/**
 * Looks through the selected Item's shapes and returns
 * a shape (or false) at the coordinate location
 * @param {Number} cx - x coordinate in canvas units
 * @param {Number} cy - y coordinate in canvas units
 * @returns {Object | Boolean}
 */
export function getShapeAtLocation(cx, cy) {
	// log(`getShapeAtLocation`, 'start');
	// log('checking cx:' + cx + ' cy:' + cy);

	let shape;
	const editor = getCurrentProjectEditor();
	if (editor.project.settings.app.displaySVGGlyphs) return false;
	let sws = editor.selectedItem?.shapes;
	if (!sws) return false;
	// log(sws);
	for (let j = sws.length - 1; j >= 0; j--) {
		shape = sws[j];
		// log('Checking shape ' + j);
		if (isShapeHere(shape, cx, cy)) {
			// log(`getShapeAtLocation`, 'end');
			return shape;
		}
	}

	// clickEmptySpace();
	// log(`getShapeAtLocation`, 'end');
	return false;
}

/**
 * Returns a true if a clicked x/y is on a shape
 * @param {Path | ComponentInstance} shape - shape to check
 * @param {Number} cx - clicked x value
 * @param {Number} cy - clicked y value
 * @returns {Boolean}
 */
export function isShapeHere(shape, cx, cy) {
	// log(`isShapeHere`, 'start');
	// log(`cx: ${cx} / cy: ${cy}`);
	let sx = cXsX(cx);
	let sy = cYsY(cy);
	// log(`sx: ${sx} / sy: ${sy}`);

	if (!shape.maxes.isPointInside(sx, sy)) {
		// log(`Outside maxes for this shape`);
		// log(`isShapeHere`, 'end');
		return false;
	}

	let g1 = 100;
	let g2 = 200;
	let ghc = document.createElement('canvas');
	ghc.width = shape.maxes.width + g2;
	ghc.height = shape.maxes.height + g2;
	let ctx = ghc.getContext('2d', {
		alpha: false,
		willReadFrequently: true,
	});
	let view = { dx: shape.maxes.xMin * -1 + g1, dy: shape.maxes.yMax + g1, dz: 1 };

	ctx.fillStyle = 'rgb(255, 255, 255)';
	ctx.fillRect(0, 0, shape.maxes.width + g2, shape.maxes.height + g2);

	ctx.beginPath();
	drawShape(shape, ctx, view);
	ctx.closePath();

	ctx.fillStyle = 'rgb(0,0,0)';
	ctx.fill();

	let xTest = sx + view.dx;
	let yTest = view.dy - sy;
	let imageData = ctx.getImageData(xTest, yTest, 1, 1);

	// Visually debug
	// ctx.strokeStyle = 'lime';
	// ctx.strokeAlign = 'outside';
	// ctx.lineWidth = 4;
	// ctx.strokeRect(xTest - 10, yTest - 10, 20, 20);

	// log('red = ' + imageData.data[0] + '  returning: ' + (imageData.data[0] < 255));
	// log(`isShapeHere`, 'end');
	return imageData.data[0] < 255;
}

// --------------------------------------------------------------
// Tool button graphics
// --------------------------------------------------------------

let icons = {};

/**
 * Makes a SVG icon based on options
 * @param {Object} oa - options
 * @returns {String} - SVG code
 */
export function makeToolButtonSVG(oa) {
	// log(`makeToolButtonSVG`, 'start');
	// log(`oa.name: ${oa.name}`);
	let colorOutline = accentColors.blue.l25;
	let colorFill = accentColors.gray.l95;
	let icon = icons[oa.name];

	if (oa.selected && oa.disabled) {
		colorOutline = accentColors.gray.l30;
		colorFill = accentColors.gray.l90;
	} else if (oa.selected) {
		colorOutline = accentColors.gray.l10;
		colorFill = 'white';
	} else if (oa.disabled) {
		colorOutline = accentColors.gray.l80;
		colorFill = accentColors.gray.l90;
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
			x="0px" y="0px" width="20px" height="20px" viewBox="0 0 20 20"
		>
			${innerHTML}
		</svg>
	`;

	// log(`makeToolButtonSVG`, 'end');
	return content;
}

// Arrow
icons.resize = {
	fill: `
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
	outline: `
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
	`,
};

// Pen Plus
icons.pathAddPoint = {
	fill: `
		<rect x="5" y="4" width="5" height="14"></rect>
		<rect x="10" y="8" width="2" height="6"></rect>
		<rect x="3" y="8" width="2" height="6"></rect>
	`,
	outline: `
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
	`,
};

// Pen Minus
icons.pathRemovePoint = {
	fill: `
		<rect x="5" y="4" width="5" height="14"></rect>
		<rect x="10" y="8" width="2" height="6"></rect>
		<rect x="3" y="8" width="2" height="6"></rect>
	`,
	outline: `
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
	`,
};

// Pen
icons.pathEdit = {
	fill: `
		<rect x="7" y="4" width="5" height="14"></rect>
		<rect x="12" y="8" width="2" height="6"></rect>
		<rect x="5" y="8" width="2" height="6"></rect>
	`,
	outline: `
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
	`,
};

// Square with handles
icons.pathResize = {
	fill: `
		<rect x="1" y="1" display="inline" width="4" height="4"></rect>
		<rect x="8" y="8" display="inline" width="4" height="4"></rect>
		<rect x="15" y="15" display="inline" width="4" height="4"></rect>
		<rect x="15" y="1" display="inline" width="4" height="4"></rect>
		<rect x="1" y="15" display="inline" width="4" height="4"></rect>
	`,
	outline: `
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
	`,
};

icons.newRectangle = {
	fill: `<rect x="2" y="2" width="12" height="12"></rect>
`,
	outline: `
		<rect x="1" y="1" width="13" height="1"></rect>
		<rect x="1" y="13" width="13" height="1"></rect>
		<rect x="14" y="16" width="5" height="1"></rect>
		<rect x="1" y="2" width="1" height="12"></rect>
		<rect x="13" y="2" width="1" height="12"></rect>
		<rect x="16" y="14" width="1" height="5"></rect>
	`,
};

icons.newOval = {
	fill: `
		<rect x="6" y="2" width="4" height="1"></rect>
		<rect x="6" y="12" width="4" height="1"></rect>
		<rect x="5" y="10.1" width="4" height="1"></rect>
		<rect x="2" y="6" width="1" height="3"></rect>
		<rect x="13" y="6" width="1" height="3"></rect>
		<rect x="11" y="5.1" width="1" height="3"></rect>
		<rect x="3" y="3" width="10" height="9"></rect>
	`,
	outline: `
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
	`,
};

icons.newPath = {
	fill: `
		<rect x="5" y="2" width="5" height="13"></rect>
		<rect x="10" y="4" width="2" height="11"></rect>
		<rect x="3" y="9" width="2" height="6"></rect>
		<rect x="6" y="15" width="3" height="1"></rect>
		<rect x="12" y="6" width="2" height="7"></rect>
		<rect x="2" y="2" width="3" height="1"></rect>
		<rect x="4" y="3" width="3" height="1"></rect>
	`,
	outline: `
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
	`,
};

// View and Zoom

icons.zoomEm = {
	outline: `
		<polygon points="15,3 11,3 11,5 13,5 13,6 12,6 12,7 11,7 11,8 10,8 9,8 9,7 8,7 8,6 7,6 7,5 9,5 9,3 5,3 3,3 3,5 3,9 5,9 5,7 6,7 6,8 7,8 7,9 8,9 8,10 8,11 7,11 7,12 6,12 6,13 5,13 5,11 3,11 3,15 3,17 5,17 9,17 9,15 7,15 7,14 8,14 8,13 9,13 9,12 10,12 11,12 11,13 12,13 12,14 13,14 13,15 11,15 11,17 15,17 17,17 17,15 17,11 15,11 15,13 14,13 14,12 13,12 13,11 12,11 12,10 12,9 13,9 13,8 14,8 14,7 15,7 15,9 17,9 17,5 17,3"/>
		<rect x="18" y="1" width="1" height="18"></rect>
		<rect x="1" y="18" width="18" height="1"></rect>
		<rect x="1" y="1" width="18" height="1"></rect>
		<rect x="1" y="1" width="1" height="18"></rect>
	`,
};

icons.zoom1to1 = {
	outline: `
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
	`,
};

icons.zoomIn = {
	outline: `
		<rect x="9" y="3" width="2" height="14"></rect>
		<rect x="3" y="9" width="14" height="2"></rect>
	`,
};

icons.zoomOut = {
	outline: `<rect x="3" y="9" width="14" height="2"></rect>`,
};

icons.pan = {
	fill: `
		<rect x="9" y="1" width="2" height="18"></rect>
		<rect x="1" y="9" width="18" height="2"></rect>
		<rect x="2" y="7" width="2" height="6"></rect>
		<rect x="7" y="16" width="6" height="2"></rect>
		<rect x="16" y="7" width="2" height="6"></rect>
		<rect x="7" y="2" width="6" height="2"></rect>
	`,
	outline: `
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
	`,
};

icons.livePreview = {
	outline: `
		<polygon points="8 12 7 12 7 13 5 13 5 9 6 9 6 8 3 8 3 9 4 9 4 13 3 13 3 14 8 14 8 12"/>
		<rect x="8" y="10" width="1" height="1"/>
		<rect x="10" y="10" width="2" height="1"/>
		<rect x="12" y="11" width="1" height="2"/>
		<polygon points="12 13 10 13 10 11 9 11 9 15 8 15 8 16 10 16 10 14 12 14 12 13"/>
		<rect x="1" y="6" width="1" height="12"/>
		<rect x="14" y="8" width="1" height="10"/>
		<rect x="2" y="5" width="10" height="1"/>
		<polygon points="14 1 14 2 18 2 18 6 19 6 19 1 14 1"/>
		<rect x="15" y="4" width="1" height="1"/>
		<rect x="16" y="3" width="1" height="1"/>
		<rect x="14" y="5" width="1" height="1"/>
		<rect x="13" y="6" width="1" height="1"/>
		<rect x="17" y="2" width="1" height="1"/>
		<rect x="2" y="18" width="12" height="1"/>
	`,
};

icons.openLivePreview = {
	fill: `
	<rect data-name="Background" x="2" y="6" width="12" height="12"/>
	`,
	outline: `
		<g data-name="Lp">
			<polygon points="8 12 7 12 7 13 5 13 5 9 6 9 6 8 3 8 3 9 4 9 4 13 3 13 3 14 8 14 8 12"/>
			<rect x="8" y="10" width="1" height="1"/>
			<rect x="10" y="10" width="2" height="1"/>
			<rect x="12" y="11" width="1" height="2"/>
			<polygon points="12 13 10 13 10 11 9 11 9 15 8 15 8 16 10 16 10 14 12 14 12 13"/>
			<rect x="1" y="6" width="1" height="12"/>
			<rect x="14" y="8" width="1" height="10"/>
			<rect x="2" y="5" width="10" height="1"/>
			<rect x="2" y="18" width="12" height="1"/>
		</g>
		<g data-name="Launch">
			<polygon points="14 1 14 2 18 2 18 6 19 6 19 1 14 1"/>
			<rect x="15" y="4" width="1" height="1"/>
			<rect x="16" y="3" width="1" height="1"/>
			<rect x="14" y="5" width="1" height="1"/>
			<rect x="13" y="6" width="1" height="1"/>
			<rect x="17" y="2" width="1" height="1"/>
		</g>
	`,
};

icons.closeLivePreview = {
	fill: `
	<rect data-name="Background" x="2" y="6" width="12" height="12"/>
	`,
	outline: `
		<g data-name="Lp">
			<polygon points="8 12 7 12 7 13 5 13 5 9 6 9 6 8 3 8 3 9 4 9 4 13 3 13 3 14 8 14 8 12"/>
			<rect x="8" y="10" width="1" height="1"/>
			<rect x="10" y="10" width="2" height="1"/>
			<rect x="12" y="11" width="1" height="2"/>
			<polygon points="12 13 10 13 10 11 9 11 9 15 8 15 8 16 10 16 10 14 12 14 12 13"/>
			<rect x="1" y="6" width="1" height="12"/>
			<rect x="14" y="8" width="1" height="10"/>
			<rect x="2" y="5" width="10" height="1"/>
			<rect x="2" y="18" width="12" height="1"/>
		</g>
		<g data-name="Close">
			<rect x="15" y="4" width="1" height="1"/>
			<rect x="16" y="3" width="1" height="1"/>
			<rect x="14" y="5" width="1" height="1"/>
			<rect x="13" y="6" width="1" height="1"/>
			<rect x="13" y="0" width="1" height="1"/>
			<rect x="19" y="0" width="1" height="1"/>
			<rect x="19" y="6" width="1" height="1"/>
			<rect x="17" y="2" width="1" height="1"/>
			<rect x="18" y="1" width="1" height="1"/>
			<rect x="15" y="2" width="1" height="1"/>
			<rect x="14" y="1" width="1" height="1"/>
			<rect x="18" y="5" width="1" height="1"/>
			<rect x="17" y="4" width="1" height="1"/>
		</g>
	`,
};

icons.kern = {
	fill: `
		<rect x="1" y="9" width="18" height="2"></rect>
		<rect x="2" y="7" width="2" height="6"></rect>
		<rect x="16" y="7" width="2" height="6"></rect>
	`,
	outline: `
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
	`,
};
