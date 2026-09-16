/**
 * Dynamic API Base URL resolver.
 * Handles both local development and live production deployments automatically.
 */
export const getServerUrl = () => {
  // 1. Explicitly configured server URL in environment variables
  const envUrl =
    process.env.NEXT_PUBLIC_SERVER_URL ||
    process.env.NEXT_PUBLIC_API_URL;

  // If explicitly configured with a non-localhost URL, always respect it
  if (envUrl && envUrl.trim() && !envUrl.includes("localhost") && !envUrl.includes("127.0.0.1")) {
    return envUrl.trim().replace(/\/+$/, "");
  }

  // 2. Client-side runtime detection
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    const isLocal =
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname.startsWith("192.168.");

    if (isLocal) {
      return envUrl && envUrl.trim() ? envUrl.trim().replace(/\/+$/, "") : "http://localhost:5000";
    }

    // Deployed live (e.g. *.vercel.app)
    if (envUrl && envUrl.trim() && !envUrl.includes("localhost") && !envUrl.includes("127.0.0.1")) {
      return envUrl.trim().replace(/\/+$/, "");
    }

    // Default live backend deployment
    return "https://recipe-hub-server.vercel.app";
  }

  // 3. Server-side SSR / build-time fallback
  if (envUrl && envUrl.trim() && !envUrl.includes("localhost") && !envUrl.includes("127.0.0.1")) {
    return envUrl.trim().replace(/\/+$/, "");
  }

  return process.env.NODE_ENV === "production"
    ? "https://recipe-hub-server.vercel.app"
    : "http://localhost:5000";
};

export const SERVER_URL = getServerUrl();
export default SERVER_URL;
