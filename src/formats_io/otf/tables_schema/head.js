/**
 * OpenType head table schema for UI form generation
 * Based on: https://learn.microsoft.com/en-us/typography/opentype/spec/head
 */

export const headTableSchema = {
	// Table metadata
	tableName: 'head',
	description: 'Font Header Table - gives global information about the font',

	// Field definitions for form generation
	fields: {
		majorVersion: {
			type: 'number',
			dataType: 'uint16',
			label: 'Major Version',
			description: 'Major version number of the font header table',
			defaultValue: 1,
			readonly: true,
			min: 1,
			max: 1,
			required: true,
		},

		minorVersion: {
			type: 'number',
			dataType: 'uint16',
			label: 'Minor Version',
			description: 'Minor version number of the font header table',
			defaultValue: 0,
			readonly: true,
			min: 0,
			max: 0,
			required: true,
		},

		fontRevision: {
			type: 'number',
			dataType: 'Fixed',
			label: 'Font Revision',
			description: 'Set by font manufacturer (Fixed-point number)',
			defaultValue: 1.0,
			step: 0.001,
			required: true,
		},

		checksumAdjustment: {
			type: 'number',
			dataType: 'uint32',
			label: 'Checksum Adjustment',
			description: 'Computed checksum value (0xB1B0AFBA - sum of entire font)',
			readonly: true,
			format: 'hex',
			required: true,
		},

		magicNumber: {
			type: 'number',
			dataType: 'uint32',
			label: 'Magic Number',
			description: 'Must be set to 0x5F0F3CF5',
			defaultValue: 0x5f0f3cf5,
			readonly: true,
			format: 'hex',
			required: true,
		},

		flags: {
			type: 'bitmask',
			dataType: 'uint16',
			label: 'Flags',
			description: 'Various font flags',
			required: true,
			bits: {
				0: {
					label: 'Baseline at y=0',
					description: 'Baseline for font at y=0',
				},
				1: {
					label: 'Left sidebearing at x=0',
					description: 'Left sidebearing point at x=0 (TrueType only)',
				},
				2: {
					label: 'Point size dependent',
					description: 'Instructions may depend on point size',
				},
				3: {
					label: 'Force integer ppem',
					description: 'Force ppem to integer values for internal scaler math',
				},
				4: {
					label: 'Variable advance width',
					description: 'Instructions may alter advance width',
				},
				5: {
					label: 'Vertical layout (deprecated)',
					description: 'Not used in OpenType, should not be set',
					deprecated: true,
				},
				6: { label: 'Reserved', description: 'Not used, should be cleared', reserved: true },
				7: { label: 'Reserved', description: 'Not used, should be cleared', reserved: true },
				8: { label: 'Reserved', description: 'Not used, should be cleared', reserved: true },
				9: { label: 'Reserved', description: 'Not used, should be cleared', reserved: true },
				10: { label: 'Reserved', description: 'Not used, should be cleared', reserved: true },
				11: {
					label: 'Lossless font data',
					description:
						'Font data is "lossless" as a result of having been subjected only to lossless compression',
				},
				12: {
					label: 'Converted font',
					description: 'Font converted (produce compatible metrics)',
				},
				13: {
					label: 'Optimized for ClearType',
					description: 'Font optimized for ClearType',
				},
				14: {
					label: 'Last Resort font',
					description: 'Last Resort font',
				},
				15: { label: 'Reserved', description: 'Reserved, set to 0', reserved: true },
			},
		},

		unitsPerEm: {
			type: 'number',
			dataType: 'uint16',
			label: 'Units Per Em',
			description:
				'Number of font units per em square (16-16384, power of 2 recommended for TrueType)',
			min: 16,
			max: 16384,
			defaultValue: 1000,
			required: true,
			validation: {
				powerOfTwo: 'recommended for TrueType fonts',
			},
		},

		created: {
			type: 'datetime',
			dataType: 'LONGDATETIME',
			label: 'Created Date',
			description: 'Font creation date (seconds since January 1, 1904 GMT)',
			required: true,
		},

		modified: {
			type: 'datetime',
			dataType: 'LONGDATETIME',
			label: 'Modified Date',
			description: 'Font modification date (seconds since January 1, 1904 GMT)',
			required: true,
		},

		xMin: {
			type: 'number',
			dataType: 'int16',
			label: 'X Min',
			description: 'Minimum x coordinate across all glyph bounding boxes',
			readonly: true,
			computed: true,
			required: true,
		},

		yMin: {
			type: 'number',
			dataType: 'int16',
			label: 'Y Min',
			description: 'Minimum y coordinate across all glyph bounding boxes',
			readonly: true,
			computed: true,
			required: true,
		},

		xMax: {
			type: 'number',
			dataType: 'int16',
			label: 'X Max',
			description: 'Maximum x coordinate across all glyph bounding boxes',
			readonly: true,
			computed: true,
			required: true,
		},

		yMax: {
			type: 'number',
			dataType: 'int16',
			label: 'Y Max',
			description: 'Maximum y coordinate across all glyph bounding boxes',
			readonly: true,
			computed: true,
			required: true,
		},

		macStyle: {
			type: 'bitmask',
			dataType: 'uint16',
			label: 'Mac Style',
			description: 'Font style bits (must agree with OS/2 fsSelection)',
			required: true,
			bits: {
				0: {
					label: 'Bold',
					description: 'Bold font style',
				},
				1: {
					label: 'Italic',
					description: 'Italic font style',
				},
				2: {
					label: 'Underline',
					description: 'Underline font style',
				},
				3: {
					label: 'Outline',
					description: 'Outline font style',
				},
				4: {
					label: 'Shadow',
					description: 'Shadow font style',
				},
				5: {
					label: 'Condensed',
					description: 'Condensed font style',
				},
				6: {
					label: 'Extended',
					description: 'Extended font style',
				},
				7: { label: 'Reserved', description: 'Reserved, set to 0', reserved: true },
				8: { label: 'Reserved', description: 'Reserved, set to 0', reserved: true },
				9: { label: 'Reserved', description: 'Reserved, set to 0', reserved: true },
				10: { label: 'Reserved', description: 'Reserved, set to 0', reserved: true },
				11: { label: 'Reserved', description: 'Reserved, set to 0', reserved: true },
				12: { label: 'Reserved', description: 'Reserved, set to 0', reserved: true },
				13: { label: 'Reserved', description: 'Reserved, set to 0', reserved: true },
				14: { label: 'Reserved', description: 'Reserved, set to 0', reserved: true },
				15: { label: 'Reserved', description: 'Reserved, set to 0', reserved: true },
			},
		},

		lowestRecPPEM: {
			type: 'number',
			dataType: 'uint16',
			label: 'Lowest Recommended PPEM',
			description: 'Smallest readable size in pixels',
			min: 1,
			max: 65535,
			defaultValue: 8,
			required: true,
		},

		fontDirectionHint: {
			type: 'select',
			dataType: 'int16',
			label: 'Font Direction Hint',
			description: 'Deprecated - indicates font directionality (set to 2)',
			defaultValue: 2,
			deprecated: true,
			required: true,
			options: [
				{
					value: -2,
					label: 'Strong RTL + neutrals',
					description: 'Like -1 but also contains neutrals',
				},
				{ value: -1, label: 'Strong RTL only', description: 'Only strongly right to left' },
				{ value: 0, label: 'Mixed directional', description: 'Fully mixed directional glyphs' },
				{ value: 1, label: 'Strong LTR only', description: 'Only strongly left to right' },
				{
					value: 2,
					label: 'Strong LTR + neutrals',
					description: 'Like 1 but also contains neutrals (recommended)',
				},
			],
		},

		indexToLocFormat: {
			type: 'select',
			dataType: 'int16',
			label: 'Index to Location Format',
			description: 'Format of the loca table offsets',
			required: true,
			options: [
				{
					value: 0,
					label: 'Short offsets (Offset16)',
					description: 'Use 16-bit offsets in loca table',
				},
				{
					value: 1,
					label: 'Long offsets (Offset32)',
					description: 'Use 32-bit offsets in loca table',
				},
			],
		},

		glyphDataFormat: {
			type: 'number',
			dataType: 'int16',
			label: 'Glyph Data Format',
			description: 'Format of glyph data (0 for current format)',
			defaultValue: 0,
			readonly: true,
			required: true,
		},
	},

	// Form layout suggestions
	layout: {
		sections: [
			{
				title: 'Version Information',
				fields: ['majorVersion', 'minorVersion', 'fontRevision'],
			},
			{
				title: 'Technical Data',
				fields: ['checksumAdjustment', 'magicNumber', 'unitsPerEm'],
			},
			{
				title: 'Font Flags',
				fields: ['flags', 'macStyle'],
			},
			{
				title: 'Timestamps',
				fields: ['created', 'modified'],
			},
			{
				title: 'Bounding Box (Computed)',
				fields: ['xMin', 'yMin', 'xMax', 'yMax'],
				readonly: true,
			},
			{
				title: 'Display & Format',
				fields: ['lowestRecPPEM', 'fontDirectionHint', 'indexToLocFormat', 'glyphDataFormat'],
			},
		],
	},

	// Validation rules
	validation: {
		// Cross-field validation
		rules: [
			{
				fields: ['macStyle', 'os2.fsSelection'],
				rule: 'must_agree',
				message: 'macStyle bits must agree with OS/2 fsSelection bits',
			},
			{
				field: 'unitsPerEm',
				rule: 'power_of_two_recommended',
				condition: 'truetype_outlines',
				message: 'Power of 2 recommended for TrueType fonts',
			},
		],
	},
};

