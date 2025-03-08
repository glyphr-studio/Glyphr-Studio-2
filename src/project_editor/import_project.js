import { getCurrentProject, getCurrentProjectEditor, getGlyphrStudioApp } from '../app/main.js';
import { charToHex, hexesToChars, validateAsHex } from '../common/character_ids.js';
import { makeSemVerString, tryToGetProjectVersion } from '../formats_io/validate_file_input.js';
import { makeLigatureID } from '../pages/ligatures.js';
import { ComponentInstance } from '../project_data/component_instance.js';
import { ControlPoint } from '../project_data/control_point.js';
import { Glyph } from '../project_data/glyph.js';
import { GlyphrStudioProject, sortLigatures } from '../project_data/glyphr_studio_project.js';
import { KernGroup } from '../project_data/kern_group.js';
import { Path } from '../project_data/path.js';
import { PathPoint } from '../project_data/path_point.js';
import { Guide } from './guide.js';

/**
 * Takes a js Object from a JSON-based project file, and returns
 * a Glyphr Studio project object.
 * @param {Object} importedProject - Object from JSON project file data
 * @returns {GlyphrStudioProject}
 */
export function importGlyphrProjectFromText(importedProject) {
	// log('importGlyphrProjectFromText', 'start');
	if (typeof importedProject === 'string') importedProject = JSON.parse(importedProject);
	// log('passed:');
	// log(importedProject);
	if (!importedProject) importedProject = new GlyphrStudioProject({});

	const version = tryToGetProjectVersion(importedProject);
	// log(`version found: ${version.major}.${version.minor}.${version.patch}.${version.preRelease}`);

	// Migrate from v1 where possible
	if (version.major === 1) {
		importedProject = migrate__v1_13_2_to_v2_0_0(importedProject);
	}

	// Apply v2.5 changes to Kern value data
	if (version.major === 2 && version.minor < 5) {
		importedProject = migrate__v2_0_0_to_v2_5_0(importedProject);
	}

	// Update the version
	const app = getGlyphrStudioApp();
	importedProject.settings.project.latestVersion = app.version;
	if (!importedProject.settings.project.initialVersion) {
		importedProject.settings.project.initialVersion = makeSemVerString(version);
	}

	// Hydrate after all updates
	const newProject = new GlyphrStudioProject(importedProject);

	// Pull system guide visibility from project
	const projectSystemGuides = newProject?.settings?.app?.guides?.systemGuides;
	if (projectSystemGuides) {
		// log(`\n⮟projectSystemGuides⮟`);
		// log(projectSystemGuides);
		const editor = getCurrentProjectEditor();
		editor.systemGuides = {
			ascent: projectSystemGuides.includes('ascent'),
			capHeight: projectSystemGuides.includes('capHeight'),
			xHeight: projectSystemGuides.includes('xHeight'),
			baseline: projectSystemGuides.includes('baseline'),
			descent: projectSystemGuides.includes('descent'),
			leftSide: projectSystemGuides.includes('leftSide'),
			rightSide: projectSystemGuides.includes('rightSide'),
		};
		// log(`\n⮟editor.systemGuides⮟`);
		// log(editor.systemGuides);
	}

	// log('importGlyphrProjectFromText', 'end');
	return newProject;
}

// --------------------------------------------------------------
// Migrate v2.0.0 to v2.5.0
// --------------------------------------------------------------
/**
 * v2.5 introduced Kern Writing, and flipped how Glyphr Studio
 * stores kern values.
 * @param {GlyphrStudioProject} project - Old project data
 * @returns {GlyphrStudioProject} - Updated project data
 */
function migrate__v2_0_0_to_v2_5_0(project) {
	// Kerns
	Object.keys(project.kerning).forEach((kernID) => {
		project.kerning[kernID].value *= -1;
	});
	return project;
}

// --------------------------------------------------------------
// Migrate from v1 to v2
// --------------------------------------------------------------

/**
 * Starting with Glyphr Studio Project file version 1.13.2,
 * roll through updates to translate any old project file structure
 * to current project file structure.
 * Hopefully this is minimal.
 * @param {Object} oldProject - Old project object data
 * @returns {GlyphrStudioProject} - Latest Glyphr Studio v2 Project structure
 */
