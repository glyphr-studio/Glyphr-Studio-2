declare module '*.gs2';
declare module '*.gs2?raw';
declare module '*.txt';
declare module '*.txt?raw';
declare module '*.svg';
declare module '*.svg?raw';
declare module '*.css';
declare module '*.css?inline';
declare module '*.png';

declare global {
	interface Window {
		log: any;
	}
}

declare var log: any;
