import { commitSession, getSession } from "~/.server/auth";
import type { Route } from "./+types/logout";
import { redirect } from "react-router";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  session.unset("authenticated");
  return redirect("/", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export default function Logout() {}
