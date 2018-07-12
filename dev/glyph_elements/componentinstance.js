import GlyphElement from './glyphelement.js';
import {parseUnicodeInput} from '../app/unicode.js';
import {strSan} from '../app/functions.js';
import {getGlyph} from './glyph.js';

export {showDialogAddComponent, addComponent, insertComponentInstance,
    turnComponentIntoShapes, addToUsedIn, removeFromUsedIn};
/**
     * Glyph Element > Component Instance
     * Component Instances are a link to any other
     * Glyph Object (Glyphs, Components, or Ligatures).
     * Additionally they hold transformation info about
     * how they differ from their root component.
     * Component Instances surface *all* the same
     * methods as a Shape, and are stored along side
     * regular Shapes in a Glyph.
     */
export default class ComponentInstance extends GlyphElement {
    /**
     * Create a ComponentInstance
     * @param {number} link - Root component that this instances is based on
     * @param {string} name - name
     * @param {number} translateX - horizontal position difference
     * @param {number} translateY - vertical position difference
     * @param {number} scaleW - horizontal size difference
     * @param {number} scaleH - vertical size difference
     * @param {boolean} flipEW - flipped horizontally
     * @param {boolean} flipNS - flipped vertically
     * @param {boolean} reverseWinding - paths have opposite winding
     * @param {number} rotation - rotation difference
     * @param {boolean} rotateFirst - rotate/resize is different than resize/rotate
     * @param {boolean} xLock - can't change horizontal position
     * @param {boolean} yLock - can't change vertical position
     * @param {boolean} wLock - can't change width
     * @param {boolean} hLock - can't change height
     * @param {boolean} ratioLock - change width and height 1:1
     * @param {boolean} visible - is this shape visible
     * @param {object} parent - link to the parent Glyph object
     */
    constructor({
        link = '0x0000',
        name = 'Component Instance',
        translateX = 0,
        translateY = 0,
        scaleW = 0,
        scaleH = 0,
        isFlippedNS = false,
        isFlippedEW = false,
        reverseWinding = false,
        rotation = 0,
        rotateFirst = false,
        xLock = false,
        yLock = false,
        wLock = false,
        hLock = false,
        ratioLock = false,
        visible = true,
        parent = false,
    } = {}) {
        super();
        this.link = link;
        this.name = name;
        this.translateX = translateX;
        this.translateY = translateY;
        this.scaleW = scaleW;
        this.scaleH = scaleH;
        this.isFlippedNS = isFlippedNS; // These have a different name because there is a function 'flipNS'
        this.isFlippedEW = isFlippedEW; // These have a different name because there is a function 'flipEW'
        this.reverseWinding = reverseWinding;
        this.rotation = rotation;
        this.rotateFirst = rotateFirst;
        this.xLock = xLock;
        this.yLock = yLock;
        this.wLock = wLock;
        this.hLock = hLock;
        this.ratioLock = ratioLock;
        this.visible = visible;
        this.parent = parent;

        this.changed();
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
            link: this.link,
        };

        if (this.name !== 'Component Instance') re.name = this.name;
        if (this.translateX !== 0) re.translateX = this.translateX;
        if (this.translateY !== 0) re.translateY = this.translateY;
        if (this.scaleW !== 0) re.scaleW = this.scaleW;
        if (this.scaleH !== 0) re.scaleH = this.scaleH;
        if (this.isFlippedNS !== false) re.isFlippedNS = this.isFlippedNS;
        if (this.isFlippedEW !== false) re.isFlippedEW = this.isFlippedEW;
        if (this.reverseWinding !== false) re.reverseWinding = this.reverseWinding;
        if (this.rotation !== 0) re.rotation = this.rotation;
        if (this.rotateFirst !== false) re.rotateFirst = this.rotateFirst;
        if (this.xLock !== false) re.xLock = this.xLock;
        if (this.yLock !== false) re.yLock = this.yLock;
        if (this.wLock !== false) re.wLock = this.wLock;
        if (this.hLock !== false) re.hLock = this.hLock;
        if (this.ratioLock !== false) re.ratioLock = this.ratioLock;
        if (this.visible !== true) re.visible = this.visible;

