import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  /** The base URL of the server */
  baseURL: process.env.BETTER_AUTH_URL,

  user: {
    fields: {
      role: "string",
      isPremium: "boolean"
    }
  }
});

export const { signIn, signUp, signOut, useSession } = authClient;