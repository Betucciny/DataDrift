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
    name: "Inicio de sesión",
    path: "/login",
    allowed: ["user"],
  },
  {
    name: "Email",
    path: "/email",
    allowed: ["admin"],
  },
];
