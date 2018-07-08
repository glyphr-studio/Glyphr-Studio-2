import GlyphElement from './glyphelement.js';

/**
 * Object > Glyph
 * A single collection of outlines that could
 * either represent a character, or be used as
 * part of another character through components.
 * The following objects are stored as Glyph
 * Objects:
 *   Glyphs (Characters)
 *   Ligatures
 *   Components
 */
export default class Glyph extends GlyphElement {
    /**
     * Create a Glyph
     * @param {string} hex
     * @param {boolean} isAutoWide
     * @param {number} glyphWidth
     * @param {number} leftSideBearing
     * @param {number} rightSideBearing
     * @param {boolean} ratioLock
     * @param {boolean} shapes
     * @param {boolean} usedIn
     * @param {boolean} contextGlyphs
     */
    constructor({
        hex = false,
        isAutoWide = true,
        glyphWidth = 0,
        leftSideBearing = false,
        rightSideBearing = false,
        ratioLock = false,
        shapes = [],
        usedIn = [],
        contextGlyphs = '',
    } = {}) {
        super();
        this.hex = hex || false;
        this.isAutoWide = isAutoWide;
        this.glyphWidth = glyphWidth;
        this.leftSideBearing = leftSideBearing;
        this.rightSideBearing = rightSideBearing;
        this.ratioLock = ratioLock;
        this.shapes = shapes;
        this.usedIn = usedIn;
        this.contextGlyphs = contextGlyphs;
        // debug('\t name: ' + this.name);

        this.changed();

        // debug(' Glyph - END\n');
    }


    // --------------------------------------------------------------
    // Common Glyphr Studio object methods
    // --------------------------------------------------------------

    /**
     * Export object properties that need to be saved to a project file
     * @param {boolean} verbose - export some extra stuff that makes the saved object more readable
     * @returns {*}
     */
    save(verbose = false) {
        let re = {
            objType: this.objType,
            name: this.name,
            hex: this._hex,
        };

        if (isAutoWide !== true) re.isAutoWide = this.isAutoWide;
        if (glyphWidth !== 0) re.glyphWidth = this.glyphWidth;
        if (leftSideBearing !== false) re.leftSideBearing = this.leftSideBearing;
        if (rightSideBearing !== false) re.rightSideBearing = this.rightSideBearing;
        if (ratioLock !== false) re.ratioLock = this.ratioLock;
        if (usedIn !== []) re.usedIn = this.usedIn;
        if (contextGlyphs !== '') re.contextGlyphs = this.contextGlyphs;

        if (this.shapes.length) {
            re.shapes = [];
            for (let s=0; s<this.shapes.length; s++) re.shapes.push(this.shapes[s].save(verbose));
        }

        if (!verbose) {
            delete re.objType;
            delete re.name;
        }

        return re;
    }

    /**
     * Reset the cache and calculate dimensions
     */
    changed() {
        for (let s=0; s<this.shapes.length; s++) this.shapes[s].chaged();
        this.cache = {};
        this.calcGlyphMaxes();
    }


    // --------------------------------------------------------------
    // Getters
    // --------------------------------------------------------------

    /**
     * get hex
     * @returns {string}
     */
    get hex() {
        return this._hex;
    }

    /**
     * get isAutoWide
     * @returns {boolean}
     */
    get isAutoWide() {
        return this._isAutoWide;
    }

    /**
     * get glyphWidth
     * @returns {number}
     */
    get glyphWidth() {
        return this._glyphWidth;
    }

    /**
     * get leftSideBearing
     * @returns {number}
     */
    get leftSideBearing() {
        return this._leftSideBearing;
    }

    /**
     * get rightSideBearing
     * @returns {number}
     */
    get rightSideBearing() {
        return this._rightSideBearing;
    }

    /**
     * get ratioLock
     * @returns {boolean}
     */
    get ratioLock() {
        return this._ratioLock;
    }

    /**
     * get shapes
     * @returns {array}
     */
    get shapes() {
        return this._shapes;
    }

    /**
     * get usedIn
     * @returns {array}
     */
    get usedIn() {
        return this._usedIn;
    }

    /**
     * get contextGlyphs
     * @returns {string}
     */
    get contextGlyphs() {
        return this._contextGlyphs;
    }

    // computed properties

    /**
     * Get X possition
     * @returns {number}
     */
    get x() {
        return this.maxes.xMin;
    }

    /**
     * Get Y possition
     * @returns {number}
     */
    get y() {
        return this.maxes.yMax;
    }

    /**
     * Get Width
     * @returns {number}
     */
    get width() {
        if (this.isAutoWide) {
            let w = this.maxes.xMax - this.maxes.xMin;
            return Math.max(w, 0);
        } else {
            return this.glyphWidth;
        }
    }

    /**
     * Get Height
     * @returns {number}
     */
    get height() {
        let h = this.maxes.yMax - this.maxes.yMin;
        return Math.max(h, 0);
    }

