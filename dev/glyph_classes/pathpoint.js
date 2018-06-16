/* exported makePathPointFromSegments */

/**
 * Path Point
 * A collection of these units make up a Path,
 * they have position and handles (or control
 * points). There are a few Path Point types, and
 * individual handles can be shown or hidden.
 */
class PathPoint {
    /**
     * Create a PathPoint
     * @param {Coord} p - Main control point
     * @param {Coord} h1 - First handle
     * @param {Coord} h2 - Second handle
     * @param {Coord} q - Storing the Quadratic handle point from Import SVG action
     * @param {string} type - corner, flat, or symmetric
     */
    constructor({
        p = {x: 100, y: 100},
        h1 = {point: {x: 0, y: 0}},
        h2 = {point: {x: 200, y: 200}},
        type = 'corner',
        q = false,
        parentPath = false,
    } = {}) {
        this._p = new Coord(p);
        this._h1 = new Handle(h1);
        this._h2 = new Handle(h2);
        this.type = type; // use setter for validation
        this._parentPath = parentPath;

        this._h1.rootPoint = this;
        this._h2.rootPoint = this;

        if (q) this._q = q;
    }

    /**
     * Export object to project file
     * @return {object}
     */
    save() {
        let re = {
            p: this.p.save(),
            h1: this.h1.save(),
            h2: this.h2.save(),
            type: this.type,
        };

        if (this.q) re.q = this.q;

        return re;
    }


    // -------------------------------------------------------
    // GETTERS
    // -------------------------------------------------------

    /**
     * Get the main point
     * @return {Coord}
     */
    get p() {
        return this._p;
    }

    /**
     * Get the first handle
     * @return {Coord}
     */
    get h1() {
        return this._h1;
    }

    /**
     * Get the second handle
     * @return {Coord}
     */
    get h2() {
        return this._h2;
    }

    /**
     * Get a point's type
     * @return {string} type - symmetric / flat / corner
     */
    get type() {
        return this._type;
    }

    /**
     * Get a point's parent path
     * @return {Path}
     */
    get parentPath() {
        return this._parentPath;
    }

    /**
     * Figure out where this point is in the overall path
     * @return {number}
    */
    get pointNumber() {
        if (!this._parentPath) return false;

        let pp = this._parentPath.pathPoints;
        if (!pp) return false;

        for (let p=0; p<pp.length; p++) {
            if (pp[p] === this) return p;
        }

        return false;
    }


    // -------------------------------------------------------
    // SETTERS
    // -------------------------------------------------------

    /**
     * Change a point's type
     * @param {string} type - symmetric / flat / corner
     */
    set type(type) {
        if (type === 'symmetric') this.makeSymmetric();
        else if (type === 'flat') this.makeFlat();
        else this._type = 'corner';
    }


    // -------------------------------------------------------
    // METHODS
    // -------------------------------------------------------

    /**
     * Checks to see if there is a control point where the mouse is
     * @param {number} x - mouse x possition
     * @param {number} y - mouse y possition
     * @param {boolean} nohandles - Eliminates checking for handles in multi-select situations
     * @return {object}
     */
    isOverControlPoint(x, y, nohandles) {
        let hp = 1;
        if (_GP.projectSettings) hp = _GP.projectSettings.pointsize/getView('Path.isOverControlPoint').dz;

        if ( ((this.p.x+hp) > x) && ((this.p.x-hp) < x) && ((this.p.y+hp) > y) && ((this.p.y-hp) < y) ) {
            // debug('PathPoint.isOverControlPoint - Returning P1');

            return {point: this, type: 'p'};
        }

        if (this.h1.use && !nohandles) {
            if ( ((this.h1.x+hp) > x) && ((this.h1.x-hp) < x) && ((this.h1.y+hp) > y) && ((this.h1.y-hp) < y) ) {
                // debug('PathPoint.isOverControlPoint - Returning h1');
                return {point: this, type: 'h1'};
            }
        }

        if (this.h2.use && !nohandles) {
            if ( ((this.h2.x+hp) > x) && ((this.h2.x-hp) < x) && ((this.h2.y+hp) > y) && ((this.h2.y-hp) < y) ) {
                // debug('PathPoint.isOverControlPoint - Returning h2');
                return {point: this, type: 'h2'};
            }
        }

        return false;
    }

