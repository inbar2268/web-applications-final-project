import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import chatModel from "../models/chat_model";
import userModel, { IUser } from "../models/users_model";
import { Express } from "express";

var app: Express;
let accessToken: string = "";
let testUserId: string = "";
let testUser2Id: string = "";
let chatId: string = "";

const testUser1: IUser = {
  username: "user1",
  email: "user1@example.com",
  password: "password123",
  profilePicture: "https://example.com/user1.jpg",
};

const testUser2: IUser = {
  username: "user2",
  email: "user2@example.com",
  password: "password456",
  profilePicture: "https://example.com/user2.jpg",
};

beforeAll(async () => {
  console.log("beforeAll - Setting up test environment");
  app = await initApp();
  await chatModel.deleteMany();
  await userModel.deleteMany();

  await request(app).post("/auth/register").send(testUser1);
  const loginRes1 = await request(app).post("/auth/login").send({
    email: testUser1.email,
    password: testUser1.password,
    username: testUser1.username,
  });

  expect(loginRes1.statusCode).toBe(200);
  expect(loginRes1.body.accessToken).toBeDefined();
  expect(loginRes1.body._id).toBeDefined();
  accessToken = loginRes1.body.accessToken;
  testUserId = loginRes1.body._id;

  await request(app).post("/auth/register").send(testUser2);
  const loginRes2 = await request(app).post("/auth/login").send({
    email: testUser2.email,
    password: testUser2.password,
    username: testUser2.username,
  });

  expect(loginRes2.statusCode).toBe(200);
  expect(loginRes2.body._id).toBeDefined();
  testUser2Id = loginRes2.body._id;
});

afterAll(async () => {
  console.log("afterAll - Closing database connection");
  await mongoose.connection.close();
});

describe("Chat Controller Tests", () => {
  test("Create a new chat", async () => {
    const response = await request(app)
      .post("/chats")
      .set("Authorization", "JWT " + accessToken)
      .send({ userId1: testUserId, userId2: testUser2Id });

    expect(response.statusCode).toBe(201);
    expect(response.body._id).toBeDefined();
    expect(response.body.participants).toContain(testUserId);
    expect(response.body.participants).toContain(testUser2Id);
    expect(response.body.messages).toEqual([]);

    chatId = response.body._id;
  });

  test("Retrieve existing chat between two users", async () => {
    const response = await request(app)
      .post("/chats")
      .set("Authorization", "JWT " + accessToken)
      .send({ userId1: testUserId, userId2: testUser2Id });

    expect(response.statusCode).toBe(200);
    expect(response.body._id).toBe(chatId);
  });

  test("Fail to create chat without authentication", async () => {
    const response = await request(app)
      .post("/chats")
      .send({ userId1: testUserId, userId2: testUser2Id });

    expect(response.statusCode).toBe(401);
  });

  test("Fail to create chat with invalid userId", async () => {
    const response = await request(app)
      .post("/chats")
      .set("Authorization", "JWT " + accessToken)
      .send({ userId1: testUserId, userId2: "invalidUserId" });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("Invalid participant IDs");
  });

  test("✅ Get all chats of the authenticated user", async () => {
    const response = await request(app)
      .get(`/chats/${testUserId}`)
      .set("Authorization", "JWT " + accessToken);

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]._id).toBeDefined();
    expect(response.body[0].participants).toContain(testUserId);
  });

test("Fail to get chats without authentication", async () => {
    const nonAuthenticatedUserId = new mongoose.Types.ObjectId().toString();
    const response = await request(app).get(`/chats/${nonAuthenticatedUserId}`);
    expect(response.statusCode).toBe(401);
    });
});
