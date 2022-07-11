import { makeRandomSaturatedColor } from '../../common/colors.js';
import { makeCrisp } from '../../common/functions.js';

/**
    Guide
    An object used by the UI for drawing guide
    lines on the edit canvas, and for saving
    custom guides to a Glyphr Studio Project.
**/
export default class Guide {
  constructor(oa) {
    this.objType = 'guide';
    this.type = oa.type || 'vertical';
    this.name = oa.name || this.type + ' guide';
    this.location = isVal(oa.location) ? oa.location : 200;
    this.angle = oa.angle || false;
    this.color = oa.color || makeRandomSaturatedColor();
    this.visible = isVal(oa.visible) ? oa.visible : true;
    this.showname = isVal(oa.showname) ? oa.showname : true;
    this.editable = isVal(oa.editable) ? oa.editable : true;
  }
  draw(delta) {
    // log('\nGuide.draw \t START');
    // log('name: ' + this.name);
    // log('delta: ' + delta);
    if (!this.visible) return;
    delta = delta * 1;
    let ctx = _UI.glyphEditCTX;
    let cansize = _UI.glyphEditCanvasSize;
    let psc = getCurrentProject().projectSettings.colors;
    let v = getView('guide');
    let start = { x: 0, y: 0 };
    let end = { x: 0, y: 0 };
    let label = { x: 0, y: 0 };
    let pad = 5;
    let pos;
    // log('view: ' + JSON.stringify(v));
    // log('location: ' + this.location);
    if (this.type === 'horizontal') {
      pos = makeCrisp(v.dy - this.location * v.dz);
      if (delta) pos += delta * v.dz;
      start.x = 0;
      start.y = pos;
      end.x = cansize;
      end.y = pos;
      label.x = 25;
      label.y = pos - pad;
    } else if (this.type === 'vertical') {
      pos = makeCrisp(v.dx - this.location * v.dz * -1);
      if (delta) pos += delta * v.dz;
      start.x = pos;
      start.y = 0;
      end.x = pos;
      end.y = cansize;
      label.x = pos + pad;
      label.y = 11;
    }
    let alpha = transparencyToAlpha(
      this.editable ? psc.customguidetransparency : psc.systemguidetransparency
    );
    let color = getColorFromRGBA(this.color, alpha);
    if (color !== 'rgb(255,255,255)') {
      // Draw Line
      // log('start: ' + JSON.stringify(start) + ' / end: ' + JSON.stringify(end));
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
    // log('Guide.draw', 'end');
  }
}
