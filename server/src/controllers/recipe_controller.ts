import { Request, Response } from "express";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

class recipeController {
    private openai: OpenAI;

    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }

    async generateRecipe(req: Request, res: Response) {
        try {
            const { dishName } = req.body;

            if (!dishName || dishName.trim() === "") {
                res.status(400).json("Dish name is required");
                return;
            }

            console.log(`Generating recipe for: ${dishName}`);

            const response = await this.openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are a professional chef who provides detailed recipes.",
                    },
                    {
                        role: "user",
                        content: `Generate a detailed recipe for the dish: ${dishName}. Include ingredients, step-by-step instructions, and serving suggestions.`,
                    },
                ],
                max_tokens: 250,
            });

            const generatedRecipe = response.choices[0]?.message?.content?.trim();

            if (!generatedRecipe) {
                res.status(500).json("Failed to generate recipe");
                return;
            }

            console.log("Recipe Generated:", generatedRecipe);

            res.status(200).send(generatedRecipe);
        } catch (error) {
            console.error("Error generating recipe:", error);
            res.status(500).json("Server error");
        }
    }
}

export default new recipeController();
