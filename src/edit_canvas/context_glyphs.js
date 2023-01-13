/**
		Framework > Edit Canvas
		The Glyph Edit, Components, Ligatures, and to
		a certain extent, Kerning pages use a common
		HTML5 Canvas mechanism for interaction.
		Common functions around this can be found here.
**/

// -------------------
// CONTEXT GLYPHS
// -------------------

function drawContextGlyphs() {
	// log('drawContextGlyphs', 'start');
	const selwid = getSelectedWorkItemID();
	const currGlyphObject = getGlyph(selwid, true);
	const currGlyphChar = hexToChars(selwid);
	const v = getView('drawContextGlyphs');
	const split = splitContextGlyphString(currGlyphChar);

	// log('split: ' + split.left + ' | ' + split.right);
	// log(`view: ${json(v, true)}`);

	clearCanvasHotspots();

	if (split.left) {
		let leftdistance = getGlyphSequenceAdvanceWidth(split.left);
		if (currGlyphObject.isAutoWide) leftdistance += currGlyphObject.lsb;
		leftdistance += calculateKernOffset(split.left.charAt(split.left.length - 1), currGlyphChar);

		// log(`leftdistance: ${leftdistance}`);

		_UI.contextGlyphs.leftseq = new GlyphSequence({
			glyphstring: split.left,
			scale: v.dz,
			drawLineExtras: drawContextGlyphLeftLineExtras,
			drawGlyphExtras: drawContextGlyphExtras,
			drawGlyph: drawContextGlyph,
			maxes: {
				xMin: v.dx - leftdistance * v.dz,
				yMin: v.dy,
			},
		});

		_UI.contextGlyphs.leftseq.draw();
	}

	if (split.right) {
		let rightdistance = currGlyphObject.advanceWidth;
		if (currGlyphObject.isAutoWide) rightdistance -= currGlyphObject.lsb;
		rightdistance += calculateKernOffset(currGlyphChar, split.right.charAt(0));

		// log(`rightdistance: ${rightdistance}`);

		_UI.contextGlyphs.rightseq = new GlyphSequence({
			glyphstring: split.right,
			scale: v.dz,
			drawLineExtras: drawContextGlyphRightLineExtras,
			drawGlyphExtras: drawContextGlyphExtras,
			drawGlyph: drawContextGlyph,
			maxes: {
				xMin: v.dx + rightdistance * v.dz,
				yMin: v.dy,
			},
		});

		_UI.contextGlyphs.rightseq.draw();
	}

	// log('drawContextGlyphs', 'end');
}

function splitContextGlyphString(splitchar) {
	const ctxgs = getContextGlyphString();

	let l = '';
	let r = '';

	const pos = ctxgs.indexOf(splitchar);

	if (pos === -1) {
		l = ctxgs;
		r = '';
	} else {
		l = ctxgs.substr(0, pos);
		r = ctxgs.substr(pos + splitchar.length);
	}

	return { left: l, right: r };
}

function getGlyphSequenceAdvanceWidth(sequence) {
	let advanceWidth = 0;
	sequence = findAndMergeLigatures(sequence.split(''));

	let g;
	sequence.forEach(function (v, i, a) {
		g = getGlyph(glyphToHex(v));
		if (g) {
			advanceWidth += g.advanceWidth;
			if (a[i + 1]) advanceWidth += calculateKernOffset(v, a[i + 1]);
		} else {
			advanceWidth += (getCurrentProject().settings.font.upm * 1) / 2;
		}
	});

	return advanceWidth;
}

function drawContextGlyphLeftLineExtras(char, seq) {
	const alpha = transparencyToAlpha(getCurrentProject().settings.app.guides.system.transparency);
	const color = getColorFromRGBA('rgb(204,81,0)', alpha);
	drawVerticalLine(char.view.dx * char.view.dz, false, color);

	let kern = calculateKernOffset(
		seq.glyphstring[seq.glyphstring.length - 1],
		getSelectedWorkItemChar()
	);

	if (kern) {
		const selwi = getSelectedWorkItem();
		const v = getView('drawContextGlyphLeftLineExtras');
		kern *= -1;
		let rightx = selwi.isAutoWide ? kern - selwi.lsb : kern;
		rightx = v.dx + rightx * v.dz;
		const texty = sYcY(getCurrentProject().settings.font.descent - 60);

		drawGlyphKernExtra(-kern, rightx, texty, v.dz);
	}
}

