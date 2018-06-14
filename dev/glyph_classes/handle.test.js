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
        name: 'niceAngle',
        assertion: function() {
            let han = new Handle();
            console.log(han);
            han.x = 100;
            han.y = 100;
            return is(han.niceAngle).equalTo(45);
        },
    }
);
