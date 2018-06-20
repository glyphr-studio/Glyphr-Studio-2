import _TEST from '../app/test.js';
_TEST.testList.push(
    {
        category: 'Coord',
        name: 'Constructor - x',
        assertion: function() {
            return is((new Coord({x: 101})).x).equalTo(101);
        },
    },
    {
        category: 'Coord',
        name: 'Constructor - y',
        assertion: function() {
            return is((new Coord({x: 101})).y).equalTo(0);
        },
    },
    {
        category: 'Coord',
        name: 'Constructor - xLock',
        assertion: function() {
            return is((new Coord({x: 101})).xLock).equalTo(false);
        },
    },
    {
        category: 'Coord',
        name: 'coordsAreEqual',
        assertion: function() {
            let c1 = new Coord({x: 100, y: 100});
            let c2 = new Coord({x: 99.1, y: 100.9});
            return expression(coordsAreEqual(c1, c2));
        },
    }
);
