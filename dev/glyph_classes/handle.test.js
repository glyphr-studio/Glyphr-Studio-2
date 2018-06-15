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
    }
);