    /**
     * Moves one handle to be symmetrical with the other
     * @param {string} hold - Handle to not move while making symmetric
     * @return {PathPoint}
     */
    makeSymmetric(hold) {
        // debug('MAKESYMETRIC - hold ' + hold + ' starts as ' + JSON.stringify(this));

        if (!hold) {
            hold = this.h1.use? 'h1' : 'h2';
            if (!(this.h1.use || this.h2.use)) {
                if ( ((this.h2.x+this.p.x+this.h1.x)/3 === this.p.x) &&
                    ((this.h2.y+this.p.y+this.h1.y)/3 === this.p.y) ) {
                    // Handles and points are all in the same place
                    this.h2.x-=200;
                    this.h1.x+=200;
                    this.h1.use = true;
                    this.h2.use = true;
                    return;
                }
            }
        }

        switch (hold) {
            case 'h1':
                this.h2.x = ((this.p.x - this.h1.x) + this.p.x);
                this.h2.y = ((this.p.y - this.h1.y) + this.p.y);
                break;
            case 'h2':
                this.h1.x = ((this.p.x - this.h2.x) + this.p.x);
                this.h1.y = ((this.p.y - this.h2.y) + this.p.y);
                break;
        }

        this._type = 'symmetric';
        this.h1.use = true;
        this.h2.use = true;

        // this.roundAll();
        // debug('MAKESYMETRIC - returns ' + JSON.stringify(this));

        return this;
    }

    /**
     * Moves one handle to be inline with the other, while maintaining handle length
     * @param {string} hold - handle to not move
     * @return {PathPoint}
     */
    makeFlat(hold) {
        // debug('\n PathPoint.makeFlat - START');
        // debug('\t hold passed ' + hold);

        if (this.isFlat()) {
            this._type = 'flat';
            return;
        }

        if (!hold) {
            hold = this.h1.use? 'h1' : 'h2';
            if (!(this.h1.use || this.h2.use)) {
                if ( ((this.h2.x+this.p.x+this.h1.x)/3 === this.p.x) &&
                    ((this.h2.y+this.p.y+this.h1.y)/3 === this.p.y) ) {
                    // Handles and points are all in the same place
                    this.h2.x-=300;
                    this.h1.x+=100;
                    this.h1.use = true;
                    this.h2.use = true;
                    return;
                }
            }
        }

        let angle1 = this.h1.angle;
        let angle2 = this.h2.angle;
        let hyp1 = this.h1.length;
        let hyp2 = this.h2.length;

        // new values
        let newHx;
        let newHy;
        let newadj;
        let newopp;

        if (hold === 'h1') {
            // get new x and y for h2
            newadj = Math.cos(angle1) * hyp2;
            newopp = Math.tan(angle1) * newadj;

            // Set values
            newHx = (this.p.x + (newadj*-1));
            newHy = (this.p.y + (newopp*-1));

            if (!isNaN(newHx) && !isNaN(newHy)) {
                this.h2.x = newHx;
                this.h2.y = newHy;
            }
        } else if (hold === 'h2') {
            // get new x and y for h2
            newadj = Math.cos(angle2) * hyp1;
            newopp = Math.tan(angle2) * newadj;

            // Set values
            newHx = (this.p.x + (newadj*-1));
            newHy = (this.p.y + (newopp*-1));

            if (!isNaN(newHx) && !isNaN(newHy)) {
                this.h1.x = newHx;
                this.h1.y = newHy;
            }
        }

        this._type = 'flat';

        // debug(' PathPoint.makeFlat - END\n');

        return this;
    }

