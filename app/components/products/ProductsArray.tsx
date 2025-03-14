import { Form } from "react-router";
import type { ClientApi, ProductComplete } from "~/types";
import ProductShowcase from "./ProductShowcase";
import { useState } from "react";

type ProductsArrayProps = {
  products: ProductComplete[];
  client: ClientApi | null;
  setProducts: React.Dispatch<React.SetStateAction<ProductComplete[]>>;
};

export function ProductsArray({
  products,
  setProducts,
  client,
}: ProductsArrayProps) {
  const [isGenerateLoading, setIsGenerateLoading] = useState(false);
  const [options, setOptions] = useState<string[]>([]);
  const [text, setText] = useState("");

  function onDelete(product: ProductComplete) {
    setProducts((products) => products.filter((p) => p.id !== product.id));
  }

  async function handleGenerate(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setIsGenerateLoading(true);
    try {
      const response = await fetch("/api/slm/intro/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data: string[] = await response.json();
      setOptions(data);
    } catch (error) {
      console.log("Error: ", error);
    } finally {
      setIsGenerateLoading(false);
    }
  }

  async function handleOptionSelect(value: string) {
    setText(value);
    setOptions([]);
  }

  return (
    <Form
      className="flex flex-col items-stretch"
      preventScrollReset
      method="post"
      action="/email"
    >
      <input name="action" defaultValue="generate-preview" className="hidden" />
      <input name="client" defaultValue={client?.name} className="hidden" />
      <div className="flex flex-col space-y-2 rounded-md">
        <label className="floating-label">
          <span>Texto introductorio</span>
          <textarea
            className="textarea w-full"
            name="introduction"
            placeholder="Escribe el texto de introducción o generalo"
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
      </div>
      {products.length === 0 && (
        <div className="flex flex-col justify-center items-center my-4 h-32 bg-base-200 rounded-md">
          <h3 className="text-center">No hay productos agregados.</h3>
          <p className="text-center">
            Por favor, agregue productos mediante recomendaciones o manualmente.
          </p>
        </div>
      )}
      {products.map((product, index) => (
        <ProductShowcase
          key={product.id}
          product={product}
          index={index}
          onDelete={() => onDelete(product)}
          setProducts={setProducts}
          totalProducts={products.length}
        />
      ))}
      <button className="btn btn-primary" type="submit">
        Visualizar Email
      </button>
    </Form>
  );
}
