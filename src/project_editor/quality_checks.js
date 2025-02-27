import { getCurrentProject } from '../app/main';
import { calculateLength, clone } from '../common/functions';

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
			// log(`shape.name: ${shape.name}`);
			if (shape.objType === 'Path') {
				// Reset the cache
				shape.chache = {};

				// Run the checks
				for (let index = 0; index < shape.pathPoints.length; index++) {
					const point = shape.pathPoints[index];

					// near other points
					if (enabledQualityChecks.highlightPointsNearPoints) {
						// log(`\n Doing quality check: highlightPointsNearPoints`);
						pointsNearPoints[index] = false;
						const nextPointNumber = shape.getNextPointNumber(index);
						const nextPoint = shape.pathPoints[nextPointNumber];
						const distance = calculateLength(point.p, nextPoint.p);
						// log(`this point (${index}): ${point.p.x}, ${point.p.y}`);
						// log(`next point (${nextPointNumber}): ${nextPoint.p.x}, ${nextPoint.p.y}`);
						if (distance <= psa.highlightPointsNearPoints) {
							pointsNearPoints[index] = true;
						}
						// log(`distance is ${distance} results in ${pointsNearPoints[index]}`);
					}

					// near its own handles
					if (enabledQualityChecks.highlightPointsNearHandles) {
						// log(`\n Doing quality check: highlightPointsNearHandles`);
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
						// log(`\n Doing quality check: highlightPointsNearXZero`);
						nearXZero[index] = false;
						if (Math.abs(point.p.x) <= psa.highlightPointsNearXZero && point.p.x !== 0) {
							nearXZero[index] = true;
						}
					}

					// near y = 0
					if (enabledQualityChecks.highlightPointsNearYZero) {
						// log(`\n Doing quality check: highlightPointsNearYZero`);
						nearYZero[index] = false;
						if (Math.abs(point.p.y) <= psa.highlightPointsNearYZero && point.p.y !== 0) {
							nearYZero[index] = true;
						}
					}
				}

				// Save the results
				if (pointsNearPoints.length) shape.cache.pointsNearPoints = clone(pointsNearPoints);
				if (pointsNearHandles.length) shape.cache.pointsNearHandles = clone(pointsNearHandles);
				if (nearXZero.length) shape.cache.nearXZero = clone(nearXZero);
				if (nearYZero.length) shape.cache.nearYZero = clone(nearYZero);
			}
		});
	}
	// log(`runQualityChecksForItem`, 'end');
}
