import { describe, expect, it } from 'vitest';
import { ioSVG_convertSVGTagsToGlyph } from '../svg_outline_import.js';
import { expected } from './svg_expected_results.js';

// SVG Test Files
import { round } from '../../../common/functions.js';
import inherited_transforms_heart from './inherited_transforms_heart.svg?raw';
import inherited_transforms_hierarchy_order from './inherited_transforms_hierarchy_order.svg?raw';
import inherited_transforms_mixed_levels_and_transforms from './inherited_transforms_mixed_levels_and_transforms.svg?raw';
import inherited_transforms_one_level_one_transform from './inherited_transforms_one_level_one_transform.svg?raw';
import inherited_transforms_two_levels_one_transform from './inherited_transforms_two_levels_one_transform.svg?raw';
import multi_shape_1 from './multi_shape_1.svg?raw';
import multi_shape_2 from './multi_shape_2.svg?raw';
import multi_shape_3 from './multi_shape_3.svg?raw';
import multi_shape_4 from './multi_shape_4.svg?raw';
import multi_shape_5 from './multi_shape_5.svg?raw';
import multi_shape_6 from './multi_shape_6.svg?raw';
import path_A from './path_A.svg?raw';
import path_A2 from './path_A2.svg?raw';
import path_Ar from './path_Ar.svg?raw';
import path_Ar2 from './path_Ar2.svg?raw';
import path_C from './path_C.svg?raw';
import path_Cr from './path_Cr.svg?raw';
import path_HV from './path_HV.svg?raw';
import path_HVr from './path_HVr.svg?raw';
import path_L from './path_L.svg?raw';
import path_Lr from './path_Lr.svg?raw';
import path_M from './path_M.svg?raw';
import path_Mr from './path_Mr.svg?raw';
import path_Q from './path_Q.svg?raw';
import path_Qr from './path_Qr.svg?raw';
import path_S from './path_S.svg?raw';
import path_Sr from './path_Sr.svg?raw';
import path_T from './path_T.svg?raw';
import path_Tr from './path_Tr.svg?raw';
import shape_circle from './shape_circle.svg?raw';
import shape_circle_multi from './shape_circle_multi.svg?raw';
import shape_ellipse from './shape_ellipse.svg?raw';
import shape_ellipse_multi from './shape_ellipse_multi.svg?raw';
import shape_polygon from './shape_polygon.svg?raw';
import shape_polygon_multi from './shape_polygon_multi.svg?raw';
import shape_polyline from './shape_polyline.svg?raw';
import shape_polyline_multi from './shape_polyline_multi.svg?raw';
import shape_rect from './shape_rect.svg?raw';
import shape_rect_multi from './shape_rect_multi.svg?raw';
import transform_matrix from './transform_matrix.svg?raw';
import transform_origin_matrix from './transform_origin_matrix.svg?raw';
import transform_origin_rotate from './transform_origin_rotate.svg?raw';
import transform_origin_rotate_two_origins from './transform_origin_rotate_two_origins.svg?raw';
import transform_origin_scale from './transform_origin_scale.svg?raw';
import transform_origin_skewx from './transform_origin_skewx.svg?raw';
import transform_origin_skewy from './transform_origin_skewy.svg?raw';
import transform_origin_translate from './transform_origin_translate.svg?raw';
import transform_rotate from './transform_rotate.svg?raw';
import transform_scale from './transform_scale.svg?raw';
import transform_skewx from './transform_skewx.svg?raw';
import transform_skewx_position from './transform_skewx_position.svg?raw';
import transform_skewy from './transform_skewy.svg?raw';
import transform_skewy_position from './transform_skewy_position.svg?raw';
import transform_translate from './transform_translate.svg?raw';
import transforms_attribute_order from './transforms_attribute_order.svg?raw';
import use_href_attributes from './use_href_attributes.svg?raw';
import use_href_cascade from './use_href_cascade.svg?raw';
import use_href_transforms from './use_href_transforms.svg?raw';
import use_xlink_attributes from './use_xlink_attributes.svg?raw';
import use_xlink_cascade from './use_xlink_cascade.svg?raw';
import use_xlink_transforms from './use_xlink_transforms.svg?raw';

