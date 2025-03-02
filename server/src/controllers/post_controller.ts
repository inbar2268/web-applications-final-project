import PostModel, { IPost } from "../models/posts_model";
import { Request, Response } from "express";
import BaseController from "./base_conroller";
import userModel from "../models/users_model";

class postsController extends BaseController<IPost> {
  constructor() {
    super(PostModel);
  }

  async create(req: Request, res: Response) {
    const userId = req.body.owner;
    const user = await userModel.findOne({ username: userId });
    if (user) {
      super.create(req, res);
    } else {
      res.status(404).send("User not found");
    }
  }

  async getPostsByOwner(req: Request, res: Response) {
    const owner = req.params.owner;

    try {
      const posts = await PostModel.find({ owner: owner });
      if (posts.length > 0) {
        res.status(200).send(posts);
      } else {
        res.status(404).send("Post not found");
      }
    } catch (error: unknown) {
      if (error && typeof error === "object" && "message" in error) {
        res.status(400).send((error as { message: string }).message);
      } else {
        res.status(400).send("An unknown error occurred");
      }
    }
  }
  async likePost(req: Request, res: Response) {
    const postId = req.params.id;
    const { username } = req.body; 
    try {
      const post = await PostModel.findById(postId);
      if (!post) {
        res.status(404).send({ error: "Post not found" });
        return;
      }

      if (post.likedBy.includes(username)) {
        res.status(400).send({ error: "User already liked this post" });
        return;
      }

      post.likedBy.push(username);
      await post.save();

      res.status(200).send(post);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Server error" });
    }
  }

  
  async unlikePost(req: Request, res: Response) {
    const postId = req.params.id;
    const { username } = req.body; 

    try {
      const post = await PostModel.findById(postId);
      if (!post) {
        res.status(404).send({ error: "Post not found" });
        return;
      }

      if (!post.likedBy.includes(username)) {
        res.status(400).send({ error: "User has not liked this post" });
        return;
      }

      post.likedBy = post.likedBy.filter((user) => user !== username);
      await post.save();

      res.status(200).send(post);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Server error" });
    }
  }
}

export default new postsController();
