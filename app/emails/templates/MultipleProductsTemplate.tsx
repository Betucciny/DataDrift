import {
  Container,
  Text,
  Button,
  Section,
  Tailwind,
  Row,
  Column,
  Img,
  Hr,
} from "@react-email/components";

type MultipleProductsTemplateProps = {
  products: {
    name: string;
    price: number;
    url: string;
    text: string;
  }[];
};

export default function MultipleProductsTemplate({
  products,
}: MultipleProductsTemplateProps) {
  return (
    <Section className="my-[16px]">
      <table className="w-full">
        <tbody className="w-full">
          {products.map((product, index) => (
            <>
              {index === 0 && (
                <tr>
                  <td colSpan={2}>
                    <Hr className="my-[16px] border-t-2 border-gray-300" />
                  </td>
                </tr>
              )}
              <tr className="w-full">
                <td className="box-border w-1/2 pr-[32px]">
                  <Img
                    alt="Braun Vintage"
                    className="w-full rounded-[8px] object-cover"
                    height={220}
                    src={product.url}
                  />
                </td>
                <td className="w-1/2 align-baseline">
                  <Text className="m-0 mt-[8px] text-[20px] font-semibold leading-[28px] text-gray-900">
                    {product.name}
                  </Text>
                  <Text className="mt-[8px] text-[16px] leading-[24px] text-gray-500">
                    {product.text}
                  </Text>
                  <Text className="mt-[8px] text-[18px] font-semibold leading-[28px] text-gray-900">
                    ${product.price.toFixed(2)}
                  </Text>
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <Hr className="my-[16px] border-t-2 border-gray-300" />
                </td>
              </tr>
            </>
          ))}
        </tbody>
      </table>
    </Section>
  );
}