/**
 * Simulates importing SVG code and converting it to a
 * Glyphr Studio Glyph in JSON format
 * @param {String} testSVG - raw input from the SVG file
 * @returns {String} - json save code from the GS Glyph
 */
function importAndMakeSVGTestString(testSVG) {
	const resultGlyph = ioSVG_convertSVGTagsToGlyph(testSVG, false);
	resultGlyph.id = 'glyph-0x41';
	resultGlyph.flipNS();
	resultGlyph.reverseWinding();
	const saveString = JSON.stringify(resultGlyph.save());
	return saveString;
}

/**
 * Simulates importing SVG code and converting it to a
 * Glyphr Studio Glyph
 * @param {String} testSVG - raw input from the SVG file
 * @returns {Object} - object to test
 */
function importAndMakeSVGTestObject(testSVG) {
	const resultGlyph = ioSVG_convertSVGTagsToGlyph(testSVG, false);
	resultGlyph.id = 'glyph-0x41';
	resultGlyph.flipNS();
	resultGlyph.reverseWinding();
	return resultGlyph;
}

/**
 * SVG Import can have floating point errors, which are fine
 * below a certain threshold and shouldn't fail tests.
 * @param {Object} testObject - object to test
 * @param {Object} expectedObject - object to compare
 * @param {Number} precision - number of decimal places to round to
 * @returns {Boolean} - true if the objects are roughly equal
 */
function numericValuesAreRoughlyEqual(testObject, expectedObject, precision = 6, depth = 0) {
	let t = '';
	while (t.length < depth * 2) t += '  ';

	const expectedKeys = Object.keys(expectedObject);
	for (let i = 0; i < expectedKeys.length; i++) {
		const key = expectedKeys[i];
		// console.log(`${t}key ${i} is ${key}`);
		// if (!testObject.hasOwnProperty(key)) return false;

		if (typeof expectedObject[key] === 'number') {
			const originalTestValue = testObject[key];
			const originalExpectedValue = expectedObject[key];
			// console.log(`>>>${t}t${originalTestValue} =?= e${originalExpectedValue}<<<`);
			const roundedTestValue = round(originalTestValue, precision);
			const roundedExpectedValue = round(originalExpectedValue, precision);
			if (roundedTestValue !== roundedExpectedValue) {
				console.log(`>>>${t}t${originalTestValue} =?= e${originalExpectedValue}<<<`);
				console.log(`!!!${t} RETURN FALSE: Test values are not equal`);
				return false;
			}
		} else if (Array.isArray(expectedObject[key])) {
			for (let j = 0; j < expectedObject[key].length; j++) {
				// console.log(`${t}  ${key} index ${j} is ${expectedObject[key][j]}`);
				if (!testObject[key] || !testObject[key][j]) {
					console.log(`!!!${t} RETURN FALSE: e.length=${expectedObject[key].length} t[${j}]`);
					return false;
				}
				if (
					!numericValuesAreRoughlyEqual(
						testObject[key][j],
						expectedObject[key][j],
						precision,
						depth + 1
					)
				) {
					return false;
				}
			}
		} else if (typeof expectedObject[key] === 'object') {
			if (!testObject[key]) {
				console.log(`!!!${t} RETURN FALSE: test object is missing key ${key}`);
				return false;
			}
			if (
				!numericValuesAreRoughlyEqual(testObject[key], expectedObject[key], precision, depth + 1)
			) {
				return false;
			}
		}
	}
	return true;
}

/*
	// TEST ACTION for app.js
	{
		name: 'Log SaveAs',
		onClick: () => {
			console.log(JSON.stringify(getCurrentProjectEditor().selectedGlyph.save()));
		}
	}
*/

