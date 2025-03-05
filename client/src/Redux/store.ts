import { configureStore } from "@reduxjs/toolkit";
import { loggedUserReducer } from "./slices/loggedUserSlice";
import { usersReducer } from "./slices/usersSlice";
import { postsReducer } from "./slices/postsSlice";

export const createStore = () =>
  configureStore({
    reducer: {
      loggedUser: loggedUserReducer,
      users: usersReducer,
      posts: postsReducer,
    },
  });

export const store = createStore();
