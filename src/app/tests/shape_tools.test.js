import { isCanvasDisplayModeOutlined } from '../../display_canvas/draw_paths.js';
import { handwritingPathFromPoints } from '../../edit_canvas/tools/handwriting.js';
import { rectPathFromMaxes } from '../../edit_canvas/tools/new_basic_path.js';
import { applyPathWeight } from '../../edit_canvas/tools/path_weight.js';
import { Path } from '../../project_data/path.js';

describe('shape tool geometry', () => {
	it('creates editable rounded rectangle corners', () => {
		const path = rectPathFromMaxes(
			{ xMin: 0, xMax: 200, yMin: 0, yMax: 100 },
			'Rounded rectangle',
			20
		);

		expect(path.pathPoints).toHaveLength(8);
		expect(path.maxes.xMin).toBe(0);
		expect(path.maxes.xMax).toBe(200);
		expect(path.maxes.yMin).toBe(0);
		expect(path.maxes.yMax).toBe(100);
		expect(path.pathPoints.some((point) => point.h1.use || point.h2.use)).toBe(true);
	});

	it('treats the enabled canvas toggle as outline mode', () => {
		expect(
			isCanvasDisplayModeOutlined({
				settings: { app: { canvasDisplayModeFilled: true } },
			})
		).toBe(true);
		expect(
			isCanvasDisplayModeOutlined({
				settings: { app: { canvasDisplayModeFilled: false } },
			})
		).toBe(false);
	});

	it('lets a rectangle path use rounded corners via border radius', () => {
		const path = new Path({
			name: 'Rounded rectangle',
			pathPoints: [
				{ p: { coord: { x: 0, y: 100 } } },
				{ p: { coord: { x: 200, y: 100 } } },
				{ p: { coord: { x: 200, y: 0 } } },
				{ p: { coord: { x: 0, y: 0 } } },
			],
		});

		path.borderRadius = 20;

		expect(path.borderRadius).toBe(20);
		expect(path.pathPoints).toHaveLength(8);
		expect(path.pathPoints.some((point) => point.h1.use || point.h2.use)).toBe(true);
	});

	it('converts handwriting samples into a closed weighted outline', () => {
		const path = handwritingPathFromPoints(
			[
				{ x: 10, y: 10 },
				{ x: 60, y: 20 },
				{ x: 110, y: 10 },
			],
			30
		);

		expect(path.pathPoints).toHaveLength(6);
		expect(path.width).toBeGreaterThan(100);
		expect(path.height).toBeGreaterThanOrEqual(30);
		expect(path.winding).not.toBe(0);
	});

	it('does not create a handwriting path from one sample', () => {
		expect(handwritingPathFromPoints([{ x: 10, y: 10 }], 30)).toBe(false);
	});

	it('applies weight directly to a regular character path', () => {
		const path = rectPathFromMaxes({ xMin: 0, xMax: 100, yMin: 0, yMax: 100 });
		const originalWidth = path.width;

		expect(applyPathWeight(path, 10)).toBe(1);
		expect(path.width).toBeGreaterThan(originalWidth);
		expect(path.pathPoints.length).toBeGreaterThan(0);
	});
});
