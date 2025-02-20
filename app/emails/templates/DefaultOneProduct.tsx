// SingleProductPromotion.jsx
import React from "react";
import {
  Html,
  Head,
  Preview,
  Section,
  Text,
  Img,
  Button,
} from "@react-email/components";

type DefaultOneProductProps = {
  product?: {
    name: string;
    description: string;
    imageUrl: string;
    link: string;
  };
};

const mockProduct = {
  name: "Product Name",
  description: "Product Description",
  imageUrl: "https://via.placeholder.com/600x400",
  link: "#",
};

export default function DefaultOneProduct({
  product = mockProduct,
}: DefaultOneProductProps) {
  return (
    <Section className="bg-white p-5">
      <Img
        src={product.imageUrl}
        alt={product.name}
        className="w-full h-auto"
      />
      <Text className="text-2xl font-bold">{product.name}</Text>
      <Text className="text-lg my-2">{product.description}</Text>
      <Button
        href={product.link}
        className="bg-blue-500 text-white py-2 px-4 no-underline"
      >
        Buy Now
      </Button>
    </Section>
  );
}
