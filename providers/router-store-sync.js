import { sync } from 'vuex-router-sync';
import * as symbols from '../symbols';

export default {
	boot(app) {
		if (app.bound(symbols.store) && app.bound(symbols.router)) {
			const store = app.make(symbols.store);
			const router = app.make(symbols.router);
			sync(store, router);
		}
	},
};
