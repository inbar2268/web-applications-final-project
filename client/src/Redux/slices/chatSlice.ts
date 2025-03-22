import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../../interfaces/user";
import { RootState } from "../store"; 

export interface IMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: number;
  read: boolean;
}

export interface IChat {
  id: string;
  participants: string[];
  messages: IMessage[];
  lastActivity: number;
}

interface ChatState {
  activeChats: IChat[];
  currentChatId: string | null;
  currentChatUser: IUser | null;
  isChatOpen: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  activeChats: [],
  currentChatId: null,
  currentChatUser: null,
  isChatOpen: false,
  isLoading: false,
  error: null,
};

const generateChatId = (userId1: string, userId2: string): string => {
  const sortedIds = [userId1, userId2].sort();
  return `chat_${sortedIds[0]}_${sortedIds[1]}`;
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    startChat: (state, action: PayloadAction<IUser>) => {
      const loggedUserId = localStorage.getItem("userId") || "";
      if (loggedUserId === action.payload._id) {
        state.error = "Cannot start chat with yourself";
        return;
      }
      const chatId = generateChatId(loggedUserId, action.payload._id);
      const existingChat = state.activeChats.find((chat) => chat.id === chatId);
      if (!existingChat) {
        state.activeChats.push({
          id: chatId,
          participants: [loggedUserId, action.payload._id],
          messages: [],
          lastActivity: Date.now(),
        });
      }
      state.currentChatId = chatId;
      state.currentChatUser = action.payload;
      state.isChatOpen = true;
      state.error = null;
    },
    sendMessage: (state, action: PayloadAction<{ content: string }>) => {
      if (!state.currentChatId || !state.currentChatUser) {
        state.error = "No active chat";
        return;
      }
      const loggedUserId = localStorage.getItem("userId") || "";
      const chatIndex = state.activeChats.findIndex(
        (chat) => chat.id === state.currentChatId
      );
      if (chatIndex === -1) {
        state.error = "Chat not found";
        return;
      }
      const newMessage: IMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        senderId: loggedUserId,
        receiverId: state.currentChatUser._id,
        content: action.payload.content,
        timestamp: Date.now(),
        read: false,
      };
      state.activeChats[chatIndex].messages.push(newMessage);
      state.activeChats[chatIndex].lastActivity = Date.now();
    },
    receiveMessage: (state, action: PayloadAction<IMessage>) => {
      const { senderId, receiverId } = action.payload;
      const chatId = generateChatId(senderId, receiverId);
      const chatIndex = state.activeChats.findIndex((chat) => chat.id === chatId);
      if (chatIndex === -1) {
        state.activeChats.push({
          id: chatId,
          participants: [senderId, receiverId],
          messages: [action.payload],
          lastActivity: Date.now(),
        });
      } else {
        state.activeChats[chatIndex].messages.push(action.payload);
        state.activeChats[chatIndex].lastActivity = Date.now();
      }
    },
    switchChat: (state, action: PayloadAction<{ chatId: string; user: IUser }>) => {
      state.currentChatId = action.payload.chatId;
      state.currentChatUser = action.payload.user;
      state.isChatOpen = true;
    },
    closeChat: (state) => {
      state.isChatOpen = false;
    },
    markAsRead: (state, action: PayloadAction<{ chatId: string }>) => {
      const chatIndex = state.activeChats.findIndex(
        (chat) => chat.id === action.payload.chatId
      );
      if (chatIndex !== -1) {
        const loggedUserId = localStorage.getItem("userId") || "";
        state.activeChats[chatIndex].messages = state.activeChats[
          chatIndex
        ].messages.map((message) => {
          if (message.receiverId === loggedUserId && !message.read) {
            return { ...message, read: true };
          }
          return message;
        });
      }
    },
    deleteChat: (state, action: PayloadAction<{ chatId: string }>) => {
      state.activeChats = state.activeChats.filter(
        (chat) => chat.id !== action.payload.chatId
      );
      if (state.currentChatId === action.payload.chatId) {
        state.currentChatId = null;
        state.currentChatUser = null;
        state.isChatOpen = false;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  startChat,
  sendMessage,
  receiveMessage,
  switchChat,
  closeChat,
  markAsRead,
  deleteChat,
  setLoading,
  setError,
} = chatSlice.actions;

export const selectActiveChats = (state: RootState) => state.chat.activeChats;
export const selectCurrentChat = (state: RootState) => {
  const { currentChatId, activeChats } = state.chat;
  if (!currentChatId) return null;
  return activeChats.find((chat) => chat.id === currentChatId) || null;
};
export const selectCurrentChatUser = (state: RootState) =>
  state.chat.currentChatUser;
export const selectIsChatOpen = (state: RootState) => state.chat.isChatOpen;
export const selectChatLoading = (state: RootState) => state.chat.isLoading;
export const selectChatError = (state: RootState) => state.chat.error;
export const selectUnreadMessageCount = (state: RootState) => {
  const loggedUserId = localStorage.getItem("userId") || "";
  return state.chat.activeChats.reduce((count, chat) => {
    const unreadMessages = chat.messages.filter(
      (msg) => msg.receiverId === loggedUserId && !msg.read
    );
    return count + unreadMessages.length;
  }, 0);
};

export const chatReducer = chatSlice.reducer;