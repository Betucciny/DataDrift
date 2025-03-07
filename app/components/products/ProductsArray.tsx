import { Form } from "react-router";
import type { ProductComplete } from "~/types";
import ProductShowcase from "./ProductShowcase";

type ProductsArrayProps = {
  products: ProductComplete[];
  setProducts: React.Dispatch<React.SetStateAction<ProductComplete[]>>;
};

export function ProductsArray({ products, setProducts }: ProductsArrayProps) {
  function onDelete(product: ProductComplete) {
    setProducts((products) => products.filter((p) => p.id !== product.id));
  }

  return (
    <Form
      className="flex flex-col items-stretch"
      preventScrollReset
      method="post"
      action="/email"
    >
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
          key={index}
          product={product}
          index={index}
          onDelete={() => onDelete(product)}
          setProducts={setProducts}
        />
      ))}
      <button className="btn btn-primary" type="submit">
        Visualizar Email
      </button>
    </Form>
  );
}
