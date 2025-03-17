import { Link } from "react-router";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "DataDrift" },
    {
      name: "description",
      content:
        "Genera recomendaciones personalizadas por correo para tus clientes.",
    },
  ];
}

export async function loader() {}

export default function Home({}: Route.ComponentProps) {
  return (
    <div className="min-h-full bg-base-200 flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-base-100 shadow-xl rounded-lg p-8">
        <h1 className="text-4xl font-bold text-center text-primary mb-6">
          Bienvenido al Generador de Recomendaciones por Correo DataDrift
        </h1>
        <p className="text-lg text-base-content mb-4">
          Nuestra plataforma te ayuda a generar recomendaciones personalizadas
          por correo para tus clientes. Ya seas una agencia de marketing, un
          equipo de ventas o un representante de atención al cliente, nuestra
          herramienta puede ayudarte a crear el correo perfecto para atraer y
          deleitar a tus clientes.
        </p>
        <p className="text-lg text-base-content mb-4">
          Con nuestra interfaz fácil de usar, puedes crear rápidamente correos
          electrónicos que se adapten a las preferencias y necesidades de tus
          clientes. Simplemente ingresa información básica sobre tu cliente, y
          nuestro sistema generará una recomendación de correo personalizada
          para ti.
        </p>
        <p className="text-lg text-base-content mb-4">
          Comienza navegando a la página de generación de correos, donde puedes
          ingresar los detalles del cliente y generar tu primera recomendación
          de correo. Nuestra herramienta te ahorrará tiempo y te ayudará a
          construir relaciones más sólidas con tus clientes.
        </p>
        <p className="text-lg text-base-content mb-4">
          Para ver los metadatos, dirígete a la pestaña de configuración. Allí
          también puedes subir tu logo y añadir algunos prompts personalizados.
          Finalmente, puedes crear los correos electrónicos en la pestaña de
          correos.
        </p>
      </div>
    </div>
  );
}
