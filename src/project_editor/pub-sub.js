import { glyphChanged } from './cross_item_actions.js';

// --------------------------------------------------------------
// PubSub
// --------------------------------------------------------------
/*
	TOPICS
		* - 'editCanvasView' - change to the edit canvas, view or extra non-item graphics.
		* - 'whichToolIsSelected' - change to which edit tool is selected.
		* - 'whichGlyphIsSelected' - change to which glyph is being edited.
		* - 'whichLigatureIsSelected' - change to which Ligature is being edited.
		* - 'whichComponentIsSelected' - change to which Component is being edited.
		* - 'whichKernGroupIsSelected' - change to which Kern Group is being edited.
		* - 'whichPathIsSelected' - change to which path is being edited.
		* - 'whichPathPointIsSelected' - change to which point is being edited.
		* - 'currentItem' - edits to the current glyph, ligature, or component.
		* - 		'currentGlyph' - edits to the current Glyph
		* - 		'currentVirtualGlyph' - edits to the current multi-selected shapes
		* - 		'currentLigature' - edits to the current Ligature
		* - 		'currentComponent' - edits to the current Component
		* - 		'currentKernGroup' - edits to the current Kern Group
		* - 		'currentPath' - edits to the current path.
		* - 		'currentVirtualShape' - edits to the current multi-selected path points.
		* - 		'currentComponentInstance' - edits to the current instance
		* - 		'currentPathPoint' - edits to the current point.
		* - 		'currentControlPoint.p / .h1 / .h2' - edits to the current p/h1/h2.
*/
const allTopics = [
	'editCanvasView',
	'whichToolIsSelected',
	'whichGlyphIsSelected',
	'whichLigatureIsSelected',
	'whichComponentIsSelected',
	'whichKernGroupIsSelected',
	'whichPathIsSelected',
	'whichPathPointIsSelected',
	'currentItem',
	'currentGlyph',
	'currentVirtualGlyph',
	'currentLigature',
	'currentComponent',
	'currentKernGroup',
	'currentPath',
	'currentVirtualShape',
	'currentComponentInstance',
	'currentPathPoint',
	'currentControlPoint',
];

/**
 * Sends a new piece of data concerning a topic area that
 * triggers changes for subscribers
 * @param {String} topic keyword to trigger changes
 * @param {Object} data - whatever the new state is
 */
