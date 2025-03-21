import { checkToken, commitSession, getSession } from "~/.server/auth";
import { redirect } from "react-router";
import type { Route } from "./+types/login";
import { Form } from "react-router";
import { useNavigation } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "DataDrift | Inicio de Sesión" },
    {
      name: "description",
      content:
        "Genera recomendaciones personalizadas por correo para tus clientes.",
    },
  ];
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const token = formData.get("token");
  if (!token) return { error: "Por favor coloca tu token" };
  const isValid = checkToken(token.toString());

  if (!isValid) {
    return { error: "Token invalido" };
  }

  const session = await getSession();
  session.set("authenticated", true);
  return redirect("/email", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  if (session.get("authenticated")) {
    return redirect("/email");
  }
}

export default function Login({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();

  return (
    <div className="flex flex-col items-center justify-center h-full bg-base-200">
      <h1 className="text-4xl font-bold mb-8 text-primary">Iniciar Sesion</h1>
      <Form
        method="post"
        className="w-full max-w-sm bg-base-100 p-8 rounded-lg shadow-lg"
      >
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            2FA Token:
            <input
              type="password"
              name="token"
              required
              className="input input-bordered w-full mt-1"
            />
          </label>
        </div>
        {actionData?.error && (
          <p className="text-red-500 mb-4">{actionData?.error}</p>
        )}
        <button
          type="submit"
          className={`btn btn-primary w-full ${
            navigation.state === "submitting" ? "btn-disabled" : ""
          }`}
          disabled={navigation.state === "submitting"}
        >
          Iniciar Sesion
        </button>
      </Form>
    </div>
  );
}
