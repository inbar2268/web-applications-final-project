import { Request, Response } from "express";
import mongoose from "mongoose";
import ChatModel from "../models/chat_model";
import MessageModel from "../models/message_model";

class ChatController {
  
  async createChat(req: Request, res: Response) {
    try {
      const { userId1, userId2 } = req.body;

      if (!userId1 || !userId2 || userId1 === userId2 || !mongoose.Types.ObjectId.isValid(userId1) || !mongoose.Types.ObjectId.isValid(userId2)) {
        res.status(400).json({ error: "Invalid participant IDs" });
        return;
      }

      let chat = await ChatModel.findOne({
        participants: { $all: [userId1, userId2] },
      });

      if (chat) {
        res.status(200).json(chat); 
        return;
      }

      chat = new ChatModel({ participants: [userId1, userId2], messages: [] });
      await chat.save();

      res.status(201).json(chat);
    } catch (error) {
      console.error("Error creating chat:", error);
      res.status(500).json({ error: "Server error" });
    }
  }

  async getChatsByParticipant(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        res.status(400).json({ error: "Invalid user ID format" });
        return;
      }

      const chats = await ChatModel.find({ participants: userId }).lean();

      const populatedChats = await Promise.all(
        chats.map(async (chat) => {
          const messages = await MessageModel.find({ _id: { $in: chat.messages } }).sort({ timestamp: 1 });
          return { ...chat, messages };
        })
      );

      res.status(200).json(populatedChats);
    } catch (error) {
      console.error("Error fetching chats:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
}

export default new ChatController();