    /**
     * get maxes
     * @returns {boolean}
     */
    get maxes() {
        // debug('\n Glyph.getMaxes - START ' + this.name);
        if (!this._maxes || hasNonValues(this._maxes)) {
            this.calcGlyphMaxes();
        }
        if (this.shapes.length) {
            if (this._maxes.xMin === this._maxes.maxBounds.xMin ||
                this._maxes.xMax === this._maxes.maxBounds.xMax ||
                this._maxes.yMin === this._maxes.maxBounds.yMin ||
                this._maxes.yMax === this._maxes.maxBounds.yMax
            ) {
                this.calcGlyphMaxes();
            }
        }
        // debug('\t returning ' + json(this.maxes));
        // debug(' Glyph.getMaxes - END ' + this.name + '\n');
        return this._maxes;
    }

    // Computed properties

    /**
     * get name
     * @returns {string}
     */
    get name() {
        return getUnicodeName(this.hex);
    }

    /**
     * get char name
     * @returns {string}
     */
    get char() {
        return getGlyphName(this.hex);
    }

    /**
     * get HTML Char Code
     * @returns {String}
     */
    get charCode() {
        let code = hexToHTML(this.hex);
        return code || '';
    }

    /**
     * get Left Side Bearing
     * @returns {number}
     */
    get lsb() {
        if (this.leftSideBearing === false) {
            return _GP.projectSettings.defaultlsb;
        } else {
            return this.leftSideBearing;
        }
    }

    /**
     * get Right Side Bearing
     * @returns {number}
     */
    get rsb() {
        if (this.rightSideBearing === false) {
            return _GP.projectSettings.defaultrsb;
        } else {
            return this.rightSideBearing;
        }
    }

    /**
     * get Advance Width
     * @returns {number}
     */
    get advanceWidth() {
        if (this.isAutoWide) this.width + this.lsb + this.rsb;
        else return this.glyphWidth;
    }


    // --------------------------------------------------------------
    // Setters
    // --------------------------------------------------------------

    /**
     * set hex
     * @param {string} hex
     * @returns {Glyph} - reference to this Glyph
     */
    set hex(hex) {
        this._hex = hex;
        return this;
    }

    /**
     * set isAutoWide
     * @param {boolean} isAutoWide
     * @returns {Glyph} - reference to this Glyph
     */
    set isAutoWide(isAutoWide) {
        this._isAutoWide = !!isAutoWide;
        return this;
    }

    /**
     * set glyphWidth
     * @param {number} glyphWidth
     * @returns {Glyph} - reference to this Glyph
     */
    set glyphWidth(glyphWidth) {
        this._glyphWidth = parseFloat(glyphWidth);
        if (isNaN(this._glyphWidth)) this._glyphWidth = 0;
        return this;
    }

    /**
     * set leftSideBearing
     * @param {number} leftSideBearing
     * @returns {Glyph} - reference to this Glyph
     */
    set leftSideBearing(leftSideBearing) {
        this._leftSideBearing = parseFloat(leftSideBearing);
        if (isNaN(this._leftSideBearing)) this._leftSideBearing = 0;
        return this;
    }

    /**
     * set rightSideBearing
     * @param {number} rightSideBearing
     * @returns {Glyph} - reference to this Glyph
     */
    set rightSideBearing(rightSideBearing) {
        this._rightSideBearing = parseFloat(rightSideBearing);
        if (isNaN(this._rightSideBearing)) this._rightSideBearing = 0;
        return this;
    }

    /**
     * set ratioLock
     * @param {boolean} ratioLock
     * @returns {Glyph} - reference to this Glyph
     */
    set ratioLock(ratioLock) {
        this._ratioLock = !!ratioLock;
        return this;
    }

    /**
     * set shapes
     * @param {array} shapes
     * @returns {Glyph} - reference to this Glyph
     */
    set shapes(shapes) {
        if (shapes && shapes.length) {
            for (let i = 0; i < shapes.length; i++) {
                if (shapes[i].objType === 'ComponentInstance') {
                    // debug('\t hydrating ci ' + shapes[i].name);
                    this._shapes[i] = new ComponentInstance(shapes[i]);
                } else {
                    // debug('\t hydrating sh ' + shapes[i].name);
                    this._shapes[i] = new Shape(shapes[i]);
                }
            }
        }

        return this;
    }

    /**
     * set usedIn
     * @param {array} usedIn
     * @returns {Glyph} - reference to this Glyph
     */
    set usedIn(usedIn) {
        this._usedIn = usedIn;
        return this;
    }

    /**
     * set contextGlyphs
     * @param {string} contextGlyphs
     * @returns {Glyph} - reference to this Glyph
     */
    set contextGlyphs(contextGlyphs) {
        this._contextGlyphs = contextGlyphs;
        return this;
    }

    // computed properties

    /**
     * Set X possition
     * @param {number} x
     * @returns {Glyph} - reference to this Glyph
     */
    set x(x) {
        this.setGlyphPosition(x, false);
        return this;
    }

