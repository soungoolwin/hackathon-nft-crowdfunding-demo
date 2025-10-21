import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  globalThis.prisma ||
  new PrismaClient({
    log:
      (typeof process !== "undefined" && process.env.NODE_ENV) === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (typeof process !== "undefined" && process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}