        if (!verbose) delete re.objType;

        return re;
    }


    // --------------------------------------------------------------
    // Getters
    // --------------------------------------------------------------

    /**
     * get link
     * @returns {string}
     */
    get link() {
        return this._link;
    }

    /**
     * get name
     * @returns {string}
     */
    get name() {
        return this._name;
    }

    /**
     * get translateX
     * @returns {number}
     */
    get translateX() {
        return this._translateX;
    }

    /**
     * get translateY
     * @returns {number}
     */
    get translateY() {
        return this._translateY;
    }

    /**
     * get scaleW
     * @returns {number}
     */
    get scaleW() {
        return this._scaleW;
    }

    /**
     * get scaleH
     * @returns {number}
     */
    get scaleH() {
        return this._scaleH;
    }

    /**
     * get isFlippedEW
     * @returns {boolean}
     */
    get isFlippedEW() {
        return this._isFlippedEW;
    }

    /**
     * get isFlippedNS
     * @returns {boolean}
     */
    get isFlippedNS() {
        return this._isFlippedNS;
    }

    /**
     * get reverseWinding
     * @returns {boolean}
     */
    get reverseWinding() {
        return this._reverseWinding;
    }

    /**
     * get rotation
     * @returns {number}
     */
    get rotation() {
        return this._rotation;
    }

    /**
     * get rotateFirst
     * @returns {boolean}
     */
    get rotateFirst() {
        return this._rotateFirst;
    }

    /**
     * get xLock
     * @returns {boolean}
     */
    get xLock() {
        return this._xLock;
    }

    /**
     * get yLock
     * @returns {boolean}
     */
    get yLock() {
        return this._yLock;
    }

    /**
     * get wLock
     * @returns {boolean}
     */
    get wLock() {
        return this._wLock;
    }

    /**
     * get hLock
     * @returns {boolean}
     */
    get hLock() {
        return this._hLock;
    }

    /**
     * get ratioLock
     * @returns {boolean}
     */
    get ratioLock() {
        return this._ratioLock;
    }

    /**
     * get visible
     * @returns {boolean}
     */
    get visible() {
        return this._visible;
    }

    // Computed properties

    /**
     * get x
     * @returns {number}
     */
    get x() {
        return this.maxes.xMin;
    }

    /**
     * get y
     * @returns {number}
     */
    get y() {
        return this.maxes.yMax;
    }

    /**
     * get width
     * @returns {number} width
     */
    get width() {
        let g = this.getTransformedGlyph().maxes;
        return g.xMax - g.xMin;
    }

    /**
     * get height
     * @returns {number} height
     */
    get height() {
        let g = this.getTransformedGlyph().maxes;
        return g.yMax - g.yMin;
    }

    /**
     * get maxes
     * @returns {Maxes} maxes
     */
    get maxes() {
        return this.getTransformedGlyph().maxes;
    }

    /**
     * center
     * @returns {Coord}
     */
    get center() {
        return this.getTransformedGlyph().center;
    }

    // --------------------------------------------------------------
    // Setters
    // --------------------------------------------------------------

    /**
     * set link
     * @param {string} link
     * @returns {ComponentInstance} - reference to this ComponentInstance
     */
    set link(link) {
        this._link = parseUnicodeInput(link)[0];
        return this;
    }

    /**
     * set name
     * @param {string} name
     * @returns {ComponentInstance} - reference to this ComponentInstance
     */
    set name(name = '') {
        name = strSan(name);
        if (name !== '') {
            this._name = name;
        } else {
            showToast('Invalid component instance name - component instance names must only contain alphanumeric characters or spaces.');
        }
        return this;
    }

    /**
     * set translateX
     * @param {number} translateX
     * @returns {ComponentInstance} - reference to this ComponentInstance
     */
    set translateX(translateX) {
        this._translateX = parseFloat(translateX);
        if (isNaN(this._translateX)) this._translateX = 0;
        return this;
    }

    /**
     * set translateY
     * @param {number} translateY
     * @returns {ComponentInstance} - reference to this ComponentInstance
     */
    set translateY(translateY) {
        this._translateY = parseFloat(translateY);
        if (isNaN(this._translateY)) this._translateY = 0;
        return this;
    }

    /**
     * set scaleW
     * @param {number} scaleW
     * @returns {ComponentInstance} - reference to this ComponentInstance
     */
    set scaleW(scaleW) {
        this._scaleW = parseFloat(scaleW);
        if (isNaN(this._scaleW)) this._scaleW = 0;
        return this;
    }

    /**
     * set scaleH
     * @param {number} scaleH
     * @returns {ComponentInstance} - reference to this ComponentInstance
     */
    set scaleH(scaleH) {
        this._scaleH = parseFloat(scaleH);
        if (isNaN(this._scaleH)) this._scaleH = 0;
        return this;
    }

    /**
     * set isFlippedNS
     * @param {boolean} isFlippedNS
     * @returns {ComponentInstance} - reference to this ComponentInstance
     */
    set isFlippedNS(isFlippedNS) {
        this._isFlippedNS = !!isFlippedNS;

        return this;
    }

    /**
     * set isFlippedEW
     * @param {boolean} isFlippedEW
     * @returns {ComponentInstance} - reference to this ComponentInstance
     */
    set isFlippedEW(isFlippedEW) {
        this._isFlippedEW = !!isFlippedEW;
        return this;
    }

    /**
     * set reverseWinding
     * @param {boolean} reverseWinding
     * @returns {ComponentInstance} - reference to this ComponentInstance
     */
    set reverseWinding(reverseWinding) {
        this._reverseWinding = !!reverseWinding;
        return this;
    }

    /**
     * set rotation
     * @param {number} rotation
     * @returns {ComponentInstance} - reference to this ComponentInstance
     */
    set rotation(rotation) {
        this._rotation = parseFloat(rotation);
        if (isNaN(this._rotation)) this._rotation = 0;
        return this;
    }

    /**
     * set rotateFirst
     * @param {boolean} rotateFirst
     * @returns {ComponentInstance} - reference to this ComponentInstance
     */
    set rotateFirst(rotateFirst) {
        this._rotateFirst = !!rotateFirst;
        return this;
    }

    /**
     * set xLock
     * @param {boolean} xLock
     * @returns {ComponentInstance} - reference to this ComponentInstance
     */
    set xLock(xLock) {
        this._xLock = !!xLock;
        return this;
    }

    /**
     * set yLock
     * @param {boolean} yLock
     * @returns {ComponentInstance} - reference to this ComponentInstance
     */
    set yLock(yLock) {
        this._yLock = !!yLock;
        return this;
    }

    /**
     * set wLock
     * @param {boolean} wLock
     * @returns {ComponentInstance} - reference to this ComponentInstance
     */
    set wLock(wLock) {
        this._wLock = !!wLock;
        return this;
    }

    /**
     * set hLock
     * @param {boolean} hLock
     * @returns {ComponentInstance} - reference to this ComponentInstance
     */
    set hLock(hLock) {
        this._hLock = !!hLock;
        return this;
    }

    /**
     * set ratioLock
     * @param {boolean} ratioLock
     * @returns {ComponentInstance} - reference to this ComponentInstance
     */
    set ratioLock(ratioLock) {
        this._ratioLock = !!ratioLock;
        return this;
    }

    /**
     * set visible
     * @param {boolean} visible
     * @returns {ComponentInstance} - reference to this ComponentInstance
     */
    set visible(visible) {
        this._visible = !!visible;
        return this;
    }

    // Computed properties

    /**
     * Set X possition
     * @param {number} x
     * @returns {ComponentInstance} - reference to this ComponentInstanceShape
     */
    set x(x) {
        this.setShapePosition(x, false);
        return this;
    }

    /**
     * Set Y possition
     * @param {number} y
     * @returns {ComponentInstance} - reference to this ComponentInstance
     */
    set y(y) {
        this.setShapePosition(false, y);
        return this;
    }

    /**
     * Set Width
     * @param {number} w
     * @returns {ComponentInstance} - reference to this ComponentInstance
     */
    set width(w) {
        this.setShapeSize(w, false);
        return this;
    }

    /**
     * Set Height
     * @param {number} h
     * @returns {ComponentInstance} - reference to this ComponentInstance
     */
    set height(h) {
        this.setShapeSize(false, h);
        return this;
    }


    // --------------------------------------------------------------
    // Get Transformed Glyph
    // --------------------------------------------------------------

    /**
     * Component Instances are basically links to other Glyphs, plus some transformations.
     * This function grabs a clone of the linked-to Glyph, applys the transformations,
     * and returns a Glyph object
     * @param {boolean} dontUseCache - false to force a new transform
     * @returns {Glyph}
     */
    getTransformedGlyph(dontUseCache) {
        // debug('\n ComponentInstance.getTransformedGlyph - START ' + this.name);
        // debug(`\t dontUseCache: ${dontUseCache}`);
        if (this.cache.transformedGlyph && !dontUseCache) {
            // debug('\t returning glyph in cache.transformedGlyph ');
            // debug(' ComponentInstance.getTransformedGlyph - END\n\n');
            return this.cache.transformedGlyph;
        }
        let g = cloneAndFlattenGlyph(this.link);
        if (!g) {
            console.warn('Tried to get Component: ' + this.link + ' but it doesn\'t exist - bad usedIn array maintenance.');
            return false;
        }
        // debug('\t DELTAS' + '\n\t translateX:\t' + this.translateX  + '\n\t translateY:\t' + this.translateY  + '\n\t scaleW:\t' + this.scaleW  + '\n\t scaleH:\t' + this.scaleH  + '\n\t flipEW:\t' + this.isFlippedEW  + '\n\t flipNS:\t' + this.isFlippedNS  + '\n\t reverseWinding:\t' + this.reverseWinding  + '\n\t rotation:\t' + this.rotation);
        if (this.translateX || this.translateY ||
            this.scaleW || this.scaleH ||
            this.isFlippedEW || this.isFlippedNS ||
            this.reverseWinding || this.rotation) {
            // debug('\t Modifying w ' + this.scaleW + ' h ' + this.scaleH);
            // debug('\t before maxes ' + json(g.maxes, true));
            if (this.rotateFirst) g.rotate(rad(this.rotation, g.center));
            if (this.isFlippedEW) g.flipEW();
            if (this.isFlippedNS) g.flipNS();
            g.updateGlyphPosition(this.translateX, this.translateY, true);
            g.updateGlyphSize(this.scaleW, this.scaleH, false);
            if (this.reverseWinding) g.reverseWinding();
            if (!this.rotateFirst) g.rotate(rad(this.rotation, g.center));
            // debug('\t afters maxes ' + json(g.maxes, true));
        } else {
            // debug('\t Not changing, no deltas');
        }

        g.changed();
        this.cache.transformedGlyph = g;
        // debug(' ComponentInstance.getTransformedGlyph - END\n\n');

        return g;
    }


    // --------------------------------------------------------------
    // Export to different languages
    // --------------------------------------------------------------

    /**
     * Make a PostScript path from this shape
     * PostScript paths use relative MoveTo commands, so
     * this shape must know about where the last shape left off
     * @param {number} lastx - x from previous path
     * @param {number} lasty - y from previous path
     * @returns {string} - PostScript path data
     */
    makePostScript(lastx, lasty) {
        // debug('GENLINKEDPOSTSCRIPT');
        let g = this.getTransformedGlyph();
        let re;
        let part;
        for (let s = 0; s < g.shapes.length; s++) {
            part = g.shapes[s].makePostScript(lastx, lasty);
            lastx = part.lastx;
            lasty = part.lasty;
            re += part.re;
        }
        return {
            're': re,
            'lastx': lastx,
            'lasty': lasty,
        };
    }

    /**
     * Make an Opentype.js Path
     * @param {opentype.Path} otpath
     * @returns {opentype.Path}
     */
    makeOpentypeJsPath(otpath) {
        otpath = otpath || new opentype.Path();
        let g = this.getTransformedGlyph();
        return g.makeOpentypeJsPath(otpath);
    }


    // --------------------------------------------------------------
    // Parity methods, shared between Shapes and ComponentInstances
    // --------------------------------------------------------------

    /**
     * updatePathPosition
     * @param {number} dx - delta x
     * @param {number} dy - delta y
     */
    updateShapePosition(dx, dy) {
        // debug('\n ComponentInstance.updateShapePosition - START');
        // debug('\t passed dx/dy/force: ' + dx + ' / ' + dy + ' / ' + force);
        // debug('\t translate was: ' + this.translateX + ' / ' + this.translateY);
        dx = parseFloat(dx) || 0;
        dy = parseFloat(dy) || 0;
        this.translateX = (1 * this.translateX) + dx;
        this.translateY = (1 * this.translateY) + dy;
        this.changed();
        // debug('\t translate now: ' + this.translateX + ' / ' + this.translateY);
        // debug(' ComponentInstance.updateShapePosition - END\n');
    }

    /**
     * setShapePosition
     * @param {number} nx - new x value
     * @param {number} ny - new y value
     */
    setShapePosition(nx, ny) {
        // debug('\n ComponentInstance.setShapePosition - START');
        // debug('\t passed nx/ny/force: ' + nx + ' / ' + ny + ' / ' + force);
        // debug('\t translate was: ' + this.translateX + ' / ' + this.translateY);
        let ogm = getGlyph(this.link).maxes;
        nx = parseFloat(nx);
        ny = parseFloat(ny);
        // debug('\t ogm ' + json(ogm, true));
        if (!isNaN(nx)) this.translateX = (nx - ogm.xMin);
        if (!isNaN(ny)) this.translateY = (ny - ogm.yMax);
        this.changed();
        // debug('\t translate now: ' + this.translateX + ' / ' + this.translateY);
        // debug(' ComponentInstance.setShapePosition - END\n');
    }

    /**
     * updatePathSize
     * @param {number} dw - delta width
     * @param {number} dh - delta height
     * @param {boolean} ratioLock - maintain aspect ratio
     */
    updateShapeSize(dw, dh, ratioLock) {
        // debug('\n ComponentInstance.updateShapeSize - START');
        // debug('\t passed dw/dh/ratioLock: ' + dw + ' / ' + dh + ' / ' + ratioLock);
        if (dw !== false) dw = parseFloat(dw) || 0;
        if (dh !== false) dh = parseFloat(dh) || 0;
        if (ratioLock) {
            let ts = this.getTransformedGlyph().maxes;
            let w = (ts.xMax - ts.xMin);
            let h = (ts.yMax - ts.yMin);
            if (Math.abs(dw) > Math.abs(dh)) {
                dh = (dw * (h / w));
            } else {
                dw = (dh * (w / h));
            }
        }
        // debug('\t translate was: ' + this.scaleW + ' / ' + this.scaleH);
        this.scaleW = (1 * this.scaleW) + dw;
        this.scaleH = (1 * this.scaleH) + dh;
        if (this.rotation === 0) this.rotateFirst = false;
        this.changed();
        // debug('\t translate now: ' + this.scaleW + ' / ' + this.scaleH);
        // debug(' ComponentInstance.updateShapeSize - END\n');
    }

    /**
     * setShapeSize
     * @param {number} nw - new width
     * @param {number} nh - new height
     * @param {boolean} ratioLock - maintain aspect ratio
     */
    setShapeSize(nw, nh, ratioLock) {
        let og = getGlyph(this.link).maxes;
        let dx = nx ? ((nx * 1) - og.xMin) : 0;
        let dy = ny ? ((ny * 1) - og.yMax) : 0;
        this.updateShapePosition(dx, dy, ratioLock);
    }

    /**
     * isOverControlPoint
     * @returns {boolean}
     */
    isOverControlPoint() {
        return false;
    }

    /**
     * flipEW
     * @param {number} mid - x value about which to flip
     * @returns {ComponentInstance} - reference to this component instance
     */
    flipEW(mid) {
        this.isFlippedEW = !this.isFlippedEW;
        if (mid) {
            let g = this.getTransformedGlyph().maxes;
            this.translateX += (((mid - g.xMax) + mid) - g.xMin);
        }
        if (this.rotation === 0) this.rotateFirst = false;
        this.changed();
        return this;
    }

    /**
     * flipNS
     * @param {number} mid - y value about which to flip
     * @returns {ComponentInstance} - reference to this component instance
     */
    flipNS(mid) {
        this.isFlippedNS = !this.isFlippedNS;
        if (mid) {
            let g = this.getTransformedGlyph().maxes;
            this.translateY += (((mid - g.yMax) + mid) - g.yMin);
        }
        if (this.rotation === 0) this.rotateFirst = false;
        this.changed();
        return this;
    }

    /**
     * rotate
     * @param {number} angle - how much to rotate
     * @param {Coord} about - x/y center of rotation
     * @returns {ComponentInstance} - reference to this component instance
     */
    rotate(angle, about) {
        // debug('\n ComponentInstance.rotate - START');
        // debug('\t passed ' + angle);
        let degrees = deg(angle);
        // debug('\t deg ' + degrees);
        // debug('\t was ' + this.rotation);
        // if(this.isFlippedEW || this.isFlippedNS) degrees *= -1;
        this.rotation = ((this.rotation + degrees) % 360);
        if (this.scaleH === 0 && this.scaleW === 0 && !this.isFlippedEW && !this.isFlippedNS) {
            this.rotateFirst = true;
        }
        this.changed();
        // debug('\t is now ' + this.rotation);
        // debug(' ComponentInstance.rotate - END\n');
        return this;
    }

    /**
     * reverseWinding
     */
    reverseWinding() {
        this.reverseWinding = !this.reverseWinding;
        this.changed();
    }

    // /**
    //  * calcMaxes
    //  * @returns {Maxes}
    //  */
    // calcMaxes() {
    //     this._maxes = this.getTransformedGlyph().calcMaxes();
    //     return this.maxes;
    // }

    /**
     * isHere
     * @param {number} px - check x
     * @param {number} py - check y
     * @returns {boolean}
     */
    isHere(px, py) {
        // debug('ISCOMPONENTHERE - checking ' + px + ',' + py);
        let g = this.getTransformedGlyph();
        return g ? g.isHere(px, py) : false;
    }


    // --------------------------------------------------------------
    // Drawing
    // --------------------------------------------------------------

    /**
     * Draw this Shape to a canvas
     * @param {object} lctx - canvas context
     * @param {view} view
     * @returns {boolean}
     */
    drawShape(lctx, view) {
        // debug('\n ComponentInstance.drawShape - START');
        // debug('\t view ' + json(view, true));
        /*
        Have to iterate through shapes instead of using Glyph.drawGlyph
        due to stacking shapes with appropriate winding
        */
        let g = this.getTransformedGlyph();
        if (!g) return false;
        let drewshape = false;
        let failed = false;
        for (let s = 0; s < g.shapes.length; s++) {
            drewshape = g.shapes[s].drawShape(lctx, view);
            failed = failed || !drewshape;
        }
        // debug(' ComponentInstance.drawShape - returning ' + !failed + ' - END\n');
        return !failed;
    }

