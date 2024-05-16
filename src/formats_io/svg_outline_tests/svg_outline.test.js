import { describe } from 'vitest';
import { ioSVG_convertSVGTagsToGlyph } from '../svg_outline_import.js';

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

describe('Import basic SVG shapes', () => {
	it('Import shape_circle', () => {
		const resultGlyph = ioSVG_convertSVGTagsToGlyph(shape_circle, false);
		expect(resultGlyph?.shapes?.length).toBeTruthy();
	});
	it('Import shape_ellipse', () => {
		const resultGlyph = ioSVG_convertSVGTagsToGlyph(shape_ellipse, false);
		expect(resultGlyph?.shapes?.length).toBeTruthy();
	});
	it('Import shape_polygon', () => {
		const resultGlyph = ioSVG_convertSVGTagsToGlyph(shape_polygon, false);
		expect(resultGlyph?.shapes?.length).toBeTruthy();
	});
	it('Import shape_polyline', () => {
		const resultGlyph = ioSVG_convertSVGTagsToGlyph(shape_polyline, false);
		expect(resultGlyph?.shapes?.length).toBeTruthy();
	});
	it('Import shape_rect', () => {
		const resultGlyph = ioSVG_convertSVGTagsToGlyph(shape_rect, false);
		expect(resultGlyph?.shapes?.length).toBeTruthy();
	});
	it('Import shape_circle_multi', () => {
		const resultGlyph = ioSVG_convertSVGTagsToGlyph(shape_circle_multi, false);
		expect(resultGlyph?.shapes?.length).toBeTruthy();
	});
	it('Import shape_ellipse_multi', () => {
		const resultGlyph = ioSVG_convertSVGTagsToGlyph(shape_ellipse_multi, false);
		expect(resultGlyph?.shapes?.length).toBeTruthy();
	});
	it('Import shape_polygon_multi', () => {
		const resultGlyph = ioSVG_convertSVGTagsToGlyph(shape_polygon_multi, false);
		expect(resultGlyph?.shapes?.length).toBeTruthy();
	});
	it('Import shape_polyline_multi', () => {
		const resultGlyph = ioSVG_convertSVGTagsToGlyph(shape_polyline_multi, false);
		expect(resultGlyph?.shapes?.length).toBeTruthy();
	});
	it('Import shape_rect_multi', () => {
		const resultGlyph = ioSVG_convertSVGTagsToGlyph(shape_rect_multi, false);
		expect(resultGlyph?.shapes?.length).toBeTruthy();
	});
});

