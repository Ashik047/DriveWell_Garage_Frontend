import { configureStore } from "@reduxjs/toolkit";
// import bookingSlice from "./slices/bookingSlice";

export const garageStore = configureStore({
    reducer: {
        // bookingReducer: bookingSlice
    }
})