    /**
     * Set Y possition
     * @param {number} y
     * @returns {Glyph} - reference to this Glyph
     */
    set y(y) {
        this.setGlyphPosition(false, y);
        return this;
    }

    /**
     * Set Width
     * @param {number} w
     * @returns {Glyph} - reference to this Glyph
     */
    set width(w) {
        this.setGlyphSize(w, false);
        return this;
    }

    /**
     * Set Height
     * @param {number} h
     * @returns {Glyph} - reference to this Glyph
     */
    set height(h) {
        this.setGlyphSize(false, h);
        return this;
    }

    /**
     * Set Maxes
     * @param {Maxes} maxes
     * @returns {Glyph} - reference to this Glyph
     */
    set maxes(maxes) {
        this._maxes = new Maxes(maxes);
        return this;
    }


    // --------------------------------------------------------------
    // Transform & move
    // --------------------------------------------------------------

    /**
     * Move all the shapes in this glyph as one group
     * @param {number} nx - new x
     * @param {number} ny - new y
     */
    setGlyphPosition(nx, ny) {
        // debug('Glyph.setGlyphPosition - START');
        // debug('\t nx/ny/force: ' + nx + ' ' + ny + ' ' + force);
        let m = this.maxes;
        if (nx !== false) nx = parseFloat(nx);
        if (ny !== false) ny = parseFloat(ny);
        let dx = (nx !== false) ? (nx - m.xMin) : 0;
        let dy = (ny !== false) ? (ny - m.yMax) : 0;
        this.updateGlyphPosition(dx, dy);
        // debug(' Glyph.setGlyphPosition - END\n');
    }

    /**
     * Update all the shapes' possiitons in this glyph as one group
     * @param {number} dx - delta x
     * @param {number} dy - delta y
     */
    updateGlyphPosition(dx, dy) {
        // debug('\n Glyph.updateGlyphPosition - START ' + this.name);
        // debug('\t dx/dy/force: ' + dx + ' ' + dy + ' ' + force);
        // debug('\t number of shapes: ' + this.shapes.length);
        dx = parseFloat(dx) || 0;
        dy = parseFloat(dy) || 0;
        let cs = this.shapes;
        for (let i = 0; i < cs.length; i++) {
            cs[i].updateShapePosition(dx, dy);
        }
        this.changed();
        // debug(' Glyph.updateGlyphPosition - END ' + this.name + '\n\n');
    }

    /**
     * Set all the sizes of the shapes in this glyph as one group
     * @param {number} nw - new width
     * @param {number} nh - new height
     * @param {boolean} ratioLock - true to scale width and height 1:1
     */
    setGlyphSize(nw, nh, ratioLock) {
        // debug('SET GLYPHSIZE ---- nw/nh/ra:\t' + nw + '\t ' + nh + '\t ' + ratioLock);
        // debug('\t maxes: ' + json(this.maxes));
        let m = this.maxes;
        if (nw !== false) nw = parseFloat(nw);
        if (nh !== false) nh = parseFloat(nh);
        let ch = (m.yMax - m.yMin);
        let cw = (m.xMax - m.xMin);
        let dw = (nw !== false) ? (nw - cw) : 0;
        let dh = (nh !== false) ? (nh - ch) : 0;
        if (ratioLock) {
            if (Math.abs(nh) > Math.abs(nw)) dw = (cw * (nh / ch)) - cw;
            else dh = (ch * (nw / cw)) - ch;
        }
        this.updateGlyphSize(dw, dh, false);
    }

