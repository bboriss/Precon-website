import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";

interface GeneralEmailProps {
  name: string;
  email: string;
  message: string;
}

export const GeneralEmail = ({ name, email, message }: GeneralEmailProps) => (
  <Html>
    <Head />
    <Preview>New message from {name}</Preview>
    <Tailwind>
      <Body className="bg-gray-100 font-sans my-auto mx-auto">
        <Container className="border border-solid border-gray-200 rounded my-10 mx-auto p-5 w-[465px] bg-white">
          <Heading className="text-black text-2xl font-bold p-0 my-8 mx-0">
            General Contact Form
          </Heading>
          <Section>
            <Text className="text-gray-400 text-xs font-bold uppercase mb-1">
              From:
            </Text>
            <Text className="text-gray-800 text-base mt-0">
              {name} ({email})
            </Text>
            <Hr className="border-gray-200 my-5" />
            <Text className="text-gray-400 text-xs font-bold uppercase mb-1">
              Message:
            </Text>
            <Text className="text-gray-800 text-base mt-0">{message}</Text>
          </Section>
          <Text className="text-gray-400 text-xs text-center mt-8">
            Sent from your portfolio website.
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);
