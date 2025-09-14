import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./lib/db.js";
import { app, io, server } from "./lib/socket.js";
import path from "path";
import fs from "fs";

dotenv.config();
const PORT = process.env.PORT;

const __dirname = path.resolve();

// Increase payload size limits for file uploads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// If a frontend build exists, serve it from the backend so one host can serve both API and client.
const distPath = path.join(__dirname, "../frontend/dist");
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));

  // Handle client-side routing - serve index.html for all non-API routes
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

const listenPort = process.env.PORT || 5001;
server.listen(listenPort, () => {
  console.log("server is running on port:" + listenPort);
  connectDB();
});
