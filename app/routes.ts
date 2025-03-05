import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),
  route("email", "routes/email.tsx"),
  route("settings", "routes/settings.tsx"),
  route("logout", "routes/logout.tsx"),
] satisfies RouteConfig;
