_TEST.testList.push(
    {
        category: 'PathPoint',
        name: 'Constructor - p.x',
        assertion: function() {
            _TEST.globals.pp = new PathPoint();
            return is(_TEST.globals.pp.p.x).equalTo(100);
        },
    },
    {
        category: 'PathPoint',
        name: 'Constructor - type',
        assertion: function() {
            return is(_TEST.globals.pp.type).equalTo('corner');
        },
    },
    {
        category: 'PathPoint',
        name: 'p.h1.length',
        assertion: function() {
            return is(_TEST.globals.pp.h1.length).equalTo(141.4213562373095);
        },
    },
    {
        category: 'PathPoint',
        name: 'p.h1.angle',
        assertion: function() {
            return is(_TEST.globals.pp.h1.angle).equalTo(-2.356194490192345);
        },
    },
    {
        category: 'PathPoint',
        name: 'save',
        assertion: function() {
            return is(_TEST.globals.pp.save()).equalTo(JSON.parse('{"p":{"x":100,"y":100},"h1":{"point":{"x":0,"y":0},"use":true},"h2":{"point":{"x":200,"y":200},"use":true},"type":"corner"}'));
        },
    },
    {
        category: 'PathPoint',
        name: 'isOverControlPoint',
        assertion: function() {
            return is((_TEST.globals.pp.isOverControlPoint(200, 200)).type).equalTo('h2');
        },
    },
    {
        category: 'PathPoint',
        name: 'isFlat',
        assertion: function() {
            return expression(_TEST.globals.pp.isFlat());
        },
    },
    {
        category: 'PathPoint',
        name: 'resolvePointType',
        assertion: function() {
            return is(_TEST.globals.pp.resolvePointType()).equalTo('flat');
        },
    }
);

/*
isOverControlPoint
makeSymmetric
makeFlat
resolvePointType
makePointedTo
rotate
roundAll
*/
