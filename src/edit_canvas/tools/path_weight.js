/**
 * Expands or contracts editable character paths by a font-unit distance.
 * @param {Array | Object} paths
 * @param {Number} amount
 * @returns {Number}
 */
export function applyPathWeight(paths, amount) {
	const pathList = Array.isArray(paths) ? paths : [paths];
	const distance = Number(amount);
	if (!Number.isFinite(distance) || distance === 0) return 0;

	let changedPaths = 0;
	pathList.forEach((path) => {
		if (path?.objType !== 'Path' || !path.pathPoints?.length) return;
		const weightedPath = path.makePolySegment().makeOffsetPolySegment(distance)?.path;
		if (!weightedPath?.pathPoints?.length) return;
		path.pathPoints = weightedPath.pathPoints;
		path.changed();
		changedPaths += 1;
	});
	return changedPaths;
}
