import { getCurrentProjectEditor } from '../app/main.js';
import { makeElement } from '../common/dom.js';
import { areHexValuesEqual, basicLatinOrder } from '../common/unicode.js';
import { GlyphTile } from '../controls/glyph-tile/glyph-tile.js';

/**
		Panel > Chooser
		Shows a list of all the Glyphs to choose from
		for whatever the current page is.  Also has
		the logic for creating Glyph chooser dialogs.
**/

// --------------------------------------------------------------
// Glyph chooser
// --------------------------------------------------------------

export function makeGlyphChooserContent(clickHandler, registerSubscriptions = true) {
	// log(`makeGlyphChooserContent`, 'start');
	const editor = getCurrentProjectEditor();
	// let content = `<div class="glyph-chooser__tile-grid">`;
	let container = makeElement({ tag: 'div', className: 'glyph-chooser__tile-grid' });

	basicLatinOrder.forEach((glyphID) => {
		let oneTile =
			editor.selectedGlyphID === glyphID
				? new GlyphTile({ glyph: glyphID, selected: 'true' })
				: new GlyphTile({ glyph: glyphID });

		oneTile.addEventListener('click', () => clickHandler(glyphID));

		if (registerSubscriptions) {
			editor.subscribe({
				topic: 'whichGlyphIsSelected',
				subscriberID: `glyphTile.${glyphID}`,
				callback: (newGlyphID) => {
					// log('whichGlyphIsSelected subscriber callback');
					// log(`checking if ${glyph.id} === ${glyphID}`);
					if (areHexValuesEqual(newGlyphID, glyphID)) {
						// log(`Callback: setting ${oneTile.getAttribute('glyph')} attribute to selected`);
						oneTile.setAttribute('selected', '');
					} else {
						// log(`Callback: removing ${oneTile.getAttribute('glyph')} attribute selected`);
						oneTile.removeAttribute('selected');
					}
				},
			});
		}

		container.appendChild(oneTile);
	});

	// log('Project Editor PubSub:');
	// log(editor.subscribers);

	// log(container);
	// log(`makeGlyphChooserContent`, 'end');
	return container;
}

export function makePanel_GlyphChooser() {
	// log('makePanel_GlyphChooser', 'start');
	const editor = getCurrentProjectEditor();

	let content = '<div class="panel__card">';
	content += editor.nav.page;
	content += '<h2>chooser</h2>';
	content += '</div>';
	content += '<div class="panel_section" id="glyphChooser">';

	const gcp = _UI.glyphChooser.panel;
	// _UI.glyphChooser.cache = false;

	if (editor.nav.page === 'Glyph edit') {
		asyncLoadChooserPanel();
		// _UI.glyphChooser.cache = make_GlyphChooser(_UI.glyphChooser.panel);
	} else if (editor.nav.page === 'import svg') {
		asyncLoadChooserPanel();
		// _UI.glyphChooser.cache = make_GlyphChooser(_UI.glyphChooser.panel);
	} else if (editor.nav.page === 'ligatures') {
		const hasNoLigatures = Object.keys(getCurrentProject().ligatures).length === 0;
		if (!hasNoLigatures) {
			content += make_GlyphChooser(gcp);
		}
		content += '<div class="panel_section" ';
		content += hasNoLigatures ? 'style="padding-top:-10px;">' : '>';
		content += '<button onclick="showNewLigatureDialog();">create new ligature</button><br>';
		if (!hasNoLigatures)
			content += '<button onclick="deleteLigatureConfirm();">delete selected ligature</button><br>';
		else content += '<button onclick="addCommonLigatures();">add some common ligatures</button>';
		content += '</div>';

		if (hasNoLigatures) {
			content += '<div class="panel_section">';
			content += '<h2>Please note!</h2><br>';
			content +=
				'Ligatures will only be exported to SVG Fonts. This is a limitation of the library we use to write OTF files.<br><br>';
			content +=
				'If you really need Ligatures in an OTF file, first export your project to an SVG Font, then use an online service to ';
			content += 'convert your SVG Font to an OTF Font.';
			content += '</div>';
		}
	} else if (editor.nav.page === 'components') {
		const hasNoComponents = Object.keys(getCurrentProject().components).length === 0;
		if (!hasNoComponents) {
			content += make_GlyphChooser(gcp);
		}
		content += '<div class="panel_section" ';
		content += hasNoComponents ? 'style="padding-top:-10px;">' : '>';
		content +=
			"<button onclick=\"createNewComponent();editor.history.addState('Create New Component');navigate({panel:'npAttributes'});\">create new component</button><br>";
		if (!hasNoComponents)
			content +=
				'<button onclick="deleteComponentConfirm();">delete selected component</button><br>';
		content += '</div>';
	}

	content += '</div>';

	// log('makePanel_GlyphChooser', 'end');
	return content;
}

