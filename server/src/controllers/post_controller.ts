import PostModel, { IPost } from "../models/posts_model";
import { Request, Response } from "express";
import BaseController from "./base_conroller";
import userModel from "../models/users_model";
import mongoose from "mongoose";

class postsController extends BaseController<IPost> {
  constructor() {
    super(PostModel);
  }

  
  async create(req: Request, res: Response) {
    const userId = req.body.userId;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).send({ error: "Invalid user ID format" });
      return;
    }

    const user = await userModel.findById(userId);
    if (user) {
      super.create(req, res);
    } else {
      res.status(404).send({ error: "User not found" });
    }
  }

 
  async getPostsByUserId(req: Request, res: Response) {
    const userId = req.params.userId;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).send({ error: "Invalid user ID format" });
      return;
    }

    try {
      const posts = await PostModel.find({ userId: userId });
      if (posts.length > 0) {
        res.status(200).send(posts);
      } else {
        res.status(404).send({ error: "No posts found for this user" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Server error" });
    }
  }

 
  async likePost(req: Request, res: Response) {
    const postId = req.params.id;
    const { userId } = req.body;
    try {
      const post = await PostModel.findById(postId);
      if (!post) {
        res.status(404).send({ error: "Post not found" });
        return;
      }

      if (post.likedBy.includes(userId)) {
        res.status(400).send({ error: "User already liked this post" });
        return;
      }

      post.likedBy.push(userId);
      await post.save();

      res.status(200).send(post);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Server error" });
    }
  }

 
  async unlikePost(req: Request, res: Response) {
    const postId = req.params.id;
    const { userId } = req.body;

    try {
      const post = await PostModel.findById(postId);
      if (!post) {
        res.status(404).send({ error: "Post not found" });
        return;
      }

      if (!post.likedBy.includes(userId)) {
        res.status(400).send({ error: "User has not liked this post" });
        return;
      }

      post.likedBy = post.likedBy.filter((id) => id !== userId);
      await post.save();

      res.status(200).send(post);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Server error" });
    }
  }
}

export default new postsController();
