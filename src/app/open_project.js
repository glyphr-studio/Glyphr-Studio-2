import { addAsChildren, getComponentDOM, makeElement } from '../common/dom.js';
import logoIcon from '../common/graphics/logo-icon.svg?raw';
import logoVertical from '../common/graphics/logo-wordmark-vertical.svg?raw';
import {
	closeEveryTypeOfDialog,
	hideMountedComponent,
	showError,
	showMountedComponent,
	showToast,
} from '../controls/dialogs/dialogs.js';
import { makeProgressIndicator } from '../controls/progress-indicator/progress_indicator.js';
import { cancelDefaultEventActions } from '../edit_canvas/events.js';
import { ioFont_importFont } from '../formats_io/otf/font_import.js';
import { ioSVG_importSVGfont } from '../formats_io/svg_font/svg_font_import.js';
import { validateSingleFileInput } from '../formats_io/validate_file_input.js';
import { GlyphrStudioProject } from '../project_data/glyphr_studio_project.js';
import { importGlyphrProjectFromText } from '../project_editor/import_project.js';
import obleggExampleProject from '../samples/oblegg.gs2?raw';
import simpleExampleProject from '../samples/simpleExampleProject.json';
import { updateWindowUnloadEvent } from './app.js';
import { applyGlassTheme, getGlassPreferences, GLASS_UI_FONTS } from './glass_theme.js';
import { getAutoSave, updateAutoSaveMetadata } from './project_storage.js';
import { getOpenProjectStrings, OPEN_PROJECT_LOCALES } from './open_project_i18n.js';
import {
	addProjectEditorAndSetAsImportTarget,
	getCurrentProjectEditor,
	getGlyphrStudioApp,
	getProjectEditorImportTarget,
	setCurrentProjectEditor,
} from './main.js';

/**
 * Page > Open Project
 * The first page you see when you open Glyphr Studio.
 */
let isSecondProject;

const LIBRARY_PAGES = ['my-fonts', 'favorites', 'examples', 'archived', 'settings'];
const UI_FONTS = GLASS_UI_FONTS;

const ICONS = {
	menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
	search:
		'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>',
	help: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9.8 9a2.4 2.4 0 1 1 3.7 2c-1 .6-1.5 1.1-1.5 2.2M12 17h.01"/></svg>',
	contact:
		'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16v12H4zM4 7l8 6 8-6"/></svg>',
	plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
	chevron: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 10 4 4 4-4"/></svg>',
	star: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9z"/></svg>',
	archive:
		'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h16v12H4zM3 4h18v4H3zM9 12h6"/></svg>',
};

function getLibraryPreferences() {
	return getGlassPreferences();
}

function libraryHash(page) {
	return page === 'my-fonts' ? '#/' : `#/${page}`;
}

function navigateLibrary(page) {
	window.location.hash = libraryHash(page);
}

function makeIconButton(icon, label, className = '') {
	const button = makeElement({
		tag: 'button',
		className: `font-library__icon-button ${className}`,
	});
	button.innerHTML = icon;
	button.setAttribute('aria-label', label);
	button.setAttribute('title', label);
	return button;
}

function applyLibraryTheme(element, preferences = getLibraryPreferences()) {
	applyGlassTheme(element, preferences);
}

function closeCustomDropdowns() {
	document
		.querySelectorAll('.font-library-dropdown-menu')
		.forEach((menu) => hideMountedComponent(/** @type {HTMLElement} */ (menu)));
	document
		.querySelectorAll('.font-library-custom-select[aria-expanded="true"]')
		.forEach((control) => control.setAttribute('aria-expanded', 'false'));
}

/**
 * @param {{options: Array<{value: string, label: string}>, value: string, label: string, name?: string, onChange?: (value: string) => void}} config
 */
function makeCustomDropdown({ options, value, label, name = '', onChange = () => {} }) {
	const wrapper = makeElement({ className: 'font-library-custom-select' });
	wrapper.setAttribute('aria-expanded', 'false');
	const button = makeElement({ tag: 'button', className: 'font-library-custom-select__trigger' });
	button.setAttribute('type', 'button');
	button.setAttribute('aria-label', label);
	button.innerHTML = `<span></span>${ICONS.chevron}`;
	const hiddenInput = /** @type {HTMLInputElement} */ (makeElement({ tag: 'input' }));
	hiddenInput.type = 'hidden';
	if (name) hiddenInput.name = name;
	let selectedValue = value;

	function updateSelection(nextValue, notify = true) {
		const option = options.find((candidate) => candidate.value === nextValue) || options[0];
		selectedValue = option.value;
		hiddenInput.value = selectedValue;
		button.querySelector('span').textContent = option.label;
		if (notify) onChange(selectedValue);
	}

	const menu = makeElement({ className: 'font-library-dropdown-menu liquid-glass' });
	menu.setAttribute('role', 'listbox');
	applyLibraryTheme(menu);
	options.forEach((option) => {
		const optionButton = makeElement({ tag: 'button', content: option.label });
		optionButton.setAttribute('type', 'button');
		optionButton.setAttribute('role', 'option');
		optionButton.addEventListener('click', (optionEvent) => {
			optionEvent.stopPropagation();
			updateSelection(option.value);
			closeCustomDropdowns();
		});
		menu.appendChild(optionButton);
	});
	getComponentDOM().appendChild(menu);
	hideMountedComponent(menu);

	button.addEventListener('click', (event) => {
		event.stopPropagation();
		const wasOpen = wrapper.getAttribute('aria-expanded') === 'true';
		closeCustomDropdowns();
		if (wasOpen) return;
		wrapper.setAttribute('aria-expanded', 'true');
		menu.querySelectorAll('[role="option"]').forEach((optionButton, index) => {
			optionButton.setAttribute('aria-selected', String(options[index].value === selectedValue));
		});
		showMountedComponent(menu);
		const rect = button.getBoundingClientRect();
		const menuWidth = Math.max(rect.width, 190);
		menu.style.width = `${menuWidth}px`;
		menu.style.left = `${Math.min(rect.left, window.innerWidth - menuWidth - 12)}px`;
		menu.style.top = `${Math.min(rect.bottom + 8, window.innerHeight - menu.offsetHeight - 12)}px`;
		window.setTimeout(
			() => document.addEventListener('click', closeCustomDropdowns, { once: true }),
			0
		);
	});

	wrapper.append(button, hiddenInput);
	updateSelection(value, false);
	return {
		element: wrapper,
		get value() {
			return selectedValue;
		},
		setValue(nextValue) {
			updateSelection(nextValue, false);
		},
	};
}

