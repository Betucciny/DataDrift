import { useSearchParams } from "react-router";
import type { ProductComplete } from "~/types";
import { capitalizeFirstLetterOfEachWord } from "~/utils/strings";
import { useState, useEffect, useRef } from "react";

type ProductsTableSelectionProps = {
  products: ProductComplete[];
  currentPage: number;
  totalPages: number;
  setProducts: React.Dispatch<React.SetStateAction<ProductComplete[]>>;
  shown: boolean;
  setShown: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ProductsTableSelection({
  products,
  setProducts,
  totalPages,
  currentPage,
  shown,
  setShown,
}: ProductsTableSelectionProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(false);
  }, [products]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShown(false);
      }
    };

    if (shown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [shown, setShown]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setSearchParams((prev) => {
        prev.set("productPage", (currentPage + 1).toString());
        return prev;
      });
      setLoading(true);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setSearchParams((prev) => {
        prev.set("productPage", (currentPage - 1).toString());
        return prev;
      });
      setLoading(true);
    }
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const value = formData.get("productSearch") as string;
    setSearchParams((prev) => {
      prev.set("productSearch", value);
      return prev;
    });
    setLoading(true);
  };
  const handleSelectProduct = (product: ProductComplete) => {
    setShown(false);
    setProducts((prevProducts) => {
      if (!prevProducts.some((p) => p.id === product.id)) {
        return [...prevProducts, product];
      }
      return prevProducts;
    });
    setTimeout(() => {
      window.scrollTo(0, document.body.scrollHeight);
    }, 100);
  };

  return (
    shown && (
      <div
        ref={containerRef}
        className="p-4 bg-base-200 rounded-lg shadow-md flex flex-col absolute w-full mt-28 md:mt-15 z-10 left-0 right-0"
      >
        <div className="join mb-4">
          <form onSubmit={handleSearch} className="join w-full">
            <input
              type="text"
              name="productSearch"
              placeholder="Buscar Productos"
              className="input input-bordered join-item w-full text-base-content bg-base-100"
              defaultValue={searchParams.get("productSearch") || ""}
            />
            <button type="submit" className="btn join-item">
              Search
            </button>
          </form>
          <button className="btn join-item" onClick={() => setShown(false)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-4 h-4 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="min-h-[500px] flex flex-col justify-around items-center">
          {loading ? (
            <span className="loading loading-spinner loading-xl"></span>
          ) : (
            <>
              <table className="table w-full bg-base-100 rounded-lg shadow-sm">
                <thead className="bg-base-300">
                  <tr>
                    <th className="p-2">Name</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      onClick={() => handleSelectProduct(product)}
                      className={`cursor-pointer hover:bg-base-200`}
                    >
                      <td className="p-2 overflow-clip">
                        {capitalizeFirstLetterOfEachWord(product.description)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="join p-3 self-center">
                <button
                  disabled={currentPage === 1}
                  className={
                    currentPage === 1
                      ? "join-item btn disabled"
                      : "join-item btn"
                  }
                  onClick={handlePreviousPage}
                >
                  «
                </button>
                <button className="join-item btn">Pagina {currentPage}</button>
                <button
                  disabled={currentPage === totalPages}
                  className={
                    currentPage === totalPages
                      ? "join-item btn disabled"
                      : "join-item btn"
                  }
                  onClick={handleNextPage}
                >
                  »
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    )
  );
}
