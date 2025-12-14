import express from "express";
import listRoutes from "./routes/listRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import authRoutes from "./routes/authRoutes.js";

import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

app.use("/list", listRoutes);
app.use("/item", itemRoutes);
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Backend running" });
});

if (process.env.NODE_ENV !== "test") {
  mongoose
    .connect(process.env.MONGO_URI, { dbName: "shopify" })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Mongo connection error:", err));

  const PORT = 3001;
  app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
  );
}

export default app;