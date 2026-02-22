import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
import { connectdb } from "./config/dbconfig.js";
import { userroute } from "./routes/User.js";
import msgrouter from "./routes/Message.route.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
connectdb();

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 4000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🌐 Middlewares
app.use(cors({
  origin: "https://chat-app-37ky.onrender.com/",
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📦 Static frontend
app.use(express.static(path.join(__dirname, "../../client/dist")));

// 🔥 Socket.IO with FAST timeout
export const io = new Server(server, {
  cors: { origin: "*" },
  pingTimeout: 5000,
  pingInterval: 2000,
});

// 🧠 Track online users
export const userSocketMap : Record<string,any> = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User Connected:", userId);

  if (userId) {
    userSocketMap[userId.toString()] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User Disconnected:", userId);
    delete userSocketMap[userId?.toString()!];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// 🚏 Routes
app.use("/api/user", userroute);
app.use("/api/message", msgrouter);

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.use(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../../client/dist/index.html"));
});

// 🚀 Start server
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
