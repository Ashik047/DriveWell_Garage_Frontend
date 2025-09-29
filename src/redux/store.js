import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { servicesApi } from "./slices/servicesApi";
import { branchesApi } from "./slices/branchesApi";
import { reviewsApi } from "./slices/reviewsApi";
import { bookingsApi } from "./slices/bookingsApi";

export const garageStore = configureStore({
    reducer: {
        [servicesApi.reducerPath]: servicesApi.reducer,
        [branchesApi.reducerPath]: branchesApi.reducer,
        [reviewsApi.reducerPath]: reviewsApi.reducer,
        [bookingsApi.reducerPath]: bookingsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(servicesApi.middleware, branchesApi.middleware, reviewsApi.middleware, bookingsApi.middleware),
})
setupListeners(garageStore.dispatch); 