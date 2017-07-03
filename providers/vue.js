import Vue from 'vue';
import * as symbols from '../symbols';

export default {
	register(app) {
		app.bind(symbols.Vue, Vue);
	},
};