describe('Import path SVG shapes', () => {
	it('Import path_A', () => {
		const resultGlyph = ioSVG_convertSVGTagsToGlyph(path_A, false);
		expect(resultGlyph?.shapes?.length).toBeTruthy();
	});
	it('Import path_A2', () => {
		const resultGlyph = ioSVG_convertSVGTagsToGlyph(path_A2, false);
		expect(resultGlyph?.shapes?.length).toBeTruthy();
	});
	it('Import path_Ar', () => {
		const resultGlyph = ioSVG_convertSVGTagsToGlyph(path_Ar, false);
		expect(resultGlyph?.shapes?.length).toBeTruthy();
	});
	it('Import path_Ar2', () => {
		const resultGlyph = ioSVG_convertSVGTagsToGlyph(path_Ar2, false);
		expect(resultGlyph?.shapes?.length).toBeTruthy();
	});
	it('Import path_C', () => {
		const resultGlyph = ioSVG_convertSVGTagsToGlyph(path_C, false);
		expect(resultGlyph?.shapes?.length).toBeTruthy();
	});
	it('Import path_Cr', () => {
		const resultGlyph = ioSVG_convertSVGTagsToGlyph(path_Cr, false);
		expect(resultGlyph?.shapes?.length).toBeTruthy();
	});
	it('Import path_HV', () => {
		const resultGlyph = ioSVG_convertSVGTagsToGlyph(path_HV, false);
		expect(resultGlyph?.shapes?.length).toBeTruthy();
	});
	it('Import path_HVr', () => {
		const resultGlyph = ioSVG_convertSVGTagsToGlyph(path_HVr, false);
		expect(resultGlyph?.shapes?.length).toBeTruthy();
	});
	it('Import path_L', () => {
		const resultGlyph = ioSVG_convertSVGTagsToGlyph(path_L, false);
		expect(resultGlyph?.shapes?.length).toBeTruthy();
	});
	it('Import path_Lr', () => {
		const resultGlyph = ioSVG_convertSVGTagsToGlyph(path_Lr, false);
		expect(resultGlyph?.shapes?.length).toBeTruthy();
	});
	it('Import path_M', () => {
		const resultGlyph = ioSVG_convertSVGTagsToGlyph(path_M, false);
		expect(resultGlyph?.shapes?.length).toBeTruthy();
	});
	it('Import path_Mr', () => {
		const resultGlyph = ioSVG_convertSVGTagsToGlyph(path_Mr, false);
		expect(resultGlyph?.shapes?.length).toBeTruthy();
	});
	it('Import path_Q', () => {
		const resultGlyph = ioSVG_convertSVGTagsToGlyph(path_Q, false);
		expect(resultGlyph?.shapes?.length).toBeTruthy();
	});
	it('Import path_Qr', () => {
		const resultGlyph = ioSVG_convertSVGTagsToGlyph(path_Qr, false);
		expect(resultGlyph?.shapes?.length).toBeTruthy();
	});
	it('Import path_S', () => {
		const resultGlyph = ioSVG_convertSVGTagsToGlyph(path_S, false);
		expect(resultGlyph?.shapes?.length).toBeTruthy();
	});
	it('Import path_Sr', () => {
		const resultGlyph = ioSVG_convertSVGTagsToGlyph(path_Sr, false);
		expect(resultGlyph?.shapes?.length).toBeTruthy();
	});
	it('Import path_T', () => {
		const resultGlyph = ioSVG_convertSVGTagsToGlyph(path_T, false);
		expect(resultGlyph?.shapes?.length).toBeTruthy();
	});
	it('Import path_Tr', () => {
		const resultGlyph = ioSVG_convertSVGTagsToGlyph(path_Tr, false);
		expect(resultGlyph?.shapes?.length).toBeTruthy();
	});
});

describe('Import multi SVG shapes', () => {
	it('Import multi_shape_1', () => {
		const resultGlyph = ioSVG_convertSVGTagsToGlyph(multi_shape_1, false);
		expect(resultGlyph?.shapes?.length).toBeTruthy();
	});
	it('Import multi_shape_2', () => {
		const resultGlyph = ioSVG_convertSVGTagsToGlyph(multi_shape_2, false);
		expect(resultGlyph?.shapes?.length).toBeTruthy();
	});
	it('Import multi_shape_3', () => {
		const resultGlyph = ioSVG_convertSVGTagsToGlyph(multi_shape_3, false);
		expect(resultGlyph?.shapes?.length).toBeTruthy();
	});
	it('Import multi_shape_4', () => {
		const resultGlyph = ioSVG_convertSVGTagsToGlyph(multi_shape_4, false);
		expect(resultGlyph?.shapes?.length).toBeTruthy();
	});
	it('Import multi_shape_5', () => {
		const resultGlyph = ioSVG_convertSVGTagsToGlyph(multi_shape_5, false);
		expect(resultGlyph?.shapes?.length).toBeTruthy();
	});
});

