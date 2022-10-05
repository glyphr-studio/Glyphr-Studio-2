import { makeElement } from '../common/dom';

/**
 * Set up a pattern so web components can link to their
 * CSS file. This path is from the App's point of view,
 * not the control's .js file.
 * @param {string} id - name of the folder + css file
 * @returns {HTMLElement}
 */
export function linkCSS(id) {
	return makeElement({
		tag: 'link',
		attributes: {
			href: `./controls/${id}/${id}.css`,
			rel: 'stylesheet',
			type: 'text/css',
		},
	});
}
