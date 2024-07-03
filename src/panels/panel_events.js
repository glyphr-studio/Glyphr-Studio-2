import { getKeyFromEvent } from '../edit_canvas/events_keyboard.js';

// --------------------------------------------------------------
// Global
// --------------------------------------------------------------

export const panelsEventHandlerData = {
	isCtrlDown: false,
	isSpaceDown: false,
	isShiftDown: false,
	isAltDown: false,
};

// --------------------------------------------------------------
// Key Down
// --------------------------------------------------------------

export function handlePanelsKeyPress(event) {
	// log('handlePanelsKeyPress', 'start');
	const key = getKeyFromEvent(event);
	// log(`KEY ${key} from ${event.which}`);
	// log(event);
	handlePanelsSpecialKeys(key, 'down');
	// log(`ehd.isCtrlDown: ${ehd.isCtrlDown}`);
	// log(`handlePanelsKeyPress`, 'end');
}

// --------------------------------------------------------------
// Key Up
// --------------------------------------------------------------

export function handlePanelsKeyUp(event) {
	// log(`handleKeyup`, 'start');
	let key = getKeyFromEvent(event);
	// log(`KEY ${key} from ${event.which}`);
	// log(event);
	handlePanelsSpecialKeys(key, 'up');
	// log(`handleKeyup`, 'end');
}

function handlePanelsSpecialKeys(key, keyDirection) {
	// log(`handlePanelsSpecialKeys`, 'start');
	// log(`key: ${key}`);
	// log(`keyDirection: ${keyDirection}`);

	const ehd = panelsEventHandlerData;

	// Maybe not strong equals here?
	if (keyDirection === 'down') {
		if (key === 'Control') {
			ehd.isCtrlDown = true;
			// log(`setting isCtrlDown to true`);
		}
		if (key === 'Space') {
			ehd.isSpaceDown = true;
			// log(`setting isSpaceDown to true`);
		}
		if (key === 'Shift') {
			ehd.isShiftDown = true;
			// log(`setting isShiftDown to true`);
		}
		if (key === 'Alt') {
			ehd.isAltDown = true;
			// log(`setting isAltDown to true`);
		}
	}

	if (keyDirection === 'up') {
		if (key === 'Control') {
			ehd.isCtrlDown = false;
			// log(`setting isCtrlDown to false`);
		}
		if (key === 'Space') {
			ehd.isSpaceDown = false;
			// log(`setting isSpaceDown to false`);
		}
		if (key === 'Shift') {
			ehd.isShiftDown = false;
			// log(`setting isShiftDown to false`);
		}
		if (key === 'Alt') {
			ehd.isAltDown = false;
			// log(`setting isAltDown to false`);
		}
	}

	// log(`handlePanelsSpecialKeys`, 'end');
}
