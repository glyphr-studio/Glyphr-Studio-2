import {
	chunkAndValidateParameters,
	log,
	roundAndSanitize,
	sanitizeParameterData,
} from './svg-to-bezier.js';
import { convertArcToCommandToBezier } from './tag-convert-path-arc.js';

/**
 * Converts an SVG Path tag to Bezier Data Format
 * @param {object} tagData - Object with tag information
 * @returns {Array} - resulting path(s) in Bezier Data Format
 */
export function tagConvertPath(tagData = {}) {
	log(`\ntagConvertPath`);
	const dAttribute = tagData.attributes.d || '';
	log(`\t dAttribute: ${dAttribute}`);

	// Check for commands
	if (dAttribute.length === 0 || dAttribute.length === 1) {
		return [];
	}

	// Take the command string and split into an array containing
	// command objects, comprised of the command letter and parameters
	let commands = chunkCommands(dAttribute);
	log('After chunkCommands');
	log(commands);

	// Convert relative commands: m, l, h, v, c, s, q, t, a, z
	// to absolute commands: M, L, H, V, C, S, Q, T, A, Z
	// Converting to Absolute should be done before convertLineTo and convertSmoothBeziers
	// because they are unable to handle relative commands.
	commands = convertToAbsolute(commands);
	log('After convertToAbsolute');
	log(commands);

	// Convert chains of parameters to individual command / parameter pairs
	commands = splitChainParameters(commands);
	log('After splitChainParameters');
	log(commands);

	// Convert Horizontal and Vertical LineTo commands to regular LineTo commands
	commands = convertLineTo(commands);
	log('After convertLineTo');
	log(commands); // Convert Smooth Cubic Bézier commands S to regular Cubic Bézier commands C

	// Convert Smooth Quadratic Bézier commands T to regular Quadratic Bézier commands Q
	commands = convertSmoothBeziers(commands);
	log('After convertSmoothBeziers');
	log(commands);

	// Convert Quadratic Bézier Q commands to Cubic Bézier commands C
	commands = convertQuadraticBeziers(commands);
	log('After convertQuadraticBeziers');
	log(commands);

	// Convert Elliptical Arc commands A to Cubic Bézier commands C
	commands = convertArcs(commands);
	log('After convertArcs');
	log(commands);

	// Do the final conversion to Bezier Data format
	const bezierPaths = convertCommandsToBezierPaths(commands);

	return bezierPaths;
}

function convertCommandsToBezierPaths(commands) {
	let bezierPaths = [];
	let currentPath = [];
	let currentX = 0;
	let currentY = 0;

	// At this point:
	// The only commands should be M, C, L, Z
	// Commands should not be chained
	commands.forEach((command) => {
		const params = command.parameters || [];
		params.forEach((param, i) => (params[i] = roundAndSanitize(param)));

		if (command.type === 'M') {
			currentX = params[0];
			currentY = params[1];
		}
		if (command.type === 'L') {
			currentPath.push([
				{ x: currentX, y: currentY },
				false,
				false,
				{ x: params[0], y: params[1] },
			]);
			currentX = params[0];
			currentY = params[1];
		}
		if (command.type === 'C') {
			currentPath.push([
				{ x: currentX, y: currentY },
				{ x: params[0], y: params[1] },
				{ x: params[2], y: params[3] },
				{ x: params[4], y: params[5] },
			]);
			currentX = params[4];
			currentY = params[5];
		}
		if (command.type === 'Z') {
			if (currentPath[0] && currentPath[0][0]) {
				currentPath.push([
					{ x: currentX, y: currentY },
					false,
					false,
					{ x: currentPath[0][0].x, y: currentPath[0][0].y },
				]);
				currentX = currentPath[0][0].x;
				currentY = currentPath[0][0].y;
			}
			bezierPaths.push(currentPath);
			currentPath = [];
		}
	});

	// No z command, but end of data
	if (currentPath.length) bezierPaths.push(currentPath);

	return bezierPaths;
}

/*
 * Prepare + Simplify commands
 */

