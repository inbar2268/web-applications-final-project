import express from "express";
import chatController from "../controllers/chat_controller";
import { authMiddleware } from "../controllers/auth_controller";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Chats
 *   description: API for managing chat sessions between users
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Chat:
 *       type: object
 *       required:
 *         - participants
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the chat
 *         participants:
 *           type: array
 *           items:
 *             type: string
 *           description: List of user IDs participating in the chat
 *         messages:
 *           type: array
 *           items:
 *             type: string
 *           description: List of message IDs in the chat
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the chat was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the chat was last updated
 *       example:
 *         _id: "65d0fe4f5311236168a109ca"
 *         participants: ["65a0fe4f5311236168a109cb", "65b0fe4f5311236168a109cc"]
 *         messages: ["65d1fe4f5311236168a109cd"]
 *         createdAt: "2025-03-08T10:00:00Z"
 *         updatedAt: "2025-03-08T11:00:00Z"
 */

/**
 * @swagger
 * /chats:
 *   post:
 *     summary: Create a new chat
 *     description: Creates a chat between two users
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the other participant
 *             required:
 *               - userId
 *     responses:
 *       201:
 *         description: Chat created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Chat'
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized (Missing or invalid token)
 *       500:
 *         description: Server error
 */
router.post("/", authMiddleware, chatController.createChat.bind(chatController));

/**
 * @swagger
 * /chats:
 *   get:
 *     summary: Get all chats for the authenticated user
 *     description: Retrieve a list of all chats where the user is a participant
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of chats for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Chat'
 *       401:
 *         description: Unauthorized (Missing or invalid token)
 *       500:
 *         description: Server error
 */
router.get("/:userId", authMiddleware, chatController.getChatsByParticipant.bind(chatController)); // ✅ Ensure this matches

export default router;
