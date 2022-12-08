import { addAsChildren, makeElement } from '../common/dom.js';
import { makeErrorMessageBox } from './dialogs.js';

// Spinner Animation
let degrees = 0;

export function updateImportStatus(message) {
	const container = document.getElementById('loading-spinner__message');
	const sweep = document.getElementById('loading-spinner__sweep');

	degrees = (degrees + 2) % 360;
	sweep.style.transform = 'rotate(' + degrees + 'deg)';
	if (message) container.innerHTML = message;
}

export function makeLoadingSpinner() {
	// log('makeLoadingSpinner', 'start');

	let wrapper = makeElement({ className: 'loading-spinner__wrapper' });
	let message = makeElement({ id: 'loading-spinner__message', innerHTML: 'Reading font data...' });
	let spinner = makeElement({ id: 'loading-spinner__spinner' });
	let sweep = makeElement({
		tag: 'img',
		id: 'loading-spinner__sweep',
		attributes: {
			src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAu9JREFUeNrsWMtu00AU9TNOkyakjxSXlj4gIPESYsdjg8SGDSyRWCCxgQ9gh9Qt38LX8AHtCj4AKE1aEzuOuSOdka4uTqxCbHcxRzoa2+PEc+bce30T21ow4knWpKFHdNjlHWKC45S4TPxJ/K7Y8Ozkf5/rWYtHJkRIuMRt4grxGsTHNBySoK8XSUjR7io3YnHtLnGXBA1p/EKCjs77ULsEIWqHwzmhtUYM2NwGsYGQs9g9n8/jkGOVg0lBaHG0hIgruPaWNuQ5cq42IeM5c4EIbX7uo1BoYQ+J70jMRl1C0jlzPjteJ56w8y3isbj/CfEjibl60YTwvOyKEPPFvfvEEeY+zBNTihBK0lmh1WNhtyRyaZN4Ks4dtilaTFilI7PKsNrxKY77xIhVKelUh3gm8ukB8YDEtKsUkhbkR4Md99miW3BjyOY7eHmeoJS/rtsRly0sYeX2lAndFwWgkyPsJblyr04hAatWMRa+yty7TvzB7g/BYU5H8qkuIR76MB5iW2zhN1GhNHYRZiPxPeoze8pJcuVF6UKocqU5PVaEluQMiwxYhRrDGSX4Bo4jUfEGKAo6n95X4YglmsOmaEl2EDJruBajJA/gQso+p0LuEgRMeYkmV55WIWQiQku3JGrxv1Fm17FAldTqhfeL3b+NUIpyQtWFS2/KauNnlWCbtSS3Uak2ca4Sus2Suo/fKyMRXvod0wSVONVYdr2KQ6uLKjVEch8jxDy40oNbY5HkS3CsgdDKhEOPyxaSsER32KJChNYAY4YXHk9wF3nRYu7O6uHulCqEKteUbJ/CjRWETBu7uofwCjEfseqkQ2dc0IC6cPNZ2Y7ohHewwBDjKt4lujVxUZabuD/L+U0TsILhY9QuP6pCSIIF3yJeRg74SP5liNKhk2DOxRjg2C14Rq8qIfchpIsc8VjFbLCF+//6ELtsFZQjale/sf+6MhEWC0EVQtRL7pVlYGBgYGBgYGBgYGBgYGBgYGBg8Bf+CDAAUF2+ry6GVycAAAAASUVORK5CYII=',
		},
	});
	let error = makeErrorMessageBox();

	addAsChildren(wrapper, [message, spinner, sweep, error]);

	// log('makeLoadingSpinner', 'end');
	return wrapper;
}
