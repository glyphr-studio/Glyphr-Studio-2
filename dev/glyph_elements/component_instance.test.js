import ComponentInstance from './component_instance.js';
// jest.moc('./component_instance.js');

/**
 * Create a sample Component Instance
 * @returns {ComponentInstance}
 */
function sampleComponentInstance() {
  return new ComponentInstance();
}


it('ComponentInstance: get/set link', () => {
  const ci = sampleComponentInstance();
  ci.link = '0x1234';
  expect(ci.link).toBe('0x1234');
});

it('ComponentInstance: get/set name', () => {
  const ci = sampleComponentInstance();
  ci.name = 'New Name';
  expect(ci.name).toBe('New Name');
});

it('ComponentInstance: get/set translateX', () => {
  const ci = sampleComponentInstance();
  ci.translateX = 123;
  expect(ci.translateX).toBe(123);
});

it('ComponentInstance: get/set translateY', () => {
  const ci = sampleComponentInstance();
  ci.translateY = 456;
  expect(ci.translateY).toBe(456);
});

it('ComponentInstance: get/set scaleW', () => {
  const ci = sampleComponentInstance();
  ci.scaleW = 789;
  expect(ci.scaleW).toBe(789);
});

it('ComponentInstance: get/set scaleH', () => {
  const ci = sampleComponentInstance();
  ci.scaleH = 246;
  expect(ci.scaleH).toBe(246);
});

it('ComponentInstance: get/set isFlippedNS', () => {
  const ci = sampleComponentInstance();
  ci.isFlippedNS = 123;
  expect(ci.isFlippedNS).toBe(true);
});

it('ComponentInstance: get/set isFlippedEW', () => {
  const ci = sampleComponentInstance();
  ci.isFlippedEW = 123;
  expect(ci.isFlippedEW).toBe(true);
});

it('ComponentInstance: get/set reverseWinding', () => {
  const ci = sampleComponentInstance();
  ci.reverseWinding = true;
  expect(ci.reverseWinding).toBe(true);
});

it('ComponentInstance: get/set rotation', () => {
  const ci = sampleComponentInstance();
  ci.rotation = 90;
  expect(ci.rotation).toBe(90);
});

it('ComponentInstance: get/set rotateFirst', () => {
  const ci = sampleComponentInstance();
  ci.rotateFirst = false;
  expect(ci.rotateFirst).toBe(false);
});

it('ComponentInstance: get/set xLock', () => {
  const ci = sampleComponentInstance();
  ci.xLock = true;
  expect(ci.xLock).toBe(true);
});

it('ComponentInstance: get/set yLock', () => {
  const ci = sampleComponentInstance();
  ci.yLock = true;
  expect(ci.yLock).toBe(true);
});

it('ComponentInstance: get/set wLock', () => {
  const ci = sampleComponentInstance();
  ci.wLock = true;
  expect(ci.wLock).toBe(true);
});

it('ComponentInstance: get/set hLock', () => {
  const ci = sampleComponentInstance();
  ci.hLock = true;
  expect(ci.hLock).toBe(true);
});

it('ComponentInstance: get/set ratioLock', () => {
  const ci = sampleComponentInstance();
  ci.ratioLock = true;
  expect(ci.ratioLock).toBe(true);
});

it('ComponentInstance: get/set visible', () => {
  const ci = sampleComponentInstance();
  ci.visible = false;
  expect(ci.visible).toBe(false);
});


/*
{
category: 'ComponentInstance',
name: 'get/set x',
() => {
let ci = sampleComponentInstance();
ci.x = false;
expect(ci.x).toBe(false);
},
},
{
category: 'ComponentInstance',
name: 'get/set y',
() => {
let ci = sampleComponentInstance();
ci.y = false;
expect(ci.y).toBe(false);
},
},
{
category: 'ComponentInstance',
name: 'get/set width',
() => {
let ci = sampleComponentInstance();
ci.width = false;
expect(ci.width).toBe(false);
},
},
{
category: 'ComponentInstance',
name: 'get/set height',
() => {
let ci = sampleComponentInstance();
ci.height = false;
expect(ci.height).toBe(false);
},
},
*/

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
