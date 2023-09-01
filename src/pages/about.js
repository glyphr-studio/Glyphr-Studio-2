import { addAsChildren, makeElement, textToNode } from '../common/dom.js';
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
			Copyright © 2020 Frederik De Bleser
		</div>

		<div class="page__card">
			<h3>SVG-to-Bézier</h3>
			<a href="https://github.com/mattlag/SVG-to-Bezier" target="_blank">github.com/mattlag/SVG-to-Bezier</a>
			<br><br>
			XMLtoJSON is licensed under a
			<a href='https://www.gnu.org/licenses/gpl.html' target='_blank'>GNU General Public License</a>.
			<br><br>
			Copyright © 2023 Matthew LaGrandeur
		</div>

		<div class="page__card">
			<h3>XMLtoJSON</h3>
			<a href="https://github.com/mattlag/XMLtoJSON" target="_blank">github.com/mattlag/XMLtoJSON</a>
			<br><br>
			XMLtoJSON is licensed under a
			<a href='https://www.gnu.org/licenses/gpl.html' target='_blank'>GNU General Public License</a>.
			<br><br>
			Copyright © 2023 Matthew LaGrandeur
		</div>

		<div class="page__card">
			<h3>Spell Checker Oriented Word List (SCOWL)</h3>
			<a href="https://github.com/en-wl/wordlist" target="_blank">github.com/en-wl/wordlist</a>
			<br><br>
			SCOWL word lists were used to generate the Glyphr Studio letter pair coverage live preview texts.
			SCOWL is derived from many sources under a BSD compatible license. The combined work is freely available under a
			<a href='https://raw.githubusercontent.com/kevina/wordlist/master/scowl/Copyright' target='_blank'>MIT-like</a> license.
			<br><br>
			Copyright © 2000-2018 Kevin Atkinson
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
		`,
	});

	return content;
}

export function makePreReleaseNote(showLogo = false) {
	let logo = '';
	if (showLogo) {
		logo = `<div class="about-page__logo">
		${logoVertical}
		</div><br><br>`;
	}
	const content = makeElement({
		innerHTML: `
		${logo}
		<h2>Welcome to Beta-1!</h2>
		<p>
			We are very excited that Glyphr Studio v2 is nearing completion... but it's not
			quite there yet.  We need your help trying out the app to make sure all the
			scenarios are solid!
		</p>
		<br>

		<a href="https://www.glyphrstudio.com/blog/2023/06/01/v2-beta-1-mega-post/" target="_blank" style="font-size: 1.2em;">
			Read the Beta-1 blog post for details
		</a>
		<br>
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
