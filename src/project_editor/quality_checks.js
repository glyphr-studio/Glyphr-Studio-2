import { getCurrentProject } from '../app/main';
import { calculateLength } from '../common/functions';

export const enabledQualityChecks = {
	highlightPointsNearPoints: false,
	highlightPointsNearHandles: false,
	highlightPointsNearXZero: false,
	highlightPointsNearYZero: false,
};

export function runQualityChecksForItem(item) {
	// log(`runQualityChecksForItem`, 'start');
	// log(`\n⮟enabledQualityChecks⮟`);
	// log(enabledQualityChecks);

	if (
		!enabledQualityChecks.highlightPointsNearPoints &&
		!enabledQualityChecks.highlightPointsNearHandles &&
		!enabledQualityChecks.highlightPointsNearXZero &&
		!enabledQualityChecks.highlightPointsNearYZero
	) {
		// log(`runQualityChecksForItem`, 'end');
		return;
	}

	const project = getCurrentProject();
	const psa = project.settings.app;

	let pointsNearPoints = [];
	let pointsNearHandles = [];
	let nearXZero = [];
	let nearYZero = [];

	if (item.shapes) {
		item.shapes.forEach((shape) => {
			if (shape.objType === 'Path') {
				// Reset the cache
				shape.chache = {};

				// Run the checks
				shape.pathPoints.forEach((point, index) => {
					// near other points
					if (enabledQualityChecks.highlightPointsNearPoints) {
						// log(`Doing quality check: highlightPointsNearPoints`);
						pointsNearPoints[index] = false;
						const nextPoint = shape.pathPoints[shape.getNextPointNumber(index)];
						const distance = calculateLength(point.p, nextPoint.p);
						// log(`this point: ${point.p.x}, ${point.p.y}`);
						// log(`next point: ${nextPoint.p.x}, ${nextPoint.p.y}`);
						// log(`distance is ${distance} for point ${index}`);
						if (distance <= psa.highlightPointsNearPoints) {
							pointsNearPoints[index] = true;
						}
					}

					// near its own handles
					if (enabledQualityChecks.highlightPointsNearHandles) {
						// log(`Doing quality check: highlightPointsNearHandles`);
						pointsNearHandles[index] = false;
						const distanceH1 = calculateLength(point.p, point.h1);
						const distanceH2 = calculateLength(point.p, point.h2);
						if (
							(point.h1.use && distanceH1 <= psa.highlightPointsNearHandles) ||
							(point.h2.use && distanceH2 <= psa.highlightPointsNearHandles)
						) {
							pointsNearHandles[index] = true;
						}
					}

					// near x = 0
					if (enabledQualityChecks.highlightPointsNearXZero) {
						// log(`Doing quality check: highlightPointsNearXZero`);
						nearXZero[index] = false;
						if (Math.abs(point.p.x) <= psa.highlightPointsNearXZero) {
							nearXZero[index] = true;
						}
					}

					// near y = 0
					if (enabledQualityChecks.highlightPointsNearYZero) {
						// log(`Doing quality check: highlightPointsNearYZero`);
						nearYZero[index] = false;
						if (Math.abs(point.p.y) <= psa.highlightPointsNearYZero) {
							nearYZero[index] = true;
						}
					}
				});

				// Save the results
				if (pointsNearPoints.length) shape.cache.pointsNearPoints = pointsNearPoints;
				if (pointsNearHandles.length) shape.cache.pointsNearHandles = pointsNearHandles;
				if (nearXZero.length) shape.cache.nearXZero = nearXZero;
				if (nearYZero.length) shape.cache.nearYZero = nearYZero;
				// log(`\n⮟shape.cache⮟`);
				// log(shape.cache);
			}
		});
	}
	// log(`runQualityChecksForItem`, 'end');
}
