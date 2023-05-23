import { GlyphrStudioProject } from '../project_data/glyphr_studio_project.js';
import { getCurrentProject, getGlyphrStudioApp } from '../app/main.js';
import { makeSemVerString, tryToGetProjectVersion } from '../io/validate_file_input.js';
import { Glyph } from '../project_data/glyph.js';
import { Path } from '../project_data/path.js';
import { PathPoint } from '../project_data/path_point.js';
import { charToHex, hexesToChars, validateAsHex } from '../common/character_ids.js';
import { ControlPoint } from '../project_data/control_point.js';
import { showError } from '../controls/dialogs/dialogs.js';
import { makeLigatureID } from '../pages/ligatures.js';
import { ComponentInstance } from '../project_data/component_instance.js';

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
	if (!importedProject) importedProject = new GlyphrStudioProject();

	const version = tryToGetProjectVersion(importedProject);
	// log(`version found: ${version.major}.${version.minor}.${version.patch}.${version.preRelease}`);

	if (version.major === 1) {
		importedProject = migrate_Project(importedProject);
	}

	// Update the version
	const app = getGlyphrStudioApp();
	importedProject.settings.project.latestVersion = app.version;
	importedProject.settings.project.initialVersion = makeSemVerString(version);

	// Hydrate after all updates
	// log(`Calling new GlyphrStudioProject from importGlyphrProjectFromText`);
	const newProject = new GlyphrStudioProject(importedProject);

	// log('importGlyphrProjectFromText', 'end');
	return newProject;
}

// --------------------------------------------------------------
// Migrate from v1 to v2
// --------------------------------------------------------------

/**
 * Starting with Glyphr Studio Project file version 1.13.2,
 * roll through updates to translate any old project file structure
 * to current project file structure.
 * Hopefully this is minimal.
 * @param {string} project - Old project object data
 * @returns {object} - Latest Glyphr Studio v2 Project structure
 */
function migrate_Project(oldProject) {
	// log('migrate_Project', 'start');

	// log(`Calling new GlyphrStudioProject from migrate_Project`);
	const newProject = new GlyphrStudioProject();

	// Glyphs
	// log(`Migrating Glyphs`);
	Object.keys(oldProject.glyphs).forEach((oldID) => {
		const newID = migrate_ItemID(oldID);
		// log(`newID: ${newID}`);
		// log(`typeof newID: ${typeof newID}`);

		newProject.glyphs[newID] = migrate_Glyph(oldProject.glyphs[oldID], newID);
	});

	// Ligatures
	// log(`Migrating Ligatures`);
	Object.keys(oldProject.ligatures).forEach((oldID) => {
		const newID = migrate_ItemID(oldID);
		const chars = hexesToChars(oldID);
		let newGsub = chars.split('').map(charToHex);
		newProject.ligatures[newID] = migrate_Glyph(oldProject.ligatures[oldID], newID);
		newProject.ligatures[newID].objType = 'Ligature';
		newProject.ligatures[newID].gsub = newGsub;
	});

	// Components
	// log(`Migrating Components`);
	Object.keys(oldProject.components).forEach((oldID) => {
		const newID = migrate_ItemID(oldID);
		newProject.components[newID] = migrate_Glyph(oldProject.components[oldID], newID);
		newProject.components[newID].objType = 'Component';
		newProject.components[newID].advanceWidth = false;
	});

	// TODO Kerns

	// Metadata
	const newPreferences = newProject.settings.app;
	const newRanges = newProject.settings.project.characterRanges;
	const newSysGuides = newProject.settings.app.guides.system;
	const newFont = newProject.settings.font;
	const oldSettings = oldProject.projectsettings;
	const oldRanges = oldProject.projectsettings.glyphrange;
	const oldGuides = oldProject.projectsettings.guides;
	const oldColors = oldProject.projectsettings.colors;
	const oldMeta = oldProject.metadata;

	newProject.settings.project.name = oldSettings.name || 'My Font';

	// Glyph ranges
	const unicodeRanges = {
		basicLatin: { begin: 0x20, end: 0x7e, name: 'Basic Latin' },
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
	newPreferences.combinePathsOnExport = oldSettings.combineshapesonexport || false;
	newPreferences.maxCombinePathsOnExport = oldSettings.maxcombineshapesonexport || 30;
	newPreferences.stopPageNavigation = oldSettings.stoppagenavigation || true;
	newPreferences.formatSaveFile = oldSettings.formatsavefile || true;
	newPreferences.contextGlyphs.showGuides = oldSettings.showcontextglyphguides || true;
	newPreferences.contextGlyphs.transparency = oldColors.contextglyphtransparency || 90;

	// Guides
	newSysGuides.transparency = oldColors.systemguidetransparency || 90;
	newSysGuides.showBaseline = oldGuides.baseline.visible || true;
	newSysGuides.showLeftSide = oldGuides.leftside.visible || true;
	newSysGuides.showRightSide = oldGuides.rightside.visible || true;
	// TODO Custom Guides

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

	// log('migrate_Project', 'end');
	return newProject;
}

/**
 * Converts a v1 Glyph, Component, or Ligature to v2
 * @param {Object} oldGlyph - v1 Glyph to migrate
 * @returns {Glyph} - new v2 Glyph
 */
function migrate_Glyph(oldGlyph, newID) {
	// log(`migrate_Glyph`, 'start');

	const newGlyph = new Glyph({
		id: newID,
		parent: getCurrentProject(),
		advanceWidth: oldGlyph.glyphwidth,
		ratioLock: oldGlyph.ratiolock,
		usedIn: oldGlyph.usedin.map(migrate_ItemID),
		contextGlyphs: oldGlyph.contextglyphs,
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
			newItem = new migrate_ComponentInstance(item);
			newGlyph.addOneShape(newItem);
		}
	});

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
		use: oldPathPoint.useh1,
		parent: newPathPoint,
	});

	newPathPoint.h2 = new ControlPoint({
		coord: oldPathPoint.H2,
		type: 'h2',
		use: oldPathPoint.useh2,
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

	let result = false;

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

	const chars = hexesToChars(oldID);
	// Ligature
	if (chars.length > 1) {
		// log(`Detected as Ligature`);
		result = makeLigatureID(chars);
	}

	// Glyph
	if (chars.length === 1) {
		// log(`Detected as Glyph`);
		result = `glyph-${validateAsHex(oldID)}`;
	}

	// log(`result: ${result}`);
	// log(`migrate_ItemID`, 'end');
	return result;
}
