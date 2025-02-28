import "react-router";
import { createRequestHandler } from "@react-router/express";
import express from "express";
import multer from "multer";
import minioClient from "./minioClient";
import { updateProductImage } from "~/.server/products";

declare module "react-router" {
  interface AppLoadContext {
    VALUE_FROM_EXPRESS: string;
  }
}

export const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Example API route
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from Express!" });
});

// Multer setup for file uploads
const upload = multer({ dest: "uploads/" });

app.get("/api/list-buckets", async (req, res) => {
  try {
    const buckets = await minioClient.listBuckets();
    res.json(buckets);
  } catch (error) {
    console.error("Error listing buckets:", error);
    res.status(500).send("Error listing buckets.");
  }
});

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
      console.log("Inside try catch");
      const info = await minioClient.fPutObject(
        bucketName,
        objectName,
        file.path
      );
      console.log("uploaded");
      const imageUrl = `/${bucketName}/${objectName}`;
      await updateProductImage(sae_id, imageUrl);
      console.log("database good");
      const path = new URL(`https://${process.env.MINIO_URL ?? ""}`);
      path.pathname = imageUrl;
      res.json({ path: path.toString() });
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).send("Error uploading image.");
    }
  }
);

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
