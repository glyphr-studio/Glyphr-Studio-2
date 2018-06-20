import _TEST from '../app/test.js';
_TEST.testList.push(
    {
        category: 'Maxes',
        name: 'constructor',
        assertion: function() {
            let m1 = new Maxes();
            return is(m1.xMax).equalTo(-Infinity);
        },
    },
    {
        category: 'Maxes',
        name: 'maxBounds',
        assertion: function() {
            let m1 = new Maxes();
            return is(m1.maxBounds.xMax).equalTo(Infinity);
        },
    },
    {
        category: 'Maxes',
        name: 'save',
        assertion: function() {
            let m1 = new Maxes({xMax: 100, xMin: 0, yMax: 100, yMin: 0});
            return is(m1.save()).equalTo({xMax: 100, xMin: 0, yMax: 100, yMin: 0});
        },
    },
    {
        category: 'Maxes',
        name: 'maxesOverlap',
        assertion: function() {
            let m1 = new Maxes({xMax: 100, xMin: 0, yMax: 100, yMin: 0});
            let m2 = new Maxes({xMax: 150, xMin: 50, yMax: 150, yMin: 50});
            return expression(maxesOverlap(m1, m2));
        },
    },
    {
        category: 'Maxes',
        name: 'getOverallMaxes',
        assertion: function() {
            let m1 = new Maxes({xMax: 100, xMin: 0, yMax: 100, yMin: 0});
            let m2 = new Maxes({xMax: 150, xMin: 50, yMax: 150, yMin: 50});
            return is(getOverallMaxes([m1, m2])).equalTo({xMax: 150, xMin: 0, yMax: 150, yMin: 0});
        },
    }
);
