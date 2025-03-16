import { configureStore } from "@reduxjs/toolkit";
import { loggedUserReducer } from "./slices/loggedUserSlice";
import { usersReducer } from "./slices/usersSlice";
import { postsReducer } from "./slices/postsSlice";
import userMiddleware from "./userMiddleware";

export const createStore = () =>
  configureStore({
    reducer: {
      loggedUser: loggedUserReducer,
      users: usersReducer,
      posts: postsReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(userMiddleware),
  });

export const store = createStore();