    /**
     * Update all the sizes of the shapes in this glyph as one group
     * @param {number} dw - delta width
     * @param {number} dh - delta height
     * @param {boolean} ratioLock - true to scale width and height 1:1
     */
    updateGlyphSize(dw, dh, ratioLock) {
        // debug('\n Glyph.updateGlyphSize - START ' + this.name);
        // debug('\t number of shapes: ' + this.shapes.length);
        // debug('\t dw dh rl:\t' + dw + '/' + dh + '/' + ratioLock);
        let m = this.maxes;
        if (dw !== false) dw = parseFloat(dw) || 0;
        if (dh !== false) dh = parseFloat(dh) || 0;
        // debug('\t adjust dw/dh:\t' + dw + '/' + dh);
        let oldw = m.xMax - m.xMin;
        let oldh = m.yMax - m.yMin;
        let neww = (oldw + dw);
        let newh = (oldh + dh);
        if (Math.abs(neww) < 1) neww = 1;
        if (Math.abs(newh) < 1) newh = 1;
        // debug('\t new w/h:\t' + neww + '/' + newh);
        let ratiodh = (newh / oldh);
        let ratiodw = (neww / oldw);
        // debug('\t ratio dw/dh:\t' + ratiodw + '/' + ratiodh);
        if (ratioLock) {
            // Assuming only one will be nonzero
            // if(Math.abs(ratiodh) > Math.abs(ratiodw)) ratiodw = ratiodh;
            // else ratiodh = ratiodw;
            if (dw !== 0 && dh === 0) ratiodh = ratiodw;
            else ratiodw = ratiodh;
        }
        // debug('\t ratio dw/dh:\t' + ratiodw + '/' + ratiodh);

        let cs = this.shapes;
        let s;
        let smaxes;
        let oldsw;
        let oldsh;
        let oldsx;
        let oldsy;
        let newsw;
        let newsh;
        let newsx;
        let newsy;
        let sdw;
        let sdh;
        let sdx;
        let sdy;

        // debug('\t Before Maxes ' + json(m, true));
        for (let i = 0; i < cs.length; i++) {
            s = cs[i];
            // debug('\t >>> Updating ' + s.objType + ' ' + i + '/' + cs.length + ' : ' + s.name);
            smaxes = s.maxes;

            // scale
            oldsw = smaxes.xMax - smaxes.xMin;
            newsw = oldsw * ratiodw;

            if (ratiodw === 0) sdw = false;
            else sdw = newsw - oldsw;

            oldsh = smaxes.yMax - smaxes.yMin;
            newsh = oldsh * ratiodh;

            if (ratiodh === 0) sdh = false;
            else sdh = newsh - oldsh;

            // debug('\t Shape ' + i + ' dw dh ' + sdw + ' ' + sdh);
            s.updateShapeSize(sdw, sdh, false);

            // move
            oldsx = smaxes.xMin - m.xMin;
            newsx = oldsx * ratiodw;

            if (ratiodw === 0) sdx = false;
            else sdx = newsx - oldsx;

            oldsy = smaxes.yMin - m.yMin;
            newsy = oldsy * ratiodh;

            if (ratiodh === 0) sdy = false;
            else sdy = newsy - oldsy;

            // debug('\t Shape Pos ' + i + ' dx dy ' + sdx + ' ' + sdy);
            s.updateShapePosition(sdx, sdy, true);
        }

        this.changed();
        // debug('\t Afters Maxes ' + json(this.maxes, true));
        // debug(' Glyph.updateGlyphSize - END ' + this.name + '\n');
    }

    /**
     * Flips this glyph about a horizontal line
     * @param {number} mid - y value about which to flip
     * @returns {Glyph} - reference to this glyph
     */
    flipNS(mid) {
        let m = this.maxes;
        mid = isVal(mid) ? mid : ((m.yMax - m.yMin) / 2) + m.yMin;
        for (let s = 0; s < this.shapes.length; s++) {
            this.shapes[s].flipNS(mid);
        }
        this.changed();

        return this;
    }

    /**
     * Flips this glyph about a vertical line
     * @param {number} mid - y value about which to flip
     * @returns {Glyph} - reference to this glyph
     */
    flipEW(mid) {
        // debug('\n Glyph.flipEW - START');
        // debug('\t ' + this.name);
        // debug('\t passed mid = ' + mid);
        let m = this.maxes;
        mid = isVal(mid) ? mid : ((m.xMax - m.xMin) / 2) + m.xMin;
        // debug('\t mid = ' + mid);
        // debug('\t maxes = ' + json(m, true));
        for (let s = 0; s < this.shapes.length; s++) {
            this.shapes[s].flipEW(mid);
        }
        this.changed();
        // debug('\t maxes = ' + json(this.maxes, true));
        return this;
    }

    /**
     * Rotate about a point
     * @param {number} angle - how much to rotate
     * @param {Coord} about - x/y center of rotation
     * @returns {Glyph} - reference to this glyph
     */
    rotate(angle, about) {
        about = about || this.getCenter();
        for (let s = 0; s < this.shapes.length; s++) {
            this.shapes[s].rotate(angle, about);
        }
        this.changed();

        return this;
    }

    /**
     * Reverses the order of the path points in all the paths,
     * thus reversing the winding
     */
    reverseWinding() {
        for (let s = 0; s < this.shapes.length; s++) {
            this.shapes[s].reverseWinding();
        }
        this.changed();
    }


    // --------------------------------------------------------------
    // Alignment
    // --------------------------------------------------------------


    /**
     * Move all the shapes to align with an edge
     * @param {string} edge - which edge to align all the shapes to
     */
    alignShapes(edge) {
        // debug('\n Glyph.alignShapes - START');
        // debug('\t edge: ' + edge);
        let target;
        let offset;

        if (edge === 'top') {
            target = -999999;
            this.shapes.forEach(function(v) {
                target = Math.max(target, v.maxes.yMax);
            });
            // debug('\t found TOP: ' + target);
            this.shapes.forEach(function(v) {
                v.setShapePosition(false, target);
            });
        } else if (edge === 'middle') {
            target = this.getCenter().y;
            // debug('\t found MIDDLE: ' + target);
            this.shapes.forEach(function(v) {
                offset = v.getCenter().y;
                v.updateShapePosition(false, (target - offset));
            });
        } else if (edge === 'bottom') {
            target = 999999;
            this.shapes.forEach(function(v) {
                target = Math.min(target, v.maxes.yMin);
            });
            // debug('\t found BOTTOM: ' + target);
            this.shapes.forEach(function(v) {
                offset = v.maxes.yMin;
                v.updateShapePosition(false, (target - offset));
            });
        } else if (edge === 'left') {
            target = 999999;
            this.shapes.forEach(function(v) {
                target = Math.min(target, v.maxes.xMin);
            });
            // debug('\t found LEFT: ' + target);
            this.shapes.forEach(function(v) {
                v.setShapePosition(target, false);
            });
        } else if (edge === 'center') {
            target = this.getCenter().x;
            // debug('\t found CENTER: ' + target);
            this.shapes.forEach(function(v) {
                offset = v.getCenter().x;
                v.updateShapePosition((target - offset), false);
            });
        } else if (edge === 'right') {
            target = -999999;
            this.shapes.forEach(function(v) {
                target = Math.max(target, v.maxes.xMax);
            });
            // debug('\t found RIGHT: ' + target);
            this.shapes.forEach(function(v) {
                offset = v.maxes.xMax;
                v.updateShapePosition((target - offset), false);
            });
        }

        this.changed();
        // debug(' Glyph.alignShapes - END\n');
    }


