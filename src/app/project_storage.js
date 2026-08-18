const DATABASE_NAME = 'GlyphrStudioProjects';
const DATABASE_VERSION = 1;
const AUTO_SAVES_STORE = 'autoSaves';

function openProjectStorage() {
	return new Promise((resolve, reject) => {
		const request = window.indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
		request.onupgradeneeded = () => {
			const database = request.result;
			if (!database.objectStoreNames.contains(AUTO_SAVES_STORE)) {
				database.createObjectStore(AUTO_SAVES_STORE, { keyPath: 'id' });
			}
		};
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
		request.onblocked = () => reject(new Error('Project storage upgrade was blocked.'));
	});
}

export async function getAutoSaves() {
	const database = await openProjectStorage();
	try {
		return await new Promise((resolve, reject) => {
			const request = database
				.transaction(AUTO_SAVES_STORE, 'readonly')
				.objectStore(AUTO_SAVES_STORE)
				.getAll();
			request.onsuccess = () => resolve(request.result || []);
			request.onerror = () => reject(request.error);
		});
	} finally {
		database.close();
	}
}

export async function getAutoSave(projectID) {
	const database = await openProjectStorage();
	try {
		return await new Promise((resolve, reject) => {
			const request = database
				.transaction(AUTO_SAVES_STORE, 'readonly')
				.objectStore(AUTO_SAVES_STORE)
				.get(projectID);
			request.onsuccess = () => resolve(request.result);
			request.onerror = () => reject(request.error);
		});
	} finally {
		database.close();
	}
}

export async function setAutoSave(saveData) {
	const database = await openProjectStorage();
	try {
		await new Promise((resolve, reject) => {
			const transaction = database.transaction(AUTO_SAVES_STORE, 'readwrite');
			transaction.objectStore(AUTO_SAVES_STORE).put(saveData);
			transaction.oncomplete = () => resolve();
			transaction.onerror = () => reject(transaction.error);
			transaction.onabort = () => reject(transaction.error);
		});
	} finally {
		database.close();
	}
}

export async function clearAutoSaves() {
	const database = await openProjectStorage();
	try {
		await new Promise((resolve, reject) => {
			const transaction = database.transaction(AUTO_SAVES_STORE, 'readwrite');
			transaction.objectStore(AUTO_SAVES_STORE).clear();
			transaction.oncomplete = () => resolve();
			transaction.onerror = () => reject(transaction.error);
			transaction.onabort = () => reject(transaction.error);
		});
	} finally {
		database.close();
	}
}

export async function deleteAutoSave(projectID) {
	const database = await openProjectStorage();
	try {
		await new Promise((resolve, reject) => {
			const transaction = database.transaction(AUTO_SAVES_STORE, 'readwrite');
			transaction.objectStore(AUTO_SAVES_STORE).delete(projectID);
			transaction.oncomplete = () => resolve();
			transaction.onerror = () => reject(transaction.error);
			transaction.onabort = () => reject(transaction.error);
		});
	} finally {
		database.close();
	}
}

export async function updateAutoSaveMetadata(projectID, metadata = {}) {
	const saveData = await getAutoSave(projectID);
	if (!saveData) return undefined;
	const updatedSave = { ...saveData, ...metadata };
	await setAutoSave(updatedSave);
	return updatedSave;
}
