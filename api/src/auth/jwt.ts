import jwt from "jsonwebtoken";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return secret;
}

export type AuthTokenPayload = {
  userId: number;
};

export function createAccessToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: "1h",
  });
}

export function verifyAccessToken(token: string): AuthTokenPayload {
  return jwt.verify(token, getJwtSecret()) as unknown as AuthTokenPayload;
}