    // --------------------------------------------------------------
    // Calculating dimensions
    // --------------------------------------------------------------

    /**
     * Calcualte the overal maxes for this Glyph
     * @returns {Maxes}
     */
    calcGlyphMaxes() {
        // debug('\n Glyph.calcGlyphMaxes - START ' + this.name);
        this.maxes = clone(_UI.mins);
        let tm;
        if (this.shapes.length > 0) {
            for (let jj = 0; jj < this.shapes.length; jj++) {
                // debug('\t ++++++ START shape ' + jj);
                // debug(this.shapes[jj]);
                if (this.shapes[jj].getMaxes) {
                    tm = this.shapes[jj].maxes;
                    // debug('\t before ' + json(tm, true));
                    this.maxes = getOverallMaxes([tm, this.maxes]);
                    // debug('\t afters ' + json(tm, true));
                    // debug('\t ++++++ END shape ' + jj + ' - ' + this.shapes[jj].name);
                }
            }
        } else {
            this.maxes = {'xMax': 0, 'xMin': 0, 'yMax': 0, 'yMin': 0};
        }

        // debug(' Glyph.calcGlyphMaxes - END ' + this.name + '\n');
        return clone(this.maxes);
    }


    // --------------------------------------------------------------
    // COMPONENT STUFF
    // --------------------------------------------------------------

    /**
     * Searches this Glyph for any Comonent Instance
     * @returns {boolean}
     */
    containsComponents() {
        for (let s = 0; s < this.shapes.length; s++) {
            if (this.shapes[s].objType === 'ComponentInstance') {
                return true;
            }
        }
        return false;
    }

    /**
     * Component Instances contain links to other Glyphs, or
     * other Component Instances.  Circular links cause the world
     * to explode, so let's check for those before we add a new link.
     * @param {string} cid - ID of component to look for
     * @returns {boolean}
     */
    canAddComponent(cid) {
        // debug('\n Glyph.canAddComponent - START');
        let myid = '' + getMyID(this);
        // debug('\t adding ' + cid + ' to (me) ' + myid);
        if (myid === cid) return false;
        if (this.usedIn.length === 0) return true;
        let downlinks = this.collectAllDownstreamLinks([], true);
        downlinks = downlinks.filter(function(elem, pos) {
            return downlinks.indexOf(elem) === pos;
        });
        let uplinks = this.collectAllUpstreamLinks([]);
        uplinks = uplinks.filter(function(elem, pos) {
            return uplinks.indexOf(elem) === pos;
        });
        // debug('\t downlinks: ' + downlinks);
        // debug('\t uplinks: ' + uplinks);
        if (downlinks.indexOf(cid) > -1) return false;
        if (uplinks.indexOf(cid) > -1) return false;

        return true;
    }

