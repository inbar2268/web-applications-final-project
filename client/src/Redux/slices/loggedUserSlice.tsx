import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { store } from "../store";
import { IUser } from "../../interfaces/user";

interface IInitialState {
  loggedUser: IUser;
}

const initialState: IInitialState = {
  loggedUser: {
    email: "",
    password: "",
    username: "",
  },
};

export const loggedUserSlice = createSlice({
  name: "loggedUser",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<IUser>) => {
      state.loggedUser = action.payload;
    },
    logout: (state) => {
      state.loggedUser = {
        email: "",
        password: "",
        username: "",
      };
    },
    updateLoggedUser: (state, action: PayloadAction<IUser>) => {
      state.loggedUser = action.payload;
    },
  },
});

export const { updateLoggedUser, login, logout } = loggedUserSlice.actions;

export const loggedUserReducer = loggedUserSlice.reducer;

export const selectLoggedUser = (state: ReturnType<typeof store.getState>) =>
  state.loggedUser.loggedUser;
