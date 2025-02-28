import PreviewWindow from "~/components/PreviewWindow";
import type { Route } from "./+types/email";
import { render } from "@react-email/components";
import MainEmail from "~/emails/MainEmail";
import DefaultOneProduct from "~/emails/templates/DefaultOneProduct";
import { Form } from "react-router";
import { getClientsSearch } from "~/.server/clients";
import ClientsTableSelection from "~/components/ClientsTableSelection";
import type {
  ClientApi,
  ClientsSearchResponse,
  ProductApi,
  ProductComplete,
  ProductsRecommendationResponse,
  RecommendationProductComplete,
} from "~/types";
import { useEffect, useState } from "react";
import { capitalizeFirstLetterOfEachWord } from "~/utils/strings";
import type { URLSearchParams } from "node:url";
import {
  getProductsComplete,
  getProductsFromRecommendation,
} from "~/.server/products";
import { ProductsArray } from "~/components/products/ProductsArray";
import { useSearchParams } from "react-router";
import FormGetProducts from "~/components/products/FormGetProducts";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  console.log(formData);
  const products = [];
  for (let [key, value] of formData.entries()) {
    const match = key.match(/^product-(\d+)-(name|price|url)$/);
    if (match) {
      const index = parseInt(match[1]);
      const field = match[2];
      if (!products[index]) {
        products[index] = { name: "", price: 0, url: "" };
      }
      if (field === "name") {
        products[index].name = value as string;
      } else if (field === "price") {
        products[index].price = parseFloat(value as string);
      } else if (field === "url") {
        products[index].url = value as string;
      }
    }
  }

  console.log(products);

  const emailHtmlPreview = await render(
    <MainEmail userName="Betucciny">
      <DefaultOneProduct />
    </MainEmail>
  );
  return { emailHtmlPreview };
}

export async function loader({ request }: Route.LoaderArgs) {
  const searchParams = new URL(request.url).searchParams;
  const [dataClients, productsFromRecommendation] = await Promise.all([
    getClients(searchParams),
    getProductsFromRecommendatio(searchParams),
  ]);

  return { dataClients, productsFromRecommendation };
}

async function getProductsFromRecommendatio(
  searchParams: URLSearchParams
): Promise<RecommendationProductComplete | undefined> {
  const client = searchParams.get("client");
  const limit = parseInt(searchParams.get("limit") ?? "10");
  const offset = parseInt(searchParams.get("offset") ?? "0");
  if (!client) return undefined;
  const products = await getProductsFromRecommendation(client, limit, offset);
  const productsComplete = await getProductsComplete(products.products);
  return {
    products: productsComplete,
    client: products.clients,
  };
}

async function getClients(
  searchParams: URLSearchParams
): Promise<ClientsSearchResponse> {
  const searchTerm = searchParams.get("clientSearch") ?? "";
  const clientPage = parseInt(searchParams.get("clientPage") ?? "1");
  return await getClientsSearch(searchTerm, clientPage);
}

export default function Email({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { dataClients, productsFromRecommendation } = loaderData;
  const emailHtmlPreview = actionData?.emailHtmlPreview ?? "";

  const [client, setClient] = useState<ClientApi | null>(null);
  const [showClientSearch, setShowClientSearch] = useState(false);
  const [products, setProducts] = useState<ProductComplete[]>([]);

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    setProducts((prevProducts) => {
      const newProducts = productsFromRecommendation?.products ?? [];
      const existingProductIds = new Set(
        prevProducts.map((product) => product.id)
      );
      const filteredNewProducts = newProducts.filter(
        (product) => !existingProductIds.has(product.id)
      );
      return [...prevProducts, ...filteredNewProducts];
    });
  }, [productsFromRecommendation]);

  useEffect(() => {
    setSearchParams((prev) => {
      prev.delete("client");
      prev.delete("limit");
      prev.delete("offset");
      return prev;
    });
    setProducts([]);
  }, [client]);

  return (
    <div className="flex flex-col flex-1 lg:mr-[30vw] mr-0">
      <div className="flex-1 overflow-y-scroll m-3">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Crear Email</h1>
          <div className="mb-4 rounded-md bg-base-200 p-4 flex flex-col relative">
            <ClientsTableSelection
              shown={showClientSearch}
              setShown={setShowClientSearch}
              selectedClient={client}
              clients={dataClients.clients}
              setClient={setClient}
              currentPage={dataClients.current_page}
              totalPages={dataClients.total_pages}
            />
            <div className="flex flex-col md:flex-row justify-between items-center bg-se">
              <label className="block text-lg font-semibold text-content mb-4 md:mb-0">
                Cliente Seleccionado:{" "}
                {capitalizeFirstLetterOfEachWord(client?.name ?? "Ninguno")}
              </label>
              <button
                className="btn btn-primary"
                onClick={() => setShowClientSearch(true)}
              >
                Seleccionar Cliente
              </button>
            </div>
          </div>
          <div className="flex flex-row justify-between space-x-2">
            <FormGetProducts client={client} setProducts={setProducts} />
            {/* <FormGetProducts client={client} /> */}
          </div>
          {products && (
            <ProductsArray products={products} setProducts={setProducts} />
          )}
        </div>
      </div>

      <PreviewWindow emailHtmlPreview={emailHtmlPreview} />
    </div>
  );
}