    collectAllDownstreamLinks(re, excludepeers) {
        re = re || [];
        for (let s = 0; s < this.shapes.length; s++) {
            if (this.shapes[s].objType === 'ComponentInstance') {
                re = re.concat(getGlyph(this.shapes[s].link).collectAllDownstreamLinks(re));
                if (!excludepeers)
                    re.push(this.shapes[s].link);
            }
        }
        return re;
    }
    collectAllUpstreamLinks(re) {
        re = re || [];
        for (let g = 0; g < this.usedIn.length; g++) {
            re = re.concat(getGlyph(this.usedIn[g]).collectAllUpstreamLinks(re));
            re.push(this.usedIn[g]);
        }
        return re;
    }
    // This method is called on Glyphs just before they are deleted
    // to clean up all the component instance linking
    deleteLinks(thisid) {
        // debug('\n Glyph.deleteLinks - START');
        // debug('\t passed this as id: ' + thisid);
        // Delete upstream Component Instances
        let upstreamglyph;
        for (let c = 0; c < this.usedIn.length; c++) {
            upstreamglyph = getGlyph(this.usedIn[c]);
            // debug('\t removing from ' + upstreamglyph.name);
            // debug(upstreamglyph.shapes);
            for (let u = 0; u < upstreamglyph.shapes.length; u++) {
                if (upstreamglyph.shapes[u].objType === 'ComponentInstance' && upstreamglyph.shapes[u].link === thisid) {
                    upstreamglyph.shapes.splice(u, 1);
                    u--;
                }
            }
            // debug(upstreamglyph.shapes);
        }
        // Delete downstream usedIn array values
        for (let s = 0; s < this.shapes.length; s++) {
            if (this.shapes[s].objType === 'ComponentInstance') {
                removeFromUsedIn(this.shapes[s].link, thisid);
            }
        }
    }
    // --------------------------------------------------------------
    // DRAWING AND EXPORTING
    // --------------------------------------------------------------
    drawGlyph(lctx, view, alpha, addLSB) {
        // debug('\n Glyph.drawGlyph - START ' + this.name);
        // debug('\t view ' + json(view, true));
        let sl = this.shapes;
        let shape, drewshape;
        if (isNaN(alpha) || alpha > 1 || alpha < 0)
            alpha = 1;
        if (addLSB && this.isAutoWide)
            view.dx += (this.getLSB() * view.dz);
        lctx.beginPath();
        for (let j = 0; j < sl.length; j++) {
            shape = sl[j];
            if (shape.visible) {
                // debug('\t ' + this.name + ' drawing ' + shape.objType + ' ' + j + ' ' + shape.name);
                drewshape = shape.drawShape(lctx, view);
                if (!drewshape) {
                    console.warn('Could not draw shape ' + shape.name + ' in Glyph ' + this.name);
                    if (shape.objType === 'ComponentInstance' && !getGlyph(shape.link)) {
                        console.warn('>>> Component Instance has bad link: ' + shape.link);
                        let i = this.shapes.indexOf(shape);
                        if (i > -1) {
                            this.shapes.splice(i, 1);
                            console.warn('>>> Deleted the Instance');
                        }
                    }
                }
            }
        }
        lctx.closePath();
        // lctx.fillStyle = getRGBfromRGBA(_GP.projectSettings.colors.glyphfill, alpha);
        lctx.fillStyle = _GP.projectSettings.colors.glyphfill;
        lctx.globalAlpha = alpha;
        lctx.fill('nonzero');
        lctx.globalAlpha = 1;
        // debug(' Glyph.drawGlyph - END ' + this.name + '\n');
        return (this.getAdvanceWidth() * view.dz);
    }
    makeSVG(size, gutter) {
        // debug('\n Glyph.makeSVG - START');
        let ps = _GP.projectSettings;
        size = size || _UI.thumbSize;
        gutter = gutter || _UI.thumbGutter;
        let emsquare = Math.max(ps.upm, (ps.ascent - ps.descent));
        let desc = Math.abs(ps.descent);
        let charscale = (size - (gutter * 2)) / size;
        let gutterscale = (gutter / size) * emsquare;
        let vbsize = emsquare - (gutter * 2);
        let pathdata = this.getSVGpathData();
        // Assemble SVG
        let re = '<svg version="1.1" ';
        re += 'xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ';
        re += 'width="' + size + '" height="' + size + '" viewBox="0,0,' + vbsize + ',' + vbsize + '">';
        re += '<g transform="translate(' + (gutterscale) + ',' + (emsquare - desc - (gutterscale / 2)) + ') scale(' + charscale + ',-' + charscale + ')">';
        // re += '<rect x="0" y="-'+desc+'" height="'+desc+'" width="1000" fill="lime"/>';
        // re += '<rect x="0" y="0" height="'+(emsquare-desc)+'" width="1000" fill="cyan"/>';
        re += '<path d="' + pathdata + '"/>';
        re += '</g>';
        re += '</svg>';
        // debug(' Glyph.makeSVG - END\n');
        return re;
    }
    getSVGpathData() {
        if (this.cache.svgpathdata)
            return this.cache.svgpathdata;
        this.cache.svgpathdata = this.makeSVGPathData();
        return this.cache.svgpathdata;
    }
    makeSVGPathData() {
        if (this.cache.svg)
            return this.cache.svg;
        let sl = this.shapes;
        let pathdata = '';
        let lsb = this.getLSB();
        let shape, path, tg;
        // Make Pathdata
        for (let j = 0; j < sl.length; j++) {
            shape = sl[j];
            if (shape.visible) {
                if (shape.objType === 'ComponentInstance') {
                    tg = shape.getTransformedGlyph();
                    if (tg)
                        pathdata += tg.getSVGpathData();
                } else {
                    path = shape.getPath();
                    path.updatePathPosition(lsb, 0, true);
                    pathdata += path.getSVGpathData('Glyph ' + this.name + ' Shape ' + shape.name);
                    if (j < sl.length - 1)
                        pathdata += ' ';
                }
            }
        }
        if (trim(pathdata) === '')
            pathdata = 'M0,0Z';
        this.cache.svg = pathdata;
        return pathdata;
    }
    makeOpentypeJsPath(otpath) {
        otpath = otpath || new opentype.Path();
        for (let s = 0; s < this.shapes.length; s++) {
            otpath = this.shapes[s].makeOpentypeJsPath(otpath);
        }
        return otpath;
    }
    draw_MultiSelectAffordances() {
        let allpoints = [];
        for (let s = 0; s < this.shapes.length; s++) {
            if (this.shapes[s].objType !== 'ComponentInstance') {
                allpoints = allpoints.concat(this.shapes[s].path.pathPoints);
                this.shapes[s].draw_PathOutline(_UI.colors.blue, 1);
            }
        }
        draw_PathPoints(allpoints, _UI.colors.blue);
    }
    isOverControlPoint(x, y, targetSize, noHandles) {
        let re = false;
        for (let s = 0; s < this.shapes.length; s++) {
            if (this.shapes[s].objType !== 'ComponentInstance') {
                re = this.shapes[s].path.isOverControlPoint(x, y, targetSize, noHandles);
                if (re)
                    return re;
            }
        }
        return false;
    }
    flattenGlyph() {
        let reshapes = [];
        let ts, tg;
        for (let s = 0; s < this.shapes.length; s++) {
            ts = this.shapes[s];
            if (ts.objType === 'Shape') {
                reshapes.push(clone(ts));
            } else if (ts.objType === 'ComponentInstance') {
                tg = ts.getTransformedGlyph();
                tg = tg.flattenGlyph();
                reshapes = reshapes.concat(tg.shapes);
            } else {
                // debug('\n Glyph.flattenGlyph - ERROR - none shape or ci in shapes array');
            }
        }
        this.shapes = reshapes;
        // this.calcGlyphMaxes();
        return this;
    }
    combineAllShapes(donttoast, dontresolveoverlaps) {
        // debug('\n Glyph.combineAllShapes - START - ' + this.name);
        this.flattenGlyph();
        let cs = combineShapes(this.shapes, donttoast, dontresolveoverlaps);
        if (cs) {
            // debug('\t new shapes');
            this.shapes = cs;
            // debug(this.shapes);
            this.changed();
        }
        // debug(this.name + ' \t\t ' + this.shapes.length);
        // debug(' Glyph.combineAllShapes - END - ' + this.name + '\n');
        return this;
    }
    resolveOverlapsForAllShapes() {
        let newshapes = [];
        for (let ts = 0; ts < this.shapes.length; ts++) {
            newshapes = newshapes.concat(this.shapes[ts].resolveSelfOverlaps());
        }
        this.shapes = newshapes;
        this.changed();
    }
    // --------------------------------------------------------------
    // Methods
    // --------------------------------------------------------------
    changed(descend, ascend) {
        this.cache = {};
        if (ascend) {
            for (let g = 0; g < this.usedIn.length; g++) {
                getGlyph(this.usedIn[g]).changed(descend, ascend);
            }
        }
        if (descend) {
            for (let s = 0; s < this.shapes.length; s++)
                this.shapes[s].changed(descend, ascend);
        }
        this.calcGlyphMaxes();
    }
    map(indents) {
        indents = indents || '   ';
        let re = (indents + 'GLYPH ' + this.name + '\n');
        let ts;
        for (let s = 0; s < this.shapes.length; s++) {
            ts = this.shapes[s];
            if (ts.objType === 'Shape') {
                re += (indents + '-' + s + '-' + ts.name + ' ' + json(ts.path.maxes, true) + '\n');
            } else if (ts.objType === 'ComponentInstance') {
                re += (indents + '~' + s + '~' + ts.name + '\n');
                re += getGlyph(ts.link).map(indents + '   ');
            }
        }
        return re;
    }
    copyShapesTo(destinationID, copyGlyphAttributes) {
        // debug('\n Glyph.copyShapesTo - START');
        copyGlyphAttributes = copyGlyphAttributes || { srcAutoWidth: false, srcWidth: false, srcLSB: false, srcRSB: false };
        let destinationGlyph = getGlyph(destinationID, true);
        let tc;
        for (let c = 0; c < this.shapes.length; c++) {
            tc = this.shapes[c];
            if (tc.objType === 'ComponentInstance') {
                addToUsedIn(tc.link, destinationID);
                tc = new ComponentInstance(clone(tc));
            } else if (tc.objType === 'Shape') {
                tc = new Shape(clone(tc));
            }
            destinationGlyph.shapes.push(tc);
        }
        if (copyGlyphAttributes.srcAutoWidth)
            destinationGlyph.isAutoWide = this.isAutoWide;
        if (copyGlyphAttributes.srcWidth)
            destinationGlyph.glyphWidth = this.glyphWidth;
        if (copyGlyphAttributes.srcLSB)
            destinationGlyph.leftSideBearing = this.leftSideBearing;
        if (copyGlyphAttributes.srcRSB)
            destinationGlyph.rightSideBearing = this.rightSideBearing;
        showToast('Copied ' + this.shapes.length + ' shapes');
        destinationGlyph.changed();
        // debug('\t new shapes');
        // debug(destinationGlyph.shapes);
        // debug(' Glyph.copyShapesTo - END\n');
    }
    isHere(x, y) {
        for (let s = 0; s < this.shapes.length; s++) {
            if (this.shapes[s].isHere(x, y))
                return true;
        }
        return false;
    }
    hasShapes() {
        let tg;
        for (let s = 0; s < this.shapes.length; s++) {
            if (this.shapes[s].objType !== 'ComponentInstance')
                return true;
            else {
                tg = this.shapes[s].getTransformedGlyph();
                if (tg.hasShapes())
                    return true;
            }
        }
        return false;
    }
    removeShapesWithZeroLengthPaths() {
        for (let s = 0; s < this.shapes.length; s++) {
            if (this.shapes[s].path && this.shapes[s].path.pathPoints.length === 0) {
                this.shapes.splice(s, 1);
                s--;
            }
        }
    }
    getPathPoints() {
        let points = [];
        this.shapes.forEach(function (shape, i) {
            points = points.concat(shape.path.pathPoints);
        });
        return points;
    }
    getShapes() {
        return this.shapes;
    }
}


















































