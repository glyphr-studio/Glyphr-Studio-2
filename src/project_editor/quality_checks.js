import { getCurrentProject } from '../app/main';
import { calculateLength } from '../common/functions';

export function runQualityChecksForItem(item) {
	// log(`runQualityChecksForItem`, 'start');
	const project = getCurrentProject();
	const checks = project.settings.app.highlightPoints;
	let checkNearOtherPoints = !!checks.nearOtherPoints;
	let checkNearItsOwnHandles = !!checks.nearItsOwnHandles;
	let checkNearXZero = !!checks.nearXZero;
	let checkNearYZero = !!checks.nearYZero;

	let nearOtherPoints = [];
	let nearItsOwnHandles = [];
	let nearXZero = [];
	let nearYZero = [];

	if (item.shapes) {
		item.shapes.forEach((shape) => {
			if (shape.objType === 'Path') {
				shape.pathPoints.forEach((point, index) => {
					// near other points
					if (checkNearOtherPoints) {
						const nextPoint = shape.pathPoints[shape.getNextPointNumber(index)];
						const distance = calculateLength(point.p, nextPoint.p);
						// log(`this point: ${point.p.x}, ${point.p.y}`);
						// log(`next point: ${nextPoint.p.x}, ${nextPoint.p.y}`);
						// log(`distance is ${distance} for point ${index}`);
						if (distance <= checks.nearOtherPoints) {
							nearOtherPoints[index] = true;
						} else {
							nearOtherPoints[index] = false;
						}
					}

					// near its own handles
					if (checkNearItsOwnHandles) {
						const distanceH1 = calculateLength(point.p, point.h1);
						const distanceH2 = calculateLength(point.p, point.h2);
						if (distanceH1 <= checks.nearItsOwnHandles || distanceH2 <= checks.nearItsOwnHandles) {
							nearItsOwnHandles[index] = true;
						} else {
							nearItsOwnHandles[index] = false;
						}
					}

					// near x = 0
					if (checkNearXZero) {
						if (point.p.x <= checks.nearXZero) {
							nearXZero[index] = true;
						} else {
							nearXZero[index] = false;
						}
					}

					// near y = 0
					if (checkNearYZero) {
						if (point.p.y <= checks.nearYZero) {
							nearYZero[index] = true;
						} else {
							nearYZero[index] = false;
						}
					}
				});

				// Save the results
				if (checkNearOtherPoints) shape.cache.nearOtherPoints = nearOtherPoints;
				if (checkNearItsOwnHandles) shape.cache.nearOtherPoints = nearOtherPoints;
				if (checkNearXZero) shape.cache.nearOtherPoints = nearOtherPoints;
				if (checkNearYZero) shape.cache.nearOtherPoints = nearOtherPoints;
				// log(`\n⮟shape.cache⮟`);
				// log(shape.cache);
			}
		});
	}
	// log(`runQualityChecksForItem`, 'end');
}
