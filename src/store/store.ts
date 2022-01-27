import {
    combineReducers,
    configureStore,
    MiddlewareArray,
} from '@reduxjs/toolkit';
import {
    FLUSH,
    PAUSE,
    PERSIST,
    PersistConfig,
    persistReducer,
    persistStore,
    PURGE,
    REGISTER,
    REHYDRATE,
} from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import storage from 'redux-persist/lib/storage';
import {createLogger} from 'redux-logger';
import core from './core';

const persistConfig: PersistConfig<any, any, any, any> = {
    key: 'root',
    version: 1,
    storage,
    stateReconciler: autoMergeLevel2,
    whitelist: ['core'],
    blacklist: [],
    transforms: [],
};

let reduxLogger: any = false;
if (process.env.NODE_ENV !== 'production') {
    const whitelistedActions: Array<String> = [];
    reduxLogger = createLogger({
        // filter actions from log
        predicate: (_, action) => !whitelistedActions.includes(action.type),
        duration: true,
        timestamp: false,
        level: 'log',
        logErrors: true,
    });
}

const rootReducer = combineReducers({core});

const persistedReducer = persistReducer<RootState>(persistConfig, rootReducer);

const defaultMiddlewareSettings = {
    serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
};

const middleware = (getDefaultMiddleware: any): MiddlewareArray<any> =>
    reduxLogger
        ? getDefaultMiddleware(defaultMiddlewareSettings).concat(reduxLogger)
        : getDefaultMiddleware(defaultMiddlewareSettings);

export const store = configureStore({
    reducer: persistedReducer,
    middleware,
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof rootReducer>;

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
