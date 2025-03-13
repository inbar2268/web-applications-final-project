import { configureStore } from "@reduxjs/toolkit";
import { loggedUserReducer } from "./slices/loggedUserSlice";
import { usersReducer } from "./slices/usersSlice";
import { postsReducer } from "./slices/postsSlice";
import { chatReducer } from './slices/chatSlice';

export const createStore = () =>
  configureStore({
    reducer: {
      loggedUser: loggedUserReducer,
      users: usersReducer,
      posts: postsReducer,
      chat: chatReducer,
    },
  });

export const store = createStore();
export type RootState = ReturnType<typeof store.getState>;
