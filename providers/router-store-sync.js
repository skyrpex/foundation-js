import { sync } from 'vuex-router-sync';
import * as symbols from '../symbols';

export default {
	boot(app) {
		if (app.has(symbols.store) && app.has(symbols.router)) {
			const store = app.make(symbols.store);
			const router = app.make(symbols.router);
			sync(store, router);
		}
	},
};
