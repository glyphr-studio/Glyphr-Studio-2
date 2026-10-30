/** Accept a number, decimal string, 0x-prefixed hex string, or U+ notation. */
export function normalizeCodePoint(value) {
	let point;
	if (typeof value === 'number') point = value;
	else if (typeof value === 'string') {
		if (/^0x[0-9a-f]+$/i.test(value)) point = Number(value);
		else if (/^U\+[0-9a-f]+$/i.test(value)) point = parseInt(value.substring(2), 16);
		else if (/^\d+$/.test(value)) point = Number(value);
	}
	return Number.isInteger(point) && point >= 0 && point <= 0x10ffff ? point : undefined;
}

/** GS-style unpadded hexadecimal ID, or undefined for invalid input. */
export function decToHex(value) {
	const point = normalizeCodePoint(value);
	return point === undefined ? undefined : `0x${point.toString(16).toUpperCase()}`;
}