function appendHomeModal(
	content,
	strings,
	extraClass = '',
	componentName = 'modal',
	mountOnly = false
) {
	let layer = /** @type {HTMLElement | null} */ (
		document.querySelector(`.font-library-modal-layer[data-component="${componentName}"][hidden]`)
	);
	if (!layer) {
		layer = /** @type {HTMLElement} */ (makeElement({ className: 'font-library-modal-layer' }));
	}
	layer.className = `font-library-modal-layer ${extraClass}`.trim();
	layer.dataset.component = componentName;
	layer.replaceChildren();
	applyLibraryTheme(layer);
	const modal = makeElement({ tag: 'section', className: 'font-library-modal liquid-glass' });
	modal.setAttribute('role', 'dialog');
	modal.setAttribute('aria-modal', 'true');
	const close = makeIconButton('&times;', strings.close, 'font-library-modal__close');
	close.addEventListener('click', () => hideMountedComponent(layer));
	modal.append(close, content);
	layer.appendChild(modal);
	layer.addEventListener('mousedown', (event) => {
		if (event.target === layer) hideMountedComponent(layer);
	});
	if (mountOnly) {
		getComponentDOM().appendChild(layer);
		hideMountedComponent(layer);
	} else {
		getComponentDOM().prepend(layer);
		showMountedComponent(layer, 'flex');
	}
	if (!mountOnly)
		modal.animate?.(
			[
				{ opacity: 0, transform: 'translateY(16px) scale(.98)' },
				{ opacity: 1, transform: 'none' },
			],
			{ duration: 180, easing: 'cubic-bezier(.2,.8,.2,1)' }
		);
	return layer;
}

function showCreateFontModal(strings, preferences, mountOnly = false) {
	const form = /** @type {HTMLFormElement} */ (
		makeElement({ tag: 'form', className: 'font-library-form' })
	);
	form.innerHTML = `
		<div class="font-library-modal__heading"><h2>${strings.createTitle}</h2></div>
		<label>${strings.nameFont}<input name="name" type="text" value="My Font" required autofocus maxlength="80"></label>
		<label>${strings.description} <span>${strings.optional}</span><textarea name="description" rows="3" maxlength="300"></textarea></label>
		<label>${strings.classification}<span data-classification></span></label>
		<div class="font-library-form__actions"><button type="button" data-cancel>${strings.cancel}</button><button type="submit" class="font-library__primary-button">${strings.add}</button></div>`;
	const classification = makeCustomDropdown({
		name: 'classification',
		label: strings.classification,
		value: 'sans-serif',
		options: [
			{ value: 'sans-serif', label: strings.sansSerif },
			{ value: 'sans-serif-geometric', label: strings.sansSerifGeometric },
			{ value: 'sans-serif-humanist', label: strings.sansSerifHumanist },
			{ value: 'sans-serif-neo-grotesque', label: strings.sansSerifNeoGrotesque },
			{ value: 'sans-serif-grotesque', label: strings.sansSerifGrotesque },
			{ value: 'sans-serif-rounded', label: strings.sansSerifRounded },
			{ value: 'serif', label: strings.serif },
			{ value: 'serif-old-style', label: strings.serifOldStyle },
			{ value: 'serif-transitional', label: strings.serifTransitional },
			{ value: 'serif-didone', label: strings.serifDidone },
			{ value: 'slab-serif', label: strings.slabSerif },
			{ value: 'display', label: strings.display },
			{ value: 'handwriting', label: strings.handwriting },
			{ value: 'monospace', label: strings.monospace },
			{ value: 'blackletter', label: strings.blackletter },
		],
	});
	form.querySelector('[data-classification]').replaceWith(classification.element);
	const layer = appendHomeModal(form, strings, '', 'create-font', mountOnly);
	const cancelButton = /** @type {HTMLElement | null} */ (form.querySelector('[data-cancel]'));
	if (cancelButton) cancelButton.addEventListener('click', () => hideMountedComponent(layer));
	form.addEventListener('submit', (event) => {
		event.preventDefault();
		const data = new FormData(form);
		const name = String(data.get('name') || 'My Font').trim() || 'My Font';
		const project = new GlyphrStudioProject({});
		project.settings.project.name = name;
		project.settings.project.description = String(data.get('description') || '').trim();
		project.settings.project.classification = String(data.get('classification') || 'sans-serif');
		project.settings.font.family = name;
		project.settings.font.description = project.settings.project.description;
		project.settings.app.autoSave = preferences.autoSave;
		hideMountedComponent(layer);
		importProjectDataAndNavigate(project.save());
	});
}

function showImportFontModal(strings, mountOnly = false) {
	const content = makeElement({ className: 'font-library-form' });
	content.innerHTML = `
		<div class="font-library-modal__heading"><h2>${strings.importTitle}</h2><p>${strings.importBody}</p></div>
		<label>${strings.formats}<span data-import-format></span></label>
		<div class="font-library__drop-zone">${strings.importBody}</div>
		<div class="font-library-form__actions"><button type="button" data-cancel>${strings.cancel}</button><button type="button" data-choose class="font-library__primary-button">${strings.chooseFile}</button></div>`;
	const formatDropdown = makeCustomDropdown({
		label: strings.formats,
		value: 'all',
		options: [
			{ value: 'all', label: strings.allSupported },
			{ value: 'project', label: strings.projectFiles },
			{ value: 'font', label: strings.fontFiles },
			{ value: 'svg', label: strings.svgFonts },
		],
	});
	content.querySelector('[data-import-format]').replaceWith(formatDropdown.element);
	const layer = appendHomeModal(content, strings, '', 'import-font', mountOnly);
	const cancelButton = /** @type {HTMLElement | null} */ (content.querySelector('[data-cancel]'));
	if (cancelButton) cancelButton.addEventListener('click', () => hideMountedComponent(layer));
	const chooseButton = /** @type {HTMLElement | null} */ (content.querySelector('[data-choose]'));
	if (chooseButton) {
		chooseButton.addEventListener('click', () => {
			const format = formatDropdown.value;
			const accept =
				format === 'project'
					? '.gs2,.txt'
					: format === 'font'
					? '.otf,.ttf,.woff,.woff2'
					: format === 'svg'
					? '.svg'
					: '.gs2,.txt,.otf,.ttf,.woff,.woff2,.svg';
			getFilesFromFilePicker(handleOpenProjectPageFileInput, {
				types: [
					{
						description: strings.formats,
						accept: { 'application/octet-stream': accept.split(',') },
					},
				],
			});
		});
	}
	const dropZone = /** @type {HTMLElement | null} */ (
		content.querySelector('.font-library__drop-zone')
	);
	if (!dropZone) return layer;
	const setDropZoneState = (isActive) => {
		dropZone.classList.toggle('is-dragover', isActive);
	};
	const handleDropZoneFiles = (/** @type {DragEvent} */ event) => {
		cancelDefaultEventActions(event);
		setDropZoneState(false);
		const transfer = event.dataTransfer;
		if (transfer?.files?.length) {
			handleOpenProjectPageFileInput(transfer.files);
			return;
		}
		handleOpenProjectPageFileInput(transfer?.items || []);
	};
	dropZone.addEventListener('dragenter', (event) => {
		cancelDefaultEventActions(event);
		setDropZoneState(true);
	});
	dropZone.addEventListener('dragover', (event) => {
		cancelDefaultEventActions(event);
		setDropZoneState(true);
	});
	dropZone.addEventListener('dragleave', (/** @type {DragEvent} */ event) => {
		const relatedTarget = event.relatedTarget;
		if (!(relatedTarget instanceof Node) || !dropZone.contains(relatedTarget)) {
			setDropZoneState(false);
		}
	});
	dropZone.addEventListener('drop', handleDropZoneFiles);
	dropZone.addEventListener('dragend', () => setDropZoneState(false));
	return layer;
}