// --------------------------------------------------------------
// GLYPH FUNCTIONS
// --------------------------------------------------------------
// GET
function getGlyph(id, create) {
    // debug('\n getGlyph - START');
    // debug('\t passed: ' + id + ' create: ' + create);

    if (!id) {
        // debug('\t Not passed an ID, returning false');
        return false;
    }

    if (_GP === {}) {
        // debug('\t _GP is uninitialized, returning false');
        return false;
    }

    id = ''+id;
    let rechar;

    if (id.indexOf('0x', 2) > -1) {
        rechar = _GP.ligatures[id];
        // debug('\t retrieved ' + rechar + ' from ligatures.');
        if (rechar) {
            return rechar;
        } else if (create) {
            // debug('\t create was true, returning a new ligature.');
            _GP.ligatures[id] = new Glyph({'glyphhex': id});
            return _GP.ligatures[id];
        }
    } else if (id.indexOf('0x') > -1) {
        rechar = _GP.glyphs[id];
        // debug('\t retrieved ' + rechar + ' from glyphs.');
        if (rechar) {
            return rechar;
        } else if (create) {
            // debug('\t create was true, returning a new char.');
            _GP.glyphs[id] = new Glyph({'glyphhex': id});
            return _GP.glyphs[id];
        }
    } else {
        // debug('\t component, retrieved');
        // debug(_GP.components[id]);
        return _GP.components[id] || false;
    }

    // debug('getGlyph - returning FALSE\n');
    return false;
}

