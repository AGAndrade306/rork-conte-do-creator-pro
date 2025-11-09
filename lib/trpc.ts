import { createTRPCReact } from "@trpc/react-query";
import { httpLink } from "@trpc/client";
import { Platform } from "react-native";
import Constants from "expo-constants";
import superjson from "superjson";
import type { AppRouter } from "@/backend/trpc/app-router";

export const trpc = createTRPCReact<AppRouter>();

const normalizeUrl = (value: string) => value.replace(/\/+$/, "");

const getHostFromDebugger = () => {
  const debuggerHost =
    Constants.expoGoConfig?.debuggerHost ??
    Constants.expoGoConfig?.hostUri ??
    null;

  if (!debuggerHost) {
    return null;
  }

  const [host] = debuggerHost.split(":");
  return host ?? null;
};

const getBaseUrl = () => {
  const envBase = process.env.EXPO_PUBLIC_RORK_API_BASE_URL;
  if (envBase) {
    return normalizeUrl(envBase);
  }

  if (Platform.OS === "web" && typeof window !== "undefined" && window.location?.origin) {
    return normalizeUrl(window.location.origin);
  }

  const host = getHostFromDebugger();
  if (host) {
    return `http://${host}:3000`;
  }

  if (__DEV__) {
    return "http://127.0.0.1:3000";
  }

  throw new Error("No API base URL found. Set EXPO_PUBLIC_RORK_API_BASE_URL.");
};

export const trpcClient = trpc.createClient({
  transformer: superjson,
  links: [
    httpLink({
      url: `${getBaseUrl()}/api/trpc`,
    }),
  ],
});
