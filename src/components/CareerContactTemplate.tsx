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

interface CareerEmailProps {
  name: string;
  email: string;
  position: string;
  message: string;
}

export const CareerEmail = ({
  name,
  email,
  position,
  message,
}: CareerEmailProps) => (
  <Html>
    <Head />
    <Preview>
      Application for {position} from {name}
    </Preview>
    <Tailwind>
      <Body className="bg-gray-50 font-sans p-4">
        <Container className="bg-white border border-gray-200 rounded-lg shadow-sm mx-auto p-8 max-w-[600px]">
          <Heading className="text-blue-600 text-2xl font-bold mb-6">
            Career Application
          </Heading>
          <Section className="mb-4">
            <div className="mb-4">
              <Text className="text-gray-500 text-xs font-semibold uppercase m-0">
                Applicant:
              </Text>
              <Text className="text-gray-900 text-lg m-0 font-medium">
                {name}
              </Text>
              <Text className="text-gray-500 text-sm m-0 italic">{email}</Text>
            </div>

            <div className="mb-4">
              <Text className="text-gray-500 text-xs font-semibold uppercase m-0">
                Position:
              </Text>
              <Text className="text-gray-900 text-lg m-0">{position}</Text>
            </div>

            <Hr className="border-gray-200 my-6" />

            <Text className="text-gray-500 text-xs font-semibold uppercase mb-2">
              Cover Note:
            </Text>
            <Text className="text-gray-800 text-base leading-relaxed bg-gray-50 p-4 rounded">
              {message}
            </Text>

            <Hr className="border-gray-200 my-6" />

            <Text className="text-gray-400 text-xs italic">
              Note: The resume file is attached to this email as a PDF/Document.
            </Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);
