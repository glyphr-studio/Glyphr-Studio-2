import './settings.js';
import {areEqual} from './functions.js';
import {assemble} from './main.js';

window._TEST = {
    testList: [],
    globals: {},
    categories: {},
    succeeded: 0,
    failed: 0,
    didNotRun: 0,
    total: 0,
    autoRun: false,
};

window.onload = loadTests;

/**
 * TEST
 * controlls the test functionality for GS2 Test Suite
 */


let resultIcons = {
    pass: '2714',
    fail: '2716',
    didNotRun: '2756',
};

/**
 * Kick off the tests
 */
function loadTests() {
    assemble(true, afterLoadTests);
    // afterLoadTests();
}

/**
 * Callback after tests load
 */
function afterLoadTests() {
    _UI.debug = true;
    debug(`Starting tests...\n`);
    // debug(`\n afterLoadTests - START`);

    let header = document.querySelector('#header');
    let results = document.querySelector('#results');


    let test;
    let t=0;
    while (_TEST.testList[t]) {
        test = _TEST.testList[t];

        if (_TEST.categories.hasOwnProperty(test.category)) {
            _TEST.categories[test.category].count++;
        } else {
            _TEST.categories[test.category] = {count: 1, checked: true};
        }

        _TEST.total++;
        t++;
    };


    header.innerHTML = '';
    let cat;
    for (let key in _TEST.categories) {
        if (_TEST.categories.hasOwnProperty(key)) {
            cat = _TEST.categories[key];
            results.innerHTML = `<div class="resultSection" id="${getResultSectionID(key)}"><h2>${key}</h2></div>` + results.innerHTML;
            header.innerHTML += `<span class="category">
                <input type="checkbox" checked="${cat.checked}" onclick="toggleTestCategory('${key}');" id="checkbox${getResultSectionID(key)}"/>
                ${key} : ${cat.count}
            </span>`;
        }
    }

    if (_TEST.autoRun) window.setTimeout(runTests, 10);
    else {
        header.innerHTML += `<br><br><button onclick="runTests();">Run Tests</button> &emsp; `;
        header.innerHTML += `<button onclick="toggleAllTestCategories();">Toggle all tests</button>`;
    }

    // debug(` afterLoadTests - END\n\n`);
}

/**
 * Event Handler for cateogry checkboxes
 * @param {string} key - category name
 * @returns {boolean} - new state
 */
window.toggleTestCategory = function(key) {
    let cat = _TEST.categories[key];
    if (cat) {
        cat.checked = !cat.checked;

        if (cat.checked) document.getElementById(`${getResultSectionID(key)}`).style.display = 'block';
        else document.getElementById(`${getResultSectionID(key)}`).style.display = 'none';

        return cat.checked;
    }
};

/**
 * Toggles all the test checkboxes
 */
window.toggleAllTestCategories = function() {
    for (let key in _TEST.categories) {
        if (_TEST.categories.hasOwnProperty(key)) {
            document.getElementById(`checkbox${getResultSectionID(key)}`).checked = toggleTestCategory(key);
        }
    }
};


/**
 * Generate an unique ID
 * @param {string} category
 * @returns {string}
 */
function getResultSectionID(category) {
    let rsid = 'resultSection' + category.split(' ').join('_');
    return rsid;
}


/**
 * Runs the tests
 */
window.runTests = function() {
    // debug(`\n runTests - START`);

    let currTest = 0;

    /** Runs the next test in the list */
    function runNextTest() {
        window.setTimeout(updateProgressBar, 10);

        if (currTest === _TEST.testList.length) {
            finishTests();
            return;
        }

        let start;
        let finish;
        let test;
        let category = _TEST.testList[currTest].category;

        if (!_TEST.categories[category].checked) {
            currTest++;
            window.setTimeout(runNextTest, 10);
            return;
        }

        let currResultSection = document.querySelector(`#${getResultSectionID(category)}`);

        try {
            start = new Date().getTime();
            test = _TEST.testList[currTest].assertion();
            finish = new Date().getTime();
            currResultSection.innerHTML += addTestResult(
                test.result, test.description, _TEST.testList[currTest].name, (finish-start)
            );
            if (test.result) _TEST.succeeded++;
            else {
                _TEST.failed++;
                console.warn(`t> ${category} - ${_TEST.testList[currTest].name}`);
                console.log(test.description);
            }
        } catch (error) {
            console.warn(`t> ${category} - ${_TEST.testList[currTest].name}`);
            console.log(error);
            if (currResultSection) {
                currResultSection.innerHTML += addTestResult('didNotRun', error.message, _TEST.testList[currTest].name);
            }
            _TEST.didNotRun++;
        }

        currTest++;

        window.setTimeout(runNextTest, 10);
    }

    /**
     * Animates the fancy progress bar
     * @param {number} curr - current progress
     * @param {number} total - total tests
     */
    function updateProgressBar() {
        let width = document.getElementById('progressBarWrapper').offsetWidth;
        let percent = currTest / _TEST.testList.length;

        let bar = document.getElementById('progressBar');
        bar.style.width = (width*percent);
        bar.style.opacity = percent;
    };

    window.setTimeout(runNextTest, 10);

    // debug(` runTests - END\n\n`);
};

/**
 * First part of the comparison
 * @param {*} leftHand
 * @returns {object}
 */
_TEST.is = function(leftHand) {
    let test = {};
    test.description = JSON.stringify(leftHand);

    return {equalTo: function(rightHand) {
        test.result = areEqual(leftHand, rightHand);

        test.description += test.result? '\nEQUALS\n' : '\nDOES NOT EQUAL\n';
        test.description += JSON.stringify(rightHand);

        return test;
    }};
};

/**
 * Evaluates an expression
 * @param {*} ex
 * @returns {boolean}
 */
_TEST.expression = function(ex) {
    return {
        description: `Expression evaluated to: ${!!(ex)}`,
        result: !!ex,
    };
};

/**
 * Creates HTML test result
 * @param {string} result
 * @param {string} message
 * @param {string} title
 * @param {number} durration
 * @returns {string}
 */
function addTestResult(result, message, title, durration = 0) {
    let resultClass;

    if (result === true) resultClass = 'pass';
    else if (result === false) resultClass = 'fail';
    else resultClass = 'didNotRun';

    let durr = `|&thinsp;${durration}`;
    if (durration > 51) {
        let bar = Math.round(durration / 100);
        durr = '<b>';
        for (let i=0; i<bar; i++) durr += '▓';
        durr += `&thinsp;${durration}</b>`;
    }

    return `<span class="testResult ${resultClass}" title='${message}'>
        <span class="icon">&#x${resultIcons[resultClass]};</span>
        ${title}&nbsp;${durr}
    </span>`;
}

/**
 * Do at the end
 */
function finishTests() {
    document.querySelector('#header').innerHTML += `
    <br><br>
    <div class="testSummary fail">
            <span class="count">
                ${_TEST.failed}
                <span class="icon">&#x${resultIcons['fail']};</span>
            </span>
            <span class="title">Failed</span>
        </div>
        <div class="testSummary didNotRun">
            <span class="count">
                ${_TEST.didNotRun}
                <span class="icon">&#x${resultIcons['didNotRun']};</span>
            </span>
            <span class="title">Did not run</span>
        </div>
        <div class="testSummary pass">
            <span class="count">
                ${_TEST.succeeded}
                <span class="icon">&#x${resultIcons['pass']};</span>
            </span>
            <span class="title">Passed</span>
        </div>
    `;

    debug(`\n...done!`);
}