function makeProjectCard(save, strings, refresh, archivedPage = false) {
	const card = makeElement({ tag: 'article', className: 'font-project-card liquid-glass' });
	const preview = makeElement({ className: 'font-project-card__preview' });
	try {
		const previewProject = importGlyphrProjectFromText(save.project);
		preview.appendChild(makeRealFontPreview(previewProject));
	} catch {
		preview.textContent = save.name?.slice(0, 2) || 'Aa';
	}
	const info = makeElement({ className: 'font-project-card__info' });
	const title = makeElement({ tag: 'h3' });
	title.textContent = save.name || 'Untitled Font';
	const date = makeElement({ tag: 'p' });
	date.textContent = `${strings.updated} ${new Date(save.time).toLocaleDateString()}`;
	info.append(title, date);
	const favorite = makeIconButton(
		ICONS.star,
		save.favorite ? strings.unfavorite : strings.favorite,
		'font-project-card__favorite'
	);
	if (save.favorite) favorite.classList.add('is-active');
	favorite.addEventListener('click', async (event) => {
		event.stopPropagation();
		await updateAutoSaveMetadata(save.id, { favorite: !save.favorite });
		refresh();
	});
	const archive = makeIconButton(
		ICONS.archive,
		archivedPage ? strings.restore : strings.archive,
		'font-project-card__archive'
	);
	archive.addEventListener('click', async (event) => {
		event.stopPropagation();
		await updateAutoSaveMetadata(save.id, { archived: !archivedPage });
		refresh();
	});
	card.append(preview, info, favorite, archive);
	card.addEventListener('click', () => loadProjectFromAutoSave(save.id));
	card.setAttribute('tabindex', '0');
	card.addEventListener('keydown', (event) => {
		if (event.key === 'Enter') loadProjectFromAutoSave(save.id);
	});
	return card;
}

function makeRealFontPreview(project, text = getProjectPreviewText(project), fontSize = 68) {
	const fontPreview = /** @type {HTMLElement & {project?: Object}} */ (
		makeElement({ tag: 'font-preview' })
	);
	fontPreview.project = project;
	fontPreview.setAttribute('text', text);
	fontPreview.setAttribute('font-size', String(fontSize));
	fontPreview.setAttribute('line-gap', '0');
	fontPreview.setAttribute('enable-ligatures', 'false');
	fontPreview.setAttribute('enable-kerning', 'false');
	fontPreview.style.setProperty('--font-preview-text-align', 'center');
	return fontPreview;
}

function getProjectPreviewText(project) {
	const preferred = ['glyph-0x41', 'glyph-0x61'];
	const available = preferred.filter((glyphID) => project.glyphs?.[glyphID]);
	if (available.length) {
		return available
			.map((glyphID) => String.fromCodePoint(parseInt(glyphID.slice(8), 16)))
			.join('');
	}
	const characters = Object.keys(project.glyphs || {})
		.map((glyphID) => parseInt(glyphID.replace('glyph-0x', ''), 16))
		.filter((codePoint) => Number.isInteger(codePoint) && codePoint >= 0x21 && codePoint <= 0xffff)
		.slice(0, 2)
		.map((codePoint) => String.fromCodePoint(codePoint));
	return characters.join('') || 'Aa';
}

function renderProjectGrid(container, saves, strings, page, query = '') {
	container.innerHTML = '';
	const normalizedQuery = query.trim().toLocaleLowerCase();
	let visible = saves.filter((save) => (page === 'archived' ? save.archived : !save.archived));
	if (page === 'favorites') visible = visible.filter((save) => save.favorite);
	if (normalizedQuery)
		visible = visible.filter((save) =>
			String(save.name || '')
				.toLocaleLowerCase()
				.includes(normalizedQuery)
		);
	visible.sort((a, b) => (b.time || 0) - (a.time || 0));
	const refresh = () => renderLibraryProjects(container, strings, page, query);
	if (!visible.length) {
		const empty = makeElement({ className: 'font-library__empty' });
		empty.innerHTML = `<div>Aa</div><h3>${
			normalizedQuery ? strings.noResults : strings.noFonts
		}</h3><p>${strings.noFontsBody}</p>`;
		container.appendChild(empty);
		return;
	}
	visible.forEach((save) =>
		container.appendChild(makeProjectCard(save, strings, refresh, page === 'archived'))
	);
}

async function renderLibraryProjects(container, strings, page, query = '') {
	container.setAttribute('aria-busy', 'true');
	try {
		const saves = await getGlyphrStudioApp().getAutoSaves();
		renderProjectGrid(container, saves, strings, page, query);
	} catch {
		container.innerHTML = `<div class="font-library__empty"><h3>${strings.noFonts}</h3><p>${strings.noFontsBody}</p></div>`;
	} finally {
		container.removeAttribute('aria-busy');
	}
}

function showSearchOverlay(strings, saves, initialQuery = '') {
	const content = makeElement({ className: 'font-library-search-modal' });
	content.innerHTML = `<div class="font-library-modal__heading"><h2>${strings.searchTitle}</h2></div><label class="font-library__search font-library__search--modal">${ICONS.search}<input type="search" placeholder="${strings.searchPlaceholder}" autofocus></label><div class="font-library__search-results"></div>`;
	appendHomeModal(content, strings, 'font-library-modal-layer--search', 'search');
	const input = content.querySelector('input');
	input.value = initialQuery;
	const results = content.querySelector('.font-library__search-results');
	const render = () => renderProjectGrid(results, saves, strings, 'my-fonts', input.value);
	input.addEventListener('input', render);
	render();
}

