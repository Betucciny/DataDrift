import type { ClientApi } from "~/types";
import { Form } from "react-router";
import { useSearchParams } from "react-router";
import { useState } from "react";

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
  const [useRange, setUseRange] = useState(true);

  const handleReset = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setSearchParams((prev) => {
      prev.delete("client");
      prev.delete("specificNumbers");
      return prev;
    });
    setProducts([]);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!client) {
      alert("Por favor, seleccione un cliente antes de enviar el formulario.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    let specificNumbers: number[] = [];

    if (useRange) {
      const start = parseInt(formData.get("start") as string, 10);
      const end = parseInt(formData.get("end") as string, 10);

      if (isNaN(start) || isNaN(end) || start > end) {
        event.preventDefault();
        alert(
          "Por favor, ingrese un rango válido donde el valor inicial sea menor o igual al valor final."
        );
        return;
      }

      for (let i = start; i <= end; i++) {
        specificNumbers.push(i);
      }
    } else {
      const specificNumbersInput = formData.get("specificNumbers") as string;
      specificNumbers = specificNumbersInput
        .split(",")
        .map((num) => parseInt(num.trim(), 10))
        .filter((num) => !isNaN(num));

      if (specificNumbers.length === 0) {
        event.preventDefault();
        alert(
          "Por favor, ingrese números específicos válidos separados por comas."
        );
        return;
      }
    }
    setSearchParams((prev) => {
      prev.set("client", client.id);
      prev.set("specificNumbers", specificNumbers.join(","));
      return prev;
    });
  };

  return (
    <div className="flex grow flex-col lg:flex-row justify-around items-center shadow-md rounded-lg p-4">
      <div className="text-lg font-bold mb-4 lg:max-w-[15%]">
        <p>Agregar productos recomendados</p>
      </div>
      <Form
        className="flex flex-col md:flex-row md:justify-around justify-center text-base-content space-y-2 md:space-y-0"
        preventScrollReset
        method="get"
        onSubmit={handleSubmit}
      >
        <input type="hidden" name="client" value={client?.id ?? ""} />
        <div className="flex flex-col justify-center items-stretch space-y-2 p-4">
          <div className="flex space-x-5 flex-row justify-between items-center">
            <input
              type="radio"
              checked={useRange}
              onChange={() => setUseRange(true)}
              className="radio mr-2"
            />
            <p>Rango</p>
          </div>
          <div className="flex space-x-5 flex-row justify-between items-center">
            <input
              type="radio"
              checked={!useRange}
              onChange={() => setUseRange(false)}
              className="radio mr-2"
            />
            <p>Especifico</p>
          </div>
        </div>
        {useRange ? (
          <div className="flex flex-col justify-between items-center ">
            <label className="input">
              <span className="label">Inicio del Rango:</span>
              <input
                type="number"
                name="start"
                min="1"
                defaultValue="1"
                className="input input-bordered"
                required
              />
            </label>
            <label className="input">
              <span className="label">Fin del Rango:</span>
              <input
                type="number"
                name="end"
                min="1"
                defaultValue="1"
                className="input input-bordered"
                required
              />
            </label>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row justify-between items-center">
            <label className="input">
              <span className="label">Números Específicos:</span>
              <input
                type="text"
                name="specificNumbers"
                placeholder="Ej: 1,2,5,10"
                className="input input-bordered"
                required
              />
            </label>
          </div>
        )}
        <div className="flex flex-col 2xl:flex-row space-y-2 2xl:space-y-0 2xl:space-x-2 items-center justify-center">
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