    /**
     * Checks to see if two handles are flat
     * @return {boolean}
     * */
    isFlat() {
        if (this.p.x === this.h1.x && this.p.x === this.h2.x) return true;
        if (this.p.y === this.h1.y && this.p.y === this.h2.y) return true;

        let a1 = this.h1.angle;
        let a2 = this.h2.angle;
        // debug('\t comparing ' + a1 + ' / ' + a2);

        return (round((Math.abs(a1) + Math.abs(a2)), 2) === 3.14);
    }

    /**
     * Figures out what type a point is based on handle possitions
     * @return {string}
     */
    resolvePointType() {
        // debug('\n PathPoint.resolvePointType - START');

        if (this.isFlat()) {
            if (this.h1.length === this.h2.length) {
                // debug('\t resolvePointType - setting to Symmetric');
                this._type = 'symmetric';
            } else {
                // debug('\t resolvePointType - setting to Flat');
                this._type = 'flat';
            }
        } else {
            // debug('\t resolvePointType - setting to Corner');
            this._type = 'corner';
        }

        return this.type;
        // debug(' pathPoint.resolvePointType - END\n');
    }

    /**
     * Makes handles pointed at a specific coordinate
     * @param {number} px - X value to point at
     * @param {number} py - Y value to point at
     * @param {number} length - Length the handle should end up
     * @param {string} handle - Which handle to move
     * @param {boolean} dontresolvetype - After updating, skip auto-resolving the point type
     * @return {PathPoint}
     */
    makePointedTo(px, py, length = false, handle = 'h2', dontresolvetype = false) {
        // figure out angle
        let adj1 = this.p.x-px;
        let opp1 = this.p.y-py;

        let ymod = (opp1 >= 0)? -1 : 1;
        let xmod = -1;

        let hyp1 = Math.sqrt( (adj1*adj1) + (opp1*opp1) );
        let angle1 = Math.acos(adj1 / hyp1);

        length = length || (hyp1/3);

        // debug('MAKEPOINTEDTO - x/y/l ' + px + ' ' + py + ' ' + length + ' - Before H1x/y ' + this.h1.x + ' ' + this.h1.y);
        this[handle].x = this.p.x + (Math.cos(angle1) * length * xmod);
        this[handle].y = this.p.y + (Math.sin(angle1) * length * ymod);
        // debug('MAKEPOINTEDTO - after H1x/y ' + this.h1.x + ' ' + this.h1.y);

        if (!dontresolvetype) {
            if (this.type === 'corner') this.makeFlat(handle);
            else this.makeSymmetric(handle);
            // debug('MAKEPOINTEDTO - after makesymmetric H1x/y ' + this.h1.x + ' ' + this.h1.y);
        }

        return this;
    }

    /**
     * Rotate Point and Handles around a center of rotation
     * @param {number} angle - How far to rotate
     * @param {object} about - x/y coordinate center of rotation
     * @return {PathPoint}
     */
    rotate(angle, about) {
        // debug('\n PathPoint.rotate - START');
        rotate(this.p, angle, about);
        rotate(this.h1, angle, about);
        rotate(this.h2, angle, about);
        // debug('\t this.p ' + json(this.p, true));
        // debug(' PathPoint.rotate - END\n');

        return this;
    }

    /**
     * Resets handles to defaults
     * @return {PathPoint}
     */
    resetHandles() {
        this.type = 'corner';
        this.h1.use = true;
        this.h2.use = true;
        this.h2.x = this.p.x - 100;
        this.h2.y = this.p.y;
        this.h1.x = this.p.x + 100;
        this.h1.y = this.p.y;

        return this;
    }

    /**
     * Rounds all the Point and Handle data to a precision
     * @param {number} i - precision
     * @return {PathPoint}
     */
    roundAll(i = 9) {
        this.p.x = round(this.p.x, i);
        this.p.y = round(this.p.y, i);
        this.h1.x = round(this.h1.x, i);
        this.h1.y = round(this.h1.y, i);
        this.h2.x = round(this.h2.x, i);
        this.h2.y = round(this.h2.y, i);

        return this;
    }


    // -------------------------------------------------------
    // DRAW
    // -------------------------------------------------------