describe('Import basic SVG shapes', () => {
	it('Import shape_circle', () => {
		// console.log('shape_circle');
		const testShape = importAndMakeSVGTestObject(shape_circle);
		const expectedShape = JSON.parse(expected.shape_circle);
		expect(numericValuesAreRoughlyEqual(testShape, expectedShape)).toBe(true);
	});
	it('Import shape_ellipse', () => {
		// console.log('shape_ellipse');
		const testShape = importAndMakeSVGTestObject(shape_ellipse);
		const expectedShape = JSON.parse(expected.shape_ellipse);
		expect(numericValuesAreRoughlyEqual(testShape, expectedShape)).toBe(true);
	});
	it('Import shape_polygon', () => {
		// console.log('shape_polygon');
		const testShape = importAndMakeSVGTestObject(shape_polygon);
		const expectedShape = JSON.parse(expected.shape_polygon);
		expect(numericValuesAreRoughlyEqual(testShape, expectedShape)).toBe(true);
	});
	it('Import shape_polyline', () => {
		// console.log('shape_polyline');
		const testShape = importAndMakeSVGTestObject(shape_polyline);
		const expectedShape = JSON.parse(expected.shape_polyline);
		expect(numericValuesAreRoughlyEqual(testShape, expectedShape)).toBe(true);
	});
	it('Import shape_rect', () => {
		// console.log('shape_rect');
		const testShape = importAndMakeSVGTestObject(shape_rect);
		const expectedShape = JSON.parse(expected.shape_rect);
		expect(numericValuesAreRoughlyEqual(testShape, expectedShape)).toBe(true);
	});
	it('Import shape_circle_multi', () => {
		// console.log('shape_circle_multi');
		const testShape = importAndMakeSVGTestObject(shape_circle_multi);
		const expectedShape = JSON.parse(expected.shape_circle_multi);
		expect(numericValuesAreRoughlyEqual(testShape, expectedShape)).toBe(true);
	});
	it('Import shape_ellipse_multi', () => {
		// console.log('shape_ellipse_multi');
		const testShape = importAndMakeSVGTestObject(shape_ellipse_multi);
		const expectedShape = JSON.parse(expected.shape_ellipse_multi);
		expect(numericValuesAreRoughlyEqual(testShape, expectedShape)).toBe(true);
	});
	it('Import shape_polygon_multi', () => {
		// console.log('shape_polygon_multi');
		const testShape = importAndMakeSVGTestObject(shape_polygon_multi);
		const expectedShape = JSON.parse(expected.shape_polygon_multi);
		expect(numericValuesAreRoughlyEqual(testShape, expectedShape)).toBe(true);
	});
	it('Import shape_polyline_multi', () => {
		// console.log('shape_polyline_multi');
		const testShape = importAndMakeSVGTestObject(shape_polyline_multi);
		const expectedShape = JSON.parse(expected.shape_polyline_multi);
		expect(numericValuesAreRoughlyEqual(testShape, expectedShape)).toBe(true);
	});
	it('Import shape_rect_multi', () => {
		// console.log('shape_rect_multi');
		const testShape = importAndMakeSVGTestObject(shape_rect_multi);
		const expectedShape = JSON.parse(expected.shape_rect_multi);
		expect(numericValuesAreRoughlyEqual(testShape, expectedShape)).toBe(true);
	});
});

