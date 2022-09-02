import { ProjectEditor } from '../project/project_editor.js';
import { log } from '../common/functions.js';
import { GlyphrStudioApp } from './app.js';

/* Web Components */
import { AnchorTwelvepoint } from '../controls/anchor-twelvepoint/anchor-twelvepoint.js';
import { ButtonToggle } from '../controls/button-toggle/button-toggle.js';
import { CanvasDisplay } from '../controls/canvas-display/canvas-display.js';
import { CanvasEdit } from '../edit_canvas/canvas-edit.js';
import { FancyButton } from '../controls/fancy-button/fancy-button.js';
import { GlyphTile } from '../controls/glyph-tile/glyph-tile.js';
import { InfoBubble } from '../controls/info-bubble/info-bubble.js';
import { InputNumber } from '../controls/input-number/input-number.js';
import { InputNumberLockable } from '../controls/input-number-lockable/input-number-lockable.js';
import { getVersionTwoTestProject } from '../samples/versionTwoTestProject.js';

// The main app object
export const GSApp = new GlyphrStudioApp();

/**
 * First function to run when the browser starts
 */
export function glyphrStudioOnLoad() {
	log(`glyphrStudioOnLoad`, 'start');

	if (passPreChecks()) {
		// log(GSApp);
		console.log(`%cApp Version ${GSApp.version} \n\n`, 'color:rgb(0,170,225)');
		registerCustomComponents();

		// Load project
		let sample = getVersionTwoTestProject();
		GSApp.settings.dev.currentPage = 'Glyph edit';
		GSApp.setUp(JSON.stringify(sample));
	} else {
		log('did NOT pass pre-checks');
	}
	log(`glyphrStudioOnLoad`, 'end');
}

/**
 * Does some checking against new-ish HTML/JavaScript features
 * @returns {boolean}
 */
function passPreChecks() {
	let pass = true;
	// Templates
	const template = document.createElement('template');
	if (!template.content) {
		console.error('Browser does not support HTML Templates');
		pass = false;
	}
	return pass;
}

/**
 * Registers all the custom Web Components to the current document
 */
function registerCustomComponents() {
	customElements.define('anchor-twelvepoint', AnchorTwelvepoint);
	customElements.define('button-toggle', ButtonToggle);
	customElements.define('canvas-display', CanvasDisplay);
	customElements.define('canvas-edit', CanvasEdit);
	customElements.define('fancy-button', FancyButton);
	customElements.define('glyph-tile', GlyphTile);
	customElements.define('info-bubble', InfoBubble);
	customElements.define('input-number', InputNumber);
	customElements.define('input-number-lockable', InputNumberLockable);
}

/**
 * Returns the overall App object
 * @returns {GlyphrStudioApp}
 */
export function getGlyphrStudioApp() {
	return GSApp;
}

/**
 * Returns the project that is currently being edited
 * @returns {GlyphrStudioProject}
 */
export function getCurrentProject() {
	return getGlyphrStudioApp().getCurrentProjectEditor().project;
}

/**
 * Returns the current Project Editor
 * @returns {ProjectEditor}
 */
export function getCurrentProjectEditor() {
	const gs = getGlyphrStudioApp();
	if (!gs.projectEditors[gs.selectedProjectEditor]) {
		gs.projectEditors[gs.selectedProjectEditor] = new ProjectEditor();
	}
	return gs.projectEditors[gs.selectedProjectEditor];
}
