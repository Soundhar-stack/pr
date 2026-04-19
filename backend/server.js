/* global process */
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import staffRoutes from "./routes/staffRoutes.js";
import hodRoutes from "./routes/hodRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Logging middleware: print requests and log responses with status >= 400
app.use((req, res, next) => {
  try {
    console.log('REQ:', req.method, req.url, 'BODY:', req.body || {});
  } catch (e) {
    // ignore logging errors
  }
  const start = Date.now();
  res.on('finish', () => {
    if (res.statusCode >= 400) {
      console.log(`RESP ${res.statusCode} ${res.statusMessage} - ${req.method} ${req.url} - ${Date.now() - start}ms`);
      try {
        console.log('REQ BODY AT ERROR:', req.body || {});
      } catch (e) {}
    }
  });
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/hod", hodRoutes);

const PORT = parseInt(process.env.PORT, 10) || 5000;
const HOST = process.env.HOST || "127.0.0.1";

const startServer = (port) => {
  const srv = app.listen(port, HOST, () =>
    console.log(`🚀 Server running on ${HOST}:${port}`)
  );

  srv.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
      console.error(`Port ${port} is in use. Trying ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });
};

startServer(PORT);
