/* exported Handle */

/**
 * Handle
 * There are two of these associated with a single PathPoint
 * They can be hidden or used, which alters the overall path
 * shape.
 */
class Handle {
    /**
     * Create a Handle
     * @param {Coord} point - possition of the handle
     * @param {boolean} use - show or hide the handle
     * @param {PathPoint} rootPoint - point that this handle is connected to
     */
    constructor({
        point = {x: 100, y: 100},
        use = true,
        rootPoint = false,
    } = {}) {
        this._point = new Coord(point);
        if (use) this._use = use;
        this._rootPoint = rootPoint;
    }

    /**
     * Export object to project file
     * @return {object}
     */
    save() {
        let re = {
            point: this.point.save(),
        };

        if (this._use) re.use = true;

        return re;
    }


    // --------------------
    // GETTERS
    // --------------------

    /**
     * Get the x coordinate
     * @return {number}
     */
    get x() {
        return this._use? this._point.x : this.rootPoint.p.x;
    }

    /**
     * Get the y coordinate
     * @return {number}
     */
    get y() {
        return this._use? this._point.y : this.rootPoint.p.x;
    }

    /**
     * Get the x/y Coord
     * @return {Coord}
     */
    get point() {
        return this._point || new Coord();
    }

    /**
     * Get the show/hide value
     * @return {boolean}
     */
    get use() {
        return this._use? true : false;
    }

    /**
     * Is the handle locked in the x dimension
     * @return {boolean}
     */
    get xLock() {
        return this.point.xLock;
    }

    /**
     * Is the handle locked in the y dimension
     * @return {boolean}
     */
    get yLock() {
        return this.point.yLock;
    }

    /**
     * Handle angle relative to Root Point
     * @return {number}
     */
    get angle() {
        return calculateAngle(this.point, this.rootPoint.p);
    }

    /**
     * Handle "Nice Angle" for UI
     * @return {number}
     */
    get niceAngle() {
        return angleToNiceAngle(this.angle);
    }

    /**
     * Get the root point this handle is connected to
     * @return {PathPoint}
     */
    get rootPoint() {
        return this._rootPoint || new PathPoint();
    }

    /**
     * Handle Length
     * @return {number}
     */
    get length() {
        return calculateLength(this.point, this.rootPoint.p);
    }


    // --------------------
    // SETTERS
    // --------------------

    /**
     * Set the X possiiton
     * @param {number} possition
     */
    set x(possition) {
        this.point.x = possition;
    }

    /**
     * Set the Y possiiton
     * @param {number} possition
     */
    set y(possition) {
        this.point.y = possition;
    }

    /**
     * Set the x/y Coord
     * @param {Coord} pt
     */
    set point(pt) {
        this._point = pt;
    }

    /**
     * Show or hide the handle
     * @param {boolean} show
     */
    set use(show) {
        if (show) this._use = true;
        else {
            if (this._use) delete this._use;
        }
    }

    /**
     * Set the handle lock in the x dimension
     * @param {boolean} lock
     */
    set xLock(lock) {
        this.point.xLock = lock;
    }

    /**
     * Set the handle lock in the y dimension
     * @param {boolean} lock
     */
    set yLock(lock) {
        this.point.yLock = lock;
    }

    /**
     * Set the root point this handle is connected to
     * @param {PathPoint} root
     */
    set rootPoint(root) {
        this._rootPoint = root;
    }
}
