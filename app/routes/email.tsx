import PreviewWindow from "~/components/PreviewWindow";
import type { Route } from "./+types/email";
import { render } from "@react-email/components";
import MainEmail from "~/emails/MainEmail";
import { getClientsSearch } from "~/.server/clients";
import ClientsTableSelection from "~/components/ClientsTableSelection";
import type {
  ClientApi,
  ClientsSearchResponse,
  ProductApi,
  ProductComplete,
  ProductsCompleteSearchResponse,
  ProductsRecommendationResponse,
  RecommendationProductComplete,
} from "~/types";
import { useEffect, useState } from "react";
import { capitalizeFirstLetterOfEachWord } from "~/utils/strings";
import type { URLSearchParams } from "node:url";
import {
  getProductsComplete,
  getProductsFromRecommendation,
  getProductsSearch,
} from "~/.server/products";
import { ProductsArray } from "~/components/products/ProductsArray";
import { useSearchParams } from "react-router";
import FormGetProducts from "~/components/products/FormGetProducts";
import ProductsTableSelection from "~/components/ProductsTableSelection";
import { requireAuth } from "~/.server/auth";
import { getPreferredLogo } from "~/.server/settings";
import MultipleProductsTemplate from "~/emails/templates/MultipleProductsTemplate";
import FooterTemplate from "~/emails/templates/FooterTemplate";
import EmailForm from "~/components/EmailForm";
import { sendEmail } from "~/.server/email";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "DataDrift | Genera Emails" },
    {
      name: "description",
      content:
        "Genera recomendaciones personalizadas por correo para tus clientes.",
    },
  ];
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const action = formData.get("action");
  if (action === "generate-preview") {
    const emailHtmlPreview = await generateEmail(formData);
    return { emailHtmlPreview, success: undefined };
  }
  if (action === "send-email") {
    return await sendEmailAction(formData);
  }
}

async function sendEmailAction(formData: FormData) {
  const email = formData.get("client-email");
  const emailHtmlPreview = formData.get("html");
  if (!email || !emailHtmlPreview) {
    return {
      emailHtmlPreview: emailHtmlPreview?.toString(),
      success: "Ha ocurrido un error",
    };
  }
  const emails = email
    .toString()
    .split(";")
    .map((e) => e.trim());

  const result = await sendEmail(
    emails,
    "Productos que te podrían interesar",
    emailHtmlPreview.toString()
  );

  if (result) {
    return {
      emailHtmlPreview: emailHtmlPreview.toString(),
      success: `Se enviaron los correos a: ${emails.join(", ")}`,
    };
  } else {
    return {
      emailHtmlPreview: emailHtmlPreview.toString(),
      success: `Error enviando los correos a: ${emails.join(", ")}`,
    };
  }
}

async function generateEmail(formData: FormData) {
  const introText = formData.get("introduction")?.toString();
  const clientName = formData.get("client")?.toString();
  const products = [];
  for (let [key, value] of formData.entries()) {
    const match = key.match(/^product-(\d+)-(name|price|url|text)$/);
    if (match) {
      const index = parseInt(match[1]);
      const field = match[2];
      if (!products[index]) {
        products[index] = { name: "", price: 0, url: "", text: "" };
      }
      if (field === "name") {
        products[index].name = value as string;
      } else if (field === "price") {
        products[index].price = parseFloat(value as string);
      } else if (field === "url") {
        products[index].url = value as string;
      } else if (field === "text") {
        products[index].text = value as string;
      }
    }
  }
  const logoUrl = await getPreferredLogo();
  const email = process.env.EMAIL_USER ?? "";
  const companyName = process.env.COMPANY_NAME ?? "";
  const slogan = process.env.SLOGAN ?? "";
  const website = process.env.COMPANY_WEBSITE ?? "";
  const whatsapp = process.env.WHATSAPP ?? "";
  const facebook = process.env.FACEBOOK ?? "";
  const address = process.env.ADDRESS ?? "";

  const emailHtmlPreview = await render(
    <MainEmail logoUrl={logoUrl} clientName={clientName} introText={introText}>
      <MultipleProductsTemplate products={products} />
      <FooterTemplate
        email={email}
        logoUrl={logoUrl}
        companyName={companyName}
        slogan={slogan}
        website={website}
        whatsapp={whatsapp}
        facebook={facebook}
        address={address}
      />
    </MainEmail>
  );
  return emailHtmlPreview;
}

export async function loader({ request }: Route.LoaderArgs) {
  await requireAuth(request);
  const searchParams = new URL(request.url).searchParams;
  const [dataClients, productsFromRecommendation, dataProducts] =
    await Promise.all([
      getClients(searchParams),
      getProductsFromRecommendatio(searchParams),
      getProductsFromSearch(searchParams),
    ]);

  return { dataClients, productsFromRecommendation, dataProducts };
}

async function getProductsFromRecommendatio(
  searchParams: URLSearchParams
): Promise<RecommendationProductComplete | undefined> {
  const client = searchParams.get("client");
  const specificNumbers = searchParams.get("specificNumbers");
  if (!client || !specificNumbers) return undefined;
  const parsedSpecificNumbers = specificNumbers
    .split(",")
    .map((num) => parseInt(num.trim(), 10))
    .filter((num) => !isNaN(num));
  const products = await getProductsFromRecommendation(
    client,
    parsedSpecificNumbers
  );
  const productsComplete = await getProductsComplete(products.products);
  return {
    products: productsComplete,
    client: products.clients,
  };
}

async function getProductsFromSearch(
  searchParams: URLSearchParams
): Promise<ProductsCompleteSearchResponse> {
  const searchTerm = searchParams.get("productSearch") ?? "";
  const productPage = parseInt(searchParams.get("productPage") ?? "1");
  const productsApi = await getProductsSearch(searchTerm, productPage);
  const productsComplete = await getProductsComplete(productsApi.products);
  return {
    products: productsComplete,
    current_page: productsApi.current_page,
    total_pages: productsApi.total_pages,
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
  const { dataClients, productsFromRecommendation, dataProducts } = loaderData;
  const emailHtmlPreview = actionData?.emailHtmlPreview ?? "";

  const [client, setClient] = useState<ClientApi | null>(null);
  const [products, setProducts] = useState<ProductComplete[]>([]);

  const [showClientSearch, setShowClientSearch] = useState(false);
  const [showProductSearch, setShowProductSearch] = useState(false);

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

  useEffect(() => {
    if (actionData?.success) alert(actionData.success);
  }, [actionData]);

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
          </div>
          <div className="rounded-md p-4 flex flex-col relative">
            <ProductsTableSelection
              products={dataProducts.products}
              setProducts={setProducts}
              totalPages={dataProducts.total_pages}
              currentPage={dataProducts.current_page}
              shown={showProductSearch}
              setShown={setShowProductSearch}
            />
            <div className="flex flex-col md:flex-row justify-center items-center ">
              <button
                className="btn btn-primary"
                onClick={() => setShowProductSearch(true)}
              >
                Agregar Producto sin Recomendacion
              </button>
            </div>
          </div>
          {products && (
            <ProductsArray
              products={products}
              setProducts={setProducts}
              client={client}
            />
          )}
        </div>
        {emailHtmlPreview !== "" && (
          <EmailForm
            clientEmail={client?.email ?? null}
            emailHtmlPreview={emailHtmlPreview}
          />
        )}
      </div>
      <PreviewWindow emailHtmlPreview={emailHtmlPreview} />
    </div>
  );
}
