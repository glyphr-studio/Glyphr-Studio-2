import openTypeJS from '../lib/opentype.js-september-2024-kern-write/opentype.mjs';
import { enFontUrl } from '../utils/env/envFontUrl';

/**
 * Loads a font
 * @param {string} id - font id
 */
export async function fetchFont(id) {
    const response = await fetch(`/${enFontUrl()}/${id}`);
    const fontData = await response.arrayBuffer();
    const font = await openTypeJS.parse(fontData);
    return font
}