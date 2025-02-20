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
} from "@react-email/components";

type MainEmailProps = {
  userName: string;
  children: React.ReactNode;
};

export default function MainEmail({ userName, children }: MainEmailProps) {
  return (
    <Html>
      <Head />
      <Body>
        <Tailwind>
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Section className="mx-auto my-4 p-10 bg-white shadow-md">
              <Heading className="text-2xl font-bold text-gray-800">
                Welcome, {userName}!
              </Heading>
            </Section>
            {children}
          </Container>
        </Tailwind>
      </Body>
    </Html>
  );
}
