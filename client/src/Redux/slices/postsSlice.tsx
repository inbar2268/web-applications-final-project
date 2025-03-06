/* eslint-disable prefer-const */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { store } from "../store";
import { IPost } from "../../interfaces/post";

interface IInitialState {
  posts: IPost[];
}

const initialState: IInitialState = {
  posts: [],
};

export const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    updatePostsArray: (state, action: PayloadAction<IPost[]>) => {
      state.posts = action.payload;
    },
    addPost: (state, action: PayloadAction<IPost>) => {
      state.posts = [...state.posts, action.payload];
    },
    deletePost: (state, action: PayloadAction<string>) => {
      let posts = state.posts;
      const index = state.posts.findIndex(
        (post) => post._id === action.payload
      );
      posts.splice(index, 1);
      state.posts = posts;
    },
    updatePost: (state, action: PayloadAction<IPost>) => {
      let users = state.posts;
      const index = state.posts.findIndex(
        (post) => post._id === action.payload._id
      );
      users.splice(index, 1, action.payload);
      state.posts = users;
    },
  },
});

export const { updatePost, updatePostsArray, deletePost, addPost } =
  postsSlice.actions;

export const postsReducer = postsSlice.reducer;

export const selectPosts = (state: ReturnType<typeof store.getState>) =>
  state.posts.posts;