    /**
     * Draws this point on the edit canvas
     * @param {string} accent - accent color
     */
    drawPoint(accent) {
        // debug('\n PathPoint.drawPoint - START');
        // debug('\t sel = ' + _UI.multiSelect.points.isSelected(this));

        accent = accent || _UI.colors.blue;
        let ps = _GP.projectSettings.pointsize;
        let hp = ps/2;
        // _UI.glyphEditCTX.fillStyle = sel? 'white' : accent.l65;
        _UI.glyphEditCTX.fillStyle = _UI.multiSelect.points.isSelected(this)? 'white' : accent.l65;
        _UI.glyphEditCTX.strokeStyle = accent.l65;
        _UI.glyphEditCTX.font = '10px Consolas';

        _UI.glyphEditCTX.fillRect((sx_cx(this.p.x)-hp), (sy_cy(this.p.y)-hp), ps, ps);
        _UI.glyphEditCTX.strokeRect((sx_cx(this.p.x)-hp), (sy_cy(this.p.y)-hp), ps, ps);

        _UI.glyphEditCTX.fillStyle = accent.l65;
        _UI.glyphEditCTX.fillText(this.pointNumber, sx_cx(this.p.x + 12), sy_cy(this.p.y));
        // debug(' PathPoint.drawPoint - END\n');
    }

    /**
     * Draws a point with an arrow to show path winding
     * @param {string} accent - accent color
     * @param {Point} next - next Point in the path sequence
     */
    drawDirectionalityPoint(accent, next) {
        accent = accent || _UI.colors.blue;
        // _UI.glyphEditCTX.fillStyle = sel? 'white' : accent.l65;
        _UI.glyphEditCTX.fillStyle = _UI.multiSelect.points.isSelected(this)? 'white' : accent.l65;
        _UI.glyphEditCTX.strokeStyle = accent.l65;
        _UI.glyphEditCTX.lineWidth = 1;
        let begin = {'x': this.p.x, 'y': this.p.y};
        let end = {'x': this.h2.x, 'y': this.h2.y};

        if (!this.h2.use) {
            end = {'x': next.p.x, 'y': next.p.y};
        }

        let ps = (_GP.projectSettings.pointsize*0.5);
        let arrow = [
            [(ps*3), 0],
            [ps, ps],
            [-ps, ps],
            [-ps, -ps],
            [ps, -ps],
        ];
        let rotatedarrow = [];
        let ang = (Math.atan2((end.y-begin.y), (end.x-begin.x))*-1);

        // FAILURE CASE FALLBACK
        if (!ang && ang !== 0) {
            ang = (this.p.x > this.h2.x)? Math.PI : 0;
        }

        for (let a in arrow) {
            if (arrow.hasOwnProperty(a)) {
                rotatedarrow.push([
                    ((arrow[a][0] * Math.cos(ang)) - (arrow[a][1] * Math.sin(ang))),
                    ((arrow[a][0] * Math.sin(ang)) + (arrow[a][1] * Math.cos(ang))),
                ]);
            }
        }

        // debug('DRAWPOINT arrow = ' + JSON.stringify(arrow) + '  - rotatedarrow = ' + JSON.stringify(rotatedarrow));

        _UI.glyphEditCTX.beginPath();
        _UI.glyphEditCTX.moveTo((rotatedarrow[0][0] + sx_cx(this.p.x)), (rotatedarrow[0][1] + sy_cy(this.p.y)));

        for (let p in rotatedarrow) {
            if (p > 0) {
                _UI.glyphEditCTX.lineTo((rotatedarrow[p][0] + sx_cx(this.p.x)), (rotatedarrow[p][1] + sy_cy(this.p.y)));
            }
        }

        _UI.glyphEditCTX.lineTo((rotatedarrow[0][0] + sx_cx(this.p.x)), (rotatedarrow[0][1] + sy_cy(this.p.y)));
        _UI.glyphEditCTX.fill();
        _UI.glyphEditCTX.stroke();

        // Exact Middle Point
        _UI.glyphEditCTX.fillStyle = accent.l65;
        _UI.glyphEditCTX.fillRect(makeCrisp(sx_cx(this.p.x)), makeCrisp(sy_cy(this.p.y)), 1, 1);
    }

