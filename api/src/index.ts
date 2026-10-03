import "dotenv/config";
import express from "express";
import cors from "cors";
import { prisma } from "./lib/prisma.js";
import { authRouter } from "./auth/routes.js";

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/health/db", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok", database: "connected" });
  } catch {
    res.status(500).json({ status: "error", database: "disconnected" });
  }
});

app.use("/auth", authRouter);

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
