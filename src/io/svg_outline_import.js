import XYPoint from './xy_point.js';
/**
  IO > Import > SVG Outlines
  Takes a set of XML and pulls out any path or
  shape data that could be converted into a
  Glyphr Studio shape.  Ignores lots of XML tags
  and attributes.
**/

function ioSVG_convertTagsToGlyph(svgdata) {
  // log('ioSVG_convertTagsToGlyph', 'start');

  const newshapes = [];
  let data = {};
  let shapecounter = 0;
  const error = false;
  const grabtags = ['path', 'rect', 'polyline', 'polygon', 'ellipse', 'circle'];
  let jsondata;

  try {
    jsondata = convertXMLtoJSON(svgdata);
  } catch (e) {
    if (e.message === 'XMLdoc.getElementsByTagName(...)[0] is undefined') {
      e.message =
        'No SVG Shape or Path Tags could be found.  Make sure the SVG code is in proper XML format.';
    }
    showErrorMessageBox(e.message);
    return;
  }

  const unsortedshapetags = ioSVG_getTags(jsondata, grabtags);
  const shapetags = {};

  // log('unsorted shapetags from imported XML: ');
  // log(unsortedshapetags);

  // get a sorted shapetags object
  for (let g = 0; g < grabtags.length; g++) shapetags[grabtags[g]] = [];
  for (let s = 0; s < unsortedshapetags.length; s++)
    shapetags[unsortedshapetags[s].name].push(unsortedshapetags[s]);

  // log('shapetags from imported XML: ');
  // log(shapetags);

  function pushShape(p, n) {
    shapecounter++;
    n = n + ' ' + shapecounter;
    newshapes.push(new Shape({ path: p, name: n }));
  }

  /*
      GET PATH TAGS
    */
  if (shapetags.path.length) {
    data = '';
    ppath = {};

    for (let p = 0; p < shapetags.path.length; p++) {
      // Compound Paths are treated as different Glyphr Shapes
      data = shapetags.path[p].attributes.d;
      data = cleanAndFormatPathPointData(data);

      for (let d = 0; d < data.length; d++) {
        if (data[d].length) {
          ppath = ioSVG_convertPathTag(data[d]);
          if (ppath.pathPoints.length) {
            pushShape(ppath, 'Path');
          }
        }
      }
    }
  }

  /*
      GET RECT TAGS
    */
  if (shapetags.rect.length) {
    data = {};
    let rectmaxes;
    let x;
    let y;
    let w;
    let h;

    for (let r = 0; r < shapetags.rect.length; r++) {
      data = shapetags.rect[r].attributes || {};
      x = data.x * 1 || 0;
      y = data.y * 1 || 0;
      w = data.width * 1 || 0;
      h = data.height * 1 || 0;

      if (!(w === 0 && h === 0)) {
        rectmaxes = {
          xMax: x + w,
          xMin: x,
          yMax: y + h,
          yMin: y,
        };

        pushShape(rectPathFromMaxes(rectmaxes), 'Rectangle');
      }
    }
  }

  /*
      GET POLYLINE OR POLYGON TAGS
    */
  let poly = shapetags.polygon;
  poly = poly.concat(shapetags.polyline);

  if (poly.length) {
    data = {};
    let pparr;
    let tcoord;
    let px;
    let py;

    for (let po = 0; po < poly.length; po++) {
      data = poly[po].attributes.points;
      data = cleanAndFormatPathPointData(data);
      data = data[0].split(',');

      // log('Polyline or Polygon data, cleaned & formatted:');
      // log(data);

      if (data.length) {
        pparr = [];

        for (let co = 0; co < data.length; co += 2) {
          px = data[co] || 0;
          py = data[co + 1] || 0;

          tcoord = new XYPoint(px, py);
          /*
           *
           * REFACTOR
           *
           */
          pparr.push({
            p: { coord: tcoord },
            h1: { coord: tcoord },
            h2: { coord: tcoord },
            useH1: false,
            useH2: false,
          });
        }

        pushShape(new Path({ pathPoints: pparr }), 'Polygon');
      }
    }
  }

  /*
      GET ELLIPSE OR CIRCLE TAGS
    */
  let elli = shapetags.circle;
  elli = elli.concat(shapetags.ellipse);

  if (elli.length) {
    data = {};
    let ellipsemaxes;
    let rx;
    let ry;
    let cx;
    let cy;

    for (let c = 0; c < elli.length; c++) {
      data = elli[c].attributes;
      rx = data.r * 1 || data.rx * 1 || 0;
      rx = Math.abs(rx);
      ry = data.r * 1 || data.ry * 1 || 0;
      ry = Math.abs(ry);
      cx = data.cx * 1 || 0;
      cy = data.cy * 1 || 0;

      if (!(rx === 0 && ry === 0)) {
        ellipsemaxes = {
          xMin: cx - rx,
          xMax: cx + rx,
          yMin: cy - ry,
          yMax: cy + ry,
        };

        pushShape(ovalPathFromMaxes(ellipsemaxes), 'Oval');
      }
    }
  }

  if (shapecounter === 0) {
    showErrorMessageBox(
      'Could not find any SVG tags to import.  Supported tagas are: &lt;path&gt;, &lt;rect&gt;, &lt;polygon&gt;, &lt;polyline&gt;, and &lt;ellipse&gt;.'
    );
    return;
  }

  if (error) {
    showErrorMessageBox(
      'A transform attribute was found.  It will be ignored, probably resulting in unexpected shape outlines.  Check the Import SVG section of the Help page.'
    );
  }

  const reglyph = new Glyph({ shapes: newshapes });
  reglyph.changed(true);

  // log(reglyph);

  // log('ioSVG_convertTagsToGlyph', 'end');
  return reglyph;
}

