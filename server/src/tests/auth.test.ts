  import request from "supertest";
  import { initApp } from "../server";
  import mongoose from "mongoose";
  import { Express } from "express";
  import userModel, { IUser } from "../models/users_model";

  var app: Express;

  beforeAll(async () => {
    console.log("beforeAll");
    ({ app } = await initApp());
    await userModel.deleteMany();
  });

  afterAll((done) => {
    console.log("afterAll");
    mongoose.connection.close();
    done();
  });

  const baseUrl = "/auth";

  type User = IUser & {
    accessToken?: string;
    refreshToken?: string;
  };

  const testUser: User = {
    username: "test1",
    email: "test@user.com",
    password: "testpassword",
    profilePicture: ""
  };

  describe("Auth Tests", () => {
    test("Auth test register", async () => {
      const response = await request(app)
        .post(baseUrl + "/register")
        .send(testUser);
      expect(response.statusCode).toBe(200);
    });

    test("Auth test register fail registe 2 times", async () => {
      const response = await request(app)
        .post(baseUrl + "/register")
        .send(testUser);
      expect(response.statusCode).not.toBe(200);
    });

    test("Auth test register fail", async () => {
      const response = await request(app)
        .post(baseUrl + "/register")
        .send({
          email: "lalala",
        });
      expect(response.statusCode).not.toBe(200);
      const response2 = await request(app)
        .post(baseUrl + "/register")
        .send({
          email: "",
          password: "lalala",
        });
      expect(response2.statusCode).not.toBe(200);
    });

    test("Auth test login get token chek", async () => {
      const response = await request(app)
        .post(baseUrl + "/login")
        .send(testUser);
      expect(response.statusCode).toBe(200);
      const accessToken = response.body.accessToken;
      const refreshToken = response.body.refreshToken;
      expect(accessToken).toBeDefined();
      expect(refreshToken).toBeDefined();
      expect(response.body._id).toBeDefined();
      testUser.accessToken = accessToken;
      testUser.refreshToken = refreshToken;
      testUser._id = response.body._id;
    });

    test("Check access and refresh token  are not the same", async () => {
      const response = await request(app)
        .post(baseUrl + "/login")
        .send(testUser);
      const accessToken = response.body.accessToken;
      const refreshToken = response.body.refreshToken;

      expect(accessToken).not.toBe(testUser.accessToken);
      expect(refreshToken).not.toBe(testUser.refreshToken);
    });

    test("Auth test login fail", async () => {
      const response = await request(app)
        .post(baseUrl + "/login")
        .send({
          email: testUser.email,
          password: "elelel",
          username: testUser.username,
          posts: [],
        });
      expect(response.statusCode).not.toBe(200);

      const response2 = await request(app)
        .post(baseUrl + "/login")
        .send({
          username: "test2",
          posts: [],
          email: "dsfasd",
          password: "sdfsd",
        });
      expect(response2.statusCode).not.toBe(200);
    });

    // test("Auth test me", async () => {
    //   const response = await request(app).post("/posts").send({
    //     title: "Test Post",
    //     content: "Test Content",
    //     owner: "sdfSd",
    //   });

    //   expect(response.statusCode).not.toBe(201);
    //   const response2 = await request(app)
    //     .post("/posts")
    //     .set({ authorization: "JWT " + testUser.accessToken })
    //     .send({
    //       title: "Test Post",
    //       content: "Test Content",
    //       owner: testUser.username,
    //     });
    //   expect(response2.statusCode).toBe(201);
    // });

    test("Test refresh token", async () => {
      const response = await request(app)
        .post(baseUrl + "/refresh")
        .send({
          refreshToken: testUser.refreshToken,
        });
      expect(response.statusCode).toBe(200);
      expect(response.body.accessToken).toBeDefined();
      expect(response.body.refreshToken).toBeDefined();
      testUser.accessToken = response.body.accessToken;
      testUser.refreshToken = response.body.refreshToken;
    });
  });
  test("Fail to register with missing or empty fields", async () => {
    const cases = [
      { email: "", username: "", password: "" },
      { email: "", username: "user", password: "pass" },
      { email: "user@example.com", username: "", password: "pass" },
      { email: "user@example.com", username: "user", password: "" }
    ];
  
    for (const data of cases) {
      const res = await request(app).post(baseUrl + "/register").send(data);
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("Missing required fields");
    }
  });
  test("Fail to login with missing username or password", async () => {
    const res1 = await request(app).post(baseUrl + "/login").send({ username: testUser.username });
    expect(res1.statusCode).toBe(400);
  
    const res2 = await request(app).post(baseUrl + "/login").send({ password: testUser.password });
    expect(res2.statusCode).toBe(400);
  
    const res3 = await request(app).post(baseUrl + "/login").send({});
    expect(res3.statusCode).toBe(400);
  });
  test("Fail to refresh without token", async () => {
    const response = await request(app).post(baseUrl + "/refresh").send({});
    expect(response.statusCode).toBe(400);
  });
  test("Fail to logout with invalid refresh token", async () => {
    const response = await request(app).post(baseUrl + "/logout").send({
      refreshToken: "invalid.token.string"
    });
    expect(response.statusCode).toBe(400);
  });
  test("Fail to refresh with invalid refresh token", async () => {
    const response = await request(app).post(baseUrl + "/refresh").send({
      refreshToken: "invalid.token.string"
    });
    expect(response.statusCode).toBe(400);
  });
  test("Auth middleware blocks no-token request", async () => {
    const res = await request(app).post("/posts").send({
      title: "test",
      content: "test",
      owner: "someone"
    });
  
    expect(res.statusCode).toBe(401);
    expect(res.text).toBe("Access Denied");
  });
  test("Auth middleware blocks invalid token", async () => {
    const res = await request(app)
      .post("/posts")
      .set({ Authorization: "JWT invalid.token.value" })
      .send({
        title: "test",
        content: "test",
        owner: "someone"
      });
  
    expect(res.statusCode).toBe(401);
    expect(res.text).toBe("Access Denied");
  });
  test("Fail to login if TOKEN_SECRET is not defined", async () => {
    const originalSecret = process.env.TOKEN_SECRET;
    delete process.env.TOKEN_SECRET;
  
    const res = await request(app).post(baseUrl + "/login").send({
      username: testUser.username,
      password: testUser.password
    });
  
    expect(res.statusCode).toBe(500);
    expect(res.text).toBe("Server Error");
  
    process.env.TOKEN_SECRET = originalSecret;
  });
        
  test("Fail to logout with no refresh token", async () => {
    const response = await request(app)
      .post(baseUrl + "/logout")
      .send({});
  
    expect(response.statusCode).toBe(400);
    expect(response.text).toBe("fail");
  });
  test("Fail to refresh with token of deleted user", async () => {
    const loginRes = await request(app).post(baseUrl + "/login").send(testUser);
    const userId = loginRes.body._id;
    const refreshToken = loginRes.body.refreshToken;
  
    // delete user
    await userModel.findByIdAndDelete(userId);
  
    const response = await request(app)
      .post(baseUrl + "/refresh")
      .send({ refreshToken });
  
    expect(response.statusCode).toBe(400);
  });
  