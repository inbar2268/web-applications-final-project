import express from "express";
import commentsController from "../controllers/comment_controller";
import { authMiddleware } from "../controllers/auth_controller";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: API for managing comments on posts
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - comment
 *         - userId
 *         - postId
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated unique ID of the comment
 *         comment:
 *           type: string
 *           description: The content of the comment
 *         userId:
 *           type: string
 *           description: The user ID who created the comment
 *         postId:
 *           type: string
 *           description: The ID of the post that the comment belongs to
 *       example:
 *         _id: "65d0fe4f5311236168a109ca"
 *         comment: "This is a great post!"
 *         userId: "65a0fe4f5311236168a109cb"
 *         postId: "65d0fe4f5311236168a109cc"
 */

/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Get all comments
 *     description: Retrieve a list of all comments. Optionally, filter by userId.
 *     tags: [Comments]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filter comments by user ID
 *     responses:
 *       200:
 *         description: A list of comments
 *       400:
 *         description: Invalid request
 */
router.get("/", commentsController.getAll.bind(commentsController));

/**
 * @swagger
 * /comments/{id}:
 *   get:
 *     summary: Get a comment by ID
 *     description: Retrieve a specific comment using its ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the comment
 *     responses:
 *       200:
 *         description: A single comment object
 *       404:
 *         description: Comment not found
 *       400:
 *         description: Invalid ID format
 */
router.get("/:id", commentsController.getById.bind(commentsController));

/**
 * @swagger
 * /comments/post/{postId}:
 *   get:
 *     summary: Get all comments for a specific post
 *     description: Retrieve a list of comments related to a given post ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the post whose comments should be retrieved
 *     responses:
 *       200:
 *         description: List of comments for the specified post
 *       400:
 *         description: Invalid or missing post ID
 *       404:
 *         description: No comments found for the given post ID
 *       500:
 *         description: Server error
 */
router.get("/post/:postId", commentsController.getByPostId.bind(commentsController));

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Create a new comment
 *     description: Adds a new comment to a post
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *                 description: The content of the comment
 *               userId:
 *                 type: string
 *                 description: The ID of the user who is posting the comment
 *               postId:
 *                 type: string
 *                 description: The ID of the post to which the comment belongs
 *             required:
 *               - comment
 *               - userId
 *               - postId
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized (Missing or invalid token)
 */
router.post("/", authMiddleware, commentsController.create.bind(commentsController));

/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Delete a comment by ID
 *     description: Remove a specific comment from the database
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the comment to delete
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       404:
 *         description: Comment not found
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized (Missing or invalid token)
 */
router.delete("/:id", authMiddleware, commentsController.deleteItem.bind(commentsController));

export default router;
