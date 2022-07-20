export { makeNavButton };

function makeNavButton(properties = {}) {
	let title = properties.title || 't i t l e';
	let superTitle = properties.superTitle || 's u p e r t i t l e';
	let level = properties.level || '';


	return `
		<button class="nav-button${level? ` ${level}` : ''}">
			<span class="nav-button__super-title">${superTitle}</span>
			<span class="nav-button__title">${title}</span>
		</button>
	`;
}