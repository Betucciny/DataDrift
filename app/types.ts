export type ClientApi = {
  id: string;
  name: string;
  email: string;
};

export type ClientsSearchResponse = {
  clients: ClientApi[];
  current_page: number;
  total_pages: number;
};

export type ProductApi = {
  id: string;
  description: string;
  price: number;
};

export type ProductsRecommendationResponse = {
  client: ClientApi;
  products: ProductApi[];
};

export type ProductComplete = ProductApi & {
  imageUrl?: string;
};

export type RecommendationProductComplete = {
  client: ClientApi;
  products: ProductComplete[];
};
