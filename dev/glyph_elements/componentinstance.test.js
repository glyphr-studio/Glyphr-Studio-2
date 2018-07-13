import ComponentInstance from './componentinstance.js';

/**
 * Create a sample Component Instance
 * @returns {ComponentInstance}
 */
function sampleComponentInstance() {
    return new ComponentInstance();
}

_TEST.testList.push(
    {
        category: 'ComponentInstance',
        name: 'get/set link',
        assertion: function() {
            let ci = sampleComponentInstance();
            ci.link = '0x1234';
            return _TEST.is(ci.link).equalTo('0x1234');
        },
    },
    {
        category: 'ComponentInstance',
        name: 'get/set name',
        assertion: function() {
            let ci = sampleComponentInstance();
            ci.name = 'New Name';
            return _TEST.is(ci.name).equalTo('New Name');
        },
    },
    {
        category: 'ComponentInstance',
        name: 'get/set translateX',
        assertion: function() {
            let ci = sampleComponentInstance();
            ci.translateX = 123;
            return _TEST.is(ci.translateX).equalTo(123);
        },
    },
    {
        category: 'ComponentInstance',
        name: 'get/set translateY',
        assertion: function() {
            let ci = sampleComponentInstance();
            ci.translateY = 456;
            return _TEST.is(ci.translateY).equalTo(456);
        },
    },
    {
        category: 'ComponentInstance',
        name: 'get/set scaleW',
        assertion: function() {
            let ci = sampleComponentInstance();
            ci.scaleW = 789;
            return _TEST.is(ci.scaleW).equalTo(789);
        },
    },
    {
        category: 'ComponentInstance',
        name: 'get/set scaleH',
        assertion: function() {
            let ci = sampleComponentInstance();
            ci.scaleH = 246;
            return _TEST.is(ci.scaleH).equalTo(246);
        },
    },
    {
        category: 'ComponentInstance',
        name: 'get/set isFlippedNS',
        assertion: function() {
            let ci = sampleComponentInstance();
            ci.isFlippedNS = 123;
            return _TEST.is(ci.isFlippedNS).equalTo(true);
        },
    },
    {
        category: 'ComponentInstance',
        name: 'get/set isFlippedEW',
        assertion: function() {
            let ci = sampleComponentInstance();
            ci.isFlippedEW = 123;
            return _TEST.is(ci.isFlippedEW).equalTo(true);
        },
    },

    {
        category: 'ComponentInstance',
        name: 'get/set reverseWinding',
        assertion: function() {
            let ci = sampleComponentInstance();
            ci.reverseWinding = true;
            return _TEST.is(ci.reverseWinding).equalTo(true);
        },
    },
    {
        category: 'ComponentInstance',
        name: 'get/set rotation',
        assertion: function() {
            let ci = sampleComponentInstance();
            ci.rotation = 90;
            return _TEST.is(ci.rotation).equalTo(90);
        },
    },
    {
        category: 'ComponentInstance',
        name: 'get/set rotateFirst',
        assertion: function() {
            let ci = sampleComponentInstance();
            ci.rotateFirst = false;
            return _TEST.is(ci.rotateFirst).equalTo(false);
        },
    },
    {
        category: 'ComponentInstance',
        name: 'get/set xLock',
        assertion: function() {
            let ci = sampleComponentInstance();
            ci.xLock = true;
            return _TEST.is(ci.xLock).equalTo(true);
        },
    },
    {
        category: 'ComponentInstance',
        name: 'get/set yLock',
        assertion: function() {
            let ci = sampleComponentInstance();
            ci.yLock = true;
            return _TEST.is(ci.yLock).equalTo(true);
        },
    },
    {
        category: 'ComponentInstance',
        name: 'get/set wLock',
        assertion: function() {
            let ci = sampleComponentInstance();
            ci.wLock = true;
            return _TEST.is(ci.wLock).equalTo(true);
        },
    },
    {
        category: 'ComponentInstance',
        name: 'get/set hLock',
        assertion: function() {
            let ci = sampleComponentInstance();
            ci.hLock = true;
            return _TEST.is(ci.hLock).equalTo(true);
        },
    },
    {
        category: 'ComponentInstance',
        name: 'get/set ratioLock',
        assertion: function() {
            let ci = sampleComponentInstance();
            ci.ratioLock = true;
            return _TEST.is(ci.ratioLock).equalTo(true);
        },
    },
    {
        category: 'ComponentInstance',
        name: 'get/set visible',
        assertion: function() {
            let ci = sampleComponentInstance();
            ci.visible = false;
            return _TEST.is(ci.visible).equalTo(false);
        },
    }
    /*
    {
        category: 'ComponentInstance',
        name: 'get/set x',
        assertion: function() {
            let ci = sampleComponentInstance();
            ci.x = false;
            return _TEST.is(ci.x).equalTo(false);
        },
    },
    {
        category: 'ComponentInstance',
        name: 'get/set y',
        assertion: function() {
            let ci = sampleComponentInstance();
            ci.y = false;
            return _TEST.is(ci.y).equalTo(false);
        },
    },
    {
        category: 'ComponentInstance',
        name: 'get/set width',
        assertion: function() {
            let ci = sampleComponentInstance();
            ci.width = false;
            return _TEST.is(ci.width).equalTo(false);
        },
    },
    {
        category: 'ComponentInstance',
        name: 'get/set height',
        assertion: function() {
            let ci = sampleComponentInstance();
            ci.height = false;
            return _TEST.is(ci.height).equalTo(false);
        },
    },
    */

);

/*

link(link)
name(name)
translateX(translateX)
translateY(translateY)
scaleW(scaleW)
scaleH(scaleH)
isFlippedEW(isFlippedEW)
isFlippedNS(isFlippedNS)
reverseWinding(reverseWinding)
rotation(rotation)
rotateFirst(rotateFirst)
xLock(xLock)
yLock(yLock)
wLock(wLock)
hLock(hLock)
ratioLock(ratioLock)
visible(visible)
x(x)
y(y)
width(w)
height(h)
*/
