import { applyEditorLanguage, editorText } from '../app/editor_i18n.js';
import { applyEditorTheme } from '../app/glass_theme.js';
import { getCurrentProjectEditor, getGlyphrStudioApp } from '../app/main.js';
import {
	getExportMenuData,
	getFileMenuData,
	getHelpMenuData,
	getProjectsMenuData,
} from '../app/menu.js';
import { makeElement } from '../common/dom.js';
import {
	closeEveryTypeOfDialog,
	hideMountedComponent,
	makeContextMenu,
	showGlassConfirm,
	showGlassModal,
} from '../controls/dialogs/dialogs.js';

/**
 * The persistent chrome for the font editor - a glass topbar across the
 * top and a glass sidebar down the left edge. Both are rebuilt on every
 * Navigator.navigate() call, same as the rest of the page content.
 */

const CHROME_ICONS = {
	menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
	export:
		'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v11M8 10l4 4 4-4M4 17v3h16v-3"/></svg>',
	save: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h11l3 3v13H5zM8 4v6h7V4M8 15h8"/></svg>',
	help: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9.8 9a2.4 2.4 0 1 1 3.7 2c-1 .6-1.5 1.1-1.5 2.2M12 17h.01"/></svg>',
	close:
		'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h5v16h-5M11 8l-4 4 4 4M7 12h10"/></svg>',
	characters:
		'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19 11 5h2l6 14M8 14h8"/></svg>',
	ligatures:
		'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19V9a4 4 0 0 1 8 0v10M3 11h9M15 19v-8M15 11h5M17 8h.01"/></svg>',
	variable:
		'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h16M4 16h16"/><circle cx="9" cy="8" r="2.4"/><circle cx="16" cy="16" r="2.4"/></svg>',
	components:
		'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h7v7H4zM13 13h7v7h-7zM4 13h7v7H4zM13 4h7v7h-7z"/></svg>',
	kerning:
		'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5v14M17 5v14M10 12h4M10 12l2-2M10 12l2 2M14 12l-2-2M14 12l-2 2"/></svg>',
	preview:
		'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12z"/><circle cx="12" cy="12" r="2.6"/></svg>',
	globalActions:
		'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/></svg>',
	settings:
		'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2.2"/><circle cx="10" cy="17" r="2.2"/></svg>',
};

/**
 * Sidebar entries, in display order. `page` matches the internal page
 * name used by Navigator.tableOfContents.
 */
const SIDEBAR_PAGES = [
	{ page: 'Characters', labelKey: 'characters', icon: 'characters' },
	{ page: 'Ligatures', labelKey: 'ligatures', icon: 'ligatures' },
	{ page: 'Variable sets', labelKey: 'variableSets', icon: 'variable' },
	{ page: 'Components', labelKey: 'components', icon: 'components' },
	{ page: 'Kerning', labelKey: 'kerning', icon: 'kerning' },
	{ page: 'Live preview', labelKey: 'preview', icon: 'preview' },
	{ page: 'Global actions', labelKey: 'globalActions', icon: 'globalActions' },
	{ page: 'Settings', labelKey: 'settings', icon: 'settings' },
];

/**
 * Makes one glass icon button for the topbar.
 * @param {String} icon - key into CHROME_ICONS
 * @param {String} label - accessible label / tooltip
 * @param {Function} onClick - click handler
 * @returns {HTMLElement}
 */
function makeChromeIconButton(icon, label, onClick) {
	const button = /** @type {HTMLElement} */ (
		makeElement({ tag: 'button', className: 'editor-chrome__icon-button' })
	);
	button.innerHTML = CHROME_ICONS[icon] || '';
	button.setAttribute('type', 'button');
	button.setAttribute('aria-label', label);
	button.setAttribute('title', label);
	button.addEventListener('click', onClick);
	return button;
}

// --------------------------------------------------------------
// Top bar
// --------------------------------------------------------------

/**
 * Makes the editor top bar - app menu and project name on the left,
 * export / save / help / close on the right.
 * @returns {HTMLElement}
 */
