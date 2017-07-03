import Vuex, { Store } from 'vuex';
import * as symbols from '../symbols';

export default {
	register(app) {
		const Vue = app.make(symbols.Vue);
		Vue.use(Vuex);

		app.register(symbols.store, () => {
			const store = new Store({});

			return store;
		});

		app.extend(symbols.rootProps, (root) => {
			const store = app.make(symbols.store);

			return Object.assign(root, { store });
		});
	},
};
