import { createAuthClient } from "better-auth/react";

const getBetterAuthBaseURL = () => {
  if (typeof window !== "undefined") {
    const isLocal =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname.startsWith("192.168.");

    if (isLocal) {
      return (
        process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
        process.env.BETTER_AUTH_URL ||
        "http://localhost:3000"
      );
    }

    if (
      process.env.NEXT_PUBLIC_BETTER_AUTH_URL &&
      !process.env.NEXT_PUBLIC_BETTER_AUTH_URL.includes("localhost") &&
      !process.env.NEXT_PUBLIC_BETTER_AUTH_URL.includes("127.0.0.1")
    ) {
      return process.env.NEXT_PUBLIC_BETTER_AUTH_URL;
    }

    return window.location.origin;
  }

  if (
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL &&
    !process.env.NEXT_PUBLIC_BETTER_AUTH_URL.includes("localhost")
  ) {
    return process.env.NEXT_PUBLIC_BETTER_AUTH_URL;
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