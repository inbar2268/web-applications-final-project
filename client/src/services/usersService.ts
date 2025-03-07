import apiClient from "./apiClient";
import { AxiosError } from "axios";
import { IUser } from "../interfaces/user";

export const getUsers = () => {
  return new Promise<IUser[]>((resolve, reject) => {
    apiClient
      .get(`/users/`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error: AxiosError) => {
        console.log(error);
        reject(error);
      });
  });
};

export const deleteUser = (_id: string) => {
  return new Promise<IUser>((resolve, reject) => {
    apiClient
      .delete(`/users/${_id}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error: AxiosError) => {
        console.log(error);
        if (error.response?.status === 401) {
          reject("You are not authorized to delete this user");
        } else {
          reject("Failed to delete user. Please try again.");
        }
      });
  });
};

export const getUserById = (_id: string) => {
  return new Promise<IUser>((resolve, reject) => {
    apiClient
      .get(`/users/${_id}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.error(error);
        reject("Failed to fetch user. Please try again.");
      });
  });
};

export const editUser = (_id: string, updatedData: Partial<IUser>) => {
  return new Promise<IUser>((resolve, reject) => {
    apiClient
      .put(`/users/${_id}`, updatedData)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.error(error);
        reject("Failed to update user. Please try again.");
      });
  });
};
