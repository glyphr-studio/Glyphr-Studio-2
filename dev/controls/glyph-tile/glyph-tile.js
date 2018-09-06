import {makeElement} from '../controls.js';
import {uiColors, accentColors} from '../../app/colors.js';
import {hexToChars} from '../../app/unicode.js';
import {getGlyphName} from '../../app/globalgetters.js';
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

        this.glyphHex = this.getAttribute('glyph');
        this.glyphChar = hexToChars(this.glyphHex);
        this.glyphObject = getGlyph(this.glyphHex);
        this.selected = this.hasAttribute('selected');
        this.view = {};
        let gutter = 2;

        this.setAttribute('title', `${getGlyphName(this.glyphHex, true)}\n${this.glyphHex}`);

        this.wrapper = makeElement({className: 'wrapper'});
        if (this.selected) this.wrapper.setAttribute('selected', '');

        if (this.glyphObject) {
            this.thumbnail = makeElement({tag: 'canvas', className: 'thumbnail'});
            this.ctx = this.thumbnail.getContext('2d');
            this.thumbnail.width = 50;
            this.thumbnail.height = 50;
            this.view = {
                dx: gutter,
                dy: ((50 - (2 * gutter)) * (700 / 1000)),
                dz: ((50 - (2 * gutter)) / this.glyphObject.height),
            };
            console.log(`view is ${this.view.dx}, ${this.view.dy}, ${this.view.dz}`);
        } else {
            this.thumbnail = makeElement({className: 'thumbnail', content: this.glyphChar});
        }


        this.name = makeElement({className: 'name'});
        this.name.innerHTML = this.glyphChar;

        let style = makeElement({tag: 'style', content: `
            * {
                box-sizing: border-box;
                user-select: none;
                -moz-user-select: none;
                -webkit-user-select: none;
                -ms-user-select: none;
            }

            :host {
                box-sizing: border-box;
                width: 52px;
                height: 75px;
                overflow-y: hidden;
                overflow-x: hidden;
                margin: 0px 5px 2px 0px;
                padding: 0px;
                background-color: rgba(255, 255, 255, 0.4);
                box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.04);
                border-radius: 2px;
            }

            .wrapper {
                transition: border-color 2s easeOutExpo;
                display: inline-block;
                margin: 0px;
                padding: 1px;
                height: 100%;
                width: 52px;
                text-align: center;
                overflow-x: hidden;
                overflow-y: hidden;
                background-repeat: no-repeat;
                background-size: auto 50px;
            }

            .wrapper:hover,
            .wrapper:focus {
                background: linear-gradient(${uiColors.accent}, transparent);
                background-repeat: no-repeat;
                background-size: auto 50px;
                cursor: pointer;
            }

            .wrapper[selected] {
                background: linear-gradient(${uiColors.accent}, transparent);
                background-repeat: no-repeat;
                background-size: auto 50px;
            }

            .wrapper[selected]:hover,
            .wrapper[selected]:focus {
                cursor: default;
            }

            .thumbnail {
                display: block;
                background-color: white;
                font-size: 36px;
                padding-top: 2px;
                color: ${uiColors.disabled.background};
                margin: auto;
                width: 50px;
                height: 50px;
                box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.05);
                border-radius: 1px;
            }

            .wrapper:hover .thumbnail,
            .wrapper:focus .thumbnail {
                background-color: ${uiColors.enabled.active.background};
                box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.08);
                color: ${uiColors.enabled.active.lightText};
            }

            .wrapper[selected] .thumbnail {
                background-color: ${uiColors.enabled.active.background};
                box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.05);
                color: ${uiColors.enabled.active.lightText};
            }

            .wrapper[selected]:hover .thumbnail {
                cursor: default;
            }

            .name {
                display: block;
                text-align: left;
                width: 300px;
                height: 28px;
                padding: 2px 0px 0px 4px;
                color: #6D6D6D;
            }

            .wrapper[selected] .name,
            .wrapper:hover .name {
                color: ${uiColors.accent};
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

        if (this.glyphObject) {
            this.glyphObject.drawGlyph(
                this.ctx,
                this.view,
                1,
                false,
                (this.selected? accentColors.blue.l35 : accentColors.gray.l35)
            );
            // this.ctx.fillColor = (this.selected? accentColors.blue.l35 : accentColors.gray.l35);
            // this.ctx.fillRect(10, 10, 30, 30);
        }
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
                    {p: {coord: {x: 0, y: 0}}},
                    {p: {coord: {x: 200, y: 700}}},
                    {p: {coord: {x: 300, y: 700}}},
                    {p: {coord: {x: 500, y: 0}}},
                    {p: {coord: {x: 400, y: 0}}},
                    {p: {coord: {x: 300, y: 300}}},
                    {p: {coord: {x: 200, y: 300}}},
                    {p: {coord: {x: 100, y: 0}}},
                ]}},
                {path: {pathPoints: [
                    {p: {coord: {x: 200, y: 350}}},
                    {p: {coord: {x: 300, y: 350}}},
                    {p: {coord: {x: 250, y: 600}}},
                ]}},
                {path: {pathPoints: [
                    {p: {coord: {x: 0, y: 700}}},
                    {p: {coord: {x: 100, y: 700}}},
                    {p: {coord: {x: 0, y: 600}}},
                ]}},
                {path: {pathPoints: [
                    {p: {coord: {x: 0, y: -300}}},
                    {p: {coord: {x: 100, y: -300}}},
                    {p: {coord: {x: 0, y: -200}}},
                ]}},
            ],
        });
    } else {
        return false;
    }
}

customElements.define('glyph-tile', GlyphTile);
