/**
 * SatChooser
 *
 * Shows a small in-context dialog box so that a user can choose a
 * color.  The colors displayed are fully saturated colors, in the
 * HSL sense.  The idea is that the UI can take this saturated color
 * and lighten or darken it as needed by certain other UI elements.
 *
 * Define a function in your own code that get's passed to the
 * constructor.  This function will be called whenever the UI
 * element is triggered, and will be passed an arguments object.
 * You can add to that arguments object, but by default the two
 * properties 'colorobject' and 'colorstring' will exist.
*/
export default class SatChooser {
  constructor({
    pointerSize = 20,
    borderSize = 10,
    step = 51,
    width = 300,
    cellSize = 2,
    showSat = true,
    bhcID = 'satchooser',
    borderColor = 'rgb(191,191,191)',
    clickCallback = function(c) {
      console.log('Click callback function returned object: ' + JSON.stringify(c));
    },
  } = {}) {
    // console.log('SatChooser constructor');

    // Properties
    this.clickCallback = clickCallback;
    this.pointerSize = pointerSize;
    this.borderSize = borderSize;
    this.step = step;
    this.width = this.getDiscreetWidth(width);
    this.height = this.width + this.pointerSize + this.borderSize;
    this.showSat = showSat;
    this.bhcID = bhcID;
    this.borderColor = borderColor;
    this.clickCallbackArgs = {};
    this.cellSize = cellSize;
    this.screenx = -1000;
    this.screeny = -1000;

    // Setup Canvas
    this.can = document.createElement('canvas');
    this.can.style.backgroundColor = 'transparent';
    this.can.style.borderWidth = '0px';
    this.can.style.display = 'none';
    this.can.style.position = 'absolute';
    this.can.width = this.width;
    this.can.height = this.height;
    this.can.setAttribute('id', this.bhcID);
    this.ctx = this.can.getContext('2d');
    this.draw();
    this.imgData = this.ctx.getImageData(0, 0, this.can.width, this.can.height);
    this.can.onmouseout = function(e) {
      e.target.style.display = 'none';
    };
    this.can.onblur = function(e) {
      e.target.style.display = 'none';
    };
    const that = this;
    this.can.onclick = function(e) {
      const offsetX = e.offsetX || e.layerX;
      const offsetY = e.offsetY || e.layerY;
      // console.log('SatChooser.onclick');
      // console.log('\t x / y: ' + offsetX + ' / ' + offsetY);
      if ((offsetY < that.borderSize) ||
                (offsetY > that.height - that.borderSize - that.pointerSize) ||
                (offsetX < that.borderSize) ||
        (offsetX > that.width - that.borderSize)) {
        // console.log('\t border');
        return;
      }
      const ipx = ((Math.floor(e.offsetX - 1) * 4) + (Math.floor(e.offsetY - 1) * that.imgData.width * 4));
      const rx = that.imgData.data[ipx + 0];
      const gx = that.imgData.data[ipx + 1];
      const bx = that.imgData.data[ipx + 2];
      const rgbx = 'rgb(' + rx + ',' + gx + ',' + bx + ')';
      const reox = {r: rx, g: gx, b: bx};
      // console.log('\t ipx: ' + ipx + '\t = ' + rgbx);
      that.clickCallbackArgs.colorobject = reox;
      that.clickCallbackArgs.colorstring = rgbx;
      that.clickCallback(that.clickCallbackArgs);
    };
  }

  getDiscreetWidth(w) {
    // console.log('SatChooser.getDiscreetWidth');
    const numcells = (255 * 6 / this.step);
    this.cellSize = Math.round((w - (this.borderSize * 2)) / numcells);
    const rw = ((this.cellSize * numcells) + (this.borderSize * 2));
    // console.log('\t passed: ' + w + ' returns ' + rw + '\t numcells: ' + numcells + ' cellsize: ' + this.cellSize + ' step: ' + this.step);
    return rw;
  }