/* NEEDS TO BE REFACTORED
    draw_PathOutline(accent, thickness) {
        // debug('\n ComponentInstance.draw_PathOutline - START');
        accent = accent || _UI.colors.green;
        thickness = thickness || 1;
        let g = this.getTransformedGlyph();
        for (let s = 0; s < g.shapes.length; s++) {
            draw_PathOutline(g.shapes[s], accent, thickness);
        }
    }
    draw_BoundingBox(accent, thickness) {
        // debug('\n ComponentInstance.draw_BoundingBox - START');
        accent = accent || _UI.colors.green;
        thickness = thickness || 1;
        let g = this.getTransformedGlyph().maxes;
        draw_BoundingBox(g, accent, thickness);
    }
    draw_BoundingBoxHandles(accent, thickness) {
        // debug('\n ComponentInstance.draw_BoundingBoxHandles - START');
        accent = accent || _UI.colors.green;
        thickness = thickness || 1;
        let g = this.getTransformedGlyph().maxes;
        draw_BoundingBoxHandles(g, accent, thickness);
    }
    isOverBoundingBoxHandle(px, py) {
        // debug('\n ComponentInstance.isOverBoundingBoxHandle - START');
        let c = isOverBoundingBoxHandle(px, py, this.maxes);
        // debug('\t ComponentInstance.isOverBoundingBoxHandle returning ' + c);
        return c;
    }
*/
}


