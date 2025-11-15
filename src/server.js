import express from "express";
import listRoutes from "./routes/listRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();
app.use(express.json());

app.use("/list", listRoutes);
app.use("/item", itemRoutes);
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Backend running" });
});

const PORT = 3001;
app.listen(PORT, () => 
  console.log(`Server running on http://localhost:${PORT}`));