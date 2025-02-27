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
    <Form>
      {products.map((product, index) => (
        <ProductShowcase
          key={product.id}
          product={product}
          index={index}
          onDelete={() => onDelete(product)}
        />
      ))}
    </Form>
  );
}
