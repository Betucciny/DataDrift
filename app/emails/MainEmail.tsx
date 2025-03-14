import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Button,
  Section,
  Tailwind,
  Row,
  Column,
  Img,
} from "@react-email/components";
import { capitalizeFirstLetterOfEachWord } from "~/utils/strings";

type MainEmailProps = {
  logoUrl?: string;
  clientName?: string;
  introText?: string;
  children: React.ReactNode;
};

export default function MainEmail({
  logoUrl,
  children,
  clientName,
  introText,
}: MainEmailProps) {
  return (
    <Html>
      <Head />
      <Body>
        <Tailwind>
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px]">
            <Section className="px-[32px] py-[40px]">
              <Row>
                <Column>
                  <Img alt="Company Logo" height={100} src={logoUrl} />
                </Column>
                <Column>
                  <Text className="m-0 mt-[8px] text-[20px] font-semibold leading-[28px] text-gray-900">
                    Hola {capitalizeFirstLetterOfEachWord(clientName ?? "")}
                  </Text>
                </Column>
              </Row>
              <Row>{introText}</Row>
            </Section>
            {children}
          </Container>
        </Tailwind>
      </Body>
    </Html>
  );
}