    /**
     * Draws the handles on the edit canvas
     * @param {boolean} drawH1 - draw the first handle
     * @param {boolean} drawH2 - draw the second handle
     * @param {string} accent - accent color
     */
    drawHandles(drawH1, drawH2, accent) {
        accent = accent || _UI.colors.blue;
        _UI.glyphEditCTX.fillStyle = accent.l65;
        _UI.glyphEditCTX.strokeStyle = accent.l65;
        _UI.glyphEditCTX.lineWidth = 1;
        _UI.glyphEditCTX.font = '10px Consolas';


        let hp = _GP.projectSettings.pointsize/2;

        if (drawH1 && this.h1.use) {
            _UI.glyphEditCTX.beginPath();
            _UI.glyphEditCTX.arc(sx_cx(this.h1.x), sy_cy(this.h1.y), hp, 0, Math.PI*2, true);
            _UI.glyphEditCTX.closePath();
            _UI.glyphEditCTX.fill();

            _UI.glyphEditCTX.beginPath();
            _UI.glyphEditCTX.moveTo(sx_cx(this.p.x), sy_cy(this.p.y));
            _UI.glyphEditCTX.lineTo(sx_cx(this.h1.x), sy_cy(this.h1.y));
            _UI.glyphEditCTX.closePath();
            _UI.glyphEditCTX.stroke();
            _UI.glyphEditCTX.fillText('1', sx_cx(this.h1.x + 12), sy_cy(this.h1.y));
        }

        if (drawH2 && this.h2.use) {
            _UI.glyphEditCTX.beginPath();
            _UI.glyphEditCTX.arc(sx_cx(this.h2.x), sy_cy(this.h2.y), hp, 0, Math.PI*2, true);
            _UI.glyphEditCTX.closePath();
            _UI.glyphEditCTX.fill();

            _UI.glyphEditCTX.beginPath();
            _UI.glyphEditCTX.moveTo(sx_cx(this.p.x), sy_cy(this.p.y));
            _UI.glyphEditCTX.lineTo(sx_cx(this.h2.x), sy_cy(this.h2.y));
            _UI.glyphEditCTX.closePath();
            _UI.glyphEditCTX.stroke();
            _UI.glyphEditCTX.fillText('2', sx_cx(this.h2.x + 12), sy_cy(this.h2.y));
        }
    }

    /**
     * Draws a Quadratic point to the edit canvas
     * @param {Point} prevP - Previous point in the path sequence
     */
    drawQuadraticHandle(prevP) {
        // Draw Quadratic handle point from imported SVG
        _UI.glyphEditCTX.fillStyle = _UI.colors.error.medium;
        _UI.glyphEditCTX.strokeStyle = _UI.colors.error.medium;
        _UI.glyphEditCTX.lineWidth = 1;
        let hp = _GP.projectSettings.pointsize/2;

        if (this.q) {
            _UI.glyphEditCTX.beginPath();
            _UI.glyphEditCTX.arc(sx_cx(this.q.x), sy_cy(this.q.y), hp, 0, Math.PI*2, true);
            _UI.glyphEditCTX.closePath();
            _UI.glyphEditCTX.fill();

            _UI.glyphEditCTX.beginPath();
            _UI.glyphEditCTX.moveTo(sx_cx(this.p.x), sy_cy(this.p.y));
            _UI.glyphEditCTX.lineTo(sx_cx(this.q.x), sy_cy(this.q.y));
            _UI.glyphEditCTX.closePath();
            _UI.glyphEditCTX.stroke();

            if (prevP) {
                _UI.glyphEditCTX.beginPath();
                _UI.glyphEditCTX.moveTo(sx_cx(prevP.x), sy_cy(prevP.y));
                _UI.glyphEditCTX.lineTo(sx_cx(this.q.x), sy_cy(this.q.y));
                _UI.glyphEditCTX.closePath();
                _UI.glyphEditCTX.stroke();
            }
        }
    }