describe('Import path SVG shapes', () => {
	it('Import path_A', () => {
		// console.log('path_A');
		const testShape = importAndMakeSVGTestObject(path_A);
		const expectedShape = JSON.parse(expected.path_A);
		expect(numericValuesAreRoughlyEqual(testShape, expectedShape)).toBe(true);
	});
	it('Import path_A2', () => {
		// console.log('path_A2');
		const testShape = importAndMakeSVGTestObject(path_A2);
		const expectedShape = JSON.parse(expected.path_A2);
		expect(numericValuesAreRoughlyEqual(testShape, expectedShape)).toBe(true);
	});
	it('Import path_Ar', () => {
		// console.log('path_Ar');
		const testShape = importAndMakeSVGTestObject(path_Ar);
		const expectedShape = JSON.parse(expected.path_Ar);
		expect(numericValuesAreRoughlyEqual(testShape, expectedShape)).toBe(true);
	});
	it('Import path_Ar2', () => {
		// console.log('path_Ar2');
		const testShape = importAndMakeSVGTestObject(path_Ar2);
		const expectedShape = JSON.parse(expected.path_Ar2);
		expect(numericValuesAreRoughlyEqual(testShape, expectedShape)).toBe(true);
	});
	it('Import path_C', () => {
		// console.log('path_C');
		const testShape = importAndMakeSVGTestObject(path_C);
		const expectedShape = JSON.parse(expected.path_C);
		expect(numericValuesAreRoughlyEqual(testShape, expectedShape)).toBe(true);
	});
	it('Import path_Cr', () => {
		// console.log('path_Cr');
		const testShape = importAndMakeSVGTestObject(path_Cr);
		const expectedShape = JSON.parse(expected.path_Cr);
		expect(numericValuesAreRoughlyEqual(testShape, expectedShape)).toBe(true);
	});
	it('Import path_HV', () => {
		// console.log('path_HV');
		const testShape = importAndMakeSVGTestObject(path_HV);
		const expectedShape = JSON.parse(expected.path_HV);
		expect(numericValuesAreRoughlyEqual(testShape, expectedShape)).toBe(true);
	});
	it('Import path_HVr', () => {
		// console.log('path_HVr');
		const testShape = importAndMakeSVGTestObject(path_HVr);
		const expectedShape = JSON.parse(expected.path_HVr);
		expect(numericValuesAreRoughlyEqual(testShape, expectedShape)).toBe(true);
	});
	it('Import path_L', () => {
		// console.log('path_L');
		const testShape = importAndMakeSVGTestObject(path_L);
		const expectedShape = JSON.parse(expected.path_L);
		expect(numericValuesAreRoughlyEqual(testShape, expectedShape)).toBe(true);
	});
	it('Import path_Lr', () => {
		// console.log('path_Lr');
		const testShape = importAndMakeSVGTestObject(path_Lr);
		const expectedShape = JSON.parse(expected.path_Lr);
		expect(numericValuesAreRoughlyEqual(testShape, expectedShape)).toBe(true);
	});
	it('Import path_M', () => {
		// console.log('path_M');
		const testShape = importAndMakeSVGTestObject(path_M);
		const expectedShape = JSON.parse(expected.path_M);
		expect(numericValuesAreRoughlyEqual(testShape, expectedShape)).toBe(true);
	});
	it('Import path_Mr', () => {
		// console.log('path_Mr');
		const testShape = importAndMakeSVGTestObject(path_Mr);
		const expectedShape = JSON.parse(expected.path_Mr);
		expect(numericValuesAreRoughlyEqual(testShape, expectedShape)).toBe(true);
	});
	it('Import path_Q', () => {
		// console.log('path_Q');
		const testShape = importAndMakeSVGTestObject(path_Q);
		const expectedShape = JSON.parse(expected.path_Q);
		expect(numericValuesAreRoughlyEqual(testShape, expectedShape)).toBe(true);
	});
	it('Import path_Qr', () => {
		// console.log('path_Qr');
		const testShape = importAndMakeSVGTestObject(path_Qr);
		const expectedShape = JSON.parse(expected.path_Qr);
		expect(numericValuesAreRoughlyEqual(testShape, expectedShape)).toBe(true);
	});
	it('Import path_S', () => {
		// console.log('path_S');
		const testShape = importAndMakeSVGTestObject(path_S);
		const expectedShape = JSON.parse(expected.path_S);
		expect(numericValuesAreRoughlyEqual(testShape, expectedShape)).toBe(true);
	});
	it('Import path_Sr', () => {
		// console.log('path_Sr');
		const testShape = importAndMakeSVGTestObject(path_Sr);
		const expectedShape = JSON.parse(expected.path_Sr);
		expect(numericValuesAreRoughlyEqual(testShape, expectedShape)).toBe(true);
	});
	it('Import path_T', () => {
		// console.log('path_T');
		const testShape = importAndMakeSVGTestObject(path_T);
		const expectedShape = JSON.parse(expected.path_T);
		expect(numericValuesAreRoughlyEqual(testShape, expectedShape)).toBe(true);
	});
	it('Import path_Tr', () => {
		// console.log('path_Tr');
		const testShape = importAndMakeSVGTestObject(path_Tr);
		const expectedShape = JSON.parse(expected.path_Tr);
		expect(numericValuesAreRoughlyEqual(testShape, expectedShape)).toBe(true);
	});
});

