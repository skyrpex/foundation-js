import Vuex, { Store } from 'vuex';
import * as symbols from '../symbols';

export default {
	register(app) {
		const Vue = app.make(symbols.Vue);
		Vue.use(Vuex);

		app.bind(symbols.store, () => {
			const modules = app.make(symbols.modules);

			const store = new Store({
				modules,
			});

			return store;
		});

		app.rebinding(symbols.modules, (app, modules) => {
			const store = app.make(symbols.store);
			store.hotUpdate({ modules });
		});

		app.extend(symbols.rootProps, (root) => {
			const store = app.make(symbols.store);

			return Object.assign(root, { store });
		});
	},
};