function migrate__v1_13_2_to_v2_0_0(oldProject) {
	// log('_0_0mig_rate_v1_13_2_to_v2', 'start');

	const newProject = new GlyphrStudioProject({});

	// Side Bearings
	const defaultLSB = oldProject.projectsettings.defaultlsb;
	const defaultRSB = oldProject.projectsettings.defaultrsb;

	// Glyphs
	// log(`Migrating Glyphs`);
	Object.keys(oldProject.glyphs).forEach((oldID) => {
		const newID = migrate_ItemID(oldID);
		// log(`newID: ${newID}`);
		// log(`typeof newID: ${typeof newID}`);

		newProject.glyphs[newID] = migrate_Glyph(
			oldProject.glyphs[oldID],
			newID,
			defaultLSB,
			defaultRSB
		);
	});

	// Ligatures
	// log(`Migrating Ligatures`);
	const importedLigatures = [];
	Object.keys(oldProject.ligatures).forEach((oldID) => {
		const newID = migrate_ItemID(oldID);
		const chars = hexesToChars(oldID);
		if (chars !== false) {
			const newGsub = chars.split('').map(charToHex);
			const newLigature = migrate_Glyph(oldProject.ligatures[oldID], newID, defaultLSB, defaultRSB);

			// log(`oldID: ${oldID}\t newID: ${newID}\t chars: ${chars}`);
			newLigature.objType = 'Ligature';
			newLigature.gsub = newGsub;
			importedLigatures.push(newLigature);
			// log(newLigature);
		}
	});

	const sortedLigatures = importedLigatures.sort(sortLigatures);
	sortedLigatures.forEach((ligature) => {
		newProject.ligatures[ligature.id] = ligature;
	});

	// Components
	// log(`Migrating Components`);
	Object.keys(oldProject.components).forEach((oldID) => {
		const newID = migrate_ItemID(oldID);
		newProject.components[newID] = migrate_Glyph(
			oldProject.components[oldID],
			newID,
			defaultLSB,
			defaultRSB
		);
		newProject.components[newID].objType = 'Component';
		newProject.components[newID].advanceWidth = false;
	});

	// Kerns
	Object.keys(oldProject.kerning).forEach((oldID) => {
		const newID = migrate_ItemID(oldID);
		const oldKern = oldProject.kerning[oldID];
		newProject.kerning[newID] = new KernGroup({
			value: oldKern.value,
			leftGroup: oldKern.leftgroup.map((oldID) => validateAsHex(oldID)),
			rightGroup: oldKern.rightgroup.map((oldID) => validateAsHex(oldID)),
		});
	});

	// Metadata
	const newPreferences = newProject.settings.app;
	const newRanges = newProject.settings.project.characterRanges;
	const newGuides = newProject.settings.app.guides;
	const newFont = newProject.settings.font;
	const oldSettings = oldProject.projectsettings;
	const oldRanges = oldProject.projectsettings.glyphrange;
	const oldGuides = oldProject.projectsettings.guides;
	const oldColors = oldProject.projectsettings.colors;
	const oldMeta = oldProject.metadata;

	newProject.settings.project.name = oldSettings.name || 'My Font';

	// Glyph ranges
	const unicodeRanges = {
		basicLatin: { begin: 0x20, end: 0x7f, name: 'Basic Latin' },
		latinSupplementControls: { begin: 0x80, end: 0x9f, name: 'Latin Supplement Controls' },
		latinSupplement: { begin: 0xa0, end: 0xff, name: 'Latin Supplement' },
		latinExtendedA: { begin: 0x100, end: 0x17f, name: 'Latin Extended A' },
		latinExtendedB: { begin: 0x180, end: 0x24f, name: 'Latin Extended B' },
	};
	if (oldRanges.basiclatin) newRanges.push(unicodeRanges.basicLatin);
	if (oldRanges.latinsupplement) newRanges.push(unicodeRanges.latinSupplement);
	if (oldRanges.latinextendeda) newRanges.push(unicodeRanges.latinExtendedA);
	if (oldRanges.latinextendedb) newRanges.push(unicodeRanges.latinExtendedB);
	if (oldRanges.custom.length) oldRanges.custom.forEach((range) => newRanges.push(range));

	// Preferences
	// newPreferences.showNonCharPoints = oldSettings.glyphrange.filternoncharpoints || true;
	newPreferences.stopPageNavigation = oldSettings.stoppagenavigation || true;
	newPreferences.formatSaveFile = oldSettings.formatsavefile || true;
	newPreferences.contextCharacters.showGuides = oldSettings.showcontextglyphguides || true;
	newPreferences.contextCharacters.transparency = oldColors.contextglyphtransparency || 90;

	// Guides
	newGuides.systemTransparency = oldColors.systemguidetransparency || 70;
	newGuides.customTransparency = oldColors.systemguidetransparency || 70;
	if (oldGuides && Object.keys(oldGuides).length) {
		Object.keys(oldGuides).forEach((key) => {
			let oldGuide = oldGuides[key];
			if (oldGuide.editable) {
				newGuides.custom.push(
					new Guide({
						angle: oldGuide.type === 'horizontal' ? 90 : 0,
						location: oldGuide.location,
						name: oldGuide.name,
						color: oldGuide.color,
						visible: oldGuide.visible,
					})
				);
			}
		});
	}

	// Font
	newFont.family = oldMeta.font_family || 'My Font';
	newFont.style = oldMeta.font_style || 'normal';
	newFont.panose = oldMeta.panose_1 || '2 0 0 0 0 0 0 0 0 0';
	newFont.upm = oldSettings.upm || 1000;
	newFont.ascent = oldSettings.ascent || 700;
	newFont.descent = oldSettings.descent || -300;
	newFont.capHeight = oldSettings.capHeight || 675;
	newFont.xHeight = oldSettings.xHeight || 400;
	newFont.lineGap = oldSettings.lineGap || 250;
	newFont.italicAngle = oldSettings.italicAngle || 0;
	newFont.overshoot = oldSettings.overshoot || 10;
	newFont.designer = oldMeta.designer || '';
	newFont.designerURL = oldMeta.designerURL || '';
	newFont.manufacturer = oldMeta.manufacturer || '';
	newFont.manufacturerURL = oldMeta.manufacturerURL || '';
	newFont.license = oldMeta.license || '';
	newFont.licenseURL = oldMeta.licenseURL || '';
	newFont.version = oldMeta.version || '';
	newFont.description = oldMeta.description || '';
	newFont.copyright = oldMeta.copyright || '';
	newFont.trademark = oldMeta.trademark || '';

	// SVG Font properties
	newFont.variant = oldMeta.font_variant || 'normal';
	newFont.weight = oldMeta.font_weight || 400;
	newFont.stretch = oldMeta.font_stretch || 'normal';
	newFont.stemv = oldMeta.stemv || 0;
	newFont.stemh = oldMeta.stemh || 0;
	newFont.slope = oldMeta.slope || 0;
	newFont.underlinePosition = oldMeta.underline_position || -50;
	newFont.underlineThickness = oldMeta.underline_thickness || 10;
	newFont.strikethroughPosition = oldMeta.strikethrough_position || 300;
	newFont.strikethrough_thickness = oldMeta.strikethrough_thickness || 10;
	newFont.overlinePosition = oldMeta.overline_position || 750;
	newFont.overlineThickness = oldMeta.overline_thickness || 10;

	// log('_0_0mig_rate_v1_13_2_to_v2', 'end');
	return newProject;
}