function chunkCommands(dAttribute) {
	// log(`Start chunkCommands`);
	let result = [];
	let commandStart = false;

	let data = sanitizeParameterData(dAttribute);
	// log(data);

	// Find the first valid command
	for (let j = 0; j < data.length; j++) {
		if (isCommand(data.charAt(j))) {
			commandStart = j;
			// log(`First valid command ${data.charAt(j)} found at ${j}`);
			break;
		}
	}

	if (commandStart === false) {
		// No valid commands found
		// log(`No valid commands found, returning Z`);
		return [{ type: 'Z' }];
	}

	// Loop through the string
	for (let i = commandStart + 1; i < data.length; i++) {
		if (isCommand(data.charAt(i))) {
			result.push({
				type: data.charAt(commandStart),
				parameters: chunkAndValidateParameters(data.substring(commandStart + 1, i)),
			});

			commandStart = i;
		}
	}

	// Fencepost
	if (commandStart < data.length - 1) {
		result.push({
			type: data.charAt(commandStart),
			parameters: chunkAndValidateParameters(data.substring(commandStart + 1, data.length)),
		});
	}

	return result;
}

function convertToAbsolute(commands) {
	// log(`Start convertToAbsolute: ${commands.length} command chunks`);
	let result = [];
	let newCommand = {};
	let currentPoint = { x: 0, y: 0 };
	let newPoint = { x: 0, y: 0 };
	firstPoint = {};

	commands.forEach((command) => {
		log(`Command: ${command.type}`);
		if (command.type === 'm' || command.type === 'l') {
			// MoveTo and LineTo
			log(`currentPoint: ${currentPoint.x}, ${currentPoint.y}`);

			newCommand = {
				type: command.type === 'm' ? 'M' : 'L',
				parameters: [],
			};

			for (let i = 0; i < command.parameters.length; i += 2) {
				newPoint.x = command.parameters[i + 0] + currentPoint.x;
				newPoint.y = command.parameters[i + 1] + currentPoint.y;
				newCommand.parameters.push(newPoint.x);
				newCommand.parameters.push(newPoint.y);
				currentPoint.x = newPoint.x;
				currentPoint.y = newPoint.y;
				if (command.type === 'm') {
					// if a chained m command, firstPoint is the first entry
					setFirstPoint(newPoint);
				}
			}

			result.push(newCommand);
		} else if (command.type === 'h') {
			// Horizontal line to
			newCommand = {
				type: 'H',
				parameters: [],
			};

			for (let i = 0; i < command.parameters.length; i++) {
				newPoint.x = command.parameters[i] + currentPoint.x;
				newCommand.parameters.push(newPoint.x);
				currentPoint.x = newPoint.x;
				setFirstPoint(newPoint);
			}

			result.push(newCommand);
		} else if (command.type === 'v') {
			// Horizontal line to
			newCommand = {
				type: 'V',
				parameters: [],
			};

			for (let i = 0; i < command.parameters.length; i++) {
				newPoint.y = command.parameters[i] + currentPoint.y;
				newCommand.parameters.push(newPoint.y);
				currentPoint.y = newPoint.y;
				setFirstPoint(newPoint);
			}

			result.push(newCommand);
		} else if (command.type === 'c') {
			// Cubic Bezier
			newCommand = {
				type: 'C',
				parameters: [],
			};

			for (let i = 0; i < command.parameters.length; i += 6) {
				newCommand.parameters.push(command.parameters[i + 0] + currentPoint.x);
				newCommand.parameters.push(command.parameters[i + 1] + currentPoint.y);
				newCommand.parameters.push(command.parameters[i + 2] + currentPoint.x);
				newCommand.parameters.push(command.parameters[i + 3] + currentPoint.y);
				newPoint.x = command.parameters[i + 4] + currentPoint.x;
				newPoint.y = command.parameters[i + 5] + currentPoint.y;
				newCommand.parameters.push(newPoint.x);
				newCommand.parameters.push(newPoint.y);
				currentPoint.x = newPoint.x;
				currentPoint.y = newPoint.y;
				setFirstPoint(newPoint);
			}

			result.push(newCommand);
		} else if (command.type === 's') {
			// Smooth Cubic Bezier
			newCommand = {
				type: 'S',
				parameters: [],
			};

			for (let i = 0; i < command.parameters.length; i += 4) {
				newCommand.parameters.push(command.parameters[i + 0] + currentPoint.x);
				newCommand.parameters.push(command.parameters[i + 1] + currentPoint.y);
				newPoint.x = command.parameters[i + 2] + currentPoint.x;
				newPoint.y = command.parameters[i + 3] + currentPoint.y;
				newCommand.parameters.push(newPoint.x);
				newCommand.parameters.push(newPoint.y);
				currentPoint.x = newPoint.x;
				currentPoint.y = newPoint.y;
				setFirstPoint(newPoint);
			}

			result.push(newCommand);
		} else if (command.type === 'q') {
			// Quadratic Bezier
			newCommand = {
				type: 'Q',
				parameters: [],
			};

			for (let i = 0; i < command.parameters.length; i += 4) {
				newCommand.parameters.push(command.parameters[i + 0] + currentPoint.x);
				newCommand.parameters.push(command.parameters[i + 1] + currentPoint.y);
				newPoint.x = command.parameters[i + 2] + currentPoint.x;
				newPoint.y = command.parameters[i + 3] + currentPoint.y;
				newCommand.parameters.push(newPoint.x);
				newCommand.parameters.push(newPoint.y);
				currentPoint.x = newPoint.x;
				currentPoint.y = newPoint.y;
				setFirstPoint(newPoint);
			}

			result.push(newCommand);
		} else if (command.type === 't') {
			// Smooth Quadratic Bezier
			newCommand = {
				type: 'T',
				parameters: [],
			};

			for (let i = 0; i < command.parameters.length; i += 2) {
				newPoint.x = command.parameters[i + 0] + currentPoint.x;
				newPoint.y = command.parameters[i + 1] + currentPoint.y;
				newCommand.parameters.push(newPoint.x);
				newCommand.parameters.push(newPoint.y);
				currentPoint.x = newPoint.x;
				currentPoint.y = newPoint.y;
				setFirstPoint(newPoint);
			}

			result.push(newCommand);
		} else if (command.type === 'a') {
			// Arc to
			newCommand = {
				type: 'A',
				parameters: [],
			};
			// log(`Arc to relative parameters\n${command.parameters}`);
			for (let i = 0; i < command.parameters.length; i += 7) {
				newCommand.parameters.push(command.parameters[i + 0]);
				newCommand.parameters.push(command.parameters[i + 1]);
				newCommand.parameters.push(command.parameters[i + 2]);
				newCommand.parameters.push(command.parameters[i + 3]);
				newCommand.parameters.push(command.parameters[i + 4]);
				newPoint.x = command.parameters[i + 5] + currentPoint.x;
				newPoint.y = command.parameters[i + 6] + currentPoint.y;
				newCommand.parameters.push(newPoint.x);
				newCommand.parameters.push(newPoint.y);
				currentPoint.x = newPoint.x;
				currentPoint.y = newPoint.y;
				setFirstPoint(newPoint);
			}

			result.push(newCommand);
		} else if (command.type === 'z' || command.type === 'Z') {
			// End path
			currentPoint = { x: firstPoint.x, y: firstPoint.y };
			log(`END OF PATH Z: Setting current point to first point`);
			log(`firstPoint: ${firstPoint.x}, ${firstPoint.y}`);
			log(`currentPoint: ${currentPoint.x}, ${currentPoint.y}`);
			firstPoint = false;
			result.push({ type: 'Z' });
		} else {
			// command is absolute, push it after updating currentPoint
			if (command.type === 'M') {
				// If a chained M command, firstPoint is the first entry
				currentPoint.x = command.parameters[0];
				currentPoint.y = command.parameters[1];
			}
			result.push(command);
			setFirstPoint(currentPoint);
			currentPoint = getNewEndPoint(currentPoint, command);
		}
	});

	return result;
}