export function publish(topic, data) {
	log(`ProjectEditor.publish`, 'start');
	log(`topic: ${topic}`);
	log(`\n⮟data⮟`);
	log(data);
	log(`\n⮟this.subscribers[topic]⮟`);
	log(this.subscribers[topic]);

	let subscribers = this.subscribers;
	if (this.subscribers[topic]) {
		// Iterate through all the callbacks
		callCallbacksByTopic(topic, data);

		// Handle some things centrally
		if (topic === 'whichToolIsSelected') {
			// log(`PubSub publish whichToolIsSelected: ${data}`);
		}

		if (topic === 'editCanvasView') {
			//anything?
		}

		if (
			topic === 'whichGlyphIsSelected' ||
			topic === 'whichLigatureIsSelected' ||
			topic === 'whichComponentIsSelected'
		) {
			this.multiSelect.shapes.clear();
			this.multiSelect.points.clear();
		}

		if (topic === 'whichPathIsSelected') {
			// this.multiSelect.points.clear();
		}

		if (topic === 'whichPathPointIsSelected') {
			//anything?
		}

		/*
		PubSub allows for topics to be either a generic 'selectedItem'
		topic, or a specific 'selectedGlyph' / 'selectedComponent' / 'selectedLigature'
		topic. In both cases, when the specific case is called, so must the
		generic case - and vise versa.
		*/

		let specificItem = false;
		if (this.selectedItem?.objType) specificItem = `current${this.selectedItem.objType}`;

		if (topic === 'currentVirtualGlyph') {
			// If the multi-select virtual glyph changes, so must the Item
			callCallbacksByTopic('currentItem', this.selectedItem);
			callCallbacksByTopic(specificItem, this.selectedItem);
			// callCallbacksByTopic('currentVirtualGlyph', this.multiSelect.shapes.virtualGlyph);
		}

		if (
			topic === 'currentItem' ||
			topic === 'currentGlyph' ||
			topic === 'currentLigature' ||
			topic === 'currentComponent'
		) {
			callCallbacksByTopic('currentItem', data);
			callCallbacksByTopic(specificItem, data);
			let singlePath = this.multiSelect.shapes.singleton;
			let singlePoint = this.multiSelect.points.singleton;
			if (singlePath) {
				// It's possible to make updates to an Item while a single path is selected
				if (singlePath.objType === 'Path') callCallbacksByTopic('currentPath', singlePath);
				else callCallbacksByTopic('currentComponentInstance', singlePath);
			}
			if (singlePoint) {
				// It's possible to make updates to an Item while a single path point is selected
				callCallbacksByTopic('currentPathPoint', singlePoint);
			}
			glyphChanged(data);
		}

		if (topic === 'currentPath') {
			// if a path changes, then so must the Item also
			callCallbacksByTopic('currentItem', data.parent);
			callCallbacksByTopic(specificItem, data.parent);
		}

		if (topic === 'currentComponentInstance') {
			// if a path changes, then so must the Item also
			callCallbacksByTopic('currentItem', data.parent);
			callCallbacksByTopic(specificItem, data.parent);
		}

		if (topic === 'currentPathPoint') {
			// if a PathPoint changes, then so must the Path and Item also
			callCallbacksByTopic('currentPath', data.parent);
			callCallbacksByTopic('currentItem', data.parent.parent);
			callCallbacksByTopic(specificItem, data.parent.parent);
		}

		if (topic.includes('currentControlPoint')) {
			// if a PathPoint changes, then so must the Path and Item also
			callCallbacksByTopic('currentPathPoint', data.parent);
			callCallbacksByTopic('currentPath', data.parent.parent);
			callCallbacksByTopic('currentItem', data.parent.parent.parent);
			callCallbacksByTopic(specificItem, data.parent.parent.parent);

			if (topic === 'currentControlPoint.p') {
				callCallbacksByTopic('currentControlPoint.p', data.parent.p);
				callCallbacksByTopic('currentControlPoint.h1', data.parent.h1);
				callCallbacksByTopic('currentControlPoint.h2', data.parent.h2);
			}
			if (topic === 'currentControlPoint.h1')
				callCallbacksByTopic('currentControlPoint.h1', data.parent.h1);
			if (topic === 'currentControlPoint.h2')
				callCallbacksByTopic('currentControlPoint.h2', data.parent.h2);
		}
	} else {
		// console.warn(`Nobody subscribed to topic ${topic}`);
	}

	function callCallbacksByTopic(callTopic, data) {
		log(`== calling callbacks ${topic} to ${callTopic}`);
		if (subscribers[callTopic]) {
			Object.keys(subscribers[callTopic]).forEach((subscriberID) => {
				subscribers[callTopic][subscriberID](data);
			});
		}
	}

	log(`ProjectEditor.publish`, 'end');
}

/**
 * Sets up an intent to listen for changes based on a keyword, and
 * provides a callback function in case a change is published
 * @param {string or array} topic what keyword to listen for
 * @param {String} subscriberID - the name of the thing listening
 * @param {function} callback - what to do when a change is triggered
 * @returns nothing
 */
export function subscribe({ topic = false, subscriberID = '', callback = false }) {
	// log(`ProjectEditor.subscribe`, 'start');
	// log(`topic: ${topic}`);
	// log(`subscriberID: ${subscriberID}`);

	if (!topic) {
		console.warn(`Subscriber was not provided a topic`);
		return;
	}

	if (!callback) {
		console.warn(`Subscriber was not provided a callback`);
		return;
	}

	if (!subscriberID) {
		console.warn(`Subscriber was not provided a subscriberID`);
		return;
	}

	// Support string for single topic, array for multi topic
	let topicList = typeof topic === 'string' ? [topic] : topic;

	// Support * string for all topics
	if (topicList[0] === '*') topicList = allTopics;

	topicList.forEach((thisTopic) => {
		if (!this.subscribers[thisTopic]) this.subscribers[thisTopic] = {};
		this.subscribers[thisTopic][subscriberID] = callback;
	});

	// log(`ProjectEditor.subscribe`, 'end');
}

export function unsubscribe({ topicToRemove = false, idToRemove = false }) {
	// log(`ProjectEditor.unsubscribe`, 'start');
	// log(`topicToRemove: ${topicToRemove}`);
	// log(`idToRemove: ${idToRemove}`);

	if (topicToRemove && this.subscribers[topicToRemove]) {
		// log(`removing topic: ${topicToRemove}`);
		delete this.subscribers[topicToRemove];
	}

	if (idToRemove) {
		Object.keys(this.subscribers).forEach((topic) => {
			Object.keys(this.subscribers[topic]).forEach((subscriberID) => {
				if (subscriberID.indexOf(idToRemove) > -1) {
					// log(`removing subscriber: ${subscriberID} (matched to ${idToRemove})`);
					delete this.subscribers[topic][subscriberID];
				}
			});
		});
	}

	// log(`ProjectEditor.unsubscribe`, 'end');
}
