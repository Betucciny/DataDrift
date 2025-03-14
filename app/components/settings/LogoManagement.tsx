import type { Logo } from "@prisma/client";
import { useRef, useState } from "react";
import { Form, redirect } from "react-router";

type LogoManagementProps = {
  logos: Logo[];
  setLogos: React.Dispatch<React.SetStateAction<Logo[]>>;
};

export default function LogoManagement({
  logos,
  setLogos,
}: LogoManagementProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  async function handleFileUpload(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (!selectedFile) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("logo", selectedFile);
    try {
      const response = await fetch("/api/upload-logo", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const { logo } = await response.json();
      setLogos((prevLogos) => {
        const newLogo: Logo = {
          id: logo.id,
          imageUrl: logo.imageUrl,
          createdAt: new Date(),
          updatedAt: new Date(),
          preferred: logo.preferred,
        };
        return [...prevLogos, newLogo];
      });
      fileInputRef.current!.value = "";
      setSelectedFile(null);
    } catch (error) {
      console.log("Error: ", error);
    } finally {
      setUploading(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  }

  async function handleImageDelete(
    e: React.MouseEvent<HTMLButtonElement>,
    logoId: string
  ) {
    e.preventDefault();
    try {
      const response = await fetch(`/api/delete-logo/${logoId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to delete image:", errorText);
        throw new Error("Failed to delete image");
      }
      window.location.reload();
    } catch (error) {
      console.log("Error: ", error);
    }
  }

  return (
    <div className="p-2">
      <h2 className="text-2xl font-bold mb-4">Selección y manejo de Logos</h2>
      <div className="flex lg:flex-row flex-col items-stretch space-x-4 lg:max-h-80 space-y-4">
        <figure className="flex flex-col">
          <div className="w-full h-52 flex items-center justify-center bg-gray-200 rounded-md mb-2 md:mb-0">
            <span className="text-gray-500">No Image Available</span>
          </div>
          <div className="flex flex-col space-y-2 justify-center min-w-72">
            <input
              ref={fileInputRef}
              type="file"
              name="image"
              className="file-input file-input-primary"
              accept="image/*"
              onChange={handleFileChange}
            />
            <button
              className="btn btn-primary"
              disabled={uploading}
              onClick={handleFileUpload}
            >
              Subir imagen
            </button>
          </div>
        </figure>
        {logos.length === 0 && (
          <div className="flex-grow flex items-center justify-center w-full bg-base-200 rounded-md min-h-32">
            <span className="text-gray-500">Sube un logo para comenzar</span>
          </div>
        )}
        <div className="flex flex-row flex-grow items-center space-x-4 lg:w-max max-w-screen overflow-y-scroll justify-self-stretch">
          {logos.map((logo) => (
            <div
              key={logo.id}
              className="relative flex flex-col space-y-2 items-center justify-center rounded-md mb-2 md:mb-0 aspect-square h-64"
            >
              {logo.preferred && (
                <div className="absolute top-0 z-10 -right-2 bg-success text-success-content text-4xl mask mask-hexagon p-2">
                  ✓
                </div>
              )}
              <img
                src={logo.imageUrl}
                alt={`Logo ${logo.id}`}
                className="object-cover rounded-md shadow-md w-full h-full"
              />
              <div className="flex flex-row space-x-2">
                <button
                  className="btn btn-danger"
                  onClick={(e) => handleImageDelete(e, logo.id)}
                >
                  Delete
                </button>
                <Form method="POST" reloadDocument preventScrollReset>
                  <input
                    className="hidden"
                    name="logoId"
                    defaultValue={logo.id}
                  />
                  <input
                    className="hidden"
                    name="action"
                    defaultValue="setFavoriteLogo"
                  />

                  <button
                    className="btn btn-primary"
                    type="submit"
                    disabled={logo.preferred}
                  >
                    Seleccionar
                  </button>
                </Form>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
