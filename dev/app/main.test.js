/**
 * This file includes instances of major Glyph Elements
 * and other classes into a global variable called
 * _DEV for runtime testing
 */

window._DEV = {};

// common
import * as colors from '../common/colors.js';
window._DEV.colors = colors;

import * as functions from '../common/functions.js';
window._DEV.functions = functions;

// glyph_elements
import * as xypoint from '../glyph_elements/xy_point.js';
window._DEV.xypoint = xypoint;

import * as coord from '../glyph_elements/coord.js';
window._DEV.coord = coord;

import * as maxes from '../glyph_elements/maxes.js';
window._DEV.maxes = maxes;

import * as controlpoint from '../glyph_elements/control_point.js';
window._DEV.controlpoint = controlpoint;

import * as pathpoint from '../glyph_elements/path_point.js';
window._DEV.pathpoint = pathpoint;

import * as segment from '../glyph_elements/segment.js';
window._DEV.segment = segment;

import * as path from '../glyph_elements/path.js';
window._DEV.path = path;

import * as polysegment from '../glyph_elements/poly_segment.js';
window._DEV.polysegment = polysegment;

import * as shape from '../glyph_elements/shape.js';
window._DEV.shape = shape;

import * as componentinstance from '../glyph_elements/component_instance.js';
window._DEV.componentinstance = componentinstance;

import * as glyph from '../glyph_elements/glyph.js';
window._DEV.glyph = glyph;

import * as hkern from '../glyph_elements/h_kern.js';
window._DEV.hkern = hkern;
