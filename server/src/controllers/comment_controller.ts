import { Request, Response } from "express";
import commentsModel, { IComments } from "../models/comment_model";
import BaseController from "./base_conroller";
import mongoose from "mongoose";

class CommentsController extends BaseController<IComments> {
  constructor() {
    super(commentsModel);
  }

  async getByPostId(req: Request, res: Response) {
    try {
      const { postId } = req.params;

      if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
        res.status(400).send({ error: "Invalid post ID format" });
      } else {
        const comments = await this.model.find({ postId });

        if (comments.length === 0) {
          res.status(404).send({ error: "No comments found for this post" });
        } else {
          res.status(200).send(comments);
        }
      }
    } catch (error) {
      console.error("Error fetching comments by postId:", error);
      res.status(500).send({ error: "Server error" });
    }
  }
}

export default new CommentsController();
