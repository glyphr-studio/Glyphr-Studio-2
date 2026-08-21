import { getGlyphrStudioApp } from './main.js';

/**
 * Shared appearance preferences for the liquid-glass design system.
 * These are the same localStorage keys the Open Project page writes,
 * so a choice made there also applies to the editor chrome.
 */

export const GLASS_UI_FONTS = {
	'fira-sans': "FiraGo, 'Fira Sans', Tahoma, sans-serif",
	'google-sans-flex': "'Google Sans Flex', 'Google Sans', Arial, sans-serif",
	'open-sans': "'Open Sans', Arial, sans-serif",
	system: "system-ui, -apple-system, 'Segoe UI', sans-serif",
};

/**
 * Reads the stored appearance preferences.
 * @returns {{theme: String, uiFont: String, language: String, autoSave: Boolean, reduceTransparency: Boolean}}
 */
export function getGlassPreferences() {
	let stored = {};
	try {
		stored = getGlyphrStudioApp().getLocalStorage() || {};
	} catch {
		stored = {};
	}
	return {
		theme: stored.openProjectTheme || 'system',
		uiFont: stored.openProjectUIFont || 'fira-sans',
		language: stored.openProjectLanguage || 'en',
		autoSave: stored.openProjectAutoSave !== false,
		reduceTransparency: stored.openProjectReduceTransparency === true,
	};
}

/**
 * Stamps theme / reduce-transparency / UI font onto an element so the
 * glass custom properties resolve correctly for everything inside it.
 * @param {HTMLElement} element - element to stamp
 * @param {Object =} preferences - preferences to apply
 * @returns {HTMLElement} - the same element
 */
export function applyGlassTheme(element, preferences = getGlassPreferences()) {
	if (!element) return element;
	element.dataset.theme = preferences.theme;
	element.dataset.reduceTransparency = String(Boolean(preferences.reduceTransparency));
	element.style.setProperty(
		'--font-library-font',
		GLASS_UI_FONTS[preferences.uiFont] || GLASS_UI_FONTS['fira-sans']
	);
	// #app__component-dom (toasts, modals, context menus, dropdowns) is a
	// sibling of #app__wrapper, not a descendant of it - custom properties
	// scoped to [data-theme] on the wrapper never reach it. Stamping <html>
	// too means every --glass-* consumer resolves the same theme, wherever
	// in the document it's mounted.
	if (document.documentElement !== element) {
		document.documentElement.dataset.theme = preferences.theme;
		document.documentElement.dataset.reduceTransparency = String(
			Boolean(preferences.reduceTransparency)
		);
	}
	return element;
}

/**
 * Applies the user's saved theme preference to an editor-owned surface,
 * same as the rest of the app. Editor chrome (top bar, sidebar, panels,
 * dropdowns, dialogs) is themed via the --glass-* tokens and follows this.
 * Some deeper editor pages still use hand-picked dark colors rather than
 * tokens and will keep looking dark-biased in light mode until reworked.
 * @param {HTMLElement} element - editor-owned surface
 * @returns {HTMLElement}
 */
export function applyEditorTheme(element) {
	return applyGlassTheme(element, getGlassPreferences());
}
