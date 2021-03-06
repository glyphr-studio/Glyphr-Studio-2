import { accentColors } from './colors.js';

// -------------------
// Logos
// -------------------

/**
 * Creates an SVG of the GS Logo
 * @param {object} oa - object argument
 * @returns {string}
 */
export function makeGlyphrStudioLogo(oa) {
  oa = oa || {};
  const fill = oa.fill || accentColors.blue.l65;
  const width = oa.width || 184;
  const height = width * (55 / 184); // dimensions of the native logo

  const re =
    '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="' +
    width +
    'px" height="' +
    height +
    'px" viewBox="0 0 ' +
    width +
    ' ' +
    height +
    '" enable-background="new 0 0 ' +
    width +
    ' ' +
    height +
    '" xml:space="preserve">' +
    '<g id="LOGO" fill="' +
    fill +
    '" transform="scale(' +
    width / 184 +
    ')" >' +
    '<polygon points="42,0 36,0 36,40 40,40 40,4 42,4"/>' +
    '<path d="M17,11C8.6,11,0,16.8,0,28c0,8.6,8.8,12.5,17,12.5c4.7,0,9.7-1.3,13-4.1V42c0,5.8-6.7,8.5-13,8.5c-5.5,0-11.4-2-12.7-6.5H6v-4H0v2c0,8.6,8.8,12.5,17,12.5S34,50.6,34,42V28C34,16.8,25.4,11,17,11z M17,36.5c-6.3,0-13-2.7-13-8.5c0-8.9,6.7-13,13-13s13,4.1,13,13C30,33.8,23.3,36.5,17,36.5z"/>' +
    '<path d="M95,11c-8.4,0-17,5.8-17,17v26h6v-4h-2V36.4c3.3,2.8,8.3,4.1,13,4.1c8.2,0,17-3.9,17-12.5C112,16.8,103.4,11,95,11z M95,36.5c-6.3,0-13-2.7-13-8.5c0-8.9,6.7-13,13-13s13,4.1,13,13C108,33.8,101.3,36.5,95,36.5z"/>' +
    '<path d="M176,13.4c-5.5-3.2-12.5-3.2-18,0c-5.2,3-8,8.2-8,14.6v12h6v-4h-2v-8c0-5,2.1-8.9,6-11.2c4.2-2.4,9.8-2.4,14,0c3.9,2.2,6,6.2,6,11.2h4C184,21.5,181.2,16.3,176,13.4z"/>' +
    '<path d="M72,28c0,5.8-6.7,8.5-13,8.5S46,33.8,46,28V16h2v-4h-6v16.5h0c0.3,8.2,8.9,12,17,12c4.7,0,9.7-1.3,13-4.1V42c0,5.8-6.7,8.5-13,8.5c-5.5,0-11.4-2-12.7-6.5H48v-4h-6v2c0,8.6,8.8,12.5,17,12.5S76,50.6,76,42V28V12h-4V28z"/>' +
    '<path d="M144,40h4V28c0-11.2-8.6-17-17-17c-4.8,0-9.7,1.9-13,5.7V4h2V0h-6v40h6v-4h-2v-8c0-8.9,6.7-13,13-13s13,4.1,13,13V40z"/>' +
    '<path d="M159.8,48.6c-1.4,0-2.8-1-2.8-2.8V42h1.4v1H158v2.7c0,1.3,0.9,1.8,1.8,1.8c0.9,0,1.8-0.6,1.8-1.8V43h-0.4v-1h1.4v3.7C162.6,47.6,161.2,48.6,159.8,48.6z"/>' +
    '<path d="M180.8,48.6c-0.7,0-1.4-0.3-1.9-0.7c-0.6-0.5-0.9-1.2-0.9-2.1v-0.9c0-0.9,0.3-1.6,0.9-2.1c0.5-0.5,1.2-0.7,1.9-0.7c1.4,0,2.8,1,2.8,2.8v0.9C183.6,47.6,182.2,48.6,180.8,48.6z M180.8,43c-0.5,0-0.9,0.2-1.3,0.5c-0.4,0.3-0.6,0.8-0.6,1.4v0.9c0,0.6,0.2,1,0.6,1.4c0.9,0.8,3.1,0.6,3.1-1.4v-0.9C182.6,43.6,181.7,43,180.8,43z"/>' +
    '<path d="M145.2,48.6H143v-1.4h1v0.4h1.2c0.8,0,1.8-0.6,1.8-1.8h-4v-1c0-1.9,1.4-2.8,2.9-2.8h2.2v1.4h-1V43h-1.2c-0.9,0-1.8,0.6-1.9,1.8h4v1C148,47.6,146.6,48.6,145.2,48.6z"/>' +
    '<polygon points="176.4,43.4 176.4,42 171.3,42 171.3,43.4 172.3,43.4 172.3,43 173.4,43 173.4,47.6 172.3,47.6 172.3,47.1 171.3,47.1 171.3,48.6 176.4,48.6 176.4,47.1 175.4,47.1 175.4,47.6 174.4,47.6 174.4,43 175.4,43 175.4,43.4"/>' +
    '<polygon points="150,42 150,43.4 151,43.4 151,43 152,43 152,47.6 151.6,47.6 151.6,48.6 153.4,48.6 153.4,47.6 153,47.6 153,43 154,43 154,43.4 155,43.4 155,42"/>' +
    '<path d="M166.5,48.6h-1.9V42h1.9c1.9,0,2.8,1.4,2.8,2.8v0.9C169.3,47.1,168.4,48.6,166.5,48.6z M165.6,47.6h0.9c1.3,0,1.8-0.9,1.8-1.8v-0.9c0-0.9-0.6-1.8-1.8-1.8h-0.9V47.6z"/>' +
    '</g></svg>';
  return re;
}