function asyncLoadChooserPanel() {
	// log('asyncLoadChooserPanel', 'start');

	function tryLoadChooserPanel() {
		const np = _UI.popOut?
			document.getElementById('popOut_glyphchooser') :
			document.getElementById('navarea_panel');
		const gc = document.getElementById('glyphChooser');

		if (_UI.glyphChooser.cache && np && gc && gc.innerHTML === '') {
			gc.innerHTML = _UI.glyphChooser.cache;
			// log('tryLoadChooserPanel - SUCCESS\n');
		} else {
			// log('tryLoadChooserPanel - TRYING AGAIN\n');
			setTimeout(tryLoadChooserPanel, 10);
		}
	}

	tryLoadChooserPanel();
	_UI.glyphChooser.cache = make_GlyphChooser(_UI.glyphChooser.panel);
}

function make_GlyphChooser(gcdata) {
	// log('make_GlyphChooser', 'start');
	// log([gcdata]);

	let con = '';

	if (
		gcdata.choices === 'all' ||
		(editor.nav.page === 'Glyph edit' && pluralGlyphRange()) ||
		(editor.nav.page === 'import svg' &&
			(pluralGlyphRange() ||
				Object.keys(getCurrentProject().components).length ||
				Object.keys(getCurrentProject().ligatures).length))
	) {
		con += make_GlyphChooser_Header(gcdata.selected);
	}

	if (_UI.glyphChooser.dropdown) con += make_GlyphChooser_DropDown(gcdata.choices);
	else con += make_GlyphChooser_Content(gcdata);

	// log('make_GlyphChooser', 'end');
	return con;
}

function toggle_GlyphChooser() {
	_UI.glyphChooser.dropdown = !_UI.glyphChooser.dropdown;

	if (isBigDialogOpen()) {
		document.getElementById('bigDialogScrollContent').innerHTML = make_GlyphChooser(
			_UI.glyphChooser.dialog
		);
	} else {
		redraw({ calledBy: 'toggle_GlyphChooser', redrawCanvas: false });
	}
}

function update_GlyphChooser(selrange) {
	// log('update_GlyphChooser', 'start');
	// log('passed ' + selrange);

	if (isBigDialogOpen()) {
		_UI.glyphChooser.dialog.selected = selrange;
		toggle_GlyphChooser();
	} else {
		_UI.glyphChooser.panel.selected = selrange;
		_UI.glyphChooser.dropdown = !_UI.glyphChooser.dropdown;

		// if (selrange === 'glyphs') selrange = 'basicLatin';

		if (!isNaN(parseInt(selrange))) {
			selectGlyph(getCurrentProject().projectSettings.glyphRanges[selrange].begin, true);
		} else {
			switch (selrange) {
				case 'components':
					selectGlyph(getFirstID(getCurrentProject().components), true);
					break;
				case 'ligatures':
					selectGlyph(getFirstID(getCurrentProject().ligatures), true);
					break;
			}
		}

		update_NavPanels();
		redraw({ calledBy: update_GlyphChooser, redrawPanels: false });
	}

	// log('update_GlyphChooser', 'end');
}

function make_GlyphChooser_Header(selrange) {
	// log('make_GlyphChooser_Header', 'start');
	// log('passed selrange ' + selrange);

	let content = '<div class="glyphChooser-header" onclick="toggle_GlyphChooser();">';

	if (_UI.glyphChooser.dropdown) {
		content += 'choose a glyph range';
		content += '<span>&#x2571;&#x2572;</span>';
		content += '</div>';
		return content;
	}

	// if (selrange === 'glyphs') selrange = 'basicLatin';

	if (!isNaN(parseInt(selrange))) {
		content += 'Custom Range ' + (selrange + 1);
	} else if (selrange) {
		switch (selrange) {
			case 'components':
				content += 'Components';
				break;
			case 'ligatures':
				content += 'Ligatures';
				break;
		}
	} else {
		content += selrange;
	}
	// content += '&emsp;&#x25BC;';
	content += '<span>&#x2572;&#x2571;</span>';
	content += '</div>';

	return content;
}

