import { addAsChildren, insertAfter, makeElement } from '../common/dom';
import logoHorizontal from '../common/graphics/logo-wordmark-horizontal-small.svg?raw';
import { closeEveryTypeOfDialog, makeContextMenu, showModalDialog } from '../controls/dialogs/dialogs';
import { ioFont_exportFont } from '../io/font_export.js';
import { ioSVG_exportSVGfont } from '../io/svg_font_export.js';
import { makeOpenProjectTabs, makePage_OpenProject } from '../pages/open_project';
import { emailLink } from './app';
import { addProjectEditorAndSetAsImportTarget, getCurrentProjectEditor, getGlyphrStudioApp } from './main';

// --------------------------------------------------------------
// Top bar for the App
// --------------------------------------------------------------

export function makeAppTopBar() {
	let topBar = makeElement({ tag: 'div', id: 'app__top-bar' });

	let logo = makeElement({ innerHTML: logoHorizontal, className: 'top-bar__logo' });

	let menus = makeElement({ className: 'top-bar__menus' });
	menus.appendChild(makeMenu('File'));
	menus.appendChild(makeMenu('Projects'));
	menus.appendChild(makeMenu('Help'));

	let mailIcon = `
<?xml version="1.0" encoding="UTF-8"?><svg id="Mail" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 9"><polygon points="8 1 0 1 0 2 8 2 8 1 8 1"/><polygon points="20 0 10 0 10 1 20 1 20 0 20 0"/><polygon points="20 8 10 8 10 9 20 9 20 8 20 8"/><polygon points="8 3 2 3 2 4 8 4 8 3 8 3"/><polygon points="8 7 6 7 6 8 8 8 8 7 8 7"/><polygon points="10 1 9 1 9 8 10 8 10 1 10 1"/><polygon points="21 1 20 1 20 8 21 8 21 1 21 1"/><polygon points="8 5 4 5 4 6 8 6 8 5 8 5"/><polygon points="12 2 10 2 10 3 12 3 12 2 12 2"/><polygon points="14 3 12 3 12 4 14 4 14 3 14 3"/><polygon points="16 4 14 4 14 5 16 5 16 4 16 4"/><polygon points="20 2 18 2 18 3 20 3 20 2 20 2"/><polygon points="18 3 16 3 16 4 18 4 18 3 18 3"/></svg>`;
	let bugContact = makeElement({
		className: 'top-bar__bug-contact',
	});

	bugContact.appendChild(
		makeElement({
			className: 'top-bar__bug-blurb',
			innerHTML: 'Found a bug? Have some feedback?',
		})
	);

	bugContact.appendChild(
		makeElement({
			className: 'top-bar__bug-icon',
			innerHTML: emailLink(mailIcon),
		})
	);

	bugContact.appendChild(
		makeElement({
			className: 'top-bar__bug-link',
			innerHTML: emailLink(),
		})
	);

	addAsChildren(topBar, [logo, menus, bugContact]);

	return topBar;
}

// --------------------------------------------------------------
// Menu
// --------------------------------------------------------------

