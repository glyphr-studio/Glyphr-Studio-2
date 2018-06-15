_TEST.testList.push(
    {
        category: 'PathPoint',
        name: 'Constructor - p.x',
        assertion: function() {
            let pp = new PathPoint();
            return is(pp.p.x).equalTo(100);
        },
    },
    {
        category: 'PathPoint',
        name: 'Constructor - type',
        assertion: function() {
            let pp = new PathPoint();
            return is(pp.type).equalTo('corner');
        },
    },
    {
        category: 'PathPoint',
        name: 'p.h1.length',
        assertion: function() {
            let pp = new PathPoint();
            return is(pp.h1.length).equalTo(141.4213562373095);
        },
    },
    {
        category: 'PathPoint',
        name: 'p.h1.angle',
        assertion: function() {
            let pp = new PathPoint();
            return is(pp.h1.angle).equalTo(-2.356194490192345);
        },
    },
    {
        category: 'Handle',
        name: 'p.h1=false, h1.x===p.x',
        assertion: function() {
            let p = new PathPoint();
            p.h1.use = false;
            return is(p.h1.x).equalTo(p.p.x);
        },
    },
    {
        category: 'PathPoint',
        name: 'save',
        assertion: function() {
            let pp = new PathPoint();
            return is(pp.save()).equalTo(JSON.parse('{"p":{"x":100,"y":100},"h1":{"point":{"x":0,"y":0},"use":true},"h2":{"point":{"x":200,"y":200},"use":true},"type":"corner"}'));
        },
    },
    {
        category: 'PathPoint',
        name: 'isOverControlPoint',
        assertion: function() {
            let pp = new PathPoint();
            return is((pp.isOverControlPoint(200, 200)).type).equalTo('h2');
        },
    },
    {
        category: 'PathPoint',
        name: 'isFlat',
        assertion: function() {
            let pp = new PathPoint();
            return expression(pp.isFlat());
        },
    },
    {
        category: 'PathPoint',
        name: 'resolvePointType',
        assertion: function() {
            let pp = new PathPoint();
            return is(pp.resolvePointType()).equalTo('symmetric');
        },
    },
    {
        category: 'PathPoint',
        name: 'makePointedTo',
        assertion: function() {
            let pp = new PathPoint();
            return is(pp.makePointedTo(300, 0).h2.x).equalTo(166.66666666666666);
        },
    },
    {
        category: 'PathPoint',
        name: 'makeSymmetric',
        assertion: function() {
            let pp = new PathPoint();
            pp.h2.x = 555;
            return is(pp.makeSymmetric('h1').h2.x).equalTo(200);
        },
    },
    {
        category: 'PathPoint',
        name: 'makeFlat',
        assertion: function() {
            let pp = new PathPoint();
            pp.h2.x = 555;
            return is(pp.makeFlat('h1').h2.x).equalTo(429.412355566697);
        },
    },
    {
        category: 'PathPoint',
        name: 'rotate',
        assertion: function() {
            let pp = new PathPoint();
            return is(pp.rotate(90, {x:0, y:0}).p.x).equalTo(-134.2070279729728);
        },
    },
    {
        category: 'PathPoint',
        name: 'resetHandles',
        assertion: function() {
            let pp = new PathPoint();
            pp.h1.x = 555;
            return is(pp.resetHandles().p.x).equalTo(100);
        },
    },
    {
        category: 'PathPoint',
        name: 'roundAll',
        assertion: function() {
            let pp = new PathPoint();
            pp.h1.x = 39.9999;
            return is(pp.roundAll(3).h1.x).equalTo(40);
        },
    }
);

/*
pointNumber
makePathPointFromSegments
*/