    // -------------------------------------------------------
    // Alignment
    // -------------------------------------------------------

    /**
     * Align
     * @param {PathPoint} pathPoint - other point with which to align
     */
    alignY(pathPoint) {
        this.p.y = pathPoint.p.y;
        redraw({calledBy: 'pointDetails'});
    }

    /**
     * Align
     * @param {PathPoint} pathPoint - other point with which to align
     */
    alignX(pathPoint) {
        this.p.x = pathPoint.p.x;
        redraw({calledBy: 'pointDetails'});
    }

    /**
     * Align
     * @param {PathPoint} pathPoint - other point with which to align
     */
    alignHV() {
        this.h1.x = this.p.x;
        this.h2.x = this.p.x;
        redraw({calledBy: 'pointDetails'});
    }

    /**
     * Align
     * @param {PathPoint} pathPoint - other point with which to align
     */
    alignHH() {
        this.h1.y = this.p.y;
        this.h2.y = this.p.y;
        redraw({calledBy: 'pointDetails'});
    }

    /**
     * Align
     * @param {PathPoint} pathPoint - other point with which to align
     */
    alignH1X(pathPoint) {
        this.h1.x = pathPoint.h1.x;
        redraw({calledBy: 'pointDetails'});
    }

    /**
     * Align
     * @param {PathPoint} pathPoint - other point with which to align
     */
    alignH1XCross(pathPoint) {
        this.h1.x = pathPoint.h2.x;
        redraw({calledBy: 'pointDetails'});
    }

    /**
     * Align
     * @param {PathPoint} pathPoint - other point with which to align
     */
    alignH1Y(pathPoint) {
        this.h1.y = pathPoint.h1.y;
        redraw({calledBy: 'pointDetails'});
    }

    /**
     * Align
     * @param {PathPoint} pathPoint - other point with which to align
     */
    alignH1YCross(pathPoint) {
        this.h1.y = pathPoint.h2.y;
        redraw({calledBy: 'pointDetails'});
    }

    /**
     * Align
     * @param {PathPoint} pathPoint - other point with which to align
     */
    alignH2X(pathPoint) {
        this.h2.x = pathPoint.h2.x;
        redraw({calledBy: 'pointDetails'});
    }

    /**
     * Align
     * @param {PathPoint} pathPoint - other point with which to align
     */
    alignH2XCross(pathPoint) {
        this.h2.x = pathPoint.h1.x;
        redraw({calledBy: 'pointDetails'});
    }

    /**
     * Align
     * @param {PathPoint} pathPoint - other point with which to align
     */
    alignH2Y(pathPoint) {
        this.h2.y = pathPoint.h2.y;
        redraw({calledBy: 'pointDetails'});
    }

    /**
     * Align
     * @param {PathPoint} pathPoint - other point with which to align
     */
    alignH2YCross(pathPoint) {
        this.h2.y = pathPoint.h1.y;
        redraw({calledBy: 'pointDetails'});
    }

    /**
     * Align
     * @param {PathPoint} pathPoint - other point with which to align
     */
    alignHY(pathPoint) {
        this.alignH1Y(pathPoint);
        this.alignH2Y(pathPoint);
    }

    /**
     * Align
     * @param {PathPoint} pathPoint - other point with which to align
     */
    alignHYCross(pathPoint) {
        this.alignH1YCross(pathPoint);
        this.alignH2YCross(pathPoint);
    }

    /**
     * Align
     * @param {PathPoint} pathPoint - other point with which to align
     */
    alignHXCross(pathPoint) {
        this.alignH1XCross(pathPoint);
        this.alignH2XCross(pathPoint);
    }

    /**
     * Align
     * @param {PathPoint} pathPoint - other point with which to align
     */
    alignHX(pathPoint) {
        this.alignH1X(pathPoint);
        this.alignH2X(pathPoint);
    }

