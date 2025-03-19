import { Client } from "minio";

// Create a MinIO client instance
const minioClient = new Client({
  endPoint: process.env.MINIO_URL ?? "",
  useSSL: false,
  port: parseInt(process.env.MINIO_PORT ?? "3000"),
  accessKey: process.env.MINIO_ACCESSKEYID ?? "",
  secretKey: process.env.MINIO_SECRETACCESSKEY ?? "",
});

export default minioClient;