function showPrivacyPolicyModal(strings) {
	const content = makeElement({ className: 'font-library-privacy-modal' });
	content.innerHTML = `
		<div class="font-library-modal__heading"><h2>${strings.privacyPolicy}</h2></div>
		<div class="font-library-privacy-modal__body">
			<p><em>${strings.privacyUpdated}</em></p>

			<h3>${strings.privacyDataTitle}</h3>
			<p>${strings.privacyDataBody}</p>

			<h3>${strings.privacyAccountsTitle}</h3>
			<p>${strings.privacyAccountsBody}</p>

			<h3>${strings.privacyTelemetryTitle}</h3>
			<p>${strings.privacyTelemetryBody}</p>

			<h3>${strings.privacyStorageTitle}</h3>
			<p>${strings.privacyStorageBody}</p>

			<h3>${strings.privacyThirdPartyTitle}</h3>
			<p>${strings.privacyThirdPartyBody}</p>

			<h3>${strings.privacyChangesTitle}</h3>
			<p>${strings.privacyChangesBody}</p>

			<h3>${strings.privacyContactTitle}</h3>
			<p>${strings.privacyContactBody}</p>
		</div>`;
	appendHomeModal(content, strings, 'font-library-modal-layer--privacy', 'privacy');
}

function makeLibrarySettings(strings, preferences) {
	const wrapper = makeElement({ className: 'font-library-settings' });
	wrapper.innerHTML = `
		<section class="font-library-settings__card liquid-glass"><h2>${strings.appearance}</h2>
			<div class="font-library-settings__row"><span><strong>${strings.theme}</strong></span><span data-theme-dropdown></span></div>
			<div class="font-library-settings__row"><span><strong>${strings.uiFont}</strong></span><span data-font-dropdown></span></div>
			<div class="font-library-settings__row"><span><strong>${strings.language}</strong></span><span data-language-dropdown></span></div>
			<label class="font-library-settings__toggle"><span><strong>${strings.reduceTransparency}</strong><small>${strings.reduceTransparencyBody}</small></span><input type="checkbox" data-toggle="reduceTransparency"></label>
		</section>
		<section class="font-library-settings__card liquid-glass"><h2>${strings.privacySaving}</h2>
			<label class="font-library-settings__toggle"><span><strong>${strings.telemetry}</strong><small>${strings.telemetryBody}</small></span><input type="checkbox" data-toggle="telemetry"></label>
			<label class="font-library-settings__toggle"><span><strong>${strings.autoSave}</strong><small>${strings.autoSaveBody}</small></span><input type="checkbox" data-toggle="autoSave"></label>
		</section>`;
	const saveSetting = (key, value) => {
		getGlyphrStudioApp().setLocalStorage(key, value);
		getGlyphrStudioApp().navigateHome(true, 'settings');
	};
	const themeDropdown = makeCustomDropdown({
		label: strings.theme,
		value: preferences.theme,
		options: [
			{ value: 'light', label: strings.light },
			{ value: 'dark', label: strings.dark },
			{ value: 'system', label: strings.system },
		],
		onChange: (value) => saveSetting('openProjectTheme', value),
	});
	const fontDropdown = makeCustomDropdown({
		label: strings.uiFont,
		value: preferences.uiFont,
		options: [
			{ value: 'fira-sans', label: 'Fira Sans (default)' },
			{ value: 'google-sans-flex', label: 'Google Sans Flex' },
			{ value: 'open-sans', label: 'Open Sans' },
			{ value: 'system', label: strings.systemDefault },
		],
		onChange: (value) => saveSetting('openProjectUIFont', value),
	});
	const languageDropdown = makeCustomDropdown({
		label: strings.language,
		value: preferences.language,
		options: OPEN_PROJECT_LOCALES.map(([value, label]) => ({ value, label })),
		onChange: (value) => saveSetting('openProjectLanguage', value),
	});
	wrapper.querySelector('[data-theme-dropdown]').replaceWith(themeDropdown.element);
	wrapper.querySelector('[data-font-dropdown]').replaceWith(fontDropdown.element);
	wrapper.querySelector('[data-language-dropdown]').replaceWith(languageDropdown.element);
	const telemetryToggle = /** @type {HTMLInputElement} */ (
		wrapper.querySelector('[data-toggle="telemetry"]')
	);
	const autoSaveToggle = /** @type {HTMLInputElement} */ (
		wrapper.querySelector('[data-toggle="autoSave"]')
	);
	const reduceTransparencyToggle = /** @type {HTMLInputElement} */ (
		wrapper.querySelector('[data-toggle="reduceTransparency"]')
	);
	telemetryToggle.checked = getGlyphrStudioApp().settings.telemetry;
	autoSaveToggle.checked = preferences.autoSave;
	reduceTransparencyToggle.checked = preferences.reduceTransparency;
	telemetryToggle.addEventListener('change', () =>
		getGlyphrStudioApp().setGoogleTelemetry(telemetryToggle.checked)
	);
	autoSaveToggle.addEventListener('change', () => {
		const enabled = autoSaveToggle.checked;
		const app = getGlyphrStudioApp();
		app.setLocalStorage('openProjectAutoSave', enabled);
		app.projectEditors.forEach((editor) => {
			if (editor.project) editor.project.settings.app.autoSave = enabled;
		});
	});
	reduceTransparencyToggle.addEventListener('change', () => {
		const enabled = reduceTransparencyToggle.checked;
		getGlyphrStudioApp().setLocalStorage('openProjectReduceTransparency', enabled);
		getGlyphrStudioApp().navigateHome(true, 'settings');
	});
	return wrapper;
}

