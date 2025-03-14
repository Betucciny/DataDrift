import { Section, Img, Text, Row, Column, Link } from "@react-email/components";

type FooterTemplateProps = {
  email: string;
  logoUrl?: string;
  companyName: string;
  slogan: string;
  website: string;
  whatsapp: string;
  facebook: string;
  address: string;
};

export default function FooterTemplate({
  email,
  logoUrl,
  companyName,
  slogan,
  website,
  whatsapp,
  facebook,
  address,
}: FooterTemplateProps) {
  return (
    <Section className="text-center">
      <table className="w-full">
        <tr className="w-full">
          <td align="center">
            <Img alt="React Email logo" height="42" src={logoUrl ?? ""} />
          </td>
        </tr>
        <tr className="w-full">
          <td align="center">
            <Text className="my-[8px] text-[16px] font-semibold leading-[24px] text-gray-900">
              {companyName}
            </Text>
            <Text className="mb-0 mt-[4px] text-[16px] leading-[24px] text-gray-500">
              {slogan}
            </Text>
          </td>
        </tr>
        <tr>
          <td align="center">
            <Row className="table-cell h-[44px] w-[56px] align-bottom">
              <Column className="pr-[8px]">
                <Link href={facebook}>
                  <Img
                    alt="Facebook"
                    height="36"
                    src="https://react.email/static/facebook-logo.png"
                    width="36"
                  />
                </Link>
              </Column>
              <Column className="pr-[8px]">
                <Link href={whatsapp}>
                  <Img
                    alt="Whatsapp"
                    height="36"
                    src="https://storage.betucciny.com/public/icons8-whatsapp-96.png"
                    width="36"
                  />
                </Link>
              </Column>
            </Row>
          </td>
        </tr>
        <tr>
          <td align="center">
            <Text className="my-[8px] text-[16px] font-semibold leading-[24px] text-gray-500">
              {address}
            </Text>
            <Text className="my-[8px] text-[16px] font-semibold leading-[24px] text-gray-500">
              {email}
            </Text>
            <Link href={website}>
              <Text className="mb-0 mt-[4px] text-[16px] font-semibold leading-[24px] text-gray-500">
                {website}
              </Text>
            </Link>
          </td>
        </tr>
      </table>
    </Section>
  );
}
