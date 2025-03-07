import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import { Express } from "express";
import fs from "fs";
import path from "path";
import { URL } from "url";

var app: Express;

beforeAll(async () => {
  console.log("beforeAll - Setting up test environment");
  app = await initApp();
});

afterAll(async () => {
  console.log("afterAll - Closing database connection");
  await mongoose.connection.close();
});

describe("File Upload Tests", () => {
  test("Upload & Retrieve Image File", async () => {
    const filePath = path.join(__dirname, "test_image.png");

    const uploadResponse = await request(app)
      .post("/file")
      .attach("file", filePath);

    expect(uploadResponse.statusCode).toBe(200);
    expect(uploadResponse.body.url).toBeDefined();

    let fileUrl = uploadResponse.body.url;
    console.log("Generated File URL:", fileUrl);

    try {
      const parsedUrl = new URL(fileUrl);
      fileUrl = parsedUrl.pathname;
    } catch (error) {
      console.error("URL Parsing Error:", error);
    }

    console.log("Formatted File URL for Test:", fileUrl);

    const fileResponse = await request(app).get(fileUrl);
    expect(fileResponse.statusCode).toBe(200);
  });

  test("Reject Non-Image File Upload", async () => {
    const filePath = path.join(__dirname, "test_file.txt");

    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, "This is a test text file.");
    }

    const uploadResponse = await request(app)
      .post("/file")
      .attach("file", filePath);

    expect(uploadResponse.statusCode).toBe(400);
    expect(uploadResponse.body.error).toBe("Only images (jpeg, png, gif, webp) are allowed.");
  });
});
