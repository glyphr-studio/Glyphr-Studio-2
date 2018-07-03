import HKern from './hkern.js';

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

_TEST.testList.push(
    {
        category: 'HKern',
        name: 'value',
        assertion: function() {
            return _TEST.is(sampleHKern().value).equalTo(123);
        },
    },
    {
        category: 'HKern',
        name: 'name',
        assertion: function() {
            return _TEST.is(sampleHKern().name).equalTo('Aa | Vv');
        },
    }
);
