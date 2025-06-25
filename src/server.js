import express from "express";
import authRoutes from "./routes/authRoutes.js";
import workflowRoutes from "./routes/workflowRoutes.js";
import triggerRouters from "./routes/triggerRoutes.js";
import authMiddleware from "./middleware/authMiddleware.js";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/workflows", authMiddleware, workflowRoutes);
app.use("/api/trigger", authMiddleware, triggerRouters);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on ${PORT}`);
});
