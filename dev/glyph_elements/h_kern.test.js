import HKern from './h_kern.js';
// jest.moc('./h_kern.js');

/**
 * Sample kern for testing
 * @returns {HKern}
 */
function sampleHKern() {
  return new HKern({
    leftGroup: ['0x0041', '0x0061'],
    rightGroup: ['0x0056', '0x0076'],
    value: 123,
  });
}


it('HKern: value', () => {
  expect(sampleHKern().value).toBe(123);
});

it('HKern: name', () => {
  expect(sampleHKern().name).toBe('Aa | Vv');
});
