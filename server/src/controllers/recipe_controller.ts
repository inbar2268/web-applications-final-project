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
                        content: "You are a chef who provides concise, simplified recipes. Keep your responses brief and to the point.",
                    },
                    {
                        role: "user",
                        content: `Generate a simplified recipe for: ${dishName}. Include only essential ingredients and brief instructions. Keep it under 200 words.`,
                    },
                ],
                max_tokens: 250,
                temperature: 0.7
            });

            const generatedRecipe = response.choices[0]?.message?.content?.trim();

            if (!generatedRecipe) {
                console.error("Error generating recipe:", response);

                res.status(500).json("Failed to generate recipe");
                return;
            }
            res.status(200).send(generatedRecipe);
        } catch (error) {
            console.error("Error generating recipe:", error);
            res.status(500).json("Server error");
        }
    }
}

export default new recipeController();