function make_GlyphChooser_DropDown(ch) {
	let content = '<div class="glyphChooser-dropdown">';
	const gr = getCurrentProject().projectSettings.glyphRanges;

	if (ch === 'glyphs' || ch === 'all') {
		if (gr.length) content += '<div style="height:12px;"></div>';
		for (let c = 0; c < gr.length; c++) {
			content +=
				'<button class="navtargetbutton glyphChooser-dropdownbutton" onclick="update_GlyphChooser(' +
				c +
				');">';
			content += 'Custom Range ' + (c + 1) + '&emsp;';
			content += '<span class="units">' + gr[c].begin + ' to ' + gr[c].end + '</span>';
			content += '</button>';
		}
	}

	if (ch === 'components' || ch === 'all') {
		if (Object.keys(getCurrentProject().components).length) {
			content +=
				'<button class="navtargetbutton glyphChooser-dropdownbutton" onclick="update_GlyphChooser(\'components\');">';
			content += 'Components&emsp;';
			content +=
				'<span class="units">(' + Object.keys(getCurrentProject().components).length + ')</span>';
			content += '</button>';
		}
	}

	if (ch === 'ligatures' || ch === 'all') {
		if (Object.keys(getCurrentProject().ligatures).length) {
			content +=
				'<button class="navtargetbutton glyphChooser-dropdownbutton" onclick="update_GlyphChooser(\'ligatures\');">';
			content += 'Ligatures&emsp;';
			content +=
				'<span class="units">(' + Object.keys(getCurrentProject().ligatures).length + ')</span>';
			content += '</button>';
		}
	}

	return content + '</div>';
}

function pluralGlyphRange() {
	// log('pluralGlyphRange', 'start');
	const gr = getCurrentProject().projectSettings.glyphRanges;
	let count = gr.length;

	// log('returning ' + count);
	// log('pluralGlyphRange', 'end');
	return count > 1;
}

function make_GlyphChooser_Content(gcdata) {
	// log('make_GlyphChooser_Content', 'start');
	// log([gcdata]);

	const fname = gcdata.fname || 'selectGlyph';
	const sel = isVal(gcdata.selected) ? gcdata.selected : 'glyphs';
	const selwi = getSelectedItemID();
	let re = '<div class="glyphChooser-content">';

	const cr = getCurrentProject().projectSettings.glyphRanges;
	const c = parseInt(sel);
	if (!isNaN(c)) {
		// log('triggered custom range');
		for (let range = cr[c].begin; range <= cr[c].end; range++) {
			cn = decToHex(range);
			if (getCurrentProject().projectSettings.filterNonCharPoints) {
				if (getUnicodeName(cn) !== '[name not found]')
					re += make_GlyphChooser_Button(cn, fname, selwi);
			} else {
				re += make_GlyphChooser_Button(cn, fname, selwi);
			}
		}
		return re + '</div>';
	}

	if (sel === 'ligatures' && getFirstID(getCurrentProject().ligatures)) {
		sortLigatures();
		const lig = getCurrentProject().ligatures;
		for (const l of Object.keys(lig)) {
			re += make_GlyphChooser_Button(l, fname, selwi);
		}
		return re + '</div>';
	}

	if (sel === 'components' && getFirstID(getCurrentProject().components)) {
		const com = getCurrentProject().components;
		for (const d of Object.keys(com)) {
			re += make_GlyphChooser_Button(d, fname, selwi);
		}
		return re + '</div>';
	}

	// log('ERROR');
	// log('make_GlyphChooser_HeaderContent', 'end');
	return '[error: make_GlyphChooser_HeaderContent]';
}

function make_GlyphChooser_Button(index, fname, selid) {
	// log('make_GlyphChooser_Button - START ' + index);
	const onc = fname + "('" + index + "');";
	// log('constructed function: ' + onc);

	const wi = getGlyph(index);
	// log('getGlyph returned');
	// log(wi);

	let gname = wi.name;
	if (gname === '[name not found]' || !gname) gname = getGlyphName(index);

	let rv =
		'<div class="glyphselect" onclick="' + onc + '" title="' + gname + '&#13;' + index + '">';

	const issel = index === selid;

	if (wi && wi.hasPaths()) {
		let extra = '';
		if (issel) {
			extra = ' glyphselectthumbsel';
		}
		rv += '<div class="glyphselectthumb' + extra + '">' + wi.makeSVG() + '</div>';
	} else {
		if (issel) {
			rv += '<div class="glyphselectbuttonsel"';
		} else {
			rv += '<div class="glyphselectbutton"';
		}

		if (index === '0x0020') {
			rv += ' style="font-size:13px; line-height:3.8em;">space'; // SPACE needs to be smaller font size
		} else if (index.indexOf('0x') === -1) {
			rv += ' style="font-size:8px;"><div style="height:10px;"></div>'; // Component names needs to be smaller font size
			rv += gname;
		} else {
			rv += '>';
			rv += wi.glyphhtml || hexToHTML(index) || gname;
		}

		rv += '</div>';
	}

	rv += '<div class="glyphselectname">' + (hexToHTML(index) || gname || '[no name])') + '</div>';
	rv += '</div>';

	// log('make_GlyphChooser_Button', 'end');
	return rv;
}
