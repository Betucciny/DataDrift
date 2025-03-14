import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import type { ResponseMetadata } from "~/types";

type MetadataProps = {
  metadata: ResponseMetadata;
};

const numFactorsData = [
  { name: "20", value: 20 },
  { name: "50", value: 50 },
  { name: "100", value: 100 },
  { name: "200", value: 200 },
];

const regularizationData = [
  { name: "0.01", value: 0.01 },
  { name: "0.1", value: 0.1 },
];

const confidenceMultiplierData = [
  { name: "20.0", value: 20.0 },
  { name: "40.0", value: 40.0 },
  { name: "60.0", value: 60.0 },
];

const COLORS = ["#0088FE", "#FF8042"];

export default function Metadata({ metadata }: MetadataProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const eprData = [
    { name: "Buenas Recomendaciones", value: 1 - metadata.epr },
    { name: "Otras Recomendaciones", value: metadata.epr },
  ];

  if (!isClient) {
    return null;
  }

  return (
    <div className="p-2">
      <h2 className="text-2xl font-bold mb-4">Metadatos del modelo</h2>
      <div className="flex flex-wrap justify-around items-start">
        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-2">Número de Factores</h3>
          <BarChart width={300} height={280} data={numFactorsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 200]} />
            <Tooltip />
            <Bar
              name="Valor Real"
              dataKey="value"
              data={[{ name: "Valor Real", value: metadata.num_factors }]}
              fill="#ff7300"
            />
          </BarChart>
        </div>

        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-2">Regularización</h3>
          <BarChart width={300} height={280} data={regularizationData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 0.1]} />
            <Tooltip />
            <Bar
              name="Valor Real"
              dataKey="value"
              data={[{ name: "Valor Real", value: metadata.regularization }]}
              fill="#82ca9d"
            />
          </BarChart>
        </div>

        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-2">
            Multiplicador de Confianza
          </h3>
          <BarChart width={300} height={280} data={confidenceMultiplierData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 60]} interval={0} />
            <Tooltip />
            <Bar
              name="Valor Real"
              dataKey="value"
              data={[
                { name: "Valor Real", value: metadata.confidence_multiplier },
              ]}
              fill="#4CAF50"
            />
          </BarChart>
        </div>

        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-2">
            EPR (Rango Percentil Esperado)
          </h3>
          <PieChart
            width={300}
            height={200}
            margin={{ top: 5, right: 5, bottom: -50, left: 5 }}
          >
            <Pie
              data={eprData}
              cx={150}
              cy={100}
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {eprData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend
              verticalAlign="bottom"
              align="center"
              margin={{ top: 30, left: 0, right: 0, bottom: -30 }}
            />
          </PieChart>
        </div>
      </div>
    </div>
  );
}
