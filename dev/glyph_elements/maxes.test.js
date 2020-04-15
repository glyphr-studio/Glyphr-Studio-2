import Maxes from './maxes.js';
import {maxesOverlap, getOverallMaxes} from './maxes.js';

_TEST.testList.push(
    {
      category: 'Maxes',
      name: 'constructor',
      assertion: function() {
        const m1 = new Maxes();
        return _TEST.is(m1.xMax).equalTo(Number.MIN_SAFE_INTEGER);
      },
    },
    {
      category: 'Maxes',
      name: 'maxBounds',
      assertion: function() {
        const m1 = new Maxes();
        return _TEST.is(m1.maxBounds.xMax).equalTo(Number.MAX_SAFE_INTEGER);
      },
    },
    {
      category: 'Maxes',
      name: 'save',
      assertion: function() {
        const m1 = new Maxes({xMax: 100, xMin: 0, yMax: 100, yMin: 0});
        return _TEST.is(m1.save()).equalTo({xMax: 100, xMin: 0, yMax: 100, yMin: 0});
      },
    },
    {
      category: 'Maxes',
      name: 'maxesOverlap',
      assertion: function() {
        const m1 = new Maxes({xMax: 100, xMin: 0, yMax: 100, yMin: 0});
        const m2 = new Maxes({xMax: 150, xMin: 50, yMax: 150, yMin: 50});
        return _TEST.expression(maxesOverlap(m1, m2));
      },
    },
    {
      category: 'Maxes',
      name: 'getOverallMaxes',
      assertion: function() {
        const m1 = new Maxes({xMax: 100, xMin: 0, yMax: 100, yMin: 0});
        const m2 = new Maxes({xMax: 150, xMin: 50, yMax: 150, yMin: 50});
        return _TEST.is(getOverallMaxes([m1, m2]).save()).equalTo({xMax: 150, xMin: 0, yMax: 150, yMin: 0});
      },
    }
);
