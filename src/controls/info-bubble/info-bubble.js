import { accentColors } from '../../common/colors.js';
import { makeElement } from '../../common/dom.js';
import './info-bubble.css';
import bubble'./info-bubble-popup.css';

/**
 * A small bubble that displays information
 * about a target UI element
 */
export class InfoBubble extends HTMLElement {
	/**
	 * Create an InfoBubble
	 */
	constructor() {
		super();

		let wrapper = makeElement({ className: 'wrapper', tabIndex: true });
		this.entryPoint = makeElement({ id: 'entryPoint', content: '?' });

		// Put together visible stuff
		let shadow = this.attachShadow({ mode: 'open' });
		let styles = makeElement({ tag: 'style', innerHTML: style });
		shadow.appendChild(styles);

		wrapper.appendChild(this.entryPoint);
		shadow.appendChild(wrapper);

		// Event listeners
		this.addEventListener('mouseover', this.show);
		this.addEventListener('focus', this.show);

		this.addEventListener('mouseout', () => this.hide(this.entryPoint));
		this.addEventListener('blur', () => this.hide(this.entryPoint));
	}

	/**
	 * Show the bubble
	 */
	show() {
		// log(`info-bubble show`, 'start');

		// put together bubble stuff
		// log(`Making bubble...`);
		let bubble = makeElement({
			id: 'bubble',
		});
		let bubbleStyles = makeElement({ tag: 'style', innerHTML: bubbleStyle });
		bubble.appendChild(bubbleStyles);

		// log(`Making pointer...`);
		let pointer = makeElement({
			className: 'pointer',
		});

		// log(`Making content...`);
		let content = makeElement({
			innerHTML: this.innerHTML,
			className: 'content',
		});

		bubble.appendChild(pointer);
		bubble.appendChild(content);

		// Event listeners
		// bubble.addEventListener('mouseover', () => this.isMouseOverBubble = true);
		// bubble.addEventListener('focus', () => this.isMouseOverBubble = true);

		bubble.addEventListener('mouseout', () => this.hide(this.entryPoint));
		bubble.addEventListener('blur', () => this.hide(this.entryPoint));

		document.body.appendChild(bubble);
		let entryPointRect = this.entryPoint.getBoundingClientRect();
		let bubbleRect = bubble.getBoundingClientRect();
		let left = entryPointRect.x + entryPointRect.width + 2;
		let top = entryPointRect.y - bubbleRect.height / 2 + 18;

		if (left < 0 || top < 0) this.pointer.style.display = 'none';
		left = Math.max(left, 0);
		top = Math.max(top, 0);

		// log(`showing bubble at ${left} / ${top}`);
		// log(this.entryPoint);
		bubble.style.left = `${left}px`;
		bubble.style.top = `${top}px`;

		this.entryPoint.style.borderColor = 'rgb(180, 180, 180)';
		this.entryPoint.style.backgroundColor = 'rgb(180, 180, 180)';
		this.entryPoint.style.color = 'rgb(250, 250, 250)';

		// log(`info-bubble show`, 'end');
	}

	/**
	 * Hide the bubble
	 */
	hide(entryPoint) {
		// log(`info-bubble hide`, 'start');
		// log(this);
		// log(entryPoint);

		let bubble = document.getElementById('bubble');
		bubble.style.left = '-1000px';
		bubble.style.top = '-1000px';
		bubble.style.display = 'none';
		bubble.style.opacity = '0';

		document.body.removeChild(bubble);
		// log(`bubble has been removed`);

		entryPoint.style.borderColor = 'rgb(180, 180, 180)';
		entryPoint.style.backgroundColor = 'transparent';
		entryPoint.style.color = 'rgb(180, 180, 180)';

		// log(`info-bubble hide`, 'end');
	}
}
