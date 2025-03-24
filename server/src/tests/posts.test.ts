import request from "supertest";
import { initApp } from "../server";
import mongoose from "mongoose";
import postModel from "../models/posts_model";
import userModel, { IUser } from "../models/users_model";
import { Express } from "express";

let app: Express;
let postId = "";

type User = IUser & { token?: string };
const testUser: User = {
  username: "testuser",
  email: "testuser@example.com",
  password: "testpassword",
  profilePicture: "https://example.com/profile.jpg",
};

beforeAll(async () => {
  console.log("beforeAll");
  const { app: initializedApp } = await initApp();
  app = initializedApp;

  await postModel.deleteMany();
  await userModel.deleteMany();

  await request(app).post("/auth/register").send(testUser);
  const response = await request(app).post("/auth/login").send(testUser);
  expect(response.statusCode).toBe(200);

  const accessToken = response.body.accessToken;
  testUser.token = accessToken;
  testUser._id = response.body._id;

  expect(accessToken).toBeDefined();
});

afterAll((done) => {
  console.log("afterAll");
  mongoose.connection.close();
  done();
});

describe("Posts Tests", () => {
  test("Get all posts (Initially empty)", async () => {
    const response = await request(app).get("/posts");
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(0);
  });

  test("Create a post", async () => {
    const response = await request(app)
      .post("/posts")
      .set("Authorization", "JWT " + testUser.token)
      .send({
        title: "Test Post",
        content: "Test Content",
        userId: testUser._id,
        image: "https://example.com/image.jpg"
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe("Test Post");
    expect(response.body.content).toBe("Test Content");
    postId = response.body._id;
  });

  test("Fail to create post with non-existent userId", async () => {
    const response = await request(app)
      .post("/posts")
      .set("Authorization", "JWT " + testUser.token)
      .send({
        title: "Test Post",
        content: "Test Content",
        userId: "nonexistentUserId",
        image: "https://example.com/image.jpg"
      });

    expect(response.statusCode).not.toBe(201);
  });

  test("Get post by ID", async () => {
    const response = await request(app).get(`/posts/${postId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe("Test Post");
    expect(response.body.content).toBe("Test Content");
  });

  test("Get posts by userId", async () => {
    const response = await request(app).get(`/posts/byUser/${testUser._id}`);
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("Update post", async () => {
    const response = await request(app)
      .put(`/posts/${postId}`)
      .set("Authorization", "JWT " + testUser.token)
      .send({
        title: "Updated Post",
        content: "Updated Content",
        userId: testUser._id,
        image: "https://example.com/updated.jpg"
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe("Updated Post");
    expect(response.body.content).toBe("Updated Content");
  });

  test("Like a post", async () => {
    const response = await request(app)
      .post(`/posts/${postId}/like`)
      .set("Authorization", "JWT " + testUser.token)
      .send({ userId: testUser._id });

    expect(response.statusCode).toBe(200);
    expect(response.body.likedBy).toContain(testUser._id);
  });

  test("Fail to like the post twice", async () => {
    const response = await request(app)
      .post(`/posts/${postId}/like`)
      .set("Authorization", "JWT " + testUser.token)
      .send({ userId: testUser._id });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("User already liked this post");
  });

  test("Unlike a post", async () => {
    const response = await request(app)
      .post(`/posts/${postId}/unlike`)
      .set("Authorization", "JWT " + testUser.token)
      .send({ userId: testUser._id });

    expect(response.statusCode).toBe(200);
    expect(response.body.likedBy).not.toContain(testUser._id);
  });

  test("Fail to unlike a post that was not liked", async () => {
    const response = await request(app)
      .post(`/posts/${postId}/unlike`)
      .set("Authorization", "JWT " + testUser.token)
      .send({ userId: testUser._id });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("User has not liked this post");
  });

  test("Delete post", async () => {
    const response = await request(app)
      .delete(`/posts/${postId}`)
      .set("Authorization", "JWT " + testUser.token);
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("deleted");

    const response2 = await request(app).get(`/posts/${postId}`);
    expect(response2.statusCode).toBe(404);
  });
});
test("Fail to get a post with invalid ID format", async () => {
  const response = await request(app).get("/posts/invalidID");
  expect(response.statusCode).toBe(400);

  if (response.body && response.body.error) {
    expect(typeof response.body.error).toBe("string");
    expect(response.body.error.toLowerCase()).toContain("invalid");
  }
});

test("Fail to get a non-existent post by ID", async () => {
  const nonExistentId = new mongoose.Types.ObjectId();
  const response = await request(app).get(`/posts/${nonExistentId}`);
  expect(response.statusCode).toBe(404);

  if (response.body && response.body.error) {
    expect(typeof response.body.error).toBe("string");
    expect(response.body.error.toLowerCase()).toContain("not found");
  }
});

test("Fail to get posts with invalid user ID format", async () => {
  const response = await request(app).get("/posts/byUser/invalidUserId");
  expect(response.statusCode).toBe(400);

  if (response.body && response.body.error) {
    expect(typeof response.body.error).toBe("string");
    expect(response.body.error.toLowerCase()).toContain("invalid user id");
  }
});

test("Get posts by non-existent user (empty array)", async () => {
  const nonExistentId = new mongoose.Types.ObjectId();
  const response = await request(app).get(`/posts/byUser/${nonExistentId}`);
  expect(response.statusCode).toBe(404);

  if (response.body && response.body.error) {
    expect(typeof response.body.error).toBe("string");
    expect(response.body.error.toLowerCase()).toContain("no posts found");
  }
});

test("Fail to update a non-existent post", async () => {
  const nonExistentId = new mongoose.Types.ObjectId();
  const response = await request(app)
    .put(`/posts/${nonExistentId}`)
    .set("Authorization", "JWT " + testUser.token)
    .send({
      title: "Updated",
      content: "Updated",
      userId: testUser._id,
      image: "https://example.com/image.jpg",
    });

  expect(response.statusCode).toBe(404);

  if (response.body && response.body.error) {
    expect(typeof response.body.error).toBe("string");
    expect(response.body.error.toLowerCase()).toContain("not found");
  }
});

test("Fail to delete a non-existent post", async () => {
  const nonExistentId = new mongoose.Types.ObjectId();
  const response = await request(app)
    .delete(`/posts/${nonExistentId}`)
    .set("Authorization", "JWT " + testUser.token);

  expect(response.statusCode).toBe(404);

  if (response.body && response.body.error) {
    expect(typeof response.body.error).toBe("string");
    expect(response.body.error.toLowerCase()).toContain("not found");
  }
});

test("Fail to like post without userId in body", async () => {
  const response = await request(app)
    .post(`/posts/${postId}/like`)
    .set("Authorization", "JWT " + testUser.token)
    .send({});

  expect([400, 404]).toContain(response.statusCode);

  if (response.body && response.body.error) {
    expect(typeof response.body.error).toBe("string");
  }
});

test("Fail to unlike post without userId in body", async () => {
  const response = await request(app)
    .post(`/posts/${postId}/unlike`)
    .set("Authorization", "JWT " + testUser.token)
    .send({});

  expect([400, 404]).toContain(response.statusCode);

  if (response.body && response.body.error) {
    expect(typeof response.body.error).toBe("string");
  }
});

test("Fail to create post without token", async () => {
  const response = await request(app)
    .post("/posts")
    .send({
      title: "Unauthorized Post",
      content: "Oops",
      userId: testUser._id,
      image: "https://example.com/image.jpg"
    });

  expect(response.statusCode).toBe(401);
});

test("Fail to update post without token", async () => {
  const response = await request(app)
    .put(`/posts/${postId}`)
    .send({
      title: "Unauthorized Update",
      content: "Oops",
      userId: testUser._id,
      image: "https://example.com/image.jpg"
    });

  expect(response.statusCode).toBe(401);
});
test("Fail to create post with missing title", async () => {
  const response = await request(app)
    .post("/posts")
    .set("Authorization", "JWT " + testUser.token)
    .send({
      content: "Missing title",
      userId: testUser._id,
      image: "https://example.com/image.jpg",
    });

  expect(response.statusCode).toBe(400);
  if (response.body?.error) {
    expect(typeof response.body.error).toBe("string");
  }
});

test("Fail to create post with invalid userId format", async () => {
  const response = await request(app)
    .post("/posts")
    .set("Authorization", "JWT " + testUser.token)
    .send({
      title: "Invalid userId",
      content: "Test",
      userId: "invalid-id",
      image: "https://example.com/image.jpg",
    });

  expect(response.statusCode).toBe(400);
  expect(response.body?.error).toBe("Invalid user ID format");
});

test("Like a post with invalid post ID", async () => {
  const response = await request(app)
    .post("/posts/invalid-id/like")
    .set("Authorization", "JWT " + testUser.token)
    .send({ userId: testUser._id });

  expect([400, 500]).toContain(response.statusCode);
  if (response.body?.error) {
    expect(typeof response.body.error).toBe("string");
  }
});

test("Unlike a post with invalid post ID", async () => {
  const response = await request(app)
    .post("/posts/invalid-id/unlike")
    .set("Authorization", "JWT " + testUser.token)
    .send({ userId: testUser._id });

  expect([400, 500]).toContain(response.statusCode);
  if (response.body?.error) {
    expect(typeof response.body.error).toBe("string");
  }
});

test("Update post with missing content field", async () => {
  const createResponse = await request(app)
    .post("/posts")
    .set("Authorization", "JWT " + testUser.token)
    .send({
      title: "Post to Update",
      content: "Original",
      userId: testUser._id,
      image: "https://example.com/image.jpg",
    });

  const response = await request(app)
    .put(`/posts/${createResponse.body._id}`)
    .set("Authorization", "JWT " + testUser.token)
    .send({
      title: "New Title",
      userId: testUser._id,
      image: "https://example.com/image.jpg",
    });
});
