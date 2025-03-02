import mongoose from "mongoose";

export interface IPost {
  title: string;
  constent: string;
  owner: string;
  image?: string;
  likedBy: string[];
}

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: String,
  owner: {
    type: String,
    required: true,
  },
  Image: {
    type: String,
    required: false,
  },
  likedBy: {
    type: [String], 
    default: [], 
  },
});

const postModel = mongoose.model("Posts", postSchema);

export default postModel;