/**
 * Converts a v1 Glyph, Component, or Ligature to v2
 * @param {Object} oldGlyph - v1 Glyph to migrate
 * @returns {Glyph} - new v2 Glyph
 */
function migrate_Glyph(oldGlyph, newID, defaultLSB = 0, defaultRSB = 0) {
	// log(`migrate_Glyph`, 'start');

	const newGlyph = new Glyph({
		id: newID,
		parent: getCurrentProject(),
		advanceWidth: oldGlyph.glyphwidth || 0,
		ratioLock: oldGlyph.ratiolock || false,
		usedIn: oldGlyph?.usedin?.map(migrate_ItemID) || [],
		contextCharacters: oldGlyph.contextglyphs || '',
	});

	let newItem;
	oldGlyph.shapes.forEach((item) => {
		if (item.path) {
			// Regular Shape
			// log(`importing item as path`);
			// log(item);
			newItem = migrate_Path(item, newGlyph);
			newGlyph.addOneShape(newItem);
		} else {
			// Component Instance
			// log(`import item as COMPONENT INSTANCE`);
			// log(item);
			newItem = migrate_ComponentInstance(item);
			newGlyph.addOneShape(newItem);
		}
	});

	if (oldGlyph.isautowide) {
		const lsb = oldGlyph.leftsidebearing || defaultLSB;
		const rsb = oldGlyph.rightsidebearing || defaultRSB;
		newGlyph.leftSideBearing = lsb;
		newGlyph.rightSideBearing = rsb;
	}

	// log(newGlyph);
	// log(`migrate_Glyph`, 'end');
	return newGlyph;
}

