import { getCurrentProjectEditor } from '../app/main.js';
import { decToHex } from '../common/character_ids.js';
import { makeElement } from '../common/dom.js';
import { isStandardUnicodeRange } from '../lib/unicode/unicode_blocks.js';
import { getItemNameWithFallback } from '../pages/characters.js';
import { makeCard_itemNavigation } from './card_glyph.js';

// --------------------------------------------------------------
// Character info panel
// --------------------------------------------------------------

export function makePanel_CharacterInfo() {
	// log(`makePanel_CharacterInfo`, 'start');
	const editor = getCurrentProjectEditor();
	// const project = getCurrentProject();
	let selected = editor.selectedItem;

	const dec = selected.char.codePointAt(0);
	const hex = dec.toString(16).toUpperCase();
	const range = editor.selectedCharacterRange;
	let base = ('' + decToHex(range.begin)).substring(2);
	while (base.length < 4) base = '0' + base;
	if (base === '0020') base = '0000';

	let charName = getItemNameWithFallback(selected.id);

	let charInfo = makeElement({
		className: 'panel__card char-info',
		innerHTML: `
			<h3>Character info</h3>

			<label>Character name</label>
			<code title="${charName}">${charName}</code>

			<label>Character</label>
			<input type="text" value="${selected.char}" readonly>

			<label>Unicode</label>
			<input type="text" value="U+${hex}" readonly>

			<label>HTML entity (decimal)</label>
			<input type="text" value="&amp;#${dec};" readonly>

			<label>HTML entity (hexadecimal)</label>
			<input type="text" value="&amp;#x${hex};" readonly>
			`,
	});

	let rangeInfo = makeElement({
		className: 'panel__card char-info',
		innerHTML: `
			<h3>Range info</h3>

			<label>Range name</label>
			<code>${range.name}</code>

			<label>Range</label>
			<p>
				<code>${decToHex(range.begin)}</code>
				to
				<code>${decToHex(range.end)}</code>
			</p>

			${
				isStandardUnicodeRange(range)
					? `
				<span class="spanAll" style="margin-top: 10px;">
					<a
						href="https://www.wikipedia.org/wiki/${range.name.replace(/ /gi, '_')}_(Unicode_block)"
						target="_new"
						title="Wikipedia Link\nwikipedia.org/wiki/${range.name.replace(/ /gi, '_')}_(Unicode_block)"
						style="display: inline-block; width: 420px; overflow: hidden; text-overflow: ellipsis;">
						wikipedia.org/wiki/${range.name.replace(/ /gi, '_')}_(Unicode_block)
					</a>
				</span>

				<span class="spanAll">
					<a href="https://www.unicode.org/charts/PDF/U${base}.pdf"
						target="_new"
						title="Unicode Link\nunicode.org/charts/PDF/U${base}.pdf">
						unicode.org/charts/PDF/U${base}.pdf
					</a>
				</span>
			`
					: `
				<label>This is a custom range.</label>
				`
			}
			`,
	});

	// log(`makePanel_CharacterInfo`, 'end');
	return [charInfo, rangeInfo, makeCard_itemNavigation(editor.selectedItem)];
}
