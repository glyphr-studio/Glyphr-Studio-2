/**
 * Compare two x/y points within a margin of rounding
 * @param {object} c1 - Coord or XYPoint, First point to compare
 * @param {object} c2 - Coord or XYPoint, Second point to compare
 * @param {number} threshold - how close to compare positions
 * @returns {boolean}
 */

export function pointsAreEqual(c1, c2, threshold = 1) {
	if (c1.x === c2.x && c1.y === c2.y) {
		return true;
	}

	const dx = Math.abs(c1.x - c2.x);
	const dy = Math.abs(c1.y - c2.y);

	if (dx <= threshold && dy <= threshold) {
		return true;
	}

	return false;
}

/**
 * Returns a full new copy of any object
 * 'parent' and 'parent' are pointers up to parent objects, they
 * cause infinite loops when cloning objects.  Kind of a hack.
 * @param {object} source - object to clone
 * @returns {object}
 */
 export function clone(source) {
  const newObj = source instanceof Array ? [] : {};
  for (const i of Object.keys(source)) {
    if (
      source[i] &&
      typeof source[i] === 'object' &&
      i !== 'parent' &&
      i !== 'cache'
    ) {
      newObj[i] = clone(source[i]);
    } else newObj[i] = source[i];
  }
  return newObj;
}

/**
 * Better rounding than Math.round
 * @param {number} num - number to round
 * @param {number} dec - number of decimal places
 * @returns {number}
 */
 export function round(num, dec = 0) {
	if (!num) return 0;
	return Number(Math.round(num + 'e' + dec) + 'e-' + dec) || 0;
}

/**
 * Sample objects
 */
export const samples = {
  glyph: {
    shapes: [
      {
        path: {
          pathPoints: [
            { p: { coord: { x: 100, y: 200 } } },
            { p: { coord: { x: 300, y: 600 } } },
            { p: { coord: { x: 400, y: 500 } } },
          ],
        },
      },
      {
        path: {
          pathPoints: [
            { p: { coord: { x: 500, y: 600 } } },
            { p: { coord: { x: 700, y: 950 } } },
            { p: { coord: { x: 800, y: 900 } } },
          ],
        },
      },
      {
        path: {
          pathPoints: [
            { p: { coord: { x: 10, y: 20 } } },
            { p: { coord: { x: 30, y: 60 } } },
            { p: { coord: { x: 40, y: 50 } } },
          ],
        },
      },
    ],
  },
  glyphBox: {
    shapes: [
      {
        path: {
          pathPoints: [
            { p: { coord: { x: 0, y: 0 } } },
            { p: { coord: { x: 100, y: 0 } } },
            { p: { coord: { x: 0, y: 100 } } },
          ],
        },
      },
      {
        path: {
          pathPoints: [
            { p: { coord: { x: 300, y: 0 } } },
            { p: { coord: { x: 400, y: 0 } } },
            { p: { coord: { x: 400, y: 100 } } },
          ],
        },
      },
      {
        path: {
          pathPoints: [
            { p: { coord: { x: 300, y: 700 } } },
            { p: { coord: { x: 400, y: 700 } } },
            { p: { coord: { x: 400, y: 600 } } },
          ],
        },
      },
      {
        path: {
          pathPoints: [
            { p: { coord: { x: 0, y: 700 } } },
            { p: { coord: { x: 100, y: 700 } } },
            { p: { coord: { x: 0, y: 600 } } },
          ],
        },
      },
    ],
  },
  pathPoints: [
    {
      p: { coord: { x: 326.65249430318556, y: 499.9999934240834 } },
      h1: { coord: { x: 239.84504649235828, y: 499.9999934240834 } },
      h2: { coord: { x: 413.45994211401285, y: 499.9999934240834 } },
      type: 'symmetric',
    },
    {
      p: { coord: { x: 483.99995919594085, y: 343.4570087834163 } },
      h1: { coord: { x: 483.99995919594085, y: 428.9899571029709 } },
      h2: { coord: { x: 483.99995919594085, y: 257.92406046386174 } },
      type: 'symmetric',
    },
    {
      p: { coord: { x: 326.65249430318556, y: 185.99997172355825 } },
      h1: { coord: { x: 414.1548862447006, y: 185.99997172355825 } },
      h2: { coord: { x: 239.15010236167052, y: 185.99997172355825 } },
      type: 'symmetric',
    },
    {
      p: { coord: { x: 169.99997354111795, y: 343.4570087834163 } },
      h1: { coord: { x: 169.99997354111795, y: 257.0100080446707 } },
      h2: { coord: { x: 169.99997354111795, y: 429.9040095221619 } },
      type: 'symmetric',
    },
  ],
};
