import * as symbols from '../symbols';

export default {
	register(app) {
		app.register(symbols.rootProps, () => ({
			render() {
				return (
					<router-view></router-view>
				);
			},
		}));

		app.register(symbols.root, () => {
			const Vue = app.make(symbols.Vue);

			const props = app.make(symbols.rootProps);

			const root = new Vue(props);

			return root;
		});
	},
};
