import './settings.js';
import {areEqual, localStorageGet, localStorageSet} from './functions.js';
import {assemble} from './main.js';

/**
 * TEST
 * controls the test functionality for GS2 Test Suite
 */

window._TEST = {
    testList: [],
    globals: {},
    autoRun: false,
    categories: {},
};

window.onload = loadTests;

let succeeded = 0;
let failed = 0;
let didNotRun = 0;
let total = 0;


/**
 * Kick off the tests
 */
function loadTests() {
    assemble(true, loadTestList);
}

/**
 * Callback after tests load
 */
function loadTestList() {
    _UI.debug = true;
    debug(`t> Loading tests...`);

    let savedState = localStorageGet('TEST');

    /**
     * Loads category state from local storage (if it exists)
     * @param {string} cat - category
     * @returns {boolean}
     */
    function getInitialCheckedState(cat) {
        if (savedState && savedState[cat]) {
            return savedState[cat].checked;
        }

        return true;
    }

    let test;
    let cat;
    let t=0;
    while (_TEST.testList[t]) {
        test = _TEST.testList[t];
        cat = test.category;

        if (_TEST.categories.hasOwnProperty(cat)) {
            _TEST.categories[cat].count++;
        } else {
            _TEST.categories[cat] = {count: 1, checked: getInitialCheckedState(cat)};
        }

        total++;
        t++;
    };

    let results = document.querySelector('#results');
    let header = document.querySelector('#header');
    header.innerHTML = '';
    for (let key in _TEST.categories) {
        if (_TEST.categories.hasOwnProperty(key)) {
            cat = _TEST.categories[key];

            results.innerHTML = `<div class="resultSection" style="display:${cat.checked? 'block' : 'none'};" id="${getResultSectionID(key)}"><h2>${key}</h2></div>` + results.innerHTML;

            header.innerHTML += `<span class="category">
                ${_TEST.autoRun? '' : `<input type="checkbox" ${cat.checked? 'checked' : ''} onclick="_TEST.toggleTestCategory('${key}');" id="checkbox${getResultSectionID(key)}"/>`}
                <label for="checkbox${getResultSectionID(key)}">${key} : ${cat.count}</label>
            </span>`;
        }
    }

    if (_TEST.autoRun) window.setTimeout(_TEST.runTests, 10);
    else {
        header.innerHTML += `<button class="secondary" onclick="_TEST.toggleAllTestCategories();"><i>Toggle all tests</i></button>`;
        header.innerHTML += `<br><br><button onclick="_TEST.runTests();">Run Tests</button> &emsp; `;
    }

    debug(`t> Done loading tests\n`);
}

/**
 * Event Handler for cateogry checkboxes
 * @param {string} key - category name
 * @returns {boolean} - new state
 */
_TEST.toggleTestCategory = function(key) {
    let cat = _TEST.categories[key];
    if (cat) {
        cat.checked = !cat.checked;

        if (cat.checked) document.getElementById(`${getResultSectionID(key)}`).style.display = 'block';
        else document.getElementById(`${getResultSectionID(key)}`).style.display = 'none';

        localStorageSet('TEST', _TEST.categories);

        return cat.checked;
    }
};

/**
 * Toggles all the test checkboxes
 */
_TEST.toggleAllTestCategories = function() {
    for (let key in _TEST.categories) {
        if (_TEST.categories.hasOwnProperty(key)) {
            document.getElementById(`checkbox${getResultSectionID(key)}`).checked = _TEST.toggleTestCategory(key);
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
_TEST.runTests = function() {
    debug(`t> Running tests...`);

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
            currResultSection.appendChild(
                makeTestResult(test.result, test.description, _TEST.testList[currTest].name, (finish-start))
            );
            if (test.result) succeeded++;
            else {
                failed++;
                console.warn(`t> ${category} - ${_TEST.testList[currTest].name}`);
                console.log(test.description);
            }
        } catch (error) {
            console.warn(`t> ${category} - ${_TEST.testList[currTest].name}`);
            console.log(error);
            if (currResultSection) {
                currResultSection.appendChild(
                    makeTestResult('didNotRun', error.message, _TEST.testList[currTest].name)
                );
            }
            didNotRun++;
        }

        currTest++;

        window.setTimeout(runNextTest, 10);
    }

    /**
     * Animates the fancy progress bar
     */
    function updateProgressBar() {
        let width = document.getElementById('progressBarWrapper').offsetWidth;
        let percent = currTest / _TEST.testList.length;

        let bar = document.getElementById('progressBar');
        bar.style.width = `${Math.round(width*percent)}px`;
        bar.style.opacity = 0.2 + (0.8 * percent);
    };

    window.setTimeout(runNextTest, 10);

    // debug(` _TEST.runTests - END\n\n`);
};


let resultIcons = {
    pass: '✔',
    fail: '✖',
    didNotRun: '❖',
};

/**
 * Converts an HTML Entity to a string
 * @param {string} code
 * @returns {string}
 */
function s(code) {
    let txt = document.createElement('textarea');
    txt.innerHTML = code;
    return txt.value;
}

/**
 * Creates HTML test result
 * @param {string} result
 * @param {string} message
 * @param {string} title
 * @param {number} durration
 * @returns {string}
 */
function makeTestResult(result, message, title, durration = 0) {
    let resultClass;

    if (result === true) resultClass = 'pass';
    else if (result === false) resultClass = 'fail';
    else resultClass = 'didNotRun';

    let durr = `${s('&thinsp;')}`;
    let durrSpan = document.createElement('span');

    if (durration < 51) {
        durr += `|${s('&thinsp;')}${durration}`;
    } else {
        let bar = Math.round(durration / 100);
        for (let i=0; i<bar; i++) durr += '▓';
        durr += `${s('&thinsp;')}${durration}`;
        durrSpan.setAttribute('style', 'font-weight:bold;');
    }

    durrSpan.appendChild(document.createTextNode(durr));

    let iconSpan = document.createElement('span');
    iconSpan.setAttribute('class', 'icon');
    iconSpan.appendChild(document.createTextNode(resultIcons[resultClass]));

    let tr = document.createElement('span');
    tr.setAttribute('class', `testResult ${resultClass}`);
    tr.setAttribute('title', `${message}`);
    tr.appendChild(iconSpan);
    tr.appendChild(document.createTextNode(`${title}`));
    tr.appendChild(durrSpan);

    return tr;
}

/**
 * Do at the end
 */
function finishTests() {
    document.querySelector('#header').innerHTML += `
    <br><br>
    <div class="testSummary fail">
            <span class="count">
                ${failed}
                <span class="icon">${resultIcons['fail']}</span>
            </span>
            <span class="title">Failed</span>
        </div>
        <div class="testSummary didNotRun">
            <span class="count">
                ${didNotRun}
                <span class="icon">${resultIcons['didNotRun']}</span>
            </span>
            <span class="title">Did not run</span>
        </div>
        <div class="testSummary pass">
            <span class="count">
                ${succeeded}
                <span class="icon">${resultIcons['pass']}</span>
            </span>
            <span class="title">Passed</span>
        </div>
    `;

    debug(`t> Done running tests\n`);
}


// ------------------------------------------------------------
// Chain functions that run individual tests
// ------------------------------------------------------------

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