function cleanAndFormatPathPointData(data) {
  /*
            Takes a string representing input from a <path> tag's
            'd' attribute.

            Returns an array of strings.  Each array element
            representing one Glyphr Studio shape.  String will be
            comma separated Path Commands and Values

        */
  let returndata = [];

  // log('cleanAndFormatPathPointData', 'start');
  // log('dirty data\n\t ' + data);

  // Move commands for a path are treated as different Glyphr Shapes
  data = data.replace(/M/g, ',z,M');
  data = data.replace(/m/g, ',z,m');

  // Parse in the path data, comma separating everything
  data = data.replace(/(\s+)/g, ',');

  // Normalize Z end path command
  data = data.replace(/Z/gi, 'z');

  // Put commas between Path Commands and preceeding numbers
  let curr = 0;
  while (curr < data.length) {
    if (ioSVG_isPathCommand(data.charAt(curr))) {
      data =
        data.slice(0, curr) +
        ',' +
        data.charAt(curr) +
        ',' +
        data.slice(curr + 1);
      curr++;
    }
    if (curr > 1000000) {
      showErrorMessageBox(
        'SVG path data longer than a million points is super uncool.'
      );
      return;
    } else {
      curr++;
    }
  }

  // Clean up negative numbers, and scientific notation numbers
  data = data.replace(/e-/g, '~~~');
  data = data.replace(/-/g, ',-');
  data = data.replace(/~~~/g, 'e-');

  // Clean up  whitespace
  // if(data.charAt(0) === ' ') data = data.slice(1);
  data = data.replace(/(\s+)/g, '');

  // Clean up some commas
  data = data.replace(/,+/g, ',');
  if (data.charAt(0) === ',') data = data.slice(1);

  // Remove extra Z commands
  // log('2nd to last char ' + data.charAt(data.length-2));
  if (data.charAt(data.length - 2) === 'z') data = data.slice(0, -2);
  // if(data.substr(-2) === ',z') data = data.slice(0, -2);
  // if(data.substr(0, 3) === ',z,') data = data.slice(3);
  // log('first two chars are |' + data.substr(0,2) + '|');
  if (data.substring(0, 2) === 'z,') data = data.slice(2);

  // Clean up commas again
  data = data.replace(/,+/g, ',');
  if (data.charAt(data.length - 1) === ',') data = data.slice(0, -1);
  if (data.charAt(0) === ',') data = data.slice(1);

  // Check for 'double decimal' numbers
  data = data.split(',');
  let first = -1;
  let second = -1;
  let subsequence = '';

  data.forEach(function (v, i, a) {
    // Search for two instances of '.'
    // log('v: ' + v);
    first = v.indexOf('.');
    // log('first: ' + first);

    if (first > -1) {
      second = v.indexOf('.', first + 1);
      // log('second: ' + second);
      if (second > -1) {
        returndata.push(v.slice(0, second));
        subsequence = v.slice(second);
        // log('just the tail: ' + subsequence);
        subsequence = subsequence.replace(/\./g, ',0.');
        if (subsequence.charAt(0) === ',') subsequence = subsequence.slice(1);
        // log('added zeros: ' + subsequence);
        subsequence = subsequence.split(',');
        // log('subsequence: ' + subsequence);
        returndata = returndata.concat(subsequence);
      } else {
        // no two instances of '.'
        returndata.push(v);
      }
    } else {
      // no two instances of '.'
      returndata.push(v);
    }

    first = -1;
    second = -1;
    subsequence = '';
  });

  // Make into an array
  returndata = returndata.join(',');
  returndata = returndata.split(',z');

  // log('clean data\n\t ' + returndata);
  // log('cleanAndFormatPathPointData', 'end');

  return returndata;
}

