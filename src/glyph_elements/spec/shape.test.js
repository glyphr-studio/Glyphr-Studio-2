import { Shape } from '../shape.js';
import { Path } from '../path.js';
import { clone } from '../../common/functions.js';
import { samples } from '../../samples/samples.js';

/**
 * A sample shape
 * @returns {Shape}
 */
function sampleShape() {
	return new Shape({path: {pathPoints: clone(samples.pathPoints)}});
}

/**
 * Another sample path
 * @returns {Shape}
 */
function triangleShape() {
	return new Shape({path: {pathPoints: [
		{p: {coord: {x: 100, y: 200}}},
		{p: {coord: {x: 300, y: 600}}},
		{p: {coord: {x: 400, y: 500}}},
	]}});
}


describe('Shape', () => {
	it('save', () => {
		const s = sampleShape();
		const re = s.save();
		expect(re).toEqual(JSON.parse('{"path":{"winding":-5,"pathPoints":[{"p":{"coord":{"x":326.65249430318556,"y":500}},"type":"symmetric","h1":{"coord":{"x":239.84504649235828,"y":500}},"h2":{"coord":{"x":413.45994211401285,"y":500}}},{"p":{"coord":{"x":484,"y":343.4570087834163}},"type":"symmetric","h1":{"coord":{"x":484,"y":428.9899571029709}},"h2":{"coord":{"x":484,"y":257.92406046386174}}},{"p":{"coord":{"x":326.65249430318556,"y":186}},"type":"symmetric","h1":{"coord":{"x":414.1548862447006,"y":186}},"h2":{"coord":{"x":239.15010236167052,"y":186}}},{"p":{"coord":{"x":170,"y":343.4570087834163}},"type":"symmetric","h1":{"coord":{"x":170,"y":257.0100080446707}},"h2":{"coord":{"x":170,"y":429.9040095221619}}}]}}'));
	});

	it('print', () => {
		const s = sampleShape();
		expect(s.print()).toBeTruthy();
	});

	it('get/set name', () => {
		const s = sampleShape();
		s.name = 'new Name';
		expect(s.name).toBe('new Name');
	});

	it('get/set path', () => {
		const s = sampleShape();
		s.path = new Path({pathPoints: [
			{p: {coord: {x: 100, y: 200}}},
			{p: {coord: {x: 300, y: 600}}},
			{p: {coord: {x: 400, y: 500}}},
		]});
		expect(s.path.pathPoints[2].p.x).toBe(400);
	});

	it('get/set xLock', () => {
		const s = sampleShape();
		s.xLock = true;
		expect(s.xLock).toBe(true);
	});

	it('get/set yLock', () => {
		const s = sampleShape();
		s.yLock = true;
		expect(s.yLock).toBe(true);
	});

	it('get/set wLock', () => {
		const s = sampleShape();
		s.wLock = true;
		expect(s.wLock).toBe(true);
	});

	it('get/set hLock', () => {
		const s = sampleShape();
		s.hLock = true;
		expect(s.hLock).toBe(true);
	});

	it('get/set ratioLock', () => {
		const s = sampleShape();
		s.ratioLock = true;
		expect(s.ratioLock).toBe(true);
	});

	it('get/set x', () => {
		const s = sampleShape();
		s.x = 300;
		expect(s.x).toBe(300);
	});

	it('get/set y', () => {
		const s = sampleShape();
		s.y = 300;
		expect(s.y).toBe(300);
	});

	it('get/set width', () => {
		const s = sampleShape();
		s.width = 100;
		expect(s.width).toBe(100);
	});

	it('get/set height', () => {
		const s = sampleShape();
		s.height = 100;
		expect(s.height).toBe(100);
	});

	it('makeSVG', () => {
		const s = sampleShape();
		const re = s.makeSVG();
		expect(re).toBe('<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"50\" height=\"50\" viewBox=\"0,0,990,990\"><g transform=\"translate(100,650) scale(0.8,-0.8)\"><path d=\"M326.6524943,500 C413.45994211,500,484,428.9899571,484,343.45700878 C484,257.92406046,414.15488624,186,326.6524943,186 C239.15010236,186,170,257.01000804,170,343.45700878 C170,429.90400952,239.84504649,500,326.6524943,500Z\"/></g></svg>');
	});

	it('makePostScript', () => {
		const s = sampleShape();
		const re = s.makePostScript();
		expect(re).toEqual({'re': '\t\t\t\t326.65249430318556 500 rmoveto \n\t\t\t\t86.80744781082728 0 70.54005788598715 -71.01004289702911 0 -85.53294831955458 rrcurveto \n\t\t\t\t0 -85.53294831955458 -69.8451137552994 -71.92406046386174 -87.50239194151504 0 rrcurveto \n\t\t\t\t-87.50239194151504 0 -69.15010236167052 71.01000804467071 0 86.4470007387456 rrcurveto \n\t\t\t\t0 86.4470007387456 69.84504649235828 70.09599047783809 86.80744781082728 0 rrcurveto \n', 'lastX': 326.65249430318556, 'lastY': 500});
	});

	it('setShapePosition x', () => {
		// setShapePosition uses updateShapePosition, this tests both
		const s = sampleShape();
		const re = s.setShapePosition(123, false);
		expect(re.x).toBe(123);
	});

	it('setShapePosition y', () => {
		// setShapePosition uses updateShapePosition, this tests both
		const s = sampleShape();
		const re = s.setShapePosition(false, 123);
		expect(re.y).toBe(123);
	});

	it('setShapeSize w', () => {
		// setShapeSize uses updateShapeSize, this tests both
		const s = sampleShape();
		const re = s.setShapeSize(123, false);
		expect(re.width).toBe(123);
	});

	it('setShapeSize h', () => {
		// setShapeSize uses updateShapeSize, this tests both
		const s = sampleShape();
		const re = s.setShapeSize(false, 123);
		expect(re.height).toBe(123);
	});

	it('flipNS', () => {
		const s = triangleShape();
		s.flipNS();
		expect(s.path.pathPoints[2].p.y).toBe(600);
	});

	it('flipEW', () => {
		const s = triangleShape();
		s.flipEW();
		expect(s.path.pathPoints[2].p.x).toBe(400);
	});

	it('rotate', () => {
		const s = sampleShape();
		s.rotate(45, {x: 100, y: 100});
		expect(s.path.pathPoints[0].p.x).toBe(-121.29587073579876);
	});

	it('getCenter', () => {
		expect(sampleShape().maxes.center.x).toBe(327);
	});

	it('reverseWinding', () => {
		const s = sampleShape();
		s.reverseWinding();
		expect(s.path.winding).toBe(5);
	});

	it('getSegment', () => {
		expect(sampleShape().getSegment(1).p1x).toBe(484);
	});

	it('checkForNaN', () => {
		const s = sampleShape();
		s.path.pathPoints[2].h1.x = 'test';
		expect(!s.checkForNaN()).toBeTruthy();
	});
});
