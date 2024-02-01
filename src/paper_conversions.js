import { paper } from './app/app';
import { clone } from './common/functions';
import { ioSVG_convertSVGTagsToGlyph } from './formats_io/svg_outline_import';

export function convert_makePaperPath(gsPath) {
	log(`convert_makePaperPath`, 'start');
	log(`\n⮟gsPath⮟`);
	log(gsPath);

	const pathData = gsPath.svgPathData;
	log(`\n⮟pathData⮟`);
	log(pathData);
	const resultPath = new paper.Path(pathData);

	log(`\n⮟resultPath⮟`);
	log(resultPath);
	log(`convert_makePaperPath`, 'end');
	return resultPath;
}

export function convert_makeGlyphrStudioPath(paperPath) {
	log(`convert_makeGlyphrStudioPath`, 'start');

	const newPathSVG = paperPath.exportSVG();
	log(newPathSVG);
	const newGSPaths = ioSVG_convertSVGTagsToGlyph(
		`<svg><path d="${newPathSVG.getAttribute('d')}"></path></svg>`
	).shapes;

	log(`\n⮟newGSPaths[0]⮟`);
	log(clone(newGSPaths[0]));

	log(`convert_makeGlyphrStudioPath`, 'end');
	return newGSPaths;
}
