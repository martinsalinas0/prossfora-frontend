// lib/config.ts

// Server-side only variables
export const serverConfig = {
  dbUrl: process.env.DB_URL!,
  jwtSecret: process.env.JWT_SECRET!,
  nodeEnv: process.env.NODE_ENV || "development",
  port: process.env.PORT || "8080",
} as const;

// Client-side accessible variables (warn on client if missing so app can still build)
const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";


if (typeof window === "undefined") {
  if (!process.env.DB_URL) throw new Error("DB_URL is not defined");
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not defined");
  if (!apiUrl) throw new Error("NEXT_PUBLIC_API_URL is not defined");
}
if (typeof window !== "undefined" && !apiUrl) {
  console.warn("NEXT_PUBLIC_API_URL is not defined - API calls will fail");
}




export const clientConfig = {
  apiUrl,
} as const;
