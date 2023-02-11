import { addAsChildren, makeElement } from '../common/dom.js';
import { makeNavButton, toggleNavDropdown } from '../project_editor/navigator.js';
import { getCurrentProjectEditor } from '../app/main.js';
import { emailLink } from '../app/app.js';
import logoVertical from '../common/graphics/logo-wordmark-vertical.svg?raw';
import donateKofiSrc from '../common/graphics/donate-kofi.png';
import donatePaypalSrc from '../common/graphics/donate-paypal.png';
import { TabControl } from '../controls/tabs/tab_control.js';

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

	tabControl.registerTab('Release note', makePreReleaseNote(true));
	tabControl.registerTab('Contact and socials', makeContactInfo());
	tabControl.registerTab('Version', makeVersionInfo());
	tabControl.registerTab('License', makeLicenseInfo());

	tabControl.selectTab('Release note');

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
			Copyright © 2010 - 2023 Matthew LaGrandeur
		</div>

		<br><br><br>
		<h2>Fonts you create</h2>
		<p>
			Any font you create belongs 100% to you, and you must decide how to license it.<br>
			You can find out <a href="https://www.glyphrstudio.com/v2/help/about/licensing.html" target="_blank">
			more about licensing on the Help site</a>.
		</p>

		<br>
		<h2>Libraries</h2>
		<p>Glyphr Studio includes the following 3rd party libraries:</p>

		<div class="page__card">
			<h3>opentype.js</h3>
			<a href="https://opentype.js.org/" target="_blank">opentype.js.org</a>
			<br><br>
			opentype.js is available on
			<a href="https://github.com/opentypejs/opentype.js" target="_blank">GitHub</a>
			under the
			<a href="https://raw.github.com/opentypejs/opentype.js/master/LICENSE" target="_blank">MIT License</a>.
			<br><br>
			Copyright © 2020 Frederik De Bleser.
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
				<label>Last updated on:</label> ${new Date(app.versionDate).toDateString()}.
			</div>

			<div class="page__card">
				<h3>This Glyphr Studio Project</h3>
				<label>Project name:</label> ${editor.project.settings.project.name}<br>
				<label>Unique project ID:</label> ${editor.project.settings.project.id}<br>
				<label>Initially created with:</label> Version ${
					editor.project.settings.project.initialVersion
				}</span>
			</div>
		`,
	});

	return content;
}

export function makePreReleaseNote(showLogo = false) {
	const content = makeElement({
		innerHTML: `
		${
			showLogo
				? `
				<div class="about-page__logo">
					${logoVertical}
				</div>
				<br><br>
			`
				: ''
		}
		<h1>Welcome to Alpha-2!</h1>
		<p>
			What is an alpha? Currently, Glyphr Studio v2 does not
			have enough features to be considered a usable product, and the code base is
			evolving so quickly that it may not be totally stable. But, there
			are still some features that we'd love to get feedback on, and probably some
			bugs that we still haven't found.
		</p>
		<br>

		<h3>
			There is a ton of information over on the blog:<br>
			<a href="https://www.glyphrstudio.com/blog/2022/11/02/v2-alpha-1-mega-post/" target="_blank">Alpha-1 MEGA POST</a>
			<br>
			<a href="https://www.glyphrstudio.com/blog/2023/02/01/v2-alpha-2-mega-post/" target="_blank">Alpha-2 MEGA POST</a>
		</h3>

		<br><br>
		<strong>For Alpha-1 and Alpha-2, please try the following scenarios:</strong>
		<ul>
			<li>Open and Save Glyphr Studio v2 Project files (.gs2)</li>
			<li>Import other font formats, like OTF, TTF, WOFF, and SVG Fonts.</li>
			<li>Export OTF and SVG Fonts</li>
			<li>Navigate around using the upper-left Page Chooser, Glyph Chooser, and Panel Chooser.</li>
			<li>On the Glyph Edit page, use all the various panels and tools to edit or create shapes.</li>
			<li>Use the Live Preview page to view your font in sentences or blocks of text.</li>
			<li>Use the Settings page to adjust options for the App, your Project, and your Font.</li>
		</ul>

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
		innerHTML: `
	<h3>Contribute!</h3>
	If you think Glyphr Studio is pretty cool, there are two huge ways you can make it better!
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

	return content;
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
				<a href="https://www.glyphrstudio.com/v2/help" target="_blank">glyphrstudio.com/v2/help</a>

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
