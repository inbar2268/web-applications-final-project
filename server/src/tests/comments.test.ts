import request from "supertest";
import { initApp } from "../server";
import mongoose from "mongoose";
import commentsModel from "../models/comment_model";
import userModel, { IUser } from "../models/users_model";
import { Express } from "express";
import fs from "fs";

var app: Express;
let accessToken = ""; 
let testUserId = ""; 
let commentId = ""; 
const testPostId = "728570e81c764287aead75e9"; 

const testUser: IUser = {
  username: "testuser",
  email: "testuser@example.com",
  password: "testpassword",
  profilePicture: "https://example.com/profile.jpg",
};

const testComments = JSON.parse(fs.readFileSync("./src/tests/test_comments.json", "utf-8"));

beforeAll(async () => {
  console.log("beforeAll - Setting up test environment");
  const { app: initializedApp } = await initApp();
  app = initializedApp;
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

  testComments.forEach((comment: any) => comment.userId = testUserId);
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
      const response = await request(app)
        .post("/comments")
        .set({ authorization: `JWT ${accessToken}` }) 
        .send(comment);

      expect(response.statusCode).toBe(201);
      expect(response.body.comment).toBe(comment.comment);
      expect(response.body.postId).toBe(comment.postId);
      expect(response.body.userId).toBe(testUserId);
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

  test("Get comments by user ID", async () => {
    const response = await request(app).get(`/comments?userId=${testUserId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(3);
    response.body.forEach((comment: any) => {
      expect(comment.userId).toBe(testUserId);
    });
  });

  test("Get comment by ID", async () => {
    const response = await request(app).get(`/comments/${commentId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.postId).toBe(testPostId);
    expect(response.body.userId).toBe(testUserId);
  });

  test("Delete comment (Authenticated)", async () => {
    const response = await request(app)
      .delete(`/comments/${commentId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(200);

    const response2 = await request(app).get(`/comments/${commentId}`);
    expect(response2.statusCode).toBe(404);
  });

  test("Fail to create comment without authentication", async () => {
    const response = await request(app)
      .post("/comments")
      .send({
        comment: "Unauthorized comment",
        userId: testUserId,
        postId: testPostId
      });

    expect(response.statusCode).toBe(401);
  });

  test("Fail to delete comment with invalid ID", async () => {
    const invalidId = "invalidcommentid123";
    const response = await request(app)
      .delete(`/comments/${invalidId}`)
      .set({ authorization: `JWT ${accessToken}` }) 

    expect(response.statusCode).toBe(400);
  });
});
test("Fail to get comments by invalid postId format", async () => {
  const response = await request(app).get("/comments/post/invalid-id");
  expect(response.statusCode).toBe(400);
  expect(response.body.error).toBe("Invalid post ID format");
});

test("Fail to get comments for a valid postId with no comments", async () => {
  const emptyPostId = new mongoose.Types.ObjectId().toString();
  const response = await request(app).get(`/comments/post/${emptyPostId}`);
  expect(response.statusCode).toBe(404);
  expect(response.body.error).toBe("No comments found for this post");
});

test("Fail to get comment by invalid ID format", async () => {
  const response = await request(app).get("/comments/invalid-id");
  expect(response.statusCode).toBe(400);
});

test("Fail to get comment by valid non-existing ID", async () => {
  const fakeId = new mongoose.Types.ObjectId().toString();
  const response = await request(app).get(`/comments/${fakeId}`);
  expect(response.statusCode).toBe(404);
});

test("Fail to delete comment that does not exist", async () => {
  const fakeId = new mongoose.Types.ObjectId().toString();
  const response = await request(app)
    .delete(`/comments/${fakeId}`)
    .set("Authorization", `Bearer ${accessToken}`);
  expect(response.statusCode).toBe(404);
});

test("Fail to delete comment without token", async () => {
  const response = await request(app).delete(`/comments/${new mongoose.Types.ObjectId()}`);
  expect(response.statusCode).toBe(401);
});

test("Fail to create comment with missing fields", async () => {
  const response = await request(app)
    .post("/comments")
    .set("Authorization", `Bearer ${accessToken}`)
    .send({ comment: "Missing userId and postId" });

  expect(response.statusCode).toBe(400);
});

test("getByPostId handles server error", async () => {
  const spy = jest
    .spyOn(commentsModel, "find")
    .mockImplementationOnce(() => {
      throw new Error("DB error");
    });

  const response = await request(app).get(`/comments/post/${testPostId}`);
  expect(response.statusCode).toBe(500);
  expect(response.body.error).toBe("Server error");

  spy.mockRestore();
});

test("Create comment handles DB error", async () => {
  const spy = jest
    .spyOn(commentsModel, "create")
    .mockImplementationOnce(() => {
      throw new Error("DB error");
    });

  const response = await request(app)
    .post("/comments")
    .set("Authorization", `Bearer ${accessToken}`)
    .send({
      comment: "DB failure test",
      userId: testUserId,
      postId: testPostId,
    });

  expect(response.statusCode).toBe(400);
  spy.mockRestore();
});

test("Fail to update post when comment is created", async () => {
  const spy = jest
    .spyOn(commentsModel, "findByIdAndUpdate")
    .mockImplementationOnce(() => {
      throw new Error("Post update failure");
    });

  const response = await request(app)
    .post("/comments")
    .set("Authorization", `Bearer ${accessToken}`)
    .send({
      comment: "New comment but post update fails",
      userId: testUserId,
      postId: testPostId,
    });

  expect(response.statusCode).toBe(201);
  expect(response.body.comment).toBe("New comment but post update fails");

  spy.mockRestore();
});

test("deleteItem handles DB error", async () => {
  const fakeId = new mongoose.Types.ObjectId().toString();
  const spy = jest
    .spyOn(commentsModel, "findByIdAndDelete")
    .mockImplementationOnce(() => {
      throw new Error("DB error on delete");
    });

  const response = await request(app)
    .delete(`/comments/${fakeId}`)
    .set("Authorization", `Bearer ${accessToken}`);

  expect(response.statusCode).toBe(400);
  spy.mockRestore();
});
