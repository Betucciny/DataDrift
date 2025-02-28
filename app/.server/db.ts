import { PrismaClient } from "@prisma/client";

declare const global: typeof globalThis & {
  prisma?: PrismaClient;
};

const prisma: PrismaClient =
  global.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV !== "production" ? [] : [],
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export { prisma };
