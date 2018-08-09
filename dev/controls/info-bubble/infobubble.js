import {makeElement} from '../controls.js';

/**
 * A small bubble that displays information
 * about a target UI element
 */
export default class InfoBubble extends HTMLElement {
    /**
     * Create an InfoBubble
     */
    constructor() {
        super();

        let wrapper = makeElement('span', false, 'wrapper', [['tabindex', '0']]);

        this.entryPoint = makeElement('span', '?', 'entryPoint');

        let content = makeElement('span', this.getAttribute('text'.replace(/\\n/gi, '\n')), 'content');

        let pointer = makeElement('span', false, 'pointer');

        this.bubble = makeElement('span', false, 'bubble');

        let bgColor = 'rgb(60,60,60)';
        let textColor = 'white';
        let style = makeElement('style', `
            .wrapper {
                margin: 0px;
                padding: 0px;
                display: block;
                width: 14px;
                height: 16px;
                overflow: hidden;
            }

            .entryPoint {
                border-style: solid;
                border-width: 1px;
                border-color: rgb(180, 180, 180);
                background-color: transparent;
                color: rgb(180, 180, 180);
                border-radius: 50%;
                font-family: verdana, sans-serif;
                font-size: 8px;
                font-weight: bold;
                user-select: none;
                position: relative;
                top: -3px;
                display: inline-block;
                width: 14px;
                height: 14px;
                text-align: center;
                box-sizing: border-box;
                padding: 0px 0px 2px 2px;
                transition: all 0.2s;
            }

            .bubble {
                transition: opacity 0.2s;
                display: none;
                opacity: 0;
                position: absolute;
                left: -1000px;
                top: -1000px;
                user-select: none;
                text-align: center;
            }

            .content {
                padding: 12px 18px 12px 12px;
                border-radius: 3px;
                min-width: 100px;
                max-width: 300px;
                color: ${textColor};
                background-color: ${bgColor};
                text-align: left;
                display: block;
                user-select: none;
                box-shadow: 4px 4px 2px rgba(0,0,0,0.2);
            }

            .pointer {
                width: 0px;
                height: 0px;
                border: 12px solid transparent;
                border-top: 12px solid ${bgColor};
                background-color: transparent;
                display: block;
                margin: 0px auto;
            }

            .entryPoint:hover,
            .bubble:hover {
                cursor: help;
            }
        `);

        this.addEventListener('mouseover', (ev) => {
            this.bubble.style.display = 'block';

            let left = this.entryPoint.offsetLeft - (this.bubble.offsetWidth / 2) + 7;
            let top = this.entryPoint.offsetTop - (this.bubble.offsetHeight) + 10;

            console.log(`showing bubble at ${left} / ${top}`);

            this.bubble.style.left = `${left}px`;
            this.bubble.style.top = `${top}px`;
            this.bubble.style.opacity = '1';

            this.entryPoint.borderColor = 'rgb(180, 180, 180)';
            this.entryPoint.backgroundColor = 'rgb(180, 180, 180)';
            this.entryPoint.color = 'rgb(250, 250, 250)';
        });

        this.addEventListener('mouseout', (ev) => {
            this.bubble.style.left = '-1000px';
            this.bubble.style.top = '-1000px';
            this.bubble.style.display = 'none';
            this.bubble.style.opacity = '0';

            this.entryPoint.style.borderColor = 'rgb(180, 180, 180)';
            this.entryPoint.style.backgroundColor = 'transparent';
            this.entryPoint.style.color = 'rgb(180, 180, 180)';
        });

        // Put it all together
        let shadow = this.attachShadow({mode: 'open'});
        shadow.appendChild(style);

        this.bubble.appendChild(content);
        this.bubble.appendChild(pointer);

        wrapper.appendChild(this.entryPoint);
        wrapper.appendChild(this.bubble);

        shadow.appendChild(wrapper);
    }
}