function drawContextGlyphRightLineExtras(char, seq) {
	const kern = calculateKernOffset(getSelectedWorkItemChar(), char.char);

	if (kern) {
		const v = getView('drawContextGlyphRightLineExtras');
		const selwi = getSelectedWorkItem();
		let rightx = selwi.advanceWidth;
		if (selwi.isAutoWide) rightx -= selwi.lsb;
		rightx = v.dx + rightx * v.dz;
		const texty = sYcY(getCurrentProject().settings.font.descent - 60);

		drawGlyphKernExtra(kern, rightx, texty, v.dz);
	}
}

function drawContextGlyphExtras(char) {
	// log('drawContextGlyphExtras', 'start');

	// log(`${char.char}
	//  width \t ${char.width}
	//  aggr \t ${char.aggregate}
	//  lnbr \t ${char.islinebreaker}
	//  view \t ${json(char.view, true)}
	//  line \t ${char.linenumber}
	// \n`);
	// log(char.glyph);

	const ps = getCurrentProject().settings.font;
	const alpha = transparencyToAlpha(ps.colors.systemGuideTransparency);

	if (ps.contextGlyphs.showGuides && alpha) {
		const ctx = _UI.glyphEditCTX;
		const view = getView('drawContextGlyphExtras');
		const advanceWidth = char.width * view.dz;
		const currx = char.view.dx * view.dz;
		const rightx = currx + advanceWidth;
		const color = getColorFromRGBA('rgb(204,81,0)', alpha);
		const texty = sYcY(getCurrentProject().settings.font.descent - 60);

		// Draw the glyph name
		let gname = char.glyph ? char.glyph.getName() : getGlyphName(charsToHexArray(char.char));
		gname = gname.replace(/latin /i, '');
		drawGlyphNameExtra(gname, currx, texty, advanceWidth, color, char.char);

		// Draw vertical lines
		drawVerticalLine(rightx, false, color);

		// Draw kern notation
		if (char.kern) drawGlyphKernExtra(char.kern, rightx, texty, view.dz);
	}

	// log('drawContextGlyphExtras', 'end');
}

function drawGlyphNameExtra(text, currx, topy, advanceWidth, color, regHotspot) {
	// log('drawGlyphNameExtra', 'start');
	// log(`${text} passed regHotspot ${regHotspot}`);

	const ctx = _UI.glyphEditCTX;
	const textw = ctx.measureText(text).width;
	const textx = currx + (advanceWidth - textw) / 2; // center the glyph name
	const texty = topy + 22;

	ctx.font = '12px tahoma, verdana, sans-serif';

	ctx.strokeStyle = 'white';
	ctx.lineWidth = 10;
	ctx.strokeText(text, textx, texty);

	ctx.fillStyle = color;
	ctx.fillText(text, textx, texty);

	// Register hotspot
	if (regHotspot) {
		registerCanvasHotspot({
			target: {
				xMin: currx,
				xMax: currx + advanceWidth,
				yMin: texty - 20,
				yMax: texty + 20,
			},
			underline: {
				xMin: textx - 1,
				xMax: textx + textw + 1,
				y: texty + 6,
			},
			onclick: function () {
				hotspotNavigateToGlyph(glyphToHex(regHotspot));
			},
		});
	}
}

function drawGlyphKernExtra(kern, rightx, topy, scale) {
	const desc = getCurrentProject().settings.font.descent;
	const ctx = _UI.glyphEditCTX;
	const offset = 40;
	const color = getColorFromRGBA(
		'rgb(255,0,255)',
		transparencyToAlpha(getCurrentProject().settings.app.guides.system.transparency)
	);
	const barheight = Math.max(scale * 10, 1);

	ctx.font = '12px tahoma, verdana, sans-serif';
	ctx.fillStyle = color;
	ctx.fillRect(rightx, topy + offset, kern * scale, barheight);

	const text = 'kern: ' + kern;
	const textwidth = ctx.measureText(text).width;
	const textx = rightx - (kern * -1 * scale - textwidth) / 2 - textwidth;

	ctx.strokeStyle = color;
	drawVerticalLine(rightx + kern * scale, false, color);

	ctx.strokeStyle = 'white';
	ctx.lineWidth = 10;
	ctx.miterLimit = 1;

	// ctx.strokeText(text, textx, (topy + (offset*4)));
	// ctx.fillText(text, textx, (topy + (offset*4)));

	ctx.strokeText(text, textx, topy + offset + barheight + 22);
	ctx.fillText(text, textx, topy + offset + barheight + 22);
}

