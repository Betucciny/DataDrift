import type {
  ProductApi,
  ProductComplete,
  ProductsRecommendationResponse,
  ProductsCompleteSearchResponse,
  ProductsSearchResponse,
} from "~/types";
import { prisma } from "./db";
import type { Product } from "@prisma/client";

export async function getProductsFromRecommendation(
  clientId: string,
  limit: number = 10,
  offset: number = 0
) {
  const baseUrl = new URL(
    process.env.RECOMMENDATIONS_SERVER ?? "http://localhost:3000"
  );
  const realLimit = limit + offset;
  baseUrl.pathname = `/recommend/${clientId}/${realLimit}`;
  const response = await fetch(baseUrl.toString());
  const data: ProductsRecommendationResponse = await response.json();
  const products = data.products.slice(offset, realLimit);
  return { clients: data.client, products };
}

export async function getProductsSearch(
  searchTerm: string,
  page: number = 1
): Promise<ProductsSearchResponse> {
  const baseUrl = new URL(
    process.env.RECOMMENDATIONS_SERVER ?? "http://localhost:3000"
  );
  baseUrl.pathname = "/products";
  baseUrl.searchParams.append("search", searchTerm.toUpperCase());
  baseUrl.searchParams.append("page", page.toString());
  const response = await fetch(baseUrl);
  const data: ProductsSearchResponse = await response.json();
  return data;
}

export async function getProductsComplete(
  products: ProductApi[]
): Promise<ProductComplete[]> {
  const ids = products.map((product) => product.id);
  const productsDb = await prisma.product.findMany({
    where: {
      sae_id: {
        in: ids,
      },
    },
  });
  const productsComplete = products.map((product) => {
    const productDb = productsDb.find(
      (productDb) => productDb.sae_id === product.id
    );
    const path = productDb?.imageUrl
      ? new URL(`https://${process.env.MINIO_URL ?? ""}`)
      : undefined;
    if (productDb?.imageUrl) {
      path!.pathname = productDb.imageUrl;
    }
    return {
      ...product,
      imageUrl: path?.toString(),
    };
  });
  return productsComplete;
}

export async function updateProductImage(
  sae_id: string,
  imageUrl: string
): Promise<boolean> {
  try {
    await prisma.product.create({
      data: {
        sae_id,
        imageUrl,
      },
    });
    return true;
  } catch {
    return false;
  }
}

export async function deleteProductImage(
  sae_id: string
): Promise<Product | undefined> {
  try {
    return await prisma.product.delete({
      where: {
        sae_id,
      },
    });
  } catch {
    return undefined;
  }
}
