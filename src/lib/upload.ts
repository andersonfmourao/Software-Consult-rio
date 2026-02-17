import "server-only";

import { put } from "@vercel/blob";

export async function uploadToCloud(file: File) {
  const blob = await put(`anexos/${Date.now()}-${file.name}`, file, {
    access: "public",
    token: process.env.BLOB_READ_WRITE_TOKEN
  });

  return {
    url: blob.url,
    fileName: file.name,
    mimeType: file.type,
    size: file.size
  };
}
