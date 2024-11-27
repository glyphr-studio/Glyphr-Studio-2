import { beforeEach, describe, it } from 'vitest';
import { Navigator } from '../navigator.js';

describe('Navigator: Page Navigation', () => {
	let navigator;

	beforeEach(() => {
		navigator = new Navigator();
	});

	it('Should have a default page of "Overview"', () => {
		expect(navigator.page).toBe('Overview');
	});

	it('Should have a default panel of "Attributes"', () => {
		expect(navigator.panel).toBe('Attributes');
	});

	it('Navigate to page: Characters', () => {
		navigator.page = 'Characters';
		navigator.navigate(true);
		const pageContent = navigator.makePageContent();
		expect(pageContent.id).toBe('app__main-content');
		expect(pageContent.querySelector('.nav-button__title').innerHTML).toBe('Characters');
	});

	it('Navigate to page: Ligatures', () => {
		navigator.page = 'Ligatures';
		navigator.navigate(true);
		const pageContent = navigator.makePageContent();
		expect(pageContent.id).toBe('app__main-content');
		expect(pageContent.querySelector('.nav-button__title').innerHTML).toBe('Ligatures');
	});

	it('Navigate to page: Components', () => {
		navigator.page = 'Components';
		navigator.navigate(true);
		const pageContent = navigator.makePageContent();
		expect(pageContent.id).toBe('app__main-content');
		expect(pageContent.querySelector('.nav-button__title').innerHTML).toBe('Components');
	});

	it('Navigate to page: Kerning', () => {
		navigator.page = 'Kerning';
		navigator.navigate(true);
		const pageContent = navigator.makePageContent();
		expect(pageContent.id).toBe('app__main-content');
		expect(pageContent.querySelector('.nav-button__title').innerHTML).toBe('Kerning');
	});

	// it('Navigate to page: Live preview', () => {
	// 	navigator.page = 'Live preview';
	// 	navigator.navigate(true);
	// 	const pageContent = navigator.makePageContent();
	// 	expect(pageContent.id).toBe('app__main-content');
	// 	expect(pageContent.querySelector('.nav-button__title').innerHTML).toBe('Live preview');
	// });

	it('Navigate to page: Global actions', () => {
		navigator.page = 'Global actions';
		navigator.navigate(true);
		const pageContent = navigator.makePageContent();
		expect(pageContent.id).toBe('app__main-content');
		expect(pageContent.querySelector('.nav-button__title').innerHTML).toBe('Global actions');
	});

	it('Navigate to page: Settings', () => {
		navigator.page = 'Settings';
		navigator.navigate(true);
		const pageContent = navigator.makePageContent();
		expect(pageContent.id).toBe('app__main-content');
		expect(pageContent.querySelector('.nav-button__title').innerHTML).toBe('Settings');
	});

	it('Navigate to page: Help', () => {
		navigator.page = 'Help';
		navigator.navigate(true);
		const pageContent = navigator.makePageContent();
		expect(pageContent.id).toBe('app__main-content');
		expect(pageContent.querySelector('.nav-button__title').innerHTML).toBe('Help');
	});

	it('Navigate to page: About', () => {
		navigator.page = 'About';
		navigator.navigate(true);
		const pageContent = navigator.makePageContent();
		expect(pageContent.id).toBe('app__main-content');
		expect(pageContent.querySelector('.nav-button__title').innerHTML).toBe('About');
	});
});

/*
describe('Navigator: Panel Navigation', () => {
	let navigator;

	beforeEach(() => {
		navigator = new Navigator();
	});

	it('Navigate to panel: Layers', () => {
		navigator.page = 'Characters';
		navigator.panel = 'Layers';
		navigator.navigate(true);
		const pageContent = navigator.makePageContent();
		expect(pageContent.querySelector('#nav-button-l3 .nav-button__title').innerHTML).toBe('Layers');
	});

	it('Navigate to panel: Context characters', () => {
		navigator.page = 'Characters';
		navigator.panel = 'Context characters';
		navigator.navigate(true);
		const pageContent = navigator.makePageContent();
		expect(pageContent.querySelector('#nav-button-l3 .nav-button__title').innerHTML).toBe('Context characters');
	});

	it('Navigate to panel: History', () => {
		navigator.page = 'Characters';
		navigator.panel = 'History';
		navigator.navigate(true);
		const pageContent = navigator.makePageContent();
		expect(pageContent.querySelector('#nav-button-l3 .nav-button__title').innerHTML).toBe('History');
	});

	it('Navigate to panel: Guides', () => {
		navigator.page = 'Characters';
		navigator.panel = 'Guides';
		navigator.navigate(true);
		const pageContent = navigator.makePageContent();
		expect(pageContent.querySelector('#nav-button-l3 .nav-button__title').innerHTML).toBe('Guides');
	});
});
*/