export function makeEditorTopBar() {
	const editor = getCurrentProjectEditor();
	applyEditorLanguage();
	const topBar = /** @type {HTMLElement} */ (
		makeElement({ tag: 'header', id: 'editor-chrome__top-bar' })
	);
	applyEditorTheme(topBar);

	// Left: menu button + project name
	const left = makeElement({ className: 'editor-chrome__topbar-left' });

	const menuPill = makeElement({ className: 'editor-chrome__menu-pill liquid-glass' });
	const menuButton = makeChromeIconButton('menu', editorText('menu'), toggleSidebar);
	menuPill.appendChild(menuButton);

	// The project name pill doubles as the entry point to the app-level
	// File / Projects / Help menu - the hamburger button is reserved for
	// showing and hiding the sidebar.
	const namePill = /** @type {HTMLElement} */ (
		makeElement({ tag: 'button', className: 'editor-chrome__project-pill liquid-glass' })
	);
	namePill.setAttribute('type', 'button');
	namePill.appendChild(
		makeElement({ className: 'editor-chrome__project-label', content: editorText('project') })
	);
	namePill.appendChild(
		makeElement({
			className: 'editor-chrome__project-name',
			content: editor.project?.settings?.font?.family || editor.project?.settings?.project?.name,
		})
	);
	namePill.setAttribute(
		'title',
		`${editor.project?.settings?.font?.family || ''} ${
			editor.project?.settings?.font?.style || ''
		}`.trim()
	);
	namePill.addEventListener('click', (event) => {
		showAppMenu(/** @type {HTMLElement} */ (event.currentTarget));
	});

	left.append(menuPill, namePill);

	// Right: action buttons
	const actions = makeElement({ className: 'editor-chrome__actions liquid-glass' });
	actions.append(
		makeChromeIconButton('export', editorText('exportFont'), showExportModal),
		makeChromeIconButton('save', editorText('saveProject'), () => editor.saveProjectFile()),
		makeChromeIconButton('help', editorText('help'), showHelpModal),
		makeChromeIconButton('close', editorText('closeProject'), showCloseProjectModal)
	);

	topBar.append(left, makeElement({ className: 'editor-chrome__topbar-spacer' }), actions);
	return topBar;
}

/**
 * Opens the app-level File / Projects / Help menu below a trigger element.
 * @param {HTMLElement} trigger - element the menu is anchored to
 */
function showAppMenu(trigger) {
	const rect = trigger.getBoundingClientRect();
	closeEveryTypeOfDialog();
	const rows = [
		...getFileMenuData(),
		{ name: 'hr' },
		...getProjectsMenuData(),
		{ name: 'hr' },
		...getHelpMenuData(),
	];
	makeContextMenu(rows, rect.left, rect.bottom + 8, 500);
}

// --------------------------------------------------------------
// Top bar modals
// --------------------------------------------------------------

/**
 * Shows the glass Export modal. The buttons call the same export
 * functions the old File menu used.
 */
export function showExportModal() {
	const editor = getCurrentProjectEditor();
	const fontSettings = editor.project.settings.font;
	const baseName = `${fontSettings.family}-${fontSettings.style}`.replaceAll(' ', '');

	const list = makeElement({ className: 'glass-modal__list' });
	getExportMenuData().forEach((row) => {
		// Menu row names look like 'Export OTF file' / 'Export SVG font file'
		const format = row.name.replace(/^Export /, '').replace(/ file$/, '');
		const button = makeElement({ tag: 'button' });
		button.setAttribute('type', 'button');
		button.innerHTML = `<span>${format}<br><small>${baseName}.${format
			.replace(' font', '')
			.toLowerCase()}</small></span>`;
		button.addEventListener('click', () => {
			hideMountedComponent(layer);
			row.onClick();
		});
		list.appendChild(button);
	});

	const layer = showGlassModal({
		title: editorText('exportTitle'),
		description: editorText('exportBody'),
		bodyNode: list,
		componentName: 'editor-export',
		maxWidth: 480,
	});
	return layer;
}

/**
 * Keyboard shortcuts actually handled in edit_canvas/events_keyboard.js.
 */
