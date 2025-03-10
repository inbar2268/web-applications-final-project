import express from "express";
import recipeController from "../controllers/recipe_controller";
import { authMiddleware } from "../controllers/auth_controller"; 

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Recipes
 *   description: API for generating recipes using GPT-4
 */

/**
 * @swagger
 * /recipes/generate:
 *   post:
 *     summary: Generate a recipe using GPT-4
 *     description: Authenticated users can generate a recipe by providing a dish name.
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dishName:
 *                 type: string
 *                 description: Name of the dish to generate a recipe for
 *             required:
 *               - dishName
 *     responses:
 *       200:
 *         description: Successfully generated recipe (plain text)
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *       400:
 *         description: Bad request (missing or invalid input)
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 */
router.post("/generate", authMiddleware, recipeController.generateRecipe.bind(recipeController));

export default router;