describe('Import multi SVG shapes', () => {
	it('Import multi_shape_1', () => {
		// console.log('multi_shape_1');
		const testShape = importAndMakeSVGTestObject(multi_shape_1);
		const expectedShape = JSON.parse(expected.multi_shape_1);
		expect(numericValuesAreRoughlyEqual(testShape, expectedShape)).toBe(true);
	});
	it('Import multi_shape_2', () => {
		// console.log('multi_shape_2');
		const testShape = importAndMakeSVGTestObject(multi_shape_2);
		const expectedShape = JSON.parse(expected.multi_shape_2);
		expect(numericValuesAreRoughlyEqual(testShape, expectedShape)).toBe(true);
	});
	it('Import multi_shape_3', () => {
		// console.log('multi_shape_3');
		const testShape = importAndMakeSVGTestObject(multi_shape_3);
		const expectedShape = JSON.parse(expected.multi_shape_3);
		expect(numericValuesAreRoughlyEqual(testShape, expectedShape)).toBe(true);
	});
	it('Import multi_shape_4', () => {
		// console.log('multi_shape_4');
		const testShape = importAndMakeSVGTestObject(multi_shape_4);
		const expectedShape = JSON.parse(expected.multi_shape_4);
		expect(numericValuesAreRoughlyEqual(testShape, expectedShape)).toBe(true);
	});
	it('Import multi_shape_5', () => {
		// console.log('multi_shape_5');
		const testShape = importAndMakeSVGTestObject(multi_shape_5);
		const expectedShape = JSON.parse(expected.multi_shape_5);
		expect(numericValuesAreRoughlyEqual(testShape, expectedShape)).toBe(true);
	});
	it('Import multi_shape_6', () => {
		// console.log('multi_shape_6');
		const testShape = importAndMakeSVGTestObject(multi_shape_6);
		const expectedShape = JSON.parse(expected.multi_shape_6);
		expect(numericValuesAreRoughlyEqual(testShape, expectedShape)).toBe(true);
	});
});