// --------------------------------------------------------------
// Helper functions
// --------------------------------------------------------------

/**
 * Clones a Glyph, and "flattens" any Component Instances in
 * that glyph (renders transforms and removes links)
 * @param {string} gid - glyph ID
 * @returns {Glyph}
 */
function cloneAndFlattenGlyph(gid) {
    // debug('\n cloneAndFlattenGlyph - START');
    // debug('\t gid: ' + gid);

    let og = getGlyph(gid, true);
    if (og) og = new Glyph(clone(og));

    let newshapes = [];
    let tempglyph;

    for (let s=0; s<og.shapes.length; s++) {
        if (og.shapes[s].objType === 'ComponentInstance') {
            tempglyph = og.shapes[s].getTransformedGlyph(true);
            newshapes = newshapes.concat(tempglyph.shapes);
        } else {
            newshapes.push(og.shapes[s]);
        }
    }

    og.shapes = newshapes;

    // debug(og);
    return og;
}


// --------------------------------------------------------------
// Component Instance UI functions
// --------------------------------------------------------------

/**
 * Shows the Add Component dialog
 */
function showDialogAddComponent() {
    let show = countObjectKeys(_GP.components)? 'components' : 'glyphs';
    _UI.glyphChooser.dialog = {
        'fname': 'addComponent',
        'choices': 'all',
        'selected': show,
    };

    let content = '<h1>Add Component</h1>';
    content += 'Components are groups of shapes that can be re-used across many Glyphs.  Component Instances can be transformed while the Root Component remains unchanged.<br><br>';
    content += 'You can define and link to stand-alone Components, but you can also use Glyphs and Ligatures as if they were Root Components.<br><br>';
    content += 'Choose a Glyph to insert as a Component Instance in this Glyph.<br><br>';
    content += initGetShapesDialogOptions('component');
    openBigDialog(content);
}

