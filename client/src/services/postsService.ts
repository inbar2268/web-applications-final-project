import apiClient from "./apiClient";
import { AxiosError } from "axios";
import { IUser } from "../interfaces/user";
import { IPost } from "../interfaces/post";

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

export const createComment = (post: IPost) => {
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
export const getPostByUserName = (username: string) => {
  return new Promise<IPost[]>((resolve, reject) => {
    apiClient
      .get(`/posts/byOwner/${username}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.error(error);
        reject("Failed to fetch posts. Please try again.");
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

export const likePost = (postId: string, username: string) => {
  return new Promise<{ post: IPost; likedBy: string[] }>((resolve, reject) => {
    apiClient
      .post(`/posts/${postId}/like`, { username })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.error(error);
        reject("Failed to like post. Please try again.");
      });
  });
};
export const unlikePost = (postId: string, username: string) => {
  return new Promise<{ post: IPost; likedBy: string[] }>((resolve, reject) => {
    apiClient
      .delete(`/posts/${postId}/like`, { data: { username } })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.error(error);
        reject("Failed to unlike post. Please try again.");
      });
  });
};
