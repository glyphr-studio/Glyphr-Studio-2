import { Navigator } from '../navigator.js';

describe('Navigator', () => {
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

	it('Navigate to page: Ligatures', () => {
		navigator.page = 'Ligatures';
		navigator.navigate();
		const pageContent = navigator.makePageContent();
		expect(pageContent.id).toBe('app__main-content');
		expect(pageContent.querySelector('.nav-button__title').innerHTML).toBe('Ligatures');
	});

	it('Navigate to page: Components', () => {
		navigator.page = 'Components';
		navigator.navigate();
		const pageContent = navigator.makePageContent();
		expect(pageContent.id).toBe('app__main-content');
		expect(pageContent.querySelector('.nav-button__title').innerHTML).toBe('Components');
	});

	it('Navigate to page: Kerning', () => {
		navigator.page = 'Kerning';
		navigator.navigate();
		const pageContent = navigator.makePageContent();
		expect(pageContent.id).toBe('app__main-content');
		expect(pageContent.querySelector('.nav-button__title').innerHTML).toBe('Kerning');
	});

	it('Navigate to page: Global actions', () => {
		navigator.page = 'Global actions';
		navigator.navigate();
		const pageContent = navigator.makePageContent();
		expect(pageContent.id).toBe('app__main-content');
		expect(pageContent.querySelector('.nav-button__title').innerHTML).toBe('Global actions');
	});

	it('Navigate to page: Settings', () => {
		navigator.page = 'Settings';
		navigator.navigate();
		const pageContent = navigator.makePageContent();
		expect(pageContent.id).toBe('app__main-content');
		expect(pageContent.querySelector('.nav-button__title').innerHTML).toBe('Settings');
	});

	it('Navigate to page: Help', () => {
		navigator.page = 'Help';
		navigator.navigate();
		const pageContent = navigator.makePageContent();
		expect(pageContent.id).toBe('app__main-content');
		expect(pageContent.querySelector('.nav-button__title').innerHTML).toBe('Help');
	});

	it('Navigate to page: About', () => {
		navigator.page = 'About';
		navigator.navigate();
		const pageContent = navigator.makePageContent();
		expect(pageContent.id).toBe('app__main-content');
		expect(pageContent.querySelector('.nav-button__title').innerHTML).toBe('About');
	});

});
