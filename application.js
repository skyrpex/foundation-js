let app = null;

export default class Application {
	constructor({ providers }) {
		this.instances = new Map();
		this.callbacks = new Map();
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

	has(symbol) {
		return this.instances[symbol] != null || this.callbacks[symbol] != null;
	}

	bind(symbol, value) {
		if (this.instances[symbol]) {
			throw new Error(`${symbol.toString()} is already bound.`);
		}

		this.instances[symbol] = value;
	}

	register(symbol, callback) {
		if (this.instances[symbol]) {
			throw new Error(`${symbol.toString()} is already registered.`);
		}

		this.callbacks[symbol] = callback;
	}

	extend(symbol, callback) {
		const extenders = this.getExtenders(symbol);
		extenders.push(callback);
		this.extenders[symbol] = extenders;
	}

	getExtenders(symbol) {
		const extenders = this.extenders[symbol];
		return extenders ? extenders : [];
	}

	make(symbol) {
		if (symbol == null) {
			throw new Error(`${symbol} is not a symbol`);
		}

		if (this.instances[symbol]) {
			return this.instances[symbol];
		}

		const callback = this.callbacks[symbol];
		if (callback) {
			let instance = callback();

			this.getExtenders(symbol).forEach(extender => {
				instance = extender(instance, this);
			});

			this.instances[symbol] = instance;

			return instance;
		}

		throw new Error(`Symbol [${symbol.toString()}] not found.`);
	}
}
