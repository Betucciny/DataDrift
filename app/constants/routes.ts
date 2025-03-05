export type UserTypes = "admin" | "user";

type Route = {
  name: string;
  path: string;
  allowed: UserTypes[];
};

export const routes: Route[] = [
  {
    name: "Inicio",
    path: "/",
    allowed: ["admin", "user"],
  },
  {
    name: "Email",
    path: "/email",
    allowed: ["admin"],
  },
  {
    name: "Configuracion",
    path: "/settings",
    allowed: ["admin"],
  },
];
