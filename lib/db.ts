import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient(); //globalThis.prisma || this is written to avoid new instances of prisma client, everytime we make changes in outr project.

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
