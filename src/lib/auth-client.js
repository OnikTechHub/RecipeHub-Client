import { createAuthClient } from "better-auth/react";

const getBetterAuthBaseURL = () => {
  if (process.env.NEXT_PUBLIC_BETTER_AUTH_URL) {
    return process.env.NEXT_PUBLIC_BETTER_AUTH_URL;
  }
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return process.env.BETTER_AUTH_URL || "http://localhost:3000";
};

export const authClient = createAuthClient({
  /** The base URL of the auth server */
  baseURL: getBetterAuthBaseURL(),

  user: {
    fields: {
      role: "string",
      isPremium: "boolean",
    },
  },
});

export const { signIn, signUp, signOut, useSession } = authClient;