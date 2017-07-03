import remember from '@skyrpex/remember';

let app = null;

export default class Application {
	constructor({ providers }) {
		this.instances = new Map();
		this.bindings = new Map();
		this.resolvedSymbols = new Map();
		this.reboundCallbacks = new Map();
		this.extenders = new Map();
		this.providers = providers;
		this.booted = false;

		Application.setInstance(this);
	}

	static setInstance() {
		app = this;
	}

	static getInstance() {
		return app;
	}

	boot() {
		if (this.booted) {
			return;
		}

		this.providers.forEach((provider) => {
			if (provider.register) {
				provider.register(this);
			}
		});

		this.providers.forEach((provider) => {
			if (provider.boot) {
				provider.boot(this);
			}
		});

		this.booted = true;
	}

	/**
	 * Determine if the given abstract type has been bound.
	 * @param  {Symbol} symbol
	 * @return {Boolean}
	 */
	bound(symbol) {
		return this.instances[symbol] != null || this.bindings[symbol] != null;
	}

	/**
	 * Register an existing instance as shared in the container.
	 *
	 * @param  {symbol} symbol
	 * @param  {*} instance
	 * @return {*}
	 */
	instance(symbol, instance) {
		const isBound = this.bound(symbol);

		this.instances[symbol] = instance;

		if (isBound) {
			this.rebound(symbol);
		}

		return instance;
	}

	/**
	 * Bind a new callback to a symbol's rebind event.
	 *
	 * @param  {symbol}   symbol
	 * @param  {Function} callback
	 */
	rebinding(symbol, callback) {
		const callbacks = this.getRebindings(symbol);
		callbacks.push(callback);

		if (this.bound(symbol)) {
			this.make(symbol);
		}
	}

	getRebindings(symbol) {
		return remember(this.reboundCallbacks, [symbol], () => []);
	}

	bind(symbol, callback) {
		this.bindings[symbol] = callback;

		if (this.resolved(symbol)) {
			this.rebound(symbol);
		}
	}

	resolved(symbol) {
		return this.instances[symbol] != null || this.resolvedSymbols[symbol] != null;
	}

	/**
	 * Fire the "rebound" callbacks for the given symbol.
	 *
	 * @param  {Symbol} symbol
	 */
	rebound(symbol) {
		const instance = this.make(symbol);

		this.getRebindings(symbol).forEach(callback => {
			callback(this, instance);
		});
	}

	extend(symbol, callback) {
		const extenders = this.getExtenders(symbol);
		extenders.push(callback);
		this.extenders[symbol] = extenders;
	}

	getExtenders(symbol) {
		return remember(this.extenders, [symbol], () => []);
	}

	make(symbol) {
		if (symbol == null) {
			throw new Error(`${symbol} is not a symbol`);
		}

		if (this.instances[symbol]) {
			return this.instances[symbol];
		}

		const callback = this.bindings[symbol];
		if (callback) {
			let instance = callback();

			this.getExtenders(symbol).forEach(extender => {
				instance = extender(instance, this);
			});

			this.instances[symbol] = instance;

			this.resolvedSymbols[symbol] = true;

			return instance;
		}

		throw new Error(`Symbol [${symbol.toString()}] not found.`);
	}
}
