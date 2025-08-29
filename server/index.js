import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import symptomRoutes from "./routes/symptomRoutes.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";
import mappingRoutes from "./routes/mappingRoutes.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/symptoms", symptomRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/mapping", mappingRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.json({ message: "✅ MediSync Backend is running" });
});

// Connect to MongoDB and start server
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () =>
      console.log(`🚀 Server running at http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });



