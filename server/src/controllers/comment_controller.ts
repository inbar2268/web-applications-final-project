import { Request, Response } from "express";
import commentsModel, { IComments } from "../models/comment_model";
import PostModel from "../models/posts_model";

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
  async create(req: Request, res: Response) {
    const body = req.body;
    try {
      const item = await this.model.create(body);
      await PostModel.findByIdAndUpdate(
        item.postId,
        { $inc: { commentsCount: 1 } },
        { new: true }
      );
        res.status(201).send(item);
      } catch (error) {
        console.log(error);

      res.status(400).send(error);
    }
  }
  async deleteItem(req: Request, res: Response) {
    const id = req.params.id;
    try {
      const rs = await this.model.findByIdAndDelete(id);
      await PostModel.findByIdAndUpdate(
        rs?.postId,
        { $inc: { commentsCount: -1 } }, 
        { new: true }
      );
      if (!rs) {
        res.status(404).send({ error: "Item not found" });
      } else {
        res.status(200).send("deleted");
      }
    } catch (error) {
      res.status(400).send(error);
    }
  }
}





export default new CommentsController();