function makeMenu(menuName) {
	let entryPoint = makeElement({
		tag: 'button',
		innerHTML: menuName,
		className: 'menu-entry-point',
	});

	entryPoint.addEventListener('mouseover', closeEveryTypeOfDialog);

	if (menuName === 'File') {
		entryPoint.addEventListener('click', (event) => {
			let rect = event.target.getBoundingClientRect();
			closeEveryTypeOfDialog();
			insertAfter(
				entryPoint,
				makeContextMenu(
					[
						{
							name: 'Save Glyphr Studio Project File',
							icon: 'command_save',
							note: ['Ctrl', 's'],
							onClick: () => {
								getCurrentProjectEditor().saveGlyphrProjectFile();
							},
						},
						{ name: 'hr' },
						{
							name: 'Export OTF File',
							icon: 'command_export',
							note: ['Ctrl', 'e'],
							onClick: ioFont_exportFont,
						},
						{
							name: 'Export SVG Font File',
							icon: 'command_export',
							note: ['Ctrl', 'g'],
							onClick: ioSVG_exportSVGfont,
						},
					],
					rect.x,
					rect.y + rect.height
				)
			);
		});
	}

	if (menuName === 'Projects') {
		entryPoint.addEventListener('click', (event) => {
			let rect = event.target.getBoundingClientRect();
			closeEveryTypeOfDialog();
			let menuRows = makeContextMenu(
				[
					{
						child: makeProjectPreviewRow(0),
						className: 'spanAll',
					},
					{
						child: makeProjectPreviewRow(1),
						className: 'spanAll',
					},
					{
						name: 'Learn more about working with two projects',
						icon: 'command_newTab',
						onClick: () => {
							window.open('https://glyphrstudio.com/v2/help/working-with-multiple-projects.html', '_blank');
						},
					},
					{
						name: 'hr',
					},
					{
						name: 'Open a separate project in a new window',
						icon: 'command_newTab',
						onClick: () => {
							window.open('https://glyphrstudio.com/v2/app/', '_blank');
						},
					},
				],
				rect.x,
				rect.y + rect.height,
				500
			);

			insertAfter(entryPoint, menuRows);
		});
	}

	if (menuName === 'Help') {
		entryPoint.addEventListener('click', (event) => {
			let rect = event.target.getBoundingClientRect();
			closeEveryTypeOfDialog();
			insertAfter(
				entryPoint,
				makeContextMenu(
					[
						{
							name: 'External Help & Documentation site',
							icon: 'command_newTab',
							onClick: () => {
								window.open('https://glyphrstudio.com/v2/help/', '_blank');
							},
						},
						{ name: 'hr' },
						{
							name: 'In-app help',
							icon: 'command_help',
							onClick: () => {
								let editor = getCurrentProjectEditor();
								editor.nav.page = 'Help';
								editor.navigate();
							},
						},
						{
							name: 'About Glyphr Studio',
							icon: 'command_info',
							onClick: () => {
								let editor = getCurrentProjectEditor();
								editor.nav.page = 'About';
								editor.navigate();
							},
						},
					],
					rect.x,
					rect.y + rect.height
				)
			);
		});
	}

	return entryPoint;
}

function makeProjectPreviewRow(projectID = 0) {
	// log(`makeProjectPreviewRow`, 'start');
	// log(`projectID: ${projectID}`);
	const app = getGlyphrStudioApp();
	const projectEditor = app.projectEditors[projectID];
	// log(`\n⮟projectEditor⮟`);
	// log(projectEditor);

	let rowWrapper = makeElement({ tag: 'div', className: 'project-preview__row-wrapper' });
	let superTitle = false;
	let title = makeElement({ tag: 'h3' });
	let thumbnail = false;

	if (projectEditor) {
		superTitle = makeElement({ className: 'project-preview__super-title' });
		if (getCurrentProjectEditor() === projectEditor) {
			superTitle.innerHTML = 'Editing';
			rowWrapper.classList.add('project-preview__primary');
		} else {
			superTitle.innerHTML = 'Switch to';
			rowWrapper.classList.add('project-preview__secondary');
		}
		title.innerHTML = projectEditor.project.settings.project.name;
		let previewText = projectEditor.project.settings.app.previewText || 'Aa Bb Cc Xx Yy Zz';
		thumbnail = makeElement({
			tag: 'display-canvas',
			attributes: { text: previewText, 'font-size': '24', 'project-editor': projectID },
		});
	} else {
		title.innerHTML = 'Open another project &emsp; <code>Ctrl</code><code>p</code>';
		rowWrapper.classList.add('project-preview__no-project');
		rowWrapper.addEventListener('click', openLoadNewProjectDialog);
	}

	if (superTitle) addAsChildren(rowWrapper, superTitle);
	addAsChildren(rowWrapper, title);
	if (thumbnail) addAsChildren(rowWrapper, thumbnail);

	// log(`makeProjectPreviewRow`, 'end');
	return rowWrapper;
}

function openLoadNewProjectDialog() {
	addProjectEditorAndSetAsImportTarget();
	showModalDialog(makePage_OpenProject(), 500, true);
}