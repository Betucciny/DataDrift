import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";

declare const global: typeof globalThis & {
  prisma?: PrismaClient;
  transporter?: nodemailer.Transporter;
};

function getEmailConfig() {
  const host = process.env.EMAIL_HOST;
  const port = process.env.EMAIL_PORT;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  if (!host || !port || !user || !pass) {
    throw new Error("Missing email configuration");
  }
  return {
    host,
    port: parseInt(port),
    secure: true,
    auth: {
      user,
      pass,
    },
  };
}

const transporter =
  global.transporter || nodemailer.createTransport(getEmailConfig());

const prisma: PrismaClient =
  global.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV !== "production" ? [] : [],
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
  global.transporter = transporter;
}

export { prisma, transporter };