function splitChainParameters(commands) {
	let result = [];

	commands.forEach((command) => {
		if (command.type) {
			switch (command.type) {
				case 'Z':
				case 'z':
					result.push({ type: 'Z' });
					break;

				case 'H':
				case 'V':
				case 'h':
				case 'v':
					for (let p = 0; p < command.parameters.length; p++) {
						result.push({
							type: command.type,
							parameters: [command.parameters[p]],
						});
					}
					break;

				case 'M':
					// Chained MoveTo commands are treated like LineTo commands
					for (let p = 0; p < command.parameters.length; p += 2) {
						result.push({
							type: p < 2 ? 'M' : 'L',
							parameters: [command.parameters[p], command.parameters[p + 1]],
						});
					}
					break;

				case 'm':
					// Chained MoveTo commands are treated like LineTo commands
					for (let p = 0; p < command.parameters.length; p += 2) {
						result.push({
							type: p < 2 ? 'm' : 'l',
							parameters: [command.parameters[p], command.parameters[p + 1]],
						});
					}
					break;

				case 'L':
				case 'T':
				case 'l':
				case 't':
					for (let p = 0; p < command.parameters.length; p += 2) {
						result.push({
							type: command.type,
							parameters: [command.parameters[p], command.parameters[p + 1]],
						});
					}
					break;

				case 'Q':
				case 'S':
				case 'q':
				case 's':
					for (let p = 0; p < command.parameters.length; p += 4) {
						result.push({
							type: command.type,
							parameters: [
								command.parameters[p],
								command.parameters[p + 1],
								command.parameters[p + 2],
								command.parameters[p + 3],
							],
						});
					}
					break;

				case 'C':
				case 'c':
					for (let p = 0; p < command.parameters.length; p += 6) {
						result.push({
							type: command.type,
							parameters: [
								command.parameters[p],
								command.parameters[p + 1],
								command.parameters[p + 2],
								command.parameters[p + 3],
								command.parameters[p + 4],
								command.parameters[p + 5],
							],
						});
					}
					break;

				case 'A':
				case 'a':
					for (let p = 0; p < command.parameters.length; p += 7) {
						result.push({
							type: command.type,
							parameters: [
								command.parameters[p],
								command.parameters[p + 1],
								command.parameters[p + 2],
								command.parameters[p + 3],
								command.parameters[p + 4],
								command.parameters[p + 5],
								command.parameters[p + 6],
							],
						});
					}
					break;
			}
		}
	});

	return result;
}

