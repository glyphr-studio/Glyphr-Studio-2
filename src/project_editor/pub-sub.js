// --------------------------------------------------------------
// PubSub
// --------------------------------------------------------------

/**
 * Sends a new piece of data concerning a topic area that
 * triggers changes for subscribers
 * @param {string} topic keyword to trigger changes
 * - 'view' - change to the edit canvas view.
 * - 'whichToolIsSelected' - change to which edit tool is selected.
 * - 'whichGlyphIsSelected' - change to which glyph is being edited.
 * - 'whichLigatureIsSelected' - change to which ligature is being edited.
 * - 'whichPathIsSelected' - change to which path is being edited.
 * - 'whichPathPointIsSelected' - change to which point is being edited.
 * - 'currentItem' - edits to the current glyph, ligature, or component.
 * - 'currentPath' - edits to the current path.
 * - 'currentPathPoint' - edits to the current point.
 * - 'currentControlPoint.p / .h1 / .h2' - edits to the current p/h1/h2.
 * @param {object} data - whatever the new state is
 */
export function publish(topic, data) {
	// log(`ProjectEditor.publish`, 'start');
	// log(`topic: ${topic}`);
	// log(data);
	// log(this.subscribers[topic]);

	let subscribers = this.subscribers;
	if (this.subscribers[topic]) {
		// Iterate through all the callbacks
		callCallbacksByTopic(topic, data);

		// Handle some things centrally
		if (topic === 'whichToolIsSelected') {
			// log(`PubSub publish whichToolIsSelected: ${data}`);
		}

		if (topic === 'view') {
			//anything?
		}

		if (topic === 'whichGlyphIsSelected' || topic === 'whichLigatureIsSelected') {
			this.multiSelect.paths.clear();
			this.multiSelect.points.clear();
		}

		if (topic === 'whichPathIsSelected') {
			// this.multiSelect.points.clear();
		}

		if (topic === 'whichPathPointIsSelected') {
			//anything?
		}

		if (topic === 'currentItem') {
			let singlePath = this.multiSelect.paths.singleton;
			let singlePoint = this.multiSelect.points.singleton;
			if (singlePath) {
				// It's possible to make updates to a Glyph while a single path is selected
				callCallbacksByTopic('currentPath', singlePath);
			}
			if (singlePoint) {
				// It's possible to make updates to a Glyph while a single path point is selected
				callCallbacksByTopic('currentPathPoint', singlePoint);
			}
		}

		if (topic === 'currentPath') {
			// if a path changes, then so must its' Glyph also
			callCallbacksByTopic('currentItem', data.parent);
		}

		if (topic === 'currentPathPoint') {
			// if a PathPoint changes, then so must its' Path and Glyph also
			callCallbacksByTopic('currentPath', data.parent);
			callCallbacksByTopic('currentItem', data.parent.parent);
		}

		if (topic.includes('currentControlPoint')) {
			// if a PathPoint changes, then so must its' Path and Glyph also
			callCallbacksByTopic('currentPathPoint', data.parent);
			callCallbacksByTopic('currentPath', data.parent.parent);
			callCallbacksByTopic('currentItem', data.parent.parent.parent);

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
		// log(`== calling callbacks ${topic} to ${callTopic}`);
		Object.keys(subscribers[callTopic]).forEach((subscriberID) => {
			subscribers[callTopic][subscriberID](data);
		});
	}

	// log(`ProjectEditor.publish`, 'end');
}

/**
 * Sets up an intent to listen for changes based on a keyword, and
 * provides a callback function in case a change is published
 * @param {string or array} topic what keyword to listen for
 * - 'view' - change to the edit canvas view.
 * - 'whichToolIsSelected' - change to which edit tool is selected.
 * - 'whichGlyphIsSelected' - change to which glyph is being edited.
 * - 'whichPathIsSelected' - change to which path is being edited.
 * - 'whichPathPointIsSelected' - change to which point is being edited.
 * - 'currentItem' - edits to the current glyph, ligature, or component.
 * - 'currentPath' - edits to the current path.
 * - 'currentPathPoint' - edits to the current point.
 * @param {string} subscriberID - the name of the thing listening
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
