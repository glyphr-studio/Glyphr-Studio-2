import Path from './path.js';
import {findPathIntersections, findPathPointIntersections} from './path.js';
import {clone} from '../common/functions.js';
import PathPoint from './path_point.js';
import {samples} from '../samples/samples.js';


/**
 * A sample path
 * @returns {Path}
 */
function samplePath() {
  return new Path({pathPoints: clone(samples.pathPoints)});
}

/**
 * Another sample path
 * @returns {Path}
 */
function trianglePath() {
  return new Path({pathPoints: [
    {p: {coord: {x: 100, y: 200}}},
    {p: {coord: {x: 300, y: 600}}},
    {p: {coord: {x: 400, y: 500}}},
  ]});
}


describe('Path', () => {
  it('pathPoints', () => {
    const path = samplePath();
    expect(path.pathPoints[3].p.x).toBe(170);
  });

  it('save', () => {
    const path = samplePath();
    expect(path.save()).toEqual(JSON.parse('{"winding":-5,"pathPoints":[{"p":{"coord":{"x":326.65249430318556,"y":500}},"type":"symmetric","h1":{"coord":{"x":239.84504649235828,"y":500}},"h2":{"coord":{"x":413.45994211401285,"y":500}}},{"p":{"coord":{"x":484,"y":343.4570087834163}},"type":"symmetric","h1":{"coord":{"x":484,"y":428.9899571029709}},"h2":{"coord":{"x":484,"y":257.92406046386174}}},{"p":{"coord":{"x":326.65249430318556,"y":186}},"type":"symmetric","h1":{"coord":{"x":414.1548862447006,"y":186}},"h2":{"coord":{"x":239.15010236167052,"y":186}}},{"p":{"coord":{"x":170,"y":343.4570087834163}},"type":"symmetric","h1":{"coord":{"x":170,"y":257.0100080446707}},"h2":{"coord":{"x":170,"y":429.9040095221619}}}]}'));
  });

  it('print', () => {
    const path = samplePath();
    expect(path.print()).toBeTruthy();
  });

  it('winding getter', () => {
    const path = samplePath();
    expect(path.winding).toBe(-5);
  });

  it('x getter', () => {
    const path = samplePath();
    expect(path.x).toBe(170);
  });

  it('y getter', () => {
    const path = samplePath();
    expect(path.y).toBe(500);
  });

  it('width getter', () => {
    const path = samplePath();
    expect(path.width).toBe(314);
  });

  it('height getter', () => {
    const path = samplePath();
    expect(path.height).toBe(314);
  });

  it('maxes getter', () => {
    const path = samplePath();
    expect(path.maxes.save()).toEqual({'xMin': 170, 'xMax': 484, 'yMin': 186, 'yMax': 500});
  });

  it('svgPathData', () => {
    const path = samplePath();
    expect(path.svgPathData).toBe('M326.6524943,500 C413.45994211,500,484,428.9899571,484,343.45700878 C484,257.92406046,414.15488624,186,326.6524943,186 C239.15010236,186,170,257.01000804,170,343.45700878 C170,429.90400952,239.84504649,500,326.6524943,500Z');
  });

  it('width setter', () => {
    // width setter uses setPathSize and updatePathSize
    const path = samplePath();
    path.width = 500;
    expect(path.width).toBe(500);
  });

  it('height setter', () => {
    // height setter uses setPathSize and updatePathSize
    const path = samplePath();
    path.height = 654;
    expect(path.height).toBe(654);
  });

  it('y setter', () => {
    // y setter uses setPathPosition and updatePathPosition
    const path = samplePath();
    path.y = 654;
    expect(path.y).toBe(654);
  });

  it('x setter', () => {
    // x setter uses setPathPosition and updatePathPosition
    const path = samplePath();
    path.x = 654;

    expect(path.x).toBe(654);
  });

  it('getNextPointNum', () => {
    const path = samplePath();
    expect(path.getNextPointNum(3)).toBe(0);
  });

  it('getPreviousPointNum', () => {
    const path = samplePath();
    expect(path.getPreviousPointNum(0)).toBe(3);
  });

  it('containsPoint', () => {
    const path = samplePath();
    expect(path.containsPoint({x: 326.65249430318556, y: 500})).toBeTruthy();
  });

  it('rotate', () => {
    const path = samplePath();
    path.rotate(45, {x: 100, y: 100});
    expect(path.pathPoints[0].p.x).toBe(-121.29587073579876);
  });

  it('getCenter', () => {
    expect(samplePath().center.x).toBe(327);
  });

  it('makePathPostScript', () => {
    const path = samplePath();
    expect(path.makePathPostScript().re).toBe('\t\t\t\t326.65249430318556 500 rmoveto \n\t\t\t\t86.80744781082728 0 70.54005788598715 -71.01004289702911 0 -85.53294831955458 rrcurveto \n\t\t\t\t0 -85.53294831955458 -69.8451137552994 -71.92406046386174 -87.50239194151504 0 rrcurveto \n\t\t\t\t-87.50239194151504 0 -69.15010236167052 71.01000804467071 0 86.4470007387456 rrcurveto \n\t\t\t\t0 86.4470007387456 69.84504649235828 70.09599047783809 86.80744781082728 0 rrcurveto \n');
  });

  it('makeSVGPathData', () => {
    const path = samplePath();
    expect(path.makeSVGPathData()).toBe('M326.6524943,500 C413.45994211,500,484,428.9899571,484,343.45700878 C484,257.92406046,414.15488624,186,326.6524943,186 C239.15010236,186,170,257.01000804,170,343.45700878 C170,429.90400952,239.84504649,500,326.6524943,500Z');
  });

  it('addPointsAtPathIntersections', () => {
    const path = samplePath();
    // Pull the top coord down below the original bottom coord
    path.pathPoints[0].p.y = 100;
    path.addPointsAtPathIntersections();
    expect(path.pathPoints.length).toBe(8);
  });

  it('isOverControlPoint', () => {
    const path = samplePath();
    expect(path.isOverControlPoint(326, 500).type).toBe('p');
  });

  it('isOverFirstPoint', () => {
    const path = samplePath();
    expect(path.isOverFirstPoint(326, 500)).toBe(true);
  });

  it('findWinding', () => {
    const path = samplePath();
    expect(path.findWinding()).toBe(-5);
  });

  it('reverseWinding', () => {
    const path = samplePath();
    path.reverseWinding();
    expect(path.winding).toBe(5);
  });

  it('getSegment', () => {
    expect(samplePath().getSegment(1).p1x).toBe(484);
  });

  it('getQuickSegmentLength', () => {
    expect(samplePath().getQuickSegmentLength()).toBe(272.4319839826901);
  });

  it('getPolySegment', () => {
    const ps = samplePath().getPolySegment();
    expect(ps.segments[3].p1x).toBe(170);
  });

  it('flipNS', () => {
    const p = trianglePath();
    p.flipNS();
    expect(p.pathPoints[2].p.y).toBe(600);
  });

  it('flipEW', () => {
    const p = trianglePath();
    p.flipEW();
    expect(p.pathPoints[2].p.x).toBe(400);
  });

  it('addPathPoint', () => {
    const pp = new PathPoint();
    expect(samplePath().addPathPoint(pp).p.x).toBe(0);
  });

  it('insertPathPoint', () => {
    expect(samplePath().insertPathPoint().p.x).toBe(437.879040081);
  });

  it('getClosestPointOnCurve', () => {
    expect(samplePath().getClosestPointOnCurve({x: 100, y: 100}).x).toBe(219.88358613439445);
  });

  it('getXYPointFromSplit', () => {
    expect(samplePath().getXYPointFromSplit().x).toBe(437.879040080653);
  });

  it('checkForNaN', () => {
    const p = samplePath();
    p.pathPoints[2].h1.x = 'asdf';
    expect(!p.checkForNaN()).toBeTruthy();
  });

  it('findPathIntersections', () => {
    const tp2 = trianglePath();
    tp2.x = 150;

    expect(findPathIntersections(trianglePath(), tp2).length).toBe(2);
  });

  it('findPathPointIntersections', () => {
    const p2 = samplePath();
    p2.y = 814;
    expect(findPathPointIntersections(samplePath(), p2)[0]).toBe('326.65249430318556/500');
  });

  it('PathPoint: pointNumber', () => {
    const pp = samplePath().pathPoints[3];
    expect(pp.pointNumber).toBe(3);
  });
});

/*
CANVAS METHODS
drawPath
findPathPointBoundaryIntersections
*/
