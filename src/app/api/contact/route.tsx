import { Resend } from "resend";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { ratelimit } from "@/utils/rateLimit";
import { getTranslations } from "next-intl/server";

import { CareerEmail } from "@/components/CareerContactTemplate";
import { GeneralEmail } from "@/components/GeneralContactTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const locale = req.headers.get("accept-language")?.split(",")[0] || "en";
  const t = await getTranslations({ locale, namespace: "contactModal.errors" });

  try {
    const headerList = await headers();
    const ip = headerList.get("x-forwarded-for") ?? "anonymous";

    const { success } = await ratelimit.limit(ip);

    if (!success) {
      return NextResponse.json(
        { error: t("tooManyRequests") },
        { status: 429 },
      );
    }

    const { email, name, message, type, cv } = await req.json();

    const title =
      type === "work"
        ? "New Message from Work Form"
        : "New Message from Career Form";

    const template =
      type === "career" ? (
        <CareerEmail
          name={name}
          email={email}
          position="N/A"
          message={message}
        />
      ) : (
        <GeneralEmail name={name} email={email} message={message} />
      );

    const attachments = [];
    if (type === "career" && cv) {
      const base64Content = cv.split(";base64,").pop();
      attachments.push({
        filename: "CV.pdf",
        content: Buffer.from(base64Content, "base64"),
      });
    }

    const { data, error } = await resend.emails.send({
      from: `${title} <info@precondesign.rs>`,
      to: [process.env.CONTACT_EMAIL!],
      subject: `New Message from ${name}`,
      replyTo: email,
      text: message,
      react: template,
      attachments,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
