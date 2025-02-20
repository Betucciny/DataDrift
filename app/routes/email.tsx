import PreviewWindow from "~/components/PreviewWindow";
import type { Route } from "./+types/email";
import { render } from "@react-email/components";
import MainEmail from "~/emails/MainEmail";
import DefaultOneProduct from "~/emails/templates/DefaultOneProduct";
import { Form } from "react-router";
import { getClientsSearch } from "~/api/clients";
import ClientsTableSelection from "~/components/ClientsTableSelection";
import type { Client } from "~/types";
import { useState } from "react";
import { capitalizeFirstLetterOfEachWord } from "~/utils/strings";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function action({ request }: Route.ActionArgs) {
  let formData = await request.formData();
  const emailHtmlPreview = await render(
    <MainEmail userName="Betucciny">
      <DefaultOneProduct />
    </MainEmail>
  );
  console.log(emailHtmlPreview);
  return { emailHtmlPreview };
}

export async function loader({ request }: Route.LoaderArgs) {
  const searchParams = new URL(request.url).searchParams;
  console.log(searchParams);
  const searchTerm = searchParams.get("clientSearch") ?? "";
  const clientPage = parseInt(searchParams.get("clientPage") ?? "1");
  const dataClients = await getClientsSearch(searchTerm, clientPage);
  return { dataClients };
}

export default function Email({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { dataClients } = loaderData;
  const [client, setClient] = useState<Client | null>(null);
  const [showClientSearch, setShowClientSearch] = useState(false);

  const emailHtmlPreview = actionData?.emailHtmlPreview ?? "";
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
                onClick={() => setShowClientSearch((show) => !show)}
              >
                Seleccionar Cliente
              </button>
            </div>
          </div>
          <div className="mock-data">
            <h2 className="text-xl font-semibold mb-2">Mock Data</h2>
            <ul className="list-disc pl-5">
              {Array.from({ length: 40 }, (_, i) => (
                <li key={i}>Client {i + 1}</li>
              ))}
            </ul>
          </div>
        </div>
        <Form preventScrollReset method="post">
          <button type="submit" className="btn btn-primary">
            Visualizar
          </button>
        </Form>
      </div>
      <PreviewWindow emailHtmlPreview={emailHtmlPreview} />
    </div>
  );
}
