import XYPoint from './xypoint.js';

_TEST.testList.push(
    {
        category: 'XYPoint',
        name: 'Constructor - x',
        assertion: function() {
            return _TEST.is(new XYPoint(101, 123).x).equalTo(101);
        },
    },
    {
        category: 'XYPoint',
        name: 'Constructor - y',
        assertion: function() {
            return _TEST.is(new XYPoint(101, 123).y).equalTo(123);
        },
    },
    {
        category: 'XYPoint',
        name: 'X Setter',
        assertion: function() {
            let xyp = new XYPoint(101, 123);
            xyp.x = 789;
            return _TEST.is(xyp.x).equalTo(789);
        },
    },
    {
        category: 'XYPoint',
        name: 'Y Setter',
        assertion: function() {
            let xyp = new XYPoint(101, 123);
            xyp.y = 789;
            return _TEST.is(xyp.y).equalTo(789);
        },
    }
);