function getGlyphType(id) {
    if (id.indexOf('0x', 2) > -1) return 'ligature';
    else if (id.indexOf('0x') > -1) return 'glyph';
    else return 'component';
}

function getGlyphName(ch) {
    ch = ''+ch;
    // debug('\n getGlyphName');
    // debug('\t passed ' + ch);

    // not passed an id
    if (!ch) {
        // debug('\t not passed an ID, returning false');
        return false;
    }

    // known unicode names
    let un = getUnicodeName(ch);
    if (un && un !== '[name not found]') {
        // debug('\t got unicode name: ' + un);
        return un;
    }

    let cobj = getGlyph(ch);
    if (ch.indexOf('0x', 2) > -1) {
        // ligature
        // debug('\t ligature - returning ' + hexToHTML(ch));
        return cobj.name || hexToHTML(ch);
    } else {
        // Component
        // debug('getGlyphName - inexplicably fails, returning [name not found]\n');
        return cobj.name || '[name not found]';
    }

    // debug(' getGlyphName - returning nothing - END\n');
}

function getFirstGlyphID() {
    if (_GP.glyphs['0x0041']) return '0x0041';
    else return getFirstID(_GP.glyphs);
}

// GET SELECTED
function getSelectedGlyphLeftSideBearing() {
    // debug('getSelectedGlyphLeftSideBearing');
    let sc = getSelectedWorkItem();
    if (!sc) return 0;
    if (sc.objType === 'component') return 0;
    if (!sc.isAutoWide) return 0;
    return sc.leftSideBearing || _GP.projectSettings.defaultlsb;
}

function getSelectedGlyphRightSideBearing() {
    // debug('getSelectedGlyphLeftSideBearing');
    let sc = getSelectedWorkItem();
    if (!sc) return 0;
    if (sc.objType === 'component') return 0;
    if (!sc.isAutoWide) return 0;
    return sc.rightSideBearing || _GP.projectSettings.defaultrsb;
}

function updateCurrentGlyphWidth() {
    let sc = getSelectedWorkItem();
    if (!sc) return;
    if (_UI.currentPage === 'glyph edit') {
        sc.changed();
    } else if (_UI.currentPage === 'components' && sc) {
        let lsarr = sc.usedIn;
        if (lsarr) for (let c=0; c<lsarr.length; c++) getGlyph(lsarr[c]).changed();
    }
}