describe('Import transformed SVG shapes', () => {
	it('Import transform_matrix', () => {
		// console.log('transform_matrix');
		const testShape = importAndMakeSVGTestObject(transform_matrix);
		const expectedShape = JSON.parse(expected.transform_matrix);
		expect(numericValuesAreRoughlyEqual(testShape, expectedShape)).toBe(true);
	});
	it('Import transform_translate', () => {
		// console.log('transform_translate');
		const testShape = importAndMakeSVGTestObject(transform_translate);
		const expectedShape = JSON.parse(expected.transform_translate);
		expect(numericValuesAreRoughlyEqual(testShape, expectedShape)).toBe(true);
	});
	it('Import transform_scale', () => {
		// console.log('transform_scale');
		const testShape = importAndMakeSVGTestObject(transform_scale);
		const expectedShape = JSON.parse(expected.transform_scale);
		expect(numericValuesAreRoughlyEqual(testShape, expectedShape)).toBe(true);
	});
	it('Import transform_skewx_position', () => {
		// console.log('transform_skewx_position');
		const testShape = importAndMakeSVGTestObject(transform_skewx_position);
		const expectedShape = JSON.parse(expected.transform_skewx_position);
		expect(numericValuesAreRoughlyEqual(testShape, expectedShape)).toBe(true);
	});
	it('Import transform_skewy_position', () => {
		// console.log('transform_skewy_position');
		const testShape = importAndMakeSVGTestObject(transform_skewy_position);
		const expectedShape = JSON.parse(expected.transform_skewy_position);
		expect(numericValuesAreRoughlyEqual(testShape, expectedShape)).toBe(true);
	});
	it('Import transform_rotate', () => {
		// console.log('transform_rotate');
		const testShape = importAndMakeSVGTestObject(transform_rotate);
		const expectedShape = JSON.parse(expected.transform_rotate);
		expect(numericValuesAreRoughlyEqual(testShape, expectedShape)).toBe(true);
	});
	it('Import transform_skewx', () => {
		// console.log('transform_skewx');
		const testShape = importAndMakeSVGTestObject(transform_skewx);
		const expectedShape = JSON.parse(expected.transform_skewx);
		expect(numericValuesAreRoughlyEqual(testShape, expectedShape)).toBe(true);
	});
	it('Import transform_skewy', () => {
		// console.log('transform_skewy');
		const testShape = importAndMakeSVGTestObject(transform_skewy);
		const expectedShape = JSON.parse(expected.transform_skewy);
		expect(numericValuesAreRoughlyEqual(testShape, expectedShape)).toBe(true);
	});
	it('Import transforms_attribute_order', () => {
		// console.log('transforms_attribute_order');
		const testShape = importAndMakeSVGTestObject(transforms_attribute_order);
		const expectedShape = JSON.parse(expected.transforms_attribute_order);
		expect(numericValuesAreRoughlyEqual(testShape, expectedShape)).toBe(true);
	});
	it('Import inherited_transforms_one_level_one_transform', () => {
		// console.log('inherited_transforms_one_level_one_transform');
		const testShape = importAndMakeSVGTestObject(inherited_transforms_one_level_one_transform);
		const expectedShape = JSON.parse(expected.inherited_transforms_one_level_one_transform);
		expect(numericValuesAreRoughlyEqual(testShape, expectedShape)).toBe(true);
	});
	it('Import inherited_transforms_hierarchy_order', () => {
		// console.log('inherited_transforms_hierarchy_order');
		const testShape = importAndMakeSVGTestObject(inherited_transforms_hierarchy_order);
		const expectedShape = JSON.parse(expected.inherited_transforms_hierarchy_order);
		expect(numericValuesAreRoughlyEqual(testShape, expectedShape)).toBe(true);
	});
	it('Import inherited_transforms_two_levels_one_transform', () => {
		// console.log('inherited_transforms_two_levels_one_transform');
		const testShape = importAndMakeSVGTestObject(inherited_transforms_two_levels_one_transform);
		const expectedShape = JSON.parse(expected.inherited_transforms_two_levels_one_transform);
		expect(numericValuesAreRoughlyEqual(testShape, expectedShape)).toBe(true);
	});
	it('Import inherited_transforms_heart', () => {
		// console.log('inherited_transforms_heart');
		const testShape = importAndMakeSVGTestObject(inherited_transforms_heart);
		const expectedShape = JSON.parse(expected.inherited_transforms_heart);
		expect(numericValuesAreRoughlyEqual(testShape, expectedShape)).toBe(true);
	});
	it('Import inherited_transforms_mixed_levels_and_transforms', () => {
		// console.log('inherited_transforms_mixed_levels_and_transforms');
		const testShape = importAndMakeSVGTestObject(inherited_transforms_mixed_levels_and_transforms);
		const expectedShape = JSON.parse(expected.inherited_transforms_mixed_levels_and_transforms);
		expect(numericValuesAreRoughlyEqual(testShape, expectedShape)).toBe(true);
	});
	it('Import transform_origin_matrix', () => {
		// console.log('transform_origin_matrix');
		const testShape = importAndMakeSVGTestObject(transform_origin_matrix);
		const expectedShape = JSON.parse(expected.transform_origin_matrix);
		expect(numericValuesAreRoughlyEqual(testShape, expectedShape)).toBe(true);
	});
	it('Import transform_origin_rotate', () => {
		// console.log('transform_origin_rotate');
		const testShape = importAndMakeSVGTestObject(transform_origin_rotate);
		const expectedShape = JSON.parse(expected.transform_origin_rotate);
		expect(numericValuesAreRoughlyEqual(testShape, expectedShape)).toBe(true);
	});
	it('Import transform_origin_rotate_two_origins', () => {
		// console.log('transform_origin_rotate_two_origins');
		const testShape = importAndMakeSVGTestObject(transform_origin_rotate_two_origins);
		const expectedShape = JSON.parse(expected.transform_origin_rotate_two_origins);
		expect(numericValuesAreRoughlyEqual(testShape, expectedShape)).toBe(true);
	});
	it('Import transform_origin_scale', () => {
		// console.log('transform_origin_scale');
		const testShape = importAndMakeSVGTestObject(transform_origin_scale);
		const expectedShape = JSON.parse(expected.transform_origin_scale);
		expect(numericValuesAreRoughlyEqual(testShape, expectedShape)).toBe(true);
	});
	it('Import transform_origin_skewx', () => {
		// console.log('transform_origin_skewx');
		const testShape = importAndMakeSVGTestObject(transform_origin_skewx);
		const expectedShape = JSON.parse(expected.transform_origin_skewx);
		expect(numericValuesAreRoughlyEqual(testShape, expectedShape)).toBe(true);
	});
	it('Import transform_origin_skewy', () => {
		// console.log('transform_origin_skewy');
		const testShape = importAndMakeSVGTestObject(transform_origin_skewy);
		const expectedShape = JSON.parse(expected.transform_origin_skewy);
		expect(numericValuesAreRoughlyEqual(testShape, expectedShape)).toBe(true);
	});
	it('Import transform_origin_translate', () => {
		// console.log('transform_origin_translate');
		const testShape = importAndMakeSVGTestObject(transform_origin_translate);
		const expectedShape = JSON.parse(expected.transform_origin_translate);
		expect(numericValuesAreRoughlyEqual(testShape, expectedShape)).toBe(true);
	});
});

