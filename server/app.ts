import "react-router";
import { createRequestHandler } from "@react-router/express";
import express from "express";
import multer from "multer";
import minioClient from "./minioClient";
import { deleteProductImage, updateProductImage } from "~/.server/products";
import { deleteLogo, uploadLogo } from "~/.server/settings";
import { prisma } from "~/.server/db";

declare module "react-router" {
  interface AppLoadContext {
    VALUE_FROM_EXPRESS: string;
  }
}

export const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Example API route
app.delete("/api/products/delete-image/:sae_id", async function (req, res) {
  const { sae_id } = req.params;
  if (!sae_id) {
    res.status(400).send("Missing sae_id.");
    return;
  }
  const bucketName = process.env.MINIO_BUCKET_NAME ?? "";
  try {
    const product = await deleteProductImage(sae_id);
    if (!product) {
      res.status(500).send("Error deleting image.");
      return;
    }
    const imageUrl = product?.imageUrl;
    if (!imageUrl) {
      res.status(500).send("Error deleting image.");
      return;
    }
    const objectName = imageUrl.replace(`/${bucketName}/`, "");
    await minioClient.removeObject(bucketName, objectName);
    res.status(200).send("Image deleted successfully.");
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).send("Error deleting image.");
  }
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// API route to handle image upload
app.post(
  "/api/products/upload-image",
  upload.single("image"),
  async function (req, res) {
    const { file } = req;
    const { sae_id } = req.body;
    if (!file || !sae_id) {
      res.status(400).send("No file uploaded.");
      return;
    }
    const bucketName = process.env.MINIO_BUCKET_NAME ?? "";
    const objectName = `${Date.now()}-${file.originalname}`;
    try {
      await minioClient.putObject(
        bucketName,
        objectName,
        file.buffer,
        file.size,
        {
          "Content-Type": file.mimetype,
        }
      );
      const imageUrl = `/${bucketName}/${objectName}`;
      await updateProductImage(sae_id, imageUrl);
      const path = new URL(`https://${process.env.MINIO_URL_PUBLIC ?? ""}`);
      path.pathname = imageUrl;
      res.json({ path: path.toString() });
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).send("Error uploading image.");
    }
  }
);

// API route to handle logo upload
app.post("/api/upload-logo", upload.single("logo"), async function (req, res) {
  const { file } = req;
  if (!file) {
    res.status(400).send("No file uploaded.");
    return;
  }
  const bucketName = process.env.MINIO_BUCKET_NAME ?? "";
  const objectName = `logo-${Date.now()}-${file.originalname}`;
  try {
    await minioClient.putObject(
      bucketName,
      objectName,
      file.buffer,
      file.size,
      {
        "Content-Type": file.mimetype,
      }
    );
    const logoUrl = `/${bucketName}/${objectName}`;
    const logo = await uploadLogo(logoUrl);
    const path = new URL(`https://${process.env.MINIO_URL_PUBLIC ?? ""}`);
    path.pathname = logoUrl;
    res.json({
      logo: {
        id: logo.id,
        imageUrl: path,
        preferred: logo.preferred,
      },
    });
  } catch (error) {
    console.error("Error uploading logo:", error);
    res.status(500).send("Error uploading logo.");
  }
});

// API route to handle logo deletion
app.delete("/api/delete-logo/:id", async function (req, res) {
  const { id } = req.params;
  if (!id) {
    res.status(400).send("Missing sae_id.");
    return;
  }
  const bucketName = process.env.MINIO_BUCKET_NAME ?? "";
  try {
    const logo = await deleteLogo(id); // Assuming you have a similar function for deleting logo URL
    if (!logo) {
      res.status(500).send("Error deleting logo.");
      return;
    }
    const logoUrl = logo?.imageUrl;
    if (!logoUrl) {
      res.status(500).send("Error deleting logo.");
      return;
    }
    const objectName = logoUrl.replace(`/${bucketName}/`, "");
    await minioClient.removeObject(bucketName, objectName);
    res.status(200).send("Logo deleted successfully.");
  } catch (error) {
    console.error("Error deleting logo:", error);
    res.status(500).send("Error deleting logo.");
  }
});

app.post("/api/slm/prompt", async function (req, res) {
  const { product } = req.body;
  const slmServer = process.env.SLM_SERVER;
  const prompt = await prisma.prompt.findFirst({
    where: {
      preferred: true,
    },
  });
  if (!product || !prompt || !slmServer) {
    res.status(400).send("Missing prompt or env variable");
    return;
  }

  const finalPrompt = `${prompt.text} para el
    producto: ${product}`;
  console.log(finalPrompt);

  try {
    const url = new URL(slmServer);
    url.pathname = "/generate_text";
    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input_data: finalPrompt }),
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error generating text:", error);
    res.status(500).send("Error generating text.");
  }
});

app.post("/api/slm/intro", async function (req, res) {
  const slmServer = process.env.SLM_SERVER;
  const [infoCompany] = await prisma.companyInfo.findMany();

  if (!slmServer || !infoCompany) {
    res.status(400).send("Missing prompt or env variable");
    return;
  }

  const finalPrompt = `Genera una introduccion breve y concreta para un correo
    de publicidad de ofertas y productos que ofrece la empresa: ${infoCompany.information}}`;
  console.log(finalPrompt);

  try {
    const url = new URL(slmServer);
    url.pathname = "/generate_text";
    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input_data: finalPrompt }),
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error generating text:", error);
    res.status(500).send("Error generating text.");
  }
});

// React Router request handler
app.use(
  createRequestHandler({
    // @ts-expect-error - virtual module provided by React Router at build time
    build: () => import("virtual:react-router/server-build"),
    getLoadContext() {
      return {
        VALUE_FROM_EXPRESS: "Hello from Express",
      };
    },
  })
);
