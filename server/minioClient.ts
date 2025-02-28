import { Client } from "minio";

// Create a MinIO client instance
const minioClient = new Client({
  endPoint: process.env.MINIO_URL ?? "",
  useSSL: true,
  accessKey: process.env.MINIO_ACCESSKEYID ?? "",
  secretKey: process.env.MINIO_SECRETACCESSKEY ?? "",
});

export default minioClient;
