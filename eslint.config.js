import js from '@eslint/js';
import prettierPlugin from 'eslint-plugin-prettier';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	{
		ignores: [
			'**/*.test.js',
			'dev/lib/**',
			'dev/samples/**',
			'dev/io/**',
			'REFACTOR_*',
			'opentype*',
		],
	},
	js.configs.recommended,
	...tseslint.configs.recommended,
	{
		plugins: {
			prettier: prettierPlugin,
		},
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: {
				...globals.browser,
				log: 'readonly',
			},
		},
		rules: {
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{
					varsIgnorePattern:
						'^(GlyphElement|XYPoint|Coord|Maxes|ControlPoint|PathPoint|Segment|Path|PolySegment|Segment|ComponentInstance|Glyph|KernGroup|CharacterRange|GlyphrStudioProject|ProjectEditor|EditCanvas)$',
				},
			],
		},
	}
);