function makeModernOpenProjectPage(activePage = 'my-fonts') {
	const page = LIBRARY_PAGES.includes(activePage) ? activePage : 'my-fonts';
	const preferences = getLibraryPreferences();
	const strings = getOpenProjectStrings(preferences.language);
	document.documentElement.lang = preferences.language;
	const app = getGlyphrStudioApp();
	app.applyUIFont(preferences.uiFont);
	const content = makeElement({ tag: 'div', id: 'app__page', className: 'font-library' });
	content.dataset.theme = preferences.theme;
	content.dataset.reduceTransparency = String(Boolean(preferences.reduceTransparency));
	content.style.setProperty(
		'--font-library-font',
		UI_FONTS[preferences.uiFont] || UI_FONTS['fira-sans']
	);
	content.innerHTML = `
		<header class="font-library__topbar">
			<div class="font-library__topbar-left"><button class="font-library__mobile-menu liquid-glass" aria-label="${strings.menu}">${ICONS.menu}</button><button class="font-library__brand liquid-glass" aria-label="Glyphr Studio">${logoIcon}<span class="font-library__brand-wordmark"></span></button></div>
			<div class="font-library__nav liquid-glass" role="navigation" aria-label="${strings.primaryNav}"></div>
			<div class="font-library__actions liquid-glass"><div class="font-library__create-wrap"><button class="font-library__create font-library__primary-button">${ICONS.plus}<span>${strings.create}</span>${ICONS.chevron}</button></div><label class="font-library__search"><input type="search" placeholder="${strings.search}"></label><button class="font-library__search-button" aria-label="${strings.search}">${ICONS.search}</button><a class="font-library__icon-button" href="https://www.glyphrstudio.com/help/" aria-label="${strings.help}" title="${strings.help}">${ICONS.help}</a><a class="font-library__icon-button" href="https://github.com/glyphr-studio/Glyphr-Studio-2/issues" target="_blank" aria-label="${strings.contact}" title="${strings.contact}">${ICONS.contact}</a></div>
		</header>
		<aside class="font-library__sidebar" aria-hidden="true"><button class="font-library__sidebar-close" aria-label="${strings.close}">&times;</button><h2>${strings.menu}</h2><div class="font-library__sidebar-nav" role="navigation" aria-label="${strings.menu}"></div></aside><div class="font-library__sidebar-scrim"></div>
		<main class="font-library__main"><div class="font-library__heading"><div><h1></h1><p></p></div><span class="font-library__count"></span></div><div class="font-library__content"></div></main>
		<footer class="font-library__footer">
			<p>${strings.version} ${app.version}</p>
			<p>${strings.licenseNotice}</p>
			<p>${strings.moreInfo} <a href="https://www.glyphrstudio.com">glyphrstudio.com</a> &middot; <button type="button" class="font-library__footer-link" data-privacy>${strings.privacyPolicy}</button></p>
		</footer>
		<div id="open-project__drop-note"></div>`;

	const navItems = [
		['my-fonts', strings.myFonts],
		['favorites', strings.favorites],
		['examples', strings.examples],
		['archived', strings.archived],
		['settings', strings.settings],
	];
	const makeNav = (nav) =>
		navItems.forEach(([id, label]) => {
			const button = makeElement({ tag: 'button' });
			button.textContent = label;
			if (id === page) button.setAttribute('aria-current', 'page');
			button.addEventListener('click', () => navigateLibrary(id));
			nav.appendChild(button);
		});
	makeNav(content.querySelector('.font-library__nav'));
	makeNav(content.querySelector('.font-library__sidebar-nav'));
	try {
		content
			.querySelector('.font-library__brand-wordmark')
			.appendChild(
				makeRealFontPreview(importGlyphrProjectFromText(obleggExampleProject), 'glyphr studio', 25)
			);
	} catch {
		content.querySelector('.font-library__brand-wordmark').textContent = 'Glyphr Studio';
	}

	const sidebar = content.querySelector('.font-library__sidebar');
	const scrim = content.querySelector('.font-library__sidebar-scrim');
	const closeSidebar = () => {
		sidebar.classList.remove('is-open');
		scrim.classList.remove('is-open');
		sidebar.setAttribute('aria-hidden', 'true');
	};
	content.querySelector('.font-library__mobile-menu').addEventListener('click', () => {
		sidebar.classList.add('is-open');
		scrim.classList.add('is-open');
		sidebar.setAttribute('aria-hidden', 'false');
	});
	content.querySelector('.font-library__sidebar-close').addEventListener('click', closeSidebar);
	scrim.addEventListener('click', closeSidebar);
	const handleResponsiveNavigation = () => {
		if (!content.isConnected) {
			window.removeEventListener('resize', handleResponsiveNavigation);
			return;
		}
		if (window.innerWidth >= 1190) closeSidebar();
	};
	window.addEventListener('resize', handleResponsiveNavigation);

	const createButton = content.querySelector('.font-library__create');
	const createMenu = makeElement({ className: 'font-library__create-menu liquid-glass' });
	createMenu.innerHTML = `<button data-create>${ICONS.plus}<span>${strings.createFont}</span></button><button data-import>${ICONS.archive}<span>${strings.importFont}</span></button>`;
	content.querySelector('.font-library__create-wrap').appendChild(createMenu);
	hideMountedComponent(createMenu);
	createMenu
		.querySelector('[data-create]')
		.addEventListener('click', () => showCreateFontModal(strings, preferences));
	createMenu
		.querySelector('[data-import]')
		.addEventListener('click', () => showImportFontModal(strings));
	showCreateFontModal(strings, preferences, true);
	showImportFontModal(strings, true);
	appendHomeModal(makeElement(), strings, 'font-library-modal-layer--search', 'search', true);
	content
		.querySelector('[data-privacy]')
		.addEventListener('click', () => showPrivacyPolicyModal(strings));
	createButton.addEventListener('click', (event) => {
		event.stopPropagation();
		showMountedComponent(createMenu);
		window.setTimeout(
			() =>
				document.addEventListener('click', () => hideMountedComponent(createMenu), {
					once: true,
				}),
			0
		);
	});

	const body = content.querySelector('.font-library__content');
	const heading = content.querySelector('.font-library__heading h1');
	const description = content.querySelector('.font-library__heading p');
	const count = content.querySelector('.font-library__count');
	if (page === 'settings') {
		heading.textContent = strings.settingsTitle;
		description.textContent = strings.settingsBody;
		body.appendChild(makeLibrarySettings(strings, preferences));
	} else if (page === 'examples') {
		heading.textContent = strings.examplesTitle;
		description.textContent = strings.examplesBody;
		const examples = makeElement({ className: 'font-library__examples' });
		[
			['oblegg', strings.oblegg, strings.obleggDescription, 'Ob'],
			['simpleProject', strings.simpleProject, strings.simpleProjectDescription, 'ABC'],
		].forEach(([id, title, exampleDescription, preview]) => {
			const card = makeElement({ tag: 'article', className: 'font-example-card liquid-glass' });
			card.innerHTML = `<div class="font-example-card__preview"></div><h3>${title}</h3><p>${exampleDescription}</p><button class="font-library__primary-button">${strings.openExample}</button>`;
			try {
				const sample = id === 'oblegg' ? obleggExampleProject : simpleExampleProject;
				card
					.querySelector('.font-example-card__preview')
					.appendChild(makeRealFontPreview(importGlyphrProjectFromText(sample)));
			} catch {
				card.querySelector('.font-example-card__preview').textContent = preview;
			}
			card.querySelector('button').addEventListener('click', () => handleLoadSample(id));
			examples.appendChild(card);
		});
		body.appendChild(examples);
	} else {
		heading.textContent =
			page === 'favorites'
				? strings.favorites
				: page === 'archived'
				? strings.archived
				: strings.welcome;
		description.textContent = page === 'my-fonts' ? strings.welcomeBody : strings.noFontsBody;
		body.classList.add('font-library__grid');
		renderLibraryProjects(body, strings, page);
		getGlyphrStudioApp()
			.getAutoSaves()
			.then((saves) => {
				const visible = saves.filter((save) =>
					page === 'archived'
						? save.archived
						: !save.archived && (page !== 'favorites' || save.favorite)
				);
				count.textContent = `${visible.length} ${strings.fontsCount}`;
			})
			.catch(() => {
				count.textContent = `0 ${strings.fontsCount}`;
			});
	}

	const searchInput = /** @type {HTMLInputElement} */ (
		content.querySelector('.font-library__search input')
	);
	searchInput.addEventListener('input', () => {
		if (!['my-fonts', 'favorites', 'archived'].includes(page)) {
			getGlyphrStudioApp()
				.getAutoSaves()
				.then((saves) => showSearchOverlay(strings, saves, searchInput.value));
			searchInput.value = '';
		} else renderLibraryProjects(body, strings, page, searchInput.value);
	});
	const openSearch = async () =>
		showSearchOverlay(strings, await getGlyphrStudioApp().getAutoSaves());
	content.querySelector('.font-library__search-button').addEventListener('click', openSearch);

	content.addEventListener('dragenter', handleDragEnter);
	content.addEventListener('dragover', cancelDefaultEventActions);
	content
		.querySelector('#open-project__drop-note')
		.addEventListener('drop', (/** @type {DragEvent} */ event) => {
			cancelDefaultEventActions(event);
			handleOpenProjectPageFileInput(event.dataTransfer?.items || []);
		});
	content.querySelector('#open-project__drop-note').addEventListener('dragleave', handleDragLeave);
	return content;
}

