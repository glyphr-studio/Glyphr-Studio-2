import { describe } from 'vitest';
import { ioSVG_convertSVGTagsToGlyph } from '../svg_outline_import.js';
import { expected } from './svg_expected_results.js';

// SVG Test Files
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

/**
 * Simulates importing SVG code and converting it to a
 * Glyphr Studio Glyph
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
		const test = importAndMakeSVGTestString(shape_circle);
		expect(test).toEqual(expected.shape_circle);
	});
	it('Import shape_ellipse', () => {
		const test = importAndMakeSVGTestString(shape_ellipse);
		expect(test).toEqual(expected.shape_ellipse);
	});
	it('Import shape_polygon', () => {
		const test = importAndMakeSVGTestString(shape_polygon);
		expect(test).toEqual(expected.shape_polygon);
	});
	it('Import shape_polyline', () => {
		const test = importAndMakeSVGTestString(shape_polyline);
		expect(test).toEqual(expected.shape_polyline);
	});
	it('Import shape_rect', () => {
		const test = importAndMakeSVGTestString(shape_rect);
		expect(test).toEqual(expected.shape_rect);
	});
	it('Import shape_circle_multi', () => {
		const test = importAndMakeSVGTestString(shape_circle_multi);
		expect(test).toEqual(expected.shape_circle_multi);
	});
	it('Import shape_ellipse_multi', () => {
		const test = importAndMakeSVGTestString(shape_ellipse_multi);
		expect(test).toEqual(expected.shape_ellipse_multi);
	});
	it('Import shape_polygon_multi', () => {
		const test = importAndMakeSVGTestString(shape_polygon_multi);
		expect(test).toEqual(expected.shape_polygon_multi);
	});
	it('Import shape_polyline_multi', () => {
		const test = importAndMakeSVGTestString(shape_polyline_multi);
		expect(test).toEqual(expected.shape_polyline_multi);
	});
	it('Import shape_rect_multi', () => {
		const test = importAndMakeSVGTestString(shape_rect_multi);
		expect(test).toEqual(expected.shape_rect_multi);
	});
});

describe('Import path SVG shapes', () => {
	it('Import path_A', () => {
		const test = importAndMakeSVGTestString(path_A);
		expect(test).toEqual(expected.path_A);
	});
	it('Import path_A2', () => {
		const test = importAndMakeSVGTestString(path_A2);
		expect(test).toEqual(expected.path_A2);
	});
	it('Import path_Ar', () => {
		const test = importAndMakeSVGTestString(path_Ar);
		expect(test).toEqual(expected.path_Ar);
	});
	it('Import path_Ar2', () => {
		const test = importAndMakeSVGTestString(path_Ar2);
		expect(test).toEqual(expected.path_Ar2);
	});
	it('Import path_C', () => {
		const test = importAndMakeSVGTestString(path_C);
		expect(test).toEqual(expected.path_C);
	});
	it('Import path_Cr', () => {
		const test = importAndMakeSVGTestString(path_Cr);
		expect(test).toEqual(expected.path_Cr);
	});
	it('Import path_HV', () => {
		const test = importAndMakeSVGTestString(path_HV);
		expect(test).toEqual(expected.path_HV);
	});
	it('Import path_HVr', () => {
		const test = importAndMakeSVGTestString(path_HVr);
		expect(test).toEqual(expected.path_HVr);
	});
	it('Import path_L', () => {
		const test = importAndMakeSVGTestString(path_L);
		expect(test).toEqual(expected.path_L);
	});
	it('Import path_Lr', () => {
		const test = importAndMakeSVGTestString(path_Lr);
		expect(test).toEqual(expected.path_Lr);
	});
	it('Import path_M', () => {
		const test = importAndMakeSVGTestString(path_M);
		expect(test).toEqual(expected.path_M);
	});
	it('Import path_Mr', () => {
		const test = importAndMakeSVGTestString(path_Mr);
		expect(test).toEqual(expected.path_Mr);
	});
	it('Import path_Q', () => {
		const test = importAndMakeSVGTestString(path_Q);
		expect(test).toEqual(expected.path_Q);
	});
	it('Import path_Qr', () => {
		const test = importAndMakeSVGTestString(path_Qr);
		expect(test).toEqual(expected.path_Qr);
	});
	it('Import path_S', () => {
		const test = importAndMakeSVGTestString(path_S);
		expect(test).toEqual(expected.path_S);
	});
	it('Import path_Sr', () => {
		const test = importAndMakeSVGTestString(path_Sr);
		expect(test).toEqual(expected.path_Sr);
	});
	it('Import path_T', () => {
		const test = importAndMakeSVGTestString(path_T);
		expect(test).toEqual(expected.path_T);
	});
	it('Import path_Tr', () => {
		const test = importAndMakeSVGTestString(path_Tr);
		expect(test).toEqual(expected.path_Tr);
	});
});

describe('Import multi SVG shapes', () => {
	it('Import multi_shape_1', () => {
		const test = importAndMakeSVGTestString(multi_shape_1);
		expect(test).toEqual(expected.multi_shape_1);
	});
	it('Import multi_shape_2', () => {
		const test = importAndMakeSVGTestString(multi_shape_2);
		expect(test).toEqual(expected.multi_shape_2);
	});
	it('Import multi_shape_3', () => {
		const test = importAndMakeSVGTestString(multi_shape_3);
		expect(test).toEqual(expected.multi_shape_3);
	});
	it('Import multi_shape_4', () => {
		const test = importAndMakeSVGTestString(multi_shape_4);
		expect(test).toEqual(expected.multi_shape_4);
	});
	it('Import multi_shape_5', () => {
		const test = importAndMakeSVGTestString(multi_shape_5);
		expect(test).toEqual(expected.multi_shape_5);
	});
});

describe('Import transformed SVG shapes', () => {
	it('Import transform_matrix', () => {
		const test = importAndMakeSVGTestString(transform_matrix);
		expect(test).toEqual(expected.transform_matrix);
	});
	it('Import transform_translate', () => {
		const test = importAndMakeSVGTestString(transform_translate);
		expect(test).toEqual(expected.transform_translate);
	});
	it('Import transform_scale', () => {
		const test = importAndMakeSVGTestString(transform_scale);
		expect(test).toEqual(expected.transform_scale);
	});
	it('Import transform_skewx_position', () => {
		const test = importAndMakeSVGTestString(transform_skewx_position);
		expect(test).toEqual(expected.transform_skewx_position);
	});
	it('Import transform_skewy_position', () => {
		const test = importAndMakeSVGTestString(transform_skewy_position);
		expect(test).toEqual(expected.transform_skewy_position);
	});
	it('Import transform_rotate', () => {
		const test = importAndMakeSVGTestString(transform_rotate);
		expect(test).toEqual(expected.transform_rotate);
	});
	it('Import transform_skewx', () => {
		const test = importAndMakeSVGTestString(transform_skewx);
		expect(test).toEqual(expected.transform_skewx);
	});
	it('Import transform_skewy', () => {
		const test = importAndMakeSVGTestString(transform_skewy);
		expect(test).toEqual(expected.transform_skewy);
	});
	it('Import transforms_attribute_order', () => {
		const test = importAndMakeSVGTestString(transforms_attribute_order);
		expect(test).toEqual(expected.transforms_attribute_order);
	});
	it('Import inherited_transforms_one_level_one_transform', () => {
		const test = importAndMakeSVGTestString(inherited_transforms_one_level_one_transform);
		expect(test).toEqual(expected.inherited_transforms_one_level_one_transform);
	});
	it('Import inherited_transforms_hierarchy_order', () => {
		const test = importAndMakeSVGTestString(inherited_transforms_hierarchy_order);
		expect(test).toEqual(expected.inherited_transforms_hierarchy_order);
	});
	it('Import inherited_transforms_two_levels_one_transform', () => {
		const test = importAndMakeSVGTestString(inherited_transforms_two_levels_one_transform);
		expect(test).toEqual(expected.inherited_transforms_two_levels_one_transform);
	});
	it('Import inherited_transforms_heart', () => {
		const test = importAndMakeSVGTestString(inherited_transforms_heart);
		expect(test).toEqual(expected.inherited_transforms_heart);
	});
	it('Import inherited_transforms_mixed_levels_and_transforms', () => {
		const test = importAndMakeSVGTestString(inherited_transforms_mixed_levels_and_transforms);
		expect(test).toEqual(expected.inherited_transforms_mixed_levels_and_transforms);
	});
	it('Import transform_origin_matrix', () => {
		const test = importAndMakeSVGTestString(transform_origin_matrix);
		expect(test).toEqual(expected.transform_origin_matrix);
	});
	it('Import transform_origin_rotate', () => {
		const test = importAndMakeSVGTestString(transform_origin_rotate);
		expect(test).toEqual(expected.transform_origin_rotate);
	});
	it('Import transform_origin_rotate_two_origins', () => {
		const test = importAndMakeSVGTestString(transform_origin_rotate_two_origins);
		expect(test).toEqual(expected.transform_origin_rotate_two_origins);
	});
	it('Import transform_origin_scale', () => {
		const test = importAndMakeSVGTestString(transform_origin_scale);
		expect(test).toEqual(expected.transform_origin_scale);
	});
	it('Import transform_origin_skewx', () => {
		const test = importAndMakeSVGTestString(transform_origin_skewx);
		expect(test).toEqual(expected.transform_origin_skewx);
	});
	it('Import transform_origin_skewy', () => {
		const test = importAndMakeSVGTestString(transform_origin_skewy);
		expect(test).toEqual(expected.transform_origin_skewy);
	});
	it('Import transform_origin_translate', () => {
		const test = importAndMakeSVGTestString(transform_origin_translate);
		expect(test).toEqual(expected.transform_origin_translate);
	});
});