/**
 * Adds a component
 * @param {string} sourceComponentID
 */
function addComponent(sourceComponentID) {
    insertComponentInstance(sourceComponentID, false, _UI.glyphChooser.getShapeOptions);
}

/**
 * Checks to see if a component instance can be added to a Glyph
 * (can't add if it introduces circular references)
 * @param {string} sourceComponentID - source ID
 * @param {string} destinationGlyphID - destination ID
 * @param {object} copyGlyphAttributes - attributes
 * @returns {boolean} - success
 */
function insertComponentInstance(sourceComponentID, destinationGlyphID, copyGlyphAttributes) {
    // debug('\n insertComponentInstance - START');
    // debug('\t sourceComponentID: ' + sourceComponentID + ' destinationGlyphID: ' + destinationGlyphID);

    let select = !destinationGlyphID;
    destinationGlyphID = destinationGlyphID || getSelectedWorkItemID();
    copyGlyphAttributes = copyGlyphAttributes || {srcAutoWidth: false, srcWidth: false, srcLSB: false, srcRSB: false};
    let destinationGlyph = getGlyph(destinationGlyphID, true);

    if (destinationGlyph.canAddComponent(sourceComponentID)) {
        let name = 'Instance of ' + getGlyphName(sourceComponentID);
        let nci = new ComponentInstance({'link': sourceComponentID, 'name': name});
        let sourceComponentGlyph = getGlyph(sourceComponentID);

        // debug('INSERT COMPONENT - JSON: \t' + JSON.stringify(nci));
        destinationGlyph.shapes.push(nci);
        destinationGlyph.changed();
        if (select) {
            _UI.multiSelect.shapes.select(nci);
            _UI.selectedTool = 'shaperesize';
        }

        addToUsedIn(sourceComponentID, destinationGlyphID);

        if (copyGlyphAttributes.srcAutoWidth) destinationGlyph.isAutoWide = sourceComponentGlyph.isAutoWide;
        if (copyGlyphAttributes.srcWidth) destinationGlyph.glyphWidth = sourceComponentGlyph.glyphWidth;
        if (copyGlyphAttributes.srcLSB) destinationGlyph.leftSideBearing = sourceComponentGlyph.leftSideBearing;
        if (copyGlyphAttributes.srcRSB) destinationGlyph.rightSideBearing = sourceComponentGlyph.rightSideBearing;

        closeDialog();
        history_put('insert component from glyphedit');
        redraw({calledBy: 'insertComponent'});
        return true;
    } else {
        openDialog('<h1>Whoops</h1><div class="dialoglargetext">A circular link was found, components can\'t include links to themselves.<br>They can\'t handle the philosophical conundrum it poses.</div><br><br><button class="buttonsel" onclick="closeDialog();">Fine, I guess.</button>');
        return false;
    }
}

