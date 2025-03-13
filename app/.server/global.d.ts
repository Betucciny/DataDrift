import { PrismaClient } from "@prisma/client";

declare global {
  namespace NodeJS {
    interface Global {
      prisma: PrismaClient | undefined;
      transporter: nodemailer.Transporter | undefined;
    }
  }
}
