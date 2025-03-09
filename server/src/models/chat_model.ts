import mongoose from "mongoose";

export interface IChat {
  participants: [string, string]; 
  messages: string[];             
  createdAt: Date;                
}

const chatSchema = new mongoose.Schema<IChat>({
  participants: {
    type: [String],
    required: true,
    validate: {
      validator: function (value: string[]) {
        return value.length === 2; 
      },
      message: "A chat must have exactly two participants",
    },
  },
  messages: {
    type: [String], 
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now, 
  },
});

const chatModel = mongoose.model<IChat>("Chats", chatSchema);

export default chatModel;
