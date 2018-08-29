import {makeElement} from '../controls.js';
import {uiColors} from '../../app/colors.js';
import {hexToChars} from '../../app/unicode.js';
import Glyph from '../../glyph_elements/glyph.js';

/**
 * description
 */
export default class GlyphTile extends HTMLElement {
    /**
     * Create an GlyphTile
     * @param {object} attributes - collection of key: value pairs to set as attributes
     */
    constructor(attributes = {}) {
        super();

        Object.keys(attributes).forEach((key) => this.setAttribute(key, attributes[key]));

        this.glyphObject = getGlyph(this.getAttribute('glyph'));
        this.selected = this.hasAttribute('selected');

        this.wrapper = makeElement({className: 'wrapper'});
        if (this.selected) this.wrapper.setAttribute('selected', '');

        this.thumbnail = makeElement({tag: 'canvas', className: 'thumbnail'});
        this.ctx = this.thumbnail.getContext('2d');
        this.thumbnail.width = 50;
        this.thumbnail.height = 50;


        this.name = makeElement({className: 'name'});
        this.name.innerHTML = hexToChars(this.getAttribute('glyph'));

        let style = makeElement({tag: 'style', content: `
            * {
                box-sizing: border-box;
                user-select: none;
                -moz-user-select: none;
                -webkit-user-select: none;
                -ms-user-select: none;
            }

            :host {
                width: 52px;
                overflow-y: hidden;
                overflow-x: hidden;
                margin: 0px 5px 2px 0px;
                padding: 0px;
            }

            .wrapper {
                transition: border-color 2s easeOutExpo;
                display: inline-block;
                margin: 0px;
                padding: 0px;
                height: 80px;
                width: 52px;
                border-style: solid;
                border-width: 1px;
                border-color: transparent;
                background-color: rgba(255, 255, 255, 0.3);
                overflow-x: hidden;
                overflow-y: hidden;
            }

            .wrapper:hover,
            .wrapper:focus {
                border-image: linear-gradient(${uiColors.accent}, rgba(0, 0, 0, 0)) 1 100%;
                cursor: pointer;
            }

            .wrapper:hover .thumbnail,
            .wrapper:focus .thumbnail {
                box-shadow: 0px 5px 4px rgba(0, 0, 0, 0.06);
            }

            .wrapper[selected]:hover,
            .wrapper[selected]:focus {
                border-color: transparent;
                cursor: default;
            }

            .thumbnail {
                display: block;
                background-color: white;
                width: 50px;
                height: 50px;
                box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.05);
            }

            .wrapper[selected] {
                border-top: 2px solid ${uiColors.accent};
                border-image-source: linear-gradient(${uiColors.accent}, rgba(0, 0, 0, 0));
                border-image-slice: 2;
                border-image-width: 100%;
            }

            .wrapper[selected] .thumbnail {
                background-color: ${uiColors.enabled.active.background};
            }

            .wrapper:hover .thumbnail {
                border-color: white;
            }

            .wrapper[selected]:hover .thumbnail {
                cursor: default;
            }

            .name {
                display: block;
                width: 300px;
                height: 28px;
                padding: 2px 0px 0px 4px;
                color: #6D6D6D;
            }

            .wrapper[selected] .name {
                color: ${uiColors.accent};
            }

            .wrapper:hover .name {
                color: ${uiColors.enabled.resting.text};
            }


        `});


        // Put it all together
        let shadow = this.attachShadow({mode: 'open'});
        shadow.appendChild(style);

        this.wrapper.appendChild(this.thumbnail);
        this.wrapper.appendChild(this.name);

        /*
        this.observer = new MutationObserver(this.childAttributeChanged);
        this.observer.elementRoot = this;
        this.observer.observe(this.padlock, {attributes: true, attributeOldValue: true});
        */

        shadow.appendChild(this.wrapper);
    }
}

/**
 * This is just for testing, in real life this will call
 * a global project function
 * @param {string} gid - glyph id
 * @returns {Glyph}
 */
function getGlyph(gid) {
    if (gid === '0x41') {
        return new Glyph({hex: gid,
            shapes: [
                {path: {pathPoints: [
                    {p: {coord: {x: 100, y: 200}}},
                    {p: {coord: {x: 300, y: 600}}},
                    {p: {coord: {x: 400, y: 500}}},
                ]}},
                {path: {pathPoints: [
                    {p: {coord: {x: 500, y: 600}}},
                    {p: {coord: {x: 700, y: 950}}},
                    {p: {coord: {x: 800, y: 900}}},
                ]}},
                {path: {pathPoints: [
                    {p: {coord: {x: 10, y: 20}}},
                    {p: {coord: {x: 30, y: 60}}},
                    {p: {coord: {x: 40, y: 50}}},
                ]}},
            ],
        });
    } else {
        return false;
    }
}

customElements.define('glyph-tile', GlyphTile);
