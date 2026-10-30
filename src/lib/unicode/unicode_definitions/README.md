# Portable Unicode definitions

Unicode 18.0.0 standard definitions, schema version 1. Copy this entire folder,
unchanged, into another project. Runtime modules import only sibling modules:
there are no application, DOM, bundler, package-install, or network dependencies.
Use ES-module imports in browsers or Node.js.

Unicode Ninja maintains the generator and verified distribution here. Glyphr
Studio and other consumers should copy the folder as a unit, not edit their
copies or replace individual generated files. Never mix Unicode releases or
schema versions. The source of truth for the definitions is the versioned
official Unicode Character Database, not either app's presentation labels.

## Public entry point

```js
import {
	getUnicodeName,
	iterateUnicodeNames,
	getParentRange,
	isControlChar,
	unicodeVersion,
} from './unicode_definitions/index.js';

getUnicodeName('0x41');     // 'LATIN CAPITAL LETTER A'
getUnicodeName('0x0041');   // same result
getUnicodeName(0x323b0);    // 'CJK UNIFIED IDEOGRAPH-323B0'
getUnicodeName('U+E0100');  // 'VARIATION SELECTOR-17'
getUnicodeName('0x0378');   // undefined: unassigned
getUnicodeName('0x0');      // undefined: controls have no Name property
isControlChar('0x0');      // true
getParentRange('0x0378');  // the official Greek and Coptic block
```

### Input and return contracts

- `normalizeCodePoint(value)` accepts integer numbers, decimal strings, hex strings
  with `0x`/`0X`, and `U+`/`u+` notation. Returns a number from 0 to 0x10FFFF,
  or `undefined` for invalid input. No implicit trimming, booleans, or fractions.
  A bare string such as `'41'` is decimal, not hexadecimal.
- `decToHex(value)` returns the GS-style uppercase, **unpadded** ID (`'0x41'`),
  or `undefined` for invalid input. Padding belongs to the consuming UI.
- `getUnicodeName(value)` returns the exact standard Name property or `undefined`.
  Unassigned positions, controls, surrogates, private-use code points, and
  noncharacters do not receive invented names or fallback strings.
- `iterateUnicodeNames()` yields `[unpaddedHexId, standardName]` pairs in numeric
  code-point order. Includes all 172,808 named characters, **not controls**.
- `isControlChar(value)` tests General_Category=Cc, including U+007F.
- `getParentRange(value)` returns an official `{ begin, end, name }` block or
  `false`. A character can be unnamed but still belong to an official block.
- `getUnicodeBlockByName(name)` returns an official block or `false`. Matching is
  exact and case-sensitive, following the GS API convention.
- `isCharInRange(value, range)` tests inclusive numeric boundaries.
- `isStandardUnicodeRange(range)` checks exact official block boundaries.
  App-defined subdivisions and unallocated gap ranges return `false`.

All exported records and arrays are **read-only by contract**. Copy objects and
arrays before applying application-specific changes.

## Files and exports

| Module | Data exports |
|---|---|
| [unicode_names_0_bmp.js](unicode_names_0_bmp.js) | `unicodeNamesBMP`, keyed by unpadded uppercase hex IDs |
| [unicode_names_1_smp.js](unicode_names_1_smp.js) | `unicodeNamesSMP`, same shape |
| [unicode_name_ranges.js](unicode_name_ranges.js) | `unicodeNameRanges`: sorted, nonoverlapping `{ begin, end, name }` records for planes 2-16; `*` means the uppercase, minimum-four-digit code point |
| [unicode_blocks_0_bmp.js](unicode_blocks_0_bmp.js) | `unicodeBlocksBMP`, `unicodeBlocksBMPUnallocated` |
| [unicode_blocks_1_smp.js](unicode_blocks_1_smp.js) | `unicodeBlocksSMP`, `unicodeBlocksSMPUnallocated` |
| [unicode_blocks_2_sip.js](unicode_blocks_2_sip.js) | `unicodeBlocksSIP`, `unicodeBlocksSIPUnallocated` |
| [unicode_blocks_3_tip.js](unicode_blocks_3_tip.js) | `unicodeBlocksTIP`, `unicodeBlocksTIPUnallocated` |
| [unicode_blocks_other.js](unicode_blocks_other.js) | `unicodeBlocksOther`, `unicodeBlocksOtherUnallocated` |
| [unicode_blocks.js](unicode_blocks.js) | `unicodeBlocks`, `unicodeUnallocatedBlocks`, and block helpers |
| [unicode_metadata.js](unicode_metadata.js) | `unicodeVersion`, `unicodeReleaseDate`, `unicodeDefinitionSchemaVersion`, `unicodeNamedCharacterCount`, `unicodeBlockCount`, `unicodeSources` |

The [entry point](index.js) also exports all of the above data and helper APIs.
`unicodeReleaseDate` is the Unicode Standard's publication date in ISO YYYY-MM-DD
format (18.0.0: 2026-09-16), not an application update or UCD file timestamp.
BMP/SMP names are fully expanded. Higher-plane naming patterns expand on demand
and apply only to exact assigned intervals, not entire blocks.

Block arrays contain the 353 official Blocks.txt records, without app-specific
IDs, control subdivisions, or display flags. Unallocated arrays are the
per-plane complement of **block allocation**, not a list of unnamed characters.
Their generated names are convenience labels, not Unicode character or block
names. They are never used by name lookup or `isStandardUnicodeRange`.

## Keep overlays outside this folder

Do not add friendly labels, font glyph names (`.null`, `space`, `exclam`),
diacritic construction recipes, custom ranges, grouped navigation, UI whitespace
policies, IDs, glyph-availability assumptions, or placeholder strings here.
In particular, having no standard name does not make a code point unusable in a
font: private-use characters are intentionally unnamed.

GS should keep its `U+...` fallback, invalid-input notification, control labels,
short-name tables, and split Basic Latin/Latin-1 display ranges in its adapters.
Ninja keeps padded IDs, `<control>` labels, and its no-name placeholder outside
the shared definitions.

## Generation and verification

Node.js 22 or newer; no dependency installation:

```sh
node generate.cjs
node generate.cjs --check
node --test tests/unicode_definitions.test.js
```

Run these commands from this folder, or prefix their paths from the project root.
The first regenerates data; `--check` verifies without writing. Both download
the pinned final Unicode 18 sources from unicode.org. They independently expand
UnicodeData ranges, compare them against DerivedName, and verify the actual
runtime name, control, and block lookup for every one of the 1,114,112 code
points. Source URLs and SHA-256 hashes appear in generated files and metadata.
Failures are reported with a nonzero process exit code.

The offline tests verify exhaustive lookup, iteration, metadata, gap coverage,
API contracts, and use of the whole folder copied into an unrelated directory.
For a future Unicode release, update the generator's pinned version and Standard
publication date, any new
algorithmic range families, version-specific tests and documentation, regenerate,
and verify before distributing the folder.

The Unicode version changes with the data release. The schema version changes
only when consumers need to adapt to a changed data/API contract.

## Licenses

Unicode data is covered by [Unicode License V3](LICENSE.txt). Helper code and
tooling retain the parent project's [GPL 3.0 license](LICENSE-gpl-3.0.txt).
Keep both notices when redistributing this folder; the Unicode data license
does not relicense the surrounding application or helper code.
