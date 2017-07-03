import * as symbols from '../symbols';

export default {
	register(app) {
		app.bind(symbols.rootProps, () => ({
			render: h => h('router-view'),
		}));

		app.bind(symbols.root, () => {
			const Vue = app.make(symbols.Vue);

			const props = app.make(symbols.rootProps);

			const root = new Vue(props);

			return root;
		});
	},
};
