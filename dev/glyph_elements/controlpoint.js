import GlyphElement from './glyphelement.js';
import Coord from './coord.js';
import PathPoint from './pathpoint.js';
import {calculateAngle, calculateLength, angleToNiceAngle} from '../app/functions.js';

/**
 * Glyph Element > ControlPoint
 * Either the central Point in a Path Point, or one of it's Handles
 */
export default class ControlPoint extends GlyphElement {
    /**
     * Create a ControlPoint
     * @param {Coord} point - possition of the handle
     * @param {boolean} use - show or hide the handle
     * @param {PathPoint} rootPoint - point that this handle is connected to
     */
    constructor({
        point = {x: 100, y: 100},
        use = true,
        xLock = false,
        yLock = false,
        rootPoint = false,
    } = {}) {
        super();
        this.point = point;
        this.use = use;
        this.rootPoint = rootPoint;
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
            point: this.point.save(verbose),
        };

        if (this.use) re.use = true;
        if (this.xLock) re.xLock = true;
        if (this.yLock) re.yLock = true;

        if (!verbose) delete re.objType;

        return re;
    }

    /**
     * Create a nicely-formatted string for this object
     * @param {number} level - how far down we are
     * @returns {string}
     */
    print(level = 0) {
        let ind = '';
        for (let i=0; i<level; i++) ind += '  ';

        let re = `{Handle\n`;
        ind += '  ';

        re += `${ind}point: ${this.point.print(level+1)}\n`;
        re += `${ind}use: ${this.use}\n`;

        re += `${ind.substring(2)}}`;

        return re;
    }

    // --------------------------------------------------------------
    // Getters
    // --------------------------------------------------------------

    /**
     * Get the x coordinate
     * @returns {number}
     */
    get x() {
        return this._use? this._point.x : this.rootPoint.p.x;
    }

    /**
     * Get the y coordinate
     * @returns {number}
     */
    get y() {
        return this._use? this._point.y : this.rootPoint.p.y;
    }

    /**
     * Get the x/y Coord
     * @returns {Coord}
     */
    get point() {
        return this._point || new Coord();
    }

    /**
     * Get the show/hide value
     * @returns {boolean}
     */
    get use() {
        return this._use? true : false;
    }

    /**
     * Is the handle locked in the x dimension
     * @returns {boolean}
     */
    get xLock() {
        return this._xLock;
    }

    /**
     * Is the handle locked in the y dimension
     * @returns {boolean}
     */
    get yLock() {
        return this._yLock;
    }

    /**
     * Handle angle relative to Root Point
     * @returns {number}
     */
    get angle() {
        return calculateAngle(this.point, this.rootPoint.p);
    }

    /**
     * Handle "Nice Angle" for UI
     * @returns {number}
     */
    get niceAngle() {
        return angleToNiceAngle(this.angle);
    }

    /**
     * Get the root point this handle is connected to
     * @returns {PathPoint}
     */
    get rootPoint() {
        return this._rootPoint || new PathPoint();
    }

    /**
     * Handle Length
     * @returns {number}
     */
    get length() {
        return calculateLength(this.point, this.rootPoint.p);
    }


    // --------------------------------------------------------------
    // Setters
    // --------------------------------------------------------------

    /**
     * Set the X possiiton
     * @param {number} possition
     */
    set x(possition) {
        this.point.x = possition;
        this.use = true;
    }

    /**
     * Set the Y possiiton
     * @param {number} possition
     */
    set y(possition) {
        this.point.y = possition;
        this.use = true;
    }

    /**
     * Set the x/y Coord
     * @param {Coord} pt
     */
    set point(pt) {
        this._point = new Coord(pt);
        this.use = true;
    }

    /**
     * Show or hide the handle
     * @param {boolean} show
     */
    set use(show) {
        this._use = !!show;
    }

    /**
     * Set the handle lock in the x dimension
     * @param {boolean} lock
     */
    set xLock(lock) {
        this._xLock = !!lock;
    }

    /**
     * Set the handle lock in the y dimension
     * @param {boolean} lock
     */
    set yLock(lock) {
        this._yLock = !!lock;
    }

    /**
     * Set the root point this handle is connected to
     * @param {PathPoint} root
     */
    set rootPoint(root) {
        this._rootPoint = root;
    }
}
