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
 *     description: Creates a chat between two users if it does not already exist.
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
 *               userId1:
 *                 type: string
 *                 description: The ID of the first participant (authenticated user)
 *               userId2:
 *                 type: string
 *                 description: The ID of the second participant
 *             required:
 *               - userId1
 *               - userId2
 *     responses:
 *       201:
 *         description: Chat created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Chat'
 *       200:
 *         description: Chat already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Chat'
 *       400:
 *         description: Invalid participant IDs (missing or incorrect format)
 *       401:
 *         description: Unauthorized (Missing or invalid token)
 *       500:
 *         description: Server error
 */
router.post("/", authMiddleware, chatController.createChat.bind(chatController));

/**
 * @swagger
 * /chats/{userId}:
 *   get:
 *     summary: Get all chats for a specific user
 *     description: Retrieve a list of all chats where the given user is a participant
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user whose chats are being retrieved
 *     responses:
 *       200:
 *         description: List of chats for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Chat'
 *       400:
 *         description: Invalid user ID format
 *       401:
 *         description: Unauthorized (Missing or invalid token)
 *       404:
 *         description: No chats found for the given user
 *       500:
 *         description: Server error
 */
router.get("/:userId", authMiddleware, chatController.getChatsByParticipant.bind(chatController));

/**
 * @swagger
 * /chats/{chatId}/messages:
 *   post:
 *     summary: Send a message in a chat
 *     description: Store a new message in a chat and deliver it via WebSocket to the receiver.
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 *         description: The chat ID where the message is sent
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               senderId:
 *                 type: string
 *                 description: The sender's user ID
 *               receiverId:
 *                 type: string
 *                 description: The recipient's user ID
 *               message:
 *                 type: string
 *                 description: The message content
 *     responses:
 *       201:
 *         description: Message sent successfully
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: Chat not found
 *       500:
 *         description: Server error
 */
router.post("/:chatId/messages", authMiddleware, chatController.sendMessage.bind(chatController));

export default router;
