export function getVersionTwoTestProject() {
	// log('getVersionTwoTestProject', 'start');
	const versionTwoTestProject = {
		projectSettings: {
			name: 'Alpha Test Font',
			versionName: 'Version 2 Alpha',
			version: '2.0.0',
			initialVersion: '2.0.0-alpha1',
			projectID: 'g2_ALPHATESTPROJECT1',
			upm: 1000,
			ascent: 800,
			capHeight: 790,
			xHeight: 580,
			descent: -200,
		},

		metadata: {
			font_family: 'Alpha Test',
		},

		glyphs: {
			'0x20': {
				id: '0x20',
				advanceWidth: 200,
			},
			'0x0041': {
				id: '0x0041',
				objType: 'Glyph',
				name: 'Latin Capital Letter A',
				advanceWidth: 530,
				leftSideBearing: 10,
				rightSideBearing: 10,
				paths: [
					{
						objType: 'Path',
						name: 'Large outline',
						pathPoints: [
							{
								objType: 'PathPoint',
								p: { objType: 'ControlPoint', coord: { objType: 'Coord', x: 363.2, y: 145 } },
							},
							{
								objType: 'PathPoint',
								p: { objType: 'ControlPoint', coord: { objType: 'Coord', x: 166.7, y: 145 } },
							},
							{
								objType: 'PathPoint',
								p: { objType: 'ControlPoint', coord: { objType: 'Coord', x: 130, y: 0 } },
							},
							{
								objType: 'PathPoint',
								p: { objType: 'ControlPoint', coord: { objType: 'Coord', x: 0, y: 0 } },
							},
							{
								objType: 'PathPoint',
								p: { objType: 'ControlPoint', coord: { objType: 'Coord', x: 197, y: 790 } },
							},
							{
								objType: 'PathPoint',
								p: { objType: 'ControlPoint', coord: { objType: 'Coord', x: 333, y: 790 } },
							},
							{
								objType: 'PathPoint',
								p: { objType: 'ControlPoint', coord: { objType: 'Coord', x: 530, y: 0 } },
							},
							{
								objType: 'PathPoint',
								p: { objType: 'ControlPoint', coord: { objType: 'Coord', x: 400, y: 0 } },
							},
						],
					},
					{
						objType: 'Path',
						name: 'Interior triangle',
						pathPoints: [
							{
								objType: 'PathPoint',
								p: { objType: 'ControlPoint', coord: { objType: 'Coord', x: 332.9, y: 265 } },
							},
							{
								objType: 'PathPoint',
								p: { objType: 'ControlPoint', coord: { objType: 'Coord', x: 265, y: 533 } },
							},
							{
								objType: 'PathPoint',
								p: { objType: 'ControlPoint', coord: { objType: 'Coord', x: 197.1, y: 265 } },
							},
						],
					},
				],
			},
			'0x0042': {
				id: '0x0042',
				objType: 'Glyph',
				name: 'Latin Capital Letter B',
				advanceWidth: 385,
				leftSideBearing: false,
				rightSideBearing: false,
				paths: [
					{
						objType: 'Path',
						name: 'Large outline',
						pathPoints: [
							{
								objType: 'PathPoint',
								p: { objType: 'ControlPoint', coord: { objType: 'Coord', x: 339.9, y: 397 } },
								h1: { objType: 'ControlPoint', coord: { objType: 'Coord', x: 366.6, y: 410 } },
								h2: { objType: 'ControlPoint', coord: { objType: 'Coord', x: 366.6, y: 384 } },
							},
							{
								objType: 'PathPoint',
								p: { objType: 'ControlPoint', coord: { objType: 'Coord', x: 385, y: 325 } },
								h1: { objType: 'ControlPoint', coord: { objType: 'Coord', x: 385, y: 356.7 } },
							},
							{
								objType: 'PathPoint',
								p: { objType: 'ControlPoint', coord: { objType: 'Coord', x: 385, y: 80 } },
								h2: { objType: 'ControlPoint', coord: { objType: 'Coord', x: 385, y: 35.8 } },
							},
							{
								objType: 'PathPoint',
								p: { objType: 'ControlPoint', coord: { objType: 'Coord', x: 305, y: 0 } },
								h1: { objType: 'ControlPoint', coord: { objType: 'Coord', x: 349.2, y: 0 } },
							},
							{
								objType: 'PathPoint',
								p: { objType: 'ControlPoint', coord: { objType: 'Coord', x: 0, y: 0 } },
							},
							{
								objType: 'PathPoint',
								p: { objType: 'ControlPoint', coord: { objType: 'Coord', x: 0, y: 790 } },
							},
							{
								objType: 'PathPoint',
								p: { objType: 'ControlPoint', coord: { objType: 'Coord', x: 305, y: 790 } },
								h2: { objType: 'ControlPoint', coord: { objType: 'Coord', x: 349.2, y: 790 } },
							},
							{
								objType: 'PathPoint',
								p: { objType: 'ControlPoint', coord: { objType: 'Coord', x: 385, y: 710 } },
								h1: { objType: 'ControlPoint', coord: { objType: 'Coord', x: 385, y: 754.2 } },
							},
							{
								objType: 'PathPoint',
								p: { objType: 'ControlPoint', coord: { objType: 'Coord', x: 385, y: 469 } },
								h2: { objType: 'ControlPoint', coord: { objType: 'Coord', x: 385, y: 437.3 } },
								type: 'flat',
							},
						],
					},
					{
						objType: 'Path',
						name: 'Top interior square',
						pathPoints: [
							{
								objType: 'PathPoint',
								p: { objType: 'ControlPoint', coord: { objType: 'Coord', x: 140, y: 460 } },
							},
							{
								objType: 'PathPoint',
								p: { objType: 'ControlPoint', coord: { objType: 'Coord', x: 250, y: 460 } },
							},
							{
								objType: 'PathPoint',
								p: { objType: 'ControlPoint', coord: { objType: 'Coord', x: 250, y: 645 } },
							},
							{
								objType: 'PathPoint',
								p: { objType: 'ControlPoint', coord: { objType: 'Coord', x: 140, y: 645 } },
							},
						],
					},
					{
						objType: 'Path',
						name: 'Bottom interior square',
						pathPoints: [
							{
								objType: 'PathPoint',
								p: { objType: 'ControlPoint', coord: { objType: 'Coord', x: 140, y: 133 } },
							},
							{
								objType: 'PathPoint',
								p: { objType: 'ControlPoint', coord: { objType: 'Coord', x: 250, y: 133 } },
							},
							{
								objType: 'PathPoint',
								p: { objType: 'ControlPoint', coord: { objType: 'Coord', x: 250, y: 327 } },
							},
							{
								objType: 'PathPoint',
								p: { objType: 'ControlPoint', coord: { objType: 'Coord', x: 140, y: 327 } },
							},
						],
					},
				],
			},
			'0x0043': {
				id: '0x0043',
				objType: 'Glyph',
				name: 'Latin Capital Letter C',
				advanceWidth: 400,
				leftSideBearing: false,
				rightSideBearing: false,
				paths: [
					{
						objType: 'Path',
						pathPoints: [
							{
								objType: 'PathPoint',
								p: { objType: 'ControlPoint', coord: { objType: 'Coord', x: 260, y: 540 } },
							},
							{
								objType: 'PathPoint',
								p: { objType: 'ControlPoint', coord: { objType: 'Coord', x: 260, y: 645 } },
							},
							{
								objType: 'PathPoint',
								p: { objType: 'ControlPoint', coord: { objType: 'Coord', x: 145, y: 645 } },
							},
							{
								objType: 'PathPoint',
								p: { objType: 'ControlPoint', coord: { objType: 'Coord', x: 145, y: 145 } },
							},
							{
								objType: 'PathPoint',
								p: { objType: 'ControlPoint', coord: { objType: 'Coord', x: 260, y: 145 } },
							},
							{
								objType: 'PathPoint',
								p: { objType: 'ControlPoint', coord: { objType: 'Coord', x: 260, y: 250 } },
							},
							{
								objType: 'PathPoint',
								p: { objType: 'ControlPoint', coord: { objType: 'Coord', x: 400, y: 250 } },
							},
							{
								objType: 'PathPoint',
								p: { objType: 'ControlPoint', coord: { objType: 'Coord', x: 400, y: 80 } },
								h2: { objType: 'ControlPoint', coord: { objType: 'Coord', x: 400, y: 35.8 } },
							},
							{
								objType: 'PathPoint',
								p: { objType: 'ControlPoint', coord: { objType: 'Coord', x: 320, y: 0 } },
								h1: { objType: 'ControlPoint', coord: { objType: 'Coord', x: 364.2, y: 0 } },
							},
							{
								objType: 'PathPoint',
								p: { objType: 'ControlPoint', coord: { objType: 'Coord', x: 80, y: 0 } },
								h2: { objType: 'ControlPoint', coord: { objType: 'Coord', x: 35.8, y: 0 } },
							},
							{
								objType: 'PathPoint',
								p: { objType: 'ControlPoint', coord: { objType: 'Coord', x: 0, y: 80 } },
								h1: { objType: 'ControlPoint', coord: { objType: 'Coord', x: 0, y: 35.8 } },
								type: 'flat',
							},
							{
								objType: 'PathPoint',
								p: { objType: 'ControlPoint', coord: { objType: 'Coord', x: 0, y: 710 } },
								h2: { objType: 'ControlPoint', coord: { objType: 'Coord', x: 0, y: 754.2 } },
							},
							{
								objType: 'PathPoint',
								p: { objType: 'ControlPoint', coord: { objType: 'Coord', x: 80, y: 790 } },
								h1: { objType: 'ControlPoint', coord: { objType: 'Coord', x: 35.8, y: 790 } },
								type: 'flat',
							},
							{
								objType: 'PathPoint',
								p: { objType: 'ControlPoint', coord: { objType: 'Coord', x: 320, y: 790 } },
								h2: { objType: 'ControlPoint', coord: { objType: 'Coord', x: 364.2, y: 790 } },
							},
							{
								objType: 'PathPoint',
								p: { objType: 'ControlPoint', coord: { objType: 'Coord', x: 400, y: 710 } },
								h1: { objType: 'ControlPoint', coord: { objType: 'Coord', x: 400, y: 754.2 } },
							},
							{
								objType: 'PathPoint',
								p: { objType: 'ControlPoint', coord: { objType: 'Coord', x: 400, y: 540 } },
							},
						],
					},
				],
			},
		},
	};

	// log(versionTwoTestProject);
	// log('getVersionTwoTestProject', 'end');
	return versionTwoTestProject;
}
