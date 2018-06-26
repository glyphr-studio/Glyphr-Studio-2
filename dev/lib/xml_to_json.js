/* exported XMLtoJSON */
/* eslint-disable no-console */
/**
 * XML to JSON does exactly what it sounds like.
 * Feed it an XML string, and it converts the data
 * to JSON format.
 * @param {string} inputXML - XML data
 * @return {string}
 */
export default function XMLtoJSON(inputXML){
    var console_debug = false;
    var XMLdoc, XMLerror;
    // log('convertXMLtoJSON \t PASSED\n' + inputXML);

    if (typeof window.DOMParser !== 'undefined') {
        XMLdoc = (new window.DOMParser()).parseFromString(inputXML, 'text/xml');
    } else if (typeof window.ActiveXObject !== 'undefined' && new window.ActiveXObject('Microsoft.XMLDOM')) {
        XMLdoc = new window.ActiveXObject('Microsoft.XMLDOM');
        XMLdoc.async = 'false';
        XMLdoc.loadXML(inputXML);
    } else {
        console.warn('No XML document parser found.');
        XMLerror = new SyntaxError('No XML document parser found.');
        throw XMLerror;
    }

    var parsererror = XMLdoc.getElementsByTagName('parsererror');
    if (parsererror.length) {
        var msgcon = XMLdoc.getElementsByTagName('div')[0].innerHTML;
        XMLerror = new SyntaxError(trim(msgcon));
        throw XMLerror;
    }

    return {
        'name' : XMLdoc.documentElement.nodeName,
        'attributes' : tag_getAttributes(XMLdoc.documentElement.attributes),
        'content' : tag_getContent(XMLdoc.documentElement)
    };


    function tag_getContent(parent) {
        var kids = parent.childNodes;
        // log('\nTAG: ' + parent.nodeName + '\t' + parent.childNodes.length);

        if(kids.length === 0) return trim(parent.nodeValue);

        var result = [];
        var node, tagresult, tagcontent, tagattributes;

        for(var k=0; k<kids.length; k++){
            tagresult = {};
            node = kids[k];
            // log('\n\t>>START kid ' + k + ' ' + node.nodeName);
            if(node.nodeName === '#comment') break;

            tagcontent = tag_getContent(node);
            tagattributes = tag_getAttributes(node.attributes);

            if(node.nodeName === '#text' && JSON.stringify(tagattributes) === '{}'){
                tagresult = trim(tagcontent);
            } else {
                tagresult.name = node.nodeName;
                tagresult.attributes = tagattributes;
                tagresult.content = tagcontent;
            }

            if(tagresult !== '') result.push(tagresult);

            // log('\t>>END kid ' + k);
        }

        return result;
    }

    function tag_getAttributes(attributes) {
        if(!attributes || !attributes.length) return {};

        // log('\t\t tag_getAttributes:');
        // log(attributes);

        var result = {};
        var attr;

        for(var a=0; a<attributes.length; a++){
            attr = attributes[a];
            // log('\t\t'+attr.name+' : '+attr.value);
            result[attr.name] = trim(attr.value);
        }

        return result;
    }

    function trim(text) {
        try {
            text = text.replace(/^\s+|\s+$/g, '');
            return text.replace(/(\r\n|\n|\r|\t)/gm,'');
        } catch(e) { return ''; }
    }

    // eslint-disable-next-line no-unused-vars
    function log(text) { if(console_debug) console.log(text); }
}
