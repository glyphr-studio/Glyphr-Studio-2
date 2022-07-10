/**
 * XYPoint
 * A single x/y point, without the fancy GlyphElement crud (like Coord)
 */
export default class XYPoint {
  /**
   * Create a XYPoint
   * @param {number} x - The X value
   * @param {number} y - The Y value
   */
  constructor(x = 0, y = 0) {
    x = parseFloat(x);
    this.x = isNaN(x) ? 0 : x;

    y = parseFloat(y);
    this.y = isNaN(y) ? 0 : y;
  }
}
