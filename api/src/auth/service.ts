import { prisma } from "../lib/prisma.js";
import { hashPassword, comparePassword } from "./password.js";
import { createAccessToken } from "./jwt.js";

export async function registerUser(
  name: string,
  email: string,
  password: string,
) {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
    },
  });

  const accessToken = createAccessToken({
    userId: user.id,
  });

  return {
    accessToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const validPassword = await comparePassword(password, user.passwordHash);

  if (!validPassword) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const accessToken = createAccessToken({
    userId: user.id,
  });

  return {
    accessToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
}

export async function getCurrentUser(userId: number) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });
}
