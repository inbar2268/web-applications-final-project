import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import postModel from "../models/posts_model";
import { Express } from "express";
import userModel, { IUser } from "../models/users_model";

var app: Express;

type User = IUser & { token?: string };
const testUser: User = {
  username: "testuser",
  email: "testuser@example.com",
  password: "testpassword",
  profilePicture: "https://example.com/profile.jpg",
};

beforeAll(async () => {
  console.log("beforeAll");
  app = await initApp();
  await postModel.deleteMany();
  await userModel.deleteMany();
  await request(app).post("/auth/register").send(testUser);
  const response = await request(app).post("/auth/login").send(testUser);
  expect(response.statusCode).toBe(200);
  const accessToken = response.body.accessToken;
  testUser.token = accessToken;
  expect(accessToken).toBeDefined();
});

afterAll((done) => {
  console.log("afterAll");
  mongoose.connection.close();
  done();
});

let postId = "";

describe("Posts Tests", () => {
  test("Get all posts (Initially empty)", async () => {
    const response = await request(app).get("/posts");
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(0);
  });

  test("Create a post", async () => {
    const response = await request(app)
      .post("/posts")
      .set({ authorization: "JWT " + testUser.token })
      .send({
        title: "Test Post",
        content: "Test Content",
        owner: "testuser",
      });
    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe("Test Post");
    expect(response.body.content).toBe("Test Content");
    postId = response.body._id;
  });

  test("Fail to create post with non-existent owner", async () => {
    const response = await request(app)
      .post("/posts")
      .set({ authorization: "JWT " + testUser.token })
      .send({
        title: "Test Post",
        content: testUser.username,
        owner: "nonexistentuser",
      });
    expect(response.statusCode).not.toBe(201);
  });

  test("Get post by ID", async () => {
    const response = await request(app).get(`/posts/${postId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe("Test Post");
    expect(response.body.content).toBe("Test Content");
  });

  test("Get posts by owner", async () => {
    const response = await request(app).get(`/posts/byOwner/${testUser.username}`);
    expect(response.statusCode).toBe(200);
  });

  test("Update post", async () => {
    const response = await request(app)
      .put(`/posts/${postId}`)
      .set({ authorization: "JWT " + testUser.token })
      .send({
        title: "Updated Post",
        content: "Updated Content",
        owner: "testuser",
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe("Updated Post");
    expect(response.body.content).toBe("Updated Content");
  });

  
  test("Like a post", async () => {
    const response = await request(app)
      .post(`/posts/${postId}/like`)
      .set({ authorization: "JWT " + testUser.token })
      .send({ username: testUser.username });

    expect(response.statusCode).toBe(200);
    expect(response.body.likedBy).toContain(testUser.username);
  });

  
  test("Fail to like the post twice", async () => {
    const response = await request(app)
      .post(`/posts/${postId}/like`)
      .set({ authorization: "JWT " + testUser.token })
      .send({ username: testUser.username });

    expect(response.statusCode).toBe(400); // Already liked
    expect(response.body.error).toBe("User already liked this post");
  });

 
  test(" Unlike a post", async () => {
    const response = await request(app)
      .delete(`/posts/${postId}/like`)
      .set({ authorization: "JWT " + testUser.token })
      .send({ username: testUser.username });

    expect(response.statusCode).toBe(200);
    expect(response.body.likedBy).not.toContain(testUser.username);
  });

  
  test("Fail to unlike a post that was not liked", async () => {
    const response = await request(app)
      .delete(`/posts/${postId}/like`)
      .set({ authorization: "JWT " + testUser.token })
      .send({ username: testUser.username });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("User has not liked this post");
  });

  test("Delete post", async () => {
    const response = await request(app)
      .delete(`/posts/${postId}`)
      .set("Authorization", "JWT " + testUser.token);
    expect(response.statusCode).toBe(200);

    const response2 = await request(app).get(`/posts/${postId}`);
    expect(response2.statusCode).toBe(404);
  });
});
