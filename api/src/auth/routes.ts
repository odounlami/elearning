import { Router } from "express";
import { registerSchema, loginSchema } from "./schemas.js";
import { getCurrentUser, loginUser, registerUser } from "./service.js";
import { requireAuth, type AuthenticatedRequest } from "./middleware.js";

export const authRouter = Router();

authRouter.post("/register", async (req, res) => {
  const result = registerSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: "INVALID_INPUT",
      details: result.error.flatten(),
    });
  }

  try {
    const data = await registerUser(
      result.data.name,
      result.data.email,
      result.data.password,
    );

    return res.status(201).json(data);
  } catch (error) {
    if (error instanceof Error && error.message === "EMAIL_ALREADY_EXISTS") {
      return res.status(409).json({
        error: "EMAIL_ALREADY_EXISTS",
      });
    }

    console.error(error);

    return res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
    });
  }
});

authRouter.post("/login", async (req, res) => {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: "INVALID_INPUT",
      details: result.error.flatten(),
    });
  }

  try {
    const data = await loginUser(
      result.data.email,
      result.data.password,
    );

    return res.status(200).json(data);
  } catch (error) {
    if (error instanceof Error && error.message === "INVALID_CREDENTIALS") {
      return res.status(401).json({
        error: "INVALID_CREDENTIALS",
      });
    }

    console.error(error);

    return res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
    });
  }
});

authRouter.get("/me", requireAuth, async (req, res) => {
  const userId = (req as AuthenticatedRequest).userId;
  const user = await getCurrentUser(userId);

  if (!user) {
    return res.status(401).json({ error: "UNAUTHORIZED" });
  }

  return res.json({ user });
});
