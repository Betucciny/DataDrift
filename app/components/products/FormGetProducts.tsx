import type { ClientApi } from "~/types";
import { Form } from "react-router";
import { useSearchParams } from "react-router";

type FormGetProductsProps = {
  client: ClientApi | null;
  setProducts: React.Dispatch<React.SetStateAction<any>>;
};

export default function FormGetProducts({
  client,
  setProducts,
}: FormGetProductsProps) {
  const [searchParams, setSearchParams] = useSearchParams(
    new URLSearchParams()
  );
  const currentOffset = searchParams.get("offset") ?? "0";
  const currentLimit = searchParams.get("limit") ?? "0";
  const nextOffset = parseInt(currentOffset) + parseInt(currentLimit);

  const handleReset = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setSearchParams((prev) => {
      prev.delete("offset");
      prev.delete("limit");
      prev.delete("client");
      return prev;
    });
    setProducts([]);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (!client) {
      event.preventDefault();
      alert("Please select a client before submitting the form.");
    }
  };

  return (
    <div className="flex grow flex-row justify-around items-center shadow-md rounded-lg p-4">
      <p className="text-lg font-bold mb-4">Agregar productos recomendados</p>
      <Form
        className="flex flex-col md:flex-row md:justify-around justify-center text-base-content space-x-5"
        preventScrollReset
        method="get"
        onSubmit={handleSubmit}
      >
        <input type="hidden" name="client" value={client?.id ?? ""} />
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <label className="input">
            <span className="label">Límite:</span>
            <input
              type="number"
              name="limit"
              defaultValue="1"
              className="input input-bordered ml-2"
            />
          </label>
          <input type="hidden" name="offset" value={nextOffset} />
        </div>
        <div className="flex flex-col 2xl:flex-row space-y-2 2xl:space-y-0 2xl:space-x-2">
          <button type="submit" className="btn btn-primary">
            Agregar Productos
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleReset}
          >
            Resetear Productos
          </button>
        </div>
      </Form>
    </div>
  );
}
