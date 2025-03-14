import { useEffect, useRef, useState } from "react";
import type { ProductComplete } from "~/types";
import { capitalizeFirstLetterOfEachWord } from "~/utils/strings";

type ProductShowcaseProps = {
  product: ProductComplete;
  setProducts: React.Dispatch<React.SetStateAction<ProductComplete[]>>;
  onDelete: () => void;
  index: number;
  totalProducts: number;
};

export default function ProductShowcase({
  product,
  index,
  onDelete,
  setProducts,
  totalProducts,
}: ProductShowcaseProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [isGenerateLoading, setIsGenerateLoading] = useState(false);
  const [options, setOptions] = useState<string[]>([]);

  function handleDelete(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    onDelete();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  }

  async function handleFileUpload(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("sae_id", product.id);

    try {
      const response = await fetch("/api/products/upload-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const { path } = await response.json();
      setProducts((prevProducts) => {
        const productUpdated = prevProducts.filter(
          (productFilter) => productFilter.id === product.id
        );
        productUpdated[0].imageUrl = path;
        return [...prevProducts];
      });
    } catch (error) {
      console.log("Error: ", error);
    }
  }

  async function handleImageDelete(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    try {
      const response = await fetch(`/api/products/delete-image/${product.id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to delete image:", errorText);
        throw new Error("Failed to delete image");
      }
      setProducts((prevProducts) => {
        const productUpdated = prevProducts.map((productFilter) =>
          productFilter.id === product.id
            ? { ...productFilter, imageUrl: undefined }
            : productFilter
        );
        return productUpdated;
      });
    } catch (error) {
      console.log("Error: ", error);
    }
  }

  async function handleGenerate(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setIsGenerateLoading(true);
    const product = inputRef.current?.value;
    if (!product) return;
    try {
      const response = await fetch("/api/slm/prompt/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ product }),
      });
      const data: string[] = await response.json();
      setOptions(data);
    } catch (error) {
      console.log("Error: ", error);
    } finally {
      setIsGenerateLoading(false);
    }
  }

  function moveProduct(direction: "up" | "down") {
    setProducts((prevProducts) => {
      const newProducts = [...prevProducts];
      const currentIndex = newProducts.findIndex((p) => p.id === product.id);
      if (currentIndex === -1) return newProducts;

      const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
      if (newIndex < 0 || newIndex >= newProducts.length) return newProducts;

      const [movedProduct] = newProducts.splice(currentIndex, 1);
      newProducts.splice(newIndex, 0, movedProduct);

      return newProducts;
    });
  }

  async function handleOptionSelect(value: string) {
    setText(value);
    setOptions([]);
  }

  return (
    <div className="card bg-base-100 shadow-xl flex flex-col md:flex-row relative m-2 p-2 grow justify-around">
      <button
        className="btn btn-error absolute top-2 right-2"
        onClick={handleDelete}
        type="button"
      >
        X
      </button>
      {product.recommendation && (
        <div className="absolute top-2 right-30">
          <div className="flex items-center space-x-2">
            <span className="font-bold">Recomendación: </span>
            <div className="flex items-center justify-center w-8 h-8 bg-info text-info-content mask mask-heart">
              <span>{product.recommendation}</span>
            </div>
          </div>
        </div>
      )}
      <div className="absolute top-15 right-2 flex flex-col space-y-1">
        <button
          className="btn btn-secondary btn-sm"
          type="button"
          onClick={() => moveProduct("up")}
          disabled={index === 0}
        >
          ↑
        </button>
        <button
          className="btn btn-secondary btn-sm"
          type="button"
          onClick={() => moveProduct("down")}
          disabled={index === totalProducts - 1}
        >
          ↓
        </button>
      </div>
      <div className="flex lg:flex-row flex-col items-stretch space-x-4 lg:max-h-80 space-y-4">
        {product.imageUrl ? (
          <figure className="flex flex-col rounded-md">
            <img
              src={product.imageUrl}
              alt={product.description}
              className="w-full h-48 object-contain"
            />
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleImageDelete}
            >
              Borrar imagen
            </button>
          </figure>
        ) : (
          <figure className="flex flex-col">
            <div className="w-full h-52 flex items-center justify-center bg-gray-200 rounded-md mb-2 md:mb-0">
              <span className="text-gray-500">No Image Available</span>
            </div>
            <div className="flex flex-col space-y-2 justify-center min-w-72">
              <input
                type="file"
                name="image"
                className="file-input file-input-primary"
                accept="image/*"
                onChange={handleFileChange}
              />
              <button className="btn btn-primary" onClick={handleFileUpload}>
                Subir imagen
              </button>
            </div>
          </figure>
        )}
      </div>
      <div className="card-body text-content md:max-w-[70%] flex-grow space-y-1">
        <p>
          <span className="font-bold">Nombre inicial: {""}</span>
          {capitalizeFirstLetterOfEachWord(product.description)}
        </p>
        <label className="floating-label">
          <span>Nombre del Producto</span>
          <input
            ref={inputRef}
            className="input w-full"
            name={`product-${index}-name`}
            defaultValue={capitalizeFirstLetterOfEachWord(product.description)}
          />
        </label>
        <label className="floating-label">
          <span>Precio</span>
          <input
            className="input w-full"
            name={`product-${index}-price`}
            type="number"
            step="0.01"
            pattern="\d*"
            defaultValue={product.price.toFixed(2)}
          />
        </label>
        <label className="floating-label">
          <span>Texto promocional</span>
          <textarea
            className="textarea w-full"
            name={`product-${index}-text`}
            placeholder="Escribe el texto promocional o generalo con el botón de abajo"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </label>
        <button
          className="btn btn-primary"
          onClick={handleGenerate}
          disabled={isGenerateLoading}
        >
          {isGenerateLoading ? (
            <span className="loading loading-spinner"></span>
          ) : (
            "Generar Texto con IA"
          )}
        </button>
        {options.length > 0 && (
          <div className="mt-2">
            <label className="block font-bold mb-1">
              Seleccione una opción:
            </label>
            {options.map((option, idx) => (
              <div
                key={idx}
                className="flex items-center mb-1 cursor-pointer hover:bg-accent p-1 rounded"
                onClick={() => handleOptionSelect(option)}
              >
                <span>{option}</span>
              </div>
            ))}
            <button
              onClick={() => setOptions([])}
              type="button"
              className="btn btn-error"
            >
              Cancelar
            </button>
          </div>
        )}
        <input
          className="hidden"
          name={`product-${index}-url`}
          readOnly
          value={product.imageUrl ?? ""}
        />
      </div>
    </div>
  );
}
