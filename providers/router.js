import Router from 'vue-router';
import * as symbols from '../symbols';

export default {
	register(app) {
		const Vue = app.make(symbols.Vue);
		Vue.use(Router);

		app.register(symbols.router, () => {
			const routes = app.make(symbols.routes);

			const router = new Router({
				// mode: 'history',
				routes,
			});

			return router;
		});

		app.extend(symbols.rootProps, (root) => {
			const router = app.make(symbols.router);

			return Object.assign(root, { router });
		});
	},
};