// Helper functions for UI generation
export const headTableHelpers = {
	/**
	 * Convert field definition to form input configuration
	 * @param {string} fieldName
	 * @param {object} fieldDef
	 * @returns {object}
	 */
	getFormFieldConfig(fieldName, fieldDef) {
		const config = {
			name: fieldName,
			label: fieldDef.label,
			type: fieldDef.type,
			description: fieldDef.description,
			required: fieldDef.required || false,
			readonly: fieldDef.readonly || false,
			defaultValue: fieldDef.defaultValue,
		};

		// Add type-specific properties
		switch (fieldDef.type) {
			case 'number':
				config.min = fieldDef.min;
				config.max = fieldDef.max;
				config.step = fieldDef.step;
				break;
			case 'select':
				config.options = fieldDef.options;
				break;
			case 'bitmask':
				config.bits = fieldDef.bits;
				break;
			case 'datetime':
				config.format = 'datetime-local';
				break;
		}

		return config;
	},

	/**
	 * Get all editable fields (non-readonly, non-computed)
	 * @returns {array}
	 */
	getEditableFields() {
		return Object.entries(headTableSchema.fields)
			.filter(([, def]) => !def.readonly && !def.computed)
			.map(([name]) => name);
	},

	/**
	 * Get computed/readonly fields
	 * @returns {array}
	 */
	getComputedFields() {
		return Object.entries(headTableSchema.fields)
			.filter(([, def]) => def.readonly || def.computed)
			.map(([name]) => name);
	},

	/**
	 * Convert bitmask value to individual bit states
	 * @param {number} value
	 * @param {object} bitDefs
	 * @returns {object}
	 */
	decodeBitmask(value, bitDefs) {
		const result = {};
		Object.entries(bitDefs).forEach(([bit]) => {
			result[bit] = !!(value & (1 << parseInt(bit)));
		});
		return result;
	},

	/**
	 * Convert individual bit states to bitmask value
	 * @param {object} bitStates
	 * @returns {number}
	 */
	encodeBitmask(bitStates) {
		let value = 0;
		Object.entries(bitStates).forEach(([bit, state]) => {
			if (state) {
				value |= 1 << parseInt(bit);
			}
		});
		return value;
	},
};