    /**
     * Align
     * @param {PathPoint} pathPoint - other point with which to align
     */
    alignH1(pathPoint) {
        this.alignH1X(pathPoint);
        this.alignH1Y(pathPoint);
    }

    /**
     * Align
     * @param {PathPoint} pathPoint - other point with which to align
     */
    alignH2(pathPoint) {
        this.alignH2X(pathPoint);
        this.alignH2Y(pathPoint);
    }

    /**
     * Find the offset between two points
     * @param {PathPoint} pathPoint - other point with which to align
     * @return {number}
     */
    getMutualOffset(pathPoint) {
        if (this.p.x === pathPoint.p.x) {
            return Math.abs(this.p.y - pathPoint.p.y);
        } else if (this.p.y === pathPoint.p.y) {
            return Math.abs(this.p.x - pathPoint.p.x);
        } else {
            let dX = Math.abs(this.p.x - pathPoint.p.x);
            let dY = Math.abs(this.p.y - pathPoint.p.y);
            return Math.sqrt(Math.abs(dX^2 + dY^2));
        }
    }

    /**
     * Align by Mutual Offset
     * @param {number} p1 - first point
     * @param {number} p2 - second point
     * @param {number} p3 - third point
     */
    alignMutualOffsetXY(p1, p2, p3) {
        this.alignMutualOffsetY(p1, p2, p3);
        this.alignMutualOffsetX(p1, p2, p3);

        redraw({calledBy: 'pointDetails'});
    }

    /**
     * Align by Mutual Offset X
     * @param {number} p1 - first point
     * @param {number} p2 - second point
     * @param {number} p3 - third point
     */
    alignMutualOffsetX(p1, p2, p3) {
        let dRef = Math.abs(p1.p.x - p2.p.x);
        let dCur = Math.abs(this.p.x - (p3.p.x || p2.p.x ));
        let delta = dRef - dCur;

        if ((this.p.x > p3.p.x) || (this.p.x == p3.p.x)) this.p.x += delta;
        else if (this.p.x < p3.p.x) this.p.x -= delta;
        else if ((this.p.x > p2.p.x) || (this.p.x == p2.p.x)) this.p.x += delta;
        else if (this.p.x < p2.p.x) this.p.x -= delta;

        redraw({calledBy: 'pointDetails'});
    }

    /**
     * Align by Mutual Offset Y
     * @param {number} p1 - first point
     * @param {number} p2 - second point
     * @param {number} p3 - third point
     */
    alignMutualOffsetY(p1, p2, p3) {
        let dRef = Math.abs(p1.p.y - p2.p.y);
        let dCur = Math.abs(this.p.y - (p3.p.y || p2.p.y ));
        let delta = dRef - dCur;

        if ((this.p.y > p3.p.y) || (this.p.y == p3.p.y)) this.p.y += delta;
        else if (this.p.y < p3.p.y) this.p.y -= delta;
        else if ((this.p.y > p2.p.y) || (this.p.y == p2.p.y)) this.p.y += delta;
        else if (this.p.y < p2.p.y) this.p.y -= delta;

        redraw({calledBy: 'pointDetails'});
    }
}


// -------------------------------------------------------
// HELPERS
// -------------------------------------------------------
/**
 * Creates a single Point from two segments
 * @param {Segment} seg1 - First segment
 * @param {Segment} seg2 - Second segment
 * @return {PathPoint}
 */
function makePathPointFromSegments(seg1, seg2) {
    let newpp = new PathPoint({
        h1: new Handle({point: {x: seg1.p3x, y: seg1.p3y}}),
        p: new Coord({x: seg2.p1x, y: seg2.p1y}),
        h2: new Handle({point: {x: seg2.p2x, y: seg2.p2y}}),
    });

    if (seg1.line || coordsAreEqual(newpp.h1, newpp.p)) newpp.h1.use = false;
    if (seg2.line || coordsAreEqual(newpp.h2, newpp.p)) newpp.h2.use = false;

    // newpp.resolvePointType();

    return newpp;
}
