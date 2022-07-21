import { log } from '../common/functions.js';
import { samples } from './samples.js';
export default {};
export { getVersionTwoTestProject };

function getVersionTwoTestProject() {
  log('getVersionTwoTestProject', 'start');
  // let testGlyphShapes = samples.glyphBox.shapes;
  const versionTwoTestProject = {
    projectSettings:{
      name:'Alpha Test Font',
      versionName:'Version 2 Alpha',
      version:'2.0.0',
      initialVersion:'2.0.0',
    },

    metadata:{
      font_family:'Alpha Test'
    },

    glyphs:{
      '0x0041':{
        id:'0x0041',
        objType:'Glyph',
        name:'Latin Capital Letter A',
        glyphWidth:530, leftSideBearing:10, rightSideBearing:10,
        shapes:[
          {objType:'Shape', name:'Path 1', 'path':
            {objType:'Path',
              pathPoints:[
                {objType:'PathPoint', 'P':{objType:'Coord', x:363.2, y:145}, 'H1':{objType:'Coord', x:363.2, y:145}, 'H2':{objType:'Coord', x:363.2, y:145}, 'type':'corner', 'useh1':false, 'useh2':false},
                {objType:'PathPoint', 'P':{objType:'Coord', x:166.7, y:145}, 'H1':{objType:'Coord', x:166.7, y:145}, 'H2':{objType:'Coord', x:166.7, y:145}, 'type':'corner', 'useh1':false, 'useh2':false},
                {objType:'PathPoint', 'P':{objType:'Coord', x:130, y:0}, 'H1':{objType:'Coord', x:130, y:0}, 'H2':{objType:'Coord', x:130, y:0}, 'type':'corner', 'useh1':false, 'useh2':false},
                {objType:'PathPoint', 'P':{objType:'Coord', x:0, y:0}, 'H1':{objType:'Coord', x:0, y:0}, 'H2':{objType:'Coord', x:0, y:0}, 'type':'corner', 'useh1':false, 'useh2':false},
                {objType:'PathPoint', 'P':{objType:'Coord', x:197, y:790}, 'H1':{objType:'Coord', x:197, y:790}, 'H2':{objType:'Coord', x:197, y:790}, 'type':'corner', 'useh1':false, 'useh2':false},
                {objType:'PathPoint', 'P':{objType:'Coord', x:333, y:790}, 'H1':{objType:'Coord', x:333, y:790}, 'H2':{objType:'Coord', x:333, y:790}, 'type':'corner', 'useh1':false, 'useh2':false},
                {objType:'PathPoint', 'P':{objType:'Coord', x:530, y:0}, 'H1':{objType:'Coord', x:530, y:0}, 'H2':{objType:'Coord', x:530, y:0}, 'type':'corner', 'useh1':false, 'useh2':false},
                {objType:'PathPoint', 'P':{objType:'Coord', x:400, y:0}, 'H1':{objType:'Coord', x:400, y:0}, 'H2':{objType:'Coord', x:400, y:0}, 'type':'symmetric', 'useh1':true, 'useh2':true}
              ]
            },
          },
          {objType:'Shape', name:'Path 2', 'path':
            {objType:'Path',
              pathPoints:[
                {objType:'PathPoint', 'P':{objType:'Coord', x:332.9, y:265}, 'H1':{objType:'Coord', x:332.9, y:265}, 'H2':{objType:'Coord', x:332.9, y:265}, 'type':'corner', 'useh1':false, 'useh2':false},
                {objType:'PathPoint', 'P':{objType:'Coord', x:265, y:533}, 'H1':{objType:'Coord', x:265, y:533}, 'H2':{objType:'Coord', x:265, y:533}, 'type':'corner', 'useh1':false, 'useh2':false},
              {objType:'PathPoint', 'P':{objType:'Coord', x:197.1, y:265}, 'H1':{objType:'Coord', x:197.1, y:265}, 'H2':{objType:'Coord', x:197.1, y:265}, 'type':'symmetric', 'useh1':true, 'useh2':true}
              ]
            },
          }
        ]
      },
      '0x0042':{
        id:'0x0042',
        objType:'Glyph',
        name:'Latin Capital Letter B',
        glyphWidth:385, leftSideBearing:false, rightSideBearing:false,
        shapes:[
          {objType:'Shape', name:'Path 1', 'path':
            {objType:'Path',
              pathPoints:[
                {objType:'PathPoint', 'P':{objType:'Coord', x:339.9, y:397}, 'H1':{objType:'Coord', x:366.6, y:410}, 'H2':{objType:'Coord', x:366.6, y:384}, 'type':'corner', 'useh1':true, 'useh2':true},
                {objType:'PathPoint', 'P':{objType:'Coord', x:385, y:325}, 'H1':{objType:'Coord', x:385, y:356.7}, 'H2':{objType:'Coord', x:385, y:325}, 'type':'corner', 'useh1':true, 'useh2':false},
                {objType:'PathPoint', 'P':{objType:'Coord', x:385, y:80}, 'H1':{objType:'Coord', x:385, y:80}, 'H2':{objType:'Coord', x:385, y:35.8}, 'type':'corner', 'useh1':false, 'useh2':true},
                {objType:'PathPoint', 'P':{objType:'Coord', x:305, y:0}, 'H1':{objType:'Coord', x:349.2, y:0}, 'H2':{objType:'Coord', x:305, y:0}, 'type':'corner', 'useh1':true, 'useh2':false},
                {objType:'PathPoint', 'P':{objType:'Coord', x:140, y:0}, 'H1':{objType:'Coord', x:140, y:0}, 'H2':{objType:'Coord', x:140, y:0}, 'type':'corner', 'useh1':false, 'useh2':false},
                {objType:'PathPoint', 'P':{objType:'Coord', x:0, y:0}, 'H1':{objType:'Coord', x:0, y:0}, 'H2':{objType:'Coord', x:0, y:0}, 'type':'corner', 'useh1':false, 'useh2':false},
                {objType:'PathPoint', 'P':{objType:'Coord', x:0, y:133}, 'H1':{objType:'Coord', x:0, y:133}, 'H2':{objType:'Coord', x:0, y:133}, 'type':'corner', 'useh1':false, 'useh2':false},
                {objType:'PathPoint', 'P':{objType:'Coord', x:0, y:327}, 'H1':{objType:'Coord', x:0, y:327}, 'H2':{objType:'Coord', x:0, y:327}, 'type':'corner', 'useh1':false, 'useh2':false},
                {objType:'PathPoint', 'P':{objType:'Coord', x:0, y:460}, 'H1':{objType:'Coord', x:0, y:460}, 'H2':{objType:'Coord', x:0, y:460}, 'type':'corner', 'useh1':false, 'useh2':false},
                {objType:'PathPoint', 'P':{objType:'Coord', x:0, y:645}, 'H1':{objType:'Coord', x:0, y:645}, 'H2':{objType:'Coord', x:0, y:645}, 'type':'corner', 'useh1':false, 'useh2':false},
                {objType:'PathPoint', 'P':{objType:'Coord', x:0, y:790}, 'H1':{objType:'Coord', x:0, y:790}, 'H2':{objType:'Coord', x:0, y:790}, 'type':'corner', 'useh1':false, 'useh2':false},
                {objType:'PathPoint', 'P':{objType:'Coord', x:140, y:790}, 'H1':{objType:'Coord', x:140, y:790}, 'H2':{objType:'Coord', x:140, y:790}, 'type':'corner', 'useh1':false, 'useh2':false},
                {objType:'PathPoint', 'P':{objType:'Coord', x:305, y:790}, 'H1':{objType:'Coord', x:305, y:790}, 'H2':{objType:'Coord', x:349.2, y:790}, 'type':'corner', 'useh1':false, 'useh2':true},
                {objType:'PathPoint', 'P':{objType:'Coord', x:385, y:710}, 'H1':{objType:'Coord', x:385, y:754.2}, 'H2':{objType:'Coord', x:385, y:710}, 'type':'corner', 'useh1':true, 'useh2':false},
                {objType:'PathPoint', 'P':{objType:'Coord', x:385, y:469}, 'H1':{objType:'Coord', x:385, y:469}, 'H2':{objType:'Coord', x:385, y:437.3}, 'type':'flat', 'useh1':false, 'useh2':true}
              ],
            },
          },
          {objType:'Shape', name:'Path 2', 'path':
            {objType:'Path',
              pathPoints:[
                {objType:'PathPoint', 'P':{objType:'Coord', x:140, y:460}, 'H1':{objType:'Coord', x:140, y:460}, 'H2':{objType:'Coord', x:140, y:460}, 'type':'corner', 'useh1':false, 'useh2':false},
                {objType:'PathPoint', 'P':{objType:'Coord', x:250, y:460}, 'H1':{objType:'Coord', x:250, y:460}, 'H2':{objType:'Coord', x:250, y:460}, 'type':'corner', 'useh1':false, 'useh2':false},
                {objType:'PathPoint', 'P':{objType:'Coord', x:250, y:469}, 'H1':{objType:'Coord', x:250, y:469}, 'H2':{objType:'Coord', x:250, y:469}, 'type':'corner', 'useh1':false, 'useh2':false},
                {objType:'PathPoint', 'P':{objType:'Coord', x:250, y:549.1}, 'H1':{objType:'Coord', x:250, y:549.1}, 'H2':{objType:'Coord', x:250, y:549.1}, 'type':'corner', 'useh1':false, 'useh2':false},
                {objType:'PathPoint', 'P':{objType:'Coord', x:250, y:645}, 'H1':{objType:'Coord', x:250, y:645}, 'H2':{objType:'Coord', x:250, y:645}, 'type':'corner', 'useh1':false, 'useh2':false},
                {objType:'PathPoint', 'P':{objType:'Coord', x:140, y:645}, 'H1':{objType:'Coord', x:140, y:645}, 'H2':{objType:'Coord', x:140, y:645}, 'type':'symmetric', 'useh1':true, 'useh2':true}
              ]
            },
          },
          {objType:'Shape', name:'Path 3', 'path':
            {objType:'Path',
              pathPoints:[
                {objType:'PathPoint', 'P':{objType:'Coord', x:140, y:133}, 'H1':{objType:'Coord', x:140, y:133}, 'H2':{objType:'Coord', x:140, y:133}, 'type':'corner', 'useh1':false, 'useh2':false},
                {objType:'PathPoint', 'P':{objType:'Coord', x:250, y:133}, 'H1':{objType:'Coord', x:250, y:133}, 'H2':{objType:'Coord', x:250, y:133}, 'type':'corner', 'useh1':false, 'useh2':false},
                {objType:'PathPoint', 'P':{objType:'Coord', x:250, y:249.1}, 'H1':{objType:'Coord', x:250, y:249.1}, 'H2':{objType:'Coord', x:250, y:249.1}, 'type':'corner', 'useh1':false, 'useh2':false},
                {objType:'PathPoint', 'P':{objType:'Coord', x:250, y:325}, 'H1':{objType:'Coord', x:250, y:325}, 'H2':{objType:'Coord', x:250, y:325}, 'type':'corner', 'useh1':false, 'useh2':false},
                {objType:'PathPoint', 'P':{objType:'Coord', x:250, y:327}, 'H1':{objType:'Coord', x:250, y:327}, 'H2':{objType:'Coord', x:250, y:327}, 'type':'corner', 'useh1':false, 'useh2':false},
                {objType:'PathPoint', 'P':{objType:'Coord', x:140, y:327}, 'H1':{objType:'Coord', x:140, y:327}, 'H2':{objType:'Coord', x:140, y:327}, 'type':'symmetric', 'useh1':true, 'useh2':true}
              ]
            },
          }
        ]
      },
      '0x0043':{
        id:'0x0043',
        objType:'Glyph',
        name:'Latin Capital Letter C',
        glyphWidth:400, leftSideBearing:false, rightSideBearing:false,
        shapes:[
          {objType:'Shape', name:'Path 1', 'path':
            {objType:'Path',
              pathPoints:[
                {objType:'PathPoint', 'P':{objType:'Coord', x:260, y:540}, 'H1':{objType:'Coord', x:260, y:540}, 'H2':{objType:'Coord', x:260, y:540}, 'type':'corner', 'useh1':false, 'useh2':false},
                {objType:'PathPoint', 'P':{objType:'Coord', x:260, y:645}, 'H1':{objType:'Coord', x:260, y:645}, 'H2':{objType:'Coord', x:260, y:645}, 'type':'corner', 'useh1':false, 'useh2':false},
                {objType:'PathPoint', 'P':{objType:'Coord', x:145, y:645}, 'H1':{objType:'Coord', x:145, y:645}, 'H2':{objType:'Coord', x:145, y:645}, 'type':'corner', 'useh1':false, 'useh2':false},
                {objType:'PathPoint', 'P':{objType:'Coord', x:145, y:145}, 'H1':{objType:'Coord', x:145, y:145}, 'H2':{objType:'Coord', x:145, y:145}, 'type':'corner', 'useh1':false, 'useh2':false},
                {objType:'PathPoint', 'P':{objType:'Coord', x:260, y:145}, 'H1':{objType:'Coord', x:260, y:145}, 'H2':{objType:'Coord', x:260, y:145}, 'type':'corner', 'useh1':false, 'useh2':false},
                {objType:'PathPoint', 'P':{objType:'Coord', x:260, y:250}, 'H1':{objType:'Coord', x:260, y:250}, 'H2':{objType:'Coord', x:260, y:250}, 'type':'corner', 'useh1':false, 'useh2':false},
                {objType:'PathPoint', 'P':{objType:'Coord', x:400, y:250}, 'H1':{objType:'Coord', x:400, y:250}, 'H2':{objType:'Coord', x:400, y:250}, 'type':'corner', 'useh1':false, 'useh2':false},
                {objType:'PathPoint', 'P':{objType:'Coord', x:400, y:80}, 'H1':{objType:'Coord', x:400, y:80}, 'H2':{objType:'Coord', x:400, y:35.8}, 'type':'corner', 'useh1':false, 'useh2':true},
                {objType:'PathPoint', 'P':{objType:'Coord', x:320, y:0}, 'H1':{objType:'Coord', x:364.2, y:0}, 'H2':{objType:'Coord', x:320, y:0}, 'type':'corner', 'useh1':true, 'useh2':false},
                {objType:'PathPoint', 'P':{objType:'Coord', x:80, y:0}, 'H1':{objType:'Coord', x:80, y:0}, 'H2':{objType:'Coord', x:35.8, y:0}, 'type':'corner', 'useh1':false, 'useh2':true},
                {objType:'PathPoint', 'P':{objType:'Coord', x:0, y:80}, 'H1':{objType:'Coord', x:0, y:35.8}, 'H2':{objType:'Coord', x:0, y:80}, 'type':'flat', 'useh1':true, 'useh2':false},
                {objType:'PathPoint', 'P':{objType:'Coord', x:0, y:710}, 'H1':{objType:'Coord', x:0, y:710}, 'H2':{objType:'Coord', x:0, y:754.2}, 'type':'corner', 'useh1':false, 'useh2':true},
                {objType:'PathPoint', 'P':{objType:'Coord', x:80, y:790}, 'H1':{objType:'Coord', x:35.8, y:790}, 'H2':{objType:'Coord', x:80, y:790}, 'type':'flat', 'useh1':true, 'useh2':false},
                {objType:'PathPoint', 'P':{objType:'Coord', x:320, y:790}, 'H1':{objType:'Coord', x:320, y:790}, 'H2':{objType:'Coord', x:364.2, y:790}, 'type':'corner', 'useh1':false, 'useh2':true},
                {objType:'PathPoint', 'P':{objType:'Coord', x:400, y:710}, 'H1':{objType:'Coord', x:400, y:754.2}, 'H2':{objType:'Coord', x:400, y:710}, 'type':'corner', 'useh1':true, 'useh2':false},
                {objType:'PathPoint', 'P':{objType:'Coord', x:400, y:540}, 'H1':{objType:'Coord', x:400, y:540}, 'H2':{objType:'Coord', x:400, y:540}, 'type':'symmetric', 'useh1':true, 'useh2':true}
              ]
            }
          }
        ]
      }
    }
  };

  log(versionTwoTestProject);
  log('getVersionTwoTestProject', 'end');
  return versionTwoTestProject;
}
