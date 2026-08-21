import { EDITOR_LOCALES, editorText } from '../app/editor_i18n.js';
import { getGlassPreferences } from '../app/glass_theme.js';
import { getCurrentProject, getCurrentProjectEditor, getGlyphrStudioApp } from '../app/main.js';
import { makeElement } from '../common/dom.js';
import { countItems } from '../common/functions.js';
import { makeGlassButton } from '../controls/dialogs/dialogs.js';
import { makeAllItemTypeChooserContent } from '../panels/item_chooser.js';

const LOCALE_NAMES = {
	en: 'English',
	'es-ES': 'Español (España)',
	'es-US': 'Español (Latinoamérica)',
	'es-MX': 'Español (México)',
	fr: 'Français',
	de: 'Deutsch',
	'pt-BR': 'Português (Brasil)',
	'pt-PT': 'Português (Portugal)',
};

export function makePage_OverviewModern() {
	const editor = getCurrentProjectEditor();
	const project = getCurrentProject();
	const content = makeElement({ tag: 'div', id: 'app__page', className: 'overview-workspace' });

	const header = makeElement({ tag: 'header', className: 'editor-content-header' });
	const headerCopy = makeElement({ tag: 'div' });
	headerCopy.append(
		makeElement({ tag: 'span', content: editorText('overview') }),
		makeElement({ tag: 'h1', content: project.settings.project.name }),
		makeElement({ tag: 'p', content: editorText('projectOverviewBody') })
	);
	const languageField = makeElement({ tag: 'label', className: 'overview-language' });
	languageField.appendChild(makeElement({ tag: 'span', content: editorText('language') }));
	const languageSelect = /** @type {HTMLSelectElement} */ (makeElement({ tag: 'select' }));
	languageSelect.setAttribute('aria-label', editorText('language'));
	EDITOR_LOCALES.forEach((locale) => {
		const option = /** @type {HTMLOptionElement} */ (
			makeElement({ tag: 'option', content: LOCALE_NAMES[locale] || locale })
		);
		option.value = locale;
		languageSelect.appendChild(option);
	});
	languageSelect.value = getGlassPreferences().language;
	languageSelect.addEventListener('change', () => {
		getGlyphrStudioApp().setLocalStorage('openProjectLanguage', languageSelect.value);
		editor.navigate();
	});
	languageField.appendChild(languageSelect);
	header.append(headerCopy, languageField);

	const dashboard = makeElement({ className: 'overview-dashboard' });
	const previewCard = makeElement({ className: 'overview-card overview-preview liquid-glass' });
	previewCard.append(
		makeElement({ tag: 'h2', content: editorText('fontPreview') }),
		makeElement({
			tag: 'display-canvas',
			attributes: {
				text: project.settings.app.previewText || 'Aa Bb Cc Xx Yy Zz',
				'font-size': '64',
				'show-placeholder-message': 'true',
			},
		})
	);

	const infoCard = makeElement({ className: 'overview-card overview-project-info liquid-glass' });
	infoCard.appendChild(makeElement({ tag: 'h2', content: editorText('projectInfo') }));
	[
		[editorText('fontFamily'), project.settings.font.family],
		[editorText('style'), project.settings.font.style],
		[editorText('glyphCount'), String(countItems(project.glyphs) + countItems(project.ligatures))],
		['UPM', String(project.settings.font.upm)],
		[editorText('ascent'), String(project.settings.font.ascent)],
		[editorText('descent'), String(project.settings.font.descent)],
	].forEach(([label, value]) => {
		const row = makeElement({ className: 'overview-project-info__row' });
		row.append(
			makeElement({ tag: 'span', content: label }),
			makeElement({ tag: 'strong', content: value })
		);
		infoCard.appendChild(row);
	});
	infoCard.appendChild(
		makeGlassButton(editorText('editProjectInfo'), () => {
			editor.nav.page = 'Settings';
			editor.navigate();
		})
	);

	dashboard.append(previewCard, infoCard);

	const browser = makeElement({ className: 'overview-characters liquid-glass' });
	const browserHeader = makeElement({ className: 'overview-characters__header' });
	browserHeader.append(
		makeElement({ tag: 'h2', content: editorText('characterOverviewTitle') }),
		makeElement({ tag: 'p', content: editorText('characterOverviewBody') })
	);
	browser.appendChild(browserHeader);
	browser.appendChild(
		makeAllItemTypeChooserContent((itemID) => {
			editor.selectedItemID = itemID;
			if (itemID.startsWith('glyph-')) {
				editor.nav.page = 'Characters';
				editor.characterView = 'edit';
			} else if (itemID.startsWith('liga-')) {
				editor.nav.page = 'Ligatures';
				editor.ligatureView = 'edit';
			} else if (itemID.startsWith('comp-')) {
				editor.nav.page = 'Components';
				editor.componentView = 'edit';
			} else if (itemID.startsWith('kern-')) {
				editor.nav.page = 'Kerning';
			}
			editor.navigate();
		})
	);

	content.append(header, dashboard, browser);
	if (editor.showPageTransitions) content.classList.add('app__page-animation');
	return content;
}
