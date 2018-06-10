
/**
    Guide
    An object used by the UI for drawing guide
    lines on the edit canvas, and for saving
    custom guides to a Glyphr Studio Project.
**/


    function Guide(oa) {
        this.objtype = 'guide';

        this.type = oa.type || 'vertical';
        this.name = oa.name || (this.type + ' guide');
        this.location = isVal(oa.location)? oa.location : 200;
        this.angle = oa.angle || false;
        this.color = oa.color || makeRandomSaturatedColor();
        this.visible = isVal(oa.visible)? oa.visible : true;
        this.showname = isVal(oa.showname)? oa.showname : true;
        this.editable = isVal(oa.editable)? oa.editable : true;
    }

    Guide.prototype.draw = function(delta) {
        // debug('\nGuide.draw \t START');
        // debug('\t name: ' + this.name);
        // debug('\t delta: ' + delta);
        if (!this.visible) return;

        delta = delta*1;
        let ctx = _UI.glyphEditCTX;
        let cansize = _UI.glyphEditCanvasSize;
        let psc = _GP.projectsettings.colors;
        let v = getView('guide');
        let start = {x: 0, y: 0};
        let end = {x: 0, y: 0};
        let label = {x: 0, y: 0};
        let pad = 5;
        let pos;

        // debug('\t view: ' + JSON.stringify(v));
        // debug('\t location: ' + this.location);

        if (this.type === 'horizontal') {
            pos = makeCrisp(v.dy - (this.location*v.dz));
            if (delta) pos += (delta*v.dz);
            start.x = 0;
            start.y = pos;
            end.x = cansize;
            end.y = pos;
            label.x = 25;
            label.y = pos - pad;
        } else if (this.type === 'vertical') {
            pos = makeCrisp(v.dx - (this.location*v.dz*-1));
            if (delta) pos += (delta*v.dz);
            start.x = pos;
            start.y = 0;
            end.x = pos;
            end.y = cansize;
            label.x = pos + pad;
            label.y = 11;
        }

        let alpha = transparencyToAlpha(this.editable? psc.customguidetransparency : psc.systemguidetransparency);
        let color = RGBAtoRGB(this.color, alpha);

        if (color !== 'rgb(255,255,255)') {
            // Draw Line
            // debug('\t start: ' + JSON.stringify(start) + ' / end: ' + JSON.stringify(end));
            ctx.strokeStyle = color;
            ctx.globalAlpha = 1;
            ctx.lineWidth = 1;
            if (isVal(delta)) ctx.strokeStyle = shiftColor(color, 0.6, true);
            ctx.beginPath();
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();
            ctx.closePath();

            // Draw Label
            if (this.showname && _UI.showGuidesLabels && !delta) {
                _UI.glyphEditCTX.fillStyle = color;
                _UI.glyphEditCTX.font = '10px tahoma, verdana, sans-serif';
                _UI.glyphEditCTX.fillText(this.name, label.x, label.y);
            }
        }

        // debug('Guide.draw \t END\n');
    };

    function makeRandomSaturatedColor() {
        let sat = Math.floor(Math.random()*5)*51;
        let arr = [];
        let satloc = Math.floor(Math.random()*3);
        arr[satloc] = sat;
        switch (satloc) {
            case 0:
                arr[1] = 0;
                arr[2] = 255;
                break;
            case 1:
                arr[0] = 0;
                arr[2] = 255;
                break;
            case 2:
                arr[0] = 255;
                arr[1] = 0;
                break;
        }
        return 'rgb('+arr[0]+','+arr[1]+','+arr[2]+')';
    }
