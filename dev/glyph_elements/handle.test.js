import Handle from './handle.js';

_TEST.testList.push(
    {
        category: 'Handle',
        name: 'Constructor - x',
        assertion: function() {
            return _TEST.is((new Handle()).x).equalTo(100);
        },
    },
    {
        category: 'Handle',
        name: 'Change Position',
        assertion: function() {
            let han = new Handle();
            han.x = 500;
            han.y = 500;
            return _TEST.expression(han.x === 500 && han.y === 500);
        },
    },
    {
        category: 'Handle',
        name: 'xLock',
        assertion: function() {
            let han = new Handle();
            han.xLock = true;
            return _TEST.expression(han.xLock);
        },
    },
    {
        category: 'Handle',
        name: 'save',
        assertion: function() {
            let han = new Handle();
            return _TEST.is(han.save).equalTo({point: {x: 0, y: 0}, use: true});
        },
    }
);