describe('Import transformed SVG shapes', () => {
	it('Import transform_matrix', () => {
		const resultGlyph = ioSVG_convertSVGTagsToGlyph(transform_matrix, false);
		expect(resultGlyph?.shapes?.length).toBeTruthy();
	});
	it('Import transform_translate', () => {
		const resultGlyph = ioSVG_convertSVGTagsToGlyph(transform_translate, false);
		expect(resultGlyph?.shapes?.length).toBeTruthy();
	});
	it('Import transform_scale', () => {
		const resultGlyph = ioSVG_convertSVGTagsToGlyph(transform_scale, false);
		expect(resultGlyph?.shapes?.length).toBeTruthy();
	});
	it('Import transform_skewx_position', () => {
		const resultGlyph = ioSVG_convertSVGTagsToGlyph(transform_skewx_position, false);
		expect(resultGlyph?.shapes?.length).toBeTruthy();
	});
	it('Import transform_skewy_position', () => {
		const resultGlyph = ioSVG_convertSVGTagsToGlyph(transform_skewy_position, false);
		expect(resultGlyph?.shapes?.length).toBeTruthy();
	});
	it('Import transform_rotate', () => {
		const resultGlyph = ioSVG_convertSVGTagsToGlyph(transform_rotate, false);
		expect(resultGlyph?.shapes?.length).toBeTruthy();
	});
	it('Import transform_skewx', () => {
		const resultGlyph = ioSVG_convertSVGTagsToGlyph(transform_skewx, false);
		expect(resultGlyph?.shapes?.length).toBeTruthy();
	});
	it('Import transform_skewy', () => {
		const resultGlyph = ioSVG_convertSVGTagsToGlyph(transform_skewy, false);
		expect(resultGlyph?.shapes?.length).toBeTruthy();
	});
	it('Import transforms_attribute_order', () => {
		const resultGlyph = ioSVG_convertSVGTagsToGlyph(transforms_attribute_order, false);
		expect(resultGlyph?.shapes?.length).toBeTruthy();
	});
	it('Import inherited_transforms_one_level_one_transform', () => {
		const resultGlyph = ioSVG_convertSVGTagsToGlyph(
			inherited_transforms_one_level_one_transform,
			false
		);
		expect(resultGlyph?.shapes?.length).toBeTruthy();
	});
	it('Import inherited_transforms_hierarchy_order', () => {
		const resultGlyph = ioSVG_convertSVGTagsToGlyph(inherited_transforms_hierarchy_order, false);
		expect(resultGlyph?.shapes?.length).toBeTruthy();
	});
	it('Import inherited_transforms_two_levels_one_transform', () => {
		const resultGlyph = ioSVG_convertSVGTagsToGlyph(
			inherited_transforms_two_levels_one_transform,
			false
		);
		expect(resultGlyph?.shapes?.length).toBeTruthy();
	});
	it('Import inherited_transforms_heart', () => {
		const resultGlyph = ioSVG_convertSVGTagsToGlyph(inherited_transforms_heart, false);
		expect(resultGlyph?.shapes?.length).toBeTruthy();
	});
	it('Import inherited_transforms_mixed_levels_and_transforms', () => {
		const resultGlyph = ioSVG_convertSVGTagsToGlyph(
			inherited_transforms_mixed_levels_and_transforms,
			false
		);
		expect(resultGlyph?.shapes?.length).toBeTruthy();
	});
	it('Import transform_origin_matrix', () => {
		const resultGlyph = ioSVG_convertSVGTagsToGlyph(transform_origin_matrix, false);
		expect(resultGlyph?.shapes?.length).toBeTruthy();
	});
	it('Import transform_origin_rotate', () => {
		const resultGlyph = ioSVG_convertSVGTagsToGlyph(transform_origin_rotate, false);
		expect(resultGlyph?.shapes?.length).toBeTruthy();
	});
	it('Import transform_origin_rotate_two_origins', () => {
		const resultGlyph = ioSVG_convertSVGTagsToGlyph(transform_origin_rotate_two_origins, false);
		expect(resultGlyph?.shapes?.length).toBeTruthy();
	});
	it('Import transform_origin_scale', () => {
		const resultGlyph = ioSVG_convertSVGTagsToGlyph(transform_origin_scale, false);
		expect(resultGlyph?.shapes?.length).toBeTruthy();
	});
	it('Import transform_origin_skewx', () => {
		const resultGlyph = ioSVG_convertSVGTagsToGlyph(transform_origin_skewx, false);
		expect(resultGlyph?.shapes?.length).toBeTruthy();
	});
	it('Import transform_origin_skewy', () => {
		const resultGlyph = ioSVG_convertSVGTagsToGlyph(transform_origin_skewy, false);
		expect(resultGlyph?.shapes?.length).toBeTruthy();
	});
	it('Import transform_origin_translate', () => {
		const resultGlyph = ioSVG_convertSVGTagsToGlyph(transform_origin_translate, false);
		expect(resultGlyph?.shapes?.length).toBeTruthy();
	});
});