const KEYBOARD_SHORTCUTS = [
	{ group: 'File' },
	{ keys: ['Ctrl', 'S'], action: 'Save the project file' },
	{ keys: ['Ctrl', 'E'], action: 'Export the font in its preferred format' },
	{ keys: ['Ctrl', 'G'], action: 'Export an SVG font file' },
	{ keys: ['Ctrl', 'O'], action: 'Open a project file' },
	{ group: 'Editing' },
	{ keys: ['Ctrl', 'Z'], action: 'Undo' },
	{ keys: ['Ctrl', 'Y'], action: 'Redo' },
	{ keys: ['Ctrl', 'Shift', 'Z'], action: 'Redo' },
	{ keys: ['Ctrl', 'A'], action: 'Select all shapes' },
	{ keys: ['Ctrl', 'C'], action: 'Copy the selected shapes' },
	{ keys: ['Ctrl', 'V'], action: 'Paste shapes' },
	{ keys: ['Ctrl', 'R'], action: 'Round all the selected values' },
	{ keys: ['Delete'], action: 'Delete the selection' },
	{ keys: ['Esc'], action: 'Close menus and dialogs' },
	{ group: 'Tools' },
	{ keys: ['V'], action: 'Select tool' },
	{ keys: ['B'], action: 'Node / path edit tool' },
	{ keys: ['R'], action: 'Rectangle tool' },
	{ keys: ['O'], action: 'Oval tool' },
	{ keys: ['W'], action: 'Path (curves) tool' },
	{ keys: ['H'], action: 'Handwriting / draw tool' },
	{ keys: ['U'], action: 'Add path point (pen) tool' },
	{ group: 'Canvas' },
	{ keys: ['Ctrl', '+'], action: 'Zoom in' },
	{ keys: ['Ctrl', '-'], action: 'Zoom out' },
	{ keys: ['Ctrl', '0'], action: 'Zoom to fit the em square' },
	{ keys: ['Space'], action: 'Hold to pan the canvas' },
	{ keys: ['Arrow keys'], action: 'Nudge the selection' },
	{ keys: ['Ctrl', ','], action: 'Go to the previous item' },
	{ keys: ['Ctrl', '.'], action: 'Go to the next item' },
	{ keys: ['[', ']'], action: 'Select the previous / next shape' },
];

/**
 * Shows the glass Help modal - overview and keyboard shortcuts tabs.
 */
export function showHelpModal() {
	const makeOverview = () => {
		const content = makeElement({ className: 'glass-modal__prose' });
		content.innerHTML = `
			<p>
				Glyphr Studio is a font editor. Everything you draw lives in a project
				that you save as a <code>.gs2</code> file, and export as a real font file.
			</p>
			<h3>Getting around</h3>
			<p>
				The sidebar on the left switches between the parts of your font.
				<strong>Characters</strong>, <strong>Ligatures</strong>, and
				<strong>Components</strong> are all glyph edit pages: pick an item, then draw
				with the tools down the left edge of the canvas.
				<strong>Kerning</strong> adjusts the spacing between pairs of characters, and
				<strong>Preview</strong> shows your font as running text.
			</p>
			<h3>Drawing</h3>
			<p>
				Shapes are made of paths. Use the shape tools to drop in a rectangle, oval, or
				circle, the pen tools to place and adjust individual points, and the draw tool
				for freehand strokes. The properties panel on the right edits the selected
				shape's name, position, size, and winding, and the Layers section reorders
				shapes within the glyph.
			</p>
			<h3>Saving and exporting</h3>
			<p>
				The save button in the top bar writes your project file. The export button
				generates an OTF, TTF, WOFF, WOFF2, or SVG font. Saving the project and
				exporting a font are separate steps - keep the project file, because a font
				file cannot be edited back into full project data.
			</p>
			<p>
				More documentation lives at
				<a href="https://glyphrstudio.com/help/">glyphrstudio.com/help</a>.
			</p>
		`;
		return content;
	};

	const makeShortcuts = () => {
		const table = makeElement({ className: 'glass-modal__shortcut-table' });
		KEYBOARD_SHORTCUTS.forEach((entry) => {
			if (entry.group) {
				table.appendChild(
					makeElement({ className: 'glass-modal__shortcut-group', content: entry.group })
				);
				return;
			}
			table.appendChild(makeElement({ tag: 'span', content: entry.action }));
			table.appendChild(
				makeElement({
					tag: 'span',
					innerHTML: entry.keys.map((key) => `<kbd>${key}</kbd>`).join(''),
				})
			);
		});
		return table;
	};

	return showGlassModal({
		title: editorText('help'),
		componentName: 'editor-help',
		maxWidth: 640,
		tabs: [
			{ label: editorText('overview'), content: makeOverview },
			{ label: editorText('keyboardShortcuts'), content: makeShortcuts },
		],
	});
}

/**
 * Confirms before leaving the project and returning to the home screen.
 */
