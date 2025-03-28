import express from "express";
const router = express.Router();
import postsController from "../controllers/post_controller";
import { authMiddleware } from "../controllers/auth_controller";

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: The Posts API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - title
 *         - content
 *         - userId
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the post
 *         title:
 *           type: string
 *           description: The title of the post
 *         content:
 *           type: string
 *           description: The content of the post
 *         userId:
 *           type: string
 *           description: The ID of the user who created the post
 *         image:
 *           type: string
 *           description: URL of the post image (optional)
 *         likedBy:
 *           type: array
 *           items:
 *             type: string
 *           description: List of user IDs who liked the post
 *       example:
 *         _id: "245234t234234r234r23f4"
 *         title: "My First Post"
 *         content: "This is the content of my first post."
 *         userId: "60d0fe4f5311236168a109ca"
 *         image: "https://example.com/image.jpg"
 *         likedBy: ["60d0fe4f5311236168a109cb"]
 */

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a new post
 *     description: Create a new post
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               userId:
 *                 type: string
 *               image:
 *                 type: string
 *             required:
 *               - title
 *               - content
 *               - userId
 *     responses:
 *       201:
 *         description: Post created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post("/", authMiddleware, postsController.create.bind(postsController));

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get all posts
 *     description: Retrieve a list of all posts
 *     tags:
 *       - Posts
 *     responses:
 *       200:
 *         description: A list of posts
 *       500:
 *         description: Server error
 */
router.get("/", postsController.getAll.bind(postsController));

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Get a post by ID
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single post
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
router.get("/:id", postsController.getById.bind(postsController));

/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: Update a post
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               userId:
 *                 type: string
 *             required:
 *               - title
 *               - content
 *               - userId
 *     responses:
 *       200:
 *         description: Post updated successfully
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
router.put("/:id", authMiddleware, postsController.update.bind(postsController));

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Delete a post by ID
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", authMiddleware, postsController.deleteItem.bind(postsController));

/**
 * @swagger
 * /posts/byUser/{userId}:
 *   get:
 *     summary: Get all posts by a user's ID
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of posts by the user
 *       404:
 *         description: No posts found
 *       500:
 *         description: Server error
 */
router.get("/byUser/:userId", postsController.getPostsByUserId.bind(postsController));

/**
 * @swagger
 * /posts/{id}/like:
 *   post:
 *     summary: Like a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Post liked successfully
 *       400:
 *         description: User already liked this post
 *       404:
 *         description: Post not found
 */
router.post("/:id/like", authMiddleware, postsController.likePost.bind(postsController));

/**
 * @swagger
 * /posts/{id}/unlike:
 *   post:
 *     summary: Unlike a post
 *     description: Removes a user from the likedBy list of a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user unliking the post
 *     responses:
 *       200:
 *         description: Post unliked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The post ID
 *                 title:
 *                   type: string
 *                   description: The title of the post
 *                 likedBy:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: List of users who liked the post
 *       400:
 *         description: User has not liked this post
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
router.post("/:id/unlike", authMiddleware, postsController.unlikePost.bind(postsController));

export default router;
