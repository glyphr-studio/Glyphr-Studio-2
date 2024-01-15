import { emailLink } from '../app/app.js';
import { getCurrentProjectEditor } from '../app/main.js';
import { addAsChildren, makeElement } from '../common/dom.js';
import donateKofiSrc from '../common/graphics/donate-kofi.png';
import donatePaypalSrc from '../common/graphics/donate-paypal.png';
import logoVertical from '../common/graphics/logo-wordmark-vertical.svg?raw';
import { TabControl } from '../controls/tabs/tab_control.js';
import { makeNavButton, toggleNavDropdown } from '../project_editor/navigator.js';

/**
 * Page > About
 * Information about Glyphr Studio
 */
export function makePage_About() {
	const content = makeElement({
		tag: 'div',
		id: 'app__page',
		innerHTML: `
		<div class="content__page">
			<div class="content-page__left-area">
				<div class="content-page__nav-area">
					${makeNavButton({ level: 'l1', superTitle: 'PAGE', title: 'About' })}
				</div>
				<div id="content-page__panel"></div>
			</div>
			<div class="content-page__right-area"></div>
		</div>
	`,
	});

	// Page Selector
	let l1 = content.querySelector('#nav-button-l1');
	l1.addEventListener('click', function () {
		toggleNavDropdown(l1);
	});

	const rightArea = content.querySelector('.content-page__right-area');
	const tabControl = new TabControl(rightArea);

	tabControl.registerTab('Version', makeVersionInfo());
	tabControl.registerTab('Contact and socials', makeContactInfo());
	tabControl.registerTab('License', makeLicenseInfo());

	tabControl.selectTab('Version');

	const panelArea = content.querySelector('#content-page__panel');
	addAsChildren(panelArea, [tabControl.makeTabs(), makeContributeCard()]);

	return content;
}

function makeLicenseInfo() {
	const content = makeElement({
		innerHTML: `
		<h1>License</h1>
		<h2>The Glyphr Studio App</h2>
		<br>
		<div class="page__card">
			<h3>Glyphr Studio</h3>
			<a href="https://www.glyphrstudio.com/" target="_blank">glyphrstudio.com</a>
			<br><br>
			The Glyphr Studio App is licensed under a
			<a href='https://www.gnu.org/licenses/gpl.html' target='_blank'>GNU General Public License</a>,
			which is a free / open source 'copyleft' license. You are free to use, distribute,
			and modify Glyphr Studio as long as this license and its freeness stays intact.
			<br><br>
			Copyright © 2010 - 2024 Matthew LaGrandeur
		</div>

		<br><br><br>
		<h2>Fonts you create</h2>
		<p>
			Any font you create belongs 100% to you, and you must decide how to license it.<br>
			You can find out <a href="https://www.glyphrstudio.com/help/about/licensing.html" target="_blank">
			more about licensing on the Help site</a>.
		</p>

		<br>
		<h2>Libraries</h2>
		<p>Glyphr Studio includes the following 3rd party libraries:</p>

		<div class="page__card">
			<h3>opentype.js</h3>
			<a href="https://opentype.js.org/" target="_blank">opentype.js.org</a>
			<br><br>
			Available on
			<a href="https://github.com/opentypejs/opentype.js" target="_blank">GitHub</a>
			under a
			<a href="https://raw.github.com/opentypejs/opentype.js/master/LICENSE" target="_blank">MIT License</a>.
			<br><br>
			Copyright © 2020 Frederik De Bleser
		</div>

		<div class="page__card">
			<h3>SVG-to-Bézier</h3>
			<a href="https://github.com/mattlag/SVG-to-Bezier" target="_blank">github.com/mattlag/SVG-to-Bezier</a>
			<br><br>
			Licensed under a
			<a href='https://www.gnu.org/licenses/gpl.html' target='_blank'>GNU General Public License</a>.
			<br><br>
			Copyright © 2024 Matthew LaGrandeur
		</div>

		<div class="page__card">
			<h3>XMLtoJSON</h3>
			<a href="https://github.com/mattlag/XMLtoJSON" target="_blank">github.com/mattlag/XMLtoJSON</a>
			<br><br>
			Licensed under a
			<a href='https://www.gnu.org/licenses/gpl.html' target='_blank'>GNU General Public License</a>.
			<br><br>
			Copyright © 2024 Matthew LaGrandeur
		</div>

		<br>
		<br>
		<h2>Related projects</h2>
		<p>Check out these projects related to typeface design:</p>

		<div class="page__card">
			<h3>Unicode Ninja</h3>
			<a href="https://unicode.ninja" target="_blank">unicode.ninja</a>
			<br><br>
			Unicode Ninja lets you explore the Unicode Basic Multilingual Plane. Browse through all character ranges, either
			sorted numerically or categorized. Search for individual characters by name, and copy their HTML codes to your clipboard.
		</div>
	`,
	});

	return content;
}

