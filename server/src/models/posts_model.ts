import mongoose from "mongoose";

export interface IPost {
  title: string;
  constent: string;
  userId: string;
  image?: string;
  likedBy: string[];
}

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: String,
  userId: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  likedBy: {
    type: [String], 
    default: [], 
  },
  commentsCount: {
    type: Number,
    default: 0,
  },
});

const postModel = mongoose.model("Posts", postSchema);

export default postModel;
