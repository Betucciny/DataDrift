import { useEffect, useState } from "react";
import { Form } from "react-router";

type EmailFormProps = {
  emailHtmlPreview: string;
  clientEmail: string | null;
};

export default function EmailForm({
  clientEmail,
  emailHtmlPreview,
}: EmailFormProps) {
  const [email, setEmail] = useState(clientEmail ?? "");

  useEffect(() => {
    setEmail(clientEmail ?? "");
  }, [clientEmail]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const confirmation = window.confirm(
      "¿Estás seguro de que deseas enviar este correo electrónico?"
    );
    if (!confirmation) {
      event.preventDefault();
    }
  };

  return (
    <Form
      className="flex flex-col space-y-2 rounded-md"
      method="post"
      onSubmit={handleSubmit}
    >
      <input name="action" defaultValue="send-email" className="hidden" />
      <input name="html" defaultValue={emailHtmlPreview} className="hidden" />
      <label className="floating-label">
        <span>Email de Cliente</span>
        <textarea
          className="textarea w-full"
          name="client-email"
          placeholder="Escribe el/los email(s) del cliente separados por ; example@example.com;example@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <button className="btn btn-primary" type="submit">
        Enviar Email
      </button>
    </Form>
  );
}
