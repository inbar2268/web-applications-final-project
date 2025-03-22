import apiClient from "./apiClient";
import { AxiosError } from "axios";
import { IUser } from "../interfaces/user";
import { IPost } from "../interfaces/post";

export interface IPostForm {
  title: string;
  content: string;
  userId: string;
  image: string;
}

export const getposts = () => {
  return new Promise<IPost[]>((resolve, reject) => {
    apiClient
      .get(`/posts/`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error: AxiosError) => {
        console.log(error);
        reject(error);
      });
  });
};

export const deletePost = (_id: string) => {
  return new Promise<IUser>((resolve, reject) => {
    apiClient
      .delete(`/posts/${_id}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error: AxiosError) => {
        console.log(error);
        if (error.response?.status === 401) {
          reject("You are not authorized to delete this post");
        } else {
          reject("Failed to delete post. Please try again.");
        }
      });
  });
};

export const createPost = (post: IPostForm) => {
  return new Promise<IPost>((resolve, reject) => {
    apiClient
      .post("/posts/", post)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error: AxiosError) => {
        console.log(error);
        reject(error);
      });
  });
};

export const getPostById = (_id: string) => {
  return new Promise<IPost>((resolve, reject) => {
    apiClient
      .get(`/posts/${_id}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.error(error);
        reject("Failed to fetch post. Please try again.");
      });
  });
};

export const editPost = (_id: string, updatedData: Partial<IUser>) => {
  return new Promise<IPost>((resolve, reject) => {
    apiClient
      .put(`/posts/${_id}`, updatedData)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.error(error);
        reject("Failed to update post. Please try again.");
      });
  });
};

export const likePost = (postId: string, userId: string) => {
  return new Promise<{ post: IPost; likedBy: string[] }>((resolve, reject) => {
    apiClient
      .post(`/posts/${postId}/like`, { userId })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.error(error);
        reject("Failed to like post. Please try again.");
      });
  });
};
export const unlikePost = (postId: string, userId: string) => {
  return new Promise<{ post: IPost; likedBy: string[] }>((resolve, reject) => {
    apiClient
      .post(`/posts/${postId}/unlike`, { userId })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.error(error);
        reject("Failed to unlike post. Please try again.");
      });
  });
};

