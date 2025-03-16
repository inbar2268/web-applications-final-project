import apiClient from "../services/apiClient";
import { AxiosError } from "axios";
import IMessage from '../interfaces/message';
import IChat from '../interfaces/chat';
import IUser from '../interfaces/user';

interface SendMessagePayload {
  senderId: string;
  receiverId: string;
  message: string;
}


export const getUserChats = (userId: string) => {
  return new Promise<IChat[]>((resolve, reject) => {
    apiClient
      .get(`/chats/${userId}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error: AxiosError) => {
        console.error('Error fetching user chats:', error);
        reject(error);
      });
  });
};


export const getChatById = (chatId: string) => {
  return new Promise<IChat>((resolve, reject) => {
    apiClient
      .get(`/chats/${chatId}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error: AxiosError) => {
        console.error('Error fetching chat by ID:', error);
        reject(error);
      });
  });
};


export const getUserById = (userId: string) => {
  return new Promise<IUser>((resolve, reject) => {
    apiClient
      .get(`/users/${userId}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error: AxiosError) => {
        console.error('Error fetching user by ID:', error);
        reject(error);
      });
  });
};


export const sendMessage = (chatId: string, messageData: SendMessagePayload) => {
  return new Promise<IMessage>((resolve, reject) => {
    apiClient
      .post(`/chats/${chatId}/messages`, messageData)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error: AxiosError) => {
        console.error('Error sending message:', error);
        reject(error);
      });
  });
};