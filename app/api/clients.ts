import type { ClientsSearchResponse } from "~/types";

export async function getClientsSearch(
  searchTerm: string,
  page: number = 1
): Promise<ClientsSearchResponse> {
  const baseUrl = new URL(
    process.env.RECOMMENDATIONS_SERVER ?? "http://localhost:3000"
  );
  baseUrl.pathname = "/clients";
  baseUrl.searchParams.append("search", searchTerm.toUpperCase());
  baseUrl.searchParams.append("page", page.toString());

  const response = await fetch(baseUrl);

  const data: ClientsSearchResponse = await response.json();
  console.log(data);
  return data;
}
