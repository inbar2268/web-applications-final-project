import { AxiosError } from "axios";
import apiClient from "./apiClient";

export const generateRecipe = (dishName: string) => {
    return new Promise<string>((resolve, reject) => {
      apiClient
        .post(`/recipes/generate`, {dishName: dishName})
        .then((response) => {
          resolve(response.data);
        })
        .catch((error: AxiosError) => {
          console.log(error);
          reject(error);
        });
    });
  };