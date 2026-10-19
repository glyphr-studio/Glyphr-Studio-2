export type GlyphId = string | number;
export type Bytes = number[] | Uint8Array;
export type RawTable = Record<string, unknown> & {
	_raw?: number[];
	_checksum?: number;
};
export type Tables = Record<string, RawTable>;
export interface FontInfo {
	familyName?: string;
	styleName?: string;
	fullName?: string;
	postScriptName?: string;
	unitsPerEm?: number;
	ascender?: number;
	descender?: number;
	lineGap?: number;
	weightClass?: number;
	widthClass?: number;
	italicAngle?: number;
	isBold?: boolean;
	isItalic?: boolean;
	[key: string]: unknown;
}
export interface Point {
	x: number;
	y: number;
	onCurve: boolean;
}
export interface PathCommand {
	type: 'M' | 'L' | 'Q' | 'C' | 'Z';
	x?: number;
	y?: number;
	x1?: number;
	y1?: number;
	x2?: number;
	y2?: number;
}
export type Contours = Point[][] | PathCommand[][];
export interface Component {
	glyphName?: string;
	glyphIndex?: number;
	dx?: number;
	dy?: number;
	scale?: number;
	scaleXY?: { x: number; y: number };
	transform?: Record<string, number>;
	flags?: Record<string, boolean>;
	argument1?: number;
	argument2?: number;
	useMyMetrics?: boolean;
}
export interface Glyph {
	name: string;
	unicode?: number | null;
	unicodes?: number[];
	advanceWidth?: number;
	leftSideBearing?: number;
	advanceHeight?: number;
	topSideBearing?: number;
	contours?: Contours;
	components?: Component[];
	charString?: number[];
	instructions?: number[];
	path?: string;
	format?: 'truetype' | 'cff';
	[key: string]: unknown;
}
export interface KerningPair {
	left: GlyphId;
	right: GlyphId;
	value: number;
}
export interface KerningClasses {
	leftClasses?: Record<string, GlyphId[]>;
	rightClasses?: Record<string, GlyphId[]>;
	classes?: Record<string, GlyphId[]>;
	pairs: KerningPair[];
}
export type KerningInput =
	| KerningPair
	| { left: GlyphId; pairs: Record<string, number> }
	| { groups: Record<string, Record<string, number>> }
	| { classes: Record<string, GlyphId[]>; pairs: KerningPair[] };
export type SubstitutionType =
	| 'single'
	| 'multiple'
	| 'alternate'
	| 'ligature'
	| 'reverse'
	| 'contextual';
export interface SubstitutionRule {
	type: SubstitutionType;
	feature?: string;
	script?: string;
	language?: string | null;
	from?: GlyphId;
	to?: GlyphId | GlyphId[];
	alternates?: GlyphId[];
	components?: GlyphId[];
	ligature?: GlyphId;
	input?: GlyphId[][];
	backtrack?: GlyphId[][];
	lookahead?: GlyphId[][];
	actions?: {
		at: number;
		substitution?: SubstitutionRule;
		substitutions?: SubstitutionRule[];
	}[];
	lookup?: Record<string, unknown>;
}
export interface SubstitutionInput extends Omit<
	SubstitutionRule,
	'from' | 'to'