function ioSVG_getTags(obj, grabtags) {
  // log('ioSVG_getTags \t Start');
  // log('grabtags: ' + JSON.stringify(grabtags));
  // log('passed obj: ');
  // log(obj);

  if (typeof grabtags === 'string') grabtags = [grabtags];
  let result = [];

  if (obj.content) {
    for (let c = 0; c < obj.content.length; c++) {
      result = result.concat(ioSVG_getTags(obj.content[c], grabtags));
    }
  } else {
    if (grabtags.indexOf(obj.name) > -1) {
      result = [obj];
    }
  }

  // log('ioSVG_getTags \t End \n');
  return result;
}

function ioSVG_getFirstTagInstance(obj, tagname) {
  // log('ioSVG_getFirstTagInstance', 'start');
  // log('finding ' + tagname + ' in:');
  // log(obj);

  if (tagname === obj.name) {
    // log('ioSVG_getFirstTagInstance - tagname === obj.name', 'end');
    return obj;
  } else if (obj.content) {
    for (let c = 0; c < obj.content.length; c++) {
      const sub = ioSVG_getFirstTagInstance(obj.content[c], tagname);
      if (sub) {
        // log('ioSVG_getFirstTagInstance - looked through obj and found it', 'end');
        return sub;
      }
    }
  } else {
    // log('ioSVG_getFirstTagInstance - NO obj.content FOUND', 'end');
    return false;
  }
}

function ioSVG_convertPathTag(data) {
  // log('ioSVG_convertPathTag', 'start');
  // log('passed data ' + data);

  // Parse comma separated data into commands / data chunks
  data = data.split(',');
  const chunkarr = [];
  let commandpos = 0;
  let command;
  let dataarr = [];
  curr = 1;

  while (curr <= data.length) {
    if (ioSVG_isPathCommand(data[curr])) {
      dataarr = data.slice(commandpos + 1, curr);
      command = data[commandpos];

      for (let i = 0; i < dataarr.length; i++) dataarr[i] = Number(dataarr[i]);

      // log('Handling command ' + command);
      // log('With data ' + dataarr);

      chunkarr.push({ command: command, data: dataarr });
      commandpos = curr;
    }
    curr++;
  }

  // Fencepost
  dataarr = data.slice(commandpos + 1, curr);
  command = data[commandpos];
  for (let j = 0; j < dataarr.length; j++) dataarr[j] = Number(dataarr[j]);
  // log('FENCEPOST');
  // log('Handling command ' + command);
  // log('With data ' + dataarr);
  chunkarr.push({ command: command, data: dataarr });

  // log('chunkarr data is \n' + json(chunkarr, true));

  // Turn the commands and data into Glyphr objects
  let patharr = [];
  for (let c = 0; c < chunkarr.length; c++) {
    // log('\n\t Path Chunk ' + c);
    // log('' + chunkarr[c].command + ' : ' + chunkarr[c].data);
    if (chunkarr[c].command) {
      patharr = ioSVG_handlePathChunk(
        chunkarr[c],
        patharr,
        c === chunkarr.length - 1
      );
    }
  }

  // Combine 1st and last point
  const fp = patharr[0];
  const lp = patharr[patharr.length - 1];
  if (fp.p.x === lp.p.x && fp.p.y === lp.p.y) {
    // log('fp/lp same:\nFirst Point: '+json(fp)+'\nLast Point:  '+json(lp));
    fp.h1.x = lp.h1.x;
    fp.h1.y = lp.h1.y;
    fp.h1.use = lp.h1.use;
    patharr.pop();
    fp.resolvePointType();
    // log('AFTER:\nFirst Point: '+json(fp));
  }

  const newPath = new Path({ pathPoints: patharr });
  newPath.validate('IMPORTSVG');

  // log('unscaled path:');
  // log(newPath);
  // log('ioSVG_convertTag', 'end');
  return newPath;
}

