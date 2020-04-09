import Coord from './coord.js';
import {pointsAreEqual} from '../common/functions.js';

_TEST.testList.push(
  {
    category: 'Coord',
    name: 'Constructor - x',
    assertion: function() {
      return _TEST.is((new Coord({x: 101})).x).equalTo(101);
    },
  },
  {
    category: 'Coord',
    name: 'Constructor - y',
    assertion: function() {
      return _TEST.is((new Coord({x: 101})).y).equalTo(0);
    },
  },
  {
    category: 'Coord',
    name: 'pointsAreEqual',
    assertion: function() {
      let c1 = new Coord({x: 100, y: 100});
      let c2 = new Coord({x: 99.1, y: 100.9});
      return _TEST.expression(pointsAreEqual(c1, c2));
    },
  },
  {
    category: 'Coord',
    name: 'X Setter',
    assertion: function() {
      let co = new Coord({x: 101, y: 123});
      co.x = 789;
      return _TEST.is(co.x).equalTo(789);
    },
  },
  {
    category: 'Coord',
    name: 'Y Setter',
    assertion: function() {
      let co = new Coord({x: 101, y: 123});
      co.y = 789;
      return _TEST.is(co.y).equalTo(789);
    },
  }
);