/**
 * Takes a selected Component Instance, transforms it's shapes,
 * and addes them as regular shapes to the selected Glyph
 */
function turnComponentIntoShapes() {
    let selshape = _UI.multiSelect.shapes.getSingleton();
    let shapes = selshape.getTransformedGlyph().shapes;

    _UI.multiSelect.shapes.deleteShapes();

    for (let s=0; s<shapes.length; s++) {
        addShape(shapes[s]);
    }

    // debug('turnComponentIntoShapes - newshape \n'+json(newshape));
    redraw({calledBy: 'turnComponentIntoShapes'});
}


// --------------------------------------------------------------
// Used-In array
// --------------------------------------------------------------

/**
 * Adds a root component's ID from a destination's usedIn array
 * @param {string} rootID - root component ID
 * @param {string} destID - Glyph ID where this component is being used
 */
function addToUsedIn(rootID, destID) {
    // debug('ADDTOUSEDIN - rootID/destID ' + rootID + '/' + destID);
    let uia = getGlyph(rootID).usedIn;
    uia.push(''+destID);
    // sort numerically as opposed to alpha
    uia.sort(function(a, b) {
        return a-b;
    });
}

/**
 * Removes a root component's ID from a destination's usedIn array
 * @param {string} rootID - root component ID
 * @param {string} destID - Glyph ID where this component is being used
 */
function removeFromUsedIn(rootID, destID) {
    // debug("REMOVEFROMUSEDIN - rootID/destID " + rootID + "/" + destID);
    let uia = getGlyph(rootID).usedIn;
    let gindex = uia.indexOf(''+destID);
    if (gindex !== -1) {
        uia.splice(gindex, 1);
    }
}
