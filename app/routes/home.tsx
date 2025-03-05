import PreviewWindow from "~/components/PreviewWindow";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader() {}

export default function Email({}: Route.ComponentProps) {
  return (
    <div className="m-3">
      <h1>Home</h1>
    </div>
  );
}
