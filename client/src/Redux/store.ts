import { configureStore } from "@reduxjs/toolkit";
import { loggedUserReducer } from "./slices/loggedUserSlice";
import { usersReducer } from "./slices/usersSlice";
import { postsReducer } from "./slices/postsSlice";
import userMiddleware from "./userMiddleware";
import postsMiddleware from "./postsMiddleware";

export const createStore = () =>
  configureStore({
    reducer: {
      loggedUser: loggedUserReducer,
      users: usersReducer,
      posts: postsReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(userMiddleware, postsMiddleware),
  });

export const store = createStore();
export type RootState = ReturnType<typeof store.getState>;
