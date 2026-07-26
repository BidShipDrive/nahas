import { SignJWT, jwtVerify } from "jose";

const secretKey = new TextEncoder().encode(
  process.env.SESSION_SECRET ?? "insecure-dev-secret-change-me"
);

const SESSION_COOKIE = "admin_session";
const SESSION_DURATION_HOURS = 12;

export async function createSessionToken() {
  return new SignJWT({ admin: true })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_HOURS}h`)
    .sign(secretKey);
}

export async function verifySessionToken(token: string | undefined) {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload.admin === true;
  } catch {
    return false;
  }
}

export { SESSION_COOKIE };
