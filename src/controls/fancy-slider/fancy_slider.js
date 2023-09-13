import { addAsChildren, makeElement } from '../../common/dom.js';

export function makeFancySlider(initialValue = 50, callback = false, min = 0, max = 100, step = 1) {
	// log('makeFancySlider', 'start');

	let wrapper = makeElement({ className: 'fancy-slider__wrapper' });
	let sliderReadout = makeElement({
		className: 'fancy-slider__slider-readout',
		innerHTML: initialValue,
	});
	let bar = makeElement({
		tag: 'input',
		attributes: {
			type: 'range',
			value: initialValue,
			style: `accent-color: hsl(${initialValue + 200}, 100%, 40%);`,
			min: min,
			max: max,
			step: step,
		},
		className: 'fancy-slider__bar',
	});
	bar.addEventListener('input', (event) => {
		const value = parseInt(event.target.value);
		sliderReadout.innerHTML = value;
		bar.setAttribute('style', `accent-color: hsl(${value + 200}, 100%, 40%);`);
		if (callback) callback(value);
	});

	addAsChildren(wrapper, [bar, sliderReadout]);

	// log('makeFancySlider', 'end');
	return wrapper;
}
