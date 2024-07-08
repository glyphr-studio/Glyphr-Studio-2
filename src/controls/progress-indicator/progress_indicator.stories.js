import { makeProgressIndicator, updateProgressIndicator } from "./progress_indicator";

export default {
	title: 'Controls/Progress Indicator',
	render: () => {
		const bar = makeProgressIndicator();
		setInterval(fakeProgress, 500);
		return bar;
	},
};

export const Primary = {};

let counter = 0;
function fakeProgress() {
	counter++;
	updateProgressIndicator(`Update message ${counter}`);
}