function ioSVG_isPathCommand(c) {
  if ('MmLlCcSsZzHhVvAaQqTt'.indexOf(c) > -1) return c;
  return false;
}

function ioSVG_handlePathChunk(chunk, patharr, islastpoint) {
  // log('ioSVG_handlePathChunk', 'start');
  // log('chunk: ' + json(chunk, true));

  const cmd = chunk.command;
  let currdata = [];
  const iscmd = function (str) {
    return str.indexOf(cmd) > -1;
  };
  let p;
  let nx;
  let ny;
  let h1;
  /*
   *
   * REFACTOR
   *
   */
  let lastpoint = patharr[patharr.length - 1] || new PathPoint();
  let prevx;
  let prevy;

  // log('previous point: \t'+lastpoint.p.x+','+lastpoint.p.y);

  /*
            Path Instructions: Capital is absolute, lowercase is relative
            M m        MoveTo
            L l        LineTo
            H h        Horizontal Line
            V v        Vertical Line
            C c        Bezier (can be chained)
            S s        Smooth Bezier
            Q q        Quadratic Bezier (can be chained)
            T t        Smooth Quadratic
            Z z        Close Path

            Partially supported, just draw a line to the end point
            A a        ArcTo
        */

  if (iscmd('MmLlHhVv')) {
    // ABSOLUTE line methods
    // relative line methods

    nx = lastpoint.p.x;
    ny = lastpoint.p.y;

    while (chunk.data.length) {
      // Grab the next chunk of data and make sure it's length=2
      currdata = [];
      currdata = chunk.data.splice(0, 2);

      if (currdata.length % 2 !== 0 && iscmd('MmLl')) {
        showErrorMessageBox(
          'Move or Line path command (M, m, L, l) was expecting 2 arguments, was passed [' +
            currdata +
            ']\n<br>Failing "gracefully" by filling in default data.'
        );
        while (currdata.length < 2) {
          currdata.push(currdata[currdata.length - 1] + 100);
        }
      }
      // log('\n\t command ' + cmd + ' while loop data ' + currdata);

      prevx = lastpoint.p.x;
      prevy = lastpoint.p.y;

      switch (cmd) {
        case 'L':
        case 'M':
          // ABSOLUTE line to
          // ABSOLUTE move to
          nx = currdata[0];
          ny = currdata[1];
          break;
        case 'l':
        case 'm':
          // relative line to
          // relative move to
          nx = currdata[0] + prevx;
          ny = currdata[1] + prevy;
          break;
        case 'H':
          // ABSOLUTE horizontal line to
          nx = currdata[0];
          // chunk.data.unshift(currdata[1]);
          break;
        case 'h':
          // relative horizontal line to
          nx = currdata[0] + prevx;
          // chunk.data.unshift(currdata[1]);
          break;
        case 'V':
          // ABSOLUTE vertical line to
          ny = currdata[0];
          // chunk.data.unshift(currdata[1]);
          break;
        case 'v':
          // relative vertical line to
          ny = currdata[0] + prevy;
          // chunk.data.unshift(currdata[1]);
          break;
      }

      // log('linear end nx ny\t' + nx + ' ' + ny);
      p = new XYPoint(nx, ny);
      // log('new point ' + p.x + '\t' + p.y);

      lastpoint.h2.use = false;
      /*
       *
       * REFACTOR
       *
       */
      patharr.push(
        new PathPoint({
          p: clone(p),
          h1: clone(p),
          h2: clone(p),
          type: 'corner',
          useH1: false,
          useH2: true,
        })
      );
      lastpoint = patharr[patharr.length - 1];
    }

    // log('completed while loop');
  } else if (iscmd('Aa')) {
    // ABSOLUTE arc to
    // relative arc to

    showErrorMessageBox(
      'Arc To path commands (A or a) are not directly supported.  A straight line will be drawn from the begining to the end of the arc.'
    );
    nx = lastpoint.p.x;
    ny = lastpoint.p.y;

    if (chunk.data.length % 7 !== 0) {
      showErrorMessageBox(
        'Arc To path command (A or a) was expecting 7 arguments, was passed [' +
          chunk.data +
          ']\n<br>Failing "gracefully" by just drawing a line to the last two data points as if they were a x/y point.'
      );
      chunk.data.splice(0, chunk.data.length - 2, 0, 0, 0, 0, 0);
    }

    while (chunk.data.length) {
      currdata = [];
      currdata = chunk.data.splice(0, 7);
      currdata = currdata.splice(5, 2);
      // log('\n\t command ' + cmd + ' while loop data ' + currdata);

      prevx = lastpoint.p.x;
      prevy = lastpoint.p.y;

      nx = currdata[0];
      ny = currdata[1];

      if (cmd === 'a') {
        nx += prevx;
        ny += prevy;
      }

      // log('linear end nx ny\t' + nx + ' ' + ny);
      p = new Coord({ x: nx, y: ny });
      // log('new point ' + p.x + '\t' + p.y);

      lastpoint.type = 'corner';
      lastpoint.h2.use = true;
      lastpoint.makePointedTo(p.x, p.y, false, 'h2', true);

      /*
       *
       * REFACTOR
       *
       */
      const pp = new PathPoint({
        p: p,
        h1: clone(p),
        h2: clone(p),
        type: 'corner',
        useH1: true,
        useH2: true,
      });
      pp.makePointedTo(prevx, prevy, false, 'h1', true);
      patharr.push(pp);

      lastpoint = patharr[patharr.length - 1];
    }

    // log('completed while loop');
  } else if (iscmd('Qq')) {
    // ABSOLUTE quadratic bezier curve to
    // relative quadratic bezier curve to

    currdata = [];
    while (chunk.data.length) {
      // Grab the next chunk of data and make sure it's length=4
      currdata = chunk.data.splice(0, 4);
      if (currdata.length % 4 !== 0) {
        showErrorMessageBox(
          'Quadratic Bezier path command (Q or q) was expecting 4 arguments, was passed [' +
            currdata +
            ']\n<br>Failing "gracefully" by filling in default data.'
        );
        while (currdata.length < 4) {
          currdata.push(currdata[currdata.length - 1] + 100);
        }
      }
      // log('\n\n\t command ' + cmd + ' while loop data ' + currdata);

      if (iscmd('q')) {
        // Relative offset for q
        prevx = lastpoint.p.x;
        prevy = lastpoint.p.y;
        currdata[0] += prevx;
        currdata[1] += prevy;
        currdata[2] += prevx;
        currdata[3] += prevy;
      }

      q = new Coord({ x: currdata[0], y: currdata[1] });
      currdata = [lastpoint.p.x, lastpoint.p.y].concat(currdata);
      currdata = convertQuadraticToCubic(currdata);
      // log('command ' + cmd + ' after Q>C cnvrt ' + currdata);

      lastpoint.h2 = new Coord({ x: currdata[0], y: currdata[1] });
      lastpoint.h2.use = true;
      lastpoint.resolvePointType();

      h1 = new Coord({ x: currdata[2], y: currdata[3] });
      p = new Coord({ x: currdata[4], y: currdata[5] });

      // log('bezier end Px Py\t'+p.x+' '+p.y+'\tH1x H1y:'+h1.x+' '+h1.y);

      /*
       *
       * REFACTOR
       *
       */
      patharr.push(
        new PathPoint({
          p: clone(p),
          h1: clone(h1),
          h2: clone(p),
          q: clone(q),
          useH1: true,
          useH2: true,
          type: 'corner',
        })
      );
      lastpoint = patharr[patharr.length - 1];
    }

    // log('completed while loop');
  } else if (iscmd('Tt')) {
    // ABSOLUTE quadratic symmetric bezier curve to
    // relative quadratic symmetric bezier curve to

    currdata = [];
    // Loop through (potentially) PolyBeziers
    while (chunk.data.length) {
      // Grab the next chunk of data and make sure it's length=2
      currdata = [];
      currdata = chunk.data.splice(0, 2);
      if (currdata.length % 2 !== 0) {
        showErrorMessageBox(
          'Symmetric Bezier path command (T or t) was expecting 2 arguments, was passed [' +
            currdata +
            ']\n<br>Failing "gracefully" by filling in default data.'
        );
        while (currdata.length < 2) {
          currdata.push(currdata[currdata.length - 1] + 100);
        }
      }
      // log('\n\t command ' + cmd + ' while loop datas ' + currdata);

      if (iscmd('t')) {
        // Relative offset for t
        prevx = lastpoint.p.x;
        prevy = lastpoint.p.y;
        currdata[0] += prevx;
        currdata[1] += prevy;
      }

      q = new Coord(findSymmetricPoint(lastpoint.p, lastpoint.Q));
      currdata = [lastpoint.p.x, lastpoint.p.y, q.x, q.y].concat(currdata);

      // log('command ' + cmd + ' before Q>C cnvrt ' + currdata);
      currdata = convertQuadraticToCubic(currdata);
      // log('command ' + cmd + ' afters Q>C cnvrt ' + currdata);

      lastpoint.h2 = new Coord({ x: currdata[0], y: currdata[1] });
      lastpoint.h2.use = true;
      lastpoint.resolvePointType();

      h1 = new Coord({ x: currdata[2], y: currdata[3] });
      p = new Coord({ x: currdata[4], y: currdata[5] });

      // log('bezier end Px Py\t'+p.x+' '+p.y+'\tH1x H1y:'+h1.x+' '+h1.y);

      /*
       *
       * REFACTOR
       *
       */
      patharr.push(
        new PathPoint({
          p: clone(p),
          h1: clone(h1),
          h2: clone(p),
          q: clone(q),
          useH1: true,
          useH2: true,
          type: 'corner',
        })
      );
      lastpoint = patharr[patharr.length - 1];
    }

    // log('completed while loop');
  } else if (iscmd('Cc')) {
    // ABSOLUTE bezier curve to
    // relative bezier curve to
    // The three subsiquent x/y points are relative to the last command's x/y point
    // relative x/y point (n) is NOT relative to (n-1)

    currdata = [];
    // Loop through (potentially) PolyBeziers
    while (chunk.data.length) {
      // Grab the next chunk of data and make sure it's length=6
      currdata = [];
      currdata = chunk.data.splice(0, 6);
      if (currdata.length % 6 !== 0) {
        showErrorMessageBox(
          'Bezier path command (C or c) was expecting 6 arguments, was passed [' +
            currdata +
            ']\n<br>Failing "gracefully" by filling in default data.'
        );
        while (currdata.length < 6) {
          currdata.push(currdata[currdata.length - 1] + 100);
        }
      }
      // log('\n\n\t command ' + cmd + ' while loop data ' + currdata);

      lastpoint.h2 = new Coord({ x: currdata[0], y: currdata[1] });
      lastpoint.h2.use = true;
      lastpoint.resolvePointType();

      h1 = new Coord({ x: currdata[2], y: currdata[3] });
      p = new Coord({ x: currdata[4], y: currdata[5] });

      if (iscmd('c')) {
        // Relative offset for c
        prevx = lastpoint.p.x;
        prevy = lastpoint.p.y;
        lastpoint.h2.x += prevx;
        lastpoint.h2.y += prevy;
        h1.x += prevx;
        h1.y += prevy;
        p.x += prevx;
        p.y += prevy;
      }

      // log('bezier end Px Py\t'+p.x+' '+p.y+'\tH1x H1y:'+h1.x+' '+h1.y);
      /*
       *
       * REFACTOR
       *
       */
      patharr.push(
        new PathPoint({
          p: clone(p),
          h1: clone(h1),
          h2: clone(p),
          useH1: true,
          useH2: true,
          type: 'corner',
        })
      );
      lastpoint = patharr[patharr.length - 1];
    }

    // log('completed while loop');
  } else if (iscmd('Ss')) {
    // ABSOLUTE symmetric bezier curve to
    // relative symmetric bezier curve to

    currdata = [];
    // Loop through (potentially) PolyBeziers
    while (chunk.data.length) {
      // Grab the next chunk of data and make sure it's length=4
      currdata = [];
      currdata = chunk.data.splice(0, 4);
      if (currdata.length % 4 !== 0) {
        showErrorMessageBox(
          'Symmetric Bezier path command (S or s) was expecting 4 arguments, was passed [' +
            currdata +
            ']\n<br>Failing "gracefully" by filling in default data.'
        );
        while (currdata.length < 4) {
          currdata.push(currdata[currdata.length - 1] + 100);
        }
      }
      // log('\n\t command ' + cmd + ' while loop data ' + currdata);

      lastpoint.makeSymmetric('h1');
      lastpoint.h2.use = true;

      h1 = new Coord({ x: currdata[0], y: currdata[1] });
      p = new Coord({ x: currdata[2], y: currdata[3] });

      // log('p before: ' + json(p, true));

      if (iscmd('s')) {
        // Relative offset for st
        prevx = lastpoint.p.x;
        prevy = lastpoint.p.y;
        h1.x += prevx;
        h1.y += prevy;
        p.x += prevx;
        p.y += prevy;
      }

      // log('p afters: ' + json(p, true));
      // log('h1 after: ' + json(h1, true));

      /*
       *
       * REFACTOR
       *
       */
      patharr.push(
        new PathPoint({
          p: clone(p),
          h1: clone(h1),
          h2: clone(p),
          type: 'symmetric',
          useH1: true,
          useH2: true,
        })
      );
      lastpoint = patharr[patharr.length - 1];
    }

    // log('completed while loop');
  } else if (iscmd('Zz')) {
    // End Path
  } else {
    showErrorMessageBox(
      'Unrecognized path command ' + cmd + ', ignoring and moving on...'
    );
  }

  // Finish up last point
  if (islastpoint) {
    const added = patharr[patharr.length - 1];
    added.resolvePointType();
  }

  // log('Resulting Path Chunk');
  // log(patharr);

  // log('ioSVG_handlePathChunk', 'end');

  return patharr;
}

function findSymmetricPoint(p, h) {
  // log('findSymmetricPoint', 'start');
  p = p || { x: 0, y: 0 };
  h = h || { x: 0, y: 0 };

  // log('p: ' + json(p, true));
  // log('h: ' + json(h, true));

  const re = {
    x: p.x - h.x + p.x,
    y: p.y - h.y + p.y,
  };

  // log('returning ' + json(re, true));
  // log('findSymmetricPoint', 'end');

  return re;
}

function convertQuadraticToCubic(data) {
  // log('convertQuadraticToCubic', 'start');
  // log('data: ' + json(data, true));
  const re = [];

  const q0x = data[0];
  const q0y = data[1];
  const q1x = data[2];
  const q1y = data[3];
  const q2x = data[4];
  const q2y = data[5];

  const c1x = q0x + (2 / 3) * (q1x - q0x);
  const c1y = q0y + (2 / 3) * (q1y - q0y);

  const c2x = q2x + (2 / 3) * (q1x - q2x);
  const c2y = q2y + (2 / 3) * (q1y - q2y);

  re.push(c1x);
  re.push(c1y);
  re.push(c2x);
  re.push(c2y);
  re.push(q2x);
  re.push(q2y);

  return re;
}
