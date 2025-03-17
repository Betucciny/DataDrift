import LogoManagement from "~/components/settings/LogoManagement";
import type { Route } from "./+types/settings";
import { requireAuth } from "~/.server/auth";
import {
  createPrompt,
  deletePrompt,
  editPrompt,
  getCompanyInfo,
  getLogos,
  getMetadata,
  getPrompts,
  selectPreferredPrompt,
  setFavoriteLogo,
  updateCompanyInfo,
} from "~/.server/settings";
import { useState } from "react";
import PromptManager from "~/components/settings/PromptManager";
import CompanyInfo from "~/components/settings/CompanyInfo";
import Metadata from "~/components/settings/Metadata";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "DataDrift | Configuración" },
    {
      name: "description",
      content:
        "Genera recomendaciones personalizadas por correo para tus clientes.",
    },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  await requireAuth(request);
  const [logos, prompts, companyInfo, metadata] = await Promise.all([
    getLogos(),
    getPrompts(),
    getCompanyInfo(),
    getMetadata(),
  ]);

  return { logos, prompts, companyInfo, metadata };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const action = formData.get("action");

  try {
    if (action === "setFavoriteLogo") {
      const logoId = formData.get("logoId");
      if (!logoId) throw new Error("Logo ID is required");
      await setFavoriteLogo(logoId.toString());
      return { success: true };
    } else if (action === "create-prompt") {
      const prompt = formData.get("new-prompt");
      if (!prompt) throw new Error("Prompt is requiered");
      await createPrompt(prompt.toString());
      return { success: true };
    } else if (action === "edit-prompt") {
      const prompt = formData.get("prompt");
      const id = formData.get("id");
      if (!id || !prompt) throw new Error("Prompt and id are required");
      await editPrompt(id.toString(), prompt.toString());
      return { success: true };
    } else if (action === "delete-prompt") {
      const id = formData.get("id");
      if (!id) throw new Error("Prompt and id are required");
      await deletePrompt(id.toString());
      return { success: true };
    } else if (action === "preferred-prompt") {
      const id = formData.get("id");
      if (!id) throw new Error("Prompt and id are required");
      await selectPreferredPrompt(id.toString());
      return { success: true };
    } else if (action === "update-company") {
      const companyInfo = formData.get("company-info");
      if (!companyInfo) throw new Error("Company Info is required");
      await updateCompanyInfo(companyInfo.toString());
      return { success: true };
    } else {
      return { success: false };
    }
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}

export default function Settings({ loaderData }: Route.ComponentProps) {
  const [logos, setLogos] = useState(loaderData.logos);
  return (
    <div className="p-4">
      <LogoManagement logos={logos} setLogos={setLogos} />
      <CompanyInfo companyInfo={loaderData.companyInfo} />
      <PromptManager prompts={loaderData.prompts} />
      <Metadata metadata={loaderData.metadata} />
    </div>
  );
}
