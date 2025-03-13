import type { Prompt } from "@prisma/client";
import { useEffect, useRef, useState, type MouseEventHandler } from "react";
import { Form } from "react-router";

type PromptManagerProps = {
  prompts: Prompt[];
};

function PromptTextArea({ prompt }: { prompt: Prompt }) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [editable, setEditable] = useState(false);

  function resetTextArea(e: React.MouseEvent) {
    e.preventDefault();
    setEditable(false);
    if (textareaRef.current) {
      textareaRef.current.value = prompt.text;
    }
  }

  function onEditClick(e: React.MouseEvent) {
    e.preventDefault();
    setEditable(true);
  }

  useEffect(() => {
    setEditable(false);
  }, [prompt]);

  return (
    <Form
      method="post"
      preventScrollReset
      className="relative flex flex-col md:flex-row space-x-2 md:items-center space-y-2"
    >
      <input className="hidden" name="id" defaultValue={prompt.id} />
      <textarea
        className="textarea grow w-full"
        name="prompt"
        key="prompt"
        defaultValue={prompt.text}
        ref={textareaRef}
        disabled={!editable}
      />
      <div className="space-x-2  flex flex-row justify-center">
        {!editable ? (
          <button
            className="btn btn-primary"
            onClick={onEditClick}
            type="button"
          >
            Editar
          </button>
        ) : (
          <button
            className="btn btn-primary"
            onClick={resetTextArea}
            type="button"
          >
            Cancelar
          </button>
        )}
        <button
          className="btn btn-primary"
          disabled={!editable}
          type="submit"
          name="action"
          value="edit-prompt"
        >
          Guardar
        </button>
        <button
          className="btn btn-primary"
          type="submit"
          name="action"
          value="delete-prompt"
        >
          Eliminar
        </button>
        {prompt.preferred ? (
          <div className="btn btn-success">Seleccionado</div>
        ) : (
          <button
            className="btn btn-primary"
            type="submit"
            name="action"
            value="preferred-prompt"
          >
            Seleccionar
          </button>
        )}
      </div>
    </Form>
  );
}

export default function PromptManager({ prompts }: PromptManagerProps) {
  return (
    <div className="p-2">
      <h2 className="text-2xl font-bold mb-4">Prompts</h2>
      <Form method="post" className="mb-4" reloadDocument>
        <input className="hidden" name="action" defaultValue="create-prompt" />
        <label className="floating-label">
          <span>Tu Prompt aqui</span>
          <textarea
            id="new-prompt"
            name="new-prompt"
            rows={3}
            className="textarea w-full"
            placeholder="Escriba su nuevo prompt aquí..."
          />
        </label>
        <button type="submit" className="btn btn-primary mt-2 w-full">
          Agregar Prompt
        </button>
      </Form>
      <div className="flex flex-col space-y-2">
        {prompts.map((prompt) => (
          <PromptTextArea prompt={prompt} key={prompt.id} />
        ))}
      </div>
      {prompts.length === 0 && (
        <div className="flex flex-col justify-center items-center my-4 h-32 bg-base-200 rounded-md">
          <h3 className="text-center">No hay prompts agregados.</h3>
          <p className="text-center">
            Por favor, agregue prompts para usar para generar mensajes.
          </p>
        </div>
      )}
    </div>
  );
}
