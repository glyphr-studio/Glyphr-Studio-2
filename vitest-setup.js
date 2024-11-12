import { afterAll, beforeAll } from 'vitest';
import { log } from './src/app/main';
beforeAll(() => {
	global.log = log;
});
afterAll(() => {
	delete global.log;
});