  show(pv) {
    // console.log('SatChooser.show');
    // console.log('\t passed: ');
    // console.log(pv.elem);
    document.body.appendChild(this.can);
    this.clickCallbackArgs = pv.args || {};
    const cs = this.can.style;
    const hw = (this.width / 2);
    const offset = getOffset(pv.elem);
    function getOffset(obj) {
      const total = obj.offsetParent ? getOffset(obj.offsetParent) : {'offsetTop': 0, 'offsetLeft': 0};
      total.offsetTop += obj.offsetTop;
      total.offsetLeft += obj.offsetLeft;
      return total;
    }
    // console.log('\t final offset: ' + JSON.stringify(offset));
    this.screeny = (offset.offsetTop - this.height);
    this.screenx = (offset.offsetLeft - hw + (pv.elem.offsetWidth / 2));
    cs.display = 'none';
    cs.top = (this.screeny + 'px');
    cs.left = (this.screenx + 'px');
    // console.log('\t top / left: ' + cs.top + ' / ' + cs.left);
    // Move & Show Chooser
    cs.display = 'block';
  }

  hide() {
    this.can.style.display = 'none';
  }

  draw() {
    // console.log('SatChooser.draw');
    const x = this.ctx;
    const fw = this.width;
    const hw = (this.width / 2);
    const ps = this.pointerSize;
    const fh = this.height;
    const bs = this.borderSize;
    // draw bubble
    x.beginPath();
    x.moveTo(0, 0);
    x.lineTo(fw, 0);
    x.lineTo(fw, (fh - ps));
    x.lineTo((hw + ps), (fh - ps));
    x.lineTo(hw, fh);
    x.lineTo((hw - ps), (fh - ps));
    x.lineTo(0, (fh - ps));
    x.closePath();
    x.fillStyle = this.borderColor;
    x.fill();
    // draw base hues
    let colx = bs;
    let color = {};
    const step = this.step;
    const numcol = (255 * 6 / step);
    const colw = Math.round((fw - (bs * 2)) / numcol);
    // Red to RedGreen
    for (let i = 0; i < (256 - step); i += step) {
      color = {r: 255, g: i, b: 0};
      drawOneColumn();
      colx += colw;
    }
    // RedGreen to Green
    for (let rg = 255; rg >= step; rg -= step) {
      color = {r: rg, g: 255, b: 0};
      drawOneColumn();
      colx += colw;
    }
    // Green to BlueGreen
    for (let g = 0; g < (256 - step); g += step) {
      color = {r: 0, g: 255, b: g};
      drawOneColumn();
      colx += colw;
    }
    // BlueGreen to Blue
    for (let bg = 255; bg >= step; bg -= step) {
      color = {r: 0, g: bg, b: 255};
      drawOneColumn();
      colx += colw;
    }
    // Blue to BlueRed
    for (let b = 0; b < (256 - step); b += step) {
      color = {r: b, g: 0, b: 255};
      drawOneColumn();
      colx += colw;
    }
    // BlueRed to Red
    for (let br = 255; br >= step; br -= step) {
      color = {r: 255, g: 0, b: br};
      drawOneColumn();
      colx += colw;
    }
    function drawOneColumn() {
      const rstep = (127 - color.r) / numcol;
      const gstep = (127 - color.g) / numcol;
      const bstep = (127 - color.b) / numcol;
      for (let i = 0; i <= numcol; i++) {
        const tr = rgbSan(color.r + (i * rstep));
        const tg = rgbSan(color.g + (i * gstep));
        const tb = rgbSan(color.b + (i * bstep));
        x.fillStyle = 'rgb(' + tr + ',' + tg + ',' + tb + ')';
        x.strokeStyle = x.fillStyle;
        // x.strokeWidth = .5;
        x.fillRect(colx, (bs + (i * colw)), colw, colw);
        // x.stroke();
      }
    }
    function rgbSan(num) {
      return Math.max(0, Math.min(255, Math.round(num)));
    }
  }
}