function drawContextGlyph(char) {
	// log('drawContextGlyph', 'start');
	// log(`${char.char}
	//  width \t ${char.width}
	//  aggr \t ${char.aggregate}
	//  lnbr \t ${char.islinebreaker}
	//  view \t ${json(char.view, true)}
	//  line \t ${char.linenumber}
	// \n`);
	// log(char.glyph);
	const v = getView('drawContextGlyph');
	const c = char.view;

	if (!char.glyph) return;
	char.glyph.drawGlyph(
		_UI.glyphEditCTX,
		{ dx: c.dx * c.dz, dy: v.dy, dz: c.dz },
		transparencyToAlpha(getCurrentProject().settings.app.contextGlyphTransparency),
		true
	);

	// log('drawContextGlyph', 'end');
}

// -------------------------------
//    CANVAS HOTSPOTS
// -------------------------------

function registerCanvasHotspot(hotspot) {
	_UI.canvasHotSpots.push(hotspot);
}

function clearCanvasHotspots() {
	_UI.canvasHotSpots = [];
}

function isHotspotHere(cx, cy) {
	const chs = _UI.canvasHotSpots;
	let v;

	for (let i = 0; i < chs.length; i++) {
		v = chs[i];
		// log(`isHotspotHere - checking ${v.target.xMin} - ${v.target.xMax} - ${v.target.yMin} - ${v.target.yMax}`);
		// log(`results ${(cx <= v.target.xMax)} - ${(cx >= v.target.xMin)} - ${(cy <= v.target.yMax)} - ${(cy >= v.target.yMin)}`);
		if (cx <= v.target.xMax && cx >= v.target.xMin && cy <= v.target.yMax && cy >= v.target.yMin) {
			return v;
		}
	}

	return false;
}

function findAndCallHotspot(cx, cy) {
	_UI.canvasHotSpots.forEach(function (v, i, a) {
		if (cx <= v.target.xMax && cx >= v.target.xMin && cy <= v.target.yMax && cy >= v.target.yMin) {
			v.onclick();
		}
	});
}

function hotspotNavigateToGlyph(gid) {
	// log('hotspotNavigateToGlyph', 'start');
	// log('passed ' + gid);

	const v = getView('hotspotNavigateToGlyph');
	const currchar = getSelectedWorkItemChar();
	const newchar = hexToChars(gid);
	const ctxg = getContextGlyphString();
	const p1 = ctxg.indexOf(currchar);
	const p2 = ctxg.indexOf(newchar);
	let flipper;
	let leftchar;
	let rightchar;

	if (p1 < p2) {
		flipper = 1;
		leftchar = currchar;
		rightchar = newchar;
	} else {
		flipper = -1;
		leftchar = newchar;
		rightchar = currchar;
	}

	const str = ctxg.substring(p1, p2);
	// log(`substring from ${p1} to ${p2} yeilds ${str}`);

	const delta = getGlyphSequenceAdvanceWidth(str);

	// log(`advance width: ${delta} screen pixels: ${sXcX(delta)}`);
	// v.dx += sXcX(delta);
	const kern = calculateKernOffset(leftchar, rightchar);
	// log(`kern offset ${leftchar} and ${rightchar} is ${kern}`);

	v.dx += v.dz * delta * flipper;
	v.dx += v.dz * kern * flipper;

	getGlyph(gid, true).contextGlyphs = ctxg;
	selectGlyph(gid);
	setView(v);

	_UI.redraw.redrawTools = true;
	update_ToolsArea();

	// log('hotspotNavigateToGlyph', 'end');
}

function findAndUnderlineHotspot(cx, cy) {
	// log('findAndUnderlineHotspot', 'start');
	// log(`cx:${cx} \t cy:${cy}`);
	const hs = isHotspotHere(cx, cy);
	const ctx = _UI.glyphEditCTX;
	// log(`${hs}`);
	if (hs) {
		const t = getCurrentProject().settings.app.guides.system.transparency;
		// var t2 = (((100 - t) / 2) + t);
		const alpha = transparencyToAlpha(t);
		const rgb = getColorFromRGBA('rgb(204,81,0)', alpha);

		ctx.strokeStyle = rgb;
		ctx.beginPath();
		ctx.moveTo(hs.underline.xMin, makeCrisp(hs.underline.y));
		ctx.lineTo(hs.underline.xMax, makeCrisp(hs.underline.y));
		ctx.stroke();
		setCursor('arrow');
	}

	return hs.target.xMin;
	// log('findAndUnderlineHotspot', 'end');
}