/**
 * Page Maker for the Open Project page
 * @param {Boolean} secondProjectFlag - true if it's not the currently selected project
 * @returns {Element}
 */
export function makePage_OpenProject(secondProjectFlag = false, activePage = 'my-fonts') {
	if (!secondProjectFlag) return makeModernOpenProjectPage(activePage);
	// log(`makePage_OpenProject`, 'start');
	// log(`secondProjectFlag: ${secondProjectFlag}`);
	isSecondProject = secondProjectFlag;
	const recent = 1000 * 60 * 60 * 24 * 7; // seven days in milliseconds
	let recentMessage = '';
	const app = getGlyphrStudioApp();
	if (Date.now() - app.versionDate < recent) {
		recentMessage = ` - <a href="https://www.glyphrstudio.com/help/about/updates.html">recently updated!</a>`;
	}

	const content = makeElement({
		tag: 'div',
		id: 'app__page',
		innerHTML: `
			<div id="open-project__page">
				<div id="open-project__left-area" vertical-align="middle">
					<div id="open-project__logo">${logoVertical}</div>
					<span class="open-project__version-name">${app.versionName}</span>
					<span class="open-project__version-number">${app.version}${recentMessage}</span>
					<div class="open-project__blurb">
						For more information visit <a href="https://www.glyphrstudio.com">www.glyphrstudio.com</a><br>
						Glyphr Studio is licensed under a <a href="https://www.gnu.org/licenses/gpl.html" target="_blank">GNU General Public License</a>,
						which is a free / open source "copyleft" license. You are free to use, distribute, and modify Glyphr Studio as long as
						this license and its freeness stays intact.
					</div>
				</div>
				<div id="open-project__right-area" vertical-align="middle"></div>
				<div id="open-project__drop-note"></div>
			</div>
		`,
	});

	// Tabs
	const tableRight = content.querySelector('#open-project__right-area');
	tableRight.appendChild(makeOpenProjectTabs());
	showDefaultTab(content);

	// Drag over handlers
	const page = content.querySelector('#open-project__page');
	page.addEventListener('dragenter', handleDragEnter);
	page.addEventListener('dragover', cancelDefaultEventActions);

	// Drop and Drag Leave handlers
	const dropNote = content.querySelector('#open-project__drop-note');

	dropNote.addEventListener('drop', (/** @type {DragEvent} */ event) => {
		cancelDefaultEventActions(event);
		handleOpenProjectPageFileInput(event?.dataTransfer?.items || []);
	});
	dropNote.addEventListener('dragleave', handleDragLeave);

	// log(`makePage_OpenProject`, 'end');
	return content;
}

/**
 * makeOpenProjectTabs creates all tab content as display:hidden
 * this function selects the default tab and content
 * @param {Document | HTMLElement} node - wrapper for the tab
 */
function showDefaultTab(node) {
	if (isSecondProject) {
		/** @type {HTMLElement} */
		const loadArea = node.querySelector('#tab-content__load');
		loadArea.style.display = 'block';
		node.querySelector('#open-project__tab-load').setAttribute('selected', '');
	} else {
		/** @type {HTMLElement} */
		const newArea = node.querySelector('#tab-content__new');
		newArea.style.display = 'block';
		node.querySelector('#open-project__tab-new').setAttribute('selected', '');
	}
}

/**
 * Import OTF/SVG/Project functions can call this if import fails and
 * the user needs a second try to specify how to start their project.
 */
export function resetOpenProjectTabs() {
	const tableRight = document.querySelector('#open-project__right-area');
	if (!tableRight) return;
	tableRight.innerHTML = '';
	tableRight.appendChild(makeOpenProjectTabs());
	showDefaultTab(document);
}

/**
 * Create the tabs for the load project page
 * @returns {Element} DOM node
 */
