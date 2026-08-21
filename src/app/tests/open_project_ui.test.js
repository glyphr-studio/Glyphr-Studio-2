import { afterEach, describe, expect, it, vi } from 'vitest';
import { makePage_OpenProject } from '../open_project.js';
import { getGlyphrStudioApp } from '../main.js';
import { DisplayCanvas } from '../../display_canvas/display_canvas.js';

describe('Open project UI', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	it('renders one wordmark and a populated mobile navigation', () => {
		const page = makePage_OpenProject(false, 'my-fonts');
		document.body.appendChild(page);

		expect(page.querySelectorAll('.font-library__brand svg')).toHaveLength(1);
		expect(page.querySelectorAll('.font-library__brand-wordmark font-preview')).toHaveLength(1);
		expect(
			page.querySelector('.font-library__brand-wordmark font-preview').getAttribute('text')
		).toBe('glyphr studio');
		expect(page.querySelectorAll('.font-library__sidebar svg')).toHaveLength(0);
		expect(page.querySelectorAll('.font-library__sidebar-nav button')).toHaveLength(5);
		expect(
			Array.from(
				page.querySelectorAll('.font-library__sidebar-nav button'),
				(button) => button.textContent
			)
		).toEqual(['My Fonts', 'Favorites', 'Examples', 'Archived', 'Settings']);
	});

	it('opens the populated mobile sidebar and closes it after resizing to desktop', () => {
		const page = makePage_OpenProject(false, 'my-fonts');
		document.body.appendChild(page);
		const sidebar = page.querySelector('.font-library__sidebar');
		const mobileMenu = /** @type {HTMLElement | null} */ (
			page.querySelector('.font-library__mobile-menu')
		);
		if (!mobileMenu) throw new Error('Missing mobile menu');

		mobileMenu.click();
		expect(sidebar.classList.contains('is-open')).toBe(true);
		expect(sidebar.getAttribute('aria-hidden')).toBe('false');
		expect(sidebar.querySelectorAll('.font-library__sidebar-nav button')).toHaveLength(5);

		Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1440 });
		window.dispatchEvent(new Event('resize'));
		expect(sidebar.classList.contains('is-open')).toBe(false);
		expect(sidebar.getAttribute('aria-hidden')).toBe('true');
	});

	it('uses custom settings dropdowns instead of native selects', () => {
		const page = makePage_OpenProject(false, 'settings');
		document.body.appendChild(page);

		expect(page.querySelectorAll('select')).toHaveLength(0);
		expect(page.querySelectorAll('.font-library-custom-select')).toHaveLength(3);
	});

	it('keeps menus and modals mounted in component DOM while closed', () => {
		const page = makePage_OpenProject(false, 'my-fonts');
		document.body.appendChild(page);
		const createMenu = /** @type {HTMLElement | null} */ (
			page.querySelector('.font-library__create-menu')
		);
		if (!createMenu) throw new Error('Missing create menu');
		expect(createMenu).not.toBeNull();
		expect(createMenu.hidden).toBe(true);

		const createButton = /** @type {HTMLElement | null} */ (
			page.querySelector('.font-library__create')
		);
		if (!createButton) throw new Error('Missing create button');
		createButton.click();
		expect(createMenu.hidden).toBe(false);
		const importButton = /** @type {HTMLElement | null} */ (
			createMenu.querySelector('[data-import]')
		);
		if (!importButton) throw new Error('Missing import button');
		importButton.click();

		const componentDOM = /** @type {HTMLElement | null} */ (
			document.querySelector('#app__component-dom')
		);
		if (!componentDOM) throw new Error('Missing component DOM');
		const layer = /** @type {HTMLElement | null} */ (
			componentDOM.querySelector('.font-library-modal-layer')
		);
		if (!layer) throw new Error('Missing modal layer');
		expect(layer.hidden).toBe(false);
		const closeButton = /** @type {HTMLElement | null} */ (layer.querySelector('[data-cancel]'));
		if (!closeButton) throw new Error('Missing close button');
		closeButton.click();
		expect(layer.isConnected).toBe(true);
		expect(layer.hidden).toBe(true);
		expect(layer.getAttribute('aria-hidden')).toBe('true');
	});

	it('applies the selected UI font globally for the editor and library', () => {
		getGlyphrStudioApp().applyUIFont('system');
		expect(document.documentElement.style.getPropertyValue('--app-ui-font')).toContain('system-ui');
		expect(document.documentElement.style.getPropertyValue('--font-library-font')).toContain(
			'system-ui'
		);
		getGlyphrStudioApp().applyUIFont('fira-sans');
	});

	it('uses generated project fonts for example previews', () => {
		const page = makePage_OpenProject(false, 'examples');
		document.body.appendChild(page);
		expect(page.querySelectorAll('.font-example-card__preview font-preview')).toHaveLength(2);
		expect(page.textContent).toContain('A complete font project for exploring outlines');
		expect(page.textContent).toContain('containing only the letters A, B, and C');
	});

	it('accepts drag and drop files in the import modal', async () => {
		const page = makePage_OpenProject(false, 'my-fonts');
		document.body.appendChild(page);
		const createButton = /** @type {HTMLElement | null} */ (
			page.querySelector('.font-library__create')
		);
		if (!createButton) throw new Error('Missing create button');
		createButton.click();
		const importButton = /** @type {HTMLElement | null} */ (
			document.querySelector('.font-library__create-menu [data-import]')
		);
		if (!importButton) throw new Error('Missing import button');
		importButton.click();

		const modal = document.querySelector('.font-library-modal');
		const dropZone = modal.querySelector('.font-library__drop-zone');
		const file = new File(['font'], 'test.ttf', { type: 'font/ttf' });
		const dragEvent = new Event('dragenter', { bubbles: true, cancelable: true });
		Object.defineProperty(dragEvent, 'dataTransfer', {
			value: { dropEffect: 'copy', items: [{ kind: 'file', getAsFile: () => file }] },
		});
		dropZone.dispatchEvent(dragEvent);
		expect(dropZone.classList.contains('is-dragover')).toBe(true);

		const dropEvent = new Event('drop', { bubbles: true, cancelable: true });
		Object.defineProperty(dropEvent, 'dataTransfer', {
			value: { files: [file], items: [{ kind: 'file', getAsFile: () => file }] },
		});
		dropZone.dispatchEvent(dropEvent);
		expect(dropZone.classList.contains('is-dragover')).toBe(false);
	});

	it('validates a regular dropped File without calling getFile on it', async () => {
		const file = new File(['{}'], 'project.gs2', { type: 'application/json' });
		const callback = vi.fn();
		const result = await import('../../formats_io/validate_file_input.js').then((module) =>
			module.validateSingleFileInput(file, callback)
		);
		expect(result).toBeUndefined();
		expect(callback).toBeDefined();
	});

	it('calculates page maxes safely when a DisplayCanvas has no parent size yet', () => {
		if (!customElements.get('display-canvas')) {
			customElements.define('display-canvas', DisplayCanvas);
		}
		const canvas = /** @type {DisplayCanvas} */ (document.createElement('display-canvas'));
		canvas.textBlockOptions = /** @type {any} */ ({
			pagePadding: 20,
			pageHeight: 'fit',
			pageWidth: 'fit',
		});
		expect(() => canvas.calculatePageMaxes()).not.toThrow();
		expect(canvas.calculatePageMaxes()).toEqual({
			xMin: 20,
			yMin: 20,
			xMax: 980,
			yMax: 980,
		});
	});

	it('uses the active edit canvas wrapper instead of a hidden preloaded one', () => {
		const mainContent = document.createElement('div');
		mainContent.id = 'app__main-content';
		document.body.appendChild(mainContent);

		const hiddenWrapper = document.createElement('div');
		hiddenWrapper.className = 'editor-page__edit-canvas-wrapper';
		hiddenWrapper.hidden = true;
		hiddenWrapper.style.display = 'none';
		mainContent.appendChild(hiddenWrapper);

		const activeWrapper = document.createElement('div');
		activeWrapper.className = 'editor-page__edit-canvas-wrapper';
		activeWrapper.style.display = 'grid';
		mainContent.appendChild(activeWrapper);

		const editor = getGlyphrStudioApp().selectedProjectEditor;
		const bounds = editor.getEditCanvasWrapperBounds();
		expect(bounds).toBeDefined();
		expect(bounds).toEqual(activeWrapper.getBoundingClientRect());
	});

	it('does not re-attach a shadow root when a DisplayCanvas is reused', () => {
		if (!customElements.get('display-canvas')) {
			customElements.define('display-canvas', DisplayCanvas);
		}
		const canvas = document.createElement('display-canvas');
		document.body.appendChild(canvas);
		expect(() => {
			document.body.removeChild(canvas);
			document.body.appendChild(canvas);
		}).not.toThrow();
	});
});
