/**
 * XML to JSON does exactly what it sounds like.
 * Feed it an XML string, and it converts the data
 * to JSON format.
 * @param {String} inputXML - XML data
 * @return {Object} - Javascript object
 */
export function XMLtoJSON(inputXML) {
	let xmlDoc;
	let xmlError;

	if (typeof window.DOMParser !== 'undefined') {
		xmlDoc = new window.DOMParser().parseFromString(inputXML, 'text/xml');
	} else if (
		typeof window.ActiveXObject !== 'undefined' &&
		new window.ActiveXObject('Microsoft.XMLDOM')
	) {
		xmlDoc = new window.ActiveXObject('Microsoft.XMLDOM');
		xmlDoc.async = 'false';
		xmlDoc.loadXML(inputXML);
	} else {
		console.warn('No XML document parser found.');
		xmlError = new SyntaxError('No XML document parser found.');
		throw xmlError;
	}

	const error = xmlDoc.getElementsByTagName('parserError');
	if (error.length) {
		const message = xmlDoc.getElementsByTagName('div')[0].innerHTML;
		xmlError = new SyntaxError(trim(message));
		throw xmlError;
	}

	const result = {
		name: xmlDoc.documentElement.nodeName,
		attributes: tag_getAttributes(xmlDoc.documentElement.attributes),
		content: tag_getContent(xmlDoc.documentElement),
	};

	return result;
}

function tag_getContent(parent) {
	const kids = parent.childNodes;

	if (kids.length === 0) return trim(parent.nodeValue);

	const result = [];
	let tagResult;
	let tagContent;
	let tagAttributes;

	for (const node of kids) {
		tagResult = {};
		if (node.nodeName === '#comment') continue;

		tagContent = tag_getContent(node);
		tagAttributes = tag_getAttributes(node.attributes);

		if (node.nodeName === '#text' && JSON.stringify(tagAttributes) === '{}') {
			tagResult = trim(tagContent);
		} else {
			tagResult.name = node.nodeName;
			tagResult.attributes = tagAttributes;
			tagResult.content = tagContent;
		}

		if (tagResult !== '') result.push(tagResult);
	}

	return result;
}

function tag_getAttributes(attributes) {
	if (!attributes || !attributes.length) return {};

	const result = {};

	for (const attribute of attributes) {
		result[attribute.name] = trim(attribute.value);
	}

	return result;
}

function trim(text) {
	try {
		text = text.replace(/^\s+|\s+$/g, '');
		return text.replace(/(\r\n|\n|\r|\t)/gm, '');
	} catch (e) {
		return '';
	}
}