function calculateDefaultView() {
	const ps = getCurrentProject().settings.font;

	const xpadding = 80;
	const ypadding = 80; // Height of the UI across the top
	const canw = window.innerWidth - 470; // 470 is the width of the left panel area
	const canh = window.innerHeight - ypadding;

	const strw = ps.upm / 2;
	const strh = ps.ascent - ps.descent;

	let zw = round(canw / (strw * 1.4), 3);
	let zh = round(canh / (strh * 1.4), 3);
	let nz = Math.min(zh, zw);
	const nx = round((canw - nz * strw) / 2);
	const ny = round((canh - nz * strh) / 2 + ps.ascent * nz);

	_UI.defaultView = { dx: nx, dy: ny, dz: nz };
}

function fitViewToContextGlyphs(dontzoom) {
	// log('fitViewToContextGlyphs', 'start');
	const ps = getCurrentProject().settings.font;

	const xpadding = 80;
	const ypadding = 80; // Height of the UI across the top
	const canw = window.innerWidth - 470; // 470 is the width of the left panel area
	const canh = window.innerHeight - ypadding;
	// log(`CAN \t ${canw} \t ${canh}`);

	const strw = _UI.contextGlyphs.advancewidth;
	const strh = ps.ascent - ps.descent;
	// log(`STR \t ${strw} \t ${strh}`);

	let zw;
	let zh;
	let nz;

	if (dontzoom) {
		nz = getView('fitViewToContextGlyphs').dz;
		// log(`VZ \t ${nz}`);
	} else {
		zw = round(canw / (strw * 1.4), 3);
		zh = round(canh / (strh * 1.4), 3);
		// log(`NZ \t ${zw} \t ${zh}`);
	}

	nz = Math.min(zh, zw);
	const nx = round((canw - nz * strw) / 2);
	const ny = round((canh - nz * strh) / 2 + ps.ascent * nz);
	// log(`VIEW \t ${nx} \t ${ny} \t ${nz}`);

	setView({ dx: nx, dy: ny, dz: nz });
}

function getStringAdvanceWidth(str) {
	const carr = findAndMergeLigatures(str.split(''));
	let g;
	let aw = 0;

	for (let c = 0; c < carr.length; c++) {
		g = getGlyph(charsToHexArray(carr[c])[0]);

		aw += g.advanceWidth;

		if (c < carr.length - 2) {
			aw += calculateKernOffset(carr[c], carr[c + 1]);
		}
	}

	return aw;
}

// -------------------
// Drawing Grid
// -------------------

function drawGrid() {
	// log('drawGrid', 'start');

	const xs = {
		xMax: _UI.glyphEditCanvasSize,
		xMin: 0,
		yMax: _UI.glyphEditCanvasSize,
		yMin: 0,
	};

	// background white square
	_UI.glyphEditCTX.fillStyle = 'white';
	_UI.glyphEditCTX.fillRect(xs.xMin, xs.yMin, xs.xMax - xs.xMin, xs.yMax - xs.yMin);

	if (_UI.showGrid) {
		const ps = getCurrentProject().settings.font;
		const v = getView('grid');
		const gsize = (ps.upm / ps.gridDivisions) * v.dz;
		const gridcolor = getColorFromRGBA(
			'rgb(170,170,170)',
			transparencyToAlpha(getCurrentProject().settings.app.contextGlyphs.transparency)
		);
		_UI.glyphEditCTX.lineWidth = 1;

		if (gsize > 0 && gsize < _UI.glyphEditCanvasSize) {
			for (let i = v.dx; i < xs.xMax - 1; i += gsize) {
				drawVerticalLine(i, _UI.glyphEditCTX, gridcolor);
			}
			drawVerticalLine(xs.xMax + 1, _UI.glyphEditCTX, gridcolor);
			for (let j = v.dx; j >= xs.xMin; j -= gsize) {
				drawVerticalLine(j, _UI.glyphEditCTX, gridcolor);
			}

			for (let k = v.dy; k < xs.yMax - 1; k += gsize) {
				drawHorizontalLine(k, _UI.glyphEditCTX, gridcolor);
			}
			drawHorizontalLine(xs.yMax, _UI.glyphEditCTX, gridcolor);
			for (let p = v.dy; p >= xs.yMin; p -= gsize) {
				drawHorizontalLine(p, _UI.glyphEditCTX, gridcolor);
			}
		} else {
			console.warn('Grid size computed as ' + gsize + ', not drawing grid.');
		}
	}
}

