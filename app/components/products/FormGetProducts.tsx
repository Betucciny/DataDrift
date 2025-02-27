import type { ClientApi } from "~/types";
import { Form } from "react-router";
import { useSearchParams } from "react-router";

type FormGetProductsProps = {
  client: ClientApi | null;
};

export default function FormGetProducts({ client }: FormGetProductsProps) {
  const [searchParams] = useSearchParams(new URLSearchParams());
  const currentOffset = searchParams.get("offset") ?? "0";
  const currentLimit = searchParams.get("limit") ?? "0";
  const nextOffset = parseInt(currentOffset) + parseInt(currentLimit);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (!client) {
      event.preventDefault();
      alert("Please select a client before submitting the form.");
    }
  };

  return (
    <Form preventScrollReset method="get" onSubmit={handleSubmit}>
      <input type="hidden" name="client" value={client?.id ?? ""} />
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <label className="block text-lg font-semibold text-content mb-4 md:mb-0">
          Límite:
          <input
            type="number"
            name="limit"
            defaultValue="1"
            className="input input-bordered ml-2"
          />
        </label>
        <input type="hidden" name="offset" value={nextOffset} />
      </div>
      <button type="submit" className="btn btn-primary">
        Visualizar
      </button>
    </Form>
  );
}
