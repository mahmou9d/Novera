// // ============================================
// // store/index.ts - Redux Store Configuration
// // ============================================
// import { combineReducers, configureStore } from "@reduxjs/toolkit";
// import { persistReducer, persistStore } from "redux-persist";
// import storage from "redux-persist/lib/storage";
// import { productsApi } from "./UpdataProductSlice";
// import { authApi } from "./authSlice";
// import { cartApi } from "./cartSlice";
// import { wishlistApi } from "./wishlistSlice";
// import { dashboardApi } from "./SalesOrdersSlice";
// import { reviewApi } from "./reviewSlice";
// // import { paymentApi } from "./checkoutSlice";

// // 🔹 RTK Query APIs


// // 🔹 Persist Config
// const persistConfig = {
//     key: "root",
//     storage,
//     whitelist: [],
// };

// // 🔹 Root Reducer
// const rootReducer = combineReducers({
//     // RTK Query APIs
//     [productsApi.reducerPath]: productsApi.reducer,
//     [authApi.reducerPath]: authApi.reducer,
//     [cartApi.reducerPath]: cartApi.reducer,
//     [wishlistApi.reducerPath]: wishlistApi.reducer,
//     [dashboardApi.reducerPath]: dashboardApi.reducer,
//     [reviewApi.reducerPath]: reviewApi.reducer,
//     // [paymentApi.reducerPath]: paymentApi.reducer,
// });

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// // 🔹 Store Configuration
// export const store = configureStore({
//     reducer: persistedReducer,
//     middleware: (getDefaultMiddleware) =>
//         getDefaultMiddleware({
//             serializableCheck: false,
//         })
//             .concat(productsApi.middleware)
//             .concat(authApi.middleware)
//             .concat(cartApi.middleware)
//             .concat(wishlistApi.middleware)
//             .concat(dashboardApi.middleware)
//             .concat(reviewApi.middleware)
//             // .concat(paymentApi.middleware) as any,
// });

// export const persistor = persistStore(store);

// // 🔹 Types
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { productsApi } from "./UpdataProductSlice";
import { authApi } from "./authSlice";
import { cartApi } from "./cartSlice";
import { wishlistApi } from "./wishlistSlice";
import { dashboardApi } from "./SalesOrdersSlice";
import { reviewApi } from "./reviewSlice";

const rootReducer = combineReducers({
    [productsApi.reducerPath]: productsApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [wishlistApi.reducerPath]: wishlistApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [reviewApi.reducerPath]: reviewApi.reducer,
});
console.log("productsApi", productsApi.middleware);
console.log("authApi", authApi.middleware);
console.log("cartApi", cartApi.middleware);
console.log("wishlistApi", wishlistApi.middleware);
console.log("dashboardApi", dashboardApi.middleware);
console.log("reviewApi", reviewApi.middleware);

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            productsApi.middleware,
            authApi.middleware,
            cartApi.middleware,
            wishlistApi.middleware,
            dashboardApi.middleware,
            reviewApi.middleware
        ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