export function makeOpenProjectTabs() {
	// --------------------------------------------------------------
	// Make contents for each tab
	// --------------------------------------------------------------

	// Content for New Project tab
	const tabContentNew = makeElement({
		id: 'tab-content__new',
		className: 'open-project__tab-content',
		innerHTML: '<h2>Start a new Glyphr Studio project</h2>\nProject name: &nbsp;',
		style: 'display: none;',
	});

	const inputProjectName = makeElement({
		tag: 'input',
		id: 'input__new-project-name',
		attributes: { type: 'text', value: 'My Font', autofocus: 'true' },
	});

	const buttonStartNewProject = makeElement({
		tag: 'fancy-button',
		id: 'button__create-new-project',
		innerHTML: 'Create a new font from scratch',
		onClick: handleNewProject,
	});

	const br = makeElement({ tag: 'br' });
	addAsChildren(tabContentNew, [inputProjectName, br, br, buttonStartNewProject]);

	// Content for Load tab
	const tabContentLoad = makeElement({
		id: 'tab-content__load',
		className: 'open-project__tab-content',
		innerHTML: '<h2>Load a file</h2>\nDrag and drop one of the following:<br>',
		style: 'display: none;',
	});

	const dropTarget = makeElement({
		id: 'open-project__drop-target',
		innerHTML: `
			Glyphr Studio Project &ensp;(.gs2, .txt)<br>
			Open Type, True Type, or WOFF&ensp;(.otf, .ttf, .woff)<br>
			SVG Font &ensp;(.svg)
		`,
	});

	const openFileChooser = makeElement({
		tag: 'fancy-button',
		attributes: { dark: '' },
		innerHTML: 'or, open file chooser...',
		onClick: async () => {
			getFilesFromFilePicker(handleOpenProjectPageFileInput);
		},
	});

	addAsChildren(tabContentLoad, [dropTarget, openFileChooser]);

	// Auto-saved backups
	const tabContentAutoSaves = makeElement({
		id: 'tab-content__auto-saves',
		className: 'open-project__tab-content',
		innerHTML: `<h2>Restore from auto-saved backup</h2>`,
		style: 'display: none;',
	});

	const contentAutoSavesList = makeElement({
		tag: 'div',
		id: 'auto-saves__list',
	});

	const saves = {};
	contentAutoSavesList.appendChild(makeElement({ tag: 'i', innerHTML: 'Loading auto-saves...' }));

	function makeRestoreProjectRow(id) {
		let row = makeElement({ tag: 'div', className: 'auto-saves__list-row' });
		addAsChildren(row, [
			makeElement({ className: 'name', content: saves[id].name }),
			makeElement({ className: 'project-id', content: `(${id})` }),
			makeElement({
				tag: 'fancy-button',
				innerHTML: '⇨',
				onClick: () => loadProjectFromAutoSave(id),
			}),
			makeElement({ className: 'time-stamp', content: new Date(saves[id].time).toLocaleString() }),
		]);
		return row;
	}

	getGlyphrStudioApp()
		.getAutoSaves()
		.then((storedSaves) => {
			contentAutoSavesList.innerHTML = '';
			storedSaves.forEach((saveData) => {
				saves[saveData.id] = saveData;
				contentAutoSavesList.appendChild(makeRestoreProjectRow(saveData.id));
			});
			if (!storedSaves.length) {
				contentAutoSavesList.appendChild(
					makeElement({ tag: 'i', innerHTML: 'No auto-saves exist yet' })
				);
			}
		})
		.catch(() => {
			contentAutoSavesList.innerHTML = '';
			contentAutoSavesList.appendChild(
				makeElement({ tag: 'i', innerHTML: 'Auto-saved projects could not be loaded' })
			);
		});

	addAsChildren(tabContentAutoSaves, [contentAutoSavesList]);

	// Content for Examples tab
	const tabContentExamples = makeElement({
		id: 'tab-content__examples',
		className: 'open-project__tab-content',
		innerHTML: `<h2>Load an example project</h2>`,
		style: 'display: none;',
	});

	const contentSimpleProject = makeElement({
		tag: 'div',
		innerHTML: `The Simple v2 Project has a few characters and things to show off basic functionality:<br><br>`,
	});

	const buttonSimpleProject = makeElement({
		tag: 'fancy-button',
		innerHTML: 'Simple v2 project',
		onClick: () => handleLoadSample('simpleProject'),
	});

	const contentOblegg = makeElement({
		tag: 'div',
		innerHTML: `Oblegg is the GSv2 project we use to test all the various Glyphr Studio features:<br><br>`,
	});

	const buttonOblegg = makeElement({
		tag: 'fancy-button',
		innerHTML: 'Oblegg',
		onClick: () => handleLoadSample('oblegg'),
	});

	addAsChildren(tabContentExamples, [
		contentOblegg,
		buttonOblegg,
		contentSimpleProject,
		buttonSimpleProject,
	]);

	// --------------------------------------------------------------
	// Make tabs, hook it all up
	// --------------------------------------------------------------
	// Tabs
	const tabNew = makeElement({
		tag: 'button',
		id: 'open-project__tab-new',
		className: 'open-project__tab',
		innerHTML: 'New',
		onClick: () => {
			deselectAllTabs();
			tabNew.setAttribute('selected', '');
			tabContentNew.style.display = 'block';
		},
	});

	const tabLoad = makeElement({
		tag: 'button',
		id: 'open-project__tab-load',
		className: 'open-project__tab',
		innerHTML: 'Load',
		onClick: () => {
			deselectAllTabs();
			tabLoad.setAttribute('selected', '');
			tabContentLoad.style.display = 'block';
		},
	});

	const tabAutoSaves = makeElement({
		tag: 'button',
		id: 'open-project__tab-auto-saves',
		className: 'open-project__tab',
		innerHTML: 'Restore',
		onClick: () => {
			deselectAllTabs();
			tabAutoSaves.setAttribute('selected', '');
			tabContentAutoSaves.style.display = 'block';
		},
	});

	const tabExamples = makeElement({
		tag: 'button',
		id: 'open-project__tab-examples',
		className: 'open-project__tab',
		innerHTML: 'Examples',
		onClick: () => {
			deselectAllTabs();
			tabExamples.setAttribute('selected', '');
			tabContentExamples.style.display = 'block';
		},
	});

	const tabs = makeElement({ className: 'open-project__tabs' });
	let tabControls = [tabNew, tabLoad, tabExamples];
	if (!isSecondProject) tabControls.splice(2, 0, tabAutoSaves);
	addAsChildren(tabs, tabControls);

	const tabWrapper = makeElement({ className: 'open-project__tab-wrapper' });
	let tabContents = [tabs, tabContentNew, tabContentLoad, tabContentExamples];
	if (!isSecondProject) tabContents.splice(3, 0, tabContentAutoSaves);
	addAsChildren(tabWrapper, tabContents);
	return tabWrapper;
}

/**
 * Shows an OS File Picker, then returns the selected files
 * to a provided callback function.
 * @param {Function} callback - what to do with the files
 * @param {Object} pickerOptions - OS File Picker Options Object
 */
export async function getFilesFromFilePicker(callback, pickerOptions = {}) {
	// @ts-expect-error 'property does exist'
	if (window.showOpenFilePicker) {
		// @ts-expect-error 'property does exist'
		const files = await window.showOpenFilePicker(pickerOptions);
		callback(files);
	} else {
		// showError(`Can't open OS File Picker. Try dragging and dropping a file instead.`);
		/** @type {any} */
		const fallbackFileChooser = makeElement({ tag: 'input', attributes: { type: 'file' } });
		fallbackFileChooser.addEventListener('change', (event) => {
			// log(fallbackFileChooser.files);
			cancelDefaultEventActions(event);
			callback(fallbackFileChooser.files);
		});
		fallbackFileChooser.click();
	}
}

/**
 * Sets all the tabs to deselected and hides all the tab contents
 */
function deselectAllTabs() {
	const tabs = document.querySelectorAll('.open-project__tab');
	tabs.forEach((tab) => tab.removeAttribute('selected'));

	const tabContents = document.querySelectorAll('.open-project__tab-content');
	tabContents.forEach((/** @type {HTMLElement} */ content) => (content.style.display = 'none'));
}

