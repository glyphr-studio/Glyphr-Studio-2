import { readFileSync, writeFile } from 'fs';

/**
 * Updates app_config.json for build
 */
export function build() {
	const path = './src/app/app_config.json';
	const config = readConfig();
	config.devMode = false;

	console.log(`
============================================================
Glyphr Studio: ${config.version}`);
	config.versionDate = getShipDate();
	console.log(`============================================================\n\n`);
	writeFile(path, JSON.stringify(config, null, 2), (error) => {
		if (error) {
			console.log('An error has occurred ', error);
			return;
		}
	});
}
/**
 * Updates app_config.json for stage
 */
export function stage() {
	const path = './src/app/app_config.json';
	const config = readConfig();
	config.devMode = true;

	console.log(`
============================================================
Glyphr Studio: ${config.version}`);
	config.versionDate = 'STAGED BUILD';
	console.log(`============================================================\n\n`);
	writeFile(path, JSON.stringify(config, null, 2), (error) => {
		if (error) {
			console.log('An error has occurred ', error);
			return;
		}
	});
}

/**
 * Updates app_config.json for development
 */
export function dev() {
	const path = './src/app/app_config.json';
	const config = readConfig();
	config.devMode = true;
	config.versionDate = 0;

	writeFile(path, JSON.stringify(config, null, 2), (error) => {
		if (error) {
			console.log('An error has occurred ', error);
			return;
		}
	});
}

function readConfig() {
	const data = readFileSync('./src/app/app_config.json');
	return JSON.parse('' +data);
}

function getShipDate(dayOffset = 0) {
	const shipDate = new Date();
	shipDate.setDate(shipDate.getDate() + dayOffset);
	shipDate.setHours(12, 0, 0, 0);
	const result = shipDate.getTime();
	console.log(`${new Date(result).toString()}`);
	return result;
}
