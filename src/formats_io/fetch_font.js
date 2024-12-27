import openTypeJS from '../lib/opentype.js-september-2024-kern-write/opentype.mjs';
import { enFontUrl } from '../utils/env/envFontUrl';

/**
 * Loads a font
 * @param {string} id - font id
 */
export async function fetchFont(id) {
    const response = await fetch(' https://ep-product-pictures.s3.us-west-2.amazonaws.com/fonts/99f8e8ca-6339-4493-a9df-b515b1fee48b.ttf');
    // const response = await fetch(`${window.location.origin}/${enFontUrl()}/${id}`);
    const fontData = await response.arrayBuffer();
    const font = await openTypeJS.parse(fontData);
    return font
}