> {
	classes?: Record<string, GlyphId[]>;
	substitution?: Omit<SubstitutionRule, 'type'>;
	substitutions?: Omit<SubstitutionRule, 'type'>[];
}
export interface SubstitutionFilter {
	type?: SubstitutionType;
	feature?: string;
	from?: GlyphId;
	ligature?: GlyphId;
}
export interface Axis {
	tag: string;
	name?: string;
	min: number;
	default: number;
	max: number;
	hidden?: boolean;
}
export interface NamedInstance {
	name: string;
	coordinates: Record<string, number>;
	postScriptName?: string;
}
export interface ColorGlyph {
	name: string;
	layers?: { glyph: string; paletteIndex: number }[];
	paint?: Record<string, unknown>;
}
export interface Hinting {
	gasp?: { maxPPEM: number; behavior: number }[];
	cvt?: number[];
	fpgm?: number[];
	prep?: number[];
}
export interface FontData extends Hinting {
	font: FontInfo;
	glyphs: Glyph[];
	kerning?: KerningPair[];
	kerningClasses?: KerningClasses[];
	substitutions?: SubstitutionRule[];
	axes?: Axis[];
	instances?: NamedInstance[];
	palettes?: string[][];
	colorGlyphs?: ColorGlyph[];
	features?: Tables;
	tables?: Tables;
	_header?: Record<string, unknown>;
	_woff?: Record<string, unknown>;
	[key: string]: unknown;
}
export interface RawFontData {
	header: Record<string, unknown>;
	tables: Tables;
}
export interface CollectionData {
	collection: Record<string, unknown>;
	fonts: (FontData | RawFontData)[];
}
export type FontDocument = FontData | RawFontData | CollectionData;
export interface ImportOptions {
	maxUncompressedBytes?: number;
	maxInputBytes?: number;
	maxTableBytes?: number;
	maxTables?: number;
	maxFonts?: number;
	maxGlyphs?: number;
	maxPoints?: number;
	maxCharStringOperations?: number;
	faceIndex?: number;
}
export interface ExportOptions {
	format?: 'sfnt' | 'woff' | 'woff2' | 'cff' | 'ttf' | 'otf';
	[key: string]: unknown;
}
export interface ValidationIssue {
	severity: 'error' | 'warning' | 'info';
	code: string;
	message: string;
	path?: string;
	[key: string]: unknown;
}
export interface ValidationReport {
	valid: boolean;
	errors: ValidationIssue[];
	warnings: ValidationIssue[];
	infos: ValidationIssue[];
	issues: ValidationIssue[];
	summary: {
		errorCount: number;
		warningCount: number;
		infoCount: number;
		issueCount: number;
	};
}
export class FontFlux {
	constructor(data: FontData);
	static create(options?: {
		family?: string;
		style?: string;
		unitsPerEm?: number;
		ascender?: number;
		descender?: number;
	}): FontFlux;
	static open(
		input: ArrayBuffer | Uint8Array | string,
		options?: ImportOptions,
	): FontFlux;
	static openAll(
		input: ArrayBuffer | Uint8Array | string,
		options?: Omit<ImportOptions, 'faceIndex'>,
	): FontFlux[];
	static fromJSON(jsonString: string): FontFlux;
	static initWoff2(): Promise<void>;
	static exportCollection(
		fonts: FontFlux[],
		options?: ExportOptions,
	): ArrayBuffer;
	static diagnose(buffer: ArrayBuffer): ValidationReport;
	static svgToContours(path: string, format?: 'truetype' | 'cff'): Contours;
	static contoursToSVG(contours: Contours): string;
	static compileCharString(contours: Contours): number[];
	static assembleCharString(text: string): number[];
	static interpretCharString(
		bytes: Bytes,
		globalSubrs?: Bytes[],
		localSubrs?: Bytes[],
	): { contours: Contours; width: number | null; [key: string]: unknown };
	static disassembleCharString(bytes: Bytes): string;
	readonly data: FontData;
	readonly info: FontInfo;
	readonly glyphs: Glyph[];
	readonly kerning: KerningPair[];
	readonly axes: Axis[] | undefined;
	readonly instances: NamedInstance[] | undefined;
	readonly substitutions: SubstitutionRule[];
	readonly palettes: string[][];
	readonly colorGlyphs: ColorGlyph[];
	readonly features: Tables | undefined;
	readonly tables: Tables | undefined;
	readonly glyphCount: number;
	readonly format: 'truetype' | 'cff' | 'cff2';
	getInfo(): FontInfo;
	setInfo(partial: FontInfo): void;
	listGlyphs(): { name: string; unicode: number | null; index: number }[];
	getGlyph(id: GlyphId): Glyph | undefined;
	hasGlyph(id: GlyphId): boolean;
	getGlyphContours(id: GlyphId): Contours;
	addGlyph(glyphOrOptions: Glyph): void;
	removeGlyph(id: GlyphId): boolean;
	getKerning(left: GlyphId, right: GlyphId): number | undefined;
	addKerning(input: KerningInput | KerningInput[]): void;
	removeKerning(left: GlyphId, right: GlyphId): boolean;
	listKerning(): KerningPair[];
	clearKerning(): void;
	listSubstitutions(filter?: SubstitutionFilter): SubstitutionRule[];
	getSubstitution(
		id: GlyphId,
		options?: SubstitutionFilter,
	): SubstitutionRule[];
	addSubstitution(input: SubstitutionInput | SubstitutionInput[]): void;
	removeSubstitution(filter: SubstitutionFilter): number;
	clearSubstitutions(): void;
	listAxes(): Axis[];
	getAxis(tag: string): Axis | undefined;
	addAxis(axis: Axis): void;
	removeAxis(tag: string): boolean;
	setAxis(tag: string, partial: Partial<Axis>): boolean;
	listInstances(): NamedInstance[];
	addInstance(instance: NamedInstance): void;
	removeInstance(name: string): boolean;
	getPalette(index: number): string[] | undefined;
	addPalette(
		colors: (
			| string
			| { blue: number; green: number; red: number; alpha: number }
		)[],
	): number;
	removePalette(index: number): boolean;
	setPaletteColor(paletteIndex: number, colorIndex: number, hex: string): void;
	getColorGlyph(id: GlyphId): ColorGlyph | undefined;
	addColorGlyph(input: ColorGlyph): void;
	removeColorGlyph(id: GlyphId): boolean;
	listColorGlyphs(): { name: string; type: string }[];
	getFeatures(): Tables;
	setFeatures(partial: Tables): void;
	getHinting(): Hinting;
	setHinting(partial: Hinting): void;
	export(options?: ExportOptions): ArrayBuffer;
	convertOutlines(target: 'truetype' | 'cff'): this;
	toJSON(indent?: number): string;
	validate(): ValidationReport;
	detach(): this;
}
export function initWoff2(): Promise<void>;
export function diagnoseFont(buffer: ArrayBuffer): ValidationReport;
export function fontToJSON(data: FontDocument, indent?: number): string;
export function fontFromJSON(json: string): FontDocument;
