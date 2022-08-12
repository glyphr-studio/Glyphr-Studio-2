import { accentColors } from '../../common/colors.js';
import { makeElement } from '../../common/dom.js';
import { log } from '../../common/functions.js';

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

    this.isMouseOverBubble = false;

    let wrapper = makeElement({ className: 'wrapper', tabIndex: true });
    this.entryPoint = makeElement({ className: 'entryPoint', content: '?' });

    let style = makeElement({
      tag: 'style',
      content: `
            * {
                user-select: none;
                -moz-user-select: none;
                -webkit-user-select: none;
                -ms-user-select: none;
            }

            .wrapper {
                margin: 0px;
                padding: 0px;
                display: block;
                width: 14px;
                height: 14px;
            }

            .entryPoint {
                display: inline-block;
                position: relative;
                top: -2px;
                border-style: solid;
                border-width: 1px;
                border-color: rgb(180, 180, 180);
                background-color: transparent;
                color: rgb(180, 180, 180);
                border-radius: 50%;
                font-family: monospace, verdana, sans-serif;
                font-size: 8px;
                font-weight: bold;
                width: 12px;
                height: 12px;
                line-height: 10px;
                text-align: center;
                box-sizing: border-box;
                padding: 0px 0px 1px 0px;
                transition: all 0.2s;
            }

            .entryPoint:hover,
            .bubble:hover {
                cursor: help;
            }
        `,
    });

    // Put together visible stuff
    let shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(style);
    wrapper.appendChild(this.entryPoint);
    shadow.appendChild(wrapper);



    // Event listeners
    this.addEventListener('mouseover', this.show);
    this.addEventListener('focus', this.show);

    // this.addEventListener('mouseout', this.hide);
    // this.addEventListener('blur', this.hide);
  }

  /**
   * Show the bubble
   */
  show() {
    log(`info-bubble show`, 'start');

    // put together bubble stuff

    let bgColor = accentColors.gray.l10;
    let textColor = accentColors.gray.l95;

    log(`Making bubble...`);
    let bubble = makeElement({
      id: 'bubble',
      attributes: {
        style:
          `
            z-index: 1000;
            transition: opacity 0.2s;
            display: grid;
            align-items: center;
            grid-template-columns: 12px 1fr;
            opacity: 1;
            position: absolute;
            left: 100px;
            top: 100px;
            text-align: center;
          `
      }
    });

    log(`Making pointer...`);
    let pointer = makeElement({
      attributes: {
        style:
          `
            width: 0px;
            height: 0px;
            border: 12px solid transparent;
            border-top: 12px solid ${bgColor};
            background-color: transparent;
            display: block;
            margin: 0px auto;
          `
        }
      });

    log(`Making content...`);
    let content = makeElement({
      innerHTML: this.innerHTML,
      attributes: {
        style:
          `
            padding: 20px 24px 20px 20px;
            border-radius: 3px;
            width: min-content;
            min-width: 100px;
            color: ${textColor};
            background-color: ${bgColor};
            text-align: left;
            display: block;
            box-shadow: 2px 2px 8px rgba(0,0,0,0.2);
          `
        }
    });

    bubble.appendChild(pointer);
    bubble.appendChild(content);

    // Event listeners
    bubble.addEventListener('mouseover', () => this.isMouseOverBubble = true);
    bubble.addEventListener('focus', () => this.isMouseOverBubble = true);

    bubble.addEventListener('mouseout', this.hide);
    bubble.addEventListener('blur', this.hide);

    document.body.appendChild(bubble);
    let entryPointRect = this.entryPoint.getBoundingClientRect();
    let bubbleRect = bubble.getBoundingClientRect();
    let left = entryPointRect.x + entryPointRect.width + 2;
    let top = entryPointRect.y - (bubbleRect.height / 2) + 14;

    if (left < 0 || top < 0) this.pointer.style.display = 'none';
    left = Math.max(left, 0);
    top = Math.max(top, 0);

    log(`showing bubble at ${left} / ${top}`);
    bubble.style.left = `${left}px`;
    bubble.style.top = `${top}px`;


    this.entryPoint.style.borderColor = 'rgb(180, 180, 180)';
    this.entryPoint.style.backgroundColor = 'rgb(180, 180, 180)';
    this.entryPoint.style.color = 'rgb(250, 250, 250)';

    log(`info-bubble show`, 'end');
  }

  /**
   * Hide the bubble
   */
  hide() {
    log(`info-bubble hide`, 'start');

    if(!this.isMouseOverBubble){
      let bubble = document.getElementById('bubble');
      bubble.style.left = '-1000px';
      bubble.style.top = '-1000px';
      bubble.style.display = 'none';
      bubble.style.opacity = '0';

      document.body.removeChild(bubble);

      // this.entryPoint.style.borderColor = 'rgb(180, 180, 180)';
      // this.entryPoint.style.backgroundColor = 'transparent';
      // this.entryPoint.style.color = 'rgb(180, 180, 180)';
    }

    log(`info-bubble hide`, 'end');
  }
}
