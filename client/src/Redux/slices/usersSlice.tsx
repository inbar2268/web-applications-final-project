/* eslint-disable prefer-const */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { store } from "../store";
import { IUser } from "../../interfaces/user";

interface IInitialState {
  users: IUser[];
}

const initialState: IInitialState = {
  users: [],
};

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    updateUsersArray: (state, action: PayloadAction<IUser[]>) => {
      state.users = action.payload;
    },
    addUser: (state, action: PayloadAction<IUser>) => {
      state.users = [...state.users, action.payload];
    },
    deleteUser: (state, action: PayloadAction<string>) => {
      let users = state.users;
      const index = state.users.findIndex(
        (user) => user.username === action.payload
      );
      users.splice(index, 1);
      state.users = users;
    },
    updateUser: (state, action: PayloadAction<IUser>) => {
      let users = state.users;
      const index = state.users.findIndex(
        (user) => user._id === action.payload._id
      );
      users.splice(index, 1, action.payload);
      state.users = users;
    },
  },
});

export const { addUser, updateUser, deleteUser, updateUsersArray } =
  usersSlice.actions;

export const usersReducer = usersSlice.reducer;

export const selectUsers = (state: ReturnType<typeof store.getState>) =>
  state.users.users;
