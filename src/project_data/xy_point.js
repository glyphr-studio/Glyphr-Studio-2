/**
 * XYPoint
 * A single x/y point, without the fancy GlyphElement crud (like Coord)
 */
export class XYPoint {
	/**
	 * Create a XYPoint
	 * @param {Number} x - The X value
	 * @param {Number} y - The Y value
	 */
	constructor(x = 0, y = 0) {
		x = parseFloat(x);
		this.x = isNaN(x) ? 0 : x;

		y = parseFloat(y);
		this.y = isNaN(y) ? 0 : y;
	}
}
