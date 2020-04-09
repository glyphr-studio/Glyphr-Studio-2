import ControlPoint from './control_point.js';

_TEST.testList.push(
    {
      category: 'ControlPoint',
      name: 'Constructor - x',
      assertion: function() {
        return _TEST.is((new ControlPoint()).x).equalTo(100);
      },
    },
    {
      category: 'ControlPoint',
      name: 'Change Position',
      assertion: function() {
        const cp = new ControlPoint();
        cp.x = 500;
        cp.y = 500;
        return _TEST.expression(cp.x === 500 && cp.y === 500);
      },
    },
    {
      category: 'ControlPoint',
      name: 'xLock',
      assertion: function() {
        const cp = new ControlPoint();
        cp.xLock = true;
        return _TEST.expression(cp.xLock);
      },
    },
    {
      category: 'ControlPoint',
      name: 'save',
      assertion: function() {
        const cp = new ControlPoint();
        return _TEST.is(cp.save).equalTo({point: {x: 0, y: 0}, use: true});
      },
    }
);