describe('Import SVG shapes with the use tag', () => {
	it('Import use_href_attributes', () => {
		// console.log('use_href_attributes');
		const testShape = importAndMakeSVGTestObject(use_href_attributes);
		const expectedShape = JSON.parse(expected.use_href_attributes);
		expect(numericValuesAreRoughlyEqual(testShape, expectedShape)).toBe(true);
	});
	it('Import use_href_cascade', () => {
		// console.log('use_href_cascade');
		const testShape = importAndMakeSVGTestObject(use_href_cascade);
		const expectedShape = JSON.parse(expected.use_href_cascade);
		expect(numericValuesAreRoughlyEqual(testShape, expectedShape)).toBe(true);
	});
	it('Import use_href_transforms', () => {
		// console.log('use_href_transforms');
		const testShape = importAndMakeSVGTestObject(use_href_transforms);
		const expectedShape = JSON.parse(expected.use_href_transforms);
		expect(numericValuesAreRoughlyEqual(testShape, expectedShape)).toBe(true);
	});
	it('Import use_xlink_attributes', () => {
		// console.log('use_xlink_attributes');
		const testShape = importAndMakeSVGTestObject(use_xlink_attributes);
		const expectedShape = JSON.parse(expected.use_xlink_attributes);
		expect(numericValuesAreRoughlyEqual(testShape, expectedShape)).toBe(true);
	});
	it('Import use_xlink_cascade', () => {
		// console.log('use_xlink_cascade');
		const testShape = importAndMakeSVGTestObject(use_xlink_cascade);
		const expectedShape = JSON.parse(expected.use_xlink_cascade);
		expect(numericValuesAreRoughlyEqual(testShape, expectedShape)).toBe(true);
	});
	it('Import use_xlink_transforms', () => {
		// console.log('use_xlink_transforms');
		const testShape = importAndMakeSVGTestObject(use_xlink_transforms);
		const expectedShape = JSON.parse(expected.use_xlink_transforms);
		expect(numericValuesAreRoughlyEqual(testShape, expectedShape)).toBe(true);
	});
});
