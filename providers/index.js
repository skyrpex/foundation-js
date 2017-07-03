import VueProvider from '@skyrpex/foundation/providers/vue';
import RouterProvider from '@skyrpex/foundation/providers/router';
import StoreProvider from '@skyrpex/foundation/providers/store';
import RouterStoreSyncProvider from '@skyrpex/foundation/providers/router-store-sync';
import RootProvider from '@skyrpex/foundation/providers/root';

export {
	VueProvider,
	RouterProvider,
	StoreProvider,
	RouterStoreSyncProvider,
	RootProvider,
};

export default [
	VueProvider,
	RouterProvider,
	StoreProvider,
	RouterStoreSyncProvider,
	RootProvider,
];
