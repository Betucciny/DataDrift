export type Client = {
  id: string;
  name: string;
  email: string;
};

export type ClientsSearchResponse = {
  clients: Client[];
  current_page: number;
  total_pages: number;
};