/**
 * Handle file input or drop
 * @param {Object} files - event from drop, or fileHandle from showOpenFilePicker
 */
export async function handleOpenProjectPageFileInput(files) {
	// log('handleOpenProjectPageFileInput', 'start');
	// log(`\n⮟files⮟`);
	// log(files);

	/** @type {HTMLElement} */
	const dropNote = document.querySelector('#open-project__drop-note');
	if (dropNote) dropNote.style.display = 'none';
	const rightArea = document.querySelector('#open-project__right-area');
	if (rightArea) {
		rightArea.innerHTML = '';
		rightArea.appendChild(makeProgressIndicator());
	}

	let fileInput;
	let fileResult;
	if (files.length) {
		fileInput = files[0];
		// log(fileInput);
		if (fileInput.getAsFileSystemHandle) fileResult = await fileInput.getAsFileSystemHandle();
		else if (fileInput.getAsFile) fileResult = await fileInput.getAsFile();
		else fileResult = fileInput;
	} else {
		showError(`No files were found that could be imported.`);
	}

	// log(fileResult);
	if (!fileResult) {
		showError(`The file could not be read.`);
		resetOpenProjectTabs();
	} else {
		validateSingleFileInput(fileResult, postValidationCallback);
	}

	// log('handleOpenProjectPageFileInput', 'end');
}

/**
 * What to do after a file has been validated
 * @param {Object} validationResult - validation object
 */
function postValidationCallback(validationResult) {
	// log(`postValidationCallback`, 'start');
	if (isSecondProject) addProjectEditorAndSetAsImportTarget();
	if (validationResult.content) {
		if (validationResult.fileType === 'font') {
			ioFont_importFont(validationResult.content, false, validationResult.fileSuffix);
		} else if (validationResult.fileType === 'svg') {
			ioSVG_importSVGfont(validationResult.content);
		} else if (validationResult.fileType === 'project') {
			getCurrentProjectEditor().loadedFileHandle = validationResult.fileHandle;
			importProjectDataAndNavigate(validationResult.content);
		}
	} else {
		if (validationResult.errorMessage) {
			showError(validationResult.errorMessage);
		} else {
			showError(`Some unknown error happened when loading the file.`);
		}

		resetOpenProjectTabs();
	}
	// log(`postValidationCallback`, 'end');
}

/**
 * Do all the stuff necessary to import a text file and
 * get the UI to the right page.
 * @param {GlyphrStudioProject | Object} glyphrStudioProjectFile
 */
export function importProjectDataAndNavigate(glyphrStudioProjectFile) {
	// log(`importProjectDataAndNavigate`, 'start');
	closeEveryTypeOfDialog();
	const editor = getProjectEditorImportTarget();
	setCurrentProjectEditor(editor);
	if (!glyphrStudioProjectFile) {
		editor.project = new GlyphrStudioProject({});
		/** @type {HTMLInputElement} */
		const nameInput = document.querySelector('#input__new-project-name');
		const name = nameInput?.value || 'My Font';
		editor.project.settings.project.name = name;
		editor.project.settings.font.family = name;
	} else {
		editor.project = importGlyphrProjectFromText(glyphrStudioProjectFile);
	}
	editor.project.settings.app.autoSave = getLibraryPreferences().autoSave;

	editor.project.resetSessionStateForAllItems();
	editor.nav.page = 'Overview';
	if (isSecondProject) showToast(`Switched to<br>${editor.project.settings.project.name}`);
	updateWindowUnloadEvent();
	editor.navigate();
	if (editor.project.settings.app.autoSave) getGlyphrStudioApp().addAutoSaveState();
	// log(`importProjectDataAndNavigate`, 'end');
}

/**
 * Finds and loads a project by ID from IndexedDB
 * @param {String} projectID - internal Glyphr Studio Project ID
 * @returns nothing
 */
async function loadProjectFromAutoSave(projectID) {
	const saveData = await getAutoSave(projectID);
	if (!saveData) return;
	importProjectDataAndNavigate(saveData.project);
	showToast(`Restored project from auto-save:<br>${saveData.name}`);
}

/**
 * Handle Message event
 * @param {Object} event - event
 */
// TODO Paste handler on open project page
/*
function handleMessage(event) {
	const app = getGlyphrStudioApp();
	// assume strings are SVG fonts
	app.temp.droppedFileContent = event.data;

	if (typeof event.data === 'string') {
		// ioSVG_importSVGfont(false);
		// assume array buffers are otf fonts
	} else if (event.data instanceof ArrayBuffer) {
		// ioFont_importFont(false);
	}
}
*/
// --------------------------------------------------------------
// Drag Events
// --------------------------------------------------------------

/**
 * Handle DragOver event
 * @param {Object} event - event
 */
function handleDragEnter(event) {
	// log(`handleDragEnter`, 'start');
	// cancelDefaultEventActions(event);
	event.dataTransfer.dropEffect = 'copy';
	/** @type {HTMLElement} */
	const dropNote = document.querySelector('#open-project__drop-note');
	dropNote.style.animation = 'var(--animate-fade-in)';
	dropNote.style.opacity = '1';
	dropNote.innerHTML = `Drop it!`;
	dropNote.style.display = 'block';
	// log(`handleDragEnter`, 'end');
}

/**
 * Handle DragLeave event
 */
function handleDragLeave() {
	// log(`handleDragLeave`, 'start');
	// cancelDefaultEventActions(event);
	/** @type {HTMLElement} */
	const dropNote = document.querySelector('#open-project__drop-note');
	dropNote.style.animation = 'var(--animate-fade-out)';
	window.setTimeout(() => {
		dropNote.style.display = 'none';
		dropNote.style.opacity = '0';
	}, 170);
	// log(`handleDragLeave`, 'end');
}

// --------------------------------------------------------------
// Loading projects
// --------------------------------------------------------------

/**
 * Create a new project from scratch
 */
function handleNewProject() {
	if (isSecondProject) addProjectEditorAndSetAsImportTarget();
	setTimeout(importProjectDataAndNavigate, 10);
}

/**
 * Load a project sample
 * @param {String} name - which sample to load
 */
function handleLoadSample(name) {
	if (isSecondProject) addProjectEditorAndSetAsImportTarget();
	const legacyExamples = document.querySelector('#tab-content__examples');
	if (legacyExamples) {
		legacyExamples.innerHTML = '<h2>Load an example project</h2>Loading example project...';
	}

	let project = simpleExampleProject;
	if (name === 'oblegg') project = obleggExampleProject;
	setTimeout(function () {
		// log(`Loading sample project ${name}`);

		importProjectDataAndNavigate(project);
	}, 100);
}
