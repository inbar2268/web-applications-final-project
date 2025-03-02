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
}

export default new postsController();
