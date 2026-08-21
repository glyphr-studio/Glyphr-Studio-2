import { addAsChildren, makeElement } from '../../common/dom.js';

/**
 * Makes a styled slider element
 * @param {Number} initialValue - what the slider value should be
 * @param {Function | false} callback - what to do when it changes
 * @param {Number} min - min value for the slider
 * @param {Number} max - max value for the slider
 * @param {Number} step - how big each step is
 * @param {Function | false} commitCallback - called when a slider interaction is committed
 * @returns {Element}
 */
export function makeFancySlider(
	initialValue = 50,
	callback,
	min = 0,
	max = 100,
	step = 1,
	commitCallback = false
) {
	// log('makeFancySlider', 'start');

	let wrapper = makeElement({ className: 'fancy-slider__wrapper' });
	let sliderReadout = makeElement({
		className: 'fancy-slider__slider-readout',
		innerHTML: '' + initialValue,
	});

	const normalizedCurrentValue = (initialValue / (max - min)) * 100;

	let bar = makeElement({
		tag: 'input',
		attributes: {
			type: 'range',
			value: initialValue,
			style: `accent-color: hsl(${normalizedCurrentValue + 200}, 100%, 40%);`,
			min: min,
			max: max,
			step: step,
		},
		className: 'fancy-slider__bar',
	});
	bar.addEventListener('input', (event) => {
		// @ts-expect-error 'property does exist'
		const value = parseInt(event.target.value);
		sliderReadout.innerHTML = '' + value;

		const normalizedCurrentValue = (value / (max - min)) * 100;
		bar.setAttribute('style', `accent-color: hsl(${normalizedCurrentValue + 200}, 100%, 40%);`);
		if (callback) callback(value);
	});
	bar.addEventListener('change', (event) => {
		if (commitCallback) commitCallback(Number(event.target.value));
	});

	addAsChildren(wrapper, [bar, sliderReadout]);

	// log('makeFancySlider', 'end');
	return wrapper;
}
