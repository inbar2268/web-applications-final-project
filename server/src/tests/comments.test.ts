import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import commentsModel from "../models/comment_model";
import userModel, { IUser } from "../models/users_model";
import { Express } from "express";
import testComments from "./test_comments.json";

var app: Express;
let accessToken = ""; 
let testUserId = ""; 
let commentId = ""; 
const testPostId = "safgsefdgsdfgsd"; 

const testUser: IUser = {
  username: "testuser",
  email: "testuser@example.com",
  password: "testpassword",
  profilePicture: "https://example.com/profile.jpg",
};

beforeAll(async () => {
  console.log("beforeAll - Setting up test environment");
  app = await initApp();
  await commentsModel.deleteMany(); 
  await userModel.deleteMany(); 

  await request(app).post("/auth/register").send(testUser);
  const loginRes = await request(app).post("/auth/login").send({
      email: testUser.email,
      password: testUser.password,
      username: testUser.username,
  });

  expect(loginRes.statusCode).toBe(200);
  expect(loginRes.body.accessToken).toBeDefined();
  expect(loginRes.body._id).toBeDefined();

  accessToken = loginRes.body.accessToken; 
  testUserId = loginRes.body._id; 
});

afterAll(async () => {
  console.log("afterAll - Closing database connection");
  await mongoose.connection.close();
});

describe("Comments Tests", () => {
  test("Get all comments (Initially empty)", async () => {
    const response = await request(app).get("/comments");
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(0);
  });

  test("Create multiple comments (Authenticated)", async () => {
    for (let comment of testComments) {
      const commentData = { ...comment, owner: testUserId };
      const response = await request(app)
        .post("/comments")
        .set({ authorization: `JWT ${accessToken}` }) 
        .send(commentData);

      expect(response.statusCode).toBe(201);
      expect(response.body.comment).toBe(comment.comment);
      expect(response.body.postId).toBe(comment.postId);
      expect(response.body.owner).toBe(testUserId);
      commentId = response.body._id; 
    }
  });

  test("Get all comments by post ID", async () => {
    const response = await request(app).get(`/comments/post/${testPostId}`);
    
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(3); 

    response.body.forEach((comment: any) => {
      expect(comment.postId).toBe(testPostId);
    });
  });

  test("Get comments by owner", async () => {
    const response = await request(app).get(`/comments?owner=${testUserId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(3);
    response.body.forEach((comment: any) => {
      expect(comment.owner).toBe(testUserId);
    });
  });

  test("Get comment by ID", async () => {
    const response = await request(app).get(`/comments/${commentId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.postId).toBe(testPostId);
    expect(response.body.owner).toBe(testUserId);
  });

  test("Delete comment (Authenticated)", async () => {
    const response = await request(app)
      .delete(`/comments/${commentId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(200);

    const response2 = await request(app).get(`/comments/${commentId}`);
    expect(response2.statusCode).toBe(404);
  });
});
