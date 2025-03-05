import { redirect } from "react-router";
import { createCookieSessionStorage } from "react-router";
import { TOTP } from "totp-generator";

function get2FAKey() {
  const secret = process.env.TWO_FA_SECRET;
  if (!secret) {
    throw new Error("2FA secret is not set in the environment variables");
  }
  return secret;
}

export function checkToken(token: string) {
  const { otp } = TOTP.generate(get2FAKey(), { digits: 6 });
  return otp === token;
}

const sessionSecret = process.env.SESSION_SECRET;

const expirationTime = 2 * 60 * 60; // 2 hours in seconds

export const { getSession, commitSession } = createCookieSessionStorage({
  cookie: {
    name: "__session",
    maxAge: expirationTime,
    secrets: [sessionSecret ?? "blah"],
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  },
});

export async function requireAuth(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("authenticated")) {
    throw redirect("/login");
  }
  return session;
}
