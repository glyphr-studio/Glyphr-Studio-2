import { makeFancySlider } from './fancy_slider.js';

export default {
	title: 'Controls/Fancy Slider',
	render: (args) => {
		const slider = makeFancySlider(args.initialValue, false, args.min, args.max, args.step);
		return slider;
	},
};

export const Primary = {
	args: {
		initialValue: 50,
		min: 0,
		max: 100,
		step: 1,
	}
};

export const LargeStep = {
	args: {
		initialValue: 50,
		min: 0,
		max: 100,
		step: 10,
	}
};

export const SmallRange = {
	args: {
		initialValue: 1,
		min: 0,
		max: 5,
		step: 1,
	}
}