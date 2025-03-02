import mongoose from "mongoose";

export interface IPost {
  username: string;
  image?: string;
  _id?: string;
  title: string;
  constent: string;
}

const postSchema = new mongoose.Schema<IPost>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  constent: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
});

const postModel = mongoose.model<IPost>("Posts", postSchema);
export default postModel;
