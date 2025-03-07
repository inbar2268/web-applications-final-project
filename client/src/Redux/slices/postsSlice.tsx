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
      let posts = state.posts;
      const index = state.posts.findIndex(
        (post) => post._id === action.payload._id
      );
      posts.splice(index, 1, action.payload);
      state.posts = posts;
    },
    like: (
      state,
      action: PayloadAction<{ postId: string; userId: string }>
    ) => {
      let posts = state.posts;
      const index = state.posts.findIndex(
        (post) => post._id === action.payload.postId
      );
      posts.splice(index, 1, {
        ...posts[index],
        likedBy: [...posts[index].likedBy, action.payload.userId],
      });
      state.posts = posts;
    },
    unlike: (
      state,
      action: PayloadAction<{ postId: string; userId: string }>
    ) => {
      const { postId, userId } = action.payload;
      const postIndex = state.posts.findIndex((post) => post._id === postId);
      if (postIndex === -1) return;

      const updatedPost = {
        ...state.posts[postIndex],
        likedBy: state.posts[postIndex].likedBy.filter(
          (user) => user !== userId
        ),
      };
      state.posts[postIndex] = updatedPost;
    },
  },
});

export const {
  like,
  unlike,
  updatePost,
  updatePostsArray,
  deletePost,
  addPost,
} = postsSlice.actions;

export const postsReducer = postsSlice.reducer;

export const selectPosts = (state: ReturnType<typeof store.getState>) =>
  state.posts.posts;
