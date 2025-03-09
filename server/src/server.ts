import express, { Express } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import { createServer, Server } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import authRoute from "./routes/auth_route";
import userRoute from "./routes/user_route";
import postRoute from "./routes/posts_route";
import commentsRoute from "./routes/comments_route";
import fileRoute from "./routes/file_route";
import chatRoute from "./routes/chat_route";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

dotenv.config();

const app = express();
const server: Server = createServer(app);
const io = new SocketIOServer(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

const connectedUsers = new Map<string, string>();

io.on("connection", (socket: Socket) => {
  console.log(`WebSocket Connected: ${socket.id}`);

  socket.on("userConnected", (userId: string) => {
    connectedUsers.set(userId, socket.id);
    console.log(`User ${userId} is now online`);
  });

  socket.on("disconnect", () => {
    connectedUsers.forEach((socketId, userId) => {
      if (socketId === socket.id) {
        connectedUsers.delete(userId);
        console.log(`User ${userId} disconnected`);
      }
    });
  });
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  if (req.headers.upgrade?.toLowerCase() === "websocket") {
    console.log("WebSocket request detected, skipping middleware");
    return next();
  }
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*");
  next();
});

app.use("/auth", authRoute);
app.use("/users", userRoute);
app.use("/posts", postRoute);
app.use("/comments", commentsRoute);
app.use("/file", fileRoute);
app.use("/chats", chatRoute);
app.use("/public", express.static("public"));
app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 5000;
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Web Application",
      version: "1.0.0",
      description: "REST server including authentication using JWT",
    },
    servers: [{ url: `http://localhost:${PORT}` }],
  },
  apis: ["./src/routes/*.ts"],
};
const specs = swaggerJsDoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

const initApp = () => {
  return new Promise<{ app: Express; server: Server }>((resolve, reject) => {
    if (!process.env.DB_CONNECT) {
      reject("❌ DB_CONNECT is not defined in .env file");
    } else {
      mongoose
        .connect(process.env.DB_CONNECT as string)
        .then(() => {
          console.log("Connected to MongoDB");
          resolve({ app, server });
        })
        .catch((error) => {
          reject(error);
        });
    }
  });
};

export { initApp, io, connectedUsers };
