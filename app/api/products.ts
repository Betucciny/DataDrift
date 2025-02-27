import type {
  ProductApi,
  ProductComplete,
  ProductsRecommendationResponse,
} from "~/types";
import { prisma } from "./db";

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
  console.log("baseUrl", baseUrl.toString());
  const response = await fetch(baseUrl.toString());
  const data: ProductsRecommendationResponse = await response.json();
  const products = data.products.slice(offset, realLimit);
  return { clients: data.client, products };
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
    return {
      ...product,
      imageUrl: productDb?.imageUrl ?? undefined,
    };
  });
  return productsComplete;
}
