import type { ProductComplete } from "~/types";
import { capitalizeFirstLetterOfEachWord } from "~/utils/strings";

type ProductShowcaseProps = {
  product: ProductComplete;
  onDelete: () => void;
  index: number;
};

export default function ProductShowcase({
  product,
  index,
  onDelete,
}: ProductShowcaseProps) {
  return (
    <div className="card bg-base-100 shadow-xl flex flex-row relative">
      <button
        className="btn btn-error absolute top-2 right-2"
        onClick={onDelete}
      >
        X
      </button>
      <figure>
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.description}
            className="w-full h-48 object-cover"
          />
        ) : (
          <button className="btn btn-secondary">Upload Image</button>
        )}
      </figure>
      <div className="card-body">
        <input
          className="card-title"
          name={`product-${index}-name`}
          value={capitalizeFirstLetterOfEachWord(product.description)}
          readOnly
        />
        <input
          className="text-lg font-semibold"
          name={`product-${index}-price`}
          value={product.price.toFixed(2)}
          readOnly
        />
        <input
          className="text-lg font-semibold"
          name={`product-${index}-quantity`}
          readOnly
        />
      </div>
    </div>
  );
}
