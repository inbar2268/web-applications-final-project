import mongoose from "mongoose";

export interface IMessage {
  senderId: string;   
  receiverId: string; 
  message: string;    
  timestamp: Date;   
}

const messageSchema = new mongoose.Schema<IMessage>({
  senderId: {
    type: String,
    required: true,
  },
  receiverId: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const messageModel = mongoose.model<IMessage>("Messages", messageSchema);

export default messageModel;
