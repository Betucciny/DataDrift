import type { CompanyInfo } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import { Form } from "react-router";

type CompanyInfoProps = {
  companyInfo: string;
};

export default function CompanyInfo({ companyInfo }: CompanyInfoProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [editable, setEditable] = useState(false);

  function resetTextArea(e: React.MouseEvent) {
    e.preventDefault();
    setEditable(false);
    if (textareaRef.current) {
      textareaRef.current.value = companyInfo;
    }
  }

  function onEditClick(e: React.MouseEvent) {
    e.preventDefault();
    setEditable(true);
  }

  useEffect(() => {
    setEditable(false);
  }, [companyInfo]);

  return (
    <div className="p-2">
      <h2 className="text-2xl font-bold mb-4">Información de la compañía</h2>
      <Form method="post" className="mb-4 flex flex-col space-y-2">
        <input type="hidden" name="action" value="update-company" />
        <label className="floating-label">
          <span>Información de la compañía</span>
          <textarea
            ref={textareaRef}
            name="company-info"
            rows={3}
            key="company-info"
            defaultValue={companyInfo}
            disabled={!editable}
            className="textarea w-full"
            placeholder="Escriba la información de la compañía ..."
          />
        </label>
        <div className="flex flex-row justify-stretch space-x-2">
          {!editable ? (
            <button
              className="btn btn-primary grow"
              onClick={onEditClick}
              type="button"
            >
              Editar
            </button>
          ) : (
            <button
              className="btn btn-primary grow"
              onClick={resetTextArea}
              type="button"
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            className="btn btn-primary grow"
            disabled={!editable}
          >
            Actualizar
          </button>
        </div>
      </Form>
    </div>
  );
}