/**
 * Converts a v1 Path to v2
 * @param {Object} oldShape - v1 Shape to migrate
 * @returns {Path} - new v2 Path
 */
function migrate_Path(oldShape, parentGlyph) {
	const newPath = new Path();
	newPath.parent = parentGlyph;
	newPath.name = oldShape.name;
	newPath.xLock = oldShape.xlock;
	newPath.yLock = oldShape.ylock;
	newPath.wLock = oldShape.wlock;
	newPath.hLock = oldShape.hlock;
	newPath.ratioLock = oldShape.ratiolock;

	if (oldShape.path) {
		oldShape.path.pathpoints.forEach((point) => {
			newPath.pathPoints.push(migrate_PathPoint(point, newPath));
		});
	} else {
		// log(oldShape);
	}

	return newPath;
}

/**
 * Converts a v1 PathPoint to v2
 * @param {Object} oldPathPoint - v1 PathPoint to migrate
 * @returns {PathPoint} - new v2 PathPoint
 */
function migrate_PathPoint(oldPathPoint, parentPath) {
	const newPathPoint = new PathPoint();
	newPathPoint.parent = parentPath;
	newPathPoint.p = new ControlPoint({
		coord: oldPathPoint.P,
		type: 'p',
		parent: newPathPoint,
	});

	newPathPoint.h1 = new ControlPoint({
		coord: oldPathPoint.H1,
		type: 'h1',
		use: oldPathPoint?.useh1 || false,
		parent: newPathPoint,
	});

	newPathPoint.h2 = new ControlPoint({
		coord: oldPathPoint.H2,
		type: 'h2',
		use: oldPathPoint?.useh2 || false,
		parent: newPathPoint,
	});

	// do NOT .resolvePointType
	return newPathPoint;
}

function migrate_ComponentInstance(oldItem) {
	const newItem = new ComponentInstance();
	newItem.link = migrate_ItemID(oldItem.link);
	newItem.translateX = oldItem.translatex;
	newItem.translateY = oldItem.translatey;
	newItem.resizeWidth = oldItem.scalew;
	newItem.resizeHeight = oldItem.scaleh;
	newItem.isFlippedNS = oldItem.flipns;
	newItem.isFlippedEW = oldItem.flipew;
	newItem.reverseWinding = oldItem.reversewinding;
	newItem.rotation = oldItem.rotation;
	newItem.rotateFirst = oldItem.rotatefirst;
	return newItem;
}

function migrate_ItemID(oldID) {
	// log(`migrate_ItemID`, 'start');
	// log(`oldID: ${oldID}`);

	let result = '';

	// Component
	if (oldID.startsWith('com')) {
		// log(`Detected as Component`);
		result = `comp-${oldID.split('com')[1]}`;
	}

	// Kern
	if (oldID.startsWith('kern')) {
		// log(`Detected as Kern`);
		result = `kern-${oldID.split('kern')[1]}`;
	}

	if (oldID.startsWith('id')) {
		// log(`Detected as Kern (old id format)`);
		result = `kern-${oldID.split('id')[1]}`;
	}

	const chars = hexesToChars(oldID);
	// Ligature

	if (chars !== false && chars.length > 1) {
		// log(`Detected as Ligature`);
		result = makeLigatureID(chars) || '';
	}

	// Glyph

	if (chars !== false && chars.length === 1) {
		// log(`Detected as Glyph`);
		result = `glyph-${validateAsHex(oldID)}`;
		// log(`oldID: ${oldID} \t result: ${result}`);
	}

	// log(`result: ${result}`);
	// log(`migrate_ItemID`, 'end');
	return result;
}
