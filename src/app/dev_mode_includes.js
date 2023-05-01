/**
 * This file includes instances of major Glyph Elements
 * and other classes into a global variable called
 * _DEV for runtime testing
 */

export let _DEV = {};

// common
import * as colors from '../common/colors.js';
_DEV.colors = colors;

import * as functions from '../common/functions.js';
_DEV.functions = functions;

// glyph_elements
import * as glyphElement from '../project_data/glyph_element.js';
_DEV.glyphElement = glyphElement;

import * as xyPoint from '../project_data/xy_point.js';
_DEV.xyPoint = xyPoint;

import * as coord from '../project_data/coord.js';
_DEV.coord = coord;

import * as maxes from '../project_data/maxes.js';
_DEV.maxes = maxes;

import * as controlPoint from '../project_data/control_point.js';
_DEV.controlPoint = controlPoint;

import * as pathPoint from '../project_data/path_point.js';
_DEV.pathPoint = pathPoint;

import * as segment from '../project_data/segment.js';
_DEV.segment = segment;

import * as path from '../project_data/path.js';
_DEV.path = path;

import * as polySegment from '../project_data/poly_segment.js';
_DEV.polySegment = polySegment;

import * as componentInstance from '../project_data/component_instance.js';
_DEV.componentInstance = componentInstance;

import * as glyph from '../project_data/glyph.js';
_DEV.glyph = glyph;

import * as hKern from '../project_data/h_kern.js';
_DEV.hKern = hKern;
