import { Request, Response } from "express";
import commentsModel, { IComments } from "../models/comment_model";
import BaseController from "./base_conroller";

class CommentsController extends BaseController<IComments> {
  constructor() {
    super(commentsModel);
  }

  
  async getByPostId(req: Request, res: Response) {
    const { postId } = req.params;

    try {
      if (!postId || postId.trim() === "") {
        res.status(400).send({ error: "Post ID is required" });
      }
      else{
        const comments = await this.model.find({ postId });
        res.status(200).send(comments);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Server error" });
    }
  }
}

export default new CommentsController();