function convertLineTo(commands) {
	// log(`Start convertLineTo`);
	let result = [];
	let currentPoint = { x: 0, y: 0 };

	commands.forEach((command) => {
		// log(`doing ${command.type} [${command.parameters.join()}]`);

		if (command.type === 'H') {
			for (let p = 0; p < command.parameters.length; p++) {
				result.push({
					type: 'L',
					parameters: [command.parameters[p], currentPoint.y],
				});
			}
		} else if (command.type === 'V') {
			for (let p = 0; p < command.parameters.length; p++) {
				result.push({
					type: 'L',
					parameters: [currentPoint.x, command.parameters[p]],
				});
			}
		} else {
			result.push(command);
		}

		// log(`pushed ${result.at(-1).type} [${result.at(-1).parameters.join()}]`);
		currentPoint = getNewEndPoint(currentPoint, command);
		// log(`new end point ${currentPoint.x}, ${currentPoint.y}`);
	});

	return result;
}

function convertSmoothBeziers(commands) {
	// log(`Start convertSmoothBeziers`);
	let result = [];
	let currentPoint = { x: 0, y: 0 };
	let previousHandle = { x: 0, y: 0 };
	let smoothHandle = { x: 0, y: 0 };
	let previousResult;

	commands.forEach((command) => {
		if (command.type === 'S' || command.type === 'T') {
			previousResult = result.length > 1 ? result.at(-1) : false;

			// This allows for using a smooth cubic after a quadratic,
			// or a smooth quadratic after a cubic... which may not be standard
			if (previousResult && previousResult.type === 'C') {
				previousHandle.x = previousResult.parameters[2];
				previousHandle.y = previousResult.parameters[3];
			} else if (previousResult && previousResult.type === 'Q') {
				previousHandle.x = previousResult.parameters[0];
				previousHandle.y = previousResult.parameters[1];
			} else {
				previousHandle.x = currentPoint.x;
				previousHandle.y = currentPoint.y;
			}

			smoothHandle = {
				x: currentPoint.x - previousHandle.x + currentPoint.x,
				y: currentPoint.y - previousHandle.y + currentPoint.y,
			};

			if (command.type === 'S') {
				result.push({
					type: 'C',
					parameters: [
						smoothHandle.x,
						smoothHandle.y,
						command.parameters[0],
						command.parameters[1],
						command.parameters[2],
						command.parameters[3],
					],
				});
			} else if (command.type === 'T') {
				result.push({
					type: 'Q',
					parameters: [
						smoothHandle.x,
						smoothHandle.y,
						command.parameters[0],
						command.parameters[1],
					],
				});
			}
		} else {
			result.push(command);
		}

		currentPoint = getNewEndPoint(currentPoint, command);
	});

	return result;
}

