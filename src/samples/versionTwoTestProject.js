import { log } from '../common/functions.js';
import { samples } from './samples.js';
export default {};
export { getVersionTwoTestProject };

function getVersionTwoTestProject() {
  log('getVersionTwoTestProject', 'start');
  let testGlyphShapes = samples.glyphBox.shapes;
  const versionTwoTestProject = {
    projectSettings: {
      name: 'Alpha Test Font',
      versionName: 'Version 2 Alpha',
      version: '2.0.0',
      initialVersion: '2.0.0',
    },
    metadata: {
      font_family: 'Alpha Test'
    },
    glyphs: {
      '0x0041': { id: '0x0041', shapes: testGlyphShapes },
      '0x0042': { id: '0x0042', shapes: testGlyphShapes },
      '0x0043': { id: '0x0043', shapes: testGlyphShapes },
    },
  };

  log(versionTwoTestProject);
  log('getVersionTwoTestProject', 'end');
  return versionTwoTestProject;
}
