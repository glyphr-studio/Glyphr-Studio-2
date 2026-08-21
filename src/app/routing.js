const PAGE_TO_SLUG = {
	Overview: '',
	Characters: 'characters',
	Ligatures: 'ligatures',
	'Variable sets': 'variable-sets',
	Components: 'components',
	Kerning: 'kerning',
	'Live preview': 'live-preview',
	'Global actions': 'global-actions',
	Settings: 'settings',
	Help: 'help',
	About: 'about',
};

const SLUG_TO_PAGE = Object.fromEntries(
	Object.entries(PAGE_TO_SLUG).map(([page, slug]) => [slug, page])
);

function decodeRouteSegment(segment) {
	try {
		return decodeURIComponent(segment);
	} catch {
		return '';
	}
}

export function makeProjectHash(editor) {
	const projectID = encodeURIComponent(editor.project.settings.project.id);
	const base = `#/project/${projectID}`;
	if (editor.nav.page === 'Overview') return base;

	if (editor.nav.page === 'Characters' && editor.characterView !== 'overview') {
		const glyphID = editor.selectedGlyphID;
		const hex = typeof glyphID === 'string' ? glyphID.replace('glyph-', '') : '';
		const codePoint = /^0x[0-9a-f]+$/i.test(hex) ? parseInt(hex, 16) : NaN;
		if (Number.isInteger(codePoint)) {
			return `${base}/characters/edit/${encodeURIComponent(String.fromCodePoint(codePoint))}`;
		}
	}
	if (
		editor.nav.page === 'Ligatures' &&
		editor.ligatureView === 'edit' &&
		editor.selectedLigatureID
	) {
		return `${base}/ligatures/edit/${encodeURIComponent(editor.selectedLigatureID)}`;
	}
	if (
		editor.nav.page === 'Components' &&
		editor.componentView === 'edit' &&
		editor.selectedComponentID
	) {
		return `${base}/components/edit/${encodeURIComponent(editor.selectedComponentID)}`;
	}

	if (
		editor.nav.page === 'Variable sets' &&
		editor.variableSetsView === 'alternate' &&
		editor.selectedStylisticSetID &&
		editor.selectedAlternateID
	) {
		return `${base}/variable-sets/${encodeURIComponent(
			editor.selectedStylisticSetID
		)}/alternate/${encodeURIComponent(editor.selectedAlternateID)}`;
	}

	const pageSlug = PAGE_TO_SLUG[editor.nav.page] || '';
	return pageSlug ? `${base}/${pageSlug}` : base;
}

export function parseAppHash(hash) {
	const path = String(hash || '')
		.replace(/^#\/?/, '')
		.replace(/\/$/, '');
	if (!path) return { type: 'home' };

	const segments = path.split('/');
	const libraryPages = ['favorites', 'examples', 'archived', 'settings'];
	if (libraryPages.includes(segments[0]) && segments.length === 1) {
		return { type: 'library', page: segments[0] };
	}
	if (segments[0] !== 'project' || !segments[1]) return { type: 'home' };

	const projectID = decodeRouteSegment(segments[1]);
	if (!projectID) return { type: 'home' };
	const page = SLUG_TO_PAGE[segments[2] || ''];
	if (!page) return { type: 'home' };

	const route = { type: 'project', projectID, page };
	if (page === 'Characters' && segments[3] === 'edit' && segments[4]) {
		const character = decodeRouteSegment(segments.slice(4).join('/'));
		if ([...character].length === 1) {
			route.glyphID = `glyph-0x${character.codePointAt(0).toString(16).toUpperCase()}`;
		}
	}
	if (page === 'Ligatures' && segments[3] === 'edit' && segments[4]) {
		route.ligatureID = decodeRouteSegment(segments.slice(4).join('/'));
	}
	if (page === 'Components' && segments[3] === 'edit' && segments[4]) {
		route.componentID = decodeRouteSegment(segments.slice(4).join('/'));
	}
	if (page === 'Variable sets' && segments[3] && segments[4] === 'alternate' && segments[5]) {
		route.stylisticSetID = decodeRouteSegment(segments[3]);
		route.alternateID = decodeRouteSegment(segments.slice(5).join('/'));
	}
	return route;
}