function convertQuadraticBeziers(commands) {
	let result = [];
	let currentPoint = { x: 0, y: 0 };
	let q0x;
	let q0y;
	let q1x;
	let q1y;
	let q2x;
	let q2y;
	let c1x;
	let c1y;
	let c2x;
	let c2y;

	commands.forEach((command) => {
		if (command.type === 'Q') {
			q0x = currentPoint.x;
			q0y = currentPoint.y;
			q1x = command.parameters[0];
			q1y = command.parameters[1];
			q2x = command.parameters[2];
			q2y = command.parameters[3];

			c1x = q0x + (2 / 3) * (q1x - q0x);
			c1y = q0y + (2 / 3) * (q1y - q0y);

			c2x = q2x + (2 / 3) * (q1x - q2x);
			c2y = q2y + (2 / 3) * (q1y - q2y);

			result.push({ type: 'C', parameters: [c1x, c1y, c2x, c2y, q2x, q2y] });
		} else {
			result.push(command);
		}

		currentPoint = getNewEndPoint(currentPoint, command);
	});

	return result;
}

function convertArcs(commands) {
	let result = [];
	let convertedBeziers = [];
	let currentPoint = { x: 0, y: 0 };

	commands.forEach((command) => {
		if (command.type === 'A') {
			for (let p = 0; p < command.parameters.length; p += 7) {
				convertedBeziers = convertArcToCommandToBezier(
					currentPoint.x,
					currentPoint.y,
					command.parameters[p + 0],
					command.parameters[p + 1],
					command.parameters[p + 2],
					command.parameters[p + 3],
					command.parameters[p + 4],
					command.parameters[p + 5],
					command.parameters[p + 6],
					false
				);

				// log(`Converted Beziers\n${convertedBeziers}`);

				// Split Chains
				for (let i = 0; i < convertedBeziers.length; i += 6) {
					result.push({
						type: 'C',
						parameters: [
							convertedBeziers[i + 0],
							convertedBeziers[i + 1],
							convertedBeziers[i + 2],
							convertedBeziers[i + 3],
							convertedBeziers[i + 4],
							convertedBeziers[i + 5],
						],
					});
				}

				currentPoint = {
					x: convertedBeziers.at(-2),
					y: convertedBeziers.at(-1),
				};
			}
		} else {
			result.push(command);
			currentPoint = getNewEndPoint(currentPoint, command);
		}
	});

	return result;
}

/*
 * Helper Functions
 */
let firstPoint = {};
function setFirstPoint(point) {
	if (!firstPoint.hasOwnProperty('x') && !firstPoint.hasOwnProperty('y')) {
		log(`Setting First Point! ${point.x}, ${point.y}`);
		firstPoint = {
			x: point.x,
			y: point.y,
		};
	}
}

function getNewEndPoint(currentPoint, command) {
	let returnPoint = {
		x: currentPoint.x || 0,
		y: currentPoint.y || 0,
	};

	switch (command.type) {
		case 'Z':
		case 'z':
			break;

		case 'H':
			returnPoint.x = command.parameters.at(-1);
			break;

		case 'V':
			returnPoint.y = command.parameters.at(-1);
			break;

		case 'M':
		case 'L':
		case 'C':
		case 'S':
		case 'A':
		case 'Q':
		case 'T':
			returnPoint.x = command.parameters.at(-2);
			returnPoint.y = command.parameters.at(-1);
			break;

		case 'h':
			for (let p = 0; p < command.parameters.length; p++) {
				returnPoint.x += command.parameters[p];
			}
			break;

		case 'v':
			for (let p = 0; p < command.parameters.length; p++) {
				returnPoint.y += command.parameters[p];
			}
			break;

		case 'm':
		case 'l':
		case 't':
			for (let p = 0; p < command.parameters.length; p += 2) {
				returnPoint.x += command.parameters[p + 0];
				returnPoint.y += command.parameters[p + 1];
			}
			break;

		case 'q':
		case 's':
			for (let p = 0; p < command.parameters.length; p += 4) {
				returnPoint.x += command.parameters[p + 2];
				returnPoint.y += command.parameters[p + 3];
			}
			break;

		case 'c':
			for (let p = 0; p < command.parameters.length; p += 6) {
				returnPoint.x += command.parameters[p + 4];
				returnPoint.y += command.parameters[p + 5];
			}
			break;

		case 'a':
			for (let p = 0; p < command.parameters.length; p += 7) {
				returnPoint.x += command.parameters[p + 5];
				returnPoint.y += command.parameters[p + 6];
			}
			break;
	}

	return returnPoint;
}

function isCommand(c) {
	// log(`isCommand passed ${c}`);
	if ('MmLlCcSsZzHhVvAaQqTt'.indexOf(c) > -1) return true;
	return false;
}