function makeVersionInfo() {
	const editor = getCurrentProjectEditor();
	const app = window._GlyphrStudioApp;
	const content = makeElement({
		innerHTML: `
			<h1>Version information</h1>
			<div class="page__card">
				<h3>Glyphr Studio App</h3>
				<label>Version name:</label> ${app.versionName}<br>
				<label>Version number:</label> ${app.version}<br>
				<label>Last updated on:</label> ${
					app.versionDate ? new Date(app.versionDate).toDateString() : '[n/a - dev edition]'
				}
			</div>

			<div class="page__card">
				<h3>This Glyphr Studio Project</h3>
				<label>Project name:</label> ${editor.project.settings.project.name}<br>
				<label>Unique project ID:</label> ${editor.project.settings.project.id}<br>
				<label>Initially created with:</label> Version ${
					editor.project.settings.project.initialVersion
				}</span>
			</div>

			<br><br>
			<h1>Release Note</h1>
		`,
	});

	content.appendChild(makeReleaseNote());
	return content;
}

export function makeReleaseNote(showLogo = false) {
	let logo = '';
	if (showLogo) {
		logo = `<div class="about-page__logo">
		${logoVertical}
		</div><br><br>`;
	}
	const content = makeElement({
		innerHTML: `
		${logo}
		<h2>Welcome to Version 2!</h2>
		<p>
			It's been a long road, but Glyphr Studio Version 2 is finally complete! I'm sure we will continue to find bugs and think of new feature improvements.
			Even since v2 Beta 2.1 (the previous release) there was a lot of updates. You can read
			about recent and cumulative v2 updates over at the blog:
			<br>
			<a href="https://www.glyphrstudio.com/blog/?p=371" target="_blank" style="font-size: 1.2em;">
				Glyphr Studio Blog: Version 2 is here!
			</a>
		</p>
		<br>
		<h3>Transition from v1 to v2</h3>
		<p>
			On January 15th, 2024, the default experience for Glyphr Studio was switched from v1 to v2.
			This change affected the app itself, and also supporting materials like the blog, the main site, and the help and tutorial sites. 
			<br>
			<a href="https://www.glyphrstudio.com/blog/?p=372" target="_blank" style="font-size: 1.2em;">Glyphr Studio Blog: V1 to V2 transition plan</a>
		</p>
		<br>

		<p>
			If you find any bugs, or have an suggestions about functionality, please email us!
			${emailLink()}
		</p>
	`,
	});

	return content;
}

export function makeContributeCard() {
	const content = makeElement({
		className: 'panel__card full-width more-padding',
	});
	content.appendChild(makeContributeContent());
	return content;
}

export function makeContributeContent() {
	return makeElement({
		tag: 'div',
		attributes: { style: 'margin: 20px;' },
		innerHTML: `
			<h3>Contribute!</h3>
			If you want to give back to Glyphr Studio, there are two huge ways you can make it better!
			<br>
			<ul>
				<li>
					<strong>Send Feedback</strong> -
					Use new features and let us know if you run into issues.  Follow us on
					<a href="https://typo.social/@glyphrstudio" target="_blank">Mastodon</a>,
					<a href="https://www.reddit.com/r/GlyphrStudio/" target="_blank">Reddit</a>, or
					<a href="https://twitter.com/glyphrstudio" target="_blank">Twitter</a>.
					Read the <a href="http://www.glyphrstudio.com/blog/" target="_blank">blog</a>,
					and participate in discussions. Be vocal, and let us know what we should do next!
					<br>
				</li>
				<li>
					<strong>Make a Monetary Contribution</strong> -
					Glyphr Studio will always be free, and we think that is very important.  But, it does take some
					money to keep it going.	Contributions of even small amounts of money help keep the Glyphr Studio
					effort going strong!
					<br><br>
				</li>
			</ul>

			<a href="https://ko-fi.com/glyphrstudio" target="_blank" class="donateLinkButton">
				<img src="${donateKofiSrc}" alt="Support me on Ko-fi" /></a>

			<a href="https://www.paypal.com/donate/?hosted_button_id=35R85K8X5MGFQ" target="_blank" class="donateLinkButton">
				<img src="${donatePaypalSrc}" alt="PayPal - The safer, easier way to pay online!" /></a>
			`,
	});
}

function makeContactInfo() {
	const content = makeElement({
		innerHTML: `
			<h1>Contact and socials</h1>

			<div class="about-page__contact-table">
				<h2>Web</h2>
				<span>Main site:</span>
				<a href="https://www.glyphrstudio.com" target="_blank">glyphrstudio.com</a>

				<span>Email:</span>
				${emailLink()}

				<span>Help for Glyphr Studio v2:</span>
				<a href="https://www.glyphrstudio.com/help" target="_blank">glyphrstudio.com/help</a>

				<span>Blog:</span>
				<a href="http://www.glyphrstudio.com/blog/" target="_blank">glyphrstudio.com/blog</a>

				<h2>Socials</h2>
				<span>Mastodon:</span>
				<a href="https://typo.social/@glyphrstudio" target="_blank">@glyphrstudio@typo.social</a>

				<span>Reddit:</span>
				<a href="https://www.reddit.com/r/GlyphrStudio/" target="_blank">reddit.com/r/GlyphrStudio</a>

				<span>Twitter:</span>
				<a href="https://twitter.com/glyphrstudio" target="_blank">@glyphrstudio</a>

				<h2>Source code</h2>

				<span>GitHub:</span>
				<a href="https://github.com/glyphr-studio" target="_blank">github.com/glyphr-studio</a>
			</div>
		`,
	});

	return content;
}
