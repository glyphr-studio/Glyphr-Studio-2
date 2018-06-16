_TEST.testList.push(
    {
        category: 'Handle',
        name: 'Constructor - x',
        assertion: function() {
            return is((new Handle()).x).equalTo(100);
        },
    },
    {
        category: 'Handle',
        name: 'Change Possition',
        assertion: function() {
            let han = new Handle();
            han.x = 500;
            han.y = 500;
            return expression(han.x === 500 && han.y === 500);
        },
    },
    {
        category: 'Handle',
        name: 'xLock',
        assertion: function() {
            let han = new Handle();
            han.xLock = true;
            return expression(han.xLock);
        },
    },
    {
        category: 'Handle',
        name: 'save',
        assertion: function() {
            let han = new Handle();
            return is(han.save).equalTo({point: {x: 0, y: 0}, use: true});
        },
    },
);
