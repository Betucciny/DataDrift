import type { ResponseMetadata } from "~/types";
import { prisma } from "./db";

export async function uploadLogo(url: string) {
  const logosCount = await prisma.logo.count();
  const preferred = logosCount === 0;
  return await prisma.logo.create({
    data: {
      imageUrl: url,
      preferred: preferred,
    },
  });
}

export async function getLogos() {
  const minioURL = process.env.MINIO_URL_PUBLIC;
  if (!minioURL) throw new Error("MINIO_URL environment variable is not set");
  const logos = await prisma.logo.findMany();
  return logos.map((logo) => {
    const baseURL = new URL(`https://${minioURL}`);
    baseURL.pathname = logo.imageUrl;
    return {
      ...logo,
      imageUrl: baseURL.toString(),
    };
  });
}

export async function getPreferredLogo() {
  const minioURL = process.env.MINIO_URL_PUBLIC;
  if (!minioURL) throw new Error("MINIO_URL environment variable is not set");
  const baseURL = new URL(`https://${minioURL}`);
  baseURL.pathname =
    (
      await prisma.logo.findFirst({
        where: {
          preferred: true,
        },
      })
    )?.imageUrl || "";
  return baseURL.toString();
}

export async function deleteLogo(id: string) {
  const logoDeleted = await prisma.logo.delete({
    where: {
      id,
    },
  });
  const remainingLogos = await prisma.logo.findMany();
  if (logoDeleted.preferred && remainingLogos.length > 0) {
    await prisma.logo.update({
      where: { id: remainingLogos[0].id },
      data: { preferred: true },
    });
  }

  return logoDeleted;
}

export async function setFavoriteLogo(id: string) {
  await prisma.logo.updateMany({
    data: {
      preferred: false,
    },
  });

  await prisma.logo.updateMany({
    where: {
      id,
    },
    data: {
      preferred: true,
    },
  });
}

export async function getPrompts() {
  return await prisma.prompt.findMany();
}

export async function createPrompt(prompt: string) {
  const promptsCount = await prisma.prompt.count();
  const preferred = promptsCount === 0;
  return await prisma.prompt.create({
    data: {
      text: prompt,
      preferred: preferred,
    },
  });
}

export async function editPrompt(id: string, prompt: string) {
  return await prisma.prompt.update({
    where: {
      id,
    },
    data: {
      text: prompt,
    },
  });
}

export async function deletePrompt(id: string) {
  const promptDeleted = await prisma.prompt.delete({
    where: {
      id,
    },
  });
  const remainingPrompts = await prisma.prompt.findMany();
  if (promptDeleted.preferred && remainingPrompts.length > 0) {
    await prisma.prompt.update({
      where: { id: remainingPrompts[0].id },
      data: { preferred: true },
    });
  }

  return promptDeleted;
}

export async function selectPreferredPrompt(id: string) {
  await prisma.prompt.updateMany({
    data: {
      preferred: false,
    },
  });

  await prisma.prompt.update({
    where: {
      id,
    },
    data: {
      preferred: true,
    },
  });
}

export async function updateCompanyInfo(information: string) {
  const companyInfo = await prisma.companyInfo.findFirst();
  if (!companyInfo) {
    return await prisma.companyInfo.create({
      data: {
        information,
      },
    });
  } else {
    return await prisma.companyInfo.update({
      where: {
        id: companyInfo.id,
      },
      data: {
        information,
      },
    });
  }
}

export async function getCompanyInfo() {
  const companyInfo = await prisma.companyInfo.findFirst();
  return companyInfo ? companyInfo.information : "";
}

export async function getMetadata() {
  const recommendationsServer = process.env.RECOMMENDATIONS_SERVER;
  if (!recommendationsServer)
    throw new Error("RECOMMENDATIONS_SERVER environment variable is not set");
  const url = new URL(recommendationsServer);
  url.pathname = "/metadata";
  const response = await fetch(url);
  const data: ResponseMetadata = await response.json();
  return data;
}
