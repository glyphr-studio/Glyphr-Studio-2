import openTypeJS from '../lib/opentype.js-september-2024-kern-write/opentype.mjs';

/**
 * Loads a font from a URL
 * @param {string} url - URL to load from
 */
export async function loadFontFromUrL(url) {
    const response = await fetch(url);
    const fontData = await response.arrayBuffer();
    const font = await openTypeJS.parse(fontData);
    return font
}