export function showCloseProjectModal() {
	return showGlassConfirm({
		title: editorText('closeProjectTitle'),
		message: editorText('closeProjectBody'),
		confirmLabel: editorText('closeProject'),
		cancelLabel: editorText('cancel'),
		onConfirm: () => getGlyphrStudioApp().navigateHome(),
	});
}

// --------------------------------------------------------------
// Sidebar
// --------------------------------------------------------------

// Two independent, breakpoint-scoped flags, both false by default:
// on desktop the sidebar starts visible (collapsed = false hides it),
// below the responsive breakpoint it starts closed (open = true reveals
// the drawer). Module-level so the state survives the full-rebuild that
// every Navigator.navigate() call does.
let sidebarCollapsed = false;
let sidebarOpenOnMobile = false;

/**
 * Shows or hides the sidebar. On desktop this collapses the sidebar
 * column; below the responsive breakpoint it opens/closes the drawer.
 */
export function toggleSidebar() {
	sidebarCollapsed = !sidebarCollapsed;
	sidebarOpenOnMobile = !sidebarOpenOnMobile;
	applySidebarVisibility();
}

/**
 * Applies the current sidebar visibility flags to the mounted DOM node.
 */
function applySidebarVisibility() {
	const wrapper = document.querySelector('#editor-chrome__sidebar-wrapper');
	if (!wrapper) return;
	wrapper.classList.toggle('editor-chrome__sidebar-wrapper--collapsed', sidebarCollapsed);
	wrapper.classList.toggle('editor-chrome__sidebar--open', sidebarOpenOnMobile);
}

/**
 * Makes the persistent left sidebar. Below the desktop breakpoint it
 * collapses into a drawer, shown/hidden by the topbar menu button.
 * @returns {HTMLElement}
 */
export function makeEditorSidebar() {
	const editor = getCurrentProjectEditor();
	const wrapper = /** @type {HTMLElement} */ (
		makeElement({ tag: 'div', id: 'editor-chrome__sidebar-wrapper' })
	);
	applyEditorTheme(wrapper);
	wrapper.classList.toggle('editor-chrome__sidebar-wrapper--collapsed', sidebarCollapsed);
	wrapper.classList.toggle('editor-chrome__sidebar--open', sidebarOpenOnMobile);

	const sidebar = /** @type {HTMLElement} */ (
		makeElement({ tag: 'aside', className: 'editor-chrome__sidebar liquid-glass' })
	);
	sidebar.setAttribute('aria-label', editorText('editorPages'));

	const nav = makeElement({ tag: 'nav', className: 'editor-chrome__sidebar-nav' });

	SIDEBAR_PAGES.forEach((entry) => {
		const label = editorText(entry.labelKey);
		const button = /** @type {HTMLElement} */ (
			makeElement({ tag: 'button', className: 'editor-chrome__sidebar-button' })
		);
		button.setAttribute('type', 'button');
		button.innerHTML = `${CHROME_ICONS[entry.icon] || ''}<span>${label}</span>`;
		button.setAttribute('title', label);
		if (editor.nav.page === entry.page) {
			button.classList.add('editor-chrome__sidebar-button--selected');
			button.setAttribute('aria-current', 'page');
		}
		button.addEventListener('click', () => navigateToPage(entry.page));
		nav.appendChild(button);
	});

	sidebar.appendChild(nav);

	const scrim = /** @type {HTMLElement} */ (
		makeElement({ className: 'editor-chrome__sidebar-scrim' })
	);
	scrim.addEventListener('click', () => {
		sidebarOpenOnMobile = false;
		applySidebarVisibility();
	});

	wrapper.append(sidebar, scrim);
	return wrapper;
}

/**
 * Navigates the editor to a page, keeping selection state consistent.
 * @param {String} pageName - internal page name
 */
export function navigateToPage(pageName) {
	const editor = getCurrentProjectEditor();
	sidebarOpenOnMobile = false;
	applySidebarVisibility();
	if (editor.nav.page === pageName) return;

	editor.multiSelect.shapes.clear();
	editor.multiSelect.points.clear();
	editor.nav.page = pageName;
	if (pageName === 'Characters') editor.characterView = 'overview';
	if (pageName === 'Ligatures') editor.ligatureView = 'overview';
	if (pageName === 'Components') editor.componentView = 'overview';
	editor.navigate();
}