function drawHorizontalLine(y, ctx, color) {
	ctx = ctx || _UI.glyphEditCTX;
	color = color || 'rgb(0,0,0)';

	ctx.strokeStyle = color;
	ctx.lineWidth = 1;
	y = makeCrisp(y);
	ctx.beginPath();
	ctx.moveTo(0, y);
	ctx.lineTo(_UI.glyphEditCanvasSize, y);
	ctx.stroke();
	ctx.closePath();
}

function drawVerticalLine(x, ctx, color) {
	ctx = ctx || _UI.glyphEditCTX;
	color = color || 'rgb(0,0,0)';

	ctx.strokeStyle = color;
	ctx.lineWidth = 1;
	x = makeCrisp(x);
	ctx.beginPath();
	ctx.moveTo(x, 0);
	ctx.lineTo(x, _UI.glyphEditCanvasSize + 1);
	ctx.stroke();
	ctx.closePath();
}

function drawGuides() {
	// log('drawGuides', 'start');

	if (!getSelectedWorkItemID()) return;

	const ps = getCurrentProject().projectSettings;
	const onglyphedit = editor.nav.page === 'Glyph edit' || editor.nav.page === 'ligatures';
	const onkern = editor.nav.page === 'kerning';
	// log('ps.guides: ');
	// log(ps.guides);

	if (_UI.showGuides) {
		if (onkern) {
			_UI.guides.leftGroupXMax.location = getSelectedKern().value;
			_UI.guides.leftGroupXMax.draw();
			_UI.guides.rightGroupXMin.draw();
			ps.guides.baseline.draw();
			return;
		}

		// Update custom guides
		let g;
		for (const c of Object.keys(ps.guides)) {
			g = ps.guides[c];
			if (g.editable) {
				g.draw();
			}
		}

		const selwi = getSelectedWorkItem();
		if (selwi) {
			const t = _UI.eventhandlers.tempnewbasicshape;
			const rl = t ? Math.max(selwi.glyphWidth, t.xMax) : selwi.glyphWidth;
			const ll = Math.min(selwi.maxes.xMin, 0);

			// Update system guides
			ps.guides.xHeight.location = ps.xHeight;
			ps.guides.capHeight.location = ps.capHeight;
			ps.guides.ascent.location = ps.ascent;
			ps.guides.baseline.location = 0;
			ps.guides.descent.location = ps.descent;
			ps.guides.min.location = ll;
			ps.guides.max.location = rl;
			ps.guides.leftside.location = getSelectedWorkItem() * -1;
			ps.guides.rightside.location = getSelectedGlyphRightSideBearing() + rl;

			// Minor Guidelines - Overshoots
			if (_UI.showOvershoots) {
				const os = ps.overshoot;
				ps.guides.xHeight.draw(-1 * os);
				ps.guides.ascent.draw(-1 * os);
				ps.guides.baseline.draw(os);
				ps.guides.descent.draw(os);
			}

			// Verticals
			ps.guides.zero.draw(0);
			if (onglyphedit) {
				ps.guides.min.draw(0);
				ps.guides.leftside.draw();
				if (getSelectedWorkItemShapes().length || !selwi.isAutoWide) {
					ps.guides.max.draw(0);
					ps.guides.rightside.draw();
				}
			}

			// Horizontals
			ps.guides.xHeight.draw();
			ps.guides.capHeight.draw();
			ps.guides.ascent.draw();
			ps.guides.descent.draw();
			ps.guides.baseline.draw();

			// Out of bounds triangle
			if (ps.guides.baseline.visible || ps.guides.leftside.visible) {
				const ctx = _UI.glyphEditCTX;
				const v = getView('guides');
				ctx.fillStyle = shiftColor(
					ps.guides.baseline.color,
					ps.colors.systemGuideTransparency / 100,
					true
				);
				ctx.beginPath();
				ctx.moveTo(v.dx - 1, v.dy);
				ctx.lineTo(v.dx - 1, v.dy + ps.pointSize * 2);
				ctx.lineTo(v.dx - 1 - ps.pointSize * 2, v.dy);
				ctx.closePath();
				ctx.fill();
			}
		}
	}
	// log('drawGuides', 'end